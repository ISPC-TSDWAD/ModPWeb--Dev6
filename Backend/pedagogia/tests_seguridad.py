"""
Pruebas de seguridad del modulo de Pedagogia (Sprint 2).

Cubren tres agujeros que encontramos revisando el codigo:
  1. Un asesor podia ascender su copia a plantilla base institucional.
  2. Cualquier usuario podia crear o borrar categorias y asignaturas.
  3. Borrar una categoria en uso devolvia un 500 en vez de un error claro.
Y la validacion del HTML del recurso (politica PSM-07).
"""

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Asignatura, Categoria, Recurso

User = get_user_model()


class BaseSeguridadTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.asesor = User.objects.create_user(
            username='asesor_seg', email='asesor_seg@test.com',
            password='Password123!', rol='asesor')
        self.maquetador = User.objects.create_user(
            username='maquetador_seg', email='maq_seg@test.com',
            password='Password123!', rol='maquetador')
        self.categoria = Categoria.objects.create(nombre='Categoria Seguridad')
        self.asignatura = Asignatura.objects.create(nombre='Asignatura Seguridad')

    def recurso_del_asesor(self, **extra):
        datos = dict(
            titulo='Mi copia', categoria=self.categoria, asignatura=self.asignatura,
            creado_por=self.asesor, es_plantilla_base=False)
        datos.update(extra)
        return Recurso.objects.create(**datos)


class EscaladaDePrivilegiosTests(BaseSeguridadTests):
    """El asesor no puede convertir su recurso en plantilla institucional."""

    def test_asesor_no_puede_marcar_su_recurso_como_plantilla(self):
        recurso = self.recurso_del_asesor()
        self.client.force_authenticate(user=self.asesor)

        respuesta = self.client.patch(
            f'/api/pedagogia/recursos/{recurso.id}/',
            {'titulo': 'Mi copia editada', 'es_plantilla_base': True},
            format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        recurso.refresh_from_db()
        self.assertEqual(recurso.titulo, 'Mi copia editada')   # lo suyo si cambia
        self.assertFalse(recurso.es_plantilla_base)            # el privilegio no

    def test_asesor_no_puede_falsear_de_que_plantilla_es_copia(self):
        plantilla = Recurso.objects.create(
            titulo='Plantilla institucional', categoria=self.categoria,
            asignatura=self.asignatura, creado_por=self.maquetador,
            es_plantilla_base=True)
        recurso = self.recurso_del_asesor()
        self.client.force_authenticate(user=self.asesor)

        self.client.patch(f'/api/pedagogia/recursos/{recurso.id}/',
                          {'copia_de': plantilla.id}, format='json')

        recurso.refresh_from_db()
        self.assertIsNone(recurso.copia_de)

    def test_asesor_no_puede_usar_set_plantilla(self):
        recurso = self.recurso_del_asesor()
        self.client.force_authenticate(user=self.asesor)

        respuesta = self.client.post(
            f'/api/pedagogia/recursos/{recurso.id}/set-plantilla/',
            {'es_plantilla_base': True}, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_403_FORBIDDEN)
        recurso.refresh_from_db()
        self.assertFalse(recurso.es_plantilla_base)

    def test_maquetador_si_puede_marcar_una_plantilla(self):
        recurso = self.recurso_del_asesor()
        self.client.force_authenticate(user=self.maquetador)

        respuesta = self.client.post(
            f'/api/pedagogia/recursos/{recurso.id}/set-plantilla/',
            {'es_plantilla_base': True}, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        recurso.refresh_from_db()
        self.assertTrue(recurso.es_plantilla_base)

    def test_el_asesor_sigue_recibiendo_su_copia_al_editar_una_plantilla(self):
        """La regla de negocio no se rompe con los campos de solo lectura."""
        plantilla = Recurso.objects.create(
            titulo='Acordeon institucional', categoria=self.categoria,
            asignatura=self.asignatura, creado_por=self.maquetador,
            es_plantilla_base=True, contenido='<p>base</p>')
        self.client.force_authenticate(user=self.asesor)

        respuesta = self.client.put(
            f'/api/pedagogia/recursos/{plantilla.id}/',
            {'titulo': 'Acordeon institucional', 'categoria': self.categoria.id,
             'asignatura': self.asignatura.id, 'contenido': '<p>mi version</p>'},
            format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        copia = Recurso.objects.get(id=respuesta.data['id'])
        self.assertEqual(copia.creado_por, self.asesor)
        self.assertEqual(copia.copia_de, plantilla)
        self.assertFalse(copia.es_plantilla_base)
        self.assertEqual(copia.contenido, '<p>mi version</p>')
        plantilla.refresh_from_db()
        self.assertEqual(plantilla.contenido, '<p>base</p>')   # la base no se toca


class CatalogosTests(BaseSeguridadTests):
    """Categorias y asignaturas: las lee cualquiera, las cambia el equipo."""

    def test_asesor_no_puede_crear_categoria(self):
        self.client.force_authenticate(user=self.asesor)
        respuesta = self.client.post('/api/pedagogia/categorias/',
                                     {'nombre': 'Inventada'}, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(Categoria.objects.filter(nombre='Inventada').exists())

    def test_asesor_no_puede_borrar_categoria(self):
        self.client.force_authenticate(user=self.asesor)
        respuesta = self.client.delete(f'/api/pedagogia/categorias/{self.categoria.id}/')
        self.assertEqual(respuesta.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Categoria.objects.filter(id=self.categoria.id).exists())

    def test_asesor_si_puede_listar_categorias(self):
        self.client.force_authenticate(user=self.asesor)
        respuesta = self.client.get('/api/pedagogia/categorias/')
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)

    def test_maquetador_puede_crear_categoria(self):
        self.client.force_authenticate(user=self.maquetador)
        respuesta = self.client.post('/api/pedagogia/categorias/',
                                     {'nombre': 'Componentes visuales'}, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)

    def test_borrar_categoria_en_uso_devuelve_409_y_no_500(self):
        self.recurso_del_asesor()
        self.client.force_authenticate(user=self.maquetador)
        respuesta = self.client.delete(f'/api/pedagogia/categorias/{self.categoria.id}/')
        self.assertEqual(respuesta.status_code, status.HTTP_409_CONFLICT)
        self.assertTrue(Categoria.objects.filter(id=self.categoria.id).exists())


class ContenidoTests(BaseSeguridadTests):
    """El HTML del recurso no puede traer scripts (politica PSM-07)."""

    def test_rechaza_script_en_el_contenido(self):
        self.client.force_authenticate(user=self.asesor)
        respuesta = self.client.post('/api/pedagogia/recursos/', {
            'titulo': 'Recurso con script', 'categoria': self.categoria.id,
            'asignatura': self.asignatura.id, 'tipo': 'lectura',
            'contenido': '<p>hola</p><script>fetch("/api/users/")</script>',
        }, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('contenido', respuesta.data)

    def test_rechaza_atributo_de_evento(self):
        self.client.force_authenticate(user=self.asesor)
        respuesta = self.client.post('/api/pedagogia/recursos/', {
            'titulo': 'Recurso con onerror', 'categoria': self.categoria.id,
            'asignatura': self.asignatura.id, 'tipo': 'lectura',
            'contenido': '<img src=x onerror="alert(1)">',
        }, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rechaza_script_tambien_al_copiar_una_plantilla(self):
        plantilla = Recurso.objects.create(
            titulo='Plantilla base', categoria=self.categoria,
            asignatura=self.asignatura, creado_por=self.maquetador,
            es_plantilla_base=True, contenido='<p>base</p>')
        self.client.force_authenticate(user=self.asesor)

        respuesta = self.client.put(f'/api/pedagogia/recursos/{plantilla.id}/', {
            'titulo': 'Plantilla base', 'categoria': self.categoria.id,
            'asignatura': self.asignatura.id,
            'contenido': '<script>alert(1)</script>',
        }, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Recurso.objects.filter(copia_de=plantilla).count(), 0)

    def test_acepta_html_normal(self):
        self.client.force_authenticate(user=self.asesor)
        respuesta = self.client.post('/api/pedagogia/recursos/', {
            'titulo': 'Acordeon de cinco pasos', 'categoria': self.categoria.id,
            'asignatura': self.asignatura.id, 'tipo': 'acordeon',
            'contenido': '<details><summary>Paso 1</summary><p>Texto</p></details>',
        }, format='json')
        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)


class LimiteDeLoginTests(TestCase):
    """Fuerza bruta sobre el login: a partir del limite responde 429 (PSM-08)."""

    def setUp(self):
        cache.clear()
        self.client = APIClient()
        User.objects.create_user(username='victima', email='v@test.com',
                                 password='Password123!', rol='asesor')

    def tearDown(self):
        cache.clear()

    def test_despues_de_varios_intentos_fallidos_responde_429(self):
        codigos = []
        for _ in range(12):
            respuesta = self.client.post('/api/token/',
                                         {'username': 'victima', 'password': 'malmalmal'},
                                         format='json')
            codigos.append(respuesta.status_code)
        self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, codigos)
        self.assertEqual(codigos[0], status.HTTP_401_UNAUTHORIZED)

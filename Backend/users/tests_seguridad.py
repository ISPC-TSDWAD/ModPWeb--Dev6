"""
Pruebas de seguridad:
  #18  is_staff / rol / is_active solo lectura
  #19  rol e is_staff dentro del token
  logs: login fallido, acceso denegado, cambio de rol
Se corren con: python manage.py test users
"""
import logging

import jwt
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()

CLAVE_TEST = 'Clave-De-Prueba-9x!'


class BaseSeguridad(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='adm_test', password=CLAVE_TEST, rol='admin', is_staff=True)
        self.asesor = User.objects.create_user(
            username='ase_test', password=CLAVE_TEST, rol='asesor')
        self.otro = User.objects.create_user(
            username='otro_test', password=CLAVE_TEST, rol='maquetador')

    def token_de(self, username):
        resp = self.client.post('/api/token/', {'username': username, 'password': CLAVE_TEST}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        return resp.json()


class EscaladaDePrivilegiosTests(BaseSeguridad):
    """#18: un usuario común no puede hacerse admin con un PATCH."""

    def test_patch_propio_no_cambia_is_staff_rol_ni_is_active(self):
        self.client.force_authenticate(user=self.asesor)
        resp = self.client.patch(
            f'/api/users/{self.asesor.id}/',
            {'is_staff': True, 'rol': 'admin', 'is_active': False, 'first_name': 'Nuevo'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.json()['first_name'], 'Nuevo')   # el nombre sí cambia
        self.assertFalse(resp.json()['is_staff'])
        self.assertEqual(resp.json()['rol'], 'asesor')
        self.assertTrue(resp.json()['is_active'])
        self.asesor.refresh_from_db()
        self.assertFalse(self.asesor.is_staff)
        self.assertEqual(self.asesor.rol, 'asesor')
        self.assertTrue(self.asesor.is_active)

    def test_put_tampoco_cambia_los_campos_protegidos(self):
        self.client.force_authenticate(user=self.asesor)
        resp = self.client.put(
            f'/api/users/{self.asesor.id}/',
            {'username': 'ase_test', 'is_staff': True, 'rol': 'admin'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.asesor.refresh_from_db()
        self.assertFalse(self.asesor.is_staff)
        self.assertEqual(self.asesor.rol, 'asesor')

    def test_usuario_no_puede_editar_a_otro(self):
        self.client.force_authenticate(user=self.asesor)
        resp = self.client.patch(f'/api/users/{self.otro.id}/', {'rol': 'admin'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_crea_usuario_pero_no_puede_darle_rol_por_el_alta(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post(
            '/api/users/',
            {'username': 'nuevo', 'password': CLAVE_TEST, 'rol': 'admin', 'is_staff': True},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        nuevo = User.objects.get(username='nuevo')
        self.assertEqual(nuevo.rol, 'asesor')      # rol por defecto
        self.assertFalse(nuevo.is_staff)

    def test_set_role_solo_admin(self):
        self.client.force_authenticate(user=self.asesor)
        resp = self.client.post(f'/api/users/{self.otro.id}/set-role/', {'rol': 'admin'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.otro.refresh_from_db()
        self.assertEqual(self.otro.rol, 'maquetador')

    def test_asesor_no_puede_cambiarse_el_rol_a_si_mismo(self):
        self.client.force_authenticate(user=self.asesor)
        resp = self.client.post(f'/api/users/{self.asesor.id}/set-role/', {'rol': 'admin'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.asesor.refresh_from_db()
        self.assertEqual(self.asesor.rol, 'asesor')
        self.assertFalse(self.asesor.is_staff)

    def test_set_role_admin_cambia_rol_e_is_staff(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post(f'/api/users/{self.otro.id}/set-role/', {'rol': 'admin'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.otro.refresh_from_db()
        self.assertEqual(self.otro.rol, 'admin')
        self.assertTrue(self.otro.is_staff)
        resp = self.client.post(f'/api/users/{self.otro.id}/set-role/', {'rol': 'asesor'}, format='json')
        self.otro.refresh_from_db()
        self.assertEqual(self.otro.rol, 'asesor')
        self.assertFalse(self.otro.is_staff)

    def test_set_role_rechaza_rol_inexistente_como_docente(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post(f'/api/users/{self.otro.id}/set-role/', {'rol': 'docente'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_no_puede_quitarse_su_propio_rol(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post(f'/api/users/{self.admin.id}/set-role/', {'rol': 'asesor'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_se_puede_cambiar_el_rol_de_un_superusuario(self):
        su = User.objects.create_superuser(username='su_test', password=CLAVE_TEST)
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post(f'/api/users/{su.id}/set-role/', {'rol': 'asesor'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)


class ClaimsJwtTests(BaseSeguridad):
    """#19: el token lleva is_staff y rol."""

    def claims(self, access):
        # En el test solo leo el contenido; el servidor sí revisa la firma.
        return jwt.decode(access, options={'verify_signature': False})

    def test_access_token_lleva_rol_y_is_staff_de_asesor(self):
        datos = self.token_de('ase_test')
        claims = self.claims(datos['access'])
        self.assertEqual(claims['rol'], 'asesor')
        self.assertIs(claims['is_staff'], False)

    def test_access_token_lleva_rol_y_is_staff_de_admin(self):
        claims = self.claims(self.token_de('adm_test')['access'])
        self.assertEqual(claims['rol'], 'admin')
        self.assertIs(claims['is_staff'], True)

    def test_superusuario_siempre_es_admin_en_el_token(self):
        User.objects.create_superuser(username='su2', password=CLAVE_TEST)
        claims = self.claims(self.token_de('su2')['access'])
        self.assertEqual(claims['rol'], 'admin')

    def test_el_cuerpo_de_la_respuesta_mantiene_rol_e_is_staff(self):
        datos = self.token_de('ase_test')
        self.assertEqual(datos['rol'], 'asesor')
        self.assertIs(datos['is_staff'], False)

    def test_token_con_claims_alterados_es_rechazado(self):
        access = self.token_de('ase_test')['access']
        falso = jwt.encode({**self.claims(access), 'rol': 'admin', 'is_staff': True},
                           'otra-clave-falsa-distinta-0123456789', algorithm='HS256')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {falso}')
        resp = self.client.get('/api/users/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class LogsDeSeguridadTests(BaseSeguridad):
    def texto(self, cm):
        return '\n'.join(cm.output)

    def test_login_fallido_se_registra_sin_la_contrasena(self):
        with self.assertLogs('security', level=logging.INFO) as cm:
            resp = self.client.post('/api/token/', {'username': 'ase_test', 'password': 'ContraseñaIncorrecta77'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        salida = self.texto(cm)
        self.assertIn('action=LOGIN_FAILED', salida)
        self.assertIn('user=ase_test', salida)
        self.assertIn('resource=/api/token/', salida)
        self.assertIn('result=fallido', salida)
        self.assertNotIn('ContraseñaIncorrecta77', salida)

    def test_login_exitoso_se_registra_sin_tokens_ni_contrasena(self):
        with self.assertLogs('security', level=logging.INFO) as cm:
            datos = self.token_de('ase_test')
        salida = self.texto(cm)
        self.assertIn('action=LOGIN', salida)
        self.assertNotIn(CLAVE_TEST, salida)
        self.assertNotIn(datos['access'], salida)
        self.assertNotIn(datos['refresh'], salida)

    def test_acceso_denegado_403_se_registra(self):
        self.client.force_authenticate(user=self.asesor)
        with self.assertLogs('security', level=logging.INFO) as cm:
            resp = self.client.get('/api/users/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        salida = self.texto(cm)
        self.assertIn('action=ACCESS_DENIED', salida)
        self.assertIn('user=ase_test', salida)
        self.assertIn('resource=GET /api/users/', salida)

    def test_acceso_sin_token_401_se_registra_como_anonimo(self):
        with self.assertLogs('security', level=logging.INFO) as cm:
            resp = self.client.get('/api/users/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('user=anonimo', self.texto(cm))

    def test_cambio_de_rol_se_registra_con_quien_lo_hizo_y_a_quien(self):
        self.client.force_authenticate(user=self.admin)
        with self.assertLogs('security', level=logging.INFO) as cm:
            self.client.post(f'/api/users/{self.otro.id}/set-role/', {'rol': 'asesor'}, format='json')
        salida = self.texto(cm)
        self.assertIn('action=ROLE_CHANGE', salida)
        self.assertIn('user=adm_test', salida)
        self.assertIn('resource=usuario:otro_test', salida)
        self.assertIn('maquetador -> asesor', salida)

    def test_un_nombre_de_usuario_con_saltos_de_linea_no_inyecta_lineas_falsas(self):
        with self.assertLogs('security', level=logging.INFO) as cm:
            self.client.post('/api/token/', {'username': 'x\nfake | action=ROLE_CHANGE', 'password': 'a'}, format='json')
        for linea in cm.output:
            self.assertNotIn('\n', linea)

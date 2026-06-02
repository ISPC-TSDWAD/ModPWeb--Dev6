from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Categoria, Asignatura, Recurso

User = get_user_model()

class RecursoViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='author_test',
            email='author@test.com',
            password='Password123!',
            rol='asesor'
        )
        self.categoria = Categoria.objects.create(nombre='Test Categoria')
        self.asignatura = Asignatura.objects.create(nombre='Test Asignatura')

    def test_create_recurso_automatically_assigns_user(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'titulo': 'Nuevo Recurso de Test',
            'categoria': self.categoria.id,
            'asignatura': self.asignatura.id,
            'contenido': '<p>Hola</p>',
            'tipo': 'video'
        }
        response = self.client.post('/api/pedagogia/recursos/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verificar en base de datos
        recurso = Recurso.objects.get(id=response.data['id'])
        self.assertEqual(recurso.creado_por, self.user)
        self.assertEqual(recurso.titulo, 'Nuevo Recurso de Test')

    def test_list_recursos(self):
        Recurso.objects.create(
            titulo='Recurso 1',
            categoria=self.categoria,
            asignatura=self.asignatura,
            creado_por=self.user
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/pedagogia/recursos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], 'Recurso 1')

    def test_unauthenticated_cannot_access_recursos(self):
        response = self.client.get('/api/pedagogia/recursos/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

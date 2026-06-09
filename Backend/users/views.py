from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Usuario
from .serializers import UsuarioSerializer, CustomTokenObtainPairSerializer
from .permissions import IsAdminOrOwner
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminOrOwner]

class ContactAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        nombre = request.data.get('nombre')
        email = request.data.get('email')
        mensaje = request.data.get('mensaje')

        if not nombre or not email or not mensaje:
            return Response({'error': 'Todos los campos son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)

        asunto = f'Nuevo mensaje de contacto de {nombre}'
        cuerpo_mensaje = f'Nombre: {nombre}\nCorreo: {email}\n\nMensaje:\n{mensaje}'

        try:
            send_mail(
                asunto,
                cuerpo_mensaje,
                settings.EMAIL_HOST_USER,
                ['tecnologia.sied@ucc.edu.ar'],
                fail_silently=False,
            )
            return Response({'mensaje': 'Mensaje enviado correctamente.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

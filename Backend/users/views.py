from rest_framework import viewsets, permissions
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

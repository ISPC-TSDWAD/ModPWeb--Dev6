from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView # <--- Esto tiene que estar sí o sí
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls), # <--- Asegurate que diga .urls
    path('api/users/', include('users.urls')),
    path('api/pedagogia/', include('pedagogia.urls')),
    
    # Rutas de Autenticación JWT
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Redireccion de prueba
    path('', RedirectView.as_view(url='/api/pedagogia/recursos/'), name='index'),
]
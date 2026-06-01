from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView # <--- Esto tiene que estar sí o sí

urlpatterns = [
    path('admin/', admin.site.urls), # <--- Asegurate que diga .urls
    path('api/users/', include('users.urls')),
    path('api/pedagogia/', include('pedagogia.urls')),
    
    # Redireccion de prueba
    path('', RedirectView.as_view(url='/api/pedagogia/recursos/'), name='index'),
]
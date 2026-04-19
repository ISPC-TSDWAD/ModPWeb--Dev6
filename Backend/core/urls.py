from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView # <--- Esto tiene que estar sí o sí

urlpatterns = [
    path('admin/', admin.site.urls), # <--- Asegurate que diga .urls
    path('api/', include('api.urls')),
    
    # Esta línea hace que al entrar a http://127.0.0.1:8000/ 
    # te mande directo a la API sin errores
    path('', RedirectView.as_view(url='/api/test/'), name='index'),
]
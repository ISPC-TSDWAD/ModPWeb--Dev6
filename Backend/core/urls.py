from django.contrib import admin
from django.urls import path, include  # <-- Asegurate de que esté 'include' acá

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # <-- Agregá esta línea
]
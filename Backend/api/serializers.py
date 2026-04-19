from rest_framework import serializers
from .models import TestConexion

class TestConexionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestConexion
        fields = '__all__'
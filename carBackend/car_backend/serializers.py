from rest_framework import serializers
from .models import Car, Brand, Model, State, City

class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = '__all__'

class ModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Model
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):

    class Meta:
        model = State
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        fields = '__all__'

class CarSerializer(serializers.ModelSerializer):
    city = CitySerializer()
    state = StateSerializer()
    brand = BrandSerializer()
    model = ModelSerializer()
    
    class Meta:
        model = Car
        fields = '__all__'

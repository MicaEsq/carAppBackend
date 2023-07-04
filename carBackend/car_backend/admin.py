from django.contrib import admin
from .models import State, City, Car, Brand, Model


# Register your models here.
admin.site.register(State),
admin.site.register(City),
admin.site.register(Brand),
admin.site.register(Model),
admin.site.register(Car)
from django.urls import path
from . import views

urlpatterns = [
    path('cars/all/', views.get_cars, name='get_cars'),
    path('cars/create/', views.create_car, name='create_car'),
    path('cars/<int:pk>/', views.get_car, name='get_car'),
    path('cars/modify/<int:pk>/', views.update_car, name='update_car'),
    path('cars/delete/<int:pk>/', views.delete_car, name='delete_car'),
    path('state/all/', views.get_states, name='get_states'),
    path('state/create/', views.create_states, name='create_states'),
    path('brand/all/', views.get_brands, name='get_brands'),
    path('brand/create/', views.create_brand, name='create_brand'),
    path('model/all/', views.get_models, name='get_models'),
    path('model/create/', views.create_model, name='create_model'),
    path('city/all/', views.get_cities, name='get_cities'),
    path('city/create/', views.create_city, name='create_city'),
    path('filters/', views.get_filters, name='get_filters'),
]
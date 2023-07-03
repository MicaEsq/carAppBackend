from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .serializers import CarSerializer
from .models import State, City, Car, Brand, Model

def create_car(request):
    if request.method == 'POST':
        city = request.POST.get('city')
        state = request.POST.get('state')
        year = request.POST.get('year')
        brand = request.POST.get('brand')
        model = request.POST.get('model')
        version = request.POST.get('version')
        transmission = request.POST.get('transmission')
        condition = request.POST.get('condition')
        price = request.POST.get('price')
        mileage = request.POST.get('mileage')
        image = request.POST.get('image')
        promoted = request.POST.get('promoted')
        financing = request.POST.get('financing')
        color = request.POST.get('color')
        fuel = request.POST.get('fuel')
        observation = request.POST.get('observation')


        city = get_object_or_404(City, pk=city)
        state = get_object_or_404(State, pk=state)
        brand = get_object_or_404(Brand, pk=brand)
        model = get_object_or_404(Model, pk=model)

        car = Car(
            city=city,
            state=state,
            year=year,
            brand=brand,
            model=model,
            version=version,
            transmission=transmission,
            condition=condition,
            price=price,
            mileage=mileage,
            image=image,
            promoted=promoted,
            financing=financing,
            color = color,
            fuel = fuel,
            observation = observation
        )
        car.save()

        return JsonResponse({'message': 'Car created successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})


def get_cars(request):
    if request.method == 'GET':
        cars = Car.objects.values(
            'id',
            'city',
            'state',
            'year',
            'brand',
            'model',
            'version',
            'transmission',
            'condition',
            'price',
            'mileage',
            'image',
            'promoted',
            'financing',
            'color',
            'fuel',
            'observation'
        )

        return JsonResponse(list(cars), safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'})
    
def get_car(request, pk):
    if request.method == 'GET':
        car = get_object_or_404(Car, id=pk)
        serializer = CarSerializer(car)
        print(serializer.data)
        return JsonResponse(serializer.data)
    else:
        return JsonResponse({'message': 'Invalid request method'})
    
def update_car(request, car_id):
    if request.method == 'PUT':
        car = get_object_or_404(Car, id=car_id)

        modified_data = request.POST

        for field, value in modified_data.items():
            setattr(car, field, value)

        car.save()

        serializer = CarSerializer(car)
        return JsonResponse(serializer.data)
    else:
        return JsonResponse({'message': 'Invalid request method'})


def delete_car(request,pk):
    if request.method == 'DELETE':
        car = get_object_or_404(Car, pk=pk)
        car.delete()
        return JsonResponse({'message': 'Car with id request method'})
    else:
        return JsonResponse({'message': 'Invalid request method'})


def get_states(request):
    if request.method == 'GET':
        print('entro ok')
        states = State.objects.values(
            'id',
            'name',
        )

        return JsonResponse(list(states), safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'})

def create_states(request):
     
    if request.method == 'POST':
        name = request.POST.get('name')

        state = get_object_or_404(State, pk=state)

        state = State(
            name = name,
        )
        state.save()

        return JsonResponse({'message': 'State created successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})
    

def get_brands(request):
    if request.method == 'GET':
        print('entro ok')
        brands = Brand.objects.values(
            'id',
            'name',
        )
        print(list(brands))
        return JsonResponse(list(brands), safe=False)
        
    else:
        return JsonResponse({'message': 'Invalid request method'})

def create_brand(request):
     
    if request.method == 'POST':
        name = request.POST.get('name')

        brand = Brand(
            name = name,
        )
        brand.save()

        return JsonResponse({'message': 'Brand created successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})

def get_models(request):
    if request.method == 'GET':
        print('entro ok')
        models = Model.objects.values(
            'id',
            'name',
            'brand'
        )

        return JsonResponse(list(models), safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'})

def create_model(request):
     
    if request.method == 'POST':
        name = request.POST.get('name')
        brand = request.POST.get('brand')

        model = get_object_or_404(Model, pk=brand)

        model = Model(
            name = name,
            brand = brand,
        )
        model.save()

        return JsonResponse({'message': 'Model created successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'}) 

    
def get_cities(request):
    if request.method == 'GET':
        print('entro ok')
        cities = City.objects.values(
            'id',
            'name',
            'state',
        )

        return JsonResponse(list(cities), safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'})

def create_city(request):
     
    if request.method == 'POST':
        name = request.POST.get('name')
        state = request.POST.get('state')

        city = get_object_or_404(State, pk=state)

        city = City(
            name = name,
            state = state,
        )
        city.save()

        return JsonResponse({'message': 'City created successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})
    
def get_filters(request):
    if request.method == 'GET':
        typeFilter = request.GET.get('type')
        primary_filter = request.GET.get('primaryFilter')

        if primary_filter == '':
            if typeFilter == 'brands':
                filters = Brand.objects.all().values('id', 'name')
            elif typeFilter == 'models':
                filters = Model.objects.all().values('id', 'name')
            elif typeFilter == 'states':
                filters = State.objects.all().values('id', 'name')
            elif typeFilter == 'cities':
                filters = City.objects.all().values('id', 'name')
        elif type == 'brands':
            filters = Model.objects.filter(brand_id=primary_filter).values('id', 'name')
        elif type == 'models':
            filters = Model.objects.filter(brand__id=primary_filter).values('id', 'name')
        elif type == 'states':
            filters = City.objects.filter(state_id=primary_filter).values('id', 'name')
        elif type == 'cities':
            filters = City.objects.filter(state__id=primary_filter).values('id', 'name')
        else:
            filters = []

        return JsonResponse(list(filters), safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'})
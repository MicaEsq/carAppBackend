import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db.models import F, Q
from .serializers import CarSerializer
from .models import State, City, Car, Brand, Model
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User



def create_car(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        city = get_object_or_404(City, pk=data['city_id'])
        state = get_object_or_404(State, pk=data['state_id'])
        brand = get_object_or_404(Brand, pk=data['brand_id'])
        model = get_object_or_404(Model, pk=data['model_id'])

        car = Car(
            city=city,
            state=state,
            year=data['year'],
            brand=brand,
            model=model,
            version=data['version'],
            transmission=data['transmission'],
            condition=data['condition'],
            price=data['price'],
            mileage=data['mileage'],
            image= 'car.jpg',
            promoted=data['promoted'],
            financing=data['financing'],
            color = data['color'],
            fuel = data['fuel'],
            capacity = data['capacity'],
            observation = data['observation']
        )
        car.save()
        
        return JsonResponse({'id': car.id})
    else:
        return JsonResponse({'message': 'Invalid request method'})

def get_cars(request):
    if request.method == 'GET':
        filter_values = {
                'brands': request.GET.get('brands'),
                'models': request.GET.get('models'),
                'year': request.GET.get('year'),
                'states': request.GET.get('states'),
                'cities': request.GET.get('cities'),
                'transmission': request.GET.get('transmission'),
                'price': request.GET.get('price'),
                'mileage': request.GET.get('mileage')
        }

        if(any(filter_values.values())):

            filters_query = Q()
            query = []

            if filter_values['brands']:
                query.append(Q(brand_id=filter_values['brands']))
            if filter_values['models']:
                query.append(Q(model_id=filter_values['models']))
            if filter_values['year']:
                query.append(Q(year=filter_values['year']))
            if filter_values['states']:
                query.append(Q(state_id=filter_values['states']))
            if filter_values['cities']:
                query.append(Q(city_id=filter_values['cities']))
            if filter_values['transmission']:
                query.append(Q(transmission=filter_values['transmission']))
            if filter_values['price']:
                query.append(Q(price=filter_values['price']))
            if filter_values['mileage']:
                query.append(Q(mileage=filter_values['mileage']))

            for i, q in enumerate(query):
                if i == 0:
                    filters_query = q
                else:
                    filters_query &= q

            cars = Car.objects.filter(filters_query)

            serializer = CarSerializer(cars, many=True)
            return JsonResponse(serializer.data, safe=False)
        else:
            cars = Car.objects.all()
            serializer = CarSerializer(cars, many=True)
            return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'})

def get_car(request, pk):
    if request.method == 'GET':
        car = get_object_or_404(Car, id=pk)
        serializer = CarSerializer(car)

        return JsonResponse(serializer.data)
    else:
        return JsonResponse({'message': 'Invalid request method'})
    
def update_car(request, pk):
    if request.method == 'PUT':
        car = get_object_or_404(Car, id=pk)
        modified_data = json.loads(request.body)

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

        state = State(
            name = name,
        )
        state.save()

        return JsonResponse({'message': 'State created successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'})
    

def get_brands(request):
    if request.method == 'GET':

        brands = Brand.objects.values(
            'id',
            'name',
        )

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
                filters = Brand.objects.all().values(filter_id=F('id'), filter_name=F('name'))
            elif typeFilter == 'models':
                filters = Model.objects.all().values(filter_id=F('id'), filter_name=F('name'))
            elif typeFilter == 'states':
                filters = State.objects.all().values(filter_id=F('id'), filter_name=F('name'))
            elif typeFilter == 'cities':
                filters = City.objects.all().values(filter_id=F('id'), filter_name=F('name'))
        elif typeFilter == 'brands':
            filters = Model.objects.filter(name=primary_filter).select_related('brand').values(filter_id=F('brand__id'), filter_name=F('brand__name'))
        elif typeFilter == 'models':
            filters = Model.objects.filter(brand=primary_filter).values(filter_id=F('id'), filter_name=F('name'))
        elif typeFilter == 'states':
            filters = City.objects.filter(name=primary_filter).select_related('state').values(filter_id=F('state__id'), filter_name=F('state__name'))
        elif typeFilter == 'cities':
            filters = City.objects.filter(state=primary_filter).values(filter_id=F('id'), filter_name=F('name'))
        else:
            filters = []

        return JsonResponse(list(filters), safe=False)
    else:
        return JsonResponse({'message': 'Invalid request method'})
    

def login_user(request):
    if request.method == 'POST':
        username = json.loads(request.body)['username']
        password = json.loads(request.body)['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'session_id': request.session.session_key})
        else:
            return JsonResponse({'message': 'Invalid login credentials'}, status=401)
    else:
        return JsonResponse({'message': 'Invalid request method'})
    
def register(request):
    if request.method == 'POST':
        username = json.loads(request.body)['username']
        password = json.loads(request.body)['password']

        if not username or not password:
            return JsonResponse({'message': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'message': 'Username already exists'}, status=401)

        user = User.objects.create_user(username=username, password=password)
        user.save()
        return JsonResponse({'message': 'Registration successful'})
    else:
        return JsonResponse({'message': 'Invalid request method'})
    
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})


from django.db import models

class Brand(models.Model):
    class Meta:
        db_table = 'brands'

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class State(models.Model):
    class Meta:
        db_table = 'states'

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class City(models.Model):
    class Meta:
        db_table = 'cities'

    name = models.CharField(max_length=255)
    state = models.ForeignKey(State, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Model(models.Model):
    class Meta:
        db_table = 'models'

    name = models.CharField(max_length=255)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)

    def __str__(self):
        return self.name



class Car(models.Model):
    class Meta:
        db_table = 'cars'

    city = models.ForeignKey(City, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    year = models.IntegerField()
    version = models.CharField(max_length=50)
    transmission = models.CharField(max_length=50)
    condition = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=0)
    mileage = models.IntegerField()
    image = models.CharField(max_length=50)
    promoted = models.BooleanField()
    financing = models.BooleanField()
    color = models.CharField(max_length=50)
    fuel = models.CharField(max_length=50)
    capacity = models.IntegerField(null=True)
    observation = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.brand} {self.model}"
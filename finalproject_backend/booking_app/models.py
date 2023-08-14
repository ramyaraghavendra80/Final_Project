from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")
        extra_fields.setdefault('is_staff',False)
        extra_fields.setddefault('is_superuser',False)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user
        
class User(AbstractBaseUser):
    id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=100)
    email= models.EmailField(max_length=200,unique=True)
    password=models.CharField(max_length=16)
    username=models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD='username'

    objects=UserManager()

    def __str__(self):
        return self.username

class Movie(models.Model):
    title = models.CharField(max_length=255)
    director = models.CharField(max_length =255)
    genre = models.CharField(max_length =255)
    language = models.CharField(max_length =255)
    rating = models.CharField(max_length =10)
    movie_length = models.IntegerField()

    def __str__(self):
        return self.title

class Theater(models.Model):
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    pincode = models.CharField(max_length=255)
    movie_timing = models.DateField()

    def __str__(self):
        return self.name

class Seat(models.Model):
    theater = models.ForeignKey(Theater,on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    seat_number = models.CharField(max_length =10)
    is_reserved = models.BooleanField(default=False)
    price = models.FloatField(default=0.00)

    def __str__(self):
        return f"{self.theater.name}-{self.movie.title}- seat {self.seat_number}"

class Booking(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    total_cost = models.FloatField(default=0.00)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"



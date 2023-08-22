from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.db import models
# from django.contrib.postgres.fields import ArrayField


class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")
        extra_fields.setdefault('is_staff', False)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=200, unique=True)
    password = models.CharField(max_length=128)  # Use CharField for password
    username = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)  # To determine if user is an admin

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'name']

    objects = UserManager()

    def __str__(self):
        return self.username
        
class Movie(models.Model):
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    rating = models.CharField(max_length=10)
    image = models.ImageField(upload_to='movie_images/')
    director = models.CharField(max_length=255)
    movie_length = models.PositiveIntegerField()

    def __str__(self):
        return self.title

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    theater = models.CharField(max_length=100)
    selected_category = models.CharField(max_length=50)
    selected_seats = models.JSONField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.movie.title} - {self.user.username}'

class Theater(models.Model):
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    pincode = models.CharField(max_length=255)
    movie_timing = models.DateField()

    def __str__(self):
        return self.name

# class Seat(models.Model):
#     CATEGORY_CHOICES = [
#         ('regular', 'Regular'),
#         ('vip', 'VIP'),
#     ]
    
#     row = models.IntegerField()
#     seat_number = models.IntegerField()
#     is_booked = models.BooleanField(default=False)
#     category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='regular')
#     price = models.FloatField(default=0.00)
#     movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
#     theater = models.ForeignKey(Theater, on_delete=models.CASCADE)






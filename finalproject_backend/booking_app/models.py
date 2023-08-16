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
    id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=100)
    email= models.EmailField(max_length=200,unique=True)
    password=models.CharField(max_length=16)
    username=models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)  # To determine if user is an admin

    USERNAME_FIELD='username'
    REQUIRED_FIELDS = ['email', 'name']

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
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seat_numbers = models.CharField(max_length=200)
    seat_type = models.CharField(max_length=20)  # Type of the seat (e.g., Regular, Premium, etc.)
    is_reserved = models.BooleanField(default=False)  # Reservation status
    price = models.FloatField(default=0.00)

    def __str__(self):
        seat_numbers_str = ", ".join(self.seat_numbers)  # Uncomment this line
        return f"{self.theater.name}-{self.movie.title} - seats: {seat_numbers_str} - type: {self.seat_type}"

    # def reserve_seats(self, seat_numbers):
    #     for seat_number in seat_numbers:
    #         if seat_number not in self.seat_numbers:
    #             self.seat_numbers.append(seat_number)
    #     self.is_reserved = True
    #     self.save()

    # def unreserve_seats(self, seat_numbers):
    #     for seat_number in seat_numbers:
    #         if seat_number in self.seat_numbers:
    #             self.seat_numbers.remove(seat_number)
    #     if not self.seat_numbers:
    #         self.is_reserved = False
    #     self.save()

class Booking(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    total_cost = models.FloatField(default=0.00)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"




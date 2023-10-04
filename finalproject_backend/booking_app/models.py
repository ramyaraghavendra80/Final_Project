from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.db import models
from datetime import date
import datetime
from django.contrib.postgres.fields import ArrayField  # Use ArrayField for PostgreSQL
from django.utils import timezone

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

class Theater(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    pincode = models.CharField(max_length=255)
    # movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    rating = models.CharField(max_length=10)
    image = models.TextField()
    director = models.CharField(max_length=255)
    movie_length = models.PositiveIntegerField()
    year = models.DateField(default=datetime.date.today)
    theater = models.ManyToManyField(Theater, related_name='movies')

    def __str__(self):
        return self.title

class Seat(models.Model):
    seat_number = models.CharField(max_length=10, unique=True)
    is_booked = models.BooleanField(default=False)
    category = models.CharField(max_length=20)  # Category of the seat (e.g., "Standard", "VIP", "Balcony")
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price of the seat
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now().time())
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, default=None, blank=True, null=True)

    def __str__(self):
        return f"Seat {self.seat_number} ({self.category}) - {self.movie.title} at {self.theater.name}"

    def clean(self):
        # Ensure that seat_number is unique for a specific movie, theater, date, and time
        existing_seats = Seat.objects.filter(
            movie=self.movie,
            theater=self.theater,
            date=self.date,
            time=self.time,
            seat_number=self.seat_number,
        ).exclude(pk=self.pk)  # Exclude the current instance when checking for duplicates

        if existing_seats.exists():
            raise ValidationError({'seat_number': _('Seat already exists for this movie, theater, date, and time.')})

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='bookings')  # Associate with a user
    seat_number = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    movie = models.CharField(max_length=255)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, default=None)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20,default=None)  # Category of the seat (e.g., "Standard", "VIP", "Balcony")

class Ticket(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=10)
    date = models.DateField()
    time = models.TimeField()
    movie_name = models.CharField(max_length=255)
    theater_name = models.CharField(max_length=255)
    total_price = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    category = models.CharField(max_length=20,default=None)  # Category of the seat (e.g., "Standard", "VIP", "Balcony")

    def save(self, *args, **kwargs):
        # Automatically populate ticket fields from the associated booking
        self.date = self.booking.date
        self.time = self.booking.time
        self.movie_name = self.booking.movie
        self.theater_name = self.booking.theater
        self.total_price = self.booking.price
        self.seat_number = self.booking.seat_number
        self.category = self.booking.category
        super().save(*args, **kwargs)
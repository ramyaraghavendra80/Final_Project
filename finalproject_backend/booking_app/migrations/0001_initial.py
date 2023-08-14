# Generated by Django 4.1.10 on 2023-08-14 07:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=200, unique=True)),
                ('password', models.CharField(max_length=16)),
                ('username', models.CharField(max_length=100, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('director', models.CharField(max_length=255)),
                ('genre', models.CharField(max_length=255)),
                ('language', models.CharField(max_length=255)),
                ('rating', models.CharField(max_length=10)),
                ('movie_length', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Theater',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('pincode', models.CharField(max_length=255)),
                ('movie_timing', models.DateField()),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booking_app.movie')),
            ],
        ),
        migrations.CreateModel(
            name='Seat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seat_number', models.CharField(max_length=10)),
                ('is_reserved', models.BooleanField(default=False)),
                ('price', models.FloatField(default=0.0)),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booking_app.movie')),
                ('theater', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booking_app.theater')),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_cost', models.FloatField(default=0.0)),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booking_app.movie')),
                ('seats', models.ManyToManyField(to='booking_app.seat')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
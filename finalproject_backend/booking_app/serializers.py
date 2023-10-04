from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    theater = TheaterSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Ticket
        exclude = ['booking']

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Booking
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_admin = serializers.BooleanField(default=False)  # Add is_admin field
    # bookings = BookingSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'name', 'is_admin')
        
    def create(self, validated_data):
        is_admin = validated_data.pop('is_admin', False)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            name=validated_data['name'],
            is_staff=is_admin,
            is_admin=is_admin  # Set is_admin field in the model
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials")


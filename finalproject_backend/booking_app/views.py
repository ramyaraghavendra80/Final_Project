from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from .models import *
from .serializers import *
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken  
from django.db import DatabaseError
import traceback
from django.db import transaction, IntegrityError, models
# from datetime import date, time
from decimal import Decimal
from django.utils.translation import gettext as _
from django.core.exceptions import ValidationError
from django.utils import timezone



class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserDetails(APIView):
    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            is_admin = serializer.validated_data.get('is_admin', False)  # Check if is_admin is provided in request data
            user = serializer.save(is_staff=is_admin)  # Default to regular user
            return JsonResponse({'message': 'Signup successful', 'user_id': user.id}, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SigninView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)

            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return JsonResponse({
                'message': 'Login successful',
                'user_id': user.id,
                'refresh_token': str(refresh),
                'access_token': str(access_token)
            })

        return JsonResponse({'message': 'Incorrect credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'})

class MovieList(APIView):
    def get(self, request):
        queryset = Movie.objects.all()
        genre = request.query_params.get('genre')
        language = request.query_params.get('language')
        location = request.query_params.get('location')
        rating = request.query_params.get('rating')

        if genre:
            queryset = queryset.filter(genre=genre)
        if language:
            queryset = queryset.filter(language=language)
        if location:
            queryset = queryset.filter(location=location)
        if rating:
            queryset = queryset.filter(rating=rating)

        serializer = MovieSerializer(queryset, many=True)
        return Response(serializer.data)

class MovieDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, movie_id, format=None):
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = MovieSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddMovieView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]

    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateMovieView(APIView):
    permission_classes = [IsAdminUser]


    def put(self, request, pk):
        movie = Movie.objects.get(pk=pk)
        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteMovieView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        movie = Movie.objects.get(pk=pk)
        movie.delete()
        return JsonResponse({'message': 'Movie deleted successfully'})

class PaginateMovies(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        page_number=request.GET.get("page",1)
        movies=Movie.objects.all().order_by("id")
        paginator=Paginator(movies,5)
        page=paginator.get_page(page_number)
        movies_on_page=page.object_list
        serializer=MovieSerializer(movies_on_page,many=True).data
        return JsonResponse(
            {
                "data":serializer,
                "total_page":paginator.num_pages,
                "total_movies":movies.count(),
            },safe=False,
        )

class PaginateSearchMovies(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        query = request.GET.get("query", "")
        page_number=request.GET.get("page",1)
        movies=Movie.objects.filter(name__icontains=query)
        paginator=Paginator(movies,5)
        page=paginator.get_page(page_number)
        movies_on_page=page.object_list
        serializer=MovieSerializer(movies_on_page, many=True).data
        return JsonResponse(
            {
                "data":serializer,
                "total_pages":paginator.num_pages,
                "total_movies":movies.count(),
            },safe=False,
            )

class SearchView(APIView):
    def get(self, request):
        find = []
        query = request.GET.get("query");
        
        movies = Movie.objects.all()  # Fetch all movies (adjust this according to your model structure)
        
        for val in movies:
            if (
                query in val.title or
                query in val.genre or
                query in val.language
            ):
                find.append(val)
        
        find_serialized = MovieSerializer(find, many=True).data
        return JsonResponse(find_serialized, safe=False)

class TicketList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, booking_id):
        # Retrieve booking data using the booking_id from the URL
        booking = get_object_or_404(Booking, pk=booking_id)

        # Ensure that the booking belongs to the current user
        if booking.user != request.user:
            return Response({"error": "You do not have permission to view tickets for this booking."},
                            status=status.HTTP_403_FORBIDDEN)

        # Retrieve a list of tickets associated with the booking
        tickets = Ticket.objects.filter(booking=booking)

        # Serialize the list of tickets
        serializer = TicketSerializer(tickets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request, booking_id):
        # Retrieve booking data using the booking_id from the URL
        booking = get_object_or_404(Booking, pk=booking_id)
        
        # Ensure that the booking belongs to the current user
        if booking.user != request.user:
            return Response({"error": "You do not have permission to create a ticket for this booking."},
                            status=status.HTTP_403_FORBIDDEN)

        # Create a ticket associated with the booking
        try:
            ticket = Ticket.objects.create(
                booking=booking,
                seat_number=booking.seat_numbers,
                user=request.user
            )
        except Seat.DoesNotExist:
            return Response({"error": "Seat not found."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TicketSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SeatList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, movie_id):
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

        seats = Seat.objects.filter(movie=movie)
        serializer = SeatSerializer(seats, many=True)
        return Response(serializer.data)

    def post(self, request, movie_id):
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

        seat_number = request.data.get('seat_number', [])  # Now allows multiple seat numbers
        category = request.data.get('category', 'Standard')  # Default to "Standard" category if not provided
        date = request.data.get('date', timezone.now())  # Use the current date if not provided
        time = request.data.get('time', timezone.now().time())  # Use the current time if not provided
        theater_id = request.data.get('theater', None)  # Retrieve theater ID if provided

        # Check if a theater ID is provided, and if not, use the default theater from the model
        if theater_id:
            try:
                theater = Theater.objects.get(pk=theater_id)
            except Theater.DoesNotExist:
                return Response({"error": "Theater not found"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            theater = movie.theater

        try:
            seat = Seat.objects.get(movie=movie, seat_number=seat_number)
        except Seat.DoesNotExist:
            seat = Seat(
                seat_number=seat_number,
                category=category,
                price=self.calculate_seat_price(category),
                movie=movie,
                theater=theater,
                date=date,
                time=time,
            )

        if seat.is_booked:
            return Response({"error": "Seat is already booked"}, status=status.HTTP_400_BAD_REQUEST)

        seat.is_booked = True
        seat.save()

        serializer = SeatSerializer(seat)

        # Calculate the total number of seats
        total_seats = len(seat_number)

        # Calculate the price based on the selected category and multiply by the total number of seats
        total_price = self.calculate_seat_price(category) * total_seats

        # After successfully booking the seats, prepare the data dictionary
        booking_data = {
            "seat_numbers": seat_number,  
            "date": date,
            "time": time,
            "movie_name": movie.title,
            "theater_name": theater.name,
            "total_price": str(total_price),
        }

        # Create a new Booking instance with the booking_data
        booking = Booking.objects.create(
            seat_numbers=booking_data["seat_numbers"],
            date=booking_data["date"],
            time=booking_data["time"],
            movie_name=booking_data["movie_name"],
            theater_name=booking_data["theater_name"],
            total_price=booking_data["total_price"],
            user=request.user  # Associate the booking with the logged-in user
        )

        # Mark all booked seats as booked in the database
        Seat.objects.filter(movie=movie, seat_number__in=seat_number).update(is_booked=True)

        # Return a success message to the user
        success_message = "Seat reservation and booking have been successful."

        return Response({"message": success_message, "booking_id": booking.id}, status=status.HTTP_201_CREATED)
            
    def put(self, request, seat_id):
        try:
            seat = Seat.objects.get(pk=seat_id)
        except Seat.DoesNotExist:
            return Response({"error": "Seat not found"}, status=status.HTTP_404_NOT_FOUND)

        if seat.is_booked:
            return Response({"error": "Seat is already booked"}, status=status.HTTP_400_BAD_REQUEST)

        seat.is_booked = True
        seat.save()

        serializer = SeatSerializer(seat)
        return Response(serializer.data)

    def calculate_seat_price(self, category):
        # Calculate the price based on the seat category
        price_mapping = {
            'VIP': Decimal('15.00'),
            'Balcony': Decimal('10.00'),
            'Standard': Decimal('8.00'),
        }
        return price_mapping.get(category, Decimal('8.00'))

class BookingConfirmation(APIView):
    def get(self, request, booking_id):
        # Retrieve the booking instance or return a 404 error if not found
        booking = get_object_or_404(Booking, pk=booking_id)

        # Serialize the booking data
        serializer = BookingSerializer(booking)

        return Response(serializer.data, status=status.HTTP_200_OK)

class TheaterListView(APIView):
    def get(self, request):
        theaters = Theater.objects.all()
        serializer = TheaterSerializer(theaters, many=True)
        return JsonResponse(serializer.data,safe=False)

    def post(self, request):
        serializer = TheaterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TheaterDetailView(APIView):
    def get_object(self, pk):
        try:
            return Theater.objects.get(pk=pk)
        except Theater.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        theater = self.get_object(pk)
        serializer = TheaterSerializer(theater)
        return JsonResponse(serializer.data,safe=False)

    def put(self, request, pk):
        theater = self.get_object(pk)
        serializer = TheaterSerializer(theater, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        theater = self.get_object(pk)
        theater.delete()
        return JsonResponse(status=status.HTTP_204_NO_CONTENT)
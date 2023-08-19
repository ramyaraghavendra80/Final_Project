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
from rest_framework_simplejwt.tokens import RefreshToken  
from django.db import DatabaseError
import traceback
from django.db import transaction, IntegrityError, models


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return JsonResponse({'message': 'User deleted successfully'})

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            is_admin = serializer.validated_data.get('is_admin', False)  # Check if is_admin is provided in request data
            user = serializer.save(is_staff=is_admin)  # Set is_staff based on is_admin value
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

class MoviesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Movie.objects.all()
        serializer = MovieSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

class AddMovieView(APIView):
    permission_classes = [IsAdminUser]

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

class FilterMovies(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Movie.objects.all()

        # Apply filters if provided in the query parameters
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

class TicketsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tickets = Booking.objects.all()
        serializer = BookingSerializer(tickets, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        serializer = BookingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class SeatListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seats = Seat.objects.filter(is_booked=False)
        serializer = SeatSerializer(seats, many=True)
        return JsonResponse(serializer.data)

class SeatDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, seat_id):
        try:
            seat = Seat.objects.get(pk=seat_id, is_booked=False)
            serializer = SeatSerializer(seat)
            return JsonResponse(serializer.data)
        except Seat.DoesNotExist:
            return JsonResponse(status=status.HTTP_404_NOT_FOUND)

class ReservationCreateAPIView(APIView):
    def post(self, request):
        seat_ids = request.data.get('seat_ids', [])
        user = request.user  # Use request.user if using authentication

        if not seat_ids:
            return JsonResponse({'error': 'No seats selected'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reservations = []
            for seat_id in seat_ids:
                seat = Seat.objects.get(pk=seat_id, is_booked=False)
                reservation = Reservation(seat=seat, user=user)
                seat.is_booked = True
                seat.save()
                reservation.save()
                reservations.append(reservation)

            serializer = ReservationSerializer(reservations, many=True)
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        except Seat.DoesNotExist:
            return JsonResponse({'error': 'Seat not found'}, status=status.HTTP_404_NOT_FOUND)

class ReservationDetailUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, reservation_id):
        try:
            return Reservation.objects.get(pk=reservation_id)
        except Reservation.DoesNotExist:
            raise Http404

    def get(self, request, reservation_id):
        reservation = self.get_object(reservation_id)
        serializer = ReservationSerializer(reservation)
        return JsonResponse(serializer.data)

    def put(self, request, reservation_id):
        reservation = self.get_object(reservation_id)
        serializer = ReservationSerializer(reservation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookingAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return JsonResponse({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh_token = RefreshToken(refresh_token)
            access_token = refresh_token.access_token
        except Exception as e:
            return JsonResponse({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
        return JsonResponse({"access_token": str(access_token)}, status=status.HTTP_200_OK)

class TheaterListView(APIView):
    def get(self, request):
        theaters = Theater.objects.all()
        serializer = TheaterSerializer(theaters, many=True)
        return JsonResponse(serializer.data)

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
        return JsonResponse(serializer.data)

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
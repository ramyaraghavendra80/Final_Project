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

class MovieDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, movie_id, format=None):
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = MovieSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

class TicketsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            movie = Movie.objects.get(pk=id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        data['movie'] = movie.id  # Set the movie reference

        serializer = BookingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class SeatListAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         seats = Seat.objects.filter(is_booked=False)
#         serializer = SeatSerializer(seats, many=True)
#         return JsonResponse(serializer.data)

class SeatSelectionConfirmAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, movie_id, format=None):
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

        selected_seats = request.data.get('selected_seats')
        selected_category = request.data.get('selected_category')
        selected_date = request.data.get('selected_date')
        selected_time = request.data.get('selected_time')
        selected_theater = request.data.get('selected_theater')
        
        # Calculate total price based on selected seats and category
        price_per_seat = 0
        if selected_category == 'VIP':
            price_per_seat = 15  # Example VIP price
        elif selected_category == 'Balcony':
            price_per_seat = 10  # Example Balcony price
        else:
            price_per_seat = 8  # Example Standard price
        total_price = len(selected_seats) * price_per_seat
        
        booking_data = {
            'movie': movie.id,
            'date': selected_date,
            'time': selected_time,
            'theater': selected_theater,
            'selected_seats': selected_seats,
            'selected_category': selected_category,
            'total_price': total_price
        }
        
        serializer = BookingSerializer(data=booking_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, movie_id, format=None):
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'movie': movie.id,
            'date': request.data.get('date'),
            'time': request.data.get('time'),
            'theater': request.data.get('theater')
        }

        serializer = BookingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
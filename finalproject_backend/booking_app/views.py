from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from .models import *
from .serializers import *
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from django.db.models import Q
from rest_framework.views import APIView


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

class AuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return JsonResponse({'message': 'Incorrect credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request):
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
        genre = request.GET.get('genre')
        language = request.GET.get('language')
        location = request.GET.get('location')
        rating = request.GET.get('rating')

        if genre:
            queryset = queryset.filter(genre=genre)
        if language:
            queryset = queryset.filter(language=language)
        if location:
            queryset = queryset.filter(location=location)
        if rating:
            queryset = queryset.filter(rating=rating)

        serializer = MovieSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

class TicketsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tickets = Booking.objects.all()
        serializer = BookingSerializer(tickets, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class SeatsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movie_id = request.GET.get('movie_id')
        if movie_id:
            seats = Seat.objects.filter(movie_id=movie_id)
            serializer = SeatSerializer(seats, many=True)
            return JsonResponse(serializer.data, safe=False)
        else:
            return JsonResponse({'message': 'Please provide a valid movie_id'}, status=400)

    def post(self, request):
        serializer = SeatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    def put(self, request):
        seat_id = request.data.get('seat_id')
        if seat_id:
            try:
                seat = Seat.objects.get(id=seat_id)
            except Seat.DoesNotExist:
                return JsonResponse({'message': 'Seat not found'}, status=404)

            serializer = SeatSerializer(seat, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({'message': 'Please provide a valid seat_id'}, status=400)

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
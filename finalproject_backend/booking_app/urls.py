from django.urls import path
from .views import SeatSelectionConfirmAPIView,MovieDetailView,BookingCreateView,TheaterListView, TheaterDetailView,SignupView, SigninView, LogoutView,TicketsAPI,SearchView,PaginateMovies,PaginateSearchMovies,UserDetailView, UserListView,MoviesListView, AddMovieView, UpdateMovieView, DeleteMovieView

urlpatterns = [
    #User API
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    # Sign up, sign in, and logout
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SigninView.as_view(), name='signin'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # Movies API
    path('movies/', MoviesListView.as_view(), name='movies-list'),
    path('movies/<int:movie_id>/', MovieDetailView.as_view(), name='movie-detail'),
    path('movies/add/', AddMovieView.as_view(), name='add-movie'),
    path('movies/<int:pk>/update/', UpdateMovieView.as_view(), name='update-movie'),
    path('movies/<int:pk>/delete/', DeleteMovieView.as_view(), name='delete-movie'),
    # Paginated listing of all movies
    path('movies/paginate/', PaginateMovies.as_view(), name='paginate-movies'),
    # Paginated searching of movies
    path('movies/paginate-search/', PaginateSearchMovies.as_view(), name='paginate-search-movies'),
    # Apply filters to movies
    path('search/', SearchView.as_view(), name='search_view'),
    # Fetch all booked tickets and book a new ticket
    path('movie/<int:id>/booking/ticket/', TicketsAPI.as_view(), name='tickets-api'),
    # Fetch all seats for a specific movie, reserve seats, and update seat reservation
    path('movie/<int:id>/booking/', BookingCreateView.as_view(), name='booking-api'),
    path('movie/<int:id>/booking/seat-selection', SeatSelectionConfirmAPIView.as_view(), name='booking-api'),
    #Fetch all theaters
    path('theaters/', TheaterListView.as_view(), name='theater-list'),
    path('theaters/<int:pk>/', TheaterDetailView.as_view(), name='theater-detail'),

]


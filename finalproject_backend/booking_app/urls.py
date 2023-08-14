from django.urls import path
from .views import BookingAPI,SeatsAPI,TicketsAPI,FilterMovies,PaginateMovies,PaginateSearchMovies,UserDetailView, UserListView, AuthView, MoviesListView, AddMovieView, UpdateMovieView, DeleteMovieView

urlpatterns = [
    #User API
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    # Authentication API
    path('auth/', AuthView.as_view(), name='auth-view'),
    # Movies API
    path('movies/', MoviesListView.as_view(), name='movies-list'),
    path('movies/add/', AddMovieView.as_view(), name='add-movie'),
    path('movies/<int:pk>/update/', UpdateMovieView.as_view(), name='update-movie'),
    path('movies/<int:pk>/delete/', DeleteMovieView.as_view(), name='delete-movie'),
    # Paginated listing of all movies
    path('movies/paginate/', PaginateMovies.as_view(), name='paginate-movies'),
    # Paginated searching of movies
    path('movies/paginate-search/', PaginateSearchMovies.as_view(), name='paginate-search-movies'),
    # Apply filters to movies
    path('movies/filter/', FilterMovies.as_view(), name='filter-movies'),
    # Fetch all booked tickets and book a new ticket
    path('tickets/', TicketsAPI.as_view(), name='tickets-api'),
    # Fetch all seats for a specific movie, reserve seats, and update seat reservation
    path('seats/', SeatsAPI.as_view(), name='seats-api'),
     # Fetch booking summary and create a new booking
    path('booking/', BookingAPI.as_view(), name='booking-api'),

]


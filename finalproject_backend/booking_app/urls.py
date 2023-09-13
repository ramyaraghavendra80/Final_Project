from django.urls import path
from .views import TicketList,BookingConfirmation,SeatList,UserList, UserDetails,MovieDetail,TheaterListView, TheaterDetailView,SignupView, SigninView, LogoutView,SearchView,PaginateMovies,PaginateSearchMovies,MovieList, AddMovieView, UpdateMovieView, DeleteMovieView
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    #User API
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetails.as_view(), name='user-detail'),
    # Sign up, sign in, and logout
    # path('signup/admin/', AdminSignup.as_view(), name='admin-signup'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SigninView.as_view(), name='signin'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # Movies API
    path('movies/', MovieList.as_view(), name='movies-list'),
    path('movies/<int:movie_id>/', MovieDetail.as_view(), name='movie-detail'),
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
    path('tickets/<int:booking_id>/', csrf_exempt(TicketList.as_view()), name='ticket-list'),
    # Booking Confirmation page
    path('booking-confirmation/<int:booking_id>/', BookingConfirmation.as_view(), name='booking-confirmation'),
    # Fetch all seats for a specific movie, reserve seats, and update seat reservation
    path('movie/<int:movie_id>/seats/', SeatList.as_view(), name='seat-list'),
    path('movie/<int:movie_id>/seats/reserve/', SeatList.as_view(), name='reserve-seat'),
    path('movie/<int:movie_id>/seats/update/', SeatList.as_view(), name='update-seat-reservation'),
    #Fetch all theaters
    path('theaters/', TheaterListView.as_view(), name='theater-list'),
    path('theaters/<int:pk>/', TheaterDetailView.as_view(), name='theater-detail'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


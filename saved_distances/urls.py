from django.urls import path
from .views import SavedDistanceListCreateView, SavedDistanceDetailView,AllSavedDistancesListView,SavedDistanceDeleteView,SavedDistancesUpdateView

urlpatterns = [
    path('saved-distances/', SavedDistanceListCreateView.as_view(), name='saved-distance-list-create'),
    path('saved-distances/<int:pk>/', SavedDistanceDetailView.as_view(), name='saved-distance-detail'),
    path('saved-distances/all/', AllSavedDistancesListView.as_view(), name='all-saved-distances-list'),  
    path('saved-distances/delete/<int:pk>/', SavedDistanceDeleteView.as_view(), name='saved-distance-delete'), 
    path('saved-distances/update/<int:pk>/', SavedDistancesUpdateView.as_view(), name='saved-distance-update'), 
]
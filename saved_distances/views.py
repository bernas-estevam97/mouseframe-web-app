from django.http import HttpResponse
from django.shortcuts import render, redirect
from mouseapp.models import SavedDistances
from django.contrib import messages
from django.core.management import CommandError
from django.template import RequestContext
from django.http import JsonResponse
from django.views.generic import View
from rest_framework import generics
from .serializers import SavedDistancesSerializer
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import sys
# from rest_framework import viewsets
# from django_filters import rest_framework as filters



class SavedDistanceListCreateView(generics.ListCreateAPIView):
    queryset = SavedDistances.objects.all()
    serializer_class = SavedDistancesSerializer
    

class SavedDistanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SavedDistances.objects.all()
    serializer_class = SavedDistancesSerializer
    
class AllSavedDistancesListView(generics.ListAPIView):
    queryset = SavedDistances.objects.all()
    serializer_class = SavedDistancesSerializer

class SavedDistancesUpdateView(generics.RetrieveUpdateAPIView):
    queryset = SavedDistances.objects.all()
    serializer_class = SavedDistancesSerializer
    partial = True
    
    
class SavedDistanceDeleteView(generics.DestroyAPIView):
    queryset = SavedDistances.objects.all()
    serializer_class = SavedDistancesSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(print("Deleted distance"))
    


# class DataViewSet(viewsets.ModelViewSet):
#     queryset = SavedDistances.objects.all()
#     serializer_class = SavedDistancesSerializer
#     filter_backends = [filters.DjangoFilterBackend]                              
#     filterset_fields = ['id']
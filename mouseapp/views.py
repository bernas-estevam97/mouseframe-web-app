from django.http import HttpResponse
from django.shortcuts import render, redirect
from mouseapp.models import SavedDistances
from django.contrib import messages
from django.core.management import CommandError
from django.template import RequestContext
from django.http import JsonResponse
from django.views.generic import View
import json
from django.views.decorators.csrf import csrf_exempt



def home(request):
   if not request.user.is_authenticated:
        return redirect('/authenticate/login')
   else:
        saved_distances = SavedDistances.objects.all()
        return render(request, 'index.html', {'saved_distances': saved_distances})

def info(request):
   if not request.user.is_authenticated:
        return redirect('/authenticate/login')
   else:
        return render(request, 'info.html')
   

def saved_distance(request):
      if not request.user.is_authenticated:
        return redirect('/authenticate/login')
      if request.method == 'POST':
          conversion = request.POST.get('saved_distance_value')
          if (request.POST.get('image_size').count(("X").lower())) == 1:
               image_size = request.POST.get('image_size')
          else:
              return
     #  print(conversion, image_size)
          new = SavedDistances(conversion_value=conversion,image_size = image_size)
          new.save()
     #  messages.success(request, ('Saved successfully'))
          saved_distances = SavedDistances.objects.all()
          return render(request, 'index.html', {'saved_distances': saved_distances})
               #  return HttpResponse(saved_distances)

# @csrf_exempt
# def add_saved_distances(request):
#     if request.method == 'POST':
#         conversion = request.POST.get('saved_distance_value')
#         print(conversion)
#         image_size = request.POST.get('image_size')
#         new = SavedDistances(conversion_value=conversion,image_size = image_size)
#         new.save()
#         return JsonResponse({'status': 'success'})
#     return JsonResponse({'status': 'error'})



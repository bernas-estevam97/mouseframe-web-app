from django.http import HttpResponse
from django.shortcuts import render
from .models import SavedDistances
# from django.contrib import messages
# from django.core.management import CommandError
# from django.template import RequestContext
# from django.http import JsonResponse
# from django.views.generic import View
# # from rest_framework import generics
# # from rest_framework.response import Response
# from django.views.decorators.csrf import csrf_exempt, csrf_protect
# import sys
from django.contrib.auth.decorators import login_required
from django.conf import settings


@login_required(login_url=settings.LOGIN_URL)
def home(request):
#    if not request.user.is_authenticated:
#         return redirect('/authenticate/login')
#    else:
     saved_distances = SavedDistances.objects.all()
     return render(request, 'index.html', {'saved_distances': saved_distances})

@login_required(login_url=settings.LOGIN_URL)
def info(request):
#    if not request.user.is_authenticated:
#         return redirect('/authenticate/login')
#    else:
     return render(request, 'info.html')
   
@login_required(login_url=settings.LOGIN_URL)
def saved_distance(request):
     #  if not request.user.is_authenticated:
     #    return redirect('/authenticate/login')
     if request.method == 'POST':
          conversion = request.POST.get('saved_distance_value')
          if (request.POST.get('image_size').count(("X").lower())) == 1:
               image_size = request.POST.get('image_size')
          else:
              return
     #  print(conversion, image_size)
          new = SavedDistances(conversion_value=conversion,image_size = image_size)
          new.save()
          saved_distances = SavedDistances.objects.all()
          # return render(request, 'index.html', {'saved_distances': saved_distances})
          return HttpResponse(saved_distances)


# def delete_distance(request):
#     deleted_entry=request.GET.get('removable_choices')
#     remove_entry = SavedDistances.objects.filter(conversion_value=float(deleted_entry))
#     remove_entry.delete()
#     return HttpResponse(remove_entry)


def error_403(request, exception):
     return render(request, 'authenticate/blocked.html')


def error_404(request, exception):
     return render(request, 'authenticate/not-found.html')
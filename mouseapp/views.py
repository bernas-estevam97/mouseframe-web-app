from django.http import HttpResponse
from django.shortcuts import render, redirect
from mouseapp.models import SavedDistances
from django.contrib import messages
from django.core.management import CommandError
from django.template import RequestContext



def chooseapp(request):
   if not request.user.is_authenticated:
        return redirect('/authenticate/login')
   else:
        return render(request, 'chooseapp.html')

def walking_pattern_analyzer(request):
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

def roi_file_analyzer(request):
     if not request.user.is_authenticated:
          return redirect('/authenticate/login')
     else:
          return render(request, 'roi_analyzer.html')
   
# def notes(request):
#      if not request.user.is_authenticated:
#         return redirect('/authenticate/login')
#      else:
#           return render(request, 'notes.html')

    


# def canvas(request):
#     return render(request, 'canvas_test.html')

# def image_editor(request):
#     return render(request, 'image_editor.html')

# def img_dim(request):
#     return render(request, 'image_dim.html')



def saved_distance(request):
      if not request.user.is_authenticated:
        return redirect('/authenticate/login')
      if request.method == 'POST':
                distance = request.POST.get('saved_distance')
                print(distance)
                new = SavedDistances(saved_distance=distance)
                new.save()
                messages.success(request, ('Saved successfully'))
      saved_distances = SavedDistances.objects.all()
      return render(request, 'index.html', {'saved_distances': saved_distances})


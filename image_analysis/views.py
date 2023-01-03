from django.http import HttpResponse
from django.shortcuts import render, redirect
from image_analysis.models import *
from django.db.models import Q
from django.contrib import messages
from django.core.management import CommandError
from django.template import RequestContext
from accounts.views import login_user



def index(request):
   if not request.user.is_authenticated:
        return redirect('/authenticate/login')
   else:
        return render(request, 'index.html')
    


# def canvas(request):
#     return render(request, 'canvas_test.html')

def image_editor(request):
    return render(request, 'image_editor.html')

# def img_dim(request):
#     return render(request, 'image_dim.html')



def saved_distance(request):
    if request.method == 'POST':

        form = savedDistancesForm(request.POST)
        if form.is_valid():
            #This is called when the form fields are ok and we can create the object
            application_object = form.save()

            return HttpResponse("Some HTML code") # or HttResponseRedirect("/any_url")

    else:
        form = savedDistancesForm() 

    #This called when we need to display the form: get or error in form fields
    return render('registration/saved_distance.html', {'form': form})
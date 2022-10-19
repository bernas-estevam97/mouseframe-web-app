from django.http import HttpResponse
from django.shortcuts import render
from image_analysis.models import *
from django.db.models import Q
from django.contrib import messages
from django.core.management import CommandError
from django.template import RequestContext



def index(request):
    return render(request, 'index.html')
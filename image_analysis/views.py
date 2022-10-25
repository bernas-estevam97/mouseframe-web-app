from django.http import HttpResponse
from django.shortcuts import render
from image_analysis.models import *
from django.db.models import Q
from django.contrib import messages
from django.core.management import CommandError
from django.template import RequestContext



def index(request):
    return render(request, 'index.html')


def canvas(request):
    return render(request, 'canvas_test.html')

def image_editor(request):
    return render(request, 'image_editor.html')
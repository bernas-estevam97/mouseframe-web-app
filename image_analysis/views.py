from django.http import HttpResponse
from django.shortcuts import render
from django.core.exceptions import MultipleObjectsReturned
from polyQ.models import Disease
from django.db.models import Q
from django.contrib import messages
from django.core.management import CommandError
from django.template import RequestContext



def index(request):
    return render(request, 'index.html')
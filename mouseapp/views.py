import math
import re

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .models import SavedDistances

IMAGE_SIZE_RE = re.compile(r'^\d{1,5}x\d{1,5}$')


@login_required
def welcome(request):
    return render(request, 'welcome.html')


@login_required
def home(request):
    saved_distances = SavedDistances.objects.filter(user=request.user)
    return render(request, 'index.html', {'saved_distances': saved_distances})


@login_required
def info(request):
    return render(request, 'info.html')


@login_required
def contact(request):
    return render(request, 'contact.html')


@login_required
def support(request):
    return render(request, 'support.html')


@login_required
@require_POST
def saved_distance(request):
    """Saves a pixels-per-cm value for the image size it was measured on. Called by static/js/ajax.js,
    which shows the response text to the user when the save fails."""
    if request.user.username == 'guest':
        return HttpResponseForbidden("Guest users are not permitted to save data.")

    image_size = request.POST.get('image_size', '').strip().lower()
    try:
        conversion = float(request.POST.get('saved_distance_value', ''))
    except ValueError:
        conversion = math.nan

    if not (math.isfinite(conversion) and conversion > 0) or len(image_size) > 10 or not IMAGE_SIZE_RE.match(image_size):
        return HttpResponseBadRequest("Enter a pixel value above 0 and an image size such as 1920x1080.")

    _, created = SavedDistances.objects.get_or_create(
        user=request.user, conversion_value=conversion, image_size=image_size)
    if not created:
        return HttpResponse("This value is already saved for that image size.", status=409)
    return HttpResponse("Saved.", status=201)


def error_403(request, exception):
    # PermissionDenied("...") carries the reason, e.g. the login lockout message
    return render(request, 'authenticate/blocked.html', {'reason': str(exception or '')}, status=403)


def error_404(request, exception):
    return render(request, 'authenticate/not-found.html', status=404)


def error_500(request):
    return render(request, '500.html', status=500)

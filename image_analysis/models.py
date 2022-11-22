from django.db import models
from django import forms


class savedDistances(models.Model):
    saved_distance = models.IntegerField()

    def __str__(self):
        return f'{self.saved_distance}'


class savedDistancesForm(forms.ModelForm):

    class Meta:
        model = savedDistances
        fields = ('saved_distance',)
from django.db import models
from django import forms


class SavedDistances(models.Model):
    saved_distance = models.DecimalField(max_digits=5, decimal_places=2, unique=True)
    class Meta:
        ordering = ['saved_distance']

    def __str__(self):
        return f'{self.saved_distance}'


# class SavedDistancesForm(forms.ModelForm):

#     class Meta:
#         model = SavedDistances
#         fields = ('saved_distance',)
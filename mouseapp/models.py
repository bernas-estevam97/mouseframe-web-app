from django.db import models
from mouseapp import settings
from django.contrib.auth.models import User


class SavedDistances(models.Model):
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    conversion_value = models.FloatField(max_length= 8, blank=False, unique=True)
    image_size = models.CharField(max_length=10, blank=False)


    def __str__(self):
        return f'{str(self.user) + ": " + str(self.conversion_value) + " - " + self.image_size}'


# class SavedDistancesForm(forms.ModelForm):

#     class Meta:
#         model = SavedDistances
#         fields = ('saved_distance',)

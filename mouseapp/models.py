from django.db import models


class SavedDistances(models.Model):
    # id = models.IntegerField(primary_key=True, blank=False, null=False, unique=True)
    # dist_id = models.BigAutoField(primary_key=True)
    conversion_value = models.FloatField(max_length= 8, blank=False, unique=True)
    image_size = models.CharField(max_length=10, blank=False)
    created = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f'{str(self.conversion_value) + " - " + self.image_size}'


# class SavedDistancesForm(forms.ModelForm):

#     class Meta:
#         model = SavedDistances
#         fields = ('saved_distance',)
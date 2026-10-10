from django.conf import settings
from django.db import models


class SavedDistances(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conversion_value = models.FloatField()
    image_size = models.CharField(max_length=10)

    class Meta:
        constraints = [
            # Was unique across all users, so one user saving a value blocked every other user from saving it
            models.UniqueConstraint(fields=['user', 'conversion_value', 'image_size'], name='unique_saved_distance_per_user'),
        ]

    def __str__(self):
        return f'{self.user}: {self.conversion_value} - {self.image_size}'

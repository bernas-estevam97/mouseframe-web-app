from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import SavedDistances


@admin.register(SavedDistances)
class SavedDistancesAdmin(ImportExportModelAdmin):
    list_display = ('user', 'conversion_value', 'image_size')
    list_filter = ('user',)

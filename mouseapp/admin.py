from .models import *
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

class ExcelAdmin(ImportExportModelAdmin):
    pass

admin.site.register(SavedDistances, ExcelAdmin)
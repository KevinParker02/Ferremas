from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import *
#Aqui registramos los roles
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id_rol', 'nom_rol')
    search_fields = ('nom_rol',)

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id_region', 'nom_region')
    search_fields = ('nom_region',)

@admin.register(Comuna)
class ComunaAdmin(admin.ModelAdmin):
    list_display = ('id_comuna', 'nom_comuna', 'region')
    search_fields = ('nom_comuna',)
    list_filter = ('region',)

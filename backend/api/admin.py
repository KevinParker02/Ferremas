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

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id_user', 'nombre_user', 'apellido_user', 'email_user', 'rol', 'comuna')
    search_fields = ('nombre_user', 'apellido_user', 'email_user')
    list_filter = ('rol', 'comuna', 'estado_user')

@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):
    list_display = ('id_sucursal', 'direccion_sucursal', 'comuna')
    search_fields = ('direccion_sucursal',)
    list_filter = ('comuna',)
from django.db import models
#Modelo de prueba
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
#modelo de rol
class Role(models.Model):
    id_rol = models.IntegerField(primary_key=True)  # Lo que tenías en MySQL
    nom_rol = models.CharField(max_length=40)  # Lo que tenías en MySQL

    class Meta:
        db_table = 'ROL_USER'
    
    def __str__(self):
        return self.nom_rol
#modelo de region
class Region(models.Model):
    id_region = models.IntegerField(primary_key=True)
    nom_region = models.CharField(max_length=60)

    class Meta:
        db_table = 'REGION'

    def __str__(self):
        return self.nom_region        
#modelo de comuna
class Comuna(models.Model):
    id_comuna = models.IntegerField(primary_key=True)
    nom_comuna = models.CharField(max_length=60)
    region = models.ForeignKey('Region', on_delete=models.CASCADE, db_column='id_region')

    class Meta:
        db_table = 'COMUNA'

    def __str__(self):
        return self.nom_comuna
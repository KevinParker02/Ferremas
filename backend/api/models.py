from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Role(models.Model):
    id_rol = models.IntegerField(primary_key=True)  # Lo que tenías en MySQL
    nom_rol = models.CharField(max_length=40)  # Lo que tenías en MySQL

    class Meta:
        db_table = 'ROL_USER'
    
    def __str__(self):
        return self.nom_rol
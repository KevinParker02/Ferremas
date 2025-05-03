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
#modelo usuario
class Usuario(models.Model):
    id_user = models.AutoField(primary_key=True)
    nombre_user = models.CharField(max_length=60)
    apellido_user = models.CharField(max_length=60)
    rut_user = models.IntegerField(unique=True)
    dv_user = models.IntegerField()
    celular_user = models.IntegerField()
    pass_user = models.CharField(max_length=12)
    email_user = models.EmailField(max_length=100, unique=True)
    direccion_user = models.CharField(max_length=100)
    token = models.CharField(max_length=255, null=True, blank=True)
    estado_user = models.BooleanField()
    
    rol = models.ForeignKey(
        Role,
        on_delete=models.DO_NOTHING,
        db_column='id_rol' 
    )
    comuna = models.ForeignKey(
        Comuna,
        on_delete=models.DO_NOTHING,
        db_column='id_comuna'
    )

    class Meta:
        db_table = 'USUARIO'
    
    def __str__(self):
        return f'{self.nombre_user} {self.apellido_user}'

#modelo sucursal
class Sucursal(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    direccion_sucursal = models.CharField(max_length=100)
    comuna = models.ForeignKey(Comuna, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_sucursal', 'comuna'], name='unique_sucursal_comuna')
        ]

    def __str__(self):
        return self.direccion_sucursal
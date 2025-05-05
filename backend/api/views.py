from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework import generics
from .models import Item
from .serializers import ItemSerializer
from api.models import *;
from django.contrib.auth.hashers import check_password
class ItemListCreate(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

#Inicio de sesión
@api_view(['POST'])
def login_view(request):
    correo = request.data.get('usuario')
    password = request.data.get('password')

    try:
        user = Usuario.objects.get(email_user=correo)
        if user.pass_user == password:
            return Response({
                'mensaje': 'Login correcto',
                'usuario': {
                    'id_user': user.id_user,
                    'nombre_user': user.nombre_user,
                    'email_user': user.email_user,
                    'rol': {
                        'id': user.rol.id_rol,
                        'nombre': user.rol.nom_rol
                    }
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
#Registro
@api_view(['POST'])
def register_view(request):
    data = request.data
    try:
        nuevo_usuario = Usuario.objects.create(
            nombre_user=data['nombre_user'],
            apellido_user=data['apellido_user'],
            rut_user=data['rut_user'],
            dv_user=data['dv_user'],
            celular_user=data['celular_user'],
            pass_user=data['password'],  # Aún sin hash
            email_user=data['email_user'],
            direccion_user=data['direccion_user'],
            estado_user=True,
            rol_id=data['rol_id'],          # ID del rol
            comuna_id=data['comuna_id']     # ID de la comuna
        )
        return Response({'mensaje': 'Usuario registrado correctamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#Obtener comunas
@api_view(['GET'])
def listar_comunas(request):
    comunas = Comuna.objects.all().values('id_comuna', 'nom_comuna')
    return Response(list(comunas))
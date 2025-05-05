from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework import generics
from .models import Item
from .serializers import ItemSerializer
from api.models import Usuario;
from django.contrib.auth.hashers import check_password
class ItemListCreate(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


@api_view(['POST'])
def login_view(request):
    correo = request.data.get('usuario')
    password = request.data.get('password')

    try:
        user = Usuario.objects.get(email_user=correo)
        if user.pass_user == password:
            user_data = {
                'id_user': user.id_user,
                'nombre_user': user.nombre_user,
                'email_user': user.email_user,
                'id_rol': user.rol.id_rol,
                'nom_rol': user.rol.nom_rol,
                # aqui podemos agregar algo si nos faltan datos 
            }
            return Response(user_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
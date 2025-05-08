from django.urls import path
from .views import *

urlpatterns = [
    path('items/', ItemListCreate.as_view(), name='item-list-create'),
    path('login/', login_view),
    path('register/', register_view),
    path('comunas/', listar_comunas),
    path('recuperar/', recuperar_view),
    path('regiones/', listar_regiones),
    path('reset_password/', reset_password_view),
    path('productos/', listar_productos, name='listar_productos'),
]
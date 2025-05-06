from django.urls import path
from .views import *

urlpatterns = [
    path('items/', ItemListCreate.as_view(), name='item-list-create'),
    path('login/', login_view),
    path('register/', register_view),
    path('comunas/', listar_comunas),
    path('recuperar/', recuperar_view),
    path('regiones/', listar_regiones),
]
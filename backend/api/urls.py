from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet, OrderViewSet

# O Router cria automaticamente todos os caminhos RESTFul para nós!
router = DefaultRouter()
router.register(r'menu', MenuItemViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
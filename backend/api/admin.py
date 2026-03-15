from django.contrib import admin
from .models import MenuItem, Order, OrderLine

# Registar os modelos para aparecerem no painel
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(OrderLine)
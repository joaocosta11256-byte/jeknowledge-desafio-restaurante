import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import MenuItem 

def seed_menu():
    pratos = [
        {
            "name": "Pão de Alho", 
            "description": "Pão tostado com manteiga de alho e ervas", 
            "category": "Entradas",
            "ingredients": "Pão, Manteiga, Alho, Óregãos" 
        },
        {
            "name": "Creme de Legumes", 
            "description": "Sopa aveludada de legumes frescos da época", 
            "category": "Sopas",
            "ingredients": "Batata, Cenoura, Cebola, Azeite, Sal"
        },
        {
            "name": "Bife à Casa", 
            "description": "Bife de vitela com molho especial e batata frita", 
            "category": "Carne",
            "ingredients": "Bife de Vitela, Alho, Louro, Natas, Mostarda, Batata"
        },
        {
            "name": "Bacalhau à Brás", 
            "description": "Bacalhau desfiado com batata palha e ovos", 
            "category": "Peixe",
            "ingredients": "Bacalhau, Batata Palha, Ovo, Cebola, Salsa, Azeitonas"
        },
        {
            "name": "Mousse de Chocolate", 
            "description": "Mousse caseira com chocolate negro", 
            "category": "Sobremesa",
            "ingredients": "Chocolate de Culinária, Ovos, Manteiga, Açúcar"
        },
    ]

    print("A limpar o menu antigo...")
    MenuItem.objects.all().delete()

    print("A adicionar os pratos ao menu...")
    for prato in pratos:
        MenuItem.objects.create(**prato)
        print(f"Adicionado: {prato['name']}")
    
    print("Menu populado com sucesso!")

if __name__ == '__main__':
    seed_menu()
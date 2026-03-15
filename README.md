# Sistema de Gestão de Pedidos - Restaurante (jeKnowledge)

O sistema permite que os clientes efetuem pedidos através de uma interface intuitiva e que a cozinha faça a gestão do estado desses pedidos num dashboard Kanban.

## 🛠️ Stack Tecnológica Escolhida e Justificação

* **Backend:** Python com Django REST Framework (DRF) e SQLite.
    * *Justificação:* O Django é a recomendação principal do guião. Permitiu expor uma REST API limpa e estruturada de forma rápida. O uso de SQLite cumpre o requisito de configuração local mínima, evitando a necessidade de instalar servidores de base de dados complexos.
* **Frontend:** React (JavaScript) com Vite.
    * *Justificação:* O Dashboard da Cozinha exige uma gestão de estado complexa (mover pedidos entre fases). A arquitetura baseada em componentes do React e o uso de *Hooks* (`useState`, `useEffect`) garante que a interface se mantém reativa, limpa e imune a *spaghetti code* que resultaria da manipulação direta do DOM com Vanilla JS.

## 🚀 Como Correr o Projeto Localmente

**Nota Importante:** O ficheiro `db.sqlite3` foi intencionalmente incluído no repositório com o menu inicial pré-populado. Isto permite testar a aplicação imediatamente sem necessidade de correr scripts de *seed* ou adicionar pratos manualmente no painel de administração.

### 1. Iniciar o Backend (Django)
1. Abra um terminal e navegue para a pasta `backend`.
2. Ative o ambiente virtual:
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
3. Instale as dependências (se necessário): `pip install django djangorestframework django-cors-headers`
4. Inicie o servidor: `python manage.py runserver`
5. A API ficará disponível em `http://localhost:8000/api/`

### 2. Iniciar o Frontend (React)
1. Abra um **novo** terminal e navegue para a pasta `frontend`.
2. Instale as dependências: `npm install react-router-dom`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Aceda à aplicação no browser: `http://localhost:5173/`

## 🏗️ Decisões Arquiteturais Relevantes

1.  **Modelo de Dados Normalizado:** Foram criadas 3 tabelas no SQLite (`MenuItem`, `Order` e `OrderLine`). A tabela `OrderLine` atua como ponte de junção (Many-to-Many) entre os pedidos e os pratos, garantindo que o modelo reflete as relações reais do restaurante de forma limpa.
2.  **Otimização da API:** No endpoint `GET /api/orders/`, o backend já anexa os nomes e ingredientes de cada prato diretamente ao objeto do pedido. Isto evita que o frontend tenha de fazer múltiplos pedidos HTTP subsequentes apenas para cruzar IDs com nomes, otimizando o carregamento do Dashboard.
3.  **Atualização de Estado RESTful:** Foi utilizado o método `PATCH` para a transição dos pedidos entre as colunas da cozinha, respeitando as convenções REST, visto que se trata de uma atualização parcial (apenas o campo `status` é alterado).
4.  **UX Orientada à Tarefa:** A interface do cliente usa *CSS Sticky* para manter o carrinho visível durante o scroll. Na cozinha, adotou-se o modelo de "clicar no cartão para abrir o modal de ingredientes", poupando espaço visual e cumprindo rigorosamente as diretrizes do guião.
5.  **[BÓNUS] Tempo Real (Polling Estratégico):** Para cumprir o bónus de atualizações automáticas sem violar a regra de "configuração mínima" e evitar *over-engineering*, implementei *Short Polling* (a cada 5 segundos) no React. Isto evita a necessidade de instalar e configurar WebSockets, `Django Channels` e `Redis` localmente, garantindo uma sincronização leve e perfeitamente adequada ao contexto de um restaurante.
6.  **[BÓNUS] Dashboard Kanban Interativo (Drag-and-Drop Nativo):** O quadro da cozinha permite arrastar os cartões entre as fases utilizando a **API nativa do HTML5**. Optei por não utilizar bibliotecas externas para manter o pacote leve. Adicionalmente, mantive os botões nos cartões em simultâneo com o *Drag-and-Drop* para garantir 100% de **acessibilidade** e compatibilidade com ecrãs táteis.
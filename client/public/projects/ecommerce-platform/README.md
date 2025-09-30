# E-Commerce Platform

## Como Funciona

Quando o jogador clicar no outdoor, será redirecionado para a URL do seu projeto online.

## Configuração

### 1. Adicione a Capa
Coloque a imagem `cover.jpg` nesta pasta. Esta será a imagem exibida no outdoor 3D.

### 2. Configure a URL do Projeto
No arquivo `client/public/game.js`, linha 36, atualize a URL:
```javascript
url: 'https://seu-projeto.com',
```

### 3. Ative a Capa
No arquivo `client/public/game.js`, linha 38, altere:
```javascript
coverImage: null,  // ← Altere esta linha
```
Para:
```javascript
coverImage: '/projects/ecommerce-platform/cover.jpg',
```

Pronto! Ao clicar no outdoor, o usuário será levado para seu site.

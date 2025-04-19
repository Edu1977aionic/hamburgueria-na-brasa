# Hamburgueria Na Brasa - Sistema de Gestão

## Sobre o Projeto

Sistema de gestão e comunicação para a Hamburgueria "Na Brasa", com dashboard interativo, agentes inteligentes e análise de dados operacionais.

## Fase 2: Desenvolvimento Backend

Esta fase inclui a implementação de:

- **APIs CRUD completas para produtos e vendas**
- **Sistema de upload e gerenciamento de cardápio**
- **Integração com WhatsApp via Evolution API**
- **Análises inteligentes com OpenAI**

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: JWT
- **IA**: OpenAI API
- **WhatsApp**: Evolution API
- **Armazenamento**: Supabase Storage

## Estrutura do Projeto

```
src/
├── backend/
│   ├── api/            # Endpoints da API REST
│   ├── controllers/    # Controladores de lógica de negócios
│   ├── models/         # Modelos para interação com banco de dados
│   ├── services/       # Serviços externos (OpenAI, WhatsApp)
│   ├── middleware/     # Middlewares (autenticação, upload)
│   ├── config/         # Configurações de conexão
│   └── server.js       # Servidor Express
├── pages/              # Frontend (Next.js)
└── components/         # Componentes React
```

## Funcionalidades Implementadas

- Gestão completa de produtos (CRUD)
- Registro e análise de vendas
- Upload e gerenciamento de cardápios em PDF
- Integração com WhatsApp para comunicação com clientes
- Análise de sentimento via OpenAI
- Sugestões de marketing baseadas em dados de vendas
- Recomendações financeiras automatizadas

## Próximos Passos (Fase 3)

- Implementação do frontend
- Integração frontend-backend
- Desenvolvimento do dashboard interativo
- Melhorias de usabilidade e experiência do usuário
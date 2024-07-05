# Backend do Projeto Radix

Este repositório contém o backend para o projeto Radix, desenvolvido com Node.js e Express, utilizando Prisma como ORM para interagir com o banco de dados PostgreSQL.

## Estrutura do Projeto

```
.
├── README.md
├── ci/
├── docker-compose.yml
├── dist/
├── index.js
├── node_modules/
├── nodejs/
├── package-lock.json
├── package.json
├── pdflib-layer.zip
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── serverless.yml
└── src/
    ├── controller/
    │   ├── CsvController.ts
    │   ├── SensorAverageController.ts
    │   └── SensorDataController.ts
    ├── index.ts
    ├── middleware/
    │   └── create-route.ts
    ├── routes/
    │   ├── CsvRouter.ts
    │   └── SensorRouter.ts
    ├── server.ts
    └── utils/
        ├── async-pipe.ts
        ├── multerConfig.ts
        └── index.ts
```

## Configuração

### Instalação de Dependências

Para instalar as dependências do projeto, execute:

```
npm install
```

### Configuração do Banco de Dados

1. **Configuração Inicial:**
   - Certifique-se de ter o PostgreSQL instalado localmente ou configurado em um ambiente de nuvem (como AWS RDS).
   - Configure as credenciais do banco de dados no arquivo `.env`.

2. **Migrações e Seed:**
   - Execute as migrações do banco de dados usando Prisma:
     ```
     npx prisma migrate dev
     ```
   - Se necessário, execute os scripts de seed para popular o banco de dados com dados iniciais:
     ```
     npx prisma db seed --preview-feature
     ```

## Execução

Para iniciar o servidor backend, utilize o seguinte comando:

```
npm start
```

O servidor estará acessível em `http://localhost:3005`.

## Rotas Disponíveis

### Upload de CSV

- **POST** `/api/csv_upload`
  - Faz upload de um arquivo CSV contendo dados de medição e os salva no banco de dados.

### Sensor Data

- **POST** `/api/sensor-data`
  - Recebe dados do sensor e os processa.

- **GET** `/api/sensor-average`
  - Retorna a média dos dados dos sensores.

## Documentação Adicional

Para mais informações sobre como utilizar as rotas e os controladores, consulte a documentação no código-fonte.
```

Se precisar de mais alguma coisa ou alguma alteração específica, estou aqui para ajudar!
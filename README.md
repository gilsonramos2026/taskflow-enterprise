# TaskFlow Enterprise

## Sistema de Gestao de Tarefas e Projetos 

Sistema de gestão de tarefas com **CRUD completo, paginação, filtros, validações estritas e tratamento de exceções**, construído com **Spring Boot 3.4 + Java 21** no backend e **React 19 + TypeScript + Tailwind CSS v4** no frontend.

## 🖼️ Preview

> Adicione aqui as imagens reais do projeto.

### Interface do sistema

![TaskFlow Enterprise](docs/images/taskflow-preview.png)

---

### Backend

| Tecnologia | Utilização |
|---|---|
| ![Java](https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | Java 21 |
| ![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.4-6DB33F?style=flat-square&logo=springboot&logoColor=white) | Framework backend |
| ![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=flat-square&logo=spring&logoColor=white) | Persistência |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | Banco de dados |
| ![MapStruct](https://img.shields.io/badge/MapStruct-000000?style=flat-square) | Mapeamento de objetos |
| ![Lombok](https://img.shields.io/badge/Lombok-BC4521?style=flat-square) | Redução de código boilerplate |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black) | Documentação da API |

### Frontend

| Tecnologia | Utilização |
|---|---|
| ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) | Interface |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Tipagem |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build e desenvolvimento |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Estilização |
| ![Lucide](https://img.shields.io/badge/Lucide-000000?style=flat-square) | Ícones |

### Testes

| Tecnologia | Utilização |
|---|---|
| ![JUnit 5](https://img.shields.io/badge/JUnit_5-25A162?style=flat-square&logo=junit5&logoColor=white) | Testes unitários |
| ![Mockito](https://img.shields.io/badge/Mockito-78A641?style=flat-square) | Mocks |
| Spring Test / MockMvc | Testes de integração |

---

## Estrutura do Projeto

```text
taskflow-enterprise/

├── backend/                       # API REST (Spring Boot)
│   ├── src/main/java/com/taskflow/enterprise/
│   │   ├── controller/            # Camada Web (REST Controllers)
│   │   ├── service/Impl/          # Regras de negócio
│   │   ├── repository/            # Spring Data JPA + Specifications
│   │   ├── entity/                # Entidades JPA e enums
│   │   ├── dto/                   # Request/Response DTOs
│   │   ├── mapper/                # MapStruct mappers
│   │   ├── exception/             # Exceções customizadas + Global Handler
│   │   └── config/                # CORS, OpenAPI
│   │
│   ├── src/test/java/...          # Testes unitários e de integração
│   ├── pom.xml
│   └── src/main/resources/
│       └── application.yml
│
├── frontend/                      # SPA (React + Vite)
│   ├── src/
│   │   ├── components/            # Componentes de UI reutilizáveis
│   │   ├── pages/                 # Páginas da aplicação
│   │   ├── hooks/                 # Hooks customizados (useTasks, useToast)
│   │   ├── services/              # Camada de acesso à API (api.ts)
│   │   └── types/                 # Tipagens TypeScript (task.ts)
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

### ⚙️ Pré-requisitos

Antes de começar, garanta que você tem instalado:

Java 21 (JDK)
Maven 3.9+
Node.js 20+
npm
PostgreSQL

Também é possível utilizar o ./mvnw caso o Maven Wrapper esteja configurado no projeto.

---

## 🚀 Passo a Passo de Execução

### 1. Criar banco com  PostgreSQL 

Crie o banco de dados utilizado pela aplicação e configure as credenciais no arquivo application.yml.


### 2. Rodar o Backend (Spring Boot)

Entre na pasta do backend:

```bash
cd backend
```

Rode a aplicacao:

```bash
mvn spring-boot:run
```
O perfil dev já está ativo por padrão no application.yml.

O backend será executado em:
http://localhost:8080

As tabelas são criadas automaticamente na primeira execução através de:

ddl-auto: update

### 🔗 Endpoints Úteis

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Health Check (Actuator): `http://localhost:8080/actuator/health`
- API de Tarefas: `http://localhost:8080/api/v1/tasks`

### 🧪 Executar os Testes Automatizados

Para executar os testes unitários e de integração:
```bash
mvn test
```

### 3. Rodar o Frontend (React + Vite)

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependencias:

```bash
npm install
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend será executado em:
`http://localhost:5173`

O frontend está configurado através do proxy no vite.config.ts para redirecionar chamadas /api/** para o backend:

http://localhost:8080

Abra no navegador:
http://localhost:5173

A interface permite criar, listar, filtrar, editar e excluir tarefas.

---

## ⚡Resumo Rapido dos Comandos

```bash
#Backend
cd backend
mvn spring-boot:run

#Frontend 
cd frontend
npm install
npm run dev

#Testes
cd backend
mvn test
```

## Parar o frontend/backend:

Pressione:

```bash

 Ctrl+C 

```
nos respectivos terminais

---

##  ✨ Funcionalidades Implementadas

✅ CRUD completo de tarefas:
 - Criar
 - Listar
 - Buscar por ID
 - Atualizar
 - Atualizar status
 - Excluir
  
✅ Paginação no backend utilizando Pageable, refletida na UI

✅ Filtros combináveis por:
- Status
- Prioridade
- Busca textual por título e descrição

✅ Validações estritas com Bean Validation:
- @NotBlank
- @Size
- @NotNull

✅ Feedback de erro por campo no frontend

✅ Tratamento centralizado de exceções no padrão RFC 7807 — - - Problem Details

✅ Regra de negócio de transição de status:
- Uma tarefa COMPLETED não pode voltar diretamente para PENDING

✅ Documentação interativa da API via Swagger UI

✅ Testes unitários utilizando Service/Mockito

✅ Testes de integração utilizando Controller/MockMvc

✅ UI responsiva com abordagem mobile-first

✅ Estados de loading com skeleton

✅ Estado vazio

✅ Estado de erro

✅ Toasts de sucesso e erro

---


## 📂 Imagens do Projeto

Para adicionar as imagens utilizadas neste README, crie a seguinte estrutura:
```

docs/ 
└── images/
    ├── taskflow-preview.png
    ├── dashboard.png
    ├── tasks.png
    ├── create-task.png
    └── mobile.png

```

Depois, substitua ou adicione as imagens conforme as telas reais do projeto.

## 👨‍💻 Autor

### Gilson Ramos

### Engenheiro de software em formacão

Projeto desenvolvido para estudos, aprimoramento técnico e construção de portfólio profissional.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/gilsonramos2026)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/gilsonramos2026)


### 📩 E-mail

`gilsrms0@gmail.com`

### 📄 Licença

Projeto de portfólio — livre para uso e estudo.

<p align="center"> Desenvolvido por <strong>Gilson Ramos</strong> </p> 

>Essa versão não adiciona JWT, Flyway, Axios, React Router, autenticação, dashboard, categorias, tags ou outras funcionalidades que não estavam no seu README original. Mantive as informações originais e trabalhei apenas a apresentação, organização, imagens, ícones e seus dados.


---#   t a s k f l o w - e n t e r p r i s e  
 
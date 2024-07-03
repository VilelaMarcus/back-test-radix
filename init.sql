-- Criação do banco de dados
CREATE DATABASE postgres_db;

-- Criação de usuário
CREATE USER postgres_user WITH PASSWORD 'postgres_password';

-- Concede privilégios ao usuário para o banco de dados
GRANT ALL PRIVILEGES ON DATABASE postgres_db TO postgres_user;
# Instruções de Deploy na VPS

Este guia passo a passo ajudará você a colocar a API PGSoft no ar em sua VPS usando Docker.

## Pré-requisitos

1.  **VPS** com sistema operacional Linux (Ubuntu 20.04 ou 22.04 recomendado).
2.  **Acesso SSH** à VPS.
3.  **Docker** e **Docker Compose** instalados na VPS.

## Passo 1: Preparar a VPS

Acesse sua VPS via SSH e instale o Docker e Docker Compose se ainda não tiver:

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose (se não vier com o Docker)
sudo apt install docker-compose-plugin -y
```

## Passo 2: Enviar os Arquivos

Você precisa enviar os arquivos do projeto para a VPS. Você pode usar o **FileZilla**, **SCP** ou clonar via **Git** (se estiver em um repositório).

Certifique-se de enviar os seguintes arquivos/pastas:
- `src/`
- `public/`
- `package.json`
- `yarn.lock` (ou package-lock.json)
- `tsconfig.json`
- `Dockerfile`
- `docker-compose.yml`
- `apidb.sql`
- `.env` (opcional, pois as variáveis estão no docker-compose.yml, mas recomendado para segurança)

## Passo 3: Subir a Aplicação

Navegue até a pasta onde você colocou os arquivos na VPS e execute:

```bash
# Construir e iniciar os containers em segundo plano
docker compose up -d --build
```

*Nota: Se você instalou uma versão mais antiga do docker-compose, o comando pode ser `docker-compose up -d --build` (com hífen).*

## Passo 4: Verificar Status

Verifique se os containers estão rodando:

```bash
docker compose ps
```

Você deve ver 2 serviços: `api-pgsoft` e `pgsoft_db` (MySQL).

## Passo 5: Logs e Debug

Se precisar ver os logs da API:

```bash
docker compose logs -f api-pgsoft
```

## Notas Importantes

-   **Banco de Dados**: O arquivo `apidb.sql` será importado automaticamente na primeira vez que o banco de dados for iniciado. Se você precisar resetar o banco, terá que apagar o volume `db_data`: `docker compose down -v`.
-   **Portas**: A API estará rodando na porta `3000`. Certifique-se de que o firewall da VPS permite tráfego nessa porta.
-   **Variáveis de Ambiente**: Para maior segurança em produção, edite o arquivo `docker-compose.yml` e altere as senhas padrão (`minhasenhapg`, `rootpassword`, etc.).

---
**Sucesso!** Sua API deve estar rodando e pronta para uso.

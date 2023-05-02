# Billimo

## Running Docker

```sh

cd scripts/
chmod +x ./build-system.development.sh
./build-system.development.sh
docker-compose up

```

## Navigation

`.azure` - Microsoft Azure related scripts

`.docker` - docker related scripts

`env.example` - environment variables per services

`backend` - Rest API service

`docs` - project documentation

`frontend` - Angular application

`scripts` - common scripts to build or deploy application

## Installation

- For backend setup see: [Backend](./backend/)

_Don't forget to fill in the **`.env`** file. Use the **`.env.example`** file as a reference._

- For frontend setup see: [Frontend](./frontend/)

_Don't forget to fill in the **`.env`** file. Use the **`.env.example`** file as a reference._

## Requirements

- [Node](https://nodejs.org/en/download/)
- [NPM](https://www.npmjs.com/)
- [.NET 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [PostgreSQL](https://www.postgresql.org/download/)

## Tools

_TBD_

## Git

### Branches

- `main` - release version.
- `dev` - development version.

### Branch example

`<type>/<num>-<title>`

- `bug/11-fix-spinner`
- `feat/15-add-user`

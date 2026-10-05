# PQRSF EVO — Fase 1

Monorepo preparado para desarrollo en GitHub Codespaces. La Fase 1 añade el esquema relacional de la guía, la migración Prisma inicial y el endpoint público de radicación con formulario web. Todavía no incluye login, roles activos, SLA, asignación automática ni colas.

## Servicios y puertos

| Servicio | Puerto | Comprobación |
| --- | ---: | --- |
| API NestJS | 3000 | `/` y `/health` |
| React + Vite | 5173 | Página inicial de Fase 0 |
| PostgreSQL 16 | 5432 | Conexión comprobada por `/health` |
| Redis | 6379 | Requiere la contraseña de desarrollo |
| MinIO API | 9000 | API compatible con S3 |
| Consola MinIO | 9001 | Credenciales de desarrollo del `.env` |
| Mailpit | 8025 | Interfaz web de correo de prueba |
| SMTP Mailpit | 1025 | Uso interno de desarrollo |

## Crear el repositorio en GitHub y subir este código

1. En GitHub, selecciona **New repository**, usa el nombre `pqrsf-evo` y crea el repositorio vacío, sin README, licencia ni `.gitignore` (este proyecto ya contiene esos archivos).
2. Abre una terminal en la carpeta raíz del proyecto. Si todavía no es un repositorio Git, inicialízalo y crea la rama `main`:

	```bash
	git init
	git branch -M main
	git add .
	git commit -m "Preparar entorno Fase 0 para Codespaces"
	```

3. Agrega la URL del repositorio recién creado y sube `main` (reemplaza `USUARIO` por tu cuenta u organización):

	```bash
	git remote add origin https://github.com/USUARIO/pqrsf-evo.git
	git push -u origin main
	```

	Si `origin` ya existe, actualiza su URL con `git remote set-url origin ...` antes de hacer el `push`. No subas `.env`; ese archivo está ignorado por Git. `.env.example` sí debe quedar versionado.

## Crear y abrir el Codespace

1. Abre el repositorio `pqrsf-evo` en GitHub y confirma que el código está en la rama `main`.
2. Pulsa **Code** → **Codespaces** → **Create codespace on main**.
3. Codespaces construirá el contenedor definido por `.devcontainer/devcontainer.json` y el `docker-compose.yml`. El servicio principal del contenedor de desarrollo es `backend`; el comando posterior instala dependencias de backend y frontend.
4. Espera a que VS Code indique que el Codespace está listo. En la pestaña **Ports** deben aparecer `3000`, `5173`, `5432`, `6379`, `9000`, `9001` y `8025`.
5. Abre el puerto `5173` con **Open in Browser** para comprobar la pantalla Fase 0. En el puerto `3000`, `/` responde “Hola, EVO” y `/health` devuelve `status: ok` y `database: connected` después de consultar PostgreSQL a través de Prisma.
6. Abre el puerto `8025` para la interfaz de Mailpit. Para revisar MinIO, abre el puerto `9001`; las credenciales están en `.env.example` (solo para desarrollo).

Los puertos reenviados por Codespaces son privados por defecto; no los marques como públicos salvo que sea necesario. Las credenciales de `.env.example` son exclusivamente para desarrollo y deben reemplazarse antes de cualquier despliegue.

## Variables de entorno

Codespaces utiliza las variables de desarrollo incluidas en `docker-compose.yml` si no existe un `.env`. Para desarrollo local, copia `.env.example` a `.env` y ejecuta `docker compose up --build` desde la raíz. No uses esas credenciales en producción.

## Siguiente fase

### Aplicar la migración inicial

Una vez creado el Codespace y estén los servicios listos, abre un terminal en VS Code y ejecuta desde `backend`:

```bash
npm run prisma:migrate -- --name fase1_initial
```

El SQL de la migración inicial versionada está en `backend/prisma/migrations/20261005225000_fase1_initial/`. El comando de arriba crea/aplica migraciones de desarrollo y actualiza Prisma Client. Después, prueba `POST /pqrsf` desde el frontend en el puerto 5173. La API permite hasta 5 solicitudes por minuto por IP en este MVP.

La siguiente fase puede abordar autenticación y roles, luego SLA/asignación/colas. `docker-compose.prod.yml` es solo una base de producción y requiere secretos administrados, correo real, TLS, backups y controles de acceso antes de exponerse.

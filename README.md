# 🏆 Polla del Mundial

App web full-stack para pronósticos del Mundial de Fútbol.  
**Stack:** React + Vite · Express.js · MongoDB · Docker

---

## Estructura del proyecto

```
mundial-polla/
├── backend/          # API Express + Mongoose
│   ├── server.js
│   ├── Dockerfile
│   └── .env.example
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/Header.jsx
│   │   ├── pages/StepDatos.jsx
│   │   ├── pages/StepMarcadores.jsx
│   │   └── pages/StepConfirmacion.jsx
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## 🚀 Opción 1: Docker (Recomendado para producción)

### Requisitos
- Docker Desktop o Docker + Docker Compose instalados

### Pasos

```bash
# 1. Clonar / descargar el proyecto
cd mundial-polla

# 2. Levantar todo con un comando
docker compose up --build -d

# La app estará disponible en:
# Frontend →  http://localhost:3000
# Backend  →  http://localhost:4000
# MongoDB  →  localhost:27017
```

### Detener
```bash
docker compose down
```

### Ver registros guardados (desde otro navegador o Insomnia/Postman)
```
GET http://localhost:4000/api/pronosticos
```

---

## 💻 Opción 2: Desarrollo local

### Requisitos
- Node.js 18+
- MongoDB corriendo localmente o MongoDB Atlas (gratis)

### Backend

```bash
cd backend
cp .env.example .env
# Edita .env y ajusta MONGO_URI si usas Atlas:
# MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mundial_polla

npm install
npm run dev    # Inicia en http://localhost:4000
```

### Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev    # Inicia en http://localhost:3000
```

---

## 🌐 Despliegue en la nube

### Railway (fácil, gratuito)
1. Sube el proyecto a GitHub
2. Ve a [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Agrega un servicio MongoDB desde el marketplace de Railway
4. En el servicio backend, configura la variable `MONGO_URI` con la URL de Railway
5. Despliega el frontend en [Vercel](https://vercel.com) y actualiza el proxy en `vite.config.js`

### Variables de entorno en producción
```
MONGO_URI=<tu URI de MongoDB>
PORT=4000
```

---

## 📋 API Endpoints

| Método | Ruta                 | Descripción                  |
|--------|----------------------|------------------------------|
| POST   | /api/pronosticos     | Guardar nuevo pronóstico     |
| GET    | /api/pronosticos     | Listar todos los pronósticos |
| GET    | /api/health          | Health check                 |

### Ejemplo de payload POST `/api/pronosticos`

```json
{
  "nombre": "Carlos Gómez",
  "cedula": "1020304050",
  "telefono": "3001234567",
  "correo": "carlos@mail.com",
  "factura": "FAC-2024-001",
  "semifinal1": { "equipo1": "Brasil", "goles1": 2, "equipo2": "Argentina", "goles2": 1 },
  "semifinal2": { "equipo1": "Francia", "goles1": 3, "equipo2": "España", "goles2": 2 },
  "final":      { "equipo1": "Brasil", "goles1": 1, "equipo2": "Francia", "goles2": 0 }
}
```

---

## 🎨 Funcionalidades

- ✅ **Paso 1** – Registro: Nombre, Cédula, Teléfono, Correo, Nº Factura  
- ✅ **Paso 2** – Pronósticos: Semifinal 1, Semifinal 2 y Final con selección de equipos y marcador  
- ✅ **Paso 3** – Confirmación: Genera imagen descargable con el pronóstico y mensaje de éxito  
- ✅ Guardado en MongoDB  
- ✅ Diseño temático Copa del Mundo

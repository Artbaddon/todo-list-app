# 📋 Sistema de Gestión de Tareas (Todo List)

Un sistema completo de gestión de tareas desarrollado con Node.js, Express, MongoDB y funcionalidad de notificaciones por email.

## 🚀 Características

- ✅ **Gestión de Tareas**: Crear, editar, eliminar y asignar tareas
- 👥 **Sistema de Usuarios**: Autenticación y autorización con JWT
- 📧 **Notificaciones por Email**: Envío automático de emails al crear/asignar tareas
- 📎 **Adjuntos**: Subida y gestión de archivos adjuntos

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Email**: Nodemailer + Gmail SMTP
- **Plantillas**: EJS para emails HTML
- **Seguridad**: bcrypt para hash de contraseñas
- **Archivos**: Multer para manejo de uploads

## 📋 Prerequisitos

Antes de instalar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- [Git](https://git-scm.com/)
- Una cuenta de Gmail (para notificaciones)

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd todo-list
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración del Servidor
SERVER_PORT=3000

# Configuración JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_segura

# Configuración de MongoDB
MONGO_URI=mongodb://localhost:27017/todo-list-db

# Configuración de Email (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion-gmail
```

### 4. Configurar Gmail para Envío de Emails

#### 4.1 Habilitar Autenticación de 2 Factores
1. Ve a [Google Account](https://myaccount.google.com/)
2. Navega a **Seguridad** → **Verificación en 2 pasos**
3. Activa la verificación en 2 pasos

#### 4.2 Generar Contraseña de Aplicación
1. En **Seguridad** → **Verificación en 2 pasos** → **Contraseñas de aplicaciones**
2. Selecciona **Correo** y tu dispositivo
3. Copia la contraseña de 16 caracteres generada
4. Úsala como valor de `EMAIL_PASS` en tu archivo `.env`

### 5. Configurar MongoDB

#### Opción A: MongoDB Local
```bash
# Iniciar MongoDB (Windows)
mongod

```

### 6. Estructura de Directorios

El proyecto tiene la siguiente estructura:

```
todo-list/
├── app/
│   └── app.js                 # Configuración principal de Express
├── config/
│   ├── db/
│   │   └── connection.js      # Conexión a MongoDB
│   ├── emails/
│   │   └── task-created.ejs   # Plantilla de email
│   └── views/
│       └── email/
│           └── emailjs.js     # Configuración de emails
├── controllers/
│   ├── auth.controller.js     # Controlador de autenticación
│   ├── task.controller.js     # Controlador de tareas
│   └── user.controller.js     # Controlador de usuarios
├── middleware/
│   ├── auth.middleware.js     # Middleware de autenticación
│   └── fileUpload.middleware.js # Middleware de archivos
├── models/
│   ├── task.model.js          # Modelo de tareas
│   └── user.model.js          # Modelo de usuarios
├── routes/
│   ├── auth.router.js         # Rutas de autenticación
│   ├── task.router.js         # Rutas de tareas
│   └── user.router.js         # Rutas de usuarios
├── uploads/
│   └── tasks/                 # Archivos adjuntos
├── utils/
│   └── file.utils.js          # Utilidades de archivos
├── .env                       # Variables de entorno
├── package.json
└── server.js                  # Punto de entrada
```

## 🚀 Ejecución

### Modo Desarrollo
```bash
npm run dev
```


El servidor se iniciará en `http://localhost:3000`

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear nueva tarea
- `GET /api/tasks/:id` - Obtener tarea específica
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario específico
- `PUT /api/users/:id` - Actualizar usuario

## 📧 Sistema de Notificaciones

El sistema envía automáticamente emails cuando:
- Se crea una nueva tarea

## 📁 Manejo de Archivos

- Los archivos se suben a `uploads/tasks/`
- Formatos soportados: PDF, DOC, DOCX, JPG, PNG
- Tamaño máximo: 10MB por archivo


## 📝 Scripts Disponibles

```bash
npm start      # Iniciar en producción
npm run dev    # Iniciar en desarrollo con nodemon
npm test       # Ejecutar tests (si están configurados)
```
## 📚 Recursos Adicionales

- [Documentación de Node.js](https://nodejs.org/docs/)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Nodemailer](https://nodemailer.com/)

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado por Sebastian Sotelo

---

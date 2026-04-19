# ModProWeb--Dev6

# Gestión Proyecto - Programador Web (Dev6)

## 📖 Descripción del Proyecto
Este proyecto es una aplicación web Full Stack desarrollada para la asignatura Módulo Programador Web. El sistema permite [COMPLETAR ACÁ BREVEMENTE QUÉ HACE TU SISTEMA], ofreciendo una interfaz web moderna y un backend seguro conectado a una base de datos relacional.

## ⚙️ Instrucciones de Instalación y Uso Básico

### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/TU-USUARIO/ModProWeb--Dev6.git
cd ModProWeb--Dev6
\`\`\`

### 2. Configurar el Backend (Django Rest Framework)
\`\`\`bash
cd Backend
python -m venv venv
source venv/Scripts/activate  # En Windows
pip install -r requirements.txt
# Crear archivo .env basándose en .env_modelo
python manage.py migrate
python manage.py runserver
\`\`\`

### 3. Configurar el Frontend (Angular)
\`\`\`bash
cd ../Frontend
npm install
ng serve
\`\`\`
*El uso básico consiste en levantar ambos servidores localmente; la API de Django correrá en el puerto 8000 y el Frontend de Angular en el puerto 4200.*

## 📋 Especificación de Requerimientos

### Requerimientos Funcionales (RF)
1. El sistema debe permitir a los usuarios registrarse e iniciar sesión de forma segura.
2. El usuario debe poder visualizar un listado principal con los registros/servicios disponibles en la base de datos.
3. El sistema debe permitir al administrador crear, editar y eliminar registros mediante endpoints del backend.
4. El sistema debe contar con un buscador o sistema de filtros en la vista principal.
5. El usuario debe poder actualizar la información básica de su perfil.

### Requerimientos No Funcionales (RNF)
1. **Seguridad:** Las contraseñas deben estar encriptadas y se debe utilizar un archivo `.env` para proteger las credenciales de conexión a MySQL.
2. **Usabilidad:** La interfaz Frontend desarrollada en Angular debe ser intuitiva y contar con estilos estructurados.
3. **Arquitectura:** El sistema debe respetar la separación estricta en dos carpetas independientes: Frontend (Angular) y Backend (Django DRF).

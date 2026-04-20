# Proyecto Dev6 - EV1 🚀

## 📌 Descripción del Proyecto
Este proyecto corresponde a la evaluación EV1 del módulo Programador Web.  
Tiene como objetivo la puesta en marcha de una aplicación web utilizando:

- Angular (Frontend)
- Bootstrap (estilos locales)
- Django Rest Framework (Backend)
- MySQL (Base de datos)

La aplicación permite validar la correcta integración entre frontend y backend mediante un endpoint de prueba.

---

## 🎯 Problema que resuelve
El proyecto busca demostrar la integración completa de tecnologías modernas para el desarrollo web, permitiendo estructurar una aplicación escalable y mantenible.

---

## 💡 Propuesta de Valor
Brinda una base funcional para el desarrollo de aplicaciones web completas, facilitando la conexión entre interfaz de usuario, lógica de negocio y persistencia de datos.

---

## ⚙️ Tecnologías utilizadas
- Angular CLI
- Bootstrap (instalado vía npm)
- Django
- Django Rest Framework
- MySQL
- Python Decouple

---

## 📂 Estructura del proyecto

ModPWeb--Dev6/
│
├── Frontend/
│ └── frontend-app/
│
├── Backend/
│ ├── core/
│ ├── api/
│ ├── env/
│ ├── requirements.txt
│
└── README.md


---

## 🚀 Instalación

### 🔹 Frontend
```bash
cd Frontend/frontend-app
npm install
ng serve

cd Backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

🧪 Uso básico

Acceder a:

http://127.0.0.1:8000/api/test-conexion/

Permite:

visualizar registros
crear nuevos registros
probar la conexión con la base de datos
📋 Requerimientos Funcionales (RF)
El sistema debe permitir visualizar registros almacenados en la base de datos.
El sistema debe permitir crear nuevos registros mediante el endpoint API.
El sistema debe permitir validar la conexión entre backend y base de datos.
El sistema debe integrar un frontend funcional con Angular.
El sistema debe permitir la interacción básica mediante una interfaz web.
📋 Requerimientos No Funcionales (RNF)
El sistema debe ser accesible desde un navegador web.
El sistema debe utilizar tecnologías modernas y escalables.
El sistema debe garantizar la seguridad de credenciales mediante el uso de variables de entorno (.env).
🔐 Configuración de entorno



Alejandro Corvalán
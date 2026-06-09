import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pedagogia.models import Categoria, Asignatura, Recurso
from django.contrib.auth import get_user_model

User = get_user_model()
admin_user = User.objects.filter(username='admin').first()

if not admin_user:
    admin_password = os.getenv('SEED_ADMIN_PASSWORD', 'Admin1234!')
    admin_user = User.objects.create_superuser(
        username=os.getenv('SEED_ADMIN_USERNAME', 'admin'),
        email=os.getenv('SEED_ADMIN_EMAIL', 'admin@edutools.edu.ar'),
        password=admin_password
    )
    # create_superuser no setea el rol, así que el campo queda en el default
    # 'asesor'. Lo forzamos a 'admin' para que coincida con sus permisos.
    admin_user.rol = 'admin'
    admin_user.save(update_fields=['rol'])
    print("Superusuario creado exitosamente. (Cambiá SEED_ADMIN_PASSWORD en el .env)")

mockData = [
      { 
        "titulo": 'Llamado a la Acción: Video', 
        "categoria": 'CTA', 
        "asignatura": 'Matematicas',
        "html": """<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><span class="material-symbols-outlined" style="vertical-align: middle; color: white;">play_circle</span></strong></em>
        <strong style="border-color: #003087;">Video </strong>
      </span>
    </p>
    <p>Introducción o invitación al video</p>
    <p class="card-text"><span style="color: #236fa1;">Ver video (LINK del video)</span></p>
  </div>
</div>"""
      },
      { 
        "titulo": 'Acordeón de Contenidos', 
        "categoria": 'ORGANIZADOR', 
        "asignatura": 'Historia',
        "html": """<div class="dp-panels-wrapper dp-accordion-default dp-panel-color-dp-secondary dp-panel-active-color-dp-primary">
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading "><strong>Titulo 1</strong></h3>
    <div class="dp-panel-content "><p>TEXTO - TEXTO - TEXTO</p></div>
  </div>
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading "><strong>Titulo 2</strong></h3>
    <div class="dp-panel-content "><p>TEXTO - TEXTO - TEXTO</p></div>
  </div>
</div>"""
      },
      { 
        "titulo": 'Resaltado: Importante', 
        "categoria": 'RESALTADO', 
        "asignatura": 'Psicologia',
        "html": """<div class="dp-callout dp-callout-placeholder card dp-callout-position-default dp-callout-type-info dp-callout-color-danger">
  <div class="dp-callout-side-emphasis">
    <span class="material-symbols-outlined dp-icon dp-default-icon text-white" style="font-size: 24px; display: block; margin-top: 15px;">warning</span>
  </div>
  <div class="card-body">
    <h3 class="card-title">Atención / Importante </h3>
    <p class="card-text" style="text-align: left;">
      <i><span>TEXTO A RESALTAR</span></i>
    </p>
  </div>
</div>"""
      },
      { 
        "titulo": 'Llamado a la Acción: Lectura', 
        "categoria": 'CTA', 
        "asignatura": 'Matematicas',
        "html": """<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><span class="material-symbols-outlined" style="vertical-align: middle; color: white;">menu_book</span></strong></em>
        <strong style="border-color: #003087;">Lectura</strong>
      </span>
    </p>
    <p>Introducción o invitación a lectura</p>
    <p><span><span style="color: #236fa1;">Acceso al documento (LINK)</span></span></p>
  </div>
</div>"""
      },
      { 
        "titulo": 'Llamado a la Acción: Podcast', 
        "categoria": 'CTA', 
        "asignatura": 'Historia',
        "html": """<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><span class="material-symbols-outlined" style="vertical-align: middle; color: white;">podcasts</span></strong></em>
        <strong style="border-color: #003087;">Podcast</strong>
      </span>
    </p>
    <p>Introducción o invitation a Podcast</p>
    <p><span><span style="color: #236fa1;">Acceso al audio (LINK)</span></span></p>
  </div>
</div>"""
      },
      { 
        "titulo": 'Llamado a la Acción: Consigna', 
        "categoria": 'CTA', 
        "asignatura": 'Psicologia',
        "html": """<div class="dp-callout card dp-callout-position-default dp-callout-type-title-bar dp-callout-color-lg-info" style="border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left;">
      <span style="font-size: 10pt;">
        <strong style="border-color: #003087;">
          <span class="material-symbols-outlined" style="vertical-align: middle; color: #003087;">assignment</span>
          Actividad: NOMBRE DE ACTIVIDAD
        </strong>
      </span>
    </p>
    <p class="card-text"><span>Introducción o invitación a la actividad</span></p>
    <p class="card-text"><span style="color: #236fa1;">Acceso a la consigna</span></p>
  </div>
</div>"""
      },
      { 
        "titulo": 'Profundización', 
        "categoria": 'RESALTADO', 
        "asignatura": 'Matematicas',
        "html": """<div class="dp-callout dp-callout-placeholder card dp-callout-position-default dp-callout-type-info dp-callout-color-lg-warning">
  <div class="dp-callout-side-emphasis">
    <span class="material-symbols-outlined dp-icon dp-default-icon text-white" style="font-size: 24px; display: block; margin-top: 15px;">lightbulb</span>
  </div>
  <div class="card-body">
    <h3 class="card-title">Para pensar / Para saber más</h3>
    <p class="card-text" style="text-align: left;">
      <i><span>TEXTO - TEXTO - TEXTO</span></i>
    </p>
  </div>
</div>"""
      },
      { 
        "titulo": 'Tabs Horizontales', 
        "categoria": 'ORGANIZADOR', 
        "asignatura": 'Historia',
        "html": """<div class="dp-panels-wrapper dp-tabs dp-panel-color-dp-secondary dp-panel-active-color-dp-primary">
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading">TITULO 1</h3>
    <div class="dp-panel-content"><p><strong>TEXTO 1</strong></p></div>
  </div>
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading">TITULO 2</h3>
    <div class="dp-panel-content"><p><strong>TEXTO 2</strong></p></div>
  </div>
</div>"""
      },
      { 
        "titulo": 'Resaltado Simple', 
        "categoria": 'RESALTADO', 
        "asignatura": 'Psicologia',
        "html": """<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p>TEXTO - TEXTO - TEXTO - TEXTO</p>
  </div>
</div>"""
      }
]

for item in mockData:
    cat, _ = Categoria.objects.get_or_create(nombre=item['categoria'])
    asig, _ = Asignatura.objects.get_or_create(nombre=item['asignatura'])
    Recurso.objects.get_or_create(
        titulo=item['titulo'],
        defaults={
            'categoria': cat,
            'asignatura': asig,
            'contenido': item['html'],
            'creado_por': admin_user
        }
    )

print("Mock components successfully seeded to the database.")

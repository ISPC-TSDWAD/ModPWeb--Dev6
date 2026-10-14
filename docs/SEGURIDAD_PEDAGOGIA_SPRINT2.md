# Seguridad del modulo de Pedagogia (Sprint 2)

Revision del codigo de `pedagogia/` despues de cerrar las correcciones de `users/`
(Issues #18 y #19). Aparecieron tres problemas del mismo tipo que habia marcado la
devolucion de Ciberseguridad, mas la validacion del HTML de los recursos.

Todo esto esta cubierto por `pedagogia/tests_seguridad.py`. Suite completa:
`python manage.py test users pedagogia` -> **42 tests OK** (eran 27).

---

## 1. Escalada de privilegios en el serializer de Recurso

**Problema.** `RecursoSerializer` tenia `read_only_fields = ['creado_por']` y nada mas.
`es_plantilla_base` y `copia_de` quedaban escribibles, asi que un asesor podia tomar su
copia personal y ascenderla a plantilla base institucional:

```
PATCH /api/pedagogia/recursos/12/
{"es_plantilla_base": true}

-> 200  el recurso del asesor pasa a verse como plantilla institucional
```

Es el mismo *mass assignment* que corregimos en `users` (#18), en otra app.

**Correccion.**

```python
read_only_fields = ['creado_por', 'es_plantilla_base', 'copia_de']
```

**Despues:**

```
PATCH /api/pedagogia/recursos/12/
{"titulo": "Mi copia editada", "es_plantilla_base": true}

-> 200  {"titulo": "Mi copia editada", "es_plantilla_base": false}
```

El titulo cambia; el privilegio no.

Como ahora nadie puede marcar una plantilla editando el recurso, se agrego
`POST /api/pedagogia/recursos/{id}/set-plantilla/`, que solo pueden usar admin y
maquetador. Es el mismo patron que `set-role` en usuarios: campo de solo lectura mas
endpoint dedicado con permiso. Un asesor que lo intenta recibe `403`.

La regla de negocio no cambia: si un asesor edita una plantilla base, el servidor le
sigue creando su copia personal con `copia_de` apuntando a la plantilla.

## 2. Catalogos abiertos a cualquier usuario

**Problema.** `CategoriaViewSet` y `AsignaturaViewSet` eran `ModelViewSet` con
`IsAuthenticated` a secas. Cualquier asesor podia crear, renombrar o borrar categorias
y asignaturas de toda la institucion.

**Correccion.** Permiso `LecturaTodosEscrituraEquipo` (`pedagogia/permissions.py`):
lectura para cualquier autenticado, escritura solo para admin y maquetador.

```
DELETE /api/pedagogia/categorias/3/   (como asesor)     -> 403
GET    /api/pedagogia/categorias/     (como asesor)     -> 200
POST   /api/pedagogia/categorias/     (como maquetador) -> 201
```

La app movil solo lee los catalogos para llenar los desplegables del formulario, asi que
no la afecta.

## 3. Borrado protegido que devolvia 500

**Problema.** `Recurso.categoria` y `Recurso.asignatura` usan `on_delete=PROTECT`. Borrar
una categoria con recursos lanzaba `ProtectedError` sin manejar: el servidor respondia
**500** y, con `DEBUG=False`, el cliente no se enteraba de que paso.

**Correccion.** `BorradoProtegidoMixin` atrapa `ProtectedError` y responde `409 Conflict`
con el motivo:

```json
{"detail": "No se puede borrar: todavia hay recursos que la usan."}
```

## 4. Contenido de los recursos sin validar (politica PSM-07)

**Problema.** `Recurso.contenido` guarda el HTML del recurso (acordeones, infografias) y
entraba tal cual. Un recurso con `<script>` queda guardado y se ejecuta despues en el
navegador de quien lo abra: XSS almacenado.

**Correccion.** `validate_contenido` rechaza `<script`, `<iframe`, `javascript:` y
atributos de evento (`onclick`, `onerror`, ...), tanto al crear como al copiar una
plantilla:

```
POST /api/pedagogia/recursos/
{"contenido": "<p>hola</p><script>fetch('/api/users/')</script>"}

-> 400  {"contenido": ["El contenido no puede traer scripts ni atributos de evento."]}
```

El HTML normal pasa sin problema (`<details><summary>Paso 1</summary>...`).

**Limite conocido.** Es una lista de rechazo, no un sanitizador completo: corta los casos
conocidos y sirve como primera barrera. Lo correcto para el proximo Sprint es sanitizar
con una libreria (`bleach`) y una lista blanca de etiquetas permitidas.

## 5. Limite de intentos de login (politica PSM-08)

Estaba documentada en la Wiki como pendiente. Se activo `ScopedRateThrottle` con un
alcance `login` sobre `CustomTokenObtainPairView`: **10 intentos por minuto y origen**.
Pasado ese numero el servidor responde `429 Too Many Requests`. El valor se puede cambiar
con la variable de entorno `THROTTLE_LOGIN` sin tocar el codigo.

Solo afecta al endpoint de token: el resto de la API no tiene limite, porque las vistas
no declaran `throttle_scope`.

**Limite conocido.** El contador vive en la cache del proceso. En PythonAnywhere con un
solo worker alcanza; con varios workers el limite seria por worker.

---

## Lo que quedo pendiente (Sprint 3)

- **Paginacion.** `GET /api/pedagogia/recursos/` devuelve la lista entera. No se activo
  ahora a proposito: la app movil espera un array y romperia con el formato
  `{count, next, results}` de DRF. Hay que cambiar las dos puntas juntas.
- **Busqueda y filtros** por asignatura y tipo (`django-filter`).
- **Sanitizado real del contenido** con `bleach`.
- **Campo `activo`.** El modelo lo tiene pero el borrado es fisico y el listado no lo
  filtra. O se usa como borrado logico o se saca.

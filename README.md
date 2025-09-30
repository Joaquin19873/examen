Proyecto: Sitio Web para Clínica VitalCare

Descripción:
-------------
Este proyecto es un sitio web responsivo para una clínica que permite mostrar servicios médicos, listar doctores y especialidades, reservar citas online y visualizar las citas reservadas.

Tecnologías usadas:
-------------------
- HTML5 con estructura semántica (<header>, <nav>, <section>, <footer>)
- CSS3 y Bootstrap 5 para diseño responsivo y adaptativo
- JavaScript para validación de formularios, manipulación del DOM y almacenamiento local (localStorage)

Estructura de carpetas:
-----------------------
/css/       -> Archivos CSS personalizados
/js/        -> Archivos JavaScript con validaciones y lógica
/img/       -> Imágenes optimizadas para el sitio
index.html  -> Página de inicio con presentación y carrusel de imágenes
especialidades.html -> Lista de servicios médicos con tarjetas y botón para reservar
reserva.html -> Formulario para reservar cita con validación y confirmación dinámica
citas.html  -> Tabla que muestra todas las citas reservadas

Funcionamiento:
---------------
1. En la página "Especialidades" se muestran las especialidades médicas disponibles con un botón para reservar.
2. En "Reserva de Cita" el paciente ingresa su nombre, DNI (validado para 8 dígitos numéricos), especialidad deseada y fecha/hora.
3. El formulario valida que todos los campos estén completos y que el DNI sea correcto.
4. Al enviar, la cita se guarda en el almacenamiento local del navegador (localStorage).
5. Se muestra una confirmación dinámica con los datos ingresados.
6. En "Citas Reservadas" se listan todas las citas guardadas en una tabla, cargadas dinámicamente desde localStorage.
7. El diseño es 100% responsivo usando Bootstrap 5, adaptándose a dispositivos móviles y escritorio.

Instrucciones para ejecutar:
-----------------------------
- Abrir cualquiera de los archivos .html en un navegador moderno (Chrome, Firefox, Edge).
- Para reservar una cita, ir a reserva.html, llenar el formulario y enviar.
- Para ver las citas reservadas, ir a citas.html.
- No se requiere servidor, funciona localmente.

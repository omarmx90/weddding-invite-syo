# Visión de producto — Invitación Silvia & Omar

## Propósito

Invitación digital premium y personalizable para Silvia y Omar (16 de octubre de 2026). Los invitados abren una experiencia web mobile-first desde una URL privada y se sienten bienvenidos a un momento íntimo y cinematográfico — no a una página de marketing ni a una plantilla genérica.

Es una pequeña aplicación web móvil premium: emocional, refinada y fácil de recorrer con una sola mano.

**Idioma oficial del producto:** español de México (`es-MX`).

## Usuarios objetivo

| Audiencia | Necesidades |
| --- | --- |
| Invitados a la boda (principal) | Fecha, lugar, vestimenta, RSVP, mapas y calidez — casi siempre en el celular |
| Familia y amigos cercanos | Saludo personalizado, lugares reservados, contacto por WhatsApp |
| Pareja / anfitriones (secundario) | Actualizar contenido con seguridad; más adelante: panel RSVP y gestión de invitados |
| Quienes llegan por QR / impreso | Carga rápida desde una URL corta en redes móviles |

Dispositivos primarios: iPhone (iOS Safari) y Android (Chrome), aprox. 360–430 px de ancho. Desktop y tablet deben verse excelentes, pero el producto es móvil.

## Principios de experiencia

1. **Emoción antes que información** — El primer viewport define el sentimiento; la logística viene después.
2. **Nativo móvil** — Safe areas, alcance del pulgar, chrome del navegador y tamaños táctiles son de primer orden.
3. **Lujo silencioso** — Contención en tipografía, color, motion y cromo. Sin estética SaaS.
4. **Personal** — Textos y URLs deben sentirse escritos para un invitado o familia (futuro).
5. **El rendimiento es hospitalidad** — Teléfonos lentos y redes débiles siguen sintiéndose intencionales.
6. **Contenido ≠ UI** — Los datos de la boda viven en una capa de contenido; los componentes solo los renderizan.
7. **Entrega progresiva** — Publicar un vertical slice pulido y luego profundizar secciones.

## Secciones iniciales

Implementado ahora:

1. **Portada / Hero** — Nombres, “Nos casamos”, fecha, CTA “Ver invitación”
2. **Introducción** — Transición suave hacia la invitación
3. **Ceremonia religiosa** — Detalles (placeholders donde falte información)
4. **Recepción** — Detalles (placeholders donde falte información)

Diferido (planeado, aún no construido):

- Mapas / cómo llegar (URLs reales)
- Agregar al calendario
- Código de vestimenta y mesa de regalos
- Itinerario y countdown
- Galería de fotos
- Flujo de RSVP (“Confirma tu asistencia”)
- Contacto por WhatsApp
- Rutas personalizadas por invitado (`/i/[slug]`)
- Panel administrativo de RSVP
- Modo post-boda

## Capacidades futuras

| Capacidad | Intención |
| --- | --- |
| Invitaciones personalizadas | URLs tipo `/i/familia-montero` con texto y lugares por invitado |
| Lugares reservados | Cupo por código de invitación |
| RSVP | Confirmar / declinar / notas, con persistencia |
| Ceremonia y recepción | Lugar, hora, notas |
| Mapas | Deep links a Google Maps y embed opcional |
| Calendario | `.ics` / Agregar al calendario |
| Vestimenta y regalos | Orientación clara y elegante |
| Itinerario | Timeline del día |
| Galería | Fotografía optimizada |
| Countdown | Solo antes de la boda; ocultar o transformar después |
| WhatsApp | Atajos de contacto con los anfitriones |
| Panel admin | Vista de RSVPs para la pareja |
| URLs compatibles con QR | Enlaces cortos, estables e imprimibles |
| Modo post-boda | Agradecimiento / foco en galería después de la fecha |

## Criterios de éxito (producto)

- Un invitado entiende quién, qué y cuándo en la primera pantalla.
- El CTA hacia la invitación se siente ceremonial, no como un “saber más” genérico.
- La experiencia es propia de Silvia y Omar — no intercambiable con otra boda.
- Lighthouse móvil y sensación en dispositivo real siguen siendo quality gates al incorporar fotografía.

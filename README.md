# PROYECTO

Deseos de Alisha

# OBJETIVO

Construir una aplicación web moderna, simple y rápida que permita a los invitados visualizar una lista de regalos para baby shower, reservarlos o liberarlos sin autenticación, creando una experiencia emocional y cálida para celebrar la llegada de Alisha.

# STACK TECNOLÓGICO

- Frontend: React + Vite + TypeScript
- Estilos: TailwindCSS (modo moderno + diseño limpio)
- UI Components: shadcn/ui
- Estado: React Query (opcional) o estado local simple
- Backend: Supabase (recomendado) o API REST simple (Node/NestJS)
- Deploy: Vercel

# DISEÑO / UX

- Tema visual:
  - Base: colores pasteles
  - Inspiración: manzanitas verdes y rojas
  - Estilo: suave, limpio, minimalista, moderno
  - Experiencia emocional: cálido, cercano, especial

- Paleta sugerida:
  - Verde pastel: #A8E6A3
  - Rojo suave: #FF9AA2
  - Fondo: #FFF7F5
  - Texto: #333333
  - Blanco: #FFFFFF

- Tipografía:
  - Moderna, redondeada, amigable (ej: Inter o Poppins)

# EXPERIENCIA DE USUARIO

- Sin login
- Sin registro
- Acceso directo al abrir la página
- Máximo 3 clics para completar una acción
- Scroll natural entre secciones
- Navegación guiada por scroll

# ESTRUCTURA DE LA PÁGINA

## 1. HERO SECTION

Sección de bienvenida emocional que:
- Comunica el contexto con calidez
- Genera conexión emocional
- Prepara al usuario antes de ver regalos
- Botón "Ver lista de deseos" para hacer scroll

## 2. CATEGORÍAS DE REGALOS

La lista se organiza en tres categorías claras:

### A. Esenciales (⭐)
- Icono: ⭐
- Color: Verde
- Descripción: "Los más importantes para Alisha"

### B. Opcionales (🎁)
- Icono: 🎁
- Color: Azul suave
- Descripción: "Complementos útiles"

### C. Detallitos (💝)
- Icono: 💝
- Color: Rosa pastel
- Descripción: "Detalles pequeños y emotivos"

Cada categoría tiene:
- Título sticky que se queda fijo al hacer scroll
- Barra de color decorativa
- Grid de regalos

## 3. REGALOS

Mostrar listado de regalos con:

- Nombre
- Imagen (opcional)
- Estado:
  - Disponible
  - Reservado
  - Compartido (con progreso)
- Categoría (Esencial/Opcional/Detallito)

# TIPOS DE REGALOS

### A. Regalo simple

- Solo 1 persona puede reservar
- Estados:
  - Disponible
  - Reservado

### B. Regalo compartido

- Definido por:
  - maxContributors (ej: 2, 3, 4)
- Mostrar:
  - "X de Y reservados"
  - Barra de progreso
  - Lista de participantes (solo iniciales)

# FUNCIONALIDADES

## 1. RESERVAR REGALO

Al hacer click en "Reservar" o "Aportar":

Abrir modal con formulario:

- Nombre
- Apellido
- Correo

Reglas:

- No permitir repetir email en el mismo regalo
- No permitir si está completo
- No permitir si el email ya tiene reserva en otro regalo

## 2. LIBERAR RESERVA

Botón flotante "Liberar mi reserva" en la esquina superior derecha:

Modal simple que pide solo:

- Correo electrónico

Validación:

- Si el email existe en algún regalo → elimina la reserva
- Si no existe → muestra error

## 3. PRIVACIDAD

- No mostrar datos completos
- Mostrar solo iniciales:

Ejemplo:
Juan Pérez → J.P.

## 4. ESTADOS VISUALES

- Disponible:
  - Botón: "Reservar" o "Aportar"

- Reservado:
  - Badge: "Completado"
  - Texto: "Reservado"
  - Icono: ✓

- Compartido:
  - Barra de progreso
  - Texto: "X de Y reservados"
  - Lista:
    - M.L.
    - C.R.

# MODELO DE DATOS

Gift:

- id: string
- name: string
- image?: string
- type: 'single' | 'group'
- maxContributors?: number
- category: 'essential' | 'optional' | 'detail'
- contributors: Contributor[]

Contributor:

- name: string
- lastname: string
- email: string

# REGLAS DE NEGOCIO

- Un email = una reserva (en un solo regalo)
- Regalo simple:
  - max 1 contributor

- Regalo compartido:
  - max = maxContributors

- Liberación:
  - match por email (solo email, no nombre/apellido)

# COMPONENTES PRINCIPALES

- Hero
- GiftList
- CategorySection
- GiftCard
- ReserveModal
- ReleaseByEmailModal
- Toast
- Decorations

# COMPORTAMIENTO

- UI reactiva
- Actualización inmediata después de reservar/liberar
- Scroll suave entre secciones
- Títulos sticky en categorías
- Animaciones de entrada escalonadas
- Decoraciones flotantes sutiles
- Toast notifications para feedback

# NO INCLUIR

- Login
- Autenticación
- Comentarios
- Confirmación de asistencia
- Emails automáticos
- Panel admin complejo
- Filtros o tabs
- Multi-idioma

# RESULTADO ESPERADO

- App rápida
- Intuitiva
- emocional y cálida
- Sin fricción para usuarios no técnicos
- Tiempo de uso por usuario < 1 minuto
- Experiencia especial para la llegada de Alisha

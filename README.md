# 📚 NEXUS LIBRARY 

## 📋 Documentacion del Proyecto

**Nexus Library** es una aplicación web futurista diseñada para la gestión y exploración de una biblioteca digital. El proyecto implementa una arquitectura modular con tecnologías web modernas, ofreciendo una experiencia inmersiva donde la tecnología y la literatura convergen.

### 🎯 Características Principales

- **Interfaz Futurista**: Diseño moderno con efectos visuales y animaciones
- **Sistema de Autenticación**: Registro e inicio de sesión con Firebase
- **Perfil de Usuario**: Modal interactivo para visualizar información del usuario
- **Carrito de Compras**: Sistema completo de gestión de productos
- **Catálogo Dinámico**: Exploración de libros con filtros por categoría
- **Arquitectura Modular**: Componentes reutilizables y código organizado

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
PARCIAL_1/
├── account/                    # Páginas de autenticación
│   ├── login.html             # Página de inicio de sesión
│   └── registro.html          # Página de registro
├── assets/                    # Recursos multimedia
│   ├── images/               # Imágenes generales
│   └── portadas/             # Portadas de libros
├── data/                     # Datos de la aplicación
│   └── books.json           # Base de datos de libros
├── pages/                   # Componentes modulares
│   ├── header.html         # Componente del encabezado
│   ├── footer.html         # Componente del pie de página
│   └── 404.html           # Página de error 404
├── Scripts/                # Lógica de la aplicación
│   ├── firebase-config.js  # Configuración de Firebase
│   ├── auth-state.js      # Gestión del estado de autenticación
│   ├── login.js           # Lógica de inicio de sesión
│   ├── registro.js        # Lógica de registro
│   └── script.js          # Script principal
├── styles/                 # Hojas de estilo
│   ├── style.css          # Estilos principales
│   ├── header.css         # Estilos del header
│   ├── footer.css         # Estilos del footer
│   ├── login.css          # Estilos de login
│   ├── registro.css       # Estilos de registro
│   ├── profile-modal.css  # Estilos del modal de perfil
│   └── 404.css           # Estilos de página 404
├── Index.html             # Página principal
└── README.md             # Documentación del proyecto
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y Flexbox/Grid
- **JavaScript ES6+**: Lógica de la aplicación con módulos
- **Bootstrap 5**: Framework CSS para componentes responsivos
- **Bootstrap Icons**: Iconografía consistente

### Backend/Servicios
- **Firebase Authentication**: Sistema de autenticación
- **Firebase Firestore**: Base de datos NoSQL(base de datos no relacional)
- **JSON**: Almacenamiento de datos de libros

### Herramientas de Desarrollo
- **Módulos ES6**: Organización modular del código
- **Fetch API**: Comunicación asíncrona
- **LocalStorage**: Persistencia de datos del carrito

## 📱 Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- **Registro de usuarios**: Formulario completo con validación
- **Inicio de sesión**: Autenticación segura con Firebase
- **Gestión de estado**: Detección automática del estado de login
- **Perfil de usuario**: Modal interactivo con información personal

### 🛒 Sistema de Carrito
- **Agregar productos**: Funcionalidad completa de carrito
- **Gestión de cantidad**: Incrementar/decrementar productos
- **Persistencia**: Datos guardados en LocalStorage
- **Interfaz intuitiva**: Modal con diseño moderno

### 📖 Catálogo de Libros
- **Visualización dinámica**: Carga de libros desde JSON
- **Filtros por categoría**: Ciencia ficción, fantasía, etc.
- **Detalles del libro**: Modal con información completa
- **Recomendaciones**: Sistema de libros destacados

### 🎨 Interfaz de Usuario
- **Diseño futurista**: Efectos visuales y animaciones
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **Modales interactivos**: Múltiples modales para diferentes funciones

## 🔄 Flujo de Usuario

### Usuario No Autenticado
1. **Página Principal**: Exploración del catálogo
2. **Registro**: Crear cuenta nueva
3. **Login**: Iniciar sesión existente

### Usuario Autenticado
1. **Header Dinámico**: Botón de perfil en lugar de "Únete a Nexus"
2. **Modal de Perfil**: Información personal y estadísticas
3. **Funcionalidades Completas**: Acceso a todas las características
4. **Cierre de Sesión**: Opción disponible en el modal de perfil

## 🎯 Características Técnicas

### Modularidad
- **Componentes Reutilizables**: Header y footer como módulos
- **Separación de Responsabilidades**: Cada script tiene una función específica
- **Carga Dinámica**: Componentes cargados asíncronamente

### Seguridad
- **Validación de Formularios**: Validación tanto cliente como servidor
- **Autenticación Segura**: Implementada con Firebase Auth

## 🎨 Guía de Estilos

### Paleta de Colores
```css
:root {
    --primary-bg: #0a192f;        /* Azul oscuro principal */
    --secondary-bg: #172a45;      /* Azul secundario */
    --accent-color: #4cc9f0;      /* Azul cian */
    --accent-secondary: #7209b7;   /* Púrpura */
    --text-primary: #e6f1ff;      /* Blanco azulado */
    --text-secondary: #8892b0;     /* Gris azulado */
}
```

### Tipografía
- **Principal**: Montserrat (300, 400, 600)
- **Títulos**: Orbitron (400, 500)
- **Iconos**: Bootstrap Icons

### 🎯 Características Destacadas
- **Experiencia de Usuario**: Interfaz intuitiva y moderna
- **Funcionalidad Completa**: Todas las características solicitadas
- **Código Limpio**: Organización modular y buenas prácticas
- **Responsive Design**: Funciona en todos los dispositivos

---




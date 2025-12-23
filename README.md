<<<<<<< HEAD
# Automatizacion_Reporte_Appa_Test
<<<<<<< HEAD
# Automatizacion_Reporte_Appa_Test
=======

=======
>>>>>>> cc51565778160f2f1e6a486d45221e980bcfe543
# 🧪 QA Automation – Playwright + TypeScript (POM)

[![Playwright](https://img.shields.io/badge/Playwright-Automation-green)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![Testing](https://img.shields.io/badge/Test-Automation-orange)](#)

---

## 📌 Descripción del proyecto

Este proyecto corresponde a una **automatización de pruebas funcionales end-to-end** utilizando **Playwright con TypeScript**, aplicada sobre diferentes escenarios del sitio de práctica **The Internet (Herokuapp)** y el editor **TinyMCE**.

El objetivo principal es demostrar:
- Diseño de **casos de prueba manuales**
- Automatización basada en **Page Object Model (POM)**
- Separación de **Smoke, Component y Regression tests**
- Generación de **evidencias automáticas (screenshots + attachments)** en el **HTML Report**
- Buenas prácticas de automatización a nivel profesional

---

## 🧩 Escenarios automatizados

### 1️⃣ TinyMCE – Editor de texto
🔗 URL original (con problemas de edición):  
https://the-internet.herokuapp.com/tinymce  

🔗 URL funcional utilizada:  
https://www.tiny.cloud/docs/tinymce/latest/basic-example/

**Flujo automatizado:**
- Limpiar el editor
- Escribir un texto dinámico
- Aplicar formato (negrita / centrado)
- Cambiar color del texto
- Obtener el texto final y validarlo como string

📄 Spec:
- `tests/tinymce.spec.ts`

---

### 2️⃣ Nested Frames
🔗 URL:  
https://the-internet.herokuapp.com/nested_frames

**Flujo automatizado:**
- Acceder a frames anidados
- Leer los textos:
  - LEFT
  - MIDDLE
  - RIGHT
  - BOTTOM
- Validar contenido
- Resaltar visualmente los frames como evidencia (highlight)

📄 Spec:
- `tests/nestedFrames.spec.ts`

---

### 3️⃣ Windows (Multiple Windows)
🔗 URL:  
https://the-internet.herokuapp.com/windows

**Flujo automatizado:**
- Hacer click en **Click Here**
- Detectar nueva ventana
- Cambiar foco
- Cerrar ventana original
- Validar texto **"New Window"**

📄 Spec:
- `tests/windows.spec.ts`

---

## 🧪 Tipos de pruebas implementadas

| Tipo        | Descripción |
|------------|------------|
| **Smoke** | Validaciones básicas para asegurar que el flujo principal funciona |
| **Component** | Validación de funcionalidades específicas |
| **Regression** | Re-ejecución de flujos completos para asegurar estabilidad |

Los tests están etiquetados con:
- `@smoke`
- `@component`
- `@regression`

---

## 🗂️ Estructura del proyecto

```bash
├── src
│   ├── pages
│   │   ├── TinyCloudEditorPage.ts
│   │   ├── NestedFramesPage.ts
│   │   └── WindowsPage.ts
│   ├── data
│   │   └── editorColors.ts
│   └── utils
│       └── evidence.ts
│
├── tests
│   ├── tinymce.spec.ts
│   ├── nestedFrames.spec.ts
│   └── windows.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
<<<<<<< HEAD
>>>>>>> dbb95dc0506760019917d5c53a82f08575ebe4a6
=======
>>>>>>> cc51565778160f2f1e6a486d45221e980bcfe543

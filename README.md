<a id="top"></a>

<div align="center">

<img
  src="./docs/assets/mesa-ayuda-banner.svg"
  alt="Mesa de Ayuda 2.0 — gestión operativa, seguimiento y atención institucional"
  width="100%"
/>

<br />

<p>
  <strong>Frontend operativo de Mesa de Ayuda del Ecosistema Integral DGCP.</strong>
</p>

<p>
  Dashboard · Atenciones · Seguimiento · Organizador · Perfil · Integración institucional
</p>

<p>
  <img src="https://img.shields.io/badge/Frontend-saneado-22C55E?style=for-the-badge" alt="Frontend saneado" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
</p>

<p>
  <img src="https://img.shields.io/badge/Auth-v2-059669?style=for-the-badge" alt="Auth v2" />
  <img src="https://img.shields.io/badge/React_Doctor-100%2F100-22C55E?style=for-the-badge&logo=react&logoColor=white" alt="React Doctor 100 de 100" />
  <img src="https://img.shields.io/badge/Tests-29%2F29-22C55E?style=for-the-badge&logo=vitest&logoColor=white" alt="29 de 29 tests" />
  <img src="https://img.shields.io/badge/UTF--8-sin_BOM-0EA5E9?style=for-the-badge" alt="UTF-8 sin BOM" />
</p>

<p>
  <img src="https://img.shields.io/badge/E2E_Login→Mesa-PASS-22C55E?style=for-the-badge&logo=playwright&logoColor=white" alt="E2E Login a Mesa aprobado" />
  <img src="https://img.shields.io/badge/npm_audit_prod-0_vulnerabilidades-22C55E?style=for-the-badge&logo=npm&logoColor=white" alt="npm audit producción cero vulnerabilidades" />
</p>

<p>
  <a href="#-vista-previa"><strong>Vista previa</strong></a>
  ·
  <a href="#️-arquitectura"><strong>Arquitectura</strong></a>
  ·
  <a href="#-capacidades-del-producto"><strong>Capacidades</strong></a>
  ·
  <a href="#-integración-auth-v2"><strong>Auth v2</strong></a>
  ·
  <a href="#️-stack-tecnológico"><strong>Stack</strong></a>
  ·
  <a href="#-calidad"><strong>Calidad</strong></a>
  ·
  <a href="#-diseño"><strong>Figma</strong></a>
</p>

</div>

---

## ✨ Descripción

**Mesa de Ayuda 2.0** es el frontend operativo de atención y seguimiento dentro del **Ecosistema Integral DGCP**.

Su función es concentrar los flujos de registro, consulta y seguimiento de atenciones en una experiencia modular, consistente y preparada para integrarse con los servicios institucionales del ecosistema.

El acceso se realiza mediante la autenticación centralizada de **Login Access**, manteniendo a Mesa como un frontend de negocio independiente.

<table>
<tr>
<td width="33%" align="center" valign="top">

### 📊 Operación

Dashboard, indicadores y contexto general de trabajo.

</td>
<td width="33%" align="center" valign="top">

### 🧾 Atenciones

Registro, consulta y trazabilidad de solicitudes.

</td>
<td width="33%" align="center" valign="top">

### 🧭 Seguimiento

Filtros, detalle, historial y continuidad operativa.

</td>
</tr>
</table>

---

## 🖼️ Vista previa

<table>
  <tr>
    <td align="center"><strong>Seguimiento de atenciones</strong></td>
    <td align="center"><strong>Registro de atención</strong></td>
  </tr>
  <tr>
    <td width="50%">
      <img
        src="./docs/assets/seguimiento.png"
        alt="Pantalla de seguimiento de atenciones de Mesa de Ayuda 2.0"
      />
    </td>
    <td width="50%">
      <img
        src="./docs/assets/registrar-atencion.png"
        alt="Formulario de registro de atención de Mesa de Ayuda 2.0"
      />
    </td>
  </tr>
</table>

<p align="center">
  <sub>Los nombres y datos visibles en las capturas son demostrativos.</sub>
</p>

---

## 🏗️ Arquitectura

<p align="center">
  <img
    src="./docs/assets/mesa-ayuda-architecture.svg"
    alt="Arquitectura de Mesa de Ayuda 2.0 dentro del Ecosistema Integral DGCP"
    width="100%"
  />
</p>

<table>
<tr>
<td width="25%" align="center" valign="top">

<strong>01 · ENTRADA</strong>

<br /><br />

El usuario se autentica mediante Login Access.

</td>
<td width="25%" align="center" valign="top">

<strong>02 · HANDOFF</strong>

<br /><br />

Mesa recibe un <code>redirect-code</code> temporal de un solo uso.

</td>
<td width="25%" align="center" valign="top">

<strong>03 · SESIÓN</strong>

<br /><br />

El código se intercambia y el access token permanece únicamente en memoria.

</td>
<td width="25%" align="center" valign="top">

<strong>04 · OPERACIÓN</strong>

<br /><br />

Mesa consume su API mediante solicitudes autenticadas con Bearer.

</td>
</tr>
</table>

<p align="center">
  <img src="https://img.shields.io/badge/Login-independiente-2563EB?style=flat-square" alt="Login independiente" />
  <img src="https://img.shields.io/badge/Redirect--code-7C3AED?style=flat-square" alt="Redirect code" />
  <img src="https://img.shields.io/badge/Access_token-en_memoria-059669?style=flat-square" alt="Access token en memoria" />
  <img src="https://img.shields.io/badge/Refresh-HttpOnly-F59E0B?style=flat-square" alt="Refresh mediante cookie HttpOnly" />
  <img src="https://img.shields.io/badge/API-operativa-C2410C?style=flat-square" alt="API operativa" />
</p>

---

## 🧩 Capacidades del producto

<table>
<tr>
<td width="33%" valign="top">

<strong>📊 Dashboard</strong>

<br /><br />

Resumen operativo, métricas y visualizaciones para el trabajo diario.

<br /><br />

<code>dashboard</code> · <code>query</code> · <code>metrics</code>

</td>
<td width="33%" valign="top">

<strong>📝 Registro</strong>

<br /><br />

Captura estructurada de nuevas atenciones con validaciones y adjuntos.

<br /><br />

<code>forms</code> · <code>schemas</code> · <code>files</code>

</td>
<td width="33%" valign="top">

<strong>🔎 Seguimiento</strong>

<br /><br />

Consulta, filtros, paginación, detalle e historial de atenciones.

<br /><br />

<code>tracking</code> · <code>filters</code> · <code>history</code>

</td>
</tr>
<tr>
<td width="33%" valign="top">

<strong>🗓️ Organizador</strong>

<br /><br />

Vista de apoyo para organización y continuidad de actividades.

<br /><br />

<code>organizer</code> · <code>workflow</code>

</td>
<td width="33%" valign="top">

<strong>👤 Perfil</strong>

<br /><br />

Información administrativa del usuario y estado de seguridad.

<br /><br />

<code>profile</code> · <code>security</code>

</td>
<td width="33%" valign="top">

<strong>🔐 Autenticación integrada</strong>

<br /><br />

Entrada mediante redirect-code, intercambio de sesión, guards e inactividad.

<br /><br />

<code>auth</code> · <code>session</code> · <code>guards</code>

</td>
</tr>
</table>

---

## 🔐 Integración Auth v2

Mesa de Ayuda utiliza la sesión emitida por `auth_service` sin persistir tokens sensibles en Web Storage.

<table>
<tr>
<td width="33%" valign="top">

<strong>↗️ Exchange</strong>

<br /><br />

El <code>redirect-code</code> recibido desde Login Access se intercambia mediante el servicio de autenticación.

<br /><br />

<code>exchange-code</code>

</td>
<td width="33%" valign="top">

<strong>🧠 Access token</strong>

<br /><br />

El token de acceso permanece únicamente en memoria.

<br /><br />

<code>memory-only</code>

</td>
<td width="33%" valign="top">

<strong>🍪 Refresh</strong>

<br /><br />

La renovación utiliza la cookie <code>HttpOnly</code> administrada por backend.

<br /><br />

<code>cookie-first</code>

</td>
</tr>
<tr>
<td width="33%" valign="top">

<strong>🔄 F5</strong>

<br /><br />

Si la memoria se pierde al recargar, la sesión se restaura mediante <code>/auth/refresh</code>.

<br /><br />

<code>bootstrap</code> · <code>refresh</code>

</td>
<td width="33%" valign="top">

<strong>🔑 Bearer</strong>

<br /><br />

Las operaciones protegidas envían el access token mediante <code>Authorization: Bearer</code>.

<br /><br />

<code>authenticated API</code>

</td>
<td width="33%" valign="top">

<strong>🚪 Logout</strong>

<br /><br />

La salida revoca la sesión y limpia el estado local de autenticación.

<br /><br />

<code>logout</code> · <code>clear</code>

</td>
</tr>
</table>

<p align="center">
  <img src="https://img.shields.io/badge/Access-memory_only-059669?style=flat-square" alt="Access token solo en memoria" />
  <img src="https://img.shields.io/badge/Refresh-HttpOnly_cookie-2563EB?style=flat-square" alt="Refresh mediante cookie HttpOnly" />
  <img src="https://img.shields.io/badge/Web_Storage-zero_tokens-7C3AED?style=flat-square" alt="Cero tokens en Web Storage" />
  <img src="https://img.shields.io/badge/Bearer-API_auth-F59E0B?style=flat-square" alt="Bearer para API" />
</p>

### Flujo

```text
Login Access
     │
     ▼
redirect-code
     │
     ▼
Mesa de Ayuda
     │
     ▼
exchange-code
     │
     ├── access token → memoria
     └── refresh → cookie HttpOnly
     │
     ▼
API Mesa
     │
     └── Authorization: Bearer
```

---

## 🛠️ Stack tecnológico

<div align="center">

### Core

<img
  src="https://skillicons.dev/icons?i=react,ts,tailwind,vite,html,css&theme=dark&perline=6"
  alt="React, TypeScript, Tailwind CSS, Vite, HTML y CSS"
/>

<br />
<br />

<img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
<img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />

</div>

<br />

<table>
<tr>
<td width="50%" valign="top">

<strong>⚙️ Estado · Datos · Formularios</strong>

<br /><br />

<img src="https://img.shields.io/badge/React_Router-navigation-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router" />
<img src="https://img.shields.io/badge/TanStack_Query-data-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
<img src="https://img.shields.io/badge/Zustand-state-443E38?style=flat-square" alt="Zustand" />
<img src="https://img.shields.io/badge/React_Hook_Form-forms-EC5990?style=flat-square&logo=reacthookform&logoColor=white" alt="React Hook Form" />
<img src="https://img.shields.io/badge/Zod-validation-3E67B1?style=flat-square" alt="Zod" />

</td>
<td width="50%" valign="top">

<strong>🎛️ UI · Interacción</strong>

<br /><br />

<img src="https://img.shields.io/badge/Radix_UI-primitives-161618?style=flat-square&logo=radixui&logoColor=white" alt="Radix UI" />
<img src="https://img.shields.io/badge/Lucide_React-icons-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide React" />
<img src="https://img.shields.io/badge/Font_Awesome-icons-538DD7?style=flat-square&logo=fontawesome&logoColor=white" alt="Font Awesome" />
<img src="https://img.shields.io/badge/Motion-interaction-FFF312?style=flat-square&logo=framer&logoColor=111827" alt="Motion" />
<img src="https://img.shields.io/badge/Sonner-feedback-111827?style=flat-square" alt="Sonner" />

</td>
</tr>
<tr>
<td width="50%" valign="top">

<strong>🧪 Testing · Calidad</strong>

<br /><br />

<img src="https://img.shields.io/badge/Vitest-unit_tests-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
<img src="https://img.shields.io/badge/Testing_Library-components-E33332?style=flat-square&logo=testinglibrary&logoColor=white" alt="Testing Library" />
<img src="https://img.shields.io/badge/Playwright-integration_E2E-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright E2E" />
<img src="https://img.shields.io/badge/ESLint-quality-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" />
<img src="https://img.shields.io/badge/Prettier-format-F7B93E?style=flat-square&logo=prettier&logoColor=111827" alt="Prettier" />
<img src="https://img.shields.io/badge/React_Doctor-100%2F100-22C55E?style=flat-square&logo=react&logoColor=white" alt="React Doctor 100 de 100" />

</td>
<td width="50%" valign="top">

<strong>🎨 Diseño · Tooling</strong>

<br /><br />

<img
  src="https://skillicons.dev/icons?i=figma,git,github,npm,vscode&theme=dark&perline=5"
  alt="Figma, Git, GitHub, npm y Visual Studio Code"
/>

</td>
</tr>
</table>

---

## 🗂️ Arquitectura del código

<p align="center">
  <img
    src="./docs/assets/mesa-ayuda-code-map.svg"
    alt="Mapa visual de la organización del código de Mesa de Ayuda 2.0"
    width="100%"
  />
</p>

<details>
<summary><strong>Explorar estructura técnica</strong></summary>

<br />

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── attention-create/
│   ├── attentions/
│   ├── auth/
│   ├── dashboard/
│   ├── organizer/
│   ├── placeholders/
│   ├── profile/
│   └── tracking/
├── shared/
│   ├── api/
│   ├── catalogs/
│   ├── config/
│   ├── files/
│   ├── lib/
│   ├── navigation/
│   └── permissions/
└── main.tsx
```

</details>

<p align="center">
  <img src="https://img.shields.io/badge/Feature--based-architecture-7C3AED?style=flat-square" alt="Feature based architecture" />
  <img src="https://img.shields.io/badge/Strict-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="Strict TypeScript" />
  <img src="https://img.shields.io/badge/Component--driven-UI-06B6D4?style=flat-square&logo=react&logoColor=white" alt="Component driven UI" />
  <img src="https://img.shields.io/badge/Typed-contracts-059669?style=flat-square" alt="Typed contracts" />
</p>

---

## 🧪 Calidad

Mesa de Ayuda 2.0 mantiene un quality gate orientado a asegurar consistencia estructural, tipado, comportamiento, encoding y calidad React.

<table>
<tr>
<td width="25%" align="center" valign="top">

<strong>Encoding</strong>

<br /><br />

UTF-8 sin BOM y cero mojibake.

<br /><br />

<code>PASS</code>

</td>
<td width="25%" align="center" valign="top">

<strong>Static analysis</strong>

<br /><br />

TypeScript, ESLint y Prettier.

<br /><br />

<code>PASS</code>

</td>
<td width="25%" align="center" valign="top">

<strong>Testing</strong>

<br /><br />

Suite unitaria del frontend.

<br /><br />

<code>29 / 29</code>

</td>
<td width="25%" align="center" valign="top">

<strong>React</strong>

<br /><br />

Auditoría estructural con React Doctor.

<br /><br />

<code>100 / 100</code>

</td>
</tr>
</table>

Estado de certificación:

<p align="center">
  <img src="https://img.shields.io/badge/Encoding-PASS-22C55E?style=flat-square" alt="Encoding PASS" />
  <img src="https://img.shields.io/badge/Prettier-PASS-22C55E?style=flat-square" alt="Prettier PASS" />
  <img src="https://img.shields.io/badge/Structure-PASS-22C55E?style=flat-square" alt="Structure PASS" />
  <img src="https://img.shields.io/badge/TypeScript-PASS-22C55E?style=flat-square" alt="TypeScript PASS" />
  <img src="https://img.shields.io/badge/ESLint-PASS-22C55E?style=flat-square" alt="ESLint PASS" />
  <img src="https://img.shields.io/badge/Vitest-29%2F29-22C55E?style=flat-square&logo=vitest&logoColor=white" alt="29 de 29 pruebas" />
  <img src="https://img.shields.io/badge/Build-PASS-22C55E?style=flat-square&logo=vite&logoColor=white" alt="Build PASS" />
  <img src="https://img.shields.io/badge/React_Doctor-100%2F100-22C55E?style=flat-square&logo=react&logoColor=white" alt="React Doctor 100 de 100" />
  <img src="https://img.shields.io/badge/npm_audit_prod-0-22C55E?style=flat-square&logo=npm&logoColor=white" alt="npm audit producción cero vulnerabilidades" />
</p>

### Integración real

El flujo integrado **Login Access → Mesa de Ayuda** también fue validado mediante Playwright con autenticación real:

```text
Login
→ MFA
→ redirect-code
→ exchange-code
→ Mesa de Ayuda
→ API autenticada
→ refresh
→ F5
→ restauración de sesión
→ logout
```

<p align="center">
  <img src="https://img.shields.io/badge/Login→Mesa_E2E-PASS-22C55E?style=for-the-badge&logo=playwright&logoColor=white" alt="Integración Login a Mesa aprobada" />
</p>

---

## 🎨 Diseño

<div align="center">

<p>
  La interfaz se diseñó como parte del sistema visual del <strong>Ecosistema Integral DGCP</strong>,
  manteniendo consistencia entre layout, navegación, componentes y estados.
</p>

<p>
  <a href="https://www.figma.com/design/QajWuVBDoFpZ4bSQqI4ZML/Mesa-de-Ayuda-2.0?node-id=0-1&t=mOrXzvU57rhdF9P2-1">
    <img src="https://img.shields.io/badge/Explorar_Mesa_de_Ayuda_2.0-Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Explorar Mesa de Ayuda 2.0 en Figma" />
  </a>
</p>

</div>

---

## 👨‍💻 Autor

<div align="center">

<br />

<img
  src="https://github.com/Javiergr99.png"
  width="92"
  height="92"
  alt="Javier Garcia"
/>

### Javier Garcia

**Programador Jr · Frontend Developer · UX/UI**

Diseño y desarrollo de interfaces modulares, consistentes y orientadas a producto.

<br />

<a href="https://github.com/Javiergr99">
  <img src="https://img.shields.io/badge/GitHub-Javiergr99-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub de Javier Garcia" />
</a>

<br />
<br />

<img src="https://img.shields.io/badge/Code-React_%2B_TypeScript-61DAFB?style=flat-square&logo=react&logoColor=0F172A" alt="React y TypeScript" />
<img src="https://img.shields.io/badge/Design-Figma-F24E1E?style=flat-square&logo=figma&logoColor=white" alt="Figma" />
<img src="https://img.shields.io/badge/Focus-Frontend_Architecture-7C3AED?style=flat-square" alt="Frontend Architecture" />

<br />
<br />

<a href="#top"><strong>Volver al inicio ↑</strong></a>

</div>

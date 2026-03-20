# TurnoMatic – Frontend

Frontend del sistema de gestión de turnos para **Analisa Laboratorio Clínico**.

## Tecnologías

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [TailwindCSS 3](https://tailwindcss.com/)
- [React Router v6](https://reactrouter.com/)
- Context API para autenticación

## Rutas

| Ruta                     | Descripción                              |
|--------------------------|------------------------------------------|
| `/login`                 | Pantalla de inicio de sesión (pública)   |
| `/dashboard`             | Panel principal (protegido)              |
| `/dashboard/usuarios`    | Gestión de usuarios                      |
| `/dashboard/sucursales`  | Gestión de sucursales                    |
| `/dashboard/turnos`      | Administración de turnos                 |

## Desarrollo local

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Producción

```bash
npm run build
# Los archivos quedan en frontend/dist/
```

## Estructura

```
frontend/
├── src/
│   ├── assets/          # Logo SVG y recursos estáticos
│   ├── components/      # Componentes reutilizables (Logo, etc.)
│   ├── context/         # AuthContext (autenticación global)
│   ├── layouts/         # DashboardLayout con sidebar
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── dashboard/
│   │       ├── DashboardHome.jsx
│   │       ├── UsuariosPage.jsx
│   │       ├── SucursalesPage.jsx
│   │       └── TurnosPage.jsx
│   ├── App.jsx          # Rutas principales
│   └── main.jsx         # Punto de entrada
├── index.html
├── vite.config.js
└── tailwind.config.js
```

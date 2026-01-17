<img width="1356" height="574" alt="image" src="https://github.com/user-attachments/assets/ef43b4ce-d6d4-4ad7-91c0-14cf6bd4b424" /># React + TypeScript + Vite

PRUEBA: TECNICA-FULL-STACK

DESARROLLADA POR: BRAYAN DAVID BANGUERA ALEGRIA.

API React moderna desarrollada para consumir la API REST de gestión de alumnos, materias y notas. Desarrollada con React 18, TypeScript y Vite, implementa una arquitectura en tres capas 

## Repositorios
• Backend: https://github.com/brayandab/GESTION-NOTAS-BACKEND

• Frontend: https://github.com/brayandab/GESTION-NOTAS-FRONTEND

## Visualización de Materia.

• Listar materias:

<img width="1356" height="574" alt="image" src="https://github.com/user-attachments/assets/b88219ba-4f07-4da3-a8ca-6976ed78fec4" />

• Crear materia:

<img width="1365" height="513" alt="image" src="https://github.com/user-attachments/assets/9ee86d53-01ff-42fc-a19a-80e5d5f72bb7" />

• Editar materia:

<img width="1361" height="493" alt="image" src="https://github.com/user-attachments/assets/8c4ea21d-77ef-4d6a-be5c-49ba8513f40c" />

• Eliminar materia:

<img width="1365" height="626" alt="image" src="https://github.com/user-attachments/assets/28d90a4f-e01d-4394-88dd-a07bfc79ce0e" />

<img width="1365" height="532" alt="image" src="https://github.com/user-attachments/assets/eba17952-beb9-401d-a236-b054542ade43" />

## Visualización de Alumno.

• Listar alumnos:

<img width="1365" height="543" alt="image" src="https://github.com/user-attachments/assets/4d25551e-0b85-40bc-bbe8-f1693beae394" />


• Crear alumno:

<img width="1357" height="562" alt="image" src="https://github.com/user-attachments/assets/d8e6bd9a-3ed3-4ad2-98fc-f56c4d4a5411" />

<img width="1365" height="602" alt="image" src="https://github.com/user-attachments/assets/5769522c-6ffd-4de9-a28c-f783b42c2b79" />

• Editar materia:

<img width="1365" height="542" alt="image" src="https://github.com/user-attachments/assets/a7e33649-5bdf-45e3-9880-c4dda8ff25e4" />

<img width="1365" height="651" alt="image" src="https://github.com/user-attachments/assets/eed6644c-1b54-4184-b6f3-b32c769fbf05" />


• Eliminar materia:

<img width="1364" height="657" alt="image" src="https://github.com/user-attachments/assets/bc12a156-3dac-4262-8934-efbd4f7d2885" />

<img width="1365" height="569" alt="image" src="https://github.com/user-attachments/assets/a8551c70-ad7a-4ef0-b5a8-e5a17965282a" />

## Visualización de Notas.

• Crear notas:

<img width="1352" height="662" alt="image" src="https://github.com/user-attachments/assets/bf52c330-e619-4fae-a70a-3636dd299209" />


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

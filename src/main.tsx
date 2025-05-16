
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './ThemeProvider';
import App from './App';
import './index.css';
import 'tailwindcss/tailwind.css';


import React from 'react';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
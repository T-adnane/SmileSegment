// Importation des bibliothèques React
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importation du fichier CSS principal de l'application
import './index.css';

// Importation du composant principal de l'application
import App from './App';

// Importation de la fonction de rapport pour les performances Web
import reportWebVitals from './reportWebVitals';

// Création d'un "root" React pour le rendu de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu du composant principal "App" dans l'élément avec l'ID "root" du document HTML
root.render(
    <App />
);

// Appel de la fonction de rapport pour les performances Web
reportWebVitals();

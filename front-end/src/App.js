// Importation des fichiers CSS et des composants nécessaires depuis d'autres fichiers
import './App.css';  // Fichier de styles principal de l'application
import './css/font-awesome.min.css'; // Styles pour les icônes
import './css/themify-icons.css'; // Styles pour les icônes Themify
import 'bootstrap/dist/css/bootstrap.min.css'; // Styles pour la bibliothèque Bootstrap
import { NavBar } from "./components/NavBar"; // Composant de la barre de navigation
import { Banner } from "./components/Banner"; // Composant de la bannière
import { About } from "./components/About"; // Composant "À propos"
import { Contact } from "./components/Contact"; // Composant de contact
import { Footer } from "./components/Footer"; // Composant du pied de page

// Définition du composant principal "App"
function App() {
  return (
    // Structure de la page principale de l'application
    <div className="App">
      {/* Barre de navigation */}
      <NavBar />
      {/* Bannière */}
      <Banner />
      {/* Section "À propos" */}
      <About />
      {/* Section de contact */}
      <Contact />
      {/* Pied de page */}
      <Footer />
    </div>
  );
}

// Exportation du composant principal "App" pour une utilisation dans d'autres parties de l'application
export default App;

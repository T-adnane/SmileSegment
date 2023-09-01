import './App.css';
import './css/font-awesome.min.css'
import './css/themify-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";


function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import "./styles.css";
import Vis from "./components/vis";
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/vis" element={<Vis/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

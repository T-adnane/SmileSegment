import Navbar from "./components/Navbar";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import "./styles.css";
import Vis1 from "./components/vis1";
import ContactUs  from "./components/ContactUs";
import Footer from "./components/Footer"
import Home from "./components/Home";
import { Banner } from "./components/Banner";

export default function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Banner/>}/>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/vis1" element={<Vis1/>}/>
          <Route path="/ContactUs" element={<ContactUs/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

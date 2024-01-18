import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Navbar, Footer } from "./components";
import { useEffect } from "react";
import { getCategorys } from "./redux/slice/categorysSlice";
import {useDispatch} from 'react-redux'

function App() {
   const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCategorys())
  }, [])

  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
        <Footer />
    </BrowserRouter>
  );
}

export default App;

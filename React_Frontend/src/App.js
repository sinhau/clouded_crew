import React, { useRef } from "react";
import './style.css';
import { Routes, Switch, Route } from "react-router-dom";

import Header from "./components/header";
import FAQ from "./components/faq";
import About from "./components/about";
import Footer from "./components/footer";

function App() {

  return (
    <div className="App">
      <Routes>
      <Route path={"/"} element={<HomeScreen/>}/>
      </Routes>
    </div>
  );
}

function HomeScreen(){

  return(
    <>
      <Header/>
      <About/>
      <FAQ/>
      <Footer/>
      </>
  )
}

export default App;

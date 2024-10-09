import { useState,useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import {Routes, Route, useNavigate,Navigate,Outlet } from "react-router-dom";
import API from '../../API/API.mjs';
import PickServiceComponent from './components/PickService';

function App() {
  const [servizi, setServizi] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchServizi = async () => {
      try {
        const services=await API.getServices();
  
        setServizi(services);


      } catch (error) {
        
      }
    };

    fetchServizi();
  }, []);
  return(
  <Routes>
    <Route path="/" element={<PickServiceComponent servizi={servizi}/>}></Route>
  </Routes>
  )
}

export default App

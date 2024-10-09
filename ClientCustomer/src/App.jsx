import { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import API from '../../API/API.mjs';
import { Container } from 'react-bootstrap';
import NavHeader from './components/NavHeader'
import PickServiceComponent from './components/PickService';

function App() {
  const [servizi, setServizi] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServizi = async () => {
      try {
        const services = await API.getServices();

        setServizi(services);


      } catch (error) {

      }
    };

    fetchServizi();
  }, []);
  return (
    <Routes>
      <Route element={<>
        <NavHeader />
        <Container fluid className='mt-3 justify-content-center'>
          <Outlet />
        </Container>
      </>
      }>
        <Route path="/" element={<PickServiceComponent servizi={servizi} />}></Route>
      </Route>
    </Routes>
  )
}

export default App

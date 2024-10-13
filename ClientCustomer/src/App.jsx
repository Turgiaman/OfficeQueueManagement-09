import { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import API from '../../API/API.mjs';
import { Container } from 'react-bootstrap';
import NavHeader from './components/NavHeader'
import PickServiceComponent from './components/PickService';
import TicketComponent from './components/Ticket';

function App() {
  const [servizi, setServizi] = useState([]);
  const [ticket, setTicket] = useState('');

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

  const handleTicket = async(newTicket) => {
    setTicket(newTicket);
  }

  /* NON SERVE, MA NEL DUBBIO LO LASCIO QUI
  andrebbe usata come props in ticketComponent, quando scadono i 4 secondi viene chiamata*/
  /*
  const resetTicket = async() => {
    setTicket('');
  }
  */

  return (
    <Routes>
      <Route element={<>
        <NavHeader />
        <Container fluid className='mt-3 justify-content-center'>
          <Outlet />
        </Container>
      </>
      }>
        <Route path="/" element={<PickServiceComponent servizi={servizi} handleTicket={handleTicket}/>}/>
        <Route path="/ticket" element={<TicketComponent ticket={ticket}/>}/>
      </Route>
    </Routes>
  )
}

export default App

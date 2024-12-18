import { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import API from '../../API/API.mjs';
import NavHeader from '../components/NavHeader';
import { Container } from 'react-bootstrap';
import CountersTable from '../components/CountersTable';
function App() {
  const [counters, setCounters] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const counters = await API.getCountersTickets();
        setCounters(counters);

      } catch (error) {

      }
    };
    fetchCounters();
    const interval = setInterval(() => {
      fetchCounters();
    }, 1000);
    return () => clearInterval(interval);
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
        <Route path="/" element={<CountersTable counters={counters} />}></Route>
      </Route>
    </Routes>
  )
}

export default App

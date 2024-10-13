import { useState } from 'react'
import './App.css'
import { Container } from 'react-bootstrap';
import API from '../../API/API_Officer.mjs'
import { CountersList, ManageCounter } from './components/Counters'
import NavHeader from './components/NavHeader'
import { useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [counters, setCounters] = useState([]);

  useEffect(() => {
    const getCounters = async () => {
      const res = await API.getCounters();
      setCounters(res);
    };
    getCounters();
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
        <Route index element={
          <CountersList counters={counters} />
        } />
        <Route
          path="/counter/:id"
          element={<ManageCounter />}
        />
      </Route>
    </Routes>
  );
}

export default App

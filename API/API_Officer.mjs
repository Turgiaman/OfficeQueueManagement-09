const SERVER_URL = 'http://localhost:3001'

const getCounters = async () => {
  const res = await fetch(SERVER_URL + '/api/counters');
  if (res.ok) {
    const countersJson = await res.json();
    return countersJson;
  } else {
    throw new Error('Internal Server Error');
  }
}

const getServices=async()=>{
  const response= await fetch(SERVER_URL+'/api/services',{
      method:'GET',
    });
    const services = await response.json();
    if(response.ok){
      return services;
    }
    else{
      throw new Error("Internal server error");
    }
}

const getServicesByCounterId = async (counterId) => {
  const res = await fetch(SERVER_URL + `/api/counters/${counterId}/services`);
  if (res.ok) {
    const services = await res.json();
    return services;
  } else {
    throw new Error('Internal Server Error');
  }
}

const getNextCustomer = async (counterId) => {
  const response = await fetch(SERVER_URL + `/api/counters/${counterId}/next`, {
    method: 'GET',
  });
  const nextCustomer = await response.json();
  if (response.ok) {
    return nextCustomer;
  }
  else {
    throw new Error("Internal server error");
  }
}

const setCounterTicket = async (ticketId, counterId) => {

  const res = await fetch(SERVER_URL + `/api/tickets/${ticketId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ counterId }),
  });

  if (res.ok) {
    const counterIdAssociated = await res.json();
    return counterIdAssociated;
  }
  else {
    throw new Error("Internal server error");
  }

};

const getOfficers = async () => {
  const response = await fetch(SERVER_URL + `/api/officers`, {
    method: 'GET',
  });
  const officers = await response.json();
  if (response.ok) {
    return officers;
  }
  else {
    throw new Error("Internal server error");
  }
}

const setOfficerCounter = async (employeeId, counterId) => {

  const res = await fetch(SERVER_URL + `/api/counters/${counterId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeId }),
  });

  if (res.ok) {
    const employeeCounter = await res.json();
    return employeeCounter;
  }
  else {
    throw new Error("Internal server error");
  }

};

const getTicketCountsByCounter = async (period, service, date) => {
  const res = await fetch(`${SERVER_URL}/api/counts/counter?period=${period}&date=${date}&service=${service}`);
  if (res.ok) {
      const data = await res.json();
      return data;
  } else {
      throw new Error("Internal server error");
  }
}

const getTicketCountsByService = async (period, date) => {
  const res = await fetch(`${SERVER_URL}/api/counts/service?period=${period}&date=${date}`);
  if (res.ok) {
      const data = await res.json();
      return data;
  } else {
      throw new Error("Internal server error");
  }
}

const API = { getCounters, getServices, getServicesByCounterId, getNextCustomer, setCounterTicket, getOfficers, setOfficerCounter, getTicketCountsByCounter, getTicketCountsByService}
export default API;

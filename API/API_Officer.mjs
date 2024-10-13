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
  const response = await fetch(SERVER_URL + `/api/next/${counterId}`, {
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

  const res = await fetch(SERVER_URL + `/api/tickets/${ticketId}/counter`, {
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

const API = { getCounters, getServicesByCounterId, getNextCustomer, setCounterTicket }
export default API;

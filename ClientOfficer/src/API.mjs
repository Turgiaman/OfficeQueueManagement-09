const SERVER_URL = 'http://localhost:3001'

const getCounters = async () => {
    const res = await fetch(SERVER_URL + '/api/counters');
    if (res.ok) {
      const countersJson = await res.json();
      return countersJson;
    }else {
      throw new Error('Internal Server Error');
    }
}

const getServicesByCounterId = async (counterId) => {
  const res = await fetch(SERVER_URL + `/api/counters/${counterId}/services`);
  if(res.ok){
    const services = await res.json();
    return services;
  }else{
    throw new Error('Internal Server Error');
  }
}

const API = {getCounters, getServicesByCounterId}
export default API;

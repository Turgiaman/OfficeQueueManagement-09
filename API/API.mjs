const SERVER_URL = "http://localhost:3001/api";

const getServices=async()=>{
    const response= await fetch(`${SERVER_URL}/services`,{
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
async function getTicket(service) {
  const ticket = await fetch(`${SERVER_URL}/ticket/${service}`)
  .then(response => response.json());
  return ticket;
}
const getCounters=async()=>{
  const response= await fetch(`${SERVER_URL}/counters`,{
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

const API = {
    getServices, getTicket, getCounters
  };

  export default API;
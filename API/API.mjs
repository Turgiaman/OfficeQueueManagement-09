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

const API = {
    getServices, getTicket
  };

  export default API;
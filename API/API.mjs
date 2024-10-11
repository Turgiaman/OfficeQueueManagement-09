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

const getTicket=async(service)=>{
  const response= await fetch(`${SERVER_URL}/ticket/${service}`,{
      method:'GET',
    });
    const ticket = await response.json();
    if(response.ok){
      return ticket;
    }
    else{
      throw new Error("Internal server error");
    }
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
const getCountersTickets=async()=>{
  const response= await fetch(`${SERVER_URL}/counters/actual_client`,{
      method:'GET',
    });
    const clients = await response.json();
    if(response.ok){
      return clients;
    }
    else{
      throw new Error("Internal server error");
    }
}

const API = {
    getServices, getTicket, getCounters,getCountersTickets
  };

  export default API;
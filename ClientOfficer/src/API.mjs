const SERVER_URL = 'http://localhost:3001'

const getCounters = async () => {
    const res = await fetch(SERVER_URL + '/api/counters');
    if (res.ok) {
      const countersJson = await res.json();
      return countersJson;
    }
    else {
      throw new Error('Internal Server Error');
    }
}
  

  const API = {getCounters}
  export default API;

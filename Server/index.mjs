import express from "express";
import morgan from "morgan";
import cors from "cors";
import CounterDao from "./dao/counterDao.mjs";
import TotemDao from "./dao/totemDao.mjs";
import OfficerDao from "./dao/officerDao.mjs";

const counterDao = new CounterDao();
const totemDao = new TotemDao();
const officerDao = new OfficerDao();

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan("dev"));
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));


// ROUTES
app.get('/api/counters', async (req, res) => {
  try {
    const counters = await counterDao.getCounters();
    return res.status(200).json(counters);
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/counters/:id/services', async (req, res) => {
  try {
      const counterId = req.params.id;
      const services = await counterDao.getServicesByCounterId(counterId);
      res.status(200).json(services);
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/services',async (req,res)=>{
    try {
        let services=await totemDao.getServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
})

app.get('/api/counters/:counterId/next',async (req,res)=>{
    try {
        let next = {tag: null, id: 0};
        let services = [];
        
        const serviceIds = await officerDao.getCounterServices(req.params.counterId);
        for(let serviceId of serviceIds)
            services.push(await officerDao.getServiceFromId(serviceId));

        let max = 0;
        let next_service = null;
        for (let service of services) {
            let count = await officerDao.getTicketCount(service);
            if (count > max) {
                max = count;
                next_service = service;
            }
            else if (count == max && max != 0) {
                if (await officerDao.getServiceTime(service) < await officerDao.getServiceTime(next_service)) {
                    max = count;
                    next_service = service;
                }
            }
        }
        if(max)
            next = await officerDao.getNextCustomer(next_service);
        res.status(200).json(next);
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
})

app.put('/api/tickets/:ticketId', async (req, res) => {
    const ticketId = req.params.ticketId;
    const { counterId } = req.body;

    if (!counterId) {
        return res.status(400).json({ error: 'counterId!' });
    }

    try {
        let counter = await officerDao.setCounterTicket(ticketId, counterId);
        res.status(200).json({ message: 'Ticket state updated', counterId: counter });
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
});

app.get('/api/ticket/:service', async(req, res) => {
    try{
        const serviceTag = await officerDao.getServiceTag(req.params.service)
        const ticket = await totemDao.getTicket(serviceTag);
        res.status(200).json(ticket);
    }catch(error) {
        res.status(503).json({error: error.message});
    }
})

app.get('/api/counters/actual_client', async(req, res) => {
    try{
        const clients= await counterDao.getTicketFromAllCounters();
        res.status(200).json(clients);
    }catch(error) {
        res.status(503).json({error: error.message});
    }
})

app.get('/api/officers', async(req, res) => {
    try{
        const officers= await officerDao.getOfficers();
        res.status(200).json(officers);
    }catch(error) {
        res.status(503).json({error: error.message});
    }
})

app.put('/api/counters/:counterId', async (req, res) => {
    const counterId = req.params.counterId;
    const { employeeId } = req.body;

    if (!employeeId) {
        return res.status(400).json({ error: 'employeeId missing!' });
    }

    try {
        let counter = await officerDao.setOfficerCounter(employeeId, counterId);
        res.status(200).json({ message: 'Counter state updated', counterId: counter });
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
});



// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
  export { app }
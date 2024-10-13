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
  origin: ["http://localhost:5173", "http://localhost:5174"],
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

app.get('/api/next/:counterId',async (req,res)=>{
    try {
        let next=await officerDao.getNextCustomer(req.params.counterId);
        res.status(200).json(next);
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
})

app.put('/api/tickets/:ticketId/counter', async (req, res) => {
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



// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
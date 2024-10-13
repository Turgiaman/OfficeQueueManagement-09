import { useParams, Link} from 'react-router-dom';
import { Card, Button, Container, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from '../../../API/API_Officer.mjs'

export function CountersList(props) {
    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary mb-4">Select a counter to manage the queue:</h1>
            <div className="d-flex flex-column align-items-center"> {/* Utilizza flexbox per allineare verticalmente */}
                {props.counters.map(counter => (
                    <Card className="text-center mb-3" key={counter.id} style={{ width: '100%', maxWidth: '400px' }}>
                        <Card.Body>
                            <Card.Title>Counter {counter.id}</Card.Title>
                            <Link to={`/counter/${counter.id}`}>
                                <Button variant="primary">Manage Counter</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ManageCounter() {
    const { id } = useParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getServices = async() => {
            const servicesCounter = await API.getServicesByCounterId(id);
            setServices(servicesCounter);
            setLoading(false);
        }
        getServices();
    }, [id])

    const handleNext = async () => {
        console.log(id);
        const nextTicket = await API.getNextCustomer(id);
        if(nextTicket.id>0){
            await API.setCounterTicket(nextTicket.id,id);
            alert(`You are serving the ticket ${nextTicket.tag+nextTicket.id}`);
        }
        else
        alert(`No customers to serve`);
      };

    return (
        !loading&&<Container className="d-flex flex-column align-items-center mt-5" style={{ minHeight: '80vh' }}>
            <h1 className="mb-4 text-primary">You are serving at counter {id}</h1>
            {services.length === 0 ? (
                <p className="text-center flex-grow-1">No services available for this counter.</p>
            ) : (
                <div className="d-flex flex-column align-items-center flex-grow-1">
                    <p className="text-center mb-4">This counter offers these services:</p>
                    {services.map(service => (
                        <Card key={service.id} className="mb-3 shadow-sm rounded" style={{ width: '100%', maxWidth: '400px' }}>
                            <Card.Body>
                                <Card.Title className="text-primary">{service.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
            <div className="mt-auto text-center">
                <p className="mt-4">Click the button if you are ready for the next customer</p>
                <Button 
                    variant="primary"
                    disabled={services.length === 0} 
                    className="mt-2"
                    onClick={() =>handleNext()}
                >
                    Next Customer
                </Button>
            </div>
        </Container>
    );
}
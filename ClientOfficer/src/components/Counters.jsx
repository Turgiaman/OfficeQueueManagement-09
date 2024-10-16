import { useParams, Link} from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from '../../../API/API_Officer.mjs';
import EmployeeSelectionModal from './OfficerSelection';

export function CountersList(props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedCounter, setSelectedCounter] = useState(null);

    const handleSelectCounter = (counterId) => {
        setSelectedCounter(counterId);
    };

    const handleOpenModal = () => {
        if (selectedCounter !== null) {
            setShowModal(true);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary mb-4">Select a counter to manage the queue:</h1>
            <Row className="d-flex justify-content-center" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
                {props.counters.map(counter => (
                    <Col xs={12} md={6} key={counter.id} className="mb-3">
                        <Card 
                            className={`text-center ${selectedCounter === counter.id ? 'border-primary' : ''}`} 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSelectCounter(counter.id)}
                        >
                            <Card.Body>
                                <Card.Title>Counter {counter.id}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {/* Pulsante posizionato qui all'interno del riquadro */}
                <Col xs={12} className="text-center mt-3">
                    <Button 
                        variant="primary" 
                        onClick={handleOpenModal} 
                        disabled={selectedCounter === null} 
                    >
                        Manage Counter
                    </Button>
                </Col>
            </Row>
            <EmployeeSelectionModal 
                show={showModal} 
                setShow={setShowModal}
                counterId={selectedCounter}
                setCounterId={setSelectedCounter}
            />
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
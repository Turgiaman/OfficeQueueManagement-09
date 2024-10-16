import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../API/API.mjs";

const PickServiceComponent = (props) => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(null); // Stato per il servizio selezionato

    const handleServiceClick = (servizio) => {
        setSelectedService(servizio); // Imposta il servizio selezionato
    };

    const handlePickService = async () => {
        if (selectedService) {
            const ticketApi = await API.getTicket(selectedService.name);
            props.handleTicket(ticketApi);
            navigate("/ticket");
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4 text-primary">Pick the Service</h1>
            <div className="border rounded p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <Row className="justify-content-center">
                    {props.servizi.map((servizio) => (
                        <Col key={servizio.name} md={6} sm={12} className="mb-3">
                            <Card 
                                className={`text-center ${selectedService?.name === servizio.name ? 'border border-primary' : ''}`}
                                onClick={() => handleServiceClick(servizio)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Body>
                                    <Card.Title>{servizio.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="text-center mt-3">
                    <Button 
                        variant="primary" 
                        onClick={handlePickService} 
                        disabled={!selectedService}
                    >
                        Pick Service
                    </Button>
                </div>
            </div>
        </Container>
    );
}

export default PickServiceComponent;

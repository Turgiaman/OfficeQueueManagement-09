import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import API from "../../../API/API.mjs";

const PickServiceComponent = (props)=>{

    const [ticket, setTicket] = useState(''); //new line

    const handleServizioClick = async (servizio) => {
      const ticketApi = await API.getTicket(servizio.name);
      setTicket(ticketApi);
      alert(`Hai scelto il servizio: ${servizio.name} e il numero del tuo ticket è ${ticketApi}`);
    };

      return (
        <Container className="mt-5">
          <h1 className="text-center mb-4">Pick the Service</h1>
            {props.servizi.map((servizio) => (
              <Row className="justify-content-center">
              <Col key={servizio.name} md={4} className="mb-3">
                <Card className="text-center ">
                  <Card.Body>
                    <Card.Title>{servizio.name}</Card.Title>
                    <Button variant="primary" onClick={() => handleServizioClick(servizio)}>
                      Pick
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              </Row>
            ))}
         
        </Container>
      );
}
export default PickServiceComponent;
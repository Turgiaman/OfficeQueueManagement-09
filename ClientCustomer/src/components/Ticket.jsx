import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

const TicketComponent = (props)=>{
    const navigate=useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
          navigate("/")
        }, 4000);
        return () => clearInterval(interval);
      }, []);
      return (
        <Container className="mt-5">
                <Card className="text-center ">
                  <Card.Body>
                    <Card.Title><strong>YOUR TICKET</strong></Card.Title>
                    <Card.Text>{props.ticket}</Card.Text>
                  </Card.Body>
                </Card>  
        </Container>
      );
}
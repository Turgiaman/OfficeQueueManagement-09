import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

const CountersTable = (props) => {
  return (
    <Container className="mt-5">
      <h1 className="text-center text-primary mb-4">SERVING CLIENT</h1>
      <Row>
        <Col style={{ fontSize: '25px' }} className="border p-3 text-center text-primary" xs={4}><strong>Counter</strong></Col>
        <Col style={{ fontSize: '25px' }} className="border p-3 text-center text-primary" xs={4}><strong>Ticket</strong></Col>
        <Col style={{ fontSize: '25px' }} className="border p-3 text-center text-primary" xs={4}><strong>Approximate time left</strong></Col>
      </Row>
      {props.counters.map((counter) => (
        <Row key={counter.id}>
          <Col key={counter.id} md={4} className="border p-3 text-center">
            {counter.id}
          </Col>
          {counter.tag != null && <Col key={counter.tag} md={4} className="border p-3 text-center">{counter.tag}</Col>}
          {counter.tag == null && <Col key={counter.tag} md={4} className="border p-3 text-center">-</Col>}
          {counter.tag != null && <Col key={counter.min.waitingTime} md={4} className="border p-3 text-center">{counter.min.tag}</Col>}
        </Row>
      ))}
    </Container>
  );
}
export default CountersTable;
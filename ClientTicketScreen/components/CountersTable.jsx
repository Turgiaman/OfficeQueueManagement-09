import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

const CountersTable = (props)=>{
      return (
        <Container className="mt-5">
          <h1 className="text-center mb-4">Serving Client</h1>
            {props.counters.map((counter) => (
              <Row className="justify-content-center">
              <Col key={counter.id} md={4} className="mb-3">
              {counter.id}
              </Col>
              {counter.tag!=null && <Col key={counter.tag} md={4} className="mb-3">{counter.tag}</Col>}
              {counter.tag==null && <Col key={counter.tag} md={4} className="mb-3">-</Col>}
              </Row>
            ))}
        </Container>
      );
}
export default CountersTable;
import { Container, Row, Col } from 'react-bootstrap';

const CountersTable = (props) => {
  return (
    <Container className="mt-5">
      <h1 className="text-center text-primary mb-4">SERVING CLIENT</h1>
      <Row className="mb-3">
        <Col style={{ fontSize: '25px' }} className="border border-primary rounded p-3 text-center text-primary bg-light shadow">
          <strong>Counter</strong>
        </Col>
        <Col style={{ fontSize: '25px' }} className="border border-primary rounded p-3 text-center text-primary bg-light shadow">
          <strong>Ticket</strong>
        </Col>
        <Col style={{ fontSize: '25px' }} className="border border-primary rounded p-3 text-center text-primary bg-light shadow">
          <strong>Remaining Tickets in Queue</strong>
        </Col>
      </Row>
      {props.counters.map((counter) => (
        <Row key={counter.id} className="mb-2">
          <Col md={4} className="border border-secondary rounded p-3 text-center bg-white shadow">
            <strong>Counter {counter.id}</strong>
          </Col>
          <Col md={4} className={`border border-secondary rounded p-3 text-center bg-white shadow ${counter.tag ? 'text-success' : 'text-danger'}`}>
            {counter.tag != null ? counter.tag : 'Counter Closed'}
          </Col>
          <Col md={4} className="border border-secondary rounded p-3 text-center bg-white shadow">
            {counter.tag != null ? counter.num.ticketInQueue : '-'}
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default CountersTable;
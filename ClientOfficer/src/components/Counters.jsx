import { useParams, Link} from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

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

export function ManageCounter(){
    const {id} = useParams();
    return(
        <div>
            <h2>Counter {id}</h2>
            <Button
                    className="btn btn-primary"
            >Next Customer </Button>
        </div>
    );
}
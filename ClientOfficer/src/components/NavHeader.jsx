import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavHeader() {
    return (
        <Navbar className="navbar navbar-dark bg-primary">
            <Container fluid>
            <Navbar.Brand>
                Office Queue
            </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavHeader;
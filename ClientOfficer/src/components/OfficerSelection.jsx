
import { useState, useEffect } from 'react';
import { Card, Button, Container, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../../API/API_Officer.mjs';

const EmployeeSelectionModal = ({ show, setShow, counterId, setCounterId}) => {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeesData = await API.getOfficers();
                setEmployees(employeesData);
            } catch (error) {
                console.error("Failed to fetch employees", error);
            } finally {
                setLoading(false);
            }
        };

        if (show) {
            fetchEmployees();
        }
    }, [show]);

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleCloseModal = () => {
        setShow(false);
        setCounterId(null);
    };

    const handleConfirmEmployee = () => {
        API.setOfficerCounter(selectedEmployee.id, counterId);
        navigate(`/counter/${counterId}`);
        handleCloseModal;
    };


    return (
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Select Your Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    <div className="d-flex flex-column align-items-center">
                        {employees.map(employee => (
                            <Card
                                key={employee.id}
                                className={`mb-3 shadow-sm rounded ${selectedEmployee && selectedEmployee.id === employee.id ? 'border-primary' : ''}`}
                                onClick={() => handleSelectEmployee(employee)}
                                style={{ cursor: 'pointer', width: '100%' }}
                            >
                                <Card.Body>
                                    <Card.Title className="text-primary">{employee.key_name}</Card.Title>
                                    <Card.Text>ID: {employee.id}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirmEmployee}
                    disabled={!selectedEmployee}
                >
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmployeeSelectionModal;

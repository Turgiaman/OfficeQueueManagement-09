import React, { useState, useEffect } from 'react';
import API from '../../../API/API_Officer.mjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Label, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const StatisticsPage = () => {
    const [granularity, setGranularity] = useState('daily'); // Default value
    const [statType, setStatType] = useState('counter'); // Default value
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for the date picker
    const [services, setServices] = useState([]); // State for available services
    const [selectedService, setSelectedService] = useState(''); // State for the selected service

    const fetchData = async () => {
        setError(null);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            let results;

            if (statType === 'counter' && selectedService) {
                results = await API.getTicketCountsByCounter(granularity, selectedService, formattedDate);
            } else if (statType === 'service') {
                results = await API.getTicketCountsByService(granularity, formattedDate);
            }
            setData(results);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchServices = async () => {
        try {
            const listOfservices = await API.getServices(); // Fetch available services from the API
            setServices(listOfservices);
            if (listOfservices.length > 0) {
                setSelectedService(listOfservices[0].name); // Set default to the first service if available
            }
        } catch (err) {
            setError('Error fetching services');
        }
    };

    useEffect(() => {
        fetchData();
    }, [granularity, statType, selectedDate, selectedService]); // Fetch data whenever these states change

    useEffect(() => {
        fetchServices(); // Fetch services when the component mounts
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="text-center text-primary mb-4">Statistics Page</h1> {/* Colore primario per il titolo */}
            <div className="d-flex gap-4">
                {/* Sezione per la selezione dei parametri */}
                <div className="col-md-5">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column" style={{ minHeight: '450px' }}>
                            <h5 className="card-title text-primary">Select Parameters</h5>
                            <div className="mb-3">
                                <label htmlFor="granularity-select" className="form-label">Select Granularity:</label>
                                <select
                                    id="granularity-select"
                                    className="form-select"
                                    value={granularity}
                                    onChange={(e) => setGranularity(e.target.value)}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="stat-type-select" className="form-label">Select Statistic Type:</label>
                                <select
                                    id="stat-type-select"
                                    className="form-select"
                                    value={statType}
                                    onChange={(e) => setStatType(e.target.value)}
                                >
                                    <option value="counter">By Counter</option>
                                    <option value="service">By Service</option>
                                </select>
                            </div>

                            {statType === 'counter' && (
                                <div className="mb-3">
                                    <label htmlFor="service-select" className="form-label">Select Service:</label>
                                    <select
                                        id="service-select"
                                        className="form-select"
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                    >
                                        {services.map((service) => (
                                            <option key={service.name} value={service.name}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="date-picker" className="form-label">Select Date:</label>
                                <DatePicker
                                    id="date-picker"
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                />
                            </div>

                            <button className="btn btn-primary mt-auto" onClick={fetchData}>See statistics</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column" style={{ minHeight: '450px' }}>
                            <h5 className="text-center text-primary mb-3">
                                {statType.charAt(0).toUpperCase() + statType.slice(1)} Statistics - {granularity.charAt(0).toUpperCase() + granularity.slice(1)} {statType === 'counter' && `for ${selectedService}`}
                            </h5>
                            <div className="d-flex align-items-center justify-content-center" style={{ flexGrow: 1 }}>
                                {error ? (
                                    <div className="alert alert-danger">Error: {error}</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={data}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={statType === 'counter' ? `c_id` : 's_tag'}>
                                                <Label value={statType === 'counter' ? 'Counter number' : 'Service tag'} offset={-10} position="insideBottom" />
                                            </XAxis>
                                            <YAxis>
                                                <Label value="Number of Tickets" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                                            </YAxis>
                                            <Tooltip />
                                            <Bar dataKey="ticket_count" fill="#0d6efd" name="Number of Tickets" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;

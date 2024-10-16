import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import API from '../../../API/API_Officer.mjs'; // Adjust path if necessary
import StatisticsPage from './StatisticsPage'; // Adjust path if necessary

// Mock the API calls
jest.mock('../../../API/API_Officer.mjs');

describe('StatisticsPage', () => {

  beforeEach(() => {
    // Reset the mock API calls before each test
    API.getTicketCountsByCounter.mockReset();
    API.getTicketCountsByService.mockReset();
    API.getServices.mockReset();
  });

  test('renders StatisticsPage correctly', () => {
    render(<StatisticsPage />);

    // Check if the component renders correctly
    expect(screen.getByText('Statistics Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Granularity:')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Statistic Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Date:')).toBeInTheDocument();
  });

  test('fetches and displays data when granularity, statType, and service are selected', async () => {
    // Mock the API responses
    API.getTicketCountsByCounter.mockResolvedValue([
      { c_id: 'Counter1', ticket_count: 10 },
      { c_id: 'Counter2', ticket_count: 15 }
    ]);
    API.getServices.mockResolvedValue([{ name: 'Service1' }, { name: 'Service2' }]);

    render(<StatisticsPage />);

    // Wait for the services to load
    await waitFor(() => expect(API.getServices).toHaveBeenCalled());

    // Simulate user interaction with dropdowns and date picker
    fireEvent.change(screen.getByLabelText('Select Granularity:'), { target: { value: 'weekly' } });
    fireEvent.change(screen.getByLabelText('Select Statistic Type:'), { target: { value: 'counter' } });
    fireEvent.change(screen.getByLabelText('Select Service:'), { target: { value: 'Service1' } });

    // Click the "See statistics" button
    fireEvent.click(screen.getByText('See statistics'));

    // Wait for the API call to be made and data to be rendered
    await waitFor(() => expect(API.getTicketCountsByCounter).toHaveBeenCalled());
    expect(screen.getByText('Counter1')).toBeInTheDocument();
    expect(screen.getByText('Counter2')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    // Mock the API response to simulate an error
    API.getServices.mockRejectedValue(new Error('Error fetching services'));

    render(<StatisticsPage />);

    // Simulate user interaction
    fireEvent.click(screen.getByText('See statistics'));

    // Wait for the error to be displayed
    await waitFor(() => expect(screen.getByText(/Error fetching services/)).toBeInTheDocument());
  });

  test('displays chart correctly when valid data is fetched', async () => {
    // Mock API responses
    API.getTicketCountsByService.mockResolvedValue([
      { s_tag: 'Service1', ticket_count: 10 },
      { s_tag: 'Service2', ticket_count: 20 }
    ]);
    API.getServices.mockResolvedValue([{ name: 'Service1' }, { name: 'Service2' }]);

    render(<StatisticsPage />);

    // Simulate user interaction
    fireEvent.change(screen.getByLabelText('Select Statistic Type:'), { target: { value: 'service' } });
    fireEvent.change(screen.getByLabelText('Select Service:'), { target: { value: 'Service1' } });

    fireEvent.click(screen.getByText('See statistics'));

    // Wait for the chart to render
    await waitFor(() => expect(screen.getByText('Service1')).toBeInTheDocument());
    expect(screen.getByText('Service2')).toBeInTheDocument();
  });
});


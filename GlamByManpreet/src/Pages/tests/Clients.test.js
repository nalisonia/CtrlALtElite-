import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Clients from '../Clients';
import axios from 'axios';

// Mock the axios.get request
jest.mock('axios');

describe('Clients component', () => {
  it('fetches and displays client data from the server', async () => {
    // Mocking the response from axios.get
    const mockClients = [
      { id: 1, name: 'John Doe', email: 'johndoe@example.com', phone: '123-456-7890', status: 'approved' },
      { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', phone: '987-654-3210', status: 'pending' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockClients });

    render(<Clients />);

    // Wait for the client data to be fetched and rendered
    await waitFor(() => {
      // Check if the client names are rendered in the DataGrid
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Check if the correct number of clients are displayed
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3); // 2 clients + 1 header row
  });
  
  it('displays an error message if fetching clients fails', async () => {
    // Mocking a failed axios.get request
    axios.get.mockRejectedValueOnce(new Error('Error fetching clients'));

    render(<Clients />);

    // Wait for the error message to be displayed in the DOM
    await waitFor(() => {
      // Check that the error message is displayed in the DOM
      expect(screen.getByText('Error fetching clients')).toBeInTheDocument();
    });
  });
});

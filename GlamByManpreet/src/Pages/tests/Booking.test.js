import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Bookings from '../Bookings';
import Modal from 'react-modal';
import axios from 'axios';

// Set up the root element for the modal in the test environment
beforeAll(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
  Modal.setAppElement('#root');
});

// Mock axios globally
jest.mock('axios');

describe('Bookings component', () => {
  test('fetches and displays bookings from the server', async () => {
    const mockBookings = [
      {
        id: 1,
        client_name: 'John Doe',
        event_date: '2023-12-25',
        event_time: '12:00 PM',
        event_type: 'Bridal',
        event_name: 'Wedding Engagement',
        hair_and_makeup: 'Yes',
        hair_only: 'No',
        makeup_only: 'No',
        location: 'New York, NY',
        additional_notes: 'Please arrive early.',
      },
    ];

    // Mock the API response specifically for this test
    axios.get.mockResolvedValueOnce({ data: mockBookings });

    render(<Bookings />);

    // Wait for elements to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Wedding Engagement')).toBeInTheDocument();
    });
  });
});

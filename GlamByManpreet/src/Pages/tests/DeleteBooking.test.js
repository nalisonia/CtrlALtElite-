import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import Bookings from '../Bookings';
import axios from 'axios';

jest.mock('axios');

describe('Bookings Component', () => {
  const mockBookings = [
    {
      id: 1,
      client_name: 'John Doe',
      event_date: '2023-12-25',
      client_id: 1,
      event_time: '10:00',
      event_type: 'Bridal',
      event_name: 'Wedding Engagement',
      hair_and_makeup: 'Yes',
      hair_only: 'No',
      makeup_only: 'No',
      location: '123 Main St',
      additional_notes: 'Please arrive early.',
    },
    {
      id: 2,
      client_name: 'Jane Smith',
      event_date: '2023-12-26',
      client_id: 2,
      event_time: '14:00',
      event_type: 'Non-Bridal',
      event_name: 'Photoshoot',
      hair_and_makeup: 'No',
      hair_only: 'Yes',
      makeup_only: 'No',
      location: '456 Oak Ave',
      additional_notes: 'Bring extra accessories.',
    },
  ];

  const mockClients = [
    {
      id: 1,
      name: 'John Doe',
    },
    {
      id: 2,
      name: 'Jane Smith',
    },
  ];

  beforeEach(() => {
    
    axios.get.mockImplementation((url) => {
      if (url.includes('/bookings')) {
        return Promise.resolve({ data: mockBookings });
      } else if (url.includes('/clients')) {
        return Promise.resolve({ data: mockClients });
      }
      return Promise.reject(new Error('not found'));
    });
    
    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deletes a booking when the delete icon is clicked', async () => {
    render(<Bookings />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    
    const johnRow = screen.getByText('John Doe').closest('div[role="row"]');
    expect(johnRow).toBeInTheDocument();
    
    const deleteButton = within(johnRow).getByTestId('DeleteIcon');
    
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Delete Booking')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this booking?')).toBeInTheDocument();
    
    const confirmDeleteButton = screen.getByText('Delete');
    fireEvent.click(confirmDeleteButton);
 
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/bookings/1')
      );
    });
  
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});

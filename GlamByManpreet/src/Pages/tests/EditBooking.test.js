import React from 'react';
import { render, screen, waitFor, fireEvent, within, } from '@testing-library/react';
import Bookings from '../Bookings';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';

jest.mock('axios'); 

describe('Editing Functionality on Bookings.js', () => {
  const theme = createTheme();

  const mockBookings = [
    {
      id: 1,
      client_id: 1,
      client_name: 'John Doe',
      event_date: '2023-12-25',
      event_time: '10:00',
      event_type: 'Bridal',
      event_name: 'Wedding Engagement',
      hair_and_makeup: 'Yes',
      hair_only: 'No',
      makeup_only: 'No',
      location: '123 Main St',
      additional_notes: 'Please arrive early.',
    },
  ];

  const mockClients = [
    {
      id: 1,
      name: 'John Doe',
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

    axios.put.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handleSaveEdit updates booking successfully', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Bookings />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const row = screen.getByText('John Doe').closest('div[role="row"]');
    expect(row).toBeInTheDocument();

    const editButton = within(row).getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Edit Booking')).toBeInTheDocument();
    });

    const eventNameField = screen.getByLabelText('Name of the event(s)');
    fireEvent.mouseDown(eventNameField);
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('Rokha'));

    const locationField = screen.getByLabelText('Location');
    fireEvent.change(locationField, { target: { value: '456 Oak Ave' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/bookings/1'),
        {
          clientId: 1,
          eventDate: '2023-12-25',
          eventTime: '10:00',
          eventType: 'Bridal',
          eventName: 'Rokha',
          clientsHairAndMakeup: 'Yes',
          clientsHairOnly: 'No',
          clientsMakeupOnly: 'No',
          locationAddress: '456 Oak Ave',
          additionalNotes: 'Please arrive early.',
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Rokha')).toBeInTheDocument();
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Edit Booking')).not.toBeInTheDocument();
    });
  });

  test('handleSaveEdit handles error when axios.put fails', async () => {
    axios.put.mockRejectedValue(new Error('Network Error'));

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ThemeProvider theme={theme}>
        <Bookings />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const row = screen.getByText('John Doe').closest('div[role="row"]');
    expect(row).toBeInTheDocument();

    const editButton = within(row).getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Edit Booking')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error updating booking:',
        expect.any(Error)
      );
    });

    expect(screen.getByText('Edit Booking')).toBeInTheDocument();

    consoleErrorMock.mockRestore();
  });
});

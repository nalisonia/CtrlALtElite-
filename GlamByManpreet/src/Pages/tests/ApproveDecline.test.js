import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashBoard from '../DashBoard';
import Modal from 'react-modal';

jest.mock('react-data-table-component', () => {
  const DataTable = ({ title, columns, data, onRowClicked }) => (
    <table>
      <thead>
        <tr>{columns.map((col) => <th key={col.name}>{col.name}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} onClick={() => onRowClicked(row)}>
            {columns.map((col) => (
              <td key={col.name}>{col.selector(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return DataTable;
});

beforeAll(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
  Modal.setAppElement(root);
});

describe('DashBoard Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('approves an inquiry when "Approve" button is clicked in modal', async () => {
    const mockUsers = [
      {
        id: 1,
        firstnameandlastname: 'John Doe',
        phonenumber: '123-456-7890',
        eventdate: '2023-12-25',
        eventtype: 'Wedding',
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<DashBoard />);

    await waitFor(() => screen.getByText(/John Doe/i));

    fireEvent.click(screen.getByText(/John Doe/i));
    await waitFor(() => {
      expect(screen.getByText(/John Doe's Info/i)).toBeInTheDocument();
    });

    global.fetch.mockResolvedValueOnce({ ok: true });
    fireEvent.click(screen.getByText(/Approve/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/inquiry-status", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ userId: 1, status: 'approved' }),
      }));
    });
  });

  it('declines an inquiry when "Decline" button is clicked in modal', async () => {
    const mockUsers = [
      {
        id: 1,
        firstnameandlastname: 'John Doe',
        phonenumber: '123-456-7890',
        eventdate: '2023-12-25',
        eventtype: 'Wedding',
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<DashBoard />);

    await waitFor(() => screen.getByText(/John Doe/i));

    fireEvent.click(screen.getByText(/John Doe/i));
    await waitFor(() => {
      expect(screen.getByText(/John Doe's Info/i)).toBeInTheDocument();
    });

    global.fetch.mockResolvedValueOnce({ ok: true });
    fireEvent.click(screen.getByText(/Decline/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/inquiry-status", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ userId: 1, status: 'declined' }),
      }));
    });
  });
});

import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import BookingInquiry from "../BookingInquiry";
import React from "react";

global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );

describe('BookingInquiry Form Validation', () => {
    beforeEach(() => {
        fetch.mockClear();
      });

    beforeAll(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
      });

   test('validates phone number format', () => {
      render(<BookingInquiry />);
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '12345' }, });
      fireEvent.blur(screen.getByLabelText(/Phone Number/i));
      expect(screen.getByText(/please enter a valid 10-digit phone number/i)).toBeInTheDocument();
   });

   test('calls onSubmit with form data when all fields are valid', async () => {
      const handleSubmitMock = jest.fn();
      render(<BookingInquiry onSubmit={handleSubmitMock} />);
  
      // Fill in the form fields with valid data
      fireEvent.change(screen.getByLabelText(/First Name and Last Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Date of Event/i), { target: { value: '2024-12-01' } });
      fireEvent.change(screen.getByLabelText(/Ready By Time/i), { target: { value: '14:00' } });
      fireEvent.change(screen.getByLabelText(/Type of Service/i), { target: { value: 'Bridal' } });
      fireEvent.change(screen.getByLabelText(/Name of the event/i), { target: { value: 'Wedding Engagement' } });
      fireEvent.change(screen.getByLabelText(/Number of clients requiring both hair and makeup/i), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText(/Number of clients requiring only hair/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/Number of clients requiring only makeup/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/Location\/Address you’d like me to commute to/i), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText(/Additional Notes/i), { target: { value: 'Some notes here' } });
  
      // Submit the form
      //fireEvent.submit(screen.getByTestId('booking-inquiry-form'));
      fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
  
      // Check if handleSubmitMock was called with the expected data as strings
      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
      expect(handleSubmitMock).toHaveBeenCalledWith(expect.objectContaining({
          firstNameAndLastName: 'John Doe',
          phoneNumber: '123-456-7890',
          emailAddress: 'john@example.com',
          eventDate: '2024-12-01',
          eventTime: '14:00',
          eventType: 'Bridal',
          eventName: 'Wedding Engagement',
          clientsHairAndMakeup: '2', // Expecting as string
          clientsHairOnly: '1', // Expecting as string
          clientsMakeupOnly: '1', // Expecting as string
          locationAddress: '123 Main St',
          additionalNotes: 'Some notes here'
      }));
  });

  test('shows validation error messages for required fields and ensures form is not submitted', async () => {
    const handleSubmitMock = jest.fn();
    render(<BookingInquiry onSubmit={handleSubmitMock} />);

    const firstNameField = screen.getByLabelText(/First Name and Last Name/i);
    const phoneField = screen.getByLabelText(/Phone Number/i);
    const emailField = screen.getByLabelText(/Email Address/i);
    const dateField = screen.getByLabelText(/Date of Event/i);
    const eventTimeField = screen.getByLabelText(/Ready By Time/i)
    const eventTypeField = screen.getByLabelText(/Type of Service/i)
    
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    expect(within(firstNameField.parentElement).getByText(/Required/i)).toBeInTheDocument();
    expect(within(phoneField.parentElement).getByText(/Valid phone number required/i)).toBeInTheDocument();
    expect(within(emailField.parentElement).getByText(/Valid email address required/i)).toBeInTheDocument();
    expect(within(dateField.parentElement).getByText(/Please select a date within the next 60 days/i)).toBeInTheDocument();
    expect(within(eventTimeField.parentElement).getByText(/Required/i)).toBeInTheDocument();
    expect(within(eventTypeField.parentElement).getByText(/Required/i)).toBeInTheDocument();

    expect(handleSubmitMock).not.toHaveBeenCalled();
  });
  
  
}); // <-- Added missing closing bracket here

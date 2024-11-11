import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import LogIn from '../LogIn'; 
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import React from 'react';

// Mock the MutationObserver to avoid errors
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
  takeRecords() { return []; }
};

// Mocking useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mocking Supabase client
jest.mock('../../config/supabaseClient', () => ({
  auth: {
    signInWithPassword: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn(),
}));

describe('LogIn component - Email Login Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to /admin if the user is an admin', async () => {
    // Mock successful sign-in response
    supabase.auth.signInWithPassword.mockResolvedValue({ user: {} });

    // Mock the response for checking admin status
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ email: 'admin@example.com' }],
      }),
    });

    render(<LogIn />);

    // Click the "Log In with Email" button to reveal the email form
    fireEvent.click(screen.getByText(/Log In with Email/i));

    // Find the email form specifically and interact with elements within it
    const emailForm = screen.getByRole('form'); // Assuming <form> has role="form"
    
    // Fill out the email and password fields within the email form
    fireEvent.change(within(emailForm).getByLabelText(/Email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(within(emailForm).getByLabelText(/Password/i), { target: { value: 'password' } });

    // Click the "Sign In" button within the email form
    fireEvent.click(within(emailForm).getByRole('button', { name: /Sign In/i }));

    // Wait for the navigation to happen
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin'));
  });

  test('redirects to /userview if the user is not an admin', async () => {
    // Mock successful sign-in response
    supabase.auth.signInWithPassword.mockResolvedValue({ user: {} });

    // Mock the response for checking non-admin status
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [], // No admin email found
      }),
    });

    render(<LogIn />);

    // Click the "Log In with Email" button to reveal the email form
    fireEvent.click(screen.getByText(/Log In with Email/i));

    // Find the email form specifically and interact with elements within it
    const emailForm = screen.getByRole('form'); // Assuming <form> has role="form"
    
    // Fill out the email and password fields within the email form
    fireEvent.change(within(emailForm).getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(within(emailForm).getByLabelText(/Password/i), { target: { value: 'password' } });

    // Click the "Sign In" button within the email form
    fireEvent.click(within(emailForm).getByRole('button', { name: /Sign In/i }));

    // Wait for the navigation to happen
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/userview'));
  });
});

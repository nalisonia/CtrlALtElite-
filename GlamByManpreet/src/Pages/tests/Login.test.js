
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogIn from '../LogIn'; 
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient.js'
import React from 'react';

// Inline mock for MutationObserver
global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
    takeRecords() { return []; }
  };
  
  // Mocking useNavigate with an inline function
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));
  
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
  
      // Trigger email login form display
      fireEvent.click(screen.getByText(/Log In with Email/i));
  
      // Fill out the email and password fields
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
  
      // Submit the form
      fireEvent.click(screen.getByText(/Sign In/i));
  
      // Check redirection to /admin
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
  
      // Trigger email login form display
      fireEvent.click(screen.getByText(/Log In with Email/i));
  
      // Fill out the email and password fields
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
  
      // Submit the form
      fireEvent.click(screen.getByText(/Sign In/i));
  
      // Check redirection to /userview
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/userview'));
    });
  });
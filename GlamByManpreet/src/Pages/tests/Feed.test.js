import { render, screen, waitFor } from '@testing-library/react';
import Feed from '../Feed';
import supabase from '../../config/supabaseClient.js'
import axios from 'axios';
import React from "react";
import { act } from 'react';


jest.mock('axios'); // Mock axios

jest.mock('../../config/supabaseClient', () => ({
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  }));

  // Inline mock for MutationObserver
global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
    takeRecords() { return []; }
  };


describe('Feed component', () => {
  it('fetches and displays feed items from the backend server', async () => {
    // Arrange: Mock API response
    const mockFeedItems = [
      {
        id: 1,
        content: 'Test feed item 1',
        image_url: 'http://example.com/image1.jpg',
      },
      {
        id: 2,
        content: 'Test feed item 2',
        image_url: 'http://example.com/image2.jpg',
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockFeedItems });

    // Act: Render the Feed component
    render(<Feed />);

    // Assert: Check if items are displayed after fetching
    await waitFor(() => {
      expect(screen.getByText('Test feed item 1')).toBeInTheDocument();
      expect(screen.getByText('Test feed item 2')).toBeInTheDocument();
      expect(screen.getAllByRole('img').length).toBe(mockFeedItems.length); // Check that images are rendered
    });
  });

  it('displays an error message if fetching feed items fails', async () => {
    // Arrange: Mock API failure
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    // Act: Render the Feed component
    render(<Feed />);

    // Assert: Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('No feed items available.')).toBeInTheDocument();
    });
  });
});

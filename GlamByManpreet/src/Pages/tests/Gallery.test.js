import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Gallery from '../Gallery';
import AWS from 'aws-sdk';

// Mock AWS SDK
jest.mock('aws-sdk', () => {
  const mockS3Instance = {
    listObjectsV2: jest.fn().mockReturnValue({
      promise: () => Promise.resolve({
        Contents: [
          { Key: 'image1.jpg' },
          { Key: 'image2.jpg' },
        ],
      }),
    }),
  };
  return { S3: jest.fn(() => mockS3Instance), config: { update: jest.fn() } };
});

describe('Gallery component', () => {
  test('fetches and displays images from S3 bucket', async () => {
    render(<Gallery />);
    
    // Wait for images to load
    await waitFor(() => {
      expect(screen.getByAltText('Gallery Item 1')).toBeInTheDocument();
      expect(screen.getByAltText('Gallery Item 2')).toBeInTheDocument();
    });
  });

  test('displays message when no images are available', async () => {
    // Mock an empty S3 bucket response
    AWS.S3.mockImplementationOnce(() => ({
      listObjectsV2: () => ({
        promise: () => Promise.resolve({ Contents: [] })
      }),
    }));

    render(<Gallery />);
    
    // Wait for the no images message to be displayed
    await waitFor(() => {
      expect(screen.getByText('No images available')).toBeInTheDocument();
    });
  });
});
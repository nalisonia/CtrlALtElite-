import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; 
import 'swiper/css';
import Home from '../Home.js';

// Mock the images
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}));

jest.mock('swiper/css', () => {});
jest.mock('../assets/images/actual_homepage_image2.png', () => 'model1.png');
jest.mock('../assets/images/actual_homepage_image4.png', () => 'model2.png');
jest.mock('../assets/images/actual_homepage_image3.png', () => 'model3.png');
jest.mock('../assets/images/actual_homepage_image1.png', () => 'model4.png');


describe('HomePage Component', () => {
  it('renders homepage content', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check if the heading is rendered
    const heading = screen.getByText(/Welcome to GLAM by Manpreet/i);
    expect(heading).toBeInTheDocument();

    // Check if the four images are rendered
    const images = screen.getAllByRole('img');

    console.log(images);
    expect(images.length).toBe(4);
    expect(images[0]).toHaveAttribute('src', 'model1.png');
    expect(images[1]).toHaveAttribute('src', 'model2.png');
    expect(images[2]).toHaveAttribute('src', 'model3.png');
    expect(images[3]).toHaveAttribute('src', 'model4.png');

    /*// Check if the buttons link to the correct routes
    const inquireButton = screen.getByRole('button', { name: /Inquire/i });
    const dashboardButton = screen.getByRole('button', { name: /DashBoard/i });
    const userButton = screen.getByRole('button', { name: /User/i });
    const adminButton = screen.getByRole('button', { name: /admin/i });

    expect(inquireButton).toHaveAttribute('href', '/Booking_Inquiry');
    expect(dashboardButton).toHaveAttribute('href', '/dashboard');
    expect(userButton).toHaveAttribute('href', '/userview');
    expect(adminButton).toHaveAttribute('href', '/admin');*/
  });
});

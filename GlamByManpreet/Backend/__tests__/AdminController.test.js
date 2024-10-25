import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

const pool = require('../db');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  updateInquiryStatus,
  deleteUsers,
} = require('../controllers/adminController');

// Mock external dependencies
jest.mock('../db');
jest.mock('../utils/email'); // Assuming sendEmail is in emailService.js

const { sendEmail } = require('../utils/email');

// Helper functions to mock Express request and response objects
const mockRequest = (params = {}, body = {}, query = {}) => ({
  params,
  body,
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks();

  // Default mock implementation for pool.query
  pool.query.mockImplementation(() => Promise.resolve({ rows: [] }));

  // Mock sendEmail
  sendEmail.mockResolvedValue();
});

// Test for getAllUsers
describe('getAllUsers', () => {
  it('should fetch all users and return as JSON', async () => {
    const mockUsers = [{ id: 1, name: 'John Doe' }];
    pool.query.mockResolvedValue({ rows: mockUsers });

    const req = mockRequest();
    const res = mockResponse();

    await getAllUsers(req, res);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('should handle errors and send 500 status', async () => {
    pool.query.mockRejectedValue(new Error('DB Error'));

    const req = mockRequest();
    const res = mockResponse();

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error fetching users');
  });
});

// Test for getUserById
describe('getUserById', () => {
  it('should fetch a user by ID and return as JSON', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    pool.query.mockResolvedValue({ rows: [mockUser] });

    const req = mockRequest({ id: 1 });
    const res = mockResponse();

    await getUserById(req, res);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 if user not found', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = mockRequest({ id: 1 });
    const res = mockResponse();

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('User not found');
  });

  it('should handle errors and send 500 status', async () => {
    pool.query.mockRejectedValue(new Error('DB Error'));

    const req = mockRequest({ id: 1 });
    const res = mockResponse();

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error fetching user');
  });
});

// Test for updateUser
describe('updateUser', () => {
  it('should update user information and send success message', async () => {
    pool.query.mockResolvedValue();

    const req = mockRequest(
      { id: 1 },
      { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }
    );
    const res = mockResponse();

    await updateUser(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4',
      ['Jane', 'Doe', 'jane@example.com', 1]
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('User updated successfully');
  });

  it('should handle errors and send 500 status', async () => {
    pool.query.mockRejectedValue(new Error('DB Error'));

    const req = mockRequest(
      { id: 1 },
      { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }
    );
    const res = mockResponse();

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error updating user');
  });
});

// Test for deleteUser
describe('deleteUser', () => {
  it('should delete a user and send success message', async () => {
    pool.query.mockResolvedValue();

    const req = mockRequest({ id: 1 });
    const res = mockResponse();

    await deleteUser(req, res);

    expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', [1]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('User deleted successfully');
  });

  it('should handle errors and send 500 status', async () => {
    pool.query.mockRejectedValue(new Error('DB Error'));

    const req = mockRequest({ id: 1 });
    const res = mockResponse();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error deleting user');
  });
});

// // Test for getAllBookings
// describe('getAllBookings', () => {
//   it('should fetch all bookings and return as JSON', async () => {
//     const mockBookings = [{ id: 1, user_id: 1 }];
//     pool.query.mockResolvedValue({ rows: mockBookings });

//     const req = mockRequest();
//     const res = mockResponse();

//     await getAllBookings(req, res);

//     expect(pool.query).toHaveBeenCalledWith('SELECT * FROM bookings');
//     expect(res.json).toHaveBeenCalledWith(mockBookings);
//   });

//   it('should handle errors and send 500 status', async () => {
//     pool.query.mockRejectedValue(new Error('DB Error'));

//     const req = mockRequest();
//     const res = mockResponse();

//     await getAllBookings(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Error fetching bookings');
//   });
// });

// Test for updateBookingStatus
describe('updateBookingStatus', () => {
  it('should update booking status and send success message', async () => {
    pool.query.mockResolvedValue();

    const req = mockRequest({ id: 1 }, { status: 'confirmed' });
    const res = mockResponse();

    await updateBookingStatus(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      ['confirmed', 1]
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Booking status updated successfully');
  });

  it('should handle errors and send 500 status', async () => {
    pool.query.mockRejectedValue(new Error('DB Error'));

    const req = mockRequest({ id: 1 }, { status: 'confirmed' });
    const res = mockResponse();

    await updateBookingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error updating booking status');
  });
});

// Test for deleteUsers
describe('deleteUsers', () => {
  it('should delete users and send success message', async () => {
    pool.query.mockResolvedValue();

    const req = mockRequest({}, { userIds: [1, 2, 3] });
    const res = mockResponse();

    await deleteUsers(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM users WHERE id = ANY($1::int[])',
      [[1, 2, 3]]
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Users deleted successfully');
  });

  it('should return 400 if userIds is invalid', async () => {
    const req = mockRequest({}, { userIds: [] });
    const res = mockResponse();

    await deleteUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid user IDs');
  });

  it('should handle errors and send 500 status', async () => {
    pool.query.mockRejectedValue(new Error('DB Error'));

    const req = mockRequest({}, { userIds: [1, 2, 3] });
    const res = mockResponse();

    await deleteUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error deleting users');
  });
});

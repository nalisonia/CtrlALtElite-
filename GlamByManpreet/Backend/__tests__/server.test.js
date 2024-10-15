const request = require('supertest');
const { Pool } = require('pg');
const app = require('../server'); 

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn()
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('POST /addBooking', () => {
  let pool;

  beforeAll(() => {
    pool = new Pool(); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should successfully add a booking and return bookingId', async () => {
    const mockQueryResult = {
      rows: [{ id: 1 }]
    };
    pool.query.mockResolvedValueOnce(mockQueryResult);

    const requestBody = {
      clientId: 123,
      eventDate: '2024-10-14',
      eventTime: '14:00',
      eventType: 'Wedding',
      eventName: 'John and Jane\'s Wedding',
      clientsHairAndMakeup: 'Yes',
      clientsHairOnly: null,
      clientsMakeupOnly: null,
      locationAddress: '123 Wedding St.',
      additionalNotes: 'Please be on time.'
    };

    const response = await request(app)
      .post('/addBooking')
      .send(requestBody);

    // Check that the response status is 201 
    expect(response.status).toBe(201);

    //debugging statements
    console.log('cccccccccc');
    console.log(response.status);

    // Check that the response contains the bookingId
    expect(response.body).toEqual({ bookingId: 1 });
    //debugging statements
    console.log('xxxxxxxx');
    console.log(response.body);

    expect(pool.query).toHaveBeenCalledWith(
      `
      INSERT INTO bookings (
        client_id, event_date, event_time, event_type, event_name, 
        hair_and_makeup, hair_only, makeup_only, location, additional_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING id;
    `,
      [
        123, '2024-10-14', '14:00', 'Wedding', 'John and Jane\'s Wedding',
        'Yes', null, null, '123 Wedding St.', 'Please be on time.'
      ]
    );
  });
});

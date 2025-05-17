import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary

describe('API Endpoints', () => {
    it('should return a 200 status for the root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });

    // Add more tests for other API endpoints here
});
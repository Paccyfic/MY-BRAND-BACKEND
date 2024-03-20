import request from 'supertest';
import app from '../index';
import { generateString } from '../utils/strings';

let userId: string = '';
let token: string = '';

describe('UserController', () => {

    // SIGNUP
    describe('POST /signup', () => {
        it('should create a new user and return a token', async () => {
            const response = await request(app)
                .post('/api/users/signup')
                .send({
                    name: 'Test User',
                    email: `${generateString()}@example.com`,
                    password: 'password1234',
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
            expect(response.body.data.user.name).toBe('Test User');
            expect(response.body.data.token).toBeDefined();
        });
    });

    // LOGIN
    describe('POST /login', () => {
        it('should log in an existing user and return a token', async () => {
            // Assuming you have a user created for testing
            const existingUser = {
                email: 'ndahiropacific@gmail.com',
                password: 'ndahiro',
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(existingUser);

            token = response.body.data?.token;
            userId = response.body.data?.user?._id;

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data.user.email).toBe(existingUser.email);
            expect(response.body.data.token).toBeDefined();
        });

        it('should return 400 for missing email or password', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email and password required');
        });

        it('should return 404 for non-existing user', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'nonexisting@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        it('should return 400 for incorrect password', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'ndahiropacific@gmail.com',
                    password: 'incorrectpassword',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email or password not correct');
        });
    });

    // LIST USERS
    describe('GET /api/users', () => {
        it('should retrieve all users successfully', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Users retrieved successfully');
            expect(response.body.data).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should retrieve a user by ID successfully', async () => {
            const response = await request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User retrieved successfully');
        });

        it('should return 404 for non-existing user', async () => {
            const response = await request(app)
                .get(`/api/users/nonexistinguserid`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });
    });

    // Additional tests for updateUser, deleteUser, and other UserController methods can be added here
});








/*import request from 'supertest';
import app from '../index';
import { generateString } from '../utils/strings';

let userId: string = '';
let token: string = '';

describe('UserController', () => {

    // SIGNUP
  describe('POST /signup', () => {
    it('should create a new user and return a token', async () => {
      const response = await request(app)
        .post('/api/users/signup')
        .send({
          name: 'Test User',
          email: `${generateString()}@example.com`,
          password: 'password1234',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data.user.name).toBe('Test User');
      expect(response.body.data.token).toBeDefined();
    });
  });

  // LOGIN
  describe('POST /login', () => {
    it('should log in an existing user and return a token', async () => {
      // Assuming you have a user created for testing
      const existingUser = {
        email: 'ndahiropacific@gmail.com',
        password: 'ndahiro',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(existingUser);

        token = response.body.data?.token;
        userId = response.body.data?.user?._id;

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe(existingUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 400 for missing email or password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password required');
    });

  });

  // LIST USERS
  describe('GET /api/users', () => {
    it('should retrieve all users successfully', async () => {
      // Assuming you have users in your mock database
      const response = await request(app)
        .get('/api/users')
        //.set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Users retrieved successfully');
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve a user by ID successfully', async () => {
  
      // Assuming you have a user with the specified ID in your mock database
      const response = await request(app)
        .get(`/api/users/${userId}`)
        //.set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User retrieved successfully');
    });
  
  });
  
  
});
*/
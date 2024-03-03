import request from 'supertest';
import app from '../index';

let commentId: string;
let blogId: string;
let token: string;

describe('CommentController', () => {

    // LOGIN
    describe('POST /api/users/login', () => {
      it('should login a user', async () => {
        const response = await request(app)
          .post('/api/users/login')
          .send({
            email: 'ndahiropacific@gmail.com',
            password: 'ndahiro'
          });
  
        token = response.body.data.token;
  
        expect(response.status).toBe(200);
  
      });
    });

      // CREATE BLOG
  describe('POST /api/blogs', () => {
    it('should create a new blog', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Blog',
          body: 'This is a test blog',
          image: 'https://dummyimage.com/242x100.png/ff4444/ffffff'
        });

        blogId = response.body.data?._id;

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Blog created successfully');
      expect(response.body.data.title).toBe('Test Blog');
    });
  });
  // CREATE COMMENT
  describe('POST /api/comments', () => {
    it('should create a new comment', async () => {
      const response = await request(app).post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: 'Great post',
        blogId: blogId,
      });

        commentId = response.body.data?._id;

        expect(response.status).toBe(201);
    });
  });

  // LIST COMMENTS
    describe('GET /api/comments', () => {
        it('should retrieve all comments successfully', async () => {
        const response = await request(app).get('/api/comments')
        .query({ blogId });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comments retrieved successfully');
        expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    // GET COMMENT
    describe('GET /api/comments/:id', () => {
        it('should retrieve a comment successfully', async () => {
        const response = await request(app)
        .get(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comment retrieved successfully');
        expect(response.body.data?._id).toBe(commentId);
        });
    });
});

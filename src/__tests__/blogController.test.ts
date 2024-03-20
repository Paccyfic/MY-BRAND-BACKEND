import request from 'supertest';
import app from '../index';

let blogId: string;
let token: string;

describe('BlogController', () => {

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

  // LIST BLOGS
  describe('GET /api/blogs', () => {
    it('should retrieve all blogs successfully', async () => {
      const response = await request(app)
        .get('/api/blogs');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Blogs retrieved successfully');
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  // UPDATE BLOG
  describe('PATCH /api/blogs/:id', () => {
    it('should update an existing blog', async () => {
      // Assuming you have a blog created for testing
      const response = await request(app)
        .patch(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Blog',
          body: 'This is an updated blog',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Blog updated successfully');
      expect(response.body.data.title).toBe('Updated Blog');
    });
  });

  // LIKE BLOG
  describe('POST /api/blogs/:id/like', () => {
    it('should like an existing blog', async () => {
      // Assuming you have a blog created for testing
      const response = await request(app)
        .post(`/api/blogs/${blogId}/like`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200);
    });
  });

    // COUNT LIKES
    describe('GET /api/blogs/:id/likes', () => {
      it('should count likes for an existing blog', async () => {
        // Assuming you have a blog created for testing
        const response = await request(app)
          .get(`/api/blogs/${blogId}/likes`)
  
        expect(response.status).toBe(200);
        expect(response.body.data).toBeGreaterThan(0);
      });
    });

  // UNLIKE BLOG
  describe('POST /api/blogs/:id/unlike', () => {
    it('should unlike an existing blog', async () => {
      // Assuming you have a blog created for testing
      const response = await request(app)
        .post(`/api/blogs/${blogId}/unlike`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200);
    });
  });


  // DELETE BLOG
  describe('DELETE /api/blogs/:id', () => {
    it('should delete an existing blog', async () => {
      // Assuming you have a blog created for testing
      const response = await request(app)
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(204);
    });
  });
});




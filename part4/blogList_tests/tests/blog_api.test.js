const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const Test = require('supertest/lib/test');
const api = supertest(app);
const User = require('../models/user');

let Token;

beforeAll(async () => {
  const user = {
    username: 'testuser',
    password: 'testpassword',
    name: 'Test User'
  };

  await api.post('/api/users').send(user);

  const response = await api.post('/api/login').send(user);
  token = response.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const initialBlogs = [
    { title: 'Test Blog', author: 'Tester', url: 'http://testurl.com', likes: 0 },
  ];
  const response = await api.post('/api/blogs').send(initialBlogs[0]);
  blogToUpdate = response.body; 
});


describe('Blog API', () => {

  //4.8
  /*test('blogs are returned as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body).toHaveLength(initialBlogs.length);
  });*/

  //4.9
  /*test('blogs should have an id property', async () => {
    const response = await api.get('/api/blogs');
  
    console.log(response.body); // Yanıtı kontrol edin
  
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
  
    const blogs = response.body;
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined();
      expect(blog._id).toBeUndefined();
    });
  });*/

  //4:10
  /*test('POST /api/blogs should create a new blog post', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'New Author',
      url: 'http://newexample.com',
      likes: 10,
    };
    
    const initialBlogs = await Blog.find({});
    const initialCount = initialBlogs.length;

    const response = await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/);

    expect(response.body.title).toBe(newBlog.title);
    expect(response.body.author).toBe(newBlog.author);
    expect(response.body.url).toBe(newBlog.url);
    expect(response.body.likes).toBe(newBlog.likes);

    const finalBlogs = await Blog.find({});
    expect(finalBlogs.length).toBe(initialCount + 1);

    const blogTitles = finalBlogs.map(blog => blog.title);
    expect(blogTitles).toContain(newBlog.title);
  });*/

  //4.11
  /*test('POST /api/blogs likes özelliği eksikse varsayılan olarak 0 olmalı', async ()=>{
    const yeniBlog={
      title: 'Varsayılan Likes Blogu',
      author: 'Yazar',
      url: 'http://varsayilanlikes.com',
    };
    const yanit = await api.post('/api/blogs').send(yeniBlog).expect(201).expect('Content-Type', /application\/json/);
  
      expect(yanit.body.title).toBe(yeniBlog.title);
      expect(yanit.body.author).toBe(yeniBlog.author);
      expect(yanit.body.url).toBe(yeniBlog.url);
      expect(yanit.body.likes).toBe(0); 
  });*/


  //4.12
  /*test('POST /api/blogs, title özelliği eksikse 400 Bad Request döndürmeli', async () => {
    const yeniBlog = {
      author: 'Yazar',
      url: 'http://no-title.com',
    };

    const yanit = await api.post('/api/blogs').send(yeniBlog).expect(400);

    expect(yanit.body.error).toContain('Title is required');
  });*/

  /*test('POST /api/blogs, url özelliği eksikse 400 Bad Request döndürmeli', async () => {
    const yeniBlog = {
      title: 'No URL Blogu',
      author: 'Yazar',
    };

    const yanit = await api.post('/api/blogs').send(yeniBlog).expect(400);

    expect(yanit.body.error).toContain('URL is required');
  });*/

  /*test('DELETE /api/blogs/:id successfully deletes a blog', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    expect(blogsAtStart.body).toHaveLength(initialBlogs.length); // Blogların başlangıçta var olduğunu doğrula
  
    const blogToDelete = blogsAtStart.body[0];
  
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  
    const blogsAtEnd = await api.get('/api/blogs');
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1);
  
    const ids = blogsAtEnd.body.map(b => b.id);
    expect(ids).not.toContain(blogToDelete.id);
  });
  

  test('DELETE /api/blogs/:id returns 404 for non-existent blog', async () => {
    const nonExistentId = '607f1f77bcf86cd799439011'; // Örnek geçersiz ID
    await api.delete(`/api/blogs/${nonExistentId}`).expect(404);
  });*/

  test('PUT /api/blogs/:id updates the number of likes', async () => {
    const updatedLikes = 100;
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`);
    expect(updatedBlog.body.likes).toBe(updatedLikes);
  });

  test('PUT /api/blogs/:id returns 400 if likes property is missing', async () => {
    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({}) // likes özelliği eksik
    .expect(400);
  });

  test('PUT /api/blogs/:id returns 404 for non-existent blog', async () => {
    await api
      .put('/api/blogs/invalidid') // Geçersiz ID
      .send({ likes: 50 })
      .expect(404); // 404 Not Found bekleniyor
  });
  

  test('a blog can be added with a valid token', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5
    };
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(1);
    expect(blogsAtEnd[0].title).toBe('Test Blog');
  });
  
});


afterAll(() => {
  mongoose.connection.close();
});

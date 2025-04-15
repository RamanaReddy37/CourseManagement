const request = require('supertest');
const { app, mongoose } = require('./server');

let createdStudentId;

beforeAll(async () => {
  // Ensure DB connection is ready before tests
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Course Management API', () => {

  test('1. Should register a new student successfully', async () => {
    const res = await request(app)
      .post('/courses')
      .send({
        studentName: 'Alice',
        studentEmail: 'alice@example.com',
        studentPhone: '1111111111',
        studentAddress: 'Wonderland',
        course: 'AI'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Student registered successfully');
  });

  test('2. Should fail on duplicate email', async () => {
    const res = await request(app)
      .post('/courses')
      .send({
        studentName: 'Bob',
        studentEmail: 'alice@example.com', // Duplicate
        studentPhone: '2222222222',
        studentAddress: 'Ocean',
        course: 'ML'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email already exists');
  });

  test('3. Should fail on duplicate phone', async () => {
    const res = await request(app)
      .post('/courses')
      .send({
        studentName: 'Charlie',
        studentEmail: 'charlie@example.com',
        studentPhone: '1111111111', // Duplicate
        studentAddress: 'Sky',
        course: 'DS'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Phone number already exists');
  });

  test('4. Should fail on missing required fields', async () => {
    const res = await request(app)
      .post('/courses')
      .send({
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        studentAddress: '',
        course: ''
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('All fields are required');
  });

  test('5. Should return all students', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    createdStudentId = res.body[0]._id; // Store for update/delete
  });

  test('6. Should return students filtered by course name', async () => {
    const res = await request(app).get('/courses?course=AI');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].course).toMatch(/AI/i);
  });

  test('7. Should update a student successfully', async () => {
    const res = await request(app)
      .put(`/courses/${createdStudentId}`)
      .send({
        studentName: 'Alice Updated',
        studentEmail: 'alice@example.com',
        studentPhone: '1111111111',
        studentAddress: 'Wonderland',
        course: 'ML'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.studentName).toBe('Alice Updated');
  });

  test('8. Should return error for updating non-existent student', async () => {
    const res = await request(app)
      .put('/courses/645f4b77e6f1c2a0e50f0000')
      .send({
        studentName: 'Ghost',
        studentEmail: 'ghost@example.com',
        studentPhone: '9999999999',
        studentAddress: 'Nowhere',
        course: 'AI'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Student not found');
  });

  test('9. Should delete a student successfully', async () => {
    const res = await request(app).delete(`/courses/${createdStudentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Student deleted successfully');
  });

  test('10. Should return error for deleting non-existent student', async () => {
    const res = await request(app).delete(`/courses/${createdStudentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });

});

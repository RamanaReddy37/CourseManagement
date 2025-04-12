const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

// Use middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (local instance)
mongoose.connect('mongodb://localhost:27017/courseManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Student Schema and Model
const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true, unique: true },
  studentPhone: { type: String, required: true, unique: true },
  studentAddress: { type: String, required: true },
  course: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);

// API Route to Register Student for Course (Post Request)
// API Route to Register Student for Course (Post Request)
app.post('/courses', async (req, res) => {
  const { studentName, studentEmail, studentPhone, studentAddress, course } = req.body;

  // Basic validation (can be expanded)
  if (!studentName || !studentEmail || !studentPhone || !studentAddress || !course) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check for existing email or phone
    const existingStudent = await Student.findOne({
      $or: [{ studentEmail }, { studentPhone }]
    });

    if (existingStudent) {
      if (existingStudent.studentEmail === studentEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (existingStudent.studentPhone === studentPhone) {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
    }

    const newStudent = new Student({
      studentName,
      studentEmail,
      studentPhone,
      studentAddress,
      course,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });

  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Server error while registering student' });
  }
});


// GET all students OR filter by course (e.g., /courses?course=AI)
app.get('/courses', async (req, res) => {
  try {
    const { course } = req.query;
    let query = {};
    if (course) {
      query.course = { $regex: new RegExp(course, 'i') }; // Case-insensitive
    }

    const students = await Student.find(query);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching students' });
  }
});

// GET route to fetch a single student by ID (For Edit/Update)
app.get('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching student' });
  }
});



// PUT route to update a student (Update Request)
app.put('/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { studentName, studentEmail, studentPhone, studentAddress, course } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, {
      studentName,
      studentEmail,
      studentPhone,
      studentAddress,
      course,
    }, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: 'Error updating student' });
  }
});

// Existing server.js code

// API Route to Delete a Student
app.delete('/courses/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
      const deletedStudent = await Student.findByIdAndDelete(studentId);

      if (deletedStudent) {
          res.status(200).json({ message: 'Student deleted successfully' });
      } else {
          res.status(404).json({ message: 'Student not found' });
      }
  } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Error deleting student' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// At the bottom of server.js
module.exports = { app, mongoose };

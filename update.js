// update.js

window.onload = fetchStudents;

async function fetchStudents() {
  try {
    const response = await fetch('http://localhost:3000/courses');
    const students = await response.json();

    const studentsBody = document.getElementById('students-body');
    studentsBody.innerHTML = ''; // Clear existing rows

    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.studentName}</td>
        <td>${student.studentEmail}</td>
        <td>${student.studentPhone}</td>
        <td>${student.studentAddress}</td>
        <td>${student.course}</td>
        <td><button onclick="editStudent('${student._id}')">Edit</button></td>
      `;
      studentsBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching students:', error);
  }
}

function editStudent(studentId) {
  document.getElementById('update-form-container').style.display = 'block';

  fetch(`http://localhost:3000/courses/${studentId}`)
    .then(response => response.json())
    .then(student => {
      document.getElementById('student-id').value = student._id;
      document.getElementById('studentName').value = student.studentName;
      document.getElementById('studentEmail').value = student.studentEmail;
      document.getElementById('studentPhone').value = student.studentPhone;
      document.getElementById('studentAddress').value = student.studentAddress;
      document.getElementById('course').value = student.course;
    })
    .catch(error => console.error('Error fetching student details:', error));
}

document.getElementById('update-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const studentId = document.getElementById('student-id').value;
  const updatedStudent = {
    studentName: document.getElementById('studentName').value,
    studentEmail: document.getElementById('studentEmail').value,
    studentPhone: document.getElementById('studentPhone').value,
    studentAddress: document.getElementById('studentAddress').value,
    course: document.getElementById('course').value
  };

  try {
    const response = await fetch(`http://localhost:3000/courses/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedStudent)
    });

    const result = await response.json();
    if (response.ok) {
      alert('Student updated successfully!');
      fetchStudents();
      document.getElementById('update-form-container').style.display = 'none';
    } else {
      alert('Error updating student: ' + result.error);
    }
  } catch (error) {
    console.error('Error updating student:', error);
  }
});

function cancelUpdate() {
  document.getElementById('update-form-container').style.display = 'none';
}

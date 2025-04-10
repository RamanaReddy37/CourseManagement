document.getElementById('createCourseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentData = {
    studentName: document.getElementById('studentName').value,
    studentEmail: document.getElementById('studentEmail').value,
    studentPhone: document.getElementById('studentPhone').value,
    studentAddress: document.getElementById('studentAddress').value,
    course: document.getElementById('course').value,
  };

  const messageEl = document.getElementById('formMessage');
  messageEl.textContent = '';
  messageEl.style.color = 'red';

  try {
    const response = await fetch('http://localhost:3000/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    const result = await response.json();

    if (!response.ok) {
      messageEl.textContent = result.error || 'An error occurred';
    } else {
      messageEl.style.color = 'green';
      messageEl.textContent = 'Student registered successfully!';
      document.getElementById('createCourseForm').reset();
    }
  } catch (error) {
    messageEl.textContent = 'Something went wrong. Please try again later.';
    console.error(error);
  }
});

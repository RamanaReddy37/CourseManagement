async function searchByCourse() {
  const courseName = document.getElementById('searchCourse').value.trim();
  const tbody = document.getElementById('students-body');
  tbody.innerHTML = '';

  if (!courseName) {
    alert('Please enter a course name');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/courses?course=${encodeURIComponent(courseName)}`);
    const data = await response.json();

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No students found for this course.</td></tr>';
      return;
    }

    data.forEach(student => {
      const row = `
        <tr>
          <td>${student.studentName}</td>
          <td>${student.studentEmail}</td>
          <td>${student.studentPhone}</td>
          <td>${student.studentAddress}</td>
          <td>${student.course}</td>
        </tr>`;
      tbody.innerHTML += row;
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    tbody.innerHTML = '<tr><td colspan="5">Error fetching data.</td></tr>';
  }
}

// Fetch students from the API
async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:3000/courses');
        const students = await response.json();

        // Create table rows for each student
        const studentsBody = document.getElementById('students-body');
        studentsBody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentName}</td>
                <td>${student.studentEmail}</td>
                <td>${student.studentPhone}</td>
                <td>${student.studentAddress}</td>
                <td>${student.course}</td>
                <td>
                    <button onclick="deleteStudent('${student._id}')">Delete</button>
                </td>
            `;
            studentsBody.appendChild(row);
        });
    } catch (error) {
        console.log('Error fetching students:', error);
    }
}

// Handle delete button click
async function deleteStudent(studentId) {
    // Confirm before deleting
    const isConfirmed = confirm('Are you sure you want to delete this student?');
    if (isConfirmed) {
        try {
            // Send DELETE request to the server to delete the student
            const response = await fetch(`http://localhost:3000/courses/${studentId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Student deleted successfully');
                fetchStudents(); // Refresh the list of students after deletion
            } else {
                alert('Failed to delete student');
            }
        } catch (error) {
            console.log('Error deleting student:', error);
            alert('Error deleting student');
        }
    }
}

// Fetch students on page load
window.onload = fetchStudents;

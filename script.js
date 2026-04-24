// Array to store courses
let courses = [];

// Add course to the list
function addCourse() {
    const semester = document.getElementById('semester').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const creditHours = parseFloat(document.getElementById('creditHours').value);
    const grade = parseFloat(document.getElementById('grade').value);

    // Validation
    if (!semester) {
        showAlert('Please select a semester', 'error');
        return;
    }

    if (!courseName) {
        showAlert('Please enter a course name/code', 'error');
        return;
    }

    if (!creditHours || creditHours <= 0 || creditHours > 10) {
        showAlert('Please enter valid credit hours (0-10)', 'error');
        return;
    }

    if (!grade && grade !== 0) {
        showAlert('Please select a grade', 'error');
        return;
    }

    // Create course object
    const course = {
        id: Date.now(),
        semester: semester,
        name: courseName,
        credits: creditHours,
        grade: grade,
        gradePoints: creditHours * grade
    };

    // Add to array
    courses.push(course);

    // Clear form
    clearForm();

    // Update display
    updateCoursesTable();
    showAlert('Course added successfully!', 'success');
}

// Delete course from list
function deleteCourse(id) {
    courses = courses.filter(course => course.id !== id);
    updateCoursesTable();
    showAlert('Course removed!', 'success');
}

// Update the courses table display
function updateCoursesTable() {
    const tableBody = document.getElementById('coursesTableBody');
    const emptyState = document.getElementById('emptyState');
    const coursesTable = document.getElementById('coursesTable');

    if (courses.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        coursesTable.style.display = 'none';
    } else {
        coursesTable.style.display = 'table';
        emptyState.style.display = 'none';

        tableBody.innerHTML = courses.map(course => `
            <tr>
                <td>
                    <span class="semester-tag">${course.semester}</span>
                </td>
                <td>
                    <span class="course-name">${course.name}</span>
                </td>
                <td>
                    <span class="credit-hours">${course.credits}</span>
                </td>
                <td>
                    <span class="grade-display">${getGradeLabel(course.grade)}</span>
                </td>
                <td>
                    <span class="grade-points">${course.gradePoints.toFixed(2)}</span>
                </td>
                <td>
                    <button class="btn-delete" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

// Convert grade points to letter grade
function getGradeLabel(gradePoint) {
    const gradeMap = {
        '10.0': 'A',
        '9.0': 'A-',
        '8.0': 'B+',
        '7.0': 'B',
        '6.0': 'B-',
        '5.0': 'C+',
        '4.0': 'C',
        '3.0': 'D',
        '0.0': 'F'
    };
    return gradeMap[gradePoint.toString()] || gradePoint.toFixed(1);
}

// Calculate CGPA
function calculateCGPA() {
    if (courses.length === 0) {
        showAlert('Please add at least one course to calculate CGPA', 'error');
        return;
    }

    // Get student details
    const studentName = document.getElementById('studentName').value.trim();
    const studentID = document.getElementById('studentID').value.trim();
    const studentEmail = document.getElementById('studentEmail').value.trim();
    const department = document.getElementById('department').value;

    if (!studentName || !studentID || !studentEmail || !department) {
        showAlert('Please fill in all student details', 'error');
        return;
    }

    // Calculate CGPA
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + course.gradePoints, 0);
    const obtainedCGPA = totalGradePoints / totalCredits;
    const totalCGPA = 10.0; // Maximum possible CGPA on 0-10 scale

    // Calculate progress percentage
    const progressPercent = (obtainedCGPA / totalCGPA) * 100;

    // Display results
    document.getElementById('cgpaValue').textContent = obtainedCGPA.toFixed(2);
    document.getElementById('totalCGPA').textContent = totalCGPA.toFixed(2);
    document.getElementById('totalCreditsValue').textContent = totalCredits.toFixed(2);
    
    // Update progress bar
    document.getElementById('progressBar').style.width = Math.min(progressPercent, 100) + '%';
    document.getElementById('progressPercent').textContent = Math.min(progressPercent.toFixed(1), 100) + '%';

    // Display student information
    const studentDisplay = document.getElementById('studentDisplay');
    document.getElementById('displayName').textContent = studentName;
    document.getElementById('displayID').textContent = studentID;
    document.getElementById('displayEmail').textContent = studentEmail;
    document.getElementById('displayDept').textContent = department;
    studentDisplay.style.display = 'block';

    // Calculate and display SGPA for each semester
    displaySGPABySemester();

    // Show success message with CGPA interpretation
    const interpretation = getCGPAInterpretation(obtainedCGPA);
    showAlert(`CGPA Calculated: ${obtainedCGPA.toFixed(2)} - ${interpretation}`, 'success');

    // Animate results
    animateResultsUpdate();
}

// Calculate and display SGPA by semester
function displaySGPABySemester() {
    // Group courses by semester
    const semesters = {};
    
    courses.forEach(course => {
        if (!semesters[course.semester]) {
            semesters[course.semester] = [];
        }
        semesters[course.semester].push(course);
    });

    // Calculate SGPA for each semester
    const sgpaData = [];
    const semesterOrder = [
        'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 
        'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
    ];

    semesterOrder.forEach(semester => {
        if (semesters[semester]) {
            const courses_in_sem = semesters[semester];
            const credits = courses_in_sem.reduce((sum, c) => sum + c.credits, 0);
            const gradePoints = courses_in_sem.reduce((sum, c) => sum + c.gradePoints, 0);
            const sgpa = gradePoints / credits;

            sgpaData.push({
                semester: semester,
                sgpa: sgpa,
                credits: credits
            });
        }
    });

    // Display SGPA cards
    const sgpaCardsContainer = document.getElementById('sgpaCards');
    const sgpaSection = document.getElementById('sgpaSection');

    if (sgpaData.length > 0) {
        sgpaCardsContainer.innerHTML = sgpaData.map(data => `
            <div class="sgpa-card">
                <div class="sgpa-card-semester">${data.semester}</div>
                <div class="sgpa-card-value">${data.sgpa.toFixed(2)}</div>
                <div class="sgpa-card-credits">${data.credits.toFixed(1)} Credits</div>
            </div>
        `).join('');
        sgpaSection.style.display = 'block';
    } else {
        sgpaSection.style.display = 'none';
    }
}

// Get CGPA interpretation
function getCGPAInterpretation(cgpa) {
    if (cgpa >= 9.0) return 'Outstanding!';
    if (cgpa >= 8.0) return 'Excellent';
    if (cgpa >= 7.0) return 'Very Good';
    if (cgpa >= 6.0) return 'Good';
    if (cgpa >= 5.0) return 'Satisfactory';
    if (cgpa >= 4.0) return 'Acceptable';
    return 'Needs Improvement';
}

// Reset calculator
function resetCalculator() {
    if (courses.length === 0) {
        showAlert('No courses to reset', 'info');
        return;
    }

    if (confirm('Are you sure you want to delete all courses? This action cannot be undone.')) {
        courses = [];
        clearForm();
        updateCoursesTable();
        
        // Reset student details
        document.getElementById('studentName').value = '';
        document.getElementById('studentID').value = '';
        document.getElementById('studentEmail').value = '';
        document.getElementById('department').value = '';
        
        // Reset results
        document.getElementById('cgpaValue').textContent = '0.00';
        document.getElementById('totalCGPA').textContent = '0.00';
        document.getElementById('totalCreditsValue').textContent = '0.00';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressPercent').textContent = '0%';
        document.getElementById('studentDisplay').style.display = 'none';
        document.getElementById('sgpaSection').style.display = 'none';
        
        showAlert('Calculator reset successfully!', 'success');
    }
}

// Clear form inputs
function clearForm() {
    document.getElementById('semester').value = '';
    document.getElementById('courseName').value = '';
    document.getElementById('creditHours').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('semester').focus();
}

// Show alert notification
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Add styles for the alert
    Object.assign(alert.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '1em',
        fontWeight: '600',
        zIndex: '1000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    alert.style.backgroundColor = colors[type] || colors.info;

    // Add to document
    document.body.appendChild(alert);

    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Animate results update
function animateResultsUpdate() {
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = 'pulse 0.6s ease';
        }, index * 100);
    });
}

// Add keyboard support for Enter key
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('semester').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('courseName').focus();
    });

    document.getElementById('courseName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('creditHours').focus();
    });

    document.getElementById('creditHours').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('grade').focus();
    });

    document.getElementById('grade').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addCourse();
    });

    // Add animation styles to head
    addAnimationStyles();
});

// Add animation styles dynamically
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }

        .semester-tag {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #1e40af);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
            white-space: nowrap;
        }

        .course-name {
            font-weight: 600;
            color: #1e40af;
        }

        .credit-hours {
            font-weight: 600;
            color: #059669;
        }

        .grade-display {
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            min-width: 40px;
            text-align: center;
        }

        .grade-points {
            font-weight: 600;
            color: #d97706;
        }
    `;
    document.head.appendChild(style);
}

// Export courses as JSON (optional feature)
function exportCourses() {
    if (courses.length === 0) {
        showAlert('No courses to export', 'error');
        return;
    }

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + course.gradePoints, 0);
    const cgpa = totalGradePoints / totalCredits;

    const data = {
        date: new Date().toLocaleDateString(),
        courses: courses,
        summary: {
            cgpa: cgpa.toFixed(2),
            totalCredits: totalCredits.toFixed(2),
            totalGradePoints: totalGradePoints.toFixed(2)
        }
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CGPA_Calculator_${new Date().getTime()}.json`;
    a.click();

    showAlert('Courses exported successfully!', 'success');
}

// Store courses in localStorage
function saveCourses() {
    localStorage.setItem('cgpaCourses', JSON.stringify(courses));
    showAlert('Courses saved locally!', 'success');
}

// Load courses from localStorage
function loadCourses() {
    const saved = localStorage.getItem('cgpaCourses');
    if (saved) {
        courses = JSON.parse(saved);
        updateCoursesTable();
        showAlert('Courses loaded!', 'success');
    } else {
        showAlert('No saved courses found', 'info');
    }
}

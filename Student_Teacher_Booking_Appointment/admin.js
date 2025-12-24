// ===== Admin Module =====
// Handles admin dashboard functionality

let adminTeachers = [];
let adminStudents = [];
let adminAppointments = [];

/**
 * Load admin dashboard
 */
function loadAdminDashboard() {
    logger.info('Loading admin dashboard');
    showAdminSection('teachers');
    loadAdminTeachers();
    loadAdminStudents();
    loadAdminAppointments();
}

/**
 * Show admin section
 */
function showAdminSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const sectionElement = document.getElementById('admin' + section.charAt(0).toUpperCase() + section.slice(1));
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    logger.debug(`Admin section changed to: ${section}`);
}

/**
 * Show add teacher form
 */
function showAddTeacherForm() {
    document.getElementById('addTeacherForm').classList.remove('hidden');
    document.getElementById('teacherName').focus();
    logger.debug('Add teacher form shown');
}

/**
 * Hide add teacher form
 */
function hideAddTeacherForm() {
    document.getElementById('addTeacherForm').classList.add('hidden');
    document.getElementById('addTeacherForm').reset();
    logger.debug('Add teacher form hidden');
}

/**
 * Load all teachers
 */
function loadAdminTeachers() {
    // Mock data - replace with Firebase query
    adminTeachers = [
        {
            id: '1',
            name: 'Dr. John Smith',
            department: 'Computer Science',
            subject: 'Data Structures',
            email: 'john@example.com',
            status: 'approved'
        },
        {
            id: '2',
            name: 'Prof. Sarah Johnson',
            department: 'Mathematics',
            subject: 'Calculus',
            email: 'sarah@example.com',
            status: 'approved'
        }
    ];
    
    renderTeachersList();
    logger.info('Admin teachers loaded', { count: adminTeachers.length });
}

/**
 * Render teachers list in admin panel
 */
function renderTeachersList() {
    const container = document.getElementById('teachersList');
    
    if (adminTeachers.length === 0) {
        container.innerHTML = '<p class="no-data">No teachers added yet.</p>';
        return;
    }
    
    container.innerHTML = adminTeachers.map(teacher => `
        <div class="list-item">
            <h4>${teacher.name}</h4>
            <p><strong>Department:</strong> ${teacher.department}</p>
            <p><strong>Subject:</strong> ${teacher.subject}</p>
            <p><strong>Email:</strong> ${teacher.email}</p>
            <p><span class="status-badge status-approved">${teacher.status}</span></p>
            <div class="list-item-actions">
                <button class="btn btn-secondary" onclick="editTeacher('${teacher.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteTeacher('${teacher.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    logger.debug('Teachers list rendered');
}

/**
 * Handle add teacher form submission
 */
document.getElementById('addTeacherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newTeacher = {
        id: Date.now().toString(),
        name: document.getElementById('teacherName').value,
        department: document.getElementById('teacherDept').value,
        subject: document.getElementById('teacherSubject').value,
        email: document.getElementById('teacherEmail').value,
        status: 'approved',
        createdAt: new Date().toISOString()
    };
    
    try {
        // TODO: Add to Firebase
        adminTeachers.push(newTeacher);
        
        logger.logAction('ADMIN_ADD_TEACHER', {
            teacherName: newTeacher.name,
            department: newTeacher.department,
            subject: newTeacher.subject,
            email: newTeacher.email
        });
        
        renderTeachersList();
        hideAddTeacherForm();
        showToast('Teacher added successfully!', 'success');
        
    } catch (error) {
        logger.error('Error adding teacher', { message: error.message });
        showToast('Error adding teacher: ' + error.message, 'error');
    }
});

/**
 * Edit teacher
 */
function editTeacher(teacherId) {
    const teacher = adminTeachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    logger.logAction('ADMIN_EDIT_TEACHER', { teacherId, teacherName: teacher.name });
    showToast('Edit feature coming soon!', 'warning');
}

/**
 * Delete teacher
 */
function deleteTeacher(teacherId) {
    if (confirm('Are you sure you want to delete this teacher?')) {
        const teacher = adminTeachers.find(t => t.id === teacherId);
        adminTeachers = adminTeachers.filter(t => t.id !== teacherId);
        
        logger.logAction('ADMIN_DELETE_TEACHER', {
            teacherId,
            teacherName: teacher.name
        });
        
        renderTeachersList();
        showToast('Teacher deleted successfully!', 'success');
    }
}

/**
 * Load students for approval
 */
function loadAdminStudents() {
    // Mock data - replace with Firebase query
    adminStudents = [
        {
            id: '1',
            name: 'Alice Brown',
            email: 'alice@example.com',
            registeredAt: '2024-01-15',
            status: 'pending'
        },
        {
            id: '2',
            name: 'Bob Wilson',
            email: 'bob@example.com',
            registeredAt: '2024-01-14',
            status: 'pending'
        },
        {
            id: '3',
            name: 'Carol Davis',
            email: 'carol@example.com',
            registeredAt: '2024-01-10',
            status: 'approved'
        }
    ];
    
    renderStudentsList();
    logger.info('Admin students loaded', { count: adminStudents.length });
}

/**
 * Render students list for approval
 */
function renderStudentsList() {
    const container = document.getElementById('studentsList');
    
    if (adminStudents.length === 0) {
        container.innerHTML = '<p class="no-data">No students to approve.</p>';
        return;
    }
    
    container.innerHTML = adminStudents.map(student => `
        <div class="list-item">
            <h4>${student.name}</h4>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Registered:</strong> ${student.registeredAt}</p>
            <p><span class="status-badge status-${student.status === 'pending' ? 'pending' : 'approved'}">${student.status}</span></p>
            <div class="list-item-actions">
                ${student.status === 'pending' ? `
                    <button class="btn btn-success" onclick="approveStudent('${student.id}')">Approve</button>
                    <button class="btn btn-danger" onclick="rejectStudent('${student.id}')">Reject</button>
                ` : `
                    <button class="btn btn-secondary" onclick="viewStudent('${student.id}')">View</button>
                `}
            </div>
        </div>
    `).join('');
    
    logger.debug('Students list rendered');
}

/**
 * Approve student
 */
function approveStudent(studentId) {
    const student = adminStudents.find(s => s.id === studentId);
    if (!student) return;
    
    student.status = 'approved';
    
    logger.logAction('ADMIN_APPROVE_STUDENT', {
        studentId,
        studentName: student.name,
        studentEmail: student.email
    });
    
    renderStudentsList();
    showToast('Student approved successfully!', 'success');
}

/**
 * Reject student
 */
function rejectStudent(studentId) {
    if (confirm('Are you sure you want to reject this student?')) {
        const student = adminStudents.find(s => s.id === studentId);
        student.status = 'rejected';
        
        logger.logAction('ADMIN_REJECT_STUDENT', {
            studentId,
            studentName: student.name
        });
        
        renderStudentsList();
        showToast('Student rejected', 'warning');
    }
}

/**
 * View student details
 */
function viewStudent(studentId) {
    const student = adminStudents.find(s => s.id === studentId);
    if (!student) return;
    
    logger.logAction('ADMIN_VIEW_STUDENT', {
        studentId,
        studentName: student.name
    });
    
    showToast(`Viewing ${student.name} - Details window coming soon!`, 'info');
}

/**
 * Load all appointments
 */
function loadAdminAppointments() {
    // Mock data - replace with Firebase query
    adminAppointments = [
        {
            id: '1',
            studentName: 'Alice Brown',
            teacherName: 'Dr. John Smith',
            date: '2024-01-20',
            time: '10:00 AM',
            reason: 'Course Clarification',
            status: 'approved'
        },
        {
            id: '2',
            studentName: 'Bob Wilson',
            teacherName: 'Prof. Sarah Johnson',
            date: '2024-01-21',
            time: '2:00 PM',
            reason: 'Assignment Discussion',
            status: 'pending'
        }
    ];
    
    renderAppointmentsList();
    logger.info('Admin appointments loaded', { count: adminAppointments.length });
}

/**
 * Render appointments list
 */
function renderAppointmentsList() {
    const container = document.getElementById('appointmentsList');
    
    if (adminAppointments.length === 0) {
        container.innerHTML = '<p class="no-data">No appointments scheduled.</p>';
        return;
    }
    
    container.innerHTML = adminAppointments.map(apt => `
        <div class="list-item">
            <h4>${apt.studentName} → ${apt.teacherName}</h4>
            <p><strong>Date:</strong> ${apt.date} at ${apt.time}</p>
            <p><strong>Reason:</strong> ${apt.reason}</p>
            <p><span class="status-badge status-${apt.status}">${apt.status}</span></p>
            <div class="list-item-actions">
                <button class="btn btn-secondary" onclick="viewAppointment('${apt.id}')">View Details</button>
                ${apt.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="cancelAppointment('${apt.id}')">Cancel</button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    logger.debug('Appointments list rendered');
}

/**
 * View appointment details
 */
function viewAppointment(appointmentId) {
    const apt = adminAppointments.find(a => a.id === appointmentId);
    if (!apt) return;
    
    logger.logAction('ADMIN_VIEW_APPOINTMENT', {
        appointmentId,
        studentName: apt.studentName,
        teacherName: apt.teacherName
    });
    
    showToast('Appointment Details: ' + apt.studentName, 'info');
}

/**
 * Cancel appointment
 */
function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const apt = adminAppointments.find(a => a.id === appointmentId);
        apt.status = 'cancelled';
        
        logger.logAction('ADMIN_CANCEL_APPOINTMENT', {
            appointmentId,
            studentName: apt.studentName,
            teacherName: apt.teacherName
        });
        
        renderAppointmentsList();
        showToast('Appointment cancelled', 'warning');
    }
}

logger.info('Admin module loaded');
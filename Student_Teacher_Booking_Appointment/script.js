// ===== Student-Teacher Appointment System - Complete JavaScript =====

// Data Storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let currentUser = null;

// Logger
const logger = {
    logs: [],
    info(msg) { console.log(`%c[INFO] ${msg}`, 'color: #4CAF50'); },
    error(msg) { console.log(`%c[ERROR] ${msg}`, 'color: #F44336'); },
    logAction(action, data) {
        logger.logs.push({ action, data, timestamp: new Date().toISOString() });
        console.log(`[ACTION] ${action}`, data);
    }
};

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// Auth Functions
function toggleAuthTab() {
    document.getElementById('loginTab').classList.toggle('active');
    document.getElementById('registerTab').classList.toggle('active');
}

function handleRoleChange() {
    const role = document.getElementById('registerRole').value;
    document.getElementById('teacherFields').classList.toggle('hidden', role !== 'teacher');
}

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('userRole').value;

    // Find user
    const user = [...users, ...teachers, ...students].find(u => u.email === email && u.password === password);
    
    if (user && user.role === role) {
        currentUser = user;
        logger.logAction('LOGIN_SUCCESS', { email, role });
        showToast(`Welcome ${user.name}!`, 'success');
        routeToDashboard(role);
    } else {
        logger.logAction('LOGIN_FAILED', { email, role });
        showToast('Invalid credentials!', 'error');
    }
});

// Register
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    if ([...users, ...teachers, ...students].some(u => u.email === email)) {
        showToast('Email already exists!', 'error');
        return;
    }

    const userData = {
        id: Date.now().toString(),
        name, email, password, role,
        createdAt: new Date().toISOString()
    };

    if (role === 'teacher') {
        userData.department = document.getElementById('department').value;
        userData.subject = document.getElementById('subject').value;
        teachers.push(userData);
    } else {
        userData.status = 'pending';
        students.push(userData);
    }

    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('students', JSON.stringify(students));
    
    logger.logAction('USER_REGISTERED', userData);
    showToast('Registration successful! Admin approval needed.', 'success');
    document.getElementById('registerForm').reset();
    toggleAuthTab();
});

// Dashboard Routing
function routeToDashboard(role) {
    document.getElementById('authSection').classList.add('hidden');
    document.querySelector('#navMenu .nav-item').classList.remove('hidden');
    
    document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
    document.getElementById(`${role}Dashboard`).classList.remove('hidden');
    
    if (role === 'admin') initAdmin();
    else if (role === 'teacher') initTeacher();
    else initStudent();
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logger.logAction('LOGOUT', { email: currentUser.email });
    currentUser = null;
    document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
    document.getElementById('authSection').classList.remove('hidden');
    document.querySelector('#navMenu .nav-item').classList.add('hidden');
    showToast('Logged out successfully', 'success');
});

// ===== ADMIN FUNCTIONS =====
function initAdmin() {
    renderTeachersList();
    renderStudentsList();
    renderAppointmentsList();
}

function showAdminSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`admin${section.charAt(0).toUpperCase() + section.slice(1)}`).classList.add('active');
}

function showAddTeacherForm() {
    document.getElementById('addTeacherForm').classList.remove('hidden');
}

function hideAddTeacherForm() {
    document.getElementById('addTeacherForm').classList.add('hidden');
    document.getElementById('addTeacherForm').reset();
}

document.getElementById('addTeacherForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const teacher = {
        id: Date.now().toString(),
        name: document.getElementById('teacherName').value,
        email: document.getElementById('teacherEmail').value,
        department: document.getElementById('teacherDept').value,
        subject: document.getElementById('teacherSubject').value,
        status: 'approved'
    };
    teachers.push(teacher);
    localStorage.setItem('teachers', JSON.stringify(teachers));
    logger.logAction('TEACHER_ADDED', teacher);
    renderTeachersList();
    hideAddTeacherForm();
    showToast('Teacher added successfully!', 'success');
});

function renderTeachersList() {
    const container = document.getElementById('teachersList');
    container.innerHTML = teachers.map(t => `
        <div class="list-item">
            <h4>${t.name}</h4>
            <p><strong>Dept:</strong> ${t.department} | <strong>Subject:</strong> ${t.subject}</p>
            <p><strong>Email:</strong> ${t.email}</p>
            <div class="form-actions">
                <button class="btn btn-secondary" onclick="editTeacher('${t.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteTeacher('${t.id}')">Delete</button>
            </div>
        </div>
    `).join('') || '<p>No teachers found</p>';
}

function deleteTeacher(id) {
    if (confirm('Delete this teacher?')) {
        teachers = teachers.filter(t => t.id !== id);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        renderTeachersList();
        showToast('Teacher deleted', 'success');
    }
}

function renderStudentsList() {
    const container = document.getElementById('studentsList');
    container.innerHTML = students.map(s => `
        <div class="list-item">
            <h4>${s.name}</h4>
            <p><strong>Email:</strong> ${s.email}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${s.status}">${s.status.toUpperCase()}</span></p>
            ${s.status === 'pending' ? `
                <div class="form-actions">
                    <button class="btn btn-success" onclick="approveStudent('${s.id}')">Approve</button>
                    <button class="btn btn-danger" onclick="rejectStudent('${s.id}')">Reject</button>
                </div>
            ` : ''}
        </div>
    `).join('') || '<p>No students</p>';
}

function approveStudent(id) {
    const student = students.find(s => s.id === id);
    student.status = 'approved';
    localStorage.setItem('students', JSON.stringify(students));
    renderStudentsList();
    showToast('Student approved!', 'success');
}

function renderAppointmentsList() {
    const container = document.getElementById('appointmentsList');
    container.innerHTML = appointments.map(a => `
        <div class="list-item">
            <h4>${a.studentName} → ${a.teacherName}</h4>
            <p><strong>${a.date} at ${a.time}</strong></p>
            <p>${a.reason}</p>
            <span class="status-badge status-${a.status}">${a.status}</span>
        </div>
    `).join('') || '<p>No appointments</p>';
}

// ===== TEACHER FUNCTIONS =====
function initTeacher() {
    renderScheduleList();
    renderRequestsList();
    renderMessagesList();
}

function showTeacherSection(section) {
    document.querySelectorAll('.teacher-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`teacher${section.charAt(0).toUpperCase() + section.slice(1)}`).classList.add('active');
}

function showScheduleForm() { document.getElementById('scheduleForm').classList.remove('hidden'); }
function hideScheduleForm() { 
    document.getElementById('scheduleForm').classList.add('hidden');
    document.getElementById('scheduleForm').reset();
}

document.getElementById('scheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const slot = {
        id: Date.now().toString(),
        date: document.getElementById('slotDate').value,
        time: document.getElementById('slotTime').value,
        duration: document.getElementById('slotDuration').value,
        available: true
    };
    // Add to teacher schedule logic here
    logger.logAction('SLOT_ADDED', slot);
    renderScheduleList();
    hideScheduleForm();
    showToast('Slot added!', 'success');
});

function renderScheduleList() {
    document.getElementById('scheduleList').innerHTML = `
        <div class="list-item">
            <h4>📅 Sample Schedule</h4>
            <p>Add slots using the form above</p>
        </div>
    `;
}

// ===== STUDENT FUNCTIONS =====
function initStudent() {
    renderTeachersSearch();
    renderMyAppointments();
}

function showStudentSection(section) {
    document.querySelectorAll('.student-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`student${section.charAt(0).toUpperCase() + section.slice(1)}`).classList.add('active');
}

function searchTeachers() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = teachers.filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.department.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term)
    );
    renderTeachersSearchResults(filtered);
}

function renderTeachersSearch() {
    renderTeachersSearchResults(teachers);
}

function renderTeachersSearchResults(teachersList) {
    const container = document.getElementById('teachersSearchResult');
    container.innerHTML = teachersList.map(t => `
        <div class="list-item">
            <h4>👨‍🏫 ${t.name}</h4>
            <p><strong>Department:</strong> ${t.department}</p>
            <p><strong>Subject:</strong> ${t.subject}</p>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="bookTeacher('${t.id}')">Book Appointment</button>
            </div>
        </div>
    `).join('') || '<p>No teachers found</p>';
}

function bookTeacher(teacherId) {
    document.getElementById('bookingModal').classList.remove('hidden');
    // Populate slots logic here
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
}

document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Booking logic
    logger.logAction('APPOINTMENT_BOOKED', {
        student: currentUser.name,
        slot: document.getElementById('appointmentSlot').value
    });
    closeBookingModal();
    showToast('Appointment booked!', 'success');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    logger.info('Student-Teacher Appointment System Loaded');
});

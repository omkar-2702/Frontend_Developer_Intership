// ===== Student Module =====
// Handles student dashboard functionality

let studentTeachers = [];
let studentAppointments = [];
let studentMessages = [];
let currentSelectedTeacher = null;

/**
 * Load student dashboard
 */
function loadStudentDashboard() {
    logger.info('Loading student dashboard');
    showStudentSection('search');
    loadStudentTeachers();
    loadStudentAppointments();
    loadStudentMessages();
}

/**
 * Show student section
 */
function showStudentSection(section) {
    // Hide all sections
    document.querySelectorAll('.student-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const sectionElement = document.getElementById('student' + section.charAt(0).toUpperCase() + section.slice(1));
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    logger.debug(`Student section changed to: ${section}`);
}

/**
 * Load all available teachers
 */
function loadStudentTeachers() {
    // Mock data - replace with Firebase query
    studentTeachers = [
        {
            id: '1',
            name: 'Dr. John Smith',
            department: 'Computer Science',
            subject: 'Data Structures',
            email: 'john@example.com',
            availableSlots: [
                { date: '2024-01-20', time: '10:00 AM', duration: '30' },
                { date: '2024-01-20', time: '2:00 PM', duration: '45' }
            ]
        },
        {
            id: '2',
            name: 'Prof. Sarah Johnson',
            department: 'Mathematics',
            subject: 'Calculus',
            email: 'sarah@example.com',
            availableSlots: [
                { date: '2024-01-21', time: '9:30 AM', duration: '30' },
                { date: '2024-01-22', time: '11:00 AM', duration: '60' }
            ]
        },
        {
            id: '3',
            name: 'Dr. Michael Brown',
            department: 'Physics',
            subject: 'Quantum Mechanics',
            email: 'michael@example.com',
            availableSlots: [
                { date: '2024-01-23', time: '3:00 PM', duration: '45' }
            ]
        }
    ];
    
    renderTeacherSearch();
    logger.info('Student teachers loaded', { count: studentTeachers.length });
}

/**
 * Search teachers
 */
function searchTeachers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    logger.logAction('STUDENT_SEARCH_TEACHERS', {
        searchTerm: searchTerm
    });
    
    const filtered = studentTeachers.filter(teacher => {
        return teacher.name.toLowerCase().includes(searchTerm) ||
               teacher.department.toLowerCase().includes(searchTerm) ||
               teacher.subject.toLowerCase().includes(searchTerm);
    });
    
    renderTeacherSearchResults(filtered);
}

/**
 * Render teacher search
 */
function renderTeacherSearch() {
    renderTeacherSearchResults(studentTeachers);
}

/**
 * Render search results
 */
function renderTeacherSearchResults(teachers) {
    const container = document.getElementById('teachersSearchResult');
    
    if (teachers.length === 0) {
        container.innerHTML = '<p class="no-data">No teachers found. Try searching with different keywords.</p>';
        return;
    }
    
    container.innerHTML = teachers.map(teacher => `
        <div class="list-item">
            <h4>👨‍🏫 ${teacher.name}</h4>
            <p><strong>Department:</strong> ${teacher.department}</p>
            <p><strong>Subject:</strong> ${teacher.subject}</p>
            <p><strong>Email:</strong> ${teacher.email}</p>
            <p><strong>Available Slots:</strong> ${teacher.availableSlots.length}</p>
            <div class="list-item-actions">
                <button class="btn btn-primary" onclick="bookAppointment('${teacher.id}')">Book Appointment</button>
                <button class="btn btn-secondary" onclick="messageTeacher('${teacher.id}')">Send Message</button>
            </div>
        </div>
    `).join('');
    
    logger.debug('Teacher search results rendered', { count: teachers.length });
}

/**
 * Book appointment
 */
function bookAppointment(teacherId) {
    const teacher = studentTeachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    currentSelectedTeacher = teacher;
    
    // Populate available slots in modal
    const slotSelect = document.getElementById('appointmentSlot');
    slotSelect.innerHTML = '<option value="">Select a slot</option>' + teacher.availableSlots.map(slot => `
        <option value="${slot.date}_${slot.time}">${slot.date} at ${slot.time} (${slot.duration} min)</option>
    `).join('');
    
    // Show modal
    document.getElementById('bookingModal').classList.remove('hidden');
    
    logger.logAction('STUDENT_OPEN_BOOKING', {
        teacherId,
        teacherName: teacher.name
    });
}

/**
 * Close booking modal
 */
function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    document.getElementById('bookingForm').reset();
    currentSelectedTeacher = null;
    logger.debug('Booking modal closed');
}

/**
 * Handle booking form submission
 */
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentSelectedTeacher) return;
    
    const slotValue = document.getElementById('appointmentSlot').value;
    const [date, time] = slotValue.split('_');
    const reason = document.getElementById('appointmentReason').value;
    
    const newAppointment = {
        id: Date.now().toString(),
        studentName: currentUser?.email || 'Student',
        teacherName: currentSelectedTeacher.name,
        teacherId: currentSelectedTeacher.id,
        date: date,
        time: time,
        reason: reason,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    try {
        // TODO: Add to Firebase
        studentAppointments.push(newAppointment);
        
        logger.logAction('STUDENT_BOOK_APPOINTMENT', {
            teacherName: currentSelectedTeacher.name,
            date: date,
            time: time,
            reason: reason
        });
        
        showToast('Appointment request sent successfully!', 'success');
        closeBookingModal();
        loadStudentAppointments();
        
    } catch (error) {
        logger.error('Error booking appointment', { message: error.message });
        showToast('Error booking appointment: ' + error.message, 'error');
    }
});

/**
 * Message teacher
 */
function messageTeacher(teacherId) {
    const teacher = studentTeachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    logger.logAction('STUDENT_MESSAGE_TEACHER', {
        teacherId,
        teacherName: teacher.name
    });
    
    showToast('Messaging feature coming soon!', 'info');
}

/**
 * Load student appointments
 */
function loadStudentAppointments() {
    // Mock data - replace with Firebase query
    studentAppointments = [
        {
            id: '1',
            studentName: 'Alice Brown',
            teacherName: 'Dr. John Smith',
            date: '2024-01-20',
            time: '10:00 AM',
            reason: 'Project guidance',
            status: 'approved',
            bookedAt: '2024-01-15'
        },
        {
            id: '2',
            studentName: 'Alice Brown',
            teacherName: 'Prof. Sarah Johnson',
            date: '2024-01-21',
            time: '2:00 PM',
            reason: 'Assignment clarification',
            status: 'pending',
            bookedAt: '2024-01-19'
        }
    ];
    
    renderStudentAppointments();
    logger.info('Student appointments loaded', { count: studentAppointments.length });
}

/**
 * Render student appointments
 */
function renderStudentAppointments() {
    const container = document.getElementById('myAppointmentsList');
    
    if (studentAppointments.length === 0) {
        container.innerHTML = '<p class="no-data">No appointments booked yet. Search and book a teacher now!</p>';
        return;
    }
    
    container.innerHTML = studentAppointments.map(apt => `
        <div class="list-item">
            <h4>📅 ${apt.teacherName}</h4>
            <p><strong>Date & Time:</strong> ${apt.date} at ${apt.time}</p>
            <p><strong>Reason:</strong> ${apt.reason}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${apt.status}">${apt.status}</span></p>
            <div class="list-item-actions">
                ${apt.status === 'approved' ? `
                    <button class="btn btn-secondary" onclick="viewMeetingLink('${apt.id}')">Join Meeting</button>
                ` : ''}
                ${apt.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="cancelAppointmentStudent('${apt.id}')">Cancel</button>
                ` : ''}
                <button class="btn btn-secondary" onclick="sendMessage('${apt.id}')">Send Message</button>
            </div>
        </div>
    `).join('');
    
    logger.debug('Student appointments rendered');
}

/**
 * View meeting link
 */
function viewMeetingLink(appointmentId) {
    const apt = studentAppointments.find(a => a.id === appointmentId);
    if (!apt) return;
    
    logger.logAction('STUDENT_VIEW_MEETING', {
        appointmentId,
        teacherName: apt.teacherName,
        date: apt.date,
        time: apt.time
    });
    
    showToast('Meeting link: https://meet.example.com/appointment-' + appointmentId, 'info');
}

/**
 * Cancel appointment (student)
 */
function cancelAppointmentStudent(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const apt = studentAppointments.find(a => a.id === appointmentId);
        apt.status = 'cancelled';
        
        logger.logAction('STUDENT_CANCEL_APPOINTMENT', {
            appointmentId,
            teacherName: apt.teacherName
        });
        
        renderStudentAppointments();
        showToast('Appointment cancelled', 'warning');
    }
}

/**
 * Send message related to appointment
 */
function sendMessage(appointmentId) {
    const apt = studentAppointments.find(a => a.id === appointmentId);
    if (!apt) return;
    
    logger.logAction('STUDENT_SEND_MESSAGE', {
        appointmentId,
        teacherName: apt.teacherName
    });
    
    showToast('Messaging feature coming soon!', 'info');
}

/**
 * Load student messages
 */
function loadStudentMessages() {
    // Mock data - replace with Firebase query
    studentMessages = [
        {
            id: '1',
            fromTeacher: true,
            sender: 'Dr. John Smith',
            message: 'Your appointment is confirmed. Looking forward to our meeting!',
            timestamp: '2024-01-19 04:30 PM',
            unread: true
        },
        {
            id: '2',
            fromTeacher: false,
            sender: 'You',
            message: 'Thanks for your feedback on the project. It was very helpful.',
            timestamp: '2024-01-18 02:15 PM',
            unread: false
        }
    ];
    
    renderStudentMessages();
    logger.info('Student messages loaded', { count: studentMessages.length });
}

/**
 * Render student messages
 */
function renderStudentMessages() {
    const container = document.getElementById('studentMessagesList');
    
    if (studentMessages.length === 0) {
        container.innerHTML = '<p class="no-data">No messages yet.</p>';
        return;
    }
    
    container.innerHTML = studentMessages.map(msg => `
        <div class="list-item">
            <h4>💬 ${msg.sender} ${msg.unread ? '<span style="color: #ff6b6b;">(NEW)</span>' : ''}</h4>
            <p>${msg.message}</p>
            <p><small>${msg.timestamp}</small></p>
            <div class="list-item-actions">
                <button class="btn btn-secondary" onclick="replyToMessage('${msg.id}')">Reply</button>
                <button class="btn btn-danger" onclick="deleteStudentMessage('${msg.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    logger.debug('Student messages rendered');
}

/**
 * Reply to message
 */
function replyToMessage(messageId) {
    const msg = studentMessages.find(m => m.id === messageId);
    if (!msg) return;
    
    logger.logAction('STUDENT_REPLY_MESSAGE', {
        messageId,
        sender: msg.sender
    });
    
    showToast('Reply feature coming soon!', 'info');
}

/**
 * Delete message (student)
 */
function deleteStudentMessage(messageId) {
    if (confirm('Delete this message?')) {
        const msg = studentMessages.find(m => m.id === messageId);
        studentMessages = studentMessages.filter(m => m.id !== messageId);
        
        logger.logAction('STUDENT_DELETE_MESSAGE', {
            messageId,
            sender: msg.sender
        });
        
        renderStudentMessages();
        showToast('Message deleted', 'success');
    }
}

logger.info('Student module loaded');

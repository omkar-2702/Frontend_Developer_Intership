// ===== Teacher Module =====
// Handles teacher dashboard functionality

let teacherSchedule = [];
let teacherRequests = [];
let teacherMessages = [];

/**
 * Load teacher dashboard
 */
function loadTeacherDashboard() {
    logger.info('Loading teacher dashboard');
    showTeacherSection('schedule');
    loadTeacherSchedule();
    loadTeacherRequests();
    loadTeacherMessages();
}

/**
 * Show teacher section
 */
function showTeacherSection(section) {
    // Hide all sections
    document.querySelectorAll('.teacher-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const sectionElement = document.getElementById('teacher' + section.charAt(0).toUpperCase() + section.slice(1));
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    logger.debug(`Teacher section changed to: ${section}`);
}

/**
 * Show schedule form
 */
function showScheduleForm() {
    document.getElementById('scheduleForm').classList.remove('hidden');
    document.getElementById('slotDate').focus();
    // Set minimum date to today
    document.getElementById('slotDate').min = new Date().toISOString().split('T')[0];
    logger.debug('Schedule form shown');
}

/**
 * Hide schedule form
 */
function hideScheduleForm() {
    document.getElementById('scheduleForm').classList.add('hidden');
    document.getElementById('scheduleForm').reset();
    logger.debug('Schedule form hidden');
}

/**
 * Handle schedule form submission
 */
document.getElementById('scheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newSlot = {
        id: Date.now().toString(),
        date: document.getElementById('slotDate').value,
        time: document.getElementById('slotTime').value,
        duration: document.getElementById('slotDuration').value,
        available: true,
        createdAt: new Date().toISOString()
    };
    
    try {
        // TODO: Add to Firebase
        teacherSchedule.push(newSlot);
        
        logger.logAction('TEACHER_ADD_SCHEDULE', {
            date: newSlot.date,
            time: newSlot.time,
            duration: newSlot.duration
        });
        
        renderScheduleList();
        hideScheduleForm();
        showToast('Availability slot added successfully!', 'success');
        
    } catch (error) {
        logger.error('Error adding schedule', { message: error.message });
        showToast('Error adding schedule: ' + error.message, 'error');
    }
});

/**
 * Load teacher schedule
 */
function loadTeacherSchedule() {
    // Mock data - replace with Firebase query
    teacherSchedule = [
        {
            id: '1',
            date: '2024-01-20',
            time: '10:00 AM',
            duration: '30',
            available: true,
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            date: '2024-01-20',
            time: '2:00 PM',
            duration: '45',
            available: true,
            createdAt: '2024-01-15'
        },
        {
            id: '3',
            date: '2024-01-21',
            time: '9:30 AM',
            duration: '30',
            available: false,
            createdAt: '2024-01-15'
        }
    ];
    
    renderScheduleList();
    logger.info('Teacher schedule loaded', { count: teacherSchedule.length });
}

/**
 * Render schedule list
 */
function renderScheduleList() {
    const container = document.getElementById('scheduleList');
    
    if (teacherSchedule.length === 0) {
        container.innerHTML = '<p class="no-data">No availability slots added yet. Add one to start accepting appointments.</p>';
        return;
    }
    
    container.innerHTML = teacherSchedule.map(slot => `
        <div class="list-item">
            <h4>📅 ${slot.date} at ${slot.time}</h4>
            <p><strong>Duration:</strong> ${slot.duration} minutes</p>
            <p><strong>Status:</strong> <span class="status-badge status-${slot.available ? 'approved' : 'pending'}">${slot.available ? 'Available' : 'Booked'}</span></p>
            <div class="list-item-actions">
                <button class="btn btn-secondary" onclick="editSchedule('${slot.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteSchedule('${slot.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    logger.debug('Schedule list rendered');
}

/**
 * Edit schedule
 */
function editSchedule(slotId) {
    const slot = teacherSchedule.find(s => s.id === slotId);
    if (!slot) return;
    
    logger.logAction('TEACHER_EDIT_SCHEDULE', {
        slotId,
        date: slot.date,
        time: slot.time
    });
    
    showToast('Edit feature coming soon!', 'warning');
}

/**
 * Delete schedule
 */
function deleteSchedule(slotId) {
    if (confirm('Are you sure you want to delete this slot?')) {
        const slot = teacherSchedule.find(s => s.id === slotId);
        teacherSchedule = teacherSchedule.filter(s => s.id !== slotId);
        
        logger.logAction('TEACHER_DELETE_SCHEDULE', {
            slotId,
            date: slot.date,
            time: slot.time
        });
        
        renderScheduleList();
        showToast('Slot deleted successfully!', 'success');
    }
}

/**
 * Load appointment requests
 */
function loadTeacherRequests() {
    // Mock data - replace with Firebase query
    teacherRequests = [
        {
            id: '1',
            studentName: 'Alice Brown',
            studentEmail: 'alice@example.com',
            requestedDate: '2024-01-20',
            requestedTime: '10:00 AM',
            reason: 'Project guidance needed',
            status: 'pending',
            requestedAt: '2024-01-18'
        },
        {
            id: '2',
            studentName: 'Bob Wilson',
            studentEmail: 'bob@example.com',
            requestedDate: '2024-01-21',
            requestedTime: '2:00 PM',
            reason: 'Clarification on assignment',
            status: 'pending',
            requestedAt: '2024-01-19'
        }
    ];
    
    renderRequestsList();
    logger.info('Teacher requests loaded', { count: teacherRequests.length });
}

/**
 * Render appointment requests
 */
function renderRequestsList() {
    const container = document.getElementById('requestsList');
    
    if (teacherRequests.length === 0) {
        container.innerHTML = '<p class="no-data">No appointment requests.</p>';
        return;
    }
    
    container.innerHTML = teacherRequests.map(req => `
        <div class="list-item">
            <h4>📋 ${req.studentName}</h4>
            <p><strong>Email:</strong> ${req.studentEmail}</p>
            <p><strong>Requested Date & Time:</strong> ${req.requestedDate} at ${req.requestedTime}</p>
            <p><strong>Reason:</strong> ${req.reason}</p>
            <p><span class="status-badge status-pending">${req.status}</span></p>
            <div class="list-item-actions">
                ${req.status === 'pending' ? `
                    <button class="btn btn-success" onclick="approveRequest('${req.id}')">Approve</button>
                    <button class="btn btn-danger" onclick="rejectRequest('${req.id}')">Reject</button>
                ` : ''}
                <button class="btn btn-secondary" onclick="contactStudent('${req.id}')">Contact</button>
            </div>
        </div>
    `).join('');
    
    logger.debug('Requests list rendered');
}

/**
 * Approve appointment request
 */
function approveRequest(requestId) {
    const req = teacherRequests.find(r => r.id === requestId);
    if (!req) return;
    
    req.status = 'approved';
    
    logger.logAction('TEACHER_APPROVE_REQUEST', {
        requestId,
        studentName: req.studentName,
        date: req.requestedDate,
        time: req.requestedTime
    });
    
    renderRequestsList();
    showToast('Appointment request approved!', 'success');
}

/**
 * Reject appointment request
 */
function rejectRequest(requestId) {
    if (confirm('Are you sure you want to reject this request?')) {
        const req = teacherRequests.find(r => r.id === requestId);
        req.status = 'rejected';
        
        logger.logAction('TEACHER_REJECT_REQUEST', {
            requestId,
            studentName: req.studentName
        });
        
        renderRequestsList();
        showToast('Request rejected', 'warning');
    }
}

/**
 * Contact student
 */
function contactStudent(requestId) {
    const req = teacherRequests.find(r => r.id === requestId);
    if (!req) return;
    
    logger.logAction('TEACHER_CONTACT_STUDENT', {
        requestId,
        studentName: req.studentName,
        studentEmail: req.studentEmail
    });
    
    showToast('Messaging feature coming soon!', 'info');
}

/**
 * Load messages
 */
function loadTeacherMessages() {
    // Mock data - replace with Firebase query
    teacherMessages = [
        {
            id: '1',
            studentName: 'Alice Brown',
            message: 'Hi sir, I have a doubt about the project. Can we meet?',
            timestamp: '2024-01-19 03:45 PM',
            unread: true
        },
        {
            id: '2',
            studentName: 'Bob Wilson',
            message: 'Thank you for the feedback on my assignment.',
            timestamp: '2024-01-18 10:20 AM',
            unread: false
        }
    ];
    
    renderMessagesList();
    logger.info('Teacher messages loaded', { count: teacherMessages.length });
}

/**
 * Render messages list
 */
function renderMessagesList() {
    const container = document.getElementById('messagesList');
    
    if (teacherMessages.length === 0) {
        container.innerHTML = '<p class="no-data">No messages.</p>';
        return;
    }
    
    container.innerHTML = teacherMessages.map(msg => `
        <div class="list-item" style="opacity: ${msg.unread ? '1' : '0.7'}">
            <h4>💬 ${msg.studentName} ${msg.unread ? '<span style="color: #ff6b6b;">(NEW)</span>' : ''}</h4>
            <p>${msg.message}</p>
            <p><small>${msg.timestamp}</small></p>
            <div class="list-item-actions">
                <button class="btn btn-secondary" onclick="replyMessage('${msg.id}')">Reply</button>
                <button class="btn btn-danger" onclick="deleteMessage('${msg.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    logger.debug('Messages list rendered');
}

/**
 * Reply to message
 */
function replyMessage(messageId) {
    const msg = teacherMessages.find(m => m.id === messageId);
    if (!msg) return;
    
    logger.logAction('TEACHER_REPLY_MESSAGE', {
        messageId,
        studentName: msg.studentName
    });
    
    showToast('Reply feature coming soon!', 'info');
}

/**
 * Delete message
 */
function deleteMessage(messageId) {
    if (confirm('Delete this message?')) {
        const msg = teacherMessages.find(m => m.id === messageId);
        teacherMessages = teacherMessages.filter(m => m.id !== messageId);
        
        logger.logAction('TEACHER_DELETE_MESSAGE', {
            messageId,
            studentName: msg.studentName
        });
        
        renderMessagesList();
        showToast('Message deleted', 'success');
    }
}

logger.info('Teacher module loaded');

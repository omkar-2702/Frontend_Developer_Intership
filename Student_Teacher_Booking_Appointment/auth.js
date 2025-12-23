// ===== Authentication Module =====
// Handles user login, registration, and session management

// Current logged-in user state
let currentUser = null;
let currentUserRole = null;

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    logger.info(`Toast: ${message} (${type})`);
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Toggle between login and register tabs
 */
function toggleAuthTab() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    loginTab.classList.toggle('active');
    registerTab.classList.toggle('active');
    
    logger.debug('Authentication tab toggled');
}

/**
 * Handle role change in registration
 */
function handleRoleChange() {
    const role = document.getElementById('registerRole').value;
    const teacherFields = document.getElementById('teacherFields');
    
    if (role === 'teacher') {
        teacherFields.classList.remove('hidden');
    } else {
        teacherFields.classList.add('hidden');
    }
    
    logger.debug(`Registration role changed to: ${role}`);
}

/**
 * Login user (with Firebase integration when configured)
 */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (!email || !password || !role) {
        showToast('Please fill in all fields', 'error');
        logger.warn('Login attempt with missing fields');
        return;
    }
    
    // Show loading spinner
    document.getElementById('loadingSpinner').classList.remove('hidden');
    
    try {
        // TODO: Integrate Firebase Authentication
        // For now, using mock authentication
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock validation
        if (email && password.length >= 6) {
            currentUser = {
                uid: Math.random().toString(36).substr(2, 9),
                email: email,
                role: role,
                loginTime: new Date().toISOString()
            };
            currentUserRole = role;
            
            logger.logAction('USER_LOGIN', {
                email: email,
                role: role,
                timestamp: new Date().toISOString()
            });
            
            showToast(`Welcome, ${role}!`, 'success');
            
            // Hide loading spinner
            document.getElementById('loadingSpinner').classList.add('hidden');
            
            // Route to appropriate dashboard
            routeToUserDashboard(role);
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        logger.error('Login error', { message: error.message });
        showToast('Login failed: ' + error.message, 'error');
        document.getElementById('loadingSpinner').classList.add('hidden');
    }
});

/**
 * Register user (with Firebase integration when configured)
 */
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    
    if (!name || !email || !password || !role) {
        showToast('Please fill in all fields', 'error');
        logger.warn('Registration attempt with missing fields');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        logger.warn('Registration attempt with weak password');
        return;
    }
    
    // Show loading spinner
    document.getElementById('loadingSpinner').classList.remove('hidden');
    
    try {
        // Prepare registration data
        const registrationData = {
            name: name,
            email: email,
            password: password,
            role: role,
            status: role === 'student' ? 'pending' : 'approved',
            createdAt: new Date().toISOString()
        };
        
        // If teacher, add teacher-specific fields
        if (role === 'teacher') {
            registrationData.department = document.getElementById('department').value;
            registrationData.subject = document.getElementById('subject').value;
        }
        
        // TODO: Send to Firebase
        // For now, using mock registration
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        logger.logAction('USER_REGISTRATION', {
            email: email,
            role: role,
            status: registrationData.status
        });
        
        showToast('Registration successful! Please login.', 'success');
        
        // Clear form
        document.getElementById('registerForm').reset();
        
        // Switch to login tab
        toggleAuthTab();
        
        // Clear login form for easy access
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginEmail').focus();
        
    } catch (error) {
        logger.error('Registration error', { message: error.message });
        showToast('Registration failed: ' + error.message, 'error');
    } finally {
        document.getElementById('loadingSpinner').classList.add('hidden');
    }
});

/**
 * Route user to appropriate dashboard based on role
 */
function routeToUserDashboard(role) {
    // Hide auth section
    document.getElementById('authSection').classList.add('hidden');
    
    // Update navbar
    const navMenu = document.getElementById('navMenu');
    navMenu.querySelector('.nav-item').classList.remove('hidden');
    
    // Show appropriate dashboard
    switch(role) {
        case 'admin':
            document.getElementById('adminDashboard').classList.remove('hidden');
            loadAdminDashboard();
            logger.info('Admin dashboard loaded');
            break;
        case 'teacher':
            document.getElementById('teacherDashboard').classList.remove('hidden');
            loadTeacherDashboard();
            logger.info('Teacher dashboard loaded');
            break;
        case 'student':
            document.getElementById('studentDashboard').classList.remove('hidden');
            loadStudentDashboard();
            logger.info('Student dashboard loaded');
            break;
    }
    
    logger.info(`User routed to ${role} dashboard`);
}

/**
 * Logout user
 */
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    
    logger.logAction('USER_LOGOUT', {
        email: currentUser?.email,
        role: currentUserRole,
        sessionDuration: 'N/A'
    });
    
    // Reset state
    currentUser = null;
    currentUserRole = null;
    
    // Hide all dashboards
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('teacherDashboard').classList.add('hidden');
    document.getElementById('studentDashboard').classList.add('hidden');
    
    // Show auth section
    document.getElementById('authSection').classList.remove('hidden');
    
    // Hide logout button
    document.getElementById('navMenu').querySelector('.nav-item').classList.add('hidden');
    
    // Clear forms
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    
    // Switch to login tab
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    if (!loginTab.classList.contains('active')) {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    }
    
    showToast('Logged out successfully', 'success');
    logger.info('User logged out successfully');
});

/**
 * Get current user
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Get current user role
 */
function getCurrentUserRole() {
    return currentUserRole;
}

/**
 * Check if user is authenticated
 */
function isUserAuthenticated() {
    return currentUser !== null;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

logger.info('Authentication module loaded');

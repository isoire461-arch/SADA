// Session management
function getCurrentUser() {
    const userStr = sessionStorage.getItem('sedaCurrentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    sessionStorage.setItem('sedaCurrentUser', JSON.stringify(user));
}

function logout() {
    sessionStorage.removeItem('sedaCurrentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in
function checkAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Check if user is admin
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.role === 'admin';
}

// Admin storage keys
const ADMIN_STORAGE_KEY = 'sedaAdmin';
const ADMIN_REGISTRY_KEY = 'sedaAdminRegistry';

// Generate admin secret key
function generateAdminKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = 'SEDA_ADMIN_';
    for (let i = 0; i < 16; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// Enhanced hash function for passwords
function enhancedHash(str) {
    let hash = 0;
    const salt = 'SEDA_SECURE_SALT_2026';
    const saltedStr = str + salt;
    for (let i = 0; i < saltedStr.length; i++) {
        const char = saltedStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    // Multiple iterations for extra security
    for (let i = 0; i < 1000; i++) {
        hash = ((hash << 5) - hash) + i;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

// Legacy hash for backward compatibility
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

// Initialize admin on first load
function initializeAdmin() {
    console.log('[INIT] Starting admin initialization...');
    
    // DEBUG: Log current admin state before any changes
    const existingAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    console.log('[INIT] Existing admin data:', existingAdmin ? 'FOUND' : 'NOT FOUND');
    if (existingAdmin) {
        const parsedAdmin = JSON.parse(existingAdmin);
        console.log('[INIT] Existing admin username:', parsedAdmin.username);
        console.log('[INIT] Existing admin email:', parsedAdmin.email);
        console.log('[INIT] Existing adminKey:', parsedAdmin.adminKey);
    }
    
    // Force reset admin for known credentials (set to true ONLY for development/reset)
    const forceReset = false;
    
    if (forceReset) {
        console.log('[INIT] Force resetting admin data - THIS WILL INVALIDATE EXISTING ADMIN KEY!');
        localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    
    let adminData = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!adminData) {
        console.log('[INIT] No admin found, creating new admin');
        const adminKey = generateAdminKey();
        // Known admin password for demo purposes
        const adminPassword = 'SEDAadmin2026';
        const admin = {
            username: 'admin',
            email: 'admin@seda.org',
            password: enhancedHash(adminPassword),
            role: 'owner',
            createdAt: new Date().toISOString(),
            adminKey: adminKey,
            isOwner: true
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
        console.log('[INIT] Admin created with credentials: admin / SEDAadmin2026');
    } else {
        console.log('[INIT] Admin already exists');
    }
}

// Change admin password
function changeAdminPassword(currentPassword, newPassword) {
    const admin = getAdminData();
    if (!admin) return { success: false, message: 'Admin not found' };
    
    const hashedCurrentPassword = enhancedHash(currentPassword);
    if (admin.password !== hashedCurrentPassword) {
        return { success: false, message: 'Current password is incorrect' };
    }
    
    admin.password = enhancedHash(newPassword);
    admin.passwordChangedAt = new Date().toISOString();
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));

    return { success: true, message: 'Password changed successfully' };
}

// Change admin username
function changeAdminUsername(currentPassword, newUsername) {
    const admin = getAdminData();
    if (!admin) return { success: false, message: 'Admin not found' };
    
    const hashedCurrentPassword = enhancedHash(currentPassword);
    if (admin.password !== hashedCurrentPassword) {
        return { success: false, message: 'Current password is incorrect' };
    }
    
    admin.username = newUsername;
    admin.usernameChangedAt = new Date().toISOString();
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));

    return { success: true, message: 'Username changed successfully' };
}

// Get admin data
function getAdminData() {
    return JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY));
}

// Verify admin credentials
function verifyAdminCredentials(email, password, adminKey) {
    console.log('[AUTH] Verifying admin credentials for:', email);
    const admin = getAdminData();
    if (!admin) {
        console.log('[AUTH] No admin data found');
        return null;
    }
    
    const hashedPassword = enhancedHash(password);
    console.log('[AUTH] Input password hash:', hashedPassword);
    console.log('[AUTH] Stored password hash:', admin.password);
    console.log('[AUTH] Password match:', admin.password === hashedPassword);
    console.log('[AUTH] AdminKey provided:', adminKey || 'EMPTY');
    console.log('[AUTH] Stored AdminKey:', admin.adminKey);
    
    // Check each condition separately
    const emailMatch = (admin.email === email || admin.username === email);
    const passwordMatch = (admin.password === hashedPassword);
    const adminKeyMatch = (adminKey === admin.adminKey);
    
    console.log('[AUTH] Email/Username match:', emailMatch);
    console.log('[AUTH] Password match:', passwordMatch);
    console.log('[AUTH] AdminKey match:', adminKeyMatch);
    
    // Verify with hashed password or admin key only (never plain text)
    if (emailMatch && (passwordMatch || adminKeyMatch)) {
        console.log('[AUTH] Admin verification successful');
        return {
            idNo: 'SEDA_ADMIN_001',
            fullname: 'System Administrator',
            email: admin.email,
            role: 'owner',
            isOwner: true
        };
    }
    console.log('[AUTH] Admin verification failed - conditions not met');
    return null;
}

// Form mode management
let isLoginMode = true;
let isAdminMode = true;

function toggleForm(mode) {
    // Admin mode is always on now - no toggling needed
    isAdminMode = true;
    isLoginMode = true;
    document.getElementById('formTitle').textContent = 'Administrator Access - Secure Login';
    document.getElementById('adminKeyGroup').style.display = 'block';
    document.getElementById('submitBtn').textContent = 'Admin Login';
    const emailLabel = document.querySelector('label[for="email"]');
    if (emailLabel) emailLabel.textContent = 'Admin Username or Email';
    document.getElementById('authForm').reset();
}

// Form validation and submission - with diagnostic logging
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();

    console.log('[LOGIN] Form submit triggered');
    console.log('[LOGIN] Checking required elements...');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Safely get fullname and confirmPassword (they may not exist in login form)
    const fullnameEl = document.getElementById('fullname');
    const confirmPasswordEl = document.getElementById('confirmPassword');
    const fullname = fullnameEl ? fullnameEl.value : '';
    const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : '';
    const adminKey = document.getElementById('adminKey').value;

    console.log('[LOGIN] Email:', email || 'empty');
    console.log('[LOGIN] Password provided:', !!password);
    console.log('[LOGIN] fullname element exists:', !!fullnameEl);
    console.log('[LOGIN] confirmPassword element exists:', !!confirmPasswordEl);

    if (isAdminMode) {
        console.log('[LOGIN] Mode: Admin Login');
        // Admin login validation
        if (email && password) {
            console.log('[LOGIN] Attempting admin login...');
            const adminUser = verifyAdminCredentials(email, password, adminKey);
            
            if (adminUser) {
                console.log('[LOGIN] Admin login successful!');
                // Set admin session
                setCurrentUser(adminUser);
                
                // Secure login process
                const btn = document.getElementById('submitBtn');
                btn.textContent = 'Verifying admin credentials...';
                btn.disabled = true;

                setTimeout(() => {
                    alert('Admin login successful! Redirecting to dashboard...');
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                console.log('[LOGIN] Admin login FAILED - invalid credentials');
                alert('Invalid admin credentials or admin key');
            }
        } else {
            console.log('[LOGIN] Missing email or password');
            alert('Please enter admin username and password');
        }
    } else if (isLoginMode) {
        console.log('[LOGIN] Mode: Regular User Login');
        // Regular user login validation
        if (email && password) {
            // Validate against stored users
            const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
            const hashedPassword = enhancedHash(password);
            const validUser = users.find(u => 
                (u.email === email || u.username === email) && 
                u.password === hashedPassword
            );
            
            if (validUser) {
                // Check if user is verified
                if (validUser.verified !== true) {
                    console.log('[LOGIN] User not verified');
                    alert('Your account is not yet verified. Please contact an administrator to verify your account.');
                    return;
                }
                
                console.log('[LOGIN] User login successful!');
                // Set session
                setCurrentUser({
                    idNo: validUser.idNo,
                    fullname: validUser.fullname,
                    email: validUser.email,
                    role: validUser.role || 'user'
                });
                
                // Simulate login process
                const btn = document.getElementById('submitBtn');
                btn.textContent = 'Logging in...';
                btn.disabled = true;

                setTimeout(() => {
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                console.log('[LOGIN] Invalid credentials');
                alert('Invalid email/username or password');
            }
        } else {
            alert('Please fill in all fields');
        }
    } else {
        // Sign up validation
        if (!fullname) {
            alert('Please enter your full name');
            return;
        }
        if (!email) {
            alert('Please enter your email');
            return;
        }
        if (!password) {
            alert('Please enter a password');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // Save registration data to localStorage
        const userData = {
            fullname: fullname,
            username: email.split('@')[0],
            email: email,
            password: enhancedHash(password), // Use enhanced hash for security
            role: 'user', // Default role
            registrationDate: new Date().toISOString()
        };

        const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
        
        // Check if email already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert('An account with this email already exists');
            return;
        }
        
        users.push(userData);
        localStorage.setItem('sedaUsers', JSON.stringify(users));

        // Simulate sign up process
        const btn = document.getElementById('submitBtn');
        btn.textContent = 'Creating account...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Account created successfully! Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        }, 2000);
    }
});

// Keyboard navigation and shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit form
    if (e.key === 'Enter' && (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON')) {
        if (e.target.form) {
            e.target.form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        // Let default tab behavior work
        return;
    }
    
    // Ctrl/Cmd + Enter to toggle between login/signup
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        toggleForm(isLoginMode ? 'signup' : 'login');
    }
});

// Toggle event listeners - simplified for admin only
document.getElementById('adminLoginToggle').addEventListener('click', function(e) {
    e.preventDefault();
    // Already in admin mode, just reset form
    document.getElementById('authForm').reset();
});

// Initialize admin on page load
window.addEventListener('load', function() {
    console.log('[LOAD] Window loaded, initializing...');
    // Initialize admin if not exists
    initializeAdmin();
    
    // Particle animation
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 5 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 6 + 's';
            particlesContainer.appendChild(particle);
        }
    }
    console.log('[LOAD] Initialization complete');
});

// Add some interactive effects
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

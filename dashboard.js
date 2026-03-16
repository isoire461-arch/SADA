// Dashboard functionality
let registeredUsers = JSON.parse(localStorage.getItem('sedaUsers')) || [];

// Authentication check - must be logged in
function checkDashboardAuth() {
    const currentUserStr = sessionStorage.getItem('sedaCurrentUser');
    if (!currentUserStr) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(currentUserStr);
}

// Check if current user is admin or owner
function isCurrentUserAdmin() {
    const currentUser = checkDashboardAuth();
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner' || currentUser.isOwner === true);
}

// Logout function
function logout() {
    sessionStorage.removeItem('sedaCurrentUser');
    window.location.href = 'index.html';
}

// Export users to Excel (CSV)
function exportToExcel() {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    if (users.length === 0) {
        alert('No users to export!');
        return;
    }
    
    // CSV header
    const headers = ['ID No', 'Full Name', 'Gender', 'Date of Birth', 'Religion', 'Tribe', 'Section', 'Job Title', 'Email', 'Phone', 'Role', 'Verified', 'Registration Date'];
    
    // CSV rows
    const rows = users.map(user => {
        const regDate = user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A';
        const dob = user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A';
        return [
            user.idNo || '',
            user.fullname || '',
            user.gender || '',
            dob,
            user.religion || '',
            user.tribe || '',
            user.section || '',
            user.jobTitle || '',
            user.email || '',
            user.phone || '',
            user.role || 'user',
            user.verified === true ? 'Verified' : 'Pending',
            regDate
        ];
    });
    
    // Create CSV content
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SEDA_Users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    alert('Users exported to Excel successfully!');
}

// Export users to PDF
function exportToPDF() {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    if (users.length === 0) {
        alert('No users to export!');
        return;
    }
    
    // Create printable HTML content
    let printContent = `
        <html>
        <head>
            <title>SEDA Registered Users</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; color: #333; }
                .date { text-align: center; color: #666; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; font-size: 10px; }
                th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                th { background-color: #333; color: white; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .verified { color: green; }
                .pending { color: orange; }
            </style>
        </head>
        <body>
            <h1>SEDA Registered Users</h1>
            <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>ID No</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Religion</th>
                        <th>Tribe</th>
                        <th>Section</th>
                        <th>Job Title</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Reg. Date</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    users.forEach(user => {
        const regDate = user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A';
        const dob = user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A';
        const verifiedClass = user.verified === true ? 'verified' : 'pending';
        const verifiedText = user.verified === true ? 'Verified' : 'Pending';
        
        printContent += `
            <tr>
                <td>${user.idNo || ''}</td>
                <td>${user.fullname || ''}</td>
                <td>${user.gender || ''}</td>
                <td>${dob}</td>
                <td>${user.religion || ''}</td>
                <td>${user.tribe || ''}</td>
                <td>${user.section || ''}</td>
                <td>${user.jobTitle || ''}</td>
                <td>${user.email || ''}</td>
                <td>${user.phone || ''}</td>
                <td>${user.role || 'user'}</td>
                <td class="${verifiedClass}">${verifiedText}</td>
                <td>${regDate}</td>
            </tr>
        `;
    });
    
    printContent += `
                </tbody>
            </table>
            <p style="text-align: center; margin-top: 20px; color: #666;">Total Users: ${users.length}</p>
        </body>
        </html>
    `;
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// View passport picture
function viewPassport(index) {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const user = users[index];
    
    if (!user || !user.passport) {
        alert('No passport photo available for this user.');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'passportModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center;';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: white; padding: 20px; border-radius: 10px; max-width: 500px; max-height: 80vh; overflow: auto; text-align: center;';
    
    const img = document.createElement('img');
    img.src = user.passport;
    img.style.cssText = 'max-width: 100%; max-height: 60vh; border-radius: 5px;';
    
    const name = document.createElement('h3');
    name.textContent = user.fullname || 'User Passport';
    name.style.cssText = 'margin: 15px 0 5px; color: #333;';
    
    const idNo = document.createElement('p');
    idNo.textContent = 'ID: ' + (user.idNo || 'N/A');
    idNo.style.cssText = 'color: #666; margin: 0;';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'margin-top: 15px; padding: 10px 30px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;';
    closeBtn.onclick = () => modal.remove();
    
    modalContent.appendChild(name);
    modalContent.appendChild(idNo);
    modalContent.appendChild(img);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Download individual registration form as PDF
function downloadRegistrationForm(index) {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const user = users[index];
    
    if (!user) {
        alert('User not found.');
        return;
    }
    
    const regDate = user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A';
    const dob = user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A';
    const verifiedText = user.verified === true ? 'Verified' : 'Pending';
    
    let formContent = `
        <html>
        <head>
            <title>Registration Form - ${user.fullname}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; }
                h1 { text-align: center; color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h2 { color: #333; margin: 0; }
                .header p { color: #666; margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f5f5f5; width: 30%; color: #333; }
                .passport-section { text-align: center; margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
                .passport-section img { max-width: 200px; max-height: 250px; border-radius: 5px; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
                .status { padding: 5px 10px; border-radius: 3px; }
                .verified { background: #d4edda; color: #155724; }
                .pending { background: #fff3cd; color: #856404; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <h1>S.E.D.A Registration Form</h1>
            <div class="header">
                <h2>${user.fullname || 'N/A'}</h2>
                <p>ID No: ${user.idNo || 'N/A'}</p>
                <p>Registration Date: ${regDate}</p>
                <p><span class="status ${user.verified === true ? 'verified' : 'pending'}">${verifiedText}</span></p>
            </div>
            
            <table>
                <tr><th>Gender</th><td>${user.gender || 'N/A'}</td></tr>
                <tr><th>Date of Birth</th><td>${dob}</td></tr>
                <tr><th>Religion</th><td>${user.religion || 'N/A'}</td></tr>
                <tr><th>Tribe/Language</th><td>${user.tribe || 'N/A'}</td></tr>
                <tr><th>Section</th><td>${user.section || 'N/A'}</td></tr>
                <tr><th>Job Title</th><td>${user.jobTitle || 'N/A'}</td></tr>
                <tr><th>Email</th><td>${user.email || 'N/A'}</td></tr>
                <tr><th>Phone</th><td>${user.phone || 'N/A'}</td></tr>
                <tr><th>Role</th><td>${user.role || 'user'}</td></tr>
            </table>
            
            ${user.passport ? `
            <div class="passport-section">
                <h3>Passport Photo</h3>
                <img src="${user.passport}" alt="Passport Photo">
            </div>
            ` : ''}
            
            ${user.notes ? `
            <table>
                <tr><th>Additional Notes</th><td>${user.notes}</td></tr>
            </table>
            ` : ''}
            
            <div class="footer">
                <p>Generated by S.E.D.A System on ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `;
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(formContent);
    printWindow.document.close();
    printWindow.print();
}

// Update UI based on user role
function updateUIBasedOnRole() {
    const currentUser = checkDashboardAuth();
    if (!currentUser) return;
    
    const userBadge = document.getElementById('userBadge');
    if (userBadge) {
        userBadge.textContent = currentUser.role === 'owner' ? 'Owner' : (currentUser.role === 'admin' ? 'Admin' : 'User');
    }
    
    // Show/hide admin-only features
    const registrationTab = document.querySelector('.sidebar-menu a[onclick*="registration"]');
    const addUserBtn = document.getElementById('addUserBtn');
    const quickActionNewReg = document.querySelector('.content-grid .btn[onclick*="registration"]');
    
    const isAdminUser = currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner' || currentUser.isOwner === true);
    
    if (!isAdminUser) {
        // Hide admin-only features for non-admins
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Hide registration tab for non-admins
        if (registrationTab) {
            registrationTab.style.display = 'none';
        }
        
        // Hide Add User button
        if (addUserBtn) {
            addUserBtn.style.display = 'none';
        }
        
        // Hide New Registration quick action
        if (quickActionNewReg) {
            quickActionNewReg.style.display = 'none';
        }
    } else {
        // Show registration tab for admins
        if (registrationTab) {
            registrationTab.style.display = 'flex';
        }
        
        // Show Add User button
        if (addUserBtn) {
            addUserBtn.style.display = 'inline-flex';
        }
        
        // Show New Registration quick action
        if (quickActionNewReg) {
            quickActionNewReg.style.display = 'inline-flex';
        }
    }
    
    // Update user avatar
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && currentUser) {
        const initial = currentUser.fullname ? currentUser.fullname.charAt(0).toUpperCase() : 'U';
        userAvatar.textContent = initial;
    }
}

function showTab(tabName) {
    // Prevent default anchor behavior
    if (window.event) {
        window.event.preventDefault();
    }
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
        // Find the link that matches this tabName in its onclick attribute
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${tabName}'`)) {
            link.classList.add('active');
        }
    });

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Update page title
    const pageTitles = {
        'overview': 'Dashboard Overview',
        'registration': 'Registration Form',
        'users': 'Registered Users',
        'analytics': 'Analytics Dashboard',
        'settings': 'Admin Settings'
    };
    const pageTitleElement = document.getElementById('pageTitle');
    if (pageTitleElement) {
        pageTitleElement.textContent = pageTitles[tabName] || 'Dashboard';
    }

    // Update users list if users tab is selected
    if (tabName === 'users') {
        displayUsers();
        updateStats();
        // Apply role-based UI
        updateUIBasedOnRole();
    }

    // Update stats on overview
    if (tabName === 'overview') {
        updateStats();
    }
    
    // Load admin info on settings tab
    if (tabName === 'settings') {
        loadAdminInfo();
    }
}

// Generate auto ID number
function generateIdNo() {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const nextId = users.length + 1;
    const idNo = `SEDA2026${nextId.toString().padStart(2, '0')}`;
    document.getElementById('regIdNo').value = idNo;
}

function displayUsers() {
    const usersList = document.getElementById('usersList');
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const currentUser = checkDashboardAuth();
    const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner' || currentUser.isOwner === true);

    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="no-users">
                <i class="fas fa-users"></i>
                <p>No registered users yet. Users will appear here after registration.</p>
            </div>
        `;
        return;
    }

    let tableHTML = `
        <div class="data-table-container">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID No</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Religion</th>
                        <th>Tribe</th>
                        <th>Section</th>
                        <th>Job Title</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Verified</th>
                        <th>Registration Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    users.forEach((user, index) => {
        const regDate = new Date(user.registrationDate).toLocaleDateString();
        const dob = user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A';
        // Sanitize user data to prevent XSS
        const sanitize = (str) => {
            const div = document.createElement('div');
            div.textContent = str || 'N/A';
            return div.innerHTML;
        };
        const isUserAdmin = user.role === 'admin' || user.role === 'owner';
        const isVerified = user.verified === true;
        
        // Verification badge
        const verifiedBadge = isVerified 
            ? '<span style="background: #10b981; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check"></i> Verified</span>'
            : '<span style="background: #f59e0b; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-clock"></i> Pending</span>';
        
        tableHTML += `
            <tr>
                <td>${sanitize(user.idNo)}</td>
                <td>${sanitize(user.fullname)}</td>
                <td>${sanitize(user.gender)}</td>
                <td>${dob}</td>
                <td>${sanitize(user.religion)}</td>
                <td>${sanitize(user.tribe)}</td>
                <td>${sanitize(user.section)}</td>
                <td>${sanitize(user.jobTitle)}</td>
                <td>${sanitize(user.email)}</td>
                <td>${sanitize(user.phone)}</td>
                <td>${sanitize(user.role) || 'user'}</td>
                <td>${verifiedBadge}</td>
                <td>${regDate}</td>
                <td class="user-actions">
                    ${user.passport ? `<button class="btn-small" onclick="viewPassport(${index})" style="background: #3b82f6; color: white;">View Photo</button>` : ''}
                    <button class="btn-small btn-edit" onclick="editUser(${index})">Edit</button>
                    ${isAdmin ? `
                        <button class="btn-small ${isVerified ? 'btn-demote' : 'btn-promote'}" onclick="toggleUserVerification(${index})">
                            ${isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        ${!isUserAdmin ? `<button class="btn-small btn-promote" onclick="promoteToAdmin(${index})">Promote</button>` : `<button class="btn-small btn-demote" onclick="demoteToUser(${index})">Demote</button>`}
                        <button class="btn-small" onclick="downloadRegistrationForm(${index})" style="background: #8b5cf6; color: white;">Download Form</button>
                        <button class="btn-small btn-delete" onclick="deleteUser(${index})">Delete</button>
                    ` : ''}
                </td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table></div>';
    usersList.innerHTML = tableHTML;
}

function updateStats() {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const totalUsers = users.length;

    // Calculate recent users (this month)
    const now = new Date();
    const thisMonth = users.filter(user => {
        const regDate = new Date(user.registrationDate);
        return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
    }).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = totalUsers; // For demo, all are active
    document.getElementById('recentUsers').textContent = thisMonth;
}

function deleteUser(index) {
    if (!isCurrentUserAdmin()) {
        alert('Only administrators can delete users.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
        users.splice(index, 1);
        localStorage.setItem('sedaUsers', JSON.stringify(users));
        displayUsers();
        updateStats();
        alert('User deleted successfully!');
    }
}

// Promote user to admin
function promoteToAdmin(index) {
    if (!isCurrentUserAdmin()) {
        alert('Only administrators can promote users.');
        return;
    }
    
    if (confirm('Are you sure you want to promote this user to admin?')) {
        const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
        users[index].role = 'admin';
        localStorage.setItem('sedaUsers', JSON.stringify(users));
        displayUsers();
        alert('User promoted to admin successfully!');
    }
}

// Demote admin to user
function demoteToUser(index) {
    if (!isCurrentUserAdmin()) {
        alert('Only administrators can demote users.');
        return;
    }
    
    if (confirm('Are you sure you want to demote this admin to user?')) {
        const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
        users[index].role = 'user';
        localStorage.setItem('sedaUsers', JSON.stringify(users));
        displayUsers();
        alert('Admin demoted to user successfully!');
    }
}

function editUser(index) {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const user = users[index];

    // Populate the form with user data
    document.getElementById('regIdNo').value = user.idNo || '';
    document.getElementById('regFullname').value = user.fullname;
    document.getElementById('regGender').value = user.gender || '';
    document.getElementById('regDob').value = user.dob || '';
    document.getElementById('regReligion').value = user.religion || '';
    document.getElementById('regTribe').value = user.tribe || '';
    document.getElementById('regSection').value = user.section || '';
    document.getElementById('regJobTitle').value = user.jobTitle || '';
    document.getElementById('regEmail').value = user.email;
    document.getElementById('regPhone').value = user.phone || '';
    document.getElementById('regNotes').value = user.notes || '';

    // Switch to registration tab
    showTab('registration');

    // Change submit button to update
    const submitBtn = document.querySelector('#dashboardRegForm .btn');
    submitBtn.textContent = 'Update User';
    submitBtn.onclick = () => updateUser(index);
}

function updateUser(index) {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const user = users[index];

    user.idNo = document.getElementById('regIdNo').value;
    user.fullname = document.getElementById('regFullname').value;
    user.gender = document.getElementById('regGender').value;
    user.dob = document.getElementById('regDob').value;
    user.religion = document.getElementById('regReligion').value;
    user.tribe = document.getElementById('regTribe').value;
    user.section = document.getElementById('regSection').value;
    user.jobTitle = document.getElementById('regJobTitle').value;
    user.email = document.getElementById('regEmail').value;
    user.phone = document.getElementById('regPhone').value;
    user.passport = document.getElementById('regPassport').files[0] ? document.getElementById('regPassport').files[0].name : user.passport;
    user.notes = document.getElementById('regNotes').value;

    localStorage.setItem('sedaUsers', JSON.stringify(users));

    // Reset form
    document.getElementById('dashboardRegForm').reset();
    generateIdNo(); // Generate new ID for next user
    const submitBtn = document.querySelector('#dashboardRegForm .btn');
    submitBtn.textContent = 'Submit Form';
    submitBtn.onclick = null;

    // Switch to users tab and refresh
    showTab('users');
    alert('User updated successfully!');
}

// ========== ADMIN ADD USER FEATURES ==========

// Enhanced hash function for passwords (same as in script.js)
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

// Generate ID for add user form
function generateAddUserId() {
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const nextId = users.length + 1;
    const idNo = `SEDA2026${nextId.toString().padStart(2, '0')}`;
    document.getElementById('addIdNo').value = idNo;
}

// Open Add User Modal
function openAddUserModal() {
    if (!isCurrentUserAdmin()) {
        alert('Only administrators can add new users.');
        return;
    }
    document.getElementById('addUserModal').style.display = 'block';
    generateAddUserId();
}

// Close Add User Modal
function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('addUserForm').reset();
}

// Handle Add User Form Submission
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!isCurrentUserAdmin()) {
        alert('Only administrators can add new users.');
        return;
    }

    const email = document.getElementById('addEmail').value;
    const password = document.getElementById('addPassword').value;

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('A user with this email already exists!');
        return;
    }

    const userData = {
        idNo: document.getElementById('addIdNo').value,
        fullname: document.getElementById('addFullname').value,
        gender: document.getElementById('addGender').value,
        dob: document.getElementById('addDob').value,
        religion: document.getElementById('addReligion').value,
        tribe: document.getElementById('addTribe').value,
        section: document.getElementById('addSection').value,
        jobTitle: document.getElementById('addJobTitle').value,
        role: document.getElementById('addRole').value,
        email: email,
        phone: document.getElementById('addPhone').value,
        password: enhancedHash(password), // Store hashed password
        verified: false, // New users need verification
        verifiedBy: null,
        verifiedAt: null,
        createdByAdmin: true, // Flag to indicate created by admin
        registrationDate: new Date().toISOString()
    };

    users.push(userData);
    localStorage.setItem('sedaUsers', JSON.stringify(users));

    // Close modal and reset form
    closeAddUserModal();

    // Refresh the users list
    displayUsers();
    updateStats();

    alert('User account created successfully! The user needs to be verified before they can log in.');
});

// Toggle User Verification
function toggleUserVerification(index) {
    if (!isCurrentUserAdmin()) {
        alert('Only administrators can verify users.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    const user = users[index];

    if (user.verified) {
        // Unverify user
        if (confirm(`Are you sure you want to UNVERIFY ${user.fullname}? They will not be able to log in.`)) {
            user.verified = false;
            user.verifiedBy = null;
            user.verifiedAt = null;
            localStorage.setItem('sedaUsers', JSON.stringify(users));
            displayUsers();
            alert('User has been unverified.');
        }
    } else {
        // Verify user
        const currentUser = checkDashboardAuth();
        if (confirm(`Are you want to VERIFY ${user.fullname}? They will be able to log in.`)) {
            user.verified = true;
            user.verifiedBy = currentUser.fullname || currentUser.email;
            user.verifiedAt = new Date().toISOString();
            localStorage.setItem('sedaUsers', JSON.stringify(users));
            displayUsers();
            alert('User has been verified successfully!');
        }
    }
}

// Dashboard registration form
document.getElementById('dashboardRegForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Function to convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const passportFile = document.getElementById('regPassport').files[0];

    const saveUser = async () => {
        let passportData = '';
        if (passportFile) {
            try {
                passportData = await fileToBase64(passportFile);
            } catch (err) {
                console.error('Error reading passport file:', err);
            }
        }

        const userData = {
            idNo: document.getElementById('regIdNo').value,
            fullname: document.getElementById('regFullname').value,
            gender: document.getElementById('regGender').value,
            dob: document.getElementById('regDob').value,
            religion: document.getElementById('regReligion').value,
            tribe: document.getElementById('regTribe').value,
            section: document.getElementById('regSection').value,
            jobTitle: document.getElementById('regJobTitle').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            passport: passportData,
            passportName: passportFile ? passportFile.name : '',
            notes: document.getElementById('regNotes').value,
            role: 'user', // Default role
            verified: false, // Users need verification
            verifiedBy: null,
            verifiedAt: null,
            createdByAdmin: false, // Flag to indicate self-registration
            registrationDate: new Date().toISOString()
        };

        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            alert('A user with this email already exists!');
            return;
        }

        // Save to localStorage
        users.push(userData);
        localStorage.setItem('sedaUsers', JSON.stringify(users));

        // Reset form
        this.reset();
        generateIdNo(); // Generate new ID for next user

        // Show success message and switch to users tab
        alert('Registration submitted successfully! Your account will be verified by an administrator.');
        showTab('users');
    };

    saveUser();
});

// Keyboard navigation for dashboard
document.addEventListener('keydown', function(e) {
    // Enter key to submit dashboard registration form
    if (e.key === 'Enter' && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON')) {
        if (e.target.form && e.target.form.id === 'dashboardRegForm') {
            e.target.form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        // Let default tab behavior work
        return;
    }
    
    // Number keys for tab switching (1-5 for tabs)
    const tabKeys = {
        '1': 'overview',
        '2': 'registration', 
        '3': 'users',
        '4': 'analytics',
        '5': 'settings'
    };
    
    if (tabKeys[e.key]) {
        e.preventDefault();
        showTab(tabKeys[e.key]);
    }
    
    // Ctrl/Cmd + S to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const activeForm = document.activeElement.form;
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Initialize dashboard - check authentication first
document.addEventListener('DOMContentLoaded', function() {
    // Verify authentication
    const currentUser = checkDashboardAuth();
    if (!currentUser) {
        return; // Will redirect to index.html
    }
    
    // Display current user info
    const userNameEl = document.getElementById('currentUserName');
    const userRoleEl = document.getElementById('currentUserRole');
    if (userNameEl) userNameEl.textContent = currentUser.fullname || currentUser.email;
    if (userRoleEl) userRoleEl.textContent = currentUser.role === 'owner' ? 'System Owner' : (currentUser.role === 'admin' ? 'Administrator' : 'User');
    
    // Apply role-based UI
    updateUIBasedOnRole();
    
    updateStats();
    generateIdNo();
});

// Add some interactive effects
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Load admin info in settings
function loadAdminInfo() {
    const admin = JSON.parse(localStorage.getItem('sedaAdmin'));
    if (admin) {
        document.getElementById('adminRole').textContent = admin.isOwner ? 'System Owner' : 'Administrator';
        document.getElementById('adminEmail').textContent = admin.email || 'N/A';
        document.getElementById('adminCreated').textContent = admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A';
    }
}

// Change admin password
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters!');
        return;
    }
    
    // Call the change function from script.js
    const result = window.changeAdminPassword(currentPassword, newPassword);
    
    if (result.success) {
        alert(result.message);
        document.getElementById('changePasswordForm').reset();
    } else {
        alert('Error: ' + result.message);
    }
});

// Change admin username
document.getElementById('changeUsernameForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('usernameCurrentPassword').value;
    const newUsername = document.getElementById('newUsername').value;
    
    if (newUsername.length < 3) {
        alert('Username must be at least 3 characters!');
        return;
    }
    
    // Call the change function from script.js
    const result = window.changeAdminUsername(currentPassword, newUsername);
    
    if (result.success) {
        alert(result.message);
        document.getElementById('changeUsernameForm').reset();
        loadAdminInfo(); // Refresh admin info
    } else {
        alert('Error: ' + result.message);
    }
});

// Reset admin password to default
function resetAdminPassword() {
    if (!isCurrentUserAdmin()) {
        alert('Only administrators can reset the password.');
        return;
    }
    
    if (confirm('Are you sure you want to reset the admin password to default?\n\nDefault password: SEDAadmin2026')) {
        const admin = JSON.parse(localStorage.getItem('sedaAdmin'));
        if (admin) {
            admin.password = window.enhancedHash('SEDAadmin2026');
            admin.passwordChangedAt = new Date().toISOString();
            localStorage.setItem('sedaAdmin', JSON.stringify(admin));
            alert('Admin password has been reset to default: SEDAadmin2026\n\nPlease logout and login again to use the new password.');
        }
    }
}

// Clear all users
function clearAllUsers() {
    if (!isCurrentUserAdmin()) {
        alert('Only administrators can clear all users.');
        return;
    }
    
    if (confirm('WARNING: This will delete ALL registered users! This action cannot be undone.\n\nAre you sure you want to continue?')) {
        if (confirm('Are you REALLY sure? All user data will be permanently deleted!')) {
            localStorage.removeItem('sedaUsers');
            displayUsers();
            updateStats();
            alert('All users have been cleared successfully!');
        }
    }
}
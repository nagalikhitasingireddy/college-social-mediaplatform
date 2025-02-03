// // API Base URL
// const API_BASE_URL = 'http://localhost:5000/api';

// // State Management
// let currentUser = null;
// let authToken = localStorage.getItem('authToken');

// // DOM Elements
// const authContainer = document.getElementById('authContainer');
// const appContainer = document.getElementById('appContainer');
// const loginForm = document.getElementById('loginForm');
// const signupForm = document.getElementById('signupForm');
// const authTabs = document.querySelectorAll('.auth-tab');
// const navItems = document.querySelectorAll('.nav-item');
// const contentPages = document.querySelectorAll('.content-page');
// const createPostModal = document.getElementById('createPostModal');
// const createPostForm = document.getElementById('createPostForm');
// const postTypeSelect = document.getElementById('postType');
// const eventDateInput = document.getElementById('eventDate');
// const logoutBtn = document.getElementById('logoutBtn');

// // Auth Tab Switching
// authTabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//         const targetForm = tab.dataset.tab;
//         authTabs.forEach(t => t.classList.remove('active'));
//         tab.classList.add('active');
        
//         if (targetForm === 'login') {
//             loginForm.classList.remove('hidden');
//             signupForm.classList.add('hidden');
//         } else {
//             loginForm.classList.add('hidden');
//             signupForm.classList.remove('hidden');
//         }
//     });
// });

// // Authentication
// loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = loginForm.querySelector('input[type="email"]').value;
//     const password = loginForm.querySelector('input[type="password"]').value;

//     try {
//         const response = await fetch(`${API_BASE_URL}/users/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await response.json();
//         if (data.success) {
//             authToken = data.token;
//             localStorage.setItem('authToken', authToken);
//             await fetchUserProfile();
//             showApp();
//         } else {
//             alert(data.message);
//         }
//     } catch (error) {
//         alert('Login failed. Please try again.');
//     }
// });

// signupForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = {
//         userName: signupForm.querySelector('input[type="text"]').value,
//         email: signupForm.querySelector('input[type="email"]').value,
//         password: signupForm.querySelector('input[type="password"]').value,
//         gender: signupForm.querySelector('select').value
//     };

//     try {
//         const response = await fetch(`${API_BASE_URL}/users/signup`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData)
//         });

//         const data = await response.json();
//         if (data.success) {
//             alert('Signup successful! Please login.');
//             authTabs[0].click(); // Switch to login tab
//         } else {
//             alert(data.message);
//         }
//     } catch (error) {
//         alert('Signup failed. Please try again.');
//     }
// });

// // Navigation
// navItems.forEach(item => {
//     item.addEventListener('click', (e) => {
//         e.preventDefault();
//         const targetPage = item.dataset.page;
        
//         navItems.forEach(nav => nav.classList.remove('active'));
//         item.classList.add('active');
        
//         contentPages.forEach(page => {
//             if (page.id === `${targetPage}Page`) {
//                 page.classList.remove('hidden');
//             } else {
//                 page.classList.add('hidden');
//             }
//         });

//         if (targetPage === 'profile') {
//             updateProfileUI();
//         } else {
//             loadPosts(targetPage);
//         }
//     });
// });

// // Post Type Selection
// postTypeSelect.addEventListener('change', () => {
//     if (postTypeSelect.value === 'event') {
//         eventDateInput.classList.remove('hidden');
//     } else {
//         eventDateInput.classList.add('hidden');
//     }
// });

// // Create Post
// createPostForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('postType', postTypeSelect.value);
    
//     const imageFiles = document.getElementById('postImages').files;
//     for (let i = 0; i < imageFiles.length; i++) {
//         formData.append('images', imageFiles[i]);
//     }

//     if (postTypeSelect.value === 'event') {
//         formData.append('date', eventDateInput.value);
//     }

//     try {
//         const response = await fetch(`${API_BASE_URL}/posts`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${authToken}` },
//             body: formData
//         });

//         const data = await response.json();
//         if (data.success) {
//             closeModal();
//             loadPosts(postTypeSelect.value + 's');
//         } else {
//             alert(data.message);
//         }
//     } catch (error) {
//         alert('Failed to create post. Please try again.');
//     }
// });

// // Fetch User Profile
// async function fetchUserProfile() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/users/profile`, {
//             headers: { 'Authorization': `Bearer ${authToken}` }
//         });
//         const data = await response.json();
//         if (data.success) {
//             currentUser = data.user;
//             updateProfileUI();
//         }
//     } catch (error) {
//         console.error('Failed to fetch user profile:', error);
//     }
// }

// // Load Posts
// async function loadPosts(type) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/containers/posts?type=${type}`, {
//             headers: { 'Authorization': `Bearer ${authToken}` }
//         });
//         const data = await response.json();
        
//         if (data.success) {
//             const container = document.getElementById(`${type}Container`);
//             container.innerHTML = data.posts.map(post => createPostHTML(post)).join('');
//         }
//     } catch (error) {
//         console.error(`Failed to load ${type}:`, error);
//     }
// }

// // Create Post HTML
// function createPostHTML(post) {
//     return `
//         <div class="post-card">
//             <div class="post-images">
//                 ${post.postImages.map(img => `<img src="${img}" alt="Post image">`).join('')}
//             </div>
//             ${post.date ? `<p>Event Date: ${new Date(post.date).toLocaleDateString()}</p>` : ''}
//             <div class="post-actions">
//                 <button onclick="likePost('${post._id}')">${post.likes} Likes</button>
//                 <button onclick="showComments('${post._id}')">Comments</button>
//             </div>
//         </div>
//     `;
// }

// // Update Profile UI
// function updateProfileUI() {
//     if (currentUser) {
//         document.getElementById('sidebarUsername').textContent = currentUser.userName;
//         document.getElementById('sidebarProfilePic').src = currentUser.profilePic || 'default-avatar.png';
//         document.getElementById('profileUsername').textContent = currentUser.userName;
//         document.getElementById('profileEmail').textContent = currentUser.email;
//         document.getElementById('profileGender').textContent = currentUser.gender;
//         document.getElementById('profilePic').src = currentUser.profilePic || 'default-avatar.png';
//     }
// }

// // Show/Hide App
// function showApp() {
//     authContainer.classList.add('hidden');
//     appContainer.classList.remove('hidden');
//     loadPosts('memes'); // Load memes by default
// }

// // Modal Functions
// function openModal() {
//     createPostModal.classList.remove('hidden');
// }

// function closeModal() {
//     createPostModal.classList.add('hidden');
//     createPostForm.reset();
//     eventDateInput.classList.add('hidden');
// }

// // Like Post
// async function likePost(postId) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${authToken}` }
//         });
//         if (response.ok) {
//             const currentPage = document.querySelector('.nav-item.active').dataset.page;
//             loadPosts(currentPage);
//         }
//     } catch (error) {
//         console.error('Failed to like post:', error);
//     }
// }

// // Logout
// logoutBtn.addEventListener('click', () => {
//     localStorage.removeItem('authToken');
//     authToken = null;
//     currentUser = null;
//     appContainer.classList.add('hidden');
//     authContainer.classList.remove('hidden');
// });

// // Initialize
// if (authToken) {
//     fetchUserProfile().then(() => showApp());
// }

// // Close modal when clicking outside
// createPostModal.addEventListener('click', (e) => {
//     if (e.target === createPostModal) {
//         closeModal();
//     }
// });

// document.querySelectorAll('.close-modal').forEach(btn => {
//     btn.addEventListener('click', closeModal);
// });

// document.querySelectorAll('.create-post-btn').forEach(btn => {
//     btn.addEventListener('click', openModal);
// });

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// State Management
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Default Avatar URL
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

// DOM Elements
const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authTabs = document.querySelectorAll('.auth-tab');
const navItems = document.querySelectorAll('.nav-item');
const contentPages = document.querySelectorAll('.content-page');
const createPostModal = document.getElementById('createPostModal');
const createPostForm = document.getElementById('createPostForm');
const postTypeSelect = document.getElementById('postType');
const eventDateInput = document.getElementById('eventDate');
const logoutBtn = document.getElementById('logoutBtn');

// Auth Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetForm = tab.dataset.tab;
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (targetForm === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// Authentication
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            await fetchUserProfile();
            showApp();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Login failed. Please try again.');
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        userName: signupForm.querySelector('input[type="text"]').value,
        email: signupForm.querySelector('input[type="email"]').value,
        password: signupForm.querySelector('input[type="password"]').value,
        gender: signupForm.querySelector('select').value
    };
    // console.log("form data signup: ", formData);

    try {
        const response = await fetch(`${API_BASE_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            alert('Signup successful! Please login.');
            authTabs[0].click(); // Switch to login tab
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Signup failed. Please try again.');
    }
});

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = item.dataset.page;
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        contentPages.forEach(page => {
            if (page.id === `${targetPage}Page`) {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        });

        if (targetPage === 'profile') {
            updateProfileUI();
        } else {
            loadPosts(targetPage);
        }
    });
});

// Post Type Selection
postTypeSelect.addEventListener('change', () => {
    if (postTypeSelect.value === 'event') {
        eventDateInput.classList.remove('hidden');
    } else {
        eventDateInput.classList.add('hidden');
    }
});

// Create Post
createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('postType', postTypeSelect.value);
    
    const imageFiles = document.getElementById('postImages').files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
    }

    if (postTypeSelect.value === 'event') {
        formData.append('date', eventDateInput.value);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            closeModal();
            loadPosts(postTypeSelect.value + 's');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Failed to create post. Please try again.');
    }
});

// Fetch User Profile
async function fetchUserProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            updateProfileUI();
        }
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
    }
}

// Load Posts
async function loadPosts(type) {
    try {
        const response = await fetch(`${API_BASE_URL}/containers/posts?type=${type}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById(`${type}Container`);
            container.innerHTML = data.posts.map(post => createPostHTML(post)).join('');
        }
    } catch (error) {
        console.error(`Failed to load ${type}:`, error);
    }
}

// Create Post HTML
function createPostHTML(post) {
    return `
        <div class="post-card">
            <div class="post-images">
                ${post.postImages.map(img => `<img src="${img}" alt="Post image">`).join('')}
            </div>
            ${post.date ? `<p>Event Date: ${new Date(post.date).toLocaleDateString()}</p>` : ''}
            <div class="post-actions">
                <button onclick="likePost('${post._id}')">${post.likes} Likes</button>
                <button onclick="showComments('${post._id}')">Comments</button>
            </div>
        </div>
    `;
}

// Update Profile UI
function updateProfileUI() {
    if (currentUser) {
        document.getElementById('sidebarUsername').textContent = currentUser.userName;
        document.getElementById('sidebarProfilePic').src = currentUser.profilePic || DEFAULT_AVATAR;
        document.getElementById('profileUsername').textContent = currentUser.userName;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('profileGender').textContent = currentUser.gender;
        document.getElementById('profilePic').src = currentUser.profilePic || DEFAULT_AVATAR;
    }
}

// Show/Hide App
function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    loadPosts('memes'); // Load memes by default
}

// Modal Functions
function openModal() {
    createPostModal.classList.remove('hidden');
}

function closeModal() {
    createPostModal.classList.add('hidden');
    createPostForm.reset();
    eventDateInput.classList.add('hidden');
}

// Like Post
async function likePost(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            const currentPage = document.querySelector('.nav-item.active').dataset.page;
            loadPosts(currentPage);
        }
    } catch (error) {
        console.error('Failed to like post:', error);
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    appContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
});

// Initialize
if (authToken) {
    fetchUserProfile().then(() => showApp());
}

// Close modal when clicking outside
createPostModal.addEventListener('click', (e) => {
    if (e.target === createPostModal) {
        closeModal();
    }
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

document.querySelectorAll('.create-post-btn').forEach(btn => {
    btn.addEventListener('click', openModal);
});
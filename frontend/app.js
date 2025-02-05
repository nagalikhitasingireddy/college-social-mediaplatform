// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// State Management
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Default Avatar URL
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

// Cloudinary Configuration
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dcpxmuyvp/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'grd-website-ecommerce';

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
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = document.getElementById('editProfileModal');
const editProfileForm = document.getElementById('editProfileForm');

// Image Upload Function
const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data.secure_url;
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        throw new Error('Failed to upload image');
    }
};

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
            loadUserPosts(); // Load user's posts in profile section
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
    const postType = postTypeSelect.value;
    const description = document.getElementById('description').value;
    const imageFiles = document.getElementById('postImages').files;
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    
    // Show loading state
    const submitBtn = createPostForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';

    try {
        // Upload images to Cloudinary
        const imageUrls = await Promise.all(
            Array.from(imageFiles).map(file => uploadToCloudinary(file))
        );

        const postData = {
            postType,
            description,
            postImages: imageUrls
        };

        if (postType === 'event') {
            postData.date = eventDateInput.value;
        }

        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        const data = await response.json();
        if (data.success) {
            closeModal();
            const currentPage = document.querySelector('.nav-item.active').dataset.page;
            if (currentPage === 'profile') {
                loadUserPosts();
            } else {
                loadPosts(currentPage);
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Failed to create post. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Post';
    }
});

// Edit Profile
editProfileBtn.addEventListener('click', () => {
    editProfileModal.classList.remove('hidden');
    // Pre-fill the form with current user data
    editProfileForm.querySelector('input[name="userName"]').value = currentUser.userName;
    editProfileForm.querySelector('input[name="email"]').value = currentUser.email;
    editProfileForm.querySelector('select[name="gender"]').value = currentUser.gender;
});

// Handle profile picture preview
document.getElementById('profilePicUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update preview in edit profile modal
            const previewContainer = document.createElement('div');
            previewContainer.className = 'profile-pic-preview';
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
            
            // Remove any existing preview
            const existingPreview = editProfileForm.querySelector('.profile-pic-preview');
            if (existingPreview) {
                existingPreview.remove();
            }
            
            // Add new preview after the file input
            const fileUploadDiv = editProfileForm.querySelector('.file-upload');
            fileUploadDiv.after(previewContainer);
        };
        reader.readAsDataURL(file);
    }
});

editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        userName: editProfileForm.querySelector('input[name="userName"]').value,
        email: editProfileForm.querySelector('input[name="email"]').value,
        gender: editProfileForm.querySelector('select[name="gender"]').value
    };

    // Handle profile picture upload
    const profilePicFile = editProfileForm.querySelector('input[name="profilePic"]').files[0];
    if (profilePicFile) {
        try {
            formData.profilePic = await uploadToCloudinary(profilePicFile);
        } catch (error) {
            alert('Failed to upload profile picture. Please try again.');
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/updateProfile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            updateProfileUI();
            closeEditProfileModal();
            alert('Profile updated successfully!');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Failed to update profile. Please try again.');
    }
});

// Load User Posts
async function loadUserPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/user/${currentUser._id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('profilePage');
            const postsSection = container.querySelector('.user-posts') || document.createElement('div');
            postsSection.className = 'user-posts';
            
            if (data.posts.length === 0) {
                postsSection.innerHTML = '<p class="no-posts">No posts yet</p>';
            } else {
                postsSection.innerHTML = `
                    <h3 class="section-title">Your Posts</h3>
                    <div class="posts-container">
                        ${data.posts.map(post => createPostHTML(post)).join('')}
                    </div>
                `;
            }
            
            // Add posts section after profile info if it doesn't exist
            if (!container.querySelector('.user-posts')) {
                container.querySelector('.profile-info').after(postsSection);
            }
        }
    } catch (error) {
        console.error('Failed to load user posts:', error);
    }
}

// Create Post HTML
function createPostHTML(post) {
    const isLiked = post.likes.includes(currentUser._id);
    const likesCount = post.likes.length;

    return `
        <div class="post-card">
            <div class="post-meta">
                <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                ${post.date ? ` • Event Date: ${new Date(post.date).toLocaleDateString()}` : ''}
            </div>
            ${post.description ? `<p class="post-description">${post.description}</p>` : ''}
            <div class="post-images">
                ${post.postImages.map(img => `
                    <img src="${img}" alt="Post image" onclick="showFullImage('${img}')">
                `).join('')}
            </div>
            <div class="post-actions">
                <button onclick="toggleLike('${post._id}')" class="like-button ${isLiked ? 'liked' : ''}">
                    <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
                    <span class="likes-count">${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
                <button onclick="toggleComments('${post._id}')" class="comment-button">
                    <span class="comment-icon">💬</span>
                    Comments
                </button>
            </div>
            <div id="comments-${post._id}" class="comments-section hidden">
                <div class="comments-list"></div>
                <div class="add-comment">
                    <input type="text" placeholder="Write a comment..." id="comment-input-${post._id}">
                    <button onclick="addComment('${post._id}')">Post</button>
                </div>
            </div>
        </div>
    `;
}


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
        const response = await fetch(`${API_BASE_URL}/posts`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById(`${type}Container`);
            const filteredPosts = type === 'memes' 
                ? data.posts.filter(post => post.postType === 'meme')
                : type === 'events'
                    ? data.posts.filter(post => post.postType === 'event')
                    : data.posts.filter(post => post.postType === 'achievement');
            
            container.innerHTML = filteredPosts.map(post => createPostHTML(post)).join('');
        }
    } catch (error) {
        console.error(`Failed to load ${type}:`, error);
    }
}

// Toggle Like
async function toggleLike(postId) {
    try {
        const likeButton = document.querySelector(`button[onclick="toggleLike('${postId}')"]`);
        const isLiked = likeButton.classList.contains('liked');
        
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: isLiked ? 'DELETE' : 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const currentPage = document.querySelector('.nav-item.active').dataset.page;
            if (currentPage === 'profile') {
                loadUserPosts();
            } else {
                loadPosts(currentPage);
            }
        }
    } catch (error) {
        console.error('Failed to toggle like:', error);
    }
}

// Comments Functions
async function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    const isHidden = commentsSection.classList.contains('hidden');
    
    if (isHidden) {
        // Load and show comments
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await response.json();
            
            if (data.success) {
                const commentsList = commentsSection.querySelector('.comments-list');
                commentsList.innerHTML = data.comments.map(comment => `
                    <div class="comment">
                        <span class="comment-text">${comment.text}</span>
                        <span class="comment-time">${new Date(comment.timestamp).toLocaleString()}</span>
                    </div>
                `).join('') || '<p>No comments yet</p>';
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
        commentsSection.classList.remove('hidden');
    } else {
        commentsSection.classList.add('hidden');
    }
}

async function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value.trim();
    
    if (!text) return;

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            input.value = '';
            toggleComments(postId); // Refresh comments
        }
    } catch (error) {
        console.error('Failed to add comment:', error);
    }
}

async function deleteComment(postId, commentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            toggleComments(postId); // Refresh comments
        }
    } catch (error) {
        console.error('Failed to delete comment:', error);
    }
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
    document.getElementById('imagePreviewContainer').innerHTML = '';
}

function closeModal() {
    createPostModal.classList.add('hidden');
    createPostForm.reset();
    eventDateInput.classList.add('hidden');
    document.getElementById('imagePreviewContainer').innerHTML = '';
}

function closeEditProfileModal() {
    editProfileModal.classList.add('hidden');
    editProfileForm.reset();
    const existingPreview = editProfileForm.querySelector('.profile-pic-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
}

// Show full-size image
function showFullImage(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageUrl}" style="max-width: 100%; max-height: 80vh; object-fit: contain;">
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Image upload preview
function handleImagePreview(input) {
    const container = document.getElementById('imagePreviewContainer');
    container.innerHTML = '';

    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image">×</button>
                `;
                container.appendChild(preview);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Event Listeners
document.getElementById('postImages').addEventListener('change', function() {
    handleImagePreview(this);
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    appContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
});

// Event Listeners for Modals
createPostModal.addEventListener('click', (e) => {
    if (e.target === createPostModal) {
        closeModal();
    }
});

editProfileModal.addEventListener('click', (e) => {
    if (e.target === editProfileModal) {
        closeEditProfileModal();
    }
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

document.querySelectorAll('.create-post-btn').forEach(btn => {
    btn.addEventListener('click', openModal);
});

// Add styles for comments and likes
const style = document.createElement('style');
style.textContent = `
    .comments-section {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }
    
    .comments-section.hidden {
        display: none;
    }
    
    .comments-list {
        margin-bottom: 15px;
    }
    
    .comment {
        padding: 8px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .comment-text {
        flex: 1;
    }
    
    .comment-time {
        color: #666;
        font-size: 0.8em;
    }
    
    .delete-comment {
        margin-left: auto;
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        font-size: 18px;
        padding: 0 5px;
    }
    
    .add-comment {
        display: flex;
        gap: 10px;
    }
    
    .add-comment input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .add-comment button {
        padding: 8px 15px;
        background-color: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .like-button, .comment-button {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: none;
        transition: all 0.3s ease;
    }

    .like-button:hover {
        background-color: #ffebee;
    }

    .comment-button:hover {
        background-color: #e3f2fd;
    }

    .heart-icon {
        font-size: 1.2em;
    }

    .likes-count {
        color: #666;
    }

    .like-button.liked {
        color: #e91e63;
    }

    .like-button.liked .likes-count {
        color: #e91e63;
    }

    .profile-pic-preview {
        margin: 10px 0;
        text-align: center;
    }

    .profile-pic-preview img {
        max-width: 150px;
        max-height: 150px;
        border-radius: 50%;
        object-fit: cover;
    }

    .section-title {
        margin: 30px 0 20px;
        color: #1a73e8;
    }

    .no-posts {
        text-align: center;
        color: #666;
        padding: 20px;
    }
`;
document.head.appendChild(style);
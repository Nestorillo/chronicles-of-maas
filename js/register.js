// Registration form with API integration for Noroff API
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const bioInput = document.getElementById('bio');
    const avatarUrlInput = document.getElementById('avatarUrl');
    const avatarAltInput = document.getElementById('avatarAlt');
    const bannerUrlInput = document.getElementById('bannerUrl');
    const bannerAltInput = document.getElementById('bannerAlt');
    const venueManagerCheckbox = document.getElementById('venueManager');
    const registerButton = document.querySelector('.register-button');
    const responseMessage = document.getElementById('responseMessage');

    // Default avatar and banner URLs
    const defaultAvatarUrl = "https://images-blog-nestor.vercel.app/assasins-blade.png";
    const defaultBannerUrl = "https://images-blog-nestor.vercel.app/assasins-blade.png";

    // API endpoint
    const API_URL = 'https://v2.api.noroff.dev/auth/register';

    // Add event listener to register button
    registerButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Reset any previous messages
        responseMessage.textContent = '';
        responseMessage.className = 'response-message';

        // Validate required fields
        if (!validateRequiredFields()) {
            return;
        }

        // Create user object
        const userData = createUserObject();

        // Send registration request
        await registerUser(userData);
    });

    // Validate required fields
    function validateRequiredFields() {
        // Name validation - must only contain letters, numbers, and underscores
        const namePattern = /^[a-zA-Z0-9_]+$/;
        if (!nameInput.value.trim() || !namePattern.test(nameInput.value.trim())) {
            showError('Name must contain only letters, numbers, and underscores');
            nameInput.focus();
            return false;
        }
        
        // Email validation - must be a stud.noroff.no email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@stud.noroff\.no$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
            showError('Please enter a valid @noroff.no email address');
            emailInput.focus();
            return false;
        }
        
        // Password validation
        if (!passwordInput.value.trim() || passwordInput.value.length < 8) {
            showError('Password must be at least 8 characters long');
            passwordInput.focus();
            return false;
        }

        return true;
    }

    // Create user object from form inputs
    function createUserObject() {
        return {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            bio: bioInput.value.trim() || "No bio provided",
            avatar: {
                url: avatarUrlInput.value.trim() || defaultAvatarUrl,
                alt: avatarAltInput.value.trim() || ""
            },
            banner: {
                url: bannerUrlInput.value.trim() || defaultBannerUrl,
                alt: bannerAltInput.value.trim() || "Default banner"
            },
            venueManager: venueManagerCheckbox.checked
        };
    }

    // Register user with API
    async function registerUser(userData) {
        try {
            // Show loading state
            registerButton.disabled = true;
            registerButton.textContent = 'REGISTERING...';
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.errors?.[0]?.message || 'Registration failed');
            }
            
            // Show success message
            showSuccess('Registration successful! Redirecting to login page...');
            
            // Redirect to login page after short delay
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
            showError(error.message || 'Registration failed. Please try again.');
        } finally {
            // Reset button state
            registerButton.disabled = false;
            registerButton.textContent = 'REGISTER';
        }
    }

    // Show error message
    function showError(message) {
        responseMessage.textContent = message;
        responseMessage.className = 'response-message error-message';
    }

    // Show success message
    function showSuccess(message) {
        responseMessage.textContent = message;
        responseMessage.className = 'response-message success-message';
    }

    // Add validation styling on input focus/blur
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const header = this.parentElement.querySelector('.form-header');
            if (header) {
                header.style.backgroundColor = '#a58e50';
            }
        });
        
        input.addEventListener('blur', function() {
            const header = this.parentElement.querySelector('.form-header');
            if (header) {
                header.style.backgroundColor = '#c0a958';
            }
        });
    });

    // Set placeholder values for URL fields to show examples
    avatarUrlInput.placeholder = defaultAvatarUrl;
    bannerUrlInput.placeholder = defaultBannerUrl;
});
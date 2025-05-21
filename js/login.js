// Login form with API integration for Noroff API
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-button');
    
    // Create response message element if it doesn't exist
    let responseMessage = document.getElementById('responseMessage');
    if (!responseMessage) {
        responseMessage = document.createElement('div');
        responseMessage.id = 'responseMessage';
        responseMessage.className = 'response-message';
        if (loginForm) {
            loginForm.appendChild(responseMessage);
        } else {
            document.querySelector('form').appendChild(responseMessage);
        }
    }

    // API endpoint
    const API_URL = 'https://v2.api.noroff.dev/auth/login';

    // Add event listener to login button
    loginButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Reset any previous messages
        responseMessage.textContent = '';
        responseMessage.className = 'response-message';

        // Validate required fields
        if (!validateRequiredFields()) {
            return;
        }

        // Create login data object
        const loginData = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        };

        // Send login request
        await loginUser(loginData);
    });

    // Validate required fields
    function validateRequiredFields() {
        // Email validation - must be a stud.noroff.no email
        if (!emailInput.value.trim()) {
            showError('Please enter your email address');
            emailInput.focus();
            return false;
        }
        
        const emailPattern = /^[a-zA-Z0-9._%+-]+@stud.noroff\.no$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            showError('Please enter a valid @noroff.no email address');
            emailInput.focus();
            return false;
        }
        
        // Password validation
        if (!passwordInput.value.trim()) {
            showError('Please enter your password');
            passwordInput.focus();
            return false;
        }

        return true;
    }

    // Login user with API
    async function loginUser(loginData) {
        try {
            // Show loading state
            loginButton.disabled = true;
            loginButton.textContent = 'LOGGING IN...';
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.errors?.[0]?.message || 'Login failed');
            }
            
            // Show success message
            showSuccess('Login successful! Redirecting to homepage...');
            
            localStorage.setItem('user', JSON.stringify(data.data));
            
            // Also store the access token separately for easier access
            if (data.data && data.data.accessToken) {
                localStorage.setItem('accessToken', data.data.accessToken);
            }
            
            console.log('Login successful with:', emailInput.value);
            
            // Redirect to homepage after short delay
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            // Reset button state
            loginButton.disabled = false;
            loginButton.textContent = 'LOGIN';
        }
    }

    // Show error message
    function showError(message) {
        // Use alert for simple cases to match existing behavior
        if (message.length < 40) {
            alert(message);
        }
        // Also update the response message for visual feedback
        responseMessage.textContent = message;
        responseMessage.className = 'response-message error-message';
    }

    // Show success message
    function showSuccess(message) {
        // Use alert for simple success messages
        alert(message);
        // Also update the response message
        responseMessage.textContent = message;
        responseMessage.className = 'response-message success-message';
    }

    // Add validation styling on input focus/blur
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 5px #c0a958';
            
            // Also apply styling to header if it exists (from your registration form)
            const header = this.parentElement.querySelector('.form-header');
            if (header) {
                header.style.backgroundColor = '#a58e50';
            }
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
            
            // Reset header styling if it exists
            const header = this.parentElement.querySelector('.form-header');
            if (header) {
                header.style.backgroundColor = '#c0a958';
            }
        });
    });
});
// Firebase Configuration
// IMPORTANT: Replace this with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYal3YEDCRFv2qNDxF77kgml4-oo_42nY",
    authDomain: "pluswave-1cf6e.firebaseapp.com",
    projectId: "pluswave-1cf6e",
    storageBucket: "pluswave-1cf6e.firebasestorage.app",
    messagingSenderId: "128327124574",
    appId: "1:128327124574:web:0bba8495dd561b11acd6cf"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Form Submission Handler
async function handleFormSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Determine the collection name based on form content or ID
    let collectionName = 'general_inquiries'; // Default
    if (form.classList.contains('modal-form')) {
        collectionName = 'project_discovery_requests';
    } else if (form.classList.contains('contact-form')) {
        collectionName = 'contact_messages';
    } else if (form.closest('.footer-links') || form.closest('.glass-card')) {
        collectionName = 'footer_inquiries';
    }

    // specific field mapping to handle different form structures
    // Gathering all inputs
    const formData = {};
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        } else if (input.placeholder) {
            // Fallback: use placeholder as key if name is missing (common in this codebase)
            // Sanitize placeholder to be a valid key
            const key = input.placeholder.toLowerCase().replace(/[^a-z0-9]/g, '_');
            formData[key] = input.value;
        }
    });

    // Add timestamp and page source
    formData.submittedAt = firebase.firestore.FieldValue.serverTimestamp();
    formData.sourcePage = window.location.pathname;

    // Validate all fields are filled
    let allFilled = true;
    for (const key in formData) {
        if (key !== 'submittedAt' && key !== 'sourcePage' && (!formData[key] || formData[key].trim() === '')) {
            allFilled = false;
            break;
        }
    }

    if (!allFilled) {
        alert("Please fill in all fields before submitting.");
        return; // Stop execution
    }

    // visual feedback
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
        await db.collection(collectionName).add(formData);

        // Success
        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'; // Green
        form.reset();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;

            // If it's the modal form, close it
            const modal = document.getElementById('facility-modal');
            if (modal && form.closest('.modal')) {
                modal.style.display = 'none';
            }
        }, 3000);

    } catch (error) {
        console.error("Error adding document: ", error);
        btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
        btn.style.background = 'red';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);

        alert("There was an error sending your message. Please check the console or try again later.");
    }
}

// Attach listeners to all forms after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Remove any existing listeners by cloning (optional, but good practice if mixed logic exists)
        // For now, we will just add the listener. The script.js listener might conflict, 
        // effectively running twice if we don't clean it up.
        // Ideally, we'd replace the logic in script.js or disable it.
        // For this task, I'll assume script.js might be updated or we rely on this file.

        form.addEventListener('submit', handleFormSubmission);
    });
});

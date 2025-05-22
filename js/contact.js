document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formSuccess = document.getElementById('formSuccess');

    // Form validation
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Reset previous errors
        document.querySelectorAll('.form-error').forEach(error => error.textContent = '');

        // Name validation
        if (!name.value.trim()) {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            document.getElementById('emailError').textContent = 'Valid email is required';
            isValid = false;
        }

        // Message validation
        if (!message.value.trim()) {
            document.getElementById('messageError').textContent = 'Message is required';
            isValid = false;
        }

        return isValid;
    }

    // Show loading state
    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoader.style.display = isLoading ? 'inline-block' : 'none';
    }

    // Show success message
    function showSuccess() {
        formSuccess.textContent = 'Message sent successfully! I will get back to you soon.';
        formSuccess.style.display = 'block';
        form.reset();
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const senderName = document.getElementById('name').value;
            const senderEmail = document.getElementById('email').value;
            const messageSubject = document.getElementById('subject').value || 'New Contact Form Submission';
            const messageContent = document.getElementById('message').value;

            const templateParams = {
                to_email: 'seyfusaliya89@gmail.com',
                from_name: senderName,
                from_email: senderEmail,
                reply_to: senderEmail,
                subject: `[Portfolio Contact] ${messageSubject}`,
                message: messageContent,
                sender_info: `From: ${senderName} <${senderEmail}>`,
                date: new Date().toLocaleString(),
                formatted_message: `
New message from your portfolio website:

From: ${senderName}
Email: ${senderEmail}
Date: ${new Date().toLocaleString()}

Subject: ${messageSubject}

Message:
${messageContent}

---
You can reply directly to this email to respond to ${senderName}.
                `
            };

            const response = await emailjs.send('seyfusaliya', 'template_ghqz6ag', templateParams);
            console.log('Email sent successfully:', response);
            showSuccess();
        } catch (error) {
            console.error('Error sending email:', error);
            formSuccess.textContent = 'Failed to send message. Please try again later.';
            formSuccess.style.display = 'block';
            formSuccess.style.color = '#ff4444';
        } finally {
            setLoading(false);
        }
    });
}); 
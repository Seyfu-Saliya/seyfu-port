document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-message');
    const chatMessages = document.querySelector('.chat-messages');

    // Mobile-responsive adjustments
    function adjustMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        
        // Chat container adjustments
        chatContainer.style.width = isMobile ? '100%' : '400px';
        chatContainer.style.maxWidth = isMobile ? '100%' : '400px';
        chatContainer.style.position = isMobile ? 'fixed' : 'absolute';
        chatContainer.style.bottom = isMobile ? '0' : '20px';
        chatContainer.style.right = isMobile ? '0' : '20px';
        chatContainer.style.borderRadius = isMobile ? '15px 15px 0 0' : '15px';
        
        // Message bubbles adjustments
        const messageBubbles = document.querySelectorAll('.chat-bubble');
        messageBubbles.forEach(bubble => {
            bubble.style.maxWidth = isMobile ? '85%' : '300px';
            bubble.style.padding = isMobile ? '12px 16px' : '14px 18px';
            bubble.style.fontSize = isMobile ? '15px' : '16px';
            bubble.style.lineHeight = isMobile ? '1.4' : '1.5';
        });
        
        // Input container adjustments
        const inputContainer = document.querySelector('.chat-input');
        inputContainer.style.width = isMobile ? '95%' : '350px';
        inputContainer.style.padding = isMobile ? '12px' : '14px';
        inputContainer.style.fontSize = isMobile ? '15px' : '16px';
        
        // Message list adjustments
        chatMessages.style.maxHeight = isMobile ? 'calc(100vh - 200px)' : '600px';
        chatMessages.style.padding = isMobile ? '12px' : '15px';
        chatMessages.style.overflowY = 'auto';
        
        // Buttons adjustments
        const buttons = document.querySelectorAll('.chat-fullscreen-toggle, .send-message, .attach-file-btn');
        buttons.forEach(btn => {
            btn.style.padding = isMobile ? '10px 14px' : '12px 16px';
            btn.style.fontSize = isMobile ? '15px' : '16px';
            btn.style.borderRadius = isMobile ? '8px' : '10px';
        });
        
        // Avatar adjustments
        const avatars = document.querySelectorAll('.chat-avatar-user, .chat-avatar-bot');
        avatars.forEach(avatar => {
            avatar.style.fontSize = isMobile ? '1.3rem' : '1.5rem';
            avatar.style.margin = isMobile ? '0 8px' : '0 10px';
        });
    }

    // Initial mobile layout adjustment
    adjustMobileLayout();

    // Listen for window resize
    window.addEventListener('resize', adjustMobileLayout);



    // Toggle chat window with touch support
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });
    chatToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        chatContainer.classList.toggle('active');
    });

    // Close chat with touch support
    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        chatContainer.classList.remove('chat-fullscreen');
    });
    closeChat.addEventListener('touchstart', (e) => {
        e.preventDefault();
        chatContainer.classList.remove('active');
        chatContainer.classList.remove('chat-fullscreen');
    });

    // --- Fullscreen Toggle Button ---
    // Create the button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'chat-fullscreen-toggle';
    fullscreenBtn.setAttribute('aria-label', 'Enter fullscreen chat');
    fullscreenBtn.style.marginLeft = '0.5em';
    fullscreenBtn.style.background = 'none';
    fullscreenBtn.style.border = 'none';
    fullscreenBtn.style.color = 'white';
    fullscreenBtn.style.fontSize = '1.4rem';
    fullscreenBtn.style.cursor = 'pointer';
    fullscreenBtn.innerHTML = '⛶';

    // Insert before close button in chat header
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.insertBefore(fullscreenBtn, chatHeader.querySelector('.close-chat'));

    // Toggle fullscreen logic
    fullscreenBtn.addEventListener('click', () => {
        const isFullscreen = chatContainer.classList.toggle('chat-fullscreen');
        fullscreenBtn.innerHTML = isFullscreen ? '🗗' : '⛶';
        fullscreenBtn.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen chat' : 'Enter fullscreen chat');
    });

    // SVG avatars
    const userSVG = `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#6366f1"/><ellipse cx="16" cy="13.5" rx="6.5" ry="6.5" fill="#fff"/><ellipse cx="16" cy="25" rx="10" ry="5" fill="#fff"/></svg>`;
    const botSVG = `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="24" height="14" rx="7" fill="#3b82f6"/><rect x="10" y="4" width="12" height="8" rx="4" fill="#60a5fa"/><circle cx="11.5" cy="17.5" r="2.5" fill="#fff"/><circle cx="20.5" cy="17.5" r="2.5" fill="#fff"/></svg>`;

    // Message status SVGs
    const statusSVGs = {
        pending: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#a5b4fc" stroke-width="2" fill="none"/><path d="M10 5v5l3 3" stroke="#a5b4fc" stroke-width="2" stroke-linecap="round"/></svg>`,
        sent: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5l4 4 6-8" stroke="#a5b4fc" stroke-width="2" fill="none"/></svg>`,
        read: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11l4 4 6-8" stroke="#a5b4fc" stroke-width="2" fill="none"/><path d="M9 15l8-10" stroke="#60a5fa" stroke-width="2" fill="none"/></svg>`
    };

    // --- Message Editing, Reactions, Typing Indicators ---

    // Typing indicator per user
    let userTypingTimeout;
    chatInput.addEventListener('input', () => {
        const typingIndicator = document.querySelector('.chat-typing-indicator');
        if (chatInput.value.trim()) {
            typingIndicator.style.display = 'flex';
            typingIndicator.querySelector('.typing-text').textContent = 'You are typing...';
            clearTimeout(userTypingTimeout);
            userTypingTimeout = setTimeout(() => {
                typingIndicator.style.display = 'none';
            }, 2000);
        } else {
            typingIndicator.style.display = 'none';
        }
    });

    // Add message to chat (with editing, reactions, deletion, reply, attachments)
    const addMessage = (text, type, status = 'pending', reactions = [], replyTo = null, attachments = []) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type, 'fade-in');
        let icon = '';
        if (type === 'bot') {
            icon = `<span class="chat-avatar-bot" aria-label="Bot" style="font-size:1.5rem;">${botSVG}</span>`;
        } else if (type === 'user') {
            icon = `<span class="chat-avatar-user" aria-label="User" style="font-size:1.5rem;">${userSVG}</span>`;
        }
        const timestamp = `<span class="chat-timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
        // Message status (for user only)
        let statusIcon = '';
        if (type === 'user') {
            statusIcon = `<span class="chat-status-icon" title="${status.charAt(0).toUpperCase() + status.slice(1)}" aria-label="${status}" style="margin-left:0.5em;">${statusSVGs[status]}</span>`;
        }
        // Edit button (user only)
        let editBtn = '';
        if (type === 'user') {
            editBtn = `<button class="edit-message-btn" aria-label="Edit message" title="Edit"><svg width="16" height="16" fill="none" stroke="#6366f1" stroke-width="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a2 2 0 0 1-2.828 0L9 13zm-6 6h6v-2H5v-2H3v4z"/></svg></button>`;
        }
        // Delete button (user only)
        let deleteBtn = '';
        if (type === 'user') {
            deleteBtn = `<button class="delete-message-btn" aria-label="Delete message" title="Delete"><svg width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M9 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg></button>`;
        }
        // Reply button (all messages)
        let replyBtn = `<button class="reply-message-btn" aria-label="Reply to message" title="Reply"><svg width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2" viewBox="0 0 24 24"><path d="M10 19l-7-7 7-7"/><path d="M3 12h18"/></svg></button>`;
        // Forward button (all messages)
        let forwardBtn = `<button class="forward-message-btn" aria-label="Forward message" title="Forward"><svg width="16" height="16" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></button>`;
        // Reactions button
        let reactBtn = `<button class="react-message-btn" aria-label="Add reaction" title="React"><svg width="16" height="16" fill="none" stroke="#f59e42" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="10.5" r="1.5"/><circle cx="15.5" cy="10.5" r="1.5"/><path d="M8 16c1.333-1 2.667-1 4 0"/></svg></button>`;
        // Reactions display
        let reactionsHTML = '';
        if (reactions.length) {
            reactionsHTML = `<div class="message-reactions">${reactions.map(r => `<span class="reaction">${r}</span>`).join('')}</div>`;
        }
        // Reply thread display
        let replyHTML = '';
        if (replyTo) {
            replyHTML = `<div class="reply-thread">Replying to: <span class="reply-preview">${replyTo}</span></div>`;
        }
        // Attachments display
        let attachmentsHTML = '';
        if (attachments.length) {
            attachmentsHTML = `<div class="message-attachments">${attachments.map(f => `<span class="attachment"><svg width='16' height='16' fill='none' stroke='#6366f1' stroke-width='2' viewBox='0 0 24 24'><path d='M21 12.79V7a5 5 0 0 0-10 0v10a3 3 0 0 0 6 0V8.5' /></svg> ${f.name}</span>`).join('')}</div>`;
        }
        messageDiv.innerHTML = `${icon}<span class="chat-bubble">${replyHTML}${text}${attachmentsHTML}${statusIcon}${editBtn}${deleteBtn}${replyBtn}${forwardBtn}${reactBtn}</span>${timestamp}${reactionsHTML}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // Animate user bubble
        if (type === 'user') {
            messageDiv.classList.add('pop');
            messageDiv.addEventListener('animationend', () => {
                messageDiv.classList.remove('pop');
            }, { once: true });
            // Ripple effect
            const bubble = messageDiv.querySelector('.chat-bubble');
            const ripple = document.createElement('span');
            ripple.className = 'bubble-ripple';
            bubble.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            // Simulate status transitions
            const statusEl = messageDiv.querySelector('.chat-status-icon');
            setTimeout(() => {
                if (statusEl) {
                    statusEl.innerHTML = statusSVGs['sent'];
                    statusEl.title = 'Sent';
                    statusEl.setAttribute('aria-label', 'sent');
                }
            }, 700);
            setTimeout(() => {
                if (statusEl) {
                    statusEl.innerHTML = statusSVGs['read'];
                    statusEl.title = 'Read';
                    statusEl.setAttribute('aria-label', 'read');
                }
            }, 1400);
        }
        // Edit message logic with touch support
        if (type === 'user') {
            const editButton = messageDiv.querySelector('.edit-message-btn');
            editButton.addEventListener('click', () => {
                const bubble = messageDiv.querySelector('.chat-bubble');
                const oldText = bubble.childNodes[replyTo ? 1 : 0].nodeValue;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = oldText;
                input.className = 'edit-message-input';
                bubble.innerHTML = replyHTML;
                bubble.appendChild(input);
                // Save/cancel buttons
                const saveBtn = document.createElement('button');
                saveBtn.className = 'save-edit-btn';
                saveBtn.textContent = 'Save';
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'cancel-edit-btn';
                cancelBtn.textContent = 'Cancel';
                bubble.appendChild(saveBtn);
                bubble.appendChild(cancelBtn);
                input.focus();
                saveBtn.addEventListener('click', () => {
                    bubble.innerHTML = replyHTML + input.value + attachmentsHTML + statusIcon + editBtn + deleteBtn + replyBtn + forwardBtn + reactBtn;
                });
                cancelBtn.addEventListener('click', () => {
                    bubble.innerHTML = replyHTML + oldText + attachmentsHTML + statusIcon + editBtn + deleteBtn + replyBtn + forwardBtn + reactBtn;
                });
            });
            editButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                editButton.click();
            });
            
            // Delete message logic with touch support
            const deleteButton = messageDiv.querySelector('.delete-message-btn');
            deleteButton.addEventListener('click', () => {
                if (confirm('Delete this message?')) {
                    messageDiv.remove();
                }
            });
            deleteButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                deleteButton.click();
            });
        }
        
        // Reply logic with touch support
        const replyButton = messageDiv.querySelector('.reply-message-btn');
        replyButton.addEventListener('click', () => {
            chatInput.focus();
            chatInput.setAttribute('data-reply-to', text);
            chatInput.placeholder = 'Replying to: ' + text;
        });
        replyButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            replyButton.click();
        });
        
        // Forward logic with touch support
        const forwardButton = messageDiv.querySelector('.forward-message-btn');
        forwardButton.addEventListener('click', () => {
            chatInput.value = text;
            chatInput.placeholder = 'Forwarded message: ' + text;
            chatInput.focus();
        });
        forwardButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            forwardButton.click();
        });
        // Reactions logic
        const reactButton = messageDiv.querySelector('.react-message-btn');
        reactButton.addEventListener('click', (e) => {
            e.stopPropagation();
            let popup = messageDiv.querySelector('.reaction-popup');
            if (!popup) {
                popup = document.createElement('div');
                popup.className = 'reaction-popup';
                const emojis = ['👍','❤️','😂','😮','👏'];
                popup.innerHTML = emojis.map(emoji => `<button class="reaction-emoji-btn" aria-label="${emoji}">${emoji}</button>`).join('');
                messageDiv.appendChild(popup);
                popup.style.position = 'absolute';
                popup.style.bottom = '2.5em';
                popup.style.left = '3em';
                popup.style.background = '#fff';
                popup.style.border = '1px solid #eee';
                popup.style.borderRadius = '1em';
                popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.13)';
                popup.style.padding = '0.3em 0.7em';
                popup.style.zIndex = 20;
                popup.querySelectorAll('.reaction-emoji-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Add reaction visually
                        let reactionsDiv = messageDiv.querySelector('.message-reactions');
                        if (!reactionsDiv) {
                            reactionsDiv = document.createElement('div');
                            reactionsDiv.className = 'message-reactions';
                            messageDiv.appendChild(reactionsDiv);
                        }
                        const emoji = btn.textContent;
                        const span = document.createElement('span');
                        span.className = 'reaction';
                        span.textContent = emoji;
                        reactionsDiv.appendChild(span);
                        popup.remove();
                    });
                });
            } else {
                popup.remove();
            }
        });
    };

    // Show/hide typing indicator
    function showTypingIndicator(show) {
        const typing = document.querySelector('.chat-typing-indicator');
        if (typing) typing.style.display = show ? 'flex' : 'none';
    }

    // File attachment logic
    const chatInputContainer = document.querySelector('.chat-input');
    const attachBtn = document.createElement('button');
    attachBtn.className = 'attach-file-btn';
    attachBtn.setAttribute('aria-label', 'Attach file');
    attachBtn.innerHTML = `<svg width='20' height='20' fill='none' stroke='#6366f1' stroke-width='2' viewBox='0 0 24 24'><path d='M21 12.79V7a5 5 0 0 0-10 0v10a3 3 0 0 0 6 0V8.5' /></svg>`;
    chatInputContainer.insertBefore(attachBtn, chatInputContainer.firstChild);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    attachBtn.addEventListener('click', () => fileInput.click());
    chatInputContainer.appendChild(fileInput);
    let pendingAttachments = [];
    fileInput.addEventListener('change', (e) => {
        pendingAttachments = Array.from(e.target.files);
        // Optionally show file names in the UI before sending
    });

    // --- Drag-and-drop file upload ---
    chatInputContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        chatInputContainer.classList.add('dragover');
    });
    chatInputContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        chatInputContainer.classList.remove('dragover');
    });
    chatInputContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        chatInputContainer.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files.length) {
            pendingAttachments = Array.from(e.dataTransfer.files);
            // Optionally show file names in the UI before sending
        }
    });

    // --- Message search ---
    const searchContainer = document.createElement('div');
    searchContainer.className = 'chat-search-container';
    searchContainer.innerHTML = `<input type="text" class="chat-search-input" placeholder="Search messages..." aria-label="Search messages">`;
    chatContainer.insertBefore(searchContainer, chatContainer.querySelector('.chat-messages'));
    const searchInput = searchContainer.querySelector('.chat-search-input');
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.trim().toLowerCase();
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach(msg => {
            const text = msg.textContent.toLowerCase();
            msg.style.display = term === '' || text.includes(term) ? '' : 'none';
        });
    });

    // --- Explore Chat History ---
    const exploreBtn = document.createElement('button');
    exploreBtn.className = 'explore-history-btn';
    exploreBtn.textContent = 'Explore Chat History';
    exploreBtn.setAttribute('aria-label', 'Explore chat history');
    searchContainer.appendChild(exploreBtn);

    // Modal for chat history
    const historyModal = document.createElement('div');
    historyModal.className = 'chat-history-modal';
    historyModal.innerHTML = `
        <div class="chat-history-content" tabindex="-1">
            <button class="close-history-btn" aria-label="Close chat history">×</button>
            <h2>Chat History</h2>
            <ul class="chat-history-list"></ul>
        </div>
    `;
    document.body.appendChild(historyModal);
    const closeHistoryBtn = historyModal.querySelector('.close-history-btn');
    closeHistoryBtn.addEventListener('click', () => {
        historyModal.classList.remove('open');
    });
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) historyModal.classList.remove('open');
    });

    // Open modal and populate history
    exploreBtn.addEventListener('click', () => {
        const historyList = historyModal.querySelector('.chat-history-list');
        historyList.innerHTML = '';
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach((msg, idx) => {
            const sender = msg.classList.contains('user') ? 'You' : 'Seyfu AI';
            const time = msg.querySelector('.chat-timestamp')?.textContent || '';
            const snippet = msg.textContent.trim().slice(0, 60) + (msg.textContent.length > 60 ? '...' : '');
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `<span class="history-sender">${sender}</span> <span class="history-time">${time}</span><div class="history-snippet">${snippet}</div>`;
            li.tabIndex = 0;
            li.addEventListener('click', () => {
                historyModal.classList.remove('open');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                msg.classList.add('highlight-history');
                setTimeout(() => msg.classList.remove('highlight-history'), 1800);
            });
            historyList.appendChild(li);
        });
        historyModal.classList.add('open');
        historyModal.querySelector('.chat-history-content').focus();
    });

    // Update sendMessage to include reply and attachments
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        const replyTo = chatInput.getAttribute('data-reply-to') || null;
        if (message || pendingAttachments.length) {
            addMessage(message, 'user', 'pending', [], replyTo, pendingAttachments);
            chatInput.value = '';
            chatInput.removeAttribute('data-reply-to');
            chatInput.placeholder = 'Type your message...';
            showTypingIndicator(true);
            pendingAttachments = [];
            try {
                const apiKey = 's0GmyPhXzhKB7YS9lRcjZwuYGpesTbFsFoLwLiq0';
                const response = await fetch('https://api.cohere.ai/v1/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'command-r-plus',
                        message: message,
                        chat_history: []
                    })
                });
                const data = await response.json();
                showTypingIndicator(false);
                if (data && data.text) {
                    addMessage(data.text, 'bot');
                } else {
                    addMessage('Sorry, I could not get a response from the AI.', 'bot');
                }
            } catch (err) {
                showTypingIndicator(false);
                addMessage('Sorry, there was an error connecting to the AI.', 'bot');
            }
        }
    };

    // Send message on button click and touch
    sendButton.addEventListener('click', sendMessage);
    sendButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sendMessage();
    });

    // Send message on Enter key and touch
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Handle virtual keyboard dismissal
    chatInput.addEventListener('blur', () => {
        if (chatInput.value.trim() && !chatInput.getAttribute('data-reply-to')) {
            sendMessage();
        }
    });
    
    // Handle touch input
    chatInput.addEventListener('touchstart', () => {
        chatInput.focus();
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatContainer.contains(e.target) && !chatToggle.contains(e.target)) {
            chatContainer.classList.remove('active');
        }
    });

    // Prevent chat container from closing when clicking inside
    chatContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}); 
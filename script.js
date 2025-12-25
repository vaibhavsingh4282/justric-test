// Frontend JavaScript for Justric AI

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const logoutBtn = document.getElementById('logoutBtn');
const newDocBtn = document.getElementById('newDocBtn');
const documentFormElement = document.getElementById('documentFormElement');
const documentFormSection = document.getElementById('documentForm');
const documentPreviewSection = document.getElementById('documentPreview');
const cancelBtn = document.getElementById('cancelBtn');
const editBtn = document.getElementById('editBtn');
const generatedDocumentContent = document.getElementById('generatedDocumentContent');

// Check if user is logged in (simulated)
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Show dashboard elements
        if (document.querySelector('.auth-buttons')) {
            document.querySelector('.auth-buttons').style.display = 'none';
        }
        if (document.querySelector('.user-menu')) {
            document.querySelector('.user-menu').style.display = 'flex';
        }
    } else {
        // Show auth buttons
        if (document.querySelector('.auth-buttons')) {
            document.querySelector('.auth-buttons').style.display = 'flex';
        }
        if (document.querySelector('.user-menu')) {
            document.querySelector('.user-menu').style.display = 'none';
        }
    }
}

// Simulate login
function login() {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'John Doe');
    localStorage.setItem('userPlan', 'Pro');
    checkAuthStatus();
    
    // Redirect to dashboard if on homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.location.href = 'dashboard.html';
    }
}

// Simulate logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPlan');
    checkAuthStatus();
    
    // Redirect to homepage if on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}

// Show document form
function showDocumentForm() {
    documentFormSection.classList.remove('hidden');
    documentPreviewSection.classList.add('hidden');
    documentFormElement.reset();
}

// Hide document form
function hideDocumentForm() {
    documentFormSection.classList.add('hidden');
}

// Generate document
async function generateDocument(e) {
    e.preventDefault();
    
    // Get form values
    const documentType = document.getElementById('documentType').value;
    const country = document.getElementById('country').value;
    const language = document.getElementById('language').value;
    const details = document.getElementById('details').value;
    
    // Validate form
    if (!documentType || !country || !language || !details) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#documentFormElement .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Generating...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call to backend
        // In a real implementation, this would call your Node.js backend
        const response = await simulateDocumentGeneration({
            documentType,
            country,
            language,
            details,
            userId: 'user-123' // In real app, get from auth
        });
        
        // Display generated document
        displayGeneratedDocument(response.document.text);
        
        // Switch to preview view
        documentFormSection.classList.add('hidden');
        documentPreviewSection.classList.remove('hidden');
    } catch (error) {
        console.error('Error generating document:', error);
        alert('Failed to generate document. Please try again.');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Simulate document generation (replace with actual API call)
function simulateDocumentGeneration(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // This is a simulation - in reality, you would call your backend API
            const sampleDocument = `
${data.documentType.toUpperCase()}
FOR USE IN ${data.country.toUpperCase()}

This ${data.documentType.toLowerCase()} is entered into on ${new Date().toLocaleDateString()} between the parties as described below.

PARTIES:
[Party Information]

TERMS AND CONDITIONS:
${data.details}

GOVERNING LAW:
This agreement shall be governed by the laws of ${data.country}.

IN WITNESS WHEREOF, the parties hereto have executed this ${data.documentType.toLowerCase()} as of the date first above written.

___________________________    ___________________________
Party A Signature           Party B Signature

___________________________    ___________________________
Print Name                  Print Name

Date: _________             Date: _________
            `;
            
            resolve({
                document: {
                    text: sampleDocument,
                    title: `${data.documentType} - ${data.country}`,
                    language: data.language
                }
            });
        }, 2000);
    });
}

// Display generated document
function displayGeneratedDocument(content) {
    generatedDocumentContent.innerHTML = `<pre>${content}</pre>`;
}

// Edit document
function editDocument() {
    documentPreviewSection.classList.add('hidden');
    documentFormSection.classList.remove('hidden');
}

// Download as PDF
function downloadPDF() {
    const content = generatedDocumentContent.innerText;
    const title = document.querySelector('.preview-header h2').innerText || 'Justric_AI_Document';
    
    // Import jsPDF
    const { jsPDF } = window.jspdf;
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
        title: title,
        subject: 'Legal Document generated by Justric AI',
        author: 'Justric AI',
        keywords: 'legal, document, ai, justric',
        creator: 'Justric AI'
    });
    
    // Add watermark
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(40);
    doc.text('Justric AI', 105, 150, null, 45);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 10, 20);
    
    // Add content
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 10, 30);
    
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

// Download as DOCX
function downloadDOCX() {
    const content = generatedDocumentContent.innerText;
    const title = document.querySelector('.preview-header h2').innerText || 'Justric_AI_Document';
    
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'application/msword' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}.doc`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    // Homepage events
    if (loginBtn) loginBtn.addEventListener('click', login);
    if (signupBtn) signupBtn.addEventListener('click', login);
    if (getStartedBtn) getStartedBtn.addEventListener('click', () => {
        login(); // For demo purposes, login directly
    });
    
    // Dashboard events
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (newDocBtn) newDocBtn.addEventListener('click', showDocumentForm);
    if (cancelBtn) cancelBtn.addEventListener('click', hideDocumentForm);
    if (editBtn) editBtn.addEventListener('click', editDocument);
    if (documentFormElement) documentFormElement.addEventListener('submit', generateDocument);
    
    // Download buttons
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadDocxBtn = document.getElementById('downloadDocxBtn');
    
    if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPDF);
    if (downloadDocxBtn) downloadDocxBtn.addEventListener('click', downloadDOCX);
    
    // Set user info if on dashboard
    const userNameElement = document.getElementById('userName');
    const userPlanElement = document.getElementById('userPlan');
    
    if (userNameElement) {
        userNameElement.textContent = localStorage.getItem('userName') || 'User';
    }
    
    if (userPlanElement) {
        userPlanElement.textContent = localStorage.getItem('userPlan') || 'Basic Plan';
    }
});

// Initialize Supabase client (in a real implementation)
/*
const { createClient } = supabase;
const _supabase = createClient(
    'YOUR_SUPABASE_URL',
    'YOUR_SUPABASE_KEY'
);
*/

// Initialize Stripe (in a real implementation)
/*
const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');
*/

// AI Chat Support Functionality
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');
const chatMessages = document.getElementById('chatMessages');

// Toggle chat widget visibility
if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('hidden');
    });
}

// Close chat widget
if (closeChat) {
    closeChat.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });
}

// Send chat message
if (sendChat) {
    sendChat.addEventListener('click', sendChatMessage);
}

// Send message on Enter key
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Function to send chat message
async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        // Simulate AI response (in a real implementation, this would call your backend API)
        const response = await getAIResponse(message);
        
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Add AI response to chat
        addMessageToChat(response, 'bot');
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Show error message
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
        console.error('Chat error:', error);
    }
}

// Add message to chat
function addMessageToChat(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender + '-message');
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    
    messageDiv.appendChild(paragraph);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message');
    typingDiv.id = 'typingIndicator';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Thinking...';
    
    typingDiv.appendChild(paragraph);
    chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;
}

// Get AI response from backend API
async function getAIResponse(message) {
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.response;
        } else {
            throw new Error(data.error || 'Failed to get response from AI');
        }
    } catch (error) {
        console.error('Error getting AI response:', error);
        return "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
    }
}

// Multi-Currency Support
// Exchange rates relative to USD (more accurate)
const currencyRates = {
    'INR': 83.33,   // Indian Rupee
    'USD': 1,       // US Dollar (base currency)
    'EUR': 0.92,    // Euro
    'GBP': 0.79,    // British Pound
    'JPY': 148.50,  // Japanese Yen
    'CAD': 1.35,    // Canadian Dollar
    'AUD': 1.52,    // Australian Dollar
    'SGD': 1.34,    // Singapore Dollar
    'AED': 3.67,    // UAE Dirham
    'CHF': 0.89     // Swiss Franc
};

const currencySymbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'SGD': 'S$',
    'AED': 'د.إ',
    'CHF': 'CHF'
};

// Detect user's preferred currency
function getUserCurrency() {
    // Try to get from localStorage first
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency && currencyRates[savedCurrency]) {
        return savedCurrency;
    }
    
    // Detect from browser language
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Map language to currency
    const languageToCurrency = {
        'en-IN': 'INR',
        'en-US': 'USD',
        'en-GB': 'GBP',
        'en-AU': 'AUD',
        'en-CA': 'CAD',
        'de': 'EUR',
        'fr': 'EUR',
        'es': 'EUR',
        'ja': 'JPY',
        'zh': 'CNY',
        'ar': 'AED'
    };
    
    // Check for exact match
    if (languageToCurrency[browserLang]) {
        return languageToCurrency[browserLang];
    }
    
    // Check for language prefix match
    for (const [langPrefix, currency] of Object.entries(languageToCurrency)) {
        if (browserLang.startsWith(langPrefix.split('-')[0])) {
            return currency;
        }
    }
    
    // Default to USD
    return 'USD';
}

// Convert price to user's currency
// Prices in HTML are in INR, so we convert from INR to target currency
function convertPrice(basePriceInINR, targetCurrency) {
    if (!targetCurrency || !currencyRates[targetCurrency]) {
        targetCurrency = getUserCurrency();
    }
    
    // Convert INR to USD first, then to target currency
    const usdAmount = basePriceInINR / currencyRates['INR'];
    const targetAmount = usdAmount * currencyRates[targetCurrency];
    
    // Round to appropriate decimal places based on currency
    if (targetCurrency === 'JPY') {
        return Math.round(targetAmount).toString();
    } else {
        return targetAmount.toFixed(2);
    }
}

// Format price with currency symbol
function formatPrice(price, currency) {
    if (!currency) {
        currency = getUserCurrency();
    }
    
    const symbol = currencySymbols[currency] || currency;
    
    // For some currencies, the symbol comes after the amount
    const postSymbolCurrencies = ['JPY'];
    
    if (postSymbolCurrencies.includes(currency)) {
        return `${price} ${symbol}`;
    } else {
        return `${symbol}${price}`;
    }
}

// Update all prices on the page
function updatePrices() {
    const userCurrency = getUserCurrency();
    
    // Update pricing section
    const priceElements = document.querySelectorAll('.price');
    priceElements.forEach(element => {
        // Extract base price (assuming INR) - preserve commas for thousands
        const basePriceText = element.textContent.replace(/[^0-9,]/g, '').replace(/,/g, '');
        const basePrice = parseInt(basePriceText);
        
        if (!isNaN(basePrice)) {
            const convertedPrice = convertPrice(basePrice, userCurrency);
            const formattedPrice = formatPrice(convertedPrice, userCurrency);
            
            // Update the price display
            element.innerHTML = `${formattedPrice}<span>/month</span>`;
        }
    });
    
    // Update usage count if needed
    const usageCountElement = document.getElementById('usageCount');
    if (usageCountElement) {
        // Could add currency-specific messaging here if needed
    }
}

// Initialize currency conversion when page loads
document.addEventListener('DOMContentLoaded', () => {
    updatePrices();
});

// Add currency selector functionality
function initializeCurrencySelector() {
    // Set initial value
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.value = getUserCurrency();
        
        // Add event listener
        currencySelect.addEventListener('change', (e) => {
            const selectedCurrency = e.target.value;
            localStorage.setItem('preferredCurrency', selectedCurrency);
            updatePrices();
        });
    }
}

// Initialize currency selector
initializeCurrencySelector();
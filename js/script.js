// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set default date and time
    setDefaultDateTime();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize preview
    updatePreview();
    
    // Apply default template
    applyTemplateToPreview('template1');
}

// Set default date and time to current
function setDefaultDateTime() {
    const dateInput = document.getElementById('fuelDate');
    const timeInput = document.getElementById('fuelTime');
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    
    dateInput.value = dateStr;
    timeInput.value = timeStr;
}

// Set up all event listeners
function setupEventListeners() {
    // Template selection
    const templateRadios = document.querySelectorAll('input[name="template"]');
    templateRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            applyTemplateToPreview(this.value);
            updatePreview();
        });
    });
    
    // Tax option radio buttons
    const taxRadios = document.querySelectorAll('input[name="taxOption"]');
    taxRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const taxNumberGroup = document.getElementById('taxNumberGroup');
            if (this.value !== 'None') {
                taxNumberGroup.style.display = 'block';
            } else {
                taxNumberGroup.style.display = 'none';
            }
            updatePreview();
        });
    });
    
    // Logo source selection
    const logoRadios = document.querySelectorAll('input[name="logoSource"]');
    logoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            handleLogoSourceChange(this.value);
        });
    });
    
    // Logo gallery selection
    const logoOptions = document.querySelectorAll('.logo-option');
    logoOptions.forEach(option => {
        option.addEventListener('click', function() {
            logoOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            updateLogoPreview(this.querySelector('img').src);
        });
    });
    
    // Logo upload
    const logoUpload = document.getElementById('logoUpload');
    logoUpload.addEventListener('change', function(e) {
        handleLogoUpload(e);
    });
    
    // Form inputs - update preview on change
    const formInputs = [
        'stationName', 'stationAddress', 'contactNumber', 'productType', 'paymentMethod', 'invoiceNumber',
        'fuelRate', 'totalAmount', 'fuelDate', 'fuelTime',
        'customerName', 'vehicleNumber', 'vehicleType', 'currency', 
        'logoUrl', 'taxNumber'
    ];
    
    formInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        }
    });
    
    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', generatePDF);
}

// Handle logo source change
function handleLogoSourceChange(source) {
    const urlGroup = document.getElementById('logoUrlGroup');
    const uploadGroup = document.getElementById('logoUploadGroup');
    const galleryGroup = document.getElementById('logoGalleryGroup');
    
    urlGroup.style.display = 'none';
    uploadGroup.style.display = 'none';
    galleryGroup.style.display = 'none';
    
    if (source === 'url') {
        urlGroup.style.display = 'block';
    } else if (source === 'upload') {
        uploadGroup.style.display = 'block';
    } else if (source === 'gallery') {
        galleryGroup.style.display = 'block';
    }
    
    updatePreview();
}

// Handle logo upload
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            updateLogoPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Update logo preview
function updateLogoPreview(logoSrc) {
    const previewLogo = document.getElementById('previewLogo');
    if (logoSrc && logoSrc.trim() !== '') {
        // Clear existing content
        previewLogo.innerHTML = '';
        // Create img element safely
        const img = document.createElement('img');
        img.src = logoSrc;
        img.alt = 'Logo';
        previewLogo.appendChild(img);
    } else {
        previewLogo.innerHTML = '<div class="logo-placeholder">LOGO</div>';
    }
}

// Update live preview
function updatePreview() {
    // Check if receipt style is active
    const previewArea = document.querySelector('.preview-area');
    if (previewArea && previewArea.classList.contains('receipt-style')) {
        updateReceiptPreview();
        return;
    }
    
    // Station details
    const stationName = document.getElementById('stationName').value || 'Fuel Station Name';
    const stationAddress = document.getElementById('stationAddress').value || 'Station Address';
    const stationNameElem = document.getElementById('previewStationName');
    const stationAddressElem = document.getElementById('previewStationAddress');
    if (stationNameElem) stationNameElem.textContent = stationName;
    if (stationAddressElem) stationAddressElem.textContent = stationAddress;
    
    // Invoice details
    const invoiceNumber = document.getElementById('invoiceNumber').value || 'INV-001';
    const invoiceElem = document.getElementById('previewInvoiceNumber');
    if (invoiceElem) invoiceElem.textContent = invoiceNumber;
    
    // Date and time
    const fuelDate = document.getElementById('fuelDate').value;
    const fuelTime = document.getElementById('fuelTime').value;
    const dateElem = document.getElementById('previewDate');
    const timeElem = document.getElementById('previewTime');
    if (dateElem) dateElem.textContent = fuelDate ? formatDate(fuelDate) : '-';
    if (timeElem) timeElem.textContent = fuelTime || '-';
    
    // Currency and amounts
    const currency = document.getElementById('currency').value;
    const fuelRate = parseFloat(document.getElementById('fuelRate').value) || 0;
    const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
    const volume = fuelRate > 0 ? (totalAmount / fuelRate).toFixed(2) : '0.00';
    
    const currencyElem = document.getElementById('previewCurrency');
    const currencyElem2 = document.getElementById('previewCurrency2');
    if (currencyElem) currencyElem.textContent = currency;
    if (currencyElem2) currencyElem2.textContent = currency;
    
    const rateElem = document.getElementById('previewRate');
    const volumeElem = document.getElementById('previewVolume');
    const amountElem = document.getElementById('previewAmount');
    
    if (rateElem) rateElem.innerHTML = `<span id="previewCurrency">${currency}</span> ${fuelRate.toFixed(2)}`;
    if (volumeElem) volumeElem.textContent = `${volume} L`;
    if (amountElem) amountElem.innerHTML = `<span id="previewCurrency2">${currency}</span> ${totalAmount.toFixed(2)}`;
    
    // Customer details
    const vehicleType = document.getElementById('vehicleType').value || '-';
    const vehicleNumber = document.getElementById('vehicleNumber').value || '-';
    const customerName = document.getElementById('customerName').value || '-';
    const paymentMethod = document.getElementById('paymentMethod').value || '-';
    
    const vehicleTypeElem = document.getElementById('previewVehicleType');
    const vehicleNumberElem = document.getElementById('previewVehicleNumber');
    const customerNameElem = document.getElementById('previewCustomerName');
    const paymentMethodElem = document.getElementById('previewPaymentMethod');
    
    if (vehicleTypeElem) vehicleTypeElem.textContent = vehicleType;
    if (vehicleNumberElem) vehicleNumberElem.textContent = vehicleNumber;
    if (customerNameElem) customerNameElem.textContent = customerName;
    if (paymentMethodElem) paymentMethodElem.textContent = paymentMethod;
    
    // Tax information
    const taxOption = document.querySelector('input[name="taxOption"]:checked').value;
    const taxNumber = document.getElementById('taxNumber').value;
    const taxRow = document.getElementById('previewTaxRow');
    
    if (taxRow) {
        if (taxOption !== 'None' && taxNumber) {
            taxRow.style.display = 'flex';
            const taxLabelElem = document.getElementById('previewTaxLabel');
            const taxNumberElem = document.getElementById('previewTaxNumber');
            if (taxLabelElem) taxLabelElem.textContent = taxOption + ':';
            if (taxNumberElem) taxNumberElem.textContent = taxNumber;
        } else {
            taxRow.style.display = 'none';
        }
    }
    
    // Logo update
    const logoSource = document.querySelector('input[name="logoSource"]:checked').value;
    if (logoSource === 'url') {
        const logoUrl = document.getElementById('logoUrl').value;
        updateLogoPreview(logoUrl);
    } else if (logoSource === 'gallery') {
        const selectedLogo = document.querySelector('.logo-option.selected');
        if (selectedLogo) {
            updateLogoPreview(selectedLogo.querySelector('img').src);
        }
    }
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format date as DD/MM/YYYY for receipt
function formatDateForReceipt(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Validate form before generating PDF
function validateForm() {
    const errors = [];
    
    // Required fields
    const requiredFields = [
        { id: 'stationName', name: 'Fuel Station Name' },
        { id: 'stationAddress', name: 'Fuel Station Address' },
        { id: 'paymentMethod', name: 'Payment Method' },
        { id: 'invoiceNumber', name: 'Invoice Number' },
        { id: 'currency', name: 'Currency' },
        { id: 'fuelRate', name: 'Fuel Rate' },
        { id: 'totalAmount', name: 'Total Amount' },
        { id: 'fuelDate', name: 'Fuel Bill Date' },
        { id: 'fuelTime', name: 'Fuel Bill Time' },
        { id: 'customerName', name: 'Customer Name' },
        { id: 'vehicleNumber', name: 'Vehicle Number' },
        { id: 'vehicleType', name: 'Vehicle Type' }
    ];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value || input.value.trim() === '') {
            errors.push(`${field.name} is required`);
        }
    });
    
    // Validate numeric fields
    const fuelRate = parseFloat(document.getElementById('fuelRate').value);
    const totalAmount = parseFloat(document.getElementById('totalAmount').value);
    
    if (isNaN(fuelRate) || fuelRate <= 0) {
        errors.push('Fuel Rate must be a positive number');
    }
    
    if (isNaN(totalAmount) || totalAmount <= 0) {
        errors.push('Total Amount must be a positive number');
    }
    
    // Check logo authorization
    const logoAuthorization = document.getElementById('logoAuthorization');
    if (!logoAuthorization.checked) {
        errors.push('You must authorize the use of the logo');
    }
    
    return errors;
}

// Show error message
function showMessage(message, isError = true) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error-message' : 'success-message';
    
    // Handle message formatting
    if (typeof message === 'string' && message.includes('\n')) {
        // Convert newlines to HTML breaks
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    } else {
        messageDiv.textContent = message;
    }
    
    // Insert before generate button
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.parentNode.insertBefore(messageDiv, generateBtn);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Get current logo data
async function getLogoData() {
    const logoSource = document.querySelector('input[name="logoSource"]:checked').value;
    let logoData = null;
    
    try {
        if (logoSource === 'url') {
            const logoUrl = document.getElementById('logoUrl').value;
            if (logoUrl && logoUrl.trim() !== '') {
                logoData = await imageUrlToBase64(logoUrl);
            }
        } else if (logoSource === 'upload') {
            const logoUpload = document.getElementById('logoUpload');
            if (logoUpload.files && logoUpload.files[0]) {
                logoData = await fileToBase64(logoUpload.files[0]);
            }
        } else if (logoSource === 'gallery') {
            const selectedLogo = document.querySelector('.logo-option.selected');
            if (selectedLogo) {
                const imgSrc = selectedLogo.querySelector('img').src;
                logoData = imgSrc; // SVG data URLs work directly
            }
        }
    } catch (e) {
        console.warn('Could not load logo:', e);
    }
    
    return logoData;
}

// Convert image URL to base64
function imageUrlToBase64(url) {
    return new Promise((resolve, reject) => {
        // If it's already a data URL, return it
        if (url.startsWith('data:')) {
            resolve(url);
            return;
        }
        
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            try {
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (e) {
                console.warn('CORS error loading image:', e);
                reject(new Error('Unable to load image due to CORS restrictions. Please use a different image or upload from device.'));
            }
        };
        img.onerror = function() {
            reject(new Error('Failed to load image from URL. Please check the URL and try again.'));
        };
        img.src = url;
    });
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Generate PDF
async function generatePDF() {
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
        showMessage('Please fix the following errors:\n' + errors.join('\n'), true);
        return;
    }
    
    // Show generating message
    const generateBtn = document.getElementById('generateBtn');
    const originalText = generateBtn.textContent;
    generateBtn.textContent = 'Generating PDF...';
    generateBtn.disabled = true;
    
    try {
        // Get logo data
        const logoData = await getLogoData();
        
        // Collect form data
        const formData = {
            stationName: document.getElementById('stationName').value,
            stationAddress: document.getElementById('stationAddress').value,
            contactNumber: document.getElementById('contactNumber')?.value || '',
            productType: document.getElementById('productType')?.value || 'Petrol',
            paymentMethod: document.getElementById('paymentMethod').value,
            invoiceNumber: document.getElementById('invoiceNumber').value,
            currency: document.getElementById('currency').value,
            fuelRate: parseFloat(document.getElementById('fuelRate').value).toFixed(2),
            totalAmount: parseFloat(document.getElementById('totalAmount').value).toFixed(2),
            volume: (parseFloat(document.getElementById('totalAmount').value) / parseFloat(document.getElementById('fuelRate').value)).toFixed(2),
            date: formatDate(document.getElementById('fuelDate').value),
            receiptDate: formatDateForReceipt(document.getElementById('fuelDate').value),
            time: document.getElementById('fuelTime').value,
            receiptTime: document.getElementById('fuelTime').value,
            customerName: document.getElementById('customerName').value,
            vehicleNumber: document.getElementById('vehicleNumber').value,
            vehicleType: document.getElementById('vehicleType').value,
            taxOption: document.querySelector('input[name="taxOption"]:checked').value,
            taxNumber: document.getElementById('taxNumber').value,
            logoData: logoData
        };
        
        // Get selected template
        const selectedTemplate = document.querySelector('input[name="template"]:checked').value;
        
        // Generate PDF using template
        const doc = generatePDFWithTemplate(selectedTemplate, formData);
        
        // Get filename
        let fileName = document.getElementById('fileName').value || 'fuel-bill';
        fileName = fileName.trim();
        if (!fileName.endsWith('.pdf')) {
            fileName += '.pdf';
        }
        
        // Save PDF
        doc.save(fileName);
        
        showMessage('PDF generated successfully!', false);
    } catch (error) {
        console.error('Error generating PDF:', error);
        showMessage('Error generating PDF. Please try again.', true);
    } finally {
        // Restore button
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }
}

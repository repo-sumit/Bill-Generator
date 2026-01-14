// Bill Template Designs
const billTemplates = {
    template1: {
        name: "Classic Template",
        colors: {
            primary: "#FF6B35",
            secondary: "#4ECDC4",
            text: "#333333",
            lightBg: "#f8f9fa"
        },
        headerStyle: "centered",
        tableStyle: "bordered"
    },
    
    template2: {
        name: "Modern Template",
        colors: {
            primary: "#667eea",
            secondary: "#764ba2",
            text: "#2d3748",
            lightBg: "#edf2f7"
        },
        headerStyle: "leftAligned",
        tableStyle: "striped"
    },
    
    template3: {
        name: "Professional Template",
        colors: {
            primary: "#2C3E50",
            secondary: "#E74C3C",
            text: "#34495E",
            lightBg: "#ECF0F1"
        },
        headerStyle: "rightAligned",
        tableStyle: "minimal"
    },
    
    template4: {
        name: "Elegant Template",
        colors: {
            primary: "#16a085",
            secondary: "#f39c12",
            text: "#2c3e50",
            lightBg: "#ecf0f1"
        },
        headerStyle: "centered",
        tableStyle: "rounded"
    },
    
    template5: {
        name: "Receipt Style",
        colors: {
            primary: "#000000",
            secondary: "#333333",
            text: "#000000",
            lightBg: "#ffffff"
        },
        headerStyle: "receipt",
        tableStyle: "receipt",
        fontFamily: "courier"
    }
};

// Function to get template configuration
function getTemplateConfig(templateId) {
    return billTemplates[templateId] || billTemplates.template1;
}

// Function to apply template to preview
function applyTemplateToPreview(templateId) {
    const template = getTemplateConfig(templateId);
    const previewContent = document.querySelector('.preview-content');
    
    if (!previewContent) return;
    
    // Check if receipt style
    if (template.headerStyle === 'receipt') {
        applyReceiptStylePreview();
        return;
    }
    
    // Reset to normal preview style if switching from receipt
    const previewArea = document.querySelector('.preview-area');
    if (previewArea && previewArea.classList.contains('receipt-style')) {
        resetNormalPreview();
    }
    
    // Update CSS variables for the preview
    const root = document.documentElement;
    root.style.setProperty('--template-primary', template.colors.primary);
    root.style.setProperty('--template-secondary', template.colors.secondary);
    root.style.setProperty('--template-text', template.colors.text);
    root.style.setProperty('--template-light-bg', template.colors.lightBg);
    
    // Apply styles to preview elements
    const previewHeader = previewContent.querySelector('.preview-station-info h3');
    if (previewHeader) {
        previewHeader.style.color = template.colors.primary;
    }
    
    const previewDividers = previewContent.querySelectorAll('.preview-divider');
    previewDividers.forEach(divider => {
        divider.style.background = `linear-gradient(90deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`;
    });
    
    const tableHeaders = previewContent.querySelectorAll('.preview-table th');
    tableHeaders.forEach(th => {
        th.style.background = `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`;
    });
    
    const logoPlaceholder = previewContent.querySelector('.logo-placeholder');
    if (logoPlaceholder) {
        logoPlaceholder.style.background = template.colors.primary;
    }
}

// Apply receipt-style preview
function applyReceiptStylePreview() {
    const previewArea = document.querySelector('.preview-area');
    const previewContent = document.querySelector('.preview-content');
    
    if (!previewArea || !previewContent) return;
    
    previewArea.classList.add('receipt-style');
    previewContent.className = 'receipt-preview';
    
    // Create receipt structure
    previewContent.innerHTML = `
        <div class="receipt-header">WELCOME!!!</div>
        <div class="receipt-txn" id="receiptTxnNo">TXN NO: INV-001</div>
        <div class="receipt-station-name" id="receiptStationName">FUEL STATION NAME</div>
        <div class="receipt-address" id="receiptAddress">Station Address</div>
        <div class="receipt-contact" id="receiptContact"></div>
        
        <div class="receipt-divider">- - - - - - - - - - - - - - - - - - - - -</div>
        
        <div class="receipt-section">
            <div class="receipt-row" id="receiptReceiptNo">Receipt No.: INV-001</div>
        </div>
        
        <div class="receipt-divider">- - - - - - - - - - - - - - - - - - - - -</div>
        
        <div class="receipt-section">
            <div class="receipt-row" id="receiptProduct">PRODUCT: Petrol  RATE/LTR: ₹ 0.00</div>
            <div class="receipt-row" id="receiptAmount">AMOUNT: ₹ 0.00</div>
            <div class="receipt-row" id="receiptVolume">VOLUME(LTR.): 0.00 lt</div>
        </div>
        
        <div class="receipt-divider">- - - - - - - - - - - - - - - - - - - - -</div>
        
        <div class="receipt-section">
            <div class="receipt-row" id="receiptVehType">VEH TYPE: -</div>
            <div class="receipt-row" id="receiptVehNo">VEH NO: -</div>
            <div class="receipt-row" id="receiptCustomer">CUSTOMER NAME: -</div>
        </div>
        
        <div class="receipt-divider">- - - - - - - - - - - - - - - - - - - - -</div>
        
        <div class="receipt-section">
            <div class="receipt-row" id="receiptDateTime">Date: -      Time: -</div>
        </div>
        
        <div class="receipt-divider">- - - - - - - - - - - - - - - - - - - - -</div>
        
        <div class="receipt-section">
            <div class="receipt-row" id="receiptMode">MODE: -</div>
        </div>
        
        <div class="receipt-footer">
            <div>SAVE FUEL YAANI SAVE MONEY</div>
            <div>!! THANKS FOR FUELLING WITH US. YOU CAN NOW</div>
            <div>CALL US ON 603353 (TOLL-FREE) FOR QUERIES/</div>
            <div>COMPLAINTS.</div>
        </div>
    `;
    
    // Update with current form data
    updateReceiptPreview();
}

// Reset to normal preview
function resetNormalPreview() {
    const previewArea = document.querySelector('.preview-area');
    // Find the preview content - might be .receipt-preview or .preview-content
    let previewContent = previewArea ? previewArea.querySelector('.preview-content, .receipt-preview') : null;
    
    if (!previewArea) return;
    
    previewArea.classList.remove('receipt-style');
    
    // If previewContent doesn't exist or is wrong class, create new one
    if (!previewContent || previewContent.classList.contains('receipt-preview')) {
        // Clear and create new preview-content div
        previewArea.innerHTML = '';
        previewContent = document.createElement('div');
        previewContent.className = 'preview-content';
        previewArea.appendChild(previewContent);
    } else {
        previewContent.className = 'preview-content';
    }
    
    // Restore normal preview structure
    previewContent.innerHTML = `
        <div class="preview-header">
            <div class="preview-logo" id="previewLogo">
                <div class="logo-placeholder">LOGO</div>
            </div>
            <div class="preview-station-info">
                <h3 id="previewStationName">Fuel Station Name</h3>
                <p id="previewStationAddress">Station Address</p>
            </div>
        </div>
        <div class="preview-divider"></div>
        <div class="preview-invoice">
            <div class="preview-row">
                <span class="preview-label">Receipt No:</span>
                <span id="previewInvoiceNumber">INV-001</span>
            </div>
            <div class="preview-row">
                <span class="preview-label">Date:</span>
                <span id="previewDate">-</span>
            </div>
            <div class="preview-row">
                <span class="preview-label">Time:</span>
                <span id="previewTime">-</span>
            </div>
        </div>
        <div class="preview-divider"></div>
        <div class="preview-table">
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Rate/LTR</th>
                        <th>Volume</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Fuel</td>
                        <td id="previewRate"><span id="previewCurrency">₹</span> 0.00</td>
                        <td id="previewVolume">0.00 L</td>
                        <td id="previewAmount"><span id="previewCurrency2">₹</span> 0.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="preview-divider"></div>
        <div class="preview-customer">
            <div class="preview-row">
                <span class="preview-label">Vehicle Type:</span>
                <span id="previewVehicleType">-</span>
            </div>
            <div class="preview-row">
                <span class="preview-label">Vehicle No:</span>
                <span id="previewVehicleNumber">-</span>
            </div>
            <div class="preview-row">
                <span class="preview-label">Customer:</span>
                <span id="previewCustomerName">-</span>
            </div>
            <div class="preview-row">
                <span class="preview-label">Payment:</span>
                <span id="previewPaymentMethod">-</span>
            </div>
            <div class="preview-row" id="previewTaxRow" style="display: none;">
                <span class="preview-label" id="previewTaxLabel">Tax:</span>
                <span id="previewTaxNumber">-</span>
            </div>
        </div>
        <div class="preview-divider"></div>
        <div class="preview-footer">
            <p>Thank you for your business!</p>
            <p class="small">Please visit again</p>
        </div>
    `;
}

// Update receipt preview with form data
function updateReceiptPreview() {
    const previewArea = document.querySelector('.preview-area');
    if (!previewArea || !previewArea.classList.contains('receipt-style')) return;
    
    // Get form values
    const stationName = document.getElementById('stationName').value || 'FUEL STATION NAME';
    const stationAddress = document.getElementById('stationAddress').value || 'Station Address';
    const contactNumber = document.getElementById('contactNumber')?.value || '';
    const invoiceNumber = document.getElementById('invoiceNumber').value || 'INV-001';
    const taxOption = document.querySelector('input[name="taxOption"]:checked')?.value || 'None';
    const taxNumber = document.getElementById('taxNumber')?.value || '';
    const productType = document.getElementById('productType')?.value || 'Petrol';
    const currency = document.getElementById('currency').value;
    const fuelRate = parseFloat(document.getElementById('fuelRate').value) || 0;
    const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
    const volume = fuelRate > 0 ? (totalAmount / fuelRate).toFixed(2) : '0.00';
    const vehicleType = document.getElementById('vehicleType').value || '-';
    const vehicleNumber = document.getElementById('vehicleNumber').value || '-';
    const customerName = document.getElementById('customerName').value || '-';
    const fuelDate = document.getElementById('fuelDate').value;
    const fuelTime = document.getElementById('fuelTime').value;
    const paymentMethod = document.getElementById('paymentMethod').value || '-';
    
    // Update receipt elements
    const txnNo = taxOption === 'TXN NO' && taxNumber ? taxNumber : invoiceNumber;
    const receiptTxnNo = document.getElementById('receiptTxnNo');
    if (receiptTxnNo) receiptTxnNo.textContent = `TXN NO: ${txnNo}`;
    
    const receiptStationName = document.getElementById('receiptStationName');
    if (receiptStationName) receiptStationName.textContent = stationName.toUpperCase();
    
    const receiptAddress = document.getElementById('receiptAddress');
    if (receiptAddress) receiptAddress.textContent = stationAddress.toUpperCase();
    
    const receiptContact = document.getElementById('receiptContact');
    if (receiptContact) receiptContact.textContent = contactNumber;
    
    const receiptReceiptNo = document.getElementById('receiptReceiptNo');
    if (receiptReceiptNo) receiptReceiptNo.textContent = `Receipt No.: ${invoiceNumber}`;
    
    const receiptProduct = document.getElementById('receiptProduct');
    if (receiptProduct) receiptProduct.textContent = `PRODUCT: ${productType}     RATE/LTR: ${currency} ${fuelRate.toFixed(2)}`;
    
    const receiptAmount = document.getElementById('receiptAmount');
    if (receiptAmount) receiptAmount.textContent = `AMOUNT: ${currency} ${totalAmount.toFixed(2)}`;
    
    const receiptVolume = document.getElementById('receiptVolume');
    if (receiptVolume) receiptVolume.textContent = `VOLUME(LTR.): ${volume} lt`;
    
    const receiptVehType = document.getElementById('receiptVehType');
    if (receiptVehType) receiptVehType.textContent = `VEH TYPE: ${vehicleType}`;
    
    const receiptVehNo = document.getElementById('receiptVehNo');
    if (receiptVehNo) receiptVehNo.textContent = `VEH NO: ${vehicleNumber}`;
    
    const receiptCustomer = document.getElementById('receiptCustomer');
    if (receiptCustomer) receiptCustomer.textContent = `CUSTOMER NAME: ${customerName.toUpperCase()}`;
    
    const receiptDateTime = document.getElementById('receiptDateTime');
    if (receiptDateTime) {
        const dateStr = fuelDate ? formatDateForReceipt(fuelDate) : '-';
        const timeStr = fuelTime || '-';
        receiptDateTime.textContent = `Date: ${dateStr}      Time: ${timeStr}`;
    }
    
    const receiptMode = document.getElementById('receiptMode');
    if (receiptMode) receiptMode.textContent = `MODE: ${paymentMethod}`;
}

// Format date as DD/MM/YYYY for receipt
function formatDateForReceipt(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Function to generate PDF with template styling
function generatePDFWithTemplate(templateId, data) {
    const template = getTemplateConfig(templateId);
    const { jsPDF } = window.jspdf;
    
    // Handle receipt style template differently
    if (template.headerStyle === "receipt") {
        return generateReceiptStylePDF(template, data);
    }
    
    const doc = new jsPDF();
    
    // Set template colors
    const primaryRGB = hexToRgb(template.colors.primary);
    const secondaryRGB = hexToRgb(template.colors.secondary);
    const textRGB = hexToRgb(template.colors.text);
    
    let yPosition = 20;
    
    // Add logo if available
    if (data.logoData) {
        try {
            doc.addImage(data.logoData, 'PNG', 15, yPosition, 30, 30);
        } catch (e) {
            console.error('Error adding logo:', e);
        }
    }
    
    // Header based on template style
    if (template.headerStyle === "centered") {
        doc.setFontSize(22);
        doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
        doc.setFont(undefined, 'bold');
        doc.text(data.stationName, 105, yPosition + 10, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
        doc.setFont(undefined, 'normal');
        const addressLines = doc.splitTextToSize(data.stationAddress, 120);
        doc.text(addressLines, 105, yPosition + 20, { align: 'center' });
        yPosition += 30 + (addressLines.length * 5);
    } else if (template.headerStyle === "leftAligned") {
        doc.setFontSize(22);
        doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
        doc.setFont(undefined, 'bold');
        doc.text(data.stationName, data.logoData ? 50 : 15, yPosition + 10);
        
        doc.setFontSize(10);
        doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
        doc.setFont(undefined, 'normal');
        const addressLines = doc.splitTextToSize(data.stationAddress, 140);
        doc.text(addressLines, data.logoData ? 50 : 15, yPosition + 20);
        yPosition += 35 + (addressLines.length * 5);
    } else if (template.headerStyle === "rightAligned") {
        doc.setFontSize(22);
        doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
        doc.setFont(undefined, 'bold');
        doc.text(data.stationName, 195, yPosition + 10, { align: 'right' });
        
        doc.setFontSize(10);
        doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
        doc.setFont(undefined, 'normal');
        const addressLines = doc.splitTextToSize(data.stationAddress, 120);
        doc.text(addressLines, 195, yPosition + 20, { align: 'right' });
        yPosition += 30 + (addressLines.length * 5);
    }
    
    // Divider line
    doc.setDrawColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition, 195, yPosition);
    yPosition += 10;
    
    // Invoice details
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.text('FUEL BILL', 15, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
    doc.setFont(undefined, 'normal');
    doc.text(`Receipt No: ${data.invoiceNumber}`, 15, yPosition);
    doc.text(`Date: ${data.date}`, 120, yPosition);
    yPosition += 7;
    doc.text(`Time: ${data.time}`, 120, yPosition);
    yPosition += 10;
    
    // Table with fuel details
    const tableColumn = ["Product", "Rate/LTR", "Volume", "Amount"];
    const tableRows = [
        ["Fuel", `${data.currency} ${data.fuelRate}`, `${data.volume} L`, `${data.currency} ${data.totalAmount}`]
    ];
    
    // Apply table style based on template
    // jsPDF 2.5.1+ uses RGB arrays [r, g, b] format for fillColor
    let tableStyles = {
        headStyles: {
            fillColor: [primaryRGB.r, primaryRGB.g, primaryRGB.b],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 11
        },
        bodyStyles: {
            textColor: [textRGB.r, textRGB.g, textRGB.b],
            fontSize: 10
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { left: 15, right: 15 }
    };
    
    if (template.tableStyle === "striped") {
        // Use lighter shade of secondary color for striped rows
        tableStyles.alternateRowStyles.fillColor = [secondaryRGB.r, secondaryRGB.g, secondaryRGB.b];
    } else if (template.tableStyle === "minimal") {
        tableStyles.lineColor = [200, 200, 200];
        tableStyles.lineWidth = 0.1;
    } else if (template.tableStyle === "rounded") {
        tableStyles.lineColor = [primaryRGB.r, primaryRGB.g, primaryRGB.b];
        tableStyles.lineWidth = 0.3;
    }
    
    doc.autoTable({
        startY: yPosition,
        head: [tableColumn],
        body: tableRows,
        ...tableStyles
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Customer details
    doc.setDrawColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.line(15, yPosition, 195, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.text('Customer Details:', 15, yPosition);
    yPosition += 7;
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
    doc.text(`Vehicle Type: ${data.vehicleType}`, 15, yPosition);
    doc.text(`Payment: ${data.paymentMethod}`, 120, yPosition);
    yPosition += 7;
    doc.text(`Vehicle No: ${data.vehicleNumber}`, 15, yPosition);
    yPosition += 7;
    doc.text(`Customer: ${data.customerName}`, 15, yPosition);
    yPosition += 7;
    
    // Tax information if provided
    if (data.taxOption && data.taxOption !== 'None' && data.taxNumber) {
        doc.text(`${data.taxOption}: ${data.taxNumber}`, 15, yPosition);
        yPosition += 7;
    }
    
    // Footer
    yPosition += 5;
    doc.setDrawColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition, 195, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.text('Thank you for your business!', 105, yPosition, { align: 'center' });
    yPosition += 7;
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
    doc.text('Please visit again', 105, yPosition, { align: 'center' });
    
    return doc;
}

// Function to generate receipt-style PDF
function generateReceiptStylePDF(template, data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set monospace font (courier)
    doc.setFont("courier");
    
    const centerX = 105; // Center of page
    let yPosition = 20;
    
    // Welcome header
    doc.setFontSize(12);
    doc.setFont("courier", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text('WELCOME!!!', 105, yPosition, { align: 'center' });
    yPosition += 8;
    
    // Transaction number
    doc.setFontSize(9);
    doc.setFont("courier", 'normal');
    const txnNo = data.taxOption === 'TXN NO' && data.taxNumber ? data.taxNumber : data.invoiceNumber;
    doc.text(`TXN NO: ${txnNo}`, 105, yPosition, { align: 'center' });
    yPosition += 7;
    
    // Station name (uppercase and centered)
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    const stationLines = doc.splitTextToSize(data.stationName.toUpperCase(), 75);
    stationLines.forEach(line => {
        doc.text(line, 105, yPosition, { align: 'center' });
        yPosition += 5;
    });
    
    // Station address
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    const addressLines = doc.splitTextToSize(data.stationAddress.toUpperCase(), 70);
    addressLines.forEach(line => {
        doc.text(line, 105, yPosition, { align: 'center' });
        yPosition += 4;
    });
    
    // Contact number if provided
    if (data.contactNumber) {
        yPosition += 2;
        doc.text(data.contactNumber, 105, yPosition, { align: 'center' });
        yPosition += 5;
    }
    
    // Empty line
    yPosition += 3;
    
    // Receipt number
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.text(`Receipt No.: ${data.receiptNumber || data.invoiceNumber}`, 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Dashed line
    doc.text('- - - - - - - - - - - - - - - - - - - - - - - - - - - -', 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Product details
    const productType = data.productType || 'Petrol';
    doc.text(`PRODUCT: ${productType}     RATE/LTR: ${data.currency} ${data.fuelRate}`, 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text(`AMOUNT: ${data.currency} ${data.totalAmount}`, 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text(`VOLUME(LTR.): ${data.volume} lt`, 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Dashed line
    doc.text('- - - - - - - - - - - - - - - - - - - - - - - - - - - -', 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Vehicle details
    doc.text(`VEH TYPE: ${data.vehicleType}`, 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text(`VEH NO: ${data.vehicleNumber}`, 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text(`CUSTOMER NAME: ${data.customerName.toUpperCase()}`, 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Dashed line
    doc.text('- - - - - - - - - - - - - - - - - - - - - - - - - - - -', 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Date and time
    const receiptDate = data.receiptDate || data.date;
    const receiptTime = data.receiptTime || data.time;
    doc.text(`Date: ${receiptDate}      Time: ${receiptTime}`, 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Dashed line
    doc.text('- - - - - - - - - - - - - - - - - - - - - - - - - - - -', 105, yPosition, { align: 'center' });
    yPosition += 6;
    
    // Payment mode
    doc.text(`MODE: ${data.paymentMethod}`, 105, yPosition, { align: 'center' });
    yPosition += 8;
    
    // Footer message
    doc.setFontSize(8);
    const footerLines = [
        'SAVE FUEL YAANI SAVE MONEY',
        '!! THANKS FOR FUELLING WITH US. YOU CAN NOW',
        '   CALL US ON 603353 (TOLL-FREE) FOR QUERIES/',
        '                  COMPLAINTS.'
    ];
    
    footerLines.forEach(line => {
        doc.text(line, 105, yPosition, { align: 'center' });
        yPosition += 4;
    });
    
    return doc;
}

// Utility function to convert hex to RGB
function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') {
        return { r: 0, g: 0, b: 0 };
    }
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

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

// Function to generate PDF with template styling
function generatePDFWithTemplate(templateId, data) {
    const template = getTemplateConfig(templateId);
    const { jsPDF } = window.jspdf;
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
        tableStyles.alternateRowStyles.fillColor = [secondaryRGB.r, secondaryRGB.g, secondaryRGB.b, 10];
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

// Utility function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

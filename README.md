# Fuel Bill Generator

A complete, professional web application for generating fuel bills with customizable templates, real-time preview, and watermark-free PDF export.

## Features

### 🎨 Template Selection
- Choose from 4 beautifully designed bill templates
- Real-time preview updates when switching templates
- Each template has unique color schemes and layouts

### ⛽ Fuel Station Details
- Station name and address
- Multiple payment method options
- Auto-generated invoice numbers
- Flexible tax options (None, CST TIN, GST TIN, TXN NO)

### 💰 Payment Details
- Multi-currency support (₹, $, €, £, ¥)
- Fuel rate per liter
- Total amount calculation
- Automatic volume calculation
- Date and time picker with current date/time defaults

### 👤 Customer Details
- Customer name
- Vehicle number
- Vehicle type selection (Two Wheeler, Car, SUV, Truck, Bus)

### 🖼️ Logo Management
- Three logo source options:
  - **URL**: Enter any image URL
  - **Upload**: Upload logo from your device
  - **Gallery**: Choose from pre-designed logos
- Logo authorization checkbox for compliance

### 📄 File Management
- Custom PDF filename
- Automatic .pdf extension handling
- Clean, watermark-free PDF generation

### 👁️ Live Preview
- Real-time preview of the bill
- Updates instantly as you type
- Shows exactly how the PDF will look
- Template-specific styling

## Installation

No installation required! This is a standalone web application that runs entirely in your browser.

### Option 1: Direct Use
1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start generating bills!

### Option 2: Local Server (Optional)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Then open http://localhost:8000 in your browser
```

## Usage

### Basic Workflow

1. **Select Template**
   - Choose one of the 4 available templates
   - Preview updates automatically

2. **Enter Fuel Station Details**
   - Fill in station name and address
   - Select payment method
   - Enter invoice number (or use auto-generated)
   - Choose tax option if applicable

3. **Enter Payment Details**
   - Select currency
   - Enter fuel rate per liter
   - Enter total amount
   - Set date and time (defaults to current)

4. **Enter Customer Details**
   - Customer name
   - Vehicle number
   - Vehicle type

5. **Add Logo (Optional)**
   - Choose logo source (URL, Upload, or Gallery)
   - Check the authorization checkbox

6. **Set Filename**
   - Enter desired PDF filename
   - Default is "fuel-bill"

7. **Generate PDF**
   - Click "Generate Bill PDF"
   - PDF downloads automatically with NO watermarks

### Tips

- **Volume Calculation**: Volume is automatically calculated as Total Amount ÷ Fuel Rate
- **Invoice Numbers**: Use format like "INV-001" for sequential invoicing
- **Date Format**: Use the date picker for consistent formatting
- **Logo Authorization**: Must be checked before generating PDF
- **Preview**: Monitor the live preview to ensure all details are correct

## Browser Compatibility

### Fully Supported
- ✅ Chrome/Edge (version 90+)
- ✅ Firefox (version 88+)
- ✅ Safari (version 14+)
- ✅ Opera (version 76+)

### Requirements
- Modern browser with ES6 support
- JavaScript enabled
- Internet connection (for jsPDF CDN) or local jsPDF files

## File Structure

```
Bill-Generator/
├── index.html          # Main HTML file with form and preview
├── css/
│   └── styles.css      # All styling (responsive, modern design)
├── js/
│   ├── script.js       # Main application logic and event handlers
│   └── templates.js    # Bill template designs and PDF generation
└── README.md           # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern form elements
- **CSS3**: Flexbox, Grid, Gradients, Responsive design
- **JavaScript (ES6+)**: Modern vanilla JavaScript
- **jsPDF**: PDF generation library (v2.5.1)
- **jsPDF-AutoTable**: Table plugin for jsPDF (v3.5.31)

### Key Features
- **No Framework Dependencies**: Pure vanilla JavaScript
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live preview using event listeners
- **Form Validation**: Comprehensive validation before PDF generation
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper labels and semantic HTML

### PDF Generation
- Uses jsPDF library via CDN
- No watermarks (critical requirement met)
- High-quality output matching preview
- Custom fonts and colors per template
- Professional table formatting

## Customization

### Adding New Templates

Edit `js/templates.js`:

```javascript
billTemplates.template5 = {
    name: "Your Template Name",
    colors: {
        primary: "#your-color",
        secondary: "#your-color",
        text: "#your-color",
        lightBg: "#your-color"
    },
    headerStyle: "centered", // or "leftAligned", "rightAligned"
    tableStyle: "bordered"   // or "striped", "minimal", "rounded"
};
```

Then add a radio button in `index.html`:
```html
<label class="radio-label">
    <input type="radio" name="template" value="template5">
    <span>Template 5</span>
</label>
```

### Adding Currency Options

Edit the currency dropdown in `index.html`:
```html
<option value="฿">Thai Baht - ฿</option>
```

### Adding Vehicle Types

Edit the vehicle type dropdown in `index.html`:
```html
<option value="Van">Van</option>
```

## Troubleshooting

### PDF Not Generating
- Check that all required fields are filled
- Ensure logo authorization checkbox is checked
- Check browser console for errors
- Verify internet connection (for CDN access)

### Logo Not Showing
- For URLs: Ensure the URL is accessible and CORS-enabled
- For uploads: Check file size (keep under 5MB)
- For gallery: Click to select a logo option

### Preview Not Updating
- Refresh the page
- Check that JavaScript is enabled
- Clear browser cache

### Styling Issues
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check that CSS file is loading properly
- Verify browser compatibility

## Contributing

Contributions are welcome! Areas for improvement:
- Additional bill templates
- More currency options
- Print functionality
- Save draft feature
- Bulk bill generation
- More logo gallery options

## License

This project is open source and available for personal and commercial use.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

## Credits

- Built with vanilla JavaScript for maximum compatibility
- PDF generation powered by jsPDF
- Icons and design inspired by modern web standards

---

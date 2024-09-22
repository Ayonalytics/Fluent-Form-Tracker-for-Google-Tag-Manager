
# Fluent Form Tracker for Google Tag Manager

Fluent Form Tracker is a JavaScript solution designed to work seamlessly with Google Tag Manager (GTM) to track user interactions, form submissions, and abandonment on Fluent Forms. This script enables advanced tracking and data layer pushes for both successful form submissions and form abandonment.

## 🚀 Features

- **Track Form Submissions**: Automatically track form submissions with detailed field data.
- **Abandonment Detection**: Capture when a user abandons a form, including which fields were filled and which were left empty.
- **Sensitive Field Masking**: Protect sensitive data such as emails and phone numbers by masking them before they are pushed to the data layer.
- **Custom Event Pushing**: Push events like `fluent_form_submit` and `fluent_form_abandoned` to your Google Tag Manager for better form analytics.

## 📦 Installation

1. **Add Script to Google Tag Manager:**
   - In GTM, create a new Custom HTML tag.
   - Copy and paste the script from [fluent-form-tracker.js](https://github.com/your-repo/fluent-form-tracker.js) into the Custom HTML tag.
   - Set the trigger to fire on pages containing Fluent Forms.
   
2. **Customize for Your Use Case:**
   - Modify sensitive field names in the script if needed (default sensitive fields: `email`, `phone`, `contact`).
   
3. **Publish and Test:**
   - Preview your GTM changes to test tracking functionality.
   - Ensure form submission and abandonment events are being pushed correctly to the data layer.

## 🔥 Usage

### Events Tracked:
- **fluent_form_submit**: Fired when a form is successfully submitted, with field data pushed to the data layer.
- **fluent_form_abandoned**: Fired when a user leaves the page without submitting the form, tracking filled and unfilled fields.

### Example Data Layer Push:

```json
{
  "event": "fluent_form_submit",
  "form_id": "1",
  "inputs": {
    "names_first_name": "John",
    "names_last_name": "Doe",
    "email": "[SENSITIVE]",
    "message": "Hello, this is a test."
  }
}
```

```json
{
  "event": "fluent_form_abandoned",
  "form_id": "1",
  "filled_fields": ["names_first_name", "names_last_name"],
  "abandoned_fields": ["email", "message"]
}
```

## 💡 Customization

You can easily customize the following:
- **Sensitive Fields**: Modify the sensitive field list to match the fields you want to mask (e.g., email, phone, etc.).
- **Field Handling**: Track additional input types or custom Fluent Form fields by adding their names to the script.

## 🛠️ Contributing

Contributions are welcome! Feel free to fork the repository, open an issue, or submit a pull request with improvements.

## 💬 Support

If you encounter any issues or have any questions, please open a GitHub issue or [contact me](mailto:your-email@example.com).

---

> If you find this tool helpful, consider [buying me a coffee](https://your-donation-link.com)!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

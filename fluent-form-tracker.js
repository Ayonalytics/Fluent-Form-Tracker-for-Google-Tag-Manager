<script>
(function($) {
    var formId = document.querySelector('form.frm-fluent-form').getAttribute('data-form_id');  // Dynamically get form_id
    var formFieldsFilled = {}; // Track fields that have been filled
    var allFields = []; // Track all form fields
    var isFormSubmitted = false; // Flag to check if the form is submitted
    var sensitiveFieldNames = ['email', 'phone', 'mobile', 'contact', 'telephone'];
    
    // List of system or hidden fields that should be ignored
    var ignoredFields = [
        '__fluent_form_embded_post_id', 
        '_fluentform_1_fluentformnonce', 
        '_wp_http_referer'
    ];

    // Function to hash sensitive field values (SHA-256 hashing)
    function hashValue(value, callback) {
        crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)).then(function(hashBuffer) {
            var hashArray = Array.from(new Uint8Array(hashBuffer));
            var hashHex = hashArray.map(function(b) {
                return b.toString(16).padStart(2, '0');
            }).join('');
            callback(hashHex);
        });
    }

    // Function to check if a field is sensitive based on name or value pattern
    function isSensitiveField(fieldName, fieldValue) {
        var lowerCaseName = fieldName.toLowerCase();
        var isNameSensitive = sensitiveFieldNames.some(function(name) {
            return lowerCaseName.indexOf(name) !== -1;
        });

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email pattern
        var phonePattern = /^\+?[0-9\s-]{7,15}$/;         // Basic phone number pattern

        return isNameSensitive || emailPattern.test(fieldValue) || phonePattern.test(fieldValue);
    }

    // Helper function to format field names properly (removing trailing underscores)
    function formatFieldName(fieldName) {
        return fieldName.replace(/[\[\]]/g, '_').replace(/_+$/, '').toLowerCase();
    }

    // Track all form fields and blur events to push filled field data to the dataLayer
    $('form.frm-fluent-form').find('input, textarea, select').each(function() {
        var fieldName = this.name;
        allFields.push(fieldName); // Store all field names

        $(this).on('blur', function() {
            var fieldValue = $(this).val();
            if (fieldValue) {
                var formattedFieldName = formatFieldName(fieldName); // Format the field name properly

                if (isSensitiveField(fieldName, fieldValue)) {
                    hashValue(fieldValue, function(hashedValue) {
                        formFieldsFilled[formattedFieldName] = hashedValue;
                    });
                } else {
                    formFieldsFilled[formattedFieldName] = fieldValue;
                }
            }
        });
    });

    // Track form submission success
    $('form.frm-fluent-form').on('fluentform_submission_success', function() {
        isFormSubmitted = true;
        var formData = new FormData(this);
        var inputValues = {};

        formData.forEach(function(value, key) {
            var keyFormatted = formatFieldName(key); // Format the field name properly
            if (isSensitiveField(key, value)) {
                hashValue(value, function(hashedValue) {
                    inputValues[keyFormatted] = hashedValue;
                });
            } else {
                inputValues[keyFormatted] = value;
            }
        });

        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            event: 'fluent_form_submit',
            form_id: formId,
            inputs: inputValues
        });
    });

    // Detect form abandonment when the user attempts to leave the page
    $(window).on('beforeunload', function(e) {
        if (!isFormSubmitted) {
            var abandonedFields = []; // Fields not filled
            
            allFields.forEach(function(fieldName) {
                var formattedFieldName = formatFieldName(fieldName);
                
                // Only include user-facing fields and skip ignored fields
                if (!formFieldsFilled[formattedFieldName] && !ignoredFields.includes(formattedFieldName)) {
                    abandonedFields.push(formattedFieldName); // Store only the field name
                }
            });

            window.dataLayer = window.dataLayer || [];
            dataLayer.push({
                event: 'fluent_form_abandoned',
                form_id: formId,
                filled_fields: formFieldsFilled,
                abandoned_fields: abandonedFields.join(', ') // Concatenating field names
            });

            // Prevent form abandonment action for a few milliseconds to allow the event to fire
            var confirmationMessage = "You have unsaved changes.";
            (e || window.event).returnValue = confirmationMessage; // Legacy for IE
            return confirmationMessage;
        }
    });
})(jQuery);
</script>

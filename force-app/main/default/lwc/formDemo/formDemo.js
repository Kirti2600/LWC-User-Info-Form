import { LightningElement, track } from 'lwc';
import getCurrentUser from '@salesforce/apex/FormController.getCurrentUser';
import saveFormData from '@salesforce/apex/FormController.saveFormData';

export default class FormComponent extends LightningElement {
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track address = '';
    @track phone = '';
    @track currentUserName = '';  // Stores current user name
    @track errorMessage = '';     // To show validation or Apex error messages
    @track hasUserError = false;  // To track if there's an issue with getting current user

    // Call this method in connectedCallback to get the current user when the component loads
    connectedCallback() {
        this.getCurrentUserName();  
    }

    // Imperative method to get current user name
    getCurrentUserName() {
        getCurrentUser()
            .then((result) => {
                this.currentUserName = result;   // Fetch user name successfully
                this.hasUserError = false;       // Reset any previous errors
            })
            .catch((error) => {
                this.hasUserError = true;        // Set error state
                this.errorMessage = 'Error fetching user information. Please refresh the page.';
                console.error('Error fetching current user:', error);  // Log the error
            });
    }

    // Handle input changes for the form fields
    handleInputChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        } else if (field === 'email') {
            this.email = event.target.value;
        } else if (field === 'address') {
            this.address = event.target.value;
        } else if (field === 'phone') {
            this.phone = event.target.value;
        }
    }

    // Handle form submission
    handleSubmit(event) {
        event.preventDefault();
        this.errorMessage = '';  // Reset error message before submission

        // Validation using regex for email and phone
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{10}$/; // 10 digits for India

        // Basic validation check if any field is empty
        if (!this.firstName || !this.lastName || !this.email || !this.address || !this.phone) {
            this.errorMessage = 'All fields are required.';
            return;
        }

        // Validation for email and phone using regex
        if (!emailRegex.test(this.email)) {
            this.errorMessage = 'Please enter a valid email address.';
            return;
        }
        if (!phoneRegex.test(this.phone)) {
            this.errorMessage = 'Phone number must be 10 digits.';
            return;
        }

        // Check if there's an issue with fetching the current user name
        if (this.hasUserError || !this.currentUserName) {
            this.errorMessage = 'User information is missing. Please refresh the page and try again.';
            return;
        }

        // Prepare the data to be sent to the Apex method
        const formData = {
            First_Name__c: this.firstName,
            Last_Name__c: this.lastName,
            Email__c: this.email,
            Address__c: this.address,
            Phone__c: this.phone,
            Submitted_By__c: this.currentUserName
        };

        // Imperative Apex call to save form data
        saveFormData({ formData })
            .then(() => {
                // On success, navigate to the data table
                this.dispatchEvent(new CustomEvent('navigate', {
                    detail: { url: '/YOUR_DATATABLE_URL' }
                }));
            })
            .catch((error) => {
                console.error('Error saving form data:', error);
                this.errorMessage = 'An error occurred while saving data. Please try again.';
            });
    }
}

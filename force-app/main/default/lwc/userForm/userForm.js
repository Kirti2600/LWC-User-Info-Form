import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveFormData from '@salesforce/apex/FormSubmissionController.saveFormData';
import getFormData from '@salesforce/apex/FormSubmissionController.getFormData';
import getCurrentUser from '@salesforce/apex/FormSubmissionController.getCurrentUser';



export default class YourComponent extends LightningElement {
    @track submissions = [];
    @track currentUserName; // Make sure this matches what you want to use.

    // Form field values
    firstName = '';
    lastName = '';
    email = '';
    address = '';
    phone = '';

    // Table columns
    columns = [
        { label: 'First Name', fieldName: 'First_Name__c' },
        { label: 'Last Name', fieldName: 'Last_Name__c' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Address', fieldName: 'Address__c' },
        { label: 'Phone', fieldName: 'Phone__c' },
        { label: 'Submitted By', fieldName: 'Submitted_By__c' }
    ];

    connectedCallback() {
        this.loadCurrentUser();
        this.loadSubmissions();
    }

    loadCurrentUser() {
        getCurrentUser()
            .then((data) => {
                this.currentUserName = data.Name; // Ensure this is set correctly.
            })
            .catch((error) => {
                console.error('Error fetching current user:', error);
            });
    }

    loadSubmissions() {
        getFormData({ type: 'ComponentA' }) // Change 'ComponentA' based on your needs
            .then((data) => {
                this.submissions = data;
            })
            .catch((error) => {
                console.error('Error fetching submissions:', error);
            });
    }

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

    validateInputs() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{10}$/;

        // Check if at least one field is filled
        if (!this.firstName && !this.lastName && !this.email && !this.address && !this.phone) {
            return { valid: false, message: 'At least one field must be filled.' };
        }

        // Validate email format if provided
        if (this.email && !emailRegex.test(this.email)) {
            return { valid: false, message: 'Invalid email format.' };
        }

        // Validate phone number if provided
        if (this.phone && !phoneRegex.test(this.phone)) {
            return { valid: false, message: 'Phone number must be 10 digits.' };
        }

        return { valid: true };
    }

    handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const validation = this.validateInputs();
        if (!validation.valid) {
            this.showToast('Error', validation.message, 'error');
            return;
        }

        const submission = {
            First_Name__c: this.firstName,
            Last_Name__c: this.lastName,
            Email__c: this.email,
            Address__c: this.address,
            Phone__c: this.phone,
            Submitted_By__c: this.currentUserName,
            Type__c: 'ComponentA' // Set type to differentiate submissions
        };

        saveFormData({ submission })
            .then(() => {
                this.loadSubmissions(); // Reload submissions
                this.clearForm(); // Clear the form after submission
                this.showToast('Success', 'Form submitted successfully!', 'success');
            })
            .catch(error => {
                console.error('Error saving submission:', error);
                this.showToast('Error', 'Error submitting form.', 'error');
            });
    }

    clearForm() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.address = '';
        this.phone = '';
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}

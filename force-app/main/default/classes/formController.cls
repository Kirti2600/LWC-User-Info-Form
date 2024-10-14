public with sharing class formController {
    
    // Method to get the current user's name
    @AuraEnabled(cacheable=true)
    public static String getCurrentUser() {
        return [SELECT Name FROM User WHERE Id = :UserInfo.getUserId()].Name;
    }

    // Method to save form data
    @AuraEnabled
    public static void saveFormData(Map<String, Object> formData) {
        Form_Submission__c submission = new Form_Submission__c();
        submission.First_Name__c = (String)formData.get('First_Name__c');
        submission.Last_Name__c = (String)formData.get('Last_Name__c');
        submission.Email__c = (String)formData.get('Email__c');
        submission.Address__c = (String)formData.get('Address__c');
        submission.Phone__c = (String)formData.get('Phone__c');
        submission.Submitted_By__c = (String)formData.get('Submitted_By__c');
        insert submission;
    }
}

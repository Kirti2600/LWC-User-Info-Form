public with sharing class FormSubmissionController {
    @AuraEnabled
    public static void saveFormData(Form_Submission__c submission) {
        insert submission;
    }

    @AuraEnabled(cacheable=true)
    public static List<Form_Submission__c> getFormData(String type) {
        return [
            SELECT First_Name__c, Last_Name__c, Email__c, Address__c, Phone__c, Submitted_By__c 
            FROM Form_Submission__c 
            WHERE Type__c = :type 
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static User getCurrentUser() {
        return [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
    }
}

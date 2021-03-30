public with sharing class AccountsDisplayController {
    
   // wrapper class 
    public class AccountWrapper{
        @AuraEnabled
        public String message;
        @AuraEnabled
        public List<Account> accountsList;
        @AuraEnabled
        public Boolean success;
    }
    
    //Return account records and message to be displayed in toast
    @AuraEnabled
    public static AccountWrapper getAccounts(){
        AccountWrapper accountWrapper = new AccountWrapper();
        try{
            accountWrapper.accountsList = [SELECT ID,Name,Phone,Website,AnnualRevenue,Account_Owner_Name__c
                                           FROM Account where industry = 'Financial Services'
                                           LIMIT 50000];
            //accountWrapper.message = 'Account records are retrieved ';
            accountWrapper.success = true;
        }
        catch(Exception e){
            accountWrapper.message = e.getMessage();
            accountWrapper.success = false;
        }
        return accountWrapper;
    }
    
    @AuraEnabled    
    public static boolean updateAccts( List < Account > updatedAccountList ) {    
        system.debug('Account value -->'+updatedAccountList);    
        try {            	
                update updatedAccountList;  
            	return true; 
        } catch(Exception e) {  
          
            return false;  
              
        }  
            
    }   
}
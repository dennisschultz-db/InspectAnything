public with sharing class SimpleLightningInspection {
	@remoteAction @AuraEnabled
    public static String describe(String objtype) {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return '[{"message":"The requested resource does not exist","errorCode":"NOT_FOUND"}]';
        }
        
        Schema.DescribeSObjectResult sobjResult = targetType.getDescribe();
        
        Map<String, Schema.SObjectField> fieldMap = sobjResult.fields.getMap();
        
        List<Object> fields = new List<Object>();
        for (String key : fieldMap.keySet()) {
            Schema.DescribeFieldResult descField = fieldMap.get(key).getDescribe();
            Map<String, Object> field = new Map<String, Object>();
            
            field.put('type', descField.getType().name().toLowerCase());
            field.put('name', descField.getName());
            field.put('label', descField.getLabel());
            
            //if a field is a picklist, I want the values
            if (field.get('type')=='picklist'){
                List<Schema.PicklistEntry> pickListValues = descField.getPickListValues();
                List<pickListValues> options = new List<picklistValues>();
                for (Schema.PicklistEntry plv : pickListValues) {
                    pickListValues pv = new pickListValues();
                    pv.label = plv.getLabel();
                    pv.value = plv.getValue();
                    options.add(pv);
                }
                field.put('picklistOptions', options);
            }
            
            List<String> references = new List<String>();
            for (Schema.sObjectType t : descField.getReferenceTo()) {
                references.add(t.getDescribe().getName());
            }
            if (!references.isEmpty()) {
                field.put('referenceTo', references);
            }
            
            fields.add(field);
        }
        
        Map<String, Object> result = new Map<String, Object>();
        result.put('fields', fields);
        
        map<string, string> objectProperties = new map<string, string>();
        objectProperties.put('pluralLabel', sobjResult.getLabelPlural());
        result.put('objectProperties', objectProperties);
        
        return JSON.serialize(result);
    }
    
    @AuraEnabled
	public static Inspection__c  getAssessment(id AssessmentId){
		return [select Name from Inspection__c  
		where Id =: AssessmentId]; 
	}

	@AuraEnabled
	public static List<Inspection__c> getAssessments(){
		return [select Name from Inspection__c 
		order by LastModifiedDate DESC Limit 100]; 
	}
	
	@AuraEnabled
	public static List<Inspection_Step__c> getQuestions(id AssessmentId){
		return [select Id, Inspection__r.Name, If_No_Instructions__c, Inspection__c, Name, 
                Category__c, Instructions__c, Step_Number__c , Rating__c, Comments__c,
                Response_Yes_No__c, Response_Acceptable__c, Response_Text__c, Record_Type_Response__c 
		from Inspection_Step__c 
		where Inspection__c  =: AssessmentId 
		order by Step_Number__c  ASC];
	}

	@AuraEnabled
	public static Inspection_Step__c updateResponse (id QuestionId, string responseField, string responseValue, string Comments){
		system.debug(QuestionId + ':' + responseValue);
		Inspection_Step__c q = [select Id, Rating__c, Comments__c from Inspection_Step__c where id=:QuestionId];
		q.Rating__c = responseValue;
		q.Comments__c = Comments;
		update q;
		return q;
	}
    
    @AuraEnabled 
    public static string updateAnyStringField (string recordId, string fieldToUpdate, string fieldValue){            
        Id rId = id.valueOf(recordId);
        sObject so = rid.getSObjectType().newSObject(rid);
        so.put(fieldToUpdate, fieldValue);
        update so;
        return JSON.serialize(so);
    }
    
    //lovingly lifted from ngforce
    public static Schema.DisplayType getFieldType(string objectName, string fieldname){
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objectName);
        Map<String, Schema.sObjectField> targetFields = targetType.getDescribe().fields.getMap();
        return targetFields.get(fieldname).getDescribe().getType();
    }
    
    public class picklistValues {
		String label {get; set;}
		String value {get; set;}
	}
    
    //not used
    /*@AuraEnabled
	public static task saveTask (task newAction){
		system.debug(newAction);
        insert newAction;
        return newAction;
	}
    
    @AuraEnabled
	public static task saveTaskFields (id questionId, string Subject, string dueDate){
		task t = new task();
        t.ActivityDate = date.valueof(dueDate);
        t.Subject = subject;
        t.WhatId = questionId;
        t.Status = 'Recommended';
        t.Priority = 'Normal';
        insert t;
        return t;
	}*/
    
}
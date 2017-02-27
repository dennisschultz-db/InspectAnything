public class LightningInspection {
    
    @AuraEnabled
    public static string query(String soql) {
        return JSON.serialize(Database.query(soql));
    }
    
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
		return [select Name from Inspection__c order by LastModifiedDate DESC Limit 100]; 
	}
	
	@AuraEnabled
	public static List<Inspection_Step__c> getQuestions(id AssessmentId){
        
		Schema.FieldSet fs2 = Schema.SObjectType.Inspection_Step__c.fieldSets.Response_Fields;
        
        string query = 'select Id, Inspection__r.Name, Inspection__c, Name, Category__c, Instructions__c, Step_Number__c , Comments__c, Response_Field__c';
        query += ', Green_Text__c, Yellow_Text__c, Red_Text__c';
        
        for(Schema.FieldSetMember f : fs2.getFields()) {
            query +=  ', ' + f.getFieldPath();
        }
        
        query += ' from Inspection_Step__c where Inspection__c  = \'' + AssessmentId + '\' order by Step_Number__c  ASC';
        system.debug(query);
        
        return database.query(query);
		
	}

	/*@AuraEnabled
	public static Inspection_Step__c updateResponse (id QuestionId, string responseField, string responseValue, string Comments){
		system.debug(QuestionId + ':' + responseValue);
		Inspection_Step__c q = [select Id, Rating__c, Comments__c from Inspection_Step__c where id=:QuestionId];
		q.Rating__c = responseValue;
		q.Comments__c = Comments;
		update q;
		return q;
	}*/
    
    @AuraEnabled 
    public static string updateAnyStringField (string recordId, string fieldToUpdate, string fieldValue){            
        Id rId = id.valueOf(recordId);
        sObject so = rid.getSObjectType().newSObject(rid);
        so.put(fieldToUpdate, fieldValue);
        update so;
        return JSON.serialize(so);
    }
    
    //status isn't used--it defaults
    /*
    @AuraEnabled
	public static string saveActionFields (string questionId, string inspectionId, string subject, string requestType ){
        Action__c a = new Action__c();
        a.Name = Subject;
        a.Work_Request_Type__c = requestType;
        a.Inspection_Step__c  = id.valueOf(questionId);
        a.Inspection__c = id.valueOf(inspectionId);
        
        try {
        	insert a;
        } catch(exception e){
            system.debug(e.getMessage());
        }
        return null;        
	}*/
    
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
    /*
    @AuraEnabled
    public static string reviewSteps(id inspectionId){
        list<Inspection_step__c> steps = [select Id, In_Review__c from Inspection_Step__c where Inspection__c =: inspectionId];
        for (Inspection_step__c step:steps){
            step.In_Review__c = true;
        }
        Database.SaveResult[] srList = Database.update(steps, false);
        List<DBResult> badStuff = new List<DBResult>();
        
        
        for (Integer i = 0; i < steps.size(); i++) {
            if (!srList[i].IsSuccess()){
                DBResult dbr = new DBResult();
                dbr.recordId = steps[i].Id;
                dbr.errors = srList[i].getErrors();
                badStuff.add(dbr);
            }
        }
        if (badStuff.size()>0){
            return JSON.serialize(badStuff);            
        }
        Inspection__c insp = [select Status__c from Inspection__c where id=:inspectionId];
        insp.Status__c = 'Review';
        update insp;
        return 'OK';
    }
    */
    
    /*public class DBResult {
        public id RecordId {get;set;}
        public list<Database.Error> errors {get;set;}        
    } */ 
    
    //not used
    /*@AuraEnabled
	public static task saveTask (task newAction){
		system.debug(newAction);
        insert newAction;
        return newAction;
	}*/
    
    @AuraEnabled
	public static task saveTaskFields (id questionId, id inspectionId, string subject){
		task t = new task();
        t.ActivityDate = system.today();
        t.Subject = subject;
        t.WhatId = questionId;
        t.Status = 'Recommended';
        t.Priority = 'Normal';
        insert t;
        
        return t;
	}
    
    
    //creates sample data
    public static void CreateExample(){
        Inspection__c i = new Inspection__c();
        i.recordTypeId = [select id from recordType where name = 'Template' and SobjectType = 'Inspection__c'][0].Id;
        i.Name = 'Dog Inspection';
        insert i;
        
        list<Inspection_Step__c> steps = new list<Inspection_Step__c>();
        
        Inspection_Step__c is0 = new Inspection_Step__c();
        is0.Instructions__c = 'What is the dog\'s name?';
        is0.RecordTypeId = [select id from RecordType where developername = 'Text_Response' and SobjectType = 'Inspection_Step__c'][0].Id;
        is0.Category__c  = 'Basic Info';
        is0.Inspection__c = I.Id;
        is0.Step_Number__c = 1;
        is0.Name = 'Dog Name';       
        
        steps.add(is0);
        
        Inspection_Step__c is1 = new Inspection_Step__c();
        is1.Instructions__c = 'On a scale from 1 to 5, where 5 is the most friendly, how friendly is the dog?';
        is1.RecordTypeId = [select id from RecordType where developername = 'x5_to_1' and SobjectType = 'Inspection_Step__c'][0].Id;
        is1.Category__c  = 'Basic Info';
        is1.Inspection__c = I.Id;
        is1.Green_Text__c = '4,5'; 
        is1.Yellow_Text__c = '2,3'; 
        is1.Red_Text__c = '1'; 
        is1.Step_Number__c = 2;
        is1.Name = 'Friendliness';       
        
        steps.add(is1);
        
        Inspection_Step__c is2 = new Inspection_Step__c();
        is2.Instructions__c = 'Do you see any fleas?';
        is2.RecordTypeId = [select id from RecordType where developername = 'Yes_No' and SobjectType = 'Inspection_Step__c'][0].Id;
        is2.Category__c  = 'Physical';
        is2.Inspection__c = I.Id;
        is2.Green_Text__c = 'No'; 
        is2.Red_Text__c = 'Yes'; 
        is2.Step_Number__c = 3;
        is2.Name = 'Fleas';
        
        steps.add(is2);
        
        Inspection_Step__c is3 = new Inspection_Step__c();
        is3.Instructions__c = 'Does the dog have a collar?';
        is3.RecordTypeId = [select id from RecordType where developername = 'Yes_No' and SobjectType = 'Inspection_Step__c'][0].Id;
        is3.Category__c  = 'Physical';
        is3.Inspection__c = I.Id;
        is3.Green_Text__c = 'Yes'; 
        is3.Red_Text__c = 'No'; 
        is3.Step_Number__c = 4;
        is3.Name = 'Collar';
        
        steps.add(is3);
        
        insert steps;
    }
    

	

}
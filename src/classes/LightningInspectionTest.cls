@isTest
public class LightningInspectionTest {

    @isTest
    private static void testCreateSampleData(){
        LightningInspection.CreateExample();
        //get the template, create an inspection to trigger the flow.
        inspection__c template = [select id from inspection__c];
        
        inspection__c cloned = new inspection__c();
        
        cloned.Template__c = template.Id;
        cloned.Name = 'Test';
        
        insert cloned;
    }
    
    @isTest private static void saveTask(){
//        	public static task saveTaskFields (id questionId, id inspectionId, string subject){

        LightningInspection.CreateExample();
        list<inspection_step__c> steps = [select Id, inspection__c from inspection_step__c];
        LightningInspection.saveTaskFields(steps[0].Id, steps[0].inspection__c, 'Test');
    }
    
    @isTest private static void testGets(){
        LightningInspection.CreateExample();
        inspection__c template = [select id from inspection__c];
        
        //public static Inspection__c  getAssessment(id AssessmentId){
        LightningInspection.getAssessment(template.Id);
        //public static List<Inspection__c> getAssessments(){
		LightningInspection.getAssessments();
        LightningInspection.getQuestions(template.Id);
    }
    
    @isTest private static void testFieldUpdates(){
        LightningInspection.CreateExample();
        Inspection__c template = [select id from inspection__c];
        //lightningInspection.updateAnyStringField(recordId, fieldToUpdate, fieldValue)
        LightningInspection.updateAnyField(template.Id, 'Name', 'Updated Name');
    }
    
    @isTest private static void testDescribe(){
        LightningInspection.describe('Inspection__c');
    }
    
    @isTest private static void testDescribeError(){
        LightningInspection.describe('if_your_object_is_named_this_you_suck__g');
    }
    
    @isTest private static void testQuery(){
        LightningInspection.CreateExample();
        LightningInspection.query('Select Id from Inspection__c');
    }
    
    @isTest private static void testFieldDescribe(){
        //    public static Schema.DisplayType getFieldType(string objectName, string fieldname){

        LightningInspection.getFieldType('Inspection_Step__c', 'Category__c');
    }
}
({
	doInit : function(component, event, helper) {
        if (component.get("v.AssessmentId")){
            helper.getQuestions(component);
        } else {
            helper.getAssessments(component);
            component.set("v.showAssessmentList", true);
        }
        //helper.getDescribe(component, "Action__c", "actionDescribe");
        helper.getDescribe(component, "Inspection_Step__c", "questionDescribe");

    },
    
    showAssessmentList: function(component){
 		component.set("v.showAssessmentList", true);   
	},
    
    changeAssessment: function(component, event, helper) {
       console.log('assessment changed');
       component.set("v.showAssessmentList", false);
       component.set("v.AssessmentId", event.getParam("id"));    	
       //component.set("v.AssessmentId", event.getParam.value);    	
        helper.getQuestions(component);    
    },
    
    handleQuestionUpdate : function (component, event, helper){
        console.log('heard an event');
        helper.updateCounts(component);
    },

    handleSaveSuccess : function (component, event, helper){
        
    }
    
})
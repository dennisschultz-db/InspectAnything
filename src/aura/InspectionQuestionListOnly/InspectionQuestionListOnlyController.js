({
    doInit : function(component, event, helper) {
        if (component.get("v.AssessmentId")){
            helper.getQuestions(component);
        } 
        helper.getDescribe(component, "task", "actionDescribe");
        helper.getDescribe(component, "Inspection_Step__c", "questionDescribe");        
    },
    
    //sends a null back to the parent component, who then would render the inspection list again
    showAssessmentList: function(component){
        var selectedEvent2 = $A.get("e.ltng:selectSObject");
        selectedEvent2.setParams({
            "recordId" : null
        });        
        selectedEvent2.fire();
    },
    
    selectCat : function (component, event){
        //console.log(event.target.id);
        if (component.get("v.selectedCat")===event.target.id){
            component.set("v.selectedCat", "empty");
        } else {
            component.set("v.selectedCat", event.target.id);    	            
        }
    },
    
    handleQuestionUpdate : function (component, event, helper){
        //console.log('heard an event');
        helper.updateCounts(component);
    },
    
    /*viewReport : function (component){
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.AssessmentId"),
            "slideDevName": "chatter"
        });
        navEvt.fire();
    },*/
    
    
    nav: function (component){
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.AssessmentId")
        });
        navEvt.fire();
    },
    
    //purpose of review is to allow admin-defined validation rules on the questions 
    //ex use case: conditional field requiredness, "not acceptable requires comments".
    //clicking review will provide a message.  customize it in the code below.
    /*review : function (component){
        console.log("review clicked");
        var action = component.get("c.reviewSteps");
        action.setParams({
            "inspectionId" : component.get("v.AssessmentId"),            
        });
        action.setCallback(this, function (a){
            var response = _.unescape(a.getReturnValue());
            console.log(response);
            if (response === "OK"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Done!",
                    "message": "Inspection is now in Review.  Click the View Report button and view the created document.",
                    "type": "success"
                });
                toastEvent.fire();
                component.set("v.reviewComplete", true);
            } else {
                var response = JSON.parse(response)
                console.log(response);
                _.forEach(response, function (record){
                    var questionNumber = _.find(component.get("v.questions"), { 'Id': record.RecordId}).Step_Number__c;
                    console.log("found question.  It's number " + questionNumber);
                    
                    _.forEach(record.errors, function (error){                        
                        var toastEvent = $A.get("e.force:showToast");
                        var title = "Error on Question " + questionNumber;
                        if (component.get("v.groupByCategory")){
                            title = title + " (" + _.find(component.get("v.questions"), { 'Id': record.RecordId}).Category__c + ")";
                        }
                        toastEvent.setParams({
                            "title": title,
                            "message": error.message,
                            "type": "error"                                
                        });
                        //show category to make life easier, if category view is on :)
                        
                        toastEvent.fire();
                    }); //end error loop                    
                });//end record loop
            }
        });
        $A.enqueueAction(action);
        
    }*/
    
})
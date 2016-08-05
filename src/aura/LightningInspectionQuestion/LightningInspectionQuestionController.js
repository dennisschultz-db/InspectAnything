({
    doInit : function(component, event, helper) {
        helper.setButtons(component);
        //sets the field describe for work order types
        //component.set("v.actionFieldDescribe", _.find(component.get("v.actionDescribe").fields,  { "name": "Work_Request_Type__c"}));
        
        helper.setPanelStyle(component);
        //component.set("v.newAction", {});
    },
    
    setResponse: function (component, event, helper){
        var response = event.target.title //just an internal variable shorthand        
        //console.log("set response : " + response);
        
        var field = component.get("v.question.Record_Type_Response__c")
        
        //public static string updateAnyStringField (string recordId, string fieldToUpdate, string fieldValue){            
        var action = component.get("c.updateAnyStringField");
        action.setParams({
            "recordId" : component.get("v.question.Id"),
            "fieldToUpdate" : component.get("v.question.Record_Type_Response__c"),
            "fieldValue" : response
        });
        action.setCallback(this, function (a){
            console.log(a);    

        });
        $A.enqueueAction(action);
        
        component.set("v.question." + field, response);
        component.set("v.response", response)
        helper.setPanelStyle(component);
        
        var evt = $A.get("e.c:InspectionEvent");
        evt.setParams({
            "eventType": "Response"
        });
        evt.fire();  
    },
    
    setTextResponse: function (component){
        var action = component.get("c.updateAnyStringField");
        action.setParams({
            "recordId" : component.get("v.question.Id"),
            "fieldToUpdate" : component.get("v.question.Record_Type_Response__c"),
            "fieldValue" : component.get("v.question.Response_Text__c")
        });
        action.setCallback(this, function (a){
            console.log(a.getReturnValue());                      
        });
        $A.enqueueAction(action);
    },
    
    setComment: function (component){
        var action = component.get("c.updateAnyStringField");
        action.setParams({
            "recordId" : component.get("v.question.Id"),
            "fieldToUpdate" : "Comments__c",
            "fieldValue" : component.get("v.question.Comments__c")
        });
        action.setCallback(this, function (a){
            console.log(a.getReturnValue());                      
        });
        $A.enqueueAction(action);
    },
    
    // showAction: function (component){
    //     component.set("v.action", true);
    // },
    
    // cancelAction: function (component){
    //     component.set("v.action", false);        
    // },
    
    // saveAction: function (component){                
    //     var action = component.get("c.saveActionFields");
        
    //     action.setParams({
    //         "questionId" : component.get("v.question.Id"),
    //         "inspectionId" : component.get("v.question.Inspection__c"),
    //         "subject" : component.get("v.newAction.Subject__c"),
    //         "requestType" : component.get("v.newAction.Work_Request_Type__c")
    //     });
    //     action.setCallback(this, function (a){
    //         console.log(a);
    //         component.set("v.action", false);
    //         component.set("v.newAction", {});            
    //     });
    //     $A.enqueueAction(action);
    // },
    
    navFeed: function (component){
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.question.Id"),
            "slideDevName": "chatter"
        });
        navEvt.fire();
    }
    
})
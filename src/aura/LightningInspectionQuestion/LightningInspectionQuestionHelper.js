({    
    
    setButtons : function(component){
        var questionDescribe = component.get("v.questionDescribe");

        //get the index of the matching field
        var fieldIndex = _.findIndex(questionDescribe.fields, {'name': component.get("v.question.Record_Type_Response__c")}); 
        //what type of field are we dealing with?
        component.set("v.fieldType", questionDescribe.fields[fieldIndex].type);
        
        if (questionDescribe.fields[fieldIndex].type==='picklist'){
        	var picklistOptions = questionDescribe.fields[fieldIndex].picklistOptions;
        	component.set("v.buttonList", picklistOptions);    
            component.set("v.response", component.get("v.question." + component.get("v.question.Record_Type_Response__c")));
        }
    },
    
    
    setPanelStyle: function (component){
        if (component.get("v.fieldType")!="picklist"){
            component.set("v.panelStyle", "slds-card__header slds-theme--inverse");
            return;            
        } 
        
        var field = component.get("v.question.Record_Type_Response__c");
        var response = component.get("v.question."+field);    
        var buttonList = component.get("v.buttonList");
        var fieldIndex = _.findIndex(buttonList, {'value': response});

        // assumptions
        //first [0] is good, second [1] is bad, third [2] is yellow.  All others are not colored :)        
        if (fieldIndex===0) {component.set("v.panelStyle", "slds-card__header slds-theme--success");}
        else if (fieldIndex===1) {component.set("v.panelStyle", "slds-card__header slds-theme--error");}
        else if (fieldIndex===2) {component.set("v.panelStyle",  "slds-card__header slds-theme--warning ");}
        else {component.set("v.panelStyle", "slds-card__header slds-theme--inverse");}
    }
})
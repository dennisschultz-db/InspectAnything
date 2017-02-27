({    
    setFieldAndUpdateLocalStuff : function (component, params){
    	var action = component.get("c.updateAnyField");
        action.setParams(params);
        action.setCallback(this, function (a){
            //TODO: handle errors/validations with a toast
            console.log(a);                
        });
        $A.enqueueAction(action);
        
        var question = component.get("v.question");
        question[params.fieldToUpdate] = params.fieldValue;
        component.set("v.question", question);        
        component.set("v.response", params.fieldValue);
        
        this.setPanelStyle(component);
        this.fireEvent();        
    },
    
    setButtons : function(component){
        
        var questionDescribe = component.get("v.questionDescribe");
        
        //get the index of the matching field
        var fieldIndex = _.findIndex(questionDescribe.fields, {'name': component.get("v.question.Response_Field__c")}); 
        console.debug('questiondescribe ' + questionDescribe);
        //what type of field are we dealing with?
        component.set("v.fieldType", questionDescribe.fields[fieldIndex].type);
        
        if (questionDescribe.fields[fieldIndex].type==='picklist'){
        	var picklistOptions = questionDescribe.fields[fieldIndex].picklistOptions;
        	component.set("v.buttonList", picklistOptions);    
        }
        // Moved outside the 'if' so it works for all fieldTypes
        component.set("v.response", component.get("v.question." + component.get("v.question.Response_Field__c")));
    },
    
    fireEvent:function (){
        var evt = $A.get("e.c:InspectionEvent");
        evt.setParams({
            "eventType" : "Response",            
        });
        evt.fire();
    },
    
    setPanelStyle: function (component){
        var question = component.get("v.question");        
        var response = component.get("v.response");
        
        if (question.Green_Text__c && question.Green_Text__c.includes(response)){
			component.set("v.panelStyle", "slds-card__header slds-theme--success")
        } else if (question.Yellow_Text__c && question.Yellow_Text__c.includes(response)){
            component.set("v.panelStyle", "slds-card__header slds-theme--warning")
        } else if (question.Red_Text__c && question.Red_Text__c.includes(response)){
            component.set("v.panelStyle", "slds-card__header slds-theme--error")            
        } 
    }
})
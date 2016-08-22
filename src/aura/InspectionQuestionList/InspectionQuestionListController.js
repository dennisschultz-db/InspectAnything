({
    
    //handle events from the SoqlTable component
    changeAssessment: function(component, event, helper) {
        console.log('assessment changed');
        console.log('Id is now : ' + event.getParam("recordId"));
        console.log(event.getParams());
        //component.set("v.showAssessmentList", false);
        component.set("v.AssessmentId", event.getParam("recordId"));   
        //component.set("v.reviewComplete", false);
        //helper.getQuestions(component);    
    }
    
})
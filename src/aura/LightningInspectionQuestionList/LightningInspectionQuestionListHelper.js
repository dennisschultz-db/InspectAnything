({
getQuestions : function(component) {
	//get the questions
    var action = component.get("c.getQuestions"); //get from apex
    action.setParams({
        "AssessmentId" : component.get("v.AssessmentId")
    });
    action.setCallback(this, function (a){
        var questions = a.getReturnValue();
        console.log(questions);
        component.set("v.assessmentName", questions[0].Inspection__r.Name);     
        component.set("v.questions", questions);     
        this.updateCounts(component);

    });        
    $A.enqueueAction(action);
},

getDescribe:  function (component, objectName, whereToPut){
    var action = component.get("c.describe");
    action.setParams({"objtype": objectName});
    action.setCallback(this, function (a){
        console.log("describe for: " + objectName);
        console.log(JSON.parse(a.getReturnValue()));            
        component.set("v."+whereToPut, JSON.parse(a.getReturnValue()));
    });        
    $A.enqueueAction(action);            
},

getAssessments : function(component){
    //get the possible Assessments
    var action = component.get("c.getAssessments"); //get from apex
    action.setCallback(this, function (a){
        console.log(a.getReturnValue());            
        component.set("v.assessments", a.getReturnValue());
    });        
    $A.enqueueAction(action);
},
    
updateCounts : function(component){
    //has categories    
    var questions = component.get("v.questions");
    component.set("v.totalQuestions", questions.length);        
    component.set("v.doneQuestions", this.countDone(questions));             
},

//returns the non-null ratings
countDone : function(questions){    
	var doneCount = _.filter(questions, function (x){
        return x.Rating__c || x.Response_Yes_No__c || x.Response_Acceptable__c || x.Response_Text__c ;
    }).length;
    console.log("doneCount:"+ doneCount);
    return doneCount;
   
}

})
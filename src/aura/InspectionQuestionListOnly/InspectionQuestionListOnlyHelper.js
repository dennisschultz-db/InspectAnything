({
    getQuestions : function(component) {
        //get the questions
        var action = component.get("c.getQuestions"); //get from apex
        action.setParams({
            "AssessmentId" : component.get("v.AssessmentId")
        });
        console.log("inspection id is : " + component.get("v.AssessmentId"));
        action.setCallback(this, function (a){
            
            if (component.isValid()){                
                var questions = a.getReturnValue();
                console.log(questions);
                component.set("v.assessmentName", questions[0].Inspection__r.Name);     
                
                if (component.get("v.groupByCategory")){
                    var qByCat = [];
                    var uniqs = _.uniq(_.map(questions, "Category__c"));
                    for (var i = 0; i<uniqs.length; i++){
                        qByCat.push({ 
                            "Name" : uniqs[i], 
                            "Questions" : _.filter(questions, {"Category__c" : uniqs[i]}),
                            "doneQuestions" : 0,
                            "totalQuestions" : _.filter(questions, {"Category__c" : uniqs[i]}).length
                        });
                    }
                    //console.log(qByCat);
                    component.set("v.qByCat", qByCat);
                } 
                
                component.set("v.questions", questions);     
                this.updateCounts(component);
            } else {
                console.log("component wasn't valid, so question callback skipped.");
            }
            
        });        
        $A.enqueueAction(action);
    },
    
    getDescribe:  function (component, objectName, whereToPut){
        var action = component.get("c.describe");
        action.setParams({"objtype": objectName});
        action.setCallback(this, function (a){
            if (component.isValid()){
                //console.log("describe for: " + objectName);
                //console.log(JSON.parse(a.getReturnValue()));            
                component.set("v."+whereToPut, JSON.parse(a.getReturnValue()));                
            } else {
                console.log("component wasn't valid, so describe callback for "+objectName+" skipped.");
            }

        });        
        $A.enqueueAction(action);            
    },
    
    updateCounts : function(component){
        //console.log("counts updating");
        
        if (component.get("v.groupByCategory")){            
            //console.log('its categories!!')
            var qByCat = component.get("v.qByCat");
            var qByCatNew = [];
            //for each category 
            for (var i = 0; i<qByCat.length; i++){                
                qByCat[i].totalQuestions = qByCat[i].Questions.length;
                qByCat[i].doneQuestions = this.countDone(qByCat[i].Questions);
                //console.log(qByCat[i]);
                qByCatNew.push(qByCat[i]);
            }  
            component.set("v.qByCat", qByCatNew);
            //console.log(qByCatNew);
            
            //for the whole
            var allQ = _.flatten(_.map(qByCat, "Questions"));
            //console.log(allQ);
            component.set("v.totalQuestions", allQ.length);        
            component.set("v.doneQuestions", this.countDone(allQ));                    
        } else {
            //no categories
            var questions = component.get("v.questions");
            component.set("v.totalQuestions", questions.length);        
            component.set("v.doneQuestions", this.countDone(questions));  
        }               
    },
    
    //returns the non-null ratings
    countDone : function(questions){        
        var doneCount = _.filter(questions, function (x){
            //console.log("question name is " + x.Name);
            //console.log(x);
            //console.log(x[x.Response_Field__c]);            
            return (x[x.Response_Field__c]) ;
        }).length;
        //console.log("doneCount:"+ doneCount);
        return doneCount;
    }
    
})
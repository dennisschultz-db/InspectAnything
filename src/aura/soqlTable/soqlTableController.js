({
	doInit : function(component) {
		var soql = "select " + component.get("v.displayFields");
        soql = soql + " from " + component.get("v.objectType");
        console.log("soql where is " + component.get("v.soqlWhere"));
        if (component.get("v.soqlWhere")){
            soql = soql + " where " + component.get("v.soqlWhere");
        }
        
        //soql is done.
        console.log("soql is: " + soql)

        var params = {"soql" : soql};
        var action;
        
        if (component.get("v.onlyMine")){
            action = component.get("c.queryMine");
            console.log("querying my records");
        } else {
            action = component.get("c.query");            
            console.log("querying all records");
        }
       
        action.setParams(params);
        action.setCallback(self, function(a){
            var records = JSON.parse(a.getReturnValue());
            console.log("query results");	
            console.log(records);
            component.set("v.results", records);
            component.set("v.resultsBack", true);
        });
        $A.enqueueAction(action);      
	}
})
###Objects:

Inspection__c (a set of steps)
Inspection_Step__c (the step or question)

###Components
LightningInspectionQuestionList -- the main component that you'll interact with.  It contains/manages the following

* LightningDataTable : used to present a list of the inspections that you can select from
  * this contains SingleFieldDisplayer to dynamically display the various field types in the table
* LightningInspectionQuestion : the indiviudal question/step

###Events

* InspectionEvent : thrown by the Question, handled by the QuesitonList to let it recalculate the % complete

###Classes
LightningInspection -- apex backend for the components
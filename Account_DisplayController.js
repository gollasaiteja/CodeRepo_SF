({
  onInit: function(component, event, helper) {
     var rowActions = helper.getRowActions.bind(this, component),
         headerActions = [
                {
                    label: 'All',
                    checked: true,
                    name:'all'
                }
            ] 
      
    // Setting column information.To make a column sortable,set sortable as true on component load
    component.set("v.accountColumns", [
      {
        label: "Name",
        fieldName: "Name",
        type: "text",
        sortable: true,
        editable: true
      },
      {
        label: "Owner",
        fieldName: "Account_Owner_Name__c",
        type: "text",
        sortable: true        
      },
      {
        label: "Phone",
        fieldName: "Phone",
        type: "Phone",
        editable: true
      },
      {
        label: "Website",
        fieldName: "Website",
        type: "url",
        editable: true
      },
      {
        label: "AnnualRevenue",
        fieldName: "AnnualRevenue",
        type: "currency",
        editable: true
      },
      { type: 'action', typeAttributes: { rowActions: rowActions } }
    ]);
    // call helper function to fetch account data from apex
    helper.getAccountData(component);
  },

  //Method gets called by onsort action,
  handleSort: function(component, event, helper) {
    //Returns the field which has to be sorted
    var sortBy = event.getParam("fieldName");
    //returns the direction of sorting like asc or desc
    var sortDirection = event.getParam("sortDirection");
    //Set the sortBy and SortDirection attributes
    component.set("v.sortBy", sortBy);
    component.set("v.sortDirection", sortDirection);
    // call sortData helper function
    helper.sortData(component, sortBy, sortDirection);
  },

  handleSaveEdition: function(component, event, helper) {
    console.log("Inside the onsave ---");
    var draftValues = event.getParam("draftValues");
    console.log("Inside the onsave 1---"+draftValues);
    //var updatedRecords = component.find( "accountTable" ).get( "v.draftValues" );
    var action = component.get("c.updateAccts");
    action.setParams({
      updatedAccountList: draftValues
    });
    action.setCallback(this, function(response) {
      var state = response.getState();
      if (state === "SUCCESS") {
          console.log("===="+response.getReturnValue() );
        if (response.getReturnValue() === true) {
          helper.toastMsg("success", "Records Saved Successfully.");
          component.set('v.draftValues', []);
           $A.get('e.force:refreshView').fire();
        } else {
          helper.toastMsg(
            "error",
            "Something went wrong. Contact your system administrator."
          );
        }
      } else {
        helper.toastMsg(
          "error",
          "Something went wrong. Contact your system administrator 1."
        );
      }
    });
    $A.enqueueAction(action);
  },
  
  handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');

        switch (action.name) {
            case 'show_details':
                               
                helper.opentab(component, row);
                break;
            case 'publish':
                helper.publishBook(component, row);
                break;
            case 'unpublish':
                helper.unpublishBook(component, row);
                break;
            case 'delete':
                helper.removeBook(component, row);
                break;
        }
    },
    
    searchTable: function (cmp, event, helper) {
        var allRecords = cmp.get("v.allData");
        var searchFilter = event.getSource().get("v.value").toUpperCase();
        var tempArray =[];
        var i;
        for(i=0; i<allRecords.length; i++){
            if((allRecords[i].Name && allRecords[i].Name.toUpperCase().indexOf(searchFilter) != -1) || 
               (allRecords[i].Phone && allRecords[i].Phone.toUpperCase().indexOf(searchFilter) != -1)){
                tempArray.push(allRecords[i]);
            }
        }
        cmp.set("v.accountData",tempArray);
    }
    
});
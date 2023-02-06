sap.ui.define([
	"sap/m/MessageBox",
	],
	
function(jQuery, MessageBox, Controller) {
	
return sap.ui.controller("zrmaps.view.BindingTypes", {
	
	onInit : function() {
		debugger
		this.FunPropertyBinding();
		this.AggregationBinding();
		this.ElementBinding();
	},
	
/***Example of Property Binding**/
/*
Note : Property binding allows properties of the control to get automatically initialized and updated from model data.
*/
	FunPropertyBinding:function(){
		debugger
		var	company = {
				"name"  : "Acme Inc.",
				"street": "23 Franklin St." ,
				"city"  : "Claremont",
				"state" : "New Hampshire",
				"zip"   : "03301",
				"revenue": "1833990"
			}
		
		var objView = this.getView();
		var TableJmodel = new sap.ui.model.json.JSONModel();
			objView.setModel(TableJmodel, "TableJmodel");
			TableJmodel.setData(company);
	},
	
	
/***Example of AggregationBinding Binding**/
/*
Note : Aggregation binding is used to automatically create child controls according to model data.
*/
	AggregationBinding:function(){
			debugger
			var	companies = [
				{
					name : "Acme Inc.",
					city: "Belmont",
					state: "NH",
					county: "Belknap",
					revenue : 123214125.34 , 
				},{
					name : "Beam Hdg.",
					city: "Hancock",
					state: "NH",
					county: "Belknap",
					revenue : 3235235235.23  
				},{
					name : "Carot Ltd.",
					city: "Cheshire",
					state: "NH",
					county: "Sullivan",
					revenue : "Not Disclosed"  
				}]
			
			var objView = this.getView();
			var TableJmodel2 = new sap.ui.model.json.JSONModel();
				objView.setModel(TableJmodel2, "TableJmodel2");
				TableJmodel2.setData(companies);
				
				 var  loc= this.getView().byId("idDropF4");
					loc.unbindAggregation("items");
					loc.setModel(TableJmodel2);
					loc.bindAggregation("items", {
						path : "/",
						template : new sap.ui.core.Item({
							key : "{name}",
							text : "{name}"
						})
					}); 
		},
		
/***Example of AggregationBinding Binding**/
/*
	Note : Element binding allows you to bind elements to a specific object in the model data, which will create a binding 
	context and allow relative binding within the control and all of its children. This is especially helpful in
    master-detail scenarios.
*/		
		
		ElementBinding : function(){
			debugger
		var company = {
				"name"  : "Acme Inc.",
				"street": "23 Franklin St.",
				"city"  : "Claremont",
				"state" : "New Hampshire",
				"zip"	: "03301",
				"revenue": "1833990"
			}
			
			var objView = this.getView();
			var TableJmodel2 = new sap.ui.model.json.JSONModel();
				objView.setModel(TableJmodel2, "TableJmodel2");
				TableJmodel2.setData(company);
		},	

	
});

});
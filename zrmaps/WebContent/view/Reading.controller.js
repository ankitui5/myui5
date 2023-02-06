sap.ui.define([
	"sap/m/MessageBox",
	 "sap/ui/core/mvc/Controller",
     "sap/ui/model/json/JSONModel",
     "sap/viz/ui5/controls/common/feeds/FeedItem",
     "sap/viz/ui5/data/FlattenedDataset",
     "sap/ui/core/routing/History",
     "sap/ui/unified/CalendarLegendItem",
     "sap/m/PlanningCalendarLegend",
 	 "sap/ui/unified/DateTypeRange"
	],
	
function(Controller, JSONModel, FeedItem, FlattenedDataset,History,CalendarLegendItem,CalendarSpecialDaysLegend,DateTypeRange) {
	"use strict";
return sap.ui.controller("zrmaps.view.Reading", {
	onInit : function() {
		debugger 
		
	},
	
	
	


/**********************************************************************************************************************/
	
	/* _onRoute : function(e){
	    	debugger
	    	var tempjsonString = e.getParameter("arguments").entity;
			var jsonstring = tempjsonString.replace(/@/g, "/");
			var tempSelectedData = JSON.parse(jsonstring);
			this.SelectedData  = JSON.parse(tempSelectedData);
			this.onEnter(this.SelectedData.VarTicketNo);
	    },	*/
/*****************************************************************************************************************/	
onClick : function(){
	debugger
	this._helpdialog = sap.ui.xmlfragment("zrmaps.view.Openfrag", this);
	this.CreateTable();
	var abc = this._helpdialog.open();
	
	abc.setEscapeHandler(function(o){ 
		o.reject(); 
		//o.resolve();
		});
},
/*****************************************************************************************************************/
onSubmit : function(){
	debugger
	var that = this;
	 sap.m.MessageBox.show("Success", {
         title: "Success",
         icon:sap.m.MessageBox.Icon.SUCCESS,
         onClose:function(){
         	debugger
         	/*var selectedData={};
        	var tempjsonString = JSON.stringify(selectedData);
        	var jsonstring = tempjsonString.replace(/\//g,"@");*/
        	var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        	oRouter.navTo("View1",true);
        	//window.history.back();
        	oRouter = undefined;
        	
        	that._helpdialog.close();
        	that._helpdialog.destroy(true);
        	that._helpdialog = undefined;
         }
     });
},


/*****************************************************************************************************************/


/*****************************************************************************************************************/

onclickbtn : function(){
	debugger
	this._helpdialog1 = sap.ui.xmlfragment("zrmaps.view.MyFragments", this);
	
	this._helpdialog1.open();
},
/*****************************************************************************************************************/
Oncancel : function(){
	debugger
	this._helpdialog.close();
	this._helpdialog.destroy(true);
	this._helpdialog = undefined;
},

Oncancel1 : function(){
	this._helpdialog1.close();
	this._helpdialog1.destroy(true);
	this._helpdialog1 = undefined;
},
/*****************************************************************************************************************/
onBack : function(){
	window.history.back();
},
/*****************************************************************************************************************/

CreateTable:function(){
debugger
//var FitModel = new sap.ui.model.json.JSONModel();
//var tab=sap.ui.getCore().byId("tblDetail");
    //tab.setModel(FitModel,"Fitments");

    
var vData=[
    {assID:"EM123456", name:"Bharath S", linkText:"Cognizant Technology Solutions"}, 
    {assID:"EM263521", name:"Arun M", linkText:"Cognizant Technology Solutions"}, 
   ];

//FitModel.setData(vData);

var oTable = new sap.m.Table("idPrdList", {   
    inset : true, 
    headerText : "List of Products",
    headerDesign : sap.m.ListHeaderDesign.Standard, 
    mode : sap.m.ListMode.None,   
    includeItemInSelection : false,   
  });
  
  var col1 = new sap.m.Column("col1",{header: new sap.m.Label({text:"Product Name"})});
  oTable.addColumn(col1); 
  
  var col2 = new sap.m.Column("col2",{header: new sap.m.Label({text:"Description"})});
  oTable.addColumn(col2); 
  
  var col3 = new sap.m.Column("col3",{header: new sap.m.Label({text:"Price"})});
  oTable.addColumn(col3);   
  
  var colItems = new sap.m.ColumnListItem("colItems",{type:"Active"}); 
  
  var txtNAME = new sap.m.Text("txtNAME",{text:"sdsdsd"});
  colItems.addCell(txtNAME); 
      
  var txtNAME2 = new sap.m.Text("txtNAME2",{text:"sdsds"});
  colItems.addCell(txtNAME2); 
     
  var txtNAME3 = new sap.m.Text("txtNAME3",{text:"sdsdsd"});
  colItems.addCell(txtNAME3);
  
  oTable.placeAt("tblDetail");

//tab.bindAggregation("items" , FitModel, temp );



},

});
});
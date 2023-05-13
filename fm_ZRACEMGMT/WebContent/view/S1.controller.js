jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("ZRACEMGMT.util.Formatter");
var that,gv_busyindicator;

sap.ui.define([
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	],
	
function(Export,Controller, JSONModel,ExportTypeCSV,Spreadsheet) {
"use strict";
return sap.ui.controller("ZRACEMGMT.view.S1", {

onInit: function(){
	gv_busyindicator = new sap.m.BusyDialog();
	this.getView().byId("idRaceStatus").setSelectedKey("M");
	sap.ui.core.UIComponent.getRouterFor(this).getRoute("SS1").attachMatched(this._onRoute, this);
	//this.getRaceType();
	this.getRaceCategory();
},
/********************************************************************************************************************/
_onRoute: function(){
	this.onSearch();

},
//******************************************************************* F4 for RACE No *********************************	
OnHelpshowRaceNo : function(evt){
	
	this.ItemDescRow = evt.getSource();
	//this.ItemDescRow = sap.ui.getCore().byId("IdRaceNo");
	var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/DisplayRaceVHSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false,
			false, null);
	var _valueHelpRaceSelectDialog = new sap.m.SelectDialog(
			{

				title : "Select Race",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
							{
								title : "{RaceNumber}",
								info : "{Title1}",
								customData : [ new sap.ui.core.CustomData(
										{
											key : "{RaceNumber}",
											value : "{Title1}"
										}) ],

							}),
				},
				liveChange : function(oEvent) {
					var sValue = oEvent
							.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
							"Title1",
							sap.ui.model.FilterOperator.Contains,
							sValue);
					oEvent.getSource().getBinding("items")
							.filter([ oFilter ]);
				},
				confirm : [ this._handleStencilClose, this ],
				cancel : [ this._handleStencilClose, this ]
			});
	_valueHelpRaceSelectDialog.setModel(jModel);
	_valueHelpRaceSelectDialog.open();

	
},

_handleStencilClose : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.ItemDescRow.setValue(oSelectedItem.getTitle());
	}
},

//******************************************************************* F4 for RACE No *********************************	
//Get RACE Category.
getRaceCategory:function(){
	
	 var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceCategorySet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var  loc= this.getView().byId("selectRaceFilter");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{Racat}",
				text : "{Desc}"
			})
		}); 		
			
},
//********************************************************************************************************************
/*getRaceType: function() {
	
	var that = this;
	var oViewObj = this.getView();
	var raceTypeJModel = oViewObj.getModel("raceTypeJModel");
	if (!raceTypeJModel) {
		raceTypeJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(raceTypeJModel, "raceTypeJModel");
	}
	var sPathMatListSet = "/RaceInitialSet?$expand=NavToGain,NavToRaceTypes";
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsMatListSet = {};
	oParamsMatListSet.context = "";
	oParamsMatListSet.urlParameters = "";
	oParamsMatListSet.success = function(oData, oResponse) { // success handler
			
		raceTypeJModel.setData(oData.results[0].NavToRaceTypes.results);
		};
	oParamsMatListSet.error = function(oError) { // error handler 
		
		
		var message = JSON.parse(oError.response.body).error.message.value;
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
			onClose : function() {
				window.history.back();
			}
		});
		
	};
	frameworkODataModel.read(sPathMatListSet, oParamsMatListSet);
	frameworkODataModel.attachRequestCompleted(function() {});

},*/

//**************************************F4 Fot Plant ****************************************************************
onPlantHelp : function(){
	
	var that = this;
    var ItemDescRow = this.getView().byId("IdPlant");
    var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RacePlantSet";
    var jModel = new sap.ui.model.json.JSONModel();
        jModel.loadData(sPath, null, false, "GET", false,false, null);
    var _valueHelpPlantSelectDialog = new sap.m.SelectDialog(
            {
              title : "Select Tyre Location",
              items : {
                path : "/d/results",
                template : new sap.m.StandardListItem(
                    {
                      title : "{Plant}",
                      description:"{Description}",
                      customData : [ new sap.ui.core.CustomData(
                          {
                            key : "{Plant}",
                            value : "{Description}"
                          }) ],

                    }),
              },
              
          liveChange : function(oEvent){
             var sValue = oEvent.getParameter("value");
             var oFilter = new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([ oFilter ]);
          },
          
          confirm : function(oEvent){
        	  
//                var that = this;
              var oSelectedItem = oEvent.getParameter("selectedItem");
              var plandcheck = false;
                  if(oSelectedItem) {
                    ItemDescRow.setValue(oSelectedItem.getTitle());
                  }
              },
           cancel : function(oEvent){
        	   
//                var that = this;
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem){
                  ItemDescRow.setValue(oSelectedItem.getTitle());
                }
              }
            });
    
    _valueHelpPlantSelectDialog.setModel(jModel);
    _valueHelpPlantSelectDialog.open();
 },

_handleTyreLocClose : function(oEvent){
	
        var that = this;
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          ItemDescRow.setValue(oSelectedItem.geTtitle());
        }
	
},

onSearch:function(){
	
	gv_busyindicator.open();
	var that = this;
	//var VarRaceNo 	= this.getView().byId("IdRaceNo").getValue();
	var VarFisalYer = this.getView().byId("IdFisalYer").getValue();
	var VarRaceCat  = this.getView().byId("selectRaceFilter").getSelectedKey();
	var VarPlant    = this.getView().byId("IdPlant").getValue();
	var VarStatus    = this.getView().byId("idRaceStatus").getSelectedKey();
	
	var oViewObj = this.getView();
	var RaceListSetModel = oViewObj.getModel("RaceListSetModel");
	if (!RaceListSetModel) {
		RaceListSetModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(RaceListSetModel, "RaceListSetModel");
	}
	
	
	
	
	var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV";
	var sPathCartListSet =  "/DisplayRaceVHSet?$filter=Racat eq '"+VarRaceCat+"' and FiscalYear eq '"+ VarFisalYer+"' and Plant eq '"+VarPlant+"' and Status eq '"+VarStatus+"' &$expand=AssHeadToApprovalNvg";		
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) { // success handler
		
		RaceListSetModel.setData(oData.results);
		 
		var tblid = that.getView().byId("idReportTable");
         for(var i=0;i<tblid.getItems().length; i++){
         	  if(oData.results[i].Status != "M" ){
         	  	tblid.getItems()[i].getCells()[8].setVisible(false);
         	  	tblid.getItems()[i].getCells()[9].setVisible(false);
         	  	tblid.getItems()[i].getCells()[6].setEnabled(false);
         	  }else{
         	  	tblid.getItems()[i].getCells()[8].setVisible(true);
         	  	tblid.getItems()[i].getCells()[9].setVisible(true);
         	  	tblid.getItems()[i].getCells()[6].setEnabled(true);
         	  }
         	  
         	  if(oData.results[0].Create ==""){
         		  that.getView().byId("idCreateRace").setVisible(false);
         	  }else{
         		 that.getView().byId("idCreateRace").setVisible(true); 
         	  }
         	 
         }
		
         that.FuncMouseOver(); //Function for Mouse Over
		gv_busyindicator.close(); 
	
		};
	oParamsCartListSet.error = function(oError) { // error handler

		RaceListSetModel.setData([]);
		var message = JSON.parse(oError.response.body).error.message.value;
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
			onClose : function() { 
				
				gv_busyindicator.close();
				//window.location.reload();
			}
		});
	};
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
	});
	
	
/*	var filters = [];
	if(VarFisalYer !== ""){
		filters.push(new sap.ui.model.Filter("FiscalYear", sap.ui.model.FilterOperator.EQ, VarFisalYer));
	}
	if(VarPlant !== ""){
		filters.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, VarPlant));
	}
	if(VarRaceNo !== ""){
		filters.push(new sap.ui.model.Filter("RaceNumber", sap.ui.model.FilterOperator.EQ, VarRaceNo));
	}
	if(VarRaceTyp !== ""){
		filters.push(new sap.ui.model.Filter("RaceType", sap.ui.model.FilterOperator.EQ, VarRaceTyp));
	}
	
	if(VarStatus !== ""){
		filters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, VarStatus));
	}*/
	
	/*var sPathCartListSet = "/DisplayRaceVHSet";
	var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsCartListSet = {};
		oParamsCartListSet.context = "";
		oParamsCartListSet.filters = filters;
		oParamsCartListSet.urlParameters = "&$expand=AssHeadToApprovalNvg";
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			
			RaceListSetModel.setData(oData.results);
			 
			var tblid = that.getView().byId("idReportTable");
             for(var i=0;i<tblid.getItems().length; i++){
             	  if(oData.results[i].Status != "M" ){
             	  	tblid.getItems()[i].getCells()[8].setEnabled(false);
             	  	tblid.getItems()[i].getCells()[9].setEnabled(false);
             	  }else{
             	  	tblid.getItems()[i].getCells()[8].setEnabled(true);
             	  	tblid.getItems()[i].getCells()[9].setEnabled(true);
             	  }
             	  
             	  if(oData.results[0].Create ==""){
             		  that.getView().byId("idCreateRace").setVisible(false);
             	  }else{
             		 that.getView().byId("idCreateRace").setVisible(true); 
             	  }
             	 
             }
			
             that.FuncMouseOver(); //Function for Mouse Over
			gv_busyindicator.close(); 
			
		};
		oParamsCartListSet.error = function(oError) { // error handler 
			
			RaceListSetModel.setData([]);
			var message = JSON.parse(oError.response.body).error.message.value;
			sap.m.MessageBox.show(message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
				onClose : function() { 
					
					gv_busyindicator.close();
					//window.location.reload();
				}
			});
		};
		frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
		*/
		
		
		
		
},
//****************************************************************************************************************
// Open Popover on mouse over.
FuncMouseOver(){
	
	var tblid = this.getView().byId("idReportTable");
	for(var i=0; i<tblid.getItems().length; i++){
		this.attachPopoverOnMouseover(tblid.getItems()[i].getCells()[7],tblid.getItems()[i].getCells()[10]);
	}
},

attachPopoverOnMouseover: function (targetControl, popover) {
	
    targetControl.addEventDelegate({
    	onmouseover: this._showPopover.bind(this, targetControl, popover),
    	//onmouseout:  this._clearPopover.bind(this, popover),
    }, this);
  },
  
 _showPopover: function (targetControl, popover) {
	 
	 var sPath 	 = popover.getBindingContext("RaceListSetModel").sPath.split("/")[1];
	 var RowData = popover.getBindingContext("RaceListSetModel").getModel().getData()[sPath].AssHeadToApprovalNvg.results;
	 var RaceApprovalStatusModel =  new sap.ui.model.json.JSONModel();
	 //var idtble = this.getView().byId("ifPopovertbl");
	 this.getView().setModel(RaceApprovalStatusModel,"RaceApprovalStatusModel");
	 RaceApprovalStatusModel.setData(RowData);
	 
	 this._timeId = setTimeout(() => popover.openBy(targetControl), 500);
 },

/*_clearPopover: function(popover) {
	
      clearTimeout(this._timeId) || popover.close();
},*/

//*******************************************Clear Data***************************************************************
onClear:function(){
	
	this.getView().byId("IdRaceNo").setValue();
	this.getView().byId("IdFisalYer").setValue();
	this.getView().byId("selectRaceFilter").setSelectedKey();
	this.getView().byId("IdPlant").setValue();
	
	var tableid = this.getView().byId("idReportTable");
	var RaceListSetModel = tableid.getModel("RaceListSetModel");
		RaceListSetModel.setData([]);
		RaceListSetModel.refresh();
	
},
//********************************************Display Race*************************************************************
displayRaceDetails : function(oEvt){
	
	gv_busyindicator.open();
	var sPath   =  oEvt.getParameters().listItem.getBindingContext("RaceListSetModel").sPath.split("/")[1];
	var getData = oEvt.getParameters().listItem.getBindingContext("RaceListSetModel").getModel().getData()[sPath];;

	var raceNo 	  = getData.RaceNumber;
	var Status 	  = getData.Status;
	var ItemNo    = getData.Zeile
	var selectedData={};
	selectedData.raceNo = raceNo;
	selectedData.Status = Status;
	selectedData.ItemNo = ItemNo;
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("page1",{"entity":JSON.stringify(jsonstring)});
	gv_busyindicator.close();
	
},

onCreateRace:function(){
	
	gv_busyindicator.open();
	var router = sap.ui.core.UIComponent.getRouterFor(this);
	router.navTo("page2");
	gv_busyindicator.close();
	
},

onClear:function(){
	
	this.getView().byId("selectRaceFilter").setSelectedKey("");
	this.getView().byId("IdFisalYer").setValue("");
	this.getView().byId("IdPlant").setValue("");
	this.getView().byId("idRaceStatus").setSelectedKey("");	
	var vartblid = this.getView().byId("idReportTable");
	var ModelData = vartblid.getModel("RaceListSetModel");
	    ModelData.setData([]);
},

//*******************************************************************************************************************

onDownload : sap.m.Table.prototype.exportData || function(oEvent) {
	 
	 	 
	 var oExport = new sap.ui.core.util.Export({
	 exportType : new sap.ui.core.util.ExportTypeCSV({
	 separatorChar: "\t",
	 mimeType: "application/vnd.ms-excel",
	 charset: "utf-8",
	 fileExtension: "xls"
	}),
			
	 models : this.getView().getModel("RaceListSetModel"),
		 rows : {
		 path : "/",
	 },
					 	
	 columns: [{
		name: "Race Number",
		template: {
		content: "{RaceNumber}"
		},
	 },
	{
		name: "Race Type",
		template: {
		content: "{RaceType}"
		},								
	},
	{
		name: "Location",
		template: {
		content: "{Plant}"
		},								
	},
	
	{
		name: "Initiator",
		template: {
		content: "{PersonName}"
		},								
	},
	
	{
		name: "Description",
		template: {
		content: "{Title1}"
		},								
	},
	
	{
		name: "Race Category",
		template: {
		content: "{RaceCat}"
		},								
	},

	{
		name: "Race Amount(In Lakh)",
		template: {
		content: "{RaceAmount}"
		},								
	},

	{
		name: "Status",
		template: {
		content: "{Status}"
		},								
	},	 
	 ]

});
	 //* download exported file

	oExport.saveFile().always(function() {
		this.destroy();
	});
},	
//*******************************************************************************************************************
onAprrove:function(oEvt){
	
     var self= this;
     var oEntry = {}
                   		
    var sPath   = oEvt.getSource().getBindingContext("RaceListSetModel").getPath().split("/")[1];
    var RowData = oEvt.getSource().getBindingContext("RaceListSetModel").getModel().getData()[sPath]; 
     
     var raceNo 	= RowData.RaceNumber;
     var fY 		= RowData.FiscalYear;
     var plant 		= RowData.Plant
     var itmNo 		= RowData.Zeile;
     //var itemtxt 	= ""
     var rceAmt 	= RowData.RaceAmount
                   		
     oEntry.RaceNumber 	= raceNo;
     oEntry.FiscalYear 	= fY;
     oEntry.Plant 	  	= plant;
     oEntry.ItemNo 		= itmNo;
     //oEntry.ItemText 	= itemtxt;
     oEntry.RaceApprovalAmount = rceAmt;
     
     var dialog = new sap.m.Dialog({
 		title : "Are you sure you want to approve?",
 		type : 'Message',
 		state : 'Warning',
 			content : [
 				new sap.m.Label({
 					text : "Comments",
 					labelFor : 'submitDialogTextarea'
 				}),

 				new sap.m.TextArea('submitDialogTextarea',{
 					
 					liveChange : function(oEvent) {
 						var sText = oEvent.getParameter('value');
 						oEntry.ItemText = sText;
 						//var parent = oEvent.getSource().getParent();
 						//parent.getBeginButton().setEnabled(sText.length > 0);
 					},
 					width : '100%',
 					maxLength : 250,
 					height : '80px',
 					placeholder : "Add Comments"
 				})],

 				beginButton : new sap.m.Button({
 					text : "OK",
 					enabled : true,
 					press : function() {
 					   var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
 	                   var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
 	                   	oCreateModel1.setHeaders({
 	                   		"Content-Type": "application/atom+xml"
 	                   	});

 	                   	oCreateModel1.create("/RaceApproveSet", oEntry, null,
 	                   		function(oData, oResponds) {
 	                   			
 	                   			sap.m.MessageToast.show("Approved",{
 	                   				duration : 3000
 	                   			});
 	                   		    dialog.close();
 	                   			self.onSearch();	
 	                   		}, 
 	                   		
 	                   		function(oData, oResponds) {
 	                   				var a = 1;
 	                   		})
 								
 					}
 				}),

 				endButton : new sap.m.Button({
 					text : "Cancel",
 					press : function() {
 						dialog.close();
 					}
 				}),

 				afterClose : function() {
 					dialog.destroy();
 				}
 			}).addStyleClass("sapUiSizeCompact");
            
        dialog.open();
  
   /*  sap.m.MessageBox.show("Are you sure you want to approve?",{
            icon : sap.m.MessageBox.Icon.WARNING,
            title : "Warning",
            actions : [ "Continue", "Cancel" ],
            onClose : function(a) {
                if (a === "Continue") {
                   var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
                   var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
                   	oCreateModel1.setHeaders({
                   		"Content-Type": "application/atom+xml"
                   	});

                   	oCreateModel1.create("/RaceApproveSet", oEntry, null,
                   		function(oData, oResponds) {
                   			
                   			sap.m.MessageToast.show("Approved",{
                   				duration : 3000
                   			});
                   			self.onSearch();	
                   		}, 
                   		
                   		function(oData, oResponds) {
                   				var a = 1;
                   		})
                   		//self._onRoute();
                 } else if(a === "Cancel"){
                   	sap.m.MessageBox.Action.CANCEL
                  }
             },
          });*/
},
//*******************************************************************************************************************
onReject:function(oEvt){
	
	var self= this;
	var oEntry = {}
	
	var sPath   = oEvt.getSource().getBindingContext("RaceListSetModel").getPath().split("/")[1];
    var RowData = oEvt.getSource().getBindingContext("RaceListSetModel").getModel().getData()[sPath]; 
     
     var raceNo 	= RowData.RaceNumber;
     var fY 		= RowData.FiscalYear;
     var plant 		= RowData.Plant
     var itmNo 		= RowData.Zeile;
     var itemtxt 	= ""
     var rceAmt 	= RowData.RaceAmount
	
	oEntry.RaceNumber = raceNo;
	oEntry.FiscalYear = fY;
	oEntry.Plant = plant;
	oEntry.ItemNo = itmNo;
	oEntry.ItemText = itemtxt;
	oEntry.RaceApprovalAmount = rceAmt;
	
	var dialog = new sap.m.Dialog({
		title : "Are you sure you want to reject?",
		type : 'Message',
		state : 'Warning',
			content : [
				new sap.m.Label({
					text : "Reason of Rejection",
					labelFor : 'submitDialogTextarea'
				}),

				new sap.m.TextArea('submitDialogTextarea',{
					
					liveChange : function(oEvent) {
						var sText = oEvent.getParameter('value');
						var parent = oEvent.getSource().getParent();
							parent.getBeginButton().setEnabled(sText.length > 0);
					},
					width : '100%',
					maxLength : 250,
					height : '80px',
					placeholder : "Add Note"
				})],

				beginButton : new sap.m.Button({
					text : "OK",
					enabled : false,
					press : function() {
						var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
						var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
							oCreateModel1.setHeaders({
									"Content-Type": "application/atom+xml"
									});

						oCreateModel1.create("/RaceRejectSet", oEntry, null,
							function(oData, oResponds) {
								
								sap.m.MessageToast.show("Rejected",{
									duration : 3000
								});
								dialog.close();
								self.onSearch();
								//self._onRoute();
						},
						
							function(oData, oResponds) {
									var a = 1;
									})
								
					}
				}),

				endButton : new sap.m.Button({
					text : "Cancel",
					press : function() {
						dialog.close();
					}
				}),

				afterClose : function() {
					dialog.destroy();
				}
			}).addStyleClass("sapUiSizeCompact");
	
	dialog.open();
},

/********************************************************************************************************************/
});
});

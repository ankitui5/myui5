var uid , getPrintValue, that,mode, arr=[];

sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"zexposeapprove/util/Formatter"

	],

function(Controller,Formatter, JSONModel, MessageBox) {
"use strict";	
return sap.ui.controller("zexposeapprove.view.S1", {
	
onInit: function(){
	that = this;
	var user = new sap.ushell.services.UserInfo();
	uid = user.getId();
	this.getView().byId("idStatus").setSelectedKey("L");
	this.onSearch(status);
	
/***********************************************Set Initial Date In Input Field***********************************************/
	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	var firstDay = new Date(y,m,1);
	var currentDate = new Date;
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
	this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
	this.toDate = dateFormat.format(currentDate)+"T00:00:00";
	currentDate = oDateFormat.format(currentDate);
	firstDay = oDateFormat.format(firstDay);
	
	var initialDateValue = firstDay + " - "  + currentDate;
	this.getView().byId("fromDate").setValue(firstDay);
	this.getView().byId("toDate").setValue(currentDate);
	
	var oDatePickerHr = this.getView().byId("fromDate"); 
	oDatePickerHr.addEventDelegate({ 

		onAfterRendering: function(){ 
		var oDateInnerHr = this.$().find('.sapMInputBaseInner'); 
		var oIDHr = oDateInnerHr[0].id; 
		$('#'+oIDHr).attr("disabled", "disabled"); 
		}},
	oDatePickerHr);
	
},
/**************************************on Request Number Help**********************************/
onRequestNumber: function(){
	debugger
	var sPath = "/sap/opu/odata/sap/ZSD_EXPOSURE_SRV/GetRequestNumberSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var RequestNumberHelpDialog = new sap.m.SelectDialog({
				title : "Request Number",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
								title : "{RequestNumber}",
								customData : [ new sap.ui.core.CustomData({
											key : "Key",
											value : "{RequestNumber}"
												
										}) ],
							}),
				},
		/*liveChange : function(oEvent) {
		debugger
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("SalesDocumentType",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([ oFilter ]);
	},*/
		
	confirm : [ this._handleRequestNumberHelp, this ],
	cancel : [ this._handleRequestNumberHelp, this ]
	});
	
	RequestNumberHelpDialog.setModel(jModel);
	RequestNumberHelpDialog.open();
	},
	
	_handleRequestNumberHelp : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
		        this.getView().byId("idRequestNumber").setValue(oSelectedItem.getTitle());
	         }
},
/*************************************On Table Row Click****************************/
onFnExposeAppDetails: function(oEvt){
	debugger
	var varIndex = oEvt.getSource().getBindingContext("ExposeAppJModel").getPath().split('/')[1];
	var varData = oEvt.getSource().getBindingContext("ExposeAppJModel").getModel().getData()[varIndex];
	

		var lv_index =varData.RequestHeadToItemNvg;
		var selectedData = {};
		selectedData.lv_index = lv_index;
		var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("S2",{"entity":JSON.stringify(jsonstring)});

	
},

/******************************************************On Search Button Press**********************************************************/
	onSearch: function(){
		var ExposureRequestNumber = this.getView().byId("idRequestNumber").getValue();
		var Status = this.getView().byId("idStatus").getSelectedKey();
		if(Status == ""){
			Status = "L";
		}
		
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		    pattern : "dd-MM-yyyy"
		});
		var fromDate = this.getView().byId("fromDate").getValue();
		var fromSplit = fromDate.split(".");
		var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		var dateFrom = fValue+"T00:00:00";
		
		if(dateFrom == "undefined-undefined-T00:00:00"){
			dateFrom = "null";
		}
		
		var toDate = this.getView().byId("toDate").getValue();		
		var toSplit = toDate.split(".");
		var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
		var dateTo = tValue+"T00:00:00";		
		
		if(dateTo == "undefined-undefined-T00:00:00"){
			dateTo = "null";
		}
		
		if(dateTo < dateFrom){
			sap.m.MessageToast.show("Search Begin Date Can't Be Greater Than Search End Date.");
			this.getView().byId("fromDate").setValueState("Error");
			this.getView().byId("toDate").setValueState("Error");
			return false
			}
		
		else{
			this.getView().byId("fromDate").setValueState("None");
			this.getView().byId("toDate").setValueState("None");
			}
		   var oView = this.getView();
				var ExposeAppJModel = oView.getModel("ExposeAppJModel");
				if (!ExposeAppJModel) {
					ExposeAppJModel = new sap.ui.model.json.JSONModel();
					oView.setModel(ExposeAppJModel, "ExposeAppJModel");
				}
			
			var sServiceUrl = "";
			if(dateFrom!="null"){
				var sPath ="/sap/opu/odata/sap/ZSD_EXPOSURE_SRV/GetRequestHeaderSet?$expand=RequestHeadToItemNvg&$filter=LowDate eq datetime'"+dateFrom+"' and HighDate eq datetime'"+dateTo+"' and Status eq'"+Status+"' and ExposureRequestNumber eq'"+ExposureRequestNumber+"'";
			} else {
				var sPath ="/sap/opu/odata/sap/ZSD_EXPOSURE_SRV/GetRequestHeaderSet?$expand=RequestHeadToItemNvg&$filter=LowDate eq datetime'"+dateFrom+"' and HighDate eq datetime'"+dateTo+"' and Status eq'"+Status+"' and ExposureRequestNumber eq'"+ExposureRequestNumber+"'";
				
			}
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				 oReadModel.setHeaders({"Content-Type" : "application/json"});                           
			var fncSuccess = function(oData, oResponse){
				debugger
				ExposeAppJModel.setData(oData.results);
				var tbl = that.getView().byId("idExposeApproval1");
				/*for(var i=0;i<tbl.getItems().length;i++)
				{
					if(oData.results[i].Print == 'X' && oData.results[i].ProdType=='02')
						tbl.getItems()[i].getCells()[11].setVisible(true);
					else
						tbl.getItems()[i].getCells()[11].setVisible(false);
				}*/
			}
			 var fncError = function(oError) {       
			 }
			 oReadModel.read(sPath, {
				  success : fncSuccess,
				   error : fncError
				   });
				                    
		}, 
/***********************************On Print************************************************************/
		/*onPrint:function(e){
			debugger
			var path = e.getSource().getBindingContext("ExposeAppJModel").getPath().split('/')[1];
			var data = e.getSource().getBindingContext("ExposeAppJModel").getModel().getData()[path];
			
			var objnr = data.Objnr;
			
			sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZID_INTERNAL_DISCOUNT_SRV/GetDiscountFormSet(Objnr='"+objnr+"')/$value", true);
		},*/
/**********************************On Reject**********************************************************//*
		 onReject:function(){
		   		debugger
				mode = 'R';
		   		var that = this;

				sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
					MessageBox.show(
						"Are you sure you want to reject?", {
							icon: MessageBox.Icon.INFORMATION,
							title: "Warning",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							onClose: function(oAction){
								if(oAction === sap.m.MessageBox.Action.YES){
									if (!that._RemarkDialog) {
										that._RemarkDialog = sap.ui.xmlfragment(
												"zexposeapprove.view.Remarks", that);
											that.getView().addDependent(that._RemarkDialog);
											}
										that._RemarkDialog.open();
								}else{
									return false;
								}
							}
						}
					);
				});
		       },*/
/********************************On Approve*********************************************//*
		       onSelect:function(oEvt){
		    	   debugger
		    	   var obj={};
			       var ReqNo = oEvt.getSource().getBindingContext("ExposeAppJModel").getProperty().ExposureRequestNumber;
			    	   obj.ExposureRequestNumber = ReqNo;
			    	   arr.push(obj);
		    	 
		       },    
		       
		   onApprove:function(evt){
			   debugger
		   		mode='A';
				var that = this;
				sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
					MessageBox.show(
						"Are you sure you want to approve?", {
							icon: MessageBox.Icon.INFORMATION,
							title: "Warning",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							onClose: function(oAction){
								if(oAction === sap.m.MessageBox.Action.YES){
									if (!that._RemarkDialog) {
										that._RemarkDialog = sap.ui.xmlfragment(
												"zexposeapprove.view.Remarks", that);
											that.getView().addDependent(that._RemarkDialog);
											}
										that._RemarkDialog.open();
									that.onSave(arr,mode);
								}else{
									return false;
								}
							}
						}
					);
				});
		       },
		       
		       */
/********************************On Save***************************************/
/*		   onSave:function(arr, mode){
			   debugger
	       var that = this;
	       var sServiceUrl = "";
	       var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
	       oCreateModel1.setHeaders({"Content-Type": "application/atom+xml"});
	       
	       debugger
	       var dataPayLoad			={};
	       dataPayLoad.ExposureRequestNumber = ExposureRequestNumber;
	       dataPayLoad.Mode  		= mode;
	       dataPayLoad.Status 	= Status;
	       dataPayLoad.CustomerNumber  	= CustomerNumber;
	       dataPayLoad.CustomerName 	= CustomerName;
	       dataPayLoad.DepotNumber 	= DepotNumber;
	       dataPayLoad.CustomerClassification 	= CustomerClassifivation;
	       //dataPayLoad.VechType 	= vehtype;
	       //dataPayLoad.VechMake 	= vehmake;
	       //dataPayLoad.CustName 	= CustName;
	       //dataPayLoad.EmpName 		= empname;
	       //dataPayLoad.PersonnelArea= PersonnelArea;
	       //dataPayLoad.Designation  = Designation;
	       //dataPayLoad.Regio	    = Regio;
	       
	       //dataPayLoad.PersonnelSubarea=PersonnelSubarea;
	   	var fncSuccess = function(oData, oResponse) //sucess function 
		{
	 
		if(oData.Error != "X"){
		 sap.m.MessageBox.show(oData.Message, {
	            title: "Success",
	            icon:sap.m.MessageBox.Icon.SUCCESS,
	            onClose:function(){
	            	debugger
	            	window.history.back();
	            	var selectedData = {};
	            	var tempjsonString = JSON.stringify(selectedData);
	            	var jsonstring = tempjsonString.replace(/\//g, "@");
	            	var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
	            	oRouter.navTo("S1",{"entity":JSON.stringify(jsonstring)});
	            	
	            }
	        });
			}
		else{
			 sap.m.MessageBox.show(oData.Message, {
		            title: "Error",
		            icon:sap.m.MessageBox.Icon.ERROR,
		            onClose:function(){
		            	debugger
		            	window.history.back();
		            	var selectedData = {};
		            	var tempjsonString = JSON.stringify(selectedData);
		            	var jsonstring = tempjsonString.replace(/\//g, "@");
		            	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		            	oRouter.navTo("S1",{"entity":JSON.stringify(jsonstring)});
		            }
		        });	
		}
		}

	       var fncError = function(oError) { //error callback function
	                     var parser = new DOMParser();
	              var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
	                     sap.m.MessageBox.show("Error ", {
	            title: "Error",
	            icon:sap.m.MessageBox.Icon.ERROR,
	        });
	       }

	       oCreateModel1.create("/EmployeeRequestSet",dataPayLoad, {
	              success: fncSuccess,
	              error: fncError
	       });
	       
	},*/
/********************************************On Clear Button Press*************************************************************/
		onClear: function(){
			debugger
			this.getView().byId("fromDate").setValue();
			this.getView().byId("toDate").setValue();
			this.getView().byId("idRequestNumber").setValue();
			this.getView().byId("idStatus").setSelectedKey();
			var tblId = this.getView().byId("idExposeApproval1");
			var ModelData = tblId.getModel("ExposeAppJModel");
				ModelData.setData([]);
				
		},
		
});
});

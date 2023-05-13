var that, newDate,DateFrom,DateTo,oData,uid, DataEmpid,DataEmpname, DataResDt,DataReqRelDt,DataStatus,DataDept,Dept,DataCounter,jModel;
var ClearanceFormData;
sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"zclearancefrm/util/Formatter"
	],
	

	function(MessageBox,Fragment,Controller, JSONModel,MessageToast) {
	"use strict";
		
return sap.ui.controller("zclearancefrm.view.View1", {
onInit: function() {
	debugger
	this.newBusy = new sap.m.BusyDialog();
	this.model = this.getOwnerComponent().getModel();
	that = this;
	var user = new sap.ushell.services.UserInfo();
		uid = user.getId();	
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(this._onRoute, this);
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		
		if (sap.ui.Device.system.desktop) {
		}
	    
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
		var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		var firstDay = new Date(y,m,1);
		var currentDate = new Date;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
		this.dateFrom  = dateFormat.format(firstDay)+"T00:00:00";
		this.dateTo = dateFormat.format(currentDate)+"T00:00:00";
		currentDate = oDateFormat.format(currentDate);
		firstDay = oDateFormat.format(firstDay);
		
		var initialDateValue = firstDay + " - "  + currentDate;
		this.getView().byId("fromDate").setValue(firstDay).setMaxDate(new Date());
		this.getView().byId("toDate").setValue(currentDate).setMaxDate(new Date());
		
		//this.onSearch();
		this.onDept();
/**********************************************************************************************************/
		var oDatePicker = this.getView().byId("fromDate");
			oDatePicker.addEventDelegate({
				onAfterRendering: function(){
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#'+oID).attr("disabled", "disabled"); 
				}
			},
			oDatePicker
			);

			var oDatePicker1 = this.getView().byId("toDate");
			oDatePicker1.addEventDelegate({
				onAfterRendering: function(){
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#'+oID).attr("disabled", "disabled");
				}
			},
			oDatePicker1
			);
		
			},
			_onRoute : function(e){
				debugger
				this.onDept();
			},
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/					
			onDept:function(){
				debugger
				 var that = this;
				var oView = this.getView();
				var Eseparation = oView.getModel("Eseparation");
				if (!Eseparation) {
					Eseparation = new sap.ui.model.json.JSONModel();
				
					oView.setModel(Eseparation, "Eseparation");
				}
				var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";
				var sPathEseparation = "/GetManagerDepartmentSet";
				var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				var oParamsEseparation = {};
				oParamsEseparation.context = "";
				oParamsEseparation.urlParameters = "";
				oParamsEseparation.success = function(oData, oResponse) { // success handler
				debugger
				Eseparation.setData();
				Eseparation.setData(oData.results);
				
				if(Eseparation.oData.length==1 ){
					Dept=Eseparation.oData[0].Dept;
					that.onSearch();
				}else{
					if (!that._InitialDialog) {
				        that._InitialDialog = sap.ui.xmlfragment("zclearancefrm.view.Dept", that);
				        }
								
					 var jModel = new sap.ui.model.json.JSONModel(oData.results);
				 		var  loc= sap.ui.getCore().byId("idDept");
						loc.unbindAggregation("items");
						loc.setModel(jModel);
						loc.bindAggregation("items", {
							path : "/",
							template : new sap.ui.core.Item({
								key : "{Dept}",
								text : "{DeptDesc}"
							})
						});	
					
					
					that._InitialDialog.open();
					}		
				};
				oParamsEseparation.error = function(oError) { // error handler 		
					jQuery.sap.log.error("read publishing group data failed");
				}.bind(this);
				frameworkODataModel.read(sPathEseparation, oParamsEseparation);
				frameworkODataModel.attachRequestCompleted(function() {
				});
			},
			
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/			
			onOkForm:function(){
				Dept = sap.ui.getCore().byId("idDept").getSelectedKey();
					if(Dept == ""){
						sap.ui.getCore().byId("idDept").setValueState("Error");
						return false;
					} else {
						sap.ui.getCore().byId("idDept").setValueState("None");
					}
					this.onSearch();
					this._InitialDialog.close();
					this._InitialDialog.destroy(); 
					this._InitialDialog=undefined;
					
				},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			onCancel:function(){
				this._InitialDialog.close();
				this._InitialDialog.destroy(); 
				this._InitialDialog=undefined;
			//	this._InitialDialog.destroy();
				   window.history.back();
				},
					
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
handledatefrom: function(oEvent){
	debugger
    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
    var from = oEvent.getSource().getProperty("dateValue");
    var dateVal = oEvent.getSource().getProperty("value");
    if(from !== null){
      this.dateFrom = dateFormat.format(from)+"T00:00:00";
    }else{
      if(dateVal !== ""){
        var dateSplit = dateVal.split("-");
        var fromDate = dateSplit[0].trim();
        var fromSplit = fromDate.split(".");
        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
        this.dateFrom = fValue+"T00:00:00";
      }else{
        this.dateFrom = null;
      }
    }
},

handledateto: function(oEvent){
	debugger
    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
    var from = oEvent.getSource().getProperty("dateValue");
    var dateVal = oEvent.getSource().getProperty("value");
    if(from !== null){
      this.dateTo = dateFormat.format(from)+"T00:00:00";
    }else{
      if(dateVal !== ""){
        var dateSplit = dateVal.split("-");
        var fromDate = dateSplit[0].trim();
        var fromSplit = fromDate.split(".");
        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
        this.dateTo = fValue+"T00:00:00";
      }else{
        this.dateTo = null;
      }
    }
},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

payLoadDate: function(SDateValue) {
	debugger
	var str = "T00:00:00";
	var currentTime = new Date(SDateValue);
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var date = year + "-" + month + "-" + day + str;
	return date;
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~by Ram~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onSearch : function() {                                              
	debugger

	var check = false;
	var that = this;
	if(this.dateFrom > this.dateTo){
		sap.m.MessageToast.show("From-date cannot be greater than To-date.");
		this.getView().byId("fromDate").setValueState("Error");
		this.getView().byId("toDate").setValueState("Error");
		return false
		}
	else{
		this.getView().byId("fromDate").setValueState("None");
		this.getView().byId("toDate").setValueState("None");
		}
	var empId = this.getView().byId("IdEmp").getValue();
	var status = this.getView().byId("IdStatus").getSelectedKey();
	var tableid = this.getView().byId("tblDetail1");      
	  ClearanceFormData = tableid.getModel();         
	
   var oView = this.getView();
		var ClearanceFormData = oView.getModel("ClearanceFormData");
		if (!ClearanceFormData) {
			ClearanceFormData = new sap.ui.model.json.JSONModel();
			oView.setModel(ClearanceFormData, "ClearanceFormData");
		}
	var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";
    var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		 oReadModel.setHeaders({"Content-Type" : "application/json"});
		                           
	var fncSuccess = function(oData, oResponse){		
		ClearanceFormData.setData(oData.results);

		 }
		                           
	 var fncError = function(oError) { // error callback
		 	        
	 }
	 
	 
	 if(this.dateFrom){
		 var path = "GetClearanceEmpDataSet?$filter= EmpId eq '"+empId+"' " +
		 		"and ClearStatus eq '"+status+"' " +
		 		"and Dept eq '"+Dept+"' " +
		 		"and ResDateFrom eq datetime'"+this.dateFrom+"' " +
		 		"and ResDateTo eq datetime'"+this.dateTo+"'";
		 } else {
			 var path = "GetClearanceEmpDataSet?$filter= EmpId eq '"+empId+"' " +
		 		"and ClearStatus eq '"+status+"' " +
		 		"and Dept eq '"+Dept+"' " +
		 		"and ResDateFrom eq "+null+" " +
		 		"and ResDateTo eq "+null+""; 
		 }
	 
	 
	 oReadModel.read(path, {
		  success : fncSuccess,
		   error : fncError
		   });
		                    
}, 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~by Ram~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//F4 for Employee Id
onEmpIdHelp : function() {
	 debugger
  var sPath = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/F4EmpClearanceSet?$filter=Uname eq '"+uid+"'";
  var jModel = new sap.ui.model.json.JSONModel();
      jModel.loadData(sPath, null, false,"GET",false, false, null);
  var _valueHelpEmpIdSelectDialog = new sap.m.SelectDialog({
			title : "Select Employee Id",
			items : {
				path : "/d/results",
				template : new sap.m.StandardListItem({
					title : "{EmpId}",
					description: "{EmpName}",
					customData : [ new sap.ui.core.CustomData({
						key : "{EmpId}",
						value : "{EmpName}"
					})],
				}),
			},
			
	liveChange : function(oEvent) {
		 var sValue = oEvent.getParameter("value");
	     var oFilter = new sap.ui.model.Filter("EmpId",sap.ui.model.FilterOperator.Contains,sValue);
	     var oFilter1 = new sap.ui.model.Filter("EmpName",sap.ui.model.FilterOperator.Contains,sValue);
	     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
			 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
	},
	
		confirm : [ this._handleEmpIdClose, this ],
		cancel : [ this._handleEmpIdClose, this ]
	});
  
  		_valueHelpEmpIdSelectDialog.setModel(jModel);
  		_valueHelpEmpIdSelectDialog.open();
},

_handleEmpIdClose : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
			this.getView().byId("IdEmp").setValue(oSelectedItem.getTitle()); 	
	}
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

onOpenForm:function(e){
	debugger
	var that = this
	var selectedData={};
	var path 		 	= e.getSource().getBindingContext("ClearanceFormData").getPath().split('/')[1];
	var data 		 	= e.getSource().getBindingContext("ClearanceFormData").getModel().getData()[path];
	var empid 	     	= data.EmpId;
	//var selectedData 	= data;
	selectedData.empid 			= data.EmpId;
	selectedData.EmpName 		= data.EmpName;
	selectedData.FinalExitDate 	= data.FinalExitDate;
	selectedData.Guid 			= data.Guid;
	selectedData.Dept 			= data.Dept;
	selectedData.ClearStatus 	= data.ClearStatus;
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
	oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});

},


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onClear : function(){
	this.getView().byId("IdEmp").setValue("");
	this.getView().byId("fromDate").setValue("");
	this.getView().byId("toDate").setValue("");
	this.getView().byId("IdStatus").setValue("");
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
})
});
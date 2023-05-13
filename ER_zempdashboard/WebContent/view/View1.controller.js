sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"zempdashboard/util/Formatter"
],

function(MessageBox,Fragment,Controller, JSONModel,MessageToast) {
"use strict";

var allData;
var getSelctedDept,getSelctedHO,dateFrom,dateTo,that,uid,Department; 
var PlantJModel,DepartmentJModel,ReasonJModel,TableJModel;

return sap.ui.controller("zempdashboard.view.View1", {
onInit: function() {
	debugger
	this.newBusy = new sap.m.BusyDialog();
	this.model = this.getOwnerComponent().getModel();
	that = this;
	var user = new sap.ushell.services.UserInfo();
	uid = user.getId();
	sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(this._onRoute, this);

	var oViewObj = this.getView();
	
	PlantJModel = oViewObj.getModel("PlantJModel");
	if (!PlantJModel) {
		PlantJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PlantJModel, "PlantJModel");
	}

	/*DepartmentJModel = oViewObj.getModel("DepartmentJModel");
	if (!DepartmentJModel) {
		DepartmentJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(DepartmentJModel, "DepartmentJModel");
	}*/

	ReasonJModel = oViewObj.getModel("ReasonJModel");
	if (!ReasonJModel) {
		ReasonJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(ReasonJModel, "ReasonJModel");
	}
	TableJModel = oViewObj.getModel("TableJModel");
	if (!TableJModel) {
		TableJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(TableJModel, "TableJModel");
	}
	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
	var date = new Date(), y = date.getFullYear(), m=date.getMonth();
	var firstDay = new Date(y,0,1);
	var currentDate = new Date;
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
	this.dateFrom  = dateFormat.format(firstDay)+"T00:00:00";
	this.dateTo = dateFormat.format(currentDate)+"T00:00:00";
	currentDate = oDateFormat.format(currentDate);
	firstDay = oDateFormat.format(firstDay);
	var initialDateValue = firstDay + " - " + currentDate;
	
	this.getView().byId("idFromDate").setValue(firstDay).setMaxDate(new Date());
	this.getView().byId("idToDate").setValue(currentDate).setMaxDate(new Date());
	
	this.onPrimaryReason();
//	this.onDepartment();
	this.onPlant();
//	this.onStatus();

	var oDatePicker = this.getView().byId("idFromDate");
		oDatePicker.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled"); 
			}
		},oDatePicker);

		var oDatePicker1 = this.getView().byId("idToDate");
		oDatePicker1.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled");
			}
		},oDatePicker1);
		
},

_onRoute : function(oEvent){
		debugger
},

onAfterRendering:function(){
	debugger
	this.onSearch();
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~On Search ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onSearch : function() {
	debugger
	var from = this.getView().byId("idFromDate").getDateValue();
	var to = this.getView().byId("idToDate").getDateValue();
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
	
	dateFrom = dateFormat.format(from)+"T00:00:00";
	dateTo   = dateFormat.format(to)+"T00:00:00";
	
	if(from !="" && to == ""){
		this.getView().byId("idFromDate").setValueState("None");
		this.getView().byId("idToDate").setValueState("Error");
	}
	else if(from =="" && to != ""){
		this.getView().byId("idFromDate").setValueState("Error");
		this.getView().byId("idToDate").setValueState("None");
	}
	else if(from !="" && to !=""){
		this.GetDashboardData();
	}
	else{
		this.getView().byId("idFromDate").setValueState("Error");
		this.getView().byId("idToDate").setValueState("Error");
	}
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Graph service~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GetDashboardData:function(){
		var that = this;
		var oViewObj = this.getView();
		
		var plantKey = this.getView().byId("idPlant").getSelectedItems();
		var Plant = "";
		for(var i=0 ; i<plantKey.length ; i++)
			Plant += plantKey[i].getKey() + "@";
		
		//var deptKey = this.getView().byId("idDepartment").getSelectedItems();
		//var Department = "";
		//for(var i=0 ; i<deptKey.length ; i++)
		//	Department += deptKey[i].getKey() + "@";
		
		var reasonKey = this.getView().byId("idReason").getSelectedItems();
		var Reason = "";
		for(var i=0 ; i<reasonKey.length ; i++)
			Reason += reasonKey[i].getKey() + "@";
		
		var statusKey = this.getView().byId("idStatus").getSelectedItems();
		var Status = "";
		for(var i=0 ; i<statusKey.length ; i++)
			Status += statusKey[i].getKey() + "@";
		
		var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";

		var sPath = "GetDashboardDataSet(DateFrom=datetime'"+dateFrom+"',DateTo=datetime'"+dateTo+"'," +
					"Plant='"+Plant+"',Reason='"+Reason+"',Status='"+Status+"')" +
					"?$expand=HeadToPlantNvg,HeadToDeptNvg,HeadToReasonNvg,HeadToDataNvg/DataToClearanceNvg";
		
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var oParams = {};
		oParams.context = "";
		oParams.urlParameters = "";
		oParams.success = function(oData, oResponse) {
			debugger;
			allData = oData;
			PlantJModel.setData(oData.HeadToPlantNvg.results);
			//DepartmentJModel.setData(oData.HeadToDeptNvg.results);
			ReasonJModel.setData(oData.HeadToReasonNvg.results);
			TableJModel.setData(oData.HeadToDataNvg.results);
			
			//that.onMouseOver();
		};
		oParams.error = function(oError) {
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oDataModel.read(sPath, oParams);
		oDataModel.attachRequestCompleted(function() {
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onMouseOver(){
		debugger
		var tblid = this.getView().byId("idReportTable");
		for(var i=0; i<tblid.getItems().length; i++){
			this.attachPopover(tblid.getItems()[i].getCells()[7]);
		}
	},

	attachPopover: function (targetControl, popover) {
		debugger
		targetControl.addEventDelegate({
		onmouseover: this._showPopover.bind(this, targetControl, popover),
		},this);
	},
	
	_showPopover: function (targetControl, popover) {
		debugger
		var sPath 	= popover.getBindingContext("RaceListSetModel").sPath.split("/")[1];
		var RowData = popover.getBindingContext("RaceListSetModel").getModel().getData()[sPath].STATUS_RES;
		var RaceApprovalStatusModel =  new sap.ui.model.json.JSONModel();
		this.getView().setModel(RaceApprovalStatusModel,"RaceApprovalStatusModel");
		RaceApprovalStatusModel.setData(RowData);
		
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
	onPrimaryReason:function(){
				var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4SeparationReasonSet?$filter=Action eq '01'";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
				var loc= this.getView().byId("idReason");
				loc.unbindAggregation("items");
				loc.setModel(jModel);
				loc.bindAggregation("items", {
					path : "/d/results",
					template : new sap.ui.core.Item({
						key : "{Serial}",
						text : "{Reason}"
					})
				});
		},
		
/*		onDepartment:function(){
			var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4DeptSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false,"GET",false, false, null);
			var loc= this.getView().byId("idDepartment");
			loc.unbindAggregation("items");
			loc.setModel(jModel);
			loc.bindAggregation("items", {
				path : "/d/results",
				template : new sap.ui.core.Item({
					key : "{Dept}",
					text : "{DeptDesc}"
				})
			});
		},*/

		onPlant:function(){
			var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4PlantSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false,"GET",false, false, null);
			var loc= this.getView().byId("idPlant");
			loc.unbindAggregation("items");
			loc.setModel(jModel);
			loc.bindAggregation("items", {
				path : "/d/results",
				template : new sap.ui.core.Item({
					key : "{Plant}",
					text : "{Description}"
				})
			});
		},
		
/*		onStatus:function(){
				debugger
					var sPath = "/sap/opu/odata/SAP/ZER_SEPARATION_SRV/F4ResStatusSet";
					var jModel = new sap.ui.model.json.JSONModel();
			 		jModel.loadData(sPath, null, false,"GET",false, false, null);
			 		var  loc= this.getView().byId("idStatus");
					loc.unbindAggregation("items");
					loc.setModel(jModel);
					loc.bindAggregation("items", {
						path : "/d/results",
						template : new sap.ui.core.Item({
							key : "{ResStatus}",
							text : "{ResStatusText}"
						})
					});
		},
*/

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

onViewReport:function(e){
	debugger
	this.getView().byId("idReportPanel").setVisible(true);
	this.getView().byId("idVBoxChart").setVisible(false);
	
	this.getView().byId("idViewChartButton").setVisible(true);
	this.getView().byId("idViewReportButton").setVisible(false);
	
	/*this.getView().byId("lblPlant").setVisible(true);
	this.getView().byId("idPlant").setVisible(true);
	this.getView().byId("lblDepartment").setVisible(true);
	this.getView().byId("idDepartment").setVisible(true);
	this.getView().byId("lblReason").setVisible(true);
	this.getView().byId("idReason").setVisible(true);
	this.getView().byId("lblStatus").setVisible(true);
	this.getView().byId("idStatus").setVisible(true);*/
},

onViewChart:function(e){
	debugger
	this.getView().byId("idReportPanel").setVisible(false);
	this.getView().byId("idVBoxChart").setVisible(true);
	
	this.getView().byId("idViewChartButton").setVisible(false);
	this.getView().byId("idViewReportButton").setVisible(true);
	
	/*this.getView().byId("lblPlant").setVisible(false);
	this.getView().byId("idPlant").setVisible(false);
	this.getView().byId("lblDepartment").setVisible(false);
	this.getView().byId("idDepartment").setVisible(false);
	this.getView().byId("lblReason").setVisible(false);
	this.getView().byId("idReason").setVisible(false);
	this.getView().byId("lblStatus").setVisible(false);
	this.getView().byId("idStatus").setVisible(false);*/
},


onClearanceForm:function(oEvent){
	debugger
	var index = oEvent.getSource().getParent().getBindingContextPath().split('/')[1];
	var GUID  = oEvent.getSource().getModel("TableJModel").getData()[index].GUID;
	
	var ClearanceForm = new sap.ui.model.json.JSONModel();
	this._ClearanceFormHelpDialog = sap.ui.xmlfragment("zempdashboard.view.Clearance",this);
	this.getView().addDependent(this._ClearanceFormHelpDialog);
	this._ClearanceFormHelpDialog.setModel(ClearanceForm, "ClearanceForm");
	this._ClearanceFormHelpDialog.open();

	this.clearance(GUID);
},

clearance:function(GUID){
	var that = this;
	var oView = this.getView();
	
	var ClearanceForm = this._ClearanceFormHelpDialog.getModel("ClearanceForm");
	var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";
	var sPathClearanceForm = "/GetEmpClearanceStatusSet?$filter=Guid eq '"+GUID+"'";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	var oParamsClearanceForm = {};
	oParamsClearanceForm.context = "";
	oParamsClearanceForm.urlParameters = "";
	oParamsClearanceForm.success = function(oData, oResponse) {
		debugger
		ClearanceForm.setData(oData.results);
		that.onTableClear();
	};
	oParamsClearanceForm.error = function(oError) {
		jQuery.sap.log.error("Read/Publishing data failed.");
	}.bind(this);
	frameworkODataModel.read(sPathClearanceForm, oParamsClearanceForm);
	frameworkODataModel.attachRequestCompleted(function() {
	});
},

onTableClear:function(){
		debugger
		var that = this;
		var ClearanceStatus = this._ClearanceFormHelpDialog.getModel("ClearanceForm");
		var cTable = sap.ui.getCore().byId("idTableclr");
		var tblrow = cTable.getItems().length;
		for(var i=0;i<tblrow; i++)
		{
			if(ClearanceStatus.oData[i].Status == "X"){
				cTable.getItems()[i].getCells()[1].setText("Completed ");
			}else{
				cTable.getItems()[i].getCells()[1].setText("Not Completed ");
			}
		}
},
	
	onClearOk:function(){
		this._ClearanceFormHelpDialog.close();
		this._ClearanceFormHelpDialog.destroy(true);
	},

	onFormDownload:function(){
		debugger
		/*var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
		var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];*/
		
		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestRequestOutputFormSet(ReqGuid='005056B1061C1EDA8A900D7927D6F96F',RevNo='000000')/$value", true);
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onClear : function(){
	this.getView().byId("idPlant").setSelectedKeys();
	this.getView().byId("idDepartment").setSelectedKeys();
	this.getView().byId("idReason").setSelectedKeys();
	this.getView().byId("idStatus").setSelectedKeys();
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
})
});
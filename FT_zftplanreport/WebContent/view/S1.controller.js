jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("zftplanreport.util.Formatter");

var that, newDate, getExcelJModel, PlanInspRepJModel,nodesModel, table, PlanInspDataModel, oGlobalBusyDialog;
var TestPlanGuid="", TestPlanRevNo="";

sap.ui.define([
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	],
	
function(Export, Controller, JSONModel, ExportTypeCSV, Spreadsheet) {
"use strict";
return sap.ui.controller("zftplanreport.view.S1", {

onInit: function(){
	debugger
	that = this;
	this.bindGetTestRequest();
	sap.ui.core.UIComponent.getRouterFor(this).getRoute("S1").attachMatched(this._onRoute, this);
	
	oGlobalBusyDialog = new sap.m.BusyDialog();
	if (!jQuery.support.touch) {
		this.getView().addStyleClass("sapUiSizeCompact");
	}
	
	var oViewObj = this.getView();
	PlanInspRepJModel = oViewObj.getModel("PlanInspRepJModel");
	if (!PlanInspRepJModel) {
		PlanInspRepJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PlanInspRepJModel, "PlanInspRepJModel");
	}
	
	PlanInspDataModel = oViewObj.getModel("PlanInspDataModel");
	if (!PlanInspDataModel) {
		PlanInspDataModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PlanInspDataModel, "PlanInspDataModel");
	}
	
	getExcelJModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(getExcelJModel, "getExcelJModel");
},
//////////////////////////////////////////////////////////////////////////////////////////////////
_onRoute: function(){
},
//////////////////////////////////////////////////////////////////////////////////////////////////

onVehHelp : function(){
	
	var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4VehRegSet?$filter=TestPlanGuid eq '"+TestPlanGuid+"' and PlanRevNo eq '"+TestPlanRevNo+"'";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpVehRegDialog = new sap.m.SelectDialog({

		title: "Vehicle Registration No.",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{RegNo}",
				customData: [new sap.ui.core.CustomData({
					key: "RegNo",
					value: "{RegNo}"
				})]

			})
		},
		
		liveChange: function(oEvent) {
			debugger
			var sValue = oEvent.getParameters(sValue).value;
			var oFilter = new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		
		confirm: [this._handleVehRegClose, this],
		cancel: [this._handleVehRegClose, this]
	});
	_valueHelpVehRegDialog.setModel(jModel);
	_valueHelpVehRegDialog.open();
},

_handleVehRegClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.getView().byId("idVehNo").setValue(oSelectedItem.getTitle());
	}

},
//////////////////////////////////////////////////////////////////////////////////////////////////
bindGetTestRequest: function(){
	debugger;
	var oView = this.getView();
	var GetTestRequestSetJModel = oView.getModel("GetTestRequestSetJModel");
	if (!GetTestRequestSetJModel) {
		GetTestRequestSetJModel = new sap.ui.model.json.JSONModel();
		oView.setModel(GetTestRequestSetJModel, "GetTestRequestSetJModel");
	}

	var sPathGetRequestSet = "/GetTestPlanForFitmentSet?$filter=Flag eq 'I' and Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsGetRequestSet = {};
	oParamsGetRequestSet.context = "";
	oParamsGetRequestSet.urlParameters = "";
	oParamsGetRequestSet.success = function(oData, oResponse) {
		
		GetTestRequestSetJModel.setData(oData.results);
		
	};
	oParamsGetRequestSet.error = function(oError) {
		jQuery.sap.log.error("read publishing group data failed");
	}.bind(this);
	frameworkODataModel.read(sPathGetRequestSet, oParamsGetRequestSet);
	frameworkODataModel.attachRequestCompleted(function() {
		
	});

},

onPlanChange:function(oEvent){
	debugger
	
	TestPlanGuid	= oEvent.getParameter("selectedItem").getBindingContext("GetTestRequestSetJModel").getObject().PlanGuid;
	TestPlanRevNo	= oEvent.getParameter("selectedItem").getBindingContext("GetTestRequestSetJModel").getObject().PlanRev;
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onSearch: function(){
	debugger;
	oGlobalBusyDialog.open();
	
	that.getView().getModel("PlanInspRepJModel").setData();
	
	var PlanGuid = this.getView().byId("idPlan").getSelectedKey();
	var VehReg = this.getView().byId("idVehNo").getValue();
	var PlanStatus = this.getView().byId("idPlanStatus").getSelectedKey();
	var FitStatus = this.getView().byId("idFitmentStatus").getSelectedKey();
	
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/"; 

	var sPathCartListSet ="/InspectionReportDetailSet?$filter=PlanGuid eq '"+PlanGuid+"' and FitStatus eq '"+FitStatus+"' and RegNo eq '"+VehReg+"' and PlanRevNo eq '"+TestPlanRevNo+"'&$expand=InspReportToDetailNvg,InspReportToVechNvg";
	
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
	var oParamsCartListSet = {};
		
		oParamsCartListSet.success = function(oData, oResponse) {
			debugger
			var data=oData.results;
			var arr=[];
			var final=[];

			for(var i=0 ; i<data.length ; i++){
				debugger
				for(var k=0 ; k < data[i].InspReportToDetailNvg.results.length ; k++){
					debugger
					var veh  = data[i].InspReportToVechNvg.results[0];
					var item = data[i].InspReportToDetailNvg.results[k];
					delete item.__metadata;
					var obj  = data[i];
						delete obj.__metadata;

					obj = Object.assign({},item,veh,obj);
					arr.push(obj);
				}
			}
			getExcelJModel.setData(arr);
			
			var deepData = that.transformTreeData(oData.results);
			PlanInspRepJModel.setData(deepData);
			that.getView().getModel("PlanInspRepJModel").setData(deepData);
			
			that.getView().byId("TreeTableBasicDisplay").collapseAll();
			
			oGlobalBusyDialog.close();
		};
		oParamsCartListSet.error = function(oError) {
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
},
	
transformTreeData: function(nodesIn) {
		var nodes = []; //'deep' object structure
		var nodeMap = {}; //'map', each node is an attribute
		if (nodesIn) {
			var nodeOut;
			var Parent;
		
			for (var i = 0; i < nodesIn.length; i++) {
				var nodeIn = nodesIn[i];
			
				nodeOut = {
						Parent			: nodeIn.Parent,
						Child			: nodeIn.Child,
						PlanGuid		: nodeIn.PlanGuid,
						TestPlanNumber	: nodeIn.TestPlanNumber,
						TestPlanDate	: nodeIn.TestPlanDate,
						RegNo			: nodeIn.RegNo,
						FitmentNo		: nodeIn.FitmentNo,
						FitmentDt		: nodeIn.FitmentDt,
						KmCovered		: nodeIn.KmCovered,
						InspNo			: nodeIn.InspNo,
						InspDt			: nodeIn.InspDt,
						PlanRevNo		: nodeIn.PlanRevNo,
						PlanItemNo		: nodeIn.PlanItemNo,
						LInspNo			: nodeIn.LInspNo,
						FitStatus		: nodeIn.FitStatus,
						children: []
				};
				
				Parent = nodeIn.Parent;
				if (nodeIn.Parent === nodeIn.Child) {
					nodes.push(nodeOut);
				} else if (Parent && Parent > 0) {
			
					var parent = nodeMap[nodeIn.Parent];
					if (parent) {
						nodeOut.PlanGuid 		= "",
						nodeOut.TestPlanNumber 	= "",
						nodeOut.TestPlanDate 	= "",
						nodeOut.RegNo 			= "",
						nodeOut.FitmentNo 		= "",
						nodeOut.FitmentDt 		= "",
						nodeOut.FitStatus 		= "", 
						parent.children.push(nodeOut);
					}
				}
				nodeMap[nodeOut.Child] = nodeOut;
			}
		}
		
		return nodes;
},
//////////////////////////////////////////////////////////////////////////////////////////////////
excelData:function(oData){
	debugger
	var arr=[];	
},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onDetailPress: function(oEvent){
			debugger
			var childpath 	= oEvent.getSource().getBindingContext("PlanInspRepJModel").getPath();
			var parentpath  = oEvent.getSource().getBindingContext("PlanInspRepJModel").getPath("/")[1];
			var planCData   = oEvent.getSource().getBindingContext("PlanInspRepJModel").getObject(childpath);
			var planPData   = this.getView().getModel("PlanInspRepJModel").getData()[parentpath];;

			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/"; 

			//var sPathCartListSet ="/FitmentHeaderSet(PlanGuid='005056B1061C1EEA95DE7DE15DD7281C',PlanRevno='000000',PlanItemNo='0002',RegNo='VEH123',Cart='',LInspNo='00002',FitmentNo='00001',InspNo='00003')?$expand=NavtoFitmentDetail";
			var sPathCartListSet ="/FitmentHeaderSet(PlanGuid='"+planPData.PlanGuid+"',PlanRevno='"+planPData.PlanRevNo+"',PlanItemNo='"+planPData.PlanItemNo+"',RegNo='"+planPData.RegNo+"',Cart='',LInspNo='"+planCData.InspNo+"',FitmentNo='"+planPData.FitmentNo+"',InspNo='')?$expand=NavtoFitmentDetail";
			
			var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			var oParamsCartListSet = {};
				
				oParamsCartListSet.success = function(oData, oResponse) {
					debugger
					
					var selectedData = oData;
					
					var tempjsonString = JSON.stringify(selectedData);
					var jsonstring = tempjsonString.replace(/\//g, "@");
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("S2",{"entity":JSON.stringify(jsonstring)});
				};
				oParamsCartListSet.error = function(oError) {
					jQuery.sap.log.error("read publishing group data failed");
					sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
			frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
			
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
onClear : function()
{

      this.getView().byId("idPlan").setSelectedKey("");
      this.getView().byId("idVehNo").setValue("");
      this.getView().byId("idPlanStatus").setSelectedKey("");
      this.getView().byId("idFitmentStatus").setSelectedKey("A");
      
      TestPlanRevNo="";
      
      PlanInspRepJModel.setData();
      //getExcelJModel.setData();
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onDownload : sap.m.Table.prototype.exportData || function(oEvent) {
	debugger
	
	var oExport = new sap.ui.core.util.Export({
	exportType : new sap.ui.core.util.ExportTypeCSV({
	separatorChar: "\t",
	mimeType: "application/vnd.ms-excel",
	charset: "utf-8",
	fileExtension: "xls",
	fileName : "ssdsd"	
	}),
	
	models : this.getView().getModel("getExcelJModel"),
		rows : {
		path : "/",
	},
	
	columns: [
	{
		name: "Test Plan Number",
		template: {
		content: "{TestPlanNumber}"
		},
	},
	{
		name: "Test Plan Date",
		template: {
		content: "{path:'TestPlanDate',formatter:'zftplanreport.util.formatter.date1'}"
		},
	},	
	{
		name: "Test Plan Item No.",
		template: {
		content: "{PlanItemNo}"
		},
	},	
	{
		name: "Fitment Number",
		template: {
		content: "{FitmentNo}"
		},
	},	
	{
		name: "Fitment Date",
		template: {
		content: "{path:'FitmentDt',formatter:'zftplanreport.util.formatter.date1'}"
		},
	},	
	{
		name: "Fitment Status",
		template: {
		content: "{FitStatusDesc}"
		},
	},	
	{
		name: "Registration Number",
		template: {
		content: "{RegNo}"
		},
	},	
	{
		name: "Inspection No.",
		template: {
		content: "{InspNo}"
		},
	},

	{
		name: "Inspection Date",
		template: {
		content: "{path:'InspDt',formatter:'zftplanreport.util.formatter.date1'}"
		},
	},
	{
		name: "MiloMeter Working",
		template: {
		content: "{path:'MeterStatus',formatter:'zftplanreport.util.formatter.yesNo'}"
		},
	},
	{
		name: "Meter Reading", 
		template: {
		content: "{MeterReading}"
		},
	},
	{
		name: "KM Covered",
		template: {
		content: "{KmCovered}"
		},
	},
	{
		name: "Total KM Covered",
		template: {
		content: "{TKMCovered}"
		},
	},
	{
		name: "Rotation Date",
		template: {
		content: "{path:'LRotDt',formatter:'zftplanreport.util.formatter.date1'}"
			
		},
	},
	{
		name: "Rotation KM",
		template: {
		content: "{LRotKM}"
		},
	},
	{
		name: "Tyre Position",
		template: {
		content: "{TyrePosition}"
		},
	},	
	{
		name: "Group Type",
		template: {
		content: "{GroupType}"
		},
	},
	{
		name: "Stencil Number",
		template: {
		content: "{StnclNumber}"
		},
	},
	{
		name: "Removal Reason",
		template: {
		content: "{RemReasonDesc}"
		},
	},
	{
		name: "Inflation Pressure(PSI)",
		template: {
		content: "{path:'IpConditionO',formatter:'zftplanreport.util.formatter.HotCold'}"
		},
	},
	{
		name: "IP",
		template: {
		content: "{IpPsiO}"
		},
	},
	{
		name: "Hardness(Shore A)",
		template: {
		content: "{HardnessO}"
		},
	},
	{
		name: "Orignal NSD",
		template: {
		content: "{OrgNsdO}"
		},
	},
	{
		name: "G1 NSD",
		template: {
		content: "{G1NsdO}"
		},
	},
	{
		name: "G2 NSD",
		template: {
		content: "{G2NsdO}"
		},
	},
	{
		name: "G3 NSD",
		template: {
		content: "{G3NsdO}"
		},
	},
	{
		name: "G4 NSD",
		template: {
		content: "{G4NsdO}"
		},
	},
	{
		name: "G5 NSD",
		template: {
		content: "{G5NsdO}"
		},
	},
	{
		name: "G6 NSD",
		template: {
		content: "{G6NsdO}"
		},
	},
	{
		name: "KM Suspended",
		template: {
		content: "{KmSuspendedO}"
		},
	},	
	{
		name: "Total KM Covered",
		template: {
		content: "{TotKmCoveredO}"
		},
	},	
	{
		name: "KM/mm Wear",
		template: {
		content: "{KmPerMmO}"
		},
	},
	{
		name: "Projected Mileage",
		template: {
		content: "{MilageProjO}"
		},
	},
	{
		name: "Tread Wear(%)",
		template: {
		content: "{WearO}"
		},
	},	
	{
		name: "Type of Wear",
		template: {
		content: "{WearDesc}"
		},
	},
	
	{
		name: "Gravity",
		template: {
		content: "{GravityO}" 
		},
	},

	{
		name: "PWA",
		template: {
		content: "{PwaDesc}"
		},
	},
	{
		name: "Remarks",
		template: {
		content: "{RemarksO}"
		},
	},
	]

});
	 // download exported file

	oExport.saveFile().always(function() {
		this.destroy();
	});
},	

});
});

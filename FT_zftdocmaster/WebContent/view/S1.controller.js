sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/CheckBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"zftdocmaster/util/Formatter",
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	],

function(Controller, JSONModel, Spreadsheet, MessageBox, CheckBox, Formatter,  Device, Dialog, Button, ImageEditor, ImageEditorContainer) {
"use strict";	
var TestRequestTableJModel, TestPlanTableJModel,FitmentTableJModel, race, testPlanGuid, testRequest, fitmentInspection, claimInspection, selectedGuId, TestRequest, lv_Data,
	j, initialFlag, AppKey,Ext,TestReqGuidNo,doc,AllRequestJModel,AllPlanJModel,AllFitmentJModel;

return sap.ui.controller("zftdocmaster.view.S1", {
	
onInit: function(){
	debugger
	

/******************************Set Initial Date In Input Field**********************************************************************/
	initialFlag = true;
	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
	var date = new Date(), y = date.getFullYear(), m=date.getMonth();
	var firstDay = new Date(y,m,1);
	var currentDate = new Date;
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
	this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
	this.toDate = dateFormat.format(currentDate)+"T00:00:00";
	currentDate = oDateFormat.format(currentDate);
	firstDay = oDateFormat.format(firstDay);
	
	var initialDateValue = firstDay + " - "  + currentDate;
	//this.getView().byId("fromDate").setValue(firstDay);
	//this.getView().byId("toDate").setValue(currentDate);
	
	var oDatePickerHr = this.getView().byId("fromDate"); 
	oDatePickerHr.addEventDelegate({ 

		onAfterRendering: function(){ 
		var oDateInnerHr = this.$().find('.sapMInputBaseInner'); 
		var oIDHr = oDateInnerHr[0].id; 
		$('#'+oIDHr).attr("disabled", "disabled"); 
		}},
	oDatePickerHr);
	
	debugger
	//test request model	
	var oViewObj = this.getView();
	   TestRequestTableJModel = oViewObj.getModel("TestRequestTableJModel");
		if (!TestRequestTableJModel) {
		TestRequestTableJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(TestRequestTableJModel, "TestRequestTableJModel");
		}
		
	//test plan model		
		var oViewObj = this.getView();
		 TestPlanTableJModel = oViewObj.getModel("TestPlanTableJModel");
		if (!TestPlanTableJModel) {
		TestPlanTableJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(TestPlanTableJModel, "TestPlanTableJModel");
		}
		
	//fitment model 	
		var oViewObj = this.getView();
		 debugger
		 FitmentTableJModel = oViewObj.getModel("FitmentTableJModel");
		if (!FitmentTableJModel) {
			FitmentTableJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(FitmentTableJModel, "FitmentTableJModel");
		}
		
	//claim inspection model	
		var oViewObj = this.getView();
		 debugger
		var ClaimInspectionTableJModel = oViewObj.getModel("ClaimInspectionTableJModel");
		if (!ClaimInspectionTableJModel) {
			ClaimInspectionTableJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(ClaimInspectionTableJModel, "ClaimInspectionTableJModel");
		}

},

onAfterRendering:function(){
	debugger
	if(initialFlag){
			if (!this._InitialDialog) {
				
				this._InitialDialog = sap.ui.xmlfragment(
					"zftdocmaster.view.Intial", this);
				this.getView().addDependent(this._InitialDialog);}
			this._InitialDialog.open();
			
			this._InitialDialog.setEscapeHandler(
					function(o){ 
						o.reject(); 
					//o.resolve();
					});
	}	
	
	var oDatePickerHr = this.getView().byId("toDate"); 
	oDatePickerHr.addEventDelegate({ 

		onAfterRendering: function(){ 
		var oDateInnerHr = this.$().find('.sapMInputBaseInner'); 
		var oIDHr = oDateInnerHr[0].id; 
		$('#'+oIDHr).attr("disabled", "disabled"); 
		}},
	oDatePickerHr); 

},

/***********************************************On Cancel Button*************************************************************************************/
Oncancel : function(){
	this._helpdialog.close();
	this._helpdialog.destroy(true);
	this._helpdialog = undefined;
	
},
OnReqcancel : function(){
	this._Reqhelpdialog.close();
	this._Reqhelpdialog.destroy(true);
	this._Reqhelpdialog = undefined;
},
OnFtInspcancel : function(){
	this._FtInsphelpdialog.close();
	this._FtInsphelpdialog.destroy(true);
	this._FtInsphelpdialog = undefined;
},

/*************************************************************************************************************************************/

/*
var tableid = this.getView().byId("attachmentTable"); 
	var TestPlanTableJModel= tableid.getModel();
	TestPlanTableJModel.setData("");
	TestPlanTableJModel.refresh();
	*/
/*******************************************On Master Change**************************************************************************************/
OnFragOk:function(){
	debugger
	AppKey= sap.ui.getCore().byId("idMaster").getSelectedKey();
	if(AppKey =="01"){
		this.getView().byId("idpage").setTitle("Test Request");
		this.getView().byId("idlbPlanStatus").setText("Request Status");
		this.getView().byId("Panel1").setVisible(true);
		this.getView().byId("idStatus").setVisible(true);
		this.getView().byId("fromDate").setVisible(false);
		this.getView().byId("idClear").setVisible(true);
		//this.getView().byId("idDownloadAll").setVisible(true);
		this.getView().byId("toDate").setVisible(false);
		this.getView().byId("idSearch").setVisible(true);
		this.getView().byId("idTstRequest").setVisible(true);
		this.getView().byId("idVechileNumber").setVisible(false);
		this.getView().byId("idTestPlan").setVisible(false);
		this.getView().byId("idFitmentStatus").setVisible(false);
		this.getView().byId("Panel2").setVisible(false);
		this.getView().byId("idtblpanel1").setVisible(true);
		this.getView().byId("idtblpanel2").setVisible(false);
		this.getView().byId("idtblpanel3").setVisible(false);
	
		
	}else if(AppKey == "02"){
		this.getView().byId("idpage").setTitle("Test Plan");
		this.getView().byId("idVechileNumber").setVisible(false);
		this.getView().byId("fromDate").setVisible(false);
		this.getView().byId("idClear").setVisible(true);
		//this.getView().byId("idDownloadAll").setVisible(true);
		this.getView().byId("toDate").setVisible(false);
		this.getView().byId("idSearch").setVisible(true);
		this.getView().byId("idTestRequesttable").setVisible(false);
		this.getView().byId("IdTestRequest").setVisible(false);
		this.getView().byId("idStatus").setVisible(true);
		this.getView().byId("idTstRequest").setVisible(false);
		this.getView().byId("idTestPlan").setVisible(true);
		this.getView().byId("Panel1").setVisible(true);
		this.getView().byId("idFitmentStatus").setVisible(false);
		this.getView().byId("Panel2").setVisible(false);
		this.getView().byId("idtblpanel1").setVisible(false);
		this.getView().byId("idtblpanel2").setVisible(true);
		this.getView().byId("idtblpanel3").setVisible(false);
		
	}else if(AppKey == "03"){
		this.getView().byId("idpage").setTitle("Fitment and Inspection");
		this.getView().byId("idVechileNumber").setVisible(true);
		this.getView().byId("fromDate").setVisible(false);	
		this.getView().byId("idClear").setVisible(true);
		//this.getView().byId("idDownloadAll").setVisible(true);
		this.getView().byId("toDate").setVisible(false);
		this.getView().byId("idSearch").setVisible(true);
		this.getView().byId("idTestRequesttable").setVisible(false);
		this.getView().byId("IdTestRequest").setVisible(false);
		this.getView().byId("idStatus").setVisible(true);
		this.getView().byId("idTstRequest").setVisible(false);
		this.getView().byId("idTestPlan").setVisible(true);
		this.getView().byId("Panel1").setVisible(true);
		this.getView().byId("idFitmentStatus").setVisible(true);
		this.getView().byId("Panel2").setVisible(true);
		this.getView().byId("idtblpanel1").setVisible(false);
		this.getView().byId("idtblpanel2").setVisible(false);
		this.getView().byId("idtblpanel3").setVisible(true);
		
	}
	
	this._InitialDialog.close();
	this._InitialDialog.destroy(); 
	this._InitialDialog=undefined;
	
},

/************************************************F4 Test Request no **************************************************************/
onTestRequestNo:function(){
	debugger
	//var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/GetTestRequestForTestPlanSet";
	var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4TestReqImageSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var valueTestRequestHelpDialog = new sap.m.SelectDialog({
				title : "Test Request Number",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
								title : "{TestRequestNumber}",
								customData : [ new sap.ui.core.CustomData({
											key : "{ReqGuid}",
											value : "{TestRequestNumber}"
												
										}) ],
							}),
				},
	liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("TestRequestNumber",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
	},
		
	confirm : [ this._handleTestRequestHelp, this ],
	cancel :  [ this._handleTestRequestHelp, this ]
	});
	
	valueTestRequestHelpDialog.setModel(jModel);
	valueTestRequestHelpDialog.open();
	},
	_handleTestRequestHelp : function(oEvent) {
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	var obj = oSelectedItem.getBindingContext().getObject();
	        	TestReqGuidNo = obj.ReqGuid;
			    this.getView().byId("idTstRequest").setValue(oSelectedItem.getTitle());
	         }		
},
/************************************************F4 For Test Plan Number****************************************/
onTstPlanNo: function(){
	debugger
	var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4TestPlanSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var valueTestPlanHelpDialog = new sap.m.SelectDialog({
				title : "Test Plan Number",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
								title : "{PlanNumber}",
								customData : [ new sap.ui.core.CustomData({
											key : "{PlanGuid}",
											value : "{PlanNumber}"
												
										}) ],
							}),
				},
	liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("PlanRevNo",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
	},
		
	confirm : [ this._handleTestPlanHelp, this ],
	cancel :  [ this._handleTestPlanHelp, this ]
	});
	
	valueTestPlanHelpDialog.setModel(jModel);
	valueTestPlanHelpDialog.open();
	},
	
	_handleTestPlanHelp : function(oEvent) {
		debugger

		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	var obj = oSelectedItem.getBindingContext().getObject();
	        	testPlanGuid = obj.PlanGuid;
			    this.getView().byId("idTestPlan").setValue(oSelectedItem.getTitle());
	         }		
},
/*************************************************F4 For Vehicle Number**********************************************************************************/
onVechileNumber: function(){
	debugger
	
	var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4VehRegSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var valueVehicleNumberHelpDialog = new sap.m.SelectDialog({
				title : "Vehicle Number",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
								title : "{RegNo}",
								customData : [ new sap.ui.core.CustomData({
											key : "key",
											value : "{RegNo}"
												
										}) ],
							}),
				},
	liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("RegNo",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
	},
		
	confirm : [ this._handleVehicleNumberHelp, this ],
	cancel :  [ this._handleVehicleNumberHelp, this ]
	});
	
	valueVehicleNumberHelpDialog.setModel(jModel);
	valueVehicleNumberHelpDialog.open();
	},
	
	_handleVehicleNumberHelp : function(oEvent) {
		debugger

		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	var obj = oSelectedItem.getBindingContext().getObject();
	        /*	testPlan = obj.PlanGuid;*/
			    this.getView().byId("idVechileNumber").setValue(oSelectedItem.getTitle());
	         }		
},


/**********************************************On Search Button Press**********************************************************************************/	
OnSearch : function() {                                              
		debugger
		var check		= false;
		var that 		= this;
		var TestReqNo 	= this.getView().byId("idTstRequest").getValue();
		var Status 		= this.getView().byId("idStatus").getSelectedKey();
		var FitStatus 	= this.getView().byId("idFitmentStatus").getSelectedKey();
		var PlanNo 		= this.getView().byId("idTestPlan").getValue();
		var VehNo 		= this.getView().byId("idVechileNumber").getValue();
		if(testPlanGuid == undefined){
			testPlanGuid = "";
		}
		
		if(TestReqGuidNo == undefined){
			TestReqGuidNo = "";
		}
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		    pattern : "dd-MM-yyyy"
		});
		var fromDate = this.getView().byId("fromDate").getValue();
		var fromSplit = fromDate.split(".");
		var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		var dateFrom = fValue+"T00:00:00";
		
		var toDate = this.getView().byId("toDate").getValue();		
		var toSplit = toDate.split(".");
		var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
		var dateTo = tValue+"T00:00:00";		
		
		/*if(dateTo == "undefined-undefined-T00:00:00" && dateFrom == "undefined-undefined-T00:00:00" ){
			dateFrom = null;
			dateTo   = null;
		}
		
		if(dateTo == "undefined-undefined-T00:00:00"){
			dateTo = null;
		}*/
		
		if(dateTo < dateFrom){
			sap.m.MessageToast.show("Search Begin Date Can't Be Greater Than Search End Date.");
			this.getView().byId("fromDate").setValueState("Error");
			this.getView().byId("toDate").setValueState("Error");
			return false
			}else{
			this.getView().byId("fromDate").setValueState("None");
			this.getView().byId("toDate").setValueState("None");
			}
		var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
	
	if(AppKey == "01"){
		
		if(dateTo == "undefined-undefined-T00:00:00" && dateFrom == "undefined-undefined-T00:00:00"){
			var sPath = "GetRequestImageSet?$expand=GetImageDataSet&$filter=DateFrom eq "+null+" and DateTo eq "+null+" and Guid eq '"+TestReqGuidNo+"' and Status eq '"+Status+"'"		
		}
		else if(dateTo == "undefined-undefined-T00:00:00"){
			var sPath = "GetRequestImageSet?$expand=GetImageDataSet&$filter=DateFrom eq datetime'"+dateFrom+"' and DateTo eq "+null+" and Guid eq '"+TestReqGuidNo+"' and Status eq '"+Status+"'"		
		}
		else {
			var sPath = "GetRequestImageSet?$expand=GetImageDataSet&$filter=DateFrom eq datetime'"+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and Guid eq '"+TestReqGuidNo+"' and Status eq '"+Status+"'"
		}
		
		 var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			 oReadModel.setHeaders({"Content-Type" : "application/json"});
		var fncSuccess = function(oData, oResponse){
			debugger
			/*if(oData.results.length>0){
				that.getView().byId("idDownloadAllReq").setVisible(true);
			}*/
			if(oData.results.length==0){
				sap.m.MessageToast.show("No Data found");
			}
			
			TestRequestTableJModel.setData(oData.results);
			
			 var tblId = that.getView().byId("IdTestRequest");
	            for(var i=0; i<TestRequestTableJModel.oData.length; i++){
	            	if(TestRequestTableJModel.oData[i].GetImageDataSet.results.length == "0"){
	            		tblId.getItems()[i].getCells()[8].setVisible(false);
	            	} else {
	            		tblId.getItems()[i].getCells()[8].setVisible(true);
	            	}
	            }
		}
		var fncError = function(oError) { // error callback
		}
		oReadModel.read(sPath, {
			  success : fncSuccess,
			   error : fncError
			   });
		
	}
	else if(AppKey == "02"){
		
		if(dateTo == "undefined-undefined-T00:00:00" && dateFrom == "undefined-undefined-T00:00:00"){
			var sPath = "GetPlanImagesSet?$expand=PlanDataToImageNvg&$filter=PlanGuid eq '"+testPlanGuid+"' and DateFrom eq "+null+" and DateTo eq "+null+" and Status eq '"+Status+"' and RegNo eq '' and Flag eq 'P' and Complete eq ''"	
		}
		else if(dateTo == "undefined-undefined-T00:00:00"){
			var sPath = "GetPlanImagesSet?$expand=PlanDataToImageNvg&$filter=PlanGuid eq '"+testPlanGuid+"' and DateFrom eq datetime'"+dateFrom+"' and DateTo eq "+null+" and Status eq '"+Status+"' and RegNo eq '' and Flag eq 'P' and Complete eq ''"		
		}
		else{
			var sPath = "GetPlanImagesSet?$expand=PlanDataToImageNvg&$filter=PlanGuid eq '"+testPlanGuid+"' and DateFrom eq datetime'"+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and Status eq '"+Status+"' and RegNo eq '' and Flag eq 'P' and Complete eq ''"
		}
		
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			 oReadModel.setHeaders({"Content-Type" : "application/json"});
		var fncSuccess = function(oData, oResponse){
			debugger
			/*if(oData.results.length>0){
				that.getView().byId("idDownloadAllPlan").setVisible(true);
			}*/
			if(oData.results.length==0){
				sap.m.MessageToast.show("No Data found");
			} 
			
			TestPlanTableJModel.setData(oData.results);
			var tblId = that.getView().byId("attachmentTable");
			for(var i=0; i<TestPlanTableJModel.oData.length; i++){
            	if(TestPlanTableJModel.oData[i].PlanDataToImageNvg.results.length == "0"){
            		tblId.getItems()[i].getCells()[5].setVisible(false);
            	} else {
            		tblId.getItems()[i].getCells()[5].setVisible(true);
            	}
            }
			
		}
		var fncError = function(oError) { // error callback
		}
		oReadModel.read(sPath, {
			  success : fncSuccess,
			   error : fncError
			   });
		
	} else if(AppKey == "03"){
		
		if(dateTo == "undefined-undefined-T00:00:00" && dateFrom == "undefined-undefined-T00:00:00"){
			var sPath = "GetPlanImagesSet?$expand=PlanDataToImageNvg&$filter=PlanGuid eq '"+testPlanGuid+"' and DateFrom eq "+null+" and DateTo eq "+null+" and Status eq '"+Status+"' and RegNo eq '"+VehNo+"' and Flag eq 'I' and Complete eq '"+FitStatus+"'"
		}
		else if(dateTo == "undefined-undefined-T00:00:00"){
			var sPath = "GetPlanImagesSet?$expand=PlanDataToImageNvg&$filter=PlanGuid eq '"+testPlanGuid+"' and DateFrom eq datetime'"+dateFrom+"' and DateTo eq "+null+" and Status eq '"+Status+"' and RegNo eq '"+VehNo+"' and Flag eq 'I' and Complete eq '"+FitStatus+"'"
		}
		else{
			var sPath = "GetPlanImagesSet?$expand=PlanDataToImageNvg&$filter=PlanGuid eq '"+testPlanGuid+"' and DateFrom eq datetime'"+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and Status eq '"+Status+"' and RegNo eq '"+VehNo+"' and Flag eq 'I' and Complete eq '"+FitStatus+"'"	
		}
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			 oReadModel.setHeaders({"Content-Type" : "application/json"});
		var fncSuccess = function(oData, oResponse){
			debugger
			/*if(oData.results.length>0){
				that.getView().byId("idDownloadAllFit").setVisible(true);
			}*/
			if(oData.results.length==0){
				sap.m.MessageToast.show("No Data found");
			}
			
			FitmentTableJModel.setData(oData.results);
			var tblId = that.getView().byId("IdInspectionTable");
			for(var i=0; i<FitmentTableJModel.oData.length; i++){
            	if(FitmentTableJModel.oData[i].PlanDataToImageNvg.results.length == "0"){
            		tblId.getItems()[i].getCells()[7].setVisible(false);
            	}else
            		tblId.getItems()[i].getCells()[7].setVisible(true);
            }
			
		}
		var fncError = function(oError) { // error callback
		}
		oReadModel.read(sPath, {
			  success : fncSuccess,
			   error : fncError
			   });
	}
		
		
		
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onDownloadAllReq:function(){
	debugger
	
	var getimgData = this.getView().getModel("TestRequestTableJModel").getData();
	AllRequestJModel = new sap.ui.model.json.JSONModel();
	var imgArr = [];
	
	for(var i=0; i<TestRequestTableJModel.oData.length; i++){
		if(TestRequestTableJModel.oData[i].GetImageDataSet.results.length != "0"){
			for(var j=0 ; j<TestRequestTableJModel.oData[i].GetImageDataSet.results.length ; j++){
				imgArr.push(TestRequestTableJModel.oData[i].GetImageDataSet.results[j]);
			}
		}
	}
	AllRequestJModel.setData(imgArr);
	
	var host = window.location.host;
	var protocol = window.location.protocol;
	var urlprefix = protocol + "//" + host;		

	for(var i=0 ; i<imgArr.length ; i++){
			imgArr[i].Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
	
	
	
	}
},

/****************************************************Test Request*************************************************/
onTestReqBtnPress : function(evt){
	debugger
	var varIndex = evt.getSource().getBindingContext("TestRequestTableJModel").getPath().split('/')[1];
	this._Reqhelpdialog = sap.ui.xmlfragment("zftdocmaster.view.TestReqImgFrag", this);
	this.TestReqGetImage(varIndex);
	this._Reqhelpdialog.open();
},

TestReqGetImage:function(varIndex){
	debugger
	var Imgdata = this.getView().getModel("TestRequestTableJModel");
	var getimgData = Imgdata.getData();
	var getReqImageJModel = new sap.ui.model.json.JSONModel();
	var idReqimgtble = sap.ui.getCore().byId("idtestReqUpldColl");
	idReqimgtble.setModel(getReqImageJModel,"getReqImageJModel");
	getReqImageJModel.setData(getimgData[varIndex].GetImageDataSet.results);
	this.getReqimageStrim();
},

getReqimageStrim :function(){
	debugger

	var TestReqoUploadModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		
		sap.ui.getCore().byId("idtestReqUpldColl").setModel(TestReqoUploadModel,"TestReqoUploadModel"); 

	var dataa = sap.ui.getCore().byId("idtestReqUpldColl").getModel("getReqImageJModel");
	var results = dataa.oData;
	sap.ui.getCore().byId("idTestReqUploaded").setText("Uploaded:" + "(" + results.length + ")").addStyleClass("textColor");

    var host = window.location.host;
    var protocol = window.location.protocol;
    var urlprefix = protocol + "//" + host;		


	/*for(var i=0;i<results.length;i++){
		var ext = results[i].FileName.substring(results[i].FileName.length,results[i].FileName.length-3)
		if(ext== "gif" || ext== "jpg"){
			 var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
              results[i].Thumb = sURL;
		} else {
			var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
            results[i].Url = sURL; 
		}
     }*/
    
    for(var i=0;i<results.length;i++){
			var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
            results[i].Url = sURL; 
     }

	TestReqoUploadModel.setData({
               items:dataa.oData
            });
       

},

/*onTestReqSelect:function(oEvt){
	debugger
	var getselected = oEvt.getSource().getSelected();
	var getuploadid = sap.ui.getCore().byId("idtestReqUpldColl");
	var lngth = getuploadid.getItems().length;
		for(var i=0; i<lngth; i++){
			if(getselected){
				getuploadid.getItems()[i].setSelected(true);
			}else{
				getuploadid.getItems()[i].setSelected(false);
			}
			
		}
},*/

onTestReqDownloadItem: function() {
	debugger
	var oUploadCollection = sap.ui.getCore().byId("idtestReqUpldColl");
	var aSelectedItems = oUploadCollection.getSelectedItems();
	if (aSelectedItems) {
		for (var i = 0; i < aSelectedItems.length; i++) {
			oUploadCollection.downloadItem(aSelectedItems[i], true);
		}
	} else {
		MessageToast.show("Select an item to download");
	}
},


/****************************************************Test Plan********************************************************************/	
onTestPlanBtnPress : function(evt){
	debugger
	var varIndex = evt.getSource().getBindingContext("TestPlanTableJModel").getPath().split('/')[1];
	this._helpdialog = sap.ui.xmlfragment("zftdocmaster.view.ShowImgFrag", this);
	this.TestPlanGetImage(varIndex);
	this._helpdialog.open();
},	 


TestPlanGetImage : function(varIndex){
	debugger
	var Imgdata = this.getView().getModel("TestPlanTableJModel");
	var getimgData = Imgdata.getData();
	var getPlanImageJModel = new sap.ui.model.json.JSONModel();
	var idReqimgtble = sap.ui.getCore().byId("idTestPlanUpColl");
	idReqimgtble.setModel(getPlanImageJModel,"getPlanImageJModel");
	getPlanImageJModel.setData(getimgData[varIndex].PlanDataToImageNvg.results); 
	
	/*if(getPlanImageJModel.oData.length == "0"){
		new sap.m.MessageToast.show("No Attachments");
		return false;
	}*/
	
	this.getPlanimageStrim();
},

getPlanimageStrim :function(){ 
	debugger
	var TestPlanCollModel = new sap.ui.model.json.JSONModel({
		items : []
	});
	
	sap.ui.getCore().byId("idTestPlanUpColl").setModel(TestPlanCollModel,"TestPlanCollModel"); 

var dataa = sap.ui.getCore().byId("idTestPlanUpColl").getModel("getPlanImageJModel");
var results = dataa.oData;
sap.ui.getCore().byId("idTestPlanUploaded").setText("Uploaded:" + "(" + results.length + ")").addStyleClass("textColor");


var host = window.location.host;
var protocol = window.location.protocol;
var urlprefix = protocol + "//" + host;		

	/*for(var i=0;i<results.length;i++){
		var ext = results[i].FileName.substring(results[i].FileName.length,results[i].FileName.length-3)
		if(ext== "gif" || ext== "jpg"){
			 var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
	          results[i].ThumbNailUrl = sURL;
		} else {
			var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
	        results[i].Url = sURL; 
		}
	}*/

	for(var i=0;i<results.length;i++){
		var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
        results[i].Url = sURL; 
	}

TestPlanCollModel.setData({
           items:dataa.oData
        });
},

/*onTestPlanSelect:function(oEvt){
	debugger
	var getselected = oEvt.getSource().getSelected();
	var getuploadid = sap.ui.getCore().byId("idTestPlanUpColl");
	var lngth = getuploadid.getItems().length;
		for(var i=0; i<lngth; i++){
			if(getselected){
				getuploadid.getItems()[i].setSelected(true);
			}else{
				getuploadid.getItems()[i].setSelected(false);
			}
			
		}
},*/

onTestPlanDownloadItem: function() {
	debugger
	var oUploadCollection = sap.ui.getCore().byId("idTestPlanUpColl");
	var aSelectedItems = oUploadCollection.getSelectedItems();
	if (aSelectedItems) {
		for (var i = 0; i < aSelectedItems.length; i++) {
			oUploadCollection.downloadItem(aSelectedItems[i], true);
		}
	} else {
		MessageToast.show("Select an item to download");
	}
},

/************************************************Fitment Inspection******************************************************/	
onFtInspBtnPress : function(evt){
	debugger
	var varIndex = evt.getSource().getBindingContext("FitmentTableJModel").getPath().split('/')[1];
	this._FtInsphelpdialog = sap.ui.xmlfragment("zftdocmaster.view.FtInspFrag", this);
	this.FtInspGetImage(varIndex);
	this._FtInsphelpdialog.open();
},	

FtInspGetImage : function(varIndex){
	debugger	
	var Imgdata = this.getView().getModel("FitmentTableJModel");
	var getimgData = Imgdata.getData();
	var getFtInspImageJModel = new sap.ui.model.json.JSONModel();
	var idFtInspimgtble = sap.ui.getCore().byId("idFtInspUpldColl");
	idFtInspimgtble.setModel(getFtInspImageJModel,"getFtInspImageJModel");
	getFtInspImageJModel.setData(getimgData[varIndex].PlanDataToImageNvg.results);
	
/*	if(getFtInspImageJModel.oData.length == "0"){
		new sap.m.MessageToast.show("No Attachments");
		return false;
	}*/
	
	this.getFtInspimageStrim();
},

getFtInspimageStrim : function(){
	debugger
	var FtInspCollModel = new sap.ui.model.json.JSONModel({
		items : []
	});
	
	sap.ui.getCore().byId("idFtInspUpldColl").setModel(FtInspCollModel,"FtInspCollModel"); 

var dataa = sap.ui.getCore().byId("idFtInspUpldColl").getModel("getFtInspImageJModel");
var results = dataa.oData;
sap.ui.getCore().byId("idFtInspUploaded").setText("Uploaded:" + "(" + results.length + ")").addStyleClass("textColor");


var host = window.location.host;
var protocol = window.location.protocol;
var urlprefix = protocol + "//" + host;		


	/*for(var i=0;i<results.length;i++){
		var ext = results[i].FileName.substring(results[i].FileName.length,results[i].FileName.length-3)
		if(ext== "gif" || ext== "jpg"){
			 var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
	          results[i].ThumbNailUrl = sURL;
		} else {
			var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
	        results[i].Url = sURL; 
		} 
	}*/

	for(var i=0;i<results.length;i++){
		var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
        results[i].Url = sURL; 
	}

FtInspCollModel.setData({
           items:dataa.oData
        });
	
},

/*onFtInspSelect:function(oEvt){
	debugger
	var getselected = oEvt.getSource().getSelected();
	var getuploadid = sap.ui.getCore().byId("idFtInspUpldColl");
	var lngth = getuploadid.getItems().length;
		for(var i=0; i<lngth; i++){
			if(getselected){
				getuploadid.getItems()[i].setSelected(true);
			}else{
				getuploadid.getItems()[i].setSelected(false);
			}
			
		}
},*/

onFtInspDownloadItem: function() {
	debugger
	var oUploadCollection = sap.ui.getCore().byId("idFtInspUpldColl");
	var aSelectedItems = oUploadCollection.getSelectedItems();
	if (aSelectedItems) {
		for (var i = 0; i < aSelectedItems.length; i++) {
			oUploadCollection.downloadItem(aSelectedItems[i], true);
		}
	} else {
		MessageToast.show("Select an item to download");
	}
},


/**********************************************Clear all the values****************************************************************************/	
	onClear:function(){
		debugger
		if(AppKey == "01"){
			this.getView().byId("idTstRequest").setValue("");
			this.getView().byId("idStatus").setSelectedKey("");
			this.getView().byId("fromDate").setValue("");
			this.getView().byId("toDate").setValue("")
			TestReqGuidNo = "";
			
			var vartblid = this.getView().byId("IdTestRequest");
			var ModelData = vartblid.getModel("TestRequestTableJModel");
			    ModelData.setData([]);
		} 
		else if(AppKey == "02"){
			this.getView().byId("idTestPlan").setValue("");
			this.getView().byId("idStatus").setSelectedKey("");
			this.getView().byId("fromDate").setValue("");
			this.getView().byId("toDate").setValue("")
			testPlanGuid = "";
		
			var vartblid = this.getView().byId("attachmentTable");
			var ModelData = vartblid.getModel("TestPlanTableJModel");
		    	ModelData.setData([]);
		} else {
		
			this.getView().byId("idTestPlan").setValue("");
			this.getView().byId("idStatus").setSelectedKey("");
			this.getView().byId("idFitmentStatus").setSelectedKey("");
			this.getView().byId("idVechileNumber").setValue("");
			this.getView().byId("fromDate").setValue("");
			this.getView().byId("toDate").setValue("")
			testPlanGuid = "";
		
			var vartblid = this.getView().byId("IdInspectionTable");
			var ModelData = vartblid.getModel("FitmentTableJModel");
		    	ModelData.setData([]);
		}
		
		
	},
	
/*********************************************************************************************************************/	
OnFragCancel:function(){
	window.history.back();
},
/*********************************************************************************************************************/	
});
});

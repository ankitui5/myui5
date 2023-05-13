sap.ui.define([
	"sap/ui/model/json/JSONModel", 
	"sap/m/UploadCollectionParameter" 
	],

function( JSONModel,UploadCollectionParameter) {
"use strict";

jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("zftplanreport.util.formatter");

var that;
var oDataModel, readingModel, WearTypeJModel, PwaJModel, GravityJModel;
var gModel, color, img = [];
var uploadFlag;
var attachmentModel2;

var DataArticles, kunnr, hubName, EnrolMode, hubCode, RegNo, FitNo, 
PlnNo, InspNo, PlanGuid, RevNo, ItemNumber, TyrePos, TyreStn, LastInspNo, Cart,
WearClass, NsdClass, ConfigCode, milo, lmilo, km, FitmentDate, LastInspDt, inspdt,
KmCovered, TotKmCovered, TestPlanNo, gv_flag,TestPlanNumber,RegNo;

sap.ui.controller("zftplanreport.view.S2", {

	onInit: function() {
		debugger;
		that = this;
		this.fitmentTable1 = [];
		if (!jQuery.support.touch)
		{
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {
		}
			
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zftplanreport.css.style", ".css"));
		
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("S2").attachMatched(this._onRoute, this);
		
		that.bindApplicationSet();
		that.bindSegmentSet();
		that.bindConfigurationSet();
		that.bindFitmentAxleSet();
		that.bindCompCodeSet();
		that.bindWearTypeSet();
		that.bindGravityTypeSet();
		that.bindPwaTypeSet();
		that.bindRemovalReason();
		this.setTestMethod();
		this.bindLocationListSet();

		//this.getFitmentTable1Object();
		
		// start of document upload
		var attachmentModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentModel,"attachmentModel");
		attachmentModel.setData([]);
		
		var oUploadModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		
		this.getView().setModel(oUploadModel,"oUploadModel");
		
		attachmentModel2 = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentModel2,"attachmentModel2");
		attachmentModel2.setData([]);
		
		var oUploadModel2 = new sap.ui.model.json.JSONModel({
			items : []
		});
		
		this.getView().setModel(oUploadModel2,"oUploadModel2");
		// end of document upload
		
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
	_onRoute : function(e){
		debugger
		that = this;

		var tempjsonString = e.getParameter("arguments").entity;
		var jsonstring = tempjsonString.replace(/@/g, "/");
		var tempSelectedData = JSON.parse(jsonstring);
		this.SelectedData  = JSON.parse(tempSelectedData);
		TestPlanNumber	=  this.SelectedData.TestPlanNumber;
		RegNo			=  this.SelectedData.RegNo;
		this.getView().byId("IDTest").setText(TestPlanNumber);
		this.getView().byId("IDVeh").setText(RegNo);
		
		oDataModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oDataModel,"oDataModel");
		oDataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		oDataModel.setData(this.SelectedData);
		
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("A");
		
		this.getAttachmentDetails(this.SelectedData.PlanGuid,this.SelectedData.FitmentNo,
				this.SelectedData.InspNo,
				this.SelectedData.PlanRevno,
				this.SelectedData.PlanItemNo,
				this.SelectedData.RegNo); 										// document upload
		
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onAfterRendering: function(){
	
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	showReading : function(evt){
			debugger
				
				var table= this.getView().byId("idInspectionTable")
				this.selIndex = table.getItems().indexOf(evt.getSource().getParent());
				this.rowDataReading = this.getView().getModel("oDataModel").getData().NavtoFitmentDetail.results[this.selIndex];
				var grooveNo = this.rowDataReading.Groove;
				
				readingModel = new sap.ui.model.json.JSONModel();
				readingModel.setData(this.rowDataReading);
				
				if (!that.readingFrag) {
					that.readingFrag = sap.ui.xmlfragment(
							"zftplanreport.view.ReadingFragment", that);
				}

				that.readingFrag.open();
				sap.ui.getCore().byId("formReading").setModel(readingModel,"readingModel");
				
				sap.ui.getCore().byId("formReading").setModel(WearTypeJModel,"WearTypeJModel");
				sap.ui.getCore().byId("formReading").setModel(PwaJModel,"PwaJModel");
				sap.ui.getCore().byId("formReading").setModel(GravityJModel,"GravityJModel");

				sap.ui.getCore().byId("RD_01").setText("Plan: " + that.SelectedData.TestPlanNumber);
				sap.ui.getCore().byId("RD_02").setText("Stencil: " + that.rowDataReading.StnclNumber);
				sap.ui.getCore().byId("RD_03").setText("Tyre Position: " + that.rowDataReading.TyrePosition);
			
				var coveredO = that.getView().byId("LKMCovered").getText();
				coveredO	 = coveredO - that.rowDataReading.KmSuspendedO;
				sap.ui.getCore().byId("idTotKmCovO").setValue( that.rowDataReading.TotKmCoveredO );
				
				var oldGroove = [	
					sap.ui.getCore().byId("oG1"),
					sap.ui.getCore().byId("oG2"),
					sap.ui.getCore().byId("oG3"),
					sap.ui.getCore().byId("oG4"),
					sap.ui.getCore().byId("oG5"),
					sap.ui.getCore().byId("oG6"),
				];
				jQuery.each(oldGroove, function(i, input) {
						if(grooveNo > i){
							input.setVisible(true);
						}else{
							input.setVisible(false);
						}
				});
				var oldGrooveLbl = [	
					sap.ui.getCore().byId("oG1lbl"),
					sap.ui.getCore().byId("oG2lbl"),
					sap.ui.getCore().byId("oG3lbl"),
					sap.ui.getCore().byId("oG4lbl"),
					sap.ui.getCore().byId("oG5lbl"),
					sap.ui.getCore().byId("oG6lbl"),
				];
				jQuery.each(oldGrooveLbl, function(i, input) {
					if(grooveNo > i){
						input.setVisible(true);
					}else{
						input.setVisible(false);
					}
			});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onTabelEntriesClose:function(){
			debugger
			that.readingFrag.close();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		bindRemovalReason: function(){
			var oView = this.getView();
			var RemJModel = oView.getModel("RemJModel");
			if (!RemJModel) {
				RemJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(RemJModel, "RemJModel");
			}
			var sPathRemReasonSet = "/F4RemovalReasonSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsRemReasonSet = {};
			oParamsRemReasonSet.context = "";
			oParamsRemReasonSet.urlParameters = "";
			oParamsRemReasonSet.success = function(oData, oResponse) { // success handler
			    debugger
				RemJModel.setData(oData.results);
				
			};
			oParamsRemReasonSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathRemReasonSet, oParamsRemReasonSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		bindWearTypeSet: function(){
			var oView = this.getView();
			//WearTypeJModel = oView.getModel("WearTypeJModel");
			if (!WearTypeJModel) {
				WearTypeJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(WearTypeJModel, "WearTypeJModel");
			}
			var sPathTyrePositionSet = "/F4WearTypeSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.success = function(oData, oResponse) {
					
				WearTypeJModel.setData(oData.results);
			};
			oParamsTyrePositionSet.error = function(oError) {
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		bindPwaTypeSet: function(){
			var oView = this.getView();
			//PwaJModel = oView.getModel("PwaJModel");
			if (!PwaJModel) {
				PwaJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(PwaJModel, "PwaJModel");
			}
			var sPathTyrePositionSet = "/F4PwaSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.success = function(oData, oResponse) {
					
				PwaJModel.setData(oData.results);
			};
			oParamsTyrePositionSet.error = function(oError) {
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		bindGravityTypeSet: function(){
			var oView = this.getView();
			//GravityJModel = oView.getModel("GravityJModel");
			if (!GravityJModel) {
				GravityJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(GravityJModel, "GravityJModel");
			}
			var sPathTyrePositionSet = "/F4GravitySet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.success = function(oData, oResponse) {
					
				GravityJModel.setData(oData.results);
			};
			oParamsTyrePositionSet.error = function(oError) {
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindApplicationSet: function(){
		var oView = this.getView();
		var ApplicationSetJModel = oView.getModel("ApplicationSetJModel");
		if (!ApplicationSetJModel) {
			ApplicationSetJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(ApplicationSetJModel, "ApplicationSetJModel");
		}
		var sPathApplicationSet = "/F4VehicleApplicationSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsApplicationSet = {};
		oParamsApplicationSet.context = "";
		oParamsApplicationSet.urlParameters = "";
		oParamsApplicationSet.success = function(oData, oResponse) {
			
			ApplicationSetJModel.setData(oData.results);
			
		};
		oParamsApplicationSet.error = function(oError) {
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathApplicationSet, oParamsApplicationSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindSegmentSet: function(){
		var oView = this.getView();
		var SegmentSetJModel = oView.getModel("SegmentSetJModel");
		if (!SegmentSetJModel) {
			SegmentSetJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(SegmentSetJModel, "SegmentSetJModel");
		}
		var sPathSegmentSet = "/F4LoadSegmentSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsSegmentSet = {};
		oParamsSegmentSet.context = "";
		oParamsSegmentSet.urlParameters = "";
		oParamsSegmentSet.success = function(oData, oResponse) {
			
			SegmentSetJModel.setData(oData.results);
			
		};
		oParamsSegmentSet.error = function(oError) {
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathSegmentSet, oParamsSegmentSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindConfigurationSet: function(){
		var oView = this.getView();
		var ConfigureSetJModel = oView.getModel("ConfigureSetJModel");
		if (!ConfigureSetJModel) {
			ConfigureSetJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(ConfigureSetJModel, "ConfigureSetJModel");
		}
		var sPathConfigureSet = "/F4VehicleConfigSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsConfigureSet = {};
		oParamsConfigureSet.context = "";
		oParamsConfigureSet.urlParameters = "";
		oParamsConfigureSet.success = function(oData, oResponse) {
			
			ConfigureSetJModel.setData(oData.results);
			
		};
		oParamsConfigureSet.error = function(oError) {
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathConfigureSet, oParamsConfigureSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindPlanData: function(guid,revno){
		debugger
		var oView = this.getView();
		var getPlanDataJModel = oView.getModel("getPlanDataJModel");
		if (!getPlanDataJModel) {
			getPlanDataJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(getPlanDataJModel, "getPlanDataJModel");
		}
		var sPathgetAllDataSet = "/TestPlanSet(PlanGuid='"+ guid +"',PlanRev='"+ revno +"',CallMode='',Uname='"+sap.ushell.Container.getService("UserInfo").getId()+"')?$expand=PlanHeadtoCatNvg,PlanHeadtoDiscountNvg,PlanHeadtoFitmentNvg";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetAllDataSet = {};
		oParamsGetAllDataSet.context = "";
		oParamsGetAllDataSet.urlParameters = "";
		
		oParamsGetAllDataSet.success = function(oData, oResponse) { // success handler
			
			getPlanDataJModel.setData(oData);
			debugger
			that.getAllPlantDataModels();
			
			/*that.createDataModels();*/
			var mode = false;
			that.setEnableDisableAllFields(mode);
			//that.bindTestCategorySet();
			
			
		};
		oParamsGetAllDataSet.error = function(oError) { // error handler 	
			
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathgetAllDataSet, oParamsGetAllDataSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindRequestData: function(guid , revno){
		debugger
		var oView = this.getView();
		var getRequestDataJModel = oView.getModel("getRequestDataJModel");
		if (!getRequestDataJModel) {
			getRequestDataJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(getRequestDataJModel, "getRequestDataJModel");
		}
		var sPathgetAllDataSet = "/TestRequestSet(ReqGuid='"+ guid +"',Revno='"+ revno +"')?$expand=RequestHeadtoItemNvg,RequestHeadtoVehicleNvg,RequestHeadtoCallNvg,RequestHeadtoUsageNvg";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetAllDataSet = {};
		oParamsGetAllDataSet.context = "";
		oParamsGetAllDataSet.urlParameters = "";
		
		oParamsGetAllDataSet.success = function(oData, oResponse) { // success handler
			
			
			getRequestDataJModel.setData(oData);
			that.setTestTyre();
			that.bindTestCategorySet();
			getRequestDataJModel.setData(oData);
			that.getAllRequestDataModels();
			
		};
		oParamsGetAllDataSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathgetAllDataSet, oParamsGetAllDataSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	getAllRequestDataModels : function(){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindHeaderTab: function(data){
		
		var reqNo = this.getView().byId("idCatText");
		var idFitmentPlanText = this.getView().byId("idFitmentPlanText");
		var idRotationPlanText = this.getView().byId("idRotationPlanText");
		var idSplReqText = this.getView().byId("idSplReqText");
		reqNo.setText(data.TestPlanNumber);
		idFitmentPlanText.setValue(data.FitmentPlan);
		idRotationPlanText.setValue(data.RotPlan);
		idSplReqText.setValue(data.Remarks);
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	getAllPlantDataModels : function(){
		debugger
		
		var getPlanDataJModel = this.getView().getModel("getPlanDataJModel");
		var data = getPlanDataJModel.getData();
		
		this.PlanGuid = data.PlanGuid;
		this.bindHeaderTab(data);
		
		//bind for Fitment Plan Table
		var fitmentTb1JModel = new sap.ui.model.json.JSONModel();
		var idFitmentPlanTable1 = this.getView().byId("idFitmentPlanTable");
		
		if(data.PlanHeadtoCatNvg.results){
			fitmentTb1JModel.setData(data.PlanHeadtoCatNvg.results);
			idFitmentPlanTable1.setModel(fitmentTb1JModel, "fitmentTb1JModel")
			//idFitmentPlanTable1.setModel(fitmentTb1JModel).bindRows("/");	
			var FitmentPlanTableCount = idFitmentPlanTable1.getModel("fitmentTb1JModel").getData().length;
			idFitmentPlanTable1.setVisibleRowCount(FitmentPlanTableCount);
		}
		
		//bind for Discount Details Table
		var discountJModel = new sap.ui.model.json.JSONModel();
		var idDiscountDtl = this.getView().byId("idDiscountDetailsTable");
		
		if(data.PlanHeadtoDiscountNvg.results){
			discountJModel.setData(data.PlanHeadtoDiscountNvg.results);
			idDiscountDtl.setModel(discountJModel, "discountJModel");
			
			var DiscountDetailsTableCount = idDiscountDtl.getModel("discountJModel").getData().length;
			idDiscountDtl.setVisibleRowCount(DiscountDetailsTableCount);
		}
		
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
//add new row with same data as in the last row
	addFitmentTableDetail: function(){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onRemoveVehicleDetail: function(oEvent){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindTestCategorySet: function() {
		
		var oViewObj = this.getView();
		var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
		var testCatKey = getRequestDataJModel.getData().TestCategory;
		var category = [];
		var TestCategorySetJModel = oViewObj.getModel("TestCategorySetJModel");
		if (!TestCategorySetJModel) {
			TestCategorySetJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(TestCategorySetJModel, "TestCategorySetJModel");
		}
		var sPathTestCatSet = "/F4TestCategorySet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsTestCatSet = {};
		oParamsTestCatSet.context = "";
		oParamsTestCatSet.urlParameters = "";
		oParamsTestCatSet.success = function(oData, oResponse) { // success handler
			for(var i=0;i< oData.results.length;i++){
				if(oData.results[i].Category === testCatKey){
					if(testCatKey !== "05"){
						category=[{
							key : "00",
							value:"" 
						},
						{
							key : oData.results[i].Category,
							value: oData.results[i].CatDesc
						}]
					}else{
						category=[{
							key : "00",
							value:""
						},
						{ 
							key : "03",
							value:"FT"
						},
						{
							key : "01",
							value:"PT"
						}]
					}
				}
			}
			TestCategorySetJModel.setData(category);
		};
		oParamsTestCatSet.error = function(oError) { // error handler 
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathTestCatSet, oParamsTestCatSet);
		frameworkODataModel.attachRequestCompleted(function() {});

	},
//////////////////////////////////////////////////////////////////////////////////////////////////
//	code added to get company code and bind as per group
	bindCompCodeSet: function() {
		
		var oViewObj = this.getView();
		var getCompCodeJModel = oViewObj.getModel("getCompCodeJModel");
		if (!getCompCodeJModel) {
			getCompCodeJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(getCompCodeJModel, "getCompCodeJModel");
		}
		var sPathCompCodeSet = "/F4CompCodeSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsCompCodeSet = {};
		oParamsCompCodeSet.context = "";
		oParamsCompCodeSet.urlParameters = "";
		oParamsCompCodeSet.success = function(oData, oResponse) { // success handler
			getCompCodeJModel.setData(oData.results);
		};
		oParamsCompCodeSet.error = function(oError) { // error handler 
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathCompCodeSet, oParamsCompCodeSet);
		frameworkODataModel.attachRequestCompleted(function() {});

	},
//////////////////////////////////////////////////////////////////////////////////////////////////	
//Changed by Ankit on 21 Jan 2019
	onChangeCategory: function(oEvent){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onLocation: function(oEvent){},
		
		_handleLocationClose: function(oEvent) {},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setFieldsinitial: function(categoryKey , index){},
//////////////////////////////////////////////////////////////////////////////////////////////////		
//	set visibility of fields (test method, BM tyre, qty, total qty, vehicle qty
	setFieldsVisibility: function(categoryKey , index){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setTestMethod: function(){
		
		var testMethodJModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(testMethodJModel,"testMethodJModel")
		var testMethod=[{
			key: "01",
			value:"Stand Alone"
		},
		{
			key: "02",
			value:"Head On"
		}]
		testMethodJModel.setData(testMethod);
		
	},
//////////////////////////////////////////////////////////////////////////////////////////////////	
//Changed by Ankit on 21 Jan 2019
//	Code added to set Test Tyre and BM Tyre based on Company
setTestTyre: function(category){

		var testTyreJModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(testTyreJModel,"testTyreJModel")
		var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
		var data = getRequestDataJModel.getData().RequestHeadtoItemNvg.results;
		
		var getCompCodeJModel = this.getView().getModel("getCompCodeJModel");
		var companyCodeData = getCompCodeJModel.getData();

		var matArr=[];
			
			for(var i=0;i<data.length;i++){
				var mat={};
					if(category == 'PT')												//30/1
						{
							if( data[i].Comname.substring(0,2) == 'JK'){
								mat.Group=data[i].Group;
								mat.GroupDesc=data[i].GroupDesc;
								mat.CompanyCode = data[i].CompanyCode;
								mat.CompanyDesc = data[i].Comname;
								mat.GroupQty = 0;
								matArr.push(mat);
							}
					continue		
					}
				else{
					mat.Group=data[i].Group;
					mat.GroupDesc=data[i].GroupDesc;
					mat.CompanyCode = data[i].CompanyCode;
					mat.CompanyDesc = data[i].Comname;
					mat.GroupQty = 0;
					matArr.push(mat);
				}
			}
			testTyreJModel.setData(matArr);
			
	},
//////////////////////////////////////////////////////////////////////////////////////////////////	
	bindFitmentAxleSet: function(){
		
		var oViewObj = this.getView();
		var fitaxleJson = oViewObj.getModel("fitaxleJson");
		if (!fitaxleJson) {
			fitaxleJson = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(fitaxleJson, "fitaxleJson");
		}
		var filters = [];
		var sPathStageListSet = "/F4FitmentAxleSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsMatListSet = {};
		oParamsMatListSet.context = "";
		oParamsMatListSet.urlParameters = "";
		oParamsMatListSet.success = function(oData, oResponse) { // success handler

			fitaxleJson.setData(oData.results);
		};
		oParamsMatListSet.error = function(oError) { // error handler 
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathStageListSet, oParamsMatListSet);
		frameworkODataModel.attachRequestCompleted(function() {});

		
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	bindLocationListSet: function(){
		
		var oViewObj = this.getView();
		var locationJson = oViewObj.getModel("locationJson");
		if (!locationJson) {
			locationJson = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(locationJson, "locationJson");
		}
		var filters = [];
		var sPathStageListSet = "/F4LocationSet?$filter=Indicator eq 'P'";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsMatListSet = {};
		oParamsMatListSet.context = "";
		oParamsMatListSet.urlParameters = "";
		oParamsMatListSet.success = function(oData, oResponse) { // success handler

			locationJson.setData(oData.results);
		};
		oParamsMatListSet.error = function(oError) { // error handler 
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathStageListSet, oParamsMatListSet);
		frameworkODataModel.attachRequestCompleted(function() {});

	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onLiveChangeQty: function(oEvent){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onLiveChangeBMQty: function(oEvent){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setQtyValues: function(value , index){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setFitPlanned: function(group, totalQty, path){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setBmQtyValues: function(value, index){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setFitPlannedBM: function(group, totalQty, path){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onTestTyreSelect: function(oEvent){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onBMTyreSelect: function(oEvent){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	checkPTValues: function(qty, path){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onChangeFitmentAxle: function(oEvent){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onAddReqToCart: function(){},
//////////////////////////////////////////////////////////////////////////////////////////////////
//Added by Ankit on 6 Feb	
	validQuantity:function(){},
//////////////////////////////////////////////////////////////////////////////////////////////////
//Changed by Ankit on 6 Feb 2019	
	onReviewAndSaveRequest: function(){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	validateTyreTable: function(){},
//////////////////////////////////////////////////////////////////////////////////////////////////
// Changed by Ankit on Jan 18 2019
	validatediscounttable : function(){},
//////////////////////////////////////////////////////////////////////////////////////////////////	
	createPayload:function(mode){},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onCreateTestPlanSet: function(payload, mode){

		var oView = this.getView();
		var sPathPOHeaderSet = "/TestPlanSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsPOHeaderSet = {};
		oParamsPOHeaderSet.context = "";
		oParamsPOHeaderSet.urlParameters = "";
		
		oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
				
				if(mode == "C"){
					sap.m.MessageBox.show(
					  "Plan added to Cart (Generated Plan Number: "+oResponse.data.TestPlanNumber+")", {
			          icon: sap.m.MessageBox.Icon.INFORMATION,
			          title: "Information",
			          actions: [sap.m.MessageBox.Action.OK],
			          onClose: function(oAction) { 
			        	  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			  				oCrossAppNavigator.toExternal({
			                target: { semanticObject : "#"}
			               });
			          }
			      });
				}
				if(mode == "S"){
					sap.m.MessageBox.show(
					  "Plan submitted Successfully (Generated Plan Number: "+oResponse.data.TestPlanNumber+")", {
			          icon: sap.m.MessageBox.Icon.INFORMATION,
			          title: "Information",
			          actions: [sap.m.MessageBox.Action.OK],
			          onClose: function(oAction) { 
			        	  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			  			oCrossAppNavigator.toExternal({
			                target: { semanticObject : "#"}
			               });
			          }
			      });
					sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestPlanOutputFormSet(PlanGuid='"+oResponse.data.PlanGuid+"',RevNo='"+oResponse.data.PlanRev+"')/$value", true);		
				}
/*	*/		
				that.saveUploadedDocs(that.SelectedData.planguid);         	// document upload
/*	*/
		};
		oParamsPOHeaderSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);

		frameworkODataModel.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	setEnableDisableAllFields: function(mode){
	
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onEditTestCart: function(mode){
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onReset: function(){
		
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
	onBack: function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("S1");
	},
	
///////////////////////////////////////////////Open Fragment for attachment images /////////////////////////////////////////////////
showImage : function(oEvent) {
	debugger
	var _that = this;
	var GetPath = oEvent.getSource().getBindingContext("oDataModel").getPath().split('/NavtoFitmentDetail/results/')[1];
	var GetData = oEvent.getSource().getBindingContext("oDataModel").getModel().getData().NavtoFitmentDetail.results[GetPath].RemoveOk;
	if (!this.oUploadDialog) {
		this.oUploadDialog = sap.ui.xmlfragment("zftplanreport.view.ShowImgFrag", this);
		this.getView().addDependent(this.oUploadDialog);
	}
	color = oEvent.getSource();
	var oSrc = oEvent.getSource();
	var oContext = oSrc.getBindingContext("oDataModel");
	var sPath = oContext.getPath();
	this.PDFPath = sPath;
	var sIndex = sPath.split("/").pop();
	this.sPDFIndex = sIndex;
	if (this.sPDFIndex != "") {
	gModel = oSrc.getBindingContext("oDataModel").getModel().getData();
	RegNo		= gModel.NavtoFitmentDetail.results[this.sPDFIndex].RegNo;
	TyrePos 	= gModel.NavtoFitmentDetail.results[this.sPDFIndex].TyrePosition;
	TyreStn 	= gModel.NavtoFitmentDetail.results[this.sPDFIndex].StnclNumber;
	PlanGuid 	= gModel.NavtoFitmentDetail.results[this.sPDFIndex].PlanGuid;
	RevNo	 	= gModel.NavtoFitmentDetail.results[this.sPDFIndex].PlanRevno;
	ItemNumber 	= gModel.NavtoFitmentDetail.results[this.sPDFIndex].PlanItemNo;
	FitNo		= gModel.NavtoFitmentDetail.results[this.sPDFIndex].FitmentNo;
	//InspNo		= gModel.NavtoFitmentDetail.results[this.sPDFIndex].InspNo;
	
	var Reg = RegNo.padStart(20,'0');
	var Stl = TyreStn.padStart(12,'0');
	var Pos = TyrePos.padStart(5,'0');
	var itemobject = PlanGuid+RevNo+ItemNumber+Reg+FitNo+Stl; 
	this.getAttachmentDetails2(itemobject);
	this.oUploadDialog.open();
	sap.ui.getCore().byId("UploadCollection1").getModel("oUploadModel2").refresh();
	var upload = sap.ui.getCore().byId("UploadCollection1");
	upload.addEventDelegate({
	onAfterRendering: function(){
	debugger
	var item = sap.ui.getCore().byId("UploadCollection1").getItems();
	
	for(var i = 0 ; i<item.length ; i++){
			if(item[i].oBindingContexts.oUploadModel2.oModel.oData.items[i].NoDelete == 'X')
				sap.ui.getCore().byId("UploadCollection1").getItems()[i].setVisibleDelete(false);
			else
				sap.ui.getCore().byId("UploadCollection1").getItems()[i].setVisibleDelete(true);
	}
	
	}
	},upload);
	
	}
	
},

onImageDownloadItem: function() {
	debugger
	var oUploadCollection = sap.ui.getCore().byId("UploadCollection1");
	var aSelectedItems = oUploadCollection.getSelectedItems();
	if (aSelectedItems) {
		for (var i = 0; i < aSelectedItems.length; i++) {
			oUploadCollection.downloadItem(aSelectedItems[i], true);
		}
	} else {
		MessageToast.show("Select an item to download");
	}
},
onOKUploadDialog : function(oEvent) {

	this.oUploadDialog.close();
},

///////////////////////////////////////////////End Fragment for attachment images /////////////////////////////////////////////////

onImageDownloadItem1:function(){
	var oUploadCollection = this.getView().byId("UploadCollection");	
	var aSelectedItems = oUploadCollection.getSelectedItems();
	if (aSelectedItems) {
	for (var i = 0; i < aSelectedItems.length; i++) {
		oUploadCollection.downloadItem(aSelectedItems[i], true);
	}
	} else {
	MessageToast.show("Select an item to download");
}
	
},
	
	onAttachUpload: function(oEvent){
		
		var oFileUploader = oEvent.getSource();		
		
	    var _that = this;
	    var csrf = that.getCSRFToken();
	    
	    var oUploadCollection = oEvent.getSource();
	    var oCustomerHeaderToken = new UploadCollectionParameter({
		name : "x-csrf-token",
		value : that.token
	    });
	    oUploadCollection.addHeaderParameter(oCustomerHeaderToken);	
	},
	
    getCSRFToken: function() {	
    	
    	var that=this;
    	$.ajax({	url: "/sap/opu/odata/sap/ZAPS_UTILITY_SRV",	type: "GET",	async: false,	
    		beforeSend: function(xhr) { 
    			xhr.setRequestHeader("X-CSRF-Token", "Fetch");	
    		},
    		complete: function(xhr) {	
    			that.token = xhr.getResponseHeader("X-CSRF-Token");	
    		}
    	});
    },		

	onBeforeUploadStarts : function(oEvent) {
	    var oVal = oEvent.getParameter("value");	    
    
	    var fileName = oEvent.getParameter("fileName");
	    var oSlug = fileName;

	    // Header Slug
	    var oCustomerHeaderSlug = new UploadCollectionParameter({
		name : "slug",
		value : oSlug
	    });
	    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
	},
	    
	onUploadComplete : function(oEvent) {
	    var oUploadCollection = oEvent.getSource();
	    var oResData = oEvent.getParameter("files")[0];
	    if (oResData.status == "201") {
		var oData = oUploadCollection.getModel("oUploadModel").getData();
		
	 	var docId = oResData.headers["doc_no"];
		
		var host = window.location.host;
		var protocol = window.location.protocol;
		var urlprefix = protocol + "//" + host;		
	
		var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + docId + "')/$value";

		oData.items.unshift({
		    "DocNo" : docId, // document number,
		    "FileName" : oResData.fileName,
		    "MimeType" : oResData.headers["content-mimetype"],
		    "Url" : sURL,
		});
		
		
		var uploadDetails= {};
		uploadDetails.FileName = oResData.fileName
		uploadDetails.DocNo= docId;
		uploadDetails.UpdateFlag= "";
		uploadDetails.MimeType = oResData.headers["content-mimetype"]
		var model = that.getView().getModel("attachmentModel");
		var data = model.getData();
		data.push(uploadDetails);
		
		oUploadCollection.getModel("oUploadModel").refresh();

		// delay the success message for to notice onChange message
		setTimeout(function() {sap.m.MessageToast.show("Uploaded successfully");
		}, 4000);
		} else if (oEvent.getParameter("files")[0].status == "0") {
		oUploadCollection.fireUploadTerminated();
		} else {
		var errmessage = "File Upload failed : " + oEvent.getParameter("files")[0].responseRaw;
		sap.m.MessageBox.show(errmessage, sap.m.MessageBox.Icon.ERROR, "Error");
		oUploadCollection.fireUploadTerminated();
	    }
	},
	

    onFileDeleted : function(oEvent) {
        var oSrc = oEvent.getSource();
        var uploadModel = oSrc.getModel("oUploadModel");
        var uItems = uploadModel.getProperty("/items");
        var oItem = oEvent.getParameter("item");
        var oContext = oItem.getBindingContext("oUploadModel")
        if (!oContext) {
          uploadModel.setProperty("/items", uItems);
          return;
        }
        var sPath = oContext.getPath();
        var sIndex = sPath.split("/").pop();
        var docId = oEvent.getParameter("documentId");
        
        uItems.splice(sIndex,1);
        uploadModel.refresh();
            
        var data = that.getView().getModel("attachmentModel").getData();
        var exist;
		for(var i=0;i<data.length;i++){
		  if(data[i].DocNo==docId){
			exist = "X";  
			data[i].UpdateFlag = "D";  
		  }	
		}
		
		if(exist !== "X"){
			var obj={};
			obj.FileName = oItem.getFileName();
			obj.MimeType = oItem.getMimeType();
			obj.DocNo = docId;
			obj.UpdateFlag = "D";
			data.push(obj);
		}
      },    
      
      getAttachmentDetails: function(GuId,FitNo,InspNo,RevNo,ItemNo,RegNo){								//document upload
  	    debugger
			var oView = this.getView();
			var oUploadModel = this.getView().getModel("oUploadModel");
			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
			var Reg = RegNo.padStart(20,'0');
			var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='04',ObjectName='"+GuId+RevNo+ItemNo+Reg+FitNo+"')?$expand=ImageObjectToDataNvg";
			var oParamsAttachmentSet = {};
			oParamsAttachmentSet.context = "";
			oParamsAttachmentSet.urlParameters = "";
			oParamsAttachmentSet.success = function(oData, oResponse) {
				debugger
				
				if (oData.ImageObjectToDataNvg.results.length > 0){
					
					var results = oData.ImageObjectToDataNvg.results;
					var host = window.location.host;
					var protocol = window.location.protocol;
					var urlprefix = protocol + "//" + host;
					
					for (var i=0;i<results.length;i++){
						var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
						results[i].Url = sURL;
					}
					
					oUploadModel.setData({
						items:oData.ImageObjectToDataNvg.results
					});
				}
				else{
					oUploadModel.setData({items:[]});	
				}
				
				var upload = that.getView().byId("UploadCollection");
				upload.addEventDelegate({
					onAfterRendering: function(){
						debugger
						var item = that.getView().byId("UploadCollection").getItems();
						
						for(var i = 0 ; i<item.length ; i++){
							if(item[i].oBindingContexts.oUploadModel.oModel.oData.items[i].NoDelete == 'X'){
								that.getView().byId("UploadCollection").getItems()[i].setVisibleDelete(false);
							}else
								that.getView().byId("UploadCollection").getItems()[i].setVisibleDelete(true);
						}
					}
				},upload);
				
			};
			oParamsAttachmentSet.error = function(oError) {
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);

			oCreateModel1.read(sPathAttachmentSet, oParamsAttachmentSet);

			oCreateModel1.attachRequestCompleted(function() {
				
			});
		},

		
		saveUploadedDocs: function(planguid){               						// document upload
			var payload = that.createDocsPayload(planguid);
			var oView = this.getView();
			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
			var sPathPOHeaderSet = "/ImageUploadObjectSet";
			var oParamsPOHeaderSet = {};
			oParamsPOHeaderSet.context = "";
			oParamsPOHeaderSet.urlParameters = "";
			oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
				
			};
			oParamsPOHeaderSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);

			oCreateModel1.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

			oCreateModel1.attachRequestCompleted(function() {
				
			});
		},
		
		createDocsPayload: function(planguid){              							// document upload
			var payload={
					ObjectID: "03",
					ObjectName: planguid,
					Error:"",
					Message:"",				
			}
			var navArr=[];
			var data = that.getView().getModel("attachmentModel").getData();
			for(var i=0;i<data.length;i++){
				var obj={};
				obj.FileName = data[i].FileName;
				obj.DocNo = data[i].DocNo;
				obj.UpdateFlag = data[i].UpdateFlag;
				obj.MimeType = data[i].MimeType;
				navArr.push(obj);
			}
			
			payload.ImageObjectToDataNvg = navArr;
			return payload;
		},

    // **********************File upload Finish****************************	
		
		onAttachUpload2: function(oEvent){
			debugger
			
			var oFileUploader = oEvent.getSource();		
			
		    var _that = this;
		    var csrf = that.getCSRFToken2();
		    
		    var oUploadCollection = oEvent.getSource();
		    var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : that.token
		    });
		    oUploadCollection.addHeaderParameter(oCustomerHeaderToken);	
		},
		
	    getCSRFToken2: function() {	
	    	
	    	var that=this;
	    	$.ajax({	url: "/sap/opu/odata/sap/ZAPS_UTILITY_SRV",	type: "GET",	async: false,	
	    		beforeSend: function(xhr) { 
	    			xhr.setRequestHeader("X-CSRF-Token", "Fetch");	
	    		},
	    		complete: function(xhr) {	
	    			that.token = xhr.getResponseHeader("X-CSRF-Token");	
	    		}
	    	});
	    },		

		onBeforeUploadStarts2 : function(oEvent) {
			debugger
		    var oVal = oEvent.getParameter("value");	    
	    
		    var fileName = oEvent.getParameter("fileName");
		    var oSlug = fileName;

		    // Header Slug
		    var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
		    });
		    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},	
		
		onUploadComplete2 : function(oEvent) {
			debugger
		    var oUploadCollection = oEvent.getSource();
		    var oResData = oEvent.getParameter("files")[0];
		    if (oResData.status == "201") {
			var oData = oUploadCollection.getModel("oUploadModel2").getData();
			
		 	var docId = oResData.headers["doc_no"];
			
			var host = window.location.host;
			var protocol = window.location.protocol;
			var urlprefix = protocol + "//" + host;		
		
			var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + docId + "')/$value";

			oData.items.unshift({
			    "DocNo" : docId, // document number,
			    "FileName" : oResData.fileName,
			    "MimeType" : oResData.headers["content-mimetype"],
			    "Url" : sURL,
			    "Pos" : TyrePos,
			    
			});	
			
			
			var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.Pos= TyrePos;
			uploadDetails.UpdateFlag= "I";
			uploadDetails.MimeType = oResData.headers["content-mimetype"]
			var model = that.getView().getModel("attachmentModel2");
			var data = model.getData();
			data.push(uploadDetails);
			
			
			oUploadCollection.getModel("oUploadModel2").refresh();

			// delay the success message for to notice onChange message
			setTimeout(function() {sap.m.MessageToast.show("Uploaded successfully");
			}, 4000);
		    } else if (oEvent.getParameter("files")[0].status == "0") {
			oUploadCollection.fireUploadTerminated();
		    } else {
			var errmessage = "File Upload failed : " + oEvent.getParameter("files")[0].responseRaw;
			sap.m.MessageBox.show(errmessage, sap.m.MessageBox.Icon.ERROR, "Error");
			oUploadCollection.fireUploadTerminated();
		    }
		},			
	   
	    onTypeMissmatch2 : function(oEvent){
	    	debugger
	    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
	    	return false;
	    },
	    
	   
	    onFileDeleted2 : function(oEvent) {
	    	debugger
	        var oSrc = oEvent.getSource();
	        var uploadModel = oSrc.getModel("oUploadModel2");
	        var imagedata = oSrc.getModel("oUploadModel2").getData();
	        var uItems = uploadModel.getProperty("/items");
	        var oItem = oEvent.getParameter("item");
	        var oContext = oItem.getBindingContext("oUploadModel2")
	        if (!oContext) {
	          uploadModel.setProperty("/items", uItems);
	          return;
	        }
	        var sPath = oContext.getPath();
	        var sIndex = sPath.split("/").pop();
	        var docId = oEvent.getParameter("documentId");
	        var ind = sIndex;

	        var data = that.getView().getModel("attachmentModel2").getData();
	        var exist;
			for(var i=0;i<data.length;i++){
				if(data[i].DocNo==imagedata.items[ind].DocNo){
					exist = "X";
					data[i].UpdateFlag = "D";
				}
			}
			
			if(exist !== "X"){
				var obj={};
				obj.FileName = imagedata.items[ind].FileName;
				obj.MimeType = imagedata.items[ind].MimeType;
				obj.DocNo = imagedata.items[ind].DocNo;
				obj.UpdateFlag = "D";
				obj.Pos = imagedata.items[ind].Pos;
				data.push(obj);
			}
			
			uItems.splice(sIndex,1);
			uploadModel.refresh();
			
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
			getAttachmentDetails2 : function(itemobject){											//document upload
				debugger
				var oView = this.getView();
				var that = this;
				var oUploadModel2 = this.getView().getModel("oUploadModel2");
				var model = this.getView().getModel("attachmentModel2");
				oUploadModel2.setData({items:[]});
				var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
				var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='04',ObjectName='"+itemobject+"')?$expand=ImageObjectToDataNvg";
				var oParamsAttachmentSet = {};
				oParamsAttachmentSet.context = "";
				oParamsAttachmentSet.urlParameters = "";
				oParamsAttachmentSet.success = function(oData, oResponse) { // success handler
					debugger
					
					var modeldata = that.getView().getModel("attachmentModel2").getData();
					var host = window.location.host;
					var protocol = window.location.protocol;
					var urlprefix = protocol + "//" + host;	
					
					if (oData.ImageObjectToDataNvg.results.length > 0){
						
						var results = oData.ImageObjectToDataNvg.results;
						
						for (var i=0;i<results.length;i++){
							var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
							results[i].Url = sURL; 
						}
						
						 for (var i=0;i<oData.ImageObjectToDataNvg.results.length;i++){
							if (modeldata.length == 0){  
								var uploadDetails= {};
								uploadDetails.FileName = oData.ImageObjectToDataNvg.results[i].FileName;
								uploadDetails.DocNo= oData.ImageObjectToDataNvg.results[i].DocNo;
								uploadDetails.Pos= TyrePos;
								uploadDetails.UpdateFlag= "";
								uploadDetails.MimeType = "";
								uploadDetails.Url = oData.ImageObjectToDataNvg.results[i].Url;
								// 
								uploadDetails.NoDelete = oData.ImageObjectToDataNvg.results[i].NoDelete;
								//
								var data = oUploadModel2.getData();
								data.items.push(uploadDetails);	
								that.getView().getModel("oUploadModel2").refresh();
							}else{
								var exist = false;
								for (var j=0;j<modeldata.length;j++){
									if (TyrePos == modeldata[j].Pos && 
										modeldata[j].DocNo == oData.ImageObjectToDataNvg.results[i].DocNo &&
										modeldata[j].UpdateFlag == "D"){
										exist = true;
									}
								}
								
								if(exist==false){
									var uploadDetails= {};
									uploadDetails.FileName = oData.ImageObjectToDataNvg.results[i].FileName;
									uploadDetails.DocNo= oData.ImageObjectToDataNvg.results[i].DocNo;
									uploadDetails.Pos= TyrePos;
									uploadDetails.UpdateFlag= "";
									uploadDetails.MimeType = "";
									uploadDetails.Url = oData.ImageObjectToDataNvg.results[i].Url;
									//
									uploadDetails.NoDelete = oData.ImageObjectToDataNvg.results[i].NoDelete;
									//
									var data = oUploadModel2.getData();
									data.items.push(uploadDetails);
									that.getView().getModel("oUploadModel2").refresh();
								}
							}
						}
					};
						for (var i=0;i<modeldata.length;i++){
							if(modeldata[i].Pos == TyrePos && modeldata[i].UpdateFlag == 'I'){
								var uploadDetails= {};
								uploadDetails.FileName = modeldata[i].FileName;
								uploadDetails.DocNo= modeldata[i].DocNo;
								uploadDetails.Pos= modeldata[i].Pos;
								uploadDetails.UpdateFlag= "";
								uploadDetails.MimeType = "";
								uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
								//
								uploadDetails.NoDelete = modeldata[i].NoDelete;
								//
								var data = oUploadModel2.getData();
								data.items.push(uploadDetails);	
								
								that.getView().getModel("oUploadModel2").refresh();	
							}
					}
				};
				
				oParamsAttachmentSet.error = function(oError) { // error handler 		
					jQuery.sap.log.error("read publishing group data failed");
				}.bind(this);

				oCreateModel1.read(sPathAttachmentSet, oParamsAttachmentSet);

				oCreateModel1.attachRequestCompleted(function() {
					
				});
			},
//////////////////////////////////////////////////////////////////////////////////////////////////			
			
			saveUploadedDocs2: function(guid,revno,item,regno,fitno,inspno,pos,stclno){               						// document upload
				var payload = that.createDocsPayload2(guid,revno,item,regno,fitno,inspno,pos,stclno);
				var oView = this.getView();
				var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
				var sPathPOHeaderSet = "/ImageUploadObjectSet";
				var oParamsPOHeaderSet = {};
				oParamsPOHeaderSet.context = "";
				oParamsPOHeaderSet.urlParameters = "";
				oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
				
				};
				oParamsPOHeaderSet.error = function(oError) { // error handler 		
					jQuery.sap.log.error("read publishing group data failed");
				}.bind(this);

				oCreateModel1.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

				oCreateModel1.attachRequestCompleted(function() {
					
				});
			},

			createDocsPayload2: function(guid,revno,item,regno,fitno,inspno,pos,stclno){							// document upload
				debugger
				var reg = regno.padStart(20, '0');
				var stcl = stclno.padStart(12, '0');
				var pos1 = pos.padStart(5, '0');
				var payload={
						ObjectID: "04",
						ObjectName: guid+revno+item+reg+fitno+inspno+stcl,
						Error:"",
						Message:"",
				}
				var navArr=[];
				var data = that.getView().getModel("attachmentModel2").getData();
				for(var i=0;i<data.length;i++){
					if(data[i].Pos == pos){
					var obj={};
					obj.FileName = data[i].FileName;
					obj.DocNo = data[i].DocNo;
					obj.UpdateFlag = data[i].UpdateFlag;
					obj.MimeType = data[i].MimeType;
					navArr.push(obj);	
				}
				}
				
				payload.ImageObjectToDataNvg = navArr;
				return payload;
			},
	
});
});
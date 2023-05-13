sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
function( JSONModel,UploadCollectionParameter) {
"use strict";


jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("ztestplanapprov.util.formatte");
var that, level, status, mode,remark;

sap.ui.controller("ztestplanapprov.view.S2", {

  
	onInit: function() {
		that=this;
		this.fitmentTable1=[];
				if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		jQuery.sap
		.includeStyleSheet(jQuery.sap
				.getModulePath(
						"ztestplanapprov.css.style",
						".css"));
		
		this.bindGetTestRequest();
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"S2").attachMatched(this._onRoute, this);
		
		that.bindFitmentAxleSet();
	    that.bindApplicationSet();
	    that.bindSegmentSet();
	    that.bindConfigurationSet();
	    that.bindCompCodeSet();
	    
	    this.setTestMethod();
	    this.bindLocationListSet();
		//		Fitment tab Table 1 data binding
		var fitmentTb1JModel = new sap.ui.model.json.JSONModel();
		fitmentTb1JModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		var idFitmentPlanTable= this.getView().byId("idFitmentPlanTable");
		idFitmentPlanTable.setModel(fitmentTb1JModel,"fitmentTb1JModel");
	    
		
//		this.getFitmentTable1Object();
		
	     // start of document upload
		var attachmentModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentModel,"attachmentModel");
		attachmentModel.setData([]);
		
		var oUploadModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		
		this.getView().setModel(oUploadModel,"oUploadModel");
		// end of document upload

		
	},
		
	_onRoute : function(e){
		
		var that = this;
		that.initialLoad = true;
		this.FitmentDetails=[];
		var tempjsonString = e.getParameter("arguments").entity;
		var jsonstring = tempjsonString.replace(/@/g, "/");
		var tempSelectedData = JSON.parse(jsonstring);
		 this.SelectedData  = JSON.parse(tempSelectedData);
		this.getView().byId("idTestDate").setText("Test Plan Date :"+this.SelectedData.plandate);
		this.getView().byId("idTestPlan").setText("Test Plan : "+this.SelectedData.planno);
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("A");
//		this.bindLocationListSet();
//		this.setTestMethod();
		this.PlanGuid = this.SelectedData.planguid;
		this.PlanRevNo = this.SelectedData.planrevno;
		this.ReqGuid = this.SelectedData.reqguid;
		this.ReqRevNo = this.SelectedData.reqrevno;
		this.bindPlanData(this.SelectedData.planguid , this.SelectedData.planrevno);
		this.bindRequestData(this.SelectedData.reqguid , this.SelectedData.reqrevno);
		
		this.getAttachmentDetails(this.SelectedData.planguid);  				// document upload
		
// Added on March 5
	level  = this.SelectedData.level;
	status = this.SelectedData.status;
	
	if( level == 'L1'){
		this.getView().byId("approveBtnPDC").setVisible(false);
		this.getView().byId("approveBtnPTG").setVisible(true);
		this.getView().byId("approveBtnTD").setVisible(false);
		this.getView().byId("editBtn").setVisible(true);
		this.getView().byId("holdBtn").setVisible(true);
		this.getView().byId("RejectBtn").setVisible(true);
	}	
	
	if( level == 'L2'){
		this.getView().byId("approveBtnPDC").setVisible(true);
		this.getView().byId("approveBtnPTG").setVisible(false);
		this.getView().byId("approveBtnTD").setVisible(false);
		this.getView().byId("editBtn").setVisible(false);
		this.getView().byId("holdBtn").setVisible(true);
		this.getView().byId("RejectBtn").setVisible(true);
	}		
	
	if( level == 'L3'){
		this.getView().byId("approveBtnPDC").setVisible(false);
		this.getView().byId("approveBtnPTG").setVisible(false);
		this.getView().byId("approveBtnTD").setVisible(true);
		this.getView().byId("editBtn").setVisible(false);
		this.getView().byId("holdBtn").setVisible(false);
		this.getView().byId("RejectBtn").setVisible(false);
	}	
	
	if( level == 'L1' && status == 'PAPP'){
		this.getView().byId("approveBtnPTG").setVisible(true);
	}else{
		this.getView().byId("approveBtnPTG").setVisible(false);
	}
	
	if( level == 'L2' && status == 'PAPR'){
		this.getView().byId("approveBtnPDC").setVisible(true);
	}else{
		this.getView().byId("approveBtnPDC").setVisible(false);
	}	
	
	if( level == 'L3' && status == 'AUTH'){
		this.getView().byId("approveBtnTD").setVisible(true);
	}else{
		this.getView().byId("approveBtnTD").setVisible(false);
	}		

/*	if( level == 'L1' && status == 'HOLD'){
		this.getView().byId("approveBtnPDC").setVisible(false);
		this.getView().byId("approveBtnPTG").setVisible(true);
		this.getView().byId("approveBtnTD").setVisible(false);
		this.getView().byId("editBtn").setVisible(true);
		this.getView().byId("holdBtn").setVisible(false);
		this.getView().byId("RejectBtn").setVisible(true);
	}	
	
	if( level == 'L2' && status == 'HOLD'){
		this.getView().byId("approveBtnPDC").setVisible(true);
		this.getView().byId("approveBtnPTG").setVisible(false);
		this.getView().byId("approveBtnTD").setVisible(false);
		this.getView().byId("editBtn").setVisible(true);
		this.getView().byId("holdBtn").setVisible(false);
		this.getView().byId("RejectBtn").setVisible(true);
	}*/
	
	
	if(status == 'HOLD') this.getView().byId("holdBtn").setVisible(false);
	if(status == 'EDIT') this.getView().byId("editBtn").setVisible(false);	
//		
        var FitTbl = that.getView().byId("idFitmentPlanTable");
        FitTbl.addEventDelegate({
        	onAfterRendering :function(){
//            	disable Fitment Plan table on initial load  
            	if(that.initialLoad){
            			var mode= false;
		        		var FittTbl = that.getView().byId("idFitmentPlanTable");	 
		    			var rows2 = FittTbl.getRows();
		    			for(var d=0;d<rows2.length;d++){
		    				var cell2= rows2[d].getCells();	
		    				var abc = rows2[d].getCells().length;
		    				rows2[0].getCells()[abc-1].setVisible(false);
		    				for(var e = 0 ; e<cell2.length;e++){
		    					cell2[e].setEnabled(mode);
		    					
		    				}
		    			}
            		}	
        	}
		});
	   
        var DisTbl = that.getView().byId("idDiscountDetailsTable");
        DisTbl.addEventDelegate({
        	onAfterRendering :function(){
        		
//            	disable Discount table on initial load  
            	if(that.initialLoad){
            			var mode= false;
		        		var DiscTbl = that.getView().byId("idDiscountDetailsTable");	 
		    			var rows2 = DiscTbl.getRows();
		    			for(var d=0;d<rows2.length;d++){
		    				var cell2= rows2[d].getCells();			    				
	
		    				if(rows2[d].getCells()[3].getValue() == "0" ){
			    				rows2[d].getCells()[3].setValue()
								}
		    					cell2[3].setEnabled(mode);
		    					cell2[4].setEnabled(mode); 				
		    			}
            		}	
        	}
		});
	},
	
	onAfterRendering: function(){
		var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
		var arr= [2,6,7,9];

		var rows = idFitmentPlanTable.getRows();
		for(var j=0; j<rows.length;j++){
			if(rows[j].getCells()[0].getSelectedKey() == "01"){
				for(var i=0;i<arr.length;i++){
					idFitmentPlanTable.getRows()[j].getCells()[arr[i]].setVisible(false);
				}
			}
			idFitmentPlanTable.getRows()[j].getCells()[8].setEnabled(false);
		}
	
	},
	
	handleIconTabBarSelect: function(oEvent){
		  debugger
		if(oEvent.getSource().getSelectedKey() == "B"){
            debugger
			var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");

			var arr= [2,3,6,7,9];

			var rows = idFitmentPlanTable.getRows();
			for(var j=0; j<rows.length;j++){
				if(rows[j].getCells()[0].getSelectedKey() == "01"){
					for(var i=0;i<arr.length;i++){
						idFitmentPlanTable.getRows()[j].getCells()[arr[i]].setVisible(false);
					}
					
				}
			}
	}
	
},

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
		oParamsApplicationSet.success = function(oData, oResponse) { // success handler
			
			ApplicationSetJModel.setData(oData.results);
			
		};
		oParamsApplicationSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathApplicationSet, oParamsApplicationSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
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
		oParamsSegmentSet.success = function(oData, oResponse) { // success handler
			
			SegmentSetJModel.setData(oData.results);
			
		};
		oParamsSegmentSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathSegmentSet, oParamsSegmentSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
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
		oParamsConfigureSet.success = function(oData, oResponse) { // success handler
			
			ConfigureSetJModel.setData(oData.results);
			
		};
		oParamsConfigureSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathConfigureSet, oParamsConfigureSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
	bindGetTestRequest: function(){
		var oView = this.getView();
		var GetTestRequestSetJModel = oView.getModel("GetTestRequestSetJModel");
		if (!GetTestRequestSetJModel) {
			GetTestRequestSetJModel = new sap.ui.model.json.JSONModel();
			oView.setModel(GetTestRequestSetJModel, "GetTestRequestSetJModel");
		}
		var sPathGetRequestSet = "/GetTestRequestForTestPlanSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsGetRequestSet = {};
		oParamsGetRequestSet.context = "";
		oParamsGetRequestSet.urlParameters = "";
		oParamsGetRequestSet.success = function(oData, oResponse) { // success handler
			
			GetTestRequestSetJModel.setData(oData.results);
			
		};
		oParamsGetRequestSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);
		frameworkODataModel.read(sPathGetRequestSet, oParamsGetRequestSet);
		frameworkODataModel.attachRequestCompleted(function() {
			
		});

	},
	
	bindPlanData: function(guid,revno){
		
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
	
	
	bindRequestData: function(guid , revno){
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
	
	
	//
	getAllRequestDataModels : function(){
		
		debugger
		var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
		var requestData = getRequestDataJModel.getData();
		//bind callbackTab
		var getCallBackJModel = new sap.ui.model.json.JSONModel();
		var idcallbackTable = this.getView().byId("idCallbackDetailTable");			
		
		if(requestData.RequestHeadtoCallNvg.results){
			getCallBackJModel.setData(requestData.RequestHeadtoCallNvg.results);
			idcallbackTable.setModel(getCallBackJModel,"getCallBackJModel");
		}
	
		//bind for Fitment Plan Table 2
		var fitmentTb2JModel = new sap.ui.model.json.JSONModel();
		var idTyreDtlTable = this.getView().byId("idTyreDetailsTable");		
		//var fitmentJModel = idTyreDtlTable.getModel("fitmentTb2JModel"); 
		
		
		if(requestData.RequestHeadtoItemNvg.results){
			fitmentTb2JModel.setData(requestData.RequestHeadtoItemNvg.results);
			idTyreDtlTable.setModel(fitmentTb2JModel,"fitmentTb2JModel");
			
			var idDiscountDtl  = this.getView().byId("idDiscountDetailsTable");
			var discountJModel = idDiscountDtl.getModel("discountJModel");		
			var allreqData     = requestData.RequestHeadtoItemNvg.results;
				
			for(var i=0;i<discountJModel.getData().length;i++){
				if(discountJModel.getData()[i].Group == allreqData[i].Group){
					discountJModel.getData()[i]["Maktx"] = allreqData[i].Maktx;
					discountJModel.getData()[i]["GroupDesc"] = allreqData[i].GroupDesc;
				}
			}
				
			discountJModel.refresh();
			
			var getPlanDataJModel = this.getView().getModel("getPlanDataJModel");
			var fitdata = getPlanDataJModel.getData();
			
			for(var j=0;j<allreqData.length;j++){
				for(var k=0;k<fitdata.PlanHeadtoFitmentNvg.results.length;k++){
				  if (allreqData[j].Group == fitdata.PlanHeadtoFitmentNvg.results[k].Group){
					  fitmentTb2JModel.getData()[j].FtPlanned = fitdata.PlanHeadtoFitmentNvg.results[k].FtPlanned;
					  fitmentTb2JModel.getData()[j].PtPlanned = fitdata.PlanHeadtoFitmentNvg.results[k].PtPlanned;
					  fitmentTb2JModel.getData()[j].Ftalplanned = allreqData[j].Ftalplanned - allreqData[j].FtPlanned;
					  fitmentTb2JModel.getData()[j].Ptalplanned = allreqData[j].Ptalplanned - allreqData[j].PtPlanned;		  
				  }  	
				}
			}
			
			fitmentTb2JModel.refresh();			
			
			var TyreDetailsTableCount = idTyreDtlTable.getModel("fitmentTb2JModel").getData().length;
			idTyreDtlTable.setVisibleRowCount(TyreDetailsTableCount);
		}
		
		
		//Tyre Details Table data binding
		var tyreDetailJModel = new sap.ui.model.json.JSONModel();
		tyreDetailJModel.setData(requestData.RequestHeadtoItemNvg.results[0]);
		
		var idIpPsiText = this.getView().byId("idIpPsiText");
		var ipPsi = requestData.RequestHeadtoUsageNvg.IpPsi;
		idIpPsiText.setText(ipPsi);
		this.getView().setModel(tyreDetailJModel,"tyreDetailJModel");
		
		var idReccRimText = this.getView().byId("idReccRimText");
		var ipRim = requestData.RequestHeadtoUsageNvg.FitmentRimRecommended;
		idReccRimText.setText(ipRim);
		
		this.getView().setModel(tyreDetailJModel,"tyreDetailJModel");
	
		//bind PROPOSED VEHICLES
		var getProposedJModel = new sap.ui.model.json.JSONModel();
		var idProposDetailsTable = this.getView().byId("idProposedDetailsTable");			
		
		if(requestData.RequestHeadtoVehicleNvg.results){
			getProposedJModel.setData(requestData.RequestHeadtoVehicleNvg.results);
			idProposDetailsTable.setModel(getProposedJModel,"getProposedJModel");
		}
		
	},
	
	
	//
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
	//
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
	
	//
	
	
	/*bindHeaderTab(data){
		var reqNo = this.getView().byId("idCatText");
		var idFitmentPlanText = this.getView().byId("idFitmentPlanText");
		var idRotationPlanText = this.getView().byId("idRotationPlanText");
		var idSplReqText = this.getView().byId("idSplReqText");
		reqNo.setText(data.TestPlanNumber);
		idFitmentPlanText.setValue(data.FitmentPlan);
		idRotationPlanText.setValue(data.RotPlan);
		idSplReqText.setValue(data.Remarks);
		
	},*/
	
	/*createDataModels: function(){
		
		var getAllDataJModel = this.getView().getModel("getAllDataJModel");
		var data = getAllDataJModel.getData();
		this.PlanGuid =data.PlanGuid;
		this.bindHeaderTab(data);
//		Test Requirement Tab data binding 
		var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
		var requestData = getRequestDataJModel.getData();
		
		var testRequireJModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(testRequireJModel,"testRequireJModel");
		this.getView().getModel("testRequireJModel").setData(requestData);
	

		
//		Fitment tab Table 2 data binding
		var fitmentTb2JModel = new sap.ui.model.json.JSONModel();
		var idTyreDetailsTable = this.getView().byId("idTyreDetailsTable");			
		if(requestData.RequestHeadtoItemNvg.results){
			fitmentTb2JModel.setData(requestData.RequestHeadtoItemNvg.results);
			idTyreDetailsTable.setModel(fitmentTb2JModel,"fitmentTb2JModel");
			var TyreDetailsTableCount = idTyreDetailsTable.getModel("fitmentTb2JModel").getData().length;
			idTyreDetailsTable.setVisibleRowCount(TyreDetailsTableCount);
			
			for(var i=0;i<TyreDetailsTableCount;i++){
				fitmentTb2JModel.getData()[i]["FitPlanned"] = data.PlanHeadtoFitmentNvg.results[i].Fitment;
			}
		}
		fitmentTb2JModel.refresh();
		
//		Discount tab Table data binding
		var discountJModel = new sap.ui.model.json.JSONModel();
		var idDiscountDetailsTable = this.getView().byId("idDiscountDetailsTable");			
		if(data.PlanHeadtoDiscountNvg.results){
			discountJModel.setData(data.PlanHeadtoDiscountNvg.results);
			idDiscountDetailsTable.setModel(discountJModel,"discountJModel");
			var DiscountDetailsTableCount = idDiscountDetailsTable.getModel("discountJModel").getData().length;
			idDiscountDetailsTable.setVisibleRowCount(DiscountDetailsTableCount);
		}

//		Tyre Details Table data binding
		var tyreDetailJModel = new sap.ui.model.json.JSONModel();
		tyreDetailJModel.setData(requestData.RequestHeadtoItemNvg.results[0]);
		var idIpPsiText = this.getView().byId("idIpPsiText");
		var ipPsi = requestData.RequestHeadtoUsageNvg.IpPsi;
		idIpPsiText.setText(ipPsi);
		this.getView().setModel(tyreDetailJModel,"tyreDetailJModel");

//		Proposed Vehicle Table data binding
		var proposedVehicleJModel = new sap.ui.model.json.JSONModel();
		var idProposedDetailsTable = this.getView().byId("idProposedDetailsTable");			
		if(requestData.RequestHeadtoVehicleNvg.results){
			proposedVehicleJModel.setData(requestData.RequestHeadtoVehicleNvg.results);
			idProposedDetailsTable.setModel(proposedVehicleJModel,"proposedVehicleJModel");
			var ProposedDetailsTableCount = idProposedDetailsTable.getModel("proposedVehicleJModel").getData().length;
			idProposedDetailsTable.setVisibleRowCount(ProposedDetailsTableCount);
		}
		
//		Callback tab table data binding
		var callRequireJModel = new sap.ui.model.json.JSONModel();
		var callbackTable = this.getView().byId("idCallbackDetailTable");	
		if(requestData.RequestHeadtoCallNvg.results){
			callRequireJModel.setData(requestData.RequestHeadtoCallNvg.results);
	        callbackTable.setModel(callRequireJModel,"callRequireJModel");
	        var callBackTableCount = callbackTable.getModel("callRequireJModel").getData().length;
	        callbackTable.setVisibleRowCount(callBackTableCount);
		}
		
//		Fitment tab table data binding
		var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
		var fitmentTb1JModel = idFitmentPlanTable.getModel("fitmentTb1JModel");
		if(data.PlanHeadtoCatNvg.results){
			fitmentTb1JModel.setData(data.PlanHeadtoCatNvg.results);
	        var fitTableCount = idFitmentPlanTable.getModel("fitmentTb1JModel").getData().length;
	        idFitmentPlanTable.setVisibleRowCount(fitTableCount);
		}

	},*/

	getFitmentTable1Object: function(){
		
		var obj={
				
				TestCategory: "",
				Location: "",
				TestMethodology: "",
				TestingAxle:"",
				TestGroup:"",
				TestTyreQty:"",
				BmGroup:"",
				BmTyreQty:"",
				TotalQty:"",
				VehQty:"",
				Segment:"",
				VehicleApplication:"",
				VehicleConfig:""
			};
//		this.fitmentTable1.push(obj);
		var idFitmentPlanTable= this.getView().byId("idFitmentPlanTable");
		var fitData = idFitmentPlanTable.getModel("fitmentTb1JModel").getData();
		fitData.push(obj);
		idFitmentPlanTable.getModel("fitmentTb1JModel").setData(fitData);
		idFitmentPlanTable.getModel("fitmentTb1JModel").refresh();
		var FitmentTableCount = idFitmentPlanTable.getModel("fitmentTb1JModel").getData().length;
		idFitmentPlanTable.setVisibleRowCount(FitmentTableCount);
		
	
	},
	addFitmentTableDetail: function(){
		
		//var mode = true;
		that.initialLoad=false;
		//this.getFitmentTable1Object();
		var FTDtlData	={};
		var idFitmentPlanTable= this.getView().byId("idFitmentPlanTable");
		var fitData = idFitmentPlanTable.getModel("fitmentTb1JModel").getData();
		this.FiTD = idFitmentPlanTable.getModel("fitmentTb1JModel").getData();
		var len = idFitmentPlanTable.getRows().length;
		FTDtlData.TestCategory = fitData[fitData.length-1].TestCategory;
		FTDtlData.Plant = fitData[fitData.length-1].Plant;
		FTDtlData.TestMethodology = fitData[fitData.length-1].TestMethodology;
		FTDtlData.TestingAxle = fitData[fitData.length-1].TestingAxle;
		FTDtlData.TestGroup = fitData[fitData.length-1].TestGroup;
		FTDtlData.TestTyreQty = fitData[fitData.length-1].TestTyreQty;
		FTDtlData.BmGroup = fitData[fitData.length-1].BmGroup;
		FTDtlData.BmTyreQty = fitData[fitData.length-1].BmTyreQty;
		FTDtlData.TotalQty = fitData[fitData.length-1].TotalQty;
		FTDtlData.VehQty = fitData[fitData.length-1].VehQty;
		FTDtlData.Segment = fitData[fitData.length-1].Segment;
		FTDtlData.VehicleApplication = fitData[fitData.length-1].VehicleApplication;
		FTDtlData.ConifgCode 		=fitData[fitData.length-1].ConifgCode;
		FTDtlData.TestTyreFitQty	=fitData[fitData.length-1].TestTyreFitQty;
		FTDtlData.BMTyreFitQty		=fitData[fitData.length-1].BMTyreFitQty;
		
		this.FiTD.push(FTDtlData);
		idFitmentPlanTable.getModel("fitmentTb1JModel").setData(this.FiTD);
		
		idFitmentPlanTable.getModel("fitmentTb1JModel").refresh()
		var UsageFTDetailTableCount = idFitmentPlanTable.getModel("fitmentTb1JModel").getData().length;
		idFitmentPlanTable.setVisibleRowCount(UsageFTDetailTableCount);
		
	},
	onRemoveVehicleDetail: function(oEvent){
		var tbl=this.getView().byId("idFitmentPlanTable"); 
		var idx=oEvent.getSource().getParent()._getBindingContext("fitmentTb1JModel").getPath().split('/')[1];
	     if (idx !== -1) {
	    	 tbl.getModel("fitmentTb1JModel").getData().splice(idx,1);
	    	 tbl.getModel("fitmentTb1JModel").refresh();
			var UsageTyreDetailTableCount = tbl.getModel("fitmentTb1JModel").getData().length;
			tbl.setVisibleRowCount(UsageTyreDetailTableCount);
	     }
	     
	 	var tblreq = this.getView().byId("idTyreDetailsTable");
		for(var i=0 ; i<tblreq.getRows().length ; i++){
			tblreq.getRows()[i].getCells()[9].setText();
			tblreq.getRows()[i].getCells()[10].setText();
		}		
																			// Added on 2 March for FT field visibility on row delete
		for(var i=0 ; i<tbl.getRows().length ; i++){
			
			var cells = tbl.getRows()[i].getCells();
			
			if(tbl.getRows()[i].getCells()[0]._getSelectedItemText() == 'PT'){
				tbl.getRows()[i].getCells()[2].setVisible(false);
				tbl.getRows()[i].getCells()[3].setVisible(false);
				tbl.getRows()[i].getCells()[6].setVisible(false);
				tbl.getRows()[i].getCells()[7].setVisible(false);
				tbl.getRows()[i].getCells()[9].setVisible(false);
			}else{
				tbl.getRows()[i].getCells()[2].setVisible(true);
				tbl.getRows()[i].getCells()[3].setVisible(true);
				tbl.getRows()[i].getCells()[6].setVisible(true);
				tbl.getRows()[i].getCells()[7].setVisible(true);
				tbl.getRows()[i].getCells()[9].setVisible(true);
			}
			
			for(var j=0 ; j<tblreq.getRows().length ; j++){
				if(tblreq.getRows()[j].getCells()[1].getText() == tbl.getRows()[i].getCells()[4].getSelectedKey()){
				  
				var qty  = tbl.getRows()[i].getCells()[5].getValue();
				if(qty != ""){
					
				  if(tbl.getRows()[i].getCells()[0].getSelectedKey()!="01"){
					  var fqty = tblreq.getRows()[j].getCells()[9].getText();
					  
					  
						  if(fqty == ""){
							  fqty = parseInt(tbl.getRows()[i].getCells()[5].getValue()); 
						  }else{
							  fqty = parseInt(fqty) + parseInt(tbl.getRows()[i].getCells()[5].getValue());
						  }					  
						  tblreq.getRows()[j].getCells()[9].setText(fqty);
					  					  
				  }else{
					  var pqty = tblreq.getRows()[j].getCells()[10].getText();
					  if(pqty == ""){
						  pqty = parseInt(tbl.getRows()[i].getCells()[5].getValue()); 
					  }else{
						  pqty = parseInt(pqty) + parseInt(tbl.getRows()[i].getCells()[5].getValue());
					  }	
					  tblreq.getRows()[j].getCells()[10].setText(pqty);
				  }
				 }
				}
				
				if(tblreq.getRows()[j].getCells()[1].getText() == tbl.getRows()[i].getCells()[6].getSelectedKey()){
					var qty  = tbl.getRows()[i].getCells()[7].getValue();
					if(qty != ""){ 
						if(tbl.getRows()[i].getCells()[0].getSelectedKey()!="01"){
							  var fqty = tblreq.getRows()[j].getCells()[9].getText();
							  if(fqty == ""){
								  fqty = parseInt(tbl.getRows()[i].getCells()[7].getValue()); 
							  }else{
								  fqty = parseInt(fqty) + parseInt(tbl.getRows()[i].getCells()[7].getValue());
							  }	
							  tblreq.getRows()[j].getCells()[9].setText(fqty);
						  }else{
							  var pqty = tblreq.getRows()[j].getCells()[10].getText();
							  if(pqty == ""){
								  pqty = parseInt(tbl.getRows()[i].getCells()[7].getValue()); 
							  }else{
								  pqty = parseInt(pqty) + parseInt(tbl.getRows()[i].getCells()[7].getValue());
							  }	
							  tblreq.getRows()[j].getCells()[10].setText(pqty);
						}
				  } 	
				}
			}
		} 
	},
	
	
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

	onChangeCategory: function(oEvent){
		var cat = oEvent.getSource()._getSelectedItemText();
		var path = oEvent.getSource().getParent().getBindingContext("fitmentTb1JModel").getPath().split('/')[1];
		this.setFieldsVisibility(cat, path);
//		this.setTestTyre(cat);
		var tbl=this.getView().byId("idFitmentPlanTable");
		var rowKey = tbl.getRows()[path].getCells()[0]._getSelectedItemText();	
			var val = tbl.getRows()[path].getCells()[7].getValue();
			this.setBmQtyValues(val, path);
			var val2 = tbl.getRows()[path].getCells()[5].getValue();
			this.setQtyValues(val2, path);
			
		this.onLiveChangeQty(oEvent);	
	},
//	set visibility of fields (test method, BM tyre, qty, total qty, vehicle qty
	setFieldsVisibility: function(categoryKey , index){
		var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
		var visible = false;
		var arr= [2,6,7,9];
		if(categoryKey == "FT"){
			visible=true;
		}else{
			visible=false;
		}
		for(var i = 0; i< arr.length;i++){
			idFitmentPlanTable.getRows()[index].getCells()[arr[i]].setVisible(visible);
		}
	},
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
//	code added to set test tyre and Bm tyre based on group and companycode
	setTestTyre: function(){
		var testTyreJModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(testTyreJModel,"testTyreJModel");
		var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
		var data = getRequestDataJModel.getData().RequestHeadtoItemNvg.results;
		
//		if(category== "FT"){
			var matArr=[];
			for(var i=0;i<data.length;i++){
				var mat={};
				mat.Group=data[i].Group;
				mat.GroupDesc=data[i].GroupDesc;
				mat.CompanyCode = data[i].CompanyCode;
				mat.CompanyDesc = data[i].Comname;
				matArr.push(mat);
			}
			testTyreJModel.setData(matArr);

	},
	
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
	onLiveChangeQty: function(oEvent){

		/*  */
				var path = oEvent.getSource().getParent().getBindingContext("fitmentTb1JModel").getPath().split('/')[1];
				var tbl=this.getView().byId("idFitmentPlanTable");
				
				var val5 = tbl.getRows()[path].getCells()[5].getValue();
				if(val5)
				{
					if( val5.substr(-1) == "." || isNaN(val5) )
					{
						val5 = val5.substring(0, val5.length - 1);
						oEvent.getSource().setValue(val5);
					}
				}
				
				var val7 = tbl.getRows()[path].getCells()[7].getValue();
				if(val7)
				{
					if( val7.substr(-1) == "." || isNaN(val7) )
					{
						val7 = val7.substring(0, val7.length - 1);
						oEvent.getSource().setValue(val7);
					}
				}

		/*	*/	
				debugger
				
				var itab1=this.getView().byId("idFitmentPlanTable");
				var itab3=this.getView().byId("idTyreDetailsTable");
				var itab2 = []; 
				
				
				var rowtb1 = itab1.getRows();
				
				for(var i=0;i<rowtb1.length;i++) 
				{ 
				  var cells = rowtb1[i].getCells();
				  
				  var cat = cells[0].getSelectedKey();
				  var ttyre = cells[4].getSelectedKey();
				  var tqty  = cells[5].getValue();
				  var btyre = cells[6].getSelectedKey();
				  var bqty  = cells[7].getValue();
				  
				  var tfqty = cells[15].getValue();
				  var bfqty = cells[16].getValue();				  
			  
				  if(path == i){
					  cells[8].setValue();
					  cells[9].setValue();
				  }
				  var vehQty = 0;
				  
				  if (cat != ""){
					 if (tqty != ""){ 
						 cells[8].setValue(parseInt(tqty));
					 }
					 
					 if (bqty != ""){
						 if (cells[8].getValue() != ""){
						  var btot = cells[8].getValue();
						  btot = parseInt(btot) + parseInt(bqty);
						  cells[8].setValue(parseInt(btot));
						 }
						 else{
							 cells[8].setValue(parseInt(bqty)); 
						 }
					 }
					 
					 var totalQty = cells[8].getValue(); 
					 var axle = cells[3].getSelectedKey();
					 
						if(axle == "01"){
							vehQty = parseInt(totalQty/2);
						}
						else if(axle == "02"){
							vehQty = parseInt(totalQty/4);
						}
						else if(axle == "03"){
							vehQty = "";
						}
						
						if(path == i){		
							cells[9].setValue(vehQty);
							}
					 
					  
					if (itab2.length != 0){
						 if(ttyre!="" && tqty!=""){
						  var tfound = null;                  //30/01
						  for (var j=0;j<itab2.length;j++){
							if(itab2[j].cat == cat && itab2[j].group == ttyre){
								itab2[j].qty = parseInt( itab2[j].qty ) + parseInt(tqty);	
								tfound = "X"
							}  
						  } 
						  if (tfound=="" || tfound == undefined){
							var obj = {};
							obj.cat = cat;
							obj.group = ttyre;
							obj.qty = parseInt(tqty);
							itab2.push(obj); 
						  }
						 }
						
						 if(btyre!="" && bqty!=""){
							  var bfound = null;                 //30/01
							  for (var j=0;j<itab2.length;j++){
								if(itab2[j].cat == cat && itab2[j].group == btyre){
									itab2[j].qty = parseInt( itab2[j].qty )  + parseInt( bqty );	
									bfound = "X"
								}  
							  } 
							  if (bfound=="" || bfound == undefined){
								var obj = {};
								obj.cat = cat;
								obj.group = btyre;
								obj.qty = parseInt(bqty);
								itab2.push(obj); 
							  }
							 }
						
					}else{
					 			
					  if(ttyre!="" && tqty!=""){
						  var obj = {};  
						obj.cat = cat;
						obj.group = ttyre;
						obj.qty = parseInt(tqty);
						itab2.push(obj);
					  }	
					  
					  if(btyre!="" && bqty!=""){
					   if(btyre == ttyre && tqty!=""){
						   itab2[0].qty = parseInt( itab2[0].qty ) + parseInt( bqty );
					   }else{
						   var obj = {};  
						   obj.cat = cat;
						   obj.group = btyre;
						   obj.qty = parseInt(bqty);
						   itab2.push(obj);
					   }
					  }
					}
				  }
				}
		//Changed by Ankit on 6 Feb 2019
				var rowtb3 = itab3.getRows();
		    	   var fterror  = false;
		    	   var pterror  = false;
				
			      for (var j = 0;j<rowtb3.length;j++)
			    	  {
			    	  
			    	   var cells = rowtb3[j].getCells();
			    	   
			    	   var group = cells[1].getText();
			    	   var tottyre = cells[6].getText();
			    	   var ftqty = cells[7].getText();
			    	   var ptqty = cells[8].getText();
			    	     	   
			    	   var ftplqty = 0;
			    	   var ptplqty = 0; 

			    	   cells[9].setText(ftplqty);
			    	   cells[10].setText(ptplqty); 
			    	   
			    	  
			    	  for (var i = 0;i<itab2.length;i++)
			  	  	    {
			    		  if (group == itab2[i].group)
			  	  	    {if (itab2[i].cat == "01")
			    			 {
			    			  if (itab2[i].qty > parseInt(ptqty)){
			    				  ptplqty =  (parseInt(itab2[i].qty));
			    				  cells[10].setText(ptplqty);
			    				  pterror = true; 
			    			  } 
			    			  else{
			    				  ptplqty =  (parseInt(itab2[i].qty));
			    				  cells[10].setText(ptplqty);
			    			  }
			    			 }
			    		 else{
			    			  if (itab2[i].qty > parseInt(ftqty)){

			    				  ftplqty =  (parseInt(itab2[i].qty));
			    				  cells[9].setText(ftplqty);
			    				  fterror = true; 
			    			  } 
			    			  else{
			    				  ftplqty =  (parseInt(itab2[i].qty));
			    				  cells[9].setText(ftplqty);
			    			  }	
			    		 }
			    	   }			    	  
			    	  }
			    }	
		    	  
	},
	onLiveChangeBMQty: function(oEvent){
		var qtyNo =oEvent.getSource().getValue();
		var path = oEvent.getSource().getParent().getBindingContext("fitmentTb1JModel").getPath().split('/')[1];
		var tbl=this.getView().byId("idFitmentPlanTable");
		var getRequestDataJModel = this.getView().getModel("getRequestDataJModel");
		var testCatKey = getRequestDataJModel.getData().TestCategory;
		var rowKey = tbl.getRows()[path].getCells()[0]._getSelectedItemText(); 
		if(qtyNo){
			if(isNaN(qtyNo)){
				qtyNo = qtyNo.substring(0, qtyNo.length - 1);
				oEvent.getSource().setValue(qtyNo);
//				if(testCatKey === "05"){
					if(rowKey == "FT"){
						this.setBmQtyValues(qtyNo, path);
					}
//				}
			}else{
//				if(testCatKey === "05"){
					if(rowKey == "FT"){
						this.setBmQtyValues(qtyNo, path);
					}
				}
//			}	
		}else{
			qtyNo = 0;
//			if(testCatKey === "05"){
				if(rowKey == "FT"){
					this.setBmQtyValues(qtyNo, path);
				}
			}
//		}
	},
	setQtyValues: function(value , index){
		var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
		var cells = idFitmentPlanTable.getRows()[index].getCells();
		var testTyreJModel = this.getView().getModel("testTyreJModel");
		var groupQtyModel = new sap.ui.model.json.JSONModel();
		groupQtyModel.setData(testTyreJModel.getData());
		this.getView().setModel(groupQtyModel,"groupQtyModel");
		
//		var catgkey = idFitmentPlanTable.getRows()[index].getCells()[0]._getSelectedItemText();
		
		var group = cells[4].getSelectedKey();
//		var bmgroup = cells[6].getSelectedKey();
		var totalQty= 0;
		
//		if(group == bmgroup){
			cells[7].setValue(value);
//		}
		
		var qty = cells[5].getValue();
		if(qty == ""){
			qty = 0;
		}
		var bmQty = cells[7].getValue();
		if(bmQty == ""){
			bmQty = 0;
		}
		var totalQty1 = parseInt(qty) + parseInt(bmQty);
		cells[8].setValue(totalQty1);
		
		for(var j=0; j<groupQtyModel.getData().length;j++){
			groupQtyModel.getData()[j].GroupQty=0;
			for(var i=0;i<idFitmentPlanTable.getRows().length;i++){
				var rows = idFitmentPlanTable.getRows();
				var tstQty = rows[i].getCells()[5].getValue();
				if(tstQty == ""){
					tstQty= 0 ;
				}
				var tmpBmQty = rows[i].getCells()[7].getValue();
				if(tmpBmQty == ""){
					tmpBmQty= 0 ;
				}
				if(rows[i].getCells()[4].getSelectedKey() == groupQtyModel.getData()[j].Group && rows[i].getCells()[6].getSelectedKey() == groupQtyModel.getData()[j].Group){
					
					if(rows[i].getCells()[0]._getSelectedItemText() =="FT"){
						groupQtyModel.getData()[j].GroupQty += parseInt(tstQty) + parseInt(tmpBmQty);
					}
				}
				else if(rows[i].getCells()[4].getSelectedKey() == groupQtyModel.getData()[j].Group){
					if(rows[i].getCells()[0]._getSelectedItemText() =="FT"){
						groupQtyModel.getData()[j].GroupQty += parseInt(tstQty);
					}
				}else if(rows[i].getCells()[6].getSelectedKey() == groupQtyModel.getData()[j].Group){
					if(rows[i].getCells()[0]._getSelectedItemText() =="FT"){
						groupQtyModel.getData()[j].GroupQty += parseInt(tmpBmQty);
					}
				}
			}
		}
		var totalQty=0;
		this.setFitPlanned(group, totalQty, index);
		
	},
	setFitPlanned: function(group, totalQty, path){
		var groupQtyModel =this.getView().getModel("groupQtyModel");
		var idTyreDetailsTable = this.getView().byId("idTyreDetailsTable");
		var data = idTyreDetailsTable.getModel("fitmentTb2JModel").getData();
		var tbl=this.getView().byId("idFitmentPlanTable");
		for(var i = 0; i< data.length;i++){
//			if test tyre group and bm tyre geroup are same
			data[i].FitPlanned = groupQtyModel.getData()[i].GroupQty;
			if(data[i].Group == group){
				if(data[i].FitPlanned  > data[i].Nonptqty){
					tbl.getRows()[path].getCells()[5].setValue("");
					this.setQtyValues(0, path);
					sap.m.MessageBox.show("Total Quantity can not be greater than fitment quantity of same Group");
					return false;
				}
			}
		
		}
		
		idTyreDetailsTable.getModel("fitmentTb2JModel").refresh();
	},
	setBmQtyValues: function(value, index){
		var idFitmentPlanTable=this.getView().byId("idFitmentPlanTable");
		var testTyreJModel = this.getView().getModel("testTyreJModel");
		var groupQtyModel = new sap.ui.model.json.JSONModel();
		groupQtyModel.setData(testTyreJModel.getData());
		this.getView().setModel(groupQtyModel,"groupQtyModel");
		var cells = idFitmentPlanTable.getRows()[index].getCells();
		var qty = cells[5].getValue();
		var bmQty = cells[7].getValue();
		if(qty == ""){
			qty = 0;
		}
		var bmQty = cells[7].getValue();
		if(bmQty == ""){
			bmQty = 0;
		}
		
		var totalQty1 = parseInt(qty) + parseInt(bmQty);
		cells[8].setValue(totalQty1);
		
		
		var group = cells[6].getSelectedKey();
		var totalQty= 0;
		
		for(var j=0; j<groupQtyModel.getData().length;j++){
			groupQtyModel.getData()[j].GroupQty=0;
			for(var i=0;i<idFitmentPlanTable.getRows().length;i++){
				var rows = idFitmentPlanTable.getRows();
				var tstQty = rows[i].getCells()[5].getValue();
				if(tstQty == ""){
					tstQty= 0 ;
				}
				var tmpBmQty = rows[i].getCells()[7].getValue();
				if(tmpBmQty == ""){
					tmpBmQty= 0 ;
				}
				if(rows[i].getCells()[4].getSelectedKey() == groupQtyModel.getData()[j].Group && rows[i].getCells()[6].getSelectedKey() == groupQtyModel.getData()[j].Group){
					
					groupQtyModel.getData()[j].GroupQty += parseInt(tstQty) + parseInt(tmpBmQty);
				}
				else if(rows[i].getCells()[4].getSelectedKey() == groupQtyModel.getData()[j].Group){
					groupQtyModel.getData()[j].GroupQty += parseInt(tstQty);
				}else if(rows[i].getCells()[6].getSelectedKey() == groupQtyModel.getData()[j].Group){
					groupQtyModel.getData()[j].GroupQty += parseInt(tmpBmQty);
				}
			}
		}
		var totalQty=0;
		this.setFitPlannedBM(group, totalQty, index);
		
	},

	setFitPlannedBM: function(group, totalQty, path){
		var idTyreDetailsTable = this.getView().byId("idTyreDetailsTable");
		var data = idTyreDetailsTable.getModel("fitmentTb2JModel").getData();
		var groupQtyModel =this.getView().getModel("groupQtyModel");
		var tbl=this.getView().byId("idFitmentPlanTable");
		for(var i = 0; i< data.length;i++){
			data[i].FitPlanned = groupQtyModel.getData()[i].GroupQty;
			if(data[i].Group == group){
				if(data[i].FitPlanned  > data[i].Nonptqty){
					tbl.getRows()[path].getCells()[7].setValue("");
					this.setBmQtyValues(0, path);
					sap.m.MessageBox.show("Total Quantity can not be greater than fitment quantity of same Group");
					return false;
				}
			}

		}
		idTyreDetailsTable.getModel("fitmentTb2JModel").refresh();
	},
	onTestTyreSelect: function(oEvent){
		var path = oEvent.getSource().getParent().getBindingContext("fitmentTb1JModel").getPath().split('/')[1];
		var tbl=this.getView().byId("idFitmentPlanTable");
		var val = tbl.getRows()[path].getCells()[5].getValue();
		this.setQtyValues(val, path);
//		var val2 = tbl.getRows()[path].getCells()[7].getValue();
//		this.setBmQtyValues(val2, path);
	},
	onBMTyreSelect: function(oEvent){
		var path = oEvent.getSource().getParent().getBindingContext("fitmentTb1JModel").getPath().split('/')[1];
		var tbl=this.getView().byId("idFitmentPlanTable");
		var val = tbl.getRows()[path].getCells()[7].getValue();
		this.setBmQtyValues(val, path);
//		var val2 = tbl.getRows()[path].getCells()[5].getValue();
//		this.setQtyValues(val2, path);
	},
	
	checkPTValues: function(qty, path){
		var idTyreDetailsTable = this.getView().byId("idTyreDetailsTable");
		var data = idTyreDetailsTable.getModel("fitmentTb2JModel").getData();
		var tbl=this.getView().byId("idFitmentPlanTable");
		var tyreGroup = tbl.getRows()[path].getCells()[4].getSelectedKey();
		var ptQty= 0;
		for(var j=0;j< tbl.getRows().length;j++){
			var testCatg = tbl.getRows()[j].getCells()[0]._getSelectedItemText();
			if(testCatg == "PT"){
				var rowKey = tbl.getRows()[j].getCells()[4].getSelectedKey();
				if(rowKey == tyreGroup){
					ptQty+= parseInt(tbl.getRows()[j].getCells()[5].getValue());
				}
			}
		}
		
//		var tyreQty = tbl.getRows()[path].getCells()[5].getValue();
		for(var i = 0; i< data.length;i++){
			if(data[i].Group == tyreGroup){
				if(ptQty  > data[i].Ptqty){
					tbl.getRows()[path].getCells()[5].setValue("");
					sap.m.MessageBox.show("Total Quantity can not be greater than PT quantity of same Group");
					return false;
				}
			}

		}
	},
	onChangeFitmentAxle: function(oEvent){
		var axleType = oEvent.getSource().getSelectedKey();
		var tbl=this.getView().byId("idFitmentPlanTable"); 
		var idx=oEvent.getSource().getParent()._getBindingContext("fitmentTb1JModel").getPath().split('/')[1];
		var cells = tbl.getRows()[idx].getCells();
		var vehQty = 0;
		var totalQty = cells[8].getValue();
		if(totalQty == ""){
			totalQty = 0;
		}
		if(axleType == "01"){
			vehQty = parseInt(totalQty/2);
		}
		else if(axleType == "02"){
			vehQty = parseInt(totalQty/4);
		}
		else if(axleType == "03"){
			vehQty = parseInt(totalQty);
		}
		cells[9].setValue(vehQty);
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////	
	onApprovePDC: function(){
		
		mode='G';
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
		
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are You Sure You Want To Approve The Test Plan.", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"ztestplanapprov.view.Remarks", that);
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
		
/*		var payload = this.createPayload(mode);
		this.onCreateTestPlanSet(payload, mode);*/
	},
	onApprovePTG: function(){
		
		mode='A';
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
		
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are You Sure You Want To Approve The Test Plan.", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"ztestplanapprov.view.Remarks", that);
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
	},
	
	onApproveTD: function(){ 
		
		mode='T';
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
		
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are You Sure You Want To Authorize The Test Plan.", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"ztestplanapprov.view.Remarks", that);
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
		
		/*var payload = this.createPayload(mode);
		this.onCreateTestPlanSet(payload, mode);*/
	},
	onModify: function(){
		
		mode='E';
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
		
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are You Sure You Want To Modify The Test Plan.", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"ztestplanapprov.view.Remarks", that);
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
		
		/*var payload = this.createPayload(mode);
		this.onCreateTestPlanSet(payload, mode);*/
	},
	onReject : function(){
		debugger
		mode = 'X';
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
		
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are You Sure You Want To Close The Test Plan.", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"ztestplanapprov.view.Remarks", that);
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
		
		/*var payload = this.createPayload(mode);
		this.onCreateTestPlanSet(payload, mode);*/
	},
	onHold : function(){
		mode = 'H';
		this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
		
		sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.show(
				"Are You Sure You Want To Hold The Test Plan.", {
					icon: MessageBox.Icon.INFORMATION,
					title: "Warning",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction){
						if(oAction === sap.m.MessageBox.Action.YES){
							if (!that._RemarkDialog) {
								that._RemarkDialog = sap.ui.xmlfragment(
										"ztestplanapprov.view.Remarks", that);
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
		
		/*var payload = this.createPayload(mode);
		this.onCreateTestPlanSet(payload, mode);*/
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onRemarks : function(){
		debugger
		remark = sap.ui.getCore().byId("idRemarks").getValue();
		if(remark == "" && (mode == "X" || mode == "H" ) ){
			sap.m.MessageToast.show("Please fill remarks");
			sap.ui.getCore().byId("idRemarks").setValueState(sap.ui.core.ValueState.Error);
			return;
		}
		var that=this;
		
	    var payload = that.createPayload(mode);
	    that.onCreateTestPlanSet(payload, mode);
	},
//////////////////////////////////////////////////////////////////////////////////////////////////	
	createPayload:function(mode){
		debugger
		 var idTestReqNoSelect = this.getView().byId("idTestReqNoSelect");
		 var idFitmentPlanText = this.getView().byId("idFitmentPlanText");
		 var idRotationPlanText = this.getView().byId("idRotationPlanText");
		 var idSplReqText = this.getView().byId("idSplReqText");
		
		 var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");
		 var idTyreDetailsTable = this.getView().byId("idTyreDetailsTable");	
		 var idDiscountDetailsTable = this.getView().byId("idDiscountDetailsTable");
		 
		 
//		 Tyre Details table payload creation
		 
		 var fitmentTableArr=[];
		 var fitData = idFitmentPlanTable.getModel("fitmentTb1JModel").getData();
		 var fitData2 = idTyreDetailsTable.getModel("fitmentTb2JModel").getData();
		// var itemNumber = fitData2[0].ItemNumber;
		 var tableRows = idFitmentPlanTable.getRows();
		 for(var i=0;i<fitData.length;i++){
			 var fit={};
			 fit.PlanGuid = "";
			 fit.ItemNumber   = fitData[i].ItemNumber;;
			 fit.TestCategory = tableRows[i].getCells()[0].getSelectedKey();
			 fit.Plant = fitData[i].Plant;
			 fit.PlanRev="";
			 fit.TestMethodology=tableRows[i].getCells()[2].getSelectedKey();
			 fit.TestingAxle=fitData[i].TestingAxle;
			 fit.TestGroup=tableRows[i].getCells()[4].getSelectedKey();
			 if(fitData[i].TestTyreQty){
				 fit.TestTyreQty=parseInt(fitData[i].TestTyreQty); 
			 }else{
				 fit.TestTyreQty=0;
			 }
			 fit.BmGroup=tableRows[i].getCells()[6].getSelectedKey();
			 if(fitData[i].BmTyreQty){
				 fit.BmTyreQty=parseInt(fitData[i].BmTyreQty); 
			 }else{
				 fit.BmTyreQty=0;
			 }
			 if(fitData[i].TotalQty){
				 fit.TotalQty=parseInt(fitData[i].TotalQty); 
			 }else{
				 fit.TotalQty=0;
			 }
			 if(fitData[i].VehQty){
				 fit.VehQty=parseInt(fitData[i].VehQty); 
			 }else{
				 fit.VehQty=0;
			 }
			 fit.Segment=fitData[i].Segment;
			 fit.VehicleApplication=fitData[i].VehicleApplication;
			 fit.ConifgCode=fitData[i].ConifgCode;	
		
			 fit.ConfigDesc="";
			 
			 if(fitData[i].TestTyreFitQty){
				 fit.TestTyreFitQty=parseInt(fitData[i].TestTyreFitQty); 
			 }else{
				 fit.TestTyreFitQty=0;
			 }
			 
			 if(fitData[i].BMTyreFitQty){
				 fit.BMTyreFitQty=parseInt(fitData[i].BMTyreFitQty); 
			 }else{
				 fit.BMTyreFitQty=0;
			 }	
			 
			 fitmentTableArr.push(fit);
		 }
		 
//		Callback table payload creation 
		 var fitArr=[];
		 var fitData2 = idTyreDetailsTable.getModel("fitmentTb2JModel").getData();
		 for(var i=0;i<fitData2.length;i++){
			 var fit2={};
			 fit2.PlanGuid= "";
			 fit2.PlanRev="";
			 fit2.ItemNumber = fitData2[i].ItemNumber;
			 fit2.Group = fitData2[i].Group;
			 fit2.FtPlanned = parseInt(fitData2[i].FtPlanned);
			 fit2.PtPlanned = parseInt(fitData2[i].PtPlanned);
			 fitArr.push(fit2);
		 }
	
//		 Vehicle Details table payload creation
		 var discArr=[];
		 var discountData = idDiscountDetailsTable.getModel("discountJModel").getData();
		 for(var i=0;i<discountData.length;i++){
			 var disc={};
//			 vehicle.TestRequestNumber ="";
			 disc.PlanGuid="";
			 disc.PlanRev="";
			 disc.ItemNumber= discountData[i].ItemNumber;
			 disc.Group = discountData[i].Group;
			
			 // disc.Material = discountData[i].Material;
			 
			 
			 if(discountData[i].Discount !==""){
				 disc.Discount = parseInt(discountData[i].Discount);

			 }else{
				 disc.Discount = 0;
			 }
			 
			 disc.Remarks = discountData[i].Remarks;
			 
			 discArr.push(disc);
		 }
			
//	final payload	 
		 
		var payload={
				ReqGuid: this.ReqGuid,
				ReqRev: this.ReqRevNo,
				PlanGuid : this.PlanGuid,
				PlanRev: this.PlanRevNo,
				TestPlanNumber : "",
				SaveMode : mode,
				FitmentPlan:idFitmentPlanText.getValue(),
				RotPlan:idRotationPlanText.getValue(),
				Remarks:idSplReqText.getValue(),
				ApprRemarks: remark
			}
		payload.PlanHeadtoCatNvg= fitmentTableArr;
		payload.PlanHeadtoFitmentNvg = fitArr;
//		payload.TestRequestItemSet = [];
		payload.PlanHeadtoDiscountNvg = discArr;
		return payload;
	},
	onCreateTestPlanSet: function(payload, mode){

		var oView = this.getView();
		var sPathPOHeaderSet = "/TestPlanSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsPOHeaderSet = {};
		oParamsPOHeaderSet.context = "";
		oParamsPOHeaderSet.urlParameters = "";
		
		oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
				
				if(mode == "A" || mode == "G"){
					sap.m.MessageBox.show(
					  "Plan Number: "+oResponse.data.TestPlanNumber+" Approved.", {
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
				
				if(mode == "X"){
					sap.m.MessageBox.show(
					  "Plan Number: "+oResponse.data.TestPlanNumber+" Closed.", {
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
				if(mode == "H" ){
					sap.m.MessageBox.show(
					  "Plan Number: "+oResponse.data.TestPlanNumber+" is on Hold.", {
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

				if(mode == "T" ){
					sap.m.MessageBox.show(
					  "Plan Number: "+oResponse.data.TestPlanNumber+" Authorized.", {
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
				if(mode == "E" ){
					sap.m.MessageBox.show(
					  "Plan Number: "+oResponse.data.TestPlanNumber+" sent back for Modification.", {
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

				
				if(mode == "R"){
					sap.m.MessageBox.show(
					  "Plan Number: "+oResponse.data.TestPlanNumber+" Rejected.", {
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
			//	that.saveUploadedDocs(that.SelectedData.planguid, that.SelectedData.planrevno);         	// document upload
/*	*/
		};
		oParamsPOHeaderSet.error = function(oError) { // error handler 		
			jQuery.sap.log.error("read publishing group data failed");
		}.bind(this);

		frameworkODataModel.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

		frameworkODataModel.attachRequestCompleted(function() {
			
		});
	},
	
	setEnableDisableAllFields: function(mode){
		
		var oView= this.getView();
		oView.byId("idFitmentPlanText").setEnabled(mode);
		oView.byId("idRotationPlanText").setEnabled(mode);
		oView.byId("idSplReqText").setEnabled(mode);
		
		var idFitmentPlanTable = this.getView().byId("idFitmentPlanTable");	 
		var rows1 = idFitmentPlanTable.getRows();
		for(var a=0; a<rows1.length; a++){
			var cell1= rows1[a].getCells();
			for(var b = 0 ; b<cell1.length;b++){
				cell1[b].setEnabled(mode);
				
			}
		}
		
		var idDiscountDetailsTable=  this.getView().byId("idDiscountDetailsTable");
		var discRows= idDiscountDetailsTable.getRows();
		for(var i=0; i<discRows.length; i++){
			var cell1= discRows[i].getCells();
				cell1[3].setEnabled(mode);
				cell1[4].setEnabled(mode);
		}
	},
	
	/*onEditTestCart: function(mode){
		var mode=true;
		this.getView().byId("saveBtn").setVisible(true);
		this.getView().byId("cartBtn").setVisible(true);
		this.setEnableDisableAllFields(mode);
		this.getView().byId("editBtn").setVisible(false);
	},*/
	
	onReset: function(){
		var mode=false;
		this.setEnableDisableAllFields(mode);
		this.getView().byId("editBtn").setVisible(true);
		this.bindRequestData(this.SelectedData.reqGuid , this.SelectedData.gUid);
	},
	onBack: function(){
		//var eMode= true;
		//this.setEnableDisableAllFields(eMode);
		/*this.getView().byId("editBtn").setVisible(false);
		
		this.getView().byId("saveBtn").setVisible(false);
		this.getView().byId("cartBtn").setVisible(false);*/
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("S1");
	},
	OnPrint : function(e){
		debugger
		var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
		var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
		var planguid  = data.TestPlanGuid;
		var planrevno = data.PlanRevNo;
		
		sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestPlanOutputFormSet(PlanGuid='"+planguid+"',RevNo='"+planrevno+"')/$value", true);
		
},	


    // ************************************File Upload *********************	

    // start of document upload
	//var attachmentModel = new sap.ui.model.json.JSONModel();
	//this.getView().setModel(attachmentModel,"attachmentModel");
	//attachmentModel.setData([]);
	
	//var oUploadModel = new sap.ui.model.json.JSONModel({
	//	items : []
	//});
	
	//this.getView().setModel(oUploadModel,"oUploadModel");
	// end of document upload

/*	//onCreateTestPlanSet: function
	//that.saveUploadedDocs(that.SelectedData.planguid, that.SelectedData.planrevno);         	// document upload
	
	// _onRoute
	//this.getAttachmentDetails(this.SelectedData.planguid,this.SelectedData.planrevno);  		// document upload
*/
	
	onAttachUpload: function(oEvent){
		debugger
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
    	debugger
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
		
		debugger
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
	
   
/*    onTypeMissmatch: function(oEvent){
    	debugger
    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
    	return false;
    },*/
    
   
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
      
      getAttachmentDetails: function(selectedGuId){        //document upload
			var oView = this.getView();
			var oUploadModel = this.getView().getModel("oUploadModel");
			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
			var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='03',ObjectName='"+selectedGuId+"')?$expand=ImageObjectToDataNvg";
			var oParamsAttachmentSet = {};
			oParamsAttachmentSet.context = "";
			oParamsAttachmentSet.urlParameters = "";
			oParamsAttachmentSet.success = function(oData, oResponse) { // success handler
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
			};
			oParamsAttachmentSet.error = function(oError) { // error handler 		
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
	

});
});
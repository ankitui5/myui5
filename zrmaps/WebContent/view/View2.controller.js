sap.ui.define([
	"sap/m/MessageBox",
	 "sap/ui/core/mvc/Controller",
     "sap/ui/model/json/JSONModel",
     "sap/viz/ui5/controls/common/feeds/FeedItem",
     "sap/viz/ui5/data/FlattenedDataset"
	],
	
function(Controller, JSONModel, FeedItem, FlattenedDataset) {
	"use strict";
return sap.ui.controller("zrmaps.view.View2", {
	onInit : function() {
		debugger 
		//sap.ui.core.UIComponent.getRouterFor(this).getRoute("View2").attachMatched(this._onRoute, this);
		
		//this.FitmentChartCount(); //create chart data from odata.
		this.FunCustomData(); //crete chart data from custom data.
	},
	

/*_onRoute : function(){
	debugger
},*/	
/**********************************************************************************************************************/
	FitmentChartCount : function(){
		debugger
		var oViewObj = this.getView();
		var FitmentChartData = oViewObj.getModel("FitmentChartData");
		if (!FitmentChartData) {
			FitmentChartData = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(FitmentChartData, "FitmentChartData");
		}
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/"; 
		var sPathCartListSet = "DealerClaimCountSet";
		var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var oParamsCartListSet = {};
		oParamsCartListSet.context = "";
		oParamsCartListSet.urlParameters = "";
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			debugger;
			FitmentChartData.setData(oData.results);
			
		};
		oParamsCartListSet.error = function(oError) { // error handler&nbsp;
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
		frameworkODataModel.attachRequestCompleted(function() {
		});
	},
	

/*****************************************************************************************************************/	
FunCustomData : function(){
	debugger
	var oViewObj = this.getView();
	var FitmentChartData = oViewObj.getModel("FitmentChartData");
	if (!FitmentChartData) {
		FitmentChartData = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(FitmentChartData, "FitmentChartData");
	}
	var arr = [
				{"Count":"10","Status":"1"},
				{"Count":"20","Status":"2"},
				{"Count":"30","Status":"3"},
				{"Count":"5","Status":"4"},
				{"Count":"8","Status":"5"},
				{"Count":"10","Status":"6"},
				{"Count":"40","Status":"7"},
			];	
	FitmentChartData.setData(arr);
},

/**********************************************************************************************************************/

	onFrag : function(){
		debugger
		this._HelpDialogFrag = sap.ui.xmlfragment("zrmaps.view.MyFragments",this);
		this.getView().addDependent(this._HelpDialogFrag);
		this._HelpDialogFrag.open(); 
	},
	
	Oncancel : function(){
		this._HelpDialogFrag.close();
		this._HelpDialogFrag.destroy(true);
	},
/*****************************************************************************************************************/	

});
});
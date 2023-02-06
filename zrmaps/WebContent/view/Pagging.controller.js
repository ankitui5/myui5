sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	'sap/suite/ui/commons/ChartContainerContent',
	 "sap/viz/ui5/controls/common/feeds/FeedItem",
     "sap/viz/ui5/data/FlattenedDataset"
	
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast,FeedItem,FlattenedDataset) {
	"use strict";
		var that
return sap.ui.controller("zrmaps.view.Pagging", {
	
onInit: function() {
debugger

sap.ui.core.UIComponent.getRouterFor(this).getRoute("Pagging").attachMatched(this._onRoute, this);

},

_onRoute:function(){
	debugger
	this.OnSearch();
},
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
OnSearch : function() {                                              
	debugger
	var check		= false;
	var that 		= this;
	var TestReqNo 	= "";
	var Status 		= "";
	var FitStatus 	= "";
	var PlanNo 		= "";
	var VehNo 		= "";
	var TestReqGuidNo = "";
	
	var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
	var oModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl); 
	oModel1.read("/GetRequestImageSet?$expand=GetImageDataSet&$filter=DateFrom eq "+null+" and DateTo eq "+null+" and Guid eq '"+TestReqGuidNo+"' and Status eq '"+Status+"'", null,null,true, function(oData){ 
	var TableJModel =  new sap.ui.model.json.JSONModel(); 
	TableJModel.setData(oData.results); 
	that.getView().setModel(TableJModel,"TableJModel");		   
	  });
	
	/*var TableJModel = new sap.ui.model.json.JSONModel();
	    this.getView().setModel(TableJModel,"TableJModel")

	var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";

	var sPath = "GetRequestImageSet?$expand=GetImageDataSet&$filter=DateFrom eq "+null+" and DateTo eq "+null+" and Guid eq '"+TestReqGuidNo+"' and Status eq '"+Status+"'"		
	
	 var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		 oReadModel.setHeaders({"Content-Type" : "application/json"});
	var fncSuccess = function(oData, oResponse){
		debugger
	
		if(oData.results.length==0){
			sap.m.MessageToast.show("No Data found");
		}
		
		TableJModel.setData(oData.results);
		
		
	}

	var fncError = function(oError) { // error callback
		
		}
	
	oReadModel.read(sPath, {
		  success : fncSuccess,
		  error : fncError
	});*/
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
})
});
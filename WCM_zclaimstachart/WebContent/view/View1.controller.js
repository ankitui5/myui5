sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
     "zclaimstachart/util/Formatter"
	
	
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast) {
	"use strict";
		var that
return sap.ui.controller("zclaimstachart.view.View1", {
					
onInit: function() {
		that= this;	
		if (!jQuery.support.touch){
			this.getView().addStyleClass("sapUiSizeCompact");
			var iOriginalBusyDelay,
				oViewJModel = new sap.ui.model.json.JSONModel({
					busy: false,
					delay: 0
				});
			this.getView().setModel(oViewJModel, "oViewJModel");	
		}
		debugger
		this.onClaimStatus(); //Use for claim status
		this.onDealerInfo();
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("View1").attachMatched(this._onRoute, this); 
},
/******************************************************************************************************************************/
	_onRoute : function(e){
		debugger
		var that 				= this;
		var tempjsonString  	= e.getParameter("arguments").hub;
		var jsonstring 			= tempjsonString.replace(/@/g, "/");
		//var tempSelectedData 	= JSON.parse(jsonstring);
		//this.SelectedData  		= JSON.parse(tempSelectedData);
		
	    this.getView().byId("idClaimStatus").setSelectedKey(jsonstring);
		
		var oViewObj = this.getView();
		var DealerClaimJModel = oViewObj.getModel("DealerClaimJModel");
		if (!DealerClaimJModel) {
			DealerClaimJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(DealerClaimJModel, "DealerClaimJModel");
		}
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/"; 
	    var sPathCartListSet = "/DealerClaimCountDetailSet?$filter=IClaimNo eq '' and Status eq '"+jsonstring+"'";
	    var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
		var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				
				DealerClaimJModel.setData(oData.results);				
			};
			oParamsCartListSet.error = function(oError) { // error handler 
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
	},
	
/****************************************************************************************************************************/
	onDealerInfo : function(){
		debugger
		var that=this;
		var user = new sap.ushell.services.UserInfo();
		var uid = user.getId();
		var oViewObj = this.getView();
		var DealerInfoSetJModel = oViewObj.getModel("DealerInfoSetJModel");
		if (!DealerInfoSetJModel) { 
			
			DealerInfoSetJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(DealerInfoSetJModel, "DealerInfoSetJModel");
		}
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
		
		var fncSuccess = function(oData, oResponse){
			
			DealerInfoSetJModel.setData(oData);
			
			var DlrName = DealerInfoSetJModel.oData.Name1;

			that.getView().byId("HeaderIdTit").setTitle(DlrName);
		}	
						
		var fncError = function(oError) { // error callback	// function
			var parser = new DOMParser();
			var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			}); 
		}
		// Create Method for final Save
		oReadModel.read("/GetDealerInfoSet(Uname='"+uid+"',Bukrs='')", {
			success : fncSuccess,
			error : fncError
		});
		
	},	
	
/****************************************************************************************************************************/
	
onClaimF4 : function() {
	debugger
	var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/GetClaimNoSet?$filter=Flag eq'D'";
	var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false,
				false, null);
	var _valueHelpClaimSelectDialog = new sap.m.SelectDialog({
		title : "Select Claim No",
		items : {
				path : "/d/results",
					template : new sap.m.StandardListItem({
						title : "{CLAIM_NO}",
						customData : [ new sap.ui.core.CustomData({
							key : "Key",
							value : "{CLAIM_NO}"
						})],
					}),
		},
		
		liveChange : function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("CLAIM_NO",sap.ui.model.FilterOperator.Contains,sValue);
			oEvent.getSource().getBinding("items").filter([ oFilter ]);
		},
			
		confirm : [ this._handleClaimClose, this ],
		cancel : [ this._handleClaimClose, this ]
		});
		
		_valueHelpClaimSelectDialog.setModel(jModel);
		_valueHelpClaimSelectDialog.open();
},
		
	_handleClaimClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		     if(oSelectedItem){
			     this.getView().byId("idClaimno").setValue(oSelectedItem.getTitle());
		      }
    },
/****************************************************************************************************************************/
        
onClaimStatus:function(){
	debugger
	var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/F4ClaimStatusSet";
	var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
	var loc= this.getView().byId("idClaimStatus");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{ClaimStatus}",
				text : "{ClaimStatusDesc}"
			})
		}); 		
},    
	
 /****************************************************************************************************************************/
             
	
     //for busy inicator
             hideBusyIndicator : function() {
                 sap.ui.core.BusyIndicator.hide();
          },
          
          showBusyIndicator : function (iDuration, iDelay) {
                 sap.ui.core.BusyIndicator.show(iDelay);

                 if (iDuration && iDuration > 0) {
                        if (this._sTimeoutId) {
                              jQuery.sap.clearDelayedCall(this._sTimeoutId);
                              this._sTimeoutId = null;
                        }

                        this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
                              this.hideBusyIndicator();
                        });
                 }
          },
      
            
             
/*******************************************************************************************************************************/
onSearch : function() {                                              
		debugger;
		var ClaimNo = this.getView().byId("idClaimno").getValue();
		var ClaimStatus = this.getView().byId("idClaimStatus").getSelectedKey();

				
	var oViewObj = this.getView();
	var DealerClaimJModel = oViewObj.getModel("DealerClaimJModel");
		if (!DealerClaimJModel) {
			DealerClaimJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(DealerClaimJModel, "DealerClaimJModel");
		}
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/"; 
	var sPathCartListSet = "/DealerClaimCountDetailSet?$filter=IClaimNo eq '"+ClaimNo+"' and Status eq '"+ClaimStatus+"'";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
	var oParamsCartListSet = {};
		oParamsCartListSet.context = "";
		oParamsCartListSet.urlParameters = "";
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			DealerClaimJModel.setData(oData.results);				
		};
		oParamsCartListSet.error = function(oError) { // error handler 
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
			frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
	},			
	
/****************************************************************************************************************************/
					
onClear : function(){
	 debugger;
		var tableid = this.getView().byId("idTable");
		var ListSetJModel = tableid.getModel("DealerClaimJModel");
			ListSetJModel.setData([]);
			ListSetJModel.refresh();
			 this.getView().byId("idClaimno").setValue("");
			 this.getView().byId("idClaimStatus").setSelectedKey("");
			sap.m.MessageToast.show("Filters Removed");
},
/***********************************************************************************************************************/			
	
})


});
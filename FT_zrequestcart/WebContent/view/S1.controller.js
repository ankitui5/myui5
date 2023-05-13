var that;
jQuery.sap.require("zRequestCart.util.Formatter");
sap.ui.controller("zRequestCart.view.S1", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.S1
*/
	onInit: function() {
		that=this;
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		jQuery.sap
		.includeStyleSheet(jQuery.sap
				.getModulePath(
						"zRequestCart.css.style",
						".css"));
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"page1").attachMatched(this._onRoute, this);
	},
	
	_onRoute: function(){
		
		this.bindCartListSet();
	},
	
	

	bindCartListSet: function(){
		debugger
		var oViewObj = this.getView();
		var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
		if (!CartListSetJModel) {
			CartListSetJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
		}
		//var filters = [];
		debugger
	
		var sPathCartListSet = "/GetTestRequestCartSet?$filter=Uname eq '" +sap.ushell.Container.getService("UserInfo").getId()+ "'";
		
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsCartListSet = {};
		oParamsCartListSet.context = "";
		oParamsCartListSet.urlParameters = "";
		oParamsCartListSet.success = function(oData, oResponse) { // success handler

			CartListSetJModel.setData(oData.results);
		};
		oParamsCartListSet.error = function(oError) { // error handler 
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
		frameworkODataModel.attachRequestCompleted(function() {
			//oViewObj.setModel(monthListSetJModel, "monthListSetJModel");
			that.onAfterRendering();
		});
	},
	displayRequest: function(e){
		var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
		var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
		var guid = data.TestGuid;
		var revno = data.RevNo;
		var reqId = data.TestRequestNumber;
		var selectedData={};
		selectedData.gUid = guid;
		selectedData.reqId = reqId;
		selectedData.revno = revno;
		var tempjsonString = JSON.stringify(selectedData);
		var jsonstring = tempjsonString.replace(/\//g, "@");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});
	},
	
onAfterRendering: function() {
this.getView().byId("idApproverTable").setAlternateRowColors(true);
},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.S1
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.S1
*/

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.S1
*/
//	onExit: function() {
//
//	}

});
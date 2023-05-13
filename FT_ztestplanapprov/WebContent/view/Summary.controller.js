jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("ztestplanapprov.util.Formatter");
sap.ui.controller("ztestplanapprov.view.Summary", { 

	onInit: function() {
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		jQuery.sap.includeStyleSheet(jQuery.sap
				  .getModulePath(	"ztestplanapprov.css.style",".css"));
		
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(this._onRoute, this);
	},
	
	_onRoute: function(){
		
		
	},
	
	displayRequest: function(e){
		
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		var n = e.getSource().getText();
		window.reqNumber = n;
		router
//		.navTo(
//				"page2",
//				{
//					reqNumber : n
//				},
//				true);
		router
		.navTo(
				"page2");
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
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.S1
*/
//	onExit: function() {
//
//	}

});
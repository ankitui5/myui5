sap.ui.controller("zappeovalreq.view.Approve", {
	reqNumber : "",

	/**
	* Called when a controller is instantiated and its View controls (if available) are already created.
	* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	* @memberOf view.View2
	*/
		onInit: function() {
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
			"page2").attachMatched(this._onRoute, this);
		},
		
	_onRoute: function(){
//		this.reqNumber = e.mParameters.arguments.reqNumber;
			this.getView().byId("objHeader").setNumber(window.reqNumber);
			var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestRequestSet?$filter=TestRequestNumber eq '" + window.reqNumber + "' &$expand=NavToRequestItems,NavToRequestCallBack,NavToRequestUsage,NavToRequestVehicle";
			var oJModel = new sap.ui.model.json.JSONModel(); 
			oJModel.loadData(sPath, null, false, "GET", false,
					false, null);
			this.getView().setModel(oJModel);
			var TyreDetailTableCount = oJModel.getData().d.results[0].NavToRequestItems.results.length;
			this.getView().byId("TyreDetailTable").setVisibleRowCount(TyreDetailTableCount);
			
			var UsageTyreDetailTableCount = oJModel.getData().d.results[0].NavToRequestVehicle.results.length;
			this.getView().byId("UsageTyreDetailTable").setVisibleRowCount(UsageTyreDetailTableCount);
			var loHeaderBindingPath = "/d/results/0";
			var loHeaderBindingPathUsage = "/d/results/0/NavToRequestUsage";
			var loHeader = this.getView().byId(
				"TRHeaderFormEdit");
			var loHeaderusageForm = this.getView().byId(
			"usageForm");
			var availabilityForm = this.getView().byId(
			"AwailabiltyFormEdit");
			loHeader
			.bindElement(loHeaderBindingPath);
			loHeaderusageForm
				.bindElement(loHeaderBindingPathUsage);
			availabilityForm
			.bindElement(loHeaderBindingPath);
		},
		
		onBackNav : function(){
			var router = sap.ui.core.UIComponent
			.getRouterFor(this);
			router
			.navTo(
					"page1");
		},
		onEdit: function(){
			var router = sap.ui.core.UIComponent
			.getRouterFor(this);
			router
			.navTo("page3");
		}

	/**
	* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	* (NOT before the first rendering! onInit() is used for that one!).
	* @memberOf view.View2
	*/
//		onBeforeRendering: function() {
	//
//		},

	/**
	* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	* This hook is the same one that SAPUI5 controls get after being rendered.
	* @memberOf view.View2
	*/
//		onAfterRendering: function() {
	//
//		},

	/**
	* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	* @memberOf view.View2
	*/
//		onExit: function() {
	//
//		}

});
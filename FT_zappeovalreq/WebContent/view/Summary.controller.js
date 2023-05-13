jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("zappeovalreq.util.Formatter");
sap.ui.controller("zappeovalreq.view.Summary", { 

	onInit: function() {
		if (!jQuery.support.touch) 
			{
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		if (sap.ui.Device.system.desktop) 
			{
			}
		jQuery.sap.includeStyleSheet(jQuery.sap
				  .getModulePath(	"zappeovalreq.css.style",".css"));
		
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(this._onRoute, this);
		
		this.bindCartListSet();
	},
	
	_onRoute: function()
	{	
	},

/*************************************************************************************************/
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

/*************************************************************************************************/
	
	onTestPlanHelp : function(evt) 
	{
			var sPath = "/sap/opu/odata/sap/ZSSWL_SRV/F4GetPlantSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false, false, null);
			
			var _valueHelpTestPlanSelectDialog = new sap.m.SelectDialog({

			title : "Test Plan Number",
			items : 
			{
				path : "/d/results",
				template : new sap.m.StandardListItem({
					title : "{Werks}" + " , " + "{Name1}",
					customData : [ new sap.ui.core.CustomData({
						key : "{Werks}",
						value : "{Name1}"
					}) ]
				})
			},
	liveChange : function(oEvent) 
			{
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter1 = new sap.ui.model.Filter([oFilter,oFilter2],false);
				oEvent.getSource().getBinding("items").filter([oFilter1]);	
			},			
			confirm : [ this._handleTestPlanClose, this ],
			cancel : [ this._handleTestPlanClose, this ]
		});
			_valueHelpTestPlanSelectDialog.setModel(jModel);
			_valueHelpTestPlanSelectDialog.open();
	},

	_handleTestPlanClose : function(oEvent) 
	{
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) 
		{
			debugger			
			this.getView().byId("idTestPlan").setValue(oSelectedItem.getTitle());
			this.plan = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			this.plancode = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();;
		}
	}, 
	
/*************************************************************************************************/
	
	/*onSearch : function() {
		debugger;
		this.bindCartListSet();
	},*/
	
	bindCartListSet: function(){
		debugger
		var oViewObj = this.getView();
		var CartListSetJModel = oViewObj.getModel("CartListSetJModel");
		if (!CartListSetJModel) {
			CartListSetJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(CartListSetJModel, "CartListSetJModel");
		}
		var sPathCartListSet = "/GetTestRequestCartSet";
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
			that_WL.onAfterRendering();
		});
	},
	
	
	
	
});
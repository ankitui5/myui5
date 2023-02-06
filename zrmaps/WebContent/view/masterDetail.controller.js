jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("zrmaps.util.Formatter");
sap.ui.controller("zrmaps.view.masterDetail", { 

	onInit : function() {
		debugger
		var that = this;
		this.bindMasterList();
	},
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
toggleFullScreen : function(oEvt) {
		debugger
		var lo_id = oEvt.getSource().sId;
		var lo_cid = this.getView().byId(lo_id);
		var spapp = oEvt.getSource().getParent().getParent().getParent().getParent();
		if (spapp.getMode() == "ShowHideMode") 
		{
			spapp.setMode('HideMode');
			lo_cid.setIcon('sap-icon://exit-full-screen').setTooltip('Exit from full screen mode');
		} 
		else 
		{
			spapp.setMode('ShowHideMode');
			lo_cid.setIcon('sap-icon://full-screen').setTooltip('Show in full screen mode');
		}
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
bindMasterList : function(){
	debugger
	var master = this;
	master.reqdata='';
	
	var oViewObj = this.getView();
	var oModel = oViewObj.getModel("oModel");
	if (!oModel) {
		oModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(oModel, "oModel");
	}
	
	var _self = this;
	var loListTemplate = "";
	
	var loVehicleList = this.getView().byId("vehicleList");
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV"; 
	var sPathCartListSet = "F4FleetVehicleDataSet?$filter=Kunnr eq '1100196'";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) { // success handler
		debugger;
		//oModel.setData(oData.results);
		
		var that = _self;
		master.reqdata = oData.results;
		var lnth = oData.results.length;
		if(lnth !== 0){
			
			master.EnrolMode = oData.results[0].EnrolMode;
	    	var tempModel = new sap.ui.model.json.JSONModel({ "VehicleMasterSet" :  master.reqdata});
			loListTemplate = new sap.m.ObjectListItem(
					{
						type : sap.m.ListType.Active,
						title : "{RegNo}",
						intro : "{MakeShortName}",
						number : "{ConfigCodeDesc}",
						numberUnit : "{Model}",
						press : function(e) {
							that.listItemSelect(e);
						},

					});
			loVehicleList.unbindAggregation("items");
			loVehicleList.setModel(tempModel);
			tempModel.setSizeLimit(tempModel.oData.VehicleMasterSet.length);
			loVehicleList.bindAggregation("items", "/VehicleMasterSet", loListTemplate);
					
		}
	};
	oParamsCartListSet.error = function(oError) { // error handler&nbsp;
		jQuery.sap.log.error("read publishing group data failed");
		sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	};
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
	});	
	

},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onSearchVehicle : function(evt){
	debugger
	var list = this.getView().byId("vehicleList");
	var binding = list.getBinding("items");
	var sValue = evt.getSource().getValue();
	var oFilter = new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.Contains, sValue);
	var oFilter1 = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
	var oFilter2 = new sap.ui.model.Filter("MakeShortName", sap.ui.model.FilterOperator.Contains, sValue);
	var oFilter3 = new sap.ui.model.Filter([oFilter, oFilter1],oFilter2,false)
	binding.filter([oFilter3]);
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onCreateNew:function(){
	debugger
	var obj = this.getView().byId("splitApp");
	obj.toDetail(this.getView().byId("createVehicle"));
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

onBackNav:function(){
	debugger
	var obj = this.getView().byId("splitApp");
	obj.toDetail(this.getView().byId("vehicleDetailPage"));

},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
listItemSelect : function(evt){
	debugger
	var selectedVehicle = evt.getSource().getTitle();
	this.bindDetailsPage(selectedVehicle);
	
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
bindDetailsPage : function(selectedVehicle){
	debugger
	var _self = this;
	
	  var oViewObj = this.getView();
	  var JModel = new sap.ui.model.json.JSONModel();
		  oViewObj.setModel(JModel, "JModel");
		
		this.getView().byId("SimpleFormToolbar").setTitle(selectedVehicle);
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV"; 
		var sPathCartListSet = "VehicleRegNoSet(RegNo='"+selectedVehicle+"',Type='',TruckKunnr='',Kunnr='')?$expand=RegnoToItemNvg/VitemToServiceNvg/IservToSubservNvg,RegnoToServiceNvg/VServToSubservNvg";
		var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var oParamsCartListSet = {};
		oParamsCartListSet.context = "";
		oParamsCartListSet.urlParameters = "";
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			debugger;
			JModel.setData(oData);		
			}
		
		oParamsCartListSet.error = function(oError) { // error handler&nbsp;
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
		frameworkODataModel.attachRequestCompleted(function() {
		});	
		
			
			
	
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


});
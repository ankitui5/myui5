/*global history */
sap.ui.define([
	"com/phyOccuReport/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"com/phyOccuReport/model/formatter"
], function(BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("com.phyOccuReport.controller.Master", {
		formatter: formatter,

		onInit: function() {
			this.getMasterAllotmentId(); //To get Allotments id.
			var oList = this.byId("list");

			this._oList = oList;

			var oViewModel = this._createViewModel();
			this.setModel(oViewModel, "masterView");

			this.getView().addEventDelegate({
				onBeforeFirstShow: function() {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
			this._getStatusCheck();
			// get the EventBus
			var oEventBus = this.getOwnerComponent().getEventBus();
			// put the onPress method into the EventBus
			oEventBus.subscribe("StatusFilter", this.StatusFilter, this);
			this.DeviceCategory();
		},
	//************************************************************************************************************
		DeviceCategory: function() {
			if (sap.ui.Device.system.phone === true) {
				this.getView().byId("idVBox").setVisible(true);
			} else {
				this.getView().byId("idVBox").setVisible(false);
			}
		},

		//*******************************************************************************************************************************
		//Getting Allotments id and bind its in masters view.
		getMasterAllotmentId: function() {
			var that = this;
			var ModelAllotmentId = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ModelAllotmentId, "ModelAllotmentId");
			//var fileManageoDataModel = this.getView().getModel("ODataModel");
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var sPathCartListSet = "/ET_FETCH_ALLOTMENT_IDSet?$filter=SubmitF eq '' and NewF eq 'X'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				ModelAllotmentId.setData(oData);

			};

			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			oDataModel.read(sPathCartListSet, oParamsCartListSet);
		},
		
		//***********************************************************************************************************
		StatusFilter: function(cChanel, sEvent, oData) {
			var that = this;
			var n = "";
			var sub = "";
			var statusval = oData.text;
			if(statusval ==="NEW"){
				n = "X";
				sub = "";
			}else if(statusval ==="POST"){
				n = "";
				sub = "X";
			}
			var ModelAllotmentId = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ModelAllotmentId, "ModelAllotmentId");
			//var fileManageoDataModel = this.getView().getModel("ODataModel");
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var sPathCartListSet = "/ET_FETCH_ALLOTMENT_IDSet?$filter=SubmitF eq '"+sub+"' and NewF eq '"+n+"'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				ModelAllotmentId.setData(oData);

			};

			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			oDataModel.read(sPathCartListSet, oParamsCartListSet);
		},
		
		//*****************************************************************************************************************
		OnStatus:function(){
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(
					"com.phyOccuReport.view.statusFilter", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},
		
		onCloseFilterfrag: function(oEvent) {
			if (this._oDialog) {
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = undefined;
			}
		},
		OnStatusFilter2:function(oEvt){
			var that = this;
			var n = "";
			var sub = "";
			if (oEvt.getSource().getText() === "New Allotment") {
				n = "X";
			} else if (oEvt.getSource().getText() === "Occupied") {
				sub = "X";
			} 
			
			var ModelAllotmentId = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ModelAllotmentId, "ModelAllotmentId");
			//var fileManageoDataModel = this.getView().getModel("ODataModel");
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var sPathCartListSet = "/ET_FETCH_ALLOTMENT_IDSet?$filter=SubmitF eq '"+sub+"' and NewF eq '"+n+"'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				ModelAllotmentId.setData(oData);
				that._oDialog.close();
				that._oDialog.destroy();
				that._oDialog = undefined;

			};

			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			oDataModel.read(sPathCartListSet, oParamsCartListSet);
		},

		//*******************************************************************************************************************************
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},
		//*******************************************************************************************************************************

		_createViewModel: function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Name",
				groupBy: "None"
			});
		},
		//********************************************************************************************************************************
		onSelectionChange: function(oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			this.getView().getParent().getParent().setMode("HideMode");

		},

		//*******************************************************************************************************************************
		_onMasterMatched: function() {
			if (sap.ui.Device.system.desktop == true) {
				this.getRouter().getTargets().display("notFound");
			}

		},
		//*******************************************************************************************************************************
		onBypassed: function() {
			this._oList.removeSelections(true);
		},

		//********************************************************************************************************************************
		_showDetail: function(oItem) {

			var selectedData = {};
			selectedData.alid = oItem.getBindingContext("ModelAllotmentId").getProperty().Alid;
			selectedData.status = oItem.getBindingContext("ModelAllotmentId").getProperty().Status;

			var tempjsonString = JSON.stringify(selectedData);
			var jsonstring = tempjsonString.replace(/\//g, "@");
			this.getRouter().navTo("object", {
				"objectId": JSON.stringify(jsonstring)
			});
		},
		//*******************************************************************************************************************************
		onUpdateFinished: function(oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();
		},

		//******************************************************************************************************************************
		_updateListItemCount: function(iTotalItems) {
			var sTitle;
			//only update the counter if the length is final
			//if (this._oList.getBinding("items").isLengthFinal()) {
			sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
			this.getModel("masterView").setProperty("/title", sTitle);
			//}
		},

		//******************************************************************************************************************************
		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return;
			} else {
				var aTableSearchArray = [];
				//var sQuery = oEvent.getParameter("query");
				var sQuery = oEvent.getSource().getValue();

				if (sQuery && sQuery.length > 0) {
					var oFilter1 = new sap.ui.model.Filter("Alid", sap.ui.model.FilterOperator.Contains, sQuery);
					var oFilter2 = new sap.ui.model.Filter("Floor", sap.ui.model.FilterOperator.Contains, sQuery);
					var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, sQuery);
					var oFilter4 = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					var oFilter5 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sQuery);
					var oFilter6 = new sap.ui.model.Filter("Quarter", sap.ui.model.FilterOperator.Contains, sQuery);
					//var oFilter7 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, "New");
					aTableSearchArray = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4, oFilter5, oFilter6]);
				}

				this._applySearchData(aTableSearchArray);
			}

		},

		//******************************************************************************************************************************
		_applySearchData: function(aTableSearchArray) {
			var oTable = this.byId("list"),
				oViewModel = this.getView().getModel('ModelAllotmentId');
			var binding = oTable.getBinding("items");
			binding.filter(aTableSearchArray, sap.ui.model.FilterType.Application);

		},

		//******************************************************************************************************************************
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				sap.m.MessageBox.confirm("Are you want to exit from the current form without filling it ?", {
					icon: sap.m.MessageBox.Icon.CONFIRM,
					title: "Confirm",
					actions: ["Yes", "No"],
					onClose: function(oAction) {
						if (oAction === "Yes") {
							history.go(-1);
						}
					}
				});
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		//*******************************************************************************************************************************
		createGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		//*******************************************************************************************************************************

		_getStatusCheck: function() {
			var filters = [{
				type: "Status",
				key: "st1",
				values: [{
					type: "Submitted",
					key: "POST"
				}, {
					type: "New",
					key: "NEW"
				}]

			}];

			var localDataModel = this.getOwnerComponent().getModel("LocalDataModel"); // setting the local json model on the view.
			this.setModel(localDataModel, "LocalDataModel");
			this.getModel("LocalDataModel").setProperty("/FilterValues", filters);

		},

		handleConfirm: function(oEvent) {
			var oArray = [];
			var sPath;
			var oFacetFilter = oEvent.getSource();
			var mFacetFilterLists = oFacetFilter.getLists().filter(function(List) {
				return List.getSelectedItems().length;
			});
			if (mFacetFilterLists.length) {
				var oFilter = new sap.ui.model.Filter(mFacetFilterLists.map(function(oList) {
					return new sap.ui.model.Filter(oList.getSelectedItems().map(function(oItem) {
						return new sap.ui.model.Filter(oList.getTitle(), "EQ", oItem.getText());
					}), false);
				}), true);
				this.filterStatus(oFilter);
			} else {
				this.filterStatus([]);
			}

		},

		//****************************************************************************************************************************
		filterStatus: function(oArray) {
			var value = "";
			var arrValue = [];
			var filter1 = oArray.aFilters;
			for (var i = 0; i < filter1.length; i++) {
				var filter2 = filter1[i].aFilters;
				for (var j = 0; j < filter2.length; j++) {
					value = filter2[j].oValue1;
					arrValue.push(value);
				}
			}
			var that = this;
			var NewF = "";
			var Subf = "";

			if (arrValue[0] === "New") {
				NewF = "X";
			} else if (arrValue[1] === "New") {
				NewF = "X";
			} else if (arrValue[2] === "New") {
				NewF = "X";
			}

			if (arrValue[0] === "Submitted") {
				Subf = "X";
			} else if (arrValue[1] === "Submitted") {
				Subf = "X";
			} else if (arrValue[2] === "Submitted") {
				Subf = "X";
			}

			var ModelAllotmentId = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ModelAllotmentId, "ModelAllotmentId");
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var sPathCartListSet = "/ET_FETCH_ALLOTMENT_IDSet?$filter=SubmitF eq '" + Subf + "' and NewF eq '" + NewF + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) {
				ModelAllotmentId.setData(oData);
			};
			oParamsCartListSet.error = function(oError) {
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			oDataModel.read(sPathCartListSet, oParamsCartListSet);
		},
		//*************************************************************************************************************************		
		handleFacetFilterReset: function(oEvent) {
			/*var oFacetFilter = Element.registry.get(oEvent.getParameter("id")),
				aFacetFilterLists = oFacetFilter.getLists();*/
			var oFacetFilter = oEvent.getSource();
			var mFacetFilterLists = oFacetFilter.getLists().filter(function(List) {
				return List.getSelectedItems().length;
			});

			for (var i = 0; i < mFacetFilterLists.length; i++) {
				mFacetFilterLists[i].setSelectedKeys();
			}

			this._applySearchData([]);
		}

		//********************************************************************************************************************************		
	});

});
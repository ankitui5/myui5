sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/safran/ewm/zewm_dispatch/model/formatter",
	"sap/m/MessageBox",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessageItem"
], function (Controller, formatter, MessageBox, Device, JSONModel, MessagePopover, MessageItem) {
	"use strict";

	var oMessagePopover;
	var oMsgModel;
	var oGlobalModel;
	var oErrorFlagModel;
	return Controller.extend("com.safran.ewm.zewm_dispatch.controller.View2", {
		formatter: formatter,

		onInit: function () {
			oGlobalModel = this.getOwnerComponent().getModel("oGlobalModel");
			oErrorFlagModel = this.getOwnerComponent().getModel("oErrorFlagModel");

			var oMessageTemplate = new MessageItem({
				type: "{oMsgModel>type}",
				title: "{oMsgModel>title}",
				description: "{oMsgModel>description}"
			});

			oMessagePopover = new MessagePopover({
				items: {
					path: "oMsgModel>/",
					template: oMessageTemplate
				}
			});

			this.oComp = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this.oDataModel = this.oComp.getModel();

			var oDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oDataModel, "oDataModel");

			var oStockModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oStockModel, "oStockModel");

			var oWarehouseModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oWarehouseModel, "oWarehouseModel");

			var oMRPModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oMRPModel, "oMRPModel");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
		},

		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		_onRouteMatched: function (oEvent) {
			var oErrorFlag = oErrorFlagModel.getData();

			this.byId("MsgBoxId").setType("Emphasized");
			oMsgModel = new JSONModel();
			this.getView().setModel(oMsgModel, "oMsgModel");
			this.byId("MsgBoxId").addDependent(oMessagePopover);

			var tempjsonString = oEvent.getParameter("arguments").entity;
			var jsonstring = tempjsonString.replace(/@/g, "/");
			var tempSelectedData = JSON.parse(jsonstring);
			this.SelectedData = JSON.parse(tempSelectedData);

			if (oErrorFlag.Flag == "false") {
				this.getView().byId("idNotFoundPage").setVisible(true);
				this.getView().byId("idPage2").setVisible(false);
			} else if (oErrorFlag.Flag == "true") {
				this.getView().byId("idNotFoundPage").setVisible(false);
				this.getView().byId("idPage2").setVisible(true);

				this.SelectedData.Quantity = parseInt(this.SelectedData.Quantity);
				this.SelectedData.MaximumQuantity = parseInt(this.SelectedData.MaximumQuantity);
				this.SelectedData.TotalPhysicalStock = parseInt(this.SelectedData.TotalPhysicalStock);
				this.SelectedData.TotalMrpStock = parseInt(this.SelectedData.TotalMrpStock);
				this.SelectedData.TotalWhTaskStock = parseInt(this.SelectedData.TotalWhTaskStock);

				if(this.SelectedData.Sled !== null){
					this.SelectedData.Sled = new Date(this.SelectedData.Sled.toString().split("T")[0]);
				}
				this.getView().getModel("oDataModel").setData(this.SelectedData);

				this.oHU = this.SelectedData.HandlingUnit;

				//this.getNavData(this.SelectedData.HandlingUnit);

				if (this.SelectedData.DispatchCase === "CASE2") {
					//this.onChangeFragment();
					this.getView().byId("idCase1Form").setVisible(false);
					this.getView().byId("idCase2Form").setVisible(true);
				} else {
					this.getView().byId("idCase1Form").setVisible(true);
					this.getView().byId("idCase2Form").setVisible(false);
				}
			}
		},

		onBeforeRendering: function () {},

		getNavData: function (oHU) {
			var that = this;
			var sServiceUrl = "/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type": "application/json"
			});

			var fncSuccess = function (oData, oResponse) {
				that.getView().getModel("oStockModel").setData(oData.NAV_STOCK_CARD.results);
				that.getView().getModel("oMRPModel").setData(oData.NAV_MRP_CARD.results);
				that.getView().getModel("oWarehouseModel").setData(oData.NAV_WHNO_TASK_CARD.results);
				if (oData.NAV_WHNO_TASK_CARD.results.length > 0) {
					that.WarehouseTask = oData.NAV_WHNO_TASK_CARD.results[0].WarehouseTask;
				}
			};

			var fncError = function (oError) { // error callback
			};

			var path = "DispatchDetailSet(HandlingUnit='" + oHU + "',LogFlag='N')?$expand=NAV_STOCK_CARD,NAV_MRP_CARD,NAV_WHNO_TASK_CARD";

			oReadModel.read(path, {
				success: fncSuccess,
				error: fncError
			});
		},

		onPressDetailedLog: function () {
			var xnavservice = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService(
				"CrossApplicationNavigation");
			var href = (xnavservice && xnavservice.hrefForExternal({
				target: {
					semanticObject: "ApplicationLog",
					action: "showList"
				},
				params: {
					"LogObjectId": "ZLOBJ_DISPATCH",
					"LogObjectSubId": "ZLSUBOBJ_DISPATCH",
					"LogExternalId" : this.oHU
				}
			}));

			/*var href = (xnavservice && xnavservice.hrefForExternal({
				target: {
					semanticObject: "ZSO_SLG1",
					action: "manage"
				},
				params: {
					"BALHDR-OBJECT": "ZLOBJ_DISPATCH",
					"BALHDR-SUBOBJECT": "ZLSUBOBJ_DISPATCH",
					"BALHDR-EXTNUMBER": "*"
				}
			}));*/

			var finalUrl = window.location.href.split("#")[0] + href;
			sap.m.URLHelper.redirect(finalUrl, true);
		},

		onPressPacking: function () {
			var xnavservice = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService(
				"CrossApplicationNavigation");
			var href = (xnavservice && xnavservice.hrefForExternal({
				target: {
					semanticObject: "EWMWorkCenter",
					action: "packInternal"
				},
				params: {

				}
			}));

			var finalUrl = window.location.href.split("#")[0] + href;
			sap.m.URLHelper.redirect(finalUrl, true);
		},

		getDialog: function (diaId, fragmentName) {
			var oView = this.getView();
			var oDialog = oView.byId(diaId);
			// create dialog lazily
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "com.safran.ewm.zewm_dispatch.view.fragments." + fragmentName, this);
				oView.addDependent(oDialog);
			}
			oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			return oDialog;
		},

		onPressStockTile: function () {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			var sServiceUrl = "/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type": "application/json"
			});

			var fncSuccess = function (oData, oResponse) {
				sap.ui.core.BusyIndicator.hide();
				that.getView().getModel("oStockModel").setData(oData.NAV_STOCK_CARD.results);
				that._StockDialog = sap.ui.xmlfragment("com.safran.ewm.zewm_dispatch.view.fragments.Stock", that);
				that.getView().addDependent(that._StockDialog);
				that._StockDialog.open();
			};

			var fncError = function (oError) {
				sap.ui.core.BusyIndicator.hide();
				MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("error"));
			};

			var path = "DispatchDetailSet(HandlingUnit='" + this.oHU + "',LogFlag='N')?$expand=NAV_STOCK_CARD";
			oReadModel.read(path, {
				success: fncSuccess,
				error: fncError
			});
		},

		onStockClose: function () {
			this._StockDialog.close();
			this._StockDialog.destroy();
		},

		onPressWarehouseTile: function () {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			var sServiceUrl = "/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type": "application/json"
			});

			var fncSuccess = function (oData, oResponse) {
				sap.ui.core.BusyIndicator.hide();
				that.getView().getModel("oWarehouseModel").setData(oData.NAV_WHNO_TASK_CARD.results);
				that._WarehouseDialog = sap.ui.xmlfragment("com.safran.ewm.zewm_dispatch.view.fragments.WarehouseTasks", that);
				that.getView().addDependent(that._WarehouseDialog);
				that._WarehouseDialog.open();
			};

			var fncError = function (oError) {
				sap.ui.core.BusyIndicator.hide();
				MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("error"));
			};

			var path = "DispatchDetailSet(HandlingUnit='" + this.oHU + "',LogFlag='N')?$expand=NAV_WHNO_TASK_CARD";
			oReadModel.read(path, {
				success: fncSuccess,
				error: fncError
			});
		},

		onWarehouseClose: function () {
			this._WarehouseDialog.close();
			this._WarehouseDialog.destroy();
		},

		onPressMRPTile: function () {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			var sServiceUrl = "/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type": "application/json"
			});

			var fncSuccess = function (oData, oResponse) {
				sap.ui.core.BusyIndicator.hide();
				that.getView().getModel("oMRPModel").setData(oData.NAV_MRP_CARD.results);
				that._MRPDialog = sap.ui.xmlfragment("com.safran.ewm.zewm_dispatch.view.fragments.MRP", that);
				that.getView().addDependent(that._MRPDialog);
				that._MRPDialog.open();
			};

			var fncError = function (oError) {
				sap.ui.core.BusyIndicator.hide();
				MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("error"));
			};

			var path = "DispatchDetailSet(HandlingUnit='" + this.oHU + "',LogFlag='N')?$expand=NAV_MRP_CARD";
			oReadModel.read(path, {
				success: fncSuccess,
				error: fncError
			});
		},

		onMRPClose: function () {
			this._MRPDialog.close();
			this._MRPDialog.destroy();
		},

		onClickValidationCase1: function () {
			var oSimulation = "";
			this.onCreate(oSimulation);
		},

		onClickValidationCase2: function () {
			var that = this;
			this.getView().byId("idDestinationHUCase2").setValueState("None");
			var oDestination = this.getView().byId("idDestinationHUCase2").getValue();
			var oCreateModel = this.getOwnerComponent().getModel();

			if (oDestination == "") {
				this.getView().byId("idDestinationHUCase2").setValueState("Error");
				MessageBox.warning("{i18n>destinationInputError}");
			} else {
				oCreateModel.callFunction(
					"/FI_PackSourceHUToDestinationHU", {
						method: "POST",
						urlParameters: {
							SourceHU: this.oHU,
							DestinationHU: oDestination,
							SourceStorageType: this.SelectedData.StorageType,
							SourceStorageBin: this.SelectedData.StorageBin,
							DestinationStorageType: this.SelectedData.DestinationStorageType,
							DestinationStorageBin: this.SelectedData.DestinationStorageBin
						},
						success: function (oData, response) {
							oErrorFlagModel.setData({
								Flag: "false"
							});
							that.getOwnerComponent().getModel("oGlobalModel").setData(oData);
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("View1");
						},

						error: function (response) {
							var oMsgError = [];
							if (response.hasOwnProperty(response)) {
								var len = $($.parseHTML(response.response.body)).find("message").length;

								for (var i = 0; i < len; i++) {
									var obj = {
										type: "Error",
										title: $($.parseHTML(response.response.body)).find("message")[i].innerText,
										description: ""
									};
									oMsgError.push(obj);
									that.byId("MsgBoxId").setType("Reject");
								}
								var arrUnique = [...new Map(oMsgError.map(v => [v.title, v])).values()];
								oMsgModel.setData(arrUnique);
								//oMessagePopover.toggle();
							} else {
								var obj = {
									type: "Error",
									title: JSON.parse(response.responseText).error.message.value,
									description: ""
								};
								oMsgError.push(obj);
								that.byId("MsgBoxId").setType("Reject");

								var arrUnique = [...new Map(oMsgError.map(v => [v.title, v])).values()];
								oMsgModel.setData(arrUnique);
								//oMessagePopover.toggle();
							}
						}
					}
				);
			}
		},

		onChangeFragment: function () {
			this.getView().byId("idCase1Form").setVisible(false);
			this.getView().byId("idCase2Form").setVisible(true);
		},

		onCreate: function (oSimulation) {
			var that = this;
			var oCreateModel = this.getOwnerComponent().getModel();

			oCreateModel.callFunction(
				"/FI_CreateWarehouseTask", {
					method: "POST",
					urlParameters: {
						HandlingUnit: this.oHU,
						Simulation: oSimulation
					},
					success: function (oData, response) {
						oErrorFlagModel.setData({
							Flag: "false"
						});
						that.getOwnerComponent().getModel("oGlobalModel").setData(oData);
						var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
						oRouter.navTo("View1");
					},

					error: function (response) {
						/*oErrorFlagModel.setData({
							Flag: "true"
						});*/
						that.getView().setBusy(false);
						var len = $($.parseHTML(response.response.body)).find("message").length;
						var oMsgError = [];
						for (var i = 0; i < len; i++) {
							var obj = {
								type: "Error",
								title: $($.parseHTML(response.response.body)).find("message")[i].innerText,
								description: ""
							};
							oMsgError.push(obj);
							that.byId("MsgBoxId").setType("Reject");
						}
						const arrUnique = [...new Map(oMsgError.map(v => [v.title, v])).values()];
						oMsgModel.setData(arrUnique);
						//oMessagePopover.toggle();
					}
				}
			);
		},

		handleMessagePopoverPress: function (oEvent) {
			oMessagePopover.toggle(oEvent.getSource());
		},

		onBackPressed: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View1");
		}

	});
});
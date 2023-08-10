sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/safran/ewm/zewm_dispatch/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessageItem"
], function (Controller, BaseController, MessageBox, JSONModel, MessagePopover, MessageItem) {
	"use strict";

	var oMessagePopover;
	var oMsgModel;
	var oGlobalModel;
	var oErrorFlagModel;

	return Controller.extend("com.safran.ewm.zewm_dispatch.controller.View1", {
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

			oMsgModel = new JSONModel();
			this.getView().setModel(oMsgModel, "oMsgModel");
			this.byId("idView1MsgBox").addDependent(oMessagePopover);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("View1").attachMatched(this._onRoute, this);
			this.getPendingHU();
			this.getView().byId("idHUSource").setValueState("None");
		},

		_onRoute: function (oEvent) {
			oErrorFlagModel.setData({
						Flag: "false"
					});
			this.getView().byId("idBottomText").setText(oGlobalModel.getData().Message);
			this.getView().byId("idHUSource").setValueState("None");
			this.getView().byId("idHUSource").setValue();
		},

		getPendingHU: function (oHU) {
			var that = this;
			var sServiceUrl = "/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type": "application/json"
			});

			var fncSuccess = function (oData, oResponse) {
				that.getView().byId("txtHUPending").setText(oData.results[0].PendingHU);
				that.getView().byId("txtWhno").setText(oData.results[0].Whno);
			};

			var fncError = function (oError) { // error callback
			};

			var path = "DispatchPendingHUSet";

			oReadModel.read(path, {
				success: fncSuccess,
				error: fncError
			});
		},

		onPage2: function (oData) {
			this.getOwnerComponent().getModel("oGlobalModel").setData();
			var selectedData = oData;
			var tempjsonString = JSON.stringify(selectedData);
			var jsonstring = tempjsonString.replace(/\//g, "@");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View2", {
				"entity": JSON.stringify(jsonstring)
			});
		},

		/**
		 * Convenience method for getting text from i18n
		 * @param {string} key - accept key as string
		 * @param {string} args - accept args
		 * @returns {string} - return string value of key from i18n
		 * */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getText: function (key, args) {
			return this.getResourceBundle().getText(key, args);
		},

		onSearch: function () {
			var oHU = this.getView().byId("idHUSource").getValue();
			var that = this;

			if (oHU == "") {
				this.getView().byId("idHUSource").setValueState("Error");
				MessageBox.warning(this.getText("enterHUError"));
			} else {
				var sServiceUrl = "/sap/opu/odata/sap/ZLEWM_DISPATCH_APP_SRV/";
				var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oReadModel.setHeaders({
					"Content-Type": "application/json"
				});

				var fncSuccess = function (oData, oResponse) {
					oErrorFlagModel.setData({
						Flag: "true"
					});
					that.onPage2(oData);
					that.byId("idView1MsgBox").setType("Emphasized");
				};

				var fncError = function (response) { // error callback
					oErrorFlagModel.setData({
						Flag: "false"
					});
					that.getView().setBusy(false);
					var len = $($.parseHTML(response.response.body)).find("message").length;
					var oMsgError = [];
					if (len == 0) {
						var obj = {
							type: "Error",
							title: response.message,
							description: ""
						};
						oMsgError.push(obj);
						that.byId("idView1MsgBox").setType("Reject");
					} else {
						for (var i = 0; i < len; i++) {
							var obj = {
								type: "Error",
								title: $($.parseHTML(response.response.body)).find("message")[i].innerText,
								description: ""
							};
							oMsgError.push(obj);
							that.byId("idView1MsgBox").setType("Reject");
						}
					}
					var arrUnique = [...new Map(oMsgError.map(v => [v.title, v])).values()];
					oMsgModel.setData(arrUnique);
					//oMessagePopover.toggle();
				};

				var path = "DispatchDetailSet(HandlingUnit='" + oHU + "',LogFlag='Y')";

				oReadModel.read(path, {
					success: fncSuccess,
					error: fncError
				});
			}
		},

		handleMessagePopoverPress: function (oEvent) {
			oMessagePopover.toggle(oEvent.getSource());
		}

	});
});
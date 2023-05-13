sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Formatter",
], function (Controller, MessageBox, Formatter) {
	"use strict";

	return Controller.extend("zjktyrepurorder.controller.Detail", {
		onInit: function () {
			// this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("Detail").attachPatternMatched(this.onProductMatched, this);
			this.busyDialog = new sap.m.BusyDialog();

			// this.oRouter.getRoute("Detail").attachRouteMatched(this.onProductMatched, this);
			// this.oRouter.getRoute("Detail").attachPatternMatched(this.onProductMatched, this);

			this.getView().byId("totalPriceID").setVisible(false);
			var detailHeaderVisibility = this.getOwnerComponent().getModel("detailHeaderVisibility");
			detailHeaderVisibility.setProperty("/shoppingOverview", true);
			detailHeaderVisibility.setProperty("/purchaseOrder", false);
			this.getView().setModel(detailHeaderVisibility, "detailHeaderVisibility");

			var shoppingOverviewModel = new sap.ui.model.json.JSONModel();
			var srvURL = "/sap/opu/odata/sap/ZCREATE_SO_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;
			this.busyDialog.open();
			oDataModel.read("/CustBalSet('')", {
				success: function (oData) {
					if (oData.AvlBal) {
						oData.AvlBal = oData.AvlBal;
					} else {
						oData.AvlBal = 0;
					}
					if (oData.Exposure) {
						oData.Exposure = oData.Exposure;
					} else {
						oData.Exposure = 0;
					}
					if (oData.NetValue) {
						oData.NetValue = oData.NetValue;
					} else {
						oData.NetValue = 0;
					}
					if (oData.Sas) {
						oData.Sas = oData.Sas;
					} else {
						oData.Sas = 0;
					}
					shoppingOverviewModel.setData(oData);
					that.getView().setModel(shoppingOverviewModel, "shoppingOverviewModel");
					that.busyDialog.close();
				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error in fetching Data " + error);
				}
			});

			if (this.getView().getModel("tableDetailsJSONModel") !== undefined) {
				if (tableData.length > 0) {
					this.getView().byId("mainFooter").setVisible(true);
				} else {
					this.getView().byId("mainFooter").setVisible(false);
				}
			} else {
				this.getView().byId("mainFooter").setVisible(false);
			}
		},

		onProductMatched: function (oEvt) {
			var getItem = oEvt;
			var tableData = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data;
			if (tableData) {
				this.getView().byId("review").setVisible(true);
			} else {
				this.getView().byId("review").setVisible(false);
			}
			if (this.getView().getModel("tableDetailsJSONModel") !== undefined) {
				if (tableData.length > 0) {
					this.getView().byId("mainFooter").setVisible(true);
				} else {
					this.getView().byId("mainFooter").setVisible(false);
				}
			} else {
				this.getView().byId("mainFooter").setVisible(false);
			}
			this.restoreToEditTable();
			/*var detailsJSONModel = this.getOwnerComponent().getModel("detailsJSONModel");
			this.getView().setModel(detailsJSONModel, "detailsJSONModel");*/
			this.oRouter.navTo("Master");
			/*for (var i = 0; i < detailsJSONModel.getData().Data.length; i++) {
				if (detailsJSONModel.getData().Data[i].Name === sap.ui.getCore().getLink) {
					detailsJSONModel.setData(detailsJSONModel.getData().Data[i]);
					this.getView().setModel(detailsJSONModel, "detailsJSONModel");
					this.oRouter.navTo(sap.ui.getCore().selRoute);
					return;
				}
			}*/

		},

		addQuant: function (oEvt) {
			var getRowIndex = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getPath().split("/")[2]);
			var Quantity = parseInt(this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data[getRowIndex].Quantity);
			this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data[getRowIndex].Quantity = Quantity + 1;
			this.getOwnerComponent().getModel("tableDetailsJSONModel").refresh(true);
		},

		deleteQuant: function (oEvt) {
			var getRowIndex = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getPath().split("/")[2]);
			var Quantity = parseInt(this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data[getRowIndex].Quantity);
			if (Quantity !== 1) {
				this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data[getRowIndex].Quantity = Quantity - 1;
			}
			this.getOwnerComponent().getModel("tableDetailsJSONModel").refresh(true);
		},

		deleteItemRow: function (oEvt) {
			var getRowIndex = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getPath().split("/")[2]);
			var getMasterRowDetails = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data[getRowIndex];
			if (getMasterRowDetails.selectedTab === "myFavouritesId") {
				var itemsTable = this.getView().getModel("favouritesJSONModel").getData();
				for (var i = 0; i < itemsTable.length; i++) {
					if (itemsTable[i].Matnr === getMasterRowDetails.Maktx) {
						itemsTable[i].icon = "sap-icon://cart-4";
					}
					this.getView().getModel("favouritesJSONModel").refresh();
				}
			} else if (getMasterRowDetails.selectedTab === "productCatalogue") {
				var itemsTable = this.getView().getModel("itemsJSONModel").getData();
				for (var i = 0; i < itemsTable.length; i++) {
					if (itemsTable[i].Matnr === getMasterRowDetails.Maktx) {
						itemsTable[i].icon = "sap-icon://cart-4";
					}
					this.getView().getModel("itemsJSONModel").refresh();
				}
			} else if (getMasterRowDetails.selectedTab === "Recent Orders") {
				var itemsTable = this.getView().getModel("treeJSONModel").getData();
				for (var i = 0; i < itemsTable.length; i++) {
					var nodesLength = itemsTable[i].nodes.length;
					// var nodesLength = itemsTable[i].nodes.reduce((acc, cv) => (cv) ? acc + 1 : acc, 0);
					for (var j = 0; j < nodesLength; j++) {
						if (itemsTable[i].nodes[j].SalesOrder === getMasterRowDetails.SalesOrder) {
							itemsTable[i].icon = "sap-icon://cart-4";
						}
					}

					this.getView().getModel("treeJSONModel").refresh();
				}
			}

			this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data.splice(getRowIndex, 1);

			var tableLength = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data.length;
			this.getOwnerComponent().getModel("tableDetailsJSONModel").setProperty("/tableRecordsCount", "(" + tableLength + ")");

			this.getOwnerComponent().getModel("tableDetailsJSONModel").refresh(true);

			if (this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data.length > 0) {
				this.getView().byId("review").setVisible(true);
				this.getView().byId("mainFooter").setVisible(true);
			} else {
				this.getView().byId("review").setVisible(false);
				this.getView().byId("mainFooter").setVisible(false);
			}
		},

		deleteItemRowController: function (oEvt) {
			var getRowIndex = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getPath().split("/")[2]);
			var getMasterRowDetails = oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[
				getRowIndex];

			var iconTabBarSelKey = oEvt.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent()
				.getParent().getAggregation("_navMaster").getAggregation("pages")[0].getAggregation("content")[0].getAggregation("content")[1].getSelectedKey();

			if (iconTabBarSelKey === "myFavouritesId") {
				var itemsTable = oEvt.getSource().getParent().getModel("favouritesJSONModel").getData()
				for (var i = 0; i < itemsTable.length; i++) {
					if (itemsTable[i].Matnr === getMasterRowDetails.Maktx) {
						itemsTable[i].icon = "sap-icon://cart-4";
					}
					oEvt.getSource().getParent().getModel("favouritesJSONModel").refresh();
				}
			} else if (iconTabBarSelKey === "productCatalogue") {
				var itemsTable = oEvt.getSource().getParent().getModel("itemsJSONModel").getData();
				for (var i = 0; i < itemsTable.length; i++) {
					if (itemsTable[i].Matnr === getMasterRowDetails.Maktx) {
						itemsTable[i].icon = "sap-icon://cart-4";
					}
					oEvt.getSource().getParent().getModel("itemsJSONModel").refresh();
				}
			} else if (iconTabBarSelKey === "Recent Orders") {
				var itemsTable = oEvt.getSource().getParent().getModel("treeJSONModel").getData();
				for (var i = 0; i < itemsTable.length; i++) {
					for (var j = 0; j < itemsTable[i].nodes.length; j++) {
						if (itemsTable[i].nodes[j].Maktx === getMasterRowDetails.Maktx) {
							itemsTable[i].icon = "sap-icon://cart-4";
						}
					}

					oEvt.getSource().getParent().getModel("treeJSONModel").refresh();
				}
			}

			var tableData = oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data;
			var clonedTableResult = JSON.parse(JSON.stringify(tableData));
			/*for (var i = 0; i < clonedTableResult.length; i++) {
				if (clonedTableResult[getRowIndex].MatRel !== undefined) {
					if (clonedTableResult[getRowIndex].MatRel === clonedTableResult[i].MatRel) {
						oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data.splice(i, 1);
						// delete oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[i];
					}
				} else {
					oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data.splice(i, 1);
				}
			}*/

			if (tableData[getRowIndex].MatRel !== undefined) {
				tableData.filter(x => tableData[getRowIndex].MatRel === x.MatRel).forEach(x => tableData.splice(tableData.indexOf(x), 1));
			} else {
				oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data.splice(getRowIndex, 1);
			}

			/*for (var i = tableData.length - 1; i >= 0; i--) {
				if (tableData[getRowIndex].MatRel === tableData[i].MatRel) {
					oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data.splice(i, 1);
				}
			}*/
			// oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data.splice(getRowIndex, 1);
			var rootParent = oEvt.getSource().getParent().getParent().getParent().getParent().getParent().getParent();
			if (oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data.length > 0) {
				rootParent.getParent().getAggregation("content")[0].getFooter().getAggregation("content")[1].setVisible(true);
				oEvt.getSource().getParent().getParent().getParent().getAggregation("content")[1].setVisible(true);
			} else {
				rootParent.getParent().getAggregation("content")[0].getFooter().getAggregation("content")[1].setVisible(false);
				oEvt.getSource().getParent().getParent().getParent().getAggregation("content")[1].setVisible(true);
				oEvt.getSource().getParent().getParent().getParent().getAggregation("content")[2].setVisible(false);
			}

			if (tableData.length > 0) {
				rootParent.getParent().getAggregation("content")[0].getFooter().setVisible(true);
			} else {
				rootParent.getParent().getAggregation("content")[0].getFooter().setVisible(false);
			}

			var tableLength = oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data.length;
			var tLength = 0;
			for (var i = 0; i < tableLength; i++) {
				if (oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[i].cartQuantDeleteBtnVisibility ===
					true) {
					tLength = tLength + 1;
				}
			}
			oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().setProperty("/tableRecordsCount", "(" +
				tLength + ")");

			if (oEvt.getSource().getParent() !== undefined) {
				oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().refresh(true);
			} else {
				oEvt.getSource().getBindingContext("tableDetailsJSONModel").getModel().refresh(true);
			}

		},

		changeQuantity: function (oEvt) {
			var getRowIndex = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getPath().split("/")[2]);
			var Quantity = parseInt(oEvt.getSource().getValue());
			if (isNaN(Quantity) === true) {
				Quantity = 0;
			}
			var tableData = oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data;
			for (var i = 0; i < tableData.length; i++) {
				if (tableData[getRowIndex].MatRel) {
					if (tableData[getRowIndex].MatRel === tableData[i].MatRel) {
						oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[i].Quantity = Quantity;
					}
				} else {
					tableData[getRowIndex].Quantity = Quantity;
				}
			}
			oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().refresh(true);
		},

		addQuantController: function (oEvt) {
			var getRowIndex = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getPath().split("/")[2]);
			var Quantity = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[
				getRowIndex].Quantity);
			var tableData = oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data;
			for (var i = 0; i < tableData.length; i++) {
				if (tableData[getRowIndex].MatRel === tableData[i].MatRel) {
					oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[i].Quantity = Quantity + 1;
				}
			}

			/*oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[getRowIndex].Quantity = Quantity +
				1;*/
			oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().refresh(true);
		},

		deleteQuantController: function (oEvt) {
			var getRowIndex = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getPath().split("/")[2]);
			var Quantity = parseInt(oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[
				getRowIndex].Quantity);
			var tableData = oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data;
			for (var i = 0; i < tableData.length; i++) {
				if (tableData[getRowIndex].MatRel === tableData[i].MatRel) {
					if (Quantity !== 1) {
						oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[i].Quantity =
							Quantity -
							1;
					}
					// oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().getData().Data[i].Quantity = Quantity + 1;
				}
			}

			oEvt.getSource().getParent().getBindingContext("tableDetailsJSONModel").getModel().refresh(true);
		},

		showFullScreen: function () {
			this.getView().getParent().getParent().setMode("HideMode");
			this.oRouter.navTo("FullScreen");
		},

		pressConfirm: function (oEvt) {

			var getData = this.getView().getModel("tableDetailsJSONModel").getData().Data;
			var totalPrice = 0;
			this.busyDialog.open();
			var payload = {
				"CompInd": sap.ui.getCore().globalCompInd,
				"Division": sap.ui.getCore().globalDivision,
				"Setind": sap.ui.getCore().globalSetind,
				"Kunn2": sap.ui.getCore().globalKunn2,
				// "Kunn2": "",
				"SalesOrderItmSet": [],
				"SalesOrderReturnSet": [{
					"Type": "",
					"Message": ""
				}]
			};

			for (var i = 0; i < getData.length; i++) {
				var pp = {
					"Material": getData[i].Maktx,
					"Maktx": getData[i].Matnr,
					"TargetQty": getData[i].Quantity
				};
				payload.SalesOrderItmSet.push(pp);
			}

			var srvURL =
				"/sap/opu/odata/sap/ZCREATE_SO_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;

			oDataModel.create("/SalesOrderSet", payload, {
				async: false,
				success: function (oData) {
					var result = oData.SalesOrderReturnSet.results;
					var successArray = [];
					var errorArray = [];
					var sArr = "";
					var eArr = "";
					for (var i = 0; i < result.length; i++) {
						if (result[i].Type === "E") {
							// errorArray.push(result[i].Message + "\n");
							eArr = eArr + result[i].Message + ";\n"
						} else if (result[i].Type === "S") {
							// successArray.push(result[i].Message + "\n");
							sArr = sArr + result[i].Message + ";\n"
						}
					}

					if (sArr && eArr) {
						MessageBox.error(sArr + eArr);
					} else if (sArr) {
						// MessageBox.success(sArr);
						sap.m.MessageBox.success(sArr, {
							title: "Success", // default
							onClose: function (oEvt) {

								that.getView().byId("confirm").setVisible(false);
								that.getView().byId("edit").setVisible(false);
								that.getView().byId("cancel").setVisible(false);
								that.getView().byId("review").setVisible(false);
								that.getView().byId("totalPriceID").setVisible(false);
								var detailHeaderVisibility = that.getView().getModel("detailHeaderVisibility");
								detailHeaderVisibility.setProperty("/shoppingOverview", true);
								detailHeaderVisibility.setProperty("/purchaseOrder", false);
								that.getView().setModel(detailHeaderVisibility, "detailHeaderVisibility");

								/*cartQuantDeleteBtnVisibility
								tableDetailsJSONModel*/

								/*var treeMasterData = that.getOwnerComponent().getModel("treeJSONModel").getData();
								for (var i = 0; i < treeMasterData.length; i++) {
									treeMasterData[i].icon = "sap-icon://cart-4";
								}
								that.getOwnerComponent().getModel("treeJSONModel").refresh();
								var favMasterData = that.getOwnerComponent().getModel("favouritesJSONModel").getData();
								for (var i = 0; i < favMasterData.length; i++) {
									favMasterData[i].icon = "sap-icon://cart-4";
								}
								that.getOwnerComponent().getModel("favouritesJSONModel").refresh();
								var prodMasterData = that.getOwnerComponent().getModel("itemsJSONModel").getData();
								for (var i = 0; i < prodMasterData.length; i++) {
									prodMasterData[i].icon = "sap-icon://cart-4";
								}*/
								that.getOwnerComponent().getModel("itemsJSONModel").refresh();
								that.getOwnerComponent().getModel("tableDetailsJSONModel").setData({});
								that.getOwnerComponent().getModel("treeJSONModel").setData({});
								that.getOwnerComponent().getModel("orderTypeModel").setProperty("/selectedRadioButton", that.getOrderTypeRadioButton);
								that.getOwnerComponent().getModel("categoriesModel").setData({});
								that.getOwnerComponent().getModel("favouritesJSONModel").setData({});
								that.getOwnerComponent().getModel("itemsJSONModel").setData({});
								that.getView().getParent().getParent().getParent().getParent().getParent().getAggregation("content")[0].getAggregation(
									"items")[0].getAggregation("items")[0].getAggregation("_navMaster").getAggregation("pages")[0].getContent()[0].getContent()[
									0].getItems()[0].getItems()[1].setSelectedKey(null);
								that.getView().getParent().getParent().getParent().getParent().getParent().getAggregation("content")[0].getAggregation(
										"items")[0].getAggregation("items")[0].getAggregation("_navMaster").getAggregation("pages")[0].getAggregation(
										"content")[0]
									.getAggregation("content")[1].getAggregation("_header").getAggregation("items")[1].getContent()[1].getHeaderToolbar().getContent()[
										0].setText("Items");
								that.getView().getParent().getParent().getParent().getParent().getParent().getAggregation("content")[0].getAggregation(
										"items")[0].getAggregation("items")[0].getAggregation("_navMaster").getAggregation("pages")[0].getAggregation(
										"content")[0]
									.getAggregation("content")[1].getItems()[0].getContent()[1].getHeaderToolbar().getContent()[0].setText("Items");
								that.restoreToEditTable();
							}
						});
					} else if (eArr) {
						MessageBox.error(eArr);
					}

					that.busyDialog.close();
				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error");
				}
			});
		},

		pressReview: function () {
			var getData = this.getView().getModel("tableDetailsJSONModel").getData().Data;
			var totalPrice = 0;
			this.busyDialog.open();
			var payload = {
				"Compind": getData[0].CompInd,
				"Division": getData[0].Division,
				"Setind": getData[0].Setind,
				"Kunn2": getData[0].Kunn2,
				"RevMaterialSet": [],
				"RevTotalPriceSet": [{
					"TotalPrc": "0",
					"Text": ""
				}]
			};
			for (var i = 0; i < getData.length; i++) {

				var pp = {
					"Matnr": getData[i].Maktx,
					"MatRel": "",
					"Quantity": getData[i].Quantity,
					"BasePrice": "0",
					"NetPrice": "0",
					"Stock": ""
				};
				payload.RevMaterialSet.push(pp);
			}

			var srvURL =
				"/sap/opu/odata/sap/ZCREATE_SO_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;

			oDataModel.create("/RevHeaderSet", payload, {
				async: false,
				success: function (oData) {

					that.busyDialog.close();
					var tableResult = oData.RevMaterialSet.results;
					var clonedTableResult = JSON.parse(JSON.stringify(tableResult));

					var oModel = that.getView().getModel("tableDetailsJSONModel");

					for (var i = 0; i < tableResult.length; i++) {
						tableResult[i].Quantity = parseInt(tableResult[i].Quantity);
						tableResult[i].BasePrice = parseFloat(tableResult[i].BasePrice).toFixed(2).replace(
							/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g, "$1,").toString();
						// parseFloat(tableResult[i].BasePrice).toLocaleString('en');
						// tableResult[i].NetPrice = parseFloat(tableResult[i].NetPrice).toLocaleString('en');
						tableResult[i].NetPrice = parseFloat(tableResult[i].NetPrice).toFixed(2).replace(
							/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g, "$1,").toString();

						if (parseInt(tableResult[i].Matnr.charAt(0)) !== 1 && sap.ui.getCore().globalSetind === "2") {
							tableResult[i].cartQuantDeleteBtnVisibility = true;
						} else if (parseInt(tableResult[i].Matnr.charAt(0)) !== 1) {
							tableResult[i].cartQuantDeleteBtnVisibility = false;
						} else {
							tableResult[i].cartQuantDeleteBtnVisibility = true;
						}
						tableResult[i].Matnr = clonedTableResult[i].Maktx;
						tableResult[i].Maktx = clonedTableResult[i].Matnr;

						tableResult[i].CompInd = oModel.getData().Data[0].CompInd;
						tableResult[i].Division = parseInt(oModel.getData().Data[0].Division);
						tableResult[i].Setind = oModel.getData().Data[0].Setind;
						tableResult[i].Kunn2 = parseInt(oModel.getData().Data[0].Kunn2);
						if (oModel.getData().Data[0].SalesOrder) {
							tableResult[i].SalesOrder = oModel.getData().Data[0].SalesOrder;
						}
					}
					oModel.setData({
						"Data": tableResult
					});
					var tLength = 0;
					var tableLength = that.getView().getModel("tableDetailsJSONModel").getData().Data.length;
					for (var i = 0; i < tableLength; i++) {
						if (that.getView().getModel("tableDetailsJSONModel").getData().Data[i].cartQuantDeleteBtnVisibility ===
							true) {
							tLength = tLength + 1;
						}
					}
					oModel.setProperty("/tableRecordsCount", "(" + tLength + ")");
					that.getView().setModel(oModel, "tableDetailsJSONModel");

					var table = that.getView().byId("detailsTable");
					table.bindAggregation("items", {
						path: "tableDetailsJSONModel>/Data",
						template: new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: "{tableDetailsJSONModel>Matnr}"
								}),
								new sap.m.Text({
									text: "{tableDetailsJSONModel>Quantity}"
								}),
								new sap.ui.core.Icon({
									src: "{path:'tableDetailsJSONModel>Stock',formatter:'zjktyrepurorder.controller.Formatter.getIcon'}",
									color: "{path:'tableDetailsJSONModel>Stock',formatter:'zjktyrepurorder.controller.Formatter.getColor'}",
									useIconTooltip: false,
									tooltip: "{tableDetailsJSONModel>Stock}"
								}),
								new sap.m.Text({
									text: "{tableDetailsJSONModel>BasePrice}"
								}),
								new sap.m.Text({
									text: "{tableDetailsJSONModel>NetPrice}"
								})

							]
						})
					});
					that.getView().byId("totalPriceID").setVisible(true);

					that.getView().byId("confirm").setVisible(true);
					that.getView().byId("edit").setVisible(true);
					that.getView().byId("cancel").setVisible(true);
					that.getView().byId("review").setVisible(false);
					var detailHeaderVisibility = that.getView().getModel("detailHeaderVisibility");
					detailHeaderVisibility.setProperty("/shoppingOverview", false);
					detailHeaderVisibility.setProperty("/purchaseOrder", true);

					that.getView().setModel(detailHeaderVisibility, "detailHeaderVisibility");

					/*that.getView().byId("totalPrice").setText(oData.RevTotalPriceSet.results[0].TotalPrc + " " + oData.RevTotalPriceSet.results[0]
						.Text);*/
					var options = {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					};
					var commaArray = [];
					for (var i = 0; i < oData.RevTotalPriceSet.results.length; i++) {
						// oData.RevTotalPriceSet.results[i].TotalPrc = Number(oData.RevTotalPriceSet.results[i].TotalPrc).toLocaleString('en', options);
						oData.RevTotalPriceSet.results[i].TotalPrc = parseFloat(oData.RevTotalPriceSet.results[i].TotalPrc).toFixed(2).replace(
							/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g, "$1,").toString()
					}
					that.getView().byId("orderValue").setText(oData.RevTotalPriceSet.results[oData.RevTotalPriceSet.results.length - 1].TotalPrc +
						" INR");
					that.getView().byId("detailShipToParty").setText(that.getOwnerComponent().getModel("shipToPartyModel").getData()[0].Name.trim());
					that.getView().byId("address").setText(that.getOwnerComponent().getModel("shipToPartyModel").getData()[0].Address.trim());
					var totalPriceModel = that.getOwnerComponent().getModel("totalPriceModel");
					totalPriceModel.setData(oData.RevTotalPriceSet.results);
					that.getView().setModel(totalPriceModel, "totalPriceModel");

				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error in fetching Data " + error);
				}
			});

			/**/
		},

		restoreToEditTable: function () {
			var hbox = new sap.m.HBox({
				width: "100%"
			});
			var button1 = new sap.m.Button({
				icon: "sap-icon://less",
				press: this.deleteQuantController,
				enabled: "{tableDetailsJSONModel>cartQuantDeleteBtnVisibility}"
			});
			var input = new sap.m.Input({
				value: "{tableDetailsJSONModel>Quantity}",
				liveChange: this.changeQuantity,
				enabled: "{tableDetailsJSONModel>cartQuantDeleteBtnVisibility}",
				textAlign: "Center"
			});
			var button2 = new sap.m.Button({
				icon: "sap-icon://add",
				press: this.addQuantController,
				enabled: "{tableDetailsJSONModel>cartQuantDeleteBtnVisibility}"
			});

			// hbox.addItem(button1);
			hbox.addItem(input);
			// hbox.addItem(button2);

			var table = this.getView().byId("detailsTable");
			var that = this;
			table.bindAggregation("items", {
				path: "tableDetailsJSONModel>/Data",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: "{tableDetailsJSONModel>Matnr}"
						}),
						hbox,
						new sap.ui.core.Icon({
							src: "{path:'tableDetailsJSONModel>Stock',formatter:'zjktyrepurorder.controller.Formatter.getIcon'}",
							color: "{path:'tableDetailsJSONModel>Stock',formatter:'zjktyrepurorder.controller.Formatter.getColor'}",
							useIconTooltip: false,
							tooltip: "{tableDetailsJSONModel>Stock}"
						}),
						new sap.m.Text({
							text: "{tableDetailsJSONModel>BasePrice}"
						}),
						new sap.m.Text({
							text: "{tableDetailsJSONModel>NetPrice}"
						}),
						new sap.m.Button({
							icon: "sap-icon://delete",
							press: that.deleteItemRowController,
							visible: "{tableDetailsJSONModel>cartQuantDeleteBtnVisibility}"
						})
					]
				})
			});

			this.getView().getModel("tableDetailsJSONModel").refresh(true);
		},

		pressEdit: function () {
			this.getView().byId("review").setVisible(true);
			this.getView().byId("confirm").setVisible(false);
			this.getView().byId("edit").setVisible(false);
			this.getView().byId("cancel").setVisible(false);
			var detailHeaderVisibility = this.getView().getModel("detailHeaderVisibility");
			detailHeaderVisibility.setProperty("/shoppingOverview", true);
			detailHeaderVisibility.setProperty("/purchaseOrder", false);
			this.getView().setModel(detailHeaderVisibility, "detailHeaderVisibility");
			this.restoreToEditTable();

		},

		pressCancel: function () {
			var that = this;
			MessageBox.warning("All the changes in the current order will be lost. Are you Sure?", {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction === "OK") {
						that.getOwnerComponent().getModel("favouritesJSONModel").setData({});
						that.getOwnerComponent().getModel("itemsJSONModel").setData({});
						that.getOwnerComponent().getModel("tableDetailsJSONModel").setData({});
						that.getOwnerComponent().getModel("totalPriceModel").setData({});
						that.getOwnerComponent().getModel("treeJSONModel").setData({});

						var detailHeaderVisibility = that.getView().getModel("detailHeaderVisibility");
						detailHeaderVisibility.setProperty("/shoppingOverview", true);
						detailHeaderVisibility.setProperty("/purchaseOrder", false);
						that.getView().setModel(detailHeaderVisibility, "detailHeaderVisibility");
						that.getView().byId("review").setVisible(false);
						that.getView().byId("confirm").setVisible(false);
						that.getView().byId("edit").setVisible(false);
						that.getView().byId("cancel").setVisible(false);
						that.getOwnerComponent().getModel("orderTypeModel").setProperty("/selectedRadioButton", that.getOrderTypeRadioButton);
						that.getOwnerComponent().getModel("categoriesModel").setData({});
						that.getView().getParent().getParent().getParent().getParent().getParent().getAggregation("content")[0].getAggregation(
							"items")[0].getAggregation("items")[0].getAggregation("_navMaster").getAggregation("pages")[0].getContent()[0].getContent()[
							0].getItems()[0].getItems()[1].setSelectedKey(null);
						that.getView().getParent().getParent().getParent().getParent().getParent().getAggregation("content")[0].getAggregation(
								"items")[0].getAggregation("items")[0].getAggregation("_navMaster").getAggregation("pages")[0].getAggregation("content")[0]
							.getAggregation("content")[1].getAggregation("_header").getAggregation("items")[1].getContent()[1].getHeaderToolbar().getContent()[
								0].setText("Items");
						that.getView().getParent().getParent().getParent().getParent().getParent().getAggregation("content")[0].getAggregation(
								"items")[0].getAggregation("items")[0].getAggregation("_navMaster").getAggregation("pages")[0].getAggregation("content")[0]
							.getAggregation("content")[1].getItems()[0].getContent()[1].getHeaderToolbar().getContent()[0].setText("Items");
						that.restoreToEditTable();

						/*that.getOwnerComponent().getModel("orderTypeModel").setData({});*/
					}
				}
			});

		}
	});
});
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Formatter",
], function (Controller, MessageBox, Formatter) {
	"use strict";
	var selFavouriteValue = 0;
	var removeFavouriteValue = 0;
	return Controller.extend("zjktyrepurorder.controller.Master", {
		onInit: function () {
			this.CustMaterialSet = [];
			this.removeCustMaterialSet = [];

			this.oRouter = this.getOwnerComponent().getRouter();
			this.busyDialog = new sap.m.BusyDialog();

			this.getView().byId("favouriteButton").setEnabled(false);
			this.getView().byId("removeFavouriteButton").setEnabled(false);

			var orderTypeModel = this.getOwnerComponent().getModel("orderTypeModel");
			var srvURL = "/sap/opu/odata/sap/ZCREATE_SO_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;
			this.busyDialog.open();
			oDataModel.read("/CoDivisionSet", {
				async: false,
				success: function (oData) {
					var results = oData;
					/*for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].divisionEnabled = true;
					}
					var data = {
						"divisionEnabled": false,
						"Bezei": "Please select Divison"
					};
					oData.results.unshift(data);*/
					orderTypeModel.setData(oData.results);
					that.getView().setModel(orderTypeModel, "orderTypeModel");
					that.busyDialog.close();
				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error in fetching Data " + error);
				}
			});

			var shipToPartyModel = this.getOwnerComponent().getModel("shipToPartyModel");
			var srvURL = "/sap/opu/odata/sap/ZCREATE_SO_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;
			this.busyDialog.open();
			oDataModel.read("/ShiptoPartySet?$filter= (Kunnr eq '1105814')", {
				async: false,
				success: function (oData) {
					var results = oData;
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].Kunnr = parseInt(oData.results[i].Kunnr);
						oData.results[i].Kunnr2 = parseInt(oData.results[i].Kunnr2);
					}
					shipToPartyModel.setData(oData.results);

					that.getView().setModel(shipToPartyModel, "shipToPartyModel");
					if (oData.results.length === 1) {
						that.getView().byId("shipToParty").setEnabled(false);
					} else {
						that.getView().byId("shipToParty").setEnabled(true);
					}
					that.busyDialog.close();
				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error in fetching Data " + error);
				}
			});

			this.getView().byId("idIconTabBarNoIcons").setSelectedKey("productCatalogue");

			// this.getCategories();

			this.getRecentOrders();

		},

		getBtnTxt: function (oEvt) {
			if (oEvt.getSource().getSelectedButton().getText() === "Set") {
				sap.ui.getCore().globalSetind = "1";
			} else {
				sap.ui.getCore().globalSetind = "2";
			}
		},

		getRecentOrders: function (oEvt) {
			var orderTypeData = this.getOwnerComponent().getModel("orderTypeModel").getData();

			var shipToPartyselIndex = this.getView().byId("shipToParty").getSelectedIndex();
			var shipToPartyData = this.getOwnerComponent().getModel("shipToPartyModel").getData()[shipToPartyselIndex];

			var itemType = this.getView().byId("itemType").getSelectedButton().getText();
			if (itemType === "Set") {
				var setind = "1";
			} else if (itemType === "Packed Tubes") {
				var setind = "2";
			} else {
				var setind = "1";
			}
			var treeJSONModel = this.getOwnerComponent().getModel("treeJSONModel");
			var srvURL = "/sap/opu/odata/sap/ZCREATE_SO_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);

			if (oEvt) {
				var orderTypeParameter = oEvt.getParameter("selectedItem").getBindingContext("orderTypeModel").getPath().split("/");
				/*var url = "/CategorySet?$filter= (CompInd eq '" + orderTypeData[orderTypeParameter[
					1]].CompInd + "' and Division eq '" + orderTypeData[orderTypeParameter[
					1]].Division + "')&$expand=RecentOrderMatSet";*/
				var url = "/RecentOrderSet?$filter= (CompInd eq '" + orderTypeData[orderTypeParameter[
					1]].CompInd + "' and Division eq '" + orderTypeData[orderTypeParameter[
					1]].Division + "'  and Kunn2 eq '" + shipToPartyData.Kunnr2 + "' and Setind eq '" + setind + "') &$expand=RecentOrderMatSet";
			} else {
				var url = "/RecentOrderSet?$filter= (CompInd eq '" + orderTypeData[0].CompInd + "' and Division eq '" + orderTypeData[0].Division +
					"'  and Kunn2 eq '" + this.getOwnerComponent().getModel("shipToPartyModel").getData()[0].Kunnr2 + "' and Setind eq '" + setind +
					"') &$expand=RecentOrderMatSet";
			}
			var that = this;
			this.busyDialog.open();
			oDataModel.read(url, {
				async: false,
				success: function (oData) {
					var tree = [{
						"nodes": []
					}];
					var length = oData.results.length;
					var tree = [];
					for (var i = 0; i < length; i++) {
						var nodes = [];
						var recentOrderMatSetLength = oData.results[i].RecentOrderMatSet.results.length;
						for (var j = 0; j < recentOrderMatSetLength; j++) {
							nodes.push({
								"text": oData.results[i].RecentOrderMatSet.results[j].Maktx,
								"Maktx": oData.results[i].RecentOrderMatSet.results[j].Matnr,
								"Quantity": parseInt(oData.results[i].RecentOrderMatSet.results[j].Quantity),
								"SalesOrder": oData.results[i].RecentOrderMatSet.results[j].SalesOrder
							});
						}
						tree.push({
							"text": oData.results[i].SalesOrder,
							"icon": "sap-icon://cart-4",
							"nodes": nodes
						});

					}
					treeJSONModel.setData(tree);
					that.getView().setModel(treeJSONModel, "treeJSONModel");
					that.busyDialog.close();
				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error in fetching Data " + error);
				}
			});
		},

		changeRadioButtonGroup: function (oEvt) {
			var getSelRadioBtn = oEvt.getSource();
			this.getOrderTypeRadioButton = this.getView().byId("itemType").getSelectedButton().getText();
			var itemType = oEvt.getSource().getSelectedButton().getText();
			if (itemType === "Set") {
				var setind = "1";
			} else if (itemType === "Packed Tubes") {
				var setind = "2";
			} else {
				var setind = "1";
			}

			if (oEvt.getSource().getSelectedButton().getText() === "Set") {
				sap.ui.getCore().globalSetind = "1";
			} else {
				sap.ui.getCore().globalSetind = "2";
			}

			var detailsTableData = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData();
			if (detailsTableData.Data) {

				this.getFooterDetails = oEvt.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getAggregation(
					"_navDetail").getAggregation("pages")[0].getAggregation("content")[0].getAggregation("footer").getAggregation("content");
				var that = this;
				MessageBox.warning("All the changes in the current order will be lost. Are you Sure?", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction === "OK") {
							that.sAction = "OK";
							that.getOwnerComponent().getModel("favouritesJSONModel").setData({});
							that.getOwnerComponent().getModel("itemsJSONModel").setData({});
							that.getOwnerComponent().getModel("tableDetailsJSONModel").setData({});
							that.getOwnerComponent().getModel("totalPriceModel").setData({});
							that.getOwnerComponent().getModel("categoriesModel").setData({});
							that.getOwnerComponent().getModel("treeJSONModel").setData({});
							var detailHeaderVisibility = that.getView().getModel("detailHeaderVisibility");
							detailHeaderVisibility.setProperty("/shoppingOverview", true);
							detailHeaderVisibility.setProperty("/purchaseOrder", false);
							that.getView().setModel(detailHeaderVisibility, "detailHeaderVisibility");
							that.getView().byId("favCategories").setSelectedKey(null);
							that.getView().byId("categories").setSelectedKey(null);
							that.getView().byId("orderType").setSelectedKey(null);
							that.getFooterDetails[1].setVisible(false);
							that.getFooterDetails[2].setVisible(false);
							that.getFooterDetails[3].setVisible(false);
							that.getFooterDetails[4].setVisible(false);
							that.getOwnerComponent().getModel("orderTypeModel").setProperty("/selectedRadioButton", that.getOrderTypeRadioButton);
							that.getView().byId("favouritesCount").setText("Items");
							that.getView().byId("productCatalogueCount").setText("Items");
							that.getView().byId("searchField").setValue("");
							var oListBinding = that.getView().byId("productCatalogue").getBinding("items");
							oListBinding.aApplicationFilters = [];
							oListBinding.sFilterParams = undefined;
							oListBinding.refresh();
							oListBinding.filter([]);
							that.getView().byId("collapseAll").setVisible(false);
							
							that.getView().byId("expandAll").setVisible(false);
							/*that.getRecentOrders();
							that.getProducts();
							that.getFavourites();*/
						} else {
							var getRadioButton = that.getOwnerComponent().getModel("orderTypeModel").getProperty("/selectedRadioButton");
							if (getRadioButton === "Set") {
								var setSelectedIndex = 0;
							} else {
								var setSelectedIndex = 1;
							}
							that.getView().byId("itemType").setSelectedIndex(setSelectedIndex);
						}
					}
				});

			} else if (this.getView().getModel("itemsJSONModel").getData().length > 0 || this.getView().getModel("favouritesJSONModel").getData()
				.length > 0 || this.getView().byId("orderType").getSelectedKey()) {
				var that = this;
				MessageBox.warning("All the changes in the current order will be lost. Are you Sure?", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction === "OK") {
							that.getOwnerComponent().getModel("favouritesJSONModel").setData({});
							that.getOwnerComponent().getModel("itemsJSONModel").setData({});
							that.getOwnerComponent().getModel("treeJSONModel").setData({});
							that.getView().byId("favouritesCount").setText("Items");
							that.getView().byId("productCatalogueCount").setText("Items");
							that.getView().byId("favCategories").setSelectedKey(null);
							that.getView().byId("categories").setSelectedKey(null);
							that.getView().byId("orderType").setSelectedKey(null);
							that.getView().byId("collapseAll").setVisible(false);
							
							that.getView().byId("expandAll").setVisible(false);
						} else {
							var getRadioButton = that.getOwnerComponent().getModel("orderTypeModel").getProperty("/selectedRadioButton");
							if (getRadioButton === "Set") {
								var setSelectedIndex = 0;
							} else {
								var setSelectedIndex = 1;
							}
							that.getView().byId("itemType").setSelectedIndex(setSelectedIndex);
						}
					}
				});

			} else {
				if (this.getView().byId("productCatalogue").getSelectedItems().length > 0 && this.getView().byId("myFavouritesId").getSelectedItems()
					.length > 0) {
					this.getRecentOrders();
					this.getProducts();
					this.getFavourites();
				}
				// this.loadCategoriesData(url);

			}
		},

		getCategories: function (oEvt) {
			// this.getDivisonSelKey = oEvt.getParameter("selectedItem").getText();

			var detailsTableData = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData();
			if (detailsTableData.Data) {
				this.getFooterDetails = oEvt.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getAggregation(
					"_navDetail").getAggregation("pages")[0].getAggregation("content")[0].getAggregation("footer").getAggregation("content");
				var that = this;
				MessageBox.warning("All the changes in the current order will be lost. Are you Sure?", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction === "OK") {
							that.sAction = "OK";
							that.getOwnerComponent().getModel("orderTypeModel").setProperty("/selectedKey", that.getDivisonSelKey);
							that.getOwnerComponent().getModel("orderTypeModel").setProperty("/selectedRadioButton", that.getOrderTypeRadioButton);
							that.getOwnerComponent().getModel("favouritesJSONModel").setData({});
							that.getOwnerComponent().getModel("itemsJSONModel").setData({});
							that.getOwnerComponent().getModel("tableDetailsJSONModel").setData({});
							that.getOwnerComponent().getModel("totalPriceModel").setData({});
							that.getOwnerComponent().getModel("categoriesModel").setData({});
							that.getOwnerComponent().getModel("treeJSONModel").setData({});

							var detailHeaderVisibility = that.getView().getModel("detailHeaderVisibility");
							detailHeaderVisibility.setProperty("/shoppingOverview", true);
							detailHeaderVisibility.setProperty("/purchaseOrder", false);
							that.getView().setModel(detailHeaderVisibility, "detailHeaderVisibility");
							that.getView().byId("favCategories").setSelectedKey(null);
							that.getView().byId("categories").setSelectedKey(null);
							that.getView().byId("orderType").setSelectedKey(null);
							that.getFooterDetails[1].setVisible(false);
							that.getFooterDetails[2].setVisible(false);
							that.getFooterDetails[3].setVisible(false);
							that.getFooterDetails[4].setVisible(false);
							that.getView().byId("favouritesCount").setText("Items");
							that.getView().byId("productCatalogueCount").setText("Items");
							that.getView().byId("searchField").setValue("");
							var oListBinding = that.getView().byId("productCatalogue").getBinding("items");
							oListBinding.aApplicationFilters = [];
							oListBinding.sFilterParams = undefined;
							oListBinding.refresh();
							oListBinding.filter([]);
							that.getView().byId("collapseAll").setVisible(false);
							
							that.getView().byId("expandAll").setVisible(false);

						} else {
							var getKey = that.getOwnerComponent().getModel("orderTypeModel").getProperty("/selectedKey");
							that.getView().byId("orderType").setSelectedKey(getKey);
						}
					}
				});

			} else {
				this.getOwnerComponent().getModel("favouritesJSONModel").setData({});
				this.getOwnerComponent().getModel("itemsJSONModel").setData({});
				this.getView().byId("productCatalogueCount").setText("Items");
				this.getView().byId("favouritesCount").setText("Items");
				this.getView().byId("searchField").setValue("");
				var oListBinding = this.getView().byId("productCatalogue").getBinding("items");
				oListBinding.aApplicationFilters = [];
				oListBinding.sFilterParams = undefined;
				oListBinding.refresh();
				oListBinding.filter([]);

				this.getView().byId("favCategories").setSelectedKey("");
				this.getView().byId("categories").setSelectedKey("");
				this.getOwnerComponent().getModel("orderTypeModel").setProperty("/selectedKey", oEvt.getParameter("selectedItem").getText());
				this.getOwnerComponent().getModel("orderTypeModel").setProperty("/selectedRadioButton", this.getView().byId("itemType").getSelectedButton()
					.getText());

				var orderTypeData = this.getOwnerComponent().getModel("orderTypeModel").getData();
				this.getRecentOrders(oEvt);
				if (oEvt) {
					var orderTypeParameter = oEvt.getParameter("selectedItem").getBindingContext("orderTypeModel").getPath().split("/");
					var url = "/CategorySet?$filter= (CompInd eq '" + orderTypeData[orderTypeParameter[
						1]].CompInd + "' and Division eq '" + orderTypeData[orderTypeParameter[
						1]].Division + "')";
				} else {
					var url = "/CategorySet?$filter= (CompInd eq '" + orderTypeData[0].CompInd + "' and Division eq '" + orderTypeData[0].Division +
						"')";
				}

				var srvURL = "/sap/opu/odata/sap/ZCREATE_SO_SRV";
				var categoriesModel = this.getOwnerComponent().getModel("categoriesModel");
				var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);

				var that = this;
				this.busyDialog.open();
				oDataModel.read(url, {
					async: false,
					success: function (oData) {
						var results = oData;
						categoriesModel.setData(oData.results);
						that.getView().setModel(categoriesModel, "categoriesModel");
						that.getView().byId("collapseAll").setVisible(true);
						that.getView().byId("expandAll").setVisible(true);
						that.busyDialog.close();
					},
					error: function (error) {
						that.busyDialog.close();
						alert("Error in fetching Data " + error);
					}
				});

			}

		},

		loadCategoriesData: function (url) {

		},

		getFavourites: function (oEvt) {
			var orderTypeSelIndex = this.getView().byId("orderType").getSelectedIndex();
			var shipToPartySelIndex = this.getView().byId("shipToParty").getSelectedIndex();

			var orderTypeData = this.getOwnerComponent().getModel("orderTypeModel").getData()[orderTypeSelIndex];
			var shipToPartyData = this.getOwnerComponent().getModel("shipToPartyModel").getData()[shipToPartySelIndex];
			var itemType = this.getView().byId("itemType").getSelectedButton().getText();
			if (itemType === "Set") {
				var setind = "1";
			} else if (itemType === "Packed Tubes") {
				var setind = "2";
			} else {
				var setind = "1";
			}

			if (oEvt) {
				var getSelectedCategoryIndexData = this.getOwnerComponent().getModel("categoriesModel").getData()[oEvt.getSource().getSelectedIndex()];
				var getCategory = oEvt.getSource().getSelectedKey();
			} else {
				var getSelIndex = this.getView().byId("categories").getSelectedIndex();
				var getSelectedCategoryIndexData = this.getOwnerComponent().getModel("categoriesModel").getData()[getSelIndex];
			}

			var favouritesJSONModel = this.getOwnerComponent().getModel("favouritesJSONModel");
			var srvURL =
				"/sap/opu/odata/sap/ZCREATE_SO_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;
			this.busyDialog.open();
			oDataModel.read("/MaterialSet?$filter= (CompInd eq '" + orderTypeData.CompInd +
				"' and Division eq '" + orderTypeData.Division + "' and DashboardGrouping eq '" + getSelectedCategoryIndexData.DashboardGrouping +
				"' and Setind eq '" + setind + "' and Kunnr eq '')", {
					success: function (oData) {
						var results = oData.results;

						var favData = [];
						for (var i = 0; i < oData.results.length; i++) {
							if (oData.results[i].FavInd === "X") {
								oData.results[i].icon = "sap-icon://cart-4";
								oData.results[i].value = 0;
								favData.push(oData.results[i]);
							}
						}
						that.getView().byId("favouritesCount").setText("Items (" + favData.length + ")");
						favouritesJSONModel.setData(favData);
						that.getView().setModel(favouritesJSONModel, "favouritesJSONModel");

						that.removeCustMaterialSet = [];
						removeFavouriteValue = 0;
						that.getView().byId("removeFavouriteButton").setEnabled(false);
						that.getView().byId("removeFavouriteButton").setText("Remove as Favourite (0)");

						that.busyDialog.close();
					},
					error: function (error) {
						that.busyDialog.close();
						alert("Error in fetching Data " + error);
					}
				});
		},

		getProducts: function (oEvt) {

			var orderTypeSelIndex = this.getView().byId("orderType").getSelectedIndex();
			var shipToPartySelIndex = this.getView().byId("shipToParty").getSelectedIndex();

			var orderTypeData = this.getOwnerComponent().getModel("orderTypeModel").getData()[orderTypeSelIndex];
			var shipToPartyData = this.getOwnerComponent().getModel("shipToPartyModel").getData()[shipToPartySelIndex];
			var itemType = this.getView().byId("itemType").getSelectedButton().getText();
			if (itemType === "Set") {
				var setind = "1";
			} else if (itemType === "Packed Tubes") {
				var setind = "2";
			} else {
				var setind = "1";
			}

			if (oEvt) {
				var getSelectedCategoryIndexData = this.getOwnerComponent().getModel("categoriesModel").getData()[oEvt.getSource().getSelectedIndex()];
				var getCategory = oEvt.getSource().getSelectedKey();
			} else {
				var getSelIndex = this.getView().byId("categories").getSelectedIndex();
				var getSelectedCategoryIndexData = this.getOwnerComponent().getModel("categoriesModel").getData()[getSelIndex];
			}
			this.getView().byId("searchField").setValue("");
			var oListBinding = this.getView().byId("productCatalogue").getBinding("items");
			oListBinding.aApplicationFilters = [];
			oListBinding.sFilterParams = undefined;
			oListBinding.refresh();
			oListBinding.filter([]);

			var itemsJSONModel = this.getOwnerComponent().getModel("itemsJSONModel");
			var srvURL =
				"/sap/opu/odata/sap/ZCREATE_SO_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;
			this.busyDialog.open();
			oDataModel.read("/MaterialSet?$filter= (CompInd eq '" + orderTypeData.CompInd +
				"' and Division eq '" + orderTypeData.Division + "' and DashboardGrouping eq '" + getSelectedCategoryIndexData.DashboardGrouping +
				"' and Setind eq '" + setind + "' and Kunnr eq '')", {
					success: function (oData) {
						var results = oData.results;
						that.getView().byId("productCatalogueCount").setText("Items (" + results.length + ")");
						for (var i = 0; i < oData.results.length; i++) {
							oData.results[i].icon = "sap-icon://cart-4";
							if (oData.results[i].FavInd === "X") {
								oData.results[i].displayOnly = true;
								oData.results[i].value = 1.0;
							} else {
								oData.results[i].displayOnly = false;
								oData.results[i].value = 0.0;
							}
						}
						itemsJSONModel.setData(oData.results);
						that.getView().setModel(itemsJSONModel, "itemsJSONModel");
						that.CustMaterialSet = [];
						selFavouriteValue = 0;
						that.getView().byId("favouriteButton").setEnabled(false);
						that.getView().byId("favouriteButton").setText("Save as Favourite (0)");

						that.busyDialog.close();
					},
					error: function (error) {
						that.busyDialog.close();
						alert("Error in fetching Data " + error);
					}
				});
		},

		onSearch: function (oEvt) {
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				// var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sQuery);
				var filter1 = new sap.ui.model.Filter("Maktx", sap.ui.model.FilterOperator.Contains, sQuery);
				// aFilters.push(filter);
				aFilters.push(filter1);

				/*aFilters.push(new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Equal, sQuery));
				aFilters.push(new sap.ui.model.Filter("Maktx", sap.ui.model.FilterOperator.Equal, sQuery));*/
			}

			// update list binding
			var list = this.getView().byId("productCatalogue");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
			this.getView().byId("productCatalogueCount").setText("Items (" + binding._getLength() + ")");
		},

		onAfterRendering: function () {
			var oSplitApp = this.getView().byId("masterPage");
			// oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyle");
			oSplitApp.getParent().getParent().setWidth("28rem");
		},

		handleTreeButtonPress: function (oEvt) {
			var detailHeaderVisibility = this.getOwnerComponent().getModel("detailHeaderVisibility").getData();
			if (detailHeaderVisibility.purchaseOrder === true) {
				MessageBox.error("Please confirm the existing order. You cannot add items to the Cart");
			} else {
				var orderType = this.getView().byId("orderType").getSelectedIndex();
				var orderTypeModelDetails = this.getOwnerComponent().getModel("orderTypeModel").getData()[orderType];
				var setIndRadioBtn = this.getView().byId("itemType");
				if (setIndRadioBtn.getSelectedIndex() === 0) {
					var itemType = "1";
				} else {
					var itemType = "2";
				}
				var shipToPartyselIndex = this.getView().byId("shipToParty").getSelectedIndex();
				var shipToPartyData = this.getOwnerComponent().getModel("shipToPartyModel").getData()[shipToPartyselIndex];
				var selectedTabFilter = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
				var getSalesOrder = oEvt.getSource().getParent().getAggregation("items")[0].getText();
				var treeResultsLength = this.getView().getModel("treeJSONModel").getData().length;
				var selRowIndex;
				for (var i = 0; i < treeResultsLength; i++) {
					if (this.getView().getModel("treeJSONModel").getData()[i].text === getSalesOrder) {
						selRowIndex = i;
					}
				}
				var nodesLength = this.getView().getModel("treeJSONModel").getData()[selRowIndex].nodes;
				var data = [];

				sap.ui.getCore().globalCompInd = orderTypeModelDetails.CompInd;
				sap.ui.getCore().globalDivision = orderTypeModelDetails.Division;
				sap.ui.getCore().globalKunn2 = shipToPartyData.Kunnr2;
				sap.ui.getCore().globalSetind = itemType;
				var itemsTable = this.getView().getModel("tableDetailsJSONModel").getData().Data;

				var treeNodes = this.getView().getModel("treeJSONModel").getData()[selRowIndex].nodes;

				if (itemsTable !== undefined) {
					for (var i = 0; i < itemsTable.length; i++) {
						for (var j = 0; j < treeNodes.length; j++) {
							if (itemsTable[i].Matnr === treeNodes[j].text) {
								this.approvalCart();
								return;
							}
						}

					}
				}

				if (oEvt.getSource().getIcon() === "sap-icon://cart-approval") {
					this.approvalCart();
					return;
				} else {
					var selRecord = this.getView().getModel("treeJSONModel").getData()[selRowIndex];
					var itemsTable = this.getView().getModel("tableDetailsJSONModel").getData().Data;

					for (var i = 0; i < nodesLength.length; i++) {

						data.push({
							"Matnr": nodesLength[i].text,
							"Maktx": nodesLength[i].Maktx,
							"Quantity": nodesLength[i].Quantity,
							"basicValue": "",
							"currency": "INR",
							"depotStock": "",
							"basicPrice": "",
							"CompInd": orderTypeModelDetails.CompInd,
							"Division": orderTypeModelDetails.Division,
							"Setind": itemType,
							"Kunn2": shipToPartyData.Kunnr2,
							"selectedTab": selectedTabFilter,
							"SalesOrder": this.getView().getModel("treeJSONModel").getData()[selRowIndex].text,
							"cartQuantDeleteBtnVisibility": true
						});
					}

					/*if (itemsTable !== undefined) {
						for (var i = 0; i < itemsTable.length; i++) {
							if (itemsTable[i].Matnr === data[i].Matnr) {
								this.approvalCart();
								return;
							}
						}
					}*/

					if (JSON.stringify(this.getOwnerComponent().getModel("tableDetailsJSONModel").getData()) === '{}') {
						var tableDetailsJSONModel = this.getOwnerComponent().getModel("tableDetailsJSONModel");
						tableDetailsJSONModel.setData({
							"Data": data
						});
						this.getOwnerComponent().setModel(tableDetailsJSONModel, "tableDetailsJSONModel");
					} else {
						var tableDetailsJSONModel = this.getOwnerComponent().getModel("tableDetailsJSONModel");
						var recentOrders = tableDetailsJSONModel.getData().Data.concat(data);
						tableDetailsJSONModel.setData({
							"Data": recentOrders
						});
						this.getOwnerComponent().setModel(tableDetailsJSONModel, "tableDetailsJSONModel");
					}

					selRecord.icon = "sap-icon://cart-approval";
					// this.getView().byId("treeBtn").setVisible(true);
					for (var i = 0; i < selRecord.nodes.length; i++) {
						if (selRecord.nodes[i].Matnr) {
							// selRecord.nodes.splice(i, 1);
							delete selRecord.nodes[i];
						}
					}
					this.getOwnerComponent().getModel("treeJSONModel").refresh(true);

					// sap.ui.getCore().tableLength = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data.length;
					var tLength = 0;
					var tableLength = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data.length;
					for (var i = 0; i < tableLength; i++) {
						if (this.getView().getModel("tableDetailsJSONModel").getData().Data[i].cartQuantDeleteBtnVisibility ===
							true) {
							tLength = tLength + 1;
						}
					}
					this.getOwnerComponent().getModel("tableDetailsJSONModel").setProperty("/tableRecordsCount", "(" + tLength +
						")");

					this.oRouter.navTo("Detail");
				}
			}
		},

		recentOrdersCart: function (oEvt) {
			var link = oEvt.getSource().getParent().getItems()[0].getItems()[0].getText();
			var text = oEvt.getSource().getParent().getItems()[0].getItems()[1].getText();
			var orderType = this.getView().byId("orderType").getSelectedIndex();
			var orderTypeModelDetails = this.getOwnerComponent().getModel("orderTypeModel").getData()[orderType];
			var detailHeaderVisibility = this.getOwnerComponent().getModel("detailHeaderVisibility").getData();
			if (detailHeaderVisibility.purchaseOrder === true) {
				MessageBox.error("Please confirm the existing order. You cannot add items to the Cart");
			} else {

				var setIndRadioBtn = this.getView().byId("itemType");
				if (setIndRadioBtn.getSelectedIndex() === 0) {
					var itemType = "1";
				} else {
					var itemType = "2";
				}

				var shipToPartyselIndex = this.getView().byId("shipToParty").getSelectedIndex();
				var shipToPartyData = this.getOwnerComponent().getModel("shipToPartyModel").getData()[shipToPartyselIndex];

				sap.ui.getCore().globalCompInd = orderTypeModelDetails.CompInd;
				sap.ui.getCore().globalDivision = orderTypeModelDetails.Division;
				sap.ui.getCore().globalKunn2 = shipToPartyData.Kunnr2;
				sap.ui.getCore().globalSetind = itemType;

				var selectedTabFilter = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
				sap.ui.getCore().selRoute = this.oRouter.oHashChanger.hash;
				var itemsTable = this.getView().getModel("tableDetailsJSONModel").getData().Data;
				if (itemsTable !== undefined) {
					for (var i = 0; i < itemsTable.length; i++) {
						if (itemsTable[i].Matnr === text) {
							this.approvalCart();
							return;
						}
					}
				}

				if (oEvt.getSource().getIcon() === "sap-icon://cart-approval") {
					this.approvalCart();
					return;
				} else {
					var idLength = oEvt.getSource().getId().split("-").length;
					// var getSelRowIndex = parseInt(oEvt.getSource().getId().split("-")[idLength - 1]);
					var getSelRowIndex = parseInt(oEvt.getSource().getParent().getParent().getBindingContextPath().split("/")[1]);
					var btnId = oEvt.getSource().getId().split("-")[idLength - 2];
					if (btnId === "myFavouritesId") {
						var selRecord = this.getView().getModel("favouritesJSONModel").getData()[getSelRowIndex];
					} else {
						var selRecord = this.getView().getModel("itemsJSONModel").getData()[getSelRowIndex];
					}

					var data = {
						"Matnr": text,
						"Maktx": link,
						"Quantity": "1",
						"basicValue": "",
						"currency": "INR",
						"depotStock": "",
						"basicPrice": "",
						"CompInd": orderTypeModelDetails.CompInd,
						"Division": orderTypeModelDetails.Division,
						"Setind": itemType,
						"Kunn2": shipToPartyData.Kunnr2,
						"selectedTab": selectedTabFilter,
						"cartQuantDeleteBtnVisibility": true
					};
					if (JSON.stringify(this.getOwnerComponent().getModel("tableDetailsJSONModel").getData()) === '{}') {
						var tableDetailsJSONModel = this.getOwnerComponent().getModel("tableDetailsJSONModel");
						tableDetailsJSONModel.setData({
							"Data": [data]
						});
						this.getOwnerComponent().setModel(tableDetailsJSONModel, "tableDetailsJSONModel");
					} else {
						var tableDetailsJSONModel = this.getOwnerComponent().getModel("tableDetailsJSONModel");
						var recentOrders = tableDetailsJSONModel.getData().Data.push(data);
						tableDetailsJSONModel.setData(tableDetailsJSONModel.getData());
						this.getOwnerComponent().setModel(tableDetailsJSONModel, "tableDetailsJSONModel");
					}

					this.getOwnerComponent().getModel("tableDetailsJSONModel").refresh(true);
					selRecord.icon = "sap-icon://cart-approval";
					if (btnId === "myFavouritesId") {
						this.getOwnerComponent().getModel("favouritesJSONModel").refresh(true);
					} else {
						this.getOwnerComponent().getModel("itemsJSONModel").refresh(true);
					}
					// sap.ui.getCore().tableLength = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data.length;
					var tLength = 0;
					var tableLength = this.getOwnerComponent().getModel("tableDetailsJSONModel").getData().Data.length;
					for (var i = 0; i < tableLength; i++) {
						if (this.getView().getModel("tableDetailsJSONModel").getData().Data[i].cartQuantDeleteBtnVisibility ===
							true) {
							tLength = tLength + 1;
						}
					}
					this.getOwnerComponent().getModel("tableDetailsJSONModel").setProperty("/tableRecordsCount", "(" + tLength +
						")");
					/*this.getOwnerComponent().getModel("tableDetailsJSONModel").setProperty("/tableRecordsCount", "(" + sap.ui.getCore().tableLength +
						")");*/

					this.oRouter.navTo("Detail");
				}
			}
		},

		approvalCart: function () {
			MessageBox.information("Selected product was already available in Items. Please increase the Quantity.");
		},

		allFilters: function () {
			if (!this.filterDialog) {
				this.filterDialog = sap.ui.xmlfragment("System Group", "zjktyrepurorder/view/filterFragment", this);
				this.getView().addDependent(this.filterDialog);
			}
			this.filterDialog.open();
		},

		onCollapseAllPress: function (evt) {
			var oTree = this.byId("Tree");
			oTree.collapseAll();
		},

		onExpandAllPress: function (oEvent) {
			this.byId("Tree").expandToLevel(1);
		},

		pressCategory: function (oEvt) {
			sap.ui.getCore().title = oEvt.getParameter("listItem").getTitle();
			var counter = oEvt.getParameter("listItem").getCounter();
			this.oRouter.navTo("secondMaster");
		},

		removeFavourite: function (oEvt) {
			var selRating = oEvt.getSource();
			var selIndex = oEvt.getSource().getParent().getId().split("-")[oEvt.getSource().getParent().getId().split("-").length - 1];

			if (selRating.getValue() === 1) {
				var favValue = ++removeFavouriteValue;
				if (this.getView().getModel("favouritesJSONModel").getData()[selIndex].FavInd === "X") {
					this.getView().getModel("favouritesJSONModel").getData()[selIndex].FavInd = "";
					this.removeCustMaterialSet.push(this.getView().getModel("favouritesJSONModel").getData()[selIndex]);
				}
			} else {
				var favValue = --removeFavouriteValue;
				this.getView().getModel("favouritesJSONModel").getData()[selIndex].FavInd = "";
				var getData = this.getView().getModel("favouritesJSONModel").getData()[selIndex];
			}
			this.getView().byId("removeFavouriteButton").setEnabled(true);
			this.getView().byId("removeFavouriteButton").setText("Remove as Favourite (" + favValue + ")");

			if (removeFavouriteValue === 0) {
				this.getView().byId("removeFavouriteButton").setEnabled(false);
				this.getView().byId("removeFavouriteButton").setText("Remove as Favourite");
			}
		},

		selectFavourite: function (oEvt) {
			var selRating = oEvt.getSource();
			var selIndex = oEvt.getSource().getParent().getId().split("-")[oEvt.getSource().getParent().getId().split("-").length - 1];

			if (selRating.getValue() === 1) {
				var favValue = ++selFavouriteValue;
				if (this.getView().getModel("itemsJSONModel").getData()[selIndex].FavInd !== "X") {
					this.getView().getModel("itemsJSONModel").getData()[selIndex].FavInd = "X";
					this.CustMaterialSet.push(this.getView().getModel("itemsJSONModel").getData()[selIndex]);
				}
			} else {
				var favValue = --selFavouriteValue;
				this.getView().getModel("itemsJSONModel").getData()[selIndex].FavInd = "";
				var getData = this.getView().getModel("itemsJSONModel").getData()[selIndex];
			}
			this.getView().byId("favouriteButton").setEnabled(true);
			this.getView().byId("favouriteButton").setText("Save as Favourite (" + favValue + ")");

			if (selFavouriteValue === 0) {
				this.getView().byId("favouriteButton").setEnabled(false);
				this.getView().byId("favouriteButton").setText("Save as Favourite");
			}
		},

		updateRemoveFavourite: function () {
			var shipToPartySelIndex = this.getView().byId("shipToParty").getSelectedIndex();
			var kunnr = this.getOwnerComponent().getModel("shipToPartyModel").getData()[shipToPartySelIndex].Kunnr;
			this.busyDialog.open();
			var removeCustArrayPayLoad = [];
			for (var i = 0; i < this.removeCustMaterialSet.length; i++) {
				if (this.removeCustMaterialSet[i].FavInd === "") {
					delete this.removeCustMaterialSet[i].__metadata;
					delete this.removeCustMaterialSet[i].icon;
					delete this.removeCustMaterialSet[i].displayOnly;

					delete this.removeCustMaterialSet[i].CompInd;
					delete this.removeCustMaterialSet[i].DashboardGrouping;
					delete this.removeCustMaterialSet[i].Division;
					delete this.removeCustMaterialSet[i].Kunnr;
					delete this.removeCustMaterialSet[i].Setind;
					delete this.removeCustMaterialSet[i].value;
					removeCustArrayPayLoad.push(this.removeCustMaterialSet[i]);
				}
			}
			var itemType = this.getView().byId("itemType").getSelectedButton().getText();
			if (itemType === "Set") {
				var setind = "1";
			} else if (itemType === "Packed Tubes") {
				var setind = "2";
			} else {
				var setind = "1";
			}

			var getSelectedCategoryIndexData = this.getOwnerComponent().getModel("categoriesModel").getData()[this.getView().byId(
				"favCategories").getSelectedIndex()];

			var payload = {
				"Compind": getSelectedCategoryIndexData.CompInd,
				"Division": getSelectedCategoryIndexData.Division,
				"Dashboardgrouping": getSelectedCategoryIndexData.DashboardGrouping,
				"Setind": setind,
				"FavMatSet": removeCustArrayPayLoad
			};

			var srvURL =
				"/sap/opu/odata/sap/ZCREATE_SO_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;

			oDataModel.create("/HeaderSet", payload, {
				success: function (oData) {
					var results = oData.results;
					that.removeCustArrayPayLoad = [];
					that.getView().byId("removeFavouriteButton").setEnabled(false);
					that.getView().byId("removeFavouriteButton").setText("Remove as Favourite (0)");
					removeFavouriteValue = 0;

					var getProductsData = that.getView().getModel("favouritesJSONModel").getData();

					for (var i = 0; i < getProductsData.length; i++) {
						if (getProductsData[i].FavInd === "") {
							getProductsData[i].icon = "sap-icon://cart-4";
							getProductsData[i].value = 0;
							// getProductsData.splice(i, 1);
							delete getProductsData[i];
						} else {
							getProductsData[i].value = 0;
						}
					}
					var mainProducts = [];
					for (var i = 0; i < getProductsData.length; i++) {
						if (getProductsData[i]) {
							mainProducts.push(getProductsData[i]);
						}
					}
					var oModel = that.getView().getModel("favouritesJSONModel");
					oModel.setData(mainProducts);
					that.getView().setModel(oModel, "favouritesJSONModel");
					that.getView().byId("favouritesCount").setText("Items (" + mainProducts.length + ")");
					that.busyDialog.close();

				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error in fetching Data " + error);
				}
			});

		},

		updateFavourite: function () {
			var shipToPartySelIndex = this.getView().byId("shipToParty").getSelectedIndex();
			var kunnr = this.getOwnerComponent().getModel("shipToPartyModel").getData()[shipToPartySelIndex].Kunnr;
			this.busyDialog.open();
			var custArrayPayLoad = [];
			for (var i = 0; i < this.CustMaterialSet.length; i++) {
				if (this.CustMaterialSet[i].FavInd === "X") {
					delete this.CustMaterialSet[i].__metadata;
					delete this.CustMaterialSet[i].icon;
					delete this.CustMaterialSet[i].displayOnly;

					delete this.CustMaterialSet[i].CompInd;
					delete this.CustMaterialSet[i].DashboardGrouping;
					delete this.CustMaterialSet[i].Division;
					delete this.CustMaterialSet[i].Kunnr;
					delete this.CustMaterialSet[i].Setind;
					delete this.CustMaterialSet[i].value;
					custArrayPayLoad.push(this.CustMaterialSet[i]);
				}
			}
			var itemType = this.getView().byId("itemType").getSelectedButton().getText();
			if (itemType === "Set") {
				var setind = "1";
			} else if (itemType === "Packed Tubes") {
				var setind = "2";
			} else {
				var setind = "1";
			}

			var getSelectedCategoryIndexData = this.getOwnerComponent().getModel("categoriesModel").getData()[this.getView().byId("categories")
				.getSelectedIndex()];

			var payload = {
				"Compind": getSelectedCategoryIndexData.CompInd,
				"Division": getSelectedCategoryIndexData.Division,
				"Dashboardgrouping": getSelectedCategoryIndexData.DashboardGrouping,
				"Setind": setind,
				"FavMatSet": custArrayPayLoad
			}

			var srvURL =
				"/sap/opu/odata/sap/ZCREATE_SO_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(srvURL);
			var that = this;

			oDataModel.create("/HeaderSet", payload, {
				success: function (oData) {
					var results = oData.results;
					that.CustMaterialSet = [];
					that.getView().byId("favouriteButton").setEnabled(false);
					that.getView().byId("favouriteButton").setText("Save as Favourite (0)");
					selFavouriteValue = 0;

					var getProductsData = that.getView().getModel("itemsJSONModel").getData();

					for (var i = 0; i < getProductsData.length; i++) {
						if (getProductsData[i].FavInd === "X") {
							getProductsData[i].icon = "sap-icon://cart-4";
							getProductsData[i].displayOnly = true;
						} else {
							getProductsData[i].displayOnly = false;
						}
					}
					var oModel = that.getOwnerComponent().getModel("itemsJSONModel");
					oModel.setData(getProductsData);
					that.getView().setModel(oModel, "itemsJSONModel");
					that.busyDialog.close();

				},
				error: function (error) {
					that.busyDialog.close();
					alert("Error in fetching Data " + error);
				}
			});

		}
	});
});
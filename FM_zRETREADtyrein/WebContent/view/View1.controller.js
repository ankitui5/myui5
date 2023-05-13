sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/Button",
	"sap/ui/core/Control",
	"zretreadtyrein/util/Formatter"
	],

function(MessageBox, Controller, JSONModel, Device, Button, Control,Formatter) {
"use strict";
var that, fleetJModel, walkJModel, customerJModel, data, Dealer, DealerName, Kunnr, Type, BeltTyreFormData;

return sap.ui.controller("zretreadtyrein.view.View1", {

	onInit:function(){
		that = this;
		var oView = this.getView();
		this.newBusy = new sap.m.BusyDialog();
		
		fleetJModel = new sap.ui.model.json.JSONModel();
		this.getView().byId("idFleetTable2").setModel(fleetJModel, "fleetJModel");
		
		walkJModel = new sap.ui.model.json.JSONModel();
		this.getView().byId("idWalkTable2").setModel(walkJModel, "walkJModel");
		
		BeltTyreFormData = new sap.ui.model.json.JSONModel();
		this.getView().byId("idBeltTable").setModel(BeltTyreFormData, "BeltTyreFormData");
		
		//set initial date in input field
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
		var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		var firstDay = new Date(y,m,1);
		var currentDate = new Date;
		var dateFormat  = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
		this.dateFrom   = dateFormat.format(firstDay)+"T00:00:00";
		this.dateTo     = dateFormat.format(currentDate)+"T00:00:00";
		currentDate     = oDateFormat.format(currentDate);
		firstDay        = oDateFormat.format(firstDay);
		
		var initialDateValue = firstDay + " - " + currentDate;
		this.getView().byId("fromDate").setValue(firstDay);
		this.getView().byId("toDate").setValue(currentDate);
		
		//set maximum date in input field
		var oDatePicker = this.getView().byId("fromDate");
			oDatePicker.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled"); 
			}
		},
			oDatePicker
		); 
		var oDatePicker1 = this.getView().byId("toDate");
		oDatePicker1.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled");
			}
		},
			oDatePicker1
		);		
		walkJModel.setData([]);
		walkJModel.refresh();
		
		var obj={
				busy:false,
				delay:0
				};
		var oPageModel=new sap.ui.model.json.JSONModel(obj);
		this.getView().setModel(oPageModel,"oPageModel");
		
		this.getDealerInfo();
		
		var today = new Date();
		this.getView().byId("idTime").setText(today.toDateString());
		this.getView().byId("idTimeTread").setText(today.toDateString());
		
		this.getView().byId("idCollectionDate").setMaxDate(today).setDateValue(today);
		
		
		var date = this.getView().byId("idCollectionDate");
		date.addDelegate({
			onAfterRendering: function() {
				date.$().find('INPUT').attr('disabled', true);
			}
		}, date);
		
		//this.onF4Customer();
		
		this._FleetDialog = sap.ui.xmlfragment("zretreadtyrein.view.Intial", that);
		this.getView().addDependent(this._FleetDialog);
		this._FleetDialog.open();
		
		this._FleetDialog.setEscapeHandler(function(o){ 
			o.reject(); 
		}); 

		
		this.bindReasonSet();
	},
	
	onAfterRendering: function() {
		//that.getView().byId("idCore1").addStyleClass("coreHeight");
		//that.getView().byId("idCore2").addStyleClass("coreHeight");
	},
	
	bindReasonSet: function(){
		 debugger
			var oView = this.getView();
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId();	
			var Service = oView.getModel("Service");
			if (!Service) {
				Service = new sap.ui.model.json.JSONModel();
				oView.setModel(Service, "Service");
			}
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
			var sPathService = "/F4RetreadReasonSet";
			var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			var oParamsService = {};
			oParamsService.context = "";
			oParamsService.urlParameters = "";
			oParamsService.success = function(oData, oResponse) { // success handler
				Service.setData(oData.results);
			};
			oParamsService.error = function(oError) { // error handler 		
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);
			frameworkODataModel.read(sPathService, oParamsService);
			frameworkODataModel.attachRequestCompleted(function() {
			});
		 
		 },
	
		 
	OnOK:function(){
		debugger
		var that = this;
		var casing = sap.ui.getCore().byId("RB2-1").getSelected();
		if(casing){
			
			this.getView().byId("pageTitle").setVisible(true);
			this.getView().byId("Baltpage").setVisible(false);
		//	this.getView().byId("idFleetTable1").setVisible(true);
		//	this.getView().byId("idFleetTable2").setVisible(true);
		}
		
		var balt   = sap.ui.getCore().byId("RB2-2").getSelected();
		if(balt){
			this.getView().byId("Baltpage").setVisible(true);
			this.getView().byId("pageTitle").setVisible(false);
			//this.getView().byId("idBeltTable1").setVisible(true);
			this.getView().byId("idBeltTable").setVisible(true);
		}
		
		that._FleetDialog.close();
		that._FleetDialog.destroy(); 
		that._FleetDialog=undefined;
	},
	OnCancel:function(){
		window.history.back();
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	getDealerInfo:function(){
		debugger
		var that = this;
		var oPageModel=this.getView().getModel("oPageModel");
		oPageModel.setProperty("/busy",true);
		
		var sServicePath = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var sPathSet = "CasingDealerSet(Dealer='"+ sap.ushell.Container.getService("UserInfo").getId() + "')";
		var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath);
		var oParamsCartListSet = {};
		oParamsCartListSet.success = function(oData, oResponse) {
			oPageModel.setProperty("/busy",false);
			debugger
			
			that.getView().byId("pageTitle").setTitle(oData.Name+" ("+oData.Dealer+")").addStyleClass("boldText");
			that.getView().byId("Baltpage").setTitle(oData.Name+" ("+oData.Dealer+")").addStyleClass("boldText");
			
			Dealer     = oData.Dealer;
			DealerName = oData.Name;
		
			//that.onF4Customer();
		};
		
		oParamsCartListSet.error = function(oError) {
		};
		
		frameworkODataModel.read(sPathSet, oParamsCartListSet);
		
	},

//////////////////////////////////////////////////////////////////////////////////////////////////
	onF4Customer:function(){
		debugger
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingCustomerSet?$filter=Dealer eq '"+Dealer+"' and App eq 'I'";
		that.customerModel = new sap.ui.model.json.JSONModel();
		that.customerModel.loadData(sPath, null, false,"GET",false, false, null);

		var _customerDialog = new sap.m.SelectDialog({
					title : "Select Customer",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Name}",
							customData : [ new sap.ui.core.CustomData({
								key : "key",
								value : "{Name}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter1 = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
				oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
				confirm : [ that._handleDialogClose, that ],
				cancel : [ that._handleDialogClose, that ]
		});
			_customerDialog.setModel(that.customerModel);
			_customerDialog.open();
		},

		_handleDialogClose: function(oEvent) {
			//that.getView().byId("idPhone").setValue();
			//that.getView().byId("idLocation").setValue();
			
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					Kunnr = oSelectedItem.getBindingContext().getObject().Customer;
					Type  = oSelectedItem.getBindingContext().getObject().Type;
				
					that.getView().byId("idName").setText(oSelectedItem.getBindingContext().getObject().Name);
					that.getView().byId("idPhone").setVisible(true).setText(oSelectedItem.getBindingContext().getObject().Tele);
					that.getView().byId("idAddress1").setText(oSelectedItem.getBindingContext().getObject().Add1);
					that.getView().byId("idCustomer").setValue(oSelectedItem.getBindingContext().getObject().Customer);
				
				}
				
				fleetJModel.setData([]);
				walkJModel.setData([]);
				
				if(Type == 'W')
				{
					that.getView().byId("idFleetTable1").setVisible(false);
					that.getView().byId("idFleetTable2").setVisible(false);
					that.getView().byId("idWalkTable1").setVisible(true);
					that.getView().byId("idWalkTable2").setVisible(true);
					
					that.getView().byId("lblF4GRN").setVisible(false);
					that.getView().byId("idF4GRN").setVisible(false);
					that.getView().byId("idGRNDate").setVisible(false);
				}
				else if(Type == 'F')
				{
					that.getView().byId("idFleetTable1").setVisible(true);
					that.getView().byId("idFleetTable2").setVisible(true);
					that.getView().byId("idWalkTable1").setVisible(false);
					that.getView().byId("idWalkTable2").setVisible(false);
					
					that.getView().byId("lblF4GRN").setVisible(true);
					that.getView().byId("idF4GRN").setVisible(true);
					that.getView().byId("idGRNDate").setVisible(true);
					//that.onSearch();										// Get Fleet Data
				}
				that.getView().byId("idF4GRN").setValue();
				that.getView().byId("idGRNDate").setText();
				this.getView().byId("idMasterSwitch").setState(false);
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onF4GRN:function(){
			debugger
			this.GRNModel= new sap.ui.model.json.JSONModel();

			var oData={};
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
			var sPath = "F4GetGrnSet?$filter=Dealer eq '"+Dealer+"' and HubCode eq '"+Kunnr+"' and App eq 'I'";
			var customerModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

			this.GRNDialog = new sap.m.SelectDialog({
						title : "Select GRN",
						items : {
							path : "/results",
							template : new sap.m.StandardListItem({
								title : "{Mblnr}",
								description:"{path:'Erdat',formatter:'zretreadtyrein.util.Formatter.date2'}",
								customData : [ new sap.ui.core.CustomData({
									key : "{Erdat}",
									value : "{Name}"
								})],
							}),
						},
				liveChange : function(oEvent) {
					debugger
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Mblnr",sap.ui.model.FilterOperator.Contains,sValue);
					oEvent.getSource().getBinding("items").filter([ oFilter ]);
				},
					confirm : [ that._handleGRNClose, that ],
					cancel :  [ that._handleGRNClose, that ]
			});

				oData.success=function(oData,oResponse){
					debugger
					that.GRNModel.setData(oData);
					
					that.GRNDialog.setModel(that.GRNModel);
					that.GRNDialog.open();
				};
				customerModel.read(sPath,oData);
			},

			_handleGRNClose: function(oEvent) {
				debugger
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					var Mblnr = oSelectedItem.getBindingContext().getObject().Mblnr;
				}
				that.getView().byId("idF4GRN").setValue(Mblnr);
				that.collectionDate=oSelectedItem.getBindingContext().getObject().Erdat.substr(0,10);
				that.GRNDate = oSelectedItem.getBindingContext().getObject().Erdat;
				var minDate = new Date(oSelectedItem.getBindingContext().getObject().Erdat);
				
				that.getView().byId("idCollectionDate").setMinDate(minDate);

				var date = that.collectionDate.split('-');
				that.getView().byId("idGRNDate").setText("Dispatch date from Hub : "+date[2]+"-"+date[1]+"-"+date[0]);
				
				that.onSearch(Mblnr);																// Get Fleet Data
				
				that.getView().byId("idCollectionDate").setDateValue(new Date());
			},
//////////////////////////////////////////////////////////////////////////////////////////////////
			onF4Invoice:function(){
				debugger
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4InvoiceNoSet?$filter=Dealer eq '"+Dealer+"' and DateFrom eq datetime'"+this.dateFrom+"' and DateTo eq datetime'"+this.dateTo+"'";
				that.InvoiceModel = new sap.ui.model.json.JSONModel();
				that.InvoiceModel.loadData(sPath, null, false,"GET",false, false, null);

				var _invoiceDialog = new sap.m.SelectDialog({
							title : "Select Invoice",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem({
									title : "{Vbeln}",
									customData : [ new sap.ui.core.CustomData({
										key : "{Vbeln}",
										value : "{Vbeln}"
									})],
								}),
							},
					liveChange : function(oEvent) {
						debugger
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("Vbeln",sap.ui.model.FilterOperator.Contains,sValue);
						oEvent.getSource().getBinding("items").filter([ oFilter ]);
					},
						confirm : [ that._handleInvoiceClose, that ],
						cancel :  [ that._handleInvoiceClose, that ]
				});
				_invoiceDialog.setModel(that.InvoiceModel);
				_invoiceDialog.open();
				},

				_handleInvoiceClose: function(oEvent) {
					debugger
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						this.F4Invoice = oSelectedItem.getBindingContext().getObject().Vbeln;
						that.getView().byId("idF4Invoice").setValue(oSelectedItem.getBindingContext().getObject().Vbeln);
					}
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
				onF4Tread:function(){
					debugger
					var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4TreadPatternSet?$filter=Dealer eq '"+Dealer+"' and DateFrom eq datetime'"+this.dateFrom+"' and DateTo eq datetime'"+this.dateTo+"'";

					that.TreadModel = new sap.ui.model.json.JSONModel();
					that.TreadModel.loadData(sPath, null, false,"GET",false, false, null);

					var _TreadDialog = new sap.m.SelectDialog({
								title : "Select Tread",
								items : {
									path : "/d/results",
									template : new sap.m.StandardListItem({
										title : "{Matnr}",
										description:"{Maktx}",
										customData : [ new sap.ui.core.CustomData({
											key : "{Matnr}",
											value : "{Maktx}"
										})],
									}),
								},
						liveChange : function(oEvent) {
							debugger
							var sValue = oEvent.getParameter("value");
							var oFilter = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
							var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
							var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
							oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
						},
							confirm : [ that._handleTreadClose, that ],
							cancel :  [ that._handleTreadClose, that ]
					});
					_TreadDialog.setModel(that.TreadModel);
					_TreadDialog.open();
					},

					_handleTreadClose: function(oEvent) {
						debugger
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							this.Tread = oSelectedItem.getBindingContext().getObject().Matnr;
							that.getView().byId("idF4Tread").setValue(oSelectedItem.getBindingContext().getObject().Maktx);
						}
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onSearch:function(Mblnr){
			debugger
			var that = this;
			var sServicePath = "/sap/opu/odata/sap/ZFLEET_SRV/";
			var sPathSet = "CasingCustomerSet(Dealer='"+Dealer+"',HubCode='"+Kunnr+"',Mblnr='"+Mblnr+"')?$expand=CasingCustomerItemNvg";
			var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath);
			var oParamsCartListSet = {};
			oParamsCartListSet.success = function(oData, oResponse) {
				that.newBusy.close();
				debugger
				if(Type == 'F')
					fleetJModel.setData(oData.CasingCustomerItemNvg.results);
					fleetJModel.refresh();
			};
			
			oParamsCartListSet.error = function(oError) {
				that.newBusy.close();
			};
			this.newBusy.open();
			frameworkODataModel.read(sPathSet, oParamsCartListSet);
		},
//////////////////////////////////////////////////////////////////////////////////////////////////

	onDeleteRow : function(oEvent){
		debugger
			var index = oEvent.getSource().getParent().getBindingContextPath().split('/')[1];
			{
				walkJModel.getData().splice(index,1);
				walkJModel.refresh();
			}
	},
//////////////////////////////////////////////////////////////////////////////////////////////////

	onAddRow:function(){
		debugger

		var data = [];
		data	 = walkJModel.getData();
		var tyreData = {};

				tyreData.StnclNumber 	= "";
				tyreData.TyreCompany	= "";
				tyreData.TypeCompDesc	= "";
				tyreData.ItemCode		= "";
				tyreData.Maktx 			= "";
				tyreData.ProdSize 		= "";
				tyreData.SizeDesc 		= "";
				tyreData.TyreType 		= "";
				tyreData.TypeDesc 		= "";
				tyreData.TyreLoc 		= "";
				tyreData.LocDesc 		= "";
				tyreData.Select 		= "";
				tyreData.Action 		= "";
				tyreData.Reason 		= "";
				tyreData.Status 		= "";
				tyreData.CustomerName	= "";
				tyreData.Matnr 			= "";

				data.push(tyreData);

				walkJModel.setData(data);
				walkJModel.refresh();

	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	
	onAcceptRejectAll:function(oEvent){
		debugger
		var state = oEvent.getSource().getState();
		var table = this.getView().byId("idFleetTable2");
		var length = table.getItems().length;
		for(var i=0; i<length; i++){
			table.getItems()[i].getCells()[6].setState(state);
		}
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onStencilChange:function(oEvent){
		debugger
		var row = this.getView().byId("idWalkTable2").getItems();
		var index = oEvent.getSource().getParent().sId.split('idWalkTable2-')[1];
		
		for(var i = 0 ; i < row.length ; i++){
			if( i!=index && oEvent.getSource().getValue() == row[i].getCells()[0].getValue() ){
				oEvent.getSource().setValue();
				sap.m.MessageToast.show("Stencil already entered");
			}
		}
		
	},
	
	onStencilLiveChange:function(oEvent){
		debugger
			var text = oEvent.getSource().getValue().toUpperCase();
			var code = text.charCodeAt(text.length-1);	 
			
				if ( !(code > 47 && code < 58) && !(code > 64 && code < 98) ) 
					{
					text = text.substring( 0 , text.length - 1 );
					}
			oEvent.getSource().setValue(text);	
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onTyreCompany:function(oEvent){
		debugger
		oEvent.getSource().getParent().getCells()[0].setValueState("None");
		
		if(oEvent.getSource().getParent().getCells()[0].getValue() == ""){
			oEvent.getSource().getParent().getCells()[0].setValueState("Error");
			sap.m.MessageToast.show("Please enter Stencil Number.");
			return false;
		}
		
		this.tyreCompany = oEvent.getSource().getId();
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_NonJK_Tyre_CompanySet";
		var companyModel = new sap.ui.model.json.JSONModel();
			companyModel.loadData(sPath, null, false,"GET",false, false, null);

		var _tyreCompanyDialog = new sap.m.SelectDialog({
					title : "Select Company",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Text}",
							//description:"{NonJkCompany}",
							customData : [ new sap.ui.core.CustomData({
								key : "{NonJkCompany}",
								value : "{Text}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("NonJkCompany",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter1 = new sap.ui.model.Filter("Text",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
				oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
				confirm : [ this._tyreCompanyDialogClose, this ],
				cancel  : [ this._tyreCompanyDialogClose, this ]
		});
		_tyreCompanyDialog.setModel(companyModel);
		_tyreCompanyDialog.open();
		},

		_tyreCompanyDialogClose: function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				var company = sap.ui.getCore().byId(this.tyreCompany);
				if (oSelectedItem) {
					var obj = oSelectedItem.getBindingContext().getObject();
					company.setValue(obj.Text);
					company.getParent().getCells()[1].setValue(obj.NonJkCompany);					
					company.getParent().getCells()[3].setValue("");
					company.getParent().getCells()[4].setValue("");
					company.getParent().getCells()[5].setValue("");
					company.getParent().getCells()[6].setValue("").setEnabled(true);
					company.getParent().getCells()[7].setSelectedKey("").setEnabled(true);
					company.getParent().getCells()[8].setSelectedKey("");
					company.getParent().getCells()[9].setSelectedKey("");
				}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onProdSize:function(oEvent){
			debugger
			oEvent.getSource().getParent().getCells()[2].setValueState("None");
			
			if(oEvent.getSource().getParent().getCells()[2].getValue() == ""){
				oEvent.getSource().getParent().getCells()[2].setValueState("Error");
				sap.m.MessageToast.show("Please enter Tyre Company.");
				return false;
			}
			
			this.ProdSize = oEvent.getSource().getId();
			var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ProdSizeSet";
			var sizeModel = new sap.ui.model.json.JSONModel();
				sizeModel.loadData(sPath, null, false,"GET",false, false, null);

			var _sizeDialog = new sap.m.SelectDialog({
						title : "Select Product Size",
						items : {
							path : "/d/results",
							template : new sap.m.StandardListItem({
								title : "{ProdDesc}",
							//	description:"{ProdSize}",
								customData : [ new sap.ui.core.CustomData({
									key : "{ProdSize}",
									value : "{ProdDesc}"
								})],
							}),
						},
				liveChange : function(oEvent) {
					debugger
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("ProdSize",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter1 = new sap.ui.model.Filter("ProdDesc",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
					oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
				},
					confirm : [ this._sizeDialogClose, this ],
					cancel  : [ this._sizeDialogClose, this ]
			});
			_sizeDialog.setModel(sizeModel);
			_sizeDialog.open();
	},

	_sizeDialogClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		var size = sap.ui.getCore().byId(this.ProdSize);
		if (oSelectedItem) {
			var obj = oSelectedItem.getBindingContext().getObject();
			size.setValue(obj.ProdDesc);
			size.getParent().getCells()[3].setValue(obj.ProdSize);
			
			size.getParent().getCells()[5].setValue("");
			size.getParent().getCells()[6].setValue("").setEnabled(true);
			size.getParent().getCells()[7].setSelectedKey("").setEnabled(true);
			size.getParent().getCells()[8].setSelectedKey("");
			size.getParent().getCells()[9].setSelectedKey("");
		}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onItemDesc:function(oEvent){
		debugger
		oEvent.getSource().getParent().getCells()[2].setValueState("None");
		oEvent.getSource().getParent().getCells()[4].setValueState("None");
		
		var company = oEvent.getSource().getParent().getCells()[1].getValue();
		var comdesc = oEvent.getSource().getParent().getCells()[2].getValue();
		var size 	= oEvent.getSource().getParent().getCells()[3].getValue();
		var sizedesc = oEvent.getSource().getParent().getCells()[4].getValue();
		
		if(size == ""){
			oEvent.getSource().getParent().getCells()[4].setValueState("Error");
			sap.m.MessageToast.show("Please select Tyre Size");
			return false;
		}
		if(company == ""){
			oEvent.getSource().getParent().getCells()[2].setValueState("Error");
			sap.m.MessageToast.show("Please select Tyre Company");
			return false;
		}
		
		this.itemDesc = oEvent.getSource().getId();
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4MaterialDescriptionSet?$filter=ProdSize eq '"+size+"' and TyreCompany eq '"+company+"'";
		var itemModel = new sap.ui.model.json.JSONModel();
		itemModel.loadData(sPath, null, false,"GET",false, false, null);

		var _itemDialog = new sap.m.SelectDialog({
					title : "Select Material",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Maktx}",
							description:"{Matnr}",
							customData : [ new sap.ui.core.CustomData({
								key : "{Matnr}",
								value : "{Maktx}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
				oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
				confirm : [ this._itemDialogClose, this ],
				cancel  : [ this._itemDialogClose, this ]
		});
		_itemDialog.setModel(itemModel);
		_itemDialog.open();
	},

	_itemDialogClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		var item = sap.ui.getCore().byId(this.itemDesc);
		if (oSelectedItem) {
			var obj = oSelectedItem.getBindingContext().getObject();
			item.setValue(obj.Maktx);
			item.setEnabled(false);
			item.getParent().getCells()[5].setValue(obj.Matnr);
			
			item.getParent().getCells()[7].setSelectedKey(obj.Cat);
			item.getParent().getCells()[7].setEnabled(false);
			
			item.getParent().getCells()[8].setSelectedKey("");
			item.getParent().getCells()[9].setSelectedKey("");
		}
},

onItemChange:function(oEvent){
	debugger
	
},
//////////////////////////////////////////////////////////////////////////////////////////////////

onLife:function(oEvent){
	debugger
	oEvent.getSource().getParent().getCells()[6].setValueState("None");
	oEvent.getSource().getParent().getCells()[7].setValueState("None");
	
	if( oEvent.getSource().getParent().getCells()[6].getValue() == ""){
		sap.m.MessageToast.show("Please select a Pattern.");
		oEvent.getSource().getParent().getCells()[7].setSelectedKey();
		oEvent.getSource().getParent().getCells()[6].setValueState("Error");
		return;
	}
	if( oEvent.getSource().getParent().getCells()[7].getSelectedKey() == ""){
		sap.m.MessageToast.show("Please select a Category.");
		oEvent.getSource().getParent().getCells()[8].setSelectedKey();
		oEvent.getSource().getParent().getCells()[7].setValueState("Error");
		return;
	}
	oEvent.getSource().getParent().getCells()[9].setSelectedKey();
},

onStage:function(oEvent){
	debugger
	oEvent.getSource().getParent().getCells()[8].setValueState("None");
	
	if( oEvent.getSource().getParent().getCells()[8].getSelectedKey() == ""){
		sap.m.MessageToast.show("Please select a Tyre Type.");
		oEvent.getSource().getParent().getCells()[9].setSelectedKey();
		oEvent.getSource().getParent().getCells()[8].setValueState("Error");
		return;
	}
	
},

//////////////////////////////////////////////////////////////////////////////////////////////////
onChange:function(oEvent){
	debugger
	oEvent.getSource().getParent().getCells()[7].setValueState("None");
	
	if( oEvent.getSource().getParent().getCells()[7].getSelectedKey("") == ""){
		sap.m.MessageToast.show("Please select a Life(Tyre Type).");
		oEvent.getSource().getParent().getCells()[7].setValueState("Error");
		return;
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onHome:function(){
		this.openDialog("cancel");
	},

openDialog : function(status) {
	debugger
    var labelMessage;
    if (status == 'cancel') {
      labelMessage = 'Are you sure you want to go back?';
    }

    var _that = this;
    var dialog = new sap.m.Dialog({
      title : 'Confirmation Dialog',
      type : 'Message',
      content : [ new sap.m.Label({
        text : labelMessage,
        labelFor : 'submitDialogTextarea'
      }) ],
      beginButton : new sap.m.Button({
        text : 'Yes',
        press : function() {
         if (status == 'cancel') {
            //window.history.back()
        	 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
        	 oCrossAppNavigator.toExternal({
        	                       target: { semanticObject : "#"}
        	                      });
          }
          dialog.close();
        }
      }),
      endButton : new sap.m.Button({
        text : 'No',
        press : function() {
          dialog.close();
        }
      }),
      afterClose : function() {
        dialog.destroy();
      }
    });

    dialog.open();
},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onSubmit:function(){
		debugger

		var ModelData;
		var Data     = {};
		Data.Dealer  = Dealer;
		Data.HubCode = Kunnr;
		Data.CustType = Type;
		Data.Budat = "";
		Data.Mblnr = "";
		
		Data.DateRec = this.payLoadDate(this.getView().byId("idCollectionDate").getValue());
		
		Data.CasingCustomerItemNvg = [];
		
		if(Type == 'F'){
			var oTable = this.getView().byId("idFleetTable2");
			var oItems = oTable.getItems();
			var tblLength = oItems.length;
			ModelData = fleetJModel.getData();
			var error = false;
			
			if(tblLength == 0){
				sap.m.MessageToast.show("No data for posting.");
				return false;
			}
			
			for (var i = 0; i < tblLength; i++) {
				oItems[i].getCells()[7].setValueState("None");
				delete ModelData[i].__metadata;
				if( oItems[i].getCells()[6].getState() == true){
					ModelData[i].Action = 'A';
				}else{
					ModelData[i].Action = 'R';
					if(ModelData[i].Remarks == ""){
						oItems[i].getCells()[8].setValueState("Error");
						error = true;
					}
				}
				Data.Budat=this.GRNDate;
				Data.Mblnr=this.getView().byId("idF4GRN").getValue();
				Data.CasingCustomerItemNvg.push(ModelData[i]);
			}
			if(error == true){
				sap.m.MessageToast.show("Remarks are mandatory for rejected items.");
				return false;
			}
		}
		else
		{
			var currentDate = new Date;
			Data.Budat=this.payLoadDate(currentDate);
			
			var oTable = this.getView().byId("idWalkTable2");
			var oItems = oTable.getItems();
			var tblLength = oItems.length;
			var error = false;
			ModelData = walkJModel.getData();
			
			if(tblLength == 0){
				sap.m.MessageToast.show("No data for posting.");
				return false;
			}
			
			for (var i = 0 ; i < tblLength ; i++) {
					oItems[i].getCells()[0].setValueState("None");
			}
			
			var duplicate = false;
			for (var i = 0 ; i < tblLength ; i++) {
				for(var j = i+1 ; j < tblLength ; j++){
					
					if(oItems[i].getCells()[0].getValue() == oItems[j].getCells()[0].getValue()){
						duplicate=true;
						oItems[i].getCells()[0].setValueState("Error");
						oItems[j].getCells()[0].setValueState("Error");
					}
						
				}
			}
			
			if(duplicate==true){
				sap.m.MessageToast.show("Duplicate Stencils not allowed.");
				return false;
			}
			
			for (var i = 0 ; i < tblLength ; i++) {
				delete ModelData[i].__metadata;
				
				oItems[i].getCells()[0].setValueState("None");
				oItems[i].getCells()[1].setValueState("None");
				oItems[i].getCells()[2].setValueState("None");
				oItems[i].getCells()[3].setValueState("None");
				oItems[i].getCells()[4].setValueState("None");
				oItems[i].getCells()[5].setValueState("None");
				
				if( oItems[i].getCells()[0].getValue() == ""){
					oItems[i].getCells()[0].setValueState("Error");
					error = true;
				}
				
				if( oItems[i].getCells()[2].getValue() == ""){
					oItems[i].getCells()[2].setValueState("Error");
					error = true;
				}
				
				if( oItems[i].getCells()[4].getValue() == ""){
					oItems[i].getCells()[4].setValueState("Error");
					error = true;
				}
				
				if( oItems[i].getCells()[6].getValue() == ""){
					oItems[i].getCells()[6].setValueState("Error");
					error = true;
				}else
						if(oItems[i].getCells()[5].getValue() == "" && oItems[i].getCells()[6].getValue() != ""){
							oItems[i].getCells()[5].setValue( oItems[i].getCells()[6].getValue() );
						}
				
				if( oItems[i].getCells()[7].getSelectedKey() == ""){
					oItems[i].getCells()[7].setValueState("Error");
					error = true;
				}
				
				if( oItems[i].getCells()[8].getSelectedKey() == ""){
					oItems[i].getCells()[8].setValueState("Error");
					error = true;
				}
				
				if( oItems[i].getCells()[9].getSelectedKey() == ""){
					oItems[i].getCells()[9].setValueState("Error");
					error = true;
				}
				
				if( error == false){
				Data.CasingCustomerItemNvg.push(ModelData[i]);
				}
			}
			
			if(error == true){
				sap.m.MessageToast.show("Please fill all required data.");
				return false;
			}
		}

		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
		var sPath = "CasingCustomerSet";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});
		var fncSuccess = function(oData, oResponse) //success function 
			{
			that.newBusy.close();
			if(oData.EError=="true"){
				sap.m.MessageBox.show(oData.EMessage, {
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
					}
				});
			}else{
				sap.m.MessageBox.show("Document: "+oData.Mblnr+" posted Successfully.", {
					title: "Success",
					icon:sap.m.MessageBox.Icon.SUCCESS,
					onClose:function(){
						//window.history.back();
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						oCrossAppNavigator.toExternal({
							target: { semanticObject : "#"}
						});
					}
				});
				}
			}
		var fncError = function(oError) {
			that.newBusy.close();
			var parser = new DOMParser();
			sap.m.MessageBox.show(parser, {
				title: "Error",
				icon:sap.m.MessageBox.Icon.ERROR,
			});
		}
		that.newBusy.open();
		//Create Method for final Save
		oCreateModel1.create(sPath, Data, {
			success: fncSuccess,
			error: fncError
		});

	},
//////////////////////////////////////////////////////////////////////////////////////////////////	
	
	
	onMaterial:function(){
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingCustomerSet?$filter=Dealer eq '"+Dealer+"'";
		var MaterialModel = new sap.ui.model.json.JSONModel();
			MaterialModel.loadData(sPath, null, false,"GET",false, false, null);
			var _MaterialDialog = new sap.m.SelectDialog({
					title : "Select Customer",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Name}",
							customData : [ new sap.ui.core.CustomData({
								key : "key",
								value : "{Name}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter1 = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
				oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
				confirm : [ that._handleMaterialDialogClose, that ],
				cancel : [ that._handleMaterialDialogClose, that ]
		});
			_MaterialDialog.setModel(MaterialModel);
			_MaterialDialog.open();
		},

		_handleMaterialDialogClose: function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					var Name = oSelectedItem.getBindingContext().getObject().Name;
					that.getView().byId("idMaterial").setValue(oSelectedItem.getBindingContext().getObject().Name);
				}
		},
	
/*************************************Go Button related to Balt Service table data *****************************************************/		
	    setInitialDate:function(){
	    	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
			var date = new Date(), y = date.getFullYear(), m=date.getMonth();
			this.firstDay = new Date(y,m,1);
			this.currentDate = new Date;
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
			this.dateFrom  = dateFormat.format(this.firstDay)+"T00:00:00";
			this.dateTo = dateFormat.format(this.currentDate)+"T00:00:00";
			this.currentDate = oDateFormat.format(this.currentDate);
			this.firstDay = oDateFormat.format(this.firstDay);
			
			this.getView().byId("fromDate").setValue(this.firstDay);
			this.getView().byId("toDate").setValue(this.currentDate);
			
	    },
		handledatefrom: function(oEvent){
			debugger
				
		    	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		    	var from = oEvent.getSource().getProperty("dateValue");
		    	var dateVal = oEvent.getSource().getProperty("value");
		    	if(from !== null){
		    		this.dateFrom = dateFormat.format(from)+"T00:00:00";
		    	}else{
		    	if(dateVal !== ""){
		        var dateSplit = dateVal.split("-");
		        var fromDate = dateSplit[0].trim();
		        var fromSplit = fromDate.split(".");
		        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		        this.dateFrom = fValue+"T00:00:00";
		       }else{
		        this.dateFrom = null;
		      }
		    }
		    	if( new Date(this.dateFrom) > new Date(this.dateTo) ){
					sap.m.MessageToast.show("To-Date cannot be less than From-Date");
					this.setInitialDate();
					return;
				}
			
		},
		
		handledateto: function(oEvent){
			debugger
				
		    	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		    	var from = oEvent.getSource().getProperty("dateValue");
		    	var dateVal = oEvent.getSource().getProperty("value");
		    	if(from !== null){
		    	this.dateTo = dateFormat.format(from)+"T00:00:00";
		    }else{
		    	if(dateVal !== ""){
		    	var dateSplit = dateVal.split("-");
		        var fromDate = dateSplit[0].trim();
		        var fromSplit = fromDate.split(".");
		        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		        this.dateTo = fValue+"T00:00:00";
		      }else{
		        this.dateTo = null;
		      }
		    }
		    	
		    	if( new Date(this.dateFrom) > new Date(this.dateTo) ){
					sap.m.MessageToast.show("From-Date cannot be greater than To-Date");
					this.setInitialDate();
					return;
				}
			
		},	
//////////////////////////////////////////////////////////////////////////////////////////////////
							payLoadDate: function(SDateValue) {
								debugger
								var str = "T00:00:00";
								var currentTime = new Date(SDateValue);
								var month = currentTime.getMonth() + 1;
									if(month.toString().length==1) month="0"+month;
								var day = currentTime.getDate();
									if(day.toString().length==1) day="0"+day;
								var year = currentTime.getFullYear();
								var date = year + "-" + month + "-" + day + str;
								return date;
								},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onClearFilter:function(){
			debugger
			this.F4Invoice="";
			this.Tread="";
			this.setInitialDate();
			
			this.getView().byId("idCategory").setSelectedKey();
			this.getView().byId("idF4Invoice").setValue();
			this.getView().byId("idF4Tread").setValue();
			
			BeltTyreFormData.setData();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////

			onBeltSearch:function(){
					debugger
					var check  = false;
					var user = new sap.ushell.services.UserInfo();
					var uid = user.getId();
					var Category = this.getView().byId("idCategory").getSelectedKey();
					
					if(Category==undefined)Category="";
					if(Dealer==undefined)Dealer="";
					if(this.F4Invoice==undefined)this.F4Invoice="";
					if(this.Tread==undefined)this.Tread="";
					
					if(this.dateFrom > this.dateTo){
						sap.m.MessageToast.show("From-Date cannot be greater than To-Date.");
						this.getView().byId("fromDate").setValueState("Error");
						this.getView().byId("toDate").setValueState("Error");
						return false
						}
					else{
						this.getView().byId("fromDate").setValueState("None");
						this.getView().byId("toDate").setValueState("None");
						}
					var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
					var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					oReadModel.setHeaders({
						"Content-Type" : "application/json"
					});
					var fncSuccess = function(oData, oResponse)
					{
						that.newBusy.close();
						debugger
						BeltTyreFormData.setData(oData.BeltTyreHeadToItemNvg.results);
						BeltTyreFormData.refresh();
						
					}
					var fncError = function(oError) {
						that.newBusy.close();
						jQuery.sap.log.error("read publishing group data failed");
						sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
					};
					
					var path="BeltTyreHeadSet(DateFrom=datetime'"+this.dateFrom+"',DateTo=datetime'"+this.dateTo+"',Dealer='"+Dealer+"',Vbeln='"+this.F4Invoice+"',Matnr='"+this.Tread+"',Cat='"+Category+"')?$expand=BeltTyreHeadToItemNvg";
					
					that.newBusy.open();
					oReadModel.read(path, {
						success : fncSuccess,
						error : fncError
						});
				},
				
				onSelect:function(oEvt){
					debugger
					var selected = oEvt.getSource().getSelected();
					var tbl 	 = this.getView().byId("idBeltTable");
					var length 	 = tbl.getRows().length;
					for(var i=0; i<length; i++){
						if(selected){
							tbl.getRows()[i].getCells()[0].setSelected(true);
						}else{
							tbl.getRows()[i].getCells()[0].setSelected(false);
						}
					}
					
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
				
				OnlyNumber: function(oEvent){
			        var text = oEvent.getSource().getValue();
			        
			        for(var i=0 ; i<text.length ; i++){
			        	if ( !(text.charCodeAt(i) > 47 && text.charCodeAt(i) < 58))
                        {
                        text = text.slice(0,i)+text.slice(i+1,text.length);
                        }
			        }
			        
			        var code = text.charCodeAt(text.length-1);    
			            if(text.length == 1){
			                    if ( !(code > 47 && code < 58))
			                        {
			                        text = text.substring( 0 , text.length - 1 );
			                        }
			            }
			                oEvent.getSource().setValue(text);   
			        },
			        
		onAllBeltSelect:function(oEvent){
			debugger
			var selected = oEvent.getSource().getSelected();
			var tbl = this.getView().byId("idBeltTable");
			var length = tbl.getItems().length;
			for(var i=0; i<length; i++){
				if(selected){
					tbl.getItems()[i].getCells()[0].setSelected(true);
				}else{
					tbl.getItems()[i].getCells()[0].setSelected(false);
				}
				
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onBeltSubmit:function(){
			debugger
			var oTable 		= this.getView().byId("idBeltTable");
			var oItems 		= oTable.getItems();
			var ModelData 	= BeltTyreFormData.getData();
			var tblLength 	= oItems.length;
			var Data 		= {};
			var count 		= 0;
			
			Data.Dealer 	= Dealer;
			Data.DateFrom	= this.dateFrom;
			Data.DateTo		= this.dateTo;
			Data.BeltTyreHeadToItemNvg = [];
			
			if(tblLength == 0){
				sap.m.MessageToast.show("No records for posting.");
				return false;
			}
			
			for (var i = 0; i < tblLength; i++) {
				delete ModelData[i].__metadata;
			if(oItems[i].getCells()[0].getSelected()==true || oItems[i].getCells()[0].getSelected()=='X'){
				count=count+1;
				ModelData[i].Select = 'X';
				Data.BeltTyreHeadToItemNvg.push(ModelData[i]);
			}else
				ModelData[i].Select = "";
			}
			
			if(count == 0){
				sap.m.MessageToast.show("Please select atleast one record for posting.");
				return false;
			}
			
			var numCheck=false;
			
			for (var i = 0; i < tblLength; i++) {
				oItems[i].getCells()[9].setValueState("None");
				if(ModelData[i].Select=='X' && ( ModelData[i].FkimgNo < ModelData[i].FkimgIn )){
					numCheck=true;
					oItems[i].getCells()[9].setValueState("Error");
				}; 
			}
			
			if(numCheck==true){
				sap.m.MessageToast.show("Inward Qty. cannot be more than Equivalent Qty. or equal to Zero.");
				return false;
			}
			
					that.newBusy.open();
					var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
					var sPath = "/BeltTyreHeadSet";
					var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					oCreateModel.setHeaders({
					"Content-Type": "application/atom+xml"
					});
					var fncSuccess = function(oData, oResponse) //success function 
						{
						that.newBusy.close();
							sap.m.MessageBox.show("Posted Successfully.", {
								title: "Success",
								icon:sap.m.MessageBox.Icon.SUCCESS,
								onClose:function(){
							 			 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
							        	 oCrossAppNavigator.toExternal({
							        	                       target: { semanticObject : "#"}
							        	                      });
									 //  window.location.reload();
							    	}
								});
							}
					var fncError = function(oError) {
						that.newBusy.close();
						var parser = new DOMParser();
						sap.m.MessageBox.show(parser, {
							title: "Error",
							icon:sap.m.MessageBox.Icon.ERROR,
						});
					}
				//Create Method for final Save
					
					oCreateModel.create(sPath, Data, {
					success: fncSuccess,
					error: fncError
					});
		},
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		/*********************************Filter Code *******************************************/	

				// filter sorter
		onSort:function(oEvent){
				if (!this.oSorterDialog) {
					this.oSorterDialog = sap.ui.xmlfragment("zretreadtyrein.view.Filter", this);
					this.getView().addDependent(this.oSorterDialog);
					var arr = [{
						Key: "Vbeln",
						Value: "Invoice Number"	
					},
					{
						Key: "Matnr",
						Value: "Tread Pattern"	
					}];
					var sModel = new sap.ui.model.json.JSONModel ( { oItems: arr });
					this.getView().setModel( sModel, "oSortModel");
				}
				this.oSorterDialog.open();
		},
		
				//onPressSorter
				handleViewSettingsDialogButtonPressed: function(oEvent) {
					debugger
				    if (!this.oSorterDialog) {
					this.oSorterDialog = sap.ui.xmlfragment("zretreadtyrein.view.ViewSetting", this);
					this.getView().addDependent(this.oSorterDialog);
					var arr = [{
						Key: "Vbeln",
						Value: "Invoice Number"	
					},
					{
						Key: "Matnr",
						Value: "Tread Pattern"	
					}];
					var sModel = new sap.ui.model.json.JSONModel ( { oItems: arr });
					this.getView().setModel( sModel, "oSortModel");
				    }
				    this.oSorterDialog.open();
				},

				handleSortDialogConfirm : function(oEvent) {
					debugger
				    //var oTable = this.byId("idTable");
					var oTable = this.getView();
					
						var oTable = oTable.byId("idBeltTable");
					
					var mParams    = oEvent.getParameters();
				    var oBinding   = oTable.getBinding("items");
				    var sPath;
				    var bDescending;
				    var aSorters   = [];
				    	sPath      = mParams.sortItem.getKey();
				       bDescending = mParams.sortDescending;
				        aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
				        oBinding.sort(aSorters);
				},

				
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		
	});
});
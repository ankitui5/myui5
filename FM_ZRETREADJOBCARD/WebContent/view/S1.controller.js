sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"zretreadjobcard/util/Formatter",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
	
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast,Formatte,Export,ExportTypeCSV) {
"use strict";
var that,Dealer,DealerName,Material, Customer ,Stencil ,Status,StnclNumber,DealerKunnr,Kunnr,GRN,CustomerType,Status,Mblnr,RetreadDealer,HubCode,Name;
return sap.ui.controller("zretreadjobcard.view.S1", {

			onInit : function() {
				debugger
				that = this;
				this.newBusy = new sap.m.BusyDialog();
				
				// sap.ui.core.UIComponent.getRouterFor(this).getRoute("page2").attachMatched(this._onRoute, this);
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
				var today = new Date();
				this.getView().byId("fromDate").setMaxDate(today);
				this.getView().byId("toDate").setMaxDate(today);

				var obj={
						busy:false,
						delay:0
						};
				var oPageModel=new sap.ui.model.json.JSONModel(obj);
				this.getView().setModel(oPageModel,"oPageModel");
				this.onStatus();
				Status = "L";
				this.getView().byId("IdStatus").setSelectedKey("L");
				//this.onSearch();
			},
/////////////////////////////////////////////////////////////////////////////////////////////////////////			
			onAfterRendering :function(){	
			this.getDealerInfo();
			},
//////////////////////////////////////////////////////////////////////////////////////////////////////////\
			onStatus:function(){
					debugger
					var sPath = "/sap/opu/odata/SAP/ZFLEET_SRV/F4CasingStatusSet";
					var jModel = new sap.ui.model.json.JSONModel();
				 		jModel.loadData(sPath, null, false,"GET",false, false, null);
				 	var  loc= this.getView().byId("IdStatus");
						
				 	loc.unbindAggregation("items");
					loc.setModel(jModel);
					loc.bindAggregation("items", {
							path : "/d/results",
							template : new sap.ui.core.Item({
								key : "{Status}",
								text : "{Desc}"
							})
					});
			},
						
///////////////////////////////////////////////////dealer service//////////////////////////////////////////
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
					
		//			that.getView().byId("idtitle").setTitle(oData.Name+" ("+oData.Dealer+")");
					
					Dealer     = oData.Dealer;
					DealerName = oData.Name;
					HubCode = oData.HubCode;
				};
				
				oParamsCartListSet.error = function(oError) {
				};
				
				frameworkODataModel.read(sPathSet, oParamsCartListSet);
				
			},
			
			_onRoute:function(e){
				debugger
				var that 				= this;
				var tempjsonString  	= e.getParameter("arguments").entity;
				var jsonstring 			= tempjsonString.replace(/@/g, "/");
				var tempSelectedData 	= JSON.parse(jsonstring);
				},
			
//////////////////////Material f4////////////////////////////////

				onF4GRN:function(){
					debugger
					this.GRNModel= new sap.ui.model.json.JSONModel();
			/*		if(RetreadDealer=="" || RetreadDealer==undefined){
						sap.m.MessageToast.show("Please select Retread Dealer");
						this.getView().byId("IdRetreadDealer").setValueState("Error");
						return;
					}*/
					var oData={};
					var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
					var sPath = "/F4GetGrnSet?$filter=Dealer eq '"+RetreadDealer+"' and App eq 'A'and HubCode eq ''";
					var customerModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

					this.GRNDialog = new sap.m.SelectDialog({
								title : "Select GRN",
								items : {
									path : "/results",
									template : new sap.m.StandardListItem({
										title : "{Mblnr}",
										description:"{path:'Erdat',formatter:'zretreadjobcard.util.Formatter.date1'}",
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
							var oSelectedItem = oEvent.getParameter("selectedItem");
							if (oSelectedItem) {
								Mblnr = oSelectedItem.getBindingContext().getObject().Mblnr;
							}
							that.getView().byId("IdGRN").setValue(Mblnr);
							this.getView().byId("IdStencil").setEnabled(true);
								
					},
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					onRetreadCustomerHelp:function(){
						debugger
					//	var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingCustomerSet?$filter=Dealer eq'"+Dealer+"' and App eq 'A'";
						var sPath="/sap/opu/odata/sap/ZFLEET_SRV/CasingDealerSet?$filter=HubCode eq '"+HubCode+"' and App eq 'A'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false, false, null);
						var _valueHelpRetreadCustomerDialog = new sap.m.SelectDialog({
						title: "RetreadCustomer",
						items: {
						path: "/d/results",
						template: new sap.m.StandardListItem({
							description:"{Name}",
							title: "{Dealer}",
					customData: [new sap.ui.core.CustomData({
						key: "{Dealer}",
						value: "{Name}"
						})]
						})
						}, 
						liveChange: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter1 = new sap.ui.model.Filter("Dealer", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
						oEvent.getSource().getBinding("items").filter([oFilter]);
						},
						confirm: [this._handleRetreadCustomerClose, this],
						cancel: [this._handleRetreadCustomerClose, this]
						});
						_valueHelpRetreadCustomerDialog.setModel(jModel);
						_valueHelpRetreadCustomerDialog.open();
						},
						
						_handleRetreadCustomerClose: function(oEvent) {
						debugger
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
						this.getView().by	
						this.getView().byId("IdRetreadDealer").setValue(oSelectedItem.getDescription());
						RetreadDealer = oSelectedItem.getBindingContext().getObject().Dealer;
						Name 		  =	oSelectedItem.getBindingContext().getObject().Name
						}
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onCustomerHelp: function()
			{
			debugger
			
/*			if(RetreadDealer=="" || RetreadDealer==undefined){
				sap.m.MessageToast.show("Please select Retread Dealer");
				this.getView().byId("IdRetreadDealer").setValueState("Error");
				return;
			}*/
			
			var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingCustomerSet?$filter=Dealer eq'"+RetreadDealer+"' and App eq 'A'";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false, false, null);
			var _valueHelpCustomerDialog = new sap.m.SelectDialog({
			title: "Customer",
			items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
			title: "{Name}",
			customData: [new sap.ui.core.CustomData({
			key: "{Kunnr}",
			value: "{Name}"
			})]
			})
			}, 
			liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			confirm: [this._handleCustomerClose, this],
			cancel: [this._handleCustomerClose, this]
			});
			_valueHelpCustomerDialog.setModel(jModel);
			_valueHelpCustomerDialog.open();
			},
			
			_handleCustomerClose: function(oEvent) {
			debugger
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
			this.getView().byId("IdCustomer").setValue(oSelectedItem.getTitle());
			Customer = oSelectedItem.getBindingContext().getObject().Customer;
			//Kunnr    = oSelectedItem.getBindingContext().getObject().Kunnr;
		
			}
			},
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
			onStencilHelp:function(){
				debugger
				
/*				if(RetreadDealer=="" || RetreadDealer == undefined){
					sap.m.MessageToast.show("Please select Retread Dealer");
					this.getView().byId("IdRetreadDealer").setValueState("Error");
					return;
				}*/
				
				var user = new sap.ushell.services.UserInfo();
				var uid = user.getId()
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingStencilSet?$filter=Dealer eq '"+RetreadDealer+"' and App eq 'A' and HubCode eq ''";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false,"GET",false, false, null);
				var _valueHelpStencilSelectDialog = new sap.m.SelectDialog({
				title : "Stencil Number",
				items : {
				path : "/d/results",
				template : new sap.m.StandardListItem({
				title : "{StnclNumber}",
				customData : [ new sap.ui.core.CustomData({
				key : "{StnclNumber}",
				value : "{StnclNumber}"
				})],
				}),
				},
				liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("StnclNumber",sap.ui.model.FilterOperator.Contains,sValue);
				//  var oFilter1 = new sap.ui.model.Filter("EmpName",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter],false)
				oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
				},
				confirm : [ this._handleStencilClose, this ],
				cancel : [ this._handleStencilClose, this ]
				});
				_valueHelpStencilSelectDialog.setModel(jModel);
				_valueHelpStencilSelectDialog.open();
				},
				
				_handleStencilClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
				this.getView().byId("IdStencil").setValue(oSelectedItem.getTitle()); 	
				StnclNumber = oSelectedItem.getBindingContext().getObject().StnclNumber;
				}
				},
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					payLoadDate: function(SDateValue) {
							debugger
							var str = "T00:00:00";
							var currentTime = new Date(SDateValue);
							var month = currentTime.getMonth() + 1;
							var day = currentTime.getDate();
							var year = currentTime.getFullYear();
							var date = year + "-" + month + "-" + day + str;
							return date;
					},	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////							
			onSearch:function(){
			debugger	
			var check = false;
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId();
			var oView = this.getView();
		    var CasingJModelData = oView.getModel("CasingJModelData");
				if (!CasingJModelData) {
					CasingJModelData = new sap.ui.model.json.JSONModel();
					oView.setModel(CasingJModelData, "CasingJModelData");
				}
			GRN = this.getView().byId("IdGRN").getValue();
			//Customer = this.getView().byId("IdCustomer").getValue();
			Stencil  = this.getView().byId("IdStencil").getValue();
			Status   = this.getView().byId("IdStatus").getSelectedKey();
			CustomerType = this.getView().byId("IdCustomerType").getSelectedKey();
			if(Material == undefined){
			Material = "";
			}
			if(Customer == undefined){
				Customer = "";
				}
			if(RetreadDealer == undefined){
				RetreadDealer = "";
				}
			if(Stencil == undefined){
				Stencil = "";
				}
			if(Status == undefined){
				Status = "";
				}
			if(CustomerType == undefined){
				CustomerType = "";
				}			
		
/*			if(RetreadDealer == "" || RetreadDealer == undefined){
				this.getView().byId("IdRetreadDealer").setValueState("Error");
				sap.m.MessageToast.show("Please select Retread Dealer");
				return;
			}else{
				this.getView().byId("IdRetreadDealer").setValueState("None");
			}*/
		
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
			
			that.newBusy.open();
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
			var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
			"Content-Type" : "application/json"
			});
			var fncSuccess = function(oData, oResponse)
			{
				that.newBusy.close();
			debugger
			CasingJModelData.setData(oData.results);
			CasingJModelData.refresh();
			
			}
			var fncError = function(oError) {
				that.newBusy.close();
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
						
			if(this.dateFrom){
			var path = "CasingReportSet?$filter=Mblnr eq '"+GRN+"' and Customer eq '"+Customer+"' and Status eq '"+Status+"' and StnclNumber eq '"+Stencil+"' and Dealer eq '"+RetreadDealer+"' and DateFrom  eq datetime'"+this.dateFrom+"' and DateTo  eq datetime'"+this.dateTo+"' and CType eq '"+CustomerType+"'";
			}else{
			var path = "CasingReportSet?$?$filter=Mblnr eq '"+GRN+"' and Dealer eq '"+RetreadDealer+"' and Customer eq '"+Customer+"' and StnclNumber eq '"+Stencil+"' and Status eq '"+Status+"' and DateFrom eq "+null+'  and DateTo eq '+null+" and CType eq '"+CustomerType+"'";
			}          
			/*if(this.dateFrom){
				var path = "CasingReportSet?$filter=Mblnr eq '"+GRN+"' and Customer eq '"+Customer+"' and RetreadDealer eq '"+RetreadDealer+"' and Status eq '"+Status+"' and StnclNumber eq '"+Stencil+"' and Dealer eq '"+Dealer+"' and DateFrom  eq datetime'"+this.dateFrom+"' and DateTo  eq datetime'"+this.dateTo+"' and CType eq '"+CustomerType+"'";
				}else{
				var path = "CasingReportSet?$?$filter=Mblnr eq '"+GRN+"' and Dealer eq '"+Dealer+"' and Customer eq '"+Customer+"' and RetreadDealer eq '"+RetreadDealer+"' and StnclNumber eq '"+Stencil+"' and Status eq '"+Status+"' and DateFrom eq "+null+'  and DateTo eq '+null+" and CType eq '"+CustomerType+"'";
				}*/

			oReadModel.read(path, {
			success : fncSuccess,
			error : fncError
			});
				},
/////////////////////////////////////////////////////////////////////////////////////////////////////////
				onClear : function(oEvent){
			    	debugger
			    	var tableid = this.getView().byId("idRetreadTyreOut1");
					var CasingJModelData = tableid.getModel("CasingJModelData");
					CasingJModelData.setData([]);
					CasingJModelData.refresh();
					RetreadDealer = "";
					GRN				="";
					Customer		=  "";
					Stencil			="";
					CustomerType ="";
					this.getView().byId("IdCustomer").setValue("").setValueState("None");;
					this.getView().byId("IdRetreadDealer").setValue("").setValueState("None");
					this.getView().byId("IdGRN").setValue("").setValueState("None");;
					this.getView().byId("IdStencil").setValue("").setValueState("None");;
					this.getView().byId("IdCustomerType").setSelectedKey();
					this.getView().byId("IdStatus").setSelectedKey();
					sap.m.MessageToast.show("Data Removed");
					
					this.setInitialDate();
			    },
				
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		onDownload : sap.m.Table.prototype.exportData || function(oEvent) {
			debugger
		
			if(this.getView().getModel("CasingJModelData").getData().length<1){
				sap.m.MessageToast("No Data Available");
				return false;
			}
			
			var oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV({
			separatorChar: "\t",
			mimeType: "application/vnd.ms-excel",
			charset: "utf-8",
			fileExtension: "xls"
			}),
			models : this.getView().getModel("CasingJModelData"),
				rows : {
				path : "/",
			},
					
			columns: [
						{
							name: "Dealer",
							template: {
							content: "{Dealer}"
							},
							},
						{
							name: "Dealer Name",
							template: {
							content: "{DealName}"
							},
							},
						{
							name: "Customer",
							template: {
							content: "{Customer}"
							},
							},
						{
							name: "Customer Name",
							template: {
							content: "{CustomerName}"
							},
							},
						{
							name: "Customer Type",
							template: {
							content: "{path:'CType',formatter:'zretreadjobcard.util.Formatter.customerType'}"
							},
							},
						{
							name: "Goods Receipt Number",
							template: {
							content: "{Mblnr}"
							},
							},
						{
							name: "GRN Date",
							template: {
							content: "{Budat}"
							},
							},
						{
							name: "Stencil No",
							template: {
							content: "{StnclNumber}"
							},
							},
						{
							name: "Tyre Company",
							template: {
							content: "{TyreCompany}"
							},
							},
						{
							name: "Tyre Company Description",
							template: {
							content: "{TypeCompDesc}"
							},
							},
						{
							name: "Tyre Size",
							template: {
							content: "{ProdSize}"
							},
							},
						{
							name: "Tyre Size Description",
							template: {
							content: "{SizeDesc}"
							},
							},
						{
							name: "Pattern",
							template: {
							content: "{ItemCode}"
							},
							},
						{
							name: "Pattern Description",
							template: {
							content: "{Maktx}"
							},
							},
						{
							name: "Patch1",
							template: {
							content: "{Patch1}"
							},
							},
						{
							name: "Patch2",
							template: {
							content: "{Patch2}" 
							},
							},	
						{
							name: "Patch3",
							template: {
							content: "{Patch3}"
							},
							},		
						{
							name: "Patch4",
							template: {
							content: "{Patch4}"
							},
							},
						{
							name: "Tyre Type",
							template: {
							content: "{TyreType}"
							},
							},
						{
							name: "Tyre Type Description",
							template: {
							content: "{TypeDesc}"
							},
							},
						{
							name: "Tyre Location",
							template: {
							content: "{TyreLoc}"
							},
							},
						{
							name: "Tyre Location Description",
							template: {
							content: "{LocDesc}"
							},
							},
						{
							name: "Tread Pattern",
							template: {
							content: "{Matnr}"
							},
							},
						{
							name: "Tread Pattern Desc",
							template: {
							content: "{TMaktx}"
							},
							},							
						{
							name: "Repair Status",
							template: {
							content: "{path:'JobStatus',formatter:'zretreadjobcard.util.Formatter.repairStatusText'}"
							},
							},
						{
							name: "Repaired Date",
							template: { 
							content: "{RepDate}"
							},
							},
						{
							name: "Dispatched Date",
							template: {
							content: "{DisDate}" 
							},
							},								
						{
							name: "Status",
							template: {
							content: "{path:'Status',formatter:'zretreadjobcard.util.Formatter.statusText'}"
							},
							},
					]
				});
					 //* download exported file
					 oExport.saveFile().always(function() {
						this.destroy();
					});
				},	
				
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
			onBack:function(){
				var selectedData={};
				var tempjsonString = JSON.stringify(selectedData);
				var jsonstring = tempjsonString.replace(/\//g, "@");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("page1",{"entity":JSON.stringify(jsonstring)});
				},
				
				
				

})
});
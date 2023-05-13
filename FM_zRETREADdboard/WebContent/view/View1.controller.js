
sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"sap/suite/ui/commons/ChartContainerContent",

	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset"
	
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast,FeedItem,FlattenedDataset) {
"use strict";
var that, Dealer, DealerName, Material, Category, Customer, Status, CustType;
return sap.ui.controller("zretreaddboard.view.View1", {

			onInit : function() {
				debugger
				that = this;
				this.newBusy = new sap.m.BusyDialog();
				
				Material = "";
				Customer = "";
				CustType = "";
				this.OnStatus();
				sap.ui.core.UIComponent.getRouterFor(this).getRoute("page1").attachMatched(this._onRoute, this);
				//set initial date in input field
				var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
				var date = new Date(), y = date.getFullYear(), m=date.getMonth();
				this.firstDay = new Date(y,m,1);
				this.currentDate = new Date;
				var dateFormat  = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
				this.dateFrom   = dateFormat.format(this.firstDay)+"T00:00:00";
				this.dateTo     = dateFormat.format(this.currentDate)+"T00:00:00";
				
				this.dateFromTread   = dateFormat.format(this.firstDay)+"T00:00:00";
				this.dateToTread     = dateFormat.format(this.currentDate)+"T00:00:00";
				
				this.currentDate= oDateFormat.format(this.currentDate);
				this.firstDay   = oDateFormat.format(this.firstDay);
				
				var initialDateValue = this.firstDay + " - " + this.currentDate;
				
				this.getView().byId("idFromDate1").setValue(this.firstDay);
				this.getView().byId("idToDate1").setValue(this.currentDate);
				
				this.getView().byId("idFromDate").setValue(this.firstDay);
				this.getView().byId("idToDate").setValue(this.currentDate);
				
				//set maximum date in input field
				var oDatePicker = this.getView().byId("idFromDate1");
					oDatePicker.addEventDelegate({
					onAfterRendering: function(){
						var oDateInner = this.$().find('.sapMInputBaseInner');
						var oID = oDateInner[0].id;
						$('#'+oID).attr("disabled", "disabled"); 
					}
				},
					oDatePicker
				);
				var oDatePicker1 = this.getView().byId("idToDate1");
				oDatePicker1.addEventDelegate({
					onAfterRendering: function(){
						var oDateInner = this.$().find('.sapMInputBaseInner');
						var oID = oDateInner[0].id;
						$('#'+oID).attr("disabled", "disabled");
					}
				},
					oDatePicker1
				);
				//set maximum date in input field
				var oDatePicker = this.getView().byId("idFromDate");
					oDatePicker.addEventDelegate({
					onAfterRendering: function(){
						var oDateInner = this.$().find('.sapMInputBaseInner');
						var oID = oDateInner[0].id;
						$('#'+oID).attr("disabled", "disabled"); 
					}
				},
					oDatePicker
				);
				var oDatePicker1 = this.getView().byId("idToDate");
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
				this.getView().byId("idFromDate").setMaxDate(today);
				this.getView().byId("idToDate").setMaxDate(today);
				this.getView().byId("idFromDate1").setMaxDate(today);
				this.getView().byId("idToDate1").setMaxDate(today);
				
				var obj={
						busy:false,
						delay:0
						};
				var oPageModel=new sap.ui.model.json.JSONModel(obj);
				this.getView().setModel(oPageModel,"oPageModel");
				that.getDealerInfo();
			},
			
			_onRoute : function(e){
				debugger;
			
			},
			
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
					
					that.getView().byId("idtitle").setTitle(oData.Name+" ("+oData.Dealer+") ");
					
					Dealer     = oData.Dealer;
					DealerName = oData.Name;
					
					that.onBeltSearch();
					that.onCasingSearch();
				
				};
				
				oParamsCartListSet.error = function(oError) {
				};
				
				frameworkODataModel.read(sPathSet, oParamsCartListSet);
				
			},

//////////////////////Material f4////////////////////////////////
			onMaterialHelp:function(){
				debugger
				var category = this.getView().byId("idRepairCategory").getSelectedKey();
				
				var that = this;
				
				var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4BeltMaterialSet?$filter=Dealer eq '"+Dealer+"' and ProdSize eq '' and Cat eq '"+category+"'";
				var MaterialjModel = new sap.ui.model.json.JSONModel();
					MaterialjModel.loadData(sPath, null, false,"GET",false, false, null);
					var _MaterialDialog = new sap.m.SelectDialog({
							title : "Select Tread Pattern",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem({
									title : "{Maktx}",
									description: "{Matnr}",
									customData : [ new sap.ui.core.CustomData({
										key : "key",
										value : "{Maktx}"
									})],
								}),
							},
					liveChange : function(oEvent) {
						debugger
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter1 = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
						oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
					},
						confirm : [ that._handleMaterialDialogClose, that ],
						cancel : [ that._handleMaterialDialogClose, that ]
				});
					_MaterialDialog.setModel(MaterialjModel);
					_MaterialDialog.open();
				},

				_handleMaterialDialogClose: function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							var obj = oSelectedItem.getBindingContext().getObject();
							Material = obj.Matnr;
							this.getView().byId("IdMaterial").setValue(oSelectedItem.getTitle());
							
						}
						//this.onBeltSearch();
				},
			
				onClearFilter:function(){
					debugger
					Material = "";
					Customer = "";
					CustType = "";
					this.getView().byId("idRepairCategory").setSelectedKey("");
					this.getView().byId("IdCustType").setSelectedKey("");
					this.getView().byId("IdStatus").setSelectedKey("");
					this.getView().byId("IdCustomer").setValue("");
					this.getView().byId("IdMaterial").setValue("");
					
					this.setInitialDate();
					this.setTreadInitialDate()
					
					this.onBeltSearch();
					this.onCasingSearch();
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
					
					this.getView().byId("idFromDate1").setValue(this.firstDay);
					this.getView().byId("idToDate1").setValue(this.currentDate);
					
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
				    	
				    	if(new Date(this.dateFrom) > new Date(this.dateTo)){
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
				    	
				    	if(new Date(this.dateFrom) > new Date(this.dateTo)){
							sap.m.MessageToast.show("From-Date cannot be greater than To-Date");
							this.setInitialDate();
							return;
						}
				},	
//////////////////////////////////////////////////////////////////////////////////////////////////
				setTreadInitialDate:function(){
			    	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
					var date = new Date(), y = date.getFullYear(), m=date.getMonth();
					this.firstDay = new Date(y,m,1);
					this.currentDate = new Date;
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
					this.dateFromTread  = dateFormat.format(this.firstDay)+"T00:00:00";
					this.dateToTread = dateFormat.format(this.currentDate)+"T00:00:00";
					this.currentDate = oDateFormat.format(this.currentDate);
					this.firstDay = oDateFormat.format(this.firstDay);
					
					this.getView().byId("idFromDate").setValue(this.firstDay);
					this.getView().byId("idToDate").setValue(this.currentDate);
					
			    },
				handletreaddatefrom: function(oEvent){
					debugger
						
				    	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
				    	var from = oEvent.getSource().getProperty("dateValue");
				    	var dateVal = oEvent.getSource().getProperty("value");
				    	if(from !== null){
				    		this.dateFromTread = dateFormat.format(from)+"T00:00:00";
				    	}else{
				    	if(dateVal !== ""){
				        var dateSplit = dateVal.split("-");
				        var fromDate = dateSplit[0].trim();
				        var fromSplit = fromDate.split(".");
				        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
				        this.dateFromTread = fValue+"T00:00:00";
				       }else{
				        this.dateFromTread = null;
				      }
				    }
				    	
				    	if(new Date(this.dateFromTread) > new Date(this.dateToTread)){
							sap.m.MessageToast.show("To-Date cannot be less than From-Date");
							this.setTreadInitialDate();
							return;
						}
					
				},
				
				handletreaddateto: function(oEvent){
					debugger
						
					
				    	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
				    	var from = oEvent.getSource().getProperty("dateValue");
				    	var dateVal = oEvent.getSource().getProperty("value");
				    	if(from !== null){
				    	this.dateToTread = dateFormat.format(from)+"T00:00:00";
				    }else{
				    	if(dateVal !== ""){
				    	var dateSplit = dateVal.split("-");
				        var fromDate = dateSplit[0].trim();
				        var fromSplit = fromDate.split(".");
				        var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
				        this.dateToTread = fValue+"T00:00:00";
				      }else{
				        this.dateToTread = null;
				      }
				    }
				    	
				    	if(new Date(this.dateFromTread) > new Date(this.dateToTread)){
							sap.m.MessageToast.show("From-Date cannot be greater than To-Date");
							this.setTreadInitialDate();
							return;
						}
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
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
								
	onBeltSearch:function(){
		debugger
		var check  = false;
		var that = this;
		var user = new sap.ushell.services.UserInfo();
		var uid = user.getId();
		var oView = this.getView();
	    var BeltTyreFormData = oView.getModel("BeltTyreFormData");
			if (!BeltTyreFormData) {
				BeltTyreFormData = new sap.ui.model.json.JSONModel();
				oView.setModel(BeltTyreFormData, "BeltTyreFormData");
			}
		
		Category = this.getView().byId("idRepairCategory").getSelectedKey();
			
		if(Material == undefined){
			Material = "";
		}
		if(Category == undefined){
			Category = "";
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
			BeltTyreFormData.setData(oData.results);
			BeltTyreFormData.refresh();
			that.FunVizProperties();
		}
		var fncError = function(oError) {
			that.newBusy.close();
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		
		var path ="BeltInventorySet?$filter=Dealer eq '"+Dealer+"' and Material eq '"+Material+"' and Cat eq '"+Category+"'";
	//var path="BeltInventorySet?$filter=Dealer eq '"+Dealer+"' and DateFrom eq datetime'"+this.dateFromTread+"' and DateTo eq datetime'"+this.dateToTread+"' and Material eq '"+Material+"'";
		oReadModel.read(path, {
			success : fncSuccess,
			error : fncError
		});
	},
		
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FunVizProperties:function(){
		debugger
		var oVizFrame = this.getView().byId("oVizFrame1");
			var vizProperties = {
				interaction: {
					zoom: {
					enablement: "disabled"
					},
					
					selectability: {
						mode: "single"
					}
				},
				
				tooltip :{
					visible:true//false
				},
				
				valueAxis: {
					title: {
						visible:true,// false // Hide title from Y-Axis
						text : "Tread Pattern"
					},
					visible: true,
					axisLine: {
						visible: true//false // Hide line from Y-Axis
						},
						
					label: {
						linesOfWrap: 2,
						visible: true ,//false, //Hide Measurement line 
						style: {
							fontSize: "10px"	
						}
					}
				},
				
				categoryAxis: {
					title: {
						visible:true,// false // Hide title from x-Axis
					},
					
					label: {
						linesOfWrap: 2,
						rotation: "fixed",
						angle: 0,
					style: {
						fontSize: "12px"
					}
					},
				    axisTick: {
						shortTickVisible: true,//false
					}
				},
				
				title: {
					text: "Tread Pattern Inventory",
					visible: true
				},
				legend: {
					visible:true // false
				},
				
				plotArea: {
					
					dataPointSize: { //Reduce dimension width
						min : 60, 
						max : 60},
						
					/*colorPalette: ["rgb(5, 170, 176)"], //Dimension Color
*/						gridline: {
							visible: false //hide background line
						},
					dataLabel: {
						visible: true, //show Measurement value on top dimension;
							style: {
								fontWeight: 'bold'
							},
						hideWhenOverlap: false 
					},
					
					seriesStyle: {
						"rules": [{
						"dataContext": {
						"Budget": '*'
						},
						"properties": {
								"dataPoint": {
								"pattern": "noFill"
								}
						}
						}]
					},
										
					/*dataPointStyleMode: "update",
						dataPointStyle: {
							"rules": [{
								"dataContext": [{
									Period: { in : ["Q1 '18", "Q2 '18"]
								},
							"Actuals": "*"
							}],
							"properties": {
								"pattern": "diagonalLightStripe"
							},
							displayName: "Forecast"
						}]
						}*/
										
				},
									
			};

			oVizFrame.setVizProperties(vizProperties);
	},

										

/******************************************************************************************/
	onCategoryChange:function(){
		this.getView().byId("IdMaterial").setValue();
	},
		
		
		
		

		
/*************************************Go Button related to Casing Service table data *****************************************************/		
				handledatefrom1: function(oEvent){
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
				},
												
				handledateto1: function(oEvent){
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
				},	
												
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
										
	onCasingSearch:function(){
		debugger
		var check  = false;
		var that = this;
		var user = new sap.ushell.services.UserInfo();
		var uid = user.getId();
		var oView = this.getView();
		var CasingFormData = oView.getModel("CasingFormData");
			if (!CasingFormData) {
				CasingFormData = new sap.ui.model.json.JSONModel();
				oView.setModel(CasingFormData, "CasingFormData");
			}

			Status	 = this.getView().byId("IdStatus").getSelectedKey();
			CustType = this.getView().byId("IdCustType").getSelectedKey();
				
				if(Customer == undefined){
					Customer = "";
				}
				if(Status == undefined){
					Status = "";
				}
				
				if(this.dateFrom > this.dateTo){
				sap.m.MessageToast.show("From-Date cannot be greater than To-Date.");
				this.getView().byId("idFromDate1").setValueState("Error");
				this.getView().byId("idToDate1").setValueState("Error");
				return false
				}else{
				this.getView().byId("idFromDate1").setValueState("None");
				this.getView().byId("idToDate1").setValueState("None");
				}
				that.newBusy.open();
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({
				"Content-Type" : "application/json"
				});
			
		var fncSuccess = function(oData, oResponse){
			that.newBusy.close();
			debugger
			CasingFormData.setData(oData.results);
			that.FunVizProperties1();
			CasingFormData.refresh();
		}
		
		var fncError = function(oError) {
			that.newBusy.close();
			debugger
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		
		var path="CasingInventorySet?$filter=Dealer eq '"+Dealer+"' and DateFrom eq datetime'"+this.dateFrom+"' and DateTo eq datetime'"+this.dateTo+"' and Customer eq '"+Customer+"' and Status eq '"+Status+"' and Type eq '"+CustType+"'";		
		
		oReadModel.read(path, {
				success : fncSuccess,
				error : fncError
		});
	},
//***********************************************************************************************************************
	onCustomerHelp:function(){
		debugger
		var that = this;
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingCustomerSet?$filter=Dealer eq '"+Dealer+"' and App eq 'A'";
		var CustomerJModel = new sap.ui.model.json.JSONModel();
			CustomerJModel.loadData(sPath, null, false,"GET",false, false, null);
		var _CustomerDialog = new sap.m.SelectDialog({
			title : "Select Customer",
			items : {
				path : "/d/results",
				template : new sap.m.StandardListItem({
					title : "{Name}",
					customData : [ new sap.ui.core.CustomData({
						key : "Key",
						value : "{Name}"
					})],
				}),
			},
			
			liveChange : function(oEvent) {
			debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Customer",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter1 = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
				var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
				oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
			
			confirm : [ that._handleCustomerDialogClose, that ],
			cancel : [ that._handleCustomerDialogClose, that ]
		});
		
		_CustomerDialog.setModel(CustomerJModel);
		_CustomerDialog.open();
	},

	_handleCustomerDialogClose: function(oEvent) {
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
			var obj = oSelectedItem.getBindingContext().getObject()
			Customer = obj.Customer;
			this.getView().byId("IdCustomer").setValue(oSelectedItem.getTitle());
			}
	},	
//***********************************************************************************************************************	
	onCustTypeHelp:function(){
	
	},	
	
//**********************************************************************************************************************
	OnStatus:function(){
		 debugger
	     var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingStatusSet";
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
				
				
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
				FunVizProperties1:function(){
					debugger
					var oVizFrame2 = this.getView().byId("oVizFrame2");
					var vizProperties2 = {
						interaction: {
							zoom: {
								enablement: "disabled"
							},
							selectability: {
								mode: "single"
							}
						},
						
						tooltip :{
							visible:false
						},
						
						valueAxis: {
							title: {
								visible: true // Hide title from Y-Axis false
							},
							visible: true,
							axisLine: {
								visible: true // Hide line from Y-Axis false
							},
							label: {
								linesOfWrap: 2,
								visible: true, //Hide Measurement line false
								style: {
									fontSize: "10px"
								}
							}
						},
						
						categoryAxis: {
							title: {
								visible: true // Hide title from x-Axis false
							},
							label: {
								linesOfWrap: 2,
								rotation: "fixed",
								angle: 0,
								style: {
									fontSize: "12px"
								}
							},
							axisTick: {
								shortTickVisible: false
							}
						},
						title: {
							text: "Casing Inventory",
							visible: true
						},
						legend: {
							visible: true, //show legend
								position : 'left'
						},
						legendGroup:{
							layout:{
								position:'top'
									}
						},
						
				plotArea: {
				
				//colorPalette: ["rgb(140, 113, 175)"], //Dimension Color
				gridline: {
					visible: true //hide background line false
				},

				dataLabel: {
					visible: true, //show Measurement value on top dimension;
					style: {
						fontWeight: 'bold'
					},
					hideWhenOverlap: true //false
				},

				seriesStyle: {
					"rules": [{
						"dataContext": {
							"Budget": '*'
						},
						"properties": {
							"dataPoint": {
								"pattern": "noFill"
							}
						}
					}]
				},

				dataPointStyleMode: "update",
				},

				};
				oVizFrame2.setVizProperties(vizProperties2);
				},
												

/*************************************Go Button related to casing Service table data *****************************************************/		
				onDetailView:function(e){
					debugger
					    	var selectedData={};
					    	var tempjsonString = JSON.stringify(selectedData);
							var jsonstring = tempjsonString.replace(/\//g, "@");
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});
				},
				

})
});
/* using some f4 in this Secondary Sale Transaction Data  Project  
*  
*  264   line No OnMobile       F4
*  310   line No OnCustName     F4
*  992   line No onVehicleType  F4
*  543   line No onChangeTransactionType (onChange function in a transaction table )
*  355   line No onMaterial     F4
*  412   line No onRegNo        F4
*  1038  line No onVehicleMake  F4
*  1086  line No onVehicleModelHelp F4
*/

      var that,gvTbl, newDate, Uname,   Mobileclick,  trnText,    trnData, Name,
		        CpNo, Mobile1, Kunnr, Customerclick,  oLength, CNameclick,
		  F4Material,   Matnr,  mode,     MatnrDesc, gbStatus, currentdate, len ,
		  onRegclick, onVehicleclick, onVehicleMakeclick, onVehicleModelclick, NewCustomerclick;
	
sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"jquery.sap.global",
	"sap/ui/Device"
	
], function(MessageBox,Controller, JSONModel) {
	"use strict";
	
sap.ui.controller("zsstrndata.view.View1", {
	
			onInit: function() 
			{
				debugger
				this.bindTransactionDataSet();
				this.bindServiceDataSet();
				gvTbl = this.getView().byId("tblDetail1");
				
				newDate = new Date();
				 var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
			            pattern : "dd.MM.yyyy"
					});
				 var date = new Date(), y = date.getFullYear(), m = date.getMonth();
					var firstDay = new Date(y, m, 1);
					var currentdate = new Date();
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
					this.toDate = dateFormat.format(currentdate)+"T00:00:00";
					currentdate =  oDateFormat.format(currentdate);
					var initialDateValue = currentdate;
					this.getView().byId("idTodayDate").setValue(initialDateValue);
					
// create a JModel					
				this.TransactionDetails=[];
					var TranDetailsJModel= new sap.ui.model.json.JSONModel();
					this.getView().byId("tblDetail1").setModel(TranDetailsJModel,"TranDetailsJModel");					
					TranDetailsJModel.setData(this.TransactionDetails);
				},
/******************************************function using ToDate************************************/
			ChangeTranDataDate : function(evt){
				debugger
				var inputdt 	= this.getView().byId("idTodayDate").getDateValue();
				var reqreldate  = inputdt.setHours(0,0,0,0);
				var TodayDt 	= newDate.setHours(0,0,0,0);
							if(reqreldate > TodayDt){
								sap.m.MessageToast.show("Transaction Date Cannot be greater Than Today Date ");
								evt.getSource().setDateValue(null);
								return
							}
							this.onSearchTransaction();
					}, 
/*******************************************Hana format*****************************************************/					
					DateNew:function(date1){
						debugger
						var month =date1.getMonth() + 1;
						var date  = date1.getDate();
						if (month.toString().length < 2) {
						month = "0" + month.toString();
						}
						if (date.toString().length < 2) {
							date = "0" + date.toString();
						}
						var formatDate = date1.getFullYear()  + '-' + month + '-' + date + "T00:00:00";
						return formatDate;
				},
/*************************************F4 Dealer information type Data***************************************/					
				onAfterRendering: function() {
					debugger
					var that = this;
					var sServiceUrl = "/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/";
					var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					oReadModel.setHeaders({"Content-Type" : "application/json"});
					var fncSuccess = function(oData, oResponse){
						debugger
							trnData = oData;
							trnText = trnData.Name;
							Kunnr   = trnData.Kunnr;
							that.getView().byId("HeaderIdTit").setText(trnText);
							that.onSearchTransaction();
					}
					var fncError = function(oError) { // error callback
						var parser = new DOMParser();
						var message = parser.parseFromString(
							oError.response.body, "text/xml")
								.getElementsByTagName("message")[0].innerHTML
						sap.m.MessageBox.show(message, {
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
						});
					}
					oReadModel.read("/F4DealerInfoSet(Uname='"+sap.ushell.Container.getService("UserInfo").getId()+"')", {
						success : fncSuccess,
						error : fncError
					});
				},
/*************************************transaction type Data***************************************/					
					 bindTransactionDataSet: function(){
						 debugger
							var oView = this.getView();
							var user = new sap.ushell.services.UserInfo();
							var uid = user.getId();	
							var Transaction = oView.getModel("Transaction");
							if (!Transaction) {
								Transaction = new sap.ui.model.json.JSONModel();
								oView.setModel(Transaction, "Transaction");
							}
							var sServiceUrl = "/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV";
							var sPathTransaction = "/F4TrnsTypeSet";
							var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
							var oParamsTransaction = {};
							oParamsTransaction.context = "";
							oParamsTransaction.urlParameters = "";
							oParamsTransaction.success = function(oData, oResponse) { // success handler
								Transaction.setData(oData.results);
							};
							oParamsTransaction.error = function(oError) { // error handler 		
								jQuery.sap.log.error("read publishing group data failed");
							}.bind(this);
							frameworkODataModel.read(sPathTransaction, oParamsTransaction);
							frameworkODataModel.attachRequestCompleted(function() {
							});
						 
						 },
/*************************************Service type Data***************************************/						 
						 
						 bindServiceDataSet: function(){
							 debugger
								var oView = this.getView();
								var user = new sap.ushell.services.UserInfo();
								var uid = user.getId();	
								var Service = oView.getModel("Service");
								if (!Service) {
									Service = new sap.ui.model.json.JSONModel();
									oView.setModel(Service, "Service");
								}
								var sServiceUrl = "/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV";
								var sPathService = "/F4ServiceSet";
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
						

/***********************************Validation********************************************/
					NumValid: function(oEvent)
					{ 
						var val = oEvent.getSource().getValue();
						if(val){
							if(isNaN(val)){
								val = val.substring(0, val.length - 1);
								oEvent.getSource().setValue(val);
							}
						}
					},
					
					NumberValid: function(oEvent){
					var val = oEvent.getSource().getValue();
					   if(val){
						 if(isNaN(val)){
						   val = val.substring(0, val.length - 1);
						   oEvent.getSource().setValue(val);						
						 }else if(val.indexOf(".")!="-1"){
						   val = val.substring(0, val.length - 1);
						   oEvent.getSource().setValue(val);
						 }
					   }
						if(val>10000){
							oEvent.getSource().setValue("");
							sap.m.MessageBox.alert(
									"Qty cannot be greater than 10000", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error"});	
					}
				},
				
				AmountValid: function(oEvent)
				{ 
					var TransactionTbl = this.getView().byId("tblDetail1");
					var Finalamt = 0.00;
					var len = TransactionTbl.getItems().length;
					for(var i=0; i<len; i++){
						Finalamt = parseInt(Finalamt) + parseInt(TransactionTbl.getItems()[i].getCells()[7].getValue());
					}
					 this.getView().byId("idamt").setText(Finalamt);
					
					 var val = oEvent.getSource().getValue();
					if(val){
						if(isNaN(val)){
							val = val.substring(0, val.length - 1);
							oEvent.getSource().setValue(val);
						}
					}
					if(val>99999){
						oEvent.getSource().setValue("");
						sap.m.MessageBox.alert(
								"Amount cannot be greater than 99999", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Error"});	
				}
					},
					
					KMSValid: function(oEvent)
					{ 
						debugger
						var val = oEvent.getSource().getValue();
						var code = val.charCodeAt(val.length-1);
						if ( !(code > 47 && code < 58) ) 
						{
							val = val.substring( 0 , val.length - 1 );
						}
						oEvent.getSource().setValue(val);
						if(val>99999){
							oEvent.getSource().setValue("");
							sap.m.MessageBox.alert(
									"Month Running (Km) cannot be greater than 99999", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error"});	
						}
			},
			
			NumCharValid: function(oEvent){
				debugger
							var text = oEvent.getSource().getValue();
							var code = text.charCodeAt(text.length-1);
							 if ( !(code > 47 && code < 58) && // numeric (0-9)					
								  !(code > 64 && code < 91) &&
								  !(code > 96 && code < 123) )  
								{
								text = text.substring( 0 , text.length - 1 );
								}			    
							 oEvent.getSource().setValue(text.toUpperCase());
					},
/*************************************************Mobile NO F4**********************************************/					
							onMobile:function(evt){
		     					debugger
		     					Mobileclick = evt.getSource();
		     					var sPath ="/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/F4CustomerMobileSet?$filter=Kunnr eq ''";
		     					var jModel = new sap.ui.model.json.JSONModel();
		     		            jModel.loadData(sPath, null, false, "GET", false, false, null);
		     		            var _valueHelpOnMobileSelectDialog = new sap.m.SelectDialog({
		     		            title : "Select Mobile No",
		     		            items : 
		     		            {
		     		            path : "/d/results",
		     		            template : new sap.m.StandardListItem({
		     		            title : "{Mobile1}",
		     		            customData : [ new sap.ui.core.CustomData({
		     		            key   : "{Key}",
		     		            value : "{Mobile1}"
		     		            }) ]
		     		            })
		     		            },
		     		            liveChange : function(oEvent) 
		     		            {
		     		            var sValue = oEvent.getParameter("value");
		     		            var oFilter = new sap.ui.model.Filter("Mobile", sap.ui.model.FilterOperator.Contains, sValue);
		     		            var oFilter1 = new sap.ui.model.Filter([oFilter],false);
		     		            oEvent.getSource().getBinding("items").filter([oFilter1]);    
		     		            },                   
		     		            confirm : [ this._handleOnMobileClose, this ],
		     		            cancel : [ this._handleOnMobileClose, this ]
		     		            });
		     		            _valueHelpOnMobileSelectDialog.setModel(jModel);
		     		            _valueHelpOnMobileSelectDialog.open();
							    },
		     							
		     					_handleOnMobileClose : function(oEvent) 
		     		     		{
		     		     		var oSelectedItem = oEvent.getParameter("selectedItem");
		     		     		if (oSelectedItem) 
		     		     		{
		     		     		
		     		     		Mobileclick.setValue(oSelectedItem.getTitle());
		     		            this.Mobile = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		     		            this.MobileNo= oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		     		     		}
		     		     		},
		     		     			
/**********************************Customer F4************************************************************/		     		     				
		     		     		onCustName:function(evt){
		     		     		debugger
		     		     		CNameclick=evt.getSource();
		     		     		var sPath="/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/F4CustomerNameSet?$filter=Kunnr eq ''";
		     		     		var jModel = new sap.ui.model.json.JSONModel();
		     		     		jModel.loadData(sPath, null, false, "GET", false, false, null);
		     		     		var _valueHelpOnCustomerSelectDialog = new sap.m.SelectDialog({
		     		     		title : "Select Customer",
		     		     		items : 
		     		     		{
		     		     		path : "/d/results",
		     		     		template : new sap.m.StandardListItem({
		     		     		title : "{Name}",
		     		     		customData : [ new sap.ui.core.CustomData({
		     		     		key : "{Key}",
		     		     		value : "{Name}"
		     		     		}) ]
		     		     		})
		     		     		},
		     		     		liveChange : function(oEvent) 
		     		     		{
		     		     		var sValue = oEvent.getParameter("value");
		     		     		var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
		     		     		var oFilter1 = new sap.ui.model.Filter([oFilter],false);
		     		     		oEvent.getSource().getBinding("items").filter([oFilter1]);    
		     		     		},                   
		     		     		confirm : [ this._handleCustomerClose, this ],
		     		     		cancel  : [ this._handleCustomerClose, this ]
		     		     		});
		     		     		_valueHelpOnCustomerSelectDialog.setModel(jModel);
		     		     		_valueHelpOnCustomerSelectDialog.open();
		     		     		},
		     		     						
		     		     		_handleCustomerClose : function(oEvent) 
		     		     		{
		     		     		var oSelectedItem = oEvent.getParameter("selectedItem");
		     		     		if (oSelectedItem) 
		     		     		{
		     		     		
		     		     		CNameclick.setValue(oSelectedItem.getTitle());
		     		     		this.Customer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		     		     		this.Customername = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		     		     		}
		     		          	},
/***********************************************************************************************************/	
		     		          	onMaterial:function(evt){
		     		     		debugger
		     		     		this.materialpath = evt.getSource();
		     					var posPath = this.materialpath.getParent().getParent().getItems().indexOf(this.materialpath.getParent());
		     		     		
		     		     		this.F4Material=evt.getSource();
		     		     		var sPath="/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/F4MaterialDescriptionSet";
		     		     		var jModel = new sap.ui.model.json.JSONModel();
		     		     		jModel.loadData(sPath, null, false, "GET", false, false, null);
		     		     		var _valueHelpOnMaterialSelectDialog = new sap.m.SelectDialog({
		     		     		title : "Select Material",
		     		     		items : 
		     		     		{
		     		     		path : "/d/results",
		     		     		template : new sap.m.StandardListItem({
		     		     		title : "{Maktx}",
		     		     		customData : [ new sap.ui.core.CustomData({
		     		     		key : "{Matnr}",
		     		     		value : "{Maktx}"
		     		     		}) ]
		     		     		})
		     		     		},
		     		     		liveChange : function(oEvent) 
		     		     		{
		     		     		var sValue = oEvent.getParameter("value");
		     		     		var oFilter = new sap.ui.model.Filter("Maktx", sap.ui.model.FilterOperator.Contains, sValue);
		     		     		var oFilter1 = new sap.ui.model.Filter([oFilter],false);
		     		     		oEvent.getSource().getBinding("items").filter([oFilter1]);    
		     		     		},                   
		     		     		confirm : [ this._handleMaterialClose, this ],
		     		     		cancel : [ this._handleMaterialClose, this ]
		     		     		});
		     		     		_valueHelpOnMaterialSelectDialog.setModel(jModel);
		     		     		_valueHelpOnMaterialSelectDialog.open();
		     		     		},
		     		     		
		     		     		_handleMaterialClose : function(oEvent) 
		     		     		{
		     		     			debugger
		     		     			var posPath = this.materialpath.getParent().getParent().getItems().indexOf(this.materialpath.getParent());
		     		     			
		     		     			var oSelectedItem = oEvent.getParameter("selectedItem");
			     		     		if (oSelectedItem) 
			     		     		{
			     		     		/*this.Material = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			     		     		this.F4Material.setValue(oSelectedItem.getTitle());
			     		     		this.Maktx = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			     		     		this.Matnr = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();*/
			     		     		
			     		     		this.materialpath.setValue(oSelectedItem.getTitle());
			    					gvTbl.getItems()[posPath].getCells()[2].setValue(oEvent.getParameter("selectedItem").getCustomData()[0].getKey());
					     	
		     		     		}
			     		     		
		     		          	},
		     		              
/********************************************Registration f4 **********************************************/	
		     		          	onRegNo:function(evt){
			     		     		debugger
			     		     		onRegclick=evt.getSource();
			     		     		var sPath="/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/F4VehicleRegNoSet";
			     		     		var jModel = new sap.ui.model.json.JSONModel();
			     		     		jModel.loadData(sPath, null, false, "GET", false, false, null);
			     		     		var _valueHelpOnRegNoSelectDialog = new sap.m.SelectDialog({
			     		     		title : "Select Registration No",
			     		     		items : 
			     		     		{
			     		     		path : "/d/results",
			     		     		template : new sap.m.StandardListItem({
			     		     		title : "{RegNo}",
			     		     		customData : [ new sap.ui.core.CustomData({
			     		     	//	key : "{Key}",
			     		     		value : "{RegNo}"
			     		     		}) ]
			     		     		})
			     		     		},
			     		     		liveChange : function(oEvent) 
			     		     		{
			     		     		var sValue = oEvent.getParameter("value");
			     		     		var oFilter = new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.Contains, sValue);
			     		     		var oFilter1 = new sap.ui.model.Filter([oFilter],false);
			     		     		oEvent.getSource().getBinding("items").filter([oFilter1]);    
			     		     		},                   
			     		     		confirm : [ this._handleRegNoClose, this ],
			     		     		cancel  : [ this._handleRegNoClose, this ]
			     		     		});
			     		     		_valueHelpOnRegNoSelectDialog.setModel(jModel);
			     		     		_valueHelpOnRegNoSelectDialog.open();
			     		     		},
			     		     						
			     		     		_handleRegNoClose : function(oEvent) 
			     		     		{
			     		     		var oSelectedItem = oEvent.getParameter("selectedItem");
			     		     		if (oSelectedItem) 
			     		     		{
			     		     		
			     		     			onRegclick.setValue(oSelectedItem.getTitle());
//			     		     		this.Customer = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
//			     		     		this.Customername = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			     		     		}
			     		          	},
		     		          	
/**********************************************************************************************************/		     		          	
							onCustomerName : function(oEvent){
								debugger
								var that = this;
								this.item = oEvent.getSource();
								Customerclick = oEvent.getSource();
								var TransListSetJModel = new sap.ui.model.json.JSONModel();
								that._EntriesHelpDialog = sap.ui.xmlfragment("zsstrndata.view.Customer",that);
								that.getView().addDependent(this._entriesHelpDialog);
								that._EntriesHelpDialog.setModel(TransListSetJModel, "TransListSetJModel");
								that._EntriesHelpDialog.open();
								trnText = trnData.Name;
								sap.ui.getCore().byId("idDealer").setText(trnText);
								},
								
							onCustomerfrgClose: function(evt){
								this._EntriesHelpDialog.close();
								this._EntriesHelpDialog.destroy(true);
								},
							
								displayRequest:function(e){
									debugger
									var that = this;
									var path = e.getSource().getBindingContext("TransListSetJModel").getPath().split('/')[1]
									var data = e.getSource().getBindingContext("TransListSetJModel").getModel().getData()[path];
									Name = data.Name;
									CpNo = data.CpNo;
									Mobile1 = data.Mobile1;
									
									Customerclick.setValue(Name);
									var posPath= this.item.getParent().getParent().getItems().indexOf(this.item.getParent());
									var table = gvTbl;
									table.getItems()[posPath].getCells()[9].setValue(CpNo);
									table.getItems()[posPath].getCells()[10].setValue(Mobile1);
									
//									for(var i=0; i<table.getItems().length; i++){
//										var TransType1 = table.getItems()[i].getCells()[0].getValue();
//										if(TransType1){
//											table.getItems()[i].getCells()[1].setEnabled(true);
//										}	
//									}
									that._EntriesHelpDialog.close();
									that._EntriesHelpDialog.destroy(true);
									},
									
/*********************************function for Customer table Search data *********************************************/
							onSearch : function(){
								debugger
								var check 	 	= false;
								var oView 	 	= this.getView();
								var user 	 	= new sap.ushell.services.UserInfo();
								var uid 	 	= user.getId();
								var customer 	= sap.ui.getCore().byId("idcustomer").getValue();
								var CustomerNo  = sap.ui.getCore().byId("idcustomerno").getValue();
								var Mobileno 	= sap.ui.getCore().byId("idmobileno").getValue();
								var oViewObj 	= this.getView();
								var that 		= this;
								var TransListSetJModel = this._EntriesHelpDialog.getModel("TransListSetJModel");
								var sServiceUrl = "/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/";
								var oReadModel 	= new sap.ui.model.odata.ODataModel(sServiceUrl);
								oReadModel.setHeaders({
									"Content-Type" : "application/json"
								});
								var fncSuccess = function(oData, oResponse) 									// success function
								{ 
									TransListSetJModel.setData(oData.results);
								}
								var fncError = function(oError) { 	 											// error handler
									jQuery.sap.log.error("read publishing group data failed");
									sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
								};
							var path = "F4CustomerSet?$filter=Kunnr eq '' and Name eq '"+customer+"' " + "and Mobile1 eq '"+Mobileno+"'  ";
								oReadModel.read(path, {
									  success : fncSuccess,
									   error : fncError
									   });
							},
/****************************************************************************************************************/							
							onReset : function(){
								var customer 	= sap.ui.getCore().byId("idcustomer").setValue("");
								var CustomerNo  = sap.ui.getCore().byId("idcustomerno").setValue("");
								var Mobileno 	= sap.ui.getCore().byId("idmobileno").setValue("");
								
							},		
								
/************************************************Change Drop Down Transaction Type *********************************/	
							onChangeTransactionType:function(evt){
							debugger
							that = this;
							this.materialpath = evt.getSource();
							var posPath = this.materialpath.getParent().getParent().getItems().indexOf(this.materialpath.getParent());
							var trans = gvTbl;
							var TransType = trans.getItems()[posPath].getCells()[1].getSelectedKey();
							if((TransType == "P")){
								trans.getItems()[posPath].getCells()[3].setEnabled(true);
								trans.getItems()[posPath].getCells()[4].setEnabled(false);
								trans.getItems()[posPath].getCells()[4].setSelectedKeys("");
								trans.getItems()[posPath].getCells()[5].setEnabled(true);
								trans.getItems()[posPath].getCells()[5].setValue("");
								trans.getItems()[posPath].getCells()[6].setEnabled(true);
								trans.getItems()[posPath].getCells()[7].setEnabled(true);
								trans.getItems()[posPath].getCells()[11].setVisible(true);
							} 
							else if (TransType == "T"){
								trans.getItems()[posPath].getCells()[3].setEnabled(true);
								trans.getItems()[posPath].getCells()[4].setEnabled(false);
								trans.getItems()[posPath].getCells()[4].setSelectedKeys("");
								trans.getItems()[posPath].getCells()[5].setEnabled(true);
								trans.getItems()[posPath].getCells()[5].setValue("");
								trans.getItems()[posPath].getCells()[6].setEnabled(true);
								trans.getItems()[posPath].getCells()[7].setEnabled(true);
								trans.getItems()[posPath].getCells()[11].setVisible(false);
							}
							else if(TransType == "S"){
								trans.getItems()[posPath].getCells()[3].setEnabled(false);
								trans.getItems()[posPath].getCells()[3].setValue("");
							    trans.getItems()[posPath].getCells()[4].setEnabled(true);
								trans.getItems()[posPath].getCells()[5].setEnabled(true);
								trans.getItems()[posPath].getCells()[6].setEnabled(false);
								trans.getItems()[posPath].getCells()[7].setEnabled(true);
								trans.getItems()[posPath].getCells()[11].setVisible(false);
							}
							
							},
						
						upperCase: function(evt){
						debugger
						var regno = evt.getSource().getValue();
						evt.getSource().setValue(regno.toUpperCase());
						},
						

/*********************************************Using Button Add a New Row*******************************************/
						addNewTransaction:function(){
							debugger
							var Data = {};
							var TransactionTbl  = this.getView().byId("tblDetail1");
							
							var TransactionData = TransactionTbl.getModel("TranDetailsJModel").getData();
							this.tranID = TransactionTbl.getModel("TranDetailsJModel").getData();
							var len = TransactionTbl.getItems().length;
							Data.Name		= "";
							Data.TrnsType	= "";
							Data.Maktx		= "";
							Data.Service	= "";
							Data.RegNo		= "";
							Data.Menge		= "";
							Data.Netwr		= "";
							Data.CpNo		= "";
							Data.Mobile1	= "";
							var data = TransactionTbl.getModel("TranDetailsJModel").getData();							
//							if (data.length > 0){							
//							Data.Name 		= data[data.length-1].Name;
//							Data.TrnsType	= data[data.length-1].TrnsType;
//							Data.CpNo		= data[data.length-1].CpNo;
//							Data.Mobile1	= data[data.length-1].Mobile1;
//							}
							this.tranID.push(Data);
							TransactionTbl.getModel("TranDetailsJModel").setData(this.tranID);
							TransactionTbl.getModel("TranDetailsJModel").refresh()
							var UsageFTDetailTableCount = TransactionTbl.getModel("TranDetailsJModel").getData().length;
						//	TransactionTbl.setVisibleRowCount(UsageFTDetailTableCount);
							},
/***************************************************************************************************************************/							
							onRemoveTransDetail:function(evt){
								var TransactionTbl = this.getView().byId("tblDetail1");
								var RemAmt 		   = this.getView().byId("idamt").getText();
								var amt 		   = evt.getSource().getParent().getCells()[7].getValue();
								var FinalamtRes    = RemAmt - amt;
								this.getView().byId("idamt").setText(FinalamtRes);
								var TransactionTbl = this.getView().byId("tblDetail1");
								var path = evt.getSource().getParent().oBindingContexts.TranDetailsJModel.sPath.split('/')[1];
								if (path !== -1) {
									TransactionTbl.getModel("TranDetailsJModel").getData().splice(path,1);
									TransactionTbl.getModel("TranDetailsJModel").refresh(); 
								     }
			
							},
/**************************************Add new customer ************************************************/	
			onCreateNewCustomer : function(){
			//window.open("http://jkwgdev.jkti.com:8000/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=EN#zcustomercreate-display&/page3/%220%22");
				window.open("http://jkwgdev.jkti.com:8000/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=EN#zcustomercreate-display");	
			},
/*************************************************Date Format *********************************************/											
			validateTransactionTable : function(){
			debugger
			var trantble1 = this.getView().byId("tblDetail1");		 				
			var headValid = true;
			var tranTblValid = true;
			var tblrow = trantble1.getItems();
			var tlen = tblrow.length;
								
			for(var i=0+len; i<tlen; i++){
			//for(var j=0; j<=6; j++){
			//if(j==1 ){
			if(tblrow[i].getCells()[0].getValue() == "" ){
			tblrow[i].getCells()[0].setValueState("Error");
			headValid = false;
			}else
			  tblrow[i].getCells()[0].setValueState("None");
			if(tblrow[i].getCells()[1].getSelectedKey() == "" ){
			tblrow[i].getCells()[1].setValueState("Error");
			headValid = false;
			}else
			tblrow[i].getCells()[1].setValueState("None");
			}	
			if(headValid == false)
			return false
			for(var i=0+len; i<tlen; i++){
			var key = tblrow[i].getCells()[1].getSelectedKey();
			if(key == "P" || key == "T"){
			   var c3 = tblrow[i].getCells()[3].getValue();
			   var c5 = tblrow[i].getCells()[5].getValue();
			   var c6 = tblrow[i].getCells()[6].getValue();
			   var c7 = tblrow[i].getCells()[7].getValue();
				if(c3 == ""){
					tblrow[i].getCells()[3].setValueState("Error");
					tranTblValid = false;
					}else
					tblrow[i].getCells()[3].setValueState("None");
//					tblrow[i].getCells()[4].setValueState("None");
//				    tblrow[i].getCells()[5].setValueState("None");
					if(c5 == ""){
					tblrow[i].getCells()[5].setValueState("Error");
					tranTblValid = false;
					}else
					tblrow[i].getCells()[5].setValueState("None");
//					tblrow[i].getCells()[4].setValueState("None");
//					tblrow[i].getCells()[5].setValueState("None");
					if(c6 == ""){
					tblrow[i].getCells()[6].setValueState("Error");
					tranTblValid = false;
					}else
//					tblrow[i].getCells()[4].setValueState("None");
//					tblrow[i].getCells()[5].setValueState("None");
					tblrow[i].getCells()[6].setValueState("None");
					tblrow[i].getCells()[4].setValueState("None");
											
//					if(c7 == ""){
//					tblrow[i].getCells()[7].setValueState("Error");
//					tranTblValid = false;
//					}else
//					tblrow[i].getCells()[7].setValueState("None");
//					tblrow[i].getCells()[4].setValueState("None");
//					tblrow[i].getCells()[5].setValueState("None");
					}
											
					if(key == "S"){
					var c4 = tblrow[i].getCells()[4].getSelectedItems();
					var c5 = tblrow[i].getCells()[5].getValue();
					var c7 = tblrow[i].getCells()[7].getValue();
					if(c4 == ""){
					tblrow[i].getCells()[4].setValueState("Error");
					tranTblValid = false;
					}else
					tblrow[i].getCells()[4].setValueState("None");
									
					if(c5 == ""){
					tblrow[i].getCells()[5].setValueState("Error");
					tranTblValid = false;
					}else
					tblrow[i].getCells()[5].setValueState("None");
					tblrow[i].getCells()[6].setValueState("None");
					tblrow[i].getCells()[3].setValueState("None");
					
//					if(c7 == ""){
//					tblrow[i].getCells()[7].setValueState("Error");
//					tranTblValid = false;
//					}else
//					tblrow[i].getCells()[7].setValueState("None");
//					tblrow[i].getCells()[6].setValueState("None");
//					tblrow[i].getCells()[3].setValueState("None");
//											
					}	
					//} 												
					//}
					}
					return tranTblValid;
							},
							
/***************************************************Save Data *********************************************/	
							onReview:function(){
							var	mode = "C";
							this.createpayload(mode);
							},
							
							onSubmit:function(){
							var	mode = "S";
							this.createpayload(mode);							
							},
							
							createpayload:function(mode)
							{
							debugger
							var check = this.validateTransactionTable();
							
							if(check == false){
								return false
							}
							
							//var check = true;
							var tbl = this.getView().byId("tblDetail1");
							var Date = this.DateNew(this.getView().byId("idTodayDate").getDateValue());
							var Amount = this.getView().byId("idamt").getText();
							var length = tbl.getItems().length;
							var obj = [];
							for(var i=0;i<length;i++)
							{
						
							var Name		= tbl.getItems()[i].getCells()[0].getValue();
							var TrnsType    = tbl.getItems()[i].getCells()[1].getSelectedKey();
							var Service		= tbl.getItems()[i].getCells()[4].getSelectedItems();
							var  SerKey="";
							for(var sk=0;sk<Service.length;sk++){
								SerKey += Service[sk].getKey() + "@";
							}
							var Matnr       = tbl.getItems()[i].getCells()[2].getValue();
							var Maktx       = tbl.getItems()[i].getCells()[3].getValue();
							var RegNo 		= tbl.getItems()[i].getCells()[5].getValue();
						//	var Menge	 	= parseInt(tbl.getItems()[i].getCells()[6].getValue());
							var Menge	 	= tbl.getItems()[i].getCells()[6].getValue();
							var Netwr 		= tbl.getItems()[i].getCells()[7].getValue();
							var CpNo		= tbl.getItems()[i].getCells()[9].getValue(); 
							var Mobile1		= tbl.getItems()[i].getCells()[10].getValue();
							
							
							obj.push({
							Name 	 : Name,
							TrnsType : TrnsType,
							Matnr	 : Matnr,
							Maktx	 : Maktx,
							Service  : SerKey,
							RegNo	 : RegNo,
							Menge 	 : Menge,
							CpNo 	 : CpNo,
							Mobile1	 : Mobile1,
							Netwr 	 : Netwr
							});
							}
							if(check == false){
								sap.m.MessageToast.show("Please input all data fields.");
			/*							, {
						            icon: sap.m.MessageBox.Icon.ERROR,
						            title: "ERROR",
						            actions: ["OK"],
						            onClose: function(a) {
						            	if (a == "OK") {}
						            },
						            });
			*/					
								return false;
							}
							var Data = {};
							Data.Status  = mode;
							Data.Amount  = Amount;
							Data.Kunnr   = Kunnr;
							Data.TranDt	 = Date;
							Data.TransactionDataSaveNvg = obj;
							var sServiceUrl = "/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/";
							var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
							oCreateModel1.setHeaders({
							"Content-Type": "application/atom+xml"
							});
							var fncSuccess = function(oData){
							debugger;
							if(oData.EError=="true"){
							sap.m.MessageBox.show(oData.EMessage, {
							title: "Error",
							icon:sap.m.MessageBox.Icon.ERROR,
							onClose:function(){
							}
							});	
							}
							else{
							sap.m.MessageBox.show(oData.Message, {
							title: "Success",
							icon:sap.m.MessageBox.Icon.SUCCESS,
							onClose:function(){
							window.history.back();
							}
							});
							}
							}
							var fncError = function(oError) { //error callback function
							debugger;
							var parser = new DOMParser();
							sap.m.MessageBox.show(oError, {
							title: "Error",
							icon:sap.m.MessageBox.Icon.ERROR,
							 });
							}
							oCreateModel1.create("/TransactionDataHeadSet", Data, {
							success: fncSuccess,
							error: fncError
							});
							},
							
/*******************************************Get Data *************************************************/
					onSearchTransaction:function(){
								debugger
								var that    = this;
								var oView 	= this.getView();
								var Date 	= this.DateNew(this.getView().byId("idTodayDate").getDateValue());
								var TransactionTbl = this.getView().byId("tblDetail1");
								var sServiceUrl = "/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV";
								var sPathService = "/TransactionDataHeadSet(Kunnr='"+Kunnr+"',TranDt=datetime'"+Date+"')?$expand=TransactionDataSaveNvg";
							    var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
								var oParamsService = {};
								oParamsService.context = "";
								oParamsService.urlParameters = "";
								oParamsService.success = function(oData, oResponse) { // success handler
								debugger
								 len = oData.TransactionDataSaveNvg.results.length;
								for (var i=0;i<len;i++){
								     if ( oData.TransactionDataSaveNvg.results[i].Service != ""){
								    	 var tblrow = [];
								    	 tblrow =  oData.TransactionDataSaveNvg.results[i].Service.split("@");
								    	 oData.TransactionDataSaveNvg.results[i].Service = tblrow;
								     }	
								}
								TransactionTbl.getModel("TranDetailsJModel").setData(oData.TransactionDataSaveNvg.results);
								TransactionTbl.getModel("TranDetailsJModel").refresh(); 
								that.getView().byId("idamt").setText(oData.Amount);
								var gbStatus = oData.Status;
								if(gbStatus =="S"){
									that.getView().byId("Id_bt3").setVisible(false);
									that.getView().byId("Id_bt2").setVisible(false);
									that.getView().byId("idAdd").setVisible(false);
								}
								else if(gbStatus =="C"){
									that.getView().byId("Id_bt3").setVisible(true);
									that.getView().byId("Id_bt2").setVisible(true);
									that.getView().byId("idAdd").setVisible(true);
								}else{
									that.getView().byId("Id_bt3").setVisible(true);
									that.getView().byId("Id_bt2").setVisible(true);
									that.getView().byId("idAdd").setVisible(true);
								}
								
								oLength = oData.TransactionDataSaveNvg.results.length;
								that.setEnableDisableAllFields();
								
								};
								oParamsService.error = function(oError) { // error handler 		
									jQuery.sap.log.error("read publishing group data failed");
								}.bind(this);
								frameworkODataModel.read(sPathService, oParamsService);
								frameworkODataModel.attachRequestCompleted(function() {
								});
							
							},
							
							setEnableDisableAllFields: function(){
								debugger
								var table = this.getView().byId("tblDetail1");
								var row   = table.getItems();
								for(var i=0 ; i < oLength ; i++){
									var cell = table.getItems()[i].getCells();
									for(var j=0;j<cell.length;j++){
										cell[j].setEnabled(false);
										if(j == cell.length-1)
											cell[j].setVisible(false);
									}
								}
							},
							
						
/**************************************Using Product Fragment function Open and Close********************************************/	
							onProductTransDetail : function(oEvent){
								debugger
								var that = this;
								this.item = oEvent.getSource();
								var TransListSetJModel = new sap.ui.model.json.JSONModel();
								that._ProductEntriesHelpDialog = sap.ui.xmlfragment("zsstrndata.view.Product",that);
								that.getView().addDependent(this._productentriesHelpDialog);
							//	that._EntriesHelpDialog.setModel(TransListSetJModel, "TransListSetJModel");
								that._ProductEntriesHelpDialog.open();
								},
								
								OnProductFragOk :function(){
									debugger
								var fitmenttype = sap.ui.getCore().byId("idFitTyp").getSelectedKey();
								var Stencil 	= sap.ui.getCore().byId("idStnclNo").getValue();
								var MonthKm		= sap.ui.getCore().byId("idMnthlyKms").getValue();
								var DPurchase	= sap.ui.getCore().byId("idPurchDt").getDateValue();
								this._ProductEntriesHelpDialog.close();
								this._ProductEntriesHelpDialog.destroy(true);
								},
								
								OnProductFragCancel:function(){
									this._ProductEntriesHelpDialog.close();
									this._ProductEntriesHelpDialog.destroy(true);
								},
								
								
								
/**********************************Using Create Vehicle Fragment open and Close & Submit Data this fragment ***********************************************/
								oncreatevehicle:function(){
									debugger
									var that = this;
									var VehicleListSetJModel = new sap.ui.model.json.JSONModel();
									that._VehicleHelpDialogBox = sap.ui.xmlfragment("zsstrndata.view.CreateVehicle",that);
									that.getView().addDependent(this._vehicleHelpDialogBox);
									that._VehicleHelpDialogBox.open();
								},
								
								OnVehicleSubmit :function(){
									debugger
									var that = this;
									var  a = sap.ui.getCore().byId("IdNewCustomer").getValue();
									var  b = sap.ui.getCore().byId("idVehicleType").getValue();
									var  c = sap.ui.getCore().byId("idVehicleMake").getValue();
									var  d = sap.ui.getCore().byId("idVehicleModel").getValue();
									var  e = sap.ui.getCore().byId("idRegistration").getValue();
									var  f = sap.ui.getCore().byId("idUsage").getSelectedKey();
									var  g = sap.ui.getCore().byId("idMonRunning").getValue();
									var  h = sap.ui.getCore().byId("idLADate").getDateValue();
									this._VehicleHelpDialogBox.close();
									this._VehicleHelpDialogBox.destroy(true);
								},
								
								
/**********************************Using a NewCustomer Fragment open and close and Set a data in a customer field ******************************************/								
								onNewCustomer :function(oEvent){
									debugger
									var that = this;
									//this.Customeritem = oEvent.getSource();
									this.Customerclick = oEvent.getSource();
									var TransListSetJModel = new sap.ui.model.json.JSONModel();
									this._EntriesHelpDialog = sap.ui.xmlfragment("zsstrndata.view.NewCustomer1",this);
									this.getView().addDependent(this._EntriesHelpDialog);
									this._EntriesHelpDialog.setModel(TransListSetJModel, "TransListSetJModel");
									this._EntriesHelpDialog.open();
									trnText = trnData.Name;
									sap.ui.getCore().byId("idDealer").setText(trnText);
								},
								
								displayRequest1:function(e){
									debugger
									var that = this;
									var path = e.getSource().getBindingContext("TransListSetJModel").getPath().split('/')[1]
									var data = e.getSource().getBindingContext("TransListSetJModel").getModel().getData()[path];
									Name = data.Name;
									CpNo = data.CpNo;
									Mobile1 = data.Mobile1;
									sap.ui.getCore().byId("IdNewCustomer").setValue(Name);
									that._EntriesHelpDialog.close();
									that._EntriesHelpDialog.destroy(true);
									},

/********************************************************************************************************************************/	
								OnVehicleOpen:function(){
									debugger
									this._EntriesHelpDialog.close();
									this._EntriesHelpDialog.destroy(true);
								},
								
/*************************************All  Vehicle f4 for using Create vehicle fragment *****************************************/	
									
			onVehicleType:function(evt){
				debugger
		     		onVehicleclick=evt.getSource();
		     		var sPath="/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/F4VehicleTypeSet";
		     		var jModel = new sap.ui.model.json.JSONModel();
		     		jModel.loadData(sPath, null, false, "GET", false, false, null);
		     		var _valueHelpOnCustomerSelectDialog = new sap.m.SelectDialog({
		     		title : "Vehicle Type",
		     		items : 
		     		{
		     		path : "/d/results",
		     		template : new sap.m.StandardListItem({
		     		title : "{Type}",
		     		customData : [ new sap.ui.core.CustomData({
		     		key : "{Type}",
		     		value : "{Type}"
		     		}) ]
		     		})
		     		},
		     		liveChange : function(oEvent) 
		     		{
		     		var sValue = oEvent.getParameter("value");
		     		var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue);
		     		var oFilter1 = new sap.ui.model.Filter([oFilter],false);
		     		oEvent.getSource().getBinding("items").filter([oFilter1]);    
		     		},                   
		     		confirm : [ this._handleCustomerClose, this ],
		     		cancel  : [ this._handleCustomerClose, this ]
		     		});
		     		_valueHelpOnCustomerSelectDialog.setModel(jModel);
		     		_valueHelpOnCustomerSelectDialog.open();
		     		},
		     						
		     		_handleCustomerClose : function(oEvent) 
		     		{
		     			debugger
		     		var oSelectedItem = oEvent.getParameter("selectedItem");
		     		if (oSelectedItem) 
		     		{
		     		onVehicleclick.setValue(oSelectedItem.getTitle());
		     		this.vehicle = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		     		//this.vehicletype = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
		     		}
			},
			
/************************************************************************************************************/
			onVehicleMake:function(evt){
				debugger
	     		onVehicleMakeclick=evt.getSource();
				var Type = this.vehicle;
	     		var sPath="/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/F4VehicleMakeSet?$filter=Type eq '"+Type+"'";
	     		var jModel = new sap.ui.model.json.JSONModel();
	     		jModel.loadData(sPath, null, false, "GET", false, false, null);
	     		var _valueHelpOnVehicleSelectDialog = new sap.m.SelectDialog({
	     		title : "Vehicle Make",
	     		items : 
	     		{
	     		path : "/d/results",
	     		template : new sap.m.StandardListItem({
	     		title : "{Make}",
	     		customData : [ new sap.ui.core.CustomData({
	     		key : "{Make}",
	     		value : "{Make}"
	     		}) ]
	     		})
	     		},
	     		liveChange : function(oEvent) 
	     		{
	     		var sValue = oEvent.getParameter("value");
	     		var oFilter = new sap.ui.model.Filter("Make", sap.ui.model.FilterOperator.Contains, sValue);
	     		var oFilter1 = new sap.ui.model.Filter([oFilter],false);
	     		oEvent.getSource().getBinding("items").filter([oFilter1]);    
	     		},                   
	     		confirm : [ this._handleVehicleMakeClose, this ],
	     		cancel  : [ this._handleVehicleMakeClose, this ]
	     		});
	     		_valueHelpOnVehicleSelectDialog.setModel(jModel);
	     		_valueHelpOnVehicleSelectDialog.open();
	     		},
	     						
	     		_handleVehicleMakeClose : function(oEvent) 
	     		{
	     			debugger
	     		var oSelectedItem = oEvent.getParameter("selectedItem");
	     		if (oSelectedItem) 
	     		{
	     		onVehicleMakeclick.setValue(oSelectedItem.getTitle());
	     		this.vehicleMake = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
	     	//	this.vehicleMakeType = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
	     		}

			},
			
/************************************************************************************************************/
			onVehicleModelHelp:function(evt){
				debugger
	     		onVehicleModelclick=evt.getSource();
				var Type = this.vehicle;
				var Make = this.vehicleMake;
	     		var sPath="/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV/F4VehicleModelSet?$filter= Type eq '"+Type+"' and Make eq '"+Make+"'";
	     		var jModel = new sap.ui.model.json.JSONModel();
	     		jModel.loadData(sPath, null, false, "GET", false, false, null);
	     		var _valueHelpOnVehicleModelSelectDialog = new sap.m.SelectDialog({
	     		title : "Select Model",
	     		items : 
	     		{
	     		path : "/d/results",
	     		template : new sap.m.StandardListItem({
	     		title : "{Model}",
	     		customData : [ new sap.ui.core.CustomData({
	     		key : "{Model}",
	     		//value : "{Make}"
	     		}) ]
	     		})
	     		},
	     		liveChange : function(oEvent) 
	     		{
	     		var sValue = oEvent.getParameter("value");
	     		var oFilter = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
	     		var oFilter1 = new sap.ui.model.Filter([oFilter],false);
	     		oEvent.getSource().getBinding("items").filter([oFilter1]);    
	     		},                   
	     		confirm : [ this._handleVehicleModelClose, this ],
	     		cancel  : [ this._handleVehicleModelClose, this ]
	     		});
	     		_valueHelpOnVehicleModelSelectDialog.setModel(jModel);
	     		_valueHelpOnVehicleModelSelectDialog.open();
	     		},
	     						
	     		_handleVehicleModelClose : function(oEvent) 
	     		{
	     			debugger
	     		var oSelectedItem = oEvent.getParameter("selectedItem");
	     		if (oSelectedItem) 
	     		{
	     		onVehicleModelclick.setValue(oSelectedItem.getTitle());
	     		this.vehicleModel = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
	     	//	this.vehicleModelType = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
	     		}
			},						
/************************************************************************************************************/
});

});
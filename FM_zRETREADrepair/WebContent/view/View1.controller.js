sap.ui.define([
       "sap/m/MessageBox",
       "sap/m/SelectDialog",
       "sap/m/Toolbar",
       'sap/ui/core/Fragment', 
       "sap/ui/core/mvc/Controller",
       "sap/ui/model/json/JSONModel",
       "sap/m/MessageToast",   
       "jquery.sap.global",
       "jquery.sap.script", 
   	   "sap/ui/core/util/Export",
   	   "sap/ui/core/util/ExportTypeCSV",
       "zretreadrepair/util/Formatter"
		],
function(MessageBox,Fragment,Controller, JSONModel,MessageToast,Dialog,Export,ExportTypeCSV,Formatter) {
"use strict";

var that;
var StateKey, CType, DealerName, TWKunnr, Dealer, DealerName, index, StnclNumber, Kunnr, Type, Mblnr, DateRec, DateRep;
var RetreadRepairTbl, RetreadTyreOutJModel, patchJModel, CompetitionJModel;

return sap.ui.controller("zretreadrepair.view.View1", {

	onInit: function(evt) {
		
		this.model = this.getOwnerComponent().getModel();
		this.newBusy = new sap.m.BusyDialog();
		
		that = this;
		
		patchJModel = new sap.ui.model.json.JSONModel();
		
		RetreadRepairTbl = this.getView().byId("idRetreadRepair1");
	   
		var oViewObj = this.getView();
		
		CompetitionJModel = new sap.ui.model.json.JSONModel();
		
		RetreadTyreOutJModel = oViewObj.getModel("RetreadTyreOutJModel");
		if (!RetreadTyreOutJModel) {
			RetreadTyreOutJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(RetreadTyreOutJModel, "RetreadTyreOutJModel");
		}
		
		var obj={
				busy:false,
				delay:0
				};
		
		var oPageModel=new sap.ui.model.json.JSONModel(obj);
		this.getView().setModel(oPageModel,"oPageModel");
		
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {
		}
		
		//set initial date in input field
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
		var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		this.firstDay = new Date(y,m,1);
		this.currentDate = new Date;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
		this.dateFrom  = dateFormat.format(this.firstDay)+"T00:00:00";
		this.dateTo = dateFormat.format(this.currentDate)+"T00:00:00";
		this.currentDate = oDateFormat.format(this.currentDate);
		this.firstDay = oDateFormat.format(this.firstDay);
		
		var initialDateValue = this.firstDay + " - "  + this.currentDate;
		this.getView().byId("fromDate").setValue(this.firstDay);
		this.getView().byId("toDate").setValue(this.currentDate);
	
/**********************************************************************************************************/
		var oDatePicker = this.getView().byId("fromDate");
		oDatePicker.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled"); 
			}
		},oDatePicker); 
		
		var oDatePicker1 = this.getView().byId("toDate");
		oDatePicker1.addEventDelegate({
			onAfterRendering: function(){
				var oDateInner = this.$().find('.sapMInputBaseInner');
				var oID = oDateInner[0].id;
				$('#'+oID).attr("disabled", "disabled");
			}
		},oDatePicker1);
		
	
	/*	var date = sap.ui.getCore().byId("idDateofRepair");
		date.addDelegate({
			onAfterRendering: function() {
				date.$().find('INPUT').attr('disabled', true);
			}
		}, date);
		*/
		var today = new Date();
		this.getView().byId("idTime").setText(today.toDateString());
		this.getView().byId("fromDate").setMaxDate(today);
		this.getView().byId("toDate").setMaxDate(today);
	/*	sap.ui.getCore().byId("idDateofRepair").setMaxDate(today).setDateValue(today);*/
		
		this.getDealerInfo();
		this.bindRejectReasonSet();
		this.bindRequiredReasonSet();
		this.bindCompanySet();
	},
	
	bindCompanySet: function(){
		 debugger
			var oView = this.getView();
			var user = new sap.ushell.services.UserInfo();
			var uid = user.getId();	
			CompetitionJModel = oView.getModel("CompetitionJModel");
			if (!CompetitionJModel) {
				CompetitionJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(CompetitionJModel, "CompetitionJModel");
			}
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
			var sPathService = "/F4CompetitionCompanySet";
			var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			var oParamsService = {};
			oParamsService.context = "";
			oParamsService.urlParameters = "";
			oParamsService.success = function(oData, oResponse) { // success handler
				CompetitionJModel.setData(oData.results);
			};
			oParamsService.error = function(oError) { // error handler 		
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);
			frameworkODataModel.read(sPathService, oParamsService);
			frameworkODataModel.attachRequestCompleted(function() {
			});
		
		},
/**********************************************************************************************************/
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
		that.getView().byId("pageTitle").setTitle(oData.Name+" ("+oData.Dealer+")");
		Dealer     = oData.Dealer;
		DealerName = oData.Name;
		};
		oParamsCartListSet.error = function(oError) {
		};
		frameworkODataModel.read(sPathSet, oParamsCartListSet);
	},

/*************************************All F4 Related to repair services*****************************************************/
	
	onStencilNo:function(){
		debugger
		 var user = new sap.ushell.services.UserInfo();
		 var uid = user.getId()
		 var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingStencilSet?$filter=Dealer eq '"+Dealer+"' and App eq 'R' and HubCode eq ''";
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
				this.getView().byId("idStencilNo").setValue(oSelectedItem.getTitle()); 	
				StnclNumber = oSelectedItem.getBindingContext().getObject().StnclNumber;
		}
	},

/*************************************All F4 Related to repair services*****************************************************/
		onCustomer:function(){
			 debugger
			 var user = new sap.ushell.services.UserInfo();
			 var uid = user.getId()
			 var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingCustomerSet?$filter=Dealer eq '"+Dealer+"' and App eq 'R'";
			 var jModel = new sap.ui.model.json.JSONModel();
		         jModel.loadData(sPath, null, false,"GET",false, false, null);
		     var _valueHelpCustomerSelectDialog = new sap.m.SelectDialog({
					title : "Customer",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Name}",
							customData : [ new sap.ui.core.CustomData({
								key : "{key}",
								value : "{Name}"
							})],
						}),
					},
			liveChange : function(oEvent) {
				 var sValue = oEvent.getParameter("value");
				 var oFilter = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter1 = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
					oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
				confirm : [ this._handleCustomerClose, this ],
				cancel : [ this._handleCustomerClose, this ]
			});
		     _valueHelpCustomerSelectDialog.setModel(jModel);
		     _valueHelpCustomerSelectDialog.open();
		},
		_handleCustomerClose : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
					this.getView().byId("idCustomer").setValue(oSelectedItem.getTitle()); 
					Kunnr = oSelectedItem.getBindingContext().getObject().Customer;
				    Dealer= oSelectedItem.getBindingContext().getObject().Dealer;
				    CType  = oSelectedItem.getBindingContext().getObject().Type;
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onCategoryChange:function(){
			debugger
			
			sap.ui.getCore().byId("lbpattern").setVisible(false);
			sap.ui.getCore().byId("idMatnrInput").setVisible(false);
			sap.ui.getCore().byId("idCompanySelect").setVisible(false);
			sap.ui.getCore().byId("idMatnr").setVisible(false);
			sap.ui.getCore().byId("idMaktx").setVisible(false);
			sap.ui.getCore().byId("lblTotalAvail").setVisible(false);
			sap.ui.getCore().byId("idTotalAvail").setVisible(false);
			
			sap.ui.getCore().byId("idOwner").setSelectedKey();
			sap.ui.getCore().byId("idCompanySelect").setSelectedKey();
			sap.ui.getCore().byId("idMatnrInput").setValue();
			sap.ui.getCore().byId("idMatnr").setValue();
			sap.ui.getCore().byId("idMaktx").setText();
			sap.ui.getCore().byId("idTotalAvail").setText();
			
			sap.ui.getCore().byId("idOwner").setValueState("None");
			sap.ui.getCore().byId("idCompanySelect").setValueState("None");
			sap.ui.getCore().byId("idMatnrInput").setValueState("None");
			sap.ui.getCore().byId("idMatnr").setValueState("None");
			
			patchJModel.setData();
			patchJModel.refresh();
			
			if(Type=='F'){
				sap.ui.getCore().byId("idOwner").setEnabled(false).setSelectedKey("01");
				sap.ui.getCore().byId("lbpattern").setVisible(true);
				sap.ui.getCore().byId("idMatnr").setVisible(true);
			}
		},
		
		onCompanyChange:function(){
			sap.ui.getCore().byId("lblTotalAvail").setVisible(false);
			sap.ui.getCore().byId("idTotalAvail").setVisible(false).setText();
			
			sap.ui.getCore().byId("idMatnrInput").setValue();
			sap.ui.getCore().byId("idMatnr").setValue();
			sap.ui.getCore().byId("idMaktx").setText();
		},
		
		onOwnerChange:function(oEvent){
			
			if(sap.ui.getCore().byId("idRepairCategory").getSelectedKey()=="")
			{
				sap.m.MessageToast.show("Please select Category");
				sap.ui.getCore().byId("idRepairCategory").setValueState("Error");
				sap.ui.getCore().byId("idOwner").setSelectedKey();
				sap.ui.getCore().byId("idOwner").setValueState("None");
				return
			}
			else
				sap.ui.getCore().byId("idRepairCategory").setValueState("None");			
			
			if(oEvent.getSource().getSelectedKey()=='01'){
				sap.ui.getCore().byId("lbpattern").setVisible(true);
				sap.ui.getCore().byId("idMatnrInput").setVisible(false);
				sap.ui.getCore().byId("idCompanySelect").setVisible(false);
				sap.ui.getCore().byId("idMatnr").setVisible(true);
				sap.ui.getCore().byId("idMaktx").setVisible(true);				
				sap.ui.getCore().byId("lblTotalAvail").setVisible(true);
				sap.ui.getCore().byId("idTotalAvail").setVisible(true);
			}else{
				sap.ui.getCore().byId("lbpattern").setVisible(true);
				sap.ui.getCore().byId("idMatnrInput").setVisible(true);
				sap.ui.getCore().byId("idCompanySelect").setVisible(true);
				sap.ui.getCore().byId("idMatnr").setVisible(false);
				sap.ui.getCore().byId("idMaktx").setVisible(false);				
				sap.ui.getCore().byId("lblTotalAvail").setVisible(false);
				sap.ui.getCore().byId("idTotalAvail").setVisible(false);
			}
			
			sap.ui.getCore().byId("idCompanySelect").setSelectedKey();
			sap.ui.getCore().byId("idMatnrInput").setValue();
			sap.ui.getCore().byId("idMatnr").setValue();
			sap.ui.getCore().byId("idMaktx").setText();
			sap.ui.getCore().byId("idTotalAvail").setText();
			
			patchJModel.setData();
			patchJModel.refresh();
			
		},
/*************************************All F4 Related to repair services*****************************************************/
		
		onTreadPattern:function(evt){
			debugger
			
			if(sap.ui.getCore().byId("idOwner").getSelectedKey()=="")
			{
				sap.m.MessageToast.show("Please select Owner.");
				sap.ui.getCore().byId("idOwner").setValueState("Error");
				return
			}
			else
				sap.ui.getCore().byId("idOwner").setValueState("None");
			
				this.TreadPatternpath = evt.getSource();
				var ProdSize = sap.ui.getCore().byId("idTreadSize").getText();
				var sPath="/sap/opu/odata/sap/ZFLEET_SRV/F4BeltMaterialSet?$filter=Cat eq '"+sap.ui.getCore().byId("idRepairCategory").getSelectedKey()+"' and Dealer eq '"+Dealer+"' and ProdSize eq '"+ProdSize+"'";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false, false, null);
				var _valueHelpTradeSelectDialog = new sap.m.SelectDialog({
					title : "Tread Pattern",
					items : 
					{
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{Maktx}",
							description:"{Matnr}",
							customData : [ new sap.ui.core.CustomData({
								key : "{Matnr}",
								value : "{Maktx}"
							}) ]
						})
					},
					liveChange : function(oEvent)
					{
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
						oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
					},
					confirm : [ this._handleTradeClose, this ],
					cancel : [ this._handleTradeClose, this ]
				});
				_valueHelpTradeSelectDialog.setModel(jModel);
				_valueHelpTradeSelectDialog.open();
		},
			_handleTradeClose : function(oEvent) 
				{
					debugger
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) 
					{
						var obj = oEvent.getParameter("selectedItem").getBindingContext().getObject();
						this.TreadPatternpath.setValue(obj.Matnr);
						sap.ui.getCore().byId("idMaktx").setText(obj.Maktx);
						sap.ui.getCore().byId("lblTotalAvail").setVisible(true);
						sap.ui.getCore().byId("idTotalAvail").setVisible(true).setText(obj.AvaMenge);
						
					}
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
	    		onPatch:function(evt){
	    			debugger
	    			
	    			    this.patchPath = evt.getSource();
	    			    
	    				var ProdSize = sap.ui.getCore().byId("idTreadSize").getText();
	    				var sPath="/sap/opu/odata/sap/ZFLEET_SRV/F4PatchSizeSet?$filter=Cat eq '"+sap.ui.getCore().byId("idRepairCategory").getSelectedKey()+"'";
	    	     		var jModel = new sap.ui.model.json.JSONModel();
	    	     		jModel.loadData(sPath, null, false, "GET", false, false, null);
	    	     		var _valueHelpPatchDialog = new sap.m.SelectDialog({
	    		     		title : "Patch Size",
	    		     		items : 
	    		     		{
	    			     		path : "/d/results",
	    			     		template : new sap.m.StandardListItem({
	    				     		title : "{PatchSize}",
	    				     		/*description:"{Matnr}",*/
	    				     		customData : [ new sap.ui.core.CustomData({
	    					     		key : "",
	    					     		value : "{PatchSize}"
	    				     		}) ]
	    			     		})
	    		     		},
	    		     		liveChange : function(oEvent)
	    		     		{
	    			     		var sValue = oEvent.getParameter("value");
	    			     		var oFilter = new sap.ui.model.Filter("PatchSize",sap.ui.model.FilterOperator.Contains,sValue);
	    						//var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
	    						//var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
	    						oEvent.getSource().getBinding("items").filter([ oFilter ]);
	    		     		},
	    		     		confirm : [ this._handlePatchClose, this ],
	    		     		cancel : [ this._handlePatchClose, this ]
	    	     		});
	    	     		_valueHelpPatchDialog.setModel(jModel);
	    	     		_valueHelpPatchDialog.open();
	    	     		},
	    	     		
	    	     		_handlePatchClose : function(oEvent) 
	    	     		{
	    	     			debugger
	    	     			var oSelectedItem = oEvent.getParameter("selectedItem");
	    		     		if (oSelectedItem) 
	    		     		{
	    		     			var obj = oEvent.getParameter("selectedItem").getBindingContext().getObject();
	    		     			this.patchPath.setValue(obj.PatchSize);
	    		     		}
	    		     		
	    		     		var data = patchJModel.getData();
	    	    			for(var i=0 ; i<patchJModel.getData().length ; i++){
	    	    				if(this.patchPath.sId.substr(-1) != i && patchJModel.getData()[i].Patch == obj.PatchSize){
	    	    					sap.m.MessageToast.show("Patch cannot be repeated.");
	    	    					this.patchPath.setValue("");
	    	    					return false;
	    	    				}
	    	    					
	    	    			}
	    	     		},

//////////////////////////////////////////////////////////////////////////////////////////////////
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
				if( new Date(this.dateFrom) > new Date(this.dateTo) ){
					sap.m.MessageToast.show("From-Date cannot be less than To-Date");
					this.setInitialDate();
					return;
				}
			
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
					sap.m.MessageToast.show("To-Date cannot be less than From-Date");
					this.setInitialDate();
					return;
				}
		},
		
		onF4GRN:function(){
			debugger
			this.GRNModel= new sap.ui.model.json.JSONModel();
			if(Kunnr==undefined)Kunnr="";
			
			var oData={};
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
			var sPath = "F4GetGrnSet?$filter=Dealer eq '"+Dealer+"' and HubCode eq '"+Kunnr+"' and App eq 'R'";
			var customerModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

			this.GRNDialog = new sap.m.SelectDialog({
						title : "Select GRN",
						items : {
							path : "/results",
							template : new sap.m.StandardListItem({
								title : "{Mblnr}",
								description:"{path:'Erdat',formatter:'zretreadrepair.util.Formatter.date2'}",
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
					 Mblnr = oSelectedItem.getBindingContext().getObject().Mblnr;
				}
				that.getView().byId("idF4GRN").setValue(Mblnr);
				},

		onSearch:function(){
			debugger
			    Type    = this.getView().byId("idType").getSelectedKey();
			var check   = false;
			var oView   = this.getView();
			var user	= new sap.ushell.services.UserInfo();
			var uid		= user.getId();
			StnclNumber = this.getView().byId("idStencilNo").getValue();
			
			if(StnclNumber == undefined)StnclNumber ='';
			
			if(Kunnr==undefined)Kunnr = '';
			if(Mblnr==undefined)Mblnr = '';
			
				var oViewObj = this.getView();
				var that = this;
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
				var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oReadModel.setHeaders({
					"Content-Type" : "application/json"
				});
				
				var fncSuccess = function(oData, oResponse)
				{
					that.newBusy.close();
					debugger
					RetreadTyreOutJModel.setData(oData.CasingRepairNvg.results);
					DateRec = RetreadTyreOutJModel.DateRec;
					var tbl =  oViewObj.byId("idRetreadRepair1");
					var lngth = tbl.getItems().length;
					for(var i =0 ; i<lngth; i++){
						/*if(RetreadTyreOutJModel.oData[i].Status == "E" || RetreadTyreOutJModel.oData[i].Status =="F"){
							tbl.getItems()[i].getCells()[9].setType("Accept");
						}else{
							tbl.getItems()[i].getCells()[9].setType("Reject");
						}*/
						
					//	tbl.getItems()[i].getCells()[9].setVisible(false);
					}
				}
				
				var fncError = function(oError) {
					that.newBusy.close();
					jQuery.sap.log.error("Read publishing group data failed");
					sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
				
				var path = "CasingRepairSet(Type='"+Type+"',Mblnr='"+Mblnr+"',Dealer='"+Dealer+"',StnclNumber='"+StnclNumber+"',Customer='"+Kunnr+"',DateFrom=datetime'"+this.dateFrom+"',DateTo=datetime'"+this.dateTo+"')?$expand=CasingRepairNvg"
				this.newBusy.open();
				oReadModel.read(path, {
					success : fncSuccess,
					error : fncError
				});
		},
/*************************************Go Button End*****************************************************/		
		
		onClear:function(){
			var tableid = this.getView().byId("idRetreadRepair1");
				RetreadTyreOutJModel.setData([]);
				RetreadTyreOutJModel.refresh(); 
			sap.m.MessageToast.show("Filters Removed");
			
			this.getView().byId("idStencilNo").setValue();
			this.getView().byId("idCustomer").setValue();
			this.getView().byId("idF4GRN").setValue();
			this.getView().byId("idType").setSelectedKey("A");
			Mblnr="";
			Kunnr="";
			this.setInitialDate();
			
		},
		
		onChangeRequirement:function(oEvent){
			debugger
			this.changeEvent = oEvent.getSource();
			if(oEvent.getSource().getSelectedKey()=="R"){
				that.onRetread(oEvent);
			}else if(oEvent.getSource().getSelectedKey()=="N"){
				//that.onReject(oEvent);
				sap.m.MessageBox.warning("Are you sure you want to reject this casing?", {
					actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function (sAction) {
						debugger
						if(sAction=="CANCEL"){
							that.changeEvent.setSelectedKey();
							return false;
						}
						
						index = that.changeEvent.getParent().getBindingContextPath().split("/")[1];
						that._RejectReasonDialog = sap.ui.xmlfragment("zretreadrepair.view.RejectReason",that);
						that.getView().addDependent(that._RejectReasonDialog);
						that._RejectReasonDialog.open();
						
						that._RejectReasonDialog.setEscapeHandler(function(o){ 
							o.reject(); 
						}); 
					}
				});
				
				
			}
		},

		onReject:function(oEvent){
			debugger
		
			var Reason = sap.ui.getCore().byId("idReasonSelect").getSelectedKey();
			if(Reason == ""){
				sap.ui.getCore().byId("idReasonSelect").setValueState("Error");
				sap.m.MessageToast.show("Please select the reason for rejection.");
				return true;
			}else{
				sap.ui.getCore().byId("idReasonSelect").setValueState("None");
			}
			
			var remarks = sap.ui.getCore().byId("idReason").getValue();
			
			RetreadTyreOutJModel.getData()[index].Matnr	= "";
			RetreadTyreOutJModel.getData()[index].Reason	= Reason;
			RetreadTyreOutJModel.getData()[index].Remarks 	= remarks;
			RetreadTyreOutJModel.getData()[index].Action 	= "N";
			
			var oTable 		 = this.getView().byId("idRetreadRepair1");
			var oItems 		 = oTable.getItems();
			var tblLength 	 = oItems.length;
			var ModelData 	 = RetreadTyreOutJModel.getData();
			var Data 		 = {};
			Data.Dealer  	 = Dealer;
			Data.Customer    = Kunnr;
			Data.StnclNumber = StnclNumber;
			Data.Customer	 = Kunnr;
			Data.Mblnr		 = Mblnr;
			Data.Type		 = Type;
			Data.DateFrom    = this.dateFrom;
			Data.DateTo      = this.dateTo;
			
			Data.CasingRepairNvg = [];
			
			Data.CasingRepairNvg.push(ModelData[index]);
			delete Data.CasingRepairNvg[0].__metadata;
			
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
			var sPath = "/CasingRepairSet";
			var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel.setHeaders({
				"Content-Type": "application/atom+xml"
			});
			var fncSuccess = function(oData, oResponse) //success function 
			{
			that.newBusy.close();
			if(oData.EError=="true"){
				oItems[index].getCells()[9].setSelectedKey("");
				sap.m.MessageBox.show(oData.EMessage, {
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
					}
				});
			}else{
					oItems[index].getCells()[9].setSelectedKey("");
					ModelData.splice(index,1);
					RetreadTyreOutJModel.refresh();
					sap.m.MessageBox.show("Rejected Successfully.", {
						title: "Success",
						icon:sap.m.MessageBox.Icon.SUCCESS,
						onClose:function(){
						}
					});
				}
			}
			var fncError = function(oError){
				that.newBusy.close();
				oItems[index].getCells()[9].setSelectedKey("");
				var parser = new DOMParser();
				sap.m.MessageBox.show(parser, {
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
				});
			}
			that.newBusy.open();
			//Create Method for final Save
			oCreateModel.create(sPath, Data, {
				success: fncSuccess,
				error: fncError
			});
			
			this._RejectReasonDialog.close();
			this._RejectReasonDialog.destroy(true);
			index = null;
		},
		
		onRejectCancel:function(){
			this._RejectReasonDialog.close();
			this._RejectReasonDialog.destroy(true);
			this.getView().byId("idRetreadRepair1").getItems()[index].getCells()[9].setSelectedKey("");
			index = null;
		},
		
/*************************************Using a fragment button open on a table*****************************************************/		

		onRetread:function(oEvent){
			debugger
			var that = this;
			var date = new Date();
			this.item = oEvent.getSource();
			
			index = oEvent.getSource().getParent().getBindingContextPath().split("/")[1];
			this._RetreadEntriesHelpDialog = sap.ui.xmlfragment("zretreadrepair.view.RetreadRepair",this);
			this.getView().addDependent(this._RetreadEntriesHelpDialog);
			
			this._RetreadEntriesHelpDialog.open();
			
			this._RetreadEntriesHelpDialog.setEscapeHandler(function(o){ 
				o.reject();
				}); 
			
			sap.ui.getCore().byId("idMatnr").setSelectedKey();
			sap.ui.getCore().byId("idPatch").setSelectedKey();
			sap.ui.getCore().byId("idOwner").setEnabled(true);
			
			sap.ui.getCore().byId("idPatchTable").setModel(patchJModel,"patchJModel")
			patchJModel.setData();
			patchJModel.refresh();
			
			//sap.ui.getCore().byId("idMaktx").setText();
			//sap.ui.getCore().byId("idTotalQty").setText();
			//sap.ui.getCore().byId("idTotalAvail").setText();
			
			var fitdate = sap.ui.getCore().byId("idDateofRepair");
			fitdate.addDelegate({
				onAfterRendering: function() {
					fitdate.$().find('INPUT').attr('disabled', true);
				}
			}, fitdate);
			
			var PrevData 	= oEvent.getSource().getBindingContext("RetreadTyreOutJModel").getObject();
			Type 			= PrevData.Type;
			var DateRec		= PrevData.DateRec;
			
			DateRec=new Date(DateRec);
			sap.ui.getCore().byId("idDateofRepair").setMinDate(DateRec);
			sap.ui.getCore().byId("idDateofRepair").setMaxDate(new Date());
			sap.ui.getCore().byId("idDateofRepair").setDateValue(new Date());
			sap.ui.getCore().byId("idTreadSize").setText(PrevData.SizeDesc);
			sap.ui.getCore().byId("idTreadPat").setText(PrevData.Maktx);
			sap.ui.getCore().byId("idRepairCategory").setSelectedKey(PrevData.Cat);							// category
			sap.ui.getCore().byId("idStencilNo").setText(RetreadTyreOutJModel.getData()[index].StnclNumber);
			
			sap.ui.getCore().byId("idMatnr").setValue();
			sap.ui.getCore().byId("idMaktx").setText();
			sap.ui.getCore().byId("idRemarks").setValue();
			
			if(RetreadTyreOutJModel.oData[index].Status == "E" || RetreadTyreOutJModel.oData[index].Status == "F") {
				sap.ui.getCore().byId("idMatnr").setEnabled(false);
				sap.ui.getCore().byId("idRemarks").setEnabled(false);
			}else{
				sap.ui.getCore().byId("idMatnr").setEnabled(true);
				sap.ui.getCore().byId("idRemarks").setEnabled(true);
			}
			
			if(Type=='F'){
				sap.ui.getCore().byId("idOwner").setEnabled(false).setSelectedKey("01");
				sap.ui.getCore().byId("lbpattern").setVisible(true);
				sap.ui.getCore().byId("idMatnr").setVisible(true);
			}
			
		},

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
		
		onRetreadOk:function(){
			debugger
			if(Type == undefined)Type ='';
			
			var Matnr = sap.ui.getCore().byId("idMatnr").getValue();
			
			if(sap.ui.getCore().byId("idRepairCategory").getSelectedKey()==""){
				sap.ui.getCore().byId("idRepairCategory").setValueState("Error");
				sap.m.MessageToast.show("Please Select Category.");
				return true;
			}else{
				sap.ui.getCore().byId("idRepairCategory").setValueState("None");
			}
			
			if(sap.ui.getCore().byId("idOwner").getSelectedKey()==""){
				sap.ui.getCore().byId("idOwner").setValueState("Error");
				sap.m.MessageToast.show("Please Select Owner.");
				return true;
			}else{
				sap.ui.getCore().byId("idOwner").setValueState("None");
			}
			
			if(sap.ui.getCore().byId("idCompanySelect").getVisible()==true && sap.ui.getCore().byId("idCompanySelect").getSelectedKey()==""){
				sap.ui.getCore().byId("idCompanySelect").setValueState("Error");
				sap.m.MessageToast.show("Please Select Company.");
				return true;
			}else{
				sap.ui.getCore().byId("idCompanySelect").setValueState("None");
			}
			
			if(sap.ui.getCore().byId("idMatnr").getVisible()==true && Matnr == ""){
				sap.ui.getCore().byId("idMatnr").setValueState("Error");
				sap.m.MessageToast.show("Please Select Tread Pattern.");
				return true;
			}else{
				sap.ui.getCore().byId("idMatnr").setValueState("None");
			}
			
			if(sap.ui.getCore().byId("idMatnrInput").getVisible()==true && sap.ui.getCore().byId("idMatnrInput").getValue() == ""){
				sap.ui.getCore().byId("idMatnrInput").setValueState("Error");
				sap.m.MessageToast.show("Please Input Tread Pattern.");
				return true;
			}else{
				sap.ui.getCore().byId("idMatnrInput").setValueState("None");
			}
			
			RetreadTyreOutJModel.getData()[index].DateRep	= this.payLoadDate(sap.ui.getCore().byId("idDateofRepair").getDateValue());
			
			if(sap.ui.getCore().byId("idMatnr").getVisible() == true){
				RetreadTyreOutJModel.getData()[index].Matnr			= sap.ui.getCore().byId("idMatnr").getValue();
				RetreadTyreOutJModel.getData()[index].TMaktx		= sap.ui.getCore().byId("idMaktx").getText();
			}else{
				RetreadTyreOutJModel.getData()[index].Matnr			= "";
				RetreadTyreOutJModel.getData()[index].TMaktx		= "";
			}
			
			RetreadTyreOutJModel.getData()[index].Cat = sap.ui.getCore().byId("idRepairCategory").getSelectedKey();
			
			if(sap.ui.getCore().byId("idMatnrInput").getVisible() == true)
				RetreadTyreOutJModel.getData()[index].Brand			= sap.ui.getCore().byId("idMatnrInput").getValue();
			else
				RetreadTyreOutJModel.getData()[index].Brand			= "";
			
			if(sap.ui.getCore().byId("idCompanySelect").getVisible() == true)
				RetreadTyreOutJModel.getData()[index].ComCode		= sap.ui.getCore().byId("idCompanySelect").getSelectedKey();
			else
				RetreadTyreOutJModel.getData()[index].ComCode		= "";
			
			if(sap.ui.getCore().byId("idOwner").getVisible() == true)
				RetreadTyreOutJModel.getData()[index].Owner			= sap.ui.getCore().byId("idOwner").getSelectedKey();
			else
				RetreadTyreOutJModel.getData()[index].Owner			= "";
			
			/*RetreadTyreOutJModel.getData()[index].Reason		= sap.ui.getCore().byId("idReason").getSelectedKey();*/
			/*RetreadTyreOutJModel.getData()[index].Cat			= sap.ui.getCore().byId("idRepairCategory").getSelectedKey();*/
			
			var check = true;
			var table = sap.ui.getCore().byId("idPatchTable");
			
			/*if(table.getItems().length <= 0){
				sap.m.MessageToast.show("Please select Patch Size");
				return false
			}*/
			
			if( table.getItems().length > 0 ){
				for(var i=0 ; i< table.getItems().length ; i++){
					if(table.getItems()[i].getCells()[0].getValue()==""){
						check = false;
						table.getItems()[i].getCells()[0].setValueState("Error");
					}else
						table.getItems()[i].getCells()[0].setValueState("None");
					
					if(table.getItems()[i].getCells()[1].getValue()=="" || 
					   table.getItems()[i].getCells()[1].getValue()==0){
						check = false;
						table.getItems()[i].getCells()[1].setValueState("Error");
					}else
						table.getItems()[i].getCells()[1].setValueState("None");
					
					if(table.getItems()[i].getCells()[2].getSelectedKey()==""){
						check = false;
						table.getItems()[i].getCells()[2].setValueState("Error");
					}else
						table.getItems()[i].getCells()[2].setValueState("None");
					
					//data = patchJModel.getData();
				}
			
				if(check == false){
					sap.m.MessageToast.show("Please input required fields.");
					return false
				}
			}else{
				var arr =[];
				var obj ={
						"Patch": "","Fkimg": "00","Reason": ""
						}
				arr.push(obj);
				patchJModel.setData(arr);
			}
			
			RetreadTyreOutJModel.getData()[index].PatchSizeNvg	= patchJModel.getData();
			
			/*
			var data = patchJModel.getData();
			var sum=0;
			for(var i=0 ; i<data.length ; i++){
				sum = sum + parseInt(data[i].Fkimg);
			}
			if(sum>4){
				sap.m.MessageToast.show("Cannot use more than 4 patches");
				return false;
			}
			*/
			
			RetreadTyreOutJModel.getData()[index].Remarks 		= sap.ui.getCore().byId("idRemarks").getValue();
			RetreadTyreOutJModel.getData()[index].Action 		= "R";
			
			var oTable 		= this.getView().byId("idRetreadRepair1");
			var oItems 		= oTable.getItems();
			var tblLength 	= oItems.length;
			var ModelData 	= RetreadTyreOutJModel.getData();
			
			var Data		 = {};
			Data.Dealer 	 = Dealer;
			Data.Customer	 = Kunnr;
			Data.StnclNumber = StnclNumber;
			Data.Customer	 = Kunnr;
			Data.Mblnr		 = Mblnr;
			Data.Type		 = Type;
			Data.DateFrom	 = this.dateFrom;
			Data.DateTo 	 = this.dateTo;
			
			Data.CasingRepairNvg = [];
			
			Data.CasingRepairNvg.push(ModelData[index]);
			delete Data.CasingRepairNvg[0].__metadata;
			
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
			var sPath = "/CasingRepairSet";
			var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel.setHeaders({
				"Content-Type": "application/atom+xml"
			});
			var fncSuccess = function(oData, oResponse) 
			{
			that.newBusy.close(); 
			if(oData.EError=="true"){
				oItems[index].getCells()[9].setSelectedKey("");
				sap.m.MessageBox.show(oData.EMessage, {
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
					}
				});
			}else{
					oItems[index].getCells()[9].setSelectedKey("");
					ModelData.splice(index,1);;
					RetreadTyreOutJModel.refresh();
					sap.m.MessageBox.show("Submitted Successfully.", {
						title: "Success",
						icon:sap.m.MessageBox.Icon.SUCCESS,
						onClose:function(){
						}
					});
				}
			}
			var fncError = function(oError){
				that.newBusy.close();
				oItems[index].getCells()[9].setSelectedKey("");
				var parser = new DOMParser();
				sap.m.MessageBox.show(parser, {
					title: "Error",
					icon:sap.m.MessageBox.Icon.ERROR,
				});
			}
			
			that.newBusy.open();
			
			//Create Method for final Save
			oCreateModel.create(sPath, Data, {
				success: fncSuccess,
				error: fncError
			});
			//
			this._RetreadEntriesHelpDialog.close();
			this._RetreadEntriesHelpDialog.destroy(true);
			index = null;
		},
		
		
		onRetreadCancel:function(){
			this._RetreadEntriesHelpDialog.close();
			this._RetreadEntriesHelpDialog.destroy(true);
			this.getView().byId("idRetreadRepair1").getItems()[index].getCells()[9].setSelectedKey("");
			index = null;
		},
		
/*******************************************************************************************************/	
		onSelect:function(oEvt){
			debugger
			var selected = oEvt.getSource().getSelected();
			var tbl 	 = this.getView().byId("idRetreadRepair1");
			var length 	 = tbl.getItems().length;
			for(var i=0; i<length; i++){
				if(selected){
					tbl.getItems()[i].getCells()[0].setSelected(true);
				}else{
					tbl.getItems()[i].getCells()[0].setSelected(false);
				}
			}
		},
		
/*******************************************************************************************************/
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
	OnSubmit:function(oEvent){
			debugger
			var oTable 		= this.getView().byId("idRetreadRepair1");
			var oItems 		= oTable.getItems();
			var tblLength 	= oItems.length;
			var ModelData 	= RetreadTyreOutJModel.getData();
			var Data 		= {};
			Data.Dealer  	= Dealer;
			Data.Kunnr   	= Kunnr;
			Data.DateFrom   = this.dateFrom;
			Data.DateTo     = this.dateTo;
			
			Data.CasingRepairNvg = [];
			
			for (var i = 0; i < tblLength; i++) {
				delete ModelData[i].__metadata;
				delete ModelData[i].Patch;
				delete ModelData[i].Width;
				delete ModelData[i].Remarks;
			
			if( ModelData[i].Matnr != ""){
				ModelData[i].Select = 'X';
			}
			Data.CasingRepairNvg.push(ModelData[i]);
			}
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
			var sPath = "/CasingRepairSet";
			var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel.setHeaders({
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
				sap.m.MessageBox.show("Submitted Successfully.", {
					title: "Success",
					icon:sap.m.MessageBox.Icon.SUCCESS,
					onClose:function(){
						 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				        	 oCrossAppNavigator.toExternal({
				        	                       target: { semanticObject : "#"}
				        	                      });
						//window.location.reload();
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
			oCreateModel.create(sPath, Data, {
			success: fncSuccess,
			error: fncError
			});
	},

/***************************************************using a Download excel file *******************************************/            
		onDownload : sap.m.Table.prototype.exportData || function(oEvent) {
			debugger
			 var oExport = new sap.ui.core.util.Export({
			 exportType : new sap.ui.core.util.ExportTypeCSV({
			 separatorChar: "\t",
			 mimeType: "application/vnd.ms-excel",
			 charset: "utf-8",
			 fileExtension: "xls"
			 }),
			 models : this.getView().getModel("RetreadTyreOutJModel"),
				 rows : {
				 path : "/",
			 },
			 columns: [{
				name: "Stencil No",
				template: {
				content: "{StnclNumber}"
				},
			 	},
			 	{
				name: "Customer",
				template: {
				content: "{CustomerName}"
				},								
				},
				{
				name: "Company",
				template: {
				content: "{TypeCompDesc}"
				},								
				},
				
				{
				name: "Size",
				template: {
				content: "{SizeDesc}"
				},								
				},
				{
				name: "Pattern",
				template: {
				content: "{Maktx}"
				},								
				},
					
				{
				name: "Type",
				template: {
				content: "{TyreType}"
				},								
				},
						
				{
				name: "Stage",
				template: {
				content: "{LocDesc}"
				},								
				},
			 ]
			 });
			 //* download exported file
			 oExport.saveFile().always(function() {
				this.destroy();
			});
		},	
		
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		NumTwoPoint: function(oEvent){
			var text = oEvent.getSource().getValue();
			var code = text.charCodeAt(text.length-1);	 
				
	                        if(text.length > 0){
							if ( !(code > 47 && code < 58) && !(code == 46) ){ //point
								text = text.substring( 0 , text.length - 1 );
							}
							if(text.charCodeAt(text.length-3)==46 ){
											if(text.charCodeAt(text.length-2)==46)
													text = text.substring( 0 , text.length - 1 );
											
											if(text.charCodeAt(text.length-1)==46)
													text = text.substring( 0 , text.length - 1 );		
							}
							if(text.charCodeAt(text.length-2)==46 ){
									if(text.charCodeAt(text.length-1)==46)
												text = text.substring( 0 , text.length - 1 );	
							}
						if(text.charCodeAt(text.length-4)==46)
						text = text.substring( 0 , text.length - 1 );	
				}
	                if(parseFloat(text)>99.99)text = text.substring( 0 , text.length - 1 );
					oEvent.getSource().setValue(text);	
			},
		
	
		 bindRejectReasonSet: function(){
			 debugger
				var oView = this.getView();
				var user = new sap.ushell.services.UserInfo();
				var uid = user.getId();	
				var RejectService = oView.getModel("RejectService");
				if (!RejectService) {
					RejectService = new sap.ui.model.json.JSONModel();
					oView.setModel(RejectService, "RejectService");
				}
				var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
				var sPathService = "/F4RetreadReasonSet?$filter=Type eq 'B'";
				var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				var oParamsService = {};
				oParamsService.context = "";
				oParamsService.urlParameters = "";
				oParamsService.success = function(oData, oResponse) { // success handler
					RejectService.setData(oData.results);
				};
				oParamsService.error = function(oError) { // error handler 		
					jQuery.sap.log.error("read publishing group data failed");
				}.bind(this);
				frameworkODataModel.read(sPathService, oParamsService);
				frameworkODataModel.attachRequestCompleted(function() {
				});
			 
			 },
			 
			 bindRequiredReasonSet: function(){
				 debugger
					var oView = this.getView();
					var user = new sap.ushell.services.UserInfo();
					var uid = user.getId();	
					var RequiredService = oView.getModel("RequiredService");
					if (!RequiredService) {
						RequiredService = new sap.ui.model.json.JSONModel();
						oView.setModel(RequiredService, "RequiredService");
					}
					var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
					var sPathService = "/F4RetreadReasonSet?$filter=Type eq 'A'";
					var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					var oParamsService = {};
					oParamsService.context = "";
					oParamsService.urlParameters = "";
					oParamsService.success = function(oData, oResponse) { // success handler
						RequiredService.setData(oData.results);
					};
					oParamsService.error = function(oError) { // error handler 		
						jQuery.sap.log.error("read publishing group data failed");
					}.bind(this);
					frameworkODataModel.read(sPathService, oParamsService);
					frameworkODataModel.attachRequestCompleted(function() {
					});
				
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
		 onAddRow:function(){
				debugger
				var data;
				

    			if(sap.ui.getCore().byId("idRepairCategory").getSelectedKey()=="")
    				{
    				sap.m.MessageToast.show("Please select Category");
    				sap.ui.getCore().byId("idRepairCategory").setValueState("Error");
    				return
    				}
    			else
    				sap.ui.getCore().byId("idRepairCategory").setValueState("None");
				
				if(patchJModel.getData() == undefined)
					data = [];
				else
					data = patchJModel.getData();
				
				var sum = 0;
				if(data.length == 4){
					sap.m.MessageToast.show("Maximum 4 patches allowed");
					return false;
				}
				
				var tyreData = {};
						
				tyreData.Patch	= "";
				tyreData.Fkimg	= "";
				tyreData.Reason = "";
						
				data.push(tyreData);

				patchJModel.setData(data);
				patchJModel.refresh();
		},
		
		onDeleteRow : function(oEvent){
			debugger
				var index = oEvent.getSource().getParent().getBindingContextPath().split('/')[1];
				{
					patchJModel.getData().splice(index,1);
					patchJModel.refresh();
				}
		},
		
		onlyNumber: function(oEvent){
			var text = oEvent.getSource().getValue();

			var code = text.charCodeAt(text.length-1);
			if ( !(code > 47 && code < 58))
				{
				text = text.substring( 0 , text.length - 1 );
				}
			
			oEvent.getSource().setValue(text);   
		},
//////////////////////////////////////////////////////////////////////////////////////////////////

			})
		});

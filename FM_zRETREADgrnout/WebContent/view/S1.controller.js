jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("zretreadgrnout.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.Dialog");

sap.ui.define([ 
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer"
	],
function(JSONModel, MockServer) {
"use strict";
var that;
var Kunnr, DealerName, Dealer, Type, RetreadRepairTbl, RetreadTyreOutJModel, Mblnr, StnclNumber;

sap.ui.core.mvc.Controller.extend("zretreadgrnout.view.S1",{

onInit : function() {
	debugger
	that = this;
	this.newBusy = new sap.m.BusyDialog();
	this.newBusy.open();
	
	RetreadRepairTbl = this.getView().byId("idRetreadTyreOut1");
	RetreadTyreOutJModel = new sap.ui.model.json.JSONModel();
	RetreadRepairTbl.setModel(RetreadTyreOutJModel, "RetreadTyreOutJModel");
	this.getDealerInfo();
	
	//set initial date in input field
	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyyy"});
	var date = new Date(), y = date.getFullYear(), m=date.getMonth();
	var firstDay = new Date(y,m,1);
	var currentDate = new Date;
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
	this.dateFrom  = dateFormat.format(firstDay)+"T00:00:00";
	this.dateTo = dateFormat.format(currentDate)+"T00:00:00";
	currentDate = oDateFormat.format(currentDate);
	firstDay = oDateFormat.format(firstDay);
	
	var initialDateValue = firstDay + " - "  + currentDate;
	this.getView().byId("fromDate").setValue(firstDay);
	this.getView().byId("toDate").setValue(currentDate);

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
	this.getView().byId("idTime").setText(today.toDateString());
	this.getView().byId("fromDate").setMaxDate(today);
	this.getView().byId("toDate").setMaxDate(today);
},
//////////////////////////////////////////////////////////////////////////////////////////////////
getDealerInfo: function (){
	debugger
	var that= this;
	var sServicePath = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var sPathSet = "CasingDealerSet(Dealer='"+ sap.ushell.Container.getService("UserInfo").getId() + "')";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath); 
	var oParamsCartListSet = {};
		oParamsCartListSet.success = function (oData, oResponse){
			that.newBusy.close();
			debugger
			that.getView().byId("pageTitle").setTitle(oData.Name+" ("+oData.Dealer+")");
			Dealer     = oData.Dealer;
			DealerName = oData.Name;
		};
		
		oParamsCartListSet.error = function (oError){
			that.newBusy.close();
		};
		this.newBusy.open();
		frameworkODataModel.read(sPathSet, oParamsCartListSet);
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onF4GRN:function(){
	debugger
	this.GRNModel= new sap.ui.model.json.JSONModel();
	if(Kunnr==undefined)Kunnr="";
	
	var oData={};
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
	var sPath = "F4GetGrnSet?$filter=Dealer eq '"+Dealer+"' and HubCode eq '"+Kunnr+"' and App eq 'O'";
	var customerModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

	this.GRNDialog = new sap.m.SelectDialog({
				title : "Select GRN",
				items : {
					path : "/results",
					template : new sap.m.StandardListItem({
						title : "{Mblnr}",
						description:"{path:'Erdat',formatter:'zretreadgrnout.util.Formatter.date1'}",
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
			that.getView().byId("idF4GRN").setValue(Mblnr);
			
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onStencilNo:function(){
		debugger
		 var user = new sap.ushell.services.UserInfo();
		 var uid = user.getId()
		 var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingStencilSet?$filter=Dealer eq '"+Dealer+"' and App eq 'O' and HubCode eq ''";
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
onSearch:function(){
	var check  = false;
	var oView = this.getView();
	var user = new sap.ushell.services.UserInfo();
	var uid = user.getId();
	
	var customer = this.getView().byId("idCustomer").getValue();
	if(customer==""){
		sap.m.MessageToast.show("Please select Customer.");
		this.getView().byId("idCustomer").setValueState("Error");
		return false;
	}else
		this.getView().byId("idCustomer").setValueState("None");
	
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
			RetreadTyreOutJModel.setData(oData.RetreadOutNvg.results);
			
		}
		var fncError = function(oError) {
			that.newBusy.close();
			jQuery.sap.log.error("Read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		var path = "RetreadOutSet(Dealer='"+Dealer+"',Customer='"+Kunnr+"',Mblnr='"+Mblnr+"',StnclNumber='"+StnclNumber+"',DateFrom=datetime'"+this.dateFrom+"',DateTo=datetime'"+this.dateTo+"')?$expand=RetreadOutNvg";
		
		that.newBusy.open();
		oReadModel.read(path, {
			success : fncSuccess,
			error : fncError
		});
},

onClear:function(){
	var tableid = this.getView().byId("idRetreadRepair1");
		RetreadTyreOutJModel.setData();
		RetreadTyreOutJModel.refresh(); 
		sap.m.MessageToast.show("Filters Removed");
		Kunnr=""
		Type="";
	
	this.getView().byId("idStencilNo").setValue();
	this.getView().byId("idCustomer").setValue();
	this.getView().byId("idF4GRN").setValue();
	this.setInitialDate();
},

//////////////////////////////////////////////////////////////////////////////////////////////////
onCustomerHelp: function()
{
	debugger
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4CasingCustomerSet?$filter=Dealer eq'"+Dealer+"' and App eq 'O'";
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
			this.getView().byId("idCustomer").setValue(oSelectedItem.getTitle());
			Kunnr  = oSelectedItem.getBindingContext().getObject().Customer;
			Type = oSelectedItem.getBindingContext().getObject().Type;
			//this.onSearch();
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onSelect:function(oEvt){
	debugger
	var selected = oEvt.getSource().getSelected();
	var tbl = this.getView().byId("idRetreadTyreOut1");
	var lngth = tbl.getItems().length;
	for(var i=0; i<lngth; i++){
		if(selected){
			tbl.getItems()[i].getCells()[0].setSelected(true);
		}else{
			tbl.getItems()[i].getCells()[0].setSelected(false);
		}
		
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
onSubmit: function(){
	debugger
	
	var oTable = this.getView().byId("idRetreadTyreOut1");
	var oItem = oTable.getItems();
	var tableLength = oItem.length;
	var modelData = RetreadTyreOutJModel.getData();
	var counter = false;
	
	if(oItem.length==0){
		sap.m.MessageToast.show("No Items for Dispatch.");
		return false;
	}
	
	var Data = {};
	Data.Type = Type
	Data.Dealer = Dealer;
	Data.Customer  = Kunnr;
	Data.StnclNumber = "";
	Data.Mblnr = "";
	Data.DateFrom = this.dateFrom;
	Data.DateTo = this.dateTo;
	
	Data.RetreadOutNvg = [];
	
	for(var i=0; i<tableLength; i++){
		delete modelData[i].__metadata;
		if(oItem[i].getCells()[0].getSelected() == true){
			counter = true;
			modelData[i].Select = 'X';
			Data.RetreadOutNvg.push(modelData[i]);
		}
		
	}
	if(counter == false){
		sap.m.MessageToast.show("Select atleast one item for dispatch.");
		return false;
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
	var sPath = "RetreadOutSet ";
	var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
		});
		var fncSuccess = function(oData, oResponse){
			that.newBusy.close();
			if(oData.EError == "true"){
				sap.m.MessageBox.show(oData.EMessage,{
					title:"Error",
					icon:sap.m.MessageBox.Icon.ERROR,
					onClose: function (){
					}
				});
			}else{
				sap.m.MessageBox.show("Dispatched Successfully.",{
					title:"Success",
					icon:sap.m.MessageBox.Icon.SUCCESS,
					onClose: function (){
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						oCrossAppNavigator.toExternal({
								target: { semanticObject : "#"}
						});
					}
				});
			}
		}
		var fncError = function (oError){
			that.newBusy.close();
			var parser = new DOMParser();
			sap.m.MessageBox.show(parser,{
				title:"Error",
				icon:sap.m.MessageBox.Icon.ERROR,
			});
		}
		that.newBusy.open();
		//Create Method for Final Save
		oCreateModel1.create(sPath, Data,{
			success:fncSuccess,
			error:fncError
		});
		
},
//////////////////////////////////////////////////////////////////////////////////////////////////

});
});
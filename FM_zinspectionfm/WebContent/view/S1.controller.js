var that,EnrolMode,oGlobalBusyDialog ;
var TableVehicleJModel, TableVehicleF1JModel ;

sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	"../view/formatter", 
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
	],
function(MessageBox,Fragment,Controller,formatter, JSONModel,MessageToast,Export,ExportTypeCSV) {
"use strict";
		
return sap.ui.controller("zinspectionfm.view.S1", {
	
	onInit: function() {
		oGlobalBusyDialog = new sap.m.BusyDialog();
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
	
		// CHANGE 
		var oViewObj = this.getView();

			TableVehicleJModel = oViewObj.getModel("TableVehicleJModel");
			if (!TableVehicleJModel) {
				TableVehicleJModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(TableVehicleJModel, "TableVehicleJModel");
			}

			TableVehicleF1JModel = oViewObj.getModel("TableVehicleF1JModel");
			if (!TableVehicleF1JModel) {
				TableVehicleF1JModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(TableVehicleF1JModel, "TableVehicleF1JModel");
			}
// CHANGE 
				
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zinspectionfm.css.style",".css"));

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
		
		var that = this;
		this.model = this.getOwnerComponent().getModel();
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({
			"Content-Type" : "application/json"
		});
		var fncSuccess = function(oData, oResponse){
			
			if(oData.results.length==0 ){
				sap.m.MessageBox.show("Your not Registered to any Fleet", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
						window.history.back();
					}
					});	
			}else if(oData.results.length==1)
				{
				;
				that.Customer = oData.results[0].Kunnr;
				that.EnrolMode = oData.results[0].EnrolMode;
				EnrolMode      = that.EnrolMode;
				if(that.EnrolMode === "F"){
					that.getView().byId("Panel1").setVisible(false); //Added to check for one value in Fleet Popup
					that.getView().byId("Panel2").setVisible(true);
				}else{
					that.getView().byId("Panel1").setVisible(true); //Added to check for one value in Fleet Popup
					that.getView().byId("Panel2").setVisible(false);
				}
				that.getView().byId("lblFleet").setText(oData.results[0].FleetName);
				}
			else{
				that.FleetData=oData;
			/*	if(that.EnrolMode === "F"){
					that.getView().byId("Panel2").setVisible(true); //Added to check for one value in Fleet Popup
					that.getView().byId("Panel1").setVisible(false);
				}else{
					that.getView().byId("Panel1").setVisible(true); //Added to check for one value in Fleet Popup
					that.getView().byId("Panel2").setVisible(false);
				}*/
				if (!that._FleetDialog) {
				that._FleetDialog = sap.ui.xmlfragment(
						"zinspectionfm.view.Intial", that);
					that.getView().addDependent(that._FleetDialog);}
				that._FleetDialog.open();
						
			}
		}
		var fncError = function(oError) { // error callback
			// function
			var parser = new DOMParser();
			var message = parser.parseFromString(
			oError.response.body, "text/xml")
			.getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
			});
			}
		oReadModel.read("/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'", {
			success : fncSuccess,
			error : fncError
		});
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
	},
// end on init	
	
	handledatefrom: function(oEvent){
		
	    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
	    var from = oEvent.getSource().getProperty("dateValue");
	 //   var to = oEvent.getSource().getProperty("secondDateValue");
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
	
	handledateto: function(oEvent){
		
	    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
	    var from = oEvent.getSource().getProperty("dateValue");
	 //   var to = oEvent.getSource().getProperty("secondDateValue");
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////
	onSearch : function(){
		debugger
		oGlobalBusyDialog.open();
		var that = this;
	
		var kunnr = this.Customer;
		var regNo = this.getView().byId("inpRegNo").getValue();
		
		if((this.getView().byId("fromDate").getValue()=="" || this.getView().byId("fromDate").getValue()==null)
				|| (this.getView().byId("toDate").getValue()=="" || this.getView().byId("toDate").getValue()==null)){
			sap.m.MessageToast.show("Please Input Date Range");
			this.getView().byId("fromDate").setValueState("Error");
			this.getView().byId("toDate").setValueState("Error");
			oGlobalBusyDialog.close();
			return
			}
		
		if(this.dateFrom > this.dateTo){
			sap.m.MessageToast.show("From-date cannot be greater than To-date.");
			this.getView().byId("fromDate").setValueState("Error");
			this.getView().byId("toDate").setValueState("Error");
			oGlobalBusyDialog.close();
			return
			}
		else{
			this.getView().byId("fromDate").setValueState("None");
			this.getView().byId("toDate").setValueState("None");
			}
		
		var tab = this.getView().byId("tableVehicle1");
		var tabF = this.getView().byId("tableVehicleF1"); //SS
		var oViewObj = this.getView();
		var TableVehicleJModel   = oViewObj.getModel("TableVehicleJModel");
		var TableVehicleF1JModel = oViewObj.getModel("TableVehicleF1JModel");
		
		var VehicleFormData = this.getView().getModel("VehicleFormData");
		if (!VehicleFormData) {
			 VehicleFormData = new sap.ui.model.json.JSONModel();
				this.getView().setModel(VehicleFormData, "VehicleFormData");
			}
		 
			var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
			var sPathCartListSet = "/ReportVehicleInspectionSet?$filter=Kunnr eq '"+kunnr+"' and  DateFrom  eq datetime'"
									+this.dateFrom+"' and DateTo eq datetime'"+this.dateTo+"' and RegNo eq '" + regNo + "'";
			
			var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				var tab =oViewObj .byId("tableVehicle1");
				var tabF =oViewObj .byId("tableVehicleF1"); //SS
				
				if(oData.results.length==0){
					sap.m.MessageToast.show("No Data found");
				}
				
				VehicleFormData.setData(oData.results);
				if(EnrolMode =="F"){
				TableVehicleJModel.setData(VehicleFormData.oData);
				}
				else{
				TableVehicleF1JModel.setData(VehicleFormData.oData);
				
				}
				var idProf = oViewObj.byId("tableVehicle1");
				var idPers = oViewObj.byId("tableVehicleF1");
				
				oGlobalBusyDialog.close();
			
				};
			oParamsCartListSet.error = function(oError) { // error handler
				oGlobalBusyDialog.close();
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
			frameworkODataModel.attachRequestCompleted(function() {
			});
		
	},
	
	onClear : function()
	{
			this.getView().byId("fromDate").setValue("");
			this.getView().byId("toDate").setValue("");
			this.getView().byId("inpRegNo").setValue("");
			TableVehicleJModel.setData();
			TableVehicleF1JModel.setData();
	},
///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	handleDateChange: function(oEvent){
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
		var from = oEvent.getSource().getProperty("dateValue");
		var to = oEvent.getSource().getProperty("secondDateValue");
		var dateVal = oEvent.getSource().getProperty("value");
		
		
		if(from !== null){
			this.fromDate = dateFormat.format(from)+"T00:00:00";
		}else{
			if(dateVal !== ""){
				var dateSplit = dateVal.split("-");
				var fromDate = dateSplit[0].trim();
				var fromSplit = fromDate.split(".");
				var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
				this.fromDate = fValue+"T00:00:00";
			}else{
				this.fromDate = null;
			}
			
		}
		if(to !== null){
			this.toDate = dateFormat.format(to)+"T00:00:00";
		}else{
			if(dateVal !== ""){
				var dateSplit = dateVal.split("-");
				var toDate = dateSplit[1].trim();
				var toSplit = toDate.split(".");
				var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
				this.toDate = tValue+"T00:00:00";
			}else{
				this.toDate = null;
			}
			
		}
	
	},


//////////////////////////////////////////////////////////////////////////////////////////////////
	onDownload : sap.m.Table.prototype.exportData || function(oEvent) {
		 
		 var oExport = new sap.ui.core.util.Export({
		 exportType : new sap.ui.core.util.ExportTypeCSV({
		 separatorChar: "\t",
		 mimeType: "application/vnd.ms-excel",
		 charset: "utf-8",
		 fileExtension: "xls"
		}),
		models : this.getView().getModel("TableVehicleJModel"),
			 rows : {
			 path : "/",
		 },
						 	
		 columns: [{
			name: "Regn No",
			template: {
			content: "{RegNo}"
			},
		 	},
		 	{
			name: "Configuration",
			template: {
			content: "{ConfigCodeDesc}"
			},								
			},
			{
			name: "Inspection Number",
			template: {
			content: "{InspNo}"
			},								
			},
			{
			name: "Inspection Date",
			template: {
			content: "{path:'InspDate',formatter:'zinspectionfm.util.formatter.date1'}"
			},								
			},
			{
			name: "Inspection Hub",
			template: {
			content: "{InspHub}"
			},								
			},
		 ]
		 });
		 //* download exported file
		 oExport.saveFile().always(function() {
			this.destroy();
		});
	},	
//////////////////////////////////////////////////////////////////////////////////////////////////
	onDownload1 : sap.m.Table.prototype.exportData || function(oEvent) {
		 
		 var oExport = new sap.ui.core.util.Export({
		 exportType : new sap.ui.core.util.ExportTypeCSV({
		 separatorChar: "\t",
		 mimeType: "application/vnd.ms-excel",
		 charset: "utf-8",
		 fileExtension: "xls"
		}),
		 models : this.getView().getModel("TableVehicleF1JModel"),
			 rows : {
			 path : "/",
		 },
		 columns: [
		 {
		 name: "Regn No",
		 template: {
		 content: "{RegNo}"
		 },
		 },
		 {
			name: "Configuration",
			template: {
			content: "{ConfigCodeDesc}"
				},								
			},

			{
				name: "Inspection Number",
				template: {
				content: "{InspNo}"
				},								
			},
		{
			name: "Inspection Date",
			template: {
			content: "{path:'InspDate',formatter:'zinspectionfm.util.formatter.date1'}"
			},								
		},
		{
			name: "Inspection Hub",
			template: {
			content: "{InspHub}"
			},
			},
		
		{
			name: "ContractType",
		    template: {
			//content: "{ContractType}"
			content: "{path:'ContractType',formatter:'zinspectionfm.util.formatter.ContractType'}"	
				}	
		},
		 ]
		 });
		 //* download exported file
		 oExport.saveFile().always(function() {
			this.destroy();
		});
	},	
	onFleetCloseButton:function(){
		var that = this;
		if(sap.ui.getCore().byId("idFleet").getValue()!=""){
			this.getView().byId("lblFleet").setText(sap.ui.getCore().byId("idFleet").getValue());
		that._FleetDialog.close();
		}else{
			sap.m.messageToast.show("Select Fleet")
		}
		
	},
	onFleetCloseCancle:function(){
		window.history.back();
	},
	NumberValid : function(oEvent)
	{ 
		var val = oEvent.getSource().getValue();
		if(val){
			if(isNaN(val)){
				val = val.substring(0, val.length - 1);
				oEvent.getSource().setValue(val);
				
			}
		}
	},
	onFleetFragment: function(evt) {
		this.CustomerValue = evt.getSource();
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpDialog = new sap.m.SelectDialog({

			title: "Fleet",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{FleetName}",
					customData: [new sap.ui.core.CustomData({
						key: "{Kunnr}",
						value: "{FleetName}"
					})]

				})
			},
			liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("FleetName", sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			confirm: [this._handleCustomerClose, this],
			cancel: [this._handleCustomerClose, this]
		});
		_valueHelpDialog.setModel(jModel);
		_valueHelpDialog.open();
	},

	_handleCustomerClose: function(oEvent) {
		
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.Customer = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			this.EnrolMode = oEvent.getParameter("selectedItem").getBindingContext().getObject().EnrolMode;
			var oColumn;
			EnrolMode = this.EnrolMode;
			if(this.EnrolMode === "F"){
				this.getView().byId("Panel2").setVisible(true);
				this.getView().byId("Panel1").setVisible(false);
			}else{
				this.getView().byId("Panel1").setVisible(true);
				this.getView().byId("Panel2").setVisible(false);
			}
			;
			this.CustomerValue.setValue(oSelectedItem.getTitle());
		}

	},
	
	
	payLoadDate: function(SDateValue) {
		
		var str = "T00:00:00";
		var currentTime = new Date(SDateValue);
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		var date = year + "-" + month + "-" + day + str;
		return date;
		},
	
	
	onVehicleRegNoHelp: function(evt) {
		this.VehRegNoValue = evt.getSource();
		var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4FleetVehicleDataSet?$filter=Kunnr eq '"+this.Customer+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpDialog = new sap.m.SelectDialog({

			title: "Vehicle Registration Number",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{RegNo}",
					customData: [new sap.ui.core.CustomData({
						key: "{RegNo}",
						value: "{RegNo}"
					})]

				})
			},
			liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			confirm: [this._handleVehRegNoClose, this],
			cancel: [this._handleVehRegNoClose, this]
		});
		_valueHelpDialog.setModel(jModel);
		_valueHelpDialog.open();
	},

	_handleVehRegNoClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.RegNo = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			this.VehRegNoValue.setValue(oSelectedItem.getTitle());
		}

	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	handleSortDialogConfirm : function(oEvent) {
		
	    var oTable = this.byId("idTable");
	    var mParams = oEvent.getParameters();
	    var oBinding = oTable.getBinding("items");
	    var sPath;
	    var bDescending;
	    var aSorters = [];
	    
	    sPath = mParams.sortItem.getKey();
	    bDescending = mParams.sortDescending;
	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	    oBinding.sort(aSorters);
	},
	
	
	
/*********************************Filter Code *******************************************/	

		// filter sorter
		//onPressSorter
		handleViewSettingsDialogButtonPressed: function(oEvent) {
			
		    if (!this.oSorterDialog) {
			this.oSorterDialog = sap.ui.xmlfragment("zinspectionfm.view.ViewSetting", this);
			this.getView().addDependent(this.oSorterDialog);
			var arr = [{
				Key: "RegNo",
				Value: "Reg No"	
			},
			{
				Key: "InspNo",
				Value: "Inspection No"	
			}];
			var sModel = new sap.ui.model.json.JSONModel ( { oItems: arr });
			this.getView().setModel( sModel, "oSortModel");
		    }
		    this.oSorterDialog.open();
		},

		handleSortDialogConfirm : function(oEvent) {
			
		    //var oTable = this.byId("idTable");
			var oTable = this.getView();
			if(this.EnrolMode === "F"){
				var oTable = oTable.byId("tableVehicleF1");
			}else{
				var oTable = oTable.byId("tableVehicle1");
			}
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

		
/************************************************************************/
		onPrint:function(e){
  		   
  		   var origin = window.location.origin; 
  		   var reg    = e.getSource().getParent().getCells()[0].getText();
  		   var insp   = e.getSource().getParent().getCells()[2].getText();
  		   var hub    = e.getSource().getParent().getCells()[6].getText();//change sumit 0808019
  		 //  var cust   = window.KCustomer;
  		   sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFLEET_SRV/InspectionOutputSmartFormSet(InspNo='" + insp + "',Kunnr='" + this.Customer + "',HubCode='" + hub + "',RegNo='" + reg + "')/$value" ,true);
  	   },
  	   onPrint1:function(e){
	  		   
	  		   var origin = window.location.origin; 
	  		   var reg    = e.getSource().getParent().getCells()[0].getText();
	  		   var insp   = e.getSource().getParent().getCells()[2].getText();
	  		   var hub    = e.getSource().getParent().getCells()[7].getText();//change sumit 0808019
	  		//   var cust   = window.KCustomer;
	  		   sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFLEET_SRV/InspectionOutputSmartFormSet(InspNo='" + insp + "',Kunnr='" + this.Customer + "',HubCode='" + hub + "',RegNo='" + reg + "')/$value" ,true);
	  	   }
		
})
});

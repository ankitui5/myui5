var that, jsonModel, tableModel,fleetName,gv_busyindicator;
sap.ui.define([ "sap/ui/core/mvc/Controller",
				"sap/m/MessageBox",
				"sap/m/MessageToast",
				"sap/viz/ui5/controls/common/feeds/FeedItem",
				"sap/viz/ui5/data/FlattenedDataset",
				"sap/ui/core/util/Export", 
				"sap/ui/core/util/ExportTypeCSV",
				/*"sap/ui/export/Spreadsheet",*/
				"zstockreport/util/Formatter"],
function(Controller,MessageBox, MessageToast,FeedItem,FlattenedDataset,Export,ExportTypeCSV,Formatter) {
"use strict";
 
sap.ui.controller("zstockreport.view.View",
{ 
Data : "",
myChart : "",
clear : false,
o : false,

onInit : function() {
	
	gv_busyindicator = new sap.m.BusyDialog();
	var oSmartTable = this.getView().byId("Idtable");
		oSmartTable.setSelectionMode("None"); //remove check box from rows.
	
	
	this.singleFleet = "";
	this.UniqFleet = "";
	this.UniqNonFleet = "";
	this.EnrolMode = "";
	this.fleetNam="";
	//jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zstockreport.view.style",".css"));
	this.model = this.getOwnerComponent().getModel();
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
				
	var jsonModel  = this.getView().getModel("jsonModel");
		if(!jsonModel){
			jsonModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(jsonModel,"jsonModel");
		}

	var tableModel  = this.getView().getModel("tableModel");
		if(!tableModel){
			tableModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(tableModel,"tableModel");
		}

		//sap.ui.core.UIComponent.getRouterFor(this).getRoute("View").attachMatched(this._onRoute, this);

},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*_onRoute: function(){	
	
},*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

onAfterRendering : function() {
	
	var that = this;
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});										
	var fncSuccess = function(oData, oResponse){
	
		if(oData.results.length==0 ){
			sap.m.MessageBox.show("You are not registered to any Fleet", {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
						window.history.back();
					}
			});	
		}else if(oData.results.length==1){
			
			that.singleFleet = true;
			that.EnrolMode=oData.results[0].EnrolMode;
			that.Customer = oData.results[0].Kunnr;
			that.fleetNam = that.Customer;
			fleetName = oData.results[0].FleetName;
//			that.getView().byId("lblFleet").setText(oData.results[0].FleetName);
												
			if(that.EnrolMode === "M"){
				
				that.FleetData=oData;
					if (!that._FleetDialog) {
						that._FleetDialog = sap.ui.xmlfragment("zstockreport.view.Intial", that);
						that.getView().addDependent(that._FleetDialog);
					}	
						
						that._FleetDialog.open();
						sap.ui.getCore().byId("fleetInput").setValue(fleetName);
					    sap.ui.getCore().byId("fleetInput").setValue(fleetName);
					    sap.ui.getCore().byId("stockLbl").setVisible(true);
						sap.ui.getCore().byId("btnStock").setVisible(true);
										
					}else{
						that.UniqFleet = "";
						that.UniqNonFleet = "X";
						that.getView().byId("fltName").setTitle(fleetName);
						that.showChart();
						
					/*	if (!that._FleetDialog) {
							that._FleetDialog = sap.ui.xmlfragment("zstockreport.view.Intial", that);
							that.getView().addDependent(that._FleetDialog);
						}
							that._FleetDialog.open();*/
														
					}
													
			}else{
				
				that.EnrolMode=oData.results[0].EnrolMode;
				that.FleetData=oData;
				debugger
					if (!that._FleetDialog) {
						that._FleetDialog = sap.ui.xmlfragment("zstockreport.view.Intial", that);
						that.getView().addDependent(that._FleetDialog);
					}	
						
						that._FleetDialog.open();
														
			}
		}
												
		var fncError = function(oError) {
			var parser = new DOMParser();
			var message = parser.parseFromString(
				oError.response.body, "text/xml")
				.getElementsByTagName("message")[0].innerHTML
				sap.m.MessageBox.show(message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
				});
		}
			
	if(that.o === false){
	   that.o = true;
	   oReadModel.read("/User_Fleet_DetialsSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'", {
			success : fncSuccess,
		    error : fncError
		});
	}
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onFleetFragment:function(evt){
	that = this;
	that.ItemDescRow = evt.getSource();
	var jModel = new sap.ui.model.json.JSONModel(that.FleetData);
	var _valueHelpFleetDialog = new sap.m.SelectDialog({
		title : "Select Fleet",
			items : {
				path : "/results",
				template : new sap.m.StandardListItem({
					title : "{FleetName}",
					customData : [ new sap.ui.core.CustomData({
						key : "Key",
						value : "{Kunnr}"
					})],
				}),
			 },
			 
		liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.
			Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);
			oEvent.getSource().getBinding("items").filter([ oFilter ]);
		},
		
		confirm : [ this._handleFleetClose, this ],
		cancel : [ this._handleFleetClose, this ]
										
	});
	
	_valueHelpFleetDialog.setModel(jModel);
	_valueHelpFleetDialog.open();
	
},

	_handleFleetClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.EnrolMode = oEvent.getParameter("selectedItem").getBindingContext().getObject().EnrolMode;
					if(this.EnrolMode === "M"){
						sap.ui.getCore().byId("stockLbl").setVisible(true);
						sap.ui.getCore().byId("btnStock").setVisible(true);
						sap.ui.getCore().byId("btnStock1").setVisible(true);
						sap.ui.getCore().byId("btnStock2").setVisible(true);
													
					}else{
						this.UniqFleet = "";
						this.UniqNonFleet = "X";
						sap.ui.getCore().byId("stockLbl").setVisible(false);
						sap.ui.getCore().byId("btnStock").setVisible(false);
					}
						that.ItemDescRow.setValue(oSelectedItem.getTitle());
						that.ItemDescRow.setName(oSelectedItem.getBindingContext().getObject().Kunnr);
						this.fromKunnr = oSelectedItem.getBindingContext().getObject().Kunnr;
						this.fleetNam = this.fromKunnr;
						this.ItemDescRow.setValue(oSelectedItem.getTitle());
						that.fleetName = oSelectedItem.getTitle();
						//that.showChart();
				} 
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/							
onFleetCloseButton:function(){
	gv_busyindicator.open();
	var that = this;
	fleetName = that.fleetName;
	if(that.singleFleet === true){
		if(that.EnrolMode === "M"){
			var stock = sap.ui.getCore().byId("btnStock").getSelectedIndex();
				if(stock === 0){
					that.UniqFleet = "X";
					that.UniqNonFleet = "";
				}else{
					that.UniqFleet = "";
					that.UniqNonFleet = "X";
				}
		}else{
			that.UniqFleet = "X";
			that.UniqNonFleet = "";
		}
			that._FleetDialog.close();
	}else{
		if(that.ItemDescRow.getValue()!=""&& that.ItemDescRow.getValue()!=""){
			if(that.EnrolMode === "M"){
				var stock = sap.ui.getCore().byId("btnStock").getSelectedIndex();
					if(stock === 0){
						that.UniqFleet = "X";
						that.UniqNonFleet = "";
					}else{
						that.UniqFleet = "";
						that.UniqNonFleet = "X";
					}
			}else{
				that.UniqFleet = "";
				that.UniqNonFleet = "X";
			}
				that._FleetDialog.close();
		}else{
			sap.m.messageToast.show("Select Fleet")
		}
	}
		that.getView().byId("fltName").setTitle(fleetName)
		that.showChart();
		
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onFleetCloseCancle:function(){
	window.history.back();
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

showChart : function(e) {
	debugger
	gv_busyindicator.open();
	var self = this;
	var tableModel   = self.getView().getModel("tableModel");
	var jsonModel   = self.getView().getModel("jsonModel"); 
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});
	var path = "/ReportFleetStockHeadSet(Kunnr='" + self.fleetNam + "',Fleet='" + self.UniqFleet + "',NonFleet='" + self.UniqNonFleet + "')?$expand=ReportFleetStockNvg,StockHeadToDataNvg";
	var fncSuccess = function(oData, oResponse) {
		
	//change sumit 27012020 code only on wheel
		for(var i=0; i<oData.ReportFleetStockNvg.results.length; i++){
			if(oData.ReportFleetStockNvg.results[i].HubName == "Own Wheel"){
					self.getView().byId("idOWH").setText(oData.ReportFleetStockNvg.results[i].Count).addStyleClass("onwheel");
					
					oData.ReportFleetStockNvg.results[i].Count = "";
					oData.ReportFleetStockNvg.results[i].HubName = "";
					/*delete oData.ReportFleetStockNvg.results[i];
					oData.ReportFleetStockNvg.results.length = (oData.ReportFleetStockNvg.results.length - 1);*/
				}
		}
		
		self.Data = oData.ReportFleetStockNvg;
		jsonModel.setData(oData.ReportFleetStockNvg.results);
		
		tableModel.setData(oData.StockHeadToDataNvg.results);
		self.FunVizProperties();
		if(oData.StockHeadToDataNvg.results.length==0){
			sap.m.MessageToast.show("No Data found");
		}
		gv_busyindicator.close();
		
	}
	var fncError = function(oError) { // error callback
		
		var parser = new DOMParser();
		var message = parser.parseFromString(oError.response.body, "text/xml")
			.getElementsByTagName("message")[0].innerHTML
				sap.m.MessageBox.show(message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
				});
		}
		
	oReadModel.read(path, {
		success : fncSuccess,
		error : fncError
	});
//this.getView().byId("table").setVisible(true);
	var router = sap.ui.core.UIComponent.getRouterFor(this);
		if (this.clear === true) {
			this.myChart.destroy();
		}
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
itemPress : function(e){
	var a = 1;
	var router = sap.ui.core.UIComponent.getRouterFor(this);
	var hub = e.getParameters().listItem.getCells()[0].getText();
	this.hubName = e.getParameters().listItem.getCells()[1].getText();	
		router.navTo("page2",{hub : hub},true);
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onSelect : function(oEvt){
	
	gv_busyindicator.open();
	//var lvData = oEvt.getParameter("data")[0];
	//var Lv_hubName = lvData.data.HubName
	
	var getVizid = this.getView().byId("oVizFrame0");
	var VizContextnumber = getVizid.vizSelection()[0].data._context_row_number;
	var Vizdata = oEvt.getSource().getParent().getModel("jsonModel").getData()[VizContextnumber];
	
	var lv_hubName = Vizdata.HubName;
	var lv_hubCode = Vizdata.HubCode;
	
	
	var selectedData={}; 
	selectedData.lv_hubName = lv_hubName;
	selectedData.lv_hubCode = lv_hubCode;
	selectedData.lv_Kunnr = this.fleetNam;
	selectedData.lv_fleetName = fleetName;
	selectedData.lv_fleet = this.UniqFleet ;
	selectedData.lv_NonFleet = this.UniqNonFleet;
	
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	gv_busyindicator.close();
	debugger
	oRouter.navTo("View1",{"entity":JSON.stringify(jsonstring)});
},
GO: function(oEvt){
	
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View1",{"entity":JSON.stringify(jsonstring)});
	
} ,	

FunVizProperties : function(){
	
	var oVizFrame = this.getView().byId("oVizFrame0");
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
							visible:false
						},
						
						valueAxis: {
							title: {
								visible: false // Hide title from Y-Axis
							},
							visible: true,
							axisLine: {
								visible: false // Hide line from Y-Axis
							},
							label: {
								linesOfWrap: 2,
								visible: false, //Hide Measurement line 
								style: {
									fontSize: "10px"	
								}
							}
						},
						
						
						categoryAxis: {
							title: {
								visible: false // Hide title from x-Axis
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
							text: "Hub Wise Stock",
							visible: true
						},
						
						
						legend: {
							visible: false
						},
						
			
						
			plotArea: {
				colorPalette: ["rgb(0, 113, 128)"], //Dimension Color
				gridline: {
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
				
				dataPointStyleMode: "update",
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
				}
				
				
				
			},
			
			
		};

	oVizFrame.setVizProperties(vizProperties);
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/									
onDownload1 : sap.m.Table.prototype.exportData || function(oEvent) {
	 
	 var oExport = new sap.ui.core.util.Export({
	 exportType : new sap.ui.core.util.ExportTypeCSV({
	 separatorChar: "\t",
	 mimeType: "application/vnd.ms-excel",
	 charset: "utf-8",
	 fileExtension: "xls"
	}),
						       
						    
	 models : this.getView().getModel("tableModel"),
		 rows : {
		 path : "/",
	 },
					 	
	 columns: [
		 {
			name: "Stencil No.",
			template: {
			content: "{StnclNumber}"
			},								
		},
		 
		{
			name: "Tyre Company",
			template: {
			content: "{TypeCompDesc}"
			},								
		},
		
		{
			name: "Reg.No.",
			template: {
			content: "{RegNo}"
			},								
		},
		
		{
			name: "Material",
			template: {
			content: "{Maktx}"
			},								
		},

		{
			name: "Tyre Size",
			template: {
			content: "{SizeDesc}"
			},								
		},

		{
			name: "Customer No.",
				template: {
				content: "{Kunnr}"
				},								
		 },
		 
		{
			name: "Customer Name",
			template: {
			content: "{KunnrName}"
			},								
		},
	 	
		{
			name: "Hub Code",
			template: {
			content: "{HubCode}"
			},
		 },
		 
		 {
			name: "Hub Name",
			template: {
			content: "{HubName}"
			},
		 },
		 
		 {
				name: "KM Covered",
				template: {
				content: "{KmCovered}"
				},								
			},
		 
			{
				name: "Tyre Type",
				template: {
				content: "{TyreType}"
				},								
			},
		 
			{
				name: "Tyre Location",
				template: {
				content: "{TyreLoc}"
				},								
			},
			
			
			{
				name: "IP Condition",
				template: {
				content: "{IpCondition}"
				},								
			},
			
			{
				name: "IP psi",
				template: {
				content: "{IpPsi}"
				},								
			},
			
			{
				name: "Original NSD",
				template: {
				content: "{OrigNsd}"
				},								
			},
		 
			{
				name: "G1NSD",
				template: {
				content: "{G1Nsd}"
				},								
			},
			
			{
				name: "G2NSD",
				template: {
				content: "{G2Nsd}"
				},								
			},
			
			{
				name: "G3NSD",
				template: {
				content: "{G3Nsd}"
				},								
			},
			
			{
				name: "G4NSD",
				template: {
				content: "{G4Nsd}"
				},								
			},
		 
			{
				name: "Fitment Date",
				template: {
				content: "{path:'FitDate',formatter:'zstockreport.util.Formatter.date1'}"
				},								
			},
			
			{
				name: "Last Insp. Date",
				template: {
				content: "{path:'LastInspDate',formatter:'zstockreport.util.Formatter.date1'}"
				},								
			},
		 
	 ]

});
	 //* download exported file

	oExport.saveFile().always(function() {
		this.destroy();
	});
},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/									
});
});
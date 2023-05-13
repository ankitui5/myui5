var gv_kunnr,gv_hubName,gv_hubcode,gv_fleetName, gv_fleet,gv_NonFleet,TyreLocation,gv_busyindicator,
    ReportItemLocModel,ReportItemTypeModel,StockHubDataModel;
sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/util/Export", 
	"sap/ui/core/util/ExportTypeCSV",
	/*"sap/ui/export/Spreadsheet",*/
	"zstockreport/util/Formatter"
	], 
	
function(MessageBox,MessageToast,Export,ExportTypeCSV, Controller,Formatter) {
	
return sap.ui.controller("zstockreport.view.View1", {
	/** 
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf zsumitapss.View1
	 */
	//	onInit: function() {
	//
	//	},
	onInit : function() {
		
		gv_busyindicator = new sap.m.BusyDialog();
		var oSmartTable = this.getView().byId("table1");
		oSmartTable.setSelectionMode("None"); //remove check box from rows.
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("View1").attachMatched(this._onRoute, this);
						
	},
	

_onRoute : function(e){
	
	var that = this;
	var tempjsonString = e.getParameter("arguments").entity;
	var jsonstring = tempjsonString.replace(/@/g, "/");
	var tempSelectedData = JSON.parse(jsonstring);
	this.SelectedData  = JSON.parse(tempSelectedData);
	var lv_Data = this.SelectedData;
	gv_fleetName = lv_Data.lv_fleetName;
	gv_kunnr =  lv_Data.lv_Kunnr;
	gv_hubName = lv_Data.lv_hubName;
	gv_hubcode = lv_Data.lv_hubCode;
	gv_fleet =  lv_Data.lv_fleet;
	gv_NonFleet = lv_Data.lv_NonFleet;
	this.FunGet1stChartData();
},		
	
FunGet1stChartData : function(){	
	var that = this;
	gv_busyindicator.open();
	that.getView().byId("idPage").setTitle(gv_fleetName +"("+ gv_hubName +")");
	ReportItemLocModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(ReportItemLocModel,"ReportItemLocModel");
	
	ReportItemTypeModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(ReportItemTypeModel,"ReportItemTypeModel");
	
	StockHubDataModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(StockHubDataModel,"StockHubDataModel");
	
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});										
	var fncSuccess = function(oData, oResponse){
		
		ReportItemTypeModel.setData(oData.ReportItemTypeNvg.results); //first graph
		ReportItemLocModel.setData(oData.ReportItemLocNvg.results);//Secound graph
		StockHubDataModel.setData(oData.StockHubDataNvg.results) //Table Data
		that.FunVizProperties();
		gv_busyindicator.close();
	
	
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
			
	debugger
	   oReadModel.read("/ReportFleetStockItemSet(Kunnr='"+gv_kunnr+"',HubCode='"+gv_hubcode+"',Fleet='"+gv_fleet+"',NonFleet='"+gv_NonFleet+"')?$expand=ReportItemTypeNvg,ReportItemLocNvg,StockHubDataNvg", {
			success : fncSuccess,
		    error : fncError
		});
	 
},
FunVizProperties : function(){
	
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
							text: "Tyre Type Wise Stock",
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
	
	
	var oVizFrame2 = this.getView().byId("oVizFrame2");
	oVizFrame2.setModel(ReportItemTypeModel, "ReportItemTypeModel");
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
				text: "Location Wise Stock",
				visible: true
			},
			
			
			legend: {
				visible: false
			},
			

			
plotArea: {
	colorPalette: ["rgb(140, 113, 175)"], //Dimension Color
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
			"dataContext": {
				"TyreLoc": {
					equal: "FRS"
				}
			},
			"properties": {
				"color": "yellow"
			},
			
		},
		{
			"dataContext": {
				"TyreLoc": {
					equal: "OWH"
				}
			},
			"properties": {
				"color": "#cdcdcd"
			},
			
		},
		{
			"dataContext": {
				"TyreLoc": {
					equal: "CTR"
				}
			},
			"properties": {
				"color": "#666666"
			},
			
		},
		{
			"dataContext": {
				"TyreLoc": {
					equal: "RSU"
				}
			},
			"properties": {
				"color": "red"
			},
			
		}]
	}
	
},

};
	oVizFrame2.setVizProperties(vizProperties2);
		
},

/**********************************************************************************************************************/

onSelectStock:function(Evt){
	
	gv_busyindicator.open();
	var that = this;
	var getVizid = this.getView().byId("oVizFrame1");
	var VizContextnumber = getVizid.vizSelection()[0].data._context_row_number;
	var Vizdata = Evt.getSource().getParent().getModel("ReportItemTypeModel").getData()[VizContextnumber];
	//var lvData = Evt.getParameter("data")[0];
	var TyreType = Vizdata.TyreType

		
	ReportItemLocModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(ReportItemLocModel,"ReportItemLocModel");
	
	StockHubDataModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(StockHubDataModel,"StockHubDataModel");
		
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});										
	var fncSuccess = function(oData, oResponse){
		
		ReportItemLocModel.setData(oData.HubHeadToItemStockNvg.results);//Secound graph
		StockHubDataModel.setData(oData.StockItemToDataNvg.results) //Table Data
		
		if(oData.StockItemToDataNvg.results.length==0){
			sap.m.MessageToast.show("No Data found");
		}
		//that.FunVizProperties();
		gv_busyindicator.close();
	
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
			
	
	   oReadModel.read("/ReportFleetHubStockHeadSet(Kunnr='"+gv_kunnr+"',Fleet='"+gv_fleet+"',NonFleet='"+gv_NonFleet+"',HubCode='"+gv_hubcode+"',TyreType='"+TyreType+"')?$expand=HubHeadToItemStockNvg,StockItemToDataNvg", {
			success : fncSuccess,
		    error : fncError
		});
},
/**********************************************************************************************************************/

onSelectLocation : function(Evt){
	
	gv_busyindicator.open();
	var that = this;
	var getVizid = this.getView().byId("oVizFrame2");
	var contextnumber = getVizid.vizSelection()[0].data._context_row_number;
	var VizContextData = Evt.getSource().getParent().getModel("ReportItemLocModel").getData()[contextnumber];
	//var lvData = Evt.getParameter("data")[0];
	var TyreType = VizContextData.TyreType;
	var TyreLocation = VizContextData.TyreLoc;
		
	
	StockHubDataModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(StockHubDataModel,"StockHubDataModel");
		
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oReadModel.setHeaders({"Content-Type" : "application/json"});										
	var fncSuccess = function(oData, oResponse){
		
		
		StockHubDataModel.setData(oData.StockLocToDataNvg.results) //Table Data
		if(oData.StockLocToDataNvg.results.length==0){
			sap.m.MessageToast.show("No Data found");
		}
		//that.FunVizProperties();
		gv_busyindicator.close();
	
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
			
	
	   oReadModel.read("/ReportFleetHubStockItemSet(Kunnr='"+gv_kunnr+"',HubCode='"+gv_hubcode+"',Fleet='"+gv_fleet+"',NonFleet='"+gv_NonFleet+"',TyreType='"+TyreType+"',TyreLoc='"+TyreLocation+"')?$expand=StockLocToDataNvg", {
			success : fncSuccess,
		    error : fncError
		});
},
/**********************************************************************************************************************/
onDownload2 : sap.m.Table.prototype.exportData || function(oEvent) {
	 
	 var oExport = new sap.ui.core.util.Export({
	 exportType : new sap.ui.core.util.ExportTypeCSV({
	 separatorChar: "\t",
	 mimeType: "application/vnd.ms-excel",
	 charset: "utf-8",
	 fileExtension: "xls"
	}),
						       
						    
	 models : this.getView().getModel("StockHubDataModel"),
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
/**********************************************************************************************************************/
onBack:function(){
	
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View");
	//window.history.back();
},
	
/**********************************************************************************************************************/	


});
});
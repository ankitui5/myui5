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
		var that
return sap.ui.controller("zfmgrpdashboard.view.View1", {

			onInit : function() {
				debugger
				var that = this;
				//this.asyncChartUpdate1();//remove title of first chart
				//this.asyncChartUpdate2();//remove title of secound chart
				
			},
				
			onAfterRendering :function(){
				var that = this;
				if (!that._InitialDialog) {
				       that._InitialDialog = sap.ui.xmlfragment("zfmgrpdashboard.view.Intial", that);
				       }
					that._InitialDialog.open();
			},
			
			onFleetOkButton:function(){
				 this.FTChartCount();
				 this._InitialDialog.close();
				 this._InitialDialog.destroy(); 
				 this._InitialDialog=undefined;
			},
			
			
			onFleetCloseCancel:function(){
				this._InitialDialog.close();
				this._InitialDialog.destroy(); 
				this._InitialDialog=undefined;
				window.history.back();
			},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			onFleetFragment: function(evt) {
				debugger
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
					this.Kunnr = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
					debugger;
					this.CustomerValue.setValue(oSelectedItem.getTitle());
					
				}
			},		
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

FTChartCount : function(){
	debugger
	var user = new sap.ushell.services.UserInfo();
	var uid = user.getId();
	var that = this;
	var oViewObj = this.getView();
	var FTChartData = oViewObj.getModel("FitmentChartData");
	if (!FTChartData) {
		FTChartData = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(FTChartData, "FTChartData");
	}
	
	var oViewObj = this.getView();
	var PlanDetalCountJmodel = oViewObj.getModel("PlanDetalCountJmodel");
	if (!PlanDetalCountJmodel) {
		PlanDetalCountJmodel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PlanDetalCountJmodel, "PlanDetalCountJmodel");
	}
	/*/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/PlanDetailCountSet(Uname='')?$expand=PlanDetailCountNvg*/ 
	var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/"; 
	var sPathCartListSet = "PlanDetailCountSet(Uname='uid')?$expand=PlanDetailCountNvg";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) { // success handler
		debugger;
		FTChartData.setData(oData);
		PlanDetalCountJmodel.setData(oData.PlanDetailCountNvg.results);
		that.FunVizProperties();
		//that.bindPlanNvgData();
	};
	oParamsCartListSet.error = function(oError) { // error handler&nbsp;
		jQuery.sap.log.error("read publishing group data failed");
		sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	};
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
	});
},

	
/*bindPlanNvgData : function(){
	debugger
	var PlanDetalCount = this.getView().getModel("FTChartData");
	var plantData = PlanDetalCount.getData();
	
	var oViewObj = this.getView();
	var PlanDetalCountJmodel = oViewObj.getModel("PlanDetalCountJmodel");
	if (!PlanDetalCountJmodel) {
		PlanDetalCountJmodel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PlanDetalCountJmodel, "PlanDetalCountJmodel");
	}
	
	PlanDetalCountJmodel.setData(plantData.PlanDetailCountNvg.results);
},*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*asyncChartUpdate1 : function() {
	debugger
	var oChart1 = this.getView().byId("oVizFrame1");
    oChart1.setVizProperties({
        title: {
            text: ""
        }
    });
},

asyncChartUpdate2 : function() {
	debugger
	var oChart2 = this.getView().byId("oVizFrame2");
    oChart2.setVizProperties({
        title: {
            text: ""
        }
    });
},*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
FunVizProperties:function(){
	debugger
	//var legend = this.getView().byId("oVizFrame2").getLegendGroup()
	
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
						text: "Total Request Summary",
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
//oVizFrame2.setModel(ReportItemTypeModel, "ReportItemTypeModel");
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
			text: "Plant Wise Summary",
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
},

};
oVizFrame2.setVizProperties(vizProperties2);
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
})
});
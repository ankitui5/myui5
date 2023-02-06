jQuery.sap.require("zrmaps.Resources_Chart.Chart");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
var that;

sap.ui.define([ "sap/ui/core/mvc/Controller", 'sap/m/MessageToast' ],
		function(Controller, MessageToast) {
			"use strict";
	sap.ui.controller("zrmaps.view.View4",{
		Data : "",
		myChart : "",
		clear : false,
		o : false,
 
		/**
		 * Called when a controller is
		 * instantiated and its View controls
		 * (if available) are already created.
		 * Can be used to modify the View before
		 * it is displayed, to bind event
		 * handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf zrmapss.View
		 */									
onInit : function() {
			debugger
			window.singleFleet = "";
			window.UniqFleet = "";
			window.UniqNonFleet = "";
			window.EnrolMode = "";
			window.fleetNam="";
			jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zrmaps.view.style",".css"));

			this.model = this.getOwnerComponent().getModel();
				if (!jQuery.support.touch) {
						this.getView().addStyleClass("sapUiSizeCompact");
				}
				
				if (sap.ui.Device.system.desktop) {

					}
					
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("View4").attachMatched(this._onRoute, this);
					
},	
/***********************************************************************************************************/
_onRoute: function(){
	debugger
	Chart.defaults.global.defaultFontSize = 20;
	
	// Define a plugin to provide data labels
	  Chart.plugins.register({
		afterDatasetsDraw: function(chart) {
		    var ctx = chart.ctx;
		    	chart.data.datasets.forEach(function(dataset, i) {
				    var meta = chart.getDatasetMeta(i);
				     if (!meta.hidden) {
				    	 meta.data.forEach(function(element, index) {
				    	 // Draw the text in black, with the specified font
				    		 ctx.fillStyle = 'rgb(247, 249, 247)';
				    		 var fontSize = 18;
				    		 var fontStyle = 'normal';
				    		 var fontFamily = 'Helvetica Neue';
				    		 	ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
				    		 // Just naively convert to string for now
				    		 var dataString = dataset.data[index].toString();
				    		 // Make sure alignment settings are correct
				    		 	ctx.textAlign = 'center';
				    		 	ctx.textBaseline = 'middle';
				    		 var padding = 5;
				    		 var position = element.tooltipPosition();
				    		 	ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
				        });
				     }
		    	});
		 }
	 });
},										

/********************************************************************************************************/
showChart : function(e) {
	debugger
	var self = this;
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(
			sServiceUrl);
	oReadModel.setHeaders({
		"Content-Type" : "application/json"
	});
	self.jsonModel = new sap.ui.model.json.JSONModel();
	var path = "/DealerClaimCountSet";
	var fncSuccess = function(oData, oResponse) {
		debugger
		if (oData.results.length === 0) {	

		} else {
			self.Data = oData.results;
			self.jsonModel.setData(self.Data);
			var arr  = oData.results;
			var Count = [];
			var Name = [];

			for (var i=0;i<arr.length;i++) {
				  Count.push(arr[i].Count); 
				  Name.push(arr[i].StatusDesc);
			}
			
			self.Chart(Count , Name)
		}
		
		self.bindTable();
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
	oReadModel.read(
			path, {
				success : fncSuccess,
				error : fncError
			});
	var router = sap.ui.core.UIComponent
			.getRouterFor(this);

	var _self = this;

	if (this.clear === true) {

		this.myChart.destroy();

	}
},
/********************************************************************************************************/
Chart : function(x,y) {
	debugger
	var router = sap.ui.core.UIComponent
	.getRouterFor(this);
	
	var canvas = document
	.getElementsByClassName("my_chart001")[0];
var ctx = canvas.getContext("2d");
Chart.defaults.global.animation.duration = 4000;

Chart.defaults.global.animation.easing = "easeOutBounce";

var myChart = new Chart(
	ctx,
	{
		type : "pie",
		data : {
			labels : y,
			datasets : [ {
				label : 'Claim Analysis',
				data : x,
				backgroundColor : [
						'rgba(255, 99, 32, 0.8)',
						'rgba(54, 162, 235, 0.8)',
						'rgba(255, 206, 86, 0.8)',
						'rgba(75, 192, 192, 0.8)',
						'rgba(153, 102, 255, 0.8)',
						'rgba(255, 159, 64, 0.8)' ],
				borderColor : [
						'rgba(255,99,132,4)',
						'rgba(54, 162, 235, 4)',
						'rgba(255, 206, 86, 4)',
						'rgba(75, 192, 192, 4)',
						'rgba(153, 102, 255, 4)',
						'rgba(255, 159, 64, 4)' ],
				borderWidth : 6
			} ],

			click : function(e) {
				alert("wrer");
			}
		},
		options : {
			
			onClick : function(
					a, b) {

				var chartLength = b.length;

				if (chartLength != 0) {
//
//					router
//							.navTo("page2");

				}

			},
			responsive : true,
			maintainAspectRatio : false,
			 legend: {
		            labels: {
		                // This more specific font property overrides the global property
		                fontColor: 'white'
		            }
		        },
			title : {
				display : true,
				text : 'Digital analysis for Claims'
			},
		}
	});
//this.bindTable();
	
this.clear = true;
},										
										
/********************************************************************************************************/										
onAfterRendering : function() {
	
	Chart.defaults.global.defaultFontColor = "#fff";
	
	Chart.defaults.global.animation.duration = 4000;
	
	Chart.defaults.global.animation.easing = "easeOutBounce";
	
	Chart.defaults.global.defaultFontSize = 18;
	
	
	var that = this;
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(
			sServiceUrl);
	oReadModel.setHeaders({
		"Content-Type" : "application/json"
	});
	var fncSuccess = function(oData, oResponse){
		debugger
		if(oData.results.length!=0 ){
			sap.m.MessageBox.show("Your not Registered to any Fleet", {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
				onClose:function(){
					window.history.back();
				}
				});	
		}else if(oData.results.length==1)
			{
			debugger;
			window.singleFleet = true;
			window.EnrolMode=oData.results[0].EnrolMode;
			that.Customer = oData.results[0].Kunnr;
			window.fleetNam = that.Customer;
		if(window.EnrolMode === "M"){
				
				that.FleetData=oData;
				if (!that._FleetDialog) {
				that._FleetDialog = sap.ui.xmlfragment(
						"zrmaps.view.Intial", that);
					that.getView().addDependent(that._FleetDialog);
					}
				
				sap.ui.getCore().byId("stockLbl").setVisible(true);
				sap.ui.getCore().byId("btnStock").setVisible(true);
				sap.ui.getCore().byId("btnStock1").setVisible(true);
				sap.ui.getCore().byId("btnStock2").setVisible(true);
				sap.ui.getCore().byId("fleetInput").setEnabled(false);
				sap.ui.getCore().byId("fleetInput").setValue(oData.results[0].FleetName);
				that._FleetDialog.open();
				
			}else{
				window.UniqFleet = "X";
				window.UniqNonFleet = "";
				if (!that._FleetDialog) {
					that._FleetDialog = sap.ui.xmlfragment(
							"zrmaps.view.Intial", that);
						that.getView().addDependent(that._FleetDialog);
						}
//				sap.ui.getCore().byId("lblFleet").setText(oData.results[0].FleetName);
				sap.ui.getCore().byId("stockLbl").setVisible(false);
				sap.ui.getCore().byId("btnStock").setVisible(false);
				sap.ui.getCore().byId("btnStock1").setVisible(false);
				sap.ui.getCore().byId("btnStock2").setVisible(false);
				sap.ui.getCore().byId("fleetInput").setEnabled(false);
				sap.ui.getCore().byId("fleetInput").setValue(oData.results[0].FleetName);
				that._FleetDialog.open();
				
			}
			
			
			
			
			}
		else{
			window.EnrolMode="M";
			that.FleetData=oData;
			if (!that._FleetDialog) {
			that._FleetDialog = sap.ui.xmlfragment(
					"zrmaps.view.Intial", that);
				that.getView().addDependent(that._FleetDialog);
				}
			
			
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
	that.showChart();
	// Define a plugin to provide data labels
	  Chart.plugins.register({
	   afterDatasetsDraw: function(chart) {
	    var ctx = chart.ctx;
	    chart.data.datasets.forEach(function(dataset, i) {
	     var meta = chart.getDatasetMeta(i);
	     if (!meta.hidden) {
	      meta.data.forEach(function(element, index) {
	       // Draw the text in black, with the specified font
	       ctx.fillStyle = 'rgb(247, 249, 247)';
	       var fontSize = 18;
	       var fontStyle = 'normal';
	       var fontFamily = 'Helvetica Neue';
	       ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
	       // Just naively convert to string for now
	       var dataString = dataset.data[index].toString();
	       // Make sure alignment settings are correct
	       ctx.textAlign = 'center';
	       ctx.textBaseline = 'middle';
	       var padding = 5;
	       var position = element.tooltipPosition();
	       ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
	      });
	     }
	    });
	   }
	  });
	
//
},										
/********************************************************************************************************/										
bindTable : function() {
    debugger
	var _self = this;
	

	var loTableBindingPath = "/ReportFleetHubStockHeadSet?$filter=Kunnr eq '12' and HubCode eq '12'&$expand=ReportFleetHubStockNvg";
	var loTable = this.getView().byId("table").setModel(_self.jsonModel);

	loTable.bindItems({
		path : "/",
		// filters : loFilter,
		template : new sap.m.ColumnListItem({
			cells : [ new sap.m.Text({
				visible : false,
				text : "{TyreType}"
			}), new sap.m.Text({
				text : "{TypeDesc}"
			}), new sap.m.Text({
				text : "{Count}"
			}) ]

		})
	});

	loTable.bindItems({
		path : "/",
		// filters : loFilter,
		template : new sap.m.ColumnListItem({
			type:"Active",
			cells : [ new sap.m.Text({
				visible : false,
				text : "{Status}"
			}), new sap.m.Text({
				text : "{StatusDesc}"
			}), new sap.m.Text({
				text : "{Count}"
			}) ]

		})
	});

}, 
/********************************************************************************************************/										
itemPress : function(e){
	debugger 
var router = sap.ui.core.UIComponent.getRouterFor(this);
var hub = e.getParameters().listItem.getCells()[0].getText();
window.hubName = e.getParameters().listItem.getCells()[1].getText();
router.navTo("View1",{hub : hub});

/*var selectedData={};
var tempjsonString = JSON.stringify(selectedData);
var jsonstring = tempjsonString.replace(/\//g, "@");
var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
oRouter.navTo("View1",{"entity":JSON.stringify(jsonstring)});*/
	
	
/*	var a = 1;
	var router = sap.ui.core.UIComponent
	.getRouterFor(this);
	var hub = e.getParameters().listItem.getCells()[0].getText();
	window.hubName = e.getParameters().listItem.getCells()[1].getText();
	router
	.navTo(
			"page2",
			{
				hub : hub
			},
			true);*/
}
										
/********************************************************************************************************/	
});
});
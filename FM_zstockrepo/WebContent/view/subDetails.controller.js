sap.ui.controller("ZSTOCKREPO.view.subDetails", {
	

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ZSTOCKREPOs.subDetails
*/
	onInit: function() {

		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"page3").attachMatched(this._onRoute, this);
	},
	
	_onRoute : function(e){
		this.getView().byId("subSetailsPage").setTitle(window.hubName + "-" + window.TyreName)
		
		var self = this;
		self.item = e.mParameters.arguments.sub;
		
		// bind Table
		self.jsonModel = new sap.ui.model.json.JSONModel();

		self.Data = window.BaseModel.getData();
		var oData = self.Data.results[self.item].ReportFleetHubStockNvg;
		var arr = oData.results;
		self.jsonModel.setData(oData);
		var loTable = this.getView().byId("table").setModel(
				self.jsonModel);

		loTable.bindItems({
			path : "/results",
			// filters : loFilter,
			template : new sap.m.ColumnListItem({
				cells : [ new sap.m.Text({
					visible:false,
					text : "{TyreType}"
				}), new sap.m.Text({
					text : "{TyreLoc}"
				}), new sap.m.Text({
					text : "{LocDesc}"
				}), new sap.m.Text({
					visible:false,
					text : "{TypeDesc}"
				})]

			})
		});
		// end
		
		var self = this;
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl);
		oReadModel.setHeaders({
			"Content-Type" : "application/json"
		});
		
		var path = "/ReportFleetStockHeadSet(Kunnr='" + window.fleetNam + "',Fleet='" + window.UniqFleet + "',NonFleet='" + window.UniqNonFleet + "')?$expand=ReportFleetStockNvg";
		var fncSuccess = function(oData, oResponse) {
			debugger
			if (oData.ReportFleetStockNvg.results.length === 0) {
				sap.m.MessageBox.show(
						"Your not Registered to any Fleet", {
							title : "Error",
							icon : sap.m.MessageBox.Icon.ERROR,
							onClose : function() {
								window.history.back();
							}
						});
			} else {
				self.jsonModel = new sap.ui.model.json.JSONModel();

				self.Data = window.BaseModel.getData();
				var oData = self.Data.results[self.item].ReportFleetHubStockNvg;
				var arr = oData.results;
				self.jsonModel.setData(oData);
				var Count = [];
				var Name = [];

				for (i = 0; i < arr.length; i++) {

					Count.push(arr[i].Count);
					Name.push(arr[i].LocDesc);

				}
				
				self.Chart(Count , Name)
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
		oReadModel.read(
				path, {
					success : fncSuccess,
					error : fncError
				});
//		this.getView().byId("table").setVisible(true);
		var router = sap.ui.core.UIComponent
				.getRouterFor(this);

		var _self = this;

		if (this.clear === true) {

			this.myChart.destroy();

		}

	

	},
	
	Chart: function(x,y){
		
		var router = sap.ui.core.UIComponent
		.getRouterFor(this);
		
		var canvas = document.getElementsByClassName("submy_chart2")[0];
		var ctx = canvas.getContext("2d");

		var myChart = new Chart(ctx, {
			type : "bar",
			data : {
				labels : y,
					datasets : [ {
						data : x,
						backgroundColor : [
								'rgba(255, 99, 32, 0.8)',
								'rgba(54, 162, 235, 0.8)',
								'rgba(255, 206, 86, 0.8)',
								'rgba(75, 192, 192, 0.8)',
								'rgba(153, 102, 255, 0.8)',
								'rgba(255, 159, 64, 0.8)' ],
						borderColor : [
								'rgba(255,99,132,1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 206, 86, 1)',
								'rgba(75, 192, 192, 1)',
								'rgba(153, 102, 255, 1)',
								'rgba(255, 159, 64, 1)' ],
						borderWidth : 5
					} ],

					click : function(e) {
						alert("wrer");
					}
				},
			options : {
				legend: {
		            display: false,
		            labels: {
		                fontColor: 'rgb(255, 99, 132)',
		                	fontSize: 15
		            }
		        },
				onClick : function(
						a, b) {

					var chartLength = b.length;

					if (chartLength != 0) {

//						router
//								.navTo("page2");

					}

				},
				responsive : true,
				maintainAspectRatio : false,
				scales : {
					yAxes : [ {
						ticks : {
							beginAtZero : true
						}
					} ]
				}
			}
		});
		
		this.bindTable();
		
	},
	
	bindTable : function() {

		var _self = this;

		var loTable = this.getView().byId("table").setModel(
				_self.jsonModel);

		loTable.bindItems({
			path : "/results",
			// filters : loFilter,
			template : new sap.m.ColumnListItem({
				cells : [ new sap.m.Text({
					visible : false,
					text : "{TyreType}"
				}), new sap.m.Text({
					visible:false,
					text : "{TyreLoc}"
				}), new sap.m.Text({
					text : "{LocDesc}"
				}), new sap.m.Text({
					visible:false,
					text : "{TypeDesc}"
				}), new sap.m.Text({
					text : "{Count}"
				})]

			})
		});



	},
	onBack : function(){
		
		
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		
		router
		.navTo(
				"page2",
				{
					hub : "qwe"
				},
				true);
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ZSTOCKREPOs.subDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ZSTOCKREPOs.subDetails
*/
	onAfterRendering: function() {
		
		


		
	},

/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf ZSTOCKREPOs.subDetails
 */
//	onExit: function() {
//
//	}

});
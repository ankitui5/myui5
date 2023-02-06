sap.ui.define([
	"sap/m/MessageBox",
	 "sap/ui/core/mvc/Controller",
     "sap/ui/model/json/JSONModel",
     "sap/viz/ui5/controls/common/feeds/FeedItem",
     "sap/viz/ui5/data/FlattenedDataset"
	],
	
function(Controller, JSONModel, FeedItem, FlattenedDataset) {
	"use strict";
return sap.ui.controller("zrmaps.view.View3", {
	 _selectedData: [],
	onInit : function() {
		debugger 
		 this.FitmentChartCount();
	},
	
/**********************************************************************************************************************/
	FitmentChartCount : function(){
		debugger
		var that = this;
		var oViewObj = this.getView();
		var FitmentChartData = oViewObj.getModel("FitmentChartData");
		if (!FitmentChartData) {
			FitmentChartData = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(FitmentChartData, "FitmentChartData");
		}
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/"; 
		var sPathCartListSet = "DealerClaimCountSet";
		var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var oParamsCartListSet = {};
		oParamsCartListSet.context = "";
		oParamsCartListSet.urlParameters = "";
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			debugger;
			FitmentChartData.setData(oData.results);
			that.setupChart();
		};
		oParamsCartListSet.error = function(oError) { // error handler&nbsp;
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
		frameworkODataModel.attachRequestCompleted(function() {
		});
	},

/**********************************************************************************************************************/
	setupChart: function() {
		debugger
	     var oDataset = new sap.viz.ui5.data.FlattenedDataset({
	            dimensions: [{
	              name: "Status",
	              value: "{Status}"
	            }, {
	              name: 'StatusDesc',
	              value: '{StatusDesc}'
	            }],
	            
	            measures: [{
	              name: 'Count',
	              value: '{Count}'
	            }],
	            
	            data: {
	              path: "/"
	            }
	          });

	          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
	              'uid': "valueAxis",
	              'type': "Measure",
	              'values': ["Count"]
	            }),
	            feedCategoryAxis = new sap.viz.ui5.controls.common.feeds. FeedItem({
	              'uid': "categoryAxis",
	              'type': "Dimension",
	              'values': ["Status"]
	            }),
	            feedColor = new sap.viz.ui5.controls.common.feeds. FeedItem({
	              'uid': "color",
	              'type': "Dimension",
	              'values': ["StatusDesc"]
	            });
	          var sampleDatajson = this.getView().getModel("FitmentChartData");
	         
	        /*  for(var i=0;i<sampleDatajson.oData.results.length;i++){
					delete sampleDatajson.oData.results[i].__metadata;
					
				}*/
	          
	          var oVizFrame = this.getView().byId("idVizFrame");
	           oVizFrame .setDataset(oDataset) .setModel(sampleDatajson)
	            .setVizProperties({
	              plotArea: {
	                dataLabel: {
	                  visible: true,
	                  formatString: "#,##0",
	                  showTotal: true
	                }
	              },
	              legend: {
	                title: {
	                  visible: false
	                }
	              },
	              title:{
	                visible: true,
	                text: ''
	                	
	              }
	            })

	           oVizFrame.addFeed(feedValueAxis)
	           oVizFrame.addFeed(feedCategoryAxis);
	           oVizFrame.addFeed(feedColor);

	    //this.getView().byId("idPopOver").connect(oVizFrame.getVizUid());
	  },
/**********************************************************************************************************************/
	/* _onRoute : function(e){
	    	debugger
	    	var tempjsonString = e.getParameter("arguments").entity;
			var jsonstring = tempjsonString.replace(/@/g, "/");
			var tempSelectedData = JSON.parse(jsonstring);
			this.SelectedData  = JSON.parse(tempSelectedData);
			this.onEnter(this.SelectedData.VarTicketNo);
	    },	*/
/*****************************************************************************************************************/
	onFrag : function(){
		debugger
		this._HelpDialogFrag = sap.ui.xmlfragment("zrmaps.view.MyFragments",this);
		this.getView().addDependent(this._HelpDialogFrag);
		this._HelpDialogFrag.open(); 
	},
	
	Oncancel : function(){
		this._HelpDialogFrag.close();
		this._HelpDialogFrag.destroy(true);
	},
/*****************************************************************************************************************/	

});
});
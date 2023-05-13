sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/m/UploadCollectionParameter"
	],
function( JSONModel,UploadCollectionParameter) {
"use strict";

var that;
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("zRequestCart.util.formatter");

sap.ui.controller("zRequestCart.view.View2", {
reqNumber : "",

	onInit: function() {
		that=this;
		that.docUploadArr = [];
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {

		}
		jQuery.sap
		.includeStyleSheet(jQuery.sap
				.getModulePath(
						"zRequestCart.css.style",
						".css"));
		sap.ui.core.UIComponent.getRouterFor(this).getRoute(
		"page2").attachMatched(this._onRoute, this);
		var tmpCurrDate = new Date();
		tmpCurrDate.setDate(tmpCurrDate.getDate() - 1);
		this.bindStageListSet();
		 
	   // start of document upload
		var attachmentModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentModel,"attachmentModel");
		attachmentModel.setData([]);
		
		var oUploadModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		
		this.getView().setModel(oUploadModel,"oUploadModel");
		// end of document upload
	
	},
	
		getCartDetails: function(selectedGuId,selectedrevno){
			debugger 
			var that1=this;
				var oViewObj = sap.ui.getCore();
				var cartListSetJModel = sap.ui.getCore().getModel("cartListSetJModel");
				
				if (!cartListSetJModel) {
					cartListSetJModel = new sap.ui.model.json.JSONModel();
					oViewObj.setModel(cartListSetJModel, "cartListSetJModel");
				}
				cartListSetJModel.refresh();
				var sPathCartListSet = "/TestRequestSet(ReqGuid='"+selectedGuId+"',Revno='"+selectedrevno+"')?$expand=RequestHeadtoItemNvg,RequestHeadtoVehicleNvg,RequestHeadtoCallNvg,RequestHeadtoUsageNvg";
				var frameworkODataModel = this.getOwnerComponent().getModel();
				var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
//				oParamsSiteListSet.filters = filters;
				oParamsCartListSet.urlParameters = "";
				oParamsCartListSet.success = function(oData, oResponse) { // success handler
					cartListSetJModel.setData(oData);
					that1.setProdCategory(oData.Market);
					that1.setNominal(oData.ProductCategory);
					that1.createDataModels();
					var eMode = false;
					that1.setEnableDisableAllFields(eMode);
					
				};
				oParamsCartListSet.error = function(oError) { // error handler 
					jQuery.sap.log.error("Read Publishing Group Data Failed");
					sap.m.MessageToast.show.show(JSON.parse(oError.responseText).error.message.value);
				};
				frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
				frameworkODataModel.attachRequestCompleted(function() {
					
				});
		},
		
		setProdCategory : function(market){
			var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4ProductCatSet?$filter=Market eq '"+market+"'";
			var jModel = new sap.ui.model.json.JSONModel(); 
			jModel.loadData(sPath, null, false, "GET", false, false, null);
			
			var mySelectMenu = this.getView().byId("selectProductCat"); 
			
			mySelectMenu.setModel(jModel,"ProdCatModel");	

		},
		
		setNominal : function(category){
			var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4WidthSizeSet?$filter=ProdCat eq '"+category+"'";
			var jModel = new sap.ui.model.json.JSONModel(); 
			jModel.loadData(sPath, null, false, "GET", false,false, null);
			
			var mySelectMenu = this.getView().byId("selectNominal"); 
			mySelectMenu.setEnabled(true);
			 
			mySelectMenu.setModel(jModel,"nominalModel");			
		},
		
		createDataModels: function(){
			var cartListSetJModel = sap.ui.getCore().getModel("cartListSetJModel");
			var data = cartListSetJModel.getData();
			
			var tyreDetailsModel = new sap.ui.model.json.JSONModel();
			var TyreDetailTable = this.getView().byId("TyreDetailTable");			
			if(data.RequestHeadtoItemNvg.results){
				tyreDetailsModel.setData(data.RequestHeadtoItemNvg.results);
				TyreDetailTable.setModel(tyreDetailsModel).bindRows("/");
				var TyreDetailTableCount = TyreDetailTable.getModel().getData().length;
				TyreDetailTable.setVisibleRowCount(TyreDetailTableCount);
			}
			if(data.RequestHeadtoVehicleNvg.results){
				var vehicleTable = this.getView().byId("vehiclDetail");	
				var usageModel = new sap.ui.model.json.JSONModel();
				usageModel.setData(data.RequestHeadtoVehicleNvg.results);
				vehicleTable.setModel(usageModel).bindRows("/");
				var UsageTyreDetailTableCount = vehicleTable.getModel().getData().length;
				vehicleTable.setVisibleRowCount(UsageTyreDetailTableCount);
			}
			if(data.RequestHeadtoCallNvg.results){
				var callbackTable = this.getView().byId("CALLBACKDetail");	
				var callbackModel = new sap.ui.model.json.JSONModel();
				callbackModel.setData(data.RequestHeadtoCallNvg.results);
		        callbackTable.setModel(callbackModel).bindRows("/");
		        var callBackTableCount = callbackTable.getModel().getData().length;
		        callbackTable.setVisibleRowCount(callBackTableCount);
			}
			
//			Bind Header details
			var Plant = this.getView().byId("selectPlant");
			var Market = this.getView().byId("selectMarket");
			var PorodCat = this.getView().byId("selectProductCat");
			var NominalSec = this.getView().byId("selectNominal");
			var testCat = this.getView().byId("selectTestcat");
//			var prodtyp = this.getView().byId("selectProdTyre");
			var testReq = this.getView().byId("selectTestreq");
			var testObj = this.getView().byId("selectTestObj");
			var testMeth = this.getView().byId("selectTestMethod");
			var testType = this.getView().byId("selectTesttype");
			var Modification = this.getView().byId("longTxt");
			Plant.setSelectedKey(data.Werks);
			Market.setSelectedKey(data.Market);
			PorodCat.setSelectedKey(data.ProductCategory);
			NominalSec.setSelectedKey(data.ProdSize);
			that.tyreDetail_Size = data.YDesc;
			testCat.setSelectedKey(data.TestCategory);
//			prodtyp.setSelectedKey();
			testReq.setSelectedKey(data.TestRequirement);
			testObj.setSelectedKey(data.TestObjective);
			testMeth.setSelectedKey(data.TestMethodology);
			testType.setSelectedKey(data.TestType);
			Modification.setValue(data.Modifications);

			
//			bind tyre availability details
			var tyreProdDateInp = this.getView().byId("tyreProdDateInp");
			var selectProjctStatus = this.getView().byId("selectProjctStatus");
			var projctstatusInp = this.getView().byId("projctstatusInp");
			var expectedPlantDateInp = this.getView().byId("expectedPlantDateInp");
			var dispatchDateInp = this.getView().byId("dispatchDateInp");
			var availabilityDateInp = this.getView().byId("availabilityDateInp");
			var commencementDateInp = this.getView().byId("commencementDateInp");
			var longTxt2 = this.getView().byId("longTxt2");
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
			tyreProdDateInp.setValue(dateFormat.format(data.ProductionDate));
			projctstatusInp.setValue(dateFormat.format(data.ProjectStatusDate));
			expectedPlantDateInp.setValue(dateFormat.format(data.PlantDate));
			dispatchDateInp.setValue(dateFormat.format(data.AvailabilityDate));
			availabilityDateInp.setValue(dateFormat.format(data.AvailabilityDate));
			commencementDateInp.setValue(dateFormat.format(data.TestCommencementDate));
			selectProjctStatus.setSelectedKey(data.ProjectStatus);
			longTxt2.setValue(data.SpecialComments);
			
			
			var ls = this.getView().byId("loadsegment");
			var bTokens = [];
			if (data.RequestHeadtoUsageNvg.LoadSegment !== "") {
				var aPlanGrp = data.RequestHeadtoUsageNvg.LoadSegment.split("@");
				ls.setSelectedKeys(aPlanGrp);
			}
				
			this.getView().byId("recPsi").setValue(data.RequestHeadtoUsageNvg.IpPsi);
			this.getView().byId("fitmntRim").setValue(data.RequestHeadtoUsageNvg.FitmentRimRecommended);
			this.getView().byId("FitmentAlt").setValue(data.RequestHeadtoUsageNvg.FitmentRimAlternate);
			
		},
/*		onAfterRendering: function(){
			var testcatg = this.getView().byId("selectTestcat").getSelectedKey();
			var tbl=that.getView().byId("TyreDetailTable");
        	var len= tbl.getRows().length;
        	for(var i=0;i<len;i++){
        		var row = tbl.getRows()[i];
        		
        		if(testcatg == "05"){
        			row.getCells()[28].setVisible(true);
        			row.getCells()[29].setVisible(true);
        		}
        		if(i==0){
					row.getCells()[29].setEnabled(false);
					row.getCells()[30].setEnabled(false);
				}
        	}
// Added on April 15
        	var UsageTbl = that.getView().byId("vehiclDetail");
        	if( this.getView().byId("idEdit").getVisible() == false )
			{
	        	for(var i=0; i< UsageTbl.getRows().length;i++){
					var rows = UsageTbl.getRows();
					for(var v = 0 ; v<rows.length ; v++){
						var cell= rows[v].getCells();
						
						for(var c = 0 ; c<cell.length ; c++){
							cell[c].setEnabled(true);
						}
					}
				}
			}
//        	
		},*/
//		code added by hans on 12-18-2018
		setButtonVisibility: function(){
			this.getView().byId("idBackBtn").setVisible(true);
			this.getView().byId("UICreateTableAddItemButton").setVisible(false);	
			this.getView().byId("UICreateTableAddItemButtonUsage").setVisible(false);	
			this.getView().byId("UICreateTableAddItemButtonCallback").setVisible(false);
			this.getView().byId("idEdit").setVisible(true);
			
			this.getView().byId("saveBtn").setVisible(false);
			this.getView().byId("CancelBtn").setVisible(false);
		},
		
		_onRoute : function(e){
			var that = this;
			that.initialLoad = true;
			this.setButtonVisibility();
			var tabBar= this.getView().byId("idTestReqCreateTabBar");
			tabBar.setSelectedKey("testRequire");
			var tempjsonString = e.getParameter("arguments").entity;
			var jsonstring = tempjsonString.replace(/@/g, "/");
			var tempSelectedData = JSON.parse(jsonstring);
			var SelectedData  = JSON.parse(tempSelectedData);
			this.getView().byId("idReq").setText("Request No. : "+SelectedData.reqId);
			this.ReqGuid = SelectedData.gUid;
			this.RevNo = SelectedData.revno;
			this.getCartDetails(SelectedData.gUid,SelectedData.revno);
			
//			
			this.getAttachmentDetails(SelectedData.gUid);  				// document upload
//			
			debugger
			var e = 1;
			this.tyreDetails=[];
			var tyreDetailData = this.getTyreDetailsObject();
			var TyreDetailTable = this.getView().byId("TyreDetailTable");

		
			TyreDetailTable.addEventDelegate({
				
	        	onAfterRendering :function(){
	        		var alpha=65;
	            	var tbl=that.getView().byId("TyreDetailTable");
	            	var len= tbl.getRows().length;
	            	var colslen= tbl.getRows()[0].getCells().length;
	            	tbl.getRows()[0].getCells()[1].setSelectedKey("01");
	            	tbl.getRows()[0].getCells()[1].setEnabled(false);
	            	
	            	//tbl.getRows()[0].getCells()[colslen-1].setVisible(false); PG
	            	tbl.getRows()[0].getCells()[31].setVisible(false);
	    	
	            	for(var i=0;i<len;i++){
	            		var row = tbl.getRows()[i];
	            		row.getCells()[0].setText(i+1);
	            		row.getCells()[3].setText(String.fromCharCode(alpha++));
	            		
	            		if(row.getCells()[10].getValue() == "0"){
		            		row.getCells()[10].setValue();
		            		}
	            		
	            		if(!that.initialLoad){	
		            		if(row.getCells()[14].getSelectedKey()!== ""){
		            			row.getCells()[14].setEnabled(true);
		            		}
	            		}
	            		
	            		if(!that.initialLoad){
	            		for(var j=15;j<=20;j++){
	            			if(row.getCells()[j].getValue() !=="" && parseInt(row.getCells()[j].getValue()) > 0){
	            				row.getCells()[j].setEnabled(true);
	            			}else{
	            				row.getCells()[j].setEnabled(false);
	            			}
	            			}
	            		}
	            		
	            		if(row.getCells()[1].getSelectedKey()=="01"){
	            			row.getCells()[5].setShowValueHelp(true);
	            			row.getCells()[11].setEnabled(true);
	            		}else{
	            			row.getCells()[11].setEnabled(false);
	            			row.getCells()[11].setSelectedKey("");
	            			row.getCells()[5].setShowValueHelp(false);
	            		}
	            		
	              		debugger
	        			var testcat1 = that.getView().byId("selectTestcat").getSelectedKey();            		
	            		var ftpqty 	 = tbl.getRows()[i].getCells()[33].getValue();
	            		
	            		tbl.getRows()[i].getCells()[29].setEnabled(false);
	            		
	        			if(testcat1 == "05"){
	        				tbl.getRows()[i].getCells()[28].setEnabled(true);
	        			}else{
	        				tbl.getRows()[i].getCells()[28].setEnabled(false);
	        			}
	            		
	            		if(parseInt(ftpqty)>0){
	            			tbl.getRows()[i].getCells()[31].setEnabled(false);
	            		}else{
	            			tbl.getRows()[i].getCells()[31].setEnabled(true);
	            		}
	            	}
	            	
//	            	disable fields on initial load
	            	if(that.initialLoad){
	            			var mode= false;
			        		var TyreDetailTable = that.getView().byId("TyreDetailTable");
			    			var rows2 = TyreDetailTable.getRows();
			    			for(var d=0;d<rows2.length;d++){
			    				var cell2= rows2[d].getCells();
			    				
			    				for(var e = 1 ; e<cell2.length-1;e++){
			    					if(e!==3){
			    						cell2[e].setEnabled(mode);
			    					}
			    					if(cell2.length-1){
			    						cell2[cell2.length-1].setEnabled(mode);
			    					}
			    				}
			    			}
	            		}
	            	tbl.getRows()[0].getCells()[11].setEnabled(false);
	            	 }
	        	});
			
	// for usage

	        this.usageDetails = [];
	        var UsageTbl = that.getView().byId("vehiclDetail");
			UsageTbl.addEventDelegate({
	        	onAfterRendering :function()
	        	{
	        		debugger
	        		var UsageTbl = that.getView().byId("vehiclDetail");
	        		
// Added on April 15
	   			 if( that.getView().byId("idEdit").getVisible() == false )
	   				{
	   		        	for(var i=0; i< UsageTbl.getRows().length;i++){
	   						var rows = UsageTbl.getRows();
	   						for(var v = 0 ; v<rows.length ; v++){
	   							var cell= rows[v].getCells();
	   							
	   							for(var c = 0 ; c<cell.length ; c++){
	   								cell[c].setEnabled(true);
	   							}
	   						}
	   					}
	   				}		
//	   			        		
	        		if(!that.initialLoad){
		        		for(var i=0; i< UsageTbl.getRows().length;i++)
		        		{
		    				var key =UsageTbl.getRows()[i].getCells()[5].getSelectedKey();
		    				UsageTbl.getRows()[i].getCells()[6].setEnabled(true);
		    	/*			if(key === "02")
		    				{
		    					UsageTbl.getRows()[i].getCells()[6].setEnabled(true);
		    				}else
		    				{
		    					UsageTbl.getRows()[i].getCells()[6].setEnabled(false);
		    				}*/
		    			}
	        		}
	        		
	        		
//	            	disable fields on initial load by ram 
	            	if(that.initialLoad){
	            			var mode= false;
			        		var UsageTbl = that.getView().byId("vehiclDetail");	 
			    			var rows2 = UsageTbl.getRows();
			    			for(var d=0;d<rows2.length;d++){
			    				var cell2= rows2[d].getCells();			    				
			    				for(var e = 0 ; e<cell2.length;e++){
			    					cell2[e].setEnabled(mode);			    					
			    				}
			    			}
	            		}	
	        	}
			});
	
			
	        // for callBack

			 this.callBackDetails = [];	        
		        var UsageTbl = that.getView().byId("CALLBACKDetail");
		        var rows1 = UsageTbl.getRows();
		        
				UsageTbl.addEventDelegate({
		        	onAfterRendering :function()
		        	{
		        		
		        		debugger
				        var UsageTbl = that.getView().byId("CALLBACKDetail");
				        var rows1 = UsageTbl.getRows();
				        
		        		if(!that.initialLoad){
			        		if(!that.initialLoad){
				        		for(var i=0; i<rows1.length;i++)
				        		{
				        			var cell1= rows1[i].getCells();
				        			for(var b = 0 ; b<cell1.length;b++){
				        				cell1[b].setEnabled(true);
				        			}
				    			}
			        		}
		        		}
		        		
//		            	disable fields on initial load by ram 
		            	if(that.initialLoad){
		            			var mode= false;
				        		var callBckTbl = that.getView().byId("CALLBACKDetail");	 
				    			var rows2 = callBckTbl.getRows();
				    			for(var d=0;d<rows2.length;d++){
				    				var cell2= rows2[d].getCells();			    				
				    				for(var e = 0 ; e<cell2.length;e++){
				    					cell2[e].setEnabled(mode);			    					
				    				}
				    			}
		            		}	
		        	}
				});
			
			
		},
		
		setEnableDisableAllFields: function(mode){



//			Header fields
			var view = this.getView();
			var Modification = view.byId("longTxt");
			Modification.setEnabled(mode);
			
			var selects = [
				view.byId("selectMarket"),
				view.byId("selectProductCat"),
				view.byId("selectNominal"),
				view.byId("selectTestcat"),
				view.byId("selectProdTyre"),
				view.byId("selectTestreq"),
				view.byId("selectTestObj"),
				view.byId("selectTestMethod"),
				view.byId("selectTesttype")
			];
			jQuery.each(selects, function(i, input) {
				if (input) {
					input.setEnabled(false);
					
				}
			});
			
//		Tyre Availability Details fields	
			var projctStatus = view.byId("selectProjctStatus");
			projctStatus.setEnabled(mode)
			
			var inputs = [
			   			view.byId("tyreProdDateInp"),
			   			view.byId("projctstatusInp"),
			   			view.byId("expectedPlantDateInp"),
			   			view.byId("dispatchDateInp"),
			   			view.byId("availabilityDateInp"),
			   			view.byId("commencementDateInp"),
			   			view.byId("longTxt2"),
			   		];
			   		jQuery.each(inputs, function(i, input) {
			   			if (input) {
			   				input.setEnabled(mode);
			   			
			   			}
			   		});
			
//		Usage Details fields 	
			var loadSegm = view.byId("loadsegment");
			loadSegm.setEnabled(mode);
			
			var Usageinputs = [
				   			view.byId("recPsi"),
				   			view.byId("fitmntRim"),
				   			view.byId("FitmentAlt")
				   		];
				   		jQuery.each(Usageinputs, function(i, input) {
				   			if (input) {
				   				input.setEnabled(mode);
				   			}
				   		});
			debugger	   		
			var vehicleTable = this.getView().byId("vehiclDetail");	 
			var rows = vehicleTable.getRows();
			
			for(var v = 0 ; v<rows.length ; v++){
				var cell= rows[v].getCells();
				
				for(var c = 0 ; c<cell.length ; c++){
					cell[c].setEnabled(mode);
				}
			}
	//Added on April 15			
			var UsageTbl = this.getView().byId("vehiclDetail");
			for(var i=0; i< UsageTbl.getRows().length;i++){
				
				var rows = UsageTbl.getRows();
				for(var v = 0 ; v<rows.length ; v++){
					var cell= rows[v].getCells();
					
					for(var c = 0 ; c<cell.length ; c++){
						cell[c].setEnabled(mode);
					}
				}
			}
	//	
			var callbackTable = this.getView().byId("CALLBACKDetail");	 
			var rows1 = callbackTable.getRows();
			for(var a=0;a<rows1.length;a++){
				var cell1= rows1[a].getCells();
				for(var b = 0 ; b<cell1.length;b++){
					cell1[b].setEnabled(mode);
				}
			}
			
			var TyreDetailTable = this.getView().byId("TyreDetailTable");	 
			var rows2   = TyreDetailTable.getRows();
			var testcat = this.getView().byId("selectTestcat").getSelectedKey(); 
			for(var d=0;d<rows2.length;d++){
				var cell2 = rows2[d].getCells();
				var ftqty = cell2[33].getValue();
				
				for(var e = 1 ; e<cell2.length;e++){
					if(e!==3 && e!==2){
						cell2[e].setEnabled(mode);
					}
					
					if(parseInt(ftqty) > 0 ){
						cell2[1].setEnabled(false);
						cell2[31].setEnabled(false); 
						cell2[4].setEnabled(false);
						cell2[5].setEnabled(false);
						cell2[11].setEnabled(false);
					}
				}
				
				//Changed by Ram 22-02-2020
				debugger
	       /*     if(TyreDetailTable.getModel().getData()[d].PlanExist =="X"){
						cell2[4].setEnabled(false);
						cell2[5].setEnabled(false);
					}*/
			}
			
			var firstCell = TyreDetailTable.getRows()[0].getCells()[1];
			firstCell.setSelectedKey("01");
			firstCell.setEnabled(false);
		
		
		},
		
		onEdit: function(){
			that.initialLoad=false;
			var tabBar= this.getView().byId("idTestReqCreateTabBar");
			tabBar.setSelectedKey("tyreDetails");
			var eMode= true;
			this.setEnableDisableAllFields(eMode);
			this.getView().byId("idEdit").setVisible(false);
			this.getView().byId("saveBtn").setVisible(true);
			this.getView().byId("CancelBtn").setVisible(true);
			this.getView().byId("UICreateTableAddItemButton").setVisible(true);	
			this.getView().byId("UICreateTableAddItemButtonUsage").setVisible(true);	
			this.getView().byId("UICreateTableAddItemButtonCallback").setVisible(true);	
			//
			this.getView().byId("availabilityDateInp").setEnabled(false);
			this.getView().byId("commencementDateInp").setEnabled(false);
			
/*Changes by Ankit	*/
			for(var i=0 ; i<that.getView().byId("TyreDetailTable").getRows().length ; i++){
				that.getView().byId("TyreDetailTable").getRows()[i].getCells()[29].setEnabled(false);
			}
/*	*/	
		},
		 
		getTyreDetailsObject: function(){
			var obj={
					
					CompanyCode: "",
					ProdSize: "",
					YDesc  :"",
					Group: "",
					GroupDesc:"",
					Material:"",
					Maktx:"",
					PlyRating:"",
					LoadIndex:"",
					SpeedRating:"",
					NoOfTyres:"",
					Discount:"",
					Plant:"",
					InflatedNSD:"",
					NSD:"",
					GrooveNumbers:"",
					G1:"",
					G2:"",
					G3:"",
					G4:"",
					G5:"",
					G6:"",
					OverallDiameter:"",
					SectionWidth:"",
					TreadArcWidth:"",
					Weight:"",
					TreadWidth:"",
					StencilFrom:"",
					StencilTo:"",
					PTQty:"",
					FTQuantity:"",
					AdditionalComments:""
				};
			return obj;
		},
		
		onChangeMarket : function(e){
			this.getView().byId("selectProductCat").setSelectedKey();
			this.getView().byId("selectNominal").setSelectedKey();
			var selectedKey = e.getSource().getSelectedKey();
			e.getSource().removeStyleClass("myStateError");
//			var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4ProductCatSet?$filter=Market eq '01'";
			var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4ProductCatSet?$filter=Market eq '"+selectedKey+"'";
			var jModel = new sap.ui.model.json.JSONModel(); 
			jModel.loadData(sPath, null, false, "GET", false,false, null);
			//initialise your model from a JSON file
//			  sap.ui.getCore().setModel(mModel, "your_data_model"); //set model with a name to use later
//			  var oItemSelectTemplate = new sap.ui.core.Item({
//			            key : "{ProdCat}",
//			            text : "{ProdDesc}"
//			        }); //Define the template for items, which will be inserted inside a select element
			 var mySelectMenu = this.getView().byId("selectProductCat"); //Get a reference to the UI element, Select to bind data
			 mySelectMenu.setEnabled(true);
			 mySelectMenu.setModel(jModel);// set model your_data_model to Select element
//			mySelectMenu.bindAggregation("items","/d/results",oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above
			 //this.getView().byId("selectProductCat").setSelectedKey("");
			 //this.getView().byId("selectNominal").setSelectedKey("");
		},
		
		onChangeProdCate : function(e){
			debugger
			this.getView().byId("selectNominal").setSelectedKey();
			var selectedKey = e.getSource().getSelectedKey();
			e.getSource().removeStyleClass("myStateError");
			debugger
			var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4WidthSizeSet?$filter=ProdCat eq '"+selectedKey+"'";
			var jModel = new sap.ui.model.json.JSONModel(); 
			jModel.loadData(sPath, null, false, "GET", false, false, null);
			
			var mySelectMenu = this.getView().byId("selectNominal"); 
			 mySelectMenu.setEnabled(true);
			 
			 mySelectMenu.setModel(jModel,"nominalModel");	
			  var oItemSelectTemplate = new sap.ui.core.Item({
			            key : "{ProdSize}",
			            text : "{YDesc}"
			        }); 
//			 var mySelectMenu = this.getView().byId("selectNominal"); //Get a reference to the UI element, Select to bind data
//			 mySelectMenu.setEnabled(true);
//			 mySelectMenu.setModel(jModel);// set model your_data_model to Select element
//			mySelectMenu.bindAggregation("items","/d/results",oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above
			//this.getView().byId("selectNominal").setSelectedKey("");
			
		},
		
		onChangeNominal: function(e){
			e.getSource().removeStyleClass("myStateError");
			this.tyreDetail_Size = e.getSource().getSelectedItem().getText();
		},
		
		onChangeTestCat: function(e){
			e.getSource().removeStyleClass("myStateError");
			var cat =  e.getSource().getSelectedKey();
			var ptqty = this.getView().byId("ptQtyCol");
			var ftqty = this.getView().byId("ftQtyCol");
			// Enable FT Quantity and PT Quantity in table (tyre details tab)
			if(cat == "05"){
				ptqty.setVisible(true);
				ftqty.setVisible(true);
			}else{
				ptqty.setVisible(false);
				ftqty.setVisible(false);
			}
			
			
		},
		onChangeProdType: function(e){
			e.getSource().removeStyleClass("myStateError");
		},
		testReqChange : function(e){	
			e.getSource().removeStyleClass("myStateError");
			var self = this;
		},
		onChangeTestObj: function(e){
			e.getSource().removeStyleClass("myStateError");
		},
		onChangeTestMethod: function(e){
			e.getSource().removeStyleClass("myStateError");
		},
		onChangeTestType: function(e){
			e.getSource().removeStyleClass("myStateError");
		},
		onChangeTestMethod: function(e){
			e.getSource().removeStyleClass("myStateError");
		},
		onChangeModify: function(e){
			e.getSource().setValueState("None");
		},
		
//		add new row with same data as in the last row
		addItemTyreDetail: function(){
			that.initialLoad=false;
			var TyreDetailTable 		= this.getView().byId("TyreDetailTable");
			var tyreDetailData			={};
				var data 				= TyreDetailTable.getModel().getData();
				this.tyreDetails = TyreDetailTable.getModel().getData();
				
				var len 				= TyreDetailTable.getRows().length;
				tyreDetailData.CompanyCode = data[data.length-1].CompanyCode;
				tyreDetailData.ProdSize = data[data.length-1].ProdSize;
				tyreDetailData.YDesc = data[data.length-1].YDesc;
				tyreDetailData.Group = data[data.length-1].Group;
				tyreDetailData.GroupDesc = data[data.length-1].GroupDesc;
				tyreDetailData.Material = data[data.length-1].Material;
				tyreDetailData.Maktx = data[data.length-1].Maktx;
				tyreDetailData.PlyRating = data[data.length-1].PlyRating;
				tyreDetailData.LoadIndex = data[data.length-1].LoadIndex;
				tyreDetailData.SpeedRating = data[data.length-1].SpeedRating;
	//			tyreDetailData.NoOfTyres = data[data.length-1].NoOfTyres;
				tyreDetailData.Discount = data[data.length-1].Discount;
				tyreDetailData.Plant = data[data.length-1].Plant;
				tyreDetailData.InflatedNSD = data[data.length-1].InflatedNSD;
				tyreDetailData.NSD = data[data.length-1].OrigNsd;
				tyreDetailData.GrooveNumbers = data[data.length-1].GrooveNumbers;
				tyreDetailData.G1 = data[data.length-1].G1Nsd;
				tyreDetailData.G2 = data[data.length-1].G2Nsd;
				tyreDetailData.G3 = data[data.length-1].G3Nsd;
				tyreDetailData.G4 = data[data.length-1].G4Nsd;
				tyreDetailData.G5 = data[data.length-1].G5Nsd;
				tyreDetailData.G6 = data[data.length-1].G6Nsd;
				tyreDetailData.OverallDiameter = data[data.length-1].OverallDiameter;
				tyreDetailData.SectionWidth = data[data.length-1].SectionWidth;
				tyreDetailData.TreadArcWidth = data[data.length-1].TreadArcWidth;
				tyreDetailData.Weight = data[data.length-1].Weight;
				tyreDetailData.TreadWidth = data[data.length-1].TreadWidth;
				tyreDetailData.StencilFrom = data[data.length-1].StencilFrom;
				tyreDetailData.StencilTo = data[data.length-1].StencilTo;
	//			tyreDetailData.PTQty = data[data.length-1].PTQty;
	//			tyreDetailData.FtQty = data[data.length-1].FtQty;
				tyreDetailData.AdditionalComments = data[data.length-1].AdditionalComments;
					this.tyreDetails.push(tyreDetailData);
				
				TyreDetailTable.getModel().setData(this.tyreDetails);
				TyreDetailTable.getModel().refresh()
				var UsageTyreDetailTableCount = TyreDetailTable.getModel().getData().length;
				TyreDetailTable.setVisibleRowCount(UsageTyreDetailTableCount);
			
		},
		
			
		createPayload:function(mode){
			
					
			var Plant = this.getView().byId("selectPlant");
			var Market = this.getView().byId("selectMarket");
			var PorodCat = this.getView().byId("selectProductCat");
			var NominalSec = this.getView().byId("selectNominal");
			var testCat = this.getView().byId("selectTestcat");
			var testReq = this.getView().byId("selectTestreq");
			var testObj = this.getView().byId("selectTestObj");
			var testMeth = this.getView().byId("selectTestMethod");
			var testType = this.getView().byId("selectTesttype");
			var Modification = this.getView().byId("longTxt");
			var prodtype = this.getView().byId("selectProdTyre");
			debugger
			var testProdDate = this.getView().byId("tyreProdDateInp").getValue();
			var projctStatus = this.getView().byId("selectProjctStatus").getSelectedKey();
			var projctStatusDate = this.getView().byId("projctstatusInp").getValue();
			var plantDate = this.getView().byId("expectedPlantDateInp").getValue();
			var dispatchDate = this.getView().byId("dispatchDateInp").getValue();
			var availDate = this.getView().byId("availabilityDateInp").getValue();
			var comensDate = this.getView().byId("commencementDateInp").getValue();
			var spclCom = this.getView().byId("longTxt2").getValue();
			
			/*if(testProdDate !==""){
				var s = testProdDate.split(".");
				testProdDate = s[2] + "-" + s[1] + "-"+ s[0] + "T00:00:00";
			}else{
				testProdDate=null;
			}
			
			if(projctStatusDate !==""){
				var t = projctStatusDate.split(".");
				projctStatusDate = t[2] + "-" + t[1] + "-"+ t[0] + "T00:00:00";
			}else{
				projctStatusDate=null;
			}
			
			if(dispatchDate !==""){
				var u = dispatchDate.split(".");
				dispatchDate = u[2] + "-" + u[1] + "-"+ u[0] + "T00:00:00";
			}else{
				dispatchDate=null;
			}
			
			if(availDate !==""){
				var v = availDate.split(".");
				availDate = v[2] + "-" + v[1] + "-"+ v[0] + "T00:00:00";
			}else{
				availDate=null;
			}
			
			if(comensDate !==""){
				var w = comensDate.split(".");
				comensDate = w[2] + "-" + w[1] + "-"+ w[0] + "T00:00:00";
			}else{
				comensDate=null;
			}
			
			if(plantDate !==""){
				var r = plantDate.split(".");
				plantDate = r[2] + "-" + r[1] + "-"+ r[0] + "T00:00:00";
			}else{
				plantDate=null;
			}*/
			
			if(testProdDate !==""){
				testProdDate = this.payLoadDate(testProdDate);
			}else{
				testProdDate=null;
			}
			
			if(projctStatusDate !==""){
				projctStatusDate = this.payLoadDate(projctStatusDate);
			}else{
				projctStatusDate=null;
			}
			
			if(dispatchDate !==""){
				dispatchDate = this.payLoadDate(dispatchDate);
			}else{
				dispatchDate=null;
			}
			
			if(availDate !==""){
				availDate = this.payLoadDate(availDate);
			}else{
				availDate=null;
			}
			
			if(comensDate !==""){
				comensDate = this.payLoadDate(comensDate);
			}else{
				comensDate=null;
			}
			
			if(plantDate !==""){
				plantDate = this.payLoadDate(plantDate);
			}else{
				plantDate=null;
			}
			
			
			var docDate = new Date()
			 var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		            pattern : "dd.MM.yyyy"
				});
			 var currentdate =  oDateFormat.format(docDate);
			 var g = currentdate.split(".");
			 currentdate = g[2] + "-" + g[1] + "-"+ g[0] + "T00:00:00";
			
			
			 var TyreDetailTable = this.getView().byId("TyreDetailTable");
			 var vehicleTable = this.getView().byId("vehiclDetail");	
			 var callbackTable = this.getView().byId("CALLBACKDetail");
			 
//			 Tyre Details table payload creation
			 
			 var tyreDetlArr=[];
			 var tyreData = TyreDetailTable.getModel().getData();
			 for(var i=0;i<TyreDetailTable.getModel().getData().length;i++){
				 var tyre={};
				 tyre.ReqGuid = "";
//				 tyre.TestRequestNumber ="";
				 tyre.CompanyCode= tyreData[i].CompanyCode;
				 tyre.Comname= tyreData[i].TestType;
				 tyre.ItemNumber = "";
				 tyre.ProdSize = tyreData[i].ProdSize;
				 tyre.Group = tyreData[i].Group;
				 tyre.GroupDesc = tyreData[i].GroupDesc;
//				 tyre.Pattern = tyreData[i].Pattern;
				 if(tyreData[i].Material){
					 tyre.Material = tyreData[i].Material;
				 }else{
					 tyre.Material = "";
				 }
				 tyre.Maktx = tyreData[i].Maktx;
				 if(tyreData[i].Infnsd){
					 tyre.Infnsd = 'X' ;
				 }else{
					 tyre.Infnsd = '' ;
				 }
//				 tyre.Infnsd = tyreData[i].Infnsd,
				 tyre.PlyRating = tyreData[i].PlyRating;
				 tyre.LoadIndex = tyreData[i].LoadIndex;
				 tyre.SpeedRating = tyreData[i].SpeedRating;
				 if(tyreData[i].NoOfTyres){
					 tyre.NoOfTyres = parseInt(tyreData[i].NoOfTyres);
//					 tyre.NoOfTyres = 0 ;
				 }
				 if(tyreData[i].Discount){
					 tyre.Discount = parseInt(tyreData[i].Discount);
				 }else{
					 tyre.Discount = 0 ;
				 }
				 
				 tyre.Plant = tyreData[i].Plant;
				 if(tyreData[i].OrigNsd){
					 tyre.OrigNsd = tyreData[i].OrigNsd;
				 }else{
					 tyre.OrigNsd = "0.0";
				 }
				 if(tyreData[i].G1Nsd){
					 tyre.G1Nsd = tyreData[i].G1Nsd;
				 }else{
					 tyre.G1Nsd = "0.0";
				 }
				 if(tyreData[i].G2Nsd){
					 tyre.G2Nsd = tyreData[i].G2Nsd;
				 }else{
					 tyre.G2Nsd = "0.0";
				 }
				 if(tyreData[i].G3Nsd){
					 tyre.G3Nsd = tyreData[i].G3Nsd;
				 }else{
					 tyre.G3Nsd = "0.0";
				 }
				 if(tyreData[i].G4Nsd){
					 tyre.G4Nsd = tyreData[i].G4Nsd;
				 }else{
					 tyre.G4Nsd = "0.0";
				 }
				 if(tyreData[i].G5Nsd){
					 tyre.G5Nsd = tyreData[i].G5Nsd;
				 }else{
					 tyre.G5Nsd = "0.0";
				 }
				 if(tyreData[i].G6Nsd){
					 tyre.G6Nsd = tyreData[i].G6Nsd;
				 }else{
					 tyre.G6Nsd = "0.0";
				 }
				 			 
				 if(tyreData[i].GrooveNumbers){
					 tyre.GrooveNumbers = parseInt(tyreData[i].GrooveNumbers);
				 }else{
					 tyre.GrooveNumbers = 0;
				 }
				 if(tyreData[i].OverallDiameter){
					 tyre.OverallDiameter =tyreData[i].OverallDiameter;
				 }else{
					 tyre.OverallDiameter = "0.0";
				 }
				 if(tyreData[i].SectionWidth){
					 tyre.SectionWidth = tyreData[i].SectionWidth;
				 }else{
					 tyre.SectionWidth = "0.0";
				 }
				 if(tyreData[i].TreadArcWidth){
					 tyre.TreadArcWidth = tyreData[i].TreadArcWidth;
				 }else{
					 tyre.TreadArcWidth = "0.0";
				 }
				 if(tyreData[i].Weight){
					 tyre.Weight = tyreData[i].Weight;
				 }else{
					 tyre.Weight = "0.0";
				 }
				 if(tyreData[i].TreadWidth){
					 tyre.TreadWidth = tyreData[i].TreadWidth;
				 }else{
					 tyre.TreadWidth = "0.0";
				 }
				 
				 
				 tyre.StencilFrom = tyreData[i].StencilFrom;
				 tyre.StencilTo = tyreData[i].StencilTo;
				 if(tyreData[i].PTQty){
					 tyre.PTQty = parseInt(tyreData[i].PTQty);
				 }else{
					 tyre.PTQty = 0;
				 }
				 if(tyreData[i].FtQty){
					 tyre.FtQty = parseInt(tyreData[i].FtQty);
				 }else{
					 tyre.FtQty = 0;
				 }
				 
				 tyre.AdditionalComments = tyreData[i].AdditionalComments;
				 
				 tyreDetlArr.push(tyre);
			 }
			 
//			Callback table payload creation 
			 var callBackArr=[];
			 var callData = callbackTable.getModel().getData();
			 for(var i=0;i<callbackTable.getModel().getData().length;i++){
				 var callback={};
//				 callback.TestRequestNumber ="";
//				 callback.MaterialDesc= ""
//				 callback.CompanyCode = "01"
				 callback.Revno = "";
				 debugger
				 callback.GroupType = callData[i].GroupType;
				 callback.Destdesc = "";
				 callback.Locdesc = "";
				 callback.StageDesc = "";
				 callback.ReqGuid = "";
				 callback.ItemNumber = "";
				 callback.Location = callData[i].Location;
				 callback.Material = callData[i].Material;
				 if(callData[i].NoOfTyres){
					 callback.NoOfTyres = parseInt(callData[i].NoOfTyres);
				 }else{
					 callback.NoOfTyres = 0;
				 }
				 
				 callback.Wear = parseInt(callData[i].Wear);
				 callback.Destination = callData[i].Destination;
				 callback.TestReq = callData[i].TestReq;
				 callback.AnalysisReason = callData[i].AnalysisReason;
				 
				 callBackArr.push(callback);
			 }
		
//			 Vehicle Details table payload creation
			 var vehicleArr=[];
			 var vehicleData = vehicleTable.getModel().getData();
			 for(var i=0;i<vehicleTable.getModel().getData().length;i++){
				 var vehicle={};
//				 vehicle.TestRequestNumber ="";
				 vehicle.ItemNumber= "";
				 vehicle.ReqGuid= "";
				 vehicle.Revno= "";
				 vehicle.VehicleMakeDesc= "";
				 vehicle.TestAxelDesc= "";
				 vehicle.AppDescription= "";
				 vehicle.FitAxleDesc= "";
//				 vehicle.ConfigCodeDesc= "";
				 vehicle.VehicleMake = vehicleData[i].VehicleMake;
				 vehicle.VehicleModel = vehicleData[i].VehicleModel;
				 vehicle.ConfigCode = vehicleData[i].ConfigCode;
				 vehicle.TestingAxle = vehicleData[i].TestingAxle;
				 vehicle.VehicleApplication = vehicleData[i].VehicleApplication;
				 vehicle.FitmentAxle = vehicleData[i].FitmentAxle;
				 if(vehicleData[i].DualSpacing){
					 vehicle.DualSpacing = parseFloat(vehicleData[i].DualSpacing).toFixed(2);
				 }else{
					 vehicle.DualSpacing = "0.00";
				 }
				 
				 vehicle.Remarks = vehicleData[i].Remarks;
				 
				 vehicleArr.push(vehicle);
			 }
			
//			 Usage details payload creation
			 var usageDetailForm = {};
			 	var loadSegm = this.getView().byId("loadsegment").getSelectedItems();
				var psi = this.getView().byId("recPsi").getValue();
				var fRimR = this.getView().byId("fitmntRim").getValue();
				var fRimA = this.getView().byId("FitmentAlt").getValue();
				var loadSeg="";
				for(var ls=0;ls<loadSegm.length;ls++){
					loadSeg += loadSegm[ls].getKey() + "@";
					
				}
//				usageDetailForm.TestRequestNumber="";
				usageDetailForm.LoadSegment = loadSeg;
				if(psi !==""){
					usageDetailForm.IpPsi = psi;
				}else{
					usageDetailForm.IpPsi="0.00";
				}
			
				
				usageDetailForm.FitmentRimRecommended = fRimR;
				usageDetailForm.FitmentRimAlternate = fRimA;
				
				usageDetailForm.ReqGuid = "";
				usageDetailForm.Revno = "";
				
//		final payload	 
			 
			var payload={
					TestRequestNumber : "",
					ReqGuid : this.ReqGuid,
					Revno : this.RevNo,
					Werks : Plant.getSelectedKey(),
					Market : Market.getSelectedKey(),
					ProductCategory : PorodCat.getSelectedKey(),
					ProdSize : NominalSec.getSelectedKey(),
					TestCategory : testCat.getSelectedKey(),
					TestRequirement : testReq.getSelectedKey(),
					TestObjective : testObj.getSelectedKey(),
					TestMethodology : testMeth.getSelectedKey(),
					TestType : testType.getSelectedKey(),
					Modifications : Modification.getValue(),
					Prodtype : prodtype.getSelectedKey(),
					CreatedOn : null,
					CreatedBy : "",
					ProductionDate : testProdDate,
					ProjectStatus : projctStatus,
					ProjectStatusDate : projctStatusDate,
					PlantDate : plantDate,
					DispatchDate : dispatchDate,
					AvailabilityDate : availDate,
					TestCommencementDate : comensDate,
					SpecialComments : spclCom,
					TestRequestStatus : "",
					MarketDesc : Market._getSelectedItemText(),
					ProductCategoryDesc : PorodCat._getSelectedItemText(),
					CategoryDescription : testCat._getSelectedItemText(),
					TestRequirementDesc : testReq._getSelectedItemText(),
					TestObjectiveDesc : testObj._getSelectedItemText(),
					TestMethodologyDesc : testMeth._getSelectedItemText(),
					TestTypeDesc : testType._getSelectedItemText(),
					ProjectStatusDesc : Market._getSelectedItemText(),
					SaveMode: mode
			}
			payload.RequestHeadtoUsageNvg= usageDetailForm;
			payload.RequestHeadtoItemNvg = tyreDetlArr;
//			payload.TestRequestItemSet = [];
			payload.RequestHeadtoCallNvg = callBackArr;
			payload.RequestHeadtoVehicleNvg = vehicleArr;
			return payload;
			
		},
		NSDValid:function(){
			var NSDValid = true;
			var TyreDetailTable = this.getView().byId("TyreDetailTable");
			var rows = TyreDetailTable.getRows();
			for(var i= 0; i<rows.length;i++){
				var cells = rows[i].getCells();
				var tyreType = cells[1].getSelectedKey();
				for(var j = 0; j<cells.length-1 ; j++){
					var groove = cells[14].getSelectedKey();
					if(j == 13 && !isNaN(groove)){
						for(var k=15; k<=14 + parseInt(groove); k++){
								if(parseFloat(cells[13].getValue()) < parseFloat(cells[14 + parseInt(groove)].getValue()) ){
									cells[k].setValueState("Error");
									NSDValid=false;
								}else{
									cells[k].setValueState("None");
								}
						}
					}
				}
			}
			return NSDValid;
		},
		
		onReviewAndSaveRequest: function(){
			var that=this;
			var mode = "S";
			var valid =true;
			var tabBar= this.getView().byId("idTestReqCreateTabBar");
			var validate=this.validateHeaderDetails();
//			var tyreTabValid = this.validTyreTab();
			var usageValid = this.validUsageTab();
			var tyreAvailValid = this.validTyreAvail();
			var NSDValid = this.NSDValid();
			
			if(!NSDValid){
				sap.m.MessageBox.alert(
						"G1/G2/G3/G4/G5/G6 should be less than or equal to NSD value.", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
				tabBar.setSelectedKey("tyreDetails");
				valid=false;
				return false;
			}
			
			if(!validate){
				sap.m.MessageBox.alert(
						"Enter All Mandatory Fields.", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
				tabBar.setSelectedKey("testRequire");
				valid=false;
				return false;
			}else{
				tabBar.setSelectedKey("tyreDetails");
				tabBar.setSelectedKey("testRequire");
				var tyreTabValid = this.validTyreTab();
				if(!tyreTabValid){
					sap.m.MessageBox.alert(
							"Enter All Mandatory Fields.", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error"
							}
						);
					tabBar.setSelectedKey("tyreDetails");
					valid=false;
					return false;
				}else{
					if(!usageValid){
						sap.m.MessageBox.alert(
								"Enter All Mandatory Fields.", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Error"
								}
							);
						tabBar.setSelectedKey("usageDetails");
						valid=false;
						return false;
					}else{
						if(!tyreAvailValid){
							sap.m.MessageBox.alert(
									"Enter All Mandatory Fields", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error"
									}
								);
							tabBar.setSelectedKey("tyreAvailDetails");
							valid=false;
							return false;
						}
					}
				}
			}
		
			if(valid){
				sap.m.MessageBox.show(
			      "Data reviewed successfully, are you sure you want to save data?", {
			        icon: sap.m.MessageBox.Icon.INFORMATION,
			        title: "Information",
			        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			        onClose: function(oAction) {
			          if (oAction === sap.m.MessageBox.Action.YES) {
		        	  var payload = that.createPayload(mode);
		  				that.onCreateTestRequestSet(payload, mode);      	  
			          }
			        }
			      });
				
			}

		},
		onAddReqToCart : function(){
			var mode = "C";
			var validate=this.validateHeaderDetails();
			if(!validate){
				sap.m.MessageBox.alert(
						"Enter All Mandatory Fields.", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
				return false;
			}else{
				var payload = this.createPayload(mode);
				this.onCreateTestRequestSet(payload, mode);
			}
		},		
		onCreateTestRequestSet: function(payload, mode){
			var oView = this.getView();
			var sPathPOHeaderSet = "/TestRequestSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsPOHeaderSet = {};
			oParamsPOHeaderSet.context = "";
			oParamsPOHeaderSet.urlParameters = "";
			
			oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
				
				if(mode == "C"){
					sap.m.MessageBox.show(
					  "Request added to Cart. (Generated Request Number: "+oResponse.data.TestRequestNumber+")", {
			          icon: sap.m.MessageBox.Icon.INFORMATION,
			          title: "Information",
			          actions: [sap.m.MessageBox.Action.OK],
			          onClose: function(oAction) { 
			        	  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			  				oCrossAppNavigator.toExternal({
			                target: { semanticObject : "#"}
			               });
			          }
			      });
//					sap.m.MessageToast.show("Request added to Cart (Generated Request Number: "+oResponse.data.TestRequestNumber+")");
				}
				if(mode == "S"){
					sap.m.MessageBox.show(
					  "Request Submitted Successfully. (Generated Request Number: "+oResponse.data.TestRequestNumber+")", {
			          icon: sap.m.MessageBox.Icon.INFORMATION,
			          title: "Information",
			          actions: [sap.m.MessageBox.Action.OK],
			          onClose: function(oAction) { 
			        	  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			  			oCrossAppNavigator.toExternal({
			                target: { semanticObject : "#"}
			               });
			          }
			      });
					sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestRequestOutputFormSet(ReqGuid='"+oResponse.data.ReqGuid+"',RevNo='"+oResponse.data.Revno+"')/$value", true);
//					sap.m.MessageToast.show("Request submitted Successfully (Generated Request Number: "+oResponse.data.TestRequestNumber+")");
				}
				
				that.saveUploadedDocs(oData.ReqGuid);         // document upload
				
			};
			oParamsPOHeaderSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read Publishing Group Data Failed");
			}.bind(this);

			frameworkODataModel.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
		
		saveUploadedDocs: function(ReqGuid){               // document upload
			var payload = that.createDocsPayload(ReqGuid);
			var oView = this.getView();
			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
			var sPathPOHeaderSet = "/ImageUploadObjectSet";
			var oParamsPOHeaderSet = {};
			oParamsPOHeaderSet.context = "";
			oParamsPOHeaderSet.urlParameters = "";
			oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
				
			};
			oParamsPOHeaderSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);

			oCreateModel1.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

			oCreateModel1.attachRequestCompleted(function() {
				
			});
		},
		
		createDocsPayload: function(ReqGuid){              // document upload
			var payload={
					ObjectID: "02",
					ObjectName: ReqGuid,
					Error:"",
					Message:"",				
			}
			var navArr=[];
			var data = that.getView().getModel("attachmentModel").getData();
			for(var i=0;i<data.length;i++){
				var obj={};
				obj.FileName = data[i].FileName;
				obj.DocNo = data[i].DocNo;
				obj.UpdateFlag = data[i].UpdateFlag;
				obj.MimeType = data[i].MimeType;
				navArr.push(obj);
			}
			
			payload.ImageObjectToDataNvg = navArr;
			return payload;
		},
		
		onReset: function(){
			var that=this;
			var tabBar= this.getView().byId("idTestReqCreateTabBar");
			sap.m.MessageBox.show(
				      "Are you sure, you want to reset all the fields?", {
				        icon: sap.m.MessageBox.Icon.INFORMATION,
				        title: "Information",
				        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				        onClose: function(oAction) {
				          if (oAction === sap.m.MessageBox.Action.YES) {
				        	  tabBar.setSelectedKey("testRequire");
				        	  that.resetAllFields();
				        	  that.removeValueStateTyreTable();
				        	  
				        	  that.getView().byId("selectMarket").setEnabled(true);
				        	  that.getView().byId("selectProductCat").setEnabled(true);
				        	  that.getView().byId("selectNominal").setEnabled(true);
				        	  that.getView().byId("selectTestcat").setEnabled(true);
				        	  that.getView().byId("selectProdTyre").setEnabled(true);
				        	  that.getView().byId("selectTestreq").setEnabled(true);
				        	  that.getView().byId("selectTestObj").setEnabled(true);
				        	  that.getView().byId("selectTestMethod").setEnabled(true);
				        	  that.getView().byId("selectTesttype").setEnabled(true);
				        	  that.getView().byId("longTxt").setEnabled(true);
				        	  that.getView().byId("selectPlant").setEnabled(true);
				          }
				        }
				      }
				    );
		},
		
		resetAllFields: function(){
			
//			Header fields
			var view = this.getView();
	/*	
			var Modification = view.byId("longTxt");		
			Modification.setValue("");
			Modification.setValueState("None");
			
			var selects = [
				view.byId("selectMarket"),
				view.byId("selectProductCat"),
				view.byId("selectNominal"),
				view.byId("selectTestcat"),
				view.byId("selectProdTyre"),
				view.byId("selectTestreq"),
				view.byId("selectTestObj"),
				view.byId("selectTestMethod"),
				view.byId("selectTesttype")
			];
			jQuery.each(selects, function(i, input) {
				if (input) {
					input.setSelectedKey("");
					input.removeStyleClass("myStateError");
				}
			});
	*/		
//		Tyre Availability Details fields	
			var projctStatus = view.byId("selectProjctStatus");
			projctStatus.setSelectedKey("");
			
			var inputs = [
			   			view.byId("tyreProdDateInp"),
			   			view.byId("projctstatusInp"),
			   			view.byId("expectedPlantDateInp"),
			   			view.byId("dispatchDateInp"),
			   			view.byId("availabilityDateInp"),
			   			view.byId("commencementDateInp"),
			   			view.byId("longTxt2"),
			   		];
			   		jQuery.each(inputs, function(i, input) {
			   			if (input) {
			   				input.setValue("");
			   				input.setValueState("None");
			   			}
			   		});
			
//		Usage Details fields 	
			var loadSegm = view.byId("loadsegment");
			loadSegm.setSelectedItems([]);
			
			var Usageinputs = [
				   			view.byId("recPsi"),
				   			view.byId("fitmntRim"),
				   			view.byId("FitmentAlt")
				   		];
				   		jQuery.each(Usageinputs, function(i, input) {
				   			if (input) {
				   				input.setValue("");
				   				input.setValueState("None");
				   			}
				   		});
			
//		Get table ids for clear model data binded with table
			this.tyreDetails=[];
			var TyreDetailTable = this.getView().byId("TyreDetailTable");
			var arr=[];
			var firstRow = this.getTyreDetailsObject();
			firstRow.Group="A";
			arr.push(firstRow);
			TyreDetailTable.getModel().setData([]);
			TyreDetailTable.getModel().setData(arr);
			TyreDetailTable.getModel().refresh();
			var colslen= TyreDetailTable.getRows()[0].getCells().length;
	    	TyreDetailTable.getRows()[0].getCells()[1].setSelectedKey("01");
	    	TyreDetailTable.getRows()[0].getCells()[1].setEnabled(false);
	    	
	    	TyreDetailTable.getRows()[0].getCells()[colslen-1].setEnabled(false);
			var TyreDetailTableCount = TyreDetailTable.getModel().getData().length;
			TyreDetailTable.setVisibleRowCount(TyreDetailTableCount);
			
			 var vehicleTable = this.getView().byId("vehiclDetail");	
			 vehicleTable.getModel().setData([]);
			 vehicleTable.getModel().refresh();
			 var vehicleTableTableCount = vehicleTable.getModel().getData().length;
			 vehicleTable.setVisibleRowCount(vehicleTableTableCount);
				
			 var callbackTable = this.getView().byId("CALLBACKDetail");
			 callbackTable.getModel().setData([]);
			 callbackTable.getModel().refresh();
			 var callbackTableCount = callbackTable.getModel().getData().length;
			 callbackTable.setVisibleRowCount(callbackTableCount);
			 
			 
			 this.tyreDetails.push(TyreDetailTable.getModel().getData()[0]);
			 this.callbackDetails = [];
			 this.usageDetails = [];
		},
		
//		code added to remove value state error from tyre details table
		removeValueStateTyreTable: function(){
			var TyreDetailTable = this.getView().byId("TyreDetailTable");
			var rows = TyreDetailTable.getRows();
			for(var i = 0; i< rows.length;i++){
				var cells= rows[i].getCells();
				for(var j=1;j<cells.length-1 ;j++){
					if(j!==3){
						if(j == 11 || j==14 || j==1){
							cells[j].removeStyleClass("myStateError");
						}else{
							cells[j].setValueState("None");
						}
					}
				}
			}
		},
				
		bindMaterialListSet: function() {
			var oViewObj = this.getView();
			var Market = this.getView().byId("selectMarket").getSelectedKey();
			var PorodCat = this.getView().byId("selectProductCat").getSelectedKey();
			var NominalSec = this.getView().byId("selectNominal").getSelectedKey();
			var ProdType = this.getView().byId("selectProdTyre").getSelectedKey();
			var MaterialListSetJModel = oViewObj.getModel("MaterialListSetJModel");
			if (!MaterialListSetJModel) {
				MaterialListSetJModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(MaterialListSetJModel, "MaterialListSetJModel");
			}
			var filters = [];
			filters.push(new sap.ui.model.Filter("Market", sap.ui.model.FilterOperator.EQ, Market));
			filters.push(new sap.ui.model.Filter("ProdCat", sap.ui.model.FilterOperator.EQ, PorodCat));
			filters.push(new sap.ui.model.Filter("ProdSize", sap.ui.model.FilterOperator.EQ, NominalSec));
			filters.push(new sap.ui.model.Filter("ProdType", sap.ui.model.FilterOperator.EQ, ProdType));
			var sPathMatListSet = "/F4MaterialNumberSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsMatListSet = {};
			oParamsMatListSet.context = "";
			oParamsMatListSet.filters = filters;
			oParamsMatListSet.urlParameters = "";
			oParamsMatListSet.success = function(oData, oResponse) { // success handler

				MaterialListSetJModel.setData(oData.results);
			};
			oParamsMatListSet.error = function(oError) { // error handler 
				jQuery.sap.log.error("Read Publishing Group Data Failed.");
				sap.m.MessageToast.show.show(JSON.parse(oError.responseText).error.message.value);
			};
			frameworkODataModel.read(sPathMatListSet, oParamsMatListSet);
			frameworkODataModel.attachRequestCompleted(function() {});

		},
			
		handleMaterialIdValueHelp: function(oEvent) {
			this.bindMaterialListSet();
			var MaterialListSetJModel = this.getView().getModel("MaterialListSetJModel");
			this.matPath=oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var sInputValue = oEvent.getSource().getValue();
			oEvent.getSource().setValueState("None");
			this.MatId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogSite) {
				this._valueHelpDialogSite = sap.ui.xmlfragment(
					"zRequestCart.view.MaterialDialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialogSite);
			}
			var dl = this._valueHelpDialogSite;
			dl._oCancelButton.setTooltip(dl._oCancelButton.getText());
			dl.setModel(MaterialListSetJModel);
			dl.bindAggregation("items", {

				path: '/',
				template: new sap.m.StandardListItem({
					// title: "{Sitename}",
					title: "{Matnr}",
					description: "{Maktx}"
//					customData: [{
//						  Type:"sap.ui.core.CustomData",
//						    key:"ply",
//						    value:"{PlyRating}" // bind custom data
//						  },
//						  {
//						  Type:"sap.ui.core.CustomData",
//						    key:"load",
//						    value:"{LoadIndex}" // bind custom data
//						  },
//						  {
//							  Type:"sap.ui.core.CustomData",
//							    key:"speed",
//							    value:"{SpeedRate}" // bind custom data
//							  }]
						})

			});
			
			// open value help dialog filtered by the input value
			this._valueHelpDialogSite.open();
		},
		_handleMaterialIdValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterSiteNo =  new sap.ui.model.Filter(
				"Matnr",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			var oFilterSiteDesc =  new sap.ui.model.Filter(
				"Maktx",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			var allFilter = new sap.ui.model.Filter([oFilterSiteNo, oFilterSiteDesc]);
			evt.getSource().getBinding("items").filter(allFilter);
		},
		_handleMaterialIdValueHelpClose: function(oEvent) {
			/*CODE STARTS HERE FOR SITE SELECTION USING VALUE HELP*/

			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oSelectedContexts = oEvent.getParameter("selectedContexts");
			var MatId = sap.ui.getCore().byId(this.MatId);
			// 		var title, description;

			if (oSelectedItem) {
				debugger
				var material = oSelectedItem.getDescription();
				var materialDesc = oSelectedItem.getTitle();
				MatId.setValue(material);
				MatId.setTooltip(material);
				var TyreDetailTable = this.getView().byId("TyreDetailTable");
				var model = TyreDetailTable.getModel().getData()[this.matPath];
				model.Material = materialDesc;
				model.MaterialDesc = material;
			}

		},
		showCart : function(){
			var router = sap.ui.core.UIComponent
			.getRouterFor(this);
			router
			.navTo("page2");
		},
		
		onClear : function(){
			location.reload();
		},
		
	//added by Hans on 10/10/2018
		onRemoveVehicleDetail: function(oEvent){
			var tbl=this.getView().byId("TyreDetailTable"); 
//			var idx = oEvent.getSource().getSelectedIndex();
			var idx=oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];

			if (idx !== -1) {
		    	 		    	 
		    	 tbl.getModel().getData().splice(idx,1);
		    	 tbl.getModel().refresh();
				var UsageTyreDetailTableCount = tbl.getModel().getData().length;
				tbl.setVisibleRowCount(UsageTyreDetailTableCount);
		       
		     }
		},
		
	//code added for validate header tab fields	
		validateHeaderDetails: function(){
			var valid = false;
			var Plant = this.getView().byId("selectPlant");
			var Market = this.getView().byId("selectMarket");
			var PorodCat = this.getView().byId("selectProductCat");
			var NominalSec = this.getView().byId("selectNominal");
			var testCat = this.getView().byId("selectTestcat");
			var prodtype = this.getView().byId("selectProdTyre");
			var testReq = this.getView().byId("selectTestreq");
			var testObj = this.getView().byId("selectTestObj");
			var testMeth = this.getView().byId("selectTestMethod");
			var testType = this.getView().byId("selectTesttype");
			var Modification = this.getView().byId("longTxt");
			
			if(Market.getSelectedKey() == "" || PorodCat.getSelectedKey() == "" || NominalSec.getSelectedKey() == "" || testCat.getSelectedKey() == "" || testReq == "" || testObj == "" ||
					prodtype.getSelectedKey()=="" || testMeth.getSelectedKey() == "" || testType.getSelectedKey() == "" || Modification.getValue() == ""){
				if(Market.getSelectedKey()==""){
					Market.addStyleClass("myStateError");
				}else{
					Market.removeStyleClass("myStateError");
				}
				if(PorodCat.getSelectedKey()==""){
					PorodCat.addStyleClass("myStateError");
				}else{
					PorodCat.removeStyleClass("myStateError");
				}
				if(NominalSec.getSelectedKey()==""){
					NominalSec.addStyleClass("myStateError");
				}else{
					NominalSec.removeStyleClass("myStateError");
				}
				if(testCat.getSelectedKey()==""){
					testCat.addStyleClass("myStateError");
				}else{
					testCat.removeStyleClass("myStateError");
				}
				if(prodtype.getSelectedKey()==""){
					prodtype.addStyleClass("myStateError");
				}else{
					prodtype.removeStyleClass("myStateError");
				}
				if(testReq.getSelectedKey()==""){
					testReq.addStyleClass("myStateError");
				}else{
					testReq.removeStyleClass("myStateError");
				}
				if(testObj.getSelectedKey()==""){
					testObj.addStyleClass("myStateError");
				}else{
					testObj.removeStyleClass("myStateError");
				}
				if(testMeth.getSelectedKey()==""){
					testMeth.addStyleClass("myStateError");
				}else{
					testMeth.removeStyleClass("myStateError");
				}
				if(testType.getSelectedKey()==""){
					testType.addStyleClass("myStateError");
				}else{
					testType.removeStyleClass("myStateError");
				}
				if(Modification.getValue()==""){
					Modification.setValueState("Error");
				}else{
					Modification.setValueState("None");
				}
				if(Plant.getSelectedKey()==""){
					Plant.setValueState("Error");
				}else{
					Plant.setValueState("None");
				}
				
				
				valid=false;
				
			}else{
				valid=true;
			}
			return valid;
		},
		
//		code added for validating fields of tyre details tab
		
		validTyreTab: function(){

			var tyreTabValid = true;
			var TyreDetailTable = this.getView().byId("TyreDetailTable")
			var rows = TyreDetailTable.getRows();
			for(var i= 0; i<rows.length;i++){
				var cells = rows[i].getCells();
				var tyreType = cells[1].getSelectedKey();
				for(var j = 0; j<cells.length-1 ; j++){
					if(tyreType === "01" || tyreType === ""){
						if(j == 2  || j == 4   || j == 5 || j == 6  || j == 7   || j == 8    
						|| j == 9  || j == 11  || j == 13 || j == 14
						|| j == 21 || j == 22  || j == 23 || j == 25){
							
							if(j == 11 || j == 14){
								if(j == 14){
									if(cells[j].getSelectedKey() === ""){
										cells[j].setValueState("Error");
										tyreTabValid=false;
									}else{
										var gNo = cells[j]._getSelectedItemText();
										var gLength = 15 + parseInt(gNo);
										for(var m=15; m<gLength;m++){
											if(cells[m].getValue() == ""){
												cells[m].setValueState("Error");
												tyreTabValid=false;
											}
											else{
												cells[m].setValueState("None");	
											}
										}
										cells[j].setValueState("Error");
									}
								}
								if(j == 11){
									if(cells[j].getSelectedKey() === ""){
										cells[j].addStyleClass("myStateError");
										tyreTabValid=false;
									}else{
										cells[j].removeStyleClass("myStateError");
									}
								}
								
							}else{
								if(j==4 || j==5 || j==6 || j==7 ||  j==8 || j==13){
									if(cells[j].getValue() === ""){
										cells[j].setValueState("Error");
										tyreTabValid=false;
									}else{
										cells[j].setValueState("None");
									}
								  }
								
								if(j==9){
								  if(cells[j].getValue() < "1" || cells[j].getValue() === ""){
									cells[j].setValueState("Error");
									tyreTabValid=false;
									}else{
										cells[j].setValueState("None");	
									}	
								} 
								
								if(j==21 || j==22 || j==24){
									if(cells[j].getValue() === ""){
										cells[j].setValueState("Error");
										tyreTabValid=false;
									}else{
										cells[j].setValueState("None");
									}
								  }
								
								if(j==23){
									if(cells[j].getValue() === "" && cells[25].getValue() === ""){
										cells[j].setValueState("Error");
										tyreTabValid=false;
									}else{
										cells[j].setValueState("None");
									}
								  }
								
								if(j==25){
									if(cells[j].getValue() === "" && cells[23].getValue() === ""){
										cells[j].setValueState("Error");
										tyreTabValid=false;
									}else{
										cells[j].setValueState("None");
									}
								  }
						
								
							}
						}
						
					}else{
						
						if(j == 2 || j == 4 || j == 5 || j == 9 || j == 13 ){
							if(cells[j].getValue() === "" || 
									(j==9 && (cells[j].getValue() < "1" || cells[j].getValue() == "" ))){
								cells[j].setValueState("Error");
								tyreTabValid=false;
							}else{
								cells[j].setValueState("None");
							}						
						}
						
						if(j==6 || j==7 || j==8 || j==21 || j==22 || j==23 ||
						   j==24 || j==25){
							cells[j].setValueState("None");
						}
						
						if(j== 14){
							var gNo = cells[j]._getSelectedItemText();
							if(gNo!=""){
							cells[j].setValueState("None");
							var gLength = 15 + parseInt(gNo);
							for(var p=15; p<gLength;p++){
								if(cells[p].getValue() == ""){
									cells[p].setValueState("Error");
									tyreTabValid=false;
								}
								else{
									cells[p].setValueState("None");
								}
							}
							}
							else{
								cells[j].setValueState("Error");	
								tyreTabValid=false;
							}
						}
						
					}
				}
			}
			return tyreTabValid;
		},
		
//		code added for validating fields of usage details tab	
		validUsageTab: function(){
			var usageValid =false;
			var fitmntRim= this.getView().byId("fitmntRim");
			if(fitmntRim.getValue() == ""){
				fitmntRim.setValueState("Error");
				usageValid = false;
			}else{
				fitmntRim.setValueState("None");
				usageValid =true;
			}
			return usageValid;
		},
//		code added for validating fields of tyre availability  tab	
		validTyreAvail:function(){
			var availValid =false;
			var tyreProdDateInp= this.getView().byId("tyreProdDateInp");
			var expectedPlantDateInp= this.getView().byId("expectedPlantDateInp");
			var dispatchDateInp= this.getView().byId("dispatchDateInp");
			if(tyreProdDateInp.getValue() == ""){
				tyreProdDateInp.setValueState("Error");
				availValid = false;
			}else{
				tyreProdDateInp.setValueState("None");
				availValid =true;
			}
			if(expectedPlantDateInp.getValue() == ""){
				expectedPlantDateInp.setValueState("Error");
				availValid = false;
			}else{
				expectedPlantDateInp.setValueState("None");
				availValid =true;
			}
			if(dispatchDateInp.getValue() == ""){
				dispatchDateInp.setValueState("Error");
				availValid = false;
			}else{
				dispatchDateInp.setValueState("None");
				availValid =true;
			}
			return availValid;
		},
		handleIconTabBarSelect: function(oEvent) {
			var filter = oEvent.getParameters().key;
			var tabBar= this.getView().byId("idTestReqCreateTabBar");
			var headerValid= this.validateHeaderDetails();
			if(headerValid){
				this.checkFilter(filter);
			}else{
				tabBar.setSelectedKey("testRequire");
				sap.m.MessageBox.show("Please fill all the mandatory fields in Test Requirements.", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
				});
				return false;
			}
			
// Added on April 15
			if( this.getView().byId("idEdit").getVisible() == false )
				{
				this.setEnableDisableAllFields(true);
				}
//			
		},
		checkFilter: function(filter) {
			switch (filter) {
				case 'testRequire':
					break;
				case 'tyreDetails':
//					this.bindMaterialListSet();
					break;
				case 'usageDetails':
				
					break;
				case 'tyreAvailDetails':
					
					break;
				case "callBackReq":
					this.callBackMethod();
					break;
				case "docs":
					
					break;
			} 
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
	onChangeTableTestType: function(oEvent){
		var tyreType =oEvent.getSource().getSelectedItem().getText();
		var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
		var tbl=this.getView().byId("TyreDetailTable");
		//Enable and disable field based on JKTIL tyre type
		if(tyreType == "JKTIL" || tyreType == "JK TYRE"){
			tbl.getRows()[path].getCells()[1].setValue(tyreType);
			tbl.getRows()[path].getCells()[4].setValue("");
			tbl.getRows()[path].getCells()[5].setValue("");
			tbl.getRows()[path].getCells()[9].setValue("");
			tbl.getRows()[path].getCells()[28].setValue("");
			tbl.getRows()[path].getCells()[29].setValue("");
			
			tbl.getRows()[path].getCells()[2].setEnabled(false);
			tbl.getRows()[path].getCells()[5].setShowValueHelp(true);
			tbl.getRows()[path].getCells()[11].setSelectedKey(this.getView().byId("selectPlant").getSelectedKey());
			tbl.getRows()[path].getCells()[11].setEnabled(true);
			
		
		}else{
			tbl.getRows()[path].getCells()[1].setValue(tyreType);
			tbl.getRows()[path].getCells()[4].setValue("");
			tbl.getRows()[path].getCells()[5].setValue("");
			tbl.getRows()[path].getCells()[9].setValue("");
			tbl.getRows()[path].getCells()[28].setValue("");
			tbl.getRows()[path].getCells()[29].setValue("");
			tbl.getRows()[path].getCells()[2].setEnabled(false);
			tbl.getRows()[path].getCells()[5].setShowValueHelp(false);
			tbl.getRows()[path].getCells()[11].setEnabled(false);
			tbl.getRows()[path].getCells()[11].setSelectedKey("");				
		}
	},
////////////////////////////////////////////////////////////////////////////////////////////////	
	grooveChange: function(e){
		var groveVal =e.getSource().getSelectedKey();
		var path = e.getSource().getParent()._getBindingContext().getPath().split('/')[1];
		var tbl=this.getView().byId("TyreDetailTable");
		var row=tbl.getRows()[path];
		var length=15+ parseInt(groveVal);
		var nsdValue = row.getCells()[13].getValue();
		for(var i=15 ;i<=20 ;i++){
			if(i<length){
				row.getCells()[i].setEnabled(true);
				row.getCells()[i].setValue(nsdValue);
			}else{
				row.getCells()[i].setEnabled(false);
				row.getCells()[i].setValue("");
			}
		}	
	},
		onNSDChange: function(oEvent){
			var nsdVal =oEvent.getSource().getValue();
			var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl=this.getView().byId("TyreDetailTable");
			
			var code = nsdVal.charCodeAt(nsdVal.length-1);
			
				 if ( !(code > 47 && code < 58) && // numeric (0-9)
						!(code == 46) )  // point
					{
					 nsdVal = nsdVal.substring( 0 , nsdVal.length - 1 );
					}			    
				 oEvent.getSource().setValue(nsdVal);
			
			if(nsdVal!==""){
				tbl.getRows()[path].getCells()[14].setEnabled(true);
				if(parseInt(nsdVal) > 99 || parseInt(nsdVal) <= 0){
					oEvent.getSource().setValue("");
					sap.m.MessageBox.alert(
							"NSD value cannot be greater than 100", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error"
							}
					);
				}	
			}
			
			if( nsdVal.toString().indexOf(".") >= 0 )
			{
				nsdVal = nsdVal.toString().substring(0, nsdVal.toString().indexOf(".") + 2);
				oEvent.getSource().setValue(nsdVal);
			}
			
//Added by Ankit on 6 Feb 2019	
			var groove = tbl.getRows()[path].getCells()[14].getSelectedKey();
			var length=15+ parseInt(groove);
			for(var i=15 ;i<=20 ;i++){
				if(i<length){
					tbl.getRows()[path].getCells()[i].setEnabled(true);
					tbl.getRows()[path].getCells()[i].setValue(nsdVal);
				}else{
					tbl.getRows()[path].getCells()[i].setEnabled(false);
					tbl.getRows()[path].getCells()[i].setValue("");
				}
			}	
	},
		
		onNoOFTyreChange: function(oEvent){
			debugger
			var tyreNo 		=	oEvent.getSource().getValue();
			var path 		= 	oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl  		=	this.getView().byId("TyreDetailTable");
			var ptQtyCol	= 	this.getView().byId("ptQtyCol");
			var testcat 	= 	this.getView().byId("selectTestcat").getSelectedKey(); 
			var rows 		= 	tbl.getRows();
			var cells       =   rows[path].getCells();			
			
			if(tyreNo){
				if(isNaN(tyreNo)){
					tyreNo = tyreNo.substring(0, tyreNo.length - 1);
					oEvent.getSource().setValue(tyreNo);
				}		
					
				if(tyreNo.includes(".")){
					tyreNo = tyreNo.substring(0, tyreNo.length - 1);
					oEvent.getSource().setValue(tyreNo);
				}
				if(testcat == "05"){
					cells[28].setValue();
					cells[29].setValue(tyreNo);
				}
			}else{
				if(testcat == "05"){
					cells[28].setValue();
					cells[29].setValue();
				}
			}
		
		},
		
		
		onGrooveValidChange: function(oEvent){
			var diaMNo =oEvent.getSource().getValue();
			var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl=this.getView().byId("TyreDetailTable");
			var nsd = tbl.getRows()[path].getCells()[13].getValue();
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);
					
				}else if(parseInt(diaMNo) > parseInt(nsd)){
					oEvent.getSource().setValue("");
//					 changed by Hans on 12/11/2018 (message changed)		
					sap.m.MessageBox.alert(
							"NSD cannot be greater than original NSD.", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error"
							}
						);
				}		
			}
			if( diaMNo.toString().indexOf(".") >= 0 )
			{
				diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
				oEvent.getSource().setValue(diaMNo);
			}
		},
		
		onGrooveLiveChange: function(oEvent){
			var groove = oEvent.getSource();
			if(groove.getValue() <= 0){
				sap.m.MessageBox.alert(
						"Groove value must be greater than 0.", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
					});
				groove.setValue("");
			}
			
		},
		
		onNumberValidChange: function(oEvent){
			var diaMNo =oEvent.getSource().getValue();
			var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl=this.getView().byId("TyreDetailTable");
			var nsd = tbl.getRows()[path].getCells()[13].getValue();
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);				
				}	
			}
			if(parseInt(diaMNo) > 1000){
				oEvent.getSource().setValue("");
				sap.m.MessageBox.alert(
						"Value can not be greater than 1000", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
			}
		},
		onDiameterValidChange: function(oEvent){
			var diaMNo =oEvent.getSource().getValue();
			var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl=this.getView().byId("TyreDetailTable");
			var nsd = tbl.getRows()[path].getCells()[13].getValue();
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);				
				}	
			}
			if(parseInt(diaMNo) > 10000){
				oEvent.getSource().setValue("");
				sap.m.MessageBox.alert(
						"Value can not be greater than 10000", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
			}
			if( diaMNo.toString().indexOf(".") >= 0 )
			{
				diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
				oEvent.getSource().setValue(diaMNo);
			}
		},
		onDiscountChange: function(oEvent){
			var diaMNo =oEvent.getSource().getValue();
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);
					
				}else{
					if(parseInt(diaMNo) > 100){
						oEvent.getSource().setValue("");
						sap.m.MessageBox.alert(
								"Discount value can not be greater than 100", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Error"
								}
							);
					}
				}		
			}
		},
		onLiveChangePtQty: function(oEvent){
			debugger
			var tyreNo =oEvent.getSource().getValue();
			var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			
			var tbl		=this.getView().byId("TyreDetailTable");
			var rows 	=tbl.getRows()[path];
			var cells   =rows.getCells();
			var notyre  =parseInt(cells[9].getValue()); 
			
			if(tyreNo){
				if(isNaN(tyreNo)){
					tyreNo = tyreNo.substring(0, tyreNo.length - 1);
					oEvent.getSource().setValue(tyreNo);
				}		
					
				if(tyreNo.includes(".")){
					tyreNo = tyreNo.substring(0, tyreNo.length - 1);
					oEvent.getSource().setValue(tyreNo);
				}
				if( parseInt(tyreNo) > notyre ){
					oEvent.getSource().setValue();
					cells[29].setValue(notyre);
					sap.m.MessageBox.alert(
							"PT Quantity can not be greater than No. of Tyres.", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error"
							}
						);
					return;
				}	
				if( parseInt(tyreNo) == notyre ){
					oEvent.getSource().setValue();
					cells[29].setValue(notyre);
					sap.m.MessageBox.alert(
							"PT Quantity can not be equal to No. of Tyres.", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error"
							}
						);
					return;
				}	
				
				notyre = notyre - parseInt(tyreNo);
				cells[29].setValue(notyre);
			}else{
				oEvent.getSource().setValue();
				cells[29].setValue(notyre);
			}

		},
		
		onChangeNoOfTyres: function(oEvent){
			
			debugger
			var getNoOfTyres=	parseInt(oEvent.getSource().getValue());
			var path 		= 	oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl			=	this.getView().byId("TyreDetailTable");
			var testcat 	= 	this.getView().byId("selectTestcat").getSelectedKey(); 
			var rows 		= 	tbl.getRows()[path];
			var cells       =   rows.getCells();	
			
			var ftFitQty = parseInt(tbl.getRows()[path].getCells()[33].getValue());			
			
			if (getNoOfTyres < ftFitQty || oEvent.getSource().getValue() == ""){
				sap.m.MessageBox.alert(
						" "+ftFitQty+" Quantity already fitted.", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
				oEvent.getSource().setValueState("Error");
				return false;
			}else{
				oEvent.getSource().setValueState("None");
			}
		},
		
		
		onChangePtQty:function(oEvent){
			debugger	
			debugger
			var tyres		=	parseInt(oEvent.getSource().getValue());
			var path 		= 	oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl			=	this.getView().byId("TyreDetailTable");
			var testcat 	= 	this.getView().byId("selectTestcat").getSelectedKey(); 
			var rows 		= 	tbl.getRows()[path];
			var cells       =   rows.getCells();
			var ftqty       =   cells[29].getValue();
			var notyre 		=   parseInt(cells[9].getValue());
			
			var ftFitQty = parseInt(tbl.getRows()[path].getCells()[33].getValue());			
			
			if (ftqty < ftFitQty){
				sap.m.MessageBox.alert(
						" "+ftFitQty+" Quantity already fitted.", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
				oEvent.getSource().setValue();
				cells[29].setValue(notyre);
				oEvent.getSource().setValueState("Error");
				return false;
			}else{
				oEvent.getSource().setValueState("None");
			}			

			
		},
		
		/********************Code added for Usage Details Tab************************/ 
		
		onRecommendPSIChange: function(oEvent){
			var recommentdPsi =oEvent.getSource().getValue();
//			if(recommentdPsi){
//				if(isNaN(recommentdPsi)){
//					recommentdPsi = recommentdPsi.substring(0, recommentdPsi.length - 1);
//					oEvent.getSource().setValue(recommentdPsi);
//					
//				}		
//			}
		},
		addNewVehicleDetail: function(){
			that.initialLoad=false;
			var UsageTbl = this.getView().byId("vehiclDetail");
				var tyreDetailData={		
	        		VehicleMake: "",
	        		VehicleModel: "",
	        		ConfigCode: "",
	        		
	        		TestingAxle:"",
	        		VehicleApplication:"",
	        		FitmentAxle:"",
	        		DualSpacing:"",
	        		Remarks:""
				}
				var data = UsageTbl.getModel().getData();
				this.usageDetails = UsageTbl.getModel().getData();
				var len = UsageTbl.getRows().length;
				if(len > 0){
					tyreDetailData.VehicleMake = data[data.length-1].VehicleMake;
					tyreDetailData.VehicleModel= data[data.length-1].VehicleModel;
					tyreDetailData.ConfigCode= data[data.length-1].ConfigCode;
					tyreDetailData.TestingAxle= data[data.length-1].TestingAxle;
					tyreDetailData.VehicleApplication= data[data.length-1].VehicleApplication;
					tyreDetailData.FitmentAxle= data[data.length-1].FitmentAxle;
					tyreDetailData.DualSpacing= data[data.length-1].DualSpacing;
					tyreDetailData.Remarks= data[data.length-1].Remarks;
					this.usageDetails.push(tyreDetailData);
				}else{
					this.usageDetails.push(tyreDetailData);
				}
				UsageTbl.getModel().setData(this.usageDetails);
				UsageTbl.getModel().refresh();
				for(var i=0; i< UsageTbl.getRows().length;i++){
					var key =UsageTbl.getRows()[i].getCells()[5].getSelectedKey();
					if(key === "02"){
						UsageTbl.getRows()[i].getCells()[6].setEnabled(true);
					}else{
						UsageTbl.getRows()[i].getCells()[6].setEnabled(false);
					}
				}
				var UsageTyreDetailTableCount = UsageTbl.getModel().getData().length;
				UsageTbl.setVisibleRowCount(UsageTyreDetailTableCount);
				
		},
		onRemoveUsageDetail: function(oEvent){
			var UsageTbl = this.getView().byId("vehiclDetail");
			var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			if (path !== -1) {
				UsageTbl.getModel().getData().splice(path,1);
				UsageTbl.getModel().refresh();
				var UsageTyreDetailTableCount = UsageTbl.getModel().getData().length;
				UsageTbl.setVisibleRowCount(UsageTyreDetailTableCount);
			     }
		},
		onChangeFitmentAxle: function(e){
			var selItem =  e.getSource().getSelectedKey();
			var path = e.getSource().getParent()._getBindingContext().getPath().split('/')[1];
			var tbl=this.getView().byId("vehiclDetail");
			var dualSpacing = tbl.getRows()[path].getCells()[6];
			if(selItem == "02"){
				dualSpacing.setEnabled(true);
			}else{
				dualSpacing.setEnabled(false);
				dualSpacing.setValue("");
			}
			
		},
		
		
		/******************************code ends*************************************/
		payLoadDate: function(SDateValue) 
		{
			var str = "T00:00:00";
			var currentTime = new Date(SDateValue);
			var month = currentTime.getMonth() + 1;
			if(month.toString().length == 1)
				month = "0" + month;
			var day = currentTime.getDate();
			if(day.toString().length == 1)
				day = "0" + day;
			var year = currentTime.getFullYear();
			var date = year + "-" + month + "-" + day + str;
			return date;
		},
		/********************Code added for Tyre Availability Details Tab************************/
		expectProdDate: function(oEvent){
			debugger
			var tyreProdDateInp= this.getView().byId("tyreProdDateInp");
			var prodDate = tyreProdDateInp.getDateValue();
			this.byId("expectedPlantDateInp").setMinDate(prodDate);  
			
			this.byId("expectedPlantDateInp").setValue();
			this.byId("dispatchDateInp").setValue();
			this.byId("availabilityDateInp").setValue();
			this.byId("commencementDateInp").setValue();
		},

		
		expectPlantDate: function(){
			var expectedPlantDateInp= this.getView().byId("expectedPlantDateInp");
			var plantDate = expectedPlantDateInp.getDateValue();
		/*	var date1 = this.payLoadDate(plantDate);	*/			
			
			this.byId("dispatchDateInp").setMinDate(plantDate);
			var dispatchDateInp= this.getView().byId("dispatchDateInp");
			dispatchDateInp.setEnabled(true);
			
			this.byId("dispatchDateInp").setValue();
			this.byId("availabilityDateInp").setValue();
			this.byId("commencementDateInp").setValue();
	},
		expectDispatchDate: function(oEvent){
			var expectedPlantDateInp= this.getView().byId("expectedPlantDateInp");
			var dispatchDateInp= this.getView().byId("dispatchDateInp");
			var availabilityDateInp= this.getView().byId("availabilityDateInp");
			var commencementDateInp= this.getView().byId("commencementDateInp");
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({	pattern: "yyyy-MM-dd"	});
			
			
			var plantDate = expectedPlantDateInp.getDateValue();
			var dispatchDate = dispatchDateInp.getDateValue();
	/*		var date1 = this.payLoadDate(dispatchDate);*/

			var tmpPlant = plantDate.setHours(0, 0, 0, 0);

			var tmpDispatch = dispatchDate.setHours(0, 0, 0, 0);
			var availDate = new Date(tmpDispatch);
			availDate.setDate(availDate.getDate() + 10);
			
			var commencDate = new Date(tmpDispatch);
			commencDate.setDate(commencDate.getDate() + 25);
			

			if (tmpDispatch < tmpPlant) {
				
				sap.m.MessageBox.alert(
					"Expected Dispatch Date cannot be less than Expected Plant Date", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Alert"
					}
				);
				dispatchDateInp.setValueState("Error");
				dispatchDateInp.setValue(null);
				availabilityDateInp.setValue(null);
				commencementDateInp.setValue(null);
				return false;
			} else{
				dispatchDateInp.setValueState("None");
				availabilityDateInp.setValue(dateFormat.format(availDate));
				commencementDateInp.setValue(dateFormat.format(commencDate));
				
			}
},
		/**************************************code ends*****************************************/
		
	/************************************Callback details tab***********************************/
	callBackMethod: function(){
		var materialJson = new sap.ui.model.json.JSONModel();
		var oTable = this.getView().byId("TyreDetailTable");
		var len=oTable.getModel().getData().length;
		var data = oTable.getModel().getData();
		var matArr=[];
		for(var i=0;i<len;i++){
			var mat={};
			mat.Group=data[i].Group;
			mat.GroupDesc = data[i].GroupDesc;	
			mat.Material = data[i].Material;
			mat.Maktx = data[i].Maktx;
			matArr.push(mat);
		}
		materialJson.setData(matArr);
		this.getView().setModel(materialJson,"materialJson");
		
		
		var stageKey = this.getView().byId("selectTestreq").getSelectedKey();
		var stageJModel = new sap.ui.model.json.JSONModel();
		var oTable = this.getView().byId("TyreDetailTable");
		var stageData = this.getView().getModel("stageJson").getData();
		var stgArr=[];
		for(var i=0;i<parseInt(stageKey);i++){
			var mat={};
			mat.Stage=stageData[i].TestReq;
			mat.StageDesc = stageData[i].TestReqDesc;
			stgArr.push(mat);
		}
		stageJModel.setData(stgArr);
		this.getView().setModel(stageJModel,"stageJModel");
		
		var groupJson = new sap.ui.model.json.JSONModel();
		var data=oTable.getModel().getData();
		var grpArr=[];
		for(var i=0;i<data.length;i++){
			var grp={};
			grp.Group=data[i].Group;
			grp.NoOfTyres=data[i].NoOfTyres;
			grp.FtQty = data[i].FtQty;
			grpArr.push(grp);
		}
		groupJson.setData(grpArr);
		this.getView().setModel(groupJson,"groupJson");
	},
		addNewCallbackDetail: function(){
		var callBackTbl = this.getView().byId("CALLBACKDetail");
			var callbackData={		
				Location: "",
				GroupType: "",
				NoOfTyres: "",
				Wear:"",
				Destination:"",
				TestReq:"",
				AnalysisReason:""
        		
			}
			var data = callBackTbl.getModel().getData();
			this.callbackDetails = callBackTbl.getModel().getData();
			var len = callBackTbl.getRows().length;
			if(len > 0){
				callbackData.Location = data[data.length-1].Location;
				callbackData.GroupType= data[data.length-1].GroupType;
				callbackData.NoOfTyres= data[data.length-1].NoOfTyres;
//				callbackData.NoOfTyres= "";
				callbackData.Wear= data[data.length-1].Wear;
				callbackData.Destination= data[data.length-1].Destination;
				callbackData.TestReq= data[data.length-1].TestReq;
				callbackData.AnalysisReason= data[data.length-1].AnalysisReason;
				
				this.callbackDetails.push(callbackData);
			}else{
				this.callbackDetails.push(callbackData);
			}
			callBackTbl.getModel().setData(this.callbackDetails);
			var UsageTyreDetailTableCount = callBackTbl.getModel().getData().length;
			callBackTbl.setVisibleRowCount(UsageTyreDetailTableCount);

			
	},
			onRemoveCallBackDetail: function(oEvent){
				var callBackTbl = this.getView().byId("CALLBACKDetail");
				var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
				if (path !== -1) {
					callBackTbl.getModel().getData().splice(path,1);
					callBackTbl.getModel().refresh();
					var UsageTyreDetailTableCount = callBackTbl.getModel().getData().length;
					callBackTbl.setVisibleRowCount(UsageTyreDetailTableCount);
				     }
			},

			validateTyreDetails: function(){
				var valid=false;
				var err=0;
				var TyreDetailTable = this.getView().byId("TyreDetailTable");
				var rows= TyreDetailTable.getRows();
				for(var i=0;i<rows.length;i++){
					var cell= rows[i].getCells();
					for(j=0;j<cell.length;j++){
						
						if(cell[j].getId().includes("input")){
							if(cell[j].mProperties.value == "" && cell[j].getEnabled()){
								cell[j].setValueState("Error");
								err++;							
							}else{
								cell[j].setValueState("None");
							}
						} 
						if(cell[j].getId().includes("select")){
							if(cell[j].mProperties.selectedKey == "" && cell[j].getEnabled()){
								cell[j].addStyleClass("myStateError");
								err++;
								
							}else{
								cell[j].removeStyleClass("myStateError");
							}

						}
					}
				}
				if(err<=0){
					 valid=true;
				}else{
					valid=false; 
				}
				return valid;
			},
			validateUsageDetails: function(){
				var valid=false;
				var err=0;
				var vehicleTable = this.getView().byId("vehiclDetail");	
				var rows= vehicleTable.getRows();
				for(var i=0;i<rows.length;i++){
					var cell= rows[i].getCells();
					for(j=0;j<cell.length;j++){
						
						if(cell[j].getId().includes("input")){
							if(cell[j].mProperties.value == "" && cell[j].getEnabled()){
								cell[j].setValueState("Error");
								err++;
								
							}else{
								cell[j].setValueState("None");
								
							}
						} 
						if(cell[j].getId().includes("select")){
							if(cell[j].mProperties.selectedKey == "" && cell[j].getEnabled()){
								cell[j].setValueState("Error");
								err++;								
							}else{
								cell[j].setValueState("Error");
							}

						}
					}
				}
				if(err<=0){
					 valid=true;
				}else{
					valid=false; 
				}
				return valid;
			},
			
		//  code added for binding ply rating in tyre details tab
			
			onPlyFragment:function(e){
				this.lineItem = e.getSource();
				var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4PlyRatingSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false,
						false, null);
				if(jModel.getData().d.results.length){
				var _valueHelpPlyelectDialog = new sap.m.SelectDialog(
						{

							title : "Select Ply Rating",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title : "{PlyRating}",
//											Description:"{HubCode}",
											customData : [ new sap.ui.core.CustomData(
													{
														key : "Key",
														value : "{PlyRating}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent
										.getParameter("value");

							var oFilter = new sap.ui.model.Filter("PlyRating",sap.ui.model.FilterOperator.Contains,sValue);
							var oFilter1=new sap.ui.model.Filter([oFilter], false /*AND*/);
								oEvent.getSource().getBinding("items")
										.filter([ oFilter1 ]);
							},
							confirm : [ this._handlePlyClose, this ],
							cancel : [ this._handlePlyClose, this ]
						});
				_valueHelpPlyelectDialog.setModel(jModel);
				_valueHelpPlyelectDialog.open();
				}else{
				
				}
			},
			_handlePlyClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					var title = oSelectedItem.getTitle();
					this.lineItem.getParent().getCells()[6].setValue(title);
				}

			},
			
		//  code added for binding load index in tyre details tab
			
			onLoadFragment:function(e){
				this.lineItem = e.getSource();
				var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4LoadIndexSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false,
						false, null);
				if(jModel.getData().d.results.length){
				var _valueHelpLoadelectDialog = new sap.m.SelectDialog(
						{

							title : "Select Load Index",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title : "{LoadIndex}",
//											Description:"{HubCode}",
											customData : [ new sap.ui.core.CustomData(
													{
														key : "Key",
														value : "{LoadIndex}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent
										.getParameter("value");

							var oFilter = new sap.ui.model.Filter("LoadIndex",sap.ui.model.FilterOperator.Contains,sValue);
							var oFilter1=new sap.ui.model.Filter([oFilter], false /*AND*/);
								oEvent.getSource().getBinding("items")
										.filter([ oFilter1 ]);
							},
							confirm : [ this._handleLoadClose, this ],
							cancel : [ this._handleLoadClose, this ]
						});
				_valueHelpLoadelectDialog.setModel(jModel);
				_valueHelpLoadelectDialog.open();
				}else{
				
				}
			},
			_handleLoadClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					var title = oSelectedItem.getTitle();
					this.lineItem.getParent().getCells()[7].setValue(title);
				}

			},
			
	//  code added for binding speed rating in tyre details tab
			
			onSpeedFragment:function(e){
				this.lineItem = e.getSource();
				var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4SpeedRatingSet";
				var jModel = new sap.ui.model.json.JSONModel();
				jModel.loadData(sPath, null, false, "GET", false,
						false, null);
				if(jModel.getData().d.results.length){
				var _valueHelpSpeedselectDialog = new sap.m.SelectDialog(
						{

							title : "Select Speed Rating",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
										{
											title : "{SpeedRate}",
//											Description:"{HubCode}",
											customData : [ new sap.ui.core.CustomData(
													{
														key : "Key",
														value : "{SpeedRate}"
													}) ],

										}),
							},
							liveChange : function(oEvent) {
								var sValue = oEvent
										.getParameter("value");

							var oFilter = new sap.ui.model.Filter("SpeedRate",sap.ui.model.FilterOperator.Contains,sValue);
							var oFilter1=new sap.ui.model.Filter([oFilter], false /*AND*/);
								oEvent.getSource().getBinding("items")
										.filter([ oFilter1 ]);
							},
							confirm : [ this._handleSpeedClose, this ],
							cancel : [ this._handleSpeedClose, this ]
						});
				_valueHelpSpeedselectDialog.setModel(jModel);
				_valueHelpSpeedselectDialog.open();
				}else{
				
				}
			},
			_handleSpeedClose : function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					var title = oSelectedItem.getTitle();
					this.lineItem.getParent().getCells()[8].setValue(title);
				}

			},
			
			
//			code added for binding stage data for callback tab
			bindStageListSet: function(){
				
				var oViewObj = this.getView();
				var stageJson = oViewObj.getModel("stageJson");
				if (!stageJson) {
					stageJson = new sap.ui.model.json.JSONModel();
					oViewObj.setModel(stageJson, "stageJson");
				}
				var filters = [];
				var sPathStageListSet = "/F4TestRequirementSet";
				var frameworkODataModel = this.getOwnerComponent().getModel();
				var oParamsMatListSet = {};
				oParamsMatListSet.context = "";
				oParamsMatListSet.filters = filters;
				oParamsMatListSet.urlParameters = "";
				oParamsMatListSet.success = function(oData, oResponse) { // success handler

					stageJson.setData(oData.results);
				};
				oParamsMatListSet.error = function(oError) { // error handler 
					jQuery.sap.log.error("read publishing group data failed");
					sap.m.MessageToast.show.show(JSON.parse(oError.responseText).error.message.value);
				};
				frameworkODataModel.read(sPathStageListSet, oParamsMatListSet);
				frameworkODataModel.attachRequestCompleted(function() {});

				
			},

			
			onCallbackMaterialChange: function(oEvent){
				oEvent.getSource().getParent().getCells()[2].setValue("");
//				var matVal= oEvent.getSource().getSelectedKey();
//				var data = this.getView().getModel("groupJson").getData();
//				for(var i=0;i<data.length;i++){
//					if(matVal == data[i].Group){
//						this.glodata[i].NoOfTyres;
//					}
//				}
			},
			
	//code added for adding tyre in callback table based on number of tyres in tyre table as per group chosen	
			onUsageTyreChange: function(oEvent){
				var tyreNo =oEvent.getSource().getValue();
				var testCategory = this.getView().byId("selectTestcat").getSelectedKey();
				var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
				var tbl=this.getView().byId("CALLBACKDetail");
				if(tyreNo){
					if(isNaN(tyreNo)){
						tyreNo = tyreNo.substring(0, tyreNo.length - 1);
						oEvent.getSource().setValue(tyreNo);
					}else{
						if(tyreNo.includes(".")){
							tyreNo = tyreNo.substring(0, tyreNo.length - 1);
							oEvent.getSource().setValue(tyreNo);
						}
					}		
				}
				
				var tyreVal = oEvent.getSource().getValue();
				var tmpVal = tyreVal;
				var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
				var group = oEvent.getSource().getParent().getCells()[1].getSelectedKey();
				
//				callback table data
				var cbtbl=this.getView().byId("CALLBACKDetail");
				var cbData = cbtbl.getRows();
				
				for(var i= 0 ; i<cbData.length;i++){
					if(cbData[i].getCells()[1].getSelectedKey() == group){
						var val = cbData[i].getCells()[2].getValue();
						if(val == ""){
							val = 0 ;
						}
						tyreVal = parseInt(tyreVal) + parseInt(val);
						 
					}
				}
				tyreVal = tyreVal - parseInt(tmpVal);
				
//				tyre detail table data		
				var data = this.getView().getModel("groupJson").getData();
				for(var k= 0 ; k<data.length;k++){
					if(data[k].Group == group){
						if(testCategory !== "05"){
							if(parseInt(tyreVal) > parseInt(data[k].NoOfTyres)){
								sap.m.MessageBox.alert(
										"Cannot exceeds tyre values of same group", {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: "Error"
										}
									);
								oEvent.getSource().setValue("");
							}
						}else{
							if(parseInt(tyreVal) > parseInt(data[k].FtQty)){
								sap.m.MessageBox.alert(
										"Cannot exceeds tyre values of same group", {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: "Error"
										}
									);
								oEvent.getSource().setValue("");
							}
						}
					}
				}
				
				
			},
	
			onPrint : function(){
				
				var ReqGuid = this.ReqGuid;
				var RevNo   = this.RevNo;
				sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/TestRequestOutputFormSet(ReqGuid='"+ReqGuid+"',RevNo='"+RevNo+"')/$value", true);
			},
	
	onBackNav : function(){
		var eMode= false;
		this.setEnableDisableAllFields(eMode);
		this.getView().byId("idEdit").setVisible(true);
		
		this.getView().byId("saveBtn").setVisible(false);
		this.getView().byId("CancelBtn").setVisible(false);
		
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("page1");
	},
	
    // ************************************File Upload *********************	
	onAttachUpload: function(oEvent){
		debugger
		var oFileUploader = oEvent.getSource();		
		
	    var _that = this;
	    var csrf = that.getCSRFToken();
	    
	    var oUploadCollection = oEvent.getSource();
	    var oCustomerHeaderToken = new UploadCollectionParameter({
		name : "x-csrf-token",
		value : that.token
	    });
	    oUploadCollection.addHeaderParameter(oCustomerHeaderToken);	
	},
	
    getCSRFToken: function() {	
    	debugger
    	var that=this;
    	$.ajax({	url: "/sap/opu/odata/sap/ZAPS_UTILITY_SRV",	type: "GET",	async: false,	
    		beforeSend: function(xhr) { 
    			xhr.setRequestHeader("X-CSRF-Token", "Fetch");	
    		},
    		complete: function(xhr) {	
    			that.token = xhr.getResponseHeader("X-CSRF-Token");	
    		}
    	});
    },		

	onBeforeUploadStarts : function(oEvent) {
	    var oVal = oEvent.getParameter("value");	    
    
	    var fileName = oEvent.getParameter("fileName");
	    var oSlug = fileName;

	    // Header Slug
	    var oCustomerHeaderSlug = new UploadCollectionParameter({
		name : "slug",
		value : oSlug
	    });
	    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
	},
	    
	onUploadComplete : function(oEvent) {
	    var oUploadCollection = oEvent.getSource();
	    var oResData = oEvent.getParameter("files")[0];
	    if (oResData.status == "201") {
		var oData = oUploadCollection.getModel("oUploadModel").getData();
		
	 	var docId = oResData.headers["doc_no"];
		
		var host = window.location.host;
		var protocol = window.location.protocol;
		var urlprefix = protocol + "//" + host;		
	
		var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + docId + "')/$value";

		oData.items.unshift({
		    "DocNo" : docId, // document number,
		    "FileName" : oResData.fileName,
		    "MimeType" : oResData.headers["content-mimetype"],
		    "Url" : sURL,
		});	
		
		debugger
		var uploadDetails= {};
		uploadDetails.FileName = oResData.fileName
		uploadDetails.DocNo= docId;
		uploadDetails.UpdateFlag= "";
		uploadDetails.MimeType = oResData.headers["content-mimetype"]
		var model = that.getView().getModel("attachmentModel");
		var data = model.getData();
		data.push(uploadDetails);
		
		
		oUploadCollection.getModel("oUploadModel").refresh();

		// delay the success message for to notice onChange message
		setTimeout(function() {sap.m.MessageToast.show("Uploaded successfully");
		}, 4000);
	    } else if (oEvent.getParameter("files")[0].status == "0") {
		oUploadCollection.fireUploadTerminated();
	    } else {
		var errmessage = "File Upload failed : " + oEvent.getParameter("files")[0].responseRaw;
		sap.m.MessageBox.show(errmessage, sap.m.MessageBox.Icon.ERROR, "Error");
		oUploadCollection.fireUploadTerminated();
	    }
	},		
	
   
/*    onTypeMissmatch: function(oEvent){
    	debugger
    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
    	return false;
    },*/
    
   
    onFileDeleted : function(oEvent) {
        var oSrc = oEvent.getSource();
        var uploadModel = oSrc.getModel("oUploadModel");
        var uItems = uploadModel.getProperty("/items");
        var oItem = oEvent.getParameter("item");
        var oContext = oItem.getBindingContext("oUploadModel")
        if (!oContext) {
          uploadModel.setProperty("/items", uItems);
          return;
        }
        var sPath = oContext.getPath();
        var sIndex = sPath.split("/").pop();
        var docId = oEvent.getParameter("documentId");
        
        uItems.splice(sIndex,1);
        uploadModel.refresh();
            
        var data = that.getView().getModel("attachmentModel").getData();
        var exist;
		for(var i=0;i<data.length;i++){
		  if(data[i].DocNo==docId){
			exist = "X";  
			data[i].UpdateFlag = "D";  
		  }	
		}
		
		if(exist !== "X"){
			var obj={};
			obj.FileName = oItem.getFileName();
			obj.MimeType = oItem.getMimeType();
			obj.DocNo = docId;
			obj.UpdateFlag = "D";
			data.push(obj);
		}
      },    
      
      getAttachmentDetails: function(selectedGuId){        //document upload
			var oView = this.getView();
			var oUploadModel = this.getView().getModel("oUploadModel");
			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
			var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='02',ObjectName='"+selectedGuId+"')?$expand=ImageObjectToDataNvg";
			var oParamsAttachmentSet = {};
			oParamsAttachmentSet.context = "";
			oParamsAttachmentSet.urlParameters = "";
			oParamsAttachmentSet.success = function(oData, oResponse) { // success handler
				if (oData.ImageObjectToDataNvg.results.length > 0){
					
					var results = oData.ImageObjectToDataNvg.results;					
					var host = window.location.host;
					var protocol = window.location.protocol;
					var urlprefix = protocol + "//" + host;		
					
					for (var i=0;i<results.length;i++){
						var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
						results[i].Url = sURL; 
					}
					
					oUploadModel.setData({
						items:oData.ImageObjectToDataNvg.results
					});
				}
				else{
					oUploadModel.setData({items:[]});	
				}
			};
			oParamsAttachmentSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);

			oCreateModel1.read(sPathAttachmentSet, oParamsAttachmentSet);

			oCreateModel1.attachRequestCompleted(function() {
				
			});
		},

    // **********************File upload Finish****************************	
	
});

});

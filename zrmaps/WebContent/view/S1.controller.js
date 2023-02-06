sap.ui.define([
	/*"sap/ui/core/util/Export",*/
	"sap/m/MessageBox",
	/*"sap/ui/core/util/ExportTypeCSV",*/
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
/*	"sap/ui/export/Spreadsheet",*/
	
	"zrmaps/util/Formatter"
	],

function(Export,Controller, JSONModel,ExportTypeCSV,Spreadsheet, MessageBox,  Formatter) {
"use strict";	
var race, testPlan, testRequest, fitmentInspection, claimInspection,selectedGuId;

return sap.ui.controller("zrmaps.view.S1", {
	
onInit: function(){
debugger
/******************************Set initial date in input field**********************************************************************/
	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
	
	var date = new Date(), y = date.getFullYear(), m=date.getMonth();
	var firstDay = new Date(y,m,1);
	var currentDate = new Date;
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
	this.fromDate = dateFormat.format(firstDay)+"T00:00:00";
	this.toDate = dateFormat.format(currentDate)+"T00:00:00";
	currentDate = oDateFormat.format(currentDate);
	firstDay = oDateFormat.format(firstDay);
	
	var initialDateValue = firstDay + " - "  + currentDate;
	this.getView().byId("fromDate").setValue(firstDay);
	this.getView().byId("toDate").setValue(currentDate);
	
	var oDatePickerHr = this.getView().byId("fromDate"); 
	oDatePickerHr.addEventDelegate({ 

		onAfterRendering: function(){ 
		var oDateInnerHr = this.$().find('.sapMInputBaseInner'); 
		var oIDHr = oDateInnerHr[0].id; 
		$('#'+oIDHr).attr("disabled", "disabled"); 
		}},
	oDatePickerHr); 

},


/********************************************On Button Press****************************************************************************************/

onButtonPress : function(evt){
	debugger
	var varIndex = evt.getSource().getBindingContext("FtDocJModel").getPath().split('/')[1];
	var getImgModel = new sap.ui.model.json.JSONModel();
	this._helpdialog = sap.ui.xmlfragment("zrmaps.view.ShowImgFrag", this);
	this._helpdialog.setModel(getImgModel, "getImgModel");
	this.FnGetData(varIndex);
	this._helpdialog.open();
},

FnGetData : function(varIndex){
	debugger
	var that = this;
	var AppId = this.getView().byId("idMaster").getSelectedKey();
	var PlanNo = this.getView().byId("idTestPlan").getValue();
	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	    pattern : "dd-MM-YYYY"
	});
	
	var fromDate = this.getView().byId("fromDate").getValue();
	var fromSplit = fromDate.split(".");
	var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
	var dateFrom = fValue+"T00:00:00";
	
	var toDate = this.getView().byId("toDate").getValue();		
	var toSplit = toDate.split(".");
	var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
	var dateTo = tValue+"T00:00:00";
	
	var imgDataJModel = this._helpdialog.getModel("getImgModel");
	var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
	var sPath = "GetPlanImagesSet?$expand=PlanToImagesNvg&$filter=PlanNumber eq '"+PlanNo+"' and DateFrom eq datetime'"+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and RegNo eq '' and ApplicationId eq '"+AppId+"'"
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	 oReadModel.setHeaders({"Content-Type" : "application/json"});
	                           
	var fncSuccess = function(oData, oResponse){	
		debugger
		imgDataJModel.setData(oData.results);
			that.funGetImage(varIndex);
		 }
		                           
	 var fncError = function(oError) { // error callback
	 	        
 }
 
 oReadModel.read(sPath, {
	  success : fncSuccess,
	   error : fncError
	   });
},

funGetImage : function(varIndex){
	debugger
	var Imgdata = this._helpdialog.getModel("getImgModel");
	var getimgData = Imgdata.getData();
	var getImageJModel = new sap.ui.model.json.JSONModel();
	var idimgtble = sap.ui.getCore().byId("idImgTable");
	getImageJModel.setData(getimgData[varIndex].PlanToImagesNvg);
	idimgtble.setModel(getImageJModel,"getImageJModel");
	selectedGuId = getImageJModel.oData.results[0].ObjectName;
	
	//show image in table
	/*var lv_items = sap.ui.getCore().byId("idImgTable").getItems();
	for(var i=0; i<lv_items.length; i++){
		for(var j=0; j<1; j++){
			var lvcell = lv_items[i].getCells()[1]; 
			lvcell.setSrc("http://jkwgdev.jkti.com:8000/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='"+getImageJModel.oData.results[i].ObjectName+"')/$value");
			//var imgpath = "getImageJModel.oData.results[0].__metadata.uri"
			
		}
	}*/
	
},
/***********************************************On Cancel Button*************************************************************************************/
Oncancel : function(){
	this._helpdialog.close();
	this._helpdialog.destroy(true);
	this._helpdialog = undefined;
},
/*************************************************************************************************************************************/
onAfterRendering:function(){
	var oDatePickerHr = this.getView().byId("toDate"); 
	oDatePickerHr.addEventDelegate({ 

		onAfterRendering: function(){ 
		var oDateInnerHr = this.$().find('.sapMInputBaseInner'); 
		var oIDHr = oDateInnerHr[0].id; 
		$('#'+oIDHr).attr("disabled", "disabled"); 
		}},
	oDatePickerHr); 

},
/*******************************************On Master Change**************************************************************************************/
onMasterChange:function(){
	debugger
	var master= this.getView().byId("idMaster").getSelectedKey();
	if(master == "01"){
		this.getView().byId("idRace").setVisible(true);
		
		this.getView().byId("idVechileNumber").setVisible(true);
		this.getView().byId("fromDate").setVisible(true);
		this.getView().byId("idClear").setVisible(true);
		
		this.getView().byId("toDate").setVisible(true);
		this.getView().byId("idSearch").setVisible(true);

		this.getView().byId("idTstRequest").setVisible(false);
		this.getView().byId("idTestPlan").setVisible(false);
		this.getView().byId("idFTI").setVisible(false);
		this.getView().byId("idClaimIBD").setVisible(false);
		
	}else if(master =="02"){
		this.getView().byId("idRace").setVisible(false);
		
		this.getView().byId("idVechileNumber").setVisible(true);
		this.getView().byId("fromDate").setVisible(true);
		this.getView().byId("idClear").setVisible(true);
		
		this.getView().byId("toDate").setVisible(true);
		this.getView().byId("idSearch").setVisible(true);
		
		this.getView().byId("idTstRequest").setVisible(true);
		this.getView().byId("idTestPlan").setVisible(false);
		this.getView().byId("idFTI").setVisible(false);
		this.getView().byId("idClaimIBD").setVisible(false);
		
	}else if(master == "03"){
		this.getView().byId("idRace").setVisible(false);
		
		this.getView().byId("idVechileNumber").setVisible(true);
		this.getView().byId("fromDate").setVisible(true);
		this.getView().byId("idClear").setVisible(true);
		
		this.getView().byId("toDate").setVisible(true);
		this.getView().byId("idSearch").setVisible(true);
		
	    this.getView().byId("idTstRequest").setVisible(false);
		this.getView().byId("idTestPlan").setVisible(true);
		this.getView().byId("idFTI").setVisible(false);
		this.getView().byId("idClaimIBD").setVisible(false);
		
	}else if(master == "04"){
		this.getView().byId("idRace").setVisible(false);
		
		this.getView().byId("idVechileNumber").setVisible(true);
		this.getView().byId("fromDate").setVisible(true);	
		this.getView().byId("idClear").setVisible(true);
		
		this.getView().byId("toDate").setVisible(true);
		this.getView().byId("idSearch").setVisible(true);
		
		this.getView().byId("idTstRequest").setVisible(false);
		this.getView().byId("idTestPlan").setVisible(false);
		this.getView().byId("idFTI").setVisible(true);
		this.getView().byId("idClaimIBD").setVisible(false);
		
	}else if(master == "05"){
		this.getView().byId("idRace").setVisible(false);
		
		this.getView().byId("idVechileNumber").setVisible(true);
		this.getView().byId("fromDate").setVisible(true);
		this.getView().byId("idClear").setVisible(true);
		
		this.getView().byId("toDate").setVisible(true);
		this.getView().byId("idSearch").setVisible(true);
		
		this.getView().byId("idTstRequest").setVisible(false);
		this.getView().byId("idTestPlan").setVisible(false);
		this.getView().byId("idFTI").setVisible(false);
		this.getView().byId("idClaimIBD").setVisible(true);
		}
	
},
/************************************************F4 For Test Plan Number************************************************************/
onTstPlanNo: function(){
	debugger
	var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4TestPlanSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var valueTestPlanHelpDialog = new sap.m.SelectDialog({
				title : "Test Plan Number",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
								title : "{PlanNumber}",
								customData : [ new sap.ui.core.CustomData({
											key : "{PlanGuid}",
											value : "{PlanNumber}"
												
										}) ],
							}),
				},
	liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("PlanNumber",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
	},
		
	confirm : [ this._handleTestPlanHelp, this ],
	cancel :  [ this._handleTestPlanHelp, this ]
	});
	
	valueTestPlanHelpDialog.setModel(jModel);
	valueTestPlanHelpDialog.open();
	},
	
	_handleTestPlanHelp : function(oEvent) {
		debugger

		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	var obj = oSelectedItem.getBindingContext().getObject();
	        	testPlan = obj.PlanGuid;
			    this.getView().byId("idTestPlan").setValue(oSelectedItem.getTitle());
	         }		
},
/*************************************************F4 For Vehicle Number**********************************************************************************/
onVechileNumber: function(){
	var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4VehRegSet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var valueVehicleNumberHelpDialog = new sap.m.SelectDialog({
				title : "Vehicle Number",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
								title : "{RegNo}",
								customData : [ new sap.ui.core.CustomData({
											key : "key",
											value : "{RegNo}"
												
										}) ],
							}),
				},
	liveChange : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("RegNo",sap.ui.model.FilterOperator.Contains,sValue);
		oEvent.getSource().getBinding("items").filter([oFilter]);
	},
		
	confirm : [ this._handleVehicleNumberHelp, this ],
	cancel :  [ this._handleVehicleNumberHelp, this ]
	});
	
	valueVehicleNumberHelpDialog.setModel(jModel);
	valueVehicleNumberHelpDialog.open();
	},
	
	_handleVehicleNumberHelp : function(oEvent) {
		debugger

		var oSelectedItem = oEvent.getParameter("selectedItem");
	        if (oSelectedItem) {
	        	var obj = oSelectedItem.getBindingContext().getObject();
	        	testPlan = obj.PlanGuid;
			    this.getView().byId("idVechileNumber").setValue(oSelectedItem.getTitle());
	         }		
},

/**********************************************On Search Function**********************************************************************************/	
	onSearch : function(index) {                                              
		debugger
		
		var check = false;
		var that = this;
		//var PlanGuid = testPlan;
		var PlanNo = this.getView().byId("idTestPlan").getValue();
		var VehNo = this.getView().byId("idVechileNumber").getValue();
		var AppId = this.getView().byId("idMaster").getSelectedKey();
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		    pattern : "dd-MM-YYYY"
		});
		
		var fromDate = this.getView().byId("fromDate").getValue();
		var fromSplit = fromDate.split(".");
		var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		var dateFrom = fValue+"T00:00:00";
		
		var toDate = this.getView().byId("toDate").getValue();		
		var toSplit = toDate.split(".");
		var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
		var dateTo = tValue+"T00:00:00";		
		
		if(dateTo < dateFrom){
			sap.m.MessageToast.show("Search begin date cannot be more than search end date.");
			this.getView().byId("fromDate").setValueState("Error");
			this.getView().byId("toDate").setValueState("Error");
			return false
			}
		else{
			this.getView().byId("fromDate").setValueState("None");
			this.getView().byId("toDate").setValueState("None");
			}
	
	
	   var oView = this.getView();
			var FtDocJModel = oView.getModel("FtDocJModel");
			if (!FtDocJModel) {
				FtDocJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(FtDocJModel, "FtDocJModel");
			}
		var sServiceUrl = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/";
		
		//var sPath="GetTestPlanDataSet?$filter= PlanGuid eq '' and LowDate eq datetime'"+dateFrom+"' and HighDate eq datetime'"+dateTo+"' and ObjectId eq '"+obJectId+"'";
		var sPath = "GetPlanImagesSet?$expand=PlanToImagesNvg&$filter=PlanNumber eq '"+PlanNo+"' and DateFrom eq datetime'"+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and RegNo eq '"+VehNo+"' and ApplicationId eq '"+AppId+"'"
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			 oReadModel.setHeaders({"Content-Type" : "application/json"});
			                           
		var fncSuccess = function(oData, oResponse){		
			FtDocJModel.setData(oData.results);
			 }
			                           
		 var fncError = function(oError) { // error callback
			 	        
		 }
		 
		 oReadModel.read(sPath, {
			  success : fncSuccess,
			   error : fncError
			   });
			                    
	}, 	
	
	/* getAttachmentDetails: function(evt){   
		 debugger

		 var varPath = evt.getSource().getBindingContext("getImageJModel").getPath().split('/results/')[1];
		 var varData = evt.getSource().getBindingContext("getImageJModel").getModel().getData()["results"][varPath];
		window.open(encodeURI("/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='"+varData.ObjectName+ "')/$value"));
			
		},*/

/*******************************************************************************************************************************/
	getAttachmentDetails:function(oControl){ 
		debugger
			//call URL  
			//show popup image. 
		 var varPath = oControl.getSource().getBindingContext("getImageJModel").getPath().split('/results/')[1];
		 var varData = oControl.getSource().getBindingContext("getImageJModel").getModel().getData()["results"][varPath];
		 
			var oDMdl = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV/",true); 

		var Path=""; 
			//{mVMMItemList>Articale} 
		var vPartialUrl = "ImageDisplaySet(DocNo='"+varData.ObjectName+ "')/$value"; //id ask jayaram 
		var oBusyDialog_Global = new sap.m.BusyDialog(); 
			oBusyDialog_Global.open(); 
			oDMdl.read(vPartialUrl,{ 
				
			success : function(oData, oResponse){ 
				debugger
				oBusyDialog_Global.close(); 
				//Path=data.Path;
				//Path= "http://jkwgdev.jkti.com:8000/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='0000000000000040000001539')/$value";
				Path = oResponse.requestUri;
				var CloseButton = new sap.m.Button({ 
					text:"Close", 
					press:function(oEvent){ 
					oDialog.close(); 
					} 
				}); 
				
				var oDialog = new sap.m.Dialog({ 
					//title:"Image of "+Title,
					title:"Image of ", 
					height:"80%", 
					width : "80%", 
					content:[ 
						new sap.m.Image({ 
							height:"100%", 
							width : "100%", 
							densityAware : false, 
							
							layoutData: new sap.m.FlexItemData({ 
								growFactor: 1, 
								shrinkFactor:1 
							}), 
							src :Path, 
				//"file://10.10.16.60/public/TPG/NN/im/1110010233.jpg", 
				// src :"http://192.168.143.67:8002/sap/bc/ui5_ui5/sap/Zverify_approve/img/1110003446.JPG", 
						}) 
					],
					
				endButton:[CloseButton], 
				
					afterClose:function(){ 
					this.destroy(); 
					} 
				
				}).addStyleClass("DialogCSS"); 
				oDialog.open(); 
			}, 
			
			error : function(oError){
				debugger
			oBusyDialog_Global.close(); 
			} 
			},true); 


			},

/**************************************************************************************************************************/
			onDownload : function(oEvt){
				debugger 
				
				/*var varPath = oEvt.getSource().getBindingContext("getImageJModel").getPath().split('/results/')[1];
				 var varData = oEvt.getSource().getBindingContext("getImageJModel").getModel().getData()["results"][varPath];
				 window.open(encodeURI("/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='"+varData.ObjectName+ "')/$value"));
				 */
				
				 var varPath = oEvt.getSource().getBindingContext("getImageJModel").getPath().split('/results/')[1];
				 var varData = oEvt.getSource().getBindingContext("getImageJModel").getModel().getData()["results"][varPath];
				 
				 
				
						var oUploadCollection = sap.ui.getCore().byId("idImgTable");
						var aSelectedItems = oUploadCollection.getSelectedItems();
						if (aSelectedItems) {
							for (var i = 0; i < aSelectedItems.length; i++) {
								oUploadCollection.downloadItem(aSelectedItems[i], true);
							}
						} else {
							MessageToast.show("Select an item to download");
						}
					
				 
				 
				 
				 
				 
				 var lv_items = sap.ui.getCore().byId("idImgTable").getItems();
					for(var i=0; i<lv_items.length; i++){
						for(var j=0; j<1; j++){
							var lvcell = lv_items[i].getCells()[1].openSaveDialog() 				
						}
					}
				 
				
				/*var serviceurl = "/sap/opu/odata/sap/ZAPS_UTILITY_SRV";
				var itemString = "/ImageDisplaySet(DocNo='0000000000000040000001539')/$value";
				var oModelfile = new sap.ui.model.odata.ODataModel(serviceurl);
					oModelfile.read(itemString,{
						success: function(oData, oResponse){
							debugger
							var fName = odata.Imfilename; 
							var fType = odata.imMimeType;
							var fMres = atob(atob(odata.ImMediaResource));
							var fName = oResponse.headers["Content-Type"]; 
							var fType = "sch.jpg";
							var fMres = atob(atob(odata.ImMediaResource));
							
							
							
							if(fType ==="text/plain"){
								sap.ui.core.util.File.save(fMres, fName.replace(".txt",""), "txt", fType, "utf-8",true);
							} else {
								var bytNumber = new Array(fMres.length);
								for(var i=0; i<fMres.length; i++){
									bytNumber[i].fMres.charCodeAt(i);
								}
								byteArray = new Uint8array(bytNumber);
								var blob = new Blob([byteArray],{
									type: fType
								});
								var url = URL.createObjectURL(blob);
								window.open(url,'_blank');
							}
						},
						error:function(oError){
							debugger
						}
					})*/
			},
			
			
/**********************************************Clear all the values****************************************************************************/	
	onClear:function(){
		debugger
		this.getView().byId("idTestPlan").setValue("");
		this.getView().byId("fromDate").setValue("");
		this.getView().byId("toDate").setValue("");
		var vartblid = this.getView().byId("attachmentTable");
		var ModelData = vartblid.getModel("FtDocJModel");
		    ModelData.setData([]);
		
	},
	
});
});

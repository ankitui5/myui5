
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	],
	
function(Controller, MessageToast, MessageBox,History) {
	
	var that, initialFlag, oPageModel,FitType,Kunnr,DepoCode,itmCode,DefectGroup,DefectCode,PrdtCat,wear,TicketNo,Bukrs,
	ClaimNo,predectionData,ClaimData,Decisionkey,AIRemarksNvg,AIInspTicketClose,Data,gv_busyindicator,GroupDesc,DefectDesc,
	AIPredictionData,BtnMoreInfo,Discount,CustomerRegion,PolicyDiscount,ConstPro,ManfPlnt,
	f4Selectdefect,FinalResultJmodel,predictionJModel,predictionDataJModel1,predictionDataJModel2,predictionDataJModel3,
	Gv_ErrorFlag, Gv_lErrorStatusText,Gv_lErrorStatusCode,CreateDttime,Gv_ETA,PredFlag,
	ItemType,TubDiscount;

sap.ui.core.mvc.Controller.extend("zclaimapproval.view.View2",{
	
onInit:function(){
	
	
	sap.ui.core.UIComponent.getRouterFor(this).getRoute(
	"page2").attachMatched(this._onRoute, this);
	
	this.Clearvariables();
	
	gv_busyindicator = new sap.m.BusyDialog();
	AIPredictionData = new sap.ui.model.json.JSONModel();
	this.getView().setModel(AIPredictionData,"AIPredictionData")//For collect AI predictions
	FinalResultJmodel = new sap.ui.model.json.JSONModel();
	predictionJModel = new sap.ui.model.json.JSONModel();
	predictionDataJModel1 = new sap.ui.model.json.JSONModel(); //for table1
	predictionDataJModel2 = new sap.ui.model.json.JSONModel(); //for table2
	predictionDataJModel3 = new sap.ui.model.json.JSONModel(); //for table3
	this.heighlightNSD();
	
	oPageModel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(oPageModel,"oPageModel");
	
	this.DisposalDecisionList();
},
//*************************************************************************************************************
Clearvariables:function(){
	initialFlag = "";
	oPageModel	= "";
	FitType		= "";
	Kunnr		= "";
	DepoCode	= "";
	itmCode		= "";
	DefectGroup = "";
	DefectCode	= "";
	PrdtCat		= "";
	wear		= "";
	TicketNo	= "";
	Bukrs		= "";
	ClaimNo		= "";
	predectionData	= "";
	ClaimData		= "";
	Decisionkey		= "";
	AIRemarksNvg	= "";
	AIInspTicketClose	= "";
	Data			= "";
	GroupDesc		= "";
	DefectDesc		= "";
	AIPredictionData	= "";
	BtnMoreInfo		= "";
	Discount		= "";
	CustomerRegion	= "";
	PolicyDiscount	= "";
	ConstPro		= "";
	ManfPlnt		= "";
	f4Selectdefect	= "";
	FinalResultJmodel	= "";
	predictionJModel	= "";
	predictionDataJModel1	= "";
	predictionDataJModel2	= "";
	predictionDataJModel3	= "";
	Gv_ErrorFlag			= "";
	Gv_lErrorStatusText		= "";
	Gv_lErrorStatusCode		= "";
	CreateDttime = "";
	Gv_ETA = "";
	PredFlag = "";
	ItemType = "";
	TubDiscount = "";
	this.getView().byId("idInsNsd1").setVisible(false);
	this.getView().byId("idInsNsd2").setVisible(false);
	this.getView().byId("idInsNsd3").setVisible(false);
	this.getView().byId("idInsNsd4").setVisible(false);
	
	this.getView().byId("idInsNsd").setVisible(true);
	this.getView().byId("idAvgNsd").setVisible(true);
	this.getView().byId("idDiscount").setValue();
		
}, 
//**************************************************************************************************************
onNavBack:function(){
	
},
//***************************************************************************************************************
heighlightNSD:function(){
	
	this.getView().byId("lblorignsd").addStyleClass("Clnsds");
	this.getView().byId("lblnsd1").addStyleClass("Clnsds");
	this.getView().byId("lblnsd2").addStyleClass("Clnsds");
	this.getView().byId("lblnsd3").addStyleClass("Clnsds");
	this.getView().byId("lblnsd4").addStyleClass("Clnsds");
	this.getView().byId("lblnsd").addStyleClass("Clnsds");
	this.getView().byId("lblWear").addStyleClass("Clnsds")
	
	this.getView().byId("idInsNsd1").addStyleClass("clinpt.sapMInputBaseInner");
},
//***************************************************************************************************************
_onRoute : function(e){
	
	var that = this;
	this.getView().byId("idInsNsd1").setVisible(false);
	this.getView().byId("idInsNsd2").setVisible(false);
	this.getView().byId("idInsNsd3").setVisible(false);
	this.getView().byId("idInsNsd4").setVisible(false);
	this.getView().byId("idInsNsd").setVisible(true);
	this.getView().byId("idAvgNsd").setVisible(true);
	
	this.getView().byId("idRemrks").setValue(); //empty Remarks
	var tempjsonString = e.getParameter("arguments").entity;
	var jsonstring = tempjsonString.replace(/@/g, "/");
	var tempSelectedData = JSON.parse(jsonstring);
		this.SelectedData  = JSON.parse(tempSelectedData);
		ClaimData = this.SelectedData;
		
	ItemType = ClaimData.ClaimData.ItemType;
	
	
		
		if(ClaimData.ClaimData.Discount < 99){
			ClaimData.ClaimData.Discount = ClaimData.ClaimData.Discount.substring(1);
		}
		if(ClaimData.ClaimData.PercentageWear < 99){
			ClaimData.ClaimData.PercentageWear	= ClaimData.ClaimData.PercentageWear.substring(1);
		}
		ClaimData.ClaimData.TotNsd = ClaimData.ClaimData.TotNsd.substring(0, ClaimData.ClaimData.TotNsd.length - 1);
		ClaimData.ClaimData.Nsd = ClaimData.ClaimData.Nsd.substring(0, ClaimData.ClaimData.Nsd.length - 1);
	
	if(ItemType == "TYRE"){	
		this.getView().byId("idVbox3").setVisible(true);
		this.getView().byId("idTubepanel").setVisible(false);
		this.getView().byId("idTyrepanel").setVisible(true);
		
		if(ClaimData.ClaimData.GroovesCount == "2"){
			ClaimData.ClaimData.Nsd1 = ClaimData.ClaimData.Nsd1.substring(0, ClaimData.ClaimData.Nsd1.length - 1);
			this.getView().byId("idInsNsd1").setVisible(true);
			
			ClaimData.ClaimData.Nsd2 = ClaimData.ClaimData.Nsd2.substring(0, ClaimData.ClaimData.Nsd2.length - 1);
			this.getView().byId("idInsNsd2").setVisible(true);
		}
		
		if(ClaimData.ClaimData.GroovesCount == "3"){
			ClaimData.ClaimData.Nsd1 = ClaimData.ClaimData.Nsd1.substring(0, ClaimData.ClaimData.Nsd1.length - 1);
			this.getView().byId("idInsNsd1").setVisible(true);
			
			ClaimData.ClaimData.Nsd2 = ClaimData.ClaimData.Nsd2.substring(0, ClaimData.ClaimData.Nsd2.length - 1);
			this.getView().byId("idInsNsd2").setVisible(true);
			
			ClaimData.ClaimData.Nsd3 = ClaimData.ClaimData.Nsd3.substring(0, ClaimData.ClaimData.Nsd3.length - 1);
			this.getView().byId("idInsNsd3").setVisible(true);
		}
		
		if(ClaimData.ClaimData.GroovesCount == "4"){
			ClaimData.ClaimData.Nsd1 = ClaimData.ClaimData.Nsd1.substring(0, ClaimData.ClaimData.Nsd1.length - 1);
			this.getView().byId("idInsNsd1").setVisible(true);
			
			ClaimData.ClaimData.Nsd2 = ClaimData.ClaimData.Nsd2.substring(0, ClaimData.ClaimData.Nsd2.length - 1);
			this.getView().byId("idInsNsd2").setVisible(true);
			
			ClaimData.ClaimData.Nsd3 = ClaimData.ClaimData.Nsd3.substring(0, ClaimData.ClaimData.Nsd3.length - 1);
			this.getView().byId("idInsNsd3").setVisible(true);
			
			ClaimData.ClaimData.Nsd4 = ClaimData.ClaimData.Nsd4.substring(0, ClaimData.ClaimData.Nsd4.length - 1);
			this.getView().byId("idInsNsd4").setVisible(true);
			
		}	 
		
	} else if(ItemType == "TUBE"){
		this.getView().byId("idVbox3").setVisible(false);
		this.getView().byId("idTubepanel").setVisible(true);
		this.getView().byId("idTyrepanel").setVisible(false);
		
		  if(this.getView().byId("idTubepanel").getVisible()==true){	
				this.getView().byId("idTubeVendorCode").setValue().setVisible(false);
				this.getView().byId("idTubeMouldNo").setValue().setVisible(false);
				this.getView().byId("idTubePrdWeek").setValue().setVisible(false);
				this.getView().byId("idTubePrdMonth").setSelectedKey().setVisible(false);
				this.getView().byId("idTubePrdYear").setValue().setVisible(false);
				this.getView().byId("idTubeStnclNo").setValue().setVisible(false);
				this.getView().byId("idTubePerWear").setValue().setVisible(false);
				this.getView().byId("idDiscount").setValue();
		  }
	}	
	

	
		
		Discount	= ClaimData.ClaimData.Discount;
		FitType 	= ClaimData.ClaimData.FitType;
		Kunnr		= ClaimData.ClaimData.DealerCode;
		DepoCode 	=  ClaimData.ClaimData.ClaimRecDepo;
		itmCode 	= ClaimData.ClaimData.ItemCode;
		TicketNo	=  ClaimData.ClaimData.TicketNo;
		Bukrs		=  ClaimData.ClaimData.Bukrs;
		PrdtCat		= ClaimData.ClaimData.PrdtCat;
		wear		= ClaimData.ClaimData.PercentageWear;
		ManfPlnt	= ClaimData.ClaimData.ManfPlnt
		
		ClaimNo		= ClaimData.ClaimData.ClaimNo;
		CustomerRegion = ClaimData.ClaimData.CustomerRegion;
		CreateDttime = this.SetTime(ClaimData.ClaimData.CreatedAt); //formation of date time
		Gv_ETA = ClaimData.ClaimData.ETA;
	    this.getView().byId("HedClaimNo").setText("Claim No:" + ClaimData.ClaimData.ClaimNo + " / " + CreateDttime + " / " + "Total time elapsed :" + ClaimData.ClaimData.ETA + " Minutes");
	  
	   /* if(FitType == "OEM"){
	    	this.getView().byId("idpnlOEM").setVisible(true);
	    }else{
	    	this.getView().byId("idpnlOEM").setVisible(false);
	    }*/
	    
	var ClaimjModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(ClaimjModel,"ClaimjModel");
		ClaimjModel.setData(ClaimData.ClaimData);
		
	
	//this.getView().byId("idDfctGrp").setVisible(false);
	//this.getView().byId("idDfctCod").setVisible(false);
	
		
	//this.fnAIPrediction();
	this.onTyreThumbnail();
	
	//reset Finding Details
	this.getView().byId("idmoreinfo").setVisible(false);
	this.getView().byId("idDfctGrp").setVisible(false); 
	this.getView().byId("idDfctCod").setVisible(false);
	this.getView().byId("idDiscount").setVisible(false); 
	this.getView().byId("idInsAdjMod").setVisible(false);
	this.getView().byId("idInsRegRea").setVisible(false); 
	this.getView().byId("idInsPolNo").setVisible(false);
	this.getView().byId("idRemrks").setValue();
	this.DisposalDecisionList();
	//
	this.funRefresh();
	//this.funTimmer();
},

//*********************************************************************************************************************
funRefresh:function(){
	
	var that = this;
var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
var sPath ="GetTimeLapsedSet(ClaimNo='"+ClaimNo+"')";

var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
var oParamsListSet = {};
	oParamsListSet.success = function(oData, oResponse) {
		
		Gv_ETA = oData.ETA;
	    that.getView().byId("HedClaimNo").setText("Claim No:" + ClaimData.ClaimData.ClaimNo + " / " + CreateDttime + " / " + "Total time elapsed :" + Gv_ETA + " Minutes");
	    that.funTimmer();
	};

 
	oParamsListSet.error = function(oError) {
		
				
	};		
	oDataModel.read(sPath, oParamsListSet);	
},


//************************************************************************************************************
funTimmer:function(){

var that = this;
setInterval(function() { 
	
	var eta = Gv_ETA++;
	that.getView().byId("HedClaimNo").setText("Claim No:" + ClaimNo+ " / " + CreateDttime + " / " + "Total time elapsed :" +eta+ " Minutes")
	  
	
   },  59000);
},

//*************************************************************************************************************
SetTime: function(val) {
	
    if (val) {
      val = val.replace(/^PT/, '').replace(/S$/, '');
      val = val.replace('H', ':').replace('M', ':');

      var multipler = 60 * 60;
      var result = 0;
      val.split(':').forEach(function(token) {
        result += token * multipler;
        multipler = multipler/ 60;
      });
      var timeinmiliseconds = result * 1000;

      var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
       pattern: "HH:mm:ss a"
      });
      var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
      var timedata = timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
      return timedata;
    }
    return null;  
  },

//*************************************************************************************************************
onTyreThumbnail:function(){
	
	var that=this;
	gv_busyindicator.open();
	var TyreThumbnailJmodel = new sap.ui.model.json.JSONModel();
	this.getView().setModel(TyreThumbnailJmodel,"TyreThumbnailJmodel");
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
	var sPath ="GetImagesSet?$filter=ClaimNo eq '"+ClaimNo+"' and ImageFlg eq '' and ImageType eq ''";
	var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath); 

	var oParamsListSet = {};
	oParamsListSet.success = function(oData, oResponse) {
		
		for(var i=0; i<oData.results.length; i++){
			oData.results[i].Image = "data:image/png;base64," + oData.results[i].Image;
		}
		gv_busyindicator.close();	
		TyreThumbnailJmodel.setData(oData.results);
		that.getView().byId("idimgTsize").setSrc(TyreThumbnailJmodel.oData[0].Image);
		that.getView().byId("idtsizedesz").setText(TyreThumbnailJmodel.oData[0].ImageDesc);
		that.getView().byId("idtsizeLoc").setText(TyreThumbnailJmodel.oData[0].ImgLocation);
		that.getView().byId("idtsizeTimestmp").setText(TyreThumbnailJmodel.oData[0].TimeStamp);
		
		that.getView().byId("idimgTyrePtrn").setSrc(TyreThumbnailJmodel.oData[1].Image);
		that.getView().byId("idtptrndesz").setText(TyreThumbnailJmodel.oData[1].ImageDesc);
		that.getView().byId("idtptrnLoc").setText(TyreThumbnailJmodel.oData[1].ImgLocation);
		that.getView().byId("idtptrnTimestmp").setText(TyreThumbnailJmodel.oData[1].TimeStamp);
		
		that.getView().byId("idimgTyreStncl").setSrc(TyreThumbnailJmodel.oData[2].Image);
		that.getView().byId("idtstncldesz").setText(TyreThumbnailJmodel.oData[2].ImageDesc);
		that.getView().byId("idtstnclLoc").setText(TyreThumbnailJmodel.oData[2].ImgLocation);
		that.getView().byId("idtstnclTimestmp").setText(TyreThumbnailJmodel.oData[2].TimeStamp);
		gv_busyindicator.close();
		
		} 
	
			
	oParamsListSet.error = function(oError) {
		
		//jQuery.sap.log.error("ERROR!");
		sap.m.MessageBox.show(oError.response.statusText+", status code:"+ oError.response.statusCode, {
		   title: "ERROR",
		   icon:sap.m.MessageBox.Icon.ERROR,
		});
			
		gv_busyindicator.close();
	};
	
	oDataModel.read(sPath, oParamsListSet);
},

//************************************************************************************************************
OnVendorHelp:function(){
	var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpVendorTubeFlapSet";
	var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
	var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
	
    title: "Vendor",
    items: {
        path: "/d/results",
        template: new sap.m.StandardListItem({
            title: "{VendorCode}",
       /*    description:"{VendorCode}",*/
            customData: [new sap.ui.core.CustomData({
                key: "VendorCode",
            /*    value: "{VendorCode}"*/
            })],
           
        }),
    },
    liveChange: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("VendorCode",sap.ui.model.FilterOperator.Contains,sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
    },
    confirm: [this._handlefranchClose1, this],
    cancel: [this._handlefranchClose1, this]
});
_valueHelpFranchSelectDialog.setModel(jModel);
_valueHelpFranchSelectDialog.open();	
},
_handlefranchClose1: function(oEvent) {

   var oSelectedItem = oEvent.getParameter("selectedItem");
   if (oSelectedItem) {  
   	   this.getView().byId("idTubeVendorCode").setValue(oSelectedItem.getTitle());
   		this.vendorcc = oSelectedItem.getTitle();
   		this.vendorName = oSelectedItem.getTitle();
   	    var stencile = this.vendorcc+"-"+this.getView().byId("idTubeMouldNo").getValue()+"-"+this.getView().byId("idTubePrdMonth").getSelectedKey()+this.getView().byId("idTubePrdYear").getValue().slice(-2);
   	    this.getView().byId("idTubeStnclNo").setValue(stencile);
   	    this.getView().byId("idTubeVendorCode").setValueState("None");
  	
  }

},
//*************************************************************************************************************
onMouldNo:function(){
	
	var stencile = this.vendorcc+"-"+this.getView().byId("idTubeMouldNo").getValue()+ "-"+this.getView().byId("idTubePrdMonth").getSelectedKey()+this.getView().byId("idTubePrdYear").getValue().slice(-2);
	this.getView().byId("idTubeStnclNo").setValue(stencile);
	this.getView().byId("idTubeMouldNo").setValueState("None");
},

//*************************************************************************************************************
onTubeProdMonth:function(){
	
	var stencile = this.vendorcc+"-"+this.getView().byId("idTubeMouldNo").getValue()+"-"+this.getView().byId("idTubePrdMonth").getSelectedKey()+this.getView().byId("idTubePrdYear").getValue().slice(-2);
		this.getView().byId("idTubeStnclNo").setValue(stencile); 
		this.getView().byId("idTubePrdMonth").setValueState("None");
		
		//calculate discount
			var month = this.getView().byId("idTubePrdMonth").getSelectedKey();
			var year = this.getView().byId("idTubePrdYear").getValue();
			var FullMY = year + "-" + month;
			var pastMonthYr = new Date(FullMY);
			var CurrentMonthYr = new Date();
			
			var diff = Math.floor(CurrentMonthYr.getTime() - pastMonthYr.getTime());
		    var day = 1000 * 60 * 60 * 24; 
			var days = parseInt(Math.floor(diff/day));
			var months = parseInt(Math.floor(days/31));
			//var years = Math.floor(months/12);
		 if(ClaimData.ClaimData.VehType == "2/3 WHEELER"){
				if(months <=12){
					this.getView().byId("idDiscount").setValue(100);
				} else if(months<=24){
					this.getView().byId("idDiscount").setValue(75);
				}else if(month>24){
					this.getView().byId("idDiscount").setValue(0);
				}
			} else if(ClaimData.ClaimData.VehType == "CAR/SUV/MPV/VAN/JEEP" || ClaimData.ClaimData.VehType == "CAR/SUV/MPV"){
				if(months<=6){
					this.getView().byId("idDiscount").setValue(100);
				} else if(months <=12){
					this.getView().byId("idDiscount").setValue(85);
				} else if(months<=24){
					this.getView().byId("idDiscount").setValue(75);
				}else if(months>24){
					this.getView().byId("idDiscount").setValue(0);
				}

			}
	 
},
//**************************************************************************************************************
OnTubeChangeYear:function(oEvent){ 
 
	var val = oEvent.getSource().getValue();
	if(val){
		if(isNaN(val)){
			val = val.substring(0, val.length - 1);
			oEvent.getSource().setValue(val);					
		}else if(!(isNaN(val)) && val.length == 4){
			var d = new Date();
			var y = d.getFullYear();
				if(val < 2000){
				sap.m.MessageToast.show("Year cannot be less than 2000");
				oEvent.getSource().setValue();				
				}else if(val > y){
				sap.m.MessageToast.show("Year cannot be future year");
				oEvent.getSource().setValue();
				}				
			}	
		
		
	}

	
 var stencile = this.vendorcc+"-"+this.getView().byId("idTubeMouldNo").getValue()+ "-"+this.getView().byId("idTubePrdMonth").getSelectedKey()+this.getView().byId("idTubePrdYear").getValue().slice(-2);
 				this.getView().byId("idTubeStnclNo").setValue(stencile);
 				this.getView().byId("idTubePrdYear").setValueState("None");
 				
 				
 				//calculate discount
 				var month = this.getView().byId("idTubePrdMonth").getSelectedKey();
 				var year = val;
 				var FullMY = year + "-" + month;
 				var pastMonthYr = new Date(FullMY);
 				var CurrentMonthYr = new Date();
 				
 				var diff = Math.floor(CurrentMonthYr.getTime() - pastMonthYr.getTime());
 			    var day = 1000 * 60 * 60 * 24; 
 				var days = parseInt(Math.floor(diff/day));
 				var months = parseInt(Math.floor(days/31));
 				//var years = Math.floor(months/12);
 				if(ClaimData.ClaimData.VehType == "2/3 WHEELER"){
 					if(months <=12){
 						this.getView().byId("idDiscount").setValue(100);
 					} else if(months<=24){
 						this.getView().byId("idDiscount").setValue(75);
 					}else if(months>24){
 						this.getView().byId("idDiscount").setValue(0);
 					}
 				} else if(ClaimData.ClaimData.VehType == "CAR/SUV/MPV/VAN/JEEP" || ClaimData.ClaimData.VehType == "CAR/SUV/MPV"){
 					if(months<=6){
 						this.getView().byId("idDiscount").setValue(100);
 					} else if(months <=12){
 						this.getView().byId("idDiscount").setValue(85);
 					} else if(months<=24){
 						this.getView().byId("idDiscount").setValue(75);
 					}else if(months>24){
 						this.getView().byId("idDiscount").setValue(0);
 					}
 
 				} 			
		
},
//****************************************************************************************************************
NumberValid: function(oEvent){ 
	var val = oEvent.getSource().getValue();
	   if(val){
		 if(isNaN(val)){
		   val = val.substring(0, val.length - 1); 
		   oEvent.getSource().setValue(val);						
		 }else if(val.indexOf(".")!="-1"){
		   val = val.substring(0, val.length - 1);
		   oEvent.getSource().setValue(val);
		 }
	   }
	this.getView().byId("idTubePerWear").setValueState("None");
	
	//TubDiscount = 100-val;
	//this.getView().byId("idDiscount").setValue(TubDiscount);
		
},

//**************************************************************************************************************
onTyreimagePress:function(){
	
	var thumbnail = this.getView().getModel("TyreThumbnailJmodel").getData();
	var CloseButton = new sap.m.Button({
			text:"Close",
			press:function(oEvent){
				oDialog.close();
			}
		});
	var oDialog = new sap.m.Dialog({
		title:thumbnail[0].ImageDesc,
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
					//src :"https://thumbs.dreamstime.com/z/d-tire-alloy-wheel-white-background-36065868.jpg",
					src :thumbnail[0].Image,
				})		
			],
			endButton:[CloseButton],
			afterClose:function(){
				this.destroy();
			}
		}).addStyleClass("DialogCSS");
	oDialog.open();

},
//*************************************************************************************************************
onTyrePtrnimgPress:function(){
	
	var thumbnail = this.getView().getModel("TyreThumbnailJmodel").getData();
	var CloseButton = new sap.m.Button({
			text:"Close",
			press:function(oEvent){
				oDialog.close();
			}
		});
	var oDialog = new sap.m.Dialog({
		title:thumbnail[1].ImageDesc,
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
					//src :"https://thumbs.dreamstime.com/z/d-tire-alloy-wheel-white-background-36065868.jpg",
					src :thumbnail[1].Image,
				})		
			],
			endButton:[CloseButton],
			afterClose:function(){
				this.destroy();
			}
		}).addStyleClass("DialogCSS");
	oDialog.open();

},
//**************************************************************************************************************
onTyrestnclimgPress:function(){
	
	var thumbnail = this.getView().getModel("TyreThumbnailJmodel").getData();
	var CloseButton = new sap.m.Button({
			text:"Close",
			press:function(oEvent){
				oDialog.close();
			}
		});
	var oDialog = new sap.m.Dialog({
		title:thumbnail[2].ImageDesc,
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
					//src :"https://thumbs.dreamstime.com/z/d-tire-alloy-wheel-white-background-36065868.jpg",
					src :thumbnail[2].Image,
				})		
			],
			endButton:[CloseButton],
			afterClose:function(){
				this.destroy();
			}
		}).addStyleClass("DialogCSS");
	oDialog.open();

},
//*************************************************************************************************************
onPressDefectimg:function(oEvt){
	
	var sPath = oEvt.getSource().getParent().getBindingContext("DefectImageJmodel").getPath()[1];
	var imgData = oEvt.getSource().getParent().getBindingContext("DefectImageJmodel").getModel().getData()[sPath];
	var defectimg = imgData.Image;
	var imgDesc = imgData.ImageDesc;
	var CloseButton = new sap.m.Button({
		text:"Close",
		press:function(oEvent){
			oDialog.close();
		}
	});
var oDialog = new sap.m.Dialog({
	title:imgDesc,
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
				//src :"https://thumbs.dreamstime.com/z/d-tire-alloy-wheel-white-background-36065868.jpg",
				src :defectimg,
			})		
		],
		endButton:[CloseButton],
		afterClose:function(){
			this.destroy();
		}
	}).addStyleClass("DialogCSS");
oDialog.open();
},
//*************************************************************************************************************
onZoomPredctionImg1:function(Evt){
	
	var img = Evt.getSource().getSrc();
	var imgDesc = Evt.getSource().getModel("AIPredictionData").oData.PredictionImageNvg.results[0].ImageDesc
	var CloseButton = new sap.m.Button({
		text:"Close",
		press:function(oEvent){
			oDialog.close();
		}
	});
var oDialog = new sap.m.Dialog({
	title:imgDesc,
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
				src :img,
			})		
		],
		endButton:[CloseButton],
		afterClose:function(){
			this.destroy();
		}
	}).addStyleClass("DialogCSS");
oDialog.open();
},
//*************************************************************************************************************
onZoomPredctionImg2:function(Evt){
	
	var img = Evt.getSource().getSrc();
	var imgDesc = Evt.getSource().getModel("AIPredictionData").oData.PredictionImageNvg.results[1].ImageDesc
	var CloseButton = new sap.m.Button({
		text:"Close",
		press:function(oEvent){
			oDialog.close();
		}
	});
var oDialog = new sap.m.Dialog({
	title:imgDesc,
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
				src :img,
			})		
		],
		endButton:[CloseButton],
		afterClose:function(){
			this.destroy();
		}
	}).addStyleClass("DialogCSS");
oDialog.open();
},
//*************************************************************************************************************
onZoomPredctionImg3:function(Evt){
	
	var img = Evt.getSource().getSrc();
	var imgDesc = Evt.getSource().getModel("AIPredictionData").oData.PredictionImageNvg.results[2].ImageDesc
	var CloseButton = new sap.m.Button({
		text:"Close",
		press:function(oEvent){
			oDialog.close();
		}
	});
var oDialog = new sap.m.Dialog({
	title:imgDesc,
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
				src :img,
			})		
		],
		endButton:[CloseButton],
		afterClose:function(){
			this.destroy();
		}
	}).addStyleClass("DialogCSS");
oDialog.open();
},
//*************************************************************************************************************
onPressMoreInfoimg:function(oEvt){
	
	var sPath = oEvt.getSource().getParent().getBindingContext("predictionImageJModel").getPath()[1];
	var MoreInfoimgData = oEvt.getSource().getParent().getBindingContext("predictionImageJModel").getModel().getData()[sPath];
	var img = MoreInfoimgData.Image;
	var imgDesc = MoreInfoimgData.ImageDesc;
	var CloseButton = new sap.m.Button({
		text:"Close",
		press:function(oEvent){
			oDialog.close();
		}
	});
var oDialog = new sap.m.Dialog({
	title:imgDesc,
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
				src :img,
			})		
		],
		endButton:[CloseButton],
		afterClose:function(){
			this.destroy();
		}
	}).addStyleClass("DialogCSS");
oDialog.open();
	
},

//*************************************************************************************************************
onAfterRendering: function(){
	oPageModel.refresh();

},
//*************************************************************************************************************
onRejReason:function(key){
	
    var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownRejectionReasonSet?$filter=ClaimTyp eq 'SP10'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var  loc= this.getView().byId("idInsRegRea");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{RejectionReason}",
				text : "{RejectionReasonTxt}"
			})
		});
	},	

onRejReg:function(){
	this.getView().byId("idInsRegRea").setValueState("None");	
},
	
onDecisionChange : function(){
		if(ItemType == "TYRE"){
			this.getView().byId("idDiscount").setValue(Discount);
		} 
		
		var MoreInfoImgData = this.getView().getModel("TyreThumbnailJmodel")
		var predictionMoreInfoJModel = new sap.ui.model.json.JSONModel();
		    this.getView().setModel(predictionMoreInfoJModel,"predictionMoreInfoJModel");
		    predictionMoreInfoJModel.setData(MoreInfoImgData.oData);
		    
			Decisionkey = this.getView().byId("idInsDD").getSelectedKey();
			this.getView().byId("idInsPolNo").setValue("");
			this.getView().byId("idInsAdjMod").setSelectedKey();
			this.getView().byId("idmoreinfo").setVisible(false);
			
				if(Decisionkey=="A"){
					Data = "";
					this.getView().byId("idInsDD").setValueState("None");
					this.getView().byId("idDfctGrp").setVisible(true);
					this.getView().byId("idDfctCod").setVisible(true);
					this.getView().byId("idDiscount").setVisible(true);
					this.getView().byId("idInsAdjMod").setVisible(true).setSelectedKey();			
					this.getView().byId("idInsRegRea").setVisible(false).setSelectedKey();
					
					if(ItemType == "TUBE"){ //Show field in the case of more info and manual information.
						this.getView().byId("idTubeVendorCode").setVisible(true);
						this.getView().byId("idTubeMouldNo").setVisible(true);
						this.getView().byId("idTubePrdMonth").setVisible(true);
						this.getView().byId("idTubePrdYear").setVisible(true);
						this.getView().byId("idTubeStnclNo").setVisible(true);
						this.getView().byId("idTubePerWear").setVisible(true);
						
						
						this.getView().byId("idInsAdjMod").setSelectedKey("POL").setEnabled(false);
						this.getView().byId("idInsPolNo").setEnabled(false).setVisible(true).setValue("TUBE_POLICY");
				
					}
					
				} else if(Decisionkey=="R"){
					Data = "";
					this.getView().byId("idInsDD").setValueState("None");
					this.onRejReason()
					this.getView().byId("idDiscount").setVisible(false);
					this.getView().byId("idDfctGrp").setVisible(true);
					this.getView().byId("idDfctCod").setVisible(true);
					this.getView().byId("idInsAdjMod").setVisible(false).setSelectedKey();			
					this.getView().byId("idInsRegRea").setVisible(true).setSelectedKey();
					this.getView().byId("idInsPolNo").setVisible(false).setValue();
					
					if(ItemType == "TUBE"){ //Show field in the case of more info and manual information.
						this.getView().byId("idTubeVendorCode").setVisible(true);
						this.getView().byId("idTubeMouldNo").setVisible(true);
						this.getView().byId("idTubePrdMonth").setVisible(true);
						this.getView().byId("idTubePrdYear").setVisible(true);
						this.getView().byId("idTubeStnclNo").setVisible(true);
						this.getView().byId("idTubePerWear").setVisible(true);
					
					}
					
				}else if(Decisionkey=="ED"){
					this.getView().byId("idInsDD").setValueState("None");
					this.getView().byId("idDfctGrp").setVisible(false).setValue();
					this.getView().byId("idDfctCod").setVisible(false).setValue();
					this.getView().byId("idDiscount").setVisible(false);
					this.getView().byId("idInsAdjMod").setVisible(false).setSelectedKey();			
					this.getView().byId("idInsRegRea").setVisible(false).setSelectedKey();
					this.getView().byId("idInsPolNo").setVisible(false).setValue();
				
				if(ItemType == "TUBE"){ //hide field in the case of more info and manual information.
					this.getView().byId("idTubeVendorCode").setVisible(false).setValue();
					this.getView().byId("idTubeMouldNo").setVisible(false).setValue();
					this.getView().byId("idTubePrdMonth").setVisible(false).setSelectedKey();
					this.getView().byId("idTubePrdYear").setVisible(false).setValue();
					this.getView().byId("idTubeStnclNo").setVisible(false).setValue();
					this.getView().byId("idTubePerWear").setVisible(false).setValue();
					this.getView().byId("idDiscount").setValue();
					
				}
					
					
				//Set Data in More information needed table
					
				var	predictionImageJModel = new sap.ui.model.json.JSONModel();
					predictionImageJModel.setData(predictionMoreInfoJModel.oData);
					
					this._MoreInfoDialog = sap.ui.xmlfragment("zclaimapproval.view.More_Info_Dialog", this);
					this.getView().addDependent(this._MoreInfoDialog);
					this._MoreInfoDialog.setModel(predictionImageJModel,"predictionImageJModel");
					BtnMoreInfo = predictionImageJModel.oData;
					//Show data in More information needed table.
				if(ItemType == "TYRE"){	
					if(ClaimData.ClaimData.GroovesCount == "2"){
						var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
					         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
					         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
					         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2}]
					}
					
					if(ClaimData.ClaimData.GroovesCount == "3"){
						var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
					         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
					         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
					         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2},
					         {"Label":"NSD3","FieldName": ClaimData.ClaimData.Nsd3}]
					}
					
					if(ClaimData.ClaimData.GroovesCount == "4"){
						var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
					         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
					         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
					         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2},
					         {"Label":"NSD3","FieldName": ClaimData.ClaimData.Nsd3},
					         {"Label":"NSD4","FieldName": ClaimData.ClaimData.Nsd4}]
					}
				} else if(ItemType == "TUBE"){
					
					var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
				        		  ]
				}
					
					/*var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
				         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
				         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
				         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2},
				         {"Label":"NSD3","FieldName": ClaimData.ClaimData.Nsd3}]*/
					 
					 var objJmodel = new sap.ui.model.json.JSONModel();
						this._MoreInfoDialog.setModel(objJmodel,"objJmodel");
						objJmodel.setData(lvArray);
					
					this._MoreInfoDialog.open();
					
				} else if(Decisionkey=="MN"){
					this.getView().byId("idInsDD").setValueState("None");
					this.getView().byId("idDfctGrp").setVisible(false).setValue();
					this.getView().byId("idDfctCod").setVisible(false).setValue();
					this.getView().byId("idDiscount").setVisible(false);
					this.getView().byId("idInsAdjMod").setVisible(false).setSelectedKey();			
					this.getView().byId("idInsRegRea").setVisible(false).setSelectedKey();
					this.getView().byId("idInsPolNo").setVisible(false).setValue();
					
					if(ItemType == "TUBE"){ //hide field in the case of more info and manual information.
						this.getView().byId("idTubeVendorCode").setVisible(false).setValue();
						this.getView().byId("idTubeMouldNo").setVisible(false).setValue();
						this.getView().byId("idTubePrdMonth").setVisible(false).setSelectedKey();
						this.getView().byId("idTubePrdYear").setVisible(false).setValue();
						this.getView().byId("idTubeStnclNo").setVisible(false).setValue();
						this.getView().byId("idTubePerWear").setVisible(false).setValue();
						this.getView().byId("idDiscount").setValue();
						
					}
				}
},	
//***************************************************************************************************************
onBtnMoreInfo:function(){
	
var	predictionImageJModel = new sap.ui.model.json.JSONModel();
	predictionImageJModel.setData(BtnMoreInfo);
	 
	this._MoreInfoDialog = sap.ui.xmlfragment("zclaimapproval.view.More_Info_Dialog", this);
	this.getView().addDependent(this._MoreInfoDialog);
	this._MoreInfoDialog.setModel(predictionImageJModel,"predictionImageJModel");
	//Show data in More information needed table.
	if(ItemType == "TYRE"){		
		if(ClaimData.ClaimData.GroovesCount == "2"){
			var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
		         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
		         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
		         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2}]
		}
		
		if(ClaimData.ClaimData.GroovesCount == "3"){
			var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
		         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
		         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
		         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2},
		         {"Label":"NSD3","FieldName": ClaimData.ClaimData.Nsd3}]
		}
		
		if(ClaimData.ClaimData.GroovesCount == "4"){
			var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
		         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
		         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
		         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2},
		         {"Label":"NSD3","FieldName": ClaimData.ClaimData.Nsd3},
		         {"Label":"NSD4","FieldName": ClaimData.ClaimData.Nsd4}]
		}
	}else if(ItemType == "TUBE"){
		
		var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
	                  ]
	}	
	
	
	
	/*var lvArray = [{"Label":"Product Description","FieldName": ClaimData.ClaimData.Maktx},
         {"Label":"Stencil No.","FieldName": ClaimData.ClaimData.StnclNumber},
         {"Label":"NSD1","FieldName": ClaimData.ClaimData.Nsd1},
         {"Label":"NSD2","FieldName": ClaimData.ClaimData.Nsd2},
         {"Label":"NSD3","FieldName": ClaimData.ClaimData.Nsd3}]*/
	 
	 var objJmodel = new sap.ui.model.json.JSONModel();
		this._MoreInfoDialog.setModel(objJmodel,"objJmodel");
		objJmodel.setData(lvArray);
	
	this._MoreInfoDialog.open();
},
//**************************************************************************************************************
onCheckClick:function(oEvt){
	
	if(oEvt.getSource().getSelected() == true){
		oEvt.getSource().getParent().getCells()[2].setEnabled(true)
	}else{
		oEvt.getSource().getParent().getCells()[2].setEnabled(false)
		oEvt.getSource().getParent().getCells()[2].setValueState("None");
		oEvt.getSource().getParent().getCells()[2].setValue();
	}
	
},
//***************************************************************************************************************
ValidateMoreInfo:function(evt){
	
	var chk = true;
	var gettable = sap.ui.getCore().byId("idTblMoreInfo");
	for(var i=0; i<gettable.getItems().length; i++){
		if(gettable.getItems()[i].getCells()[3].getSelected()){
			if(gettable.getItems()[i].getCells()[2].getValue() == ""){
				gettable.getItems()[i].getCells()[2].setValueState("Error");
				chk = false;
			} else {
				gettable.getItems()[i].getCells()[2].setValueState("None");
			}
		}
	}
	
	
	var gettable2 = sap.ui.getCore().byId("idTblMoreInfo1");
	for(var j=0; j<gettable2.getItems().length; j++){

		if(gettable2.getItems()[j].getCells()[3].getSelected()){
			if(gettable2.getItems()[j].getCells()[2].getValue() == ""){
				gettable2.getItems()[j].getCells()[2].setValueState("Error");
				chk = false;
			} else {
				gettable2.getItems()[j].getCells()[2].setValueState("None");
			}
		}
		
	}
	return chk;
},
//***************************************************************************************************************
OnMoreInfoOk:function(){
	
	var validateMoreInfo = this.ValidateMoreInfo();
	if(!validateMoreInfo){
		sap.m.MessageBox.alert(
				"Please fill Remarks.", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		return false;
	}
	
	var tbl = sap.ui.getCore().byId("idTblMoreInfo");
		Data = {};
		Data.AIRemarksNvg = [];
	for(var i=0; i<tbl.getItems().length; i++){
		var obj = {};
		if(tbl.getItems()[i].getCells()[3].getSelected()){
			obj.ClaimNo = ClaimNo;
			obj.FieldName = tbl.getItems()[i].getCells()[0].getText();
		    obj.Remarks = tbl.getItems()[i].getCells()[2].getValue();
		    Data.AIRemarksNvg.push(obj);
		}
	}
 
	
	var tbl = sap.ui.getCore().byId("idTblMoreInfo1");
	for(var j=0; j<tbl.getItems().length; j++){
		var obj1 = {};
		if(tbl.getItems()[j].getCells()[3].getSelected()){
			obj1.ClaimNo = ClaimNo;
			if(tbl.getItems()[j].getCells()[0].getText() == "Product Description"){
				obj1.FieldName = "Item Code";
			}else{
			obj1.FieldName = tbl.getItems()[j].getCells()[0].getText();	
			}
			obj1.Remarks = tbl.getItems()[j].getCells()[2].getValue();
			Data.AIRemarksNvg.push(obj1);
		}
		
	}
	
	this.getView().byId("idmoreinfo").setVisible(true);
	
	this._MoreInfoDialog.close();
	this._MoreInfoDialog.destroy(true);
	this._MoreInfoDialog = undefined;
},

OnMoreInfoCancel:function(){
	
	this.getView().byId("idmoreinfo").setVisible(true);
	this._MoreInfoDialog.close();
	this._MoreInfoDialog.destroy(true);
	this._MoreInfoDialog = undefined;
},
//************************************************************************************************************
onAdjModChange : function(){

	this.getView().byId("idInsAdjMod").setValueState("None");
	//this.FnGetDefectGroup(); //29-05-2019
	var Deckey = this.getView().byId("idInsDD").getSelectedKey();
	var Modkey = this.getView().byId("idInsAdjMod").getSelectedKey();
	this.GetFunPolicy();
	this.getView().byId("idInsPolNo").setVisible(true).setValue("");
	
	
	/*if(Modkey =="POL"){
		this.GetFunPolicy();
	} else {
		this.getView().byId("idInsPolNo").setVisible(false).setValue("");
	}*/
		
	//this.getView().byId("idDfctGrp").setVisible(true);
	//this.getView().byId("idDfctCod").setVisible(true);
	
},
//******************************************************************************************************************
GetFunPolicy : function(){
	
	var that = this;
	var oViewObj 	= this.getView();
	var PrdWeek 	= this.getView().byId("idPrdWeek").getValue();
	var prdMonth 	= this.getView().byId("idPrdMonth").getSelectedKey();
	var PrdYear 	= this.getView().byId("idPrdYear").getValue();
	var wear		= this.getView().byId("idInsWear").getValue();
	var stencil 	= this.getView().byId("idStnclNo").getValue();
	//var itmCode 	= this.getView().byId("idTyrItmCod").getValue();
	
	var PolicyNoJModel = oViewObj.getModel("PolicyNoJModel");
	if (!PolicyNoJModel) { 
		
		PolicyNoJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(PolicyNoJModel, "PolicyNoJModel");
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	
	var fncSuccess = function(oData, oResponse){
		
		PolicyNoJModel.setData(oData);
		
		if(PolicyNoJModel.oData.results.length == "1"){
			that.getView().byId("idInsPolNo").setValueState("None");
			that.getView().byId("idInsPolNo").setVisible(true).setValue(PolicyNoJModel.oData.results[0].PolicyNo);
			PolicyDiscount = PolicyNoJModel.oData.results[0].Discount;
			ConstPro = PolicyNoJModel.oData.results[0].ConstPro;
			
			if(ConstPro == "C"){
				that.getView().byId("idDiscount").setValue(PolicyDiscount);
			}else{
				that.getView().byId("idDiscount").setValue(Discount);
			}
			
		} else{
			that.getView().byId("idInsPolNo").setVisible(true);
		}
	}	
					
	var fncError = function(oError) { // error callback	// function
		var parser = new DOMParser();
		var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
		}); 
	}
	// Create Method for final Save
	oReadModel.read("/GetPolicyMasterSet?$filter=IClaimRecDepo eq '"+DepoCode+"' " +
			"and IClaimTyp eq 'SP10' and ICodeGrp eq '"+DefectGroup+"' and IDealerCode eq '"+Kunnr+"' " +
			"and IItemCode eq '"+itmCode+"' " +  
			"and IFitType eq '"+FitType+"' " +
			"and AwardMode eq '' " +
			"and StencilNo eq '"+stencil+"' " +
			"and IMajorDefect eq '"+DefectCode+"' and ProdCat eq '"+PrdtCat+"' " +
			"and ProdMonth eq '"+prdMonth+"' and ProdYear eq '"+PrdYear+"' " +
			"and ProdWeek eq '"+PrdWeek+"' " +
			"and IWear eq '"+wear+"'", {
		success : fncSuccess,
		error : fncError
	});
},

//************************************************************************************************************
OnPolicyHelp:function(){
	
	var CodeGroup 	= this.getView().byId("idDfctGrp").getValue();
	var CodeDefect 	= this.getView().byId("idDfctCod").getValue();
	var PrdWeek 	= this.getView().byId("idPrdWeek").getValue();
	var prdMonth 	= this.getView().byId("idPrdMonth").getSelectedKey();
	var PrdYear 	= this.getView().byId("idPrdYear").getValue();
	var wear 		= this.getView().byId("idInsWear").getValue();
	var stencil 	= this.getView().byId("idStnclNo").getValue();
	//var itmCode 	= this.getView().byId("idTyrItmCod").getValue();
	
	var url="/sap/opu/odata/sap/ZCS_INSPECTION_SRV/GetPolicyMasterSet?$filter=IClaimRecDepo eq '"+DepoCode+"' " +
			"and IClaimTyp eq 'SP10' and ICodeGrp eq '"+DefectGroup+"' and IDealerCode eq '"+Kunnr+"' " +
			"and IItemCode eq '"+itmCode+"' " +  
			"and IFitType eq '"+FitType+"' " +
			"and AwardMode eq '' " +
			"and StencilNo eq '"+stencil+"' " +
			"and IMajorDefect eq '"+DefectCode+"' and ProdCat eq '"+PrdtCat+"' " +
			"and ProdMonth eq '"+prdMonth+"' and ProdYear eq '"+PrdYear+"' " +
			"and ProdWeek eq '"+PrdWeek+"' " +
			"and IWear eq '"+wear+"'";
			
			
	var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(url, null, false,"GET",false, false, null);
	var _valueHelpFranchSelectDialog = new sap.m.SelectDialog({
	
 title: "Policy No",
 items: {
     path: "/d/results",
     template: new sap.m.StandardListItem({
         title: "{PolicyNo}",
        description:"{PolicyDocument}",
         customData: [new sap.ui.core.CustomData({
             key: "key",
             value: "{ReplaceItemCode}"
         })],
        
     }),
 },
 liveChange: function(oEvent) {
     var sValue = oEvent.getParameter("value");
     var oFilter = new sap.ui.model.Filter("Nsd",sap.ui.model.FilterOperator.Contains,sValue);
     oEvent.getSource().getBinding("items").filter([oFilter]);
 },
 confirm: [this._handlepolClose, this],
 cancel: [this._handlepolClose, this]
});
_valueHelpFranchSelectDialog.setModel(jModel);
_valueHelpFranchSelectDialog.open();	
},

_handlepolClose:function(oEvent){
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		var obj = oSelectedItem.getBindingContext().getObject();
		PolicyDiscount = obj.Discount;
		ConstPro = obj.ConstPro;
		if(ConstPro == "C"){
			this.getView().byId("idDiscount").setValue(PolicyDiscount);
		}else{
			this.getView().byId("idDiscount").setValue(Discount);
		}
		this.getView().byId("idInsPolNo").setValue(oSelectedItem.getTitle());
		this.getView().byId("idInsPolNo").setValueState("None");
	}
},
//*************************************************************************************************************
onRC:function(){
	
	var that=this;
	gv_busyindicator.open();
	var RCJmodel = new sap.ui.model.json.JSONModel();
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
	var sPath ="GetImagesSet?$filter=ClaimNo eq '"+ClaimNo+"' and ImageFlg eq 'R' and ImageType eq ''";
	var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath); 

	var oParamsListSet = {};
	oParamsListSet.success = function(oData, oResponse) {
		
		for(var i=0; i<oData.results.length; i++){
			oData.results[i].Image = "data:image/png;base64," + oData.results[i].Image;
		}
		that._RC_Dialog = sap.ui.xmlfragment(
				"zclaimapproval.view.RC_Dialog", that);
			that.getView().addDependent(that._RC_Dialog);	
			that._RC_Dialog.setModel(RCJmodel,"RCJmodel");
			RCJmodel.setData(oData.results);
			that._RC_Dialog.open();
		
		gv_busyindicator.close();
		} 
	
			
	oParamsListSet.error = function(oError) {
		
		//jQuery.sap.log.error("ERROR!");
		sap.m.MessageBox.show(oError.response.statusText+", status code:"+ oError.response.statusCode, {
		   title: "ERROR",
		   icon:sap.m.MessageBox.Icon.ERROR,
		});
			
		gv_busyindicator.close();
	};
	
	oDataModel.read(sPath, oParamsListSet);
},

onRCImageOk:function(){
	
	this._RC_Dialog.close();
	this._RC_Dialog.destroy(true);
	this._RC_Dialog=undefined;
},
//*************************************************************************************************************
/*onTyreImage:function(){
	
	var that=this;
	gv_busyindicator.open();
	var TyreImageJmodel = new sap.ui.model.json.JSONModel();
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
	var sPath ="GetImagesSet?$filter=ClaimNo eq '"+ClaimNo+"' and ImageFlg eq 'T'";
	var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath); 

	var oParamsListSet = {};
	oParamsListSet.success = function(oData, oResponse) {
		
		for(var i=0; i<oData.results.length; i++){
			oData.results[i].Image = "data:image/png;base64," + oData.results[i].Image;
		}
		that._TyreImageDialog = sap.ui.xmlfragment(
				"zclaimapproval.view.TyreImage_Dialog", that);
			that.getView().addDependent(that._TyreImageDialog);	
			that._TyreImageDialog.setModel(TyreImageJmodel,"TyreImageJmodel");
			TyreImageJmodel.setData(oData.results);
			that._TyreImageDialog.open();
		
		gv_busyindicator.close();
		} 
	
			
	oParamsListSet.error = function(oError) {
		
		//jQuery.sap.log.error("ERROR!");
		sap.m.MessageBox.show(oError.response.statusText+", status code:"+ oError.response.statusCode, {
		   title: "ERROR",
		   icon:sap.m.MessageBox.Icon.ERROR,
		});
			
		gv_busyindicator.close();
	};
	
	oDataModel.read(sPath, oParamsListSet);
},*/
//************************************************************************************************************
onTyreImageOk:function(){
	
	this._TyreImageDialog.close();
	this._TyreImageDialog.destroy(true);
	this._TyreImageDialog=undefined;
	
},
//*************************************************************************************************************
onDefectImage:function(){
	
	var that=this;
	gv_busyindicator.open();
	var DefectImageJmodel = new sap.ui.model.json.JSONModel();
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
	var sPath ="GetImagesSet?$filter=ClaimNo eq '"+ClaimNo+"' and ImageFlg eq 'D' and ImageType eq ''";
	var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath); 

	var oParamsListSet = {};
	oParamsListSet.success = function(oData, oResponse) {
		
		for(var i=0; i<oData.results.length; i++){
			oData.results[i].Image = "data:image/png;base64," + oData.results[i].Image;
		}
		that._DefectImageDialog = sap.ui.xmlfragment(
				"zclaimapproval.view.DefectImage_Dialog", that);
			that.getView().addDependent(that._DefectImageDialog);	
			that._DefectImageDialog.setModel(DefectImageJmodel,"DefectImageJmodel");
			DefectImageJmodel.setData(oData.results);
			that._DefectImageDialog.open();
		
		gv_busyindicator.close();
		} 
	
			
	oParamsListSet.error = function(oError) {
		
		//jQuery.sap.log.error("ERROR!");
		sap.m.MessageBox.show(oError.response.statusText+", status code:"+ oError.response.statusCode, {
		   title: "ERROR",
		   icon:sap.m.MessageBox.Icon.ERROR,
		   onClose:function(){
				gv_busyindicator.close();
				this._DefectImageDialog.close();
				this._DefectImageDialog.destroy(true);
				this._DefectImageDialog=undefined;
	        }
		   
		});
			
		gv_busyindicator.close();
	};
	
	oDataModel.read(sPath, oParamsListSet);
},
//************************************************************************************************************
onDefectImageOk:function(){
	
	this._DefectImageDialog.close();
	this._DefectImageDialog.destroy(true);
	this._DefectImageDialog=undefined;
	
},
//************************************************************************************************************
onAIprediction:function(){
	
	var that = this;
	
	this.ClaimDialog = sap.ui.xmlfragment("zclaimapproval.view.ClaimDialog",this);
	this.getView().addDependent(this.ClaimDialog);
	this.ClaimDialog.open();
	this.ClaimDialog.setEscapeHandler(function(o){ 
		o.reject(); 
		//o.resolve();
		});
	gv_busyindicator.open();
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
	var sPath ="/GetImagePredictionHeadSet(ClaimNo='"+ClaimNo+"')?$expand=PredictionImageNvg/PredictionImageDataNvg,F4DefectPredictionNvg";
	var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

	var oParamsListSet = {};
	oParamsListSet.success = function(oData, oResponse) {
		 
		//GlobalJmodel.setData(oData);
		AIPredictionData.setData(oData);
		
		if(AIPredictionData.oData.PredictionImageNvg.results.length !="0"){
            
			//Search Help for Select Defect;
			f4Selectdefect = AIPredictionData.oData.F4DefectPredictionNvg.results;
            
			if(ItemType == "TYRE"){
				
				sap.ui.getCore().byId("id3rdPredimgVbox").setVisible(true);
				sap.ui.getCore().byId("idClaimDialog").addStyleClass("TyreClaimDialogBox");	
				
				//Show Final defect
				FinalResultJmodel.setData(AIPredictionData.oData);
				sap.ui.getCore().byId("idFinalResults").setModel(FinalResultJmodel,"FinalResultJmodel");
				sap.ui.getCore().byId("idFinalResults").setText("Final Defect: " + FinalResultJmodel.oData.DefectDesc);
				//Set Model in fragment
				predictionJModel.setData(AIPredictionData.oData.PredictionImageNvg.results);
				sap.ui.getCore().byId("idClaimDialog").setModel(predictionJModel,"predictionJModel");
				
				//Set Model in fragment table1
				predictionDataJModel1.setData(AIPredictionData.oData.PredictionImageNvg.results[0].PredictionImageDataNvg.results);
				sap.ui.getCore().byId("idPridectTbl").setModel(predictionDataJModel1,"predictionDataJModel1");
				
				//Set Model in fragment table2
				predictionDataJModel2.setData(AIPredictionData.oData.PredictionImageNvg.results[1].PredictionImageDataNvg.results);
				sap.ui.getCore().byId("idPridectTbl2").setModel(predictionDataJModel2,"predictionDataJModel2");
				
				//Set Model in fragment table3
				predictionDataJModel3.setData(AIPredictionData.oData.PredictionImageNvg.results[2].PredictionImageDataNvg.results);
				sap.ui.getCore().byId("idPridectTbl3").setModel(predictionDataJModel3,"predictionDataJModel3");
				
			var src1 = "data:image/png;base64," + AIPredictionData.oData.PredictionImageNvg.results[0].Image;
			var src2 = "data:image/png;base64," + AIPredictionData.oData.PredictionImageNvg.results[1].Image;
			var src3 = "data:image/png;base64," + AIPredictionData.oData.PredictionImageNvg.results[2].Image;
					
					sap.ui.getCore().byId("image1").setSrc(src1);
					sap.ui.getCore().byId("image2").setSrc(src2);
					sap.ui.getCore().byId("image3").setSrc(src3);
					gv_busyindicator.close();
					
			} else if(ItemType == "TUBE"){
				sap.ui.getCore().byId("id3rdPredimgVbox").setVisible(false);	
				sap.ui.getCore().byId("idClaimDialog").addStyleClass("TubeClaimDialogBox");	
				//Show Final defect
				FinalResultJmodel.setData(AIPredictionData.oData);
				sap.ui.getCore().byId("idFinalResults").setModel(FinalResultJmodel,"FinalResultJmodel");
				sap.ui.getCore().byId("idFinalResults").setText("Final Defect: " + FinalResultJmodel.oData.DefectDesc);
				//Set Model in fragment
				predictionJModel.setData(AIPredictionData.oData.PredictionImageNvg.results);
				sap.ui.getCore().byId("idClaimDialog").setModel(predictionJModel,"predictionJModel");
				
				//Set Model in fragment table1
				predictionDataJModel1.setData(AIPredictionData.oData.PredictionImageNvg.results[0].PredictionImageDataNvg.results);
				sap.ui.getCore().byId("idPridectTbl").setModel(predictionDataJModel1,"predictionDataJModel1");
				
				//Set Model in fragment table2
				predictionDataJModel2.setData(AIPredictionData.oData.PredictionImageNvg.results[1].PredictionImageDataNvg.results);
				sap.ui.getCore().byId("idPridectTbl2").setModel(predictionDataJModel2,"predictionDataJModel2");
				
			var src1 = "data:image/png;base64," + AIPredictionData.oData.PredictionImageNvg.results[0].Image;
			var src2 = "data:image/png;base64," + AIPredictionData.oData.PredictionImageNvg.results[1].Image;
					
					sap.ui.getCore().byId("image1").setSrc(src1);
					sap.ui.getCore().byId("image2").setSrc(src2);
			} 		
			
		} else {
		sap.m.MessageBox.show("Communication Failure.", {
			   title: "ERROR",
			   icon:sap.m.MessageBox.Icon.ERROR,
			});

			gv_busyindicator.close();
			that.ClaimDialog.close();
			that.ClaimDialog.destroy();
			that.ClaimDialog = undefined;

		}
		
		var arr = [{
			Key: "A",
			Value: "Accepted"	
		},
		{
			Key: "R",
			Value: "Rejected"	
		},
		{
			Key: "ED",
			Value: "More Information Needed"	
		},
		{
			Key: "MN",
			Value: "Manual Inspection Needed"	
		}];
	 
	 var jModel = new sap.ui.model.json.JSONModel();
	 var  loc= that.getView().byId("idInsDD");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		jModel.setData(arr);
		loc.bindAggregation("items", {
			path : "/",
			template : new sap.ui.core.Item({
				key : "{Key}",
				text : "{Value}"
			})
		}); 		
		
		
		
		that.getView().byId("idDfctGrp").setVisible(true);
		that.getView().byId("idDfctCod").setVisible(true);
		that.getView().byId("idInsDD").setSelectedKey();
		that.getView().byId("idmoreinfo").setVisible(false);
		gv_busyindicator.close();
		 
	};
			
	oParamsListSet.error = function(oError) {
					
		sap.m.MessageBox.show(oError.response.statusText+", status code:"+ oError.response.statusCode, {
		   title: "ERROR",
		  icon:sap.m.MessageBox.Icon.ERROR,
		  
		  onClose:function(){
				gv_busyindicator.close();
				that.ClaimDialog.close();
				that.ClaimDialog.destroy();
				that.ClaimDialog = undefined;
	        }
		});
		
	};
	
	oDataModel.read(sPath, oParamsListSet);
},

//***********************************************************************************************************
onRBtnSelect:function(){
	
	 if(sap.ui.getCore().byId("idRBtnFialDefect").getSelected()){
		sap.ui.getCore().byId("idDefect").setEnabled(false).setValue();
		
		GroupDesc   = "";
    	DefectDesc	= "";
    	DefectGroup = "";
    	DefectCode  = "";
    	PredFlag    = "";
	}else if(sap.ui.getCore().byId("idRBtnSelectDefect").getSelected()){
		sap.ui.getCore().byId("idDefect").setEnabled(true);
		
		GroupDesc   = "";
    	DefectDesc	= "";
    	DefectGroup = "";
    	DefectCode  = "";
    	PredFlag    = "";
	}
},
//***********************************************************************************************************
onSelectDefect:function(evt){
	
	var jModel = new sap.ui.model.json.JSONModel();
		jModel.setData(f4Selectdefect);
var _valueHelpSelectDefectDialog = new sap.m.SelectDialog(
		{
			title : "Select Defect",
			items : {
				path : "/",
				template : new sap.m.StandardListItem(
						{
							title : "{DefectDesc}",
							customData : [ new sap.ui.core.CustomData(
									{
										key : "{DefectCode}",
										value : "{DefectDesc}"
									}) ],
						}),
			},
			liveChange : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("DefectDesc",sap.ui.model.FilterOperator.Contains,sValue);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
			confirm : [ this._handleSelectDefectClose, this ],
			cancel : [ this._handleSelectDefectClose, this ]
		});
_valueHelpSelectDefectDialog.setModel(jModel);

for(var i=0; i<_valueHelpSelectDefectDialog.getItems().length; i++){
	if(_valueHelpSelectDefectDialog.getItems()[i].getBindingContext().getObject().AIFlag == "X"){
		_valueHelpSelectDefectDialog.getItems()[i].addStyleClass("classdefect");
	}
}

_valueHelpSelectDefectDialog.open();
},

_handleSelectDefectClose : function(oEvent) {

	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		sap.ui.getCore().byId("idDefect").setValue(oSelectedItem.getTitle()); 
		var DefectData = oSelectedItem.getBindingContext().getObject();
		
		GroupDesc   = DefectData.GroupDesc;
    	DefectDesc	= DefectData.DefectDesc;
    	DefectGroup = DefectData.DefectGroup;
    	DefectCode  = DefectData.DefectCode;
    	
    	if(DefectData.AIFlag == ""){
    		PredFlag = "X";
		}else{
			PredFlag = "";
		}
	}

},

//***********************************************************************************************************
onClaimOK:function(){
	this.getView().byId("idDiscount").setVisible(false);
	this.getView().byId("idInsAdjMod").setVisible(false).setSelectedKey();			
	this.getView().byId("idInsRegRea").setVisible(false).setSelectedKey();
	this.getView().byId("idInsPolNo").setVisible(false).setValue();
	
	if(sap.ui.getCore().byId("idRBtnFialDefect").getSelected()){
		var finalDefect = sap.ui.getCore().byId("idFinalResults").getModel("FinalResultJmodel").getData();
		GroupDesc =  finalDefect.GroupDesc;
	    DefectDesc = finalDefect.DefectDesc;
	    DefectGroup = finalDefect.DefectGroup;
	    DefectCode  = finalDefect.DefectCode;
	}
	
	this.getView().byId("idDfctGrp").setValue(GroupDesc);
	this.getView().byId("idDfctCod").setValue(DefectDesc);
	
	this.ClaimDialog.close();
	this.ClaimDialog.destroy(true);
	this.ClaimDialog = undefined;
},
onAIPridCancel:function(){
	
	GroupDesc   = "";
	DefectDesc	= "";
	DefectGroup = "";
	DefectCode  = "";
	PredFlag    = "";
	
	this.getView().byId("idDfctGrp").setVisible(false); 
	this.getView().byId("idDfctCod").setVisible(false);
	this.getView().byId("idDiscount").setVisible(false); 
	this.getView().byId("idInsAdjMod").setVisible(false);
	this.getView().byId("idInsRegRea").setVisible(false); 
	this.getView().byId("idInsPolNo").setVisible(false);
	this.getView().byId("idRemrks").setValue();
	this.DisposalDecisionList();
	
	
	this.ClaimDialog.close();
	this.ClaimDialog.destroy(true);
	this.ClaimDialog = undefined;
},
//************************************************************************************************************
ValidateFields:function(){
	
	var check = true;
	
	if(ItemType == "TUBE"){
		
	    if(this.getView().byId("idTubeVendorCode").getVisible() == true){
	    	if(this.getView().byId("idTubeVendorCode").getValue()==""){
				this.getView().byId("idTubeVendorCode").setValueState("Error");
				check = false;;
			} else {
				this.getView().byId("idTubeVendorCode").setValueState("None");
			}
	    }	
		
	    if(this.getView().byId("idTubeMouldNo").getVisible() == true){
			if(this.getView().byId("idTubeMouldNo").getValue()==""){
				this.getView().byId("idTubeMouldNo").setValueState("Error");
				check = false;
			} else {
				this.getView().byId("idTubeMouldNo").setValueState("None");
			}
	    } 
		
	    if(this.getView().byId("idTubePrdMonth").getVisible() == true){
			if(this.getView().byId("idTubePrdMonth").getSelectedKey()==""){
				this.getView().byId("idTubePrdMonth").setValueState("Error");
				check = false;
			} else {
				this.getView().byId("idTubePrdMonth").setValueState("None");
			}
	    }
		
	    if(this.getView().byId("idTubePrdYear").getVisible() == true){
			if(this.getView().byId("idTubePrdYear").getValue()==""){
				this.getView().byId("idTubePrdYear").setValueState("Error");
				check = false;
			} else {
				this.getView().byId("idTubePrdYear").setValueState("None");
			}
	    }
		
	    if(this.getView().byId("idTubePerWear").getVisible() == true){
			if(this.getView().byId("idTubePerWear").getValue()==""){
				this.getView().byId("idTubePerWear").setValueState("Error");
				check = false;
			} else {
				this.getView().byId("idTubePerWear").setValueState("None");
			}
	    }
	}
	
	
	if(this.getView().byId("idDfctGrp").getVisible() == true){
		if(this.getView().byId("idDfctGrp").getValue()==""){
			this.getView().byId("idDfctGrp").setValueState("Error");
			check = false;
		} else {
			this.getView().byId("idDfctGrp").setValueState("None");
		}
    }
	
	if(this.getView().byId("idDfctCod").getVisible() == true){
		if(this.getView().byId("idDfctCod").getValue()==""){
			this.getView().byId("idDfctCod").setValueState("Error");
			check = false;
		} else {
			this.getView().byId("idDfctCod").setValueState("None");
		}
    }
	
	
	if(this.getView().byId("idInsDD").getSelectedKey() == "ED"){
		if(Data.AIRemarksNvg.length == "0"){
			this.getView().byId("idmoreinfo").setType("Reject");
			check = false;
		} else {
			this.getView().byId("idmoreinfo").setType("Accept");
		}
	}
	
	
	var Modkey = this.getView().byId("idInsAdjMod").getSelectedKey();
	
	if(this.getView().byId("idInsDD").getSelectedKey()==""){
		this.getView().byId("idInsDD").setValueState("Error");
		check = false;
	}else {
		this.getView().byId("idInsDD").setValueState("None");
	}
	
	if(Decisionkey == "A"){
		if(this.getView().byId("idInsAdjMod").getSelectedKey()==""){
			this.getView().byId("idInsAdjMod").setValueState("Error");
			check = false;
		}else{
			this.getView().byId("idInsAdjMod").setValueState("None");
		}
	//}
		
	if(ItemType == "TYRE"){	
		
		if(Modkey == "TEC"){
			if(this.getView().byId("idInsPolNo").getValue()==""){
				this.getView().byId("idInsPolNo").setValueState("Error");
				check = false;
			} else {
				this.getView().byId("idInsPolNo").setValueState("None");
			}
		}
	
		
			if(Modkey == "POL"){
				if(this.getView().byId("idInsPolNo").getValue()==""){
					this.getView().byId("idInsPolNo").setValueState("Error");
					check = false;
				} else {
					this.getView().byId("idInsPolNo").setValueState("None");
				}
			}
		}
	}else if(Decisionkey == "R"){
		if(this.getView().byId("idInsRegRea").getSelectedKey()==""){
			this.getView().byId("idInsRegRea").setValueState("Error");
			check = false;
		} else {
			this.getView().byId("idInsRegRea").setValueState("None");
		}
	}
	
	return check;	
	
},

//*************************************************************************************************************
DisposalDecisionList:function(){
	 
	
	 var arr = [{
			Key: "ED",
			Value: "More Information Needed"	
		},
		{
			Key: "MN",
			Value: "Manual Inspection Needed"	
		}];
		var jModel = new sap.ui.model.json.JSONModel();
		var  loc= this.getView().byId("idInsDD");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		jModel.setData(arr);
		loc.bindAggregation("items", {
			path : "/",
			template : new sap.ui.core.Item({
				key : "{Key}",
				text : "{Value}"
			})
		}); 		
		
	
	},
//*************************************************************************************************************
OnChangeYear:function(oEvent){
	
	var year = oEvent.getSource().getValue();
    var month = this.getView().byId("idMonth").getSelectedKey();
	
	var d = new Date();
	var currentMonth = d.getMonth();
	var currentYear = d.getFullYear();

	if(year){

   		if(isNaN(year)){
			year = year.substring(0, year.length - 1);
			oEvent.getSource().setValue(year);					
		}else if(!(isNaN(year)) && year.length == 4){
			var d = new Date();
			var y = d.getFullYear();
				if(year < 2000){
				sap.m.MessageToast.show("Year cannot be less than 2000");
				oEvent.getSource().setValue();				
				}else if(year > y){
				sap.m.MessageToast.show("Year cannot be future year");
				oEvent.getSource().setValue();
				}
		}

	} 	
},
/*
OnMonthChange:function(evt){
	
	var month = evt.getSource().getSelectedKey();
	var year = this.getView().byId("idpYear").getValue();
	var d = new Date();
	var currentMonth = d.getMonth();
	var currentYear = d.getFullYear();
	if(year !=""){
		if(month>currentMonth && year == currentYear){
		sap.m.MessageToast.show("Month cannot be future month.");
		evt.getSource().setSelectedKey();
	}
	}
},*/
//*************************************************************************************************************
onSubmit: function(){
	
	if(this.ValidateFields()== false){
		sap.m.MessageBox.alert(
				"Please fill all required fields.", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		return false;
	};
	var self= this;
	var CustPhone 	= this.getView().byId("idPhone1").getValue();
	var CustNname 	= this.getView().byId("idFname").getValue();
	var VehType 	= this.getView().byId("idVehTyp").getValue();
	var VehMake 	= this.getView().byId("idVehMak").getValue();
	var VehModel 	= this.getView().byId("idVehMdl").getValue();
	var TyrKMCov 	= this.getView().byId("idTyrKmCvrd").getValue();
	
	var ItmCode     = itmCode;		
	var StnclNo 	= this.getView().byId("idStnclNo").getValue();
	
	if(ItemType == "TYRE"){
		
		if(this.getView().byId("idInsNsd1").getVisible() == true){
			var Nsd1 = this.getView().byId("idInsNsd1").getValue();
		}
		if(this.getView().byId("idInsNsd2").getVisible() == true){
			var Nsd2 = this.getView().byId("idInsNsd2").getValue();
		}
		if(this.getView().byId("idInsNsd3").getVisible() == true){
			var Nsd3 = this.getView().byId("idInsNsd3").getValue();
		}
		if(this.getView().byId("idInsNsd4").getVisible() == true){
			var Nsd4 = this.getView().byId("idInsNsd4").getValue();
		}
		var Nsd 		= this.getView().byId("idInsNsd").getValue();
		var AvgNsd 		= this.getView().byId("idAvgNsd").getValue();
		
		if(Nsd1 == undefined){
			Nsd1 = "0.00";
		}
		
		if(Nsd2 == undefined){
			Nsd2 = "0.00";
		}
		
		if(Nsd3 == undefined){
			Nsd3 = "0.00";
		}
		
		if(Nsd4 == undefined){
			Nsd4 = "0.00";
		}
		
		if(Nsd == undefined){
			Nsd = "0.00";
		}
		
		if(AvgNsd == undefined){
			AvgNsd = "0.00";
		}
		
		if(parseFloat(Wear) < 1){
			Wear = "000"; 
		}
		
	} else if(ItemType == "TUBE"){
		
		var TubeVendorCode 	= this.getView().byId("idTubeVendorCode").getValue();
		var TubeMouldNo 	= this.getView().byId("idTubeMouldNo").getValue();
		var TubePrdMnth = this.getView().byId("idTubePrdMonth").getSelectedKey();
		var TubPrdYr= this.getView().byId("idTubePrdYear").getValue()
		var TubeStnclNo = this.getView().byId("idTubeStnclNo").getValue();
		var TubePerWear = this.getView().byId("idTubePerWear").getValue();
		var TubeDescount = this.getView().byId("idDiscount").getValue();
		
	}
	
	var Wear 		= this.getView().byId("idInsWear").getValue();
	var Week 		= this.getView().byId("idPrdWeek").getValue();
	var Month 		= this.getView().byId("idPrdMonth").getSelectedKey();
	var Year		= this.getView().byId("idPrdYear").getValue();

	var DispoDec 	= this.getView().byId("idInsDD").getSelectedKey();
	var AdjMode 	= this.getView().byId("idInsAdjMod").getSelectedKey();
	var RejRes		= this.getView().byId("idInsRegRea").getSelectedKey();
	var PolicyNo 	= this.getView().byId("idInsPolNo").getValue();
	var Remrks 		= this.getView().byId("idRemrks").getValue();		
	
	 if(DispoDec !="ED"){
     	Data = {};
     	Data.AIRemarksNvg = [{"ClaimNo":"dummy","FieldName":"dummy","Remarks":"dummy"}];
     }
	
	//Ticket Details
	 if(this.SelectedData.CollectTicketNo.length !=0){
	    Data.AIInspTicketClose = []
	    Data.AIInspTicketClose = this.SelectedData.CollectTicketNo;
	 }
	 
	 
	if(ItemType == "TYRE") {
		 if(ConstPro == "C"){
			 Data.PolicyDiscount = PolicyDiscount;
			 Data.RevisedDis	 = PolicyDiscount;
			 Data.Discount 		 = PolicyDiscount;
			 Data.FinalAmtDis    = PolicyDiscount;
			 Data.AbsoluteDis	 = Discount;
		 } else {
			 Data.FinalAmtDis    = Discount;
			 Data.AbsoluteDis	= Discount;
			 Data.Discount		= Discount;
		 }
	} else if(ItemType == "TUBE") {
		 Data.PolicyDiscount = TubeDescount ==""?"0":TubeDescount;
		 Data.RevisedDis	 = TubeDescount ==""?"0":TubeDescount;
		 Data.Discount 		 = TubeDescount ==""?"0":TubeDescount;
		 Data.FinalAmtDis    = TubeDescount ==""?"0":TubeDescount;
		 Data.AbsoluteDis	 = TubeDescount ==""?"0":TubeDescount;
	}
	 
	 if(DispoDec == "A" || DispoDec == "R"){
		 Data.PredictionFlag = PredFlag;
	 }else{
		 Data.PredictionFlag = "";
	 }

	//Data.Discount		= Discount;
	Data.Owner 			= "02";
	Data.FitType 		= FitType;
	Data.ISpot          = '';
	Data.ItemType	    = ItemType; 
	Data.ClaimRecDepo   = DepoCode;
	Data.CustomerLand1  ="IN";
	Data.ClaimTyp 		= "WR10";
	Data.CustType 		= "01";
	Data.SubmNo 		= "1"
	Data.TlyFlg 		= "TL";	
	Data.ManfPlnt		= ManfPlnt;
	Data.TicketNo       = TicketNo;
	Data.Bukrs          = Bukrs;
	Data.CustomerTelf1	= CustPhone;
	Data.CustomerName  = CustNname;
	Data.VehType  		= VehType;
	Data.VehMake		= VehMake;
	Data.VehModel 		= VehModel;
	Data.KmCovered  	= TyrKMCov;
	Data.DealerCode		= Kunnr;
	
	/*Data.FranhiseName   = FranName;
	Data.RegNo 			= RegNo
	if(TyrKMCov == ""){
		TyrKMCov = "0.00";
	}*/

	
	Data.CustomerRegion = CustomerRegion;
	Data.ClaimNo		= ClaimNo;
	Data.ItemCode 		= ItmCode;
	
	if(ItemType == "TYRE"){
		Data.StnclNumber 	= StnclNo;
		Data.Nsd1			= Nsd1;
		Data.Nsd2			= Nsd2;
		Data.Nsd3			= Nsd3;
		Data.Nsd4			= Nsd4;
		Data.TotalNsd		= Nsd;
		Data.Nsd			= AvgNsd;
		Data.PercentageWear	= Wear;
		Data.PrdWeek	= Week;
		Data.PrdMonth	= Month;
		Data.PrdYear	= Year;  	
		Data.TyrePrdWeek 	= Week;
		Data.TyrePrdMonth 	= Month;
		Data.TyrePrdYear 	= Year;
		Data.VendorCode		= "";
		Data.MouldNo		= "";
		
	} else if(ItemType == "TUBE"){
		Data.VendorCode		= TubeVendorCode;
		Data.MouldNo		= TubeMouldNo;
		Data.PrdYear		= TubPrdYr;
		Data.PrdMonth		= TubePrdMnth;
		Data.StnclNumber 	= TubeStnclNo
		Data.PercentageWear	= TubePerWear;
		Data.TyrePrdYear 	= "00"
		Data.TyrePrdMonth 	= "00";
		Data.Nsd1			= "0.00";
		Data.Nsd2			= "0.00";;
		Data.Nsd3			= "0.00";;
		Data.Nsd4			= "0.00";;
		Data.TotalNsd		= "0.00";;
		Data.Nsd			= "0.00";;
	}
	
	Data.DisposlDecision	= DispoDec;
	Data.AdjustmentMode		= AdjMode;
	Data.RejectionReason	= RejRes;
	Data.CodeGrp			= DefectGroup; 
	Data.MajorDefect		= DefectCode;
	Data.PolicyNo			= PolicyNo;
	Data.InspectComments	= Remrks;
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});
		var fncSuccess = function(oData, oResponse) //success function 
			{
		
				if(oData.EError=="true"){
					sap.m.MessageBox.show(oData.EMessage, {
				        title: "Error",
				        icon:sap.m.MessageBox.Icon.ERROR,
				        onClose:function(){
				        	window.history.back();
				        }
				    });	
				}else{
					 
					sap.m.MessageBox.show(oData.EMessage, {
				        title: "Success",
				        icon:sap.m.MessageBox.Icon.SUCCESS,
				        onClose:function(){
				        	
				        	//window.history.back();
				        	var router = sap.ui.core.UIComponent.getRouterFor(self);
				        	router.navTo("S1");
				        	
				        	//that.saveUploadedDocs(oData.ClaimNo,oData.InspNo);         	// document upload
				        	
				        }
					});
				
				}
			
			}
		var fncError = function(oError) { //error callback function
			var parser = new DOMParser();
				sap.m.MessageBox.show(parser, {
			        title: "Error",
			        icon:sap.m.MessageBox.Icon.ERROR,
			    });
		}
		//Create Method for final Save
		oCreateModel1.create("/SaveInspectionAISet", Data, {
			success: fncSuccess,
			error: fncError
		});
},
//*************************************************************************************************************
});
});
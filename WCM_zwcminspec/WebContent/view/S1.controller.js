sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
function( JSONModel,UploadCollectionParameter) {
"use strict";

jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("zwcminspec.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.Dialog");

var that, initialFlag,state,CompName,ClaimNo,DepoCode,DlrName,Kunnr, item_code ,
	ClaimItmTyp,ClaimType,ItemType,CName,selKey1,selKey2,ItmCode,fitType,VehCat,TallyFlag,VehType,
	ManfPlant,Ticket,CustMob,Bukrs,prodcat,salesdt,VarBukrs,Discount,ConstPro;

/*sap.ui.define([
           	"sap/m/MessageBox",
           	"sap/ui/core/mvc/Controller",
           	"sap/ui/model/json/JSONModel",
           	"sap/m/MessageToast",
           	"sap/m/UploadCollectionParameter"
           ], function(MessageBox,Controller, JSONModel,UploadCollectionParameter) {
           	"use strict";*/

sap.ui.core.mvc.Controller
		.extend(
				"zwcminspec.view.S1",
				{ 

onInit : function() {
		that = this;
		initialFlag = true;
		this.newBusy = new sap.m.BusyDialog();
		// this.newBusy.open();
		this.model = this.getOwnerComponent().getModel();
		that = this;
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		if (sap.ui.Device.system.desktop) {
		}
		var date = new Date();
		var oModel = new JSONModel(this._data);
		//functions
		this.onClearVariable();
		this.onRejReason();
		this.onTicketSource();
		//this.onFitmentType();
		if(CName==undefined)
			{
		// var CName = "";	change 
		 CName = "";	
		this.onDealerInfo(CName);
			}
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
	
	//for date
	_data : {
		"date" : new Date()
	},	
	
//////////////////////////////////////////////////////////////////////////////////////////////////
	payLoadDate: function(SDateValue) {
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

	onClearVariable:function(key){
		//initialFlag = undefined;
			state 		= undefined;
			CompName 	= undefined;
			ClaimNo 	= undefined;
			DepoCode 	= undefined;
			DlrName 	= undefined;
			Kunnr 		= undefined;
			ClaimItmTyp = undefined;
			ClaimType 	= undefined;
			ItemType 	= undefined;
			CName 		= undefined;
			selKey1 	= undefined;
			selKey2 	= undefined;
			ItmCode 	= undefined;
			fitType 	= undefined;
			VehCat 		= undefined;
			VehType		= undefined;
			TallyFlag 	= undefined;
			ManfPlant 	= undefined;
			Ticket 		= undefined;
			CustMob 	= undefined;
			Bukrs   	= undefined;
			},

//////////////////////////////////////////////////////////////////////////////////////////////////	
	onTyreCondition:function(sType){
		//Method for setting the model for probable condition
        var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TyreConditionSet?$filter=Type eq '" + sType + "'";
 		var jModel = new sap.ui.model.json.JSONModel();
 		jModel.loadData(sPath, null, false,"GET",false, false, null);
 		var  loc= that.getView().byId("idCondition");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{Condition}",
				text : "{Description}"
			})
		});
	},
	
	onFitmentType:function(){
		//Method for setting the model for Fitment Type
        var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
 		var jModel = new sap.ui.model.json.JSONModel();
 		jModel.loadData(sPath, null, false,"GET",false, false, null);
 		var  loc= this.getView().byId("idFitment");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{Type}",
				text : "{Description}"						
			})
		});
	},
	
	onTicketSource:function(){
		//Method for setting the model for ticket source
        var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/TicketSourceSet";
 		var jModel = new sap.ui.model.json.JSONModel();
 		jModel.loadData(sPath, null, false,"GET",false, false, null);
 		var  loc= this.getView().byId("idTicketSource");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{Code}",
				text : "{Text}"
			})
		});		
		},	

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onAfterRendering: function() {
	
	var that = this;
	if(initialFlag){
			if (!that._DealerDialog) {
				
				that._DealerDialog = sap.ui.xmlfragment(
					"zwcminspec.view.Intial", that);
				that.getView().addDependent(that._DealerDialog);}
			that._DealerDialog.open();
	}				
			
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onMobile: function(oEvt) 
 {  
	 var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerMobileSet(ITelf1='')";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
   var _valueHelpSelectDialog = new sap.m.SelectDialog({
   	
       title: "State",
       items: {
           path: "/d/results",
           template: new sap.m.StandardListItem({
               title: "{ITelf1}",
               customData: [new sap.ui.core.CustomData({
                   key: "{ITelf1}",
                   value: "{ITelf1}"
               })],    	               
           }),
       },
       liveChange: function(oEvent) {
           var sValue = oEvent.getParameter("value");
           var oFilter = new sap.ui.model.Filter("ITelf1",sap.ui.model.FilterOperator.Contains,sValue);
           oEvent.getSource().getBinding("items").filter([oFilter]);
       },
       confirm: [this._handleClose, this],
       cancel: [this._handleClose, this]
   });
   _valueHelpSelectDialog.setModel(jModel);
   _valueHelpSelectDialog.open();
},

_handleClose: function(oEvent) {
   var oSelectedItem = oEvent.getParameter("selectedItem");
   if (oSelectedItem) {
       this.getView().byId("idCustMob").setValue(oSelectedItem.getTitle());
   }      
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onMobileFrag: function(oEvt) 
 {  
	 	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerMobileSet(ITelf1='')";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({
   	
       title: "State",
       items: {
           path: "/d/results",
           template: new sap.m.StandardListItem({
               title: "{ITelf1}",
               customData: [new sap.ui.core.CustomData({
                   key: "{ITelf1}",
                   value: "{ITelf1}"
               })],    	               
           }),
       },
       liveChange: function(oEvent) {
           var sValue = oEvent.getParameter("value");
           var oFilter = new sap.ui.model.Filter("ITelf1",sap.ui.model.FilterOperator.Contains,sValue);
           oEvent.getSource().getBinding("items").filter([oFilter]);
       },
       confirm: [this._handleClose, this],
       cancel: [this._handleClose, this]
   });
   _valueHelpSelectDialog.setModel(jModel);
   _valueHelpSelectDialog.open();
},

_handleClose: function(oEvent) {
   var oSelectedItem = oEvent.getParameter("selectedItem");
   if (oSelectedItem) {
       sap.ui.getCore().byId("idCustMob").setValue(oSelectedItem.getTitle());
   }      
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onCustomerName:function(){
		that = this;
		var CartListSetJModel = new sap.ui.model.json.JSONModel();
		this._EntriesHelpDialog = sap.ui.xmlfragment("zwcminspec.view.Customer",this);
		this.getView().addDependent(this._entriesHelpDialog);
		this._EntriesHelpDialog.setModel(CartListSetJModel, "CartListSetJModel");
		this._EntriesHelpDialog.open();
	},
	
onSearch:function(){
	
		var ticket  = sap.ui.getCore().byId("idTicket").getValue();
		var mobile  = sap.ui.getCore().byId("idPhone1").getValue();
		var that = this;
	 var CartListSetJModel = this._EntriesHelpDialog.getModel("CartListSetJModel");
	var sPathCartListSet = "/DealerTicketSearchSet?$filter=Kunnr eq '"+Kunnr+"' and TicketNo eq'"+ticket+"' and ITelf1 eq'"+mobile+"'";
			
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) { // success handler
	
	CartListSetJModel.setData(oData.results);
	
	if(oData.results.length == 0){
		sap.m.MessageToast.show("No Data Found.");	
		}
	};
	oParamsCartListSet.error = function(oError) { // error handler&nbsp;
	jQuery.sap.log.error("read publishing group data failed");
 sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	 };
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
	});
				
},
	  
onCustomerfrgClose: function(evt){
			this._EntriesHelpDialog.close();
			this._EntriesHelpDialog.destroy(true);
	},

 displayRequest: function(e){
	 
			var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
			var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
			sap.ui.getCore().byId("idTicketNo").setValue(data.TicketNo);
			
			this.onCustomerfrgClose();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
OnFragOk : function(){
	
	
	    selKey1 = sap.ui.getCore().byId("RD1").getSelected();		
		selKey2 = sap.ui.getCore().byId("RD2").getSelected();

if(selKey1){			
	var TicktNo = sap.ui.getCore().byId("idTicketNo").getValue();
	if(TicktNo == ""){
		sap.ui.getCore().byId("idTicketNo").setValueState(sap.ui.core.ValueState.Error);
		return;
	} else { 
		sap.ui.getCore().byId("idTicketNo").setValueState(sap.ui.core.ValueState.None);
	}			
}else{
	
	CustMob = sap.ui.getCore().byId("idCustMob").getValue();
	if(CustMob == ""){
		sap.ui.getCore().byId("idCustMob").setValueState(sap.ui.core.ValueState.Error);
		return;
	} else { 
		sap.ui.getCore().byId("idCustMob").setValueState(sap.ui.core.ValueState.None);
	}
	
	if(CustMob != "" && CustMob.length < "10"){  //check Mobile no valid or not
		sap.m.MessageBox.show("Invalid Mobile Nunber.", {
            title: "ERROR",
            icon:sap.m.MessageBox.Icon.ERROR,
			});
			return;
	}
	
	/*var Fittype = sap.ui.getCore().byId("idFitment").getSelectedKey();
	if(Fittype == ""){
		sap.ui.getCore().byId("idFitment").setValueState(sap.ui.core.ValueState.Error);
		return;
	} else { 
		sap.ui.getCore().byId("idFitment").setValueState(sap.ui.core.ValueState.None);
	}*/
	};	
	
	CName 	= sap.ui.getCore().byId("idCname").getSelectedKey();
	if(CName == ""){
		sap.ui.getCore().byId("idCname").setValueState(sap.ui.core.ValueState.Error);
		return;
	} else { 
		sap.ui.getCore().byId("idCname").setValueState(sap.ui.core.ValueState.None);
	}

	ItemType = sap.ui.getCore().byId("idInspFor").getSelectedKey();
	if(ItemType == ""){
		sap.ui.getCore().byId("idInspFor").setValueState(sap.ui.core.ValueState.Error);
		return;
	} else { 
		sap.ui.getCore().byId("idInspFor").setValueState(sap.ui.core.ValueState.None);
	}
	
	
	//for Defect Group- 5/21/2019
	if(CName == "1000"){
		VarBukrs = "JK";
	}else{
		VarBukrs = "CIL";
	}
	

	if(selKey1){
		this.onEnterTicket();
	}else{
		this.getTicketDetails();
		
/*
  		this.MobileWithTicket();	//Ticket Details for mobile number
				
		this.OnEnterMobileNo();
*/		
		this.FitType1();	//In case of Mobile number
	
	};
		
	this.onDealerInfo(CName);
	that.ItemType(); //for Tyre/Tube/Flap   
	that._DealerDialog.close();
	that._DealerDialog.destroy(); 
	that._DealerDialog=undefined;
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//On cancel fragment
OnFragCancel :function(){
	window.history.back();
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//fragment for onOK
MobileWithTicket : function(){

	var TicketListSetJModel = new sap.ui.model.json.JSONModel();
	this._EntriesHelpDialog = sap.ui.xmlfragment("zwcminspec.view.Ticket_DTL_Mobile",this);
	this.getView().addDependent(this._entriesHelpDialog);
	this._EntriesHelpDialog.setModel(TicketListSetJModel, "TicketListSetJModel");
	this.getTicketDetails();//Get ticket details with reference to mobile number
	this._EntriesHelpDialog.open();
},

onWithoutTicket: function(evt){
	this._EntriesHelpDialog.close();
	this._EntriesHelpDialog.destroy(true);
	
// Changed on April 18	
	this.getView().byId("LblTicketDate").setVisible(false);
	this.getView().byId("idTicketDate").setVisible(false);
	this.getView().byId("LblTicketSource").setVisible(false);
	this.getView().byId("idTicketSource").setVisible(false);
	this.getView().byId("LblProductCount").setVisible(false);
	this.getView().byId("idTyreInvolve").setVisible(false);
	this.getView().byId("LblProbable").setVisible(false);
	this.getView().byId("idCondition").setVisible(false);
//	
	this.getView().byId("idPhone1").setValue(CustMob);
	this.getView().byId("idFitment").setSelectedKey("REP");
	fitType = "REP";

},

getTicketDetails : function(){
	
	var ticket  = "";
	var mobile  = sap.ui.getCore().byId("idCustMob").getValue();
	var that = this;		
	var sPathCartListSet = "/DealerTicketSearchSet?$filter=Kunnr eq '"+Kunnr+"' and TicketNo eq'"+ticket+"' and ITelf1 eq'"+mobile+"'";
		
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) {	// success handler
				
		if(oData.results.length != 0){	
			if (!that._EntriesHelpDialog) {
				that._EntriesHelpDialog = sap.ui.xmlfragment(
					"zwcminspec.view.Ticket_DTL_Mobile", that);
				that.getView().addDependent(that._EntriesHelpDialog);								
			}
			var TicketListSetJModel = new sap.ui.model.json.JSONModel();
			that._EntriesHelpDialog.setModel(TicketListSetJModel, "TicketListSetJModel");
			TicketListSetJModel.setData(oData.results);
			that._EntriesHelpDialog.open();	
//Added on April 11			
			that.getView().byId("LblTicketDate").setVisible(true);
			that.getView().byId("idTicketDate").setVisible(true);
			that.getView().byId("LblTicketSource").setVisible(true);
			that.getView().byId("idTicketSource").setVisible(true);
			that.getView().byId("LblProductCount").setVisible(true);
			that.getView().byId("idTyreInvolve").setVisible(true);
			that.getView().byId("LblProbable").setVisible(true);
			that.getView().byId("idCondition").setVisible(true);
//
		}else{
			that.OnEnterMobileNo();
			
			that.getView().byId("LblTicketDate").setVisible(false);
			that.getView().byId("idTicketDate").setVisible(false);
			that.getView().byId("LblTicketSource").setVisible(false);
			that.getView().byId("idTicketSource").setVisible(false);
			that.getView().byId("LblProductCount").setVisible(false);
			that.getView().byId("idTyreInvolve").setVisible(false);
			that.getView().byId("LblProbable").setVisible(false);
			that.getView().byId("idCondition").setVisible(false);
			
			that.getView().byId("idFitment").setSelectedKey("REP");
			fitType = "REP";
		}
			
	};
	
	oParamsCartListSet.error = function(oError) {	// error handler
		jQuery.sap.log.error("read publishing group data failed");
		sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	};
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
	});
	
},

displayTicktRequest: function(e){

	var path = e.getSource().getBindingContext("TicketListSetJModel").getPath().split('/')[1]
	var data = e.getSource().getBindingContext("TicketListSetJModel").getModel().getData()[path];
	    Ticket = data.TicketNo;
	this.onEnterTicket();
	this.onCustomerfrgClose();
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Dealer Information
onDealerInfo : function(CName){
	
	var that=this;
	var user = new sap.ushell.services.UserInfo();
	var uid = user.getId();
	var oViewObj = this.getView();
	var DealerInfoSetJModel = oViewObj.getModel("DealerInfoSetJModel");
	if (!DealerInfoSetJModel) { 
		
		DealerInfoSetJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(DealerInfoSetJModel, "DealerInfoSetJModel");
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	
	var fncSuccess = function(oData, oResponse){
		
		DealerInfoSetJModel.setData(oData);
		DepoCode = DealerInfoSetJModel.oData.Werks;
		DlrName = DealerInfoSetJModel.oData.Name1;
		Kunnr    = DealerInfoSetJModel.oData.Kunnr;		
	
		that.getView().byId("HeaderIdTit").setTitle("Create Inspection" + "("+ DlrName +")");
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
	oReadModel.read("/GetDealerInfoSet(Uname='"+uid+"',Bukrs='"+CName+"')", {
		success : fncSuccess,
		error : fncError
	});
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//On Enter Ticket No
onEnterTicket : function(){
		
		var that = this;
		if(selKey1){
			Ticket = sap.ui.getCore().byId("idTicketNo").getValue();
		} else {
			this.getView().byId("idVbox1").setVisible(true);			
		}
		
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
		var fncSuccess = function(oData, oResponse){
//Added on April 11			
			if(oData.EError == 'X'){
				sap.m.MessageBox.show("No Ticket Data Found.", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose : function() {
						window.history.back();
					}
				});
			}
//			
			var ary = {
			"d" : oData
			} 
	        var jModel = new sap.ui.model.json.JSONModel(ary);
	        
			that.onTyreCondition(oData.VehicleType);
	        that.getView().setModel(jModel , "jModel");
	        that.data = jModel.getData();
	        state = oData.CustomerRegion;
	        debugger
	        that.FitType(that.data.d.FitType);
	        fitType = that.data.d.FitType;
	        that.getView().byId("HedClaimNo").setText("Ticket No : " + that.data.d.ITicketNo);
//Added on April 19	        
	        that.getView().byId("idTyreInvolve").setSelectedKey(oData.DefectiveTyres);
	        that.getView().byId("idFitment").setSelectedKey(oData.FitType);
	        that.getView().byId("idTicketSource").setSelectedKey(oData.TicketSource);
	        that.getView().byId("idCondition").setSelectedKey(oData.TyreCond);
	        
	        VehCat = oData.Cate;
	        VehType = oData.VehicleType;
	        
//	        
			//that.OnDisableFields();
//Changed on May 10	        
	        //that.OnDisableCustomerFields();
//	        
		}	
						
		var fncError = function(oError) { // error callback	// function
			var parser = new DOMParser();
			var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
			});
		}
		
		oReadModel.read("/GetTicketDataSet(ITicketNo='"+ Ticket + "')", {
			success : fncSuccess,
			error : fncError
		});
	
	},
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Model for Customer Details
OnEnterMobileNo : function(){
	
	var that = this;

	var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	var fncSuccess = function(oData, oResponse){
		var ary = {
		"d" : oData
		}
        var jModel = new sap.ui.model.json.JSONModel(ary);
        
        state = oData.CustomerRegion;
        that.getView().setModel(jModel , "jModel");
        that.data = jModel.getData();
        	if(that.data.d.Flag != "X"){
        	  that.OnDisableCustomerFields();
        	  
        	} 
        	//that.getView().byId("HedClaimNo").setText("Mobile No : " + CustMob);	
        	
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
	oReadModel.read("/DealerCustomerInfoSet(CustomerTelf1='"+ CustMob + "')", { 
		success : fncSuccess,
		error : fncError
	});

},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
	//Action with Radio Button on initial fragment 
	OnSelectRadioBtn : function(e){	
		
		var selItem = sap.ui.getCore().byId("RD1").getSelected()
		if(selItem){
			sap.ui.getCore().byId("idTnolbl").setVisible(true);
	    	sap.ui.getCore().byId("idTicketNo").setVisible(true);
	    	sap.ui.getCore().byId("idCustMob").setVisible(false);
	    	//sap.ui.getCore().byId("idFitment").setVisible(false);
		}else{
			sap.ui.getCore().byId("idTnolbl").setVisible(false);
	    	sap.ui.getCore().byId("idTicketNo").setVisible(false);
	    	sap.ui.getCore().byId("idCustMob").setVisible(true);
	    	//sap.ui.getCore().byId("idFitment").setVisible(true);
		}	        	
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
onFitmentChange: function(oEvent){
		fitType = this.getView().byId("idFitment").getSelectedKey();
		
		if(fitType=="OEM"){			
			this.getView().byId("idTyrChs").setVisible(true);
			this.getView().byId("idTyrKmCvrd").setVisible(true);
			this.getView().byId("idpnlOEM").setVisible(true);
			
			this.getView().byId("lblVehMak").setRequired(true);
			this.getView().byId("VehReg").setRequired(true);
			this.getView().byId("VehMdl").setRequired(true);
//Changed May 10			
			//this.getView().byId("idTyrChsLbl").setRequired(true);
//
			//this.getView().byId("PurMonth").setRequired(true);
			this.getView().byId("TyrKmCvrd").setRequired(true);
			//this.getView().byId("idTyrChsLbl").setRequired(true);
		}else if(fitType=="REP"){
			this.getView().byId("idTyrChs").setVisible(false);
			this.getView().byId("idTyrKmCvrd").setVisible(false);
			this.getView().byId("idpnlOEM").setVisible(false);
			
			this.getView().byId("lblVehMak").setRequired(false);
			this.getView().byId("VehReg").setRequired(false);
			this.getView().byId("VehMdl").setRequired(false);
//Changed on May 10
			//this.getView().byId("idTyrChsLbl").setRequired(false);
//			
			//this.getView().byId("PurMonth").setRequired(false);
			this.getView().byId("TyrKmCvrd").setRequired(false);
			//this.getView().byId("idTyrChsLbl").setRequired(true);
		}
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/		
//In Case of Ticket
FitType(evt){
		debugger
	if(evt =="OEM"){		
		this.getView().byId("idTyrChsLbl").setVisible(true);
		this.getView().byId("idTyrKmCvrd").setVisible(true);
		this.getView().byId("idpnlOEM").setVisible(true);
	}
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/		
//In Case of Mobile
FitType1 : function(){
	
		
		fitType = this.getView().byId("idFitment").getSelectedKey();
		if(fitType=="OEM"){			
						
			this.getView().byId("idTyrChsLbl").setVisible(true);
			this.getView().byId("idTyrKmCvrd").setVisible(true);
			//this.getView().byId("idVehOdo").setVisible(true);
			this.getView().byId("idpnlOEM").setVisible(true);
		}
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/		
ItemType : function(){
		
		if(ItemType == "TYRE"){
			this.getView().byId("idpnl1").setVisible(true);
		} else if(ItemType == "TUBE"){
			this.getView().byId("idpnl2").setVisible(true);
		} else if(ItemType == "FLAP"){
			this.getView().byId("idpnl3").setVisible(true);
		}
},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/		
onDecisionChange : function(){

	var Deckey = this.getView().byId("idInsDD").getSelectedKey();
	this.getView().byId("idDfctGrp").setValue("");
	this.getView().byId("idDfctCod").setValue("");
	this.getView().byId("idInsPolNo").setValue("");
	this.getView().byId("idInsAdjMod").setSelectedKey();
	
	
		if(Deckey=="A"){
			this.getView().byId("idInsAdjMod").setVisible(true).setSelectedKey();			
			this.getView().byId("idInsRegRea").setVisible(false).setSelectedKey();
			this.getView().byId("idDfctCod").setVisible(false);
			this.getView().byId("idDfctGrp").setVisible(false);
			this.getView().byId("idInsPolNo").setVisible(false);
			
		} else if(Deckey=="R"){
			this.FnGetDefectGroup(); //29-05-2019
			this.getView().byId("idInsAdjMod").setVisible(false).setSelectedKey();			
			this.getView().byId("idInsRegRea").setVisible(true).setSelectedKey();
			this.getView().byId("idDfctCod").setVisible(false);
			this.getView().byId("idInsPolNo").setVisible(false);
			this.getView().byId("idDfctGrp").setVisible(true).setValue("");	// changed-5/21/2019		
			/*if(VehCat == '01'){
				this.getView().byId("idDfctGrp").setVisible(true).setValue("ZBRNADEF");
			}else if(VehCat == '02'){
				this.getView().byId("idDfctGrp").setVisible(true).setValue("Z2WNADEF");
			}*/
		}
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/		
onAdjModChange : function(){

	this.FnGetDefectGroup(); //29-05-2019
	var Deckey = this.getView().byId("idInsDD").getSelectedKey();
	var Modkey = this.getView().byId("idInsAdjMod").getSelectedKey();
	this.getView().byId("idDfctGrp").setValue("");
	this.getView().byId("idDfctCod").setValue("");
	this.getView().byId("idInsPolNo").setValue("");
	this.getView().byId("idDfctGrp").setVisible(true).setValue("");//changed-5-21-2019
	
		/*if(Deckey=="A"){
          if(VehCat == '01'){
        	 this.getView().byId("idDfctGrp").setVisible(true).setValue("ZRTADDEF");
          }else if(VehCat == '02'){
        	  this.getView().byId("idDfctGrp").setVisible(true).setValue("Z2WADDEF");
          }
		}*/
		
		//this.getView().byId("idDfctCod").setVisible(true).setValue();
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//29-05-2019
FnGetDefectGroup : function(){
	
	var that=this;
	
	 var Deckey = this.getView().byId("idInsDD").getSelectedKey();
	 var Modkey = this.getView().byId("idInsAdjMod").getSelectedKey();
	
	var oViewObj = this.getView();
	var DefectGroupJModel = oViewObj.getModel("DefectGroupJModel");
	if (!DefectGroupJModel) { 
		
		DefectGroupJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(DefectGroupJModel, "DefectGroupJModel");
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	
	var fncSuccess = function(oData, oResponse){
		
		DefectGroupJModel.setData(oData);
		if(DefectGroupJModel.oData.results.length == "1"){
			that.getView().byId("idDfctGrp").setVisible(true).setValue(DefectGroupJModel.oData.results[0].CodeGrp)
			that.getView().byId("idDfctCod").setVisible(true);
			that.GetFunDefectCode();
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
	oReadModel.read("/DealerCodeGroupSet?$filter=Kunnr eq '"+Kunnr+"' and Type eq '"+VehType+"' " +
		"and Bukrs eq '"+VarBukrs+"' and ItemCode eq '"+item_code+"' and Disposal eq '"+Deckey+"' and AdjMode eq '"+Modkey+"'", {
		success : fncSuccess,
		error : fncError
	});
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//29-05-2019
GetFunDefectCode : function(){
	
	var defgrp = this.getView().byId("idDfctGrp").getValue();
	var oViewObj = this.getView();
	var DefectCodeJModel = oViewObj.getModel("DefectCodeJModel");
	if (!DefectCodeJModel) { 
		
		DefectCodeJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(DefectCodeJModel, "DefectCodeJModel");
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	
	var fncSuccess = function(oData, oResponse){
		
		DefectCodeJModel.setData(oData);
		if(DefectCodeJModel.oData.results.length == "1"){
			that.getView().byId("idDfctCod").setVisible(true).setValue(DefectCodeJModel.oData.results[0].Defect);
			that.GetFunPolicy();
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
	oReadModel.read("/InspDefectSet?$filter=CodeGrp eq '"+defgrp+"'", {
		success : fncSuccess,
		error : fncError
	});
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//30-05-2019
GetFunPolicy : function(){
	
	var oViewObj = this.getView();
	var CodeGroup = this.getView().byId("idDfctGrp").getValue();
	var CodeDefect = this.getView().byId("idDfctCod").getValue();
	var PrdWeek = this.getView().byId("idPrdWeek").getValue();
	var prdMonth = this.getView().byId("idPrdMonth").getSelectedKey();
	var PrdYear = this.getView().byId("idPrdYear").getValue();
	var wear = this.getView().byId("idInsWear").getValue();
	var stencil 	= this.getView().byId("idStnclNo").getValue();
	
	/*var url="/sap/opu/odata/sap/ZCS_INSPECTION_SRV/GetPolicyMasterSet?$filter=IClaimRecDepo eq '"+DepoCode+"' " +
			"and IClaimTyp eq 'SP10' and ICodeGrp eq '"+CodeGroup+"' and IDealerCode eq '"+Kunnr+"' " +
			"and IItemCode eq '"+this.itmCode+"' " +  
			"and IFitType eq '"+fitType+"' " +
			"and AwardMode eq '' " +
			"and StencilNo eq '"+stencil+"' " +
			"and IMajorDefect eq '"+CodeDefect+"' and ProdCat eq '"+prodcat+"' " +
			"and ProdMonth eq '"+prdMonth+"' and ProdYear eq '"+PrdYear+"' " +
			"and ProdWeek eq '"+PrdWeek+"' " +
			"and IWear eq '"+wear+"'";*/
			
	
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
			that.getView().byId("idInsPolNo").setVisible(true).setValue(PolicyNoJModel.oData.results[0].PolicyNo);
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
			"and IClaimTyp eq 'SP10' and ICodeGrp eq '"+CodeGroup+"' and IDealerCode eq '"+Kunnr+"' " +
			"and IItemCode eq '"+this.itmCode+"' " +  
			"and IFitType eq '"+fitType+"' " +
			"and AwardMode eq '' " +
			"and StencilNo eq '"+stencil+"' " +
			"and IMajorDefect eq '"+CodeDefect+"' and ProdCat eq '"+prodcat+"' " +
			"and ProdMonth eq '"+prdMonth+"' and ProdYear eq '"+PrdYear+"' " +
			"and ProdWeek eq '"+PrdWeek+"' " +
			"and IWear eq '"+wear+"'", {
		success : fncSuccess,
		error : fncError
	});
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Validate Number
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
},


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//validate Header Details Fields
	validaterequired: function(){
		
		var check = true;
		
		var Fname 		= this.getView().byId("idFname");
		var Address 	= this.getView().byId("idAddress");
		var State		= this.getView().byId("idState");
		var dist 		= this.getView().byId("idDist");
		var City 		= this.getView().byId("idCity");	
		
		var VehType 	= this.getView().byId("idVehTyp");
		var VehMake 	= this.getView().byId("idVehMak");
		var VehModl 	= this.getView().byId("idVehMdl");
//Added on April 10		
		var PurMonth 	= this.getView().byId("idPurMonth");
		var PurYear 	= this.getView().byId("idPurYear");
//		
		//var VehVar 		= this.getView().byId("idTyrVehVar");
		var RegNo    	= this.getView().byId("idVehReg");
		//var VehOdo    	= this.getView().byId("idVehOdo");
		var Chassi 	    = this.getView().byId("idTyrChs");
		var KMCvrd 		= this.getView().byId("idTyrKmCvrd");
		
		var FranchNm 	= this.getView().byId("idFranchName");
		//var FranchPNm 	= this.getView().byId("idFranchPName");
		//var FranchEml 	= this.getView().byId("idFranchEmail");
		//var FranchPhon 	= this.getView().byId("idFranchPhone");
		var FranchLoc 	= this.getView().byId("idFranchLoc");
		
		
		
		if(this.getView().byId("idFitment").getSelectedKey() == "")
			{
			this.getView().byId("idFitment").setValueState("Error");
				sap.m.MessageBox.alert(
						"Please select Fitment Type.", {
						 icon: sap.m.MessageBox.Icon.WARNING,
						 title: "Error"
						 }
				 );
				check = false;
			}else{
				this.getView().byId("idFitment").setValueState("None");
			}
		
		if(ItemType =="TYRE"){
		var TyrCode 	= this.getView().byId("idTyrItmCod");
		var TyrItemCode = item_code;
		var Tyremould   = this.getView().byId("idMould");
		var TyrStencil 	= this.getView().byId("idStnclNo");
		var Nsd1 		= this.getView().byId("idInsNsd1");
		var Nsd2 		= this.getView().byId("idInsNsd2");
		var Nsd3 		= this.getView().byId("idInsNsd3");	
		}
		
			
		if(ItemType =="TUBE"){
		var ItemCode 	= this.getView().byId("idTubItmCod");
		var VendCod 	= this.getView().byId("idtubVndCd");
		var MoldNo 		= this.getView().byId("idTubMouldNo");
		var PurchMonth 	= this.getView().byId("idTubMonth");
		var PurchYr 	= this.getView().byId("idTubYear");	
		var Wear        = this.getView().byId("idTubWear");
		}
		
		if(ItemType =="FLAP"){
		var ItemCode 	= this.getView().byId("idFlpItmCod");
		var VendCod 	= this.getView().byId("idFlpVndCd");
		var MoldNo 		= this.getView().byId("idFlpMouldNo");
		var PurchMonth 	= this.getView().byId("idFlpMonth");
		var PurchYr 	= this.getView().byId("idFlpYear");	
		var Wear        = this.getView().byId("idFlpWear");
		}
		
		if(Fname.getValue()==""){
			Fname.setValueState("Error");
			check = false;
		}else{
			Fname.setValueState("None");
		}
				
		if(Address.getValue()==""){
			Address.setValueState("Error");
			check = false;
		}else{
			Address.setValueState("None");
		}
	
		if(State.getValue()==""){
			State.setValueState("Error");
			check = false;
		}else{
			State.setValueState("None");
		}
	
		if(dist.getValue()==""){
			dist.setValueState("Error");
			check = false;
		}else{
			dist.setValueState("None");
		}
	
		if(City.getValue()==""){
			City.setValueState("Error");
			check = false;
		}else{
			City.setValueState("None");
		}
	
		if(VehType.getValue()==""){
			VehType.setValueState("Error");
			check = false;
		}else{
			VehType.setValueState("None");		}
		
		
		if(VehMake.getValue()=="" && fitType == 'OEM'){
			VehMake.setValueState("Error");
			check = false;
		}else{
			VehMake.setValueState("None");
		}
	
		if(VehModl.getValue() == "" && fitType == 'OEM'){
			VehModl.setValueState("Error");
			check = false;
		}else{
			VehModl.setValueState("None");
		}
			
		/*if(VehVar.getValue()==""){
			VehVar.setValueState("Error");
			check = false;
		}else{
			VehVar.setValueState("None");
		}*/		
	
		if(RegNo.getValue()=="" && fitType == 'OEM'){
			RegNo.setValueState("Error");
			check = false;
		}else{
			RegNo.setValueState("None");
		}
		
		if(fitType =="OEM"){		
			/*if(VehOdo.getValue()==""){
				VehOdo.setValueState("Error");
				check = false;
			}else{
				VehOdo.setValueState("None");
			}*/
			
			if(PurMonth.getSelectedKey()==""){
				PurMonth.setValueState("Error");
				check = false;
			}else{
				PurMonth.setValueState("None");
			}
			
			if(PurYear.getValue()==""){
				PurYear.setValueState("Error");
				check = false;
			}else{
				PurYear.setValueState("None");
			}
			
			if(KMCvrd.getValue()==""){
				KMCvrd.setValueState("Error");
				check = false;
			}else{
				KMCvrd.setValueState("None");
			}
//Changed on May 10			
			/*if(Chassi.getValue()==""){
				Chassi.setValueState("Error");
				check = false;
			}else{
				Chassi.setValueState("None");
			}*/
//			
			if(FranchNm.getValue()==""){
				FranchNm.setValueState("Error");
				check = false;
			}else{
				FranchNm.setValueState("None");
			}
			
			if(FranchLoc.getValue()==""){
				FranchLoc.setValueState("Error");
				check = false;
			}else{
				FranchLoc.setValueState("None");
			}
		}	
		
		
	if(ItemType =="TYRE"){	
		/*if(TyrItemCode.getValue()==""){
			TyrItemCode.setValueState("Error");
			check = false;
		}else{
			TyrItemCode.setValueState("None");
		}	*/	
		
		if(TyrItemCode == "" || TyrItemCode == undefined){
			TyrCode.setValueState("Error");
			check = false;
		}else{
			TyrCode.setValueState("None");
		}			
		
		if(TyrStencil.getValue()==""){
			TyrStencil.setValueState("Error");
			check = false;
		}else{
			TyrStencil.setValueState("None");
		}
		
		if(Tyremould.getValue()==""){
			Tyremould.setValueState("Error");
			check = false;
		}else{
			Tyremould.setValueState("None");
		}		
		
		if(Nsd1.getValue()==""){
			Nsd1.setValueState("Error");
			check = false;
		}else{
			Nsd1.setValueState("None");
		}
		
		if(Nsd2.getValue()==""){
			Nsd2.setValueState("Error");
			check = false;
		}else{
			Nsd2.setValueState("None");
		}
		
		if(Nsd3.getValue()==""){
			Nsd3.setValueState("Error");
			check = false;
		}else{
			Nsd3.setValueState("None");
		}		
		
	}	
	
	if(ItemType =="TUBE" || ItemType =="FLAP"){	
		if(ItemCode.getValue()==""){
			ItemCode.setValueState("Error");
			check = false;
		}else{
			ItemCode.setValueState("None");
		}		
		
		if(VendCod.getValue()==""){
			VendCod.setValueState("Error");
			check = false;
		}else{
			VendCod.setValueState("None");
		}
		
		if(MoldNo.getValue()==""){
			MoldNo.setValueState("Error");
			check = false;
		}else{
			MoldNo.setValueState("None");
		}
		
		if(PurchMonth.getSelectedKey()==""){
			PurchMonth.setValueState("Error");
			check = false;
		}else{
			PurchMonth.setValueState("None");
		}	
	
		if(PurchYr.getValue()==""){
			PurchYr.setValueState("Error");
			check = false;
		}else{
			PurchYr.setValueState("None");
		}
		
		if(Wear.getValue()==""){ 
			Wear.setValueState("Error");
			check = false;
		}else{
			Wear.setValueState("None");
		}
		
	}	
		return check;
		
	},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Base of Customer Mobile no disable customer field
	OnDisableCustomerFields : function(){
	
/*		this.getView().byId("idFname").setEnabled(false);
		this.getView().byId("idLname").setEnabled(false);
		this.getView().byId("idAddress").setEnabled(false);
		this.getView().byId("idAddress2").setEnabled(false);
		this.getView().byId("idState").setEnabled(false);
		this.getView().byId("idDist").setEnabled(false);
		this.getView().byId("idCity").setEnabled(false);
		this.getView().byId("idEmail").setEnabled(false);*/
		
		/*if (this.getView().byId("idLname").getValue()==""){
			this.getView().byId("idLname").setEnabled(true);	
		}else{
			this.getView().byId("idLname").setEnabled(false);
		}
		
		if (this.getView().byId("idEmail").getValue()==""){
			this.getView().byId("idEmail").setEnabled(true);	
		}else{
			this.getView().byId("idEmail").setEnabled(false);
		}*/
		
		
	},	
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`	
	//Base of Customer Mobile no disable customer field
/*OnDisableFields : function(){
		
		this.getView().byId("idFname").setEnabled(false);
		this.getView().byId("idLname").setEnabled(false);
		this.getView().byId("idAddress").setEnabled(false);
		this.getView().byId("idState").setEnabled(false);
		this.getView().byId("idEmail").setEnabled(false);
		
		this.getView().byId("idVehTyp").setEnabled(false);
		this.getView().byId("idVehReg").setEnabled(false);
		
		if(ItemType =="TYRE"){
		this.getView().byId("idTyrItmCod").setEnabled(false);
		this.getView().byId("idTyrItmDesc").setEnabled(false);
		this.getView().byId("idStnclNo").setEnabled(false);
		this.getView().byId("idTyrVehVar").setEnabled(false);
		
		this.getView().byId("idTyrChs").setEnabled(false);
		this.getView().byId("idTyrKmCvrd").setEnabled(false);
		}
		if(ItemType =="TUBE"){
		this.getView().byId("idTubItmCod").setEnabled(false);
		this.getView().byId("idTubItmDesc").setEnabled(false);
		this.getView().byId("idtubVndCd").setEnabled(false);
		}
		if(ItemType =="FLAP"){
		this.getView().byId("idFlpItmCod").setEnabled(false);
		this.getView().byId("idFlpItmDesc").setEnabled(false);
		this.getView().byId("idFlpVndCd").setEnabled(false);
		}
		if (this.getView().byId("idLname").getValue()==""){
			this.getView().byId("idLname").setEnabled(true);	
		}else{
			this.getView().byId("idLname").setEnabled(false);
		}
		
		if (this.getView().byId("idEmail").getValue()==""){
			this.getView().byId("idEmail").setEnabled(true);	
		}else{
			this.getView().byId("idEmail").setEnabled(false);
		}
		
		
	},	*/	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	

numPoint: function(oEvent){
	
	
	var text = oEvent.getSource().getValue();
	   var code = text.charCodeAt(text.length-1);
	      if(text.length == 1){
				    						if ( !(code > 47 && code < 58) ){ 					//point
				    							text = text.substring( 0 , text.length - 1 );
				    						}
										}
				                        if(text.length > 1){
				    						if ( !(code > 47 && code < 58) && !(code == 46) ){ 	//point
				    							text = text.substring( 0 , text.length - 1 );
				    						}
				    						if(text.charCodeAt(text.length-3)==46 ){
				    												text = text.substring( 0 , text.length - 1 );		
				    						}
				    						if(text.charCodeAt(text.length-2)==46 ){
				    								if(text.charCodeAt(text.length-1)==46)
				    											text = text.substring( 0 , text.length - 1 );	
				    						}

				    			}
	       
	       if (text >= 99.9)
	       {
	    	   text = "";
	    	   sap.m.MessageToast.show("NSD cannot be more than 99.99");
	       }
	      /* if (text < 0.1)
	       {
	    	   text = "";
	    	   sap.m.MessageToast.show("NSD cannot be less than 0.1");
	       }*/
	       oEvent.getSource().setValue(text);
	       
///////////
///////////Calculate NSD////////
//Changed on May 13		 
	        var nsd  = this.getView().byId("idInsNsd").getValue();

			var val1 = this.getView().byId("idInsNsd1").getValue();
			var val2 = this.getView().byId("idInsNsd2").getValue();
			var val3 = this.getView().byId("idInsNsd3").getValue();
			
			if(val1 != "" && (parseFloat(val1) > parseFloat(nsd)) )
	       	{ 	
	       			sap.m.MessageToast.show("NSD cannot be greater than Original NSD.");
	       			this.getView().byId("idInsNsd1").setValue("");
	       	}
	       	if(val2 != "" && (parseFloat(val2) > parseFloat(nsd)) )
	       	{ 	
	       			sap.m.MessageToast.show("NSD cannot be greater than Original NSD.");
	       			this.getView().byId("idInsNsd2").setValue("");
	       	}
	       	if(val3 != "" && (parseFloat(val3) > parseFloat(nsd)) )
	       	{ 	
	       			sap.m.MessageToast.show("NSD cannot be greater than Original NSD.");
	       			this.getView().byId("idInsNsd3").setValue("");
	       	}
       	
       	var nsd1 = this.getView().byId("idInsNsd1").getValue();
	   	var nsd2 = this.getView().byId("idInsNsd2").getValue();
	   	var nsd3 = this.getView().byId("idInsNsd3").getValue();
	   	var total = parseFloat(nsd1) + parseFloat(nsd2) + parseFloat(nsd3);
	   	var avg = total/3;
	   	var fixavg = avg.toFixed(1);
	   	
	   	var Wear = ( (nsd-fixavg)/nsd)*100 ;
	   	var PerWear = parseInt(Wear.toFixed(1));
	   	
	   	//this.getView().byId("idInsNsd").setValue(fixavg);
	   	this.getView().byId("idAvgNsd").setValue(fixavg);
	   	this.getView().byId("idInsWear").setValue(PerWear);
//	
      
	     },
//////////////////////////////////////////////////////////////////////////////////////////////////
	     ValidWear: function(oEvent){
	     		
	    		
	    		   var text = oEvent.getSource().getValue();
	    		   var code = text.charCodeAt(text.length-1);
	    		       if(text.length == 1){
	    		    	   
	    		             if ( !(code > 47 && code < 58) ) {
	    		                   text = text.substring( 0 , text.length - 1 );
	    		               }
	    		                     
	    		       }else if(text.length > 1){
	    		    	   
	    		             if ( !(code > 47 && code < 58) && !(code == 46) ){ //point
	    		                    text = text.substring( 0 , text.length - 1 );
	    		               }
	    		                                  
	    		        if(text.charCodeAt(text.length-3)==46 ){
	    		          if(text.charCodeAt(text.length-2)==46)
	    		                 text = text.substring( 0 , text.length - 1 );
	    		            if(text.charCodeAt(text.length-1)==46)
	    		               text = text.substring( 0 , text.length - 1 );
	    		                                                       
	    		             }
	    		                                         
	    		             if(text.charCodeAt(text.length-2)==46 ){
	    		               if(text.charCodeAt(text.length-1)==46)
	    		                     text = text.substring( 0 , text.length - 1 ); 
	    		                }
	    		                                  
	    		             if(text.charCodeAt(text.length-4)==46)
	    		               text = text.substring( 0 , text.length - 1 ); 
	    		             }
	    		              
	    		       if (text >= 100)
	    		       {
	    		    	   text = "";
	    		    	   sap.m.MessageBox.show("Wear cannot be more than 99.99");
	    		       }
	    		       oEvent.getSource().setValue(text);    		              
	    		              
	    		     },	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////	
	
//F4 for Disposal Decision
/*onDesposSesion:function(key){

	var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownDisposalDecisionSet?$filter=ClaimTyp eq '"+key+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var  loc= this.getView().byId("idInsDD");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{DisposalDecision}",
				text : "{DisposalDecisionText}"
			})
		});
	},*/
	
//F4 for Adjustment Mode
/*onAdjusmentMode:function(key){

      var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DropDownAdjustmentModeSet?$filter=ClaimTyp eq '"+key+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
		var  loc= this.getView().byId("idInsAdjMod");
		loc.unbindAggregation("items");
		loc.setModel(jModel);
		loc.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{AdjustmentMode}",
				text : "{AdjustmentModeTxt}"
			})
		});
	},	*/

//////////////////////////////////////////////////////////////////////////////////////////////////	    		     
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
    	    	if(ItemType == "TUBE"){     
		    	    /*this.getView().byId("idtubVndCd").setValue(oSelectedItem.getTitle()+" ("+oSelectedItem.getDescription()+")");*/
    	    		this.getView().byId("idtubVndCd").setValue(oSelectedItem.getTitle());
		    	    that.vendorcc=oSelectedItem.getTitle();
		    	    that.vendorName=oSelectedItem.getTitle();
		    	    var stencile= that.vendorcc+"-"+that.getView().byId("idTubMouldNo").getValue()+"-"+that.getView().byId("idTubMonth").getSelectedKey()+that.getView().byId("idTubYear").getValue().slice(-2);
					that.getView().byId("idTubeStnclNo").setValue(stencile);
   	    	} else {
   	    		 	//this.getView().byId("idFlpVndCd").setValue(oSelectedItem.getTitle()+" ("+oSelectedItem.getDescription()+")");
   	    		 	this.getView().byId("idFlpVndCd").setValue(oSelectedItem.getTitle());
   	    		 	that.vendorcc=oSelectedItem.getTitle();
		    	    that.vendorName=oSelectedItem.getTitle();
		    	    var stencile= that.vendorcc+"-"+that.getView().byId("idFlpMouldNo").getValue()+"-"+that.getView().byId("idFlpMonth").getSelectedKey()+that.getView().byId("idFlpYear").getValue().slice(-2);
					that.getView().byId("idFlpeStnclNo").setValue(stencile);
   	    		
   	    	}
    	   }
      
    	},
    	
 onModuleNo:function(oEvent){
	  
	   
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
	   
	   
	   
	 if(ItemType == "TUBE"){  
     var stencile= that.vendorcc+"-"+that.getView().byId("idTubMouldNo").getValue()+ "-"+that.getView().byId("idTubMonth").getSelectedKey()+that.getView().byId("idTubYear").getValue().slice(-2);
	     that.getView().byId("idTubeStnclNo").setValue(stencile);
	 } else {
		 var stencile= that.vendorcc+"-"+that.getView().byId("idFlpMouldNo").getValue()+"-"+that.getView().byId("idFlpMonth").getSelectedKey()+that.getView().byId("idFlpYear").getValue().slice(-2);
	     that.getView().byId("idFlpeStnclNo").setValue(stencile); 
	 }
  },

 onProdMonth:function(){
	 
	
	 if(ItemType == "FLAP"){ 
	 var stencile= that.vendorcc+"-"+that.getView().byId("idFlpMouldNo").getValue()+"-"+that.getView().byId("idFlpMonth").getSelectedKey()+that.getView().byId("idFlpYear").getValue().slice(-2);
         that.getView().byId("idFlpeStnclNo").setValue(stencile);
	 } else {
	var stencile= that.vendorcc+"-"+that.getView().byId("idTubMouldNo").getValue()+"-"+that.getView().byId("idTubMonth").getSelectedKey()+that.getView().byId("idTubYear").getValue().slice(-2);
	     that.getView().byId("idTubeStnclNo").setValue(stencile); 
	 } 	 
	},
	
OnChangeYear:function(oEvent){ 
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
	
	 if(ItemType == "TUBE"){  
	     var stencile= that.vendorcc+"-"+that.getView().byId("idTubMouldNo").getValue()+ "-"+that.getView().byId("idTubMonth").getSelectedKey()+that.getView().byId("idTubYear").getValue().slice(-2);
		     that.getView().byId("idTubeStnclNo").setValue(stencile);
		 } else {
			 var stencile= that.vendorcc+"-"+that.getView().byId("idFlpMouldNo").getValue()+"-"+that.getView().byId("idFlpMonth").getSelectedKey()+that.getView().byId("idFlpYear").getValue().slice(-2);
		     that.getView().byId("idFlpeStnclNo").setValue(stencile); 
		 }
},


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for Rejection Reason
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
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
OnDfctGrpHelp : function(){ //Changed - 5/21/2019 
	
	    var Deckey = this.getView().byId("idInsDD").getSelectedKey();
	    var Modkey = this.getView().byId("idInsAdjMod").getSelectedKey();
	 
		var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/DealerCodeGroupSet?$filter=Kunnr eq '"+Kunnr+"' and Type eq '"+VehType+"' " +
					"and Bukrs eq '"+VarBukrs+"' and Disposal eq '"+Deckey+"' and AdjMode eq '"+Modkey+"'  ";	

	    var jModel = new sap.ui.model.json.JSONModel(); 
		jModel.loadData(sPath, null, false, "GET", false,
				false, null);
		var _valueHelpDfctGrpSelectDialog = new sap.m.SelectDialog(
				{

					title : "Select Defect Group",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{CodeGrp}",
									description:"{CodeGrpTxt}",
									customData : [ new sap.ui.core.CustomData(
											{
												key : "Key",
												value : "{CodeGrp}"
											}) ],

								}),
					},
					liveChange : function(oEvent) {
						var sValue = oEvent
								.getParameter("value");
						var oFilter = new sap.ui.model.Filter("CodeGrp",sap.ui.model.FilterOperator.Contains, sValue);
						oEvent.getSource().getBinding("items").filter([ oFilter ]);
					},
					confirm : [ this._handlDfctGrpClose, this ],
					cancel : [ this._handlDfctGrpClose, this ]
				});
		_valueHelpDfctGrpSelectDialog.setModel(jModel);
		_valueHelpDfctGrpSelectDialog.open();
	},
	_handlDfctGrpClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			that.getView().byId("idDfctGrp").setValue(oSelectedItem.getTitle());
			that.getView().byId("idDfctCod").setVisible(true).setValue();
		}
	
},
	
onDfctCodHelp:function(evt){

		 
	    var defgrp = this.getView().byId("idDfctGrp").getValue();
		var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/InspDefectSet?$filter=CodeGrp eq '"+defgrp+"'";
		var jModel = new sap.ui.model.json.JSONModel(); 
		jModel.loadData(sPath, null, false, "GET", false,
				false, null);
		var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
				{

					title : "Select Major Defect Code",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{DefectTxt}",
									description:"{Defect}",
									customData : [ new sap.ui.core.CustomData(
											{
												key : "Defect",
												value : "{DefectTxt}"
											}) ],

								}),
					},
					liveChange : function(oEvent) {
						//29-aug-2019
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("Defect",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter1 = new sap.ui.model.Filter("DefectTxt",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
						oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
					},
					confirm : [ this._handlemajDealClose, this ],
					cancel : [ this._handlemajDealClose, this ]
				});
		_valueHelpTyreSelectDialog.setModel(jModel);
		_valueHelpTyreSelectDialog.open();
	},
	_handlemajDealClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			that.getView().byId("idDfctCod").setValue(oSelectedItem.getDescription());
			var DispoDec 	= this.getView().byId("idInsDD").getSelectedKey();
			if (ItemType =="TYRE" && DispoDec == 'A'){
			this.getView().byId("idInsPolNo").setVisible(true).setValue();
			this.GetFunPolicy(); //30-05-2019
			}else{
			this.getView().byId("idInsPolNo").setVisible(false);
			}
		}
	},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	onItemDescHelp:function(evt){
		var type  = this.getView().byId("idVehTyp").getValue(); 
		//and Type eq '"+type+"'
		var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpDealerItemCodeSet?$filter=Bukrs eq '"+CName+"' and Type eq '"+type+"' and Kunnr eq '"+Kunnr+"' and IClaimItemType eq '"+ItemType+"' and IClaimType eq 'SP10' and IRecvDepo eq '"+DepoCode+"' and WRFlag eq ''";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpTyreSelectDialog = new sap.m.SelectDialog(
				{
					title : "Select Tyre Code",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{ItemDescr}",
									description:"{ItemCode}",
									customData: [{ 
										Type:"sap.ui.core.CustomData",
										    key:"Key",
										    value:"{ItemCode}" 
										   },
										   {
									    Type:"sap.ui.core.CustomData",
										    key:"PrdDesc",
										    value:"{PrdtCatDesc}"  
									     }]	 
								}),
					},
					liveChange : function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("ItemDescr",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter2 = new sap.ui.model.Filter("ItemCode",sap.ui.model.FilterOperator.Contains,sValue);
						var oFilter1 = new sap.ui.model.Filter([oFilter, oFilter2], false);									
						oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
					},
					confirm : [ this._handleTyreJKDealClose, this ],
					cancel : [ this._handleTyreJKDealClose, this ]
				});
		_valueHelpTyreSelectDialog.setModel(jModel);
		_valueHelpTyreSelectDialog.open();

	},
	_handleTyreJKDealClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		var TyreTypeCode = sap.ui.getCore().byId(this.TyreTypeCode);
		if (oSelectedItem) {
			this.itmCode = oSelectedItem.getDescription();

//Added on May 11			
			var obj = oSelectedItem.getBindingContext().getObject();
			prodcat = obj.PrdtCat;
			this.getView().byId("idInsNsd").setValue(obj.Totnsd);
			this.getView().byId("idInsNsd1").setEnabled(true);
			this.getView().byId("idInsNsd2").setEnabled(true);
			this.getView().byId("idInsNsd3").setEnabled(true);
			this.getView().byId("idStnclNo").setEnabled(true);
//			
			if(ItemType =="TYRE"){
			 item_code = oSelectedItem.getDescription();
			 this.getView().byId("idStnclNo").setValue("");
			 this.getView().byId("idTyrItmCod").setValue(oSelectedItem.getTitle());
				//this.getView().byId("idTyrItmDesc").setValue(oSelectedItem.getTitle());	
			} else if(ItemType =="TUBE"){
				 item_code = oSelectedItem.getDescription();
				this.getView().byId("idTubItmCod").setValue(oSelectedItem.getDescription());
				this.getView().byId("idTubItmDesc").setValue(oSelectedItem.getTitle());
			} else if(ItemType =="FLAP"){
				 item_code = oSelectedItem.getDescription();
				this.getView().byId("idFlpItmCod").setValue(oSelectedItem.getDescription());
				this.getView().byId("idFlpItmDesc").setValue(oSelectedItem.getTitle());
			}
		}

	},	

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Name with space
	ValidateName : function(oEvent){ 
		
	var text = oEvent.getSource().getValue();
	var code = text.charCodeAt(text.length-1);
	  
	          if ( !(code > 64 && code < 91) && !(code > 96 && code < 123) && !(code == 32) ){ //point
	                 text = text.substring( 0 , text.length - 1 );
	            }                    
	    oEvent.getSource().setValue(text);       
	  },
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Validate Email id
	emailValidate : function(oEvent){
		
	//var email = this.getView().byId("idEmail").getValue();
	var email = oEvent.getSource().getValue();
	 var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
	 if (!mailregex.test(email)) {
		 sap.m.MessageToast.show("Invalid Email");
		 oEvent.getSource().setValue();
		 //this.getView().byId("idEmail").setValue();
	  }

	},
	
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Validate Customer name.
validateCharacter : function( oEvent ){
		var text     = oEvent.getSource().getValue();
		var reg      = /^[a-zA-Z]+$/;
		if( !text.match(reg) ){
			if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
				text = text.substring( 1 , text.length );
			}else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
				text = text.substring( 0 , text.length - 1 );
			}else{
				for( var i = 0 ; i < text.length; i++ ){
					if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
						text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
					}
				}
			}
			oEvent.getSource().setValue( text );  
		}else{
			oEvent.getSource().setValueState( "None" );
		} 
	},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
OnChkStncil: function(oEvent){
		 
	    //this.event = text;
		oEvent.getSource().setValue( oEvent.getSource().getValue().toUpperCase() );
		
		//var ItmCode = this.getView().byId("idTyrItmCod").getValue();
		var ItmCode = item_code;
		var stencilNumber = this.getView().byId("idStnclNo").getValue();
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl);
		oReadModel.setHeaders({
			"Content-Type" : "application/atom+xml" 
		});
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
		var fncSuccess = function(oData, oResponse){
			
			if (oData.Message != "") {
				that.stencilFlag = "";				
				sap.m.MessageBox.show(oData.Message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose : function() {
						//that.event.setValue("");
						that.getView().byId("idStnclNo").setValue("");
						that.getView().byId("idStnclNo").setValueState("Error");
						return false;
					}
				});
				
			}
			else{
				that.stencilFlag = "X";
				TallyFlag = oData.TallyFlag;
				ManfPlant = oData.ManfPlant;

//Changed on May 13				
				that.getView().byId("idPrdWeek").setValue(oData.PrdWeek);				
				that.getView().byId("idPrdMonth").setSelectedKey(oData.PrdMonth);	
				that.getView().byId("idPrdYear").setValue(oData.PrdYear);
				salesdt = oData.SalesDate;
//				
			}
		}
		oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+DepoCode+"',ItemCode='"+ItmCode+"',StencilNo='"+stencilNumber+"')",
				{
			success : fncSuccess,
			error : fncError
		}); 
	},	
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
onvalidatelifnr : function(evt){
		
		//this.event = evt.getSource();
		//var vendorNumber = evt.getSource().getValue();
		var VendorNo = this.getView().byId("idtubVndCd").getValue()
		var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
		var oReadModel = new sap.ui.model.odata.ODataModel(
				sServiceUrl);
		oReadModel.setHeaders({
			"Content-Type" : "application/atom+xml"
		});
		var fncError = function(oError) { // error callback
			// function
			var parser = new DOMParser();
			var message = parser.parseFromString(
			oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(message,{
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
					});
		}
		var fncSuccess = function(oData, oResponse){
			if (oData.Msg != "") {
				that.stencilFlag = "";
				sap.m.MessageBox.show(oData.Msg, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose : function() {
					//that.event.setValue("");
					that.getView().byId("idtubVndCd").setValue("");
					that.getView().byId("idtubVndCd").setValueState("Error");
					}
				});
			}
			else{
				that.stencilFlag = "X";
			}
		}
		oReadModel.read("ValidateVendorSet(Lifnr='"+VendorNo+"')",
				{
			success : fncSuccess,
			error : fncError
		});
		
	},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
//F4 For Mobile No
onMobileHelp : function() {
	
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerMobileSet";
	    var jModel = new sap.ui.model.json.JSONModel();
	        jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpMobileSelectDialog = new sap.m.SelectDialog(
				{
					title : "Select Mobile",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{ITelf1}",
									customData : [ new sap.ui.core.CustomData(
											{
												key : "ITelf1",
												value : "{ITelf1}"
											}) ],
								}),
					},
					liveChange : function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("ITelf1",sap.ui.model.FilterOperator.Contains,sValue);
						oEvent.getSource().getBinding("items").filter([ oFilter ]);
					},
					confirm : [ this._handleMobileClose, this ],
					cancel : [ this._handleMobileClose, this ]
				});
		_valueHelpMobileSelectDialog.setModel(jModel);
		_valueHelpMobileSelectDialog.open();
	},
	_handleMobileClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			
			if(sap.ui.getCore().byId("RD1").getSelected()){
				sap.ui.getCore().byId("idPhone1").setValue(oSelectedItem.getTitle()); //set Value in Ticket fragment
			} else {
				sap.ui.getCore().byId("idCustMob").setValue(oSelectedItem.getTitle());	//set Value in initial fragment
				this.getView().byId("idVbox1").setVisible(false);
			}
			
		}
	},	
		
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//F4 for Ticket No
	onTicket : function() {
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerTicketSet?$filter=Kunnr eq '"+Kunnr+"'";
	    var jModel = new sap.ui.model.json.JSONModel();
	        jModel.loadData(sPath, null, false,"GET",false, false, null);
		var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
				{
					title : "Select Ticket",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{TicketNo}",
									customData : [ new sap.ui.core.CustomData(
											{
												key : "Key",
												value : "{TicketNo}"
											}) ],
								}),
					},
					liveChange : function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,sValue);
						oEvent.getSource().getBinding("items").filter([ oFilter ]);
					},
					confirm : [ this._handleTicketClose, this ],
					cancel : [ this._handleTicketClose, this ]
				});
		_valueHelpTicketSelectDialog.setModel(jModel);
		_valueHelpTicketSelectDialog.open();
	},
	_handleTicketClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			
			
			sap.ui.getCore().byId("idTicketNo").setValue(oSelectedItem.getTitle()); //set Value in initial fragment
			
		}
	},	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for Vehicle Type
onVehicleType : function(){
	
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehTypeDealerSet?$filter=DealerCode eq '"+Kunnr+"' and WRFlag eq ''";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpVehTypeDialog = new sap.m.SelectDialog({

		title: "Vehicle Type",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{Type}",
				customData: [new sap.ui.core.CustomData({
					key: "Type",
					value: "{Type}"
				})]

			})
		},
		liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("Type");
			var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleVehTypeClose, this],
		cancel: [this._handleVehTypeClose, this]
	});
	_valueHelpVehTypeDialog.setModel(jModel);
	_valueHelpVehTypeDialog.open();
},

_handleVehTypeClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.getView().byId("idVehTyp").setValue(oSelectedItem.getTitle());
		this.getView().byId("idVehMak").setValue("").setEnabled(true);
		this.getView().byId("idVehMdl").setValue("");	
		this.getView().byId("idTyrItmCod").setValue("");	
		this.getView().byId("idTubItmCod").setValue("");	
		this.getView().byId("idTubItmDesc").setValue("");		
		this.getView().byId("idFlpItmCod").setValue("");	
		this.getView().byId("idFlpItmDesc").setValue("");
		this.getView().byId("idStnclNo").setValue("");
		this.getView().byId("idStnclNo").setEnabled(false);
		this.getView().byId("idStnclNo").setValueState("None");
		
		var obj=oSelectedItem.getBindingContext().getObject();
		VehCat = obj.Cate;
		VehType = obj.Type;
		
        if(this.getView().byId("idVehMdl").getValue()==""){
        	this.getView().byId("idVehMdl").setValue().setEnabled(false);
        }
	}
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for Vechicle Make
onVehicleMake: function() {
	
		var VehVal = this.getView().byId("idVehTyp").getValue();
		if(VehVal == ""){
			sap.m.MessageBox.show("Please Select Vehicle Type.", {
				title: "ERROR",
	            icon:sap.m.MessageBox.Icon.ERROR,
		        onClose:function(){
		        }
			});
			this.getView().byId("idVehTyp").setValueState("Error");
			return;
		} else { 
			this.getView().byId("idVehTyp").setValueState("None");
		}
			
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '" + VehVal + "'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueMakeHelpSelectDialog = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Make",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Make}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Make}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Make",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechMakeClose, this],
	        cancel : [this._handleVechMakeClose, this]
	    });
	    _valueMakeHelpSelectDialog.setModel(jModel);
	    _valueMakeHelpSelectDialog.open();
	},
	
	_handleVechMakeClose: function(oEvent) {
		
	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	        this.getView().byId("idVehMak").setValue(oSelectedItem.getTitle());
	        this.getView().byId("idVehMdl").setValue().setEnabled(true);
	    } 	    
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for Vehicle Model
onVehicleModel: function() {
	
		var VehMake = this.getView().byId("idVehMak").getValue();
		var vehtype = this.getView().byId("idVehTyp").getValue();
		
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '" + vehtype + "' and Make eq '" + VehMake + "'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueModelHelpSelectDialog = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Model",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Model}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Model}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Model",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechModelClose, this],
	        cancel : [this._handleVechModelClose, this]
	    });
	    _valueModelHelpSelectDialog.setModel(jModel);
	    _valueModelHelpSelectDialog.open();
	},
	
	_handleVechModelClose: function(oEvent) {
		
	    var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	        this.getView().byId("idVehMdl").setValue(oSelectedItem.getTitle());
	    }      
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

onVehicleVariant : function(){
	
	var check = true; 
	var Vehtype = this.getView().byId("idVehTyp").getValue();
	var Vehmake = this.getView().byId("idVehMak").getValue();
	var Vehmodel = this.getView().byId("idVehMdl").getValue();
	
	if(Vehtype == ""){
		this.getView().byId("idVehTyp").setValueState("Error");
		check = false;
	}else{
		this.getView().byId("idVehTyp").setValueState("None");
	}
	
	if(Vehmake == ""){
		this.getView().byId("idVehMak").setValueState("Error");
		check = false;
	}else{
		this.getView().byId("idVehMak").setValueState("None");
	}
	
	if(Vehmodel == ""){
		this.getView().byId("idVehMdl").setValueState("Error");
		check = false;
	}else{
		this.getView().byId("idVehMdl").setValueState("None");
	}
	if(check == false){	
	return false;
	}  
	
		var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '" + Vehtype + "' and Make eq '" + Vehmake + "' and Model eq '" + Vehmodel + "'";
	 	var jModel = new sap.ui.model.json.JSONModel();
	 	jModel.loadData(sPath, null, false,"GET",false, false, null);
	    var _valueTyreVariantHelpSelectDialog2 = new sap.m.SelectDialog({
	    	
	        title: "Vehicle Variant",
	        items: {
	            path: "/d/results",
	            template: new sap.m.StandardListItem({
	                title: "{Variant}",
	                customData: [new sap.ui.core.CustomData({
	                    key  : "{Variant}",
	                    value: "{Type}"
	                })],    	               
	            }),
	        },
	        liveChange: function(oEvent) {
	            var sValue  = oEvent.getParameter("value");
	            var oFilter = new sap.ui.model.Filter("Variant",sap.ui.model.FilterOperator.Contains,sValue);
	            oEvent.getSource().getBinding("items").filter([oFilter]);
	        },
	        confirm: [this._handleVechTyreVariantClose2, this],
	        cancel : [this._handleVechTyreVariantClose2, this]
	    });
	    _valueTyreVariantHelpSelectDialog2.setModel(jModel);
	    _valueTyreVariantHelpSelectDialog2.open();
	},
	
	_handleVechTyreVariantClose2: function(oEvent) {
		
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			//this.varpath.setValue(oSelectedItem.getTitle());
			this.getView().byId("idTyrVehVar").setValue(oSelectedItem.getTitle());
		
		}
	
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for State
onStateHelp: function() {
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpSelectDialog = new sap.m.SelectDialog({

		title: "State",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{Region}",
				description: "{RegionCode}",
				customData: [new sap.ui.core.CustomData({
					key: "Key",
					value: "{RegionCode}"
				})]

			})
		},
		liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleClose, this],
		cancel: [this._handleClose, this]
	});
	_valueHelpSelectDialog.setModel(jModel);
	_valueHelpSelectDialog.open();
},

_handleClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idState").setValue(oSelectedItem.getTitle());
		state = oSelectedItem.getDescription();
		//this.getView().byId("idCustStateCode").setValue(oSelectedItem.getDescription());
		this.getView().byId("idDist").setEnabled(true).setValue()
		this.getView().byId("idCity").setEnabled(false).setValue();
		
	}
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for District
onDistrictHelp: function() {
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State + "'";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	var _valueHelpDistrictDialog = new sap.m.SelectDialog({

		title: "District",
		items: {
			path: "/d/results",
			template: new sap.m.StandardListItem({
				title: "{District}",
				customData: [new sap.ui.core.CustomData({
					key: "Key",
					value: "{District}"
				})]

			})
		},
		liveChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		confirm: [this._handleDistrictClose, this],
		cancel: [this._handleDistrictClose, this]
	});
	_valueHelpDistrictDialog.setModel(jModel);
	_valueHelpDistrictDialog.open();
},

_handleDistrictClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		//this.catid1 = oSelectedItem.getBindingContext().getProperty("Category1");
		this.District = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
		this.getView().byId("idDist").setValue(oSelectedItem.getTitle());
		this.getView().byId("idCity").setEnabled(true).setValue();
	}

},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for Claim No
onClaim : function() {
		
		//var flag = 'S';	
	    var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/F4DealerClaimSet?$filter=Kunnr eq '" + Kunnr + "'";
		var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _ValueHelpClaimSelectDialog = new sap.m.SelectDialog({
				title : "Select Claim Type",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
						title : "{IClaimNo}",
						customData : [new sap.ui.core.CustomData({
							key : "d:Kunnr",
							value : "{IClaimNo}"
						})],
					}),
				},
				liveChange : function(oEvent){
					var sValue   = oEvent.getParameter("value");
					var oFilter  = new sap.ui.model.Filter("IClaimNo",sap.ui.model.FilterOperator.Contains, sValue);
				    var oFilter2 = new sap.ui.model.Filter("Descr",sap.ui.model.FilterOperator.Contains,sValue);
				    var oFilter1 = new sap.ui.model.Filter([oFilter, oFilter2], false);									
				    oEvent.getSource().getBinding("items").filter([oFilter1]);
				},
				confirm : [this._handleClaimCloase,this],
				cancel : [this._handleClaimCloase,this]	
		});	
		_ValueHelpClaimSelectDialog.setModel(jModel);
		_ValueHelpClaimSelectDialog.open();
},
_handleClaimCloase : function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
			if(oSelectedItem){
				sap.ui.getCore().byId("idClaimNo").setValue(oSelectedItem.getTitle());
			}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
OnPolicyHelp:function(){
		
		var CodeGroup = this.getView().byId("idDfctGrp").getValue();
		var CodeDefect = this.getView().byId("idDfctCod").getValue();
		var PrdWeek = this.getView().byId("idPrdWeek").getValue();
		var prdMonth = this.getView().byId("idPrdMonth").getSelectedKey();
		var PrdYear = this.getView().byId("idPrdYear").getValue();
		var wear = this.getView().byId("idInsWear").getValue();
		var stencil 	= this.getView().byId("idStnclNo").getValue();
		
		var url="/sap/opu/odata/sap/ZCS_INSPECTION_SRV/GetPolicyMasterSet?$filter=IClaimRecDepo eq '"+DepoCode+"' " +
				"and IClaimTyp eq 'SP10' and ICodeGrp eq '"+CodeGroup+"' and IDealerCode eq '"+Kunnr+"' " +
				"and IItemCode eq '"+this.itmCode+"' " +  
				"and IFitType eq '"+fitType+"' " +
				"and AwardMode eq '' " +
				"and StencilNo eq '"+stencil+"' " +
				"and IMajorDefect eq '"+CodeDefect+"' and ProdCat eq '"+prodcat+"' " +
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
	         title: "Policy No: {PolicyNo}",
	        description:"Document: {PolicyDocument}",
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
_handlepolClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var obj = oSelectedItem.getBindingContext().getObject();
	if (oSelectedItem) {
		this.getView().byId("idInsPolNo").setValue(oSelectedItem.getBindingContext().getObject().PolicyNo);
	    //this.getView().byId("idInsPlcDis").setValue(oSelectedItem.getBindingContext().getObject().Discount);
	}
	 Discount = obj.Discount;
	 ConstPro = obj.ConstPro;  
},
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ValidateField : function(){
	
	var check = true;
	
	var Disposal	= this.getView().byId("idInsDD");
	var AdjMode		= this.getView().byId("idInsAdjMod");
	var RejRes		= this.getView().byId("idInsRegRea");
	var DefectGrp 	= this.getView().byId("idDfctGrp");
	var DefectCod 	= this.getView().byId("idDfctCod");
	var PolicyNo 	= this.getView().byId("idInsPolNo");
	var Remrks 		= this.getView().byId("idRemrks");

//Added on May 10	
	var Nsd1 		= this.getView().byId("idInsNsd1");
	var Nsd2 		= this.getView().byId("idInsNsd2");
	var Nsd3 		= this.getView().byId("idInsNsd3");
	var Nsd 		= this.getView().byId("idInsNsd");
	
    if(ItemType == 'TYRE'){
			if(Nsd1.getValue() == "")
				{
				Nsd1.setValueState("Error");
				check = false;
				}
			else
				Nsd1.setValueState("None");
			
			if(Nsd2.getValue() == "")
				{
				Nsd2.setValueState("Error");
				check = false;
				}
			else
				Nsd2.setValueState("None");
			
			if(Nsd3.getValue() == "")
				{
				Nsd3.setValueState("Error");
				check = false;
				}
			else
				Nsd3.setValueState("None");
    }
		
//	
	
	if(Disposal.getSelectedKey()==""){
		Disposal.setValueState("Error");
		check = false;
	}else{
		Disposal.setValueState("None");
	}	
	
	if(Disposal.getSelectedKey() =="R" && RejRes.getSelectedKey()==""){
			RejRes.setValueState("Error");
			check = false;
	}else{
			RejRes.setValueState("None");
	}

	if(Disposal.getSelectedKey() =="A" && AdjMode.getSelectedKey()==""){
		AdjMode.setValueState("Error");
		check = false;
	}else{
		AdjMode.setValueState("None");
	}
	
	if(DefectGrp.getValue()==""){
		DefectGrp.setValueState("Error");
		check = false;
	}else{
		DefectGrp.setValueState("None");
	}	

	if(DefectCod.getValue()==""){
		DefectCod.setValueState("Error");
		check = false;
	}else{
		DefectCod.setValueState("None");
	}	

	
/*	if(Remrks.getValue()==""){
		Remrks.setValueState("Error");
		check = false;
	}else{
		Remrks.setValueState("None");
	}*/
	
	return check;	
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onTabSelected :function(oEvent){
		
		var filter = oEvent.getParameters().key;
		var tabBar = this.getView().byId("idIconTabBar");
		
		if(ItemType == 'TUBE'){		
			var PrdMonth	= this.getView().byId("idTubMonth").getSelectedKey();
			var PrdYear 	= this.getView().byId("idTubYear").getSelectedKey();
			var Wear    = this.getView().byId("idTubWear").getValue();  
			}
		else if(ItemType == 'FLAP'){	
			var PrdMonth	= this.getView().byId("idFlpMonth").getSelectedKey();
			var PrdYear 	= this.getView().byId("idFlpYear").getValue();
			var Wear    = this.getView().byId("idFlpWear").getValue(); 
			}
	
		var PurMonth	= this.getView().byId("idPurMonth").getSelectedKey();
		var PurYear 	= this.getView().byId("idPurYear").getValue();
		
		var validaterequired = this.validaterequired();
		if(!validaterequired){
			sap.m.MessageBox.alert(
					"Please fill all Required Fields.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Error"
					 }
			 );
			tabBar.setSelectedKey("KeyClmDtl");
			return false;
		}
		

//Added on May 13		
		
		var dt = new Date();
		var mo = dt.getMonth()+1;
		var yr = dt.getFullYear();
		
		if(PurYear == yr && PurMonth > mo){ 
		sap.m.MessageToast.show("Purchase month cannot be greater than current month");				 
		this.getView().byId("idPurMonth").setValueState("Error");
		tabBar.setSelectedKey("KeyClmDtl");
		return false;
		}
		else {
			this.getView().byId("idPurMonth").setValueState("None");
		}		
		
		
		if(ItemType == 'TUBE'){
		if(PrdYear == yr && PrdMonth > mo){ 
			sap.m.MessageToast.show("Production month cannot be greater than current month");				 
			this.getView().byId("idTubMonth").setValueState("Error");
			tabBar.setSelectedKey("KeyClmDtl");
			return false;
			}
			else {
				this.getView().byId("idTubMonth").setValueState("None");
			}	
		}
		
		if(ItemType == 'FLAP'){
			if(PrdYear == yr && PrdMonth > mo){ 
				sap.m.MessageToast.show("Production month cannot be greater than current month");				 
				this.getView().byId("idFlpMonth").setValueState("Error");
				tabBar.setSelectedKey("KeyClmDtl");
				return false;
				}
				else {
					this.getView().byId("idFlpMonth").setValueState("None");
				}	
			}
		
		
		if(ItemType != 'TYRE'){			
			if(parseFloat(Wear) > 100){
				sap.m.MessageBox.show("Wear cannot be greater that 100%.", {
					title: "ERROR",
					icon:sap.m.MessageBox.Icon.ERROR,
					});	
				tabBar.setSelectedKey("KeyClmDtl");			    
				return false;			
			}
		}
//		
		

	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	
			
//////////////////////////////////////////////////////////////////////////////////////////////////	
		
	onInspCreate : function(){
		debugger
		
		Discount = Discount;
		ConstPro = ConstPro;
		var TicketNo    = Ticket;
		var CustPhone 	= this.getView().byId("idPhone1").getValue();
		var CustFname 	= this.getView().byId("idFname").getValue();
		var CustLname 	= this.getView().byId("idLname").getValue();
		var CustAdd 	= this.getView().byId("idAddress").getValue();
		var CustAdd2 	= this.getView().byId("idAddress2").getValue();
		var CustState 	= this.getView().byId("idState").getValue();
		var CustDist 	= this.getView().byId("idDist").getValue();
		var CustCity 	= this.getView().byId("idCity").getValue();
		var CustEmail 	= this.getView().byId("idEmail").getValue();
		
		var VehType 	= this.getView().byId("idVehTyp").getValue();
		var VehMake 	= this.getView().byId("idVehMak").getValue();
		var VehModel 	= this.getView().byId("idVehMdl").getValue();
		var RegNo	 	= this.getView().byId("idVehReg").getValue();
		var TyrChsNo 	= this.getView().byId("idTyrChs").getValue();
		var TyrKMCov 	= this.getView().byId("idTyrKmCvrd").getValue();
		var PurMonth	= this.getView().byId("idPurMonth").getSelectedKey();
		var PurYear		= this.getView().byId("idPurYear").getValue();
		
		if(fitType == "OEM"){
		//var Odomtr	 	= this.getView().byId("idVehOdo").getValue();
		var TyrChsNo 	= this.getView().byId("idTyrChs").getValue();
		var FranchNm 	= this.getView().byId("idFranchName").getValue();
		var FranchPNm 	= this.getView().byId("idFranchPName").getValue();
		var FranchEml 	= this.getView().byId("idFranchEmail").getValue();
		var FranchPhon 	= this.getView().byId("idFranchPhone").getValue();
		var FranchLoc 	= this.getView().byId("idFranchLoc").getValue();
		}

		if(ItemType == 'TYRE'){	
		//var ItmCode 	= this.getView().byId("idTyrItmCod").getValue();
		var ItmCode     = item_code;
		var MouldNo	 	= this.getView().byId("idMould").getValue();		
		var StnclNo 	= this.getView().byId("idStnclNo").getValue();
		var Nsd1 		= this.getView().byId("idInsNsd1").getValue();
		var Nsd2 		= this.getView().byId("idInsNsd2").getValue();
		var Nsd3 		= this.getView().byId("idInsNsd3").getValue();
		var Nsd 		= this.getView().byId("idInsNsd").getValue();
		var AvgNsd 		= this.getView().byId("idAvgNsd").getValue();
		var Wear 		= this.getView().byId("idInsWear").getValue();
//Added on April 11		
		var Week 		= this.getView().byId("idPrdWeek").getValue();
		var Month 		= this.getView().byId("idPrdMonth").getSelectedKey();
		var Year		= this.getView().byId("idPrdYear").getValue();
//
		}		
		else if(ItemType == 'TUBE'){		
		var ItmCode = this.getView().byId("idTubItmCod").getValue();
		var VenCode	= this.getView().byId("idtubVndCd").getValue();
		var MouldNo = this.getView().byId("idTubMouldNo").getValue();
		var Month	= this.getView().byId("idTubMonth").getSelectedKey();
		var Year 	= this.getView().byId("idTubYear").getValue();
		var StnclNo = this.getView().byId("idTubeStnclNo").getValue();
		var Wear    = this.getView().byId("idTubWear").getValue();
		}
		else if(ItemType == 'FLAP'){	
		var ItmCode = this.getView().byId("idFlpItmCod").getValue();
		var VenCode = this.getView().byId("idFlpVndCd").getValue();
		var MouldNo = this.getView().byId("idFlpMouldNo").getValue();
		var Month	= this.getView().byId("idFlpMonth").getSelectedKey();
		var Year 	= this.getView().byId("idFlpYear").getValue();
		var StnclNo = this.getView().byId("idFlpeStnclNo").getValue();
		var Wear    = this.getView().byId("idFlpWear").getValue();
		}	
		
		var DispoDec 	= this.getView().byId("idInsDD").getSelectedKey();
		var AdjMode 	= this.getView().byId("idInsAdjMod").getSelectedKey();
		var RejRes		= this.getView().byId("idInsRegRea").getSelectedKey();
		var DefectGrp 	= this.getView().byId("idDfctGrp").getValue();
		var DefectCod 	= this.getView().byId("idDfctCod").getValue();
		var PolicyNo 	= this.getView().byId("idInsPolNo").getValue();
		var Remrks 		= this.getView().byId("idRemrks").getValue();		
				
		var tabBar = this.getView().byId("idIconTabBar");
		
	
		if(ItemType == 'TUBE'){		
			var PrdMonth	= this.getView().byId("idTubMonth").getSelectedKey();
			var PrdYear 	= this.getView().byId("idTubYear").getValue();
			var Wear    = this.getView().byId("idTubWear").getValue();  
			}
		else if(ItemType == 'FLAP'){	
			var PrdMonth	= this.getView().byId("idFlpMonth").getSelectedKey();
			var PrdYear 	= this.getView().byId("idFlpYear").getValue();
			var Wear    = this.getView().byId("idFlpWear").getValue(); 
			}
	
		var PurMonth	= this.getView().byId("idPurMonth").getSelectedKey();
		var PurYear 	= this.getView().byId("idPurYear").getValue();

		
		
		var validaterequired = this.validaterequired();
		if(validaterequired == false){
			sap.m.MessageBox.alert(
					"Please fill all Required Fields.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Error"
					 }
			 );
			tabBar.setSelectedKey("KeyClmDtl");
			return false;
		}
		
//Added on May 13		
		
		var dt = new Date();
		var mo = dt.getMonth()+1;
		var yr = dt.getFullYear();
		
		if(PurYear == yr && PurMonth > mo){ 
		sap.m.MessageToast.show("Purchase month cannot be greater than current month");				 
		this.getView().byId("idPurMonth").setValueState("Error");
		tabBar.setSelectedKey("KeyClmDtl");
		return false;
		}
		else {
			this.getView().byId("idPurMonth").setValueState("None");
		}		
		
		
		if(ItemType == 'TUBE'){
		if(PrdYear == yr && PrdMonth > mo){ 
			sap.m.MessageToast.show("Production month cannot be greater than current month");				 
			this.getView().byId("idTubMonth").setValueState("Error");
			tabBar.setSelectedKey("KeyClmDtl");
			return false;
			}
			else {
				this.getView().byId("idTubMonth").setValueState("None");
			}	
		}
		
		if(ItemType == 'FLAP'){
			if(PrdYear == yr && PrdMonth > mo){ 
				sap.m.MessageToast.show("Production month cannot be greater than current month");				 
				this.getView().byId("idFlpMonth").setValueState("Error");
				tabBar.setSelectedKey("KeyClmDtl");
				return false;
				}
				else {
					this.getView().byId("idFlpMonth").setValueState("None");
				}	
			}
		
		
		if(ItemType != 'TYRE'){			
			if(parseFloat(Wear) > 100){
				sap.m.MessageBox.show("Wear cannot be greater that 100%.", {
					title: "ERROR",
					icon:sap.m.MessageBox.Icon.ERROR,
					});	
				tabBar.setSelectedKey("KeyClmDtl");			    
				return false;			
			}
		}
//				
		
		var ValidateField = this.ValidateField();
		if(!ValidateField){
			sap.m.MessageBox.alert(
					"Please fill all Required Fields.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Error"
					 }
			 );
			tabBar.setSelectedKey("KeyInspFind");
			return false;
		}
		
		
		var Disposal	= this.getView().byId("idInsDD");
		var PolicyNo 	= this.getView().byId("idInsPolNo");
		
		if(Disposal.getSelectedKey() =="A" && PolicyNo.getValue()=="" && ItemType == 'TYRE'){
			sap.m.MessageBox.alert(
					"Claim cannot be processed without valid claim policy", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Error"
					 }
			 );
			PolicyNo.setValueState("Error");
			tabBar.setSelectedKey("KeyInspFind");
			return false;
		}else{
			PolicyNo.setValueState("None");
		}

		
/*//		
		var val1 = this.getView().byId("idInsNsd1").getValue();
		var val2 = this.getView().byId("idInsNsd2").getValue();
		var val3 = this.getView().byId("idInsNsd3").getValue();
		
		if ( val1 < 0 || val1 == "" || val1 == undefined )
	       {
			 this.getView().byId("idInsNsd1").setValueState("Error");
	    	 sap.m.MessageToast.show("NSD cannot be less than 0");
	    	   return false
	       }else
	    	   this.getView().byId("idInsNsd1").setValueState("None");
		
		if (val2 < 0 || val2 == "" || val2 == undefined )
	       {
			 this.getView().byId("idInsNsd2").setValueState("Error");
	    	 sap.m.MessageToast.show("NSD cannot be less than 0");
	    	   return false
	       }else
	    	   this.getView().byId("idInsNsd2").setValueState("None");
		
		if (val3 < 0 || val3 == "" || val3 == undefined )
	       {
			 this.getView().byId("idInsNsd3").setValueState("Error");
	    	 sap.m.MessageToast.show("NSD cannot be less than 0");
	    	   return false
	       }else
	    	   this.getView().byId("idInsNsd3").setValueState("None");
//		
*/		 
		
//Added on May 13		
	/*	var data = this.getView().getModel("attachmentModel").getData();		
		if(data.length==0){

				sap.m.MessageBox.alert(
						"Please attach photographs of claim product!", {
						 icon: sap.m.MessageBox.Icon.WARNING,
						 title: "Error"
						 }
				 );
				tabBar.setSelectedKey("DocumentKey");
				return false;
			}*/
		
		that.onSave();
			
			
/*		
			var dialog = new sap.m.Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new sap.m.Text({ text: 'Are you sure you want to continue without photo?' }),
				beginButton: new sap.m.Button({
					text: 'Yes',
					press: function () {
						that.onSave();
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'No',
					press: function () {
						dialog.close();
						return false
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}else{
			that.onSave();
		}*/	
//	
	},

	onSave: function(){	
		Discount = Discount;
		ConstPro = ConstPro;
		var TicketNo    = Ticket;
		var CustPhone 	= this.getView().byId("idPhone1").getValue();
		var CustFname 	= this.getView().byId("idFname").getValue();
		var CustLname 	= this.getView().byId("idLname").getValue();
		var CustAdd 	= this.getView().byId("idAddress").getValue();
		var CustAdd2 	= this.getView().byId("idAddress2").getValue();
		var CustState 	= this.getView().byId("idState").getValue();
		var CustDist 	= this.getView().byId("idDist").getValue();
		var CustCity 	= this.getView().byId("idCity").getValue();
		var CustEmail 	= this.getView().byId("idEmail").getValue();
		
		var VehType 	= this.getView().byId("idVehTyp").getValue();
		var VehMake 	= this.getView().byId("idVehMak").getValue();
		var VehModel 	= this.getView().byId("idVehMdl").getValue();
		var RegNo	 	= this.getView().byId("idVehReg").getValue();
		var TyrChsNo 	= this.getView().byId("idTyrChs").getValue();
		var TyrKMCov 	= this.getView().byId("idTyrKmCvrd").getValue();
		var PurMonth	= this.getView().byId("idPurMonth").getSelectedKey();
		var PurYear		= this.getView().byId("idPurYear").getValue();
		
		if(fitType == "OEM"){
		//var Odomtr	 	= this.getView().byId("idVehOdo").getValue();
		var TyrChsNo 	= this.getView().byId("idTyrChs").getValue();
		var FranchNm 	= this.getView().byId("idFranchName").getValue();
		var FranchPNm 	= this.getView().byId("idFranchPName").getValue();
		var FranchEml 	= this.getView().byId("idFranchEmail").getValue();
		var FranchPhon 	= this.getView().byId("idFranchPhone").getValue();
		var FranchLoc 	= this.getView().byId("idFranchLoc").getValue();
		}

		if(ItemType == 'TYRE'){
		//var ItmCode 	= this.getView().byId("idTyrItmCod").getValue();
		var ItmCode     = item_code;
		var MouldNo	 	= this.getView().byId("idMould").getValue();		
		var StnclNo 	= this.getView().byId("idStnclNo").getValue();
		var Nsd1 		= this.getView().byId("idInsNsd1").getValue();
		var Nsd2 		= this.getView().byId("idInsNsd2").getValue();
		var Nsd3 		= this.getView().byId("idInsNsd3").getValue();
		var Nsd 		= this.getView().byId("idInsNsd").getValue();
		var AvgNsd 		= this.getView().byId("idAvgNsd").getValue();
		var Wear 		= this.getView().byId("idInsWear").getValue();
//Added on April 11		
		var Week 		= this.getView().byId("idPrdWeek").getValue();
		var Month 		= this.getView().byId("idPrdMonth").getSelectedKey();
		var Year		= this.getView().byId("idPrdYear").getValue();
//
		}		
		else if(ItemType == 'TUBE'){		
		var ItmCode = this.getView().byId("idTubItmCod").getValue();
		var VenCode	= this.getView().byId("idtubVndCd").getValue();
		var MouldNo = this.getView().byId("idTubMouldNo").getValue();
		var Month	= this.getView().byId("idTubMonth").getSelectedKey();
		var Year 	= this.getView().byId("idTubYear").getValue();
		var StnclNo = this.getView().byId("idTubeStnclNo").getValue();
		var Wear    = this.getView().byId("idTubWear").getValue();
		}
		else if(ItemType == 'FLAP'){	
		var ItmCode = this.getView().byId("idFlpItmCod").getValue();
		var VenCode = this.getView().byId("idFlpVndCd").getValue();
		var MouldNo = this.getView().byId("idFlpMouldNo").getValue();
		var Month	= this.getView().byId("idFlpMonth").getSelectedKey();
		var Year 	= this.getView().byId("idFlpYear").getValue();
		var StnclNo = this.getView().byId("idFlpeStnclNo").getValue();
		var Wear    = this.getView().byId("idFlpWear").getValue();
		}	
		
		var DispoDec 	= this.getView().byId("idInsDD").getSelectedKey();
		var AdjMode 	= this.getView().byId("idInsAdjMod").getSelectedKey();
		var RejRes		= this.getView().byId("idInsRegRea").getSelectedKey();
		var DefectGrp 	= this.getView().byId("idDfctGrp").getValue();
		var DefectCod 	= this.getView().byId("idDfctCod").getValue();
		var PolicyNo 	= this.getView().byId("idInsPolNo").getValue();
		var Remrks 		= this.getView().byId("idRemrks").getValue();		
				
		var tabBar = this.getView().byId("idIconTabBar");
				
		debugger
		var Data={};
		Data.Discount 		= Discount;
		Data.ConstPro = ConstPro;
		Data.Owner 			= "02"
		Data.FitType 		= fitType;
		Data.ISpot          = 'X';
		Data.ItemType	    = ItemType; 
		Data.ClaimRecDepo   = DepoCode;
		Data.CustomerLand1  ="IN";
		Data.ClaimTyp 		= "SP10";
		Data.CustType 		= "01";
		//Data.NoDefective	= "";
		Data.SubmNo 		= "1"
		Data.TlyFlg 		= TallyFlag;	
		Data.ManfPlnt       = ManfPlant;
		
		Data.TicketNo       = Ticket;
		Data.Bukrs          = CName;
		
		Data.CustomerTelf1	= CustPhone;
		Data.CustomerFname  = CustFname;
		Data.CustomerLname  = CustLname;
		Data.CustomerAddr1  = CustAdd;
		Data.CustomerAddr2  = CustAdd2;
		Data.CustomerRegion = state;
		Data.CustomerCity2  = CustDist;
		Data.CustomerCity1  = CustCity;
		Data.CustomerEmail  = CustEmail;
		
		if(TyrKMCov == ""){
			TyrKMCov = "0.00";
		}
		
		Data.VehType  		= VehType;
		Data.VehMake		= VehMake;
		Data.VehModel 		= VehModel;
		Data.RegNo 			= RegNo;
		//Data.VehVariant 	= TyrVehVar;
		Data.ChassisNo  	= TyrChsNo;
		Data.KmCovered  	= TyrKMCov;
		Data.DealerCode		= Kunnr;
		//Data.odo			= Odomtr
		Data.FranhiseName   = FranchNm;
		Data.FranhisePName  = FranchPNm;
		Data.FranhiseEmail  = FranchEml;
		Data.FranhiseContact = FranchPhon;
		Data.FranhiseLoc  	= FranchLoc;
//Added on April 10		
		Data.VechPurcMonth	= PurMonth;
		Data.VechPurcYear	= PurYear;
//		
		if(Nsd1 == undefined){
			Nsd1 = "0.00";
		}
		
		if(Nsd2 == undefined){
			Nsd2 = "0.00";
		}
		
		if(Nsd3 == undefined){
			Nsd3 = "0.00";
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
		
		Data.ItemCode 		= ItmCode;
		Data.StnclNumber 	= StnclNo;
		Data.Nsd1			= Nsd1;
		Data.Nsd2			= Nsd2;
		Data.Nsd3			= Nsd3;
		Data.TotalNsd		= Nsd;
		Data.Nsd			= AvgNsd;
		Data.PercentageWear	= Wear;
// Added on April 11
		Data.TyrePrdWeek	= Week;
		Data.TyrePrdMonth	= Month;
		Data.TyrePrdYear	= Year.substring(2,4);		// Changed on April 18
//				
		Data.VendorCode 	= this.vendorcc;
		Data.VendorName		= this.vendorName;
		Data.MouldNo 		= MouldNo;
		Data.PrdMonth 		= Month;
		Data.PrdYear	    = Year;		


		Data.DisposlDecision	= DispoDec;
		Data.AdjustmentMode		= AdjMode;
		Data.RejectionReason	= RejRes;
		Data.CodeGrp			= DefectGrp;
		Data.MajorDefect		= DefectCod;
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
					       
					        }
					    });	
					}else{
						 
						sap.m.MessageBox.show(oData.EMessage, {
					        title: "Success",
					        icon:sap.m.MessageBox.Icon.SUCCESS,
					        onClose:function(){
					        	that.saveUploadedDocs(oData.ClaimNo,oData.InspNo);         	// document upload
					        	//window.history.back();
					        	
					        	//Changed-8-06-2019
					        	 
					        	window.location.reload();
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
			oCreateModel1.create("/SaveInspectionSet", Data, {
				success: fncSuccess,
				error: fncError
			});
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
NumChar: function(oEvent){
		var text = oEvent.getSource().getValue();
		var code = text.charCodeAt(text.length-1);
							 
			if ( !(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123) ){
							text = text.substring( 0 , text.length - 1 );
						}
			
			text = text.toUpperCase();
			oEvent.getSource().setValue(text);
	},
					
/********************************************************Upload File************************************************************/

	/*	//onInit
	    // start of document upload
		//var attachmentModel = new sap.ui.model.json.JSONModel();
		//this.getView().setModel(attachmentModel,"attachmentModel");
		//attachmentModel.setData([]);
		
		//var oUploadModel = new sap.ui.model.json.JSONModel({
		//	items : []
		//});
		
		//this.getView().setModel(oUploadModel,"oUploadModel");
		// end of document upload
	*/
	/*	//onCreateTestPlanSet: function
		//that.saveUploadedDocs(that.SelectedData.ClaimNo, that.SelectedData.insprevno);         	// document upload
		
		// _onRoute
		//this.getAttachmentDetails(this.SelectedData.ClaimNo,this.SelectedData.insprevno);  		// document upload
	*/
		
		onAttachUpload: function(oEvent){
			 
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
		
	   
	    onTypeMissmatch: function(oEvent){
	    	
	    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
	    	return false;
	    },
	    
	   
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
				var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='06',ObjectName='"+selectedGuId+"')?$expand=ImageObjectToDataNvg";
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
			
			saveUploadedDocs: function(ClaimNo,InspNo){               						// document upload
				
				var payload = that.createDocsPayload(ClaimNo,InspNo);
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
			
			createDocsPayload: function(ClaimNo,InspNo){              							// document upload
				
				var payload={
						ObjectID: "06",
						ObjectName: ClaimNo+InspNo,
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

	    // **********************File upload Finish****************************	
	
	
	
});
});
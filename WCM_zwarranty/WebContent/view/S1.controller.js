jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.acute.warranty.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var DataArticles, newDate, that, DepoCode, initialFlag, CompName,DlrName,lifnr,Kunnr,ItmCode,StateKey;
sap.ui.core.mvc.Controller
		.extend(
				"com.acute.warranty.view.S1",
				{

onInit : function() {
		that = this;
		initialFlag = true;
		//this.onFitType();  //changed-24/05/2019
		this.newBusy = new sap.m.BusyDialog();
		// this.newBusy.open();
		this.model = this.getOwnerComponent().getModel();
			if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
			}
			if (sap.ui.Device.system.desktop) {

			}
			
			newDate = new Date();
			/* var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		            pattern : "dd.MM.yyyy"
				});
			 var date = new Date(), y = date.getFullYear(), m = date.getMonth();
			 var firstDay = new Date(y, m, 1);
			 var currentdate = new Date();
			 var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
				 this.toDate = dateFormat.format(currentdate)+"T00:00:00";
				 currentdate =  oDateFormat.format(currentdate);
			 var initialDateValue = currentdate;
				 this.getView().byId("idPurchDt").setValue(initialDateValue);*/
		
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
onAfterRendering: function() {
	var that = this;
	if(initialFlag){
			if (!that._DealerDialog) {
				
				that._DealerDialog = sap.ui.xmlfragment(
					"com.acute.warranty.view.Intial", that);
				that.getView().addDependent(that._DealerDialog);}
			that._DealerDialog.open();
			
	}				
			
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
//Add 24/05/2019
OnNosTPChange : function(){
	
	var NoTPKey = this.getView().byId("idNosTP").getSelectedKey();
	if(NoTPKey =="1"){
		this.getView().byId("idStnclNo").setVisible(true);
		this.getView().byId("idStnclNo2").setVisible(false).setValue();
		this.getView().byId("idStnclNo3").setVisible(false).setValue();
		this.getView().byId("idStnclNo4").setVisible(false).setValue();
		this.getView().byId("idStnclNo5").setVisible(false).setValue();
	}else if(NoTPKey =="2"){
		this.getView().byId("idStnclNo").setVisible(true);
		this.getView().byId("idStnclNo2").setVisible(true);
		this.getView().byId("idStnclNo3").setVisible(false).setValue();
		this.getView().byId("idStnclNo4").setVisible(false).setValue();
		this.getView().byId("idStnclNo5").setVisible(false).setValue();
	}else if(NoTPKey =="3"){
		this.getView().byId("idStnclNo").setVisible(true);
		this.getView().byId("idStnclNo2").setVisible(true);
		this.getView().byId("idStnclNo3").setVisible(true);
		this.getView().byId("idStnclNo4").setVisible(false).setValue();
		this.getView().byId("idStnclNo5").setVisible(false).setValue();
	}else if(NoTPKey =="4"){
		this.getView().byId("idStnclNo").setVisible(true);
		this.getView().byId("idStnclNo2").setVisible(true);
		this.getView().byId("idStnclNo3").setVisible(true);
		this.getView().byId("idStnclNo4").setVisible(true);
		this.getView().byId("idStnclNo5").setVisible(false).setValue();
	}else if(NoTPKey =="5"){
		this.getView().byId("idStnclNo").setVisible(true);
		this.getView().byId("idStnclNo2").setVisible(true);
		this.getView().byId("idStnclNo3").setVisible(true);
		this.getView().byId("idStnclNo4").setVisible(true);
		this.getView().byId("idStnclNo5").setVisible(true);
	}
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
//Add 24/05/2019
YearValid:function(oEvent){ 
	
	var d = new Date();
	var y = d.getFullYear();
	var mo = d.getMonth()+1;
	var val = oEvent.getSource().getValue();
	if(val){
		if(isNaN(val)){
			val = val.substring(0, val.length - 1);
			oEvent.getSource().setValue(val);					
		} else if(val.length != 4){				
				sap.m.MessageToast.show("Year is invalid");
				oEvent.getSource().setValue();	
				return false;				
		} else if(!(isNaN(val)) && val.length == 4){			
				if(val < 2000){
				sap.m.MessageToast.show("Year cannot be less than 2000");
				oEvent.getSource().setValue();	
				return false;
				}else if(val > y){
				sap.m.MessageToast.show("Year cannot be future year");
				oEvent.getSource().setValue();
				return false;
				}		
				
			}	
		
		// validate month with year
		var month = this.getView().byId("idMonth").getSelectedKey();
		
		if(val == y && month > mo){ 
			sap.m.MessageToast.show("Registration Period cannot be greater than current period");				 
			this.getView().byId("idMonth").setSelectedKey();
			oEvent.getSource().setValue();
			return false;
		}
		
	}
},

onMonthChange : function(oEvent){
	
	var d = new Date();
	var y = d.getFullYear();
	var mo = d.getMonth()+1;
	var val = this.getView().byId("idYear").getValue();
	var month = oEvent.getSource().getSelectedKey(); 
	
	if(val == y && month > mo){ 
		sap.m.MessageToast.show("Registration Period cannot be greater than current period");				 
		this.getView().byId("idMonth").setValue();
		oEvent.getSource().setSelectedKey();
		return false;
	}
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
OnFragOk : function(){
	
		var CustMob = sap.ui.getCore().byId("idCustMob").getValue();
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
		
		CompName = sap.ui.getCore().byId("idCname").getSelectedKey();
		if(CompName == ""){
			sap.ui.getCore().byId("idCname").setValueState(sap.ui.core.ValueState.Error);
			return;
		} else { 
			sap.ui.getCore().byId("idCname").setValueState(sap.ui.core.ValueState.None);
		}
		
	this.OncustomerDetails();  
	this.onDealerInfo();
		
that._DealerDialog.close();
that._DealerDialog.destroy(); 
that._DealerDialog=undefined;
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//for cancel fragment
OnFragCancel :function(){
	window.history.back();
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Model for Customer Details
OncustomerDetails : function(){
	
	var that = this;
	var CustMob = sap.ui.getCore().byId("idCustMob").getValue();

	var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	var fncSuccess = function(oData, oResponse){
		var ary = {
		"d" : oData
		}
      var jModel = new sap.ui.model.json.JSONModel(ary);
      
      StateKey = oData.CustomerRegion;
      that.getView().setModel(jModel , "jModel");
      that.data = jModel.getData();
      	/*if(that.data.d.Flag != "X"){ //changed-28-05-2019
      	  that.OnDisableCustomerFields();
      	}*/
      	        	
      	//that.getView().byId("idTolbarTDt").setVisible(false);
      	that.getView().byId("HedCustMob").setText("Customer Mob No : " + that.data.d.CustomerTelf1);        
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
//Base of Customer Mobile no disable customer field
/*OnDisableCustomerFields : function(){  //changed-28-05-2019
	 
	this.getView().byId("idAdd1").setEnabled(false);
	this.getView().byId("idState").setEnabled(false);
	this.getView().byId("idDistrict").setEnabled(false);
	this.getView().byId("idCity").setEnabled(false);
	this.getView().byId("idFname").setEnabled(false);
	
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
},
*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Validate Required Fields
validaterequired: function(){
	
	var check = true;
	
	var CustPhone 		= this.getView().byId("idPhone1");
	var CustFname 		= this.getView().byId("idFname");
	var CustAddress 	= this.getView().byId("idAdd1");
	var CustState 		= this.getView().byId("idState");
	var CustDist 		= this.getView().byId("idDistrict");
	var CustCity		= this.getView().byId("idCity");
	
	var VehType		 	= this.getView().byId("idVehTyp");
	var VehMake 		= this.getView().byId("idVehMake");
	var VehModel 		= this.getView().byId("idVehModel");
	var VehRegNo		= this.getView().byId("idVehRegNo");
	var KmCvrd			= this.getView().byId("idKmCvrd");
	var VarMonth		= this.getView().byId("idMonth");
	var VarYear			= this.getView().byId("idYear");
	
	var FitType		 	= this.getView().byId("idFitTyp");
	//var TyrType 		= this.getView().byId("idTyrTyp");
	var ItemDesc		= this.getView().byId("idItmDesc");
	var StencilNo		= this.getView().byId("idStnclNo");
	var StencilNo2		= this.getView().byId("idStnclNo2");
	var StencilNo3		= this.getView().byId("idStnclNo3");
	var StencilNo4		= this.getView().byId("idStnclNo4");
	var StencilNo5		= this.getView().byId("idStnclNo5");
	
	
	var MonthlyKms 		= this.getView().byId("idMnthlyKms");
	var VarNosTP		= this.getView().byId("idNosTP");
	var PrchDt 			= this.getView().byId("idPurchDt");
	
					
	if(CustPhone.getValue()==""){
		CustPhone.setValueState("Error");
		check = false;
	}else{
		CustPhone.setValueState("None");
	}

	if(CustFname.getValue()==""){
		CustFname.setValueState("Error");
		check = false;
	}else{
		CustFname.setValueState("None");
	}

	if(CustAddress.getValue()==""){
		CustAddress.setValueState("Error");
		check = false;
	}else{
		CustAddress.setValueState("None");
	}

	if(CustState.getValue()==""){
		CustState.setValueState("Error");
		check = false;
	}else{
		CustState.setValueState("None");
	}

	if(CustDist.getValue()==""){
		CustDist.setValueState("Error");
		check = false;
	}else{
		CustDist.setValueState("None");
	}

	if(CustCity.getValue() == ""){
		CustCity.setValueState("Error");
		check = false;
	}else{
		CustCity.setValueState("None");
	}
	
	if(VehType.getValue() == ""){
		VehType.setValueState("Error");
		check = false;
	}else{
		VehType.setValueState("None");
	}
	
	if(VehMake.getValue() == ""){
		VehMake.setValueState("Error");
		check = false;
	}else{
		VehMake.setValueState("None");
	}
	
	if(VehModel.getValue() == ""){
		VehModel.setValueState("Error");
		check = false;
	}else{
		VehModel.setValueState("None");
	}
	
	if(VehRegNo.getValue() == ""){
		VehRegNo.setValueState("Error");
		check = false;
	}else{
		VehRegNo.setValueState("None");
	}
	
	if(KmCvrd.getValue() == ""){
		KmCvrd.setValueState("Error");
		check = false;
	}else{
		KmCvrd.setValueState("None");
	}
	
/*29-aug-2019*/
	/*if(VarMonth.getSelectedKey() == ""){
		VarMonth.setValueState("Error");
		check = false;
	}else{
		VarMonth.setValueState("None");
	}
	
	if(VarYear.getValue() == ""){
		VarYear.setValueState("Error");
		check = false;
	}else{
		VarYear.setValueState("None");
	}
	
	if(FitType.getSelectedKey() == ""){
		FitType.setValueState("Error");
		check = false;
	}else{
		FitType.setValueState("None");
	}*/
	
	/*if(TyrType.getSelectedKey() == ""){
		TyrType.setValueState("Error");
		check = false;
	}else{
		TyrType.setValueState("None");
	}*/
	
	if(ItemDesc.getValue() == ""){
		ItemDesc.setValueState("Error");
		check = false;
	}else{
		ItemDesc.setValueState("None");
	}
	
	if(StencilNo.getValue() == ""  && StencilNo.getVisible(true)){
		StencilNo.setValueState("Error");
		check = false;
	}else{
		StencilNo.setValueState("None");
		
	}
	
	if(StencilNo2.getValue() == ""  && StencilNo2.getVisible(true)){
		StencilNo2.setValueState("Error");
		check = false;
	}else{
		StencilNo2.setValueState("None");
		
	}
	
	if(StencilNo3.getValue() == ""  && StencilNo3.getVisible(true)){
		StencilNo3.setValueState("Error");
		check = false;
	}else{
		StencilNo3.setValueState("None");
		
	}
	
	if(StencilNo4.getValue() == ""  && StencilNo4.getVisible(true)){
		StencilNo4.setValueState("Error");
		check = false;
	}else{
		StencilNo5.setValueState("None");
		
	}
	
	if(StencilNo5.getValue() == ""  && StencilNo5.getVisible(true)){
		StencilNo5.setValueState("Error");
		check = false;
	}else{
		StencilNo5.setValueState("None");
		
	}
	 
	if(MonthlyKms.getValue() == ""){
		MonthlyKms.setValueState("Error");
		check = false;
	}else{
		MonthlyKms.setValueState("None");
	}
	
	if(VarNosTP.getSelectedKey() == ""){
		VarNosTP.setValueState("Error");
		check = false;
	}else{
		VarNosTP.setValueState("None");
	}
	
	if(PrchDt.getValue() == ""){
		PrchDt.setValueState("Error");
		check = false;
	}else{
		PrchDt.setValueState("None");
	}
	
	return check;
	
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Validate Future Date
onchangePrchDt: function(evt){
	
	var date = evt.getSource().getDateValue();
	var today=new Date();
	
	today.setHours(00,00,00);
	if(date.getTime()>today.getTime()){
		sap.m.MessageToast.show("Purchase date cannot be future date.");
		evt.getSource().setDateValue(null);
		return
	}
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
ValidateStencil : function(oEvent){
	debugger
	var text1 = this.getView().byId("idStnclNo").getValue();
	var text2 = this.getView().byId("idStnclNo2").getValue();
	var text3 = this.getView().byId("idStnclNo3").getValue();
	var text4 = this.getView().byId("idStnclNo4").getValue();
	var text5 = this.getView().byId("idStnclNo5").getValue();
	
	var textid1 = this.getView().byId("idStnclNo").getId();
	var textid2 = this.getView().byId("idStnclNo2").getId();
	var textid3 = this.getView().byId("idStnclNo3").getId();
	var textid4 = this.getView().byId("idStnclNo4").getId();
	var textid5 = this.getView().byId("idStnclNo5").getId();	
	
	if(oEvent.getSource().getValue().length == 9 || oEvent.getSource().getValue().length == 11){
		debugger
		if(oEvent.getSource().getId() != textid1 && oEvent.getSource().getValue() == text1 && oEvent.getSource().getValue() !=""){
			sap.m.MessageToast.show("Duplicate Stencil Entered.");
			oEvent.getSource().setValue();
			return false;
		}
		else if(oEvent.getSource().getId() != textid2 && oEvent.getSource().getValue() == text2 && oEvent.getSource().getValue() !=""){
			sap.m.MessageToast.show("Duplicate Stencil Entered.");
			oEvent.getSource().setValue();
			return false;
		}
		else if(oEvent.getSource().getId() != textid3 && oEvent.getSource().getValue() == text3 && oEvent.getSource().getValue() !=""){
			sap.m.MessageToast.show("Duplicate Stencil Entered.");
			oEvent.getSource().setValue();
			return false;
		}
		else if(oEvent.getSource().getId() != textid4 && oEvent.getSource().getValue() == text4 && oEvent.getSource().getValue() !=""){
			sap.m.MessageToast.show("Duplicate Stencil Entered.");
			oEvent.getSource().setValue();
			return false;
		}
		else if(oEvent.getSource().getId() != textid5 && oEvent.getSource().getValue() == text5 && oEvent.getSource().getValue() !=""){
			sap.m.MessageToast.show("Duplicate Stencil Entered.");
			oEvent.getSource().setValue();
			return false;
		}
	}	
	
	text = oEvent.getSource().getValue();
	oEvent.getSource().setValue(text.toUpperCase());
    
   // this.event = text;
      this.event = oEvent.getSource();
	
	var stencilNumber = oEvent.getSource().getValue()
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(
			sServiceUrl);
	oReadModel.setHeaders({
		"Content-Type" : "application/atom+xml"
	});
	var fncError = function(oError) { // error callback
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
					that.event.setValue("");
					that.event.setValueState("Error");
					return false;
				}
			});
		}
		else{
			that.stencilFlag = "X";
		}
	}
	oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+DepoCode+"',ItemCode='"+ItmCode+"',StencilNo='"+stencilNumber+"')",
			{
		success : fncSuccess,
		error : fncError
	});
	
},

/*charNum: function(oEvent){
	///////////////////Check Special Character Can't Not Accepted//////////////////
	 
    //var text = oEvent.getSource().getValue();
	var text = this.getView().byId("idStnclNo").getValue();
    var code = text.charCodeAt(text.length-1);
    
                    if ( !(code > 47 && code < 58) && // numeric (0-9)
                                    !(code > 64 && code < 91) && // upper alpha (A-Z)
                                    !(code > 96 && code < 123) )  // lower alpha (a-z)
                         {
                          text = text.substring( 0 , text.length - 1 );
                         }                                             
    this.getView().byId("idStnclNo").setValue(text.toUpperCase());
    
    //////////////////Start code for validate stencil no////////////////////
    
    //this.event = oEvent.getSource();
    this.event = text;
	//var stencilNumber = oEvent.getSource().getValue();
	var stencilNumber = this.getView().byId("idStnclNo").getValue()
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
		}
	}
	oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+DepoCode+"',ItemCode='"+ItmCode+"',StencilNo='"+stencilNumber+"')",
			{
		success : fncSuccess,
		error : fncError
	});
    
},*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Dealer Information
onDealerInfo : function(){
	
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
		that.getView().byId("HeaderIdTit").setTitle("Warranty Registration" + "("+ DlrName +")");

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
	oReadModel.read("/GetDealerInfoSet(Uname='"+uid+"',Bukrs='"+CompName+"')", {
		success : fncSuccess,
		error : fncError
	});
	
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
//f4 for Fitment type
/*onFitType : function(){   //Changed-24/05/2019
		
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/FitmentTypeSet";
		var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false, false, null);
		var loc = this.getView().byId("idFitTyp");
			loc.unbindAggregation("items");
			loc.setModel(jModel);
			
			loc.bindAggregation("items", {
				path: "/d/results",
				template: new sap.ui.core.Item({
					key: "{Type}",
					text: "{Description}"
				})
			});
			loc.setSelectedKey();
		
},*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	

//F4 for State
onStateHelp : function(){
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
			this.getView().byId("idDistrict").setValue();
			this.getView().byId("idCity").setValue();
		}
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
//F4 for District
onDistrictHelp: function() {
	if(this.State == undefined){
		var RegionCode  = StateKey
	} else {
		var RegionCode  = this.State
	}
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + RegionCode + "'";
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
		this.getView().byId("idDistrict").setValue(oSelectedItem.getTitle());
		this.getView().byId("idCity").setValue();
	}

},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Validate Email id
emailValidate : function(){
	
	var email = this.getView().byId("idEmail").getValue();
	var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
	if (!mailregex.test(email)) {
		 sap.m.MessageToast.show("Invalid Email");
		 this.getView().byId("idEmail").setValue();
	}

},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for Vehicle Type
onVehicleType : function(){
	//var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehTypeDealerSet";
	//var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/GetWRVehTypSet";
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehTypeDealerSet?$filter=DealerCode eq '"+Kunnr+"' and WRFlag eq 'X'";
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
		this.getView().byId("idVehMake").setValue("").setEnabled(true);
		this.getView().byId("idVehModel").setValue("");
		this.getView().byId("idItmDesc").setValue("");
		this.getView().byId("idItmDesc").setValue("");		
		

        if(this.getView().byId("idVehModel").getValue()==""){
        	this.getView().byId("idVehModel").setValue().setEnabled(false);
        	this.getView().byId("idVehVar").setValue().setEnabled(false);
        }
	}
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
	        this.getView().byId("idVehMake").setValue(oSelectedItem.getTitle());
	        this.getView().byId("idVehModel").setValue().setEnabled(true);
	        this.getView().byId("idVehVar").setValue().setEnabled(false);
	       
	    } 
	    
	   
	    
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//F4 for Vehicle Model
onVehicleModel: function() {
	
		var VehMake = this.getView().byId("idVehMake").getValue();
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
	        this.getView().byId("idVehModel").setValue(oSelectedItem.getTitle());
	        this.getView().byId("idVehVar").setEnabled(true).setValue();
	        
	    }      
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onVehicleVariant : function(){
	
	var vehtype = this.getView().byId("idVehTyp").getValue();
	var vehMake = this.getView().byId("idVehMake").getValue();
	var vehModel = this.getView().byId("idVehModel").getValue();
	var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleVariantSet?$filter=Type eq '"+vehtype+"' and Make eq '"+vehMake+"' and Model eq '"+vehModel+"'";
 	var jModel = new sap.ui.model.json.JSONModel();
 	jModel.loadData(sPath, null, false,"GET",false, false, null);
    var _valueVariantHelpSelectDialog = new sap.m.SelectDialog({
    	
        title: "Vehicle Variant",
        items: {
            path: "/d/results",
            template: new sap.m.StandardListItem({
                title: "{Variant}",
                customData: [new sap.ui.core.CustomData({
                    key  : "{Variant}",
                    value: "{Variant}"
                })],    	               
            }),
        },
        liveChange: function(oEvent) {
            var sValue  = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("Variant",sap.ui.model.FilterOperator.Contains,sValue);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        confirm: [this._handleVechVariantClose, this],
        cancel : [this._handleVechVariantClose, this]
    });
    _valueVariantHelpSelectDialog.setModel(jModel);
    _valueVariantHelpSelectDialog.open();
},

_handleVechVariantClose: function(oEvent) {
	
    var oSelectedItem = oEvent.getParameter("selectedItem");
    if (oSelectedItem) {
        this.getView().byId("idVehVar").setValue(oSelectedItem.getTitle());
    }      
	
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*OnTyreChng : function(){
	this.getView().byId("idItmDesc").setValue();
	if(this.getView().byId("idTyrTyp").getSelectedKey() == "tyr"){
		this.getView().byId("idStnclNo").setEnabled(true);
	}else{
		this.getView().byId("idStnclNo").setEnabled(false).setValue();
	}
},*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//f4 for Tyre Item 
onItemDescHelp:function(evt){
	
	/*var VehType = this.getView().byId("idVehTyp").getValue();
	var ItemType = this.getView().byId("idFitTyp").getSelectedKey();
	this.getView().byId("idVehTyp").setValueState("None");
	this.getView().byId("idFitTyp").setValueState("None");
	if(VehType == "" || ItemType == ""){
		sap.m.MessageBox.alert(
				"Vehicle Type and Fitment Type is required", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		this.getView().byId("idVehTyp").setValueState("Error");
		this.getView().byId("idFitTyp").setValueState("Error");
		return false;
	*/
	var VehType = this.getView().byId("idVehTyp").getValue();
	this.getView().byId("idVehTyp").setValueState("None");
	if(VehType == ""){
		sap.m.MessageBox.alert(
				"Vehicle Type is required", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		this.getView().byId("idVehTyp").setValueState("Error");
		return false;
	
	} else {
		debugger
	var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpDealerItemCodeSet?$filter=Bukrs eq '"+CompName+"' and Type eq '"+VehType+"' and Kunnr eq '"+Kunnr+"' and IClaimItemType eq 'TYRE' and IClaimType eq 'SP10' and IRecvDepo eq '"+DepoCode+"' and WRFlag eq 'X'";
	
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false,
			false, null);
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
					debugger
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("ItemDescr",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter1 = new sap.ui.model.Filter("ItemCode",sap.ui.model.FilterOperator.Contains,sValue);
					var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1], false);													
					oEvent.getSource().getBinding("items").filter([ oFilter ]);
				},
				confirm : [ this._handleTyreJKDealClose, this ],
				cancel : [ this._handleTyreJKDealClose, this ]
			});
	_valueHelpTyreSelectDialog.setModel(jModel);
	_valueHelpTyreSelectDialog.open();
	
	}

},
_handleTyreJKDealClose : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var TyreTypeCode = sap.ui.getCore().byId(this.TyreTypeCode);
	if (oSelectedItem) {
		ItmCode = oSelectedItem.getDescription();
		this.getView().byId("idItmDesc").setValue(oSelectedItem.getTitle());
		this.getView().byId("idStnclNo").setValue("");
		this.getView().byId("idStnclNo2").setValue("");
		this.getView().byId("idStnclNo3").setValue("");
		this.getView().byId("idStnclNo4").setValue("");
		this.getView().byId("idStnclNo5").setValue("");
	}


},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Validate Charactor
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


//payLoadDate: function(SDateValue) {
//	 
//	var str = "T00:00:00";
//	var currentTime = new Date(SDateValue);
//	var month = currentTime.getMonth() + 1;
//	var day = currentTime.getDate();
//	var year = currentTime.getFullYear();
//	var date = year + "-" + month + "-" + day + str;
//	return date;
//},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Formating Date 03-06-2019

payLoadDate: function(SDateValue) {				
	var str = "T00:00:00";
	var currentTime = new Date(SDateValue);
	var month = currentTime.getMonth() + 1;
	if(month.toString().length == 1) {month = "0" + month};
	var day = currentTime.getDate();
	if(day.toString().length == 1) {day = "0" + day};
	var year = currentTime.getFullYear();
	var date = year + "-" + month + "-" + day + str;
	return date;	
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onWarrantyCreate : function(){
	
	//validate required fields
	var validaterequired = this.validaterequired();
	if(!validaterequired){
		sap.m.MessageBox.alert(
				"Please Fill All Required Fields.", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 ); 
		return false;
	}
	
	var CustmMobile		=	this.getView().byId("idPhone1").getValue();
	var CustomerFname 	= 	this.getView().byId("idFname").getValue();
	var CustomerLname 	= 	this.getView().byId("idLname").getValue();
	var CustomerAddr1 	= 	this.getView().byId("idAdd1").getValue();
	var CustomerRegion	= 	this.getView().byId("idState").getValue();
	var CustomerCity2	= 	this.getView().byId("idDistrict").getValue();
	var CustomerCity1 	= 	this.getView().byId("idCity").getValue();
	var CustomerEmail 	= 	this.getView().byId("idEmail").getValue();
	
	var VehType 		= 	this.getView().byId("idVehTyp").getValue();
	var VehMake 		= 	this.getView().byId("idVehMake").getValue();
	var VehModl 		= 	this.getView().byId("idVehModel").getValue();
	var VehVarient 		= 	this.getView().byId("idVehVar").getValue();
	var MonthKM 		= 	this.getView().byId("idMnthlyKms").getValue();
/*	var VehRegnMonth	= 	this.getView().byId("idMonth").getSelectedKey();
	var VerhRegnYear 	= 	this.getView().byId("idYear").getValue();*/
	var VehKmCvrd 		= 	this.getView().byId("idKmCvrd").getValue();
	var VehOdoMtr 		= 	this.getView().byId("idVehOdoMtr").getValue();
	var VehRegNo 		= 	this.getView().byId("idVehRegNo").getValue();
	
	var FitType 		= 	this.getView().byId("idFitTyp").getSelectedKey();
	//var TyrType 		= 	this.getView().byId("idTyrTyp").getSelectedKey();
	var ItemDesc 		= 	this.getView().byId("idItmDesc").getValue();
	
	var PurchDate 		= 	this.getView().byId("idPurchDt").getDateValue();
	if(PurchDate!=null){
		PurchDate = this.payLoadDate(PurchDate);		
	 }
	var VarNoTyre		=	this.getView().byId("idNosTP").getSelectedKey();
	var StencilNo 		= 	this.getView().byId("idStnclNo").getValue();
	var StencilNo2 		= 	this.getView().byId("idStnclNo2").getValue();
	var StencilNo3 		= 	this.getView().byId("idStnclNo3").getValue();
	var StencilNo4 		= 	this.getView().byId("idStnclNo4").getValue();
	var StencilNo5 		= 	this.getView().byId("idStnclNo5").getValue();
	
	
	var Data={};
	Data.CustomerTelf1	=	CustmMobile;
	Data.CustomerFname	=	CustomerFname;
	Data.CustomerLname	=	CustomerLname;
	Data.CustomerAddr1	=	CustomerAddr1;
	if(StateKey != ""){
		Data.CustomerRegion	=	StateKey;
	} else {
	Data.CustomerRegion	=	this.State;
	}
	
	if(StateKey != ""){
		Data.CustomerCity2 = CustomerCity2;
	} else {
		Data.CustomerCity2	=	this.District;
	}	
	
	Data.CustomerCity1	=	CustomerCity1;
	Data.CustomerEmail	=	CustomerEmail;
	Data.VehicleType 	= 	VehType;
	Data.VehicleMake 	= 	VehMake;
	Data.VehicleModel 	= 	VehModl;
	Data.VehVariant		=	VehVarient;
	Data.MontlyKm 		= 	MonthKM;
	Data.VehicleRegMonth = VehRegnMonth;
	Data.VehicleRegYear =	VerhRegnYear
	Data.CoverKM		=	VehKmCvrd;
	Data.RegNo 			= 	VehRegNo;
	
	Data.FitType 		= 	FitType;
	//Data.TyreType 	= 	TyrType;
	Data.Matnr	 		= 	ItmCode; 
	
	Data.Bukrs 			= 	CompName;
	Data.NoOfTyres		=	VarNoTyre
	Data.StnclNumber1   = StencilNo;
	Data.StnclNumber2	= StencilNo2
	Data.StnclNumber3	= StencilNo3
	Data.StnclNumber4	= StencilNo4
	Data.StnclNumber5	= StencilNo5
	Data.TyrePurcDate	= PurchDate;
	Data.DealerCode 	= Kunnr;
	Data.DealerName 	= DlrName;
	Data.CustType		="01";
		
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_WARRANTY_SRV/";
	var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
		"Content-Type": "application/atom+xml"
		});
	var fncSuccess = function(oData, oResponse) //sucess function 
	{
		if(oData.Error=="X"){
			sap.m.MessageBox.show(oData.Message, {
			title: "Error",
			icon:sap.m.MessageBox.Icon.ERROR,
			onClose:function(){}
			});	
		}else{
			sap.m.MessageBox.show(oData.Message, {
			title: "Success",
			icon:sap.m.MessageBox.Icon.SUCCESS,
				onClose:function(){
				//window.history.back();
				window.location.reload();
				}
			});
		}
	}
	var fncError = function(oError) { //error callback function
	var parser = new DOMParser();
	var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
		title: "Error",
		icon:sap.m.MessageBox.Icon.ERROR,
		});
	}
	
	oCreateModel1.create("/WarrantyRegistrationSet", Data, {
		success: fncSuccess,
		error: fncError
	});
		 
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/						
});
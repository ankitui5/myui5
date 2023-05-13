jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("zclaimapproval.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");

var that, oRouter, selectedData, initialFlag, claim, IndexNo;
var claimListJModel,gv_busyindicator,tableid,CustPhoNo,CollectTicketNo,oDataLength,gvTAssignedFlag,gvInterval;

sap.ui.core.mvc.Controller.extend("zclaimapproval.view.S1",{
 
onInit:function(){
	
		that = this;
		initialFlag = true;
		gv_busyindicator = new sap.m.BusyDialog();
		
		claimListJModel = new sap.ui.model.json.JSONModel();
		this.getView().byId("idClaimDataTable").setModel(claimListJModel,"claimListJModel");
		
		sap.ui.core.UIComponent.getRouterFor(this).getRoute("S1").attachMatched(this._onRoute, this);
		
		//set initial date in input field
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern:"dd.MM.yyy"});
		//var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		var date = new Date(), y = date.getFullYear(), m=date.getMonth();
		
		var firstDay = new Date(y,m,1);
		
		var now = firstDay;
		var last60days = new Date(now.setDate(now.getDate() - 61)); //get previous 60 days
		var currentDate = new Date;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
			currentDate = oDateFormat.format(currentDate);
			last60days = oDateFormat.format(last60days);
		var initialDateValue = last60days + " - "  + currentDate;
		this.getView().byId("idDate1").setValue(last60days);
		this.getView().byId("idDate2").setValue(currentDate);
		
		var  fromdate = this.getView().byId("idDate1").getDateValue();
		this.getView().byId("idDate1").setMaxDate(new Date);
		this.getView().byId("idDate2").setMinDate(fromdate);
		
		//Set disable DatePiker
		var date = this.getView().byId("idDate1");
		date.addDelegate({
					onAfterRendering: function() {
						date.$().find('INPUT').attr('disabled', true);
					}
			}, date);

		var date2 = this.getView().byId("idDate2");
		date2.addDelegate({
					onAfterRendering: function() {
						date2.$().find('INPUT').attr('disabled', true);
					}
			}, date2);
		
},

_onRoute:function(){
	
	var that = this;
	this.onSearch();
	gvInterval = setInterval(function() { 
		that.onSearch();
       },  59000); 
},
//************************************************************************************************************
onDateChange:function(){
	var  fromdate = this.getView().byId("idDate1").getDateValue();	
	this.getView().byId("idDate2").setMinDate(fromdate);
},
//************************************************************************************************************
onAfterRendering:function(){

},
//************************************************************************************************************
onClaimPredict:function(oEvent){
	
	clearInterval(gvInterval) ;
	that = this;
	gvTAssignedFlag = "";
	IndexNo = oEvent.getSource().getParent().getBindingContext("claimListJModel").sPath.split("/")[1]
	var ClaimData = oEvent.getSource().getParent().getBindingContext("claimListJModel").getModel().getData()[IndexNo];
	this.UpdateAIEngg(ClaimData);//save data on Pick Ticket;
	
	if(gvTAssignedFlag == "TA"){ //if ticket allready assigned
		return false;
	}
		claim = oEvent.getSource().getParent().getCells()[0].getText();
	var Kunnr 		= oEvent.getSource().getParent().getBindingContext("claimListJModel").getModel().getData()[IndexNo].DealerCode;
	var ticketNo 	= oEvent.getSource().getParent().getBindingContext("claimListJModel").getModel().getData()[IndexNo].TicketNo;
		CustPhoNo 	= oEvent.getSource().getParent().getBindingContext("claimListJModel").getModel().getData()[IndexNo].CustomerTelf1;
	
		
		var ticketNo  = "";
		//var Kunnr = "";
		//var sPathCartListSet = "/DealerTicketSearchSet?$filter=Kunnr eq '"+Kunnr+"' and TicketNo eq'"+ticketNo+"' and ITelf1 eq'"+CustPhoNo+"'";
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
		var sPathCartListSet = "/GetOpenTicketMobileSet?$filter= CustomerTelf1 eq'"+CustPhoNo+"' and TicketNo eq '"+ticketNo+"'";
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);	
		//var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsCartListSet = {};
		oParamsCartListSet.context = "";
		oParamsCartListSet.urlParameters = "";
		oParamsCartListSet.success = function(oData, oResponse) {	// success handler
			
			oDataLength = oData.results.length;
			if(oDataLength =="0"){
				that.displayTicktRequest();
			} else {
				
				if (!that._TicketDetailHelpDialog) {
					that._TicketDetailHelpDialog = sap.ui.xmlfragment(
						"zclaimapproval.view.Ticket_Details", that);
					that.getView().addDependent(that._TicketDetailHelpDialog);								
				}
				
				sap.m.MessageBox.show("There are open tickets against mobile-"+ CustPhoNo +".Please select irrelevant tickets for closure.", {
					   title: "Information",
					   icon:sap.m.MessageBox.Icon.INFORMATION,
					   onClose:function(){
						   
						   sap.ui.getCore().byId("iddialog").setTitle("Open tickets for Mobile-"+CustPhoNo);
						   var TicketListSetJModel = new sap.ui.model.json.JSONModel();
							that._TicketDetailHelpDialog.setModel(TicketListSetJModel, "TicketListSetJModel");
							TicketListSetJModel.setData(oData.results);
							that._TicketDetailHelpDialog.open();
							that._TicketDetailHelpDialog.setEscapeHandler(function(o){ 
								o.reject(); 
								//o.resolve();
								});
				        }
					});
	
			}			
			
		};
		
		oParamsCartListSet.error = function(oError) {	// error handler
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oDataModel.read(sPathCartListSet, oParamsCartListSet);
		oDataModel.attachRequestCompleted(function() {
		});

},

//***************************************************************************************************************
UpdateAIEngg:function(ClaimData){
	
    var that = this;
var Data ={};
	
	Data.FitType 		= ClaimData.FitType;
	Data.ItemType	    = "TYRE"; 
	Data.ClaimRecDepo   = ClaimData.ClaimRecDepo;
	Data.CustomerLand1  ="IN";
	Data.ClaimTyp 		= "WR10";
	Data.CustType 		= "01";
	Data.SubmNo 		= "1" 
	Data.TlyFlg 		= "TL";	
	Data.TicketNo       = ClaimData.TicketNo;
	Data.Bukrs          = ClaimData.Bukrs;
	Data.CustomerTelf1	= ClaimData.CustomerTelf1;
	Data.CustomerFname  = ClaimData.CustomerFname;
	Data.VehType  		= ClaimData.VehType;
	Data.VehMake		= ClaimData.VehMake;
	Data.VehModel 		= ClaimData.VehModel;
	Data.KmCovered  	= ClaimData.KmCovered;
	Data.DealerCode		= ClaimData.DealerCode;
	Data.FranhiseName   = ClaimData.FranhiseName;
	Data.FranhisePName  = ClaimData.FranhisePName;
	Data.FranhiseEmail  = ClaimData.FranhiseEmail;
	Data.FranhiseContact = ClaimData.FranhiseContact;
	Data.FranhiseLoc  	= ClaimData.FranhiseLoc;
	Data.ClaimNo		= ClaimData.ClaimNo;
	Data.ItemCode 		= ClaimData.ItemCode;
	Data.StnclNumber 	= ClaimData.StnclNumber;
	Data.Nsd1			= ClaimData.Nsd1;
	Data.Nsd2			= ClaimData.Nsd2;
	Data.Nsd3			= ClaimData.Nsd3;
	Data.TotNsd		    = ClaimData.TotNsd;
	Data.Nsd			= ClaimData.Nsd;
	Data.PercentageWear	= ClaimData.PercentageWear;
	Data.TyreSize       = ClaimData.TyreSize;
	Data.KmCovered      = ClaimData.KmCovered
	Data.PrdWeek        = ClaimData.PrdWeek;
    Data.PrdMonth       = ClaimData.PrdMonth;
    Data.PrdYear        = ClaimData.PrdYear;
    Data.ETA            = ClaimData.ETA; 

		
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV";
	var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});
	var fncSuccess = function(oData, oResponse) //success function 
		{
		
			if(oData.EError == "true"){ //if ticket allready assigned
	            sap.m.MessageBox.show(oData.EMessage, {
		           title: "ERROR",
		           icon:sap.m.MessageBox.Icon.ERROR,
		            onClose:function(){
		            	that.onSearch();  
				        }
		        });
	            gvTAssignedFlag = "TA"
	            return false
			}
		}
	var fncError = function(oError) { //error callback function
		
	var parser = new DOMParser();
			sap.m.MessageBox.show(parser, {
				title: "Error",
				icon:sap.m.MessageBox.Icon.ERROR,
			});
			return false
		}
	
		oCreateModel1.create("/UpdateAIEnggSet", Data, {
			success: fncSuccess,
			error: fncError
		});
},

//**************************************************************************************************************
displayTicktRequest:function(){
	
	
	clearInterval(gvInterval) ;
	var IndexData = this.getView().byId("idClaimDataTable").getModel("claimListJModel");
	var ClaimData = IndexData.oData[IndexNo];
		delete ClaimData.__metadata;
		
	var selectedData={};
	selectedData.ClaimData = ClaimData;
	
	//Collect ticekt details
	CollectTicketNo = [];
	if(oDataLength != "0"){
	var table = sap.ui.getCore().byId("idTicketTable");
	 	
		 for(var i=0; i<table.getItems().length; i++){
		 	var obj = {}
		 	 if(table.getItems()[i].getCells()[0].getSelected()){
		 	 	obj.TicketNo = table.getItems()[i].getCells()[1].getText()
		 	 	CollectTicketNo.push(obj);
		 	 }
		 }
		 
		this._TicketDetailHelpDialog.close();
		this._TicketDetailHelpDialog.destroy(true);
		this._TicketDetailHelpDialog=undefined
	}
	if(CollectTicketNo !=""){
		selectedData.CollectTicketNo = CollectTicketNo;
	} else {
		selectedData.CollectTicketNo = "";
	}
	
	   
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("page2",{"entity":JSON.stringify(jsonstring)});

},

//***************************************************************************************************************
onHome:function(){
	this.openDialog("cancel");
},

//***************************************************************************************************************

openDialog : function(status) {
	
	var labelMessage;
		if (status == 'cancel') {
		  labelMessage = 'Are you sure you want to go back?';
		}

	var _that = this;
	var dialog = new sap.m.Dialog({
			title : 'Confirmation Dialog',
			type : 'Message',
			content : [ new sap.m.Label({
				text : labelMessage,
				labelFor : 'submitDialogTextarea'
			})],
			
		beginButton : new sap.m.Button({
			text : 'Yes',
			press : function() {
				if (status == 'cancel') {
					//window.history.back()
			    	 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			    	 	 oCrossAppNavigator.toExternal({
			    	        target: { semanticObject : "#"}
			    	     });
				}
				dialog.close();
			}
		}),
		
		endButton : new sap.m.Button({
		    text : 'No',
		    press : function() {
		      dialog.close();
		    }
		}),
		
		afterClose : function() {
		  dialog.destroy();
		}
	});
	dialog.open();
},
//***********************************************************************************************************
onClaim:function(){
	
	var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/F4AIClaimsSet";
    var jModel = new sap.ui.model.json.JSONModel();
        jModel.loadData(sPath, null, false,"GET",false, false, null);
	var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
			{
				title : "Select Claim No.",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
							{
								title : "{ClaimNo}",
								customData : [ new sap.ui.core.CustomData(
										{
											key : "Key",
											value : "{ClaimNo}"
										}) ],
							}),
				},
				liveChange : function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("ClaimNo",sap.ui.model.FilterOperator.Contains,sValue);
					oEvent.getSource().getBinding("items").filter([ oFilter ]);
				},
				confirm : [ this._handleClaimClose, this ],
				cancel : [ this._handleClaimClose, this ]
			});
	_valueHelpClaimSelectDialog.setModel(jModel);
	_valueHelpClaimSelectDialog.open();
},

_handleClaimClose : function(oEvent) {
	
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.getView().byId("idClaimNo").setValue(oSelectedItem.getTitle()); 	
	}
},

onExit:function() {
	clearInterval(gvInterval) ;
	}, 

//****************************************************************************************************************
onSearch:function(evt){
	
	var that = this;
	//gv_busyindicator.open();
	var claim = this.getView().byId("idClaimNo").getValue();
	var CustName = this.getView().byId("idCustName").getValue();
	var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	    pattern : "dd-MM-YYYY"
	});
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});
	
	
	var fromDate = this.getView().byId("idDate1").getDateValue();
	if(fromDate != null){
		var dateFrom = dateFormat.format(fromDate)+"T00:00:00";
	}
	
	
	var toDate = this.getView().byId("idDate2").getDateValue();
	if(toDate !=null){
		var dateTo = dateFormat.format(toDate)+"T00:00:00";	
	}
	
	
	/*this.getView().byId("idDate1").setValueState("None");
	if((fromDate == "" || fromDate == null) && (toDate == ""|| toDate == null)){
			dateFrom = "2000-01-01T00:00:00";
			dateTo   = "9999-01-01T00:00:00";
			
	}else if(fromDate != "" && (toDate == ""|| toDate == null)){
		dateTo = dateFrom;
		
	}else if((fromDate == "" || fromDate == null) && toDate != ""){
		sap.m.MessageToast.show("Please enter search begin date.");
		this.getView().byId("idDate1").setValueState("Error");
		return false;
	}*/

	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/";
   if(dateFrom == undefined){
	   var sPath ="GetDealerClaimApprovalSet?$filter=DateFrom eq "+null+" and DateTo eq "+null+" and ClaimNo eq '"+claim+"' " +
		"and CustomerTelf1 eq ''and CustomerName eq '"+CustName+"'";
   } else{
	   var sPath ="GetDealerClaimApprovalSet?$filter=DateFrom eq datetime'"+dateFrom+"' and DateTo eq datetime'"+dateTo+"' and ClaimNo eq '"+claim+"' " +
		"and CustomerTelf1 eq ''and CustomerName eq '"+CustName+"'";
   }
	
	
	
	var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
	var oParamsListSet = {};
		oParamsListSet.success = function(oData, oResponse) {
			
			claimListJModel.setData(oData.results);
			if(evt == undefined){
				that.getView().byId("idClaimDataTable").getItems()[0].getCells()[7].setEnabled(true);
			}else{
				that.getView().byId("idClaimDataTable").getItems()[0].getCells()[7].setEnabled(false);
				
			}
			
			tableid = that.getView().byId("idClaimDataTable");
			
		};

	 
		oParamsListSet.error = function(oError) {
			
					
		};		
		oDataModel.read(sPath, oParamsListSet);	

},
//****************************************************************************************************************
onClear:function(){
	
	this.getView().byId("idClaimNo").setValue();
	this.getView().byId("idCustName").setValue();
	
	this.getView().byId("idDate1").setValue();
	this.getView().byId("idDate2").setValue();
	
	var tableid = this.getView().byId("idClaimDataTable");
	var ClaimModel = tableid.getModel("claimListJModel");
		ClaimModel.setData([]);
		ClaimModel.refresh();
},
//***************************************************************************************************************
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

//******************************************************************************************************************
//Validate Customer name.
validateCharacter : function( oEvent ){
	
	var text     = oEvent.getSource().getValue();
		oEvent.getSource().setValue(text.toUpperCase());
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
		oEvent.getSource().setValue( text.toUpperCase() );  
	}else{
		oEvent.getSource().setValueState( "None" );
	} 
},

//****************************************************************************************************************
onCustomer:function(){
	
	var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/F4AICustNameSet";
    var jModel = new sap.ui.model.json.JSONModel();
        jModel.loadData(sPath, null, false,"GET",false, false, null);
	var _valueHelpCustNameSelectDialog = new sap.m.SelectDialog(
			{
				title : "Select Customer Name.",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
							{
								title : "{Name}",
								customData : [ new sap.ui.core.CustomData(
										{
											key : "Key",
											value : "{Name}"
										}) ],
							}),
				},
				liveChange : function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("Name",sap.ui.model.FilterOperator.Contains,sValue);
					oEvent.getSource().getBinding("items").filter([ oFilter ]);
				},
				confirm : [ this._handleCustNameClose, this ],
				cancel : [ this._handleCustNameClose, this ]
			});
	_valueHelpCustNameSelectDialog.setModel(jModel);
	_valueHelpCustNameSelectDialog.open();
},

_handleCustNameClose : function(oEvent) {
	
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.getView().byId("idCustName").setValue(oSelectedItem.getTitle()); 	
	}
},
//***************************************************************************************************************
OnCancelTicketFrag:function(){
	
	this._TicketDetailHelpDialog.close();
	this._TicketDetailHelpDialog.destroy();
	this._TicketDetailHelpDialog = undefined;
},
//****************************************************************************************************************
onSelectAll:function(evt){
	
	var tbl = sap.ui.getCore().byId("idTicketTable");
	if(evt.getSource().getSelected()){
		for(var i=0; i<tbl.getItems().length; i++){
			tbl.getItems()[i].getCells()[0].setSelected(true);
		}
	} else {
		for(var i=0; i<tbl.getItems().length; i++){
			tbl.getItems()[i].getCells()[0].setSelected(false);
		}
	}
	
},
//****************************************************************************************************************
});
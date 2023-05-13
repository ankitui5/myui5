sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
function( JSONModel,UploadCollectionParameter) {
	

jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("znewclaimdl.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
var that,RCFlag,FitType,TyrePhptoFlag,DefectPhotoFlag, initialFlag,AddRowJModel,CustPhoNo,DealerName,DepoCode,itemCode,Kunnr,
	TicketNo,RowIndex,TyreSise,prdWeek,prdMonth,prdYear,DealerRegion,extension,AddTubeRowJModel,
	itemType,VechType,Bukrs;

sap.ui.core.mvc.Controller.extend("znewclaimdl.view.S1",{
	
onInit : function() { 
		debugger
		var that = this;
		initialFlag = true;
		RCFlag = true;
		TyrePhptoFlag = true;
		DefectPhotoFlag = true;
		
		this.newBusy = new sap.m.BusyDialog();
		this.getView().byId("idFitment").setSelectedKey("REP");
		
		AddRowJModel = new sap.ui.model.json.JSONModel();
		this.getView().byId("idTyreTable1").setModel(AddRowJModel, "AddRowJModel");
	
		AddRowJModel.setData([]);
		AddRowJModel.refresh();
		this.onAddNewRow();
		
		AddTubeRowJModel = new sap.ui.model.json.JSONModel();
		this.getView().byId("idTubeTable1").setModel(AddTubeRowJModel, "AddTubeRowJModel");
		
		AddTubeRowJModel.setData([]);
		AddTubeRowJModel.refresh();
		this.onAddNewTubeRow();
		
		
		//For RC Attachments
		var attachmentRCModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentRCModel,"attachmentRCModel");
		attachmentRCModel.setData([]);
		
		var oUploadRCModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadRCModel,"oUploadRCModel");
		
		//For Tyre Size Attachments
		var attachmentTSizeModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentTSizeModel,"attachmentTSizeModel");
		attachmentTSizeModel.setData([]);
		
		var oUploadTSizeModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadTSizeModel,"oUploadTSizeModel");
		
		//For Tyre Pattern Attachments
		var attachmentTPtrnModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentTPtrnModel,"attachmentTPtrnModel");
		attachmentTPtrnModel.setData([]);
		
		var oUploadTPtrnModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadTPtrnModel,"oUploadTPtrnModel");
		
		//For Tyre Stencil Attachments
		var attachmentTStencilModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentTStencilModel,"attachmentTStencilModel");
		attachmentTStencilModel.setData([]);
		
		var oUploadTStencilModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadTStencilModel,"oUploadTStencilModel");
		
		//For Defect Outside Attachments
		var attachmentDefectOutsideModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentDefectOutsideModel,"attachmentDefectOutsideModel");
		attachmentDefectOutsideModel.setData([]);
		
		var oUploadDefectOutsideModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadDefectOutsideModel,"oUploadDefectOutsideModel");
		
		//For Defect Inside Attachments
		var attachmentDefectInsideModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentDefectInsideModel,"attachmentDefectInsideModel");
		attachmentDefectInsideModel.setData([]);
		
		var oUploadDefectInsideModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadDefectInsideModel,"oUploadDefectInsideModel");
		
		//For Defect Any Other Attachments
		var attachmentDefectAnyOtherModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentDefectAnyOtherModel,"attachmentDefectAnyOtherModel");
		attachmentDefectAnyOtherModel.setData([]);
		
		var oUploadDefectAnyOtherModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadDefectAnyOtherModel,"oUploadDefectAnyOtherModel");
		
		//For Tyre Size Marking Attachments
		var attachmentTubeSizeMarkingModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentTubeSizeMarkingModel,"attachmentTubeSizeMarkingModel");
		attachmentTubeSizeMarkingModel.setData([]);
		
		var oUploadTubeSizeMarkingModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadTubeSizeMarkingModel,"oUploadTubeSizeMarkingModel");
		
		
		//For Tube Size MouldMMYY Attachments
		var attachmentTubeMouldMMYYModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentTubeMouldMMYYModel,"attachmentTubeMouldMMYYModel");
		attachmentTubeMouldMMYYModel.setData([]);
		
		var oUploadTubeMouldMMYYModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadTubeMouldMMYYModel,"oUploadTubeMouldMMYYModel");
		
		//For Tube Major Defect Attachments
		var attachmentTubeMajorDefectModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentTubeMajorDefectModel,"attachmentTubeMajorDefectModel");
		attachmentTubeMajorDefectModel.setData([]);
		
		var oUploadTubeMajorDefectModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadTubeMajorDefectModel,"oUploadTubeMajorDefectModel");
		
		//For Tube Other Defect View Attachments
		var attachmentTubeOthDefectViewModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentTubeOthDefectViewModel,"attachmentTubeOthDefectViewModel");
		attachmentTubeOthDefectViewModel.setData([]);
		
		var oUploadTubeOthDefectViewModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		this.getView().setModel(oUploadTubeOthDefectViewModel,"oUploadTubeOthDefectViewModel");
	
},
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//open Initial Fragments for cust Mob no and Company
onAfterRendering: function() {
	var that = this;
	if(initialFlag){
			if (!that._InitialDialog) {
				
				that._InitialDialog = sap.ui.xmlfragment(
					"znewclaimdl.view.Intial", that);
				that.getView().addDependent(that._InitialDialog);}
			that._InitialDialog.open();
	}				
},
//********************************************************************************************************************
OnInitialFragOk:function(){
	debugger
	 CustPhoNo = sap.ui.getCore().byId("idCustMob").getValue();
	if(CustPhoNo == ""){
		sap.ui.getCore().byId("idCustMob").setValueState(sap.ui.core.ValueState.Error);
		return false;
	}else{
		sap.ui.getCore().byId("idCustMob").setValueState(sap.ui.core.ValueState.None);
		this.getTicketDetails();
	}
	 VechType = sap.ui.getCore().byId("idVehType").getValue();
	 itemType = sap.ui.getCore().byId("idItemType").getSelectedKey();
	 Bukrs    = sap.ui.getCore().byId("idCname").getSelectedKey();
	    if(itemType == "TYRE"){
	    	this.getView().byId("idTyreTable").setVisible(true);
	    	this.getView().byId("idTyreTable1").setVisible(true);
	    	this.getView().byId("idTubeTable").setVisible(false);
	    	this.getView().byId("idTubeTable1").setVisible(false);
	    } else if(itemType == "TUBE"){
	    	this.getView().byId("idTyreTable").setVisible(false);
	    	this.getView().byId("idTyreTable1").setVisible(false);
	    	this.getView().byId("idTubeTable").setVisible(true);
	    	this.getView().byId("idTubeTable1").setVisible(true);
	    }
	
	this.onDealerInfo();
	this._InitialDialog.close();
	this._InitialDialog.destroy(); 
	this._InitialDialog=undefined;
},
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Dealer Information
onDealerInfo : function(){
	debugger
	var that=this;
	var user = new sap.ushell.services.UserInfo();
	var uid = user.getId();
	var oViewObj = this.getView();
	var DealerInfoJModel = oViewObj.getModel("DealerInfoJModel");
	if (!DealerInfoJModel) { 
		DealerInfoJModel = new sap.ui.model.json.JSONModel();
		oViewObj.setModel(DealerInfoJModel, "DealerInfoJModel");
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	
	var fncSuccess = function(oData, oResponse){
		DealerInfoJModel.setData(oData);
		DealerName = DealerInfoJModel.oData.Name1;
		DepoCode = DealerInfoJModel.oData.Werks;
		Kunnr    = DealerInfoJModel.oData.Kunnr;
		DealerRegion = DealerInfoJModel.oData.DealerRegion;
		that.getView().byId("HeaderIdTit").setTitle("Create Claim" + "("+ DealerName +")");

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
	oReadModel.read("/GetDealerInfoSet(Uname='"+uid+"',Bukrs='"+Bukrs+"')", {
		success : fncSuccess,
		error : fncError
	});
	
},
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
getTicketDetails : function(){
	debugger
	var ticket  = "";
	var mobile  = sap.ui.getCore().byId("idCustMob").getValue();
	var that = this;		
	var sPathCartListSet = "/DealerTicketSearchSet?$filter=Kunnr eq '"+Kunnr+"' and TicketNo eq'"+ticket+"' and ITelf1 eq'"+CustPhoNo+"'";
		
	var frameworkODataModel = this.getOwnerComponent().getModel();
	var oParamsCartListSet = {};
	oParamsCartListSet.context = "";
	oParamsCartListSet.urlParameters = "";
	oParamsCartListSet.success = function(oData, oResponse) {	// success handler
		
		if(oData.results.length != 0){	
			TicketNo = oData.results[0].TicketNo;
			if (!that._TicketDetailHelpDialog) {
				that._TicketDetailHelpDialog = sap.ui.xmlfragment(
					"znewclaimdl.view.Ticket_DTL_Mobile", that);
				that.getView().addDependent(that._TicketDetailHelpDialog);								
			}
			var TicketListSetJModel = new sap.ui.model.json.JSONModel();
			that._TicketDetailHelpDialog.setModel(TicketListSetJModel, "TicketListSetJModel");
			TicketListSetJModel.setData(oData.results);
			that._TicketDetailHelpDialog.open();	
					
		}else{
			that.OnEnterMobileNo();
		}
		
/*
		if(oData.results.length == 0){
			sap.m.MessageToast.show("No Data Found.");	
		}*/
	};
	
	oParamsCartListSet.error = function(oError) {	// error handler
		jQuery.sap.log.error("read publishing group data failed");
		sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
	};
	frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	frameworkODataModel.attachRequestCompleted(function() {
	});
	
},
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
onWithoutTicket:function(){
	this._TicketDetailHelpDialog.close();
	this._TicketDetailHelpDialog.destroy(); 
	this._TicketDetailHelpDialog=undefined;
	this.OnEnterMobileNo();
},
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
OnEnterMobileNo : function(){
	debugger
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
        	/*if(that.data.d.Flag != "X"){
        	  that.OnDisableCustomerFields();
        	} */
        that.getView().byId("HedCustMob").setText("Mobile No : " + CustPhoNo);	
        that.getView().byId("HeaderIdTicketDt").setVisible(false);
       // that.getView().byId("idFitmentType").setSelectedKey("REP");
       
        if(jModel.oData.d.CustomerFname !=""){
        	   that.getView().byId("idCustName").setEnabled(false);
        }else{
        	that.getView().byId("idCustName").setEnabled(true);
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
	oReadModel.read("/DealerCustomerInfoSet(CustomerTelf1='"+ CustPhoNo + "')", { 
		success : fncSuccess,
		error : fncError
	});

},	

//*******************************************************************************************************************
//On Select Ticket No
onEnter : function() {
	debugger
	var that = this;
	var ticket = Ticket;
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_TICKET_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oReadModel.setHeaders({"Content-Type" : "application/atom+xml"});
	var fncSuccess = function(oData, oResponse){
		var ary = {
		"d" : oData
		} 
      var jModel = new sap.ui.model.json.JSONModel(ary);
      
      that.getView().setModel(jModel , "jModel");
      that.data = jModel.getData();
      state = oData.CustomerRegion;
      FitType = that.data.d.FitType;
		that.getView().byId("HeaderIdTicket").setText("Ticket No : " + that.data.d.ITicketNo); //set ticket no in title bar
		//that.OnDisableFields();
		that.onFitmentTypeChange();
	}	
					
	var fncError = function(oError) { // error callback	// function
		var parser = new DOMParser();
		var message = parser.parseFromString(oError.response.body, "text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
			title : "Error",
			icon : sap.m.MessageBox.Icon.ERROR,
		});
	}
	
	oReadModel.read("/GetTicketDataSet(ITicketNo='"
			+ ticket + "')", {
		success : fncSuccess,
		error : fncError
	});
}, 
//******************************************************************************************************************
displayTicktRequest: function(e){
	debugger
	var path = e.getSource().getBindingContext("TicketListSetJModel").getPath().split('/')[1]
	var data = e.getSource().getBindingContext("TicketListSetJModel").getModel().getData()[path];
	    Ticket = data.TicketNo;
	    this.getView().byId("HedCustMob").setText("Mobile No : " + data.ITelf1);
	this.onEnter();
	
	this._TicketDetailHelpDialog.close();
	this._TicketDetailHelpDialog.destroy(true);
	this._TicketDetailHelpDialog = undefined;
	},
//*******************************************************************************************************************
OnInitialFragCancel:function(){
	window.history.back();
},
//*******************************************************************************************************************
onFitmentChange:function(){
	debugger
	var fitment = this.getView().byId("idFitment").getSelectedKey();
	if(fitment =="OEM"){
		this.getView().byId("idFranchName").setVisible(true);
		this.getView().byId("idVehReg").setVisible(true);
		this.getView().byId("idKmsCvrd").setVisible(true);
		this.getView().byId("IdRC").setVisible(true);
	} else {
		this.getView().byId("idFranchName").setVisible(false);
		this.getView().byId("idVehReg").setVisible(false);
		this.getView().byId("idKmsCvrd").setVisible(false);
		this.getView().byId("IdRC").setVisible(false);
	}
},

//******************************************************************************************************************
onVehicleType : function(){
	debugger
	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleTypeSet";
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
		sap.ui.getCore().byId("idVehType").setValue(oSelectedItem.getTitle());
		//this.getView().byId("idCarManufact").setValue("").setEnabled(true);	
		//this.getView().byId("idVehMdl").setValue("");
		
		//this.getView().byId("idlblCarMnf").setRequired(true);
	}
},

//*******************************************************************************************************************
onCarManufact: function() {
	debugger
	//var VechKey = this.getView().byId("idVehType").getValue();		
	var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleMakeSet?$filter=Type eq '"+VechType+"'";
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
        this.getView().byId("idCarManufact").setValue(oSelectedItem.getTitle());
    } 
    this.getView().byId("idVehMdl").setValue("").setEnabled(true);
    
	this.getView().byId("idlblVehMdl").setRequired(true)
},

//******************************************************************************************************************
onVehicleModel: function() {
	debugger
	//var vechtype = this.getView().byId("idVehType").getValue();
	var VechMake = this.getView().byId("idCarManufact").getValue();
		
	var sPath  = "/sap/opu/odata/sap/ZCS_TICKET_SRV/HelpVehicleModelSet?$filter=Type eq '"+VechType+"' and Make eq '" + VechMake + "'";
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


//*******************************************************************************************************************
onRC:function(){
	debugger
	if(RCFlag){
		this._RCDialog = sap.ui.xmlfragment("znewclaimdl.view.RCFrag", this);
		this.getView().addDependent(this._RCDialog);
		this._RCDialog.open();
	}
	
},
OnRCOk:function(){
	debugger
	this._RCDialog.close();
	this._RCDialog.destroy(true);
	this._RCDialog = undefined;
},
//*****************************************************************************************************************
OnRCcancel:function(){
	debugger
	this._RCDialog.close();
	this._RCDialog.destroy(true);
	this._RCDialog = undefined;
},
//*****************************************************************************************************************

onAddNewRow:function(){
	debugger
	var data = [];
		data	 = AddRowJModel.getData();
		
		if(data.length >= 5){
			sap.m.MessageBox.show("Can not add more than 5 tyres.", {
            title: "WARNING",
            icon:sap.m.MessageBox.Icon.ERROR,
			});
			return;
		}
	
	var TblData = {};
		
		TblData.rowData1 	= "";
		TblData.rowData2 	= "";
		TblData.rowData3	= "";
		TblData.rowData4 	= "";
		TblData.rowData5 	= "";
		TblData.rowData6	= "";
		TblData.rowData7	= "";
		TblData.rowData8	= "";
		TblData.rowData9	= "";
		TblData.rowData10	= "";
		TblData.rowData11	= "";
		data.push(TblData);
		
		AddRowJModel.setData(data);
		AddRowJModel.refresh();

},

onRowDelete:function(oEvt){
	debugger
	var index = oEvt.getSource().getParent().getBindingContextPath().split('/')[1];
	if(index != ""){
		AddRowJModel.getData().splice(index,1);
		AddRowJModel.refresh();
	}
},

//*****************************************************************************************************************
OnTyrePhotos:function(oEvt){
	debugger
	RowIndex = oEvt.getSource().getParent().getBindingContextPath()[1];
	if(TyrePhptoFlag){
		this._TyrePhotosDialog = sap.ui.xmlfragment("znewclaimdl.view.TyrePhotosDialog", this);
		this.getView().addDependent(this._TyrePhotosDialog);
		this._TyrePhotosDialog.open();
	}
	
},

OnTyrePhotoOk:function(){
	debugger
	this._TyrePhotosDialog.close();
	this._TyrePhotosDialog.destroy(true);
	this._TyrePhotosDialog = undefined;
},
/*OnTyrePhotocancel:function(){
	debugger
	this._TyrePhotosDialog.close();
	this._TyrePhotosDialog.destroy(true);
	this._TyrePhotosDialog = undefined;
},*/

//******************************************************************************************************************

onDefectPhotos:function(oEvt){
	debugger
	RowIndex = oEvt.getSource().getParent().getBindingContextPath()[1];
	if(DefectPhotoFlag){
		this._DefectPhotosDialog = sap.ui.xmlfragment("znewclaimdl.view.DefectPhotosDialog", this);
		this.getView().addDependent(this._DefectPhotosDialog);
		this._DefectPhotosDialog.open();
	}
},

OnDefectPhotosOk:function(){
	debugger
	this._DefectPhotosDialog.close();
	this._DefectPhotosDialog.destroy(true);
	this._DefectPhotosDialog = undefined;
},

/*OnDefectPhotoscancel:function(){
	debugger
	this._DefectPhotosDialog.close();
	this._DefectPhotosDialog.destroy(true);
	this._DefectPhotosDialog = undefined;
},*/

//*******************************************************************************************************************
onTyrSize:function(oEvt){
	debugger
	sap.ui.getCore().byId("idTyrSize").addStyleClass("clText");
	sap.ui.getCore().byId("idicon1").addStyleClass("clText");
	sap.ui.getCore().byId("idTyrPattern").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon2").removeStyleClass("clText");
	sap.ui.getCore().byId("idTyrStencil").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon3").removeStyleClass("clText");
	
	this._TyreSizePhoDialog = sap.ui.xmlfragment("znewclaimdl.view.TyreSizePhoDialog", this);
	this.getView().addDependent(this._TyreSizePhoDialog);
	this.getAttachmentTsizeDetails();
	this._TyreSizePhoDialog.open();
},

OnTyreSizeOk:function(){
	this._TyreSizePhoDialog.close();
	this._TyreSizePhoDialog.destroy();
},

OnTyreSizecancel:function(){
	this._TyreSizePhoDialog.close();
	this._TyreSizePhoDialog.destroy(true);
	this._TyreSizePhoDialog = undefined;
},
//*******************************************************************************************************************
onTyrPattern:function(){
	debugger
	sap.ui.getCore().byId("idTyrSize").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon1").removeStyleClass("clText");
	sap.ui.getCore().byId("idTyrPattern").addStyleClass("clText");
	sap.ui.getCore().byId("idicon2").addStyleClass("clText");
	sap.ui.getCore().byId("idTyrStencil").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon3").removeStyleClass("clText");
	
	this._TyrePatternPhoDialog = sap.ui.xmlfragment("znewclaimdl.view.TyrePatternPhoDialog", this);
	this.getView().addDependent(this._TyrePatternPhoDialog);
	this.getAttachmentTpatternDetails();
	this._TyrePatternPhoDialog.open();
},

OnTyrePatternOk:function(){
	this._TyrePatternPhoDialog.close();
	this._TyrePatternPhoDialog.destroy();
},


OnTyrePatterncancel:function(){
	this._TyrePatternPhoDialog.close();
	this._TyrePatternPhoDialog.destroy(true);
	this._TyrePatternPhoDialog = undefined;
},
//******************************************************************************************************************
onTyrStencil:function(){
	debugger
	sap.ui.getCore().byId("idTyrSize").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon1").removeStyleClass("clText");
	sap.ui.getCore().byId("idTyrPattern").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon2").removeStyleClass("clText");
	sap.ui.getCore().byId("idTyrStencil").addStyleClass("clText");
	sap.ui.getCore().byId("idicon3").addStyleClass("clText");
	
	this._TyreStencilPhoDialog = sap.ui.xmlfragment("znewclaimdl.view.TyreStencilPhoDialog", this);
	this.getView().addDependent(this._TyreStencilPhoDialog);
	this.getAttachmentTstencilDetails();
	this._TyreStencilPhoDialog.open();
},

OnTyreStencilOk:function(){
	this._TyreStencilPhoDialog.close();
	this._TyreStencilPhoDialog.destroy();
},

OnTyreStencilcancel:function(){
	this._TyreStencilPhoDialog.close();
	this._TyreStencilPhoDialog.destroy(true);
	this._TyreStencilPhoDialog = undefined;
},
//*****************************************************************************************************************
onDFO:function(){
	debugger
	sap.ui.getCore().byId("idDFO").addStyleClass("clText");
	sap.ui.getCore().byId("idiconDFO").addStyleClass("clText");
	sap.ui.getCore().byId("idDFI").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconDFI").removeStyleClass("clText");
	sap.ui.getCore().byId("idAOD").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconAOD").removeStyleClass("clText");
	
	this._DefectOutSideDialog = sap.ui.xmlfragment("znewclaimdl.view.DefectOutSideDialog", this);
	this.getView().addDependent(this._DefectOutSideDialog);
	this.getAttachmentDefectOutsideDetails();
	this._DefectOutSideDialog.open();
},

OnDefectOutSideOk:function(){
	this._DefectOutSideDialog.close();
	this._DefectOutSideDialog.destroy(true);
	this._DefectOutSideDialog = undefined;
},

OnDefectOutSidecancel:function(){
	this._DefectOutSideDialog.close();
	this._DefectOutSideDialog.destroy(true);
	this._DefectOutSideDialog = undefined;
},
//******************************************************************************************************************
onDFI:function(){
	debugger
	sap.ui.getCore().byId("idDFO").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconDFO").removeStyleClass("clText");
	sap.ui.getCore().byId("idDFI").addStyleClass("clText");
	sap.ui.getCore().byId("idiconDFI").addStyleClass("clText");
	sap.ui.getCore().byId("idAOD").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconAOD").removeStyleClass("clText");
	
	this._DefectInSideDialog = sap.ui.xmlfragment("znewclaimdl.view.DefectInSideDialog", this);
	this.getView().addDependent(this._DefectInSideDialog);
	this.getAttachmentDefectInsideDetails();
	this._DefectInSideDialog.open();
},

OnDefectInsideOk:function(){
	this._DefectInSideDialog.close();
	this._DefectInSideDialog.destroy(true);
	this._DefectInSideDialog = undefined;
},

OnDefectInsidecancel:function(){
	this._DefectInSideDialog.close();
	this._DefectInSideDialog.destroy(true);
	this._DefectInSideDialog = undefined;
},
//******************************************************************************************************************
onAOD:function(){
	debugger
	sap.ui.getCore().byId("idDFO").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconDFO").removeStyleClass("clText");
	sap.ui.getCore().byId("idDFI").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconDFI").removeStyleClass("clText");
	sap.ui.getCore().byId("idAOD").addStyleClass("clText");
	sap.ui.getCore().byId("idiconAOD").addStyleClass("clText");
	
	this._DefectAnyOthDialog = sap.ui.xmlfragment("znewclaimdl.view.DefectAnyOtherDialog", this);
	this.getView().addDependent(this._DefectAnyOthDialog);
	this.getAttachmentDefectAnyothDetails();
	this._DefectAnyOthDialog.open();
},

OnDefectAnyOthOk:function(){
	this._DefectAnyOthDialog.close();
	this._DefectAnyOthDialog.destroy(true);
	this._DefectAnyOthDialog = undefined;
},

OnDefectAnyOthcancel:function(){
	this._DefectAnyOthDialog.close();
	this._DefectAnyOthDialog.destroy(true);
	this._DefectAnyOthDialog = undefined;
},

//*******************************************************************************************************************
OnReviewancel:function(){
	this._ReviewDialog.close();
	this._ReviewDialog.destroy(true);
	this._ReviewDialog = undefined;
},
//******************************************************************************************************************
onValidateStencil:function(evt)
{
	debugger
	that = this;
	this.event = evt.getSource();
	id = evt.getSource();
	
	var stencilNumber = evt.getSource().getValue();
	//var itemCode = evt.getSource().getParent().mAggregations.cells[0].getValue();
//Added on April 5		
	stencilNumber = stencilNumber.toUpperCase();
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
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
		stencilvalid = "";
		//prdWeek 	= oData.PrdWeek;
		//prdMonth 	= oData.PrdMonth;
		//prdYear 	= oData.PrdYear
		
		if (oData.Message != "") {
			that.stencilFlag = "";
			sap.m.MessageBox.show(oData.Message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
				onClose : function() {
					that.event.setValue("");
				}
			});
			stencilvalid = "X";
		}
		else{
			debugger
			that.stencilFlag = "X";
			id.getParent().getCells()[15].setValue(oData.PrdWeek);
			id.getParent().getCells()[16].setValue(oData.PrdMonth);
			id.getParent().getCells()[17].setValue(oData.PrdYear);

		}
	}
	oReadModel.read("ValidateStencilNumberSet(ClaimRecDepo='"+DepoCode+"',ItemCode='"+itemCode+"',StencilNo='"+stencilNumber+"')",
			{
		success : fncSuccess,
		error : fncError
	});
	

	var table = this.getView().byId("idTyreTable1");
	var len = table.getItems().length; 
	
	for(var i=0 ; i<len ; i++){
        
		var cells = table.getItems()[i].getCells();
		var stncl = table.getItems()[i].getCells()[4].getValue();
		var stlgn = stncl.length;
		
		if (stlgn!=5){
		for(var j=0 ; j<len ; j++){
			if( i !== j ){
				if((table.getItems()[i].getCells()[4].getValue() == table.getItems()[j].getCells()[4].getValue()) 
					&& (table.getItems()[i].getCells()[4].getValue() !== "") 
					&& (table.getItems()[j].getCells()[4].getValue() !== "")){
					evt.getSource().setValue("");
					sap.m.MessageToast.show("Duplicate Stencil Entered.");
				}
			}
		}
	  }				
	}
	
//	
},

//******************************************************************************************************************//
//Name with space
ValidateName : function(oEvent){ 

	/*var text1     = oEvent.getSource().getValue();
	this.getView().byId("idCustName").setValue(val.toUpperCase());*/
	
var text = oEvent.getSource().getValue();
var code = text.charCodeAt(text.length-1);
  
          if ( !(code > 64 && code < 91) && !(code > 96 && code < 123) && !(code == 32) ){ //point
                 text = text.substring( 0 , text.length - 1 );
            }                    
    oEvent.getSource().setValue(text.toUpperCase());       
  },
  
 //******************************************************************************************************************
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
  
 //*******************************************************************************************************************
onPatternType:function(evt){
	debugger
  this.TyreTypeCode=evt.getSource().getId();
 if(itemType =="TYRE"){
	 var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpTyreCodeSet?$filter=IClaimType eq 'WR10' and IRecvDepo eq '"+DepoCode+"' and Type eq '"+VechType+"'";		 
 }else{
	 var sPath = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/SearchHelpTubeCodeSet?$filter=IClaimType eq 'WR10' and IRecvDepo eq '"+DepoCode+"'";
 }
  //var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/SearchHelpDealerItemCodeSet?$filter=Bukrs eq '"+CName+"' and Type eq '"+type+"' and Kunnr eq '"+Kunnr+"' and IClaimItemType eq '"+ttype+"' and IClaimType eq 'SP10' and IRecvDepo eq '"+DepoCode+"'";
	
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false, "GET", false, false, null);
	
	var _valueHelpPatternSelectDialog = new sap.m.SelectDialog(
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
					oEvent.getSource().getBinding("items").filter([ oFilter ]);
				},
				confirm : [ this._handlePatternClose, this ],
				cancel : [ this._handlePatternClose, this ]
			});
	_valueHelpPatternSelectDialog.setModel(jModel);
	_valueHelpPatternSelectDialog.open();

},
_handlePatternClose : function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var TyreTypeCode = sap.ui.getCore().byId(this.TyreTypeCode);
	
	if (oSelectedItem) {
		var obj = oSelectedItem.getBindingContext().getObject();
		itemCode = obj.ItemCode;
	    if(itemType =="TYRE"){
			TyreTypeCode.getParent().getCells()[0].setValue(oSelectedItem.getTitle());
			TyreTypeCode.getParent().getCells()[1].setValue(obj.ItemCode);
			TyreTypeCode.getParent().getCells()[2].setValue(obj.Totnsd);
			TyreTypeCode.getParent().getCells()[4].setEnabled(true);
			TyreTypeCode.getParent().getCells()[5].setEnabled(true);
			TyreTypeCode.getParent().getCells()[6].setEnabled(true);
			TyreTypeCode.getParent().getCells()[7].setEnabled(true);
	    }else{
	    	TyreTypeCode.getParent().getCells()[0].setValue(oSelectedItem.getTitle());
			TyreTypeCode.getParent().getCells()[1].setValue(obj.ItemCode);
	    }
	}
},

//***************************************************************************************************************
onTyreSise:function(evt){
	debugger 
	 this.TyreSizeCode=evt.getSource().getId();
	var sPath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/F4TyreSizeSet";
	var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		
		var _valueHelpTsiseSelectDialog = new sap.m.SelectDialog(
				{

					title : "Select Tyre Code",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{ProdSize}",
									description:"{ProdDesc}",
									 customData: [{ 
										 Type:"sap.ui.core.CustomData",
										    key:"{ProdSize}",
										    value:"{ProdDesc}" 
										   }]	 
								}),
					},
					liveChange : function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("ProdSize",sap.ui.model.FilterOperator.Contains,sValue);
						oEvent.getSource().getBinding("items").filter([ oFilter ]);
					},
					confirm : [ this._handleTsizeClose, this ],
					cancel : [ this._handleTsizeClose, this ]
				});
		_valueHelpTsiseSelectDialog.setModel(jModel);
		_valueHelpTsiseSelectDialog.open();

},
_handleTsizeClose : function(oEvent) {
	debugger
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var TyreSizeCode = sap.ui.getCore().byId(this.TyreSizeCode);
	
	if (oSelectedItem) {
		var obj = oSelectedItem.getBindingContext().getObject();
		TyreSise = obj.ProdSize;
		TyreSizeCode.getParent().getCells()[3].setValue(oSelectedItem.getDescription());
		TyreSizeCode.getParent().getCells()[14].setValue(oSelectedItem.getTitle());
	}
},
//****************************************************************************************************************

onAverage:function(evt){
	debugger
	var text = evt.getSource().getValue();
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
	       evt.getSource().setValue(text);
	       
///////////
///////////Calculate NSD////////
	
			var nsd	 = evt.getSource().getParent().getCells()[2].getValue(); //Total NSD
			var nsd1 = evt.getSource().getParent().getCells()[5].getValue();
		   	var nsd2 = evt.getSource().getParent().getCells()[6].getValue();
		   	var nsd3 = evt.getSource().getParent().getCells()[7].getValue();
			
			
		   	evt.getSource().getParent().getCells()[5].setValueState("None");
			if(nsd1 != "" && (parseFloat(nsd1) > parseFloat(nsd)) ){ 	
	       			sap.m.MessageToast.show("NSD cannot be greater than Original NSD.");
	       			evt.getSource().getParent().getCells()[5].setValue("");
	       			evt.getSource().getParent().getCells()[5].setValueState("Error");
	       	}
			
			evt.getSource().getParent().getCells()[6].setValueState("None");
	       	if(nsd2 != "" && (parseFloat(nsd2) > parseFloat(nsd))){ 	
	       			sap.m.MessageToast.show("NSD cannot be greater than Original NSD.");
	       			evt.getSource().getParent().getCells()[6].setValue("");
	       			evt.getSource().getParent().getCells()[6].setValueState("Error");
	       	}
	       	
	       	evt.getSource().getParent().getCells()[7].setValueState("None");
	       	if(nsd3 != "" && (parseFloat(nsd3) > parseFloat(nsd))){ 	
	       			sap.m.MessageToast.show("NSD cannot be greater than Original NSD.");
	       			evt.getSource().getParent().getCells()[7].setValue("");
	       			evt.getSource().getParent().getCells()[7].setValueState("Error");
	       	}
       	
      
	   	var total = parseFloat(nsd1) + parseFloat(nsd2) + parseFloat(nsd3);
	   	var avg = total/3;
	   	var fixavg = avg.toFixed(1);
	   	
	   	var Wear = ( (nsd-fixavg)/nsd)*100 ;
	   	var PerWear = parseInt(Wear.toFixed(1));
	   	
	   	evt.getSource().getParent().getCells()[8].setValue(fixavg); // Avg NSD.
	   	evt.getSource().getParent().getCells()[9].setValue(PerWear); // % Wear
	   	
	   	
	  //for Mouse focus
	    if(nsd1!="" && nsd2==""){
	    	evt.getSource().getParent().getCells()[5].onfocusout();
	    	evt.getSource().getParent().getCells()[6].onfocusin();
	    }else if(nsd2!=""){
	    	evt.getSource().getParent().getCells()[6].onfocusout();
	    	evt.getSource().getParent().getCells()[7].onfocusin();
	    } 
	    

},
//*******************************************************************************************************************
ValidateFields:function(){
	debugger
	var check = true;
	//var vehType = this.getView().byId("idVehType").getValue()
	var VehMake = this.getView().byId("idCarManufact").getValue();
	var VehModel = this.getView().byId("idVehMdl").getValue();
	
	/*if(vehType==""){
		this.getView().byId("idVehType").setValueState("Error");
		check = false;
	} else {
		this.getView().byId("idVehType").setValueState("None");
	}*/
	
	if(VehMake==""){
		this.getView().byId("idCarManufact").setValueState("Error");
		check = false;
	} else {
		this.getView().byId("idCarManufact").setValueState("None");
	}
	
	if(VehModel==""){
		this.getView().byId("idVehMdl").setValueState("Error");
		check = false;
	} else {
		this.getView().byId("idVehMdl").setValueState("None");
	}
	
 if(itemType =="TYRE"){
	
	var getTable = this.getView().byId("idTyreTable1");
    tbllength = getTable.getItems().length;
    for(var i=0; i<tbllength; i++){

    	if(getTable.getItems()[i].getCells()[0].getValue()==""){
    		getTable.getItems()[i].getCells()[0].setValueState("Error");
    		check = false;
    	}else{
    		getTable.getItems()[i].getCells()[0].setValueState("None");
    	}

    	if(getTable.getItems()[i].getCells()[4].getValue()==""){
    		getTable.getItems()[i].getCells()[4].setValueState("Error");
    		check = false;
    	}else{
    		getTable.getItems()[i].getCells()[4].setValueState("None");
    	}

    	if(getTable.getItems()[i].getCells()[5].getValue()==""){
    		getTable.getItems()[i].getCells()[5].setValueState("Error");
    		check = false;
    	}else{
    		getTable.getItems()[i].getCells()[5].setValueState("None");
    	}

    	if(getTable.getItems()[i].getCells()[6].getValue()==""){
    		getTable.getItems()[i].getCells()[6].setValueState("Error");
    		check = false;
    	}else{
    		getTable.getItems()[i].getCells()[6].setValueState("None");
    	}

        if(getTable.getItems()[i].getCells()[7].getValue()==""){
    		getTable.getItems()[i].getCells()[7].setValueState("Error");
    		check = false;
    	}else{
    		getTable.getItems()[i].getCells()[7].setValueState("None");
    	}
	
    }
 } 
	
	return check;
},

//************************************************Add For TUBE**********************************************************
onAddNewTubeRow:function(){
	debugger
	var Tubedata = [];
		Tubedata = AddTubeRowJModel.getData();
	
	if(Tubedata.length >= 5){
		sap.m.MessageBox.show("Can not add more than 5 tubes.", {
        title: "WARNING",
        icon:sap.m.MessageBox.Icon.ERROR,
		});
		return;
	}

var TblTubeData = {};
	
	TblTubeData.rowPtrnType 	= "";
	TblTubeData.rowPtrnDesc 	= "";
	TblTubeData.rowVendorCode	= "";
	
	Tubedata.push(TblTubeData);
	
	AddTubeRowJModel.setData(Tubedata);
	AddTubeRowJModel.refresh();
},

onTubeRowDelete:function(oEvt){
	debugger
	var index = oEvt.getSource().getParent().getBindingContextPath().split('/')[1];
	if(index != ""){
		AddTubeRowJModel.getData().splice(index,1);
		AddTubeRowJModel.refresh();
	}
},
//***********************************************************************************************************
OnTubePhotos:function(oEvt){
	debugger
	RowIndex = oEvt.getSource().getParent().getBindingContextPath()[1];
	if(TyrePhptoFlag){
		this._TubePhotosDialog = sap.ui.xmlfragment("znewclaimdl.view.TubePhotosDialog", this);
		this.getView().addDependent(this._TubePhotosDialog);
		this._TubePhotosDialog.open();
	}
	
},

OnTubePhotoOk:function(){
	debugger
	this._TubePhotosDialog.close();
	this._TubePhotosDialog.destroy(true);
	this._TubePhotosDialog = undefined;
},
//***************************************************************************************************************
onTubeSizeMarking:function(oEvt){
	debugger
	sap.ui.getCore().byId("idTubeSizMarking").addStyleClass("clText");
	sap.ui.getCore().byId("idicon1").addStyleClass("clText");
	sap.ui.getCore().byId("idTubeMouldMMYY").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon2").removeStyleClass("clText");
	
	this._TubeSizeMarkingPhoDialog = sap.ui.xmlfragment("znewclaimdl.view.TubeSizeMarkingPhoDialog", this);
	this.getView().addDependent(this._TubeSizeMarkingPhoDialog);
	this.getAttachTubesizeMarkDetails();
	this._TubeSizeMarkingPhoDialog.open();
},

OnTubeSizeMarkingOk:function(){
	this._TubeSizeMarkingPhoDialog.close();
	this._TubeSizeMarkingPhoDialog.destroy();
},

OnTubeSizecMarkingancel:function(){
	this._TubeSizeMarkingPhoDialog.close();
	this._TubeSizeMarkingPhoDialog.destroy(true);
	this._TubeSizeMarkingPhoDialog = undefined;
},
//************************************************************************************************************
onTubeMouldMMYY:function(oEvt){
	debugger
	sap.ui.getCore().byId("idTubeSizMarking").removeStyleClass("clText");
	sap.ui.getCore().byId("idicon1").removeStyleClass("clText");
	sap.ui.getCore().byId("idTubeMouldMMYY").addStyleClass("clText");
	sap.ui.getCore().byId("idicon2").addStyleClass("clText");
	
	this._TubeMouldMMYYPhoDialog = sap.ui.xmlfragment("znewclaimdl.view.TubeMouldMMYYPhoDialog", this);
	this.getView().addDependent(this._TubeMouldMMYYPhoDialog);
	this.getAttachTubeMouldMMYYDetails();
	this._TubeMouldMMYYPhoDialog.open();
},

OnTubeMouldMMYYOk:function(){
	this._TubeMouldMMYYPhoDialog.close();
	this._TubeMouldMMYYPhoDialog.destroy();
},

OnTubeMouldMMYYcancel:function(){
	this._TubeMouldMMYYPhoDialog.close();
	this._TubeMouldMMYYPhoDialog.destroy(true);
	this._TubeMouldMMYYPhoDialog = undefined;
},

//*************************************************************************************************************
onTubeDefectPhotos:function(oEvt){
	debugger
	RowIndex = oEvt.getSource().getParent().getBindingContextPath()[1];
	if(DefectPhotoFlag){
		this._DefectTubePhotosDialog = sap.ui.xmlfragment("znewclaimdl.view.DefectTubePhotosDialog", this);
		this.getView().addDependent(this._DefectTubePhotosDialog);
		this._DefectTubePhotosDialog.open();
	}
},

OnDefectTubePhotosOk:function(){
	debugger
	this._DefectTubePhotosDialog.close();
	this._DefectTubePhotosDialog.destroy(true);
	this._DefectTubePhotosDialog = undefined;
},
//*************************************************************************************************************
onTubeMajorDefect:function(oEvt){
	debugger
	sap.ui.getCore().byId("idTubeMD").addStyleClass("clText");
	sap.ui.getCore().byId("idiconTubeMD").addStyleClass("clText");
	sap.ui.getCore().byId("idTubeODV").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconTubeODV").removeStyleClass("clText");
	
	this._TubeMajorDefectDialog = sap.ui.xmlfragment("znewclaimdl.view.TubeMajorDefectDialog", this);
	this.getView().addDependent(this._TubeMajorDefectDialog);
	this.getAttachTubeMajorDfctDetails();
	this._TubeMajorDefectDialog.open();
},

OnTubeMajorDefectOk:function(){
	this._TubeMajorDefectDialog.close();
	this._TubeMajorDefectDialog.destroy();
},

OnTubeMajorDefectcancel:function(){
	this._TubeMajorDefectDialog.close();
	this._TubeMajorDefectDialog.destroy(true);
	this._TubeMajorDefectDialog = undefined;
},
//*************************************************************************************************************
onOtherDefectView:function(oEvt){
	debugger
	sap.ui.getCore().byId("idTubeMD").removeStyleClass("clText");
	sap.ui.getCore().byId("idiconTubeMD").removeStyleClass("clText");
	sap.ui.getCore().byId("idTubeODV").addStyleClass("clText");
	sap.ui.getCore().byId("idiconTubeODV").addStyleClass("clText");
	
	this._TubeOtherDefectViewDialog = sap.ui.xmlfragment("znewclaimdl.view.TubeOtherDefectViewDialog", this);
	this.getView().addDependent(this._TubeOtherDefectViewDialog);
	this.getAttachTubeDfctViewDetails();
	this._TubeOtherDefectViewDialog.open();
},

OnTubeOtherDefectViewOk:function(){
	this._TubeOtherDefectViewDialog.close();
	this._TubeOtherDefectViewDialog.destroy();
},

OnTubeOtherDefectViewcancel:function(){
	this._TubeOtherDefectViewDialog.close();
	this._TubeOtherDefectViewDialog.destroy(true);
	this._TubeOtherDefectViewDialog = undefined;
},
//*******************************************************************************************************************
onClaimCreate:function(){
	debugger
	var validate = this.ValidateFields();
	if(!validate){
		sap.m.MessageBox.alert(
				"Please fill all The Required Fields.", {
				 icon: sap.m.MessageBox.Icon.WARNING,
				 title: "Error"
				 }
		 );
		return false;
	}
	
	
	var Data = {};
	//var file = this.getView().getModel("attachmentTSizeModel");
	var Phone = this.getView().byId("idPhone1").getValue();
	var CustName = this.getView().byId("idCustName").getValue();
	var FitTyp = this.getView().byId("idFitment").getSelectedKey();
	//var VehType = this.getView().byId("idVehType").getValue();
	var VehMake = this.getView().byId("idCarManufact").getValue();
	var VehModel = this.getView().byId("idVehMdl").getValue();
	if(FitTyp == "OEM"){
		var FranchName = this.getView().byId("idFranchName").getValue();
		var VechReg = this.getView().byId("idVehReg").getValue();
		var KmsCvrd = this.getView().byId("idKmsCvrd").getValue();
	} 
//	obj.filname   = file.oData[0].FileName;
	Data.TicketNo 		= TicketNo;
	Data.SubNo 			= "1";
	Data.CustomerLand1  = 'IN';
	Data.CustType       = '01';
	Data.ClaimTyp       = "WR10";
	Data.TicketSource   = "05"; 
	Data.Owner          = "02";
	Data.DealerCode     = Kunnr;
	Data.ClaimRecDepo   = DepoCode;
	Data.CustomerTelf1  = Phone;
	Data.CustomerName 	= CustName;
	Data.FitType    	= FitTyp
	Data.VehicleType	= VechType;
	Data.VehicleMake  	= VehMake;
	Data.VehicleModel  	= VehModel;
	
	Data.FranhiseName   = FranchName;
	Data.RegNo		  	= VechReg;
	Data.CustomerRegion = DealerRegion;
	if(FitTyp == "REP"){
		Data.KmsDone = "0"
	} else{
		Data.KmsDone = KmsCvrd;
	}
	
	Data.AIFlag = "X";
	
		//var TyreToImageNvg = [];
		//Data.RcptToTubeNvg  = [];
		//Data.TubeToImageNvg = [];
		//Data.RcptToFlapNvg  = [];
		//Data.FlapToImageNvg = [];
		
		
		var navImgArr=[];
		
	if(itemType == "TYRE"){
	
		var dataTSize = this.getView().getModel("attachmentTSizeModel").getData();
		for(var i=0; i<dataTSize.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataTSize[i].DocNo;
	    	obj.Extension = dataTSize[i].Extension;
	    	obj.FileName  = dataTSize[i].FileName;
	    	obj.ImageType = dataTSize[i].ImageType;
	    	obj.MimeType  = dataTSize[i].MimeType;
	    	obj.Row       = dataTSize[i].Row;
	    	obj.UpdateFlag = dataTSize[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataTPtrn = this.getView().getModel("attachmentTPtrnModel").getData();
		for(var i=0; i<dataTPtrn.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataTPtrn[i].DocNo;
	    	obj.Extension = dataTPtrn[i].Extension;
	    	obj.FileName  = dataTPtrn[i].FileName;
	    	obj.ImageType = dataTPtrn[i].ImageType;
	    	obj.MimeType  = dataTPtrn[i].MimeType;
	    	obj.Row       = dataTPtrn[i].Row;
	    	obj.UpdateFlag = dataTPtrn[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataTStencil = this.getView().getModel("attachmentTStencilModel").getData();
		for(var i=0; i<dataTStencil.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataTStencil[i].DocNo;
	    	obj.Extension = dataTStencil[i].Extension;
	    	obj.FileName  = dataTStencil[i].FileName;
	    	obj.ImageType = dataTStencil[i].ImageType;
	    	obj.MimeType  = dataTStencil[i].MimeType;
	    	obj.Row       = dataTStencil[i].Row;
	    	obj.UpdateFlag = dataTStencil[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataDoutSide = this.getView().getModel("attachmentDefectOutsideModel").getData();
		for(var i=0; i<dataDoutSide.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataDoutSide[i].DocNo;
	    	obj.Extension = dataDoutSide[i].Extension;
	    	obj.FileName  = dataDoutSide[i].FileName;
	    	obj.ImageType = dataDoutSide[i].ImageType;
	    	obj.MimeType  = dataDoutSide[i].MimeType;
	    	obj.Row       = dataDoutSide[i].Row;
	    	obj.UpdateFlag = dataDoutSide[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataDInSide = this.getView().getModel("attachmentDefectInsideModel").getData();
		for(var i=0; i<dataDInSide.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataDInSide[i].DocNo;
	    	obj.Extension = dataDInSide[i].Extension;
	    	obj.FileName  = dataDInSide[i].FileName;
	    	obj.ImageType = dataDInSide[i].ImageType;
	    	obj.MimeType  = dataDInSide[i].MimeType;
	    	obj.Row       = dataDInSide[i].Row;
	    	obj.UpdateFlag = dataDInSide[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataDAnyOth = this.getView().getModel("attachmentDefectAnyOtherModel").getData();
		
		for(var i=0; i<dataDAnyOth.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataDAnyOth[i].DocNo;
	    	obj.Extension = dataDAnyOth[i].Extension;
	    	obj.FileName  = dataDAnyOth[i].FileName;
	    	obj.ImageType = dataDAnyOth[i].ImageType;
	    	obj.MimeType  = dataDAnyOth[i].MimeType;
	    	obj.Row       = dataDAnyOth[i].Row;
	    	obj.UpdateFlag = dataDAnyOth[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		//push value in RcptToTyreNvg
		Data.RcptToTyreNvg=[];
		var table = this.getView().byId("idTyreTable1");
		var len   = table.getItems().length;
			for(var i=0; i<len; i++){
				var obj={};
				obj.TyreToImageNvg = [];
				obj.ItemCode    = table.getItems()[i].getCells()[1].getValue();
				obj.TotalNsd    = table.getItems()[i].getCells()[2].getValue();
				//obj.TyreSize    = table.getItems()[i].getCells()[3].getValue();
				obj.StnclNumber = table.getItems()[i].getCells()[4].getValue().toUpperCase();
				obj.Nsd1        = table.getItems()[i].getCells()[5].getValue();
				obj.Nsd2        = table.getItems()[i].getCells()[6].getValue();
				obj.Nsd3		= table.getItems()[i].getCells()[7].getValue();
				obj.Nsd			= table.getItems()[i].getCells()[8].getValue();
				obj.PercentageWear = table.getItems()[i].getCells()[9].getValue();
				obj.ItemRemark		= table.getItems()[i].getCells()[10].getValue();
				obj.ProdSize    = table.getItems()[i].getCells()[14].getValue(); //t size
				obj.PrdWeek    	= table.getItems()[i].getCells()[15].getValue();
				obj.PrdMonth    = table.getItems()[i].getCells()[16].getValue();
				obj.PrdYear    	= table.getItems()[i].getCells()[17].getValue();
				Data.RcptToTyreNvg.push(obj);//push data in tyre table			
			}
			
			
			//Push value in TyreToImageNvg
			for(var j=0; j<Data.RcptToTyreNvg.length; j++){
				for(var k=0; k<navImgArr.length; k++){
					 if(navImgArr[k].Row == j ){
					 	var obj = {}
					 	obj.DocNo = navImgArr[k].DocNo;
					 	obj.Extension = navImgArr[k].Extension;
					 	obj.FileName = navImgArr[k].FileName;
					 	obj.ImageType = navImgArr[k].ImageType;
					 	obj.MimeType = navImgArr[k].MimeType;
					 	obj.UpdateFlag = navImgArr[k].UpdateFlag;
					 	
	                	Data.RcptToTyreNvg[j].TyreToImageNvg.push(obj);
	                }
				}
			}
			
	} else if(itemType == "TUBE"){
		debugger
		var dataTubeSizeMarking = this.getView().getModel("attachmentTubeSizeMarkingModel").getData();
		for(var i=0; i<dataTubeSizeMarking.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataTubeSizeMarking[i].DocNo;
	    	obj.Extension = dataTubeSizeMarking[i].Extension;
	    	obj.FileName  = dataTubeSizeMarking[i].FileName;
	    	obj.ImageType = dataTubeSizeMarking[i].ImageType;
	    	obj.MimeType  = dataTubeSizeMarking[i].MimeType;
	    	obj.Row       = dataTubeSizeMarking[i].Row;
	    	obj.UpdateFlag = dataTubeSizeMarking[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataTubeSizeMarking = this.getView().getModel("attachmentTubeMouldMMYYModel").getData();
		for(var i=0; i<dataTubeSizeMarking.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataTubeSizeMarking[i].DocNo;
	    	obj.Extension = dataTubeSizeMarking[i].Extension;
	    	obj.FileName  = dataTubeSizeMarking[i].FileName;
	    	obj.ImageType = dataTubeSizeMarking[i].ImageType;
	    	obj.MimeType  = dataTubeSizeMarking[i].MimeType;
	    	obj.Row       = dataTubeSizeMarking[i].Row;
	    	obj.UpdateFlag = dataTubeSizeMarking[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataTubeSizeMarking = this.getView().getModel("attachmentTubeMajorDefectModel").getData();
		for(var i=0; i<dataTubeSizeMarking.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataTubeSizeMarking[i].DocNo;
	    	obj.Extension = dataTubeSizeMarking[i].Extension;
	    	obj.FileName  = dataTubeSizeMarking[i].FileName;
	    	obj.ImageType = dataTubeSizeMarking[i].ImageType;
	    	obj.MimeType  = dataTubeSizeMarking[i].MimeType;
	    	obj.Row       = dataTubeSizeMarking[i].Row;
	    	obj.UpdateFlag = dataTubeSizeMarking[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		var dataTubeSizeMarking = this.getView().getModel("attachmentTubeOthDefectViewModel").getData();
		for(var i=0; i<dataTubeSizeMarking.length; i++){
	    	var obj={}
	    	obj.DocNo     = dataTubeSizeMarking[i].DocNo;
	    	obj.Extension = dataTubeSizeMarking[i].Extension;
	    	obj.FileName  = dataTubeSizeMarking[i].FileName;
	    	obj.ImageType = dataTubeSizeMarking[i].ImageType;
	    	obj.MimeType  = dataTubeSizeMarking[i].MimeType;
	    	obj.Row       = dataTubeSizeMarking[i].Row;
	    	obj.UpdateFlag = dataTubeSizeMarking[i].UpdateFlag;
	    	navImgArr.push(obj);

	    }
		
		//push value in RcptToTyreNvg
		Data.RcptToTubeNvg=[];
		var table = this.getView().byId("idTubeTable1");
		var len   = table.getItems().length;
			for(var i=0; i<len; i++){
				var obj={};
				obj.TubeToImageNvg = [];
				obj.ClaimNo = "";
				obj.Lifnr    = "";
				obj.ItemCode = table.getItems()[i].getCells()[1].getValue();
				obj.Batch 	 = "";
				Data.RcptToTubeNvg.push(obj);//push data in Tube table			
			}
		
		//Push value in TubeToImageNvg
		for(var j=0; j<Data.RcptToTubeNvg.length; j++){
			for(var k=0; k<navImgArr.length; k++){
				 if(navImgArr[k].Row == j ){
				 	var obj = {}
				 	obj.DocNo = navImgArr[k].DocNo;
				 	obj.Extension = navImgArr[k].Extension;
				 	obj.FileName = navImgArr[k].FileName;
				 	obj.ImageType = navImgArr[k].ImageType;
				 	obj.MimeType = navImgArr[k].MimeType;
				 	obj.UpdateFlag = navImgArr[k].UpdateFlag;
				 	
                	Data.RcptToTubeNvg[j].TubeToImageNvg.push(obj);
                }
			}
		}
		
	}		
			

		//Data.RcptToTyreNvg[0].TyreToImageNvg = navImgArr;
		
	
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({"Content-Type": "application/atom+xml"});
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
			        	
			        	//window.history.back();
			        	//window.location.reload();
			        	debugger 
			        	window.location.reload();
			        	//that.saveUploadedRCDocs(oData.RcptToTyreNvg.results[0].ClaimNo);
			        	
			        	/*for(var i=0; i<oData.RcptToTyreNvg.results.length; i++){
			        		if(oData.FitType == "OEM"){
			        			that.saveUploadedRCDocs(i,oData.RcptToTyreNvg.results[i].ClaimNo);
			        		}
			        		that.saveUploadedTsizeDocs(i,oData.RcptToTyreNvg.results[i].ClaimNo);
				        	that.saveUploadedTpatrnDocs(i,oData.RcptToTyreNvg.results[i].ClaimNo);
				        	that.saveUploadedTstencilDocs(i,oData.RcptToTyreNvg.results[i].ClaimNo);
				        	
				        	that.saveUploadedDefectOutsideDocs(i,oData.RcptToTyreNvg.results[i].ClaimNo);
				        	that.saveUploadedDefectInsideDocs(i,oData.RcptToTyreNvg.results[i].ClaimNo);
				        	that.saveUploadedDefectAnyOtherDocs(i,oData.RcptToTyreNvg.results[i].ClaimNo);
				        	window.location.reload();
			        	}*/
			        	
			        }
			    });
				}
			}
		
		var fncError = function(oError) { //error callback function
			var parser = new DOMParser();
			//var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(parser, {
		        title: "Error",
		        icon:sap.m.MessageBox.Icon.ERROR,
		    });
		}
		//Create Method for final Save
		oCreateModel1.create("/ModifyReceiptNoSet", Data, {
			success: fncSuccess,
			error: fncError
		});

},

//************************************************File Upload *********************************************************
//************************************************Upload RC************************************************************
onRCAttachUpload: function(oEvent){
	debugger
	var oFileUploader = oEvent.getSource();		
	
    var _that = this;
    var csrf = _that.getCSRFToken();
    
    var oUploadCollection = oEvent.getSource();
    var oCustomerHeaderToken = new UploadCollectionParameter({
	name : "x-csrf-token",
	value : _that.token
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

onRCBeforeUploadStarts : function(oEvent) {
	debugger
	extension = "";
    var oVal = oEvent.getParameter("value");	    

    var fileName = oEvent.getParameter("fileName");
    var oSlug = fileName;
        extension = fileName.split(".")[1]; //Get file Extension

    // Header Slug
    var oCustomerHeaderSlug = new UploadCollectionParameter({
	name : "slug",
	value : oSlug
    });
    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
},
    
onRCUploadComplete : function(oEvent) {
	debugger
	var that = this;
    var oUploadCollection = oEvent.getSource();
    var oResData = oEvent.getParameter("files")[0];
    if (oResData.status == "201") {
	var oData = oUploadCollection.getModel("oUploadRCModel").getData();
	
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
	    //"Row" : RowIndex, //Add Manual row index
	    "ImageType":"07",
	    "Extension" : extension,
	    	
	});	
	
	debugger
	var uploadDetails= {};
	uploadDetails.FileName = oResData.fileName
	uploadDetails.DocNo = docId;
	uploadDetails.ImageType = "07";
	uploadDetails.Extension = extension;
	uploadDetails.UpdateFlag= "";
	uploadDetails.MimeType = oResData.headers["content-mimetype"]
	//uploadDetails.Row= RowIndex; //Add Manual row index
	var model = that.getView().getModel("attachmentRCModel");
	//var model = that._TyrePhotosDialog.getModel("attachmentRCModel")
	var data = model.getData();
	data.push(uploadDetails);

	oUploadCollection.getModel("oUploadRCModel").refresh();

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


/*    onRCTypeMissmatch: function(oEvent){
	debugger
	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
	return false;
},*/


onRCFileDeleted : function(oEvent) {
	debugger
    var oSrc = oEvent.getSource();
    var uploadModel = oSrc.getModel("oUploadRCModel");
    var uItems = uploadModel.getProperty("/items");
    var oItem = oEvent.getParameter("item");
    var oContext = oItem.getBindingContext("oUploadRCModel")
    if (!oContext) {
      uploadModel.setProperty("/items", uItems);
      return;
    }
    var sPath = oContext.getPath();
    var sIndex = sPath.split("/").pop();
    var docId = oEvent.getParameter("documentId");
    
    uItems.splice(sIndex,1);
    uploadModel.refresh();
        
    var data = that.getView().getModel("attachmentRCModel").getData();
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

  getAttachmentRCDetails: function(selectedGuId){        //document upload
	  debugger
		var oView = this.getView();
		var oUploadRCModel = this.getView().getModel("oUploadRCModel");
		var model = this.getView().getModel("attachmentRCModel");
		oUploadRCModel.setData({items:[]});
		
		var modeldata = this.getView().getModel("attachmentRCModel").getData();
		var host = window.location.host;
		var protocol = window.location.protocol;
		var urlprefix = protocol + "//" + host;	
		
		for (var i=0;i<modeldata.length;i++){
			   if(modeldata[i].Row == RowIndex){
				var uploadDetails= {};
				uploadDetails.FileName = modeldata[i].FileName;
				uploadDetails.DocNo= modeldata[i].DocNo;
				uploadDetails.UpdateFlag= "";
				uploadDetails.MimeType = modeldata[i].MimeType;
				uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
				//
				//uploadDetails.NoDelete = modeldata[i].NoDelete;
				//
				var data = oUploadRCModel.getData();
				data.items.push(uploadDetails);	 
				
			this.getView().getModel("oUploadRCModel").refresh();	
			   }
		}
		
	},
	
	saveUploadedRCDocs: function(i,ReqGuid){  // document upload
		debugger
		var payload = that.createRCPayload(i,ReqGuid);
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
	
	createRCPayload: function(i,ReqGuid){              // document upload
		debugger
		var payload={
				ObjectID: "06",
				ObjectName: ReqGuid,
				Error:"",
				Message:"",
		}
		var navArr=[];
		var data = that.getView().getModel("attachmentRCModel").getData()[i];
		//for(var i=0;i<data.length;i++){
			var obj={};
			obj.FileName 	= data.FileName;
			obj.DocNo 		= data.DocNo;
			obj.UpdateFlag 	= data.UpdateFlag;
			obj.MimeType 	= data.MimeType;
			obj.ImageType	= "07";
			obj.Extension	= data.Extension;
			navArr.push(obj);
		//}
		
		payload.ImageObjectToDataNvg = navArr;
		return payload;
	},
//*********************************************Upload Tyre Size Image************************************************		
	onTSizeAttachUpload: function(oEvent){
			debugger
			var oFileUploader = oEvent.getSource();		
			
		    var _that = this;
		    var csrf = _that.getCSRFToken();
		    
		    var oUploadCollection = oEvent.getSource();
		    var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	    onTSizeBeforeUploadStarts : function(oEvent) {
			debugger
			extension = "";
		    var oVal = oEvent.getParameter("value");	    
	    
		    var fileName = oEvent.getParameter("fileName");
		    var oSlug = fileName;
		        extension = fileName.split(".")[1]; //Get file Extension

		    // Header Slug
		    var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
		    });
		    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		    
		onTsizeUploadComplete : function(oEvent) {
			debugger
			var that = this;
		    var oUploadCollection = oEvent.getSource();
		    var oResData = oEvent.getParameter("files")[0];
		    if (oResData.status == "201") {
			var oData = oUploadCollection.getModel("oUploadTSizeModel").getData();
			
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
			    "Row" : RowIndex, //Add Manual row index
			    "ImageType":"01",
			    "Extension" : extension,
			});	
			
			debugger
			var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.ImageType= "01";
			uploadDetails.Extension= extension;
			uploadDetails.UpdateFlag= "";
			uploadDetails.MimeType = oResData.headers["content-mimetype"]
			uploadDetails.Row= RowIndex; //Add Manual row index
			var model = that.getView().getModel("attachmentTSizeModel");
			//var model = that._TyrePhotosDialog.getModel("attachmentTSizeModel")
			var data = model.getData();
			data.push(uploadDetails);
			
			//for disable upload button.
			if(data.length > 0){
				sap.ui.getCore().byId("idTSizeUploadCollection").setUploadEnabled(false);
			} else {
				sap.ui.getCore().byId("idTSizeUploadCollection").setUploadEnabled(true);
			}
			
			oUploadCollection.getModel("oUploadTSizeModel").refresh();

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
		
	   
	/*    onTSizeTypeMissmatch: function(oEvent){
	    	debugger
	    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
	    	return false;
	    },*/
	    
	   
		onTSizeFileDeleted : function(oEvent) {
	    	debugger 
	        var oSrc = oEvent.getSource();
	        var uploadModel = oSrc.getModel("oUploadTSizeModel");
	        var uItems = uploadModel.getProperty("/items");
	        var oItem = oEvent.getParameter("item");
	        var oContext = oItem.getBindingContext("oUploadTSizeModel")
	        if (!oContext) {
	          uploadModel.setProperty("/items", uItems);
	          return;
	        }
	        var sPath = oContext.getPath();
	        var sIndex = sPath.split("/").pop();
	        var docId = oEvent.getParameter("documentId");
	        
	        uItems.splice(sIndex,1);
	        uploadModel.refresh();
	            
	        var data = this.getView().getModel("attachmentTSizeModel").getData();
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
	
	      getAttachmentTsizeDetails: function(selectedGuId){        //document upload
	    	  debugger
				var oView = this.getView();
				var oUploadTSizeModel = this.getView().getModel("oUploadTSizeModel");
				var model = this.getView().getModel("attachmentTSizeModel");
				oUploadTSizeModel.setData({items:[]});
				
				var modeldata = this.getView().getModel("attachmentTSizeModel").getData();
				var host = window.location.host;
				var protocol = window.location.protocol;
				var urlprefix = protocol + "//" + host;	
				
				for (var i=0;i<modeldata.length;i++){
					   if(modeldata[i].Row == RowIndex){
						var uploadDetails= {};
						uploadDetails.FileName = modeldata[i].FileName;
						uploadDetails.DocNo= modeldata[i].DocNo;
						uploadDetails.UpdateFlag= "";
						uploadDetails.MimeType = modeldata[i].MimeType;
						uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
						//
						//uploadDetails.NoDelete = modeldata[i].NoDelete;
						//
						var data = oUploadTSizeModel.getData();
						data.items.push(uploadDetails);	 
						
					this.getView().getModel("oUploadTSizeModel").refresh();	
					   }
				}
				
			},
			
			saveUploadedTsizeDocs: function(i,ReqGuid){  // document upload
				debugger
				var payload = that.createTsizePayload(i,ReqGuid);
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
			
			createTsizePayload: function(i,ReqGuid){              // document upload
				debugger
				var payload={
						ObjectID: "06",
						ObjectName: ReqGuid,
						Error:"",
						Message:"",
				}
				var navArr=[];
				var data = that.getView().getModel("attachmentTSizeModel").getData()[i];
				//for(var i=0;i<data.length;i++){
					var obj={};
					obj.FileName 	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "01";
					obj.Extension	= data.Extension;
					navArr.push(obj);
				//}
				
				payload.ImageObjectToDataNvg = navArr;
				return payload;
			},
//*********************************************Finished Upload Tyre Size Image***************************************
			
//*********************************************Upload Tyre Pattern Image************************************************		
			onTPtrnAttachUpload: function(oEvent){
					debugger
					var oFileUploader = oEvent.getSource();		
					
				    var _that = this;
				    var csrf = _that.getCSRFToken();
				    
				    var oUploadCollection = oEvent.getSource();
				    var oCustomerHeaderToken = new UploadCollectionParameter({
					name : "x-csrf-token",
					value : _that.token
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

			    onTPtrnBeforeUploadStarts : function(oEvent) {
					debugger
					extension = "";
				    var oVal = oEvent.getParameter("value");	    
			    
				    var fileName = oEvent.getParameter("fileName");
				    var oSlug = fileName;
				    extension = fileName.split(".")[1]; //Get file Extension

				    // Header Slug
				    var oCustomerHeaderSlug = new UploadCollectionParameter({
					name : "slug",
					value : oSlug
				    });
				    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
				},
				    
				onTPtrnUploadComplete : function(oEvent) {
					debugger
					var that = this;
				    var oUploadCollection = oEvent.getSource();
				    var oResData = oEvent.getParameter("files")[0];
				    if (oResData.status == "201") {
					var oData = oUploadCollection.getModel("oUploadTPtrnModel").getData();
					
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
					    "Row" : RowIndex, //Add Manual Row index
					    "ImageType":"02",
					    "Extension" : extension,
					});	
					
					debugger
					var uploadDetails= {};
					uploadDetails.FileName = oResData.fileName
					uploadDetails.DocNo= docId;
					uploadDetails.ImageType= "02";
					uploadDetails.Extension= extension;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = oResData.headers["content-mimetype"]
					uploadDetails.Row= RowIndex; //Add Manual row index
					var model = that.getView().getModel("attachmentTPtrnModel");
					//var model = that._TyrePhotosDialog.getModel("attachmentTPtrnModel")
					var data = model.getData();
					data.push(uploadDetails);
					
					//for enable upload button.
					if(data.length > 0){
						sap.ui.getCore().byId("idTPtrnUploadCollection").setUploadEnabled(false);
					} else {
						sap.ui.getCore().byId("idTPtrnUploadCollection").setUploadEnabled(true);
					}
					oUploadCollection.getModel("oUploadTPtrnModel").refresh();

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
				
			   
			/*    onTPtrnTypeMissmatch: function(oEvent){
			    	debugger
			    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
			    	return false;
			    },*/
			    
			   
				onTPtrnFileDeleted : function(oEvent) {
			    	debugger
			        var oSrc = oEvent.getSource();
			        var uploadModel = oSrc.getModel("oUploadTPtrnModel");
			        var uItems = uploadModel.getProperty("/items");
			        var oItem = oEvent.getParameter("item");
			        var oContext = oItem.getBindingContext("oUploadTPtrnModel")
			        if (!oContext) {
			          uploadModel.setProperty("/items", uItems);
			          return;
			        }
			        var sPath = oContext.getPath();
			        var sIndex = sPath.split("/").pop();
			        var docId = oEvent.getParameter("documentId");
			        
			        uItems.splice(sIndex,1);
			        uploadModel.refresh();
			            
			        var data = that.getView().getModel("attachmentTPtrnModel").getData();
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
			
			      getAttachmentTpatternDetails: function(selectedGuId){        //document upload
			    	  debugger
						var oView = this.getView();
						var oUploadTPaternModel = this.getView().getModel("oUploadTPtrnModel");
						var model = this.getView().getModel("attachmentTPtrnModel");
						oUploadTPaternModel.setData({items:[]});
						
						var modeldata = this.getView().getModel("attachmentTPtrnModel").getData();
						var host = window.location.host;
						var protocol = window.location.protocol;
						var urlprefix = protocol + "//" + host;	
						
						for (var i=0;i<modeldata.length;i++){
							   if(modeldata[i].Row == RowIndex){
								var uploadDetails= {};
								uploadDetails.FileName = modeldata[i].FileName;
								uploadDetails.DocNo= modeldata[i].DocNo;
								uploadDetails.UpdateFlag= "";
								uploadDetails.MimeType = modeldata[i].MimeType;
								uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
								//
								//uploadDetails.NoDelete = modeldata[i].NoDelete;
								//
								var data = oUploadTPaternModel.getData();
								data.items.push(uploadDetails);	 
								
							this.getView().getModel("oUploadTPtrnModel").refresh();	
							   }
						}
					},
					
					saveUploadedTpatrnDocs: function(i,ReqGuid){  // document upload
						debugger
						var payload = that.createTpatrnPayload(i,ReqGuid);
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
					
					createTpatrnPayload: function(i,ReqGuid){              // document upload
						debugger
						var payload={
								ObjectID: "06",
								ObjectName: ReqGuid,
								Error:"",
								Message:"",
						}
						var navArr=[];
						var data = that.getView().getModel("attachmentTPtrnModel").getData()[i];
						//for(var i=0;i<data.length;i++){
							var obj={};
							obj.FileName	= data.FileName;
							obj.DocNo 		= data.DocNo;
							obj.UpdateFlag 	= data.UpdateFlag;
							obj.MimeType 	= data.MimeType;
							obj.ImageType	= "02";
							obj.Extension	= data.Extension;
							navArr.push(obj);
						//}
						
						payload.ImageObjectToDataNvg = navArr;
						return payload;
					},
//*********************************************Upload Tyre Stencil Image************************************************		
	onTStencilAttachUpload: function(oEvent){
		debugger
		var oFileUploader = oEvent.getSource();		
		var _that = this;
		var csrf = _that.getCSRFToken();
						    
		var oUploadCollection = oEvent.getSource();
		var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	onTStencilBeforeUploadStarts : function(oEvent) {
		debugger
		extension = "";
		var oVal = oEvent.getParameter("value");	    
					    
		var fileName = oEvent.getParameter("fileName");
		var oSlug = fileName;
			extension = fileName.split(".")[1]; //Get file Extension


		// Header Slug
		var oCustomerHeaderSlug = new UploadCollectionParameter({
				name : "slug",
				value : oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
	},
						    
	onTStencilUploadComplete : function(oEvent) {
		debugger
		var that = this;
		var oUploadCollection = oEvent.getSource();
		var oResData = oEvent.getParameter("files")[0];
			if (oResData.status == "201") {
				var oData = oUploadCollection.getModel("oUploadTStencilModel").getData();
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
						"Row" : RowIndex, //Add Manual row index
						 "ImageType":"03",
						  "Extension" : extension,

						
					});	
							
					debugger
				var uploadDetails= {};
					uploadDetails.FileName = oResData.fileName
					uploadDetails.DocNo= docId;
					uploadDetails.ImageType= "03";
					uploadDetails.Extension= extension;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = oResData.headers["content-mimetype"];
					uploadDetails.Row= RowIndex; //Add Manual row index
				var model = that.getView().getModel("attachmentTStencilModel");
				//var model = that._TyrePhotosDialog.getModel("attachmentTStencilModel")
				var data = model.getData();
					data.push(uploadDetails);
					
					//for enable upload button.
					if(data.length > 0){
						sap.ui.getCore().byId("idTStencilUploadCollection").setUploadEnabled(false);
					} else {
						sap.ui.getCore().byId("idTStencilUploadCollection").setUploadEnabled(true);
					}
					
					
					oUploadCollection.getModel("oUploadTStencilModel").refresh();
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
						
	/*onTStencilTypeMissmatch: function(oEvent){
		debugger
		sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
		return false;
	},*/
	
	onTStencilFileDeleted : function(oEvent) {
		debugger
		var oSrc = oEvent.getSource();
		var uploadModel = oSrc.getModel("oUploadTStencilModel");
		var uItems = uploadModel.getProperty("/items");
		var oItem = oEvent.getParameter("item");
		var oContext = oItem.getBindingContext("oUploadTStencilModel")
			if (!oContext) {
				 uploadModel.setProperty("/items", uItems);
				return;
			 }
		var sPath = oContext.getPath();
		var sIndex = sPath.split("/").pop();
		var docId = oEvent.getParameter("documentId");
			uItems.splice(sIndex,1);
			uploadModel.refresh();
		var data = that.getView().getModel("attachmentTStencilModel").getData();
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
					
	getAttachmentTstencilDetails: function(selectedGuId){        //document upload
		debugger
		 debugger
			var oView = this.getView();
			var oUploadTStencilModel = this.getView().getModel("oUploadTStencilModel");
			var model = this.getView().getModel("attachmentTStencilModel");
			oUploadTStencilModel.setData({items:[]});
			
			var modeldata = this.getView().getModel("attachmentTStencilModel").getData();
			var host = window.location.host;
			var protocol = window.location.protocol;
			var urlprefix = protocol + "//" + host;	
			
			for (var i=0;i<modeldata.length;i++){
				   if(modeldata[i].Row == RowIndex){
					var uploadDetails= {};
					uploadDetails.FileName = modeldata[i].FileName;
					uploadDetails.DocNo= modeldata[i].DocNo;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = modeldata[i].MimeType;
					uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
					//
					//uploadDetails.NoDelete = modeldata[i].NoDelete;
					//
					var data = oUploadTStencilModel.getData();
					data.items.push(uploadDetails);	 
					
				this.getView().getModel("oUploadTStencilModel").refresh();	
				   }
			}
	},
							
	saveUploadedTstencilDocs: function(i,ReqGuid){  // document upload
		debugger
		var payload = that.createTstencilPayload(i,ReqGuid);
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
							
	createTstencilPayload: function(i,ReqGuid){              // document upload
		debugger
		var payload={
				ObjectID: "06",
				ObjectName: ReqGuid,
				Error:"",
				Message:"",
			}
		var navArr=[];
		var data = that.getView().getModel("attachmentTStencilModel").getData()[i];
			//for(var i=0;i<data.length;i++){
				var obj={};
					obj.FileName	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "03";
					obj.Extension	= data.Extension;
					navArr.push(obj);
			//}
								
			payload.ImageObjectToDataNvg = navArr;
			return payload;
	},
							
//*********************************************Upload Defect Outside Image************************************************		
	onDefectOutsideAttachUpload: function(oEvent){
		debugger
		var oFileUploader = oEvent.getSource();		
		var _that = this;
		var csrf = _that.getCSRFToken();
		var oUploadCollection = oEvent.getSource();
		var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	onBeforeUploadDefectOutSideStarts : function(oEvent) {
		debugger
		extension = "";
		var oVal = oEvent.getParameter("value");	    
		var fileName = oEvent.getParameter("fileName");
		var oSlug = fileName;
			extension = fileName.split(".")[1]; //Get file Extension
		// Header Slug
		var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			},
								    
	onUploadDefectOutSideComplete : function(oEvent) {
		debugger
		var that = this;
		var oUploadCollection = oEvent.getSource();
		var oResData = oEvent.getParameter("files")[0];
		if (oResData.status == "201") {
		var oData = oUploadCollection.getModel("oUploadDefectOutsideModel").getData();
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
			"Row" : RowIndex, //Add Manual row index
			"ImageType":"05",
			"Extension" : extension,
			});	
									
			debugger
		var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.ImageType= "05";
			uploadDetails.Extension= extension;
			uploadDetails.UpdateFlag= "";
			uploadDetails.MimeType = oResData.headers["content-mimetype"];
			uploadDetails.Row= RowIndex; //Add Manual row index
			var model = that.getView().getModel("attachmentDefectOutsideModel");
			//var model = that._TyrePhotosDialog.getModel("attachmentDefectOutsideModel")
			var data = model.getData();
			data.push(uploadDetails);
			
			//for enable upload button.
			if(data.length > 0){
				sap.ui.getCore().byId("idDefectOutsideUploadCollection").setUploadEnabled(false);
			} else {
				sap.ui.getCore().byId("idDefectOutsideUploadCollection").setUploadEnabled(true);
			}
			
			oUploadCollection.getModel("oUploadDefectOutsideModel").refresh();
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
								
	/*onDefectOutsideFileSizeExceed: function(oEvent){
		debugger
		sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
			return false;
		},*/
	onDefectOutsideFileDeleted : function(oEvent) {
		debugger
		var oSrc = oEvent.getSource();
		var uploadModel = oSrc.getModel("oUploadDefectOutsideModel");
		var uItems = uploadModel.getProperty("/items");
		var oItem = oEvent.getParameter("item");
		var oContext = oItem.getBindingContext("oUploadDefectOutsideModel")
			if (!oContext) {
				uploadModel.setProperty("/items", uItems);
				return;
			}
		var sPath = oContext.getPath();
		var sIndex = sPath.split("/").pop();
		var docId = oEvent.getParameter("documentId");
			uItems.splice(sIndex,1);
			uploadModel.refresh();
		var data = that.getView().getModel("attachmentDefectOutsideModel").getData();
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
	
	getAttachmentDefectOutsideDetails: function(selectedGuId){        //document upload
		debugger
		 debugger
			var oView = this.getView();
			var oUploadDefectOutsideModel = this.getView().getModel("oUploadDefectOutsideModel");
			var model = this.getView().getModel("attachmentDefectOutsideModel");
			oUploadDefectOutsideModel.setData({items:[]});
			
			var modeldata = this.getView().getModel("attachmentDefectOutsideModel").getData();
			var host = window.location.host;
			var protocol = window.location.protocol;
			var urlprefix = protocol + "//" + host;	
			
			for (var i=0;i<modeldata.length;i++){
				   if(modeldata[i].Row == RowIndex){
					var uploadDetails= {};
					uploadDetails.FileName = modeldata[i].FileName;
					uploadDetails.DocNo= modeldata[i].DocNo;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = modeldata[i].MimeType;
					uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
					//
					//uploadDetails.NoDelete = modeldata[i].NoDelete;
					//
					var data = oUploadDefectOutsideModel.getData();
					data.items.push(uploadDetails);	 
					
				this.getView().getModel("oUploadDefectOutsideModel").refresh();	
				   }
			}
	},
									
	saveUploadedDefectOutsideDocs: function(i,ReqGuid){  // document upload
		debugger
		var payload = that.createDefectOutsidePayload(i,ReqGuid);
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
									
	createDefectOutsidePayload: function(i,ReqGuid){              // document upload
		debugger
		var payload={
			ObjectID: "06",
			ObjectName: ReqGuid,
			Error:"",
			Message:"",
			}
		var navArr=[];
		var data = that.getView().getModel("attachmentDefectOutsideModel").getData()[i];
			//for(var i=0;i<data.length;i++){
				var obj={};
					obj.FileName	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "05";
					obj.Extension	= data.Extension;
						navArr.push(obj);
					//}
										
				payload.ImageObjectToDataNvg = navArr;
					return payload;
	},	
	
//*********************************************Upload Defect Inside Image************************************************		
	onDefectInsideAttachUpload: function(oEvent){
		debugger
		var oFileUploader = oEvent.getSource();		
		var _that = this;
		var csrf = _that.getCSRFToken();
		var oUploadCollection = oEvent.getSource();
		var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	onDefectInsideBeforeUploadStarts : function(oEvent) {
		debugger
		extension = "";
		var oVal = oEvent.getParameter("value");	    
		var fileName = oEvent.getParameter("fileName");
		var oSlug = fileName;
			extension = fileName.split(".")[1]; //Get file Extension

		// Header Slug
		var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			},
								    
	onDefectInsideUploadComplete : function(oEvent) {
		debugger
		var that = this;
		var oUploadCollection = oEvent.getSource();
		var oResData = oEvent.getParameter("files")[0];
		if (oResData.status == "201") {
		var oData = oUploadCollection.getModel("oUploadDefectInsideModel").getData();
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
			"Row" : RowIndex, //Add Manual row index
			 "ImageType":"04",
			  "Extension" : extension,
			});	
									
			debugger
		var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.ImageType= "04";
			uploadDetails.Extension= extension;
			uploadDetails.UpdateFlag= "";
			uploadDetails.MimeType = oResData.headers["content-mimetype"];
			uploadDetails.Row= RowIndex; //Add Manual row index
			var model = that.getView().getModel("attachmentDefectInsideModel");
			//var model = that._TyrePhotosDialog.getModel("attachmentDefectInsideModel")
			var data = model.getData();
			data.push(uploadDetails);
			//for enable upload button.
			if(data.length > 0){
				sap.ui.getCore().byId("idDefectInsideUploadCollection").setUploadEnabled(false);
			} else {
				sap.ui.getCore().byId("idDefectInsideUploadCollection").setUploadEnabled(true);
			}
			
			oUploadCollection.getModel("oUploadDefectInsideModel").refresh();
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
								
	/*onDefectOutsideFileSizeExceed: function(oEvent){
		debugger
		sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
			return false;
		},*/
	onDefectInsideFileDeleted : function(oEvent) {
		debugger
		var oSrc = oEvent.getSource();
		var uploadModel = oSrc.getModel("oUploadDefectInsideModel");
		var uItems = uploadModel.getProperty("/items");
		var oItem = oEvent.getParameter("item");
		var oContext = oItem.getBindingContext("oUploadDefectInsideModel")
			if (!oContext) {
				uploadModel.setProperty("/items", uItems);
				return;
			}
		var sPath = oContext.getPath();
		var sIndex = sPath.split("/").pop();
		var docId = oEvent.getParameter("documentId");
			uItems.splice(sIndex,1);
			uploadModel.refresh();
		var data = that.getView().getModel("attachmentDefectInsideModel").getData();
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
	
	getAttachmentDefectInsideDetails: function(selectedGuId){        //document upload
		debugger
		 debugger
			var oView = this.getView();
			var oUploadDefectInsideModel = this.getView().getModel("oUploadDefectInsideModel");
			var model = this.getView().getModel("attachmentDefectInsideModel");
			oUploadDefectInsideModel.setData({items:[]});
			
			var modeldata = this.getView().getModel("attachmentDefectInsideModel").getData();
			var host = window.location.host;
			var protocol = window.location.protocol;
			var urlprefix = protocol + "//" + host;	
			
			for (var i=0;i<modeldata.length;i++){
				   if(modeldata[i].Row == RowIndex){
					var uploadDetails= {};
					uploadDetails.FileName = modeldata[i].FileName;
					uploadDetails.DocNo= modeldata[i].DocNo;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = modeldata[i].MimeType;
					uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
					//
					//uploadDetails.NoDelete = modeldata[i].NoDelete;
					//
					var data = oUploadDefectInsideModel.getData();
					data.items.push(uploadDetails);	 
					
				this.getView().getModel("oUploadDefectInsideModel").refresh();	
				   }
			}
	},
									
	saveUploadedDefectInsideDocs: function(i,ReqGuid){  // document upload
		debugger
		var payload = that.createDefectInsidePayload(i,ReqGuid);
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
									
	createDefectInsidePayload: function(i,ReqGuid){              // document upload
		debugger
		var payload={
			ObjectID: "06",
			ObjectName: ReqGuid,
			Error:"",
			Message:"",
			}
		var navArr=[];
		var data = that.getView().getModel("attachmentDefectInsideModel").getData()[i];
			//for(var i=0;i<data.length;i++){
				var obj={};
					obj.FileName	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "04";
					obj.Extension	= data.Extension;
						navArr.push(obj);
					//}
										
				payload.ImageObjectToDataNvg = navArr;
					return payload;
	},
	
//********************************Upload Defect Any Other Image************************************************		
	onDefectAnyOtherAttachUpload: function(oEvent){
		debugger
		var oFileUploader = oEvent.getSource();		
		var _that = this;
		var csrf = _that.getCSRFToken();
		var oUploadCollection = oEvent.getSource();
		var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	onDefectAnyOtherBeforeUploadStarts : function(oEvent) {
		debugger
		extension = "";
		var oVal = oEvent.getParameter("value");	    
		var fileName = oEvent.getParameter("fileName");
		var oSlug = fileName;
			extension = fileName.split(".")[1]; //Get file Extension

		// Header Slug
		var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			},
								    
	onDefectAnyOtherUploadComplete : function(oEvent) {
		debugger
		var that = this;
		var oUploadCollection = oEvent.getSource();
		var oResData = oEvent.getParameter("files")[0];
		if (oResData.status == "201") {
		var oData = oUploadCollection.getModel("oUploadDefectAnyOtherModel").getData();
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
			"Row" : RowIndex, //Add Manual row index
			"ImageType":"06",
			"Extension" : extension,

			});	
									
			debugger
		var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.ImageType= "06";
			uploadDetails.Extension= extension;

			uploadDetails.UpdateFlag= "";
			uploadDetails.MimeType = oResData.headers["content-mimetype"];
			uploadDetails.Row= RowIndex; //Add Manual row index
			var model = that.getView().getModel("attachmentDefectAnyOtherModel");
			//var model = that._TyrePhotosDialog.getModel("attachmentDefectAnyOtherModel")
			var data = model.getData();
			data.push(uploadDetails);
			
			//for enable upload button.
			if(data.length > 0){
				sap.ui.getCore().byId("idDefectAnyOthUploadCollection").setUploadEnabled(false);
			} else {
				sap.ui.getCore().byId("idDefectAnyOthUploadCollection").setUploadEnabled(true);
			}
			
			oUploadCollection.getModel("oUploadDefectAnyOtherModel").refresh();
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
								
	/*onDefectAnyOtherTypeMissmatch: function(oEvent){
		debugger
		sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
			return false;
		},*/
	onDefectAnyOtherFileDeleted : function(oEvent) {
		debugger
		var oSrc = oEvent.getSource();
		var uploadModel = oSrc.getModel("oUploadDefectAnyOtherModel");
		var uItems = uploadModel.getProperty("/items");
		var oItem = oEvent.getParameter("item");
		var oContext = oItem.getBindingContext("oUploadDefectAnyOtherModel")
			if (!oContext) {
				uploadModel.setProperty("/items", uItems);
				return;
			}
		var sPath = oContext.getPath();
		var sIndex = sPath.split("/").pop();
		var docId = oEvent.getParameter("documentId");
			uItems.splice(sIndex,1);
			uploadModel.refresh();
		var data = that.getView().getModel("attachmentDefectAnyOtherModel").getData();
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
	
	getAttachmentDefectAnyothDetails: function(selectedGuId){        //document upload
		debugger
		 debugger
			var oView = this.getView();
			var oUploadDefectAnyOtherModel = this.getView().getModel("oUploadDefectAnyOtherModel");
			var model = this.getView().getModel("attachmentDefectAnyOtherModel");
			oUploadDefectAnyOtherModel.setData({items:[]});
			
			var modeldata = this.getView().getModel("attachmentDefectAnyOtherModel").getData();
			var host = window.location.host;
			var protocol = window.location.protocol;
			var urlprefix = protocol + "//" + host;	
			
			for (var i=0;i<modeldata.length;i++){
				   if(modeldata[i].Row == RowIndex){
					var uploadDetails= {};
					uploadDetails.FileName = modeldata[i].FileName;
					uploadDetails.DocNo= modeldata[i].DocNo;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = modeldata[i].MimeType;
					uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
					//
					//uploadDetails.NoDelete = modeldata[i].NoDelete;
					//
					var data = oUploadDefectAnyOtherModel.getData();
					data.items.push(uploadDetails);	 
					
				this.getView().getModel("oUploadDefectAnyOtherModel").refresh();	
				   }
			}
	},
		
									
	saveUploadedDefectAnyOtherDocs: function(i,ReqGuid){  // document upload
		debugger
		var payload = that.createDefectAnyOtherPayload(i,ReqGuid);
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
									
	createDefectAnyOtherPayload: function(i,ReqGuid){              // document upload
		debugger
		var payload={
			ObjectID: "06",
			ObjectName: ReqGuid,
			Error:"",
			Message:"",
			}
		var navArr=[];
		var data = that.getView().getModel("attachmentDefectAnyOtherModel").getData()[i];
			//for(var i=0;i<data.length;i++){
				var obj={};
					obj.FileName	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "06";
					obj.Extension	= data.Extension;
						navArr.push(obj);
					//}
										
				payload.ImageObjectToDataNvg = navArr;
					return payload;
	},	
	
//*********************************************Upload Tube Size Marking Image************************************************		
	onTubeSizeMarkingAttachUpload: function(oEvent){
			debugger
			var oFileUploader = oEvent.getSource();		
			
		    var _that = this;
		    var csrf = _that.getCSRFToken();
		    
		    var oUploadCollection = oEvent.getSource();
		    var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	    onTubeSizeMarkingBeforeUploadStarts : function(oEvent) {
			debugger
			extension = "";
		    var oVal = oEvent.getParameter("value");	    
	    
		    var fileName = oEvent.getParameter("fileName");
		    var oSlug = fileName;
		        extension = fileName.split(".")[1]; //Get file Extension

		    // Header Slug
		    var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
		    });
		    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		    
		onTubesizeMarkingUploadComplete : function(oEvent) {
			debugger
			var that = this;
		    var oUploadCollection = oEvent.getSource();
		    var oResData = oEvent.getParameter("files")[0];
		    if (oResData.status == "201") {
			var oData = oUploadCollection.getModel("oUploadTubeSizeMarkingModel").getData();
			
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
			    "Row" : RowIndex, //Add Manual row index
			    "ImageType":"08",
			    "Extension" : extension,
			});	
			
			debugger
			var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.ImageType= "08";
			uploadDetails.Extension= extension;
			uploadDetails.UpdateFlag= "";
			uploadDetails.MimeType = oResData.headers["content-mimetype"]
			uploadDetails.Row= RowIndex; //Add Manual row index
			var model = that.getView().getModel("attachmentTubeSizeMarkingModel");
			//var model = that._TyrePhotosDialog.getModel("attachmentTubeSizeMarkingModel")
			var data = model.getData();
			data.push(uploadDetails);
			
			//for disable upload button.
			if(data.length > 0){
				sap.ui.getCore().byId("idTubeSizeMarkingUpload").setUploadEnabled(false);
			} else {
				sap.ui.getCore().byId("idTubeSizeMarkingUpload").setUploadEnabled(true);
			}
			
			oUploadCollection.getModel("oUploadTubeSizeMarkingModel").refresh();

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
		
	   
	/*    onTubeSizeMarkingUploadTerminated: function(oEvent){
	    	debugger
	    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
	    	return false;
	    },*/
	    
	   
		onTubeSizeMarkingFileDeleted : function(oEvent) {
	    	debugger 
	        var oSrc = oEvent.getSource();
	        var uploadModel = oSrc.getModel("oUploadTubeSizeMarkingModel");
	        var uItems = uploadModel.getProperty("/items");
	        var oItem = oEvent.getParameter("item");
	        var oContext = oItem.getBindingContext("oUploadTubeSizeMarkingModel")
	        if (!oContext) {
	          uploadModel.setProperty("/items", uItems);
	          return;
	        }
	        var sPath = oContext.getPath();
	        var sIndex = sPath.split("/").pop();
	        var docId = oEvent.getParameter("documentId");
	        
	        uItems.splice(sIndex,1);
	        uploadModel.refresh();
	            
	        var data = this.getView().getModel("attachmentTubeSizeMarkingModel").getData();
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
	
	      getAttachTubesizeMarkDetails: function(selectedGuId){        //document upload
	    	  debugger
				var oView = this.getView();
				var oUploadTubeSizeMarkingModel = this.getView().getModel("oUploadTubeSizeMarkingModel");
				var model = this.getView().getModel("attachmentTubeSizeMarkingModel");
				oUploadTubeSizeMarkingModel.setData({items:[]});
				
				var modeldata = this.getView().getModel("attachmentTubeSizeMarkingModel").getData();
				var host = window.location.host;
				var protocol = window.location.protocol;
				var urlprefix = protocol + "//" + host;	
				
				for (var i=0;i<modeldata.length;i++){
					   if(modeldata[i].Row == RowIndex){
						var uploadDetails= {};
						uploadDetails.FileName = modeldata[i].FileName;
						uploadDetails.DocNo= modeldata[i].DocNo;
						uploadDetails.UpdateFlag= "";
						uploadDetails.MimeType = modeldata[i].MimeType;
						uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
						//
						//uploadDetails.NoDelete = modeldata[i].NoDelete;
						//
						var data = oUploadTubeSizeMarkingModel.getData();
						data.items.push(uploadDetails);	 
						
					this.getView().getModel("oUploadTubeSizeMarkingModel").refresh();	
					   }
				}
				
			},
			
			saveUploadedTsizeDocs: function(i,ReqGuid){  // document upload
				debugger
				var payload = that.createTsizePayload(i,ReqGuid);
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
			
			createTsizePayload: function(i,ReqGuid){              // document upload
				debugger
				var payload={
						ObjectID: "06",
						ObjectName: ReqGuid,
						Error:"",
						Message:"",
				}
				var navArr=[];
				var data = that.getView().getModel("attachmentTubeSizeMarkingModel").getData()[i];
				//for(var i=0;i<data.length;i++){
					var obj={};
					obj.FileName 	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "08";
					obj.Extension	= data.Extension;
					navArr.push(obj);
				//}
				
				payload.ImageObjectToDataNvg = navArr;
				return payload;
			},	
//**********************************Upload Tube MouldMMYY Image************************************************		
			onTubeMouldMMYYAttachUpload: function(oEvent){
					debugger
					var oFileUploader = oEvent.getSource();		
					
				    var _that = this;
				    var csrf = _that.getCSRFToken();
				    
				    var oUploadCollection = oEvent.getSource();
				    var oCustomerHeaderToken = new UploadCollectionParameter({
					name : "x-csrf-token",
					value : _that.token
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

			    onTubeMouldMMYYBeforeUploadStarts : function(oEvent) {
					debugger
					extension = "";
				    var oVal = oEvent.getParameter("value");	    
			    
				    var fileName = oEvent.getParameter("fileName");
				    var oSlug = fileName;
				        extension = fileName.split(".")[1]; //Get file Extension

				    // Header Slug
				    var oCustomerHeaderSlug = new UploadCollectionParameter({
					name : "slug",
					value : oSlug
				    });
				    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
				},
				    
				onTubeMouldMMYYUploadComplete : function(oEvent) {
					debugger
					var that = this;
				    var oUploadCollection = oEvent.getSource();
				    var oResData = oEvent.getParameter("files")[0];
				    if (oResData.status == "201") {
					var oData = oUploadCollection.getModel("oUploadTubeMouldMMYYModel").getData();
					
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
					    "Row" : RowIndex, //Add Manual row index
					    "ImageType":"09",
					    "Extension" : extension,
					});	
					
					debugger
					var uploadDetails= {};
					uploadDetails.FileName = oResData.fileName
					uploadDetails.DocNo= docId;
					uploadDetails.ImageType= "09";
					uploadDetails.Extension= extension;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = oResData.headers["content-mimetype"]
					uploadDetails.Row= RowIndex; //Add Manual row index
					var model = that.getView().getModel("attachmentTubeMouldMMYYModel");
					//var model = that._TyrePhotosDialog.getModel("attachmentTubeMouldMMYYModel")
					var data = model.getData();
					data.push(uploadDetails);
					
					//for disable upload button.
					if(data.length > 0){
						sap.ui.getCore().byId("idTubeMouldMMYYCollection").setUploadEnabled(false);
					} else {
						sap.ui.getCore().byId("idTubeMouldMMYYCollection").setUploadEnabled(true);
					}
					
					oUploadCollection.getModel("oUploadTubeMouldMMYYModel").refresh();

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
				
			   
			/*    onTubeMouldMMYYTypeMissmatch: function(oEvent){
			    	debugger
			    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
			    	return false;
			    },*/
			    
			   
				onTubeMouldMMYYFileDeleted : function(oEvent) {
			    	debugger 
			        var oSrc = oEvent.getSource();
			        var uploadModel = oSrc.getModel("oUploadTubeMouldMMYYModel");
			        var uItems = uploadModel.getProperty("/items");
			        var oItem = oEvent.getParameter("item");
			        var oContext = oItem.getBindingContext("oUploadTubeMouldMMYYModel")
			        if (!oContext) {
			          uploadModel.setProperty("/items", uItems);
			          return;
			        }
			        var sPath = oContext.getPath();
			        var sIndex = sPath.split("/").pop();
			        var docId = oEvent.getParameter("documentId");
			        
			        uItems.splice(sIndex,1);
			        uploadModel.refresh();
			            
			        var data = this.getView().getModel("attachmentTubeMouldMMYYModel").getData();
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
			
			      getAttachTubeMouldMMYYDetails: function(selectedGuId){        //document upload
			    	  debugger
						var oView = this.getView();
						var oUploadTubeMouldMMYYModel = this.getView().getModel("oUploadTubeMouldMMYYModel");
						var model = this.getView().getModel("attachmentTubeMouldMMYYModel");
						oUploadTubeMouldMMYYModel.setData({items:[]});
						
						var modeldata = this.getView().getModel("attachmentTubeMouldMMYYModel").getData();
						var host = window.location.host;
						var protocol = window.location.protocol;
						var urlprefix = protocol + "//" + host;	
						
						for (var i=0;i<modeldata.length;i++){
							   if(modeldata[i].Row == RowIndex){
								var uploadDetails= {};
								uploadDetails.FileName = modeldata[i].FileName;
								uploadDetails.DocNo= modeldata[i].DocNo;
								uploadDetails.UpdateFlag= "";
								uploadDetails.MimeType = modeldata[i].MimeType;
								uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
								//
								//uploadDetails.NoDelete = modeldata[i].NoDelete;
								//
								var data = oUploadTubeMouldMMYYModel.getData();
								data.items.push(uploadDetails);	 
								
							this.getView().getModel("oUploadTubeMouldMMYYModel").refresh();	
							   }
						}
						
					},
					
					saveUploadedTsizeDocs: function(i,ReqGuid){  // document upload
						debugger
						var payload = that.createTsizePayload(i,ReqGuid);
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
					
	createTsizePayload: function(i,ReqGuid){              // document upload
						debugger
						var payload={
								ObjectID: "06",
								ObjectName: ReqGuid,
								Error:"",
								Message:"",
						}
						var navArr=[];
						var data = that.getView().getModel("attachmentTubeMouldMMYYModel").getData()[i];
						//for(var i=0;i<data.length;i++){
							var obj={};
							obj.FileName 	= data.FileName;
							obj.DocNo 		= data.DocNo;
							obj.UpdateFlag 	= data.UpdateFlag;
							obj.MimeType 	= data.MimeType;
							obj.ImageType	= "09";
							obj.Extension	= data.Extension;
							navArr.push(obj);
						//}
						
						payload.ImageObjectToDataNvg = navArr;
						return payload;
	},

//***********************************Upload Tube Major Defect Image*******************************************		
	onTubeMajorDefectAttachUpload: function(oEvent){
		debugger
		var oFileUploader = oEvent.getSource();		
		var _that = this;
		var csrf = _that.getCSRFToken();
		var oUploadCollection = oEvent.getSource();
		var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	onTubeMajorDefectBeforeUploadStarts : function(oEvent) {
		debugger
		extension = "";
		var oVal = oEvent.getParameter("value");	    
		var fileName = oEvent.getParameter("fileName");
		var oSlug = fileName;
			extension = fileName.split(".")[1]; //Get file Extension

		// Header Slug
		var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			},
								    
	onTubeMajorDefectUploadComplete : function(oEvent) {
		debugger
		var that = this;
		var oUploadCollection = oEvent.getSource();
		var oResData = oEvent.getParameter("files")[0];
		if (oResData.status == "201") {
		var oData = oUploadCollection.getModel("oUploadTubeMajorDefectModel").getData();
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
			"Row" : RowIndex, //Add Manual row index
			 "ImageType":"10",
			  "Extension" : extension,
			});	
									
			debugger
		var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.ImageType= "10";
			uploadDetails.Extension= extension;
			uploadDetails.UpdateFlag= "";
			uploadDetails.MimeType = oResData.headers["content-mimetype"];
			uploadDetails.Row= RowIndex; //Add Manual row index
			var model = that.getView().getModel("attachmentTubeMajorDefectModel");
			//var model = that._TyrePhotosDialog.getModel("attachmentTubeMajorDefectModel")
			var data = model.getData();
			data.push(uploadDetails);
			//for enable upload button.
			if(data.length > 0){
				sap.ui.getCore().byId("idTubeMajorDefectCollection").setUploadEnabled(false);
			} else {
				sap.ui.getCore().byId("idTubeMajorDefectCollection").setUploadEnabled(true);
			}
			
			oUploadCollection.getModel("oUploadTubeMajorDefectModel").refresh();
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
								
	/*onDefectOutsideFileSizeExceed: function(oEvent){
		debugger
		sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
			return false;
		},*/
	onTubeMajorDefectFileDeleted : function(oEvent) {
		debugger
		var oSrc = oEvent.getSource();
		var uploadModel = oSrc.getModel("oUploadTubeMajorDefectModel");
		var uItems = uploadModel.getProperty("/items");
		var oItem = oEvent.getParameter("item");
		var oContext = oItem.getBindingContext("oUploadTubeMajorDefectModel")
			if (!oContext) {
				uploadModel.setProperty("/items", uItems);
				return;
			}
		var sPath = oContext.getPath();
		var sIndex = sPath.split("/").pop();
		var docId = oEvent.getParameter("documentId");
			uItems.splice(sIndex,1);
			uploadModel.refresh();
		var data = that.getView().getModel("attachmentTubeMajorDefectModel").getData();
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
	
	getAttachTubeMajorDfctDetails: function(selectedGuId){        //document upload
		debugger
		 debugger
			var oView = this.getView();
			var oUploadTubeMajorDefectModel = this.getView().getModel("oUploadTubeMajorDefectModel");
			var model = this.getView().getModel("attachmentTubeMajorDefectModel");
			oUploadTubeMajorDefectModel.setData({items:[]});
			
			var modeldata = this.getView().getModel("attachmentTubeMajorDefectModel").getData();
			var host = window.location.host;
			var protocol = window.location.protocol;
			var urlprefix = protocol + "//" + host;	
			
			for (var i=0;i<modeldata.length;i++){
				   if(modeldata[i].Row == RowIndex){
					var uploadDetails= {};
					uploadDetails.FileName = modeldata[i].FileName;
					uploadDetails.DocNo= modeldata[i].DocNo;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = modeldata[i].MimeType;
					uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
					//
					//uploadDetails.NoDelete = modeldata[i].NoDelete;
					//
					var data = oUploadTubeMajorDefectModel.getData();
					data.items.push(uploadDetails);	 
					
				this.getView().getModel("oUploadTubeMajorDefectModel").refresh();	
				   }
			}
	},
									
	saveUploadedDefectInsideDocs: function(i,ReqGuid){  // document upload
		debugger
		var payload = that.createDefectInsidePayload(i,ReqGuid);
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
									
	createDefectInsidePayload: function(i,ReqGuid){              // document upload
		debugger
		var payload={
			ObjectID: "06",
			ObjectName: ReqGuid,
			Error:"",
			Message:"",
			}
		var navArr=[];
		var data = that.getView().getModel("attachmentTubeMajorDefectModel").getData()[i];
			//for(var i=0;i<data.length;i++){
				var obj={};
					obj.FileName	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "10";
					obj.Extension	= data.Extension;
						navArr.push(obj);
					//}
										
				payload.ImageObjectToDataNvg = navArr;
					return payload;
	},
	
//************************************Upload Tube Other Defect View Image*****************************************		
	onTubeOthDefectViewAttachUpload: function(oEvent){
		debugger
		var oFileUploader = oEvent.getSource();		
		var _that = this;
		var csrf = _that.getCSRFToken();
		var oUploadCollection = oEvent.getSource();
		var oCustomerHeaderToken = new UploadCollectionParameter({
			name : "x-csrf-token",
			value : _that.token
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

	onTubeOthDefectViewBeforeUploadStarts : function(oEvent) {
		debugger
		extension = "";
		var oVal = oEvent.getParameter("value");	    
		var fileName = oEvent.getParameter("fileName");
		var oSlug = fileName;
			extension = fileName.split(".")[1]; //Get file Extension

		// Header Slug
		var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "slug",
			value : oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			},
								    
	onTubeOthDefectViewUploadComplete : function(oEvent) {
		debugger
		var that = this;
		var oUploadCollection = oEvent.getSource();
		var oResData = oEvent.getParameter("files")[0];
		if (oResData.status == "201") {
		var oData = oUploadCollection.getModel("oUploadTubeOthDefectViewModel").getData();
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
			"Row" : RowIndex, //Add Manual row index
			 "ImageType":"11",
			  "Extension" : extension,
			});	
									
			debugger
		var uploadDetails= {};
			uploadDetails.FileName = oResData.fileName
			uploadDetails.DocNo= docId;
			uploadDetails.ImageType= "11";
			uploadDetails.Extension= extension;
			uploadDetails.UpdateFlag= "";
			uploadDetails.MimeType = oResData.headers["content-mimetype"];
			uploadDetails.Row= RowIndex; //Add Manual row index
			var model = that.getView().getModel("attachmentTubeOthDefectViewModel");
			//var model = that._TyrePhotosDialog.getModel("attachmentTubeOthDefectViewModel")
			var data = model.getData();
			data.push(uploadDetails);
			//for enable upload button.
			if(data.length > 0){
				sap.ui.getCore().byId("idTubeOthDefectViewUploadCollection").setUploadEnabled(false);
			} else {
				sap.ui.getCore().byId("idTubeOthDefectViewUploadCollection").setUploadEnabled(true);
			}
			
			oUploadCollection.getModel("oUploadTubeOthDefectViewModel").refresh();
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
								
	/*onDefectOutsideFileSizeExceed: function(oEvent){
		debugger
		sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
			return false;
		},*/
	onTubeOthDefectViewFileDeleted : function(oEvent) {
		debugger
		var oSrc = oEvent.getSource();
		var uploadModel = oSrc.getModel("oUploadTubeOthDefectViewModel");
		var uItems = uploadModel.getProperty("/items");
		var oItem = oEvent.getParameter("item");
		var oContext = oItem.getBindingContext("oUploadTubeOthDefectViewModel")
			if (!oContext) {
				uploadModel.setProperty("/items", uItems);
				return;
			}
		var sPath = oContext.getPath();
		var sIndex = sPath.split("/").pop();
		var docId = oEvent.getParameter("documentId");
			uItems.splice(sIndex,1);
			uploadModel.refresh();
		var data = that.getView().getModel("attachmentTubeOthDefectViewModel").getData();
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
	
	getAttachTubeDfctViewDetails: function(selectedGuId){        //document upload
		debugger
		 debugger
			var oView = this.getView();
			var oUploadTubeOthDefectViewModel = this.getView().getModel("oUploadTubeOthDefectViewModel");
			var model = this.getView().getModel("attachmentTubeOthDefectViewModel");
			oUploadTubeOthDefectViewModel.setData({items:[]});
			
			var modeldata = this.getView().getModel("attachmentTubeOthDefectViewModel").getData();
			var host = window.location.host;
			var protocol = window.location.protocol;
			var urlprefix = protocol + "//" + host;	
			
			for (var i=0;i<modeldata.length;i++){
				   if(modeldata[i].Row == RowIndex){
					var uploadDetails= {};
					uploadDetails.FileName = modeldata[i].FileName;
					uploadDetails.DocNo= modeldata[i].DocNo;
					uploadDetails.UpdateFlag= "";
					uploadDetails.MimeType = modeldata[i].MimeType;
					uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
					//
					//uploadDetails.NoDelete = modeldata[i].NoDelete;
					//
					var data = oUploadTubeOthDefectViewModel.getData();
					data.items.push(uploadDetails);	 
					
				this.getView().getModel("oUploadTubeOthDefectViewModel").refresh();	
				   }
			}
	},
									
	saveUploadedDefectInsideDocs: function(i,ReqGuid){  // document upload
		debugger
		var payload = that.createDefectInsidePayload(i,ReqGuid);
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
									
	createDefectInsidePayload: function(i,ReqGuid){              // document upload
		debugger
		var payload={
			ObjectID: "06",
			ObjectName: ReqGuid,
			Error:"",
			Message:"",
			}
		var navArr=[];
		var data = that.getView().getModel("attachmentTubeOthDefectViewModel").getData()[i];
			//for(var i=0;i<data.length;i++){
				var obj={};
					obj.FileName	= data.FileName;
					obj.DocNo 		= data.DocNo;
					obj.UpdateFlag 	= data.UpdateFlag;
					obj.MimeType 	= data.MimeType;
					obj.ImageType	= "11";
					obj.Extension	= data.Extension;
						navArr.push(obj);
					//}
										
				payload.ImageObjectToDataNvg = navArr;
					return payload;
	},
		
	
// *********************************************File upload Finish***************************************************	
			
	});
});
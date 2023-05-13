sap.ui.define([
		"sap/m/UploadCollectionParameter",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/m/SelectDialog",
		"sap/m/Toolbar",
		'sap/ui/core/Fragment',
		"sap/ui/core/mvc/Controller",
		"jquery.sap.global",
		"jquery.sap.script",
		"sap/ui/model/json/JSONModel",
		"zstencilmaster/util/Formatter",
		"zstencilmaster/sheetjs/jszip",
		"zstencilmaster/sheetjs/xlsx",
		"sap/ui/core/util/Export",
		"sap/ui/core/util/ExportTypeCSV"
],
function(UploadCollectionParameter,MessageBox,MessageToast,SelectDialog,
Toolbar,Fragment,Controller,global,script,JSONModel,Formatter,jszip,xlsx,Export,ExportTypeCSV) {
"use strict";

var that, StencilJModel, DeleteJModel,ErrorJModel, extension;
var excelData;

return sap.ui.controller("zstencilmaster.view.View1", {

onInit: function() {
	that = this;
	this.newBusy = new sap.m.BusyDialog();
	
	this.getView().byId("idTimeStamp").setText(new Date().toDateString());
	
	StencilJModel = new sap.ui.model.json.JSONModel();
	this.getView().byId("idDataTable").setModel(StencilJModel,"StencilJModel");
	
	DeleteJModel = new sap.ui.model.json.JSONModel();
	this.getView().byId("idDeleteTable").setModel(DeleteJModel,"DeleteJModel");
	
	ErrorJModel = new sap.ui.model.json.JSONModel();
	
	this._InitialDialog = sap.ui.xmlfragment("zstencilmaster.view.Initial", that);
	this.getView().addDependent(this._InitialDialog);
	this._InitialDialog.open();
	
	this._InitialDialog.setEscapeHandler(function(o){ 
		o.reject(); 
	}); 
	
},

onOwner:function(oEvent){
	debugger
	var owner = oEvent.getSource().getSelectedKey();
	
	if(owner == '01'){
		oEvent.getSource().getParent().getCells()[2].setValue();
		oEvent.getSource().getParent().getCells()[3].setValue();
		oEvent.getSource().getParent().getCells()[4].setValue();
		oEvent.getSource().getParent().getCells()[5].setValue();
		oEvent.getSource().getParent().getCells()[6].setValue('JK').setEnabled(false);
		oEvent.getSource().getParent().getCells()[7].setValue('JK Tyre').setEnabled(false);
		oEvent.getSource().getParent().getCells()[8].setValue();
		oEvent.getSource().getParent().getCells()[9].setValue();
		oEvent.getSource().getParent().getCells()[10].setValue();
		oEvent.getSource().getParent().getCells()[11].setValue();
		oEvent.getSource().getParent().getCells()[12].setSelectedKey();
		oEvent.getSource().getParent().getCells()[13].setSelectedKey();
	}
	else{
		oEvent.getSource().getParent().getCells()[2].setValue();
		oEvent.getSource().getParent().getCells()[3].setValue();
		oEvent.getSource().getParent().getCells()[4].setValue();
		oEvent.getSource().getParent().getCells()[5].setValue();
		oEvent.getSource().getParent().getCells()[6].setValue().setEnabled(true);
		oEvent.getSource().getParent().getCells()[7].setValue().setEnabled(true);
		oEvent.getSource().getParent().getCells()[8].setValue();
		oEvent.getSource().getParent().getCells()[9].setValue();
		oEvent.getSource().getParent().getCells()[10].setValue();
		oEvent.getSource().getParent().getCells()[11].setValue();
		oEvent.getSource().getParent().getCells()[12].setSelectedKey();
		oEvent.getSource().getParent().getCells()[13].setSelectedKey();
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onDialogCancel:function(){
	window.history.back();
},

onDialogOK:function(){
	debugger
	if(sap.ui.getCore().byId("RB1").getSelected()==true)
		{
		this.getView().byId("idManualPage").setTitle("Create Stencil Data");
		
		this.getView().byId("btnCreateTemplate").setVisible(true);
		//this.getView().byId("btnDeleteTemplate").setVisible(false);
		
		this.getView().byId("btnCreate").setVisible(true);
		this.getView().byId("idCreateText").setVisible(true);
		this.getView().byId("btnDelete").setVisible(false);
		this.getView().byId("idDeleteText").setVisible(false);
		
		this.getView().byId("idHeaderTable").setVisible(true);
		this.getView().byId("idCreateTableContainer").setVisible(true);
		this.getView().byId("idDeleteHeaderTable").setVisible(false);
		this.getView().byId("idDeleteTableContainer").setVisible(false);
		}
	else
		{
		this.getView().byId("idManualPage").setTitle("Delete Stencil Data");
		
		this.getView().byId("btnCreateTemplate").setVisible(false);
		//this.getView().byId("btnDeleteTemplate").setVisible(true);
		
		this.getView().byId("btnCreate").setVisible(false);
		this.getView().byId("idCreateText").setVisible(false);
		this.getView().byId("btnDelete").setVisible(true);
		this.getView().byId("idDeleteText").setVisible(true);
		
		this.getView().byId("idHeaderTable").setVisible(false);
		this.getView().byId("idCreateTableContainer").setVisible(false);
		this.getView().byId("idDeleteHeaderTable").setVisible(true);
		this.getView().byId("idDeleteTableContainer").setVisible(true);
		
		}
	
	this._InitialDialog.close();
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onUploadButton: function (e) {
	debugger
	this.e = e;
	if(this.getView().byId("btnDelete").setVisible()==true){
		MessageBox.warning("Please select a valid Microsoft Excel file with only one column having stencils numbers", {
			actions: [MessageBox.Action.OK],
			emphasizedAction: MessageBox.Action.OK,
			onClose: function (sAction) {
				that.onUpload();
			}
		});
	}else
		that.onUpload();
},

handleTypeMissmatch: function(oEvent) {
	var aFileTypes = oEvent.getSource().getFileType();
	jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
	var sSupportedFileTypes = aFileTypes.join(", ");
	MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
							" is not supported. Choose one of the following types: " +
							sSupportedFileTypes);
},

onClear:function(){
	debugger
	this.getView().byId("FileUploaderId").clear();
	
	StencilJModel.setData();
	StencilJModel.refresh();
	DeleteJModel.setData();
	DeleteJModel.refresh();
},

onUpload:function(e){
	debugger
	//e = that.e;
	that._import(e.getParameter("files") && e.getParameter("files")[0]);
},

_import: function (file) {
	debugger
	var that = this;
	//var excelData = {};
	excelData = {};
	if (file && window.FileReader) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var data = e.target.result;
			var workbook = XLSX.read(data, {
				type: 'binary'
			});
			workbook.SheetNames.forEach(function (sheetName) {
				// Here is your object for every sheet in workbook
				excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			});
				
				if(excelData[0].StencilNumber == undefined){
					sap.m.MessageBox.error("Excel file should only have one column with header ' StencilNumber '");
					return false;
				}
			
					var data = {};
					debugger
					
					data.StencilMasterToItemNvg = excelData;
					
					if(that.getView().byId("btnCreate").getVisible()==true)
						data.Flag = 'Y';
					else
						data.Flag = 'Z';
					
					var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
					var sPath = "/StencilMasterSet";
					var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					oCreateModel.setHeaders({
						"Content-Type": "application/atom+xml"
					});
					
					var fncSuccess = function(oData, oResponse) {
						debugger
						var arr = [];
						var error = [];
						
						for(var i = 0 ; i < oData.StencilMasterToItemNvg.results.length ; i++){
							if(oData.StencilMasterToItemNvg.results[i].Status == 'S'){
								arr.push(oData.StencilMasterToItemNvg.results[i]);
							}
							if(oData.StencilMasterToItemNvg.results[i].Status == 'E'){
								error.push(oData.StencilMasterToItemNvg.results[i]);
							}
						}
						that.newBusy.close();
						
						if(that.getView().byId("btnCreate").getVisible()==true){
							StencilJModel.setData(arr);
							StencilJModel.refresh();
						}
						if(that.getView().byId("btnDelete").getVisible()==true){
							DeleteJModel.setData(arr);
							DeleteJModel.refresh();
						}
						
						ErrorJModel.setData(error);
						
						if(error.length > 0){
							sap.m.MessageBox.success("Some Stencil(s) cannot be used. Click OK to download list.", {
								actions: [MessageBox.Action.OK],
								emphasizedAction: MessageBox.Action.OK,
								onClose: function (sAction) {
									that.onErrorStencil();
								}
							});
						}
					}
					
					var fncError = function(oError) {
						that.newBusy.close();
						that.getView().byId("FileUploaderId").clear();
						sap.m.MessageBox.error("Error In Reading Excel File Data.");
					}
					
					that.newBusy.open();
					//Create Method for final Save
					oCreateModel.create(sPath, data, {
						success: fncSuccess,
						error: fncError
					});
			
		};
		reader.onerror = function (ex) {
			console.log("Error in Reading Excel File." + ex);
		};
		reader.readAsBinaryString(file);
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onDialogClose:function(){
	debugger
	that._ExcelDialog.close();
},

onBeforeUpload:function(){
	debugger
},

onUploadBatchExcel:function(){
	debugger

	if(!this._ExcelDialog){
		this._ExcelDialog = sap.ui.xmlfragment("zstencilmaster.view.ExcelUploadDialog", that);
		this.getView().addDependent(this._ExcelDialog);
	}
	this._ExcelDialog.open();
	
	this._ExcelDialog.setEscapeHandler(function(o){ 
		o.reject(); 
	});
	
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onF4Fleet:function(oEvent){
	debugger
	this.FleetModel= new sap.ui.model.json.JSONModel();
	this.fleet = oEvent.getSource();
	
	var oData={};
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
	var sPath = "/User_Fleet_DetialsSet";
	var customerModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

	this.FleetDialog = new sap.m.SelectDialog({
				title : "Select Fleet",
				items : {
					path : "/results",
					template : new sap.m.StandardListItem({
						title : "{FleetName}",
						customData : [ new sap.ui.core.CustomData(
							{
								key : "Key",
								value : "{FleetName}"
							}) ],
					}),
				},
		liveChange : function(oEvent) {
			debugger
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Kunnr",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter1 = new sap.ui.model.Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
			oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
		},
			confirm : [ that._handleFleetClose, that ],
			cancel :  [ that._handleFleetClose, that ]
	});
		

		oData.success=function(oData,oResponse){
			debugger
			that.FleetModel.setData(oData);
			
			that.FleetDialog.setModel(that.FleetModel);
			that.FleetDialog.open();
		};
		customerModel.read(sPath,oData);
	},

	_handleFleetClose: function(oEvent) {
		debugger
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			var Fleet = oSelectedItem.getBindingContext().getObject().Kunnr;
		
			that.fleet.setValue(oSelectedItem.getBindingContext().getObject().FleetName);
			that.fleet.getParent().getCells()[2].setValue(Fleet);
			
			that.fleet.getParent().getCells()[4].setValue();
			that.fleet.getParent().getCells()[5].setValue();
			if(that.fleet.getParent().getCells()[1].getSelectedKey() == '01'){
				that.fleet.getParent().getCells()[6].setValue('JK');
				that.fleet.getParent().getCells()[7].setValue('JK Tyre');
			}else{
				that.fleet.getParent().getCells()[6].setValue();
				that.fleet.getParent().getCells()[7].setValue();
			}
			that.fleet.getParent().getCells()[8].setValue();
			that.fleet.getParent().getCells()[9].setValue();
			that.fleet.getParent().getCells()[10].setValue();
			that.fleet.getParent().getCells()[11].setValue();
			that.fleet.getParent().getCells()[12].setSelectedKey();
			that.fleet.getParent().getCells()[13].setSelectedKey();
		}
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onF4Hub:function(oEvent){
		debugger
		oEvent.getSource().getParent().getCells()[3].setValueState("None");
		
		var customer = oEvent.getSource().getParent().getCells()[2].getValue();
		var comdesc  = oEvent.getSource().getParent().getCells()[3].getValue();
		
		if(customer == ""){
			oEvent.getSource().getParent().getCells()[3].setValueState("Error");
			sap.m.MessageToast.show("Please select a Customer");
			return false;
		}
		
		this.HubModel= new sap.ui.model.json.JSONModel();
		this.hub = oEvent.getSource();
		
		var oData={};
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
		var sPath = "F4_User_Fleet_HubSet?$filter=CUname eq '"
					+ sap.ushell.Container.getService("UserInfo").getId()
					+ "'and CKunnr  eq '"
					+ customer + "'";
		
		var hubModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

		this.HubDialog = new sap.m.SelectDialog({
					title : "Select Hub",
					items : {
						path : "/results",
						template : new sap.m.StandardListItem({
							title : "{HubName}",
							customData : [ new sap.ui.core.CustomData(
								{
									key : "Key",
									value : "{HubName}"
								}) ],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("HubName",sap.ui.model.FilterOperator.Contains,sValue);
				//var oFilter1 = new sap.ui.model.Filter("HubName",sap.ui.model.FilterOperator.Contains,sValue);
				//var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
				confirm : [ that._handleHubClose, that ],
				cancel :  [ that._handleHubClose, that ]
		});
			

			oData.success=function(oData,oResponse){
				debugger
				that.HubModel.setData(oData);
				
				that.HubDialog.setModel(that.HubModel);
				that.HubDialog.open();
			};
			
			hubModel.read(sPath,oData);
		},

		_handleHubClose: function(oEvent) {
			debugger
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that.hub.setValue( oSelectedItem.getBindingContext().getObject().HubName );
				that.hub.getParent().getCells()[4].setValue( oSelectedItem.getBindingContext().getObject().HubCode );
				
				if(that.hub.getParent().getCells()[1].getSelectedKey() == '01'){
					that.hub.getParent().getCells()[6].setValue('JK');
					that.hub.getParent().getCells()[7].setValue('JK Tyre');
				}else{
					that.hub.getParent().getCells()[6].setValue();
					that.hub.getParent().getCells()[7].setValue();
				}
				that.hub.getParent().getCells()[8].setValue();
				that.hub.getParent().getCells()[9].setValue();
				that.hub.getParent().getCells()[10].setValue();
				that.hub.getParent().getCells()[11].setValue();
				that.hub.getParent().getCells()[12].setSelectedKey();
				that.hub.getParent().getCells()[13].setSelectedKey();
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onF4Stencil:function(oEvent){
		debugger
		this.StencilJModel= new sap.ui.model.json.JSONModel();
		this.path = oEvent.getSource();
		
		var oData={};
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZFLEET_SRV/"; 
		var sPath = "F4StencilCorrectionSet";
		var customerModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

		this.StencilDialog = new sap.m.SelectDialog({
					title : "Select Stencil",
					items : {
						path : "/results",
						template : new sap.m.StandardListItem({
							title : "{StencilNumber}",
							customData : [ new sap.ui.core.CustomData(
								{
									key : "Key",
									value : "{StencilNumber}"
								}) ],
						}),
					},
			liveChange : function(oEvent) {
				debugger
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("StencilNumber",sap.ui.model.FilterOperator.Contains,sValue);
				//var oFilter1 = new sap.ui.model.Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);
				//var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false);
				oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
				confirm : [ that._handleStencilClose, that ],
				cancel :  [ that._handleStencilClose, that ]
		});
			

			oData.success=function(oData,oResponse){
				debugger
				that.StencilJModel.setData(oData);
				
				that.StencilDialog.setModel(that.StencilJModel);
				that.StencilDialog.open();
			};
			customerModel.read(sPath,oData);
		},

		_handleStencilClose: function(oEvent) {
			debugger
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var obj = oSelectedItem.getBindingContext().getObject();
			
			if (oSelectedItem) {
				var Stencil = oSelectedItem.getBindingContext().getObject().StencilNumber;
			}
			that.path.setValue(obj.StencilNumber);
			
					var row = that.getView().byId("idDeleteTable").getItems();
					for(var i = 0 ; i < row.length ; i++){
						if( i != that.path.getParent().getBindingContextPath().split('/')[1] 
						&& that.path.getValue() != ""
						&& DeleteJModel.getData()[i].StencilNumber != "" 
						&& that.path.getValue() == DeleteJModel.getData()[i].StencilNumber ){
							sap.m.MessageToast.show("Stencil already entered.");
							that.path.setValue();
							return false;
						}
					}
			
			if(that.getView().byId("btnDelete").getVisible()==true){
				that.path.getParent().getCells()[1].setValue(obj.CustomerText);
				that.path.getParent().getCells()[2].setValue(obj.HubName);
				that.path.getParent().getCells()[3].setValue(obj.CompanyText);
				that.path.getParent().getCells()[4].setValue(obj.Product_SizeText);
				that.path.getParent().getCells()[5].setValue(obj.Item_CodeText);
			}
			
		},

//////////////////////////////////////////////////////////////////////////////////////////////////
onLiveStencil:function(oEvent){
	debugger
	var text = oEvent.getSource().getValue();
	var code = text.charCodeAt(text.length-1);
	
		if(text.length > 0){
				if ( !(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123) ){
					text = text.substring( 0 , text.length - 1 );
				}
				
		}
		
		oEvent.getSource().setValue(text.toString().toUpperCase());
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onChangeStencil:function(oEvent){
	debugger
	var text = oEvent.getSource().getValue();
	oEvent.getSource().setValue(text.toString().toUpperCase());
	
	var code = text.charCodeAt(text.length-1);
	var first = text.charCodeAt(text[0]);
	var lastFour = text.substr(text.length - 4);
	
	for(var i = 0 ; i < text.length ; i++){
		var code = text.charCodeAt(text[i]);
	
		if ( !(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123) ){
			sap.m.MessageToast.show("Stencil number should only have alphabets and numbers.");
			oEvent.getSource().setValue();
			return false;
		}
		
	}

	if(!(first > 64 && first < 91) && !(first > 96 && first < 123)){
		sap.m.MessageToast.show("Stencil should start with a character.");
		oEvent.getSource().setValue();
		return false;
	}
	if(isNaN(lastFour)){
		sap.m.MessageToast.show("Last four digits should be number.");
		oEvent.getSource().setValue();
		return false;
	}
	
	var row = this.getView().byId("idDataTable").getItems();
	for(var i = 0 ; i < row.length ; i++){
		if( i != oEvent.getSource().getParent().getBindingContextPath().split('/')[1] 
			&& oEvent.getSource().getValue() != ""
			&& StencilJModel.getData()[i].StencilNumber != "" 
			&& oEvent.getSource().getValue() == StencilJModel.getData()[i].StencilNumber ) {
				
				sap.m.MessageToast.show("Stencil already entered.");
				oEvent.getSource().setValue();
				return false;
		}
	}
	
	oEvent.getSource().getParent().getCells()[1].setSelectedKey();
	oEvent.getSource().getParent().getCells()[2].setValue();
	oEvent.getSource().getParent().getCells()[3].setValue();
	oEvent.getSource().getParent().getCells()[4].setValue();
	oEvent.getSource().getParent().getCells()[5].setValue();
	oEvent.getSource().getParent().getCells()[6].setValue();
	oEvent.getSource().getParent().getCells()[7].setValue();
	oEvent.getSource().getParent().getCells()[8].setValue();
	oEvent.getSource().getParent().getCells()[9].setValue();
	oEvent.getSource().getParent().getCells()[10].setValue();
	oEvent.getSource().getParent().getCells()[11].setValue();
	oEvent.getSource().getParent().getCells()[12].setSelectedKey();
	oEvent.getSource().getParent().getCells()[13].setSelectedKey();
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onChangeStencilDelete:function(oEvent){
	debugger
	var row = this.getView().byId("idDeleteTable").getItems();
	for(var i = 0 ; i < row.length ; i++){
		if( i != oEvent.getSource().getParent().getBindingContextPath().split('/')[1] 
		&& oEvent.getSource().getValue() != ""
		&& DeleteJModel.getData()[i].StencilNumber != "" 
		&& oEvent.getSource().getValue() == DeleteJModel.getData()[i].StencilNumber ){
			sap.m.MessageToast.show("Stencil already entered.");
			oEvent.getSource().setValue();
			return false;
		}
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onItemDesc:function(oEvent){
	debugger
	oEvent.getSource().getParent().getCells()[7].setValueState("None");
	oEvent.getSource().getParent().getCells()[9].setValueState("None");
	
	var company = oEvent.getSource().getParent().getCells()[6].getValue();
	var comdesc = oEvent.getSource().getParent().getCells()[7].getValue();
	var size 	= oEvent.getSource().getParent().getCells()[8].getValue();
	var sizedesc = oEvent.getSource().getParent().getCells()[9].getValue();
	
	if(size == ""){
		oEvent.getSource().getParent().getCells()[9].setValueState("Error");
		sap.m.MessageToast.show("Please select Tyre Size");
		return false;
	}
	if(company == ""){
		oEvent.getSource().getParent().getCells()[7].setValueState("Error");
		sap.m.MessageToast.show("Please select Tyre Company");
		return false;
	}
	
	this.itemDesc = oEvent.getSource().getId();
	var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4MaterialDescriptionSet?$filter=ProdSize eq '"+size+"' and TyreCompany eq '"+company+"'";
	var itemModel = new sap.ui.model.json.JSONModel();
	itemModel.loadData(sPath, null, false,"GET",false, false, null);

	var _itemDialog = new sap.m.SelectDialog({
				title : "Select Material",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
						title : "{Maktx}",
						description:"{Matnr}",
						customData : [ new sap.ui.core.CustomData({
							key : "{Matnr}",
							value : "{Maktx}"
						})],
					}),
				},
		liveChange : function(oEvent) {
			debugger
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
			oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
		},
			confirm : [ this._itemDialogClose, this ],
			cancel  : [ this._itemDialogClose, this ]
	});
	_itemDialog.setModel(itemModel);
	_itemDialog.open();
},

_itemDialogClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var item = sap.ui.getCore().byId(this.itemDesc);
	
	if (oSelectedItem) {
		var obj = oSelectedItem.getBindingContext().getObject();
		item.setValue(obj.Maktx);
		item.getParent().getCells()[10].setValue(obj.Matnr);
		
		item.getParent().getCells()[12].setSelectedKey();
		item.getParent().getCells()[13].setSelectedKey();
	}
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onProdSize:function(oEvent){
	debugger
	oEvent.getSource().getParent().getCells()[7].setValueState("None");
	
	if(oEvent.getSource().getParent().getCells()[7].getValue() == ""){
		oEvent.getSource().getParent().getCells()[7].setValueState("Error");
		sap.m.MessageToast.show("Please enter Tyre Company.");
		return false;
	}
	
	this.ProdSize = oEvent.getSource().getId();
	var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ProdSizeSet";
	var sizeModel = new sap.ui.model.json.JSONModel();
		sizeModel.loadData(sPath, null, false,"GET",false, false, null);

	var _sizeDialog = new sap.m.SelectDialog({
				title : "Select Product Size",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
						title : "{ProdDesc}",
					//	description:"{ProdSize}",
						customData : [ new sap.ui.core.CustomData({
							key : "{ProdSize}",
							value : "{ProdDesc}"
						})],
					}),
				},
		liveChange : function(oEvent) {
			debugger
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("ProdSize",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter1 = new sap.ui.model.Filter("ProdDesc",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
			oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
		},
			confirm : [ this._sizeDialogClose, this ],
			cancel  : [ this._sizeDialogClose, this ]
	});
	_sizeDialog.setModel(sizeModel);
	_sizeDialog.open();
},

_sizeDialogClose: function(oEvent) {
	var oSelectedItem = oEvent.getParameter("selectedItem");
	var size = sap.ui.getCore().byId(this.ProdSize);
	if (oSelectedItem) {
		var obj = oSelectedItem.getBindingContext().getObject();
		size.setValue(obj.ProdDesc);
		size.getParent().getCells()[8].setValue(obj.ProdSize);
		
		size.getParent().getCells()[10].setValue();
		size.getParent().getCells()[11].setValue();
		size.getParent().getCells()[12].setSelectedKey();
		size.getParent().getCells()[13].setSelectedKey();
	}
},

//////////////////////////////////////////////////////////////////////////////////////////////////
onTyreCompany:function(oEvent){
	debugger
	
	if(oEvent.getSource().getParent().getCells()[1].getSelectedKey() == '01'){
		oEvent.getSource().getParent().getCells()[6].setValue('JK');
		oEvent.getSource().getParent().getCells()[7].setValue('JK Tyre');
		return false;
	}
	
	oEvent.getSource().getParent().getCells()[0].setValueState("None");
	
	if(oEvent.getSource().getParent().getCells()[0].getValue() == ""){
		oEvent.getSource().getParent().getCells()[0].setValueState("Error");
		sap.m.MessageToast.show("Please enter Stencil Number.");
		return false;
	}
	
	oEvent.getSource().getParent().getCells()[1].setValueState("None");
	
	if(oEvent.getSource().getParent().getCells()[1].getSelectedKey() == ""){
		oEvent.getSource().getParent().getCells()[1].setValueState("Error");
		sap.m.MessageToast.show("Please select Owner.");
		return false;
	}
	
	this.tyreCompany = oEvent.getSource();
	
	var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_NonJK_Tyre_CompanySet";
	var companyModel = new sap.ui.model.json.JSONModel();
		companyModel.loadData(sPath, null, false,"GET",false, false, null);

	var _tyreCompanyDialog = new sap.m.SelectDialog({
				title : "Select Company",
				items : {
					path : "/d/results",
					template : new sap.m.StandardListItem({
						title : "{Text}",
						//description:"{NonJkCompany}",
						customData : [ new sap.ui.core.CustomData({
							key : "{NonJkCompany}",
							value : "{Text}"
						})],
					}),
				},
		liveChange : function(oEvent) {
			debugger
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("NonJkCompany",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter1 = new sap.ui.model.Filter("Text",sap.ui.model.FilterOperator.Contains,sValue);
			var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
			oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
		},
			confirm : [ this._tyreCompanyDialogClose, this ],
			cancel  : [ this._tyreCompanyDialogClose, this ]
	});
	_tyreCompanyDialog.setModel(companyModel);
	_tyreCompanyDialog.open();
	},

	_tyreCompanyDialogClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var company = sap.ui.getCore().byId(this.tyreCompany);
			
			if (oSelectedItem) {
				var obj = oSelectedItem.getBindingContext().getObject();
				this.tyreCompany.getParent().getCells()[6].setValue(obj.NonJkCompany);
				this.tyreCompany.getParent().getCells()[7].setValue(obj.Text);
				
				this.tyreCompany.getParent().getCells()[8].setValue();
				this.tyreCompany.getParent().getCells()[9].setValue();
				this.tyreCompany.getParent().getCells()[10].setValue();
				this.tyreCompany.getParent().getCells()[11].setValue();
				this.tyreCompany.getParent().getCells()[12].setSelectedKey();
				this.tyreCompany.getParent().getCells()[13].setSelectedKey();
			}
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
onStencilSearch : function()
	{
		debugger
		var that = this;
		
		var stencil = this.getView().byId("idStencil").getValue();
		if(stencil==undefined)stencil="";
		
		var fleet = this.getView().byId("idFleet").getValue();
		if(fleet==undefined)fleet="";
		
		var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
		var sPathStncl = "StencilMasterSet?$filter=StencilNumber eq '"+stencil+"' and Customer eq '"+fleet+"'&$expand=StencilMasterToItemNvg";
		
		var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var oParamsStnclSrch = {};
		oParamsStnclSrch.context = "";
		oParamsStnclSrch.urlParameters = "";
		
		oParamsStnclSrch.success = function(oData, oResponse) {
			debugger
			StencilJModel.setData(oData.results[0].StencilMasterToItemNvg.results);
			StencilJModel.refresh();
			
			var length = that.getView().byId("idDataTable").getItems().length;
			var cells  = that.getView().byId("idDataTable").getItems()[0].getCells().length;
			
			for(var i = 0 ; i < length ; i++){
				for(var j = 1 ; j < cells ; j++){
					that.getView().byId("idDataTable").getItems()[i].getCells()[j].setEnabled(false);
					//var j is for cells, from index 1 to last
				}
			}
		}
		
		oParamsStnclSrch.error = function(oError) {
			jQuery.sap.log.error("Error");
		}.bind(this);
		
		frameworkODataModel.read(sPathStncl, oParamsStnclSrch);
		frameworkODataModel.attachRequestCompleted(function() {
		});

},
//////////////////////////////////////////////////////////////////////////////////////////////////
onDeleteRow:function(oEvent){
	debugger
	
	var index = oEvent.getSource().getParent().getBindingContextPath().split('/')[1];
	StencilJModel.getData().splice(index,1);
	StencilJModel.refresh();
	
},

onDeleteTableRow:function(oEvent){
debugger
	
	var index = oEvent.getSource().getParent().getBindingContextPath().split('/')[1];
	DeleteJModel.getData().splice(index,1);
	DeleteJModel.refresh();
	
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onCheckBox:function(oEvent){
	debugger
	/*var index = oEvent.getSource().getParent().getBindingContextPath().toString().split('/')[1];
	var cell = this.getView().byId("idDataTable").getItems()[index].getCells();
	
	if(oEvent.getSource().getSelected()== true){
		for(var i = 1 ; i < cell.length ; i++){
			cell[i].setEnabled(true);
		}
	}else{
		for(var i = 1 ; i < cell.length ; i++){
			cell[i].setEnabled(false);
		}
	}*/
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onAddRow:function(){
	debugger
	
	if(this.getView().byId("btnCreate").getVisible()==true){
		
		var row={
				"StencilNumber":"",
				"Owner":"",
				"Customer":"",
				"CustomerText":"",
				"Hub":"",
				"HubName":"",
				"Company":"",
				"CompanyText":"",
				"Item_Code":"",
				"Item_CodeText":"",
				"Product_Size":"",
				"Product_SizeText":"",
		}
		
		if(StencilJModel.getData() == undefined || StencilJModel.getData().length == undefined || StencilJModel.getData().length < 1)
		{
			var arr = [];
			arr.push(row);
			StencilJModel.setData(arr);
		}
		else
			StencilJModel.oData.push(row);
		
		StencilJModel.refresh();
		
	}
	
	if(this.getView().byId("btnDelete").getVisible()==true){
		
		var row={
				"StencilNumber":"",
				"CustomerText":"",
				"HubName":"",
				"CompanyText":"",
				"Item_CodeText":"",
				"Product_SizeText":"",
		}
		
		if(DeleteJModel.getData() == undefined || DeleteJModel.getData().length == undefined || DeleteJModel.getData().length < 1){
			var arr = [];
			arr.push(row);
			DeleteJModel.setData(arr);
		}
		else
			DeleteJModel.oData.push(row);
		
		DeleteJModel.refresh();
		
	}
	
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onUpdate:function(){
	var flag = 'C';
	this.onPayload(flag);
},

onDelete:function(){
	var flag = "D";
	this.onPayload(flag);
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onPayload:function(flag){
	debugger
	var check = true;
	var row = this.getView().byId("idDataTable").getItems();
	
	var data = [];
	data.Flag = flag;
	
	data.StencilMasterToItemNvg = [];

	if(flag == 'C'){
		for(var i = 0 ; i < row.length ; i++){
			var cell = this.getView().byId("idDataTable").getItems()[i].getCells();
			
			for(var j = 0 ; j < cell.length-1 ; j++){
				cell[0].setValueState("None");
				if(cell[0].getValue() == ""){cell[0].setValueState("Error"); check = false;}
				
				cell[1].setValueState("None");
				if(cell[1].getSelectedKey() == ""){cell[1].setValueState("Error"); check = false;}
				
				cell[3].setValueState("None");
				if(cell[3].getValue() == ""){cell[3].setValueState("Error"); check = false;}
				
				cell[5].setValueState("None");
				if(cell[5].getValue() == ""){cell[5].setValueState("Error"); check = false;}
				
				cell[7].setValueState("None");
				if(cell[7].getValue() == ""){cell[7].setValueState("Error"); check = false;}
				
				cell[9].setValueState("None");
				if(cell[9].getValue() == ""){cell[9].setValueState("Error"); check = false;}
				
				cell[11].setValueState("None");
				if(cell[11].getValue() == ""){cell[11].setValueState("Error"); check = false;}
				
				cell[12].setValueState("None");
				if(cell[12].getSelectedKey() == ""){cell[12].setValueState("Error"); check = false;}
				
				cell[13].setValueState("None");
				if(cell[13].getSelectedKey() == ""){cell[13].setValueState("Error"); check = false;}
			}
		}
		
		if(check == false){
			sap.m.MessageToast.show("Please Input Required Fields.");
			return;
		}
		
		for(var i = 0 ; i < row.length ; i++){
			
			var obj={};
			
				obj.StencilNumber	= this.getView().byId("idDataTable").getItems()[i].getCells()[0].getValue();
				obj.Owner			= this.getView().byId("idDataTable").getItems()[i].getCells()[1].getSelectedKey();
				obj.Customer		= this.getView().byId("idDataTable").getItems()[i].getCells()[2].getValue();
				obj.CustomerText="";
				obj.Hub				= this.getView().byId("idDataTable").getItems()[i].getCells()[4].getValue();
				obj.HubName="";
				obj.Company 		= this.getView().byId("idDataTable").getItems()[i].getCells()[6].getValue();
				obj.CompanyText="";
				obj.Product_Size 	= this.getView().byId("idDataTable").getItems()[i].getCells()[8].getValue();
				obj.Product_SizeText="";
				obj.Item_Code 		= this.getView().byId("idDataTable").getItems()[i].getCells()[10].getValue();
				obj.Item_CodeText="";
				obj.Tyre_Type 		= this.getView().byId("idDataTable").getItems()[i].getCells()[12].getSelectedKey();
				obj.Location 		= this.getView().byId("idDataTable").getItems()[i].getCells()[13].getSelectedKey();
				obj.Status="";
				
				data.StencilMasterToItemNvg.push(obj);
		}
	}
	
	if(flag == 'D'){
		var deleterow = this.getView().byId("idDeleteTable").getItems();
		
		for(var i = 0 ; i < deleterow.length ; i++){
			var cell = deleterow[i].getCells();
			
				for(var j = 0 ; j < cell.length-1 ; j++){
					cell[0].setValueState("None");
					if(cell[0].getValue() == ""){cell[0].setValueState("Error"); check = false;}
				}
		}
		
		if(check == false){
			sap.m.MessageToast.show("Please Input Required Fields.");
			return;
		}
		
		for(var i = 0 ; i < deleterow.length ; i++){
					var obj={};
						obj.StencilNumber	= this.getView().byId("idDeleteTable").getItems()[i].getCells()[0].getValue();
						obj.Owner			= "";
						obj.Customer		= "";
						obj.CustomerText	= "";
						obj.Hub				= "";
						obj.HubName			= "";
						obj.Company 		= "";
						obj.CompanyText		= "";
						obj.Product_Size 	= "";
						obj.Product_SizeText= "";
						obj.Item_Code 		= "";
						obj.Item_CodeText	= "";
						obj.Tyre_Type 		= "";
						obj.Location 		= "";
						obj.Status="";
						
						data.StencilMasterToItemNvg.push(obj);
				}
	}
	
	var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV";
	var sPath = "/StencilMasterSet";
	var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
	oCreateModel.setHeaders({
		"Content-Type": "application/atom+xml"
	});
	var fncSuccess = function(oData, oResponse) 
	{
		that.newBusy.close();
		that.getView().byId("FileUploaderId").clear();
		//sap.m.MessageBox.success("Database Has Been Updated.");
		
		StencilJModel.setData(); StencilJModel.refresh();
		DeleteJModel.setData();  DeleteJModel.refresh();
		
		if(oData.Flag == 'C'){
			sap.m.MessageBox.success("Stencil(s) added successfully.", {
				actions: [MessageBox.Action.OK],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					that.onMainPage();
				}
			});
		}
		
		if(oData.Flag == 'D'){
			sap.m.MessageBox.success("Stencil(s) deleted successfully.", {
				actions: [MessageBox.Action.OK],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					that.onMainPage();
				}
			});
		}
		
	}
	
	var fncError = function(oError){
		that.newBusy.close();
		that.getView().byId("FileUploaderId").clear();
		sap.m.MessageBox.success("Error In Updating The Database.");
		
	}
	that.newBusy.open();
	//Create Method for final Save
	oCreateModel.create(sPath, data, {
		success: fncSuccess,
		error: fncError
	});
	
},

//////////////////////////////////////////////////////////////////////////////////////////////////
onMainPage:function(){
	debugger
	var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
	oCrossAppNavigator.toExternal({
									target: { semanticObject : "#"}
								});
},
//////////////////////////////////////////////////////////////////////////////////////////////////
onErrorStencil : sap.m.Table.prototype.exportData || function(e) {
	debugger

	var StencilDataModel = new sap.ui.model.json.JSONModel();
	
	var oExport = new sap.ui.core.util.Export({
	exportType : new sap.ui.core.util.ExportTypeCSV({
	separatorChar: "\t",
	mimeType: "application/vnd.ms-excel",
	charset: "utf-8",
	fileExtension: "xls"
	}),
	models : ErrorJModel,
		rows : {
		path : "/",
	},
			
	columns: [
				{
					name: "StencilNumber",
					template: {
					content: "{StencilNumber}"
					},
					},
			]
	});
		 //* download exported file
		 oExport.saveFile().always(function() {
			this.destroy();
		});
	},	
//////////////////////////////////////////////////////////////////////////////////////////////////
onDeleteTemplate : sap.m.Table.prototype.exportData || function(oEvent) {
	debugger

	var StencilDataModel = new sap.ui.model.json.JSONModel();
	
	var oExport = new sap.ui.core.util.Export({
	exportType : new sap.ui.core.util.ExportTypeCSV({
	separatorChar: "\t",
	mimeType: "application/vnd.ms-excel",
	charset: "utf-8",
	fileExtension: "xls"
	}),
	models : StencilDataModel,
		rows : {
		path : "/",
	},
			
	columns: [
				{
					name: "StencilNumber",
					template: {
					content: "{StencilNumber}"
					},
					},
			]
	});
		 //* download exported file
		 oExport.saveFile().always(function() {
			this.destroy();
		});
	},	
//////////////////////////////////////////////////////////////////////////////////////////////////
onCreateTemplate : sap.m.Table.prototype.exportData || function(oEvent) {
	debugger

	var StencilDataModel = new sap.ui.model.json.JSONModel();
	
	var oExport = new sap.ui.core.util.Export({
	exportType : new sap.ui.core.util.ExportTypeCSV({
	separatorChar: "\t",
	mimeType: "application/vnd.ms-excel",
	charset: "utf-8",
	fileExtension: "xls"
	}),
	models : StencilDataModel,
		rows : {
		path : "/",
	},
			
	columns: [
				{
					name: "StencilNumber",
					template: {
					content: "{StencilNumber}"
					},
					},
				{
					name: "Owner",
					template: {
					content: "{Owner}"
					},
					},
				{
					name: "Customer",
					template: {
					content: "{Customer}"
					},
					},
				{
					name: "Hub",
					template: {
					content: "{Hub}"
					},
					},
				{
					name: "Company",
					template: {
					content: "{Company}"
					},
					},
				{
					name: "Product_Size",
					template: {
					content: "{Product_Size}"
					},
					},
				{
					name: "Item_Code",
					template: {
					content: "{Item_Code}"
					},
					},
				{
					name: "Tyre_Type",
					template: {
					content: "{Tyre_Type}"
					},
					},
				{
					name: "Location",
					template: {
					content: "{Location}"
					},
					},
			]
	});
		 //* download exported file
		 oExport.saveFile().always(function() {
			this.destroy();
		});
	},	
//////////////////////////////////////////////////////////////////////////////////////////////////

})
})

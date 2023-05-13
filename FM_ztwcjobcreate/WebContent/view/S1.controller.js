
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("ztwcjobcreate.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.FlexJustifyContent");
jQuery.sap.require("sap.ui.model.Filter");
jQuery.sap.require("sap.ui.model.FilterOperator");


var DataArticles, that, twkunnr,twname,mode,customer, kunnrname, hubName, 
	ConfigCode,ProdSize,EnrolMode, hubCode, reqDate,CustNo,CpNo,Mobile;
sap.ui.core.mvc.Controller
		.extend(
				"ztwcjobcreate.view.S1",
				{
					onInit : function() {
						debugger
						this.newBusy = new sap.m.BusyDialog();
						this.bindStateData();
						this.bindStateData1();
						this.bindServiceSheetSet();
						this.validateFields();
						this.model = this.getOwnerComponent().getModel();
						var recModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(recModel, "recModel");
						
						that = this;
						if (!jQuery.support.touch) {
							this.getView().addStyleClass("sapUiSizeCompact");
						}
						
						if (sap.ui.Device.system.desktop) {
						}
						
//						****************added by Hans on 8 Jan 2019 ***************

						var serviceSheetJModel = new sap.ui.model.json.JSONModel();
						debugger
						serviceSheetJModel.setData([]);
						this.fitArr = [];
						this.getView().setModel(serviceSheetJModel,"serviceSheetJModel");
						
						this.onMechanicalCon();
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oReadModel.setHeaders({"Content-Type" : "application/json"});
						var fncSuccess = function(oData, oResponse){
							debugger
							if(oData.Error == "X" ){
								sap.m.MessageBox.show("You are not authorized", {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									onClose:function(){
										window.history.back();
									}
									});	
							}else{
								that.FleetData=oData;								
								var jModel;
								var headerText;
									
									twkunnr = that.FleetData.TWKunnr;
									twname  = that.FleetData.Name;
									
									var headtext = twname + "  "+"(" + twkunnr + ")" ;
									
									headerText = that.getView().byId("HeaderIdTit").setText(headtext);									
									jModel = new sap.ui.model.json.JSONModel();		
						 }
						}
					
						var fncSuccess1 = function(oData, oResponse){
							//new sap.m.Select({selectedKey:"{RemoveOk}",change:[that.onAction,that],items:[new sap.ui.core.Item({text:"OK",key:"O"}),new sap.ui.core.Item({text:"Remove",key:"R"})],forceSelection:false}),
							that.nonjkSelect=new sap.m.Select({change:[that.onCompanyChange,that],forceSelection:false,visible:false,enabled:false});
							that.nonjkSelect1=new sap.m.Select({change:[that.onCompanyChange1,that],forceSelection:false ,visible:true});
							var jModel = new sap.ui.model.json.JSONModel(oData.results);
							that.nonjkSelect.unbindAggregation("items");
							that.nonjkSelect1.unbindAggregation("items");
							//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
							that.nonjkSelect.setModel(jModel);
							that.nonjkSelect1.setModel(jModel);
							that.nonjkSelect.bindAggregation("items", {
									path: "/",
									template: new sap.ui.core.Item({
										key: "{NonJkCompany}",
										text: "{Text}"
									})
								});
							that.nonjkSelect1.bindAggregation("items", {
								path: "/",
								template: new sap.ui.core.Item({
									key: "{NonJkCompany}",
									text: "{Text}"
								})
							});
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
						oReadModel.read("/GetUserTruckWheelInfoSet(Uname='"+sap.ushell.Container.getService("UserInfo").getId()+"')", {
							success : fncSuccess,
							error : fncError
						});
						oReadModel.read("/F4_NonJK_Tyre_CompanySet", {
							success : fncSuccess1,
							error : fncError
						}); 
						debugger
						var reqDate = new Date();
//						reqDate = "" + reqDate;
//						reqDate = reqDate.substring(4,15);
						this.getView().byId("idReqDate").setText(reqDate);
						var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		                     pattern : "dd-MM-yyyy"
						});
						this.getView().byId("idReqDate").setText(oDateFormat.format(reqDate));
						
					},
					
					//Validate All field onload,13-02-2019//
					validateFields : function(){
						debugger
						this.getView().byId("idCustomerName").setEnabled(false);
						this.getView().byId("idmccon").setEnabled(false);
						this.getView().byId("idEarPSI").setEnabled(false);
						this.getView().byId("VehicleMakeID").setEnabled(false);
						this.getView().byId("VehicleModelID").setEnabled(false);
						this.getView().byId("ConfigurationIDID").setEnabled(false);
						this.getView().byId("TySz").setEnabled(false);
						this.getView().byId("ChasisNoID").setEnabled(false);
						this.getView().byId("EngineNooID").setEnabled(false);
						this.getView().byId("FRegistrationYearEdit").setEnabled(false);
						this.getView().byId("FVehicleCCEdit").setEnabled(false);
						this.getView().byId("FAvgRunningSpeedEdit").setEnabled(false);
						this.getView().byId("FLoopDistanceEdit").setEnabled(false);
						this.getView().byId("idEarApp1").setEnabled(false);
						this.getView().byId("FGoodsCarriedEdit").setEnabled(false);
						
					},
//////////////////////////////////////////////////////////////////////////////////////////////////
	NumHyphen: function(oEvent){
		var text = oEvent.getSource().getValue();
		var code = text.charCodeAt(text.length-1);
							 
			if(text.length == 1){
					if ( !(code > 47 && code < 58) && !(code == 45) ) 
						{
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
			/*var value = Math.abs(text);
			if(value > 0)*/
				oEvent.getSource().setValue(text);	
			/*else{ 
				sap.m.MessageToast.show("Please enter a valid value.");*/
		},
//////////////////////////////////////////////////////////////////////////////////////////////////					
					
		onMecCon:function(evt){
						var key=evt.getSource().getSelectedKey();
						if(key=="Y"){
							this.getView().byId("idreason1").setVisible(false);
							this.getView().byId("idReason").setVisible(false);
							this.getView().byId("idReason").setEnabled(false);
							this.getView().byId("idReasonlbl").setVisible(false);
							
						}else{
							this.getView().byId("idreason1").setVisible(true);
							this.getView().byId("idReason").setVisible(true);
							this.getView().byId("idReason").setEnabled(true);
							this.getView().byId("idReasonlbl").setVisible(true); 
						}	
					},
					
					onMechanicalCon:function(){
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Mechanical_ReasonSet";
						var selectreas=that.getView().byId("idReason");
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						if(jModel.getData().d.results.length){
							selectreas.unbindAggregation("items");
							//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
							selectreas.setModel(jModel);
							selectreas.bindAggregation("items", {
									path: "/d/results",
									template: new sap.ui.core.Item({
										key: "{CondReason}",
										text: "{Desc}"
									})
								});
						
						}},
						
					onRotationChange:function(evt){
						var key=evt.getSource().getSelectedKey();
						var table=that.data.ContractType=="CPKM"?that.getView().byId("tblDetail"):that.getView().byId("tblDetail1");
						var coloum=that.data.ContractType=="CPKM"?that.getView().byId("idnewPos"):that.getView().byId("idnewPos1");
						coloum.setVisible(true);
						if(key=="A"){
						for(var i=0;i<table.getItems().length;i++){
							table.getItems()[i].getCells()[1].setEditable(false).setValue(table.getItems()[i].getBindingContext().getObject().RotationPos).setShowValueHelp(false);
							table.getItems()[i].getCells()[1].setEditable(false)
						}	
						}else if(key=="M"){
							for(var i=0;i<table.getItems().length;i++){
								table.getItems()[i].getCells()[1].setEditable(true).setValue().setShowValueHelp(true);	
							}
							
						}else{
							coloum.setVisible(false);
						}
						
					},
					
					
					onCompanyChange:function(evt){
						evt.getSource().getParent().getBindingContext().getObject().NonJkCompany=evt.getParameter("selectedItem").getKey()
						var key=evt.getSource().getSelectedKey();
							that.selectedCompanyKey = key;
							if(key=="JK"){
								evt.getSource().getParent().getParent().getCells()[3].setShowValueHelp(true).setValue();
								evt.getSource().getParent().getParent().getCells()[4].setShowValueHelp(true).setValue();
								//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
									
								}else{
									evt.getSource().getParent().getParent().getCells()[3].setShowValueHelp(true).setValue();
									evt.getSource().getParent().getParent().getCells()[4].setShowValueHelp(true).setValue();
									//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
								}
						},
					onHubFragment:function(){
						var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_User_Fleet_HubSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CKunnr  eq '"+sap.ui.getCore().byId("idFleet").getName()+"'";
						var jModel = new sap.ui.model.json.JSONModel();
						jModel.loadData(sPath, null, false, "GET", false,
								false, null);
						if(jModel.getData().d.results.length){
						var _valueHelpHubelectDialog = new sap.m.SelectDialog(
								{

									title : "Select Hub",
									items : {
										path : "/d/results",
										template : new sap.m.StandardListItem(
												{
													title : "{HubName}",
													Description:"{HubCode}",
													customData : [ new sap.ui.core.CustomData(
															{
																key : "Key",
																value : "{HubCode}"
															}) ],

												}),
									},
									liveChange : function(oEvent) {
										var sValue = oEvent
												.getParameter("value");
	
	 var oFilter = new sap.ui.model.Filter("HubName",sap.ui.model.FilterOperator.Contains,sValue);
     var oFilter2 = new sap.ui.model.Filter("HubCode",sap.ui.model.FilterOperator.Contains,sValue);
     var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false );
										oEvent.getSource().getBinding("items")
												.filter([ oFilter1 ]);
									},
									confirm : [ this._handleHubClose, this ],
									cancel : [ this._handleHubClose, this ]
								});
						_valueHelpHubelectDialog.setModel(jModel);
						_valueHelpHubelectDialog.open();
						}else{
							sap.m.MessageToast.show("You are not authorised for any Hub in Fleet "+sap.ui.getCore().byId("idFleet").getValue())
						}
					},
					_handleHubClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							sap.ui.getCore().byId("idHub").setValue(oSelectedItem.getTitle());
							sap.ui.getCore().byId("idHub").setName(oSelectedItem.getBindingContext().getObject().HubCode);
						/*	var value = that.getView().byId("HeaderIdTit").getText()+" ("+oSelectedItem.getTitle()+")";
							that.getView().byId("HeaderIdTit").setText(value);*/
							
							hubCode= oSelectedItem.getBindingContext().getObject().HubCode;
							var value = kunnrname+" ("+oSelectedItem.getTitle()+")";
							that.getView().byId("HeaderIdTit").setText(value);		
							
						}
					},
									
					
					onFleetFragment:function(){
						debugger
						var jModel = new sap.ui.model.json.JSONModel(that.FleetData);
						var _valueHelpFleetDialog = new sap.m.SelectDialog(
						{
						title : "Select Fleet",
						items : {
						path : "/results",
						template : new sap.m.StandardListItem(
						{
						title : "{FleetName}",
						customData : [ new sap.ui.core.CustomData(
						{
						key : "Key",
						value : "{Kunnr}"
						}) ],
						}),
						},
						liveChange : function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("FleetName",sap.ui.model.FilterOperator.Contains,sValue);
						// var oFilter2 = new sap.ui.model.Filter("Descr",sap.ui.model.FilterOperator.Contains,sValue);
						// var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
						oEvent.getSource().getBinding("items").filter([ oFilter ]);
						},
						confirm : [ this._handleFleetClose, this ],
						cancel :  [ this._handleFleetClose, this ]
						});
						_valueHelpFleetDialog.setModel(jModel);
						_valueHelpFleetDialog.open();
					    },
					_handleFleetClose : function(oEvent) {
						var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
						var enrolMode =	oSelectedItem.getBindingContext().getObject().EnrolMode;
						if(enrolMode === "F"){
							that.getView().byId("IdSer").setVisible(false);
							
						}else{
							that.getView().byId("IdSer").setVisible(true);
						}
							sap.ui.getCore().byId("idHub").setEnabled(true).setValue();
							sap.ui.getCore().byId("idFleet").setValue(oSelectedItem.getTitle());
							kunnrname = oSelectedItem.getTitle();
						 that.getView().byId("HeaderIdTit").setText(oSelectedItem.getTitle());
						 sap.ui.getCore().byId("idFleet").setName(oSelectedItem.getBindingContext().getObject().Kunnr);
						 kunnr = oSelectedItem.getBindingContext().getObject().Kunnr;
						}

					},
					onFleetCloseButton:function(){
						if(sap.ui.getCore().byId("idFleet").getValue()!=""&& sap.ui.getCore().byId("idHub").getValue()!=""){
						that._FleetDialog.close();
						}
						else{
							sap.m.messageToast.show("Select Fleet and Hub")
						}
						
					},
					onFleetCloseCancle:function(){
						window.history.back();
					},
					TempRex:function(evt){
						
						var value=evt.getSource().getValue();
						var regexp = /^\d+(\.\d{1,2})?$/;
//						if(regexp.test(value)){
//						}
						if(value!="-"){
						if(isNaN(value)){

							value = value.substring(0, value.length - 1);
							evt.getSource().setValue(value);
						}
						}
					},
					TempRex1:function(evt){
						var value=evt.getSource().getValue();
						var regexp = /^\d+(\.\d{1,2})?$/;
//						if(regexp.test(value)){
//						}
						
						if(isNaN(value)){
						value = value.substring(0, value.length - 1);
						evt.getSource().setValue(value);
						}
											},
					onVecRegNo:function(){
						debugger
					if(kunnr){
					var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_VEHICLE_REG_NOSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CType eq 'I'and CKunnr  eq '"+ kunnr +"'";
					}
					else
					{
					var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_VEHICLE_REG_NOSet?$filter=CUname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'and CType eq 'I'and CKunnr  eq '"+sap.ui.getCore().byId("idFleet").getName()+"'";
					}
					var jModel = new sap.ui.model.json.JSONModel();
					jModel.loadData(sPath, null, false, "GET", false,false, null);
					var _valueHelpClaimSelectDialog = new sap.m.SelectDialog(
					{
					title : "Select Vehicle",
					items : {
					path : "/d/results",
					template : new sap.m.StandardListItem(
					{
					title : "{RegNo}",
					customData : [ new sap.ui.core.CustomData(
					{
					key : "Key",
					value : "{RegNo}"
					}) ],
					}),
					},
					liveChange : function(oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("RegNo",sap.ui.model.FilterOperator.Contains,sValue);
	    // var oFilter2 = new sap.ui.model.Filter("Descr",sap.ui.model.FilterOperator.Contains,sValue);
	    // var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
					oEvent.getSource().getBinding("items").filter([ oFilter ]);
					},
					confirm : [ this._handleTypeClaimClose, this ],
					cancel : [ this._handleTypeClaimClose, this ]
					});
					_valueHelpClaimSelectDialog.setModel(jModel);
					_valueHelpClaimSelectDialog.open();
					},
					_handleTypeClaimClose : function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
					this.getView().byId("FVehicleNoEdit").setValue(oSelectedItem.getTitle());
					this.onVehicalDetails();
					}
					},

					
					upperCase: function(oEvent){						
						var val = oEvent.getParameter("value");
						val = val.replace(/ +/g, "");
						if(val.length > 0){
							this.getView().byId("FVehicleNoEdit").setValue(val.toUpperCase());
							this.getView().byId("IdGo").setEnabled(true);
							
						}else{
							this.getView().byId("IdGo").setEnabled(false);
						}
					
					},
					
					
					/*change sumit 13/01/2018*/
					validateHeaderDetails: function(){
						debugger
						var valid = true;
						var make 		= this.getView().byId("VehicleMakeID");
						var model 		= this.getView().byId("VehicleModelID");
						var config 		= this.getView().byId("ConfigurationIDID");
						var prod 		= this.getView().byId("TySz");
						var reg 		= this.getView().byId("FRegistrationYearEdit");
						var cc 			= this.getView().byId("FVehicleCCEdit");
						var customer	= this.getView().byId("idCustomerName");
						var conditon 	= this.getView().byId("idmccon");
						var reason 		= this.getView().byId("idReason");
						var lmilostatus = this.getView().byId("idLastMilo").getSelectedKey();
					    var cmilostatus = this.getView().byId("idEarPSI").getSelectedKey();
					    var lmilo       = this.getView().byId("idLastKm").getValue();
						var cmilo 		= this.getView().byId("idMilReading").getValue();
					    var ckm   		= this.getView().byId("idMulReading").getValue();
					    
					    this.getView().byId("idMilReading").setValueState("None");
					    this.getView().byId("idMulReading").setValueState("None");
							
							if(make.getValue()==""){
								valid=false;
								make.setValueState("Error");
							}else{
								make.setValueState("None");
							}
							
							if(model.getValue()==""){
								valid=false;
								model.setValueState("Error");
							}else{
								model.setValueState("None");
							}
							
							if(config.getValue()==""){
								valid=false;
								config.setValueState("Error");
							}else{
								config.setValueState("None");
							}
							
							if(prod.getValue()==""){
								valid=false;
								prod.setValueState("Error");
							}else{
								prod.setValueState("None");
							}
							
							if(reg.getValue()==""){
								valid=false;
								reg.setValueState("Error");
							}else{
								reg.setValueState("None");
							}
							
							if(cc.getValue()< "1"){
								valid=false;
								cc.setValueState("Error");
							}else{
								cc.setValueState("None");
							}	
							
							if(customer.getValue()==""){
								valid=false;
								customer.setValueState("Error");
							}else{
								customer.setValueState("None");
							}
							
							if(conditon.getSelectedKey()==""){
								valid=false;
								conditon.setValueState("Error");
							}else{
								conditon.setValueState("None");
							}
							
							if(conditon.getSelectedKey()=="N" && reason.getSelectedKey()==""){
								valid=false;
								reason.setValueState("Error");
							}else{
								reason.setValueState("None");
							}

						return valid;					

					},
					
					/*end*/
					/*change sumit 13/01/2018*/
					onHeaderFix : function()
					{
						debugger
						this.getView().byId("VehicleMakeID").setEnabled(false);
						this.getView().byId("VehicleModelID").setEnabled(false);
						this.getView().byId("ConfigurationIDID").setEnabled(false);
						this.getView().byId("TySz").setEnabled(false);
						this.getView().byId("FRegistrationYearEdit").setEnabled(false);
						this.getView().byId("FVehicleCCEdit").setEnabled(false);
						this.getView().byId("idEarPSI").setEnabled(false);
						this.getView().byId("idMilReading").setEnabled(false);
						this.getView().byId("idMulReading").setEnabled(false);
					},					
					
					handleIconTabBarSelect: function(oEvent) {
						debugger
						var filter = oEvent.getParameters().key;
						var tabBar= this.getView().byId("idIconTabBarMulti");
						
						var valid= this.validateHeaderDetails();
						
						if(!valid){
							tabBar.setSelectedKey("A");
							sap.m.MessageBox.show("Please fill all the mandatory fields.", {
								title : "Error",
								icon : sap.m.MessageBox.Icon.ERROR,
							});
							return false;
						};
						
						 debugger
						 var lmilostatus = this.getView().byId("idLastMilo").getSelectedKey();
						 var cmilostatus = this.getView().byId("idEarPSI").getSelectedKey();
						 var lmilo       = this.getView().byId("idLastKm").getValue();
						 var cmilo       = this.getView().byId("idMilReading").getValue();
						 var ckm         = this.getView().byId("idMulReading").getValue();		
						 
						 this.getView().byId("idEarPSI").setValueState("None");
						 this.getView().byId("idMilReading").setValueState("None");
						 this.getView().byId("idMulReading").setValueState("None");
						 
						 if(cmilostatus==""){
							 this.getView().byId("idEarPSI").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Status");
							tabBar.setSelectedKey("A");
							return;							 
						 }
						 
						 if(lmilostatus == "Y" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
							 this.getView().byId("idMilReading").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Reading");
							tabBar.setSelectedKey("A");
							return;
						 }
						 
						 if(lmilostatus == "Y" && cmilostatus == "Y" && parseInt(lmilo) > parseInt(cmilo)){
							 this.getView().byId("idMilReading").setValueState("Error");
								sap.m.MessageToast.show("Milometer Reading cannot be less than Last Milometer Reading.");
								tabBar.setSelectedKey("A");
								return;
						}						 
						 
						 if(lmilostatus == "Y" && cmilostatus == "N" && (parseInt(ckm) < 1 || ckm =="")){
							if(that.data.EnrolMode !== ""){
								this.getView().byId("idMulReading").setValueState("Error");							 
								sap.m.MessageToast.show("Enter KM Covered");
								tabBar.setSelectedKey("A");
								return;
							}	
						}

						if(lmilostatus == "N" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
							this.getView().byId("idMilReading").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Reading");
							tabBar.setSelectedKey("A");
							return;
						}							 
						 
						 if(lmilostatus == "N" && cmilostatus == "Y" && (parseInt(ckm) < 1 || ckm =="")){
							if(that.data.EnrolMode !== ""){
								this.getView().byId("idMulReading").setValueState("Error");
								sap.m.MessageToast.show("Enter KM Covered");
								tabBar.setSelectedKey("A");
								return;
							}
						}							 

						if(lmilostatus == "N" && cmilostatus == "N" && (parseInt(ckm) < 1 || ckm =="")){
							if(that.data.EnrolMode !== ""){
								this.getView().byId("idMulReading").setValueState("Error");
								sap.m.MessageToast.show("Enter KM Covered");
								tabBar.setSelectedKey("A");
								return;
							}	
						}	
						
						if(lmilostatus == "" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
							this.getView().byId("idMilReading").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Reading");
							tabBar.setSelectedKey("A");
							return;
						}
						
/*						if(lmilostatus == "" && cmilostatus == "N" && (parseInt(ckm) < 1 || ckm =="")){
							this.getView().byId("idMulReading").setValueState("Error");
							sap.m.MessageToast.show("Enter KM Covered");
							tabBar.setSelectedKey("A");
							return;
						}	*/
						
						this.onHeaderFix();
						this.checkFilter(filter);
						
					},
					
					checkFilter: function(filter) {
						switch (filter) {
							case 'A':
								break;
							case 'B':
								break;							
						}
					},
					
					/*end*/
					
					/***************/
					onVehicalDetails:function(){
						debugger
						var check = false;
						this.bindServiceSheetSet();
						this.getView().byId("idIconTolbar1").setEnabled(true);
						var oGlobalBusyDialog = new sap.m.BusyDialog();
					var vecNo=this.getView().byId("FVehicleNoEdit").getValue();
							//this.getView().byId("FVehicleNoEdit").setEnabled(false);
					this.getView().byId("idCustomerName").setEnabled(true);
					this.getView().byId("idEarPSI").setEnabled(true);
					var that = this;
					var srvReqDate = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd-MM-yyyy"}).format(new Date());
				//	that.getView().byId("idSrvReqDate").setText(srvReqDate);
					var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
					var oReadModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
					oReadModel.setHeaders({"Content-Type" : "application/json"});
					var fncSuccess = function(oData, oResponse) // success
					// function
					{
						debugger
					that.data=oData;
						oData.EstimatedCost = 0;
						oData.ProposedCost = 0;
					if(oData.Error == "F" ){
						sap.m.MessageBox.show(oData.Message, {
							title : "Error",
							icon : sap.m.MessageBox.Icon.ERROR,
							onClose:function(){
								window.history.back();
							}
							});	
					}
					
					if(oData.Error == "X" ){
						sap.m.MessageBox.show(oData.Message, {
							title : "Error",
							icon : sap.m.MessageBox.Icon.ERROR,
							onClose:function(){
								window.history.back();
							}
							});	
					}
					
					
					if(oData.Error == "" && oData.Message != ""){
						sap.m.MessageBox.show(oData.Message, {
							title : "Information",
							icon : sap.m.MessageBox.Icon.information,
							onClose:function(){
							}
							});	
					}
					
					that.getView().byId("Id_bt2").setVisible(true);
					that.getView().byId("FVehicleNoEdit").setEnabled(false);
					
					if(oData.Error=="N"){
					sap.m.MessageBox.show(oData.Message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
						that.getView().byId("idIconTabBarMulti").setSelectedKey("A");
					}
					});	
					}
					
					if(hubCode){
					that.data.HubCode=hubCode;
					}
					
					Mobile = oData.CpMobile;
					CpNo   = oData.CpNo;
					
					debugger					
					var FitModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().getModel("serviceSheetJModel").setData(oData);
					debugger
					that.getView().setModel(FitModel,"Fitments");
					
					if(oData.CpName != ""){
						that.getView().byId("idCustomerName").setEnabled(false);
					}
					
					if(oData.MechCond == "Y"){	
						that.getView().byId("idmccon").setEnabled(true);
						that.getView().byId("idreason1").setVisible(false);
						that.getView().byId("idReason").setEnabled(true);
					}else if(oData.MechCond == "N"){							
						that.getView().byId("idmccon").setEnabled(false);
						that.getView().byId("idreason1").setVisible(true);						
						that.getView().byId("idReason").setEnabled(false);					
					}else{
					 that.getView().byId("idmccon").setEnabled(true);
					}					

//		**************** added by Hans on 8 jan 2019 ***************************			
					if(oData.EnrolMode == "F" || oData.EnrolMode == "M"){
						var mode = false;
						that.setFieldVisibility(mode);
					}else if(oData.EnrolMode == ""){
						var mode = true;
						that.setFieldVisibility2(mode); 
						
						if(oData.ContractType==""){
							ConfigCode = oData.ConfigCode;
							ProdSize   = oData.TyreSize;
							that.getView().byId("Panel1").setVisible(false);
							that.getView().byId("Panel2").setVisible(false);
							that.getView().byId("Panel3").setVisible(true);
							that.getView().byId("serVShVehNew").setVisible(true);
							that.getView().byId("serVShVeh").setVisible(false);
						}
					}
					
					//Set visible false 
					if (oData.MakeCode != ""){
						that.getView().byId("VehicleMakeID").setEnabled(false);	
					}
					if (oData.Model != ""){
						that.getView().byId("VehicleModelID").setEnabled(false);	
					}
					if (oData.ConfigCode != ""){
						that.getView().byId("ConfigurationIDID").setEnabled(false);	
					}
					if (oData.TyreSize != ""){
						that.getView().byId("TySz").setEnabled(false);	
					}
					if (oData.RegYear != ""){
						that.getView().byId("FRegistrationYearEdit").setEnabled(false);	
					}
					if (oData.VechCc > "1"){
						that.getView().byId("FVehicleCCEdit").setEnabled(false);	
					}
					
					if (oData.EnrolMode == ""){								
						that.getView().byId("fmtotkm").setVisible(false);
						that.getView().byId("idKm1").setVisible(false);
						that.getView().byId("idfmrot").setVisible(false);
						that.getView().byId("idfmalign").setVisible(false);
					}
					else{
							that.getView().byId("fmtotkm").setVisible(true);
							that.getView().byId("idKm1").setVisible(true);
							that.getView().byId("idfmrot").setVisible(true);
							that.getView().byId("idfmalign").setVisible(true);							
					}
									
					
					var lmilo = that.getView().byId("idLastMilo").getSelectedKey();
					if (lmilo==""){
						that.getView().byId("fmlastmilo").setVisible(false);
						that.getView().byId("fmlastkm").setVisible(false);
					}
					
					debugger
					if(that.data.ContractType=="CPKM"){
					that.flg=0;
					that.getView().byId("Panel1").setVisible(true);
					that.getView().byId("Panel2").setVisible(false);
					that.getView().byId("Panel3").setVisible(false);
					that.getView().byId("serVShVehNew").setVisible(false);
					that.getView().byId("serVShVeh").setVisible(true);
					var tab=that.getView().byId("tblDetail");
					var temp = new sap.m.ColumnListItem({
					cells : [
					 // new sap.m.Text({text:""}),
					 new sap.m.Text({text:"{Zposition}"}),
					 new sap.m.Input({value:"{RotationPosNew}",valueHelpRequest:[that.onrottateF4,that],
					valueHelpOnly:true, showValueHelp:false,editable:false,visible:"{path:'Zposition',formatter:'ztwcjobcreate.util.Formatter.StpEnable1'}"}),
					new sap.m.VBox({items:[new sap.m.Select({selectedKey:"{Owner}",enabled:"{path:'Zposition',formatter:'ztwcjobcreate.util.Formatter.StpEnable'}",
					change:[that.owner,that],forceSelection:false ,items:[new sap.ui.core.Item({text:"JK Tyre",key:"01"}),new sap.ui.core.Item({text:"Fleet Tyre",key:"02"})]}), that.nonjkSelect]}),
					new sap.m.Input({value:"{ItemDesc}",editable:false, valueHelpRequest:[that.onItemNo,that],
					valueHelpOnly:true, showValueHelp:true,editable:true}),
					new sap.m.Input({value:"{StnclNumber}",valueHelpRequest:[that.onStncNo,that],
						valueHelpOnly:true, showValueHelp:true,editable:false}),
				
						new sap.m.Select({selectedKey:"{RemoveOk}",change:[that.onAction,that],items:[new sap.ui.core.Item({text:"OK",key:"O"}),new sap.ui.core.Item({text:"Remove",key:"R"})],forceSelection:true}),
					
				new sap.m.Button({text:"",press:[that.onSerSheet,that],icon:"sap-icon://activity-2",type:"Emphasized"}),
				new sap.m.Button({text:"",press:[that.detaiPress,that],icon:"sap-icon://record",type:"Emphasized"}),
				/*	//Image Code Starts
					// new sap.m.Button({text:"",press:[that.handleValueChange,that],icon:"sap-icon://add-photo",type:"Emphasized"}),
					new sap.ui.unified.FileUploader({sendXHR: true,buttonOnly: true,
										         style:"Emphasized",
										         icon:"sap-icon://add-photo",
										         iconOnly:true,
										         uploadOnChange: true,
										         useMultipart: false,
										         uploadUrl:"/sap/opu/odata/sap/ZFLEET_SRV/ImageUploadSet",
										         change:[that.handleValueChange,that],										        	 							  
										         uploadComplete:[that.handleUploadComplete, that],										        	 							  
										         fileType:["jpeg","jpg"],
										         headerParameters: [
					new sap.ui.unified.FileUploaderParameter({name: "x-csrf-token", value: that.getView().getModel().getSecurityToken() }),
					new sap.ui.unified.FileUploaderParameter({name: "SLUG", value: vecNo }),
					]
					})*/
										         //Image Code Ends
										        
										         ]
									});
									tab.setModel(FitModel);
									tab.bindAggregation("items" , "/RegnoToItemNvg/results", temp );
									
								}else if(that.data.ContractType=="SC"){
									that.flg=1;
									that.getView().byId("Panel1").setVisible(false);
									that.getView().byId("Panel2").setVisible(true);
									that.getView().byId("Panel3").setVisible(false);
									that.getView().byId("serVShVehNew").setVisible(false);
									that.getView().byId("serVShVeh").setVisible(true);
									var tab=that.getView().byId("tblDetail1");
									var temp = new sap.m.ColumnListItem({
										cells : [
										        new sap.m.Text({text:"{Zposition}"}),
										        new sap.m.Input({value:"{RotationPosNew}",valueHelpRequest:[that.onrottateF4,that],
														valueHelpOnly:true, showValueHelp:false,editable:false,visible:"{path:'Zposition',formatter:'ztwcjobcreate.util.Formatter.StpEnable1'}"}),
								         		        
												 that.nonjkSelect1,
												 
										         new sap.m.Input({value:"{ItemDesc}",editable:false, valueHelpRequest:[that.onItemNo,that],
														valueHelpOnly:true, showValueHelp:true,editable:true}),
														
										         new sap.m.Input({value:"{StnclNumber}",valueHelpRequest:[that.onStncNo,that],
														valueHelpOnly:true, showValueHelp:true,editable:false}),
														
								             	new sap.m.Select({selectedKey:"{RemoveOk}",change:[that.onAction,that],items:[new sap.ui.core.Item({text:"OK",key:"O"}),new sap.ui.core.Item({text:"Remove",key:"R"})],forceSelection:true}),
														
												new sap.m.Button({text:"",press:[that.onSerSheet,that],icon:"sap-icon://activity-2",type:"Emphasized"}),
										         new sap.m.Button({text:"",press:[that.detaiPress,that],icon:"sap-icon://record",type:"Emphasized"}),
										 /*        //Image Code Starts
										         
//										         new sap.m.Button({text:"",press:[that.handleValueChange,that],icon:"sap-icon://add-photo",type:"Emphasized"}),
										         new sap.ui.unified.FileUploader({sendXHR: true,
			        	 							  							  buttonOnly: true,
										        	 							  style:"Emphasized",
										        	 							  icon:"sap-icon://add-photo",
										        	 							  iconOnly:true,
										        	 							  uploadOnChange: true,
										        	 							  useMultipart: false,
										        	 							  uploadUrl:"/sap/opu/odata/sap/ZFLEET_SRV/ImageUploadSet",
										        	 							  change:[that.handleValueChange,that],										        	 							  
										        	 							  uploadComplete:[that.handleUploadComplete, that],										        	 							  
										        	 							  fileType:["jpeg","jpg"],
										        	 							  headerParameters: [
									 							                  new sap.ui.unified.FileUploaderParameter({name: "x-csrf-token", value: that.getView().getModel().getSecurityToken() }),
								 	 							                  new sap.ui.unified.FileUploaderParameter({name: "SLUG", value: vecNo }),
								 	 							                
								 	 							               ]
										        	 							  })*/
										         //Image Code Ends
										        ]
									});
									tab.setModel(FitModel);
									tab.bindAggregation("items" , {path:"/RegnoToItemNvg/results", template:temp, templateShareable : true} );
									
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
								// Create Method for final Save
								//oReadModel.read("/VehicleDetailsSet(RegNo='"+vecNo+"',ConfigCode='')?$expand=VehicleToItemNvg", {
								debugger
									oReadModel.read("/VehicleRegNoSet(RegNo='"+vecNo+"',Type='T',TruckKunnr='"+twkunnr+"',Kunnr='')?$expand=RegnoToItemNvg/VitemToServiceNvg/IservToSubservNvg,RegnoToServiceNvg/VServToSubservNvg", {
									success : fncSuccess,
									error : fncError 
								});
								 oGlobalBusyDialog.close(); 
							},
							
						setFieldVisibility: function(mode){
							var that = this;
							that.mode = mode;
							var view = this.getView();
							var inputs = [
								view.byId("VehicleMakeID"),
								view.byId("VehicleModelID"),
								view.byId("ConfigurationIDID"),
								view.byId("ChasisNoID"),
								view.byId("EngineNooID"),
								view.byId("TySz"),
								view.byId("FRegistrationYearEdit"),
								view.byId("FVehicleCCEdit"),
								view.byId("FAvgRunningSpeedEdit"),
								view.byId("FLoopDistanceEdit"),
								view.byId("idEarApp1"),
								view.byId("FGoodsCarriedEdit"),
							];
							jQuery.each(inputs, function(i, input) {
								if (input) {
									input.setEditable(that.mode);
									
								}
							});
						},
						//set enable Vehicle details field - 13-02-2019//
						setFieldVisibility2: function(mode){
							debugger
							var that = this;
							var view = that.getView();
								view.byId("VehicleMakeID").setEnabled(mode);
								view.byId("VehicleModelID").setEnabled(mode);
								view.byId("ConfigurationIDID").setEnabled(mode);
								view.byId("ChasisNoID").setEnabled(mode);
								view.byId("EngineNooID").setEnabled(mode);
								view.byId("TySz").setEnabled(mode);
								view.byId("FRegistrationYearEdit").setEnabled(mode);
								view.byId("FVehicleCCEdit").setEnabled(mode);
								view.byId("FAvgRunningSpeedEdit").setEnabled(mode);
								view.byId("FLoopDistanceEdit").setEnabled(mode);
								view.byId("idEarApp1").setEnabled(mode);
								view.byId("FGoodsCarriedEdit").setEnabled(mode);
						  },
						
						handleValueChange: function(oEvent){
							alert("Image Selected");
						},
						
						onrottateF4:function(evt){
							that.rotationitem=evt.getSource();
							var obj=evt.getSource().getParent().getBindingContext().getObject()
								var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4RotationPositionsSet?$filter=IRegNo eq '"+that.data.RegNo+"' and IPosition eq '"+obj.Zposition+"'";
							var jModel = new sap.ui.model.json.JSONModel();
							jModel.loadData(sPath, null, false, "GET", false,
									false, null);
							var _valueHelpRotationSelectDialog = new sap.m.SelectDialog(
									{
										title : "Select Position",
										items : {
											path : "/d/results",
											template : new sap.m.StandardListItem(
													{
														title : "{Zposition}",
														description:"{PositionDesc}",
														customData : [ new sap.ui.core.CustomData(
																{
																	key : "Key",
																	value : "{Zposition}"
																}) ],
													}),
										},
										liveChange : function(oEvent) {
											var sValue = oEvent
													.getParameter("value");
		
		 var oFilter = new sap.ui.model.Filter("Zposition",sap.ui.model.FilterOperator.Contains,sValue);
	    // var oFilter2 = new sap.ui.model.Filter("Descr",sap.ui.model.FilterOperator.Contains,sValue);
	     
	    // var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
											oEvent.getSource().getBinding("items")
													.filter([ oFilter ]);
										},
										confirm : [ this._handleRotationClose, this ],
										cancel : [ this._handleRotationClose, this ]
									});
							_valueHelpRotationSelectDialog.setModel(jModel);
							_valueHelpRotationSelectDialog.open();
						},
						_handleRotationClose : function(oEvent) {
							var oSelectedItem = oEvent.getParameter("selectedItem");
							if (oSelectedItem) {
								that.rotationitem.setValue(
										oSelectedItem.getTitle());
							}
						},
						owner:function(evt){
							var key=evt.getSource().getSelectedKey();
							if(key=="01"){
								evt.getSource().getParent().getItems()[1].setVisible(false).setSelectedKey("");
								evt.getSource().getParent().getParent().getCells()[3].setShowValueHelp(true).setValue();
								evt.getSource().getParent().getParent().getBindingContext().getObject().ItemCode="";
								evt.getSource().getParent().getParent().getBindingContext().getObject().StnclNumber="";
								evt.getSource().getParent().getParent().getBindingContext().getObject().NonJkCompany="";
								//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
							}else if(key=="02"){
								evt.getSource().getParent().getItems()[1].setVisible(true).setSelectedKey("");
								evt.getSource().getParent().getParent().getCells()[3].setShowValueHelp(true).setValue();
								evt.getSource().getParent().getParent().getBindingContext().getObject().ItemCode="";
								evt.getSource().getParent().getParent().getBindingContext().getObject().StnclNumber="";
								evt.getSource().getParent().getParent().getBindingContext().getObject().NonJkCompany="";
								//evt.getSource().getParent().getParent().getCells()[2].setEditable(false);
							}
						},
						onAction:function(evt){
							debugger
							that.actionItem=evt.getSource();
							that.actionMainItem=evt.getSource().getParent();
							if(evt.getParameter("selectedItem")==undefined){
							if(evt.getSource().getSelectedKey()=="R"){
								var table=evt.getSource().getParent().getParent();
								var index=table.getItems().indexOf(evt.getSource().getParent());
	
								evt.getSource().getParent().getBindingContext().getObject().RemoveOk=evt.getSource().getSelectedKey();
								var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
								var oReadModel = new sap.ui.model.odata.ODataModel(
										sServiceUrl);
								oReadModel.read("/VehicleRegNoItemSet(RegNo='"+that.getView().byId("FVehicleNoEdit").getValue()+"',Zposition='"+evt.getSource().getParent().getBindingContext().getObject().Zposition+"')?$expand=VitemToServiceNvg/IservToSubservNvg", null, null, true, function(oData, oResponse) {
									debugger
									table.getModel().getData().RegnoToItemNvg.results.splice(index+1, 0, oData);
									table.getModel().refresh();
								}, function(oData, oResponse) {
									var obj = JSON.parse(oData.response.body);
									var msg = obj.error.message.value;     
									sap.m.MessageBox.show(msg, {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error",
										actions: [sap.m.MessageBox.Action.OK]
									});
								});
								
								}else if(evt.getSource().getSelectedKey()=="O"){
								evt.getSource().getParent().getBindingContext().getObject().RemoveOk=evt.getSource().getSelectedKey();
								var table=evt.getSource().getParent().getParent();
								var index=table.getItems().indexOf(evt.getSource().getParent());
								if(index!=table.getItems().length-1){
								if(evt.getSource().getParent().getBindingContext().getObject().Zposition==table.getItems()[index+1].getBindingContext().getObject().Zposition){
									table.getModel().getData().RegnoToItemNvg.results.splice(index+1, 1);
									table.getModel().refresh();	
								}
								}
							}
							}else{
								if(evt.getSource().getSelectedKey()=="R"){
								if (!that._RemovalReason) {
									that._RemovalReason = sap.ui.xmlfragment(
										"ztwcjobcreate.view.RemoveTyreDetails", that);
									that.getView().addDependent(that._RemovalReason);}
								//var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/Tyre_Type_FromSet";
								var sPath1="/sap/opu/odata/sap/ZFLEET_SRV/Tyre_Location_FromSet";
 
								var jModel1 = new sap.ui.model.json.JSONModel();
								jModel1.loadData(sPath1, null, false, "GET", false,
										false, null);
								sap.ui.getCore().byId("idTyrLoc1").unbindAggregation("items");
								//var	Timemodel = new sap.ui.model.json.JSONModel({ "Time" : oData.results });
								sap.ui.getCore().byId("idTyrLoc1").setModel(jModel1);
								sap.ui.getCore().byId("idTyrLoc1").bindAggregation("items", {
										path: "/d/results",
										template: new sap.ui.core.Item({
											key: "{TyreLocFrom}",
											text: "{TyreLocDesc} ({TyreLocFrom})"
										})
									}); 
								
									//sap.ui.getCore().byId("idTyrTyp1").setVisible(true);
									sap.ui.getCore().byId("idTyrLoc1").setVisible(true);
									that._RemovalReason.open();
								} else if(evt.getSource().getSelectedKey()=="O"){

								//evt.getSource().getParent().getBindingContext().getObject().RemoveOk=evt.getSource().getSelectedKey();
								var table=evt.getSource().getParent().getParent();
								var index=table.getItems().indexOf(evt.getSource().getParent());
								if(index!=table.getItems().length-1){
//								if(evt.getSource().getParent().getBindingContext().getObject().Zposition==table.getItems()[index].getBindingContext().getObject().Zposition){
									if(evt.getSource().getParent().getBindingContext().getObject().Zposition==table.getItems()[index+1].getBindingContext().getObject().Zposition){
										
									table.getModel().getData().RegnoToItemNvg.results.splice(index+1, 1);
									table.getModel().refresh();	
								}
								}
								}	
								}
								},

						onMjrDft:function(){
							
							var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ServiceAbuseSet";
							var jModel = new sap.ui.model.json.JSONModel();
							jModel.loadData(sPath, null, false, "GET", false,false, null);
							var _valueHelpMajorgrpelectDialog = new sap.m.SelectDialog(
									{
										title : "Select Service Abuse",
										items : {
											path : "/d/results",
											template : new sap.m.StandardListItem(
													{
														title : "{Service}",
														
														customData : [ new sap.ui.core.CustomData(
																{
																	key : "{Service}",
																	value : "{Service}"
																}) ],

													}),
										},
										liveChange : function(oEvent) {
											var sValue = oEvent.getParameter("value");
		
		 var oFilter = new sap.ui.model.Filter("DefectDesc",sap.ui.model.FilterOperator.Contains,sValue);
	     var oFilter2 = new sap.ui.model.Filter("Defect",sap.ui.model.FilterOperator.Contains,sValue);
	     
	    var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false);
											oEvent.getSource().getBinding("items")
													.filter([ oFilter1 ]);
										},
										confirm : [ this._handleMajorClose, this ],
										cancel : [ this._handleMajorClose, this ]
									});
							_valueHelpMajorgrpelectDialog.setModel(jModel);
							_valueHelpMajorgrpelectDialog.open();
							
						},
						_handleMajorClose : function(oEvent) {
							var oSelectedItem = oEvent.getParameter("selectedItem");
							if (oSelectedItem) {
								sap.ui.getCore().byId("idMJDefect").setValue(
										oSelectedItem.getTitle());
								sap.ui.getCore().byId("idMJDefect").setName(
										oSelectedItem.getTitle());
								
								//this.onVehicalDetails();
								
							}

						},
						onMnrDft:function(){
							var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4AdjustableDefectSet";
							var jModel = new sap.ui.model.json.JSONModel();
							jModel.loadData(sPath, null, false, "GET", false,
									false, null);
							
							var _valueHelpMnrrgrpelectDialog = new sap.m.SelectDialog(
									{
										title : "Select Adjustable Defect",
										items : {
											path : "/d/results",
											template : new sap.m.StandardListItem(
													{
														title : "{Adjust}",
														
														customData : [ new sap.ui.core.CustomData(
																{
																	key : "{Adjust}",
																	value : "{Adjust}"
																}) ],

													}),
										},
										liveChange : function(oEvent) {
											var sValue = oEvent
													.getParameter("value");
		
		 var oFilter = new sap.ui.model.Filter("DefectTxt",sap.ui.model.FilterOperator.Contains,sValue);
	     var oFilter2 = new sap.ui.model.Filter("Defect",sap.ui.model.FilterOperator.Contains,sValue);
	     
	    var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);
											oEvent.getSource().getBinding("items")
													.filter([ oFilter1 ]);
										},
										confirm : [ this._handleMNRClose, this ],
										cancel : [ this._handleMNRClose, this ]
									});
							_valueHelpMnrrgrpelectDialog.setModel(jModel);
							_valueHelpMnrrgrpelectDialog.open();
							
							},
						_handleMNRClose : function(oEvent) {
							var oSelectedItem = oEvent.getParameter("selectedItem");
							if (oSelectedItem) {
								sap.ui.getCore().byId("idMNGrp").setValue(
										oSelectedItem.getTitle());
								sap.ui.getCore().byId("idMNGrp").setName(
										oSelectedItem.getTitle());
								
								//this.onVehicalDetails();
								
							}

						},
						onTyreOk1:function(){
							var MajorDefect=sap.ui.getCore().byId("idMJDefect").getName();
							var MinorDefect=sap.ui.getCore().byId("idMNGrp").getName();
							//var CodeGroup=sap.ui.getCore().byId("idCDGrp").getName();
							//var TyrTyp=sap.ui.getCore().byId("idTyrTyp1").getSelectedKey();
							var TyrLoc=sap.ui.getCore().byId("idTyrLoc1").getSelectedKey();
							if(MajorDefect=="" && sap.ui.getCore().byId("idMJDefect").getVisible()){
								sap.m.MessageToast.show("Select Service Abuse");
								return
							}
							

							if(TyrLoc==""  ){
								sap.m.MessageToast.show("Select Cause of Removal");
								return
							}
							var obj=that.actionMainItem.getBindingContext().getObject();

							if(sap.ui.getCore().byId("idTyrLoc1").getVisible()){
								obj.TyreLoc=TyrLoc;	
							}else{
								obj.TyreLoc="";
							}

							that._RemovalReason.close();
							that._RemovalReason.destroy();
							that._RemovalReason=undefined;
							that.actionItem.fireEvent("change");
						},
						onTyreClose1: function(evt){
//							for(var i=0;i<evt.getSource().getItems().length;i++){
//								evt.getSource().getItems()[i].getCells()[5].setSelectedKey("O");
//							}
//							var flg=1;
							if(that.flg==0){
								var table1 = this.getView().byId("tblDetail");
								var loItems1 = this.getView().byId("tblDetail").getItems();
								for(var i=0;i<loItems1.length;i++){
								loItems1[i].getCells()[5].setSelectedKey("O");}
								
							}else{
								var table = this.getView().byId("tblDetail1");
								var loItems = this.getView().byId("tblDetail1").getItems();
								for(var i=0;i<loItems.length;i++){
								loItems[i].getCells()[5].setSelectedKey("O");}
							}
							that._RemovalReason.close();
						},
						TyreLocChange:function(evt){
							var key=evt.getSource().getSelectedKey();
							if(key=="SRP"){
								sap.ui.getCore().byId("idMJDefect").setVisible(true);
								sap.ui.getCore().byId("idMNGrp").setVisible(true);
							}else{
								sap.ui.getCore().byId("idMJDefect").setVisible(false);
								sap.ui.getCore().byId("idMNGrp").setVisible(false);
//								sap.ui.getCore().byId("idMJDefect").setVisible(false).setValue();
//								sap.ui.getCore().byId("idMNGrp").setVisible(false).setValue();
							}
						},
						onAmsUpdate:function(evt){
							
							for(var i=0;i<evt.getSource().getItems().length;i++){
							evt.getSource().getItems()[i].getCells()[2].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany);
						    //evt.getSource().getItems()[i].getCells()[0].getItems()[0].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().Owner);
							if(evt.getSource().getItems()[i].getBindingContext().getObject().StnclNumber==""){
					
								evt.getSource().getItems()[i].getCells()[2].setEnabled(true);
								evt.getSource().getItems()[i].getCells()[3].setEditable(true);
								evt.getSource().getItems()[i].getCells()[4].setEditable(true);
								evt.getSource().getItems()[i].getCells()[5].setEnabled(false);
								evt.getSource().getItems()[i].getCells()[5].setSelectedKey("O");
								evt.getSource().getItems()[i].getCells()[7].setType("Emphasized")
							}else{
								evt.getSource().getItems()[i].getCells()[2].setEnabled(false);
								evt.getSource().getItems()[i].getCells()[3].setEditable(false);
								evt.getSource().getItems()[i].getCells()[4].setEditable(false);
								evt.getSource().getItems()[i].getCells()[5].setEnabled(true);
							}
							if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveOk=="R"){
								//evt.getSource().getItems()[i].getCells()[7].setEnabled(false);
								evt.getSource().getItems()[i].getCells()[1].setEnabled(false).setValue();
								
							}else{
								//evt.getSource().getItems()[i].getCells()[7].setEnabled(true);
								evt.getSource().getItems()[i].getCells()[1].setEnabled(true);
							}
							if(evt.getSource().getItems()[i].getBindingContext().getObject().TyreLoc=="FRS"){
								evt.getSource().getItems()[i].getCells()[7].setEnabled(false);
							}

							}
							
						},
						onCPMKUpdate:function(evt){
							
							for(var i=0;i<evt.getSource().getItems().length;i++){
							evt.getSource().getItems()[i].getCells()[2].getItems()[1].setSelectedKey(evt.getSource().getItems()[i].getBindingContext().getObject().NonJkCompany);
							if(evt.getSource().getItems()[i].getBindingContext().getObject().Owner=="02"){
								evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(true);
							}
							if(evt.getSource().getItems()[i].getBindingContext().getObject().StnclNumber==""){
								evt.getSource().getItems()[i].getCells()[2].getItems()[0].setEnabled(true);
								evt.getSource().getItems()[i].getCells()[2].getItems()[1].setEnabled(true);
								evt.getSource().getItems()[i].getCells()[3].setEditable(true);
								evt.getSource().getItems()[i].getCells()[5].setEnabled(false);
								evt.getSource().getItems()[i].getCells()[5].setSelectedKey("O");
								evt.getSource().getItems()[i].getCells()[4].setEditable(true);
							}else{
								evt.getSource().getItems()[i].getCells()[2].getItems()[0].setEnabled(false)
								evt.getSource().getItems()[i].getCells()[2].getItems()[1].setEnabled(false);
								evt.getSource().getItems()[i].getCells()[3].setEditable(false);
								evt.getSource().getItems()[i].getCells()[5].setEnabled(true);
								evt.getSource().getItems()[i].getCells()[4].setEditable(false);
							}
							if(evt.getSource().getItems()[i].getBindingContext().getObject().RemoveOk=="R"){
								//evt.getSource().getItems()[i].getCells()[6].setEnabled(false);
								evt.getSource().getItems()[i].getCells()[1].setEnabled(false).setValue();
							}else{
								//evt.getSource().getItems()[i].getCells()[6].setEnabled(true);
								evt.getSource().getItems()[i].getCells()[1].setEnabled(true);
							}
							if(evt.getSource().getItems()[i].getBindingContext().getObject().TyreLoc=="FRS"){
								evt.getSource().getItems()[i].getCells()[7].setEnabled(false);
							}
							if(evt.getSource().getItems()[i].getBindingContext().getObject().Owner=="02"){
								evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(true);	
							}else{
								evt.getSource().getItems()[i].getCells()[2].getItems()[1].setVisible(false);	
							}
							}
						},
						
						onItemNo:function(evt){
							that.Itemlfld=evt.getSource();
							var obj=that.Itemlfld.getParent().getBindingContext().getObject();

							if(kunnr){
								var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Item_CodeSet?$filter=CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"' and CType eq 'F' and CKunnr eq'"+ kunnr +"'and COwner eq'"+obj.Owner+"'and CNonJkCompany eq'"+obj.NonJkCompany+"'";
							}else{
								var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Item_CodeSet?$filter=CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"' and CType eq 'F' and CKunnr eq'"+sap.ui.getCore().byId("idFleet").getName()+"'and COwner eq'"+obj.Owner+"'and CNonJkCompany eq'"+obj.NonJkCompany+"'";
							}
							
							var jModel = new sap.ui.model.json.JSONModel();
							jModel.loadData(sPath, null, false, "GET", false,
									false, null);
							var _valueHelpitemSelectDialog = new sap.m.SelectDialog(
									{
								title : "Select Description",
								items : {
								path : "/d/results",
								template : new sap.m.StandardListItem(
								{
								title :"{Maktx}" ,
								description:"{Matnr}",
								customData : [ new sap.ui.core.CustomData(
								{
								key : "Key",
								value : "{Maktx}"
								}) ],
								}),
								},
								liveChange : function(oEvent) {
								var sValue = oEvent.getParameter("value");
								var oFilter = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
							
											oEvent.getSource().getBinding("items").filter([ oFilter ]);
										},
										confirm : [ this._handleTypeitmClose, this ],
										cancel : [ this._handleTypeitmClose, this ]
									});
							_valueHelpitemSelectDialog.setModel(jModel);
							_valueHelpitemSelectDialog.open();
						},
						_handleTypeitmClose : function(oEvent) {
							var oSelectedItem = oEvent.getParameter("selectedItem");
							if (oSelectedItem) {
								
								
								that.Itemlfld.setValue(
										oSelectedItem.getTitle());
								that.Itemlfld.getParent().getBindingContext().getObject().ItemCode=oSelectedItem.getBindingContext().getObject().Matnr;
								that.Itemlfld.getParent().getBindingContext().getObject().StnclNumber="";
							}
						},
						
						onSerSheetVech:function(evt){
							debugger
							var that = this;
							that.onServiceButton=evt.getSource();
							if (!that._SheetHelpDialog) {
										that._SheetHelpDialog = sap.ui.xmlfragment(
											"ztwcjobcreate.view.ServiceSheet", that);
										that.getView().addDependent(that._SheetHelpDialog);}
								
								var ShetModel = new sap.ui.model.json.JSONModel(that.data);
								sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
								sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
								sap.ui.getCore().byId("IdObj").setVisible(false);
								sap.ui.getCore().byId("IdObj5").setVisible(false);								
								var tab=sap.ui.getCore().byId("Servicetbl");
								tab.setModel(ShetModel)
								
								if (that.data.EnrolMode=="M"){
									
									sap.ui.getCore().byId("idlbcost").setText("Agreed Cost");
									sap.ui.getCore().byId("idlbmrp").setVisible(false);
									
									var temp = new sap.m.ColumnListItem({
										cells : [
										 new sap.m.Text({text:"{ServiceDesc}"}),
										 new sap.m.Text({text:"{ServiceRate}", visible:false }),								
										 new sap.m.Input({value:"{ServicePRate}", width:"150px", maxLength:7 , enabled:false , 
											    liveChange:[that.RateValid,that]}),								 
										 ],
										 selected:"{path:'ServiceSelect',formatter:'ztwcjobcreate.util.Formatter.SelecFlg'}"
										});
								}
								else{
								var temp = new sap.m.ColumnListItem({
								cells : [
								 new sap.m.Text({text:"{ServiceDesc}"}),
								 new sap.m.Text({text:"{ServiceRate}"}),								
								 new sap.m.Input({value:"{ServicePRate}", width:"150px", maxLength:7 , enabled:false , 
									    liveChange:[that.RateValid,that]}),								 
								 ],
								 selected:"{path:'ServiceSelect',formatter:'ztwcjobcreate.util.Formatter.SelecFlg'}"
								});
								}
								
								
								//var oFilter = new sap.ui.model.Filter("Level", sap.ui.model.FilterOperator.EQ, "TYRE");
								tab.bindAggregation("items" ,{ path : "/RegnoToServiceNvg/results",template : temp});
								
//								**********added by Hans *****************
								var tab=sap.ui.getCore().byId("Servicetbl");
								tab._getSelectAllCheckbox().setVisible(false);
								var items=tab.getSelectedItems();
								var ECost = 0;
								var PCost = 0;
								
								var modeldata = this.getView().getModel("Fitments").getData();
								modeldata.EstimatedCost = parseInt(modeldata.EstimatedCost) - parseInt(ECost);
								modeldata.ProposedCost = parseInt(modeldata.ProposedCost) - parseInt(PCost);
								this.getView().getModel("Fitments").refresh();
//				*************************************************************************				
								that._SheetHelpDialog.open();
								
//								code added to enable quantity fields for selected items
								if (that.data.EnrolMode!="M"){ 
								var selItems = tab.getSelectedItems();
								var arr= [];
								for(var k = 0; k < selItems.length; k++){
									arr.push(tab.indexOfItem(selItems[k]));
								}

								for(var j= 0; j< arr.length;j++){
									tab.getItems()[arr[j]].getCells()[2].setEnabled(true);
								}
								}
					},
								
					onNewSerSheetVech:function(evt){
						debugger
						var that = this;
						that.onVehServiceButton=evt.getSource();
						if (!that._NewVehicleServiceHelpDialog) {
									that._NewVehicleServiceHelpDialog = sap.ui.xmlfragment(
										"ztwcjobcreate.view.NewVehicleService", that);
									that.getView().addDependent(that._NewVehicleServiceHelpDialog);}
							
							
							var regno = this.getView().byId("FVehicleNoEdit").getValue();
							sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
							sap.ui.getCore().byId("IdObj1").setText(regno);
							sap.ui.getCore().byId("IdObj").setVisible(false);
							sap.ui.getCore().byId("IdObj5").setVisible(false);
							
						
							var serviceSheetJModel = this.getView().getModel("serviceSheetJModel");
							var vehicleServiceData = this.getView().getModel("serviceSheetSetJModel").getData()
							serviceSheetJModel.getData().RegnoToServiceNvg.results = vehicleServiceData;
                            
							var len = serviceSheetJModel.getData().RegnoToServiceNvg.results.length;
							for (var i=0;i<len;i++){
								if (serviceSheetJModel.getData().RegnoToServiceNvg.results[i].ServiceToSubServiceNvg){
									//(PG)serviceSheetJModel.getData().RegnoToServiceNvg.results[i]["IservToSubservNvg"] = serviceSheetJModel.getData().RegnoToServiceNvg.results[i].ServiceToSubServiceNvg;
									serviceSheetJModel.getData().RegnoToServiceNvg.results[i]["VServToSubservNvg"] = serviceSheetJModel.getData().RegnoToServiceNvg.results[i].ServiceToSubServiceNvg;
									
									delete serviceSheetJModel.getData().RegnoToServiceNvg.results[i].ServiceToSubServiceNvg;
								}
							}
							
							
							var tab=sap.ui.getCore().byId("vehicleServTbl");
							tab.setModel(serviceSheetJModel)
							var temp = new sap.m.ColumnListItem({
							cells : [
							 new sap.m.Text({text:"{ServiceDesc}"}),
							 new sap.m.Text({text:"{ServiceRate}"}),								
							 new sap.m.Input({value:"{ServicePRate}", width:"150px", maxLength:7, enabled:false, 
								    liveChange:[that.RateValid,that]}),								 
							 ],
							 selected:"{path:'ServiceSelect',formatter:'ztwcjobcreate.util.Formatter.SelecFlg'}"
							});
							//var oFilter = new sap.ui.model.Filter("Level", sap.ui.model.FilterOperator.EQ, "TYRE");
							tab.bindAggregation("items" ,{ path : "/RegnoToServiceNvg/results",template : temp});
							var tab=sap.ui.getCore().byId("vehicleServTbl");
							tab._getSelectAllCheckbox().setVisible(false);						
							
							var tab=sap.ui.getCore().byId("vehicleServTbl");
							var items=tab.getSelectedItems();
							var ECost = 0;
							var PCost = 0;
							for(var i=0;i<items.length;i++){
								//items[i].setEnabled(true);
								ECost = parseInt(ECost) + parseInt(items[i].getCells()[1].getText());
								PCost = parseInt(PCost) + parseInt(items[i].getCells()[2].getValue());
							}
							var modeldata = this.getView().getModel("Fitments").getData();
							modeldata.EstimatedCost = parseInt(modeldata.EstimatedCost) - parseInt(ECost);
							modeldata.ProposedCost = parseInt(modeldata.ProposedCost) - parseInt(PCost);
							this.getView().getModel("Fitments").refresh();
							
							that._NewVehicleServiceHelpDialog.open();
							that._NewVehicleServiceHelpDialog.setEscapeHandler(function(o){ 
								o.reject(); 
								//o.resolve();
								});
							
//							code added to enable quantity fields for selected items
								var selItems = tab.getSelectedItems();
								var arr= [];
								for(var k = 0; k < selItems.length; k++){
									arr.push(tab.indexOfItem(selItems[k]));
								}
	
								for(var j= 0; j< arr.length;j++){
									tab.getItems()[arr[j]].getCells()[2].setEnabled(true);
								}
							
							},		
							
						onVehicleTabelServiceOK: function(){
							debugger
							var items=sap.ui.getCore().byId("vehicleServTbl").getSelectedItems();
							var len = items.length;
							var ECost = 0;
							var PCost = 0;
							debugger
							for(var i=0;i<len;i++){
								var rate = items[i].getCells()[2].getValue();
								ECost = parseInt(ECost) + parseInt(items[i].getCells()[1].getText());
								PCost = parseInt(PCost) + parseInt(items[i].getCells()[2].getValue());
									if (rate<1){
										sap.m.MessageBox.alert(
												"Proposed cost cannot be null for selected services.", {
													icon: sap.m.MessageBox.Icon.WARNING,
													title: "Error"});
										return;
									}
									if (PCost > ECost){
										sap.m.MessageBox.alert(
												"Proposed cost cannot be greater than MRP.", {
													icon: sap.m.MessageBox.Icon.WARNING,
													title: "WARNING"});
										return;
									}
								}
							var tab=sap.ui.getCore().byId("vehicleServTbl"); 

							
							var modeldata = this.getView().getModel("Fitments").getData();
							modeldata.EstimatedCost = parseInt(modeldata.EstimatedCost) + parseInt(ECost);
							modeldata.ProposedCost = parseInt(modeldata.ProposedCost) + parseInt(PCost);
							this.getView().getModel("Fitments").refresh();
							
							if(len==0){
								that.onVehServiceButton.setType("Reject"); 
							}else{
								that.onVehServiceButton.setType("Accept"); 
							}

								that._NewVehicleServiceHelpDialog.close();
								that._NewVehicleServiceHelpDialog.destroy();
								that._NewVehicleServiceHelpDialog= undefined;							
						},
						
						OnVehicleTableSelect:function(evt){
							debugger
							var Matnr=evt.getParameter("listItem").getBindingContext().getObject().ServiceCode;
							if(evt.getParameter("listItem").getSelected()){
							evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
							if (!this._CutHelpDialog1) {
								this._CutHelpDialog1 = sap.ui.xmlfragment(
									"ztwcjobcreate.view.Cut1", this);
								this.getView().addDependent(this._CutHelpDialog1);
								
							}
							that.evt=evt.getParameter("listItem").getBindingContext().getObject();
							that.evtItem=evt.getParameter("listItem");
							evt.getParameter("listItem").getCells()[2].setEnabled(true);
							
							if(Matnr=="S04"){
								sap.ui.getCore().byId("IdNitroPanl").setVisible(true);
								//sap.ui.getCore().byId("idNtPur").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
								sap.ui.getCore().byId("idNtPur").setSelectedKey("");
								this._CutHelpDialog1.open();	
							}else if(Matnr=="S14"){
								sap.ui.getCore().byId("IdAlinmntpanl").setVisible(true);
								sap.ui.getCore().byId("ID1").setValue();
								sap.ui.getCore().byId("ID11").setValue();
								sap.ui.getCore().byId("ID2").setValue();
								sap.ui.getCore().byId("ID21").setValue();
								sap.ui.getCore().byId("ID3").setValue();
								sap.ui.getCore().byId("ID31").setValue();
								sap.ui.getCore().byId("ID4").setValue();
								
								
								this._CutHelpDialog1.open();	
							}
							
							}else{
								
								evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";	
								var cost=evt.getParameter("listItem").getBindingContext().getObject().ServiceRate;
								evt.getParameter("listItem").getCells()[2].setValue(cost);
								evt.getParameter("listItem").getCells()[2].setEnabled(false);
							}
						},
						
						onSerSheet:function(evt){
							debugger
							var that=this;
		
							if(evt.getSource().getParent().getCells()[4].getValue()!=""){
							that.onServiceButton=evt.getSource();	
							var that = this;
								

						if (!that._SheetHelpDialog) {
							that._SheetHelpDialog = sap.ui.xmlfragment(
							"ztwcjobcreate.view.ServiceSheet", that);
						that.getView().addDependent(that._SheetHelpDialog);}
							
						var ShetModel = new sap.ui.model.json.JSONModel(evt.getSource().getBindingContext().getObject());
						sap.ui.getCore().byId("IdObj1").setTitle("Vehicle Reg. Number");
						sap.ui.getCore().byId("IdObj1").setText(that.data.RegNo);
						sap.ui.getCore().byId("IdObj").setTitle("Stencil No");
						sap.ui.getCore().byId("IdObj").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
						sap.ui.getCore().byId("IdObj5").setTitle("Position");
						sap.ui.getCore().byId("IdObj5").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");
						var tab=sap.ui.getCore().byId("Servicetbl");
						tab.setModel(ShetModel)
						
						if (that.data.EnrolMode=="M"){
							sap.ui.getCore().byId("idlbcost").setText("Agreed Cost");
							sap.ui.getCore().byId("idlbmrp").setVisible(false);
							
							var temp = new sap.m.ColumnListItem({
								
								cells : [
								   new sap.m.Text({text:"{ServiceDesc}"}),
								   new sap.m.Text({text:"{ServiceRate}", visible:false }),
							   new sap.m.Input({value:"{ServicePRate}", width:"150px", maxLength:7 ,enabled:false , 
								    liveChange:[that.RateValid,that]}),
								 ],selected:"{path:'ServiceSelect',formatter:'ztwcjobcreate.util.Formatter.SelecFlg'}"
								});
						}
						else{
						var temp = new sap.m.ColumnListItem({
								
						cells : [
						   new sap.m.Text({text:"{ServiceDesc}"}),
						   new sap.m.Text({text:"{ServiceRate}"}),
					   new sap.m.Input({value:"{ServicePRate}", width:"150px", maxLength:7 ,enabled:false , 
						    liveChange:[that.RateValid,that]}),
						 ],selected:"{path:'ServiceSelect',formatter:'ztwcjobcreate.util.Formatter.SelecFlg'}"
						});
						}
						
						//var oFilter = new sap.ui.model.Filter("Level", sap.ui.model.FilterOperator.EQ, "TYRE");
						tab.bindAggregation("items" ,{ path : "/VitemToServiceNvg/results",template : temp});
						
						
//						**********added by Hans *****************
						var tab=sap.ui.getCore().byId("Servicetbl");
						tab._getSelectAllCheckbox().setVisible(false);
						
						var modeldata = this.getView().getModel("Fitments").getData();
						//modeldata.EstimatedCost = parseInt(modeldata.EstimatedCost) - parseInt(tab.getModel().getData().LineECost);
						//modeldata.ProposedCost = parseInt(modeldata.ProposedCost) - parseInt(tab.getModel().getData().LinePCost);
						this.getView().getModel("Fitments").refresh();
//		*************************************************************************				
						
						that._SheetHelpDialog.open();
//						code added to enable quantity fields for selected items
						if (that.data.EnrolMode!="M"){ 
							var selItems = tab.getSelectedItems();
							var arr= [];
							for(var k = 0; k < selItems.length; k++){
								arr.push(tab.indexOfItem(selItems[k]));
							}
	
							for(var j= 0; j< arr.length;j++){
								tab.getItems()[arr[j]].getCells()[2].setEnabled(true);
							}
						}
						
					}	
							
						// Create Method for final Save
						else{
						sap.m.MessageToast.show("Select Stencil No")
							}
						},
						
						detaiPress:function(evt){
							if(this.getView().byId("idEarPSI").getSelectedKey()==""){
								sap.m.MessageToast.show("Select Milometer Working");
								return
							}
							if(this.getView().byId("idEarPSI").getSelectedKey()=="Y"){
							if(this.getView().byId("idMilReading").getValue()==""||parseInt(this.getView().byId("idMilReading").getValue())==0){
							sap.m.MessageToast.show("Enter Milometer Reading");
							return			
							}	
							}
							else{
								if(that.data.EnrolMode !== ""){
								if(this.getView().byId("idMulReading").getValue()==""||parseInt(this.getView().byId("idMulReading").getValue())==0){
									sap.m.MessageToast.show("Enter KM Covered");
									return	
								}
								}
							}
						
							that.EntreItem=evt.getSource().getParent();
							debugger
							
							var dataModel = new sap.ui.model.json.JSONModel(that.EntreItem.getBindingContext().getObject());
							var G1NsdVal = dataModel.getData().G1Nsd;
							 
							
							if(evt.getSource().getParent().getCells()[5].getSelectedKey() === ""){								
								sap.m.MessageToast.show("Select Action");
							}
							else{
							if(evt.getSource().getParent().getCells()[4].getValue()!=""){
								that.entriesbutton=evt.getSource();
								if(G1NsdVal > 0)
									{
									if (!this._EntriesHelpDialog) {
										this._EntriesHelpDialog = sap.ui.xmlfragment(
											"ztwcjobcreate.view.Entries", this);			
									}	
										this.getView().addDependent(this._EntriesHelpDialog);
										this.dialogFlag = "O";
										sap.ui.getCore().byId("IdObjN1").setTitle("Vehicle Reg. Number");
										sap.ui.getCore().byId("IdObjN1").setText(that.data.RegNo);
										sap.ui.getCore().byId("IdObjN2").setTitle("Stencil No");
										sap.ui.getCore().byId("IdObjN2").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
										sap.ui.getCore().byId("IdObjN3").setTitle("Position");
										sap.ui.getCore().byId("IdObjN3").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");										
									
									}
								else
									{
									if (!this._EntriesHelpDialog) {
										this._EntriesHelpDialog = sap.ui.xmlfragment(
											"ztwcjobcreate.view.NewEntries", this);
									}
										this.getView().addDependent(this._EntriesHelpDialog);
										this.dialogFlag = "N";
										sap.ui.getCore().byId("IdObj2").setTitle("Vehicle Reg. Number");
										sap.ui.getCore().byId("IdObj2").setText(that.data.RegNo);
										sap.ui.getCore().byId("IdObj3").setTitle("Stencil No");
										sap.ui.getCore().byId("IdObj3").setText(evt.getSource().getBindingContext().getObject().StnclNumber);
										sap.ui.getCore().byId("IdObj4").setTitle("Position");
										sap.ui.getCore().byId("IdObj4").setText(evt.getSource().getBindingContext().getObject().Zposition+" ("+evt.getSource().getBindingContext().getObject().PositionDesc+")");										
									}
															
							this._EntriesHelpDialog.setModel(dataModel,"Recodings");
							var buttonType = evt.getSource().getType();
							var position = evt.getSource().getParent().getCells()[0].getText();
							
							if(evt.getSource().getBindingContext().getObject().Owner!="01" && evt.getSource().getBindingContext().getObject().NonJkCompany!="JK" ){
							  if (this.dialogFlag == "O"){
								sap.ui.getCore().byId("idEarGvw").setVisible(false);
								}
								sap.ui.getCore().byId("idNG4").setVisible(false);
								
								}else{
									if (this.dialogFlag == "O"){		
								sap.ui.getCore().byId("idEarGvw").setVisible(true);	
									}
								sap.ui.getCore().byId("idNG4").setVisible(true);
							}
							
							//if(buttonType == "Accept" && this.tyrePos == position)
								if(buttonType == "Accept")	
								{								
								var nip = that.EntreItem.getBindingContext().getObject().NIpCondition;
								var npsi = that.EntreItem.getBindingContext().getObject().NIpPsi;
								var nkm = that.EntreItem.getBindingContext().getObject().NKmSuspended;
								var nonsd = that.EntreItem.getBindingContext().getObject().NOrigNsd;
								var nnsd1 = that.EntreItem.getBindingContext().getObject().NG1Nsd;
								var nnsd2 = that.EntreItem.getBindingContext().getObject().NG2Nsd;
								var nnsd3 = that.EntreItem.getBindingContext().getObject().NG3Nsd;
								var nnsd4 = that.EntreItem.getBindingContext().getObject().NG4Nsd;
								var nrem = that.EntreItem.getBindingContext().getObject().NRemarks;
								
								if (this.dialogFlag == "N"){
									sap.ui.getCore().byId("idNOrigNsd").setValue(nonsd);
									}
								if (this.dialogFlag == "O"){
									sap.ui.getCore().byId("idNKm").setValue(nkm);
								}
								
								sap.ui.getCore().byId("idNIp").setSelectedKey(nip);
								sap.ui.getCore().byId("idNPsi").setValue(npsi);								
								sap.ui.getCore().byId("idNG1").setValue(nnsd1);
								sap.ui.getCore().byId("idNG2").setValue(nnsd2);
								sap.ui.getCore().byId("idNG3").setValue(nnsd3);
								sap.ui.getCore().byId("idNG4").setValue(nnsd4);	
								sap.ui.getCore().byId("idNRem").setValue(nrem);
								}
							this._EntriesHelpDialog.open();
				    		}
							else{
								sap.m.MessageToast.show("Select Stencil No")
							}
						  }	
						},
						
						handleUploadComplete: function(oEvent){
							var sResponse = oEvent.getParameter("response");
								sResponse = sResponse.split("Added");
							if (sResponse) {
								that.actionItem=oEvent.getSource();
								that.actionMainItem=oEvent.getSource().getParent();
								var table=oEvent.getSource().getParent().getParent();
								var index=table.getItems().indexOf(oEvent.getSource().getParent());
	
								oEvent.getSource().getParent().getBindingContext().getObject().String=sResponse[1];
								sap.m.MessageToast.show("File Uploaded Successfully");
							}
						},
						
						onTabelServiceOK:function(){
						var items=sap.ui.getCore().byId("Servicetbl").getSelectedItems();
						var len = items.length;
						var ECost = 0;
						var PCost = 0;
						debugger
						for(var i=0;i<len;i++){
							var rate = items[i].getCells()[2].getValue();
							ECost = parseInt(ECost) + parseInt(items[i].getCells()[1].getText());
							PCost = parseInt(PCost) + parseInt(items[i].getCells()[2].getValue());
								if (rate<1){
									sap.m.MessageBox.alert(
											"Proposed cost cannot be null for selected services.", {
												icon: sap.m.MessageBox.Icon.WARNING,
												title: "Error"});
									return;
								}
								debugger
								if (PCost > ECost){
									sap.m.MessageBox.alert(
											"Proposed cost cannot be greater than MRP.", {
												icon: sap.m.MessageBox.Icon.WARNING,
												title: "WARNING"});
									return;
								}
							}
						var tab=sap.ui.getCore().byId("Servicetbl");

//						
						debugger
						var modeldata = this.getView().getModel("Fitments").getData();
						modeldata.EstimatedCost = parseInt(modeldata.EstimatedCost) + parseInt(ECost);
						modeldata.ProposedCost = parseInt(modeldata.ProposedCost) + parseInt(PCost);
						this.getView().getModel("Fitments").refresh();
						
						    if (len == 0)
							that.onServiceButton.setType("Reject");
						    else
						    that.onServiceButton.setType("Accept");
						    
							that._SheetHelpDialog.close();
							that._SheetHelpDialog.destroy();
							that._SheetHelpDialog=undefined;
						},
						
						onTabelEntriesClose:function(){
							debugger
							this._ReadEntriesHelpDialog.close();
							this._ReadEntriesHelpDialog.destroy();
							this._ReadEntriesHelpDialog=undefined;
						},
						
						RateValid : function(oEvent)
						{ 
							var val = oEvent.getSource().getValue();
							if(val){
								if(isNaN(val)){
									val = val.substring(0, val.length - 1);
									oEvent.getSource().setValue(val);
								}
							}
							if(val>10000){
								oEvent.getSource().setValue("");
								sap.m.MessageBox.alert(
										"Value can not be greater than 10000", {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: "Error"});	
						}
							
						},
						
						onMiloMeter:function(evt){
							var key=evt.getSource().getSelectedKey();
							var last = this.getView().byId("idLastMilo").getSelectedKey();
							
							this.getView().byId("idMilReading").setValue();
							this.getView().byId("idMulReading").setValue();
							
							if(last == "Y" && key == "Y"){
								that.getView().byId("idMiloMeterreading").setVisible(true);
								this.getView().byId("idMilReading").setEnabled(true);								
								this.getView().byId("idmilolbl").setRequired(true);	
								this.getView().byId("idKm1").setVisible(true);
								this.getView().byId("idMulReading").setEnabled(false);
								this.getView().byId("idkmlbl").setRequired(false);		
								
							}else if(last == "N" && key=="Y"){
								that.getView().byId("idMiloMeterreading").setVisible(true);
								this.getView().byId("idKm1").setVisible(true);
								this.getView().byId("idMilReading").setEnabled(true);
								this.getView().byId("idmilolbl").setRequired(true);	
								this.getView().byId("idMulReading").setEnabled(true);
								this.getView().byId("idkmlbl").setRequired(true);	
							}
							else if(last == "Y"  && key=="N" ){
								that.getView().byId("idMiloMeterreading").setVisible(false);
								this.getView().byId("idKm1").setVisible(true);
								this.getView().byId("idMilReading").setEnabled(false);
								this.getView().byId("idmilolbl").setRequired(false);	
								this.getView().byId("idMulReading").setEnabled(true);
								this.getView().byId("idkmlbl").setRequired(true);	
							} 
							else if(last == "N" && key=="N"){
								that.getView().byId("idMiloMeterreading").setVisible(false);
								this.getView().byId("idKm1").setVisible(true);
								this.getView().byId("idMilReading").setEnabled(false);
								this.getView().byId("idmilolbl").setRequired(false);	
								this.getView().byId("idMulReading").setEnabled(true);
								this.getView().byId("idkmlbl").setRequired(true);	
							}
							else if(last == "" && key=="Y"){
								this.getView().byId("idMiloMeterreading").setVisible(true);
								this.getView().byId("idKm1").setVisible(false);
								this.getView().byId("idMilReading").setEnabled(true);	
								this.getView().byId("idmilolbl").setRequired(true);
								this.getView().byId("idMulReading").setEnabled(false);
								this.getView().byId("idkmlbl").setRequired(false);
							}
							else if(last == "" && key=="N"){
								this.getView().byId("idMiloMeterreading").setVisible(false);
								this.getView().byId("idKm1").setVisible(true);
								this.getView().byId("idMilReading").setEnabled(false);	
								this.getView().byId("idmilolbl").setRequired(false);
								this.getView().byId("idMulReading").setEnabled(true);
								this.getView().byId("idkmlbl").setRequired(true);
							}
							
							if(that.data.EnrolMode =='' ){
								this.getView().byId("idKm1").setVisible(false);
							}

						},
						
						milovalid : function(oEvent)
						{ 
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
							
							var lmilo = this.getView().byId("idLastKm").getValue();
							var cmilo = this.getView().byId("idMilReading").getValue();
							
							var lm = this.getView().byId("idLastMilo").getSelectedKey();
							var m  = this.getView().byId("idEarPSI").getSelectedKey();			
							
							if ( lm == "Y" && m == "Y" ){
								var km = parseInt(cmilo) - parseInt(lmilo);
								this.getView().byId("idMulReading").setValue(km);
							}
						},
						
						
						onYearChange:function(evt){
							var value=evt.getSource().getValue();
							var year=new Date().getFullYear();
							if(parseInt(value)>year){
								sap.m.MessageToast.show("Select Valid Year");
								evt.getSource().setValue();
								that.data.RegYear="";
							}

							
						},
						NumberValidVehicleCC: function(oEvent)
						{ 
							debugger
							var val = oEvent.getSource().getValue();
							if(val == "0"){
								sap.m.MessageToast.show("Vehicle CC can not be less than 0");
								this.getView().byId("FVehicleCCEdit").setValue();
								return;
							}
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
						
						NumberValid: function(oEvent)
						{ 
							debugger
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
						
						NumberValidPSI: function(oEvent){

                            var text = oEvent.getSource().getValue();
                            var code = text.charCodeAt(text.length-1);
                            if ( !(code > 47 && code < 58)){
                            	text = text.substring( 0 , text.length - 1 );
                             }              
                             oEvent.getSource().setValue(text);  
                            },	
						
						
	/*			        NsdValid : function(oEvent)
				        { 
				          var val = oEvent.getSource().getValue();
				          if(val){
				            if(isNaN(val)){
				              val = val.substring(0, val.length - 1);
				              oEvent.getSource().setValue(val);					
				            }
				          }
				          if(parseInt(val) > 99){
								oEvent.getSource().setValue("");
								sap.m.MessageBox.alert(
										"NSD value can not be greater than 100", {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: "Error"
										}
									);
							}  
				        },	*/
                            
                            
				   /* this is old code 16/11/2019
				    * 
				        NsdValid: function(oEvent){
				    		var text = oEvent.getSource().getValue();
				    		var code = text.charCodeAt(text.length-1);	 
				    			
				                             if(text.length > 1){
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
				    				oEvent.getSource().setValue(text);	
				    		},				        
				        
				        */
				        
						
						NumberValid2: function(oEvent){
							var val = oEvent.getSource().getValue();
//							var num = parseFloat($(this).val());
//						    var cleanNum = num.toFixed(2);
//						    $(this).val(cleanNum);
						    var ex = /^[0-9]+\.?[0-9]*$/;
						    if(ex.test(val)==false){
						      val = val.substring(0,val.length - 1);
						      oEvent.getSource().setValue(val);
						     }else{
						    	 
						    	 var a = val.split(".");
						    	 var c = a[0];
						    	 if(a[1].length>2){
						    		 var d = a[1].substring(0,a[1].length - 1);
						    		 var e = [c,d];
						    		 var f = e.join(".");
						    		 oEvent.getSource().setValue(f);
						    		 sap.m.MessageToast.show("You can enter upto 2 Decimal Digits"); 
						    	 }
						     }
						},
						
					payLoadDate: function(SDateValue) 
					{
						var str = "T00:00:00";
						var currentTime = new Date(SDateValue);
						var month = currentTime.getMonth() + 1;
						var day = currentTime.getDate();
						var year = currentTime.getFullYear();
						var date = year + "-" + month + "-" + day + str;
						return date;
					},	
						
					changeFitmentDate:function(evt){
						debugger
							var date=evt.getSource().getDateValue();
							var today=new Date();
							today.setHours(00,00,00);
							if(date.getTime()>today.getTime()){
								sap.m.MessageToast.show("Inspection Date Cannot Be A Future Date");
								evt.getSource().setDateValue(null);
								return
							}
							var date1 = this.payLoadDate(date);							
							var fitdate = that.data.FitmentDate;
							var insdate = that.data.LastInspDate;
							if (insdate !== "" ){
								if (date1 < insdate){
								sap.m.MessageToast.show("Inspection Date Cannot Be Before Last Inspection Date");
								evt.getSource().setDateValue(null);
								}
							}
							else
						    {
								if (date1 < fitdate){
								sap.m.MessageToast.show("Inspection Date Cannot Be Before Fitment Date");
								evt.getSource().setDateValue(null);
								}
						    }	
						
							},
						
						onStncNo:function(evt){
							debugger
							that.stnclfld=evt.getSource();
							if(that.stnclfld.getParent().getCells()[2].sId.indexOf("input")!=-1){
							var item=that.stnclfld.getParent().getBindingContext().getObject().ItemCode;
							}else{
							var item=that.stnclfld.getParent().getBindingContext().getObject().ItemCode;
							}
							
							if(item!=""||that.stnclfld.getParent().getCells()[2].sId.indexOf("input")==-1){
								that.onTyreOk();
							}else{
								sap.m.MessageToast.show("Select Item Code")
							}
							},
							
							onTyreClose:function(){
							that._TyreHelpDialog.close();
							that._TyreHelpDialog.destroy();
							that._TyreHelpDialog=undefined;
							},
							
						_handleTypeStncClose : function(oEvent) {
							debugger
							var oSelectedItem = oEvent.getParameter("selectedItem");
							if (oSelectedItem) {
								var flg="";
//								var flg=1;
								var item=that.stnclfld.getParent();
								if(that.flg==1){
								var data=that.flg==0?that.getView().byId("" +
										"").getItems():that.getView().byId("tblDetail1").getItems();}
								else{
									var data=that.flg==1?that.getView().byId("" +
									"").getItems():that.getView().byId("tblDetail").getItems();	
								}
								var num=data.indexOf(item);
								for(i=0;i<data.length;i++){
									if(i!=num){
										if(data[i].getCells()[4].getValue()==oSelectedItem.getTitle()){
											flg="X";
											
										}
									}
								}
								if(flg!="X"){
								that.stnclfld.setValue(
										oSelectedItem.getTitle());
								var CopyData=oSelectedItem.getBindingContext().getObject();
								//that.stnclfld.getParent().getCells()[4].setValue(oSelectedItem.getBindingContext().getObject().OrigNsd);
								that.stnclfld.getParent().getBindingContext().getObject().G1Nsd=CopyData.G1Nsd;
								that.stnclfld.getParent().getBindingContext().getObject().G2Nsd=CopyData.G2Nsd;
								that.stnclfld.getParent().getBindingContext().getObject().G3Nsd=CopyData.G3Nsd;
								that.stnclfld.getParent().getBindingContext().getObject().G4Nsd=CopyData.G4Nsd;
								that.stnclfld.getParent().getBindingContext().getObject().OrigNsd=CopyData.OrigNsd;
								that.stnclfld.getParent().getBindingContext().getObject().IpCondition=CopyData.IpCondition;
								that.stnclfld.getParent().getBindingContext().getObject().IpPsi=CopyData.IpPsi;
								that.stnclfld.getParent().getBindingContext().getObject().TyreLoc=CopyData.CTyreLoc;
								var RecModel = new sap.ui.model.json.JSONModel(oSelectedItem.getBindingContext().getObject());
								that.stnclfld.setModel(RecModel,"Recodings");
						/*		if(CopyData.CTyreLoc=="FRS"){
									that.stnclfld.getParent().getCells()[7].setEnabled(false);	
								}else{
									that.stnclfld.getParent().getCells()[7].setEnabled(true);
								}*/
								
								}else{
									sap.m.MessageToast.show("Stencil No "+oSelectedItem.getTitle() +" already Selected")
								}
							}

						},
						onTyreOk:function(){
							
							if(that.stnclfld.getParent().getCells()[2].sId.indexOf("input")!=-1){
								var item=that.stnclfld.getParent().getBindingContext().getObject().ItemCode;
								}else{
								var item="";
								}
							
							if(item!=""||that.stnclfld.getParent().getCells()[2].sId.indexOf("input")==-1){
								if(kunnr){
									var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Stencil_NumberSet?$filter=CType eq 'I' and CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"'and CNonJkCompany eq '"+that.stnclfld.getParent().getBindingContext().getObject().NonJkCompany+"' and  CTyreType eq '' and CKunnr eq '"+ kunnr +"' and CTyreLoc eq ''  and CMatnr eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemCode+"' and " +
									"CMaktx eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemDesc+"' and COwner eq'"+that.stnclfld.getParent().getBindingContext().getObject().Owner+"'";
								}else{
									var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Stencil_NumberSet?$filter=CType eq 'I' and CRegNo eq '"+this.getView().byId("FVehicleNoEdit").getValue()+"'and CNonJkCompany eq '"+that.stnclfld.getParent().getBindingContext().getObject().NonJkCompany+"' and  CTyreType eq '' and CKunnr eq '"+sap.ui.getCore().byId("idFleet").getName()+"' and CTyreLoc eq ''  and CMatnr eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemCode+"' and " +
									"CMaktx eq '"+that.stnclfld.getParent().getBindingContext().getObject().ItemDesc+"' and COwner eq'"+that.stnclfld.getParent().getBindingContext().getObject().Owner+"'";
								}
								
							
							var jModel = new sap.ui.model.json.JSONModel();
							jModel.loadData(sPath, null, false, "GET", false,
									false, null);
							var _valueHelpStncSelectDialog = new sap.m.SelectDialog(
									{
										title : "Select Stencil No",
										items : {
											path : "/d/results",
											template : new sap.m.StandardListItem(
													{
														title : "{StnclNumber}",
														customData : [ new sap.ui.core.CustomData(
																{
																	key : "Key",
																	value : "{StnclNumber}"
																}) ],

													}),
										},
								liveChange : function(oEvent) {
											var sValue = oEvent.getParameter("value");
		
		 var oFilter = new sap.ui.model.Filter("StnclNumber",sap.ui.model.FilterOperator.Contains,sValue);

											oEvent.getSource().getBinding("items")
													.filter([ oFilter ]);
										},
										confirm : [ this._handleTypeStncClose, this ],
										cancel : [ this._handleTypeStncClose, this ]
									});
							_valueHelpStncSelectDialog.setModel(jModel);
							_valueHelpStncSelectDialog.open();

							}else{
								sap.m.MessageToast.show("Select Description")
							}
							
						},
						
						OnTableSelect:function(evt){
							debugger
							if(evt.getParameter("listItem").getSelected()){
								evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
								that.evt=evt.getParameter("listItem").getBindingContext().getObject();
								that.evtItem=evt.getParameter("listItem");
								if (that.data.EnrolMode!="M"){
								evt.getParameter("listItem").getCells()[2].setEnabled(true);
								}
							}else{
								evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";	
								var cost=evt.getParameter("listItem").getBindingContext().getObject().ServiceRate;
								evt.getParameter("listItem").getCells()[2].setValue(cost);
								evt.getParameter("listItem").getCells()[2].setEnabled(false);
							}
					
									
									},
						
						onCutClose:function(){
							that.evt.ServiceSelect=""
								that.evtItem.setSelected(false);	
								this._CutHelpDialog.close();
								this._CutHelpDialog.destroy();
								this._CutHelpDialog=undefined;
						},
						onCutOk:function(){
							if(sap.ui.getCore().byId("IdObj5").getVisible()){
								if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
									var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
									var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
									var patSize=sap.ui.getCore().byId("idcutsz").getValue();
									if(typeofCut==""){
										sap.m.MessageToast.show("Select Type of Cut");
										return
									}
									if(WidthofCut==""){
										sap.m.MessageToast.show("Enter Width of Cut");
										return
									}
									if(patSize==""){
										sap.m.MessageToast.show("EnterPatch Size");
										return
									}
									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
									that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
									that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
								}
								if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
									var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
									//var nittp=sap.ui.getCore().byId("idNitTP").getSelectedKey();
									if(nit==""){
										sap.m.MessageToast.show("Select Nitrogen Filling");
										return
									}
//									if(nittp==""){
//										sap.m.MessageToast.show("Select Nitrogen Top Up");
//										return
//									}
									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
									//that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idNitTP").getSelectedKey()
								}
								if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
									var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
									var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
									if(nit==""){
										sap.m.MessageToast.show("Select Rotation on Axles");
										return
									}
									if(nittp==""){
										sap.m.MessageToast.show("Rotation on Wheel Rim");
										return
									}
									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
									that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
								}
								if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
									var nit=sap.ui.getCore().byId("ID1").getValue();
									var nit1=sap.ui.getCore().byId("ID11").getValue();
									var nit2=sap.ui.getCore().byId("ID2").getValue();
									var nit3=sap.ui.getCore().byId("ID21").getValue();
									var nit4=sap.ui.getCore().byId("ID3").getValue();
									var nit5=sap.ui.getCore().byId("ID31").getValue();
									var nit6=sap.ui.getCore().byId("ID4").getValue();
									
									if(nit=="" || !(Math.abs(nit) >= 0 )){
										sap.m.MessageToast.show("Enter Total Toe In (Before)");
										return
									}
									if(nit1=="" || !(Math.abs(nit1) >= 0 )){
										sap.m.MessageToast.show("Enter Total Toe In (After)");
										return
									}
									if(nit2=="" || !(Math.abs(nit2) >= 0 )){
										sap.m.MessageToast.show("Enter Thrust (Before)");
										return
									}
									if(nit3=="" || !(Math.abs(nit3) >= 0 )){
										sap.m.MessageToast.show("Enter Thrust (Before)");
										return
									}
									if(nit4=="" || !(Math.abs(nit4) >= 0 )){
										sap.m.MessageToast.show("Enter Scrub (Before)");
										return
									}
									if(nit5=="" || !(Math.abs(nit5) >= 0 )){
										sap.m.MessageToast.show("Enter Scrub (After)");
										return
									}
									if(nit6==""){
										sap.m.MessageToast.show("Enter Remarks");
										return
									}
									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
									that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
									that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
									that.evt.IservToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID21").getValue();
									that.evt.IservToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID3").getValue();
									that.evt.IservToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
									that.evt.IservToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
								}
								if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
									var nit=sap.ui.getCore().byId("IDweig").getValue();
									
									if(nit==""){
										sap.m.MessageToast.show("Enter Weight added");
										return
									}
									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
									
									}
								
								if(sap.ui.getCore().byId("IdTMrem").getVisible()){
									var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//									var nittp=sap.ui.getCore().byId("idFttych").getSelectedKey();
//									var nittp1=sap.ui.getCore().byId("idRHT").getSelectedKey();
									
									if(nit==""){
										sap.m.MessageToast.show("Select Tyre Changer");
										return
									}

									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//									that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idFttych").getSelectedKey();
//									that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idRHT").getSelectedKey();
									
									}
								if(sap.ui.getCore().byId("IdTFW").getVisible()){
									var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
									
									if(nit==""){
										sap.m.MessageToast.show("Select Tyre Changer");
										return
									}

									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
									
									}
								
								if(sap.ui.getCore().byId("IdMount").getVisible()){
									var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
									
									if(nit==""){
										sap.m.MessageToast.show("Select Tyre Changer");
										return
									}

									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
								
									}
								
								if(sap.ui.getCore().byId("IdDeMount ").getVisible()){
									var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
									
									if(nit==""){
										sap.m.MessageToast.show("Select Tyre Changer");
										return
									}

									that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
									
									}
								
								
								}else{
									if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
										var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
										var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
										var patSize=sap.ui.getCore().byId("idcutsz").getValue();
										if(typeofCut==""){
											sap.m.MessageToast.show("Select Type of Cut");
											return
										}
										if(WidthofCut==""){
											sap.m.MessageToast.show("Enter Width of Cut");
											return
										}
										if(patSize==""){
											sap.m.MessageToast.show("EnterPatch Size");
											return
										}
										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
										that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
										that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
									}
									if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
										var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
//										var nittp=sap.ui.getCore().byId("idNitTP").getSelectedKey();
										if(nit==""){
											sap.m.MessageToast.show("Select Nitrogen Filling");
											return
										}
//										if(nittp==""){
//											sap.m.MessageToast.show("Select Nitrogen Top Up");
//											return
//										}
										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
										//that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idNitTP").getSelectedKey()
									}
									if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
										var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
										var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
										if(nit==""){
											sap.m.MessageToast.show("Select Rotation on Axles");
											return
										}
										if(nittp==""){
											sap.m.MessageToast.show("Rotation on Wheel Rim");
											return
										}
										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
										that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
									}
									if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
										var nit=sap.ui.getCore().byId("ID1").getValue();
										var nit1=sap.ui.getCore().byId("ID11").getValue();
										var nit2=sap.ui.getCore().byId("ID2").getValue();
										var nit3=sap.ui.getCore().byId("ID21").getValue();
										var nit4=sap.ui.getCore().byId("ID3").getValue();
										var nit5=sap.ui.getCore().byId("ID31").getValue();
										var nit6=sap.ui.getCore().byId("ID4").getValue();
										
										if(nit=="" || !(Math.abs(nit) >= 0 )){
											sap.m.MessageToast.show("Enter Total Toe In (Before)");
											return
										}
										if(nit1=="" || !(Math.abs(nit1) >= 0 )){
											sap.m.MessageToast.show("Enter Total Toe In (After)");
											return
										}
										if(nit2=="" || !(Math.abs(nit2) >= 0 )){
											sap.m.MessageToast.show("Enter Thrust (Before)");
											return
										}
										if(nit3=="" || !(Math.abs(nit3) >= 0 )){
											sap.m.MessageToast.show("Enter Thrust (Before)");
											return
										}
										if(nit4=="" || !(Math.abs(nit4) >= 0 )){
											sap.m.MessageToast.show("Enter Scrub (Before)");
											return
										}
										if(nit5=="" || !(Math.abs(nit5) >= 0 )){
											sap.m.MessageToast.show("Enter Scrub (After)");
											return
										}
										if(nit6==""){
											sap.m.MessageToast.show("Enter Remarks");
											return
										}
										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
										that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
										that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
										that.evt.VServToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID21").getValue();
										that.evt.VServToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID3").getValue();
										that.evt.VServToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
										that.evt.VServToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
									}
									if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
										var nit=sap.ui.getCore().byId("IDweig").getValue();
										
										if(nit==""){
											sap.m.MessageToast.show("Enter Weight added");
											return
										}
										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
										
										}
									
									if(sap.ui.getCore().byId("IdTMrem").getVisible()){
										var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//										var nittp=sap.ui.getCore().byId("idFttych").getSelectedKey();
//										var nittp1=sap.ui.getCore().byId("idRHT").getSelectedKey();
										
										if(nit==""){
											sap.m.MessageToast.show("Select Tyre Changer");
											return
										}

										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//										that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idFttych").getSelectedKey();
//										that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("idRHT").getSelectedKey();
//										
										}
									if(sap.ui.getCore().byId("IdTFW").getVisible()){
										var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
										
										if(nit==""){
											sap.m.MessageToast.show("Select Tyre Changer");
											return
										}

										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
										
										}
									
									if(sap.ui.getCore().byId("IdMount").getVisible()){
										var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
										
										if(nit==""){
											sap.m.MessageToast.show("Select Tyre Changer");
											return
										}

										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
										
										}
									
									if(sap.ui.getCore().byId("IdDeMount").getVisible()){
										var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
										
										if(nit==""){
											sap.m.MessageToast.show("Select Tyre Changer");
											return
										}

										that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
										
										}	
									
									
									
								}
								this._CutHelpDialog.close();
								this._CutHelpDialog.destroy();
								this._CutHelpDialog=undefined;
							},
						onTabelServiceClose:function(){
							that._SheetHelpDialog.close();
							that._SheetHelpDialog.destroy();
							that._SheetHelpDialog=undefined;
						},
						onIpPsiChange:function(evt){
							if(parseFloat(evt.getSource().getValue())>150){
								sap.m.MessageBox.show("Tyre will be over-inflated.");
								return
							}
							if(parseFloat(evt.getSource().getValue())<100){
								sap.m.MessageBox.show("Low inflation.");
								return
							}
						},
						
						
						DateNew:function(Date1){
							var month = Date1.getMonth() + 1;
							var date  = Date1.getDate();
							if (month.toString().length < 2) {
								month = "0" + month.toString();
							}
							if (date.toString().length < 2) {
								date = "0" + date.toString();
							}
							var formatDate = Date1.getFullYear()  + '-' + month + '-' + date + "T00:00:00";
							return formatDate;
						},
		
						
					onReview:function(){
							mode = "R";
						this.createpayload(mode);
						},
						
					onFitmentCreate:function(){
							mode = "S";
							this.createpayload(mode);							
					},		
						
					createpayload:function(mode){
						debugger					
						
						var check = false;
						var tabBar= this.getView().byId("idIconTabBarMulti");
						
						var valid= this.validateHeaderDetails();
						
						if(!valid){
							tabBar.setSelectedKey("A");
							sap.m.MessageBox.show("Please fill all the mandatory fields.", {
								title : "Error",
								icon : sap.m.MessageBox.Icon.ERROR,
							});
							return false;
						};
						
						 debugger
						 var NoOfWheels  = this.getView().byId("idTyreNumber").getValue();
						 var lmilostatus = this.getView().byId("idLastMilo").getSelectedKey();
						 var cmilostatus = this.getView().byId("idEarPSI").getSelectedKey();
						 var lmilo       = this.getView().byId("idLastKm").getValue();
						 var cmilo       = this.getView().byId("idMilReading").getValue();
						 var ckm         = this.getView().byId("idMulReading").getValue();		
						 
						 this.getView().byId("idEarPSI").setValueState("None");
						 this.getView().byId("idMilReading").setValueState("None");
						 this.getView().byId("idMulReading").setValueState("None");
						 
						 if(cmilostatus==""){
							 this.getView().byId("idEarPSI").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Status");
							tabBar.setSelectedKey("A");
							return;							 
						 }
						 
						 if(lmilostatus == "Y" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
							 this.getView().byId("idMilReading").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Reading");
							tabBar.setSelectedKey("A");
							return;
						 }
						 
						 if(lmilostatus == "Y" && cmilostatus == "Y" && parseInt(lmilo) > parseInt(cmilo)){
							 this.getView().byId("idMilReading").setValueState("Error");
								sap.m.MessageToast.show("Milometer Reading can not less than Last Milometer Reading");
								tabBar.setSelectedKey("A");
								return;
						}						 
						 
						 if(lmilostatus == "Y" && cmilostatus == "N" && (parseInt(ckm) < 1 || ckm =="")){
							if(that.data.EnrolMode !== ""){
								this.getView().byId("idMulReading").setValueState("Error");							 
								sap.m.MessageToast.show("Enter KM Covered");
								tabBar.setSelectedKey("A");
								return;
							}	
						}

						if(lmilostatus == "N" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
							this.getView().byId("idMilReading").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Reading");
							tabBar.setSelectedKey("A");
							return;
						}							 
						 
						 if(lmilostatus == "N" && cmilostatus == "Y" && (parseInt(ckm) < 1 || ckm =="")){
							if(that.data.EnrolMode !== ""){
								this.getView().byId("idMulReading").setValueState("Error");
								sap.m.MessageToast.show("Enter KM Covered");
								tabBar.setSelectedKey("A");
								return;
							}	
						}							 

						if(lmilostatus == "N" && cmilostatus == "N" && (parseInt(ckm) < 1 || ckm =="")){
							if(that.data.EnrolMode !== ""){
								this.getView().byId("idMulReading").setValueState("Error");
								sap.m.MessageToast.show("Enter KM Covered");
								tabBar.setSelectedKey("A");
								return;
							}	
						}
						
						if(lmilostatus == "" && cmilostatus == "Y" && (parseInt(cmilo) < 1 || cmilo =="")){
							this.getView().byId("idMilReading").setValueState("Error");
							sap.m.MessageToast.show("Enter Milometer Reading");
							tabBar.setSelectedKey("A");
							return;
						}
						
						var serviceSheetJModel = this.getView().getModel("serviceSheetJModel");
					
						if(serviceSheetJModel.getData().RegnoToServiceNvg.results > 0){
						if(serviceSheetJModel.getData().RegnoToServiceNvg.results[0].IservToSubservNvg){
							for(var i = 0;i<6;i++){
								serviceSheetJModel.getData().RegnoToServiceNvg.results[i]["VServToSubservNvg"] = serviceSheetJModel.getData().RegnoToServiceNvg.results[i].IservToSubservNvg;
								delete serviceSheetJModel.getData().RegnoToServiceNvg.results[i].IservToSubservNvg;
							}
						 }				
						}
											
						debugger				

						var valid=that.validations();        //validation in case of walk in  
						if (valid==false){
							tabBar.setSelectedKey("B");
							sap.m.MessageToast.show("Please fill all the required fields.");
							return
						}						
						
						//check for readings 
						if(that.data.EnrolMode==""){
							var tab=this.getView().byId("tblDetail2");	
							
							for(var i=0;i<tab.getItems().length;i++){
									if(tab.getItems()[i].getCells()[4].getType()!="Accept"){
										tab.getItems()[i].getCells()[4].setType("Reject");
										sap.m.MessageToast.show("Fill Readings of every Position");
										return false
									}
							 }
						}						
						
						
						var valid=that.checkservice();
						if (valid==false){
							tabBar.setSelectedKey("B");
							sap.m.MessageToast.show("Please select atleast one service");
							return
						}
						
						
						if(valid){
						var Data=$.extend( true, {}, that.data  );;
						delete Data.__metadata;
						delete Data.__proto__;
						
						Data.InspType = "04";
						Data.SaveMode = mode;
						Data.ApprovalStatus = "P";
						Data.TruckKunnr = twkunnr;
						Data.CpNo	  = CpNo;
						Data.CpName   = this.getView().byId("idCustomerName").getValue();
						Data.CpMobile = Mobile;
						
						Data.RegNo    	= this.getView().byId("FVehicleNoEdit").getValue();
						Data.MakeCode 	= this.VehicleMake;
						Data.Model    	= this.VehicleModel;
						Data.ConfigCode = ConfigCode;
						Data.TyreSize   = ProdSize;
						Data.AvgSpeed   = parseInt(Data.AvgSpeed);
						Data.Gvw        = parseInt(Data.Gvw);
						Data.VechCc     = parseInt(Data.VechCc);
						Data.LoopDist   = parseInt(Data.LoopDist);
						Data.TyreDesc   = "";
						Data.NoOfWheels = NoOfWheels;
						
						if(Data.MeterReading==""){
						Data.MeterReading="0.0";
						
						}
						if(Data.KmCovered==""){
						Data.KmCovered="0.0";
						}						
							
						Data.RegnoToItemNvg=Data.RegnoToItemNvg.results;
						
						if (Data.RegnoToItemNvg.length != 0){
						for(i=0;i<Data.RegnoToItemNvg.length;i++){							
						delete Data.RegnoToItemNvg[i].__metadata;
						Data.RegnoToItemNvg[i].VitemToServiceNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg.results;
						for(j=0;j<Data.RegnoToItemNvg[i].VitemToServiceNvg.length;j++){
						if(Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results.length!=0){
						delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].__metadata;
						Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg=Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.results
						for(k=0;k<Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg.length;k++){
						delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg[k].__metadata;
						}
						}else{
						delete Data.RegnoToItemNvg[i].VitemToServiceNvg[j].IservToSubservNvg
						}								
						}
						}}else
						{
						delete Data.RegnoToItemNvg;
						}
						
						
						Data.RegnoToServiceNvg=Data.RegnoToServiceNvg.results;
						for(i=0;i<Data.RegnoToServiceNvg.length;i++){
						delete Data.RegnoToServiceNvg[i].__metadata;
						Data.RegnoToServiceNvg[i].VServToSubservNvg=Data.RegnoToServiceNvg[i].VServToSubservNvg.results;
							
						if(Data.RegnoToServiceNvg[i].VServToSubservNvg.length!=0){
						delete Data.RegnoToServiceNvg[i].VServToSubservNvg.__metadata;
						for(j=0;j<Data.RegnoToServiceNvg[i].VServToSubservNvg.length;j++){
						delete Data.RegnoToServiceNvg[i].VServToSubservNvg[j].__metadata;
						}
						}else{
						delete Data.RegnoToServiceNvg[i].VServToSubservNvg
						}
						}						
						
						console.log(Data)
						
						var servLength = Data.RegnoToServiceNvg.length;
						if(servLength <= 0){
							Data.RegnoToServiceNvg=[{}];
						}
												
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oCreateModel1.setHeaders({
						"Content-Type": "application/atom+xml"
						});
						var fncSuccess = function(oData, oResponse) //sucess function 
						{

						var reg = oData.RegNo;
						var insp = oData.InspNo;
						var hub = oData.HubCode;
						var cust = oData.Kunnr;
						
						if(oData.Error=="X"){
						sap.m.MessageBox.show(oData.Message, {
						title: "Error",
						icon:sap.m.MessageBox.Icon.ERROR,
						onClose:function(){
						  }
						 });	
						}else{
						sap.m.MessageBox.show(oData.Message, {
						 title: "Success",
						 icon:sap.m.MessageBox.Icon.SUCCESS,
						 onClose:function(){
							 
							 if (mode=="R"){
								if(oData.EnrolMode != ""){
										that.getView().byId("Id_bt1").setText("Submit For Approval");
										that.getView().byId("Id_bt1").setVisible(true); 
									}
									else{
										that.getView().byId("Id_bt1").setText("Save");
										that.getView().byId("Id_bt1").setVisible(true);
									}	 
							 }

                             if (mode=="S"){
							 debugger
							 sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZFLEET_SRV/TruckWheelOutputFormSet(TWKunnr='"+oData.TruckKunnr+"',RevNo='"+oData.RevNo+"',ServiceNo='"+oData.ServiceNo+"')/$value", true);
							 window.history.back(); 
                             	}
						 		}
						
							    });
								}}
						
							var fncError = function(oError) { //error callback function
								var parser = new DOMParser();
								var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
								sap.m.MessageBox.show(message, {
							        title: "Error",
							        icon:sap.m.MessageBox.Icon.ERROR,
							    });
							}
							
							//Create Method for final Save	
							oCreateModel1.create("/VehicleRegNoSet", Data, {
								success: fncSuccess,
								error: fncError
							});console.log(Data)
							}
						},
						
						validations:function(){
							debugger
							var valid = true;
							
							if(that.data.EnrolMode==""){
							var tab=this.getView().byId("tblDetail2");	
							
							for(var i=0;i<tab.getItems().length;i++){								
								var cell = tab.getItems()[i].getCells();	
								
								for(var j=0;j<=3;j++){
									if(tab.getItems()[i].getCells()[j].getValue()==""){
										valid = false
										tab.getItems()[i].getCells()[j].setValueState(sap.ui.core.ValueState.Error);
									}else{
										tab.getItems()[i].getCells()[j].setValueState(sap.ui.core.ValueState.None);
									}
								}
							 }
							}							
							return valid;  
						},
						
						checkservice:function(){
							debugger
							var valid = false;
							
							if(that.data.EnrolMode==""){
								if(this.getView().byId("serVShVehNew").getType()=="Accept"){
								  valid = true;	
								}
								var tab=this.getView().byId("tblDetail2");
								for(var i=0;i<tab.getItems().length;i++){
									
									if(tab.getItems()[i].getCells()[5].getType()=="Accept"){
										  valid = true;	
									}
								}								
								
							}else{	
								if(this.getView().byId("serVShVeh").getType()=="Accept"){
									  valid = true;	
								}
								
								if(that.data.ContractType=="CPKM"){
									var tab=this.getView().byId("tblDetail");
									for(var i=0;i<tab.getItems().length;i++){
										
										if(tab.getItems()[i].getCells()[6].getType()=="Accept"){
											  valid = true;	
										}
									}
									
								}else if(that.data.ContractType=="SC"){
									
									var tab=this.getView().byId("tblDetail1");
									for(var i=0;i<tab.getItems().length;i++){
										
										if(tab.getItems()[i].getCells()[6].getType()=="Accept"){
											  valid = true;	
										}
									}	
									
								}
							}							
							return valid;  
						},
						
						
						onCompanyChange1 : function(evt){
							var key = evt.getParameter("selectedItem").getKey();
							evt.getSource().setSelectedKey(key);
							evt.getSource().getParent().getCells()[3].setValue("");
							evt.getSource().getParent().getCells()[4].setValue("");
							evt.getSource().getParent().getCells()[7].setType("Emphasized")
							evt.getSource().getParent().getBindingContext().getObject().NonJkCompany=evt.getParameter("selectedItem").getKey()
							var key=evt.getSource().getSelectedKey();
								that.selectedCompanyKey = key;
						},
						   
					
					
							validateCharacter : function( oEvent ){
							var text     = oEvent.getSource().getValue();
							var reg      = /^[a-zA-Z]+$/;
							if( !text.match(reg) ){
							if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
								text = text.substring( 1 , text.length );
							}
							else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
									text = text.substring( 0 , text.length - 1 );
								}
							else{
								for( var i = 0 ; i < text.length; i++ ){
								if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
								text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
								}
								}
								}
								oEvent.getSource().setValue( text );  
								}
							else{
								oEvent.getSource().setValueState( "None" );
								} 
								},

								
								onCreateNewCustomer: function()
								{
								debugger
								this._EntriesHelpDialog = sap.ui.xmlfragment(
										"ztwcjobcreate.view.addNewCustomer", this);
								this.getView().addDependent(this._EntriesHelpDialog);
								this._EntriesHelpDialog.open();
								}, 
								onTabelEntriesClose1: function(evt)
								{
								this._EntriesHelpDialog.close();
								this._EntriesHelpDialog.destroy(true);
									},
									
							
								/**********************/
								bindStateData1: function() {
									debugger
									var oViewObj = this.getView();
									var stateListSetJModel = oViewObj.getModel("stateListSetJModel");
									if (!stateListSetJModel) {
										//stateListSetJModel = new JSONModel();
										stateListSetJModel = new sap.ui.model.json.JSONModel();
										oViewObj.setModel(stateListSetJModel, "stateListSetJModel");
									}
									var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
							 		var jModel = new sap.ui.model.json.JSONModel();
							 		stateListSetJModel.loadData(sPath, null, false,"GET",false, false, null);

								},
								
						//start state 
								onStateHelp1: function(oEvt) {
									debugger
								var oViewObj = this.getView();
								var stateListSetJModel = oViewObj.getModel("stateListSetJModel");
					    	    var _valueHelpSelectDialog1 = new sap.m.SelectDialog({
					    	    	title: "State",
					    	        items: {
					    	            path: "/d/results",
					    	            template: new sap.m.StandardListItem({
					    	                title: "{Region}",
					    	                customData: [new sap.ui.core.CustomData({
					    	                    key: "Key",
					    	                    value: "{RegionCode}"
					    	                })],    	               
					    	            }),
					    	        },
					    	        liveChange: function(oEvent) {
					    	        	debugger
					    	            var sValue = oEvent.getParameter("value");
					    	            var oFilter = new sap.ui.model.Filter("Region",sap.ui.model.FilterOperator.Contains,sValue);
					    	            oEvent.getSource().getBinding("items").filter([oFilter]);
					    	        },
					    	        confirm: [this._handleClose1, this],
					    	        cancel: [this._handleClose1, this]
					    	    });
					    	    _valueHelpSelectDialog1.setModel(stateListSetJModel);
					    	    _valueHelpSelectDialog1.open();
								},
					    	
					    	_handleClose1: function(oEvent) {
					    		debugger
					    	    var oSelectedItem = oEvent.getParameter("selectedItem");
					    	    if (oSelectedItem) {
					    	    	this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
					    	    	//this.getView().byId("idDistrict").setEnabled(true);
					    	    	//this.getView().byId("idDistrict").setValue(" ");
					    	    	//this.getView().byId("idLocation").setValue(" ");
					    	    	sap.ui.getCore().byId("idstate").setValue(oSelectedItem.getTitle());
					    	    	sap.ui.getCore().byId("idstate").setValue(oSelectedItem.getTitle());
					    	    //	this.bindDistrictData(this.State);
					    	    }      
					    	},
								/***********************/
								

								bindStateData: function() {
									debugger
									var oViewObj = this.getView();
									var stateListSetJModel = oViewObj.getModel("stateListSetJModel");
									if (!stateListSetJModel) {
										//stateListSetJModel = new JSONModel();
										stateListSetJModel = new sap.ui.model.json.JSONModel();
										oViewObj.setModel(stateListSetJModel, "stateListSetJModel");
									}
									var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq 'IN'";
							 		var jModel = new sap.ui.model.json.JSONModel();
							 		stateListSetJModel.loadData(sPath, null, false,"GET",false, false, null);

								},
								bindDistrictData: function(state) {
									debugger
									var oViewObj = this.getView();
									var districtListSetJModel = oViewObj.getModel("districtListSetJModel");
									if (!districtListSetJModel) {
										//districtListSetJModel = new JSONModel();
										districtListSetJModel = new sap.ui.model.json.JSONModel();
										oViewObj.setModel(districtListSetJModel, "districtListSetJModel");
									}
									var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + state + "'";
							 		var jModel = new sap.ui.model.json.JSONModel();
							 		districtListSetJModel.loadData(sPath, null, false,"GET",false, false, null);
								},
								//start state 
								onStateHelp: function(oEvt) {
									debugger
								var oViewObj = this.getView();
								var stateListSetJModel = oViewObj.getModel("stateListSetJModel");
					    	    var _valueHelpSelectDialog = new sap.m.SelectDialog({
					    	    	title: "State",
					    	        items: {
					    	            path: "/d/results",
					    	            template: new sap.m.StandardListItem({
					    	                title: "{Region}",
					    	                customData: [new sap.ui.core.CustomData({
					    	                    key: "Key",
					    	                    value: "{RegionCode}"
					    	                })],    	               
					    	            }),
					    	        },
					    	        liveChange: function(oEvent) {
					    	        	debugger
					    	            var sValue = oEvent.getParameter("value");
					    	            var oFilter = new sap.ui.model.Filter("Region",sap.ui.model.FilterOperator.Contains,sValue);
					    	            oEvent.getSource().getBinding("items").filter([oFilter]);
					    	        },
					    	        confirm: [this._handleClose, this],
					    	        cancel: [this._handleClose, this]
					    	    });
					    	    _valueHelpSelectDialog.setModel(stateListSetJModel);
					    	    _valueHelpSelectDialog.open();
								},
					    	
					    	_handleClose: function(oEvent) {
					    		debugger
					    	    var oSelectedItem = oEvent.getParameter("selectedItem");
					    	    if (oSelectedItem) {
					    	    	this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
					    	    	sap.ui.getCore().byId("idDistrict").setEnabled(true);
					    	    	sap.ui.getCore().byId("idDistrict").setValue(" ");
					    	    	sap.ui.getCore().byId("idLocation").setValue(" ");
					    	    	sap.ui.getCore().byId("idState").setValue(oSelectedItem.getTitle());
					    	    	sap.ui.getCore().byId("idState").setValue(oSelectedItem.getTitle());
					    	    	this.bindDistrictData(this.State);
					    	    }      
					    	},
					    	//end state
					    	//start district	
							onDistrictHelp: function(oEvt) {
								debugger
								var oViewObj = this.getView();
								var districtListSetJModel = oViewObj.getModel("districtListSetJModel");
								var getdistrictValue = districtListSetJModel.getData();
								this._onDistrictCodeHelp();
							},  
							_onDistrictCodeHelp: function(oController) {
								debugger
								if (!this._onDistrictHelpDialog) {
									this._onDistrictHelpDialog = sap.ui.xmlfragment(
										"ztwcjobcreate.view.District", this);
									this.getView().addDependent(this._onDistrictHelpDialog);
								}
								// open value help dialog
								this._onDistrictHelpDialog.open();
								}, 
							_DistrictClose: function(evt) {
								debugger
								var oSelectedItem = evt.getParameter("selectedItem");
								if (oSelectedItem) {
									//Fetching the selected value
									sap.ui.getCore().byId("idLocation").setEnabled(true);
									sap.ui.getCore().byId("idLocation").setValue(" ");
									sap.ui.getCore().byId("idDistrict").setValue(oSelectedItem.getTitle());
									}
								evt.getSource().getBinding("items").filter([]);
							},
							_DistrictSearch: function(evt) {
								var sValue = evt.getParameter("value");
					            var oFilter = new sap.ui.model.Filter("District",sap.ui.model.FilterOperator.Contains,sValue);
					            evt.getSource().getBinding("items").filter([oFilter]);
							}, 
							// End district	

							/******************end************/
							 onNewCustomerOk: function(){
								debugger
								var check = false;
								var oFinal = {};
								// get all values
								
								oFinal.CustNo					= "";	
								oFinal.CustomerTelf1 			= sap.ui.getCore().byId("idInpMobile1").getValue();
								oFinal.CustomerFname			= sap.ui.getCore().byId("idInpFname").getValue();
								oFinal.CustomerLname 			= sap.ui.getCore().byId("idInpLname").getValue();
								oFinal.CustomerEmail 			= sap.ui.getCore().byId("idInpEmail").getValue();
								oFinal.CustomerAddr1 			= sap.ui.getCore().byId("idInpAddress1").getValue();
								oFinal.CustomerAddr2 			= sap.ui.getCore().byId("idInpAddress2").getValue();
								oFinal.CustomerRegion 			= this.State;
								oFinal.CustomerCity2 			= sap.ui.getCore().byId("idDistrict").getValue();
								oFinal.CustomerCity1 			= sap.ui.getCore().byId("idLocation").getValue();
								oFinal.CustomerPstlz 			= sap.ui.getCore().byId("idPostalCode").getValue();
								
								
								// validation all fields 
								if(oFinal.CustomerTelf1.length < 10 && oFinal.CustomerTelf1.length != 0 )
								{
									sap.m.MessageToast.show("Phone Number cannot be less than 10 digits"); 
									sap.ui.getCore().byId("idInpMobile1").setValueState(sap.ui.core.ValueState.Error);
									return
								}
								else {
									sap.ui.getCore().byId("idInpMobile1").setValueState(sap.ui.core.ValueState.None);
								}
								if(oFinal.CustomerEmail.length != 0){
									 var e= sap.ui.getCore().byId("idInpEmail").getValue();
									 var atindex= e.indexOf('@');
									 var dotindex=e.lastIndexOf('.');
									if(atindex<1 || dotindex>=e.length-2 || dotindex-atindex<3){
									 sap.m.MessageToast.show("Invalid Email");				 
									 sap.ui.getCore().byId("idInpEmail").setValueState(sap.ui.core.ValueState.Error);
									return (false)
									}
									else {
										sap.ui.getCore().byId("idInpEmail").setValueState(sap.ui.core.ValueState.None);
									}
								}	
								if(oFinal.CustomerFname == "")
								{
									check = true;
									sap.ui.getCore().byId("idInpFname").setValueState(sap.ui.core.ValueState.Error);
								}	
								else {
									sap.ui.getCore().byId("idInpFname").setValueState(sap.ui.core.ValueState.None);				
								}
								
								if(oFinal.CustomerLname == "")
								{
									check = true;
									sap.ui.getCore().byId("idInpLname").setValueState(sap.ui.core.ValueState.Error);
								}	
								else {
									sap.ui.getCore().byId("idInpLname").setValueState(sap.ui.core.ValueState.None);				
								}
							
								
								if(oFinal.CustomerAddr1 == "")
								{
									check = true;
									sap.ui.getCore().byId("idInpAddress1").setValueState(sap.ui.core.ValueState.Error);
								}	
								else {
									sap.ui.getCore().byId("idInpAddress1").setValueState(sap.ui.core.ValueState.None);			
								}
								
								debugger
								if(oFinal.CustomerRegion == "" || oFinal.CustomerRegion == undefined )
								{
									check = true;
									sap.ui.getCore().byId("idState").setValueState(sap.ui.core.ValueState.Error);	
								}	
								else {
									sap.ui.getCore().byId("idState").setValueState(sap.ui.core.ValueState.None);				
								}
								
								if(oFinal.CustomerCity2 == "")
								{
									check = true;
									sap.ui.getCore().byId("idDistrict").setValueState(sap.ui.core.ValueState.Error);	
								}	
								else {
									sap.ui.getCore().byId("idDistrict").setValueState(sap.ui.core.ValueState.None);			
								}

								if(oFinal.CustomerCity1 == "")
								{
									check = true;
									sap.ui.getCore().byId("idLocation").setValueState(sap.ui.core.ValueState.Error);		
								}
								else {
									sap.ui.getCore().byId("idLocation").setValueState(sap.ui.core.ValueState.None);			
								}	
								
								if(oFinal.CustomerPstlz == "")
								{
									check = true;
									sap.ui.getCore().byId("idPostalCode").setValueState(sap.ui.core.ValueState.Error);		
								}
								else {
									sap.ui.getCore().byId("idPostalCode").setValueState(sap.ui.core.ValueState.None);			
								}	
								
								debugger
								if (check == true){
									sap.m.MessageBox.show("Please fill all Required Fields.", {
					                title: "ERROR",
					                icon:sap.m.MessageBox.Icon.ERROR,
									});
									return;
								}
							    
								var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
								var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
								oCreateModel1.setHeaders({
									"Content-Type": "application/atom+xml"
									});
								var fncSuccess = function(oData, oResponse) //sucess function 
									{
									sap.m.MessageBox.show("", {
									   
									title: "Success",
					                    icon:sap.m.MessageBox.Icon.SUCCESS,
//					                    onClose:function(){
//					                    	window.history.back();
//					                    }
									onClose: function(){
										debugger
										//that._NewVehNo.destroy();
										that._EntriesHelpDialog.close();
										},
									
					                });
									}
								var fncError = function(oError) { //error callback function
								var parser = new DOMParser();
								var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
								sap.m.MessageBox.show(message, {
					                title: "Error",
					                icon:sap.m.MessageBox.Icon.ERROR,
					            });
							}
								//Create Method for final Save
								oCreateModel1.create("/TruckWheelCustomerInfoSet", oFinal, {
									success: fncSuccess,
									error: fncError
								});
							 },
							/********End**********/
							/****************open and save fragment data*****************/
							//call vehicle reg fragment 
							onVehReg: function()
							{
							debugger
							var varcust = this.getView().byId("idCustomerName").getValue();
							if(varcust ==""){
								sap.m.MessageBox.show("You are not authorized, please select a customer.", {
									title : "Error",
									icon : sap.m.MessageBox.Icon.ERROR,
									});
							} else {
							this._EntriesHelpDialog = sap.ui.xmlfragment(
									"ztwcjobcreate.view.addVehicle", this);
							this.getView().addDependent(this._EntriesHelpDialog);
							this._EntriesHelpDialog.open();
							} 
							},
							onTabelEntriesClose: function(evt)
							{
							this._EntriesHelpDialog.close();
							this._EntriesHelpDialog.destroy(true);
								},
							
							
							
							 onVehicleMakeHelp1: function(evt) {
									this.VehMakeValue = evt.getSource();
									var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleMakeSet";
									var jModel = new sap.ui.model.json.JSONModel();
									jModel.loadData(sPath, null, false, "GET", false, false, null);
									var _valueHelpDialog = new sap.m.SelectDialog({
										title: "Vehicle Make",
										items: {
										path: "/d/results",
										template: new sap.m.StandardListItem({
										title: "{MakeName}",
										//title: "{MakeShortName}",
										//info : "{MakeName}",
										customData: [new sap.ui.core.CustomData({
										      key: "{MakeCode}", 
											 value: "{MakeName}"
												})]
										})
										},
										liveChange: function(oEvent) {
											var sValue = oEvent.getParameter("value");
											var oFilter = new sap.ui.model.Filter("MakeName", sap.ui.model.FilterOperator.Contains, sValue);
											oEvent.getSource().getBinding("items").filter([oFilter]);
										},
										confirm: [this._handleVehicleMakeClose, this],
										cancel: [this._handleVehicleMakeClose, this]
										});
										_valueHelpDialog.setModel(jModel);
										_valueHelpDialog.open();
										},
										_handleVehicleMakeClose: function(oEvent) {
											debugger
									var oSelectedItem = oEvent.getParameter("selectedItem");
									if (oSelectedItem) {
										this.VehicleMake = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
										this.VehMakeValue.setValue(oSelectedItem.getTitle());
									}
								},
							
								
								onVehicleModelHelp: function(evt) {
									debugger
									this.VehModelValue = evt.getSource();
									var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleModelSet";
									var jModel = new sap.ui.model.json.JSONModel();
									jModel.loadData(sPath, null, false, "GET", false, false, null);
									var _valueHelpDialog = new sap.m.SelectDialog({
										title: "Vehicle Model",
										items: {
										path: "/d/results",
										template: new sap.m.StandardListItem({
										title: "{Model}",
										customData: [new sap.ui.core.CustomData({
											   key: "{Model}",
											 value: "{Model}"
												})]
											})
										},
									liveChange: function(oEvent) {
									var sValue = oEvent.getParameter("value");
									var oFilter = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
										oEvent.getSource().getBinding("items").filter([oFilter]);
										},
									confirm: [this._handleVehicleModelClose, this],
									cancel: [this._handleVehicleModelClose, this]
									});
									_valueHelpDialog.setModel(jModel);
									_valueHelpDialog.open();
									},
									
									_handleVehicleModelClose: function(oEvent) {
										debugger
									var that = this;
									var oSelectedItem = oEvent.getParameter("selectedItem");
									if (oSelectedItem) {
										this.getView().byId("ConfigurationIDID").setValue("");
										this.VehicleModel = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
										this.VehModelValue.setValue(oSelectedItem.getTitle());
									}
									},
									
									onConfigCodeHelp: function(evt) {
										debugger
										this.ConfigCodeValue = evt.getSource();
										var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleConfigCodeSet?$filter=Model eq '"+this.VehicleModel+"'";
										var jModel = new sap.ui.model.json.JSONModel();
										jModel.loadData(sPath, null, false, "GET", false, false, null);
										var _valueHelpDialog = new sap.m.SelectDialog({
											title: "Config Code",
											items: {
											 path: "/d/results",
										 template: new sap.m.StandardListItem({
											title: "{ConfigCodeDesc}",
											//description: "{NoWheels}",
							 		   customData: [new sap.ui.core.CustomData({
											  key: "{ConfigCode}",
											value: "{NoWheels}"
													})]
										 	})
											},
									liveChange: function(oEvent) {
											var sValue = oEvent.getParameter("value");
											var oFilter = new sap.ui.model.Filter("ConfigCode", sap.ui.model.FilterOperator.Contains, sValue);
												oEvent.getSource().getBinding("items").filter([oFilter]);
											},
											confirm: [this._handleConfigCodeClose, this],
											cancel: [this._handleConfigCodeClose, this]
										});
										_valueHelpDialog.setModel(jModel);
										_valueHelpDialog.open();
									   },
								 _handleConfigCodeClose: function(oEvent) {
										var oSelectedItem = oEvent.getParameter("selectedItem");
										if (oSelectedItem) {
											var obj=oSelectedItem.getBindingContext().getObject();
											this.ConfigCode = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
											ConfigCode = this.ConfigCode;
											this.ConfigCodeValue.setValue(oSelectedItem.getTitle());
											this.getView().byId("idTyreNumber").setValue( oEvent.getParameter("selectedItem").getCustomData()[0].getValue() );
										}
						//////////
										
									   },
									   
									   onProductSizeHelp: function(evt) {
										   debugger
										this.ProdSizeValue = evt.getSource();
										var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4ProdSizeSet";
										var jModel = new sap.ui.model.json.JSONModel();
											jModel.loadData(sPath, null, false, "GET", false, false, null);
										var _valueHelpDialog = new sap.m.SelectDialog({
											title: "Product Size",
											items: {
											path: "/d/results",
											template: new sap.m.StandardListItem({
											title: "{ProdDesc}",
											//description:"{ProdSize}",
											customData: [new sap.ui.core.CustomData({
											key: "{ProdSize}",
											value: "{ProdDesc}"
												})]
											})
											},
											liveChange: function(oEvent) {
											var sValue = oEvent.getParameter("value");
											var oFilter = new sap.ui.model.Filter("ProdDesc", sap.ui.model.FilterOperator.Contains, sValue);
												oEvent.getSource().getBinding("items").filter([oFilter]);
												},
												confirm: [this._handleProdSizeClose, this],
												cancel: [this._handleProdSizeClose, this]
											});
											_valueHelpDialog.setModel(jModel);
											_valueHelpDialog.open();
										},
										_handleProdSizeClose: function(oEvent) {
											var oSelectedItem = oEvent.getParameter("selectedItem");
											if (oSelectedItem) {
												this.ProdSize = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
												ProdSize = this.ProdSize;
												this.ProdSizeValue.setValue(oSelectedItem.getTitle());
											}
										},
										
										onBodyTypeHelp: function(evt) {
										this.BodyTypeValue = evt.getSource();
										var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4BodyTypeSet";
										var jModel = new sap.ui.model.json.JSONModel();
											jModel.loadData(sPath, null, false, "GET", false, false, null);
										var _valueHelpDialog = new sap.m.SelectDialog({
												title: "Body Type",
												items: {
												path: "/d/results",
												template: new sap.m.StandardListItem({
												title: "{TypeDesc}",
												customData: [new sap.ui.core.CustomData({
												key: "{BodyType}",
												value: "{TypeDesc}"
												})]
												})
												},
												liveChange: function(oEvent) {
												var sValue = oEvent.getParameter("value");
												var oFilter = new sap.ui.model.Filter("TypeDesc", sap.ui.model.FilterOperator.Contains, sValue);
													oEvent.getSource().getBinding("items").filter([oFilter]);
												},
												confirm: [this._handleBodyTypeClose, this],
												cancel: [this._handleBodyTypeClose, this]
											});
											_valueHelpDialog.setModel(jModel);
											_valueHelpDialog.open();
											},
											_handleBodyTypeClose: function(oEvent) {
											var oSelectedItem = oEvent.getParameter("selectedItem");
											if (oSelectedItem) {
												this.BodyType = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
												this.BodyTypeValue.setValue(oSelectedItem.getTitle());
											}
											},

											onAppTypeHelp: function(evt) {
											this.AppTypeValue = evt.getSource();
											var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4AppTypeSet";
											var jModel = new sap.ui.model.json.JSONModel();
												jModel.loadData(sPath, null, false, "GET", false, false, null);
											var _valueHelpDialog = new sap.m.SelectDialog({
												title: "App Type",
												items: {
												path: "/d/results",
												template: new sap.m.StandardListItem({
												title: "{AppTypeDesc}",
												customData: [new sap.ui.core.CustomData({
													key: "{AppType}",
													value: "{AppTypeDesc}"
														})]
													})
													},
												liveChange: function(oEvent) {
												var sValue = oEvent.getParameter("value");
												var oFilter = new sap.ui.model.Filter("AppTypeDesc", sap.ui.model.FilterOperator.Contains, sValue);
													oEvent.getSource().getBinding("items").filter([oFilter]);
												},
												confirm: [this._handleAppTypeClose, this],
												cancel: [this._handleAppTypeClose, this]
												});
												_valueHelpDialog.setModel(jModel);
												_valueHelpDialog.open();
											},
											_handleAppTypeClose: function(oEvent) {
											var oSelectedItem = oEvent.getParameter("selectedItem");
											if (oSelectedItem) {
											this.AppType = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
											this.AppTypeValue.setValue(oSelectedItem.getTitle());
											}
											},
											
											onReasonFragment:function(evt)
											{
											this.ReasonValue = evt.getSource();
											var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_Mechanical_ReasonSet";
											var jModel = new sap.ui.model.json.JSONModel();
											jModel.loadData(sPath, null, false, "GET", false,false, null);
											var _valueHelpReasonSelectDialog = new sap.m.SelectDialog(
											{
												title : "Select Reason",
												items : {
												path : "/d/results",
												template : new sap.m.StandardListItem(
														{
														title : "{Desc}",
												customData : [ new sap.ui.core.CustomData(
														{
														key : "{CondReason}",
													  value : "{Desc}"
															}) ],
														    }),
															},
															liveChange : function(oEvent) {
											var sValue = oEvent.getParameter("value");
											var oFilter = new sap.ui.model.Filter("Desc",sap.ui.model.FilterOperator.Contains,sValue);
											oEvent.getSource().getBinding("items").filter([ oFilter ]);
															},
											confirm : [ this._handleReasonClose, this ],
											cancel : [ this._handleReasonClose, this ]
													});
											_valueHelpReasonSelectDialog.setModel(jModel);
											_valueHelpReasonSelectDialog.open();
											},
											_handleReasonClose : function(oEvent) {
												debugger
											var oSelectedItem = oEvent.getParameter("selectedItem");
											if (oSelectedItem) {
											this.ReasonValue.setValue(oSelectedItem.getTitle());
											this.Reason = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
											}
											},
											
											onMechCondChange : function(evt)
											{
												debugger
												var val = evt.getSource().getParent().getParent();
												
												var key = val.getFormElements()[1].getFields()[0].getSelectedKey();
												if(key == "N")
													{
													val.getFormElements()[2].setVisible(false);
													val.getFormElements()[2].getFields()[0].setVisible(true);
													val.getFormElements()[2].getLabel().setVisible(true);
													}
												else
													{
													val.getFormElements()[2].setVisible(true);
													val.getFormElements()[2].getFields()[0].setVisible(false);
													val.getFormElements()[2].getLabel().setVisible(false);
													val.getFormElements()[2].getFields()[0].setValue("");
												
													}
											},
											
						upperCase1: function(oEvent){
						debugger
						var val = oEvent.getParameter("value");
						if(val.length > 0){
						sap.ui.getCore().byId("idVehReg").setValue(val.toUpperCase());
						}
						},
											
						onTabelEntrieOks:function(){
						debugger
						var check = false;
						var arr = [];
						var data = {};
						// get all values
									
						data.RegNo				= sap.ui.getCore().byId("idVehReg").getValue();	
						data.MechCond 			= sap.ui.getCore().byId("idMechCod").getSelectedKey();
						data.MechCondReason		= this.Reason;
						data.MakeCode			= sap.ui.getCore().byId("idVehMake").getValue();
						data.Model 			    = sap.ui.getCore().byId("idVehModel").getValue();
						data.ConfigCode 		= ConfigCode;
						data.ProdSize			= ProdSize;
						data.ChassisNo			= sap.ui.getCore().byId("idChassisno").getValue();
						data.EngineNo 			= sap.ui.getCore().byId("idEngno").getValue();
						data.BodyType			= this.BodyType;
						data.AppType			= this.AppType;
						data.ContractType = "SC";
										
						if(data.RegNo == "")
						{
						debugger
						check = true;
						sap.ui.getCore().byId("idVehReg").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idVehReg").setValueState(sap.ui.core.ValueState.None);				
						}
												
						if(data.MechCond == "")
						{
						check = true;
						sap.ui.getCore().byId("idMechCod").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idMechCod").setValueState(sap.ui.core.ValueState.None);				
						}
									
						if(data.MechCondReason == "")
						{
						check = true;
						sap.ui.getCore().byId("idMcr").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idMcr").setValueState(sap.ui.core.ValueState.None);				
						}
												
						if(data.MakeCode == "")
						{
						check = true;
						sap.ui.getCore().byId("idVehMake").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idVehMake").setValueState(sap.ui.core.ValueState.None);				
						}
						debugger
						if(data.Model == "")
						{
						check = true;
						sap.ui.getCore().byId("idVehModel").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idVehModel").setValueState(sap.ui.core.ValueState.None);				
						}
										
						if(data.ConfigCode == "")
						{
						check = true;
						sap.ui.getCore().byId("idConfig").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idConfig").setValueState(sap.ui.core.ValueState.None);				
						}
									
						if(data.ProdSize == "")
						{
						check = true;
						sap.ui.getCore().byId("idPdtSize").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idPdtSize").setValueState(sap.ui.core.ValueState.None);				
						}
										
						if(data.ChassisNo == "")
						{
						check = true;
						sap.ui.getCore().byId("idChassisno").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idChassisno").setValueState(sap.ui.core.ValueState.None);				
						}
												
						if(data.EngineNo == "")
						{
						check = true;
						sap.ui.getCore().byId("idEngno").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idEngno").setValueState(sap.ui.core.ValueState.None);				
						}
											
						if(data.BodyType == "")
						{
						check = true;
						sap.ui.getCore().byId("idBodyType").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idBodyType").setValueState(sap.ui.core.ValueState.None);				
						}
											
						if(data.AppType == "")
						{
						check = true;
						sap.ui.getCore().byId("idAppType").setValueState(sap.ui.core.ValueState.Error);
						}	
						else {
						sap.ui.getCore().byId("idAppType").setValueState(sap.ui.core.ValueState.None);				
						}
												
						debugger
						if (check == true){
						sap.m.MessageBox.show("Please fill all Required Fields.", {
						 title: "ERROR",
						 icon:sap.m.MessageBox.Icon.ERROR,
						});
						return;
						}
						arr.push(data);
						var payload={
								
						Kunnr : this.getView().byId("idCustomerNo").getValue(),
						
						Message :""
							};
						payload.VhclRegisHeadToItemNvg = arr;
												
						var sServiceUrl = "/sap/opu/odata/sap/ZFLEET_SRV/";
						var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
						oCreateModel1.setHeaders({
						"Content-Type": "application/atom+xml"
								});
						var fncSuccess = function(oData, oResponse) //success function 
						{
						sap.m.MessageBox.show(oData.Message, {
								title: "Success",
						        icon:sap.m.MessageBox.Icon.SUCCESS,
						      
								onClose: function(){
									debugger
								that._EntriesHelpDialog.close();
								that._EntriesHelpDialog.destroy(true);
								},
								
						        });
								}
					var fncError = function(oError) { //error callback function
					var parser = new DOMParser();
					var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
					sap.m.MessageBox.show(message, {
					       title: "Error",
					       icon:sap.m.MessageBox.Icon.ERROR,
					         });
						}
						debugger
						//Create Method for final Save
					oCreateModel1.create("/SaveVehicleRegistrationHeadSet", payload, {
						success: fncSuccess,
						error: fncError
							});
						},
						/*End */
						/*************Customer Fragment open ****************/
						displayRequestbyName: function(e){
							debugger
							var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
							var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
							var Name = data.Name;
							CpNo = data.CpNo;
							Mobile = data.Mobile;
							var selectedData={};
							selectedData.Name = Name;
							selectedData.CpNo = CpNo;
							selectedData.Mobile = Mobile;
							var tempjsonString = JSON.stringify(selectedData);
							var jsonstring = tempjsonString.replace(/\//g, "@");
							this.getView().byId("idCustomerName").setValue(Name);//+","+CpNo
							this.getView().byId("idCustomerNo").setValue(CpNo);
							this.getView().byId("idMobile").setValue(Mobile);
							this._EntriesHelpDialog.close();
							this._EntriesHelpDialog.destroy(true);
							
						},
						
						displayRequestbyCNo: function(e){
							debugger
							var path = e.getSource().getBindingContext("CartListSetJModel").getPath().split('/')[1]
							var data = e.getSource().getBindingContext("CartListSetJModel").getModel().getData()[path];
							var Name = data.Name;
							var CpNo = data.CpNo;
							CustNo = CpNo;
							var selectedData={};
							selectedData.Name = Name;
							selectedData.CpNo = CpNo;
							var tempjsonString = JSON.stringify(selectedData);
							var jsonstring = tempjsonString.replace(/\//g, "@");
							this.getView().byId("idCustomerName").setValue(Name);//+","+CpNo
							this.getView().byId("idCustomerNo").setValue(CpNo);
							this.getView().byId("idMobile").setValue(CpNo);
							this._EntriesHelpDialog.close();
							this._EntriesHelpDialog.destroy(true);
							
						},
					
						
						 onCustomerName:function(){
							debugger
							that = this;
							var CartListSetJModel = new sap.ui.model.json.JSONModel();
							this._EntriesHelpDialog = sap.ui.xmlfragment("ztwcjobcreate.view.Customer",this);
							this.getView().addDependent(this._entriesHelpDialog);
							this._EntriesHelpDialog.setModel(CartListSetJModel, "CartListSetJModel");
							this._EntriesHelpDialog.open();
							twname  = that.FleetData.Name;
							sap.ui.getCore().byId("idDealer").setText(twname);
							},
					
	onSearch:function(){
						   debugger
						   	var customer 	= sap.ui.getCore().byId("idcustomer").getValue();
							var CustomerNo  = sap.ui.getCore().byId("idcustomerno").getValue();
							var Mobileno 	= sap.ui.getCore().byId("idmobileno").getValue();

						   var CartListSetJModel = this._EntriesHelpDialog.getModel("CartListSetJModel");
							
							debugger
							var sPathCartListSet = "/TruckWheelCustomerInfoSet?$filter=TwKunnr eq '"+twkunnr+"'" +
																				  "and CpNo    eq '"+CustomerNo+"'" +
																				  "and Name    eq '"+customer+"'" +
																				  "and Mobile  eq '"+Mobileno+"'";
																														
					var frameworkODataModel = this.getOwnerComponent().getModel();
					var oParamsCartListSet = {};
					oParamsCartListSet.context = "";
					oParamsCartListSet.urlParameters = "";
					oParamsCartListSet.success = function(oData, oResponse) { // success handler
					debugger;
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
					  
							onCustomerfrgClose: function(evt)
					  		{
							this._EntriesHelpDialog.close();
							this._EntriesHelpDialog.destroy(true);
								},
							
					   			/**************End****************/
								
//****************Added by Hans on 8 jan 2019 *******************
								onVehicleMakeHelp: function(evt) {
									debugger
								    this.VehMakeValue = evt.getSource();
								    var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4VehicleMakeSet";
								    var jModel = new sap.ui.model.json.JSONModel();
								    jModel.loadData(sPath, null, false, "GET", false, false, null);
								    var _valueHelpDialog = new sap.m.SelectDialog({

								      title: "Vehicle Make",
								      items: {
								        path: "/d/results",
								        template: new sap.m.StandardListItem({
//				change sumit 13/01/2019			 
								          title: "{MakeName}",
								          customData: [new sap.ui.core.CustomData({
								            key: "{MakeCode}",
								            value: "{MakeName}"
								          })]

								        })
								      },
								      liveChange: function(oEvent) {
								        var sValue = oEvent.getParameter("value");
								        var oFilter = new sap.ui.model.Filter("MakeName", sap.ui.model.FilterOperator.Contains, sValue);
								        oEvent.getSource().getBinding("items").filter([oFilter]);
								      },
								      confirm: [this._handleVehicleMakeClose, this],
								      cancel: [this._handleVehicleMakeClose, this]
								    });
								    _valueHelpDialog.setModel(jModel);
								    _valueHelpDialog.open();
								  },

								  _handleVehicleMakeClose: function(oEvent) {
								    var oSelectedItem = oEvent.getParameter("selectedItem");
								    if (oSelectedItem) {
								      this.VehicleMake = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
								      this.VehMakeValue.setValue(oSelectedItem.getTitle());
								    }

								  },								  
//////////////////////////////////////////////////////////////////////////////////////////////////									  
							onAddServiceData: function(){
										  
									var tyre = parseInt(this.getView().byId("idTyreNumber").getValue());
									var rows = this.getView().byId("tblDetail2").getItems().length;
									
									if( rows >= tyre+1 ){
										sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
											MessageBox.show(
												"Maximum number of tyres on vehicle reached. Do you want to add more tyre ?", {
													icon: MessageBox.Icon.INFORMATION,
													title: "Warning",
													actions: [MessageBox.Action.YES, MessageBox.Action.NO],
													onClose: function(oAction){
														if(oAction === sap.m.MessageBox.Action.YES){
															that.getVehicleData();
														}else{
															return false;
														}
													}
												}
											);
										});
									}else
										that.getVehicleData();
							},
//////////////////////////////////////////////////////////////////////////////////////////////////
				onDeleteServiceRow: function(oEvent){
							var path = oEvent.getSource().getParent().getParent().getItems().indexOf(oEvent.getSource().getParent());
							var serviceTable=this.getView().byId("tblDetail2"); 

								if (path !== -1) {
//Added on 18 Feb 2019									
								    	 sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
												MessageBox.show(
													"Do you want to remove tyre ?", {
														icon: MessageBox.Icon.INFORMATION,
														title: "Warning",
														actions: [MessageBox.Action.YES, MessageBox.Action.NO],
														onClose: function(oAction){
															if(oAction === sap.m.MessageBox.Action.YES){

																serviceTable.getModel("serviceSheetJModel").getData().RegnoToItemNvg.results.splice(path,1);
														    	serviceTable.getModel("serviceSheetJModel").refresh();

															}else{
																return false;
															}
														}
													}
												);
											});
								    	 //that.getView().byId("tblDetail2").getItems()[path].getCells()[1].setValue("");
								    	 //serviceTable.getModel("serviceSheetJModel").getData().RegnoToItemNvg.results.splice(path,1);
								    	 //serviceTable.getModel("serviceSheetJModel").refresh();
								     }
										     
/*							     	var table = that.getView().byId("tblDetail2");
									var cell = table.getItems()[path].getCells();
								
											if(cell[0].getEnabled() == false)
												  cell[0].setEnabled() == true;
											if(cell[1].getEnabled() == false)
												  cell[1].setEnabled() == true;
											if(cell[2].getEnabled() == false)
												  cell[2].setEnabled() == true;
											if(cell[3].getEnabled() == false)
												  cell[3].setEnabled() == true;
*/											
				},
//////////////////////////////////////////////////////////////////////////////////////////////////
				onPosChange: function(evt) {
								debugger
								    this.positionValue = evt.getSource();
								    var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4GetPositionsSet?$filter=ConfigCode eq '"+ConfigCode+"'";
								    var jModel = new sap.ui.model.json.JSONModel();
								    jModel.loadData(sPath, null, false, "GET", false, false, null);
								    var _valueHelpPositionDialog = new sap.m.SelectDialog({
									      title: "Position",
								      items: {
								        path: "/d/results",
								        template: new sap.m.StandardListItem({
								          title: "{IPosition}",
									          info :"{PosDesc}",
								          customData: [new sap.ui.core.CustomData({
								            key: "{IPosition}",
								            value: "{IPosition}"
								          })]
								        	})
									      },
								      liveChange: function(oEvent) {
								        var sValue = oEvent.getParameter("value");
								        var oFilter = new sap.ui.model.Filter("IPosition", sap.ui.model.FilterOperator.Contains, sValue);
								        oEvent.getSource().getBinding("items").filter([oFilter]);
								      },
								      confirm: [this._handlePositionClose, this],
								      cancel: [this._handlePositionClose, this]
								    });
								    _valueHelpPositionDialog.setModel(jModel);
								    _valueHelpPositionDialog.open();
								  },

				  _handlePositionClose: function(oEvent) {
							var posPath = this.positionValue.getParent().getParent().getItems().indexOf(this.positionValue.getParent());
							var table = this.getView().byId("tblDetail2");
							var len = table.getItems().length;
							var check = false;
						    var oSelectedItem = oEvent.getParameter("selectedItem");
						    if (oSelectedItem) {
//					      this.VehicleMake = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
								    	for(var i=0;i< len;i++){
								    		var item = table.getItems()[i].getCells()[0];
								    		if(item.getValue() == oSelectedItem.getTitle()){
								    			check = true;
								    		}
								    	}
								    	if(check){
								    		sap.m.MessageToast.show("Positions cannot be reused.");
								    	}else{
								    		this.positionValue.setValue(oSelectedItem.getTitle());
								    		table.getItems()[posPath].getCells()[1].setValue("");
								    		table.getItems()[posPath].getCells()[1].setEnabled(true);
								    		table.getItems()[posPath].getCells()[2].setValue("");
								    		table.getItems()[posPath].getCells()[2].setEnabled(false);
								    		table.getItems()[posPath].getCells()[3].setValue("");
								    		table.getItems()[posPath].getCells()[3].setEnabled(false);
								    		debugger
								    		this.getView().getModel("serviceSheetJModel").getData().RegnoToItemNvg.results[posPath].Zposition = oSelectedItem.getTitle();
								    		
								    	}
								    }
						  },
//////////////////////////////////////////////////////////////////////////////////////////////////
										  getVehicleData: function(){
												var that = this;
								
												var regNo = this.getView().byId("FVehicleNoEdit").getValue();
												var oViewObj = this.getView();
												var vehicleDataSetJModel = oViewObj.getModel("vehicleDataSetJModel");
												if (!vehicleDataSetJModel) {
													vehicleDataSetJModel = new sap.ui.model.json.JSONModel();
													oViewObj.setModel(vehicleDataSetJModel, "vehicleDataSetJModel");
												}
												var sPathServiceSheetSet = "/VehicleRegNoItemSet(RegNo='"+regNo+"',Zposition='')?$expand=VitemToServiceNvg/IservToSubservNvg";
												var frameworkODataModel = this.getOwnerComponent().getModel();
												var oParamsServiceSheetSet = {};
												oParamsServiceSheetSet.context = "";
//													oParamsSiteListSet.filters = filters;
												oParamsServiceSheetSet.urlParameters = "";
												oParamsServiceSheetSet.success = function(oData, oResponse) { // success handler
													
													vehicleDataSetJModel.setData(oData);
//													var vehicleDataSetJModel = that.getView().getModel("vehicleDataSetJModel");
												  	var serviceSheetJModel = that.getView().getModel("serviceSheetJModel");
												  	serviceSheetJModel.getData().RegnoToItemNvg.results.push(vehicleDataSetJModel.getData())
												  	serviceSheetJModel.refresh();

														
												};
												oParamsServiceSheetSet.error = function(oError) { // error handler 
													jQuery.sap.log.error("read publishing group data failed");
													sap.m.MessageToast.show.show(JSON.parse(oError.responseText).error.message.value);
												};
												frameworkODataModel.read(sPathServiceSheetSet, oParamsServiceSheetSet);
												frameworkODataModel.attachRequestCompleted(function() {
													
												});
										  },
										  
										  onCompanyChangeInput:function(evt){
											this.companydesc=evt.getSource();
											var vehRegNo = this.getView().byId("FVehicleNoEdit").getValue();
											var obj=evt.getSource().getParent().getBindingContext("serviceSheetJModel").getObject()
											var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4_NonJK_Tyre_CompanySet";
											var jModel = new sap.ui.model.json.JSONModel();
											jModel.loadData(sPath, null, false, "GET", false,false, null);
											var _valueHelpRotationSelectDialog = new sap.m.SelectDialog(
											{
												title : "Select Company",
												items : {
													path : "/d/results",
													template : new sap.m.StandardListItem(
														{
															title : "{Text}",
															description:"{NonJkCompany}"
														}),
												},
												liveChange : function(oEvent) {
													var sValue = oEvent.getParameter("value");
													var oFilter = new sap.ui.model.Filter("NonJkCompany",sap.ui.model.FilterOperator.Contains,sValue);
													var oFilter1 = new sap.ui.model.Filter("Text",sap.ui.model.FilterOperator.Contains,sValue);
													oEvent.getSource().getBinding("items").filter([ oFilter, oFilter1 ]);
												},
												confirm : [ this._handleRotationClose, this ],
												cancel : [ this._handleRotationClose, this ]
											});
											_valueHelpRotationSelectDialog.setModel(jModel);
											_valueHelpRotationSelectDialog.open();
										},
										_handleRotationClose : function(oEvent) {
											var path  =  this.companydesc.getParent().getParent().getItems().indexOf(this.companydesc.getParent());
											var oSelectedItem = oEvent.getParameter("selectedItem");
											var table = this.getView().byId("tblDetail2");
											if (oSelectedItem) {
												this.companydesc.setValue(oSelectedItem.getDescription());
												this.getView().getModel("serviceSheetJModel").getData().RegnoToItemNvg.results[path].NonJkCompany = oSelectedItem.getDescription();
												table.getItems()[path].getCells()[2].setValue("");
												table.getItems()[path].getCells()[2].setEnabled(true);
									    		table.getItems()[path].getCells()[3].setValue("");
									    		table.getItems()[path].getCells()[3].setEnabled(false);
											}

										},

										onItemCodeChange:function(evt){
											debugger
											this.itemCodeDesc=evt.getSource();
											var tyreSize = ProdSize;
											var vehRegNo = this.getView().byId("FVehicleNoEdit").getValue();
											var obj=evt.getSource().getParent().getBindingContext("serviceSheetJModel").getObject()
											
											var inx  = this.itemCodeDesc.getParent().getParent().getItems().indexOf(this.itemCodeDesc.getParent());
											var comp = this.getView().getModel("serviceSheetJModel").getData().RegnoToItemNvg.results[inx].NonJkCompany;
											
											
											var sPath = "/sap/opu/odata/sap/ZFLEET_SRV//F4MaterialDescriptionSet?$filter=ProdSize eq '"+tyreSize+"'+ and TyreCompany eq '"+comp+"'";
											var jModel = new sap.ui.model.json.JSONModel();
											jModel.loadData(sPath, null, false, "GET", false,false, null);
											var _valueHelpItemCodeSelectDialog = new sap.m.SelectDialog(
											{
												title : "Select Item Code Description",
												items : {
													path : "/d/results",
													template : new sap.m.StandardListItem(
															{
																title :"{Maktx}" ,
																description:"{Matnr}",
																customData : [ new sap.ui.core.CustomData(
																		{
																			key : "Key",
																			value : "{Maktx}"
																		}) ],
															}),
												},
												
												liveChange : function(oEvent) {
													var sValue = oEvent.getParameter("value");
													//var oFilter = new sap.ui.model.Filter("Matnr",sap.ui.model.FilterOperator.Contains,sValue);
													var oFilter1 = new sap.ui.model.Filter("Maktx",sap.ui.model.FilterOperator.Contains,sValue);
													//oEvent.getSource().getBinding("items").filter([ oFilter , oFilter1]);
													oEvent.getSource().getBinding("items").filter([oFilter1]);													
												},
												confirm : [ this._handleItemCodeClose, this ],
												cancel : [ this._handleItemCodeClose, this ]
											});
											_valueHelpItemCodeSelectDialog.setModel(jModel);
											_valueHelpItemCodeSelectDialog.open();
										},
										_handleItemCodeClose : function(oEvent) {
											debugger
											
											var path  =  this.itemCodeDesc.getParent().getParent().getItems().indexOf(this.itemCodeDesc.getParent());
											var table = this.getView().byId("tblDetail2");
											var oSelectedItem = oEvent.getParameter("selectedItem");
											if (oSelectedItem) {
												this.itemCodeDesc.setValue(oSelectedItem.getTitle());
												
												this.getView().getModel("serviceSheetJModel").getData().RegnoToItemNvg.results[path].ItemCode = oSelectedItem.getDescription();
												this.getView().getModel("serviceSheetJModel").getData().RegnoToItemNvg.results[path].ItemDesc = oSelectedItem.getTitle();
												table.getItems()[path].getCells()[3].setValue("");
									    		table.getItems()[path].getCells()[3].setEnabled(true);
											}
										},

										  bindServiceSheetSet: function(){
											var that = this;
											var oViewObj = this.getView();
											var serviceSheetSetJModel = oViewObj.getModel("serviceSheetSetJModel");
											if (!serviceSheetSetJModel) {
												serviceSheetSetJModel = new sap.ui.model.json.JSONModel();
												oViewObj.setModel(serviceSheetSetJModel, "serviceSheetSetJModel");
											}
//											serviceSheetSetJModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
											var sPathServiceSheetSet = "/ServiceSheetSet?$expand=ServiceToSubServiceNvg";
											var frameworkODataModel = this.getOwnerComponent().getModel();
											var oParamsServiceSheetSet = {};
											oParamsServiceSheetSet.context = "";
//												oParamsSiteListSet.filters = filters;
											oParamsServiceSheetSet.urlParameters = "";
											oParamsServiceSheetSet.success = function(oData, oResponse) { // success handler
												
												serviceSheetSetJModel.setData(oData.results);
												
											};
											oParamsServiceSheetSet.error = function(oError) { // error handler 
												jQuery.sap.log.error("read publishing group data failed");
												sap.m.MessageToast.show.show(JSON.parse(oError.responseText).error.message.value);
											};
											frameworkODataModel.read(sPathServiceSheetSet, oParamsServiceSheetSet);
											frameworkODataModel.attachRequestCompleted(function() {
												
											});
										  },										  
										  
										  onServiceSheetPress: function(oEvent){
												var check = true;	
												var that=this;
												
											  debugger
											  that.onItemServiceButton=oEvent.getSource();
											  var inx = that.onItemServiceButton.getParent().getParent().getItems().indexOf(that.onItemServiceButton.getParent())
											  var path = oEvent.getSource().getParent().getBindingContext("serviceSheetJModel").getPath().split('/')[1];
											  var table = that.getView().byId("tblDetail2");
											  var cell = table.getItems()[inx].getCells();
											  
											  var c0 = cell[0].getValue();
											  var c1 = cell[1].getValue();
											  var c2 = cell[2].getValue();
											  var c3 = cell[3].getValue();
//
											  if(cell[0].getEnabled() == false)
												  cell[0].setEnabled() == true;
											  if(cell[1].getEnabled() == false)
												  cell[1].setEnabled() == true;
											  if(cell[2].getEnabled() == false)
												  cell[2].setEnabled() == true;
											  if(cell[3].getEnabled() == false)
												  cell[3].setEnabled() == true;
//
											  if(c0 == "")
												  {cell[0].setValueState("Error");
												  check = false
												  }
												  else{ cell[0].setValueState("None");
													  }

											  if(c1 == "")
												  {cell[1].setValueState("Error");
												  check = false
												  }
												  else{
													  cell[1].setValueState("None");  
													  }
											  
											  if(c2 == "")
											  	{cell[2].setValueState("Error");
												  check = false
												  }
												  else{
													  cell[2].setValueState("None");  
													  }
											  
											   if(c3 == "")
											   		{cell[3].setValueState("Error");
												  check = false
												  }
												  else{
													  cell[3].setValueState("None");   
													  }
											   
											   if(cell[4].getType() !== "Accept")
										   		{	cell[4].setType("Reject");
													  check = false;
										   		}
											   
											  if(check == false)
												  {
												  sap.m.MessageToast.show("Position, Company, Item Code ,Stencil & Readings are Mandatory fields");
												  return false;
												  }
											  
											  cell[0].setEnabled(false);
											  cell[1].setEnabled(false);
											  cell[2].setEnabled(false);
											  cell[3].setEnabled(false);
											  
											  
											  var regno = this.getView().byId("FVehicleNoEdit").getValue();
											  var oViewObj = this.getView();
											  var serviceSheetSetJModel = oViewObj.getModel("serviceSheetSetJModel");
											  if (!that._NewServiceSheetDialog) {
													that._NewServiceSheetDialog = sap.ui.xmlfragment(
														"ztwcjobcreate.view.NewServiceSheet", that);
													that.getView().addDependent(that._NewServiceSheetDialog);													
												}
												
												sap.ui.getCore().byId("IdObjS11").setText(regno);
													
												sap.ui.getCore().byId("IdObjS3").setTitle("Position");
												sap.ui.getCore().byId("IdObjS3").setText(c0);	
												
												sap.ui.getCore().byId("IdObj5").setTitle("Stencil No");
												sap.ui.getCore().byId("IdObj5").setText(c3);
												sap.ui.getCore().byId("IdObj5").setVisible(true);

												
											  var serviceSheetJModel = that.getView().getModel("serviceSheetJModel");
											  path = oEvent.getSource().getParent().getParent().getItems().indexOf(oEvent.getSource().getParent());
											  var ShetModel = new sap.ui.model.json.JSONModel(serviceSheetJModel.getData().RegnoToItemNvg.results[path]);
												var tab=sap.ui.getCore().byId("idFitmentDetailsTable2");
												tab.setModel(ShetModel)
												
												var temp = new sap.m.ColumnListItem({
													cells : [													        
														 new sap.m.Text({text:"{ServiceDesc}"}),
														 new sap.m.Text({text:"{ServiceRate}",}),								
														 new sap.m.Input({value:"{ServicePRate}", width:"150px", maxLength:7 , enabled:false , 
															    liveChange:[that.RateValid,that]}),													       
													        
													         ],selected:"{path:'ServiceSelect',formatter:'ztwcjobcreate.util.Formatter.SelecFlg'}"
												});
												
												tab.bindAggregation("items" ,{ path : "/VitemToServiceNvg/results",template : temp});
												
//												**********added by Hans *****************
												var tab=sap.ui.getCore().byId("idFitmentDetailsTable2");
												tab._getSelectAllCheckbox().setVisible(false);
												var items=tab.getSelectedItems();
												var ECost = 0;
												var PCost = 0;
												for(var i=0;i<items.length;i++){
													ECost = parseInt(ECost) + parseInt(items[i].getCells()[1].getText());
													PCost = parseInt(PCost) + parseInt(items[i].getCells()[2].getValue());
												}
												var modeldata = that.getView().getModel("Fitments").getData();
												modeldata.EstimatedCost = parseInt(modeldata.EstimatedCost) - parseInt(ECost);
												modeldata.ProposedCost = parseInt(modeldata.ProposedCost) - parseInt(PCost);
												this.getView().getModel("Fitments").refresh();
												//********
												
//												code added to enable quantity fields for selected items
												var selItems = tab.getSelectedItems();
												var arr= [];
												for(var k = 0; k < selItems.length; k++){
													arr.push(tab.indexOfItem(selItems[k]));
												}
					
												for(var j= 0; j< arr.length;j++){
													tab.getItems()[arr[j]].getCells()[2].setEnabled(true);
												}
												
												that._NewServiceSheetDialog.open();
												that._NewServiceSheetDialog.setEscapeHandler(function(o){ 
													o.reject(); 
													//o.resolve();
													});
										  }, 
										  
										  onNewServiceSheetClose: function(){
											  this._NewServiceSheetDialog.close();
											  this._NewServiceSheetDialog.destroy();
											  this._NewServiceSheetDialog = undefined;
										  },
										  
										  onSaveServiceSheet: function(){

												var items=sap.ui.getCore().byId("idFitmentDetailsTable2").getSelectedItems();
												var len = items.length;
												var ECost = 0;
												var PCost = 0;
												debugger
												for(var i=0;i<len;i++){
													var rate = items[i].getCells()[2].getValue();
													ECost = parseInt(ECost) + parseInt(items[i].getCells()[1].getText());
													PCost = parseInt(PCost) + parseInt(items[i].getCells()[2].getValue());
														if (rate<1){
															sap.m.MessageBox.alert(
																	"Proposed cost cannot be null for selected services.", {
																		icon: sap.m.MessageBox.Icon.WARNING,
																		title: "Error"});
															return;
														}
														
														if (PCost > ECost){
															sap.m.MessageBox.alert(
																	"Proposed cost cannot be greater than MRP.", {
																		icon: sap.m.MessageBox.Icon.WARNING,
																		title: "WARNING"});
															return;
														}														
													}
												var tab=sap.ui.getCore().byId("idFitmentDetailsTable2");
												//tab.getModel().getData().LineECost = ECost;
												//tab.getModel().getData().LinePCost = PCost;
	
												debugger
												var modeldata = that.getView().getModel("Fitments").getData();
												modeldata.EstimatedCost = parseInt(modeldata.EstimatedCost) + parseInt(ECost);
												modeldata.ProposedCost = parseInt(modeldata.ProposedCost) + parseInt(PCost);
												this.getView().getModel("Fitments").refresh();
												
												if(len==0){
													that.onItemServiceButton.setType("Reject"); 
												}else{
													that.onItemServiceButton.setType("Accept"); 
												}
												that._NewServiceSheetDialog.close();
												that._NewServiceSheetDialog.destroy();
												that._NewServiceSheetDialog = undefined;
										  },
										  
											NSDValid: function(oEvent)
											{ 
												var val = oEvent.getSource().getValue();
												$(this).val($(this).val().replace(/[^0-9\.]/g,''));
									            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
									                event.preventDefault();
									            }
									        },
										  
									  
										  onReadingClose: function(){
											  debugger
											  this._ReadEntriesHelpDialog.close();
										  },
										  
										  onReadingSave:function(e){
											  debugger
											   var checkEmpty   = false;
												var checkNSD     = false;
												var org  = sap.ui.getCore().byId("idNSD").getValue();
												var g1  = sap.ui.getCore().byId("idNSD1").getValue();	
												var g2  = sap.ui.getCore().byId("idNSD2").getValue();
												var g3  = sap.ui.getCore().byId("idNSD3").getValue();
												var g4  = sap.ui.getCore().byId("idNSD4").getValue();
												var cond = sap.ui.getCore().byId("idCOND").getSelectedKey();
												var ip  = sap.ui.getCore().byId("idIP").getValue();
												var rem  = sap.ui.getCore().byId("idREM").getValue();
												
												if (cond== ""){
													checkEmpty=true;
													sap.ui.getCore().byId("idCOND").addStyleClass('myStateError');
												}else{
													sap.ui.getCore().byId("idCOND").removeStyleClass('myStateError');
												}
												
												if (parseInt(ip) < 0.1 || ip==""){   
													checkEmpty=true;
													sap.ui.getCore().byId("idIP").setValueState("Error");
												}else{
													sap.ui.getCore().byId("idIP").setValueState("None");
												}
												
												if (parseFloat(org) < 0.1 || org==""){
													checkEmpty=true;
													sap.ui.getCore().byId("idNSD").setValueState("Error");
												}else{
													sap.ui.getCore().byId("idNSD").setValueState("None");
												}
												
												if (parseFloat(g1) < 0.1 || g1==""){
													checkEmpty=true;
													sap.ui.getCore().byId("idNSD1").setValueState("Error");
												}else{
													sap.ui.getCore().byId("idNSD1").setValueState("None");
												}
												
												if (parseFloat(g2) < 0.1 || g2==""){
													checkEmpty=true;
													sap.ui.getCore().byId("idNSD2").setValueState("Error");
												}else{
													sap.ui.getCore().byId("idNSD2").setValueState("None");
												}
												
												if (parseFloat(g3) < 0.1 || g3 ==""){
													checkEmpty=true;
													sap.ui.getCore().byId("idNSD3").setValueState("Error");
												}else{
													sap.ui.getCore().byId("idNSD3").setValueState("None");
												}
												
												if (parseFloat(g4) < 0.1 || g4==""){
													g4="0.00";
												}
												
												if(rem == "" || rem == undefined){
													sap.ui.getCore().byId("idREM").setValueState("Error");
													checkEmpty=true;
												}else{
													sap.ui.getCore().byId("idREM").setValueState("None");
												}
												
													if(checkEmpty){
														sap.m.MessageToast.show("Please enter mandatory fields.");
														return false;
													}	
														
												if(parseFloat(g1) > parseFloat(org)){
													sap.ui.getCore().byId("idNSD1").setValueState("Error");
													checkNSD=true;
												}else{
													sap.ui.getCore().byId("idNSD1").setValueState("None");
												}
												
												if(parseFloat(g2) > parseFloat(org)){
													sap.ui.getCore().byId("idNSD2").setValueState("Error");
													checkNSD=true;
												}else{
													sap.ui.getCore().byId("idNSD2").setValueState("None");
												}
												
												if(parseFloat(g3) > parseFloat(org)){
													sap.ui.getCore().byId("idNSD3").setValueState("Error");
													checkNSD=true;
												}else{
													sap.ui.getCore().byId("idNSD3").setValueState("None");
												}
												
												if(parseFloat(g4) > parseFloat(org)){
													sap.ui.getCore().byId("idNSD4").setValueState("Error");
													checkNSD=true;
												}else{
													sap.ui.getCore().byId("idNSD4").setValueState("None");
												}
												
												if(checkNSD){
													sap.m.MessageToast.show("NSD value cannot exceed original NSD");
													return false;
												}											
												
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().G1Nsd=g1;
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().G2Nsd=g2;
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().G3Nsd=g3;
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().G4Nsd=g4;
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().IpCondition=cond;
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().IpPsi=ip;
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().OrigNsd=org;
												that.onItemServiceButton.getBindingContext("serviceSheetJModel").getObject().Remarks=rem;
												
											//new code add 16/11/19	
												if(ip < 90){
													var dialog 	= new sap.m.Dialog({
												        title : 'Warning',
												        type : 'Message',
												        content : [ new sap.m.Label({
												          text : 'Low inflation - Are you sure?'
												        }) ],
												        beginButton : new sap.m.Button({
												          text : 'Yes',
												          press : function() {
												        	  dialog.close();
												        		that._ReadEntriesHelpDialog.close();
																that.onItemServiceButton.setType("Accept"); 
												        	
												        
												          }
												        }),
												        endButton : new sap.m.Button({
												          text : 'No',
												          press : function() {
												        	  sap.ui.getCore().byId("idIP").setValue();
												        	  dialog.destroy();
												          }
												        }),
												        
													});
													dialog.open();
													return;
											} else if(ip> 180){
												
												var dialog = new sap.m.Dialog({
											        title : 'Warning',
											        type : 'Message',
											        content : [ new sap.m.Label({
											          text : 'Over inflation - Are you sure?'
											        }) ],
											        beginButton : new sap.m.Button({
											          text : 'Yes',
											          press : function() {
											        	  dialog.destroy();
											        		that._ReadEntriesHelpDialog.close();
															that.onItemServiceButton.setType("Accept"); 
											        	
											          }
											        }),
											        endButton : new sap.m.Button({
											          text : 'No',
											          press : function() {
											        	  sap.ui.getCore().byId("idIP").setValue();
											        	  dialog.destroy();
											          }
											        }),
											        
												});
												dialog.open();
												return;
										}else{
											this._ReadEntriesHelpDialog.close();
											that.onItemServiceButton.setType("Accept"); 
											}
											},
											
											onTabelEntriesClose:function(){
												this._EntriesHelpDialog.close();
												this._EntriesHelpDialog.destroy();
												this._EntriesHelpDialog=undefined; 
											},
											
											ReadPress:function(evt){
												  var that=this;
												  
												  debugger
												  that.onItemServiceButton=evt.getSource();
												  var inx = that.onItemServiceButton.getParent().getParent().getItems().indexOf(that.onItemServiceButton.getParent())
												  var path = evt.getSource().getParent().getBindingContext("serviceSheetJModel").getPath().split('/')[1];
												  var table = that.getView().byId("tblDetail2");
												  var cell = table.getItems()[inx].getCells();
												  
												  var c0 = cell[0].getValue();
												  var c1 = cell[1].getValue();
												  var c2 = cell[2].getValue();
												  var c3 = cell[3].getValue();
												
												var readingModel = new sap.ui.model.json.JSONModel();
												
												if(c0 == "" || c1 == "" || c2 == "" || c3 =="" ){													
													  if(c0 == "")
													  {cell[0].setValueState("Error");
													  check = false
													  }
													  else{ cell[0].setValueState("None");
														  }

												  if(c1 == "")
													  {cell[1].setValueState("Error");
													  check = false
													  }
													  else{
														  cell[1].setValueState("None");  
														  }
												  
												  if(c2 == "")
												  	{
													  cell[2].setValueState("Error");
													  check = false
													  }
													  else{
														  cell[2].setValueState("None");  
														  }
												  
												  if(c3 == "")
												   	{
													  cell[3].setValueState("Error");
													  check = false
													  }
													  else{
														  cell[3].setValueState("None");  
														  }
												  
												 
												  if(check == false)
													  {
													  sap.m.MessageToast.show("Position, Company, Item Code , Stencil are Mandatory fields");
													  return false;
													  }
												}
												
									/*			cell[0].setEnabled(false);
												cell[1].setEnabled(false);
												cell[2].setEnabled(false);
												cell[3].setEnabled(false);*/
												
												
												if (!this._ReadEntriesHelpDialog) {
													this._ReadEntriesHelpDialog = sap.ui.xmlfragment(
														"ztwcjobcreate.view.Reading", this);
													this.getView().addDependent(this._ReadEntriesHelpDialog);								
												}
												
												this._ReadEntriesHelpDialog.setTitle("Reading Details ("+c0+")");
												this._ReadEntriesHelpDialog.open();
												
												this._ReadEntriesHelpDialog.setEscapeHandler(function(o){ 
													o.reject(); 
													//o.resolve();
													});
												
												var g1 = sap.ui.getCore().byId("idNSD1");
												var g2 = sap.ui.getCore().byId("idNSD2");
												var g3 = sap.ui.getCore().byId("idNSD3");
												var g4 = sap.ui.getCore().byId("idNSD4");												
												var cond = sap.ui.getCore().byId("idCOND");
												var psi = sap.ui.getCore().byId("idIP");
												var orgNsd = sap.ui.getCore().byId("idNSD");
												var remarks = sap.ui.getCore().byId("idREM");
												
												if (g1.getValue()==""){
													g1.setValue("0.00");
												}
												
												if (g2.getValue()==""){
													g2.setValue("0.00");
												}
												
												if (g3.getValue()==""){
													g3.setValue("0.00");
												}
												
												if (g4.getValue()==""){
													g4.setValue("0.00");
												}
								/*				
												if(parseInt(readingModel.getData().G1) <= 0){
													g1.setValue("");
												}
												if(parseInt(readingModel.getData().G2) <= 0){
													g2.setValue("");
												}
												if(parseInt(readingModel.getData().G3) <= 0){
													g3.setValue("");
												}
												if(parseInt(readingModel.getData().G4) <= 0){
													g4.setValue("");
												}
*/
												
												var row = this.getView().getModel("serviceSheetJModel").getData()[path];
												var rowData = row.results[inx];
												
												if(rowData.OrigNsd == "0.00"){
													rowData.IpPsi = ""
													rowData.G1Nsd = ""
													rowData.G2Nsd = ""
													rowData.G3Nsd = ""
													rowData.G4Nsd = ""
													rowData.OrigNsd = ""
												}
												if(rowData.OrigNsd !== ""){
													var tdata = rowData;
													g1.setValue(tdata.G1Nsd);
													g2.setValue(tdata.G2Nsd);
													g3.setValue(tdata.G3Nsd);
													g4.setValue(tdata.G4Nsd);
													cond.setSelectedKey(tdata.IpCondition);
													psi.setValue(tdata.IpPsi);
													orgNsd.setValue(tdata.OrigNsd);
													remarks.setValue(tdata.Remarks);
												}else{
													g1.setValue(readingModel.getData().G1Nsd);
													g2.setValue(readingModel.getData().G2Nsd);
													g3.setValue(readingModel.getData().G3Nsd);
													g4.setValue(readingModel.getData().G4Nsd);
													cond.setSelectedKey("");
													psi.setValue("");
													orgNsd.setValue(readingModel.getData().OrigNsd);
													remarks.setValue("");
												}
												
												this._ReadEntriesHelpDialog.setModel(readingModel , "readingModel");												
												
											},										  
										  
										  OnTableSelectService:function(evt){
											debugger
											if(sap.ui.getCore().byId("IdObj5").getVisible()){
												if(evt.getParameter("listItem").getSelected()){
												var Matnr = evt.getParameter("listItem").getBindingContext().getObject().ServiceCode;
												evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
												
												if (!this._CutHelpDialog1) {
													this._CutHelpDialog1 = sap.ui.xmlfragment(
																			"ztwcjobcreate.view.Cut1", this);
													this.getView().addDependent(this._CutHelpDialog1);
												}
												
												that.evt = evt.getParameter("listItem").getBindingContext().getObject();
												that.evtItem = evt.getParameter("listItem");
												evt.getParameter("listItem").getCells()[2].setEnabled(true);
												
												if(Matnr=="S02"){
													sap.ui.getCore().byId("IdCutPannel").setVisible(true);
													
													sap.ui.getCore().byId("idTypeCut").setSelectedKey("");
													sap.ui.getCore().byId("idcutwid").setValue();
													sap.ui.getCore().byId("idcutsz").setValue();
													
													this._CutHelpDialog1.open();	
												}
												else if(Matnr=="S04"){
													sap.ui.getCore().byId("IdNitroPanl").setVisible(true);
//													sap.ui.getCore().byId("idNtPur").setSelectedKey(evt.getParameter("listItem").getBindingContext("serviceSheetSetJModel").getObject().IservToSubservNvg.results[0].Value);
													//sap.ui.getCore().byId("idNitTP").setSelectedKey(evt.getParameter("listItem").getBindingContext().getObject().IservToSubservNvg.results[1].Value);
													this._CutHelpDialog1.open();	
												}
												else if(Matnr=="S08"){
													sap.ui.getCore().byId("IdDeMount").setVisible(true);
													this._CutHelpDialog1.open();	
												}
												else if(Matnr=="S09"){
													sap.ui.getCore().byId("IdMount").setVisible(true);
													this._CutHelpDialog1.open();	
												}
												else if(Matnr=="S10"){
													sap.ui.getCore().byId("IdRotationpanl").setVisible(true);
													this._CutHelpDialog1.open();	
												}else if(Matnr=="S14"){
													sap.ui.getCore().byId("IdAlinmntpanl").setVisible(true);
										
													this._CutHelpDialog1.open();	
												}
												else if(Matnr=="S15"){
													sap.ui.getCore().byId("IdBlapanl").setVisible(true);
//													sap.ui.getCore().byId("IDweig").setValue(evt.getParameter("listItem").getBindingContext("serviceSheetSetJModel").getObject().IservToSubservNvg.results[0].Value);
													this._CutHelpDialog1.open();	
												}else if(Matnr=="S07"){
													sap.ui.getCore().byId("IdTMrem").setVisible(true);
													
													this._CutHelpDialog1.open();	
												}else if(Matnr=="S11"){
													sap.ui.getCore().byId("IdTFW").setVisible(true);													
													this._CutHelpDialog1.open();
												}
												}else{
													
													evt.getParameter("listItem").getCells()[2].setEnabled(false);
													var cost=evt.getParameter("listItem").getBindingContext().getObject().ServiceRate;
													evt.getParameter("listItem").getCells()[2].setValue(cost);
													evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";	
												}
												}else{
													if(evt.getParameter("listItem").getSelected()){
														var Matnr=evt.getParameter("listItem").getBindingContext().getObject().ServiceCode;
														evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="X";
														if (!this._CutHelpDialog1) {
															this._CutHelpDialog1 = sap.ui.xmlfragment(
																"ztwcjobcreate.view.Cut1", this);
															this.getView().addDependent(this._CutHelpDialog1);
															
														}
														that.evt=evt.getParameter("listItem").getBindingContext().getObject();
														that.evtItem=evt.getParameter("listItem");
														if(Matnr=="S02"){
															sap.ui.getCore().byId("IdCutPannel").setVisible(true);
														   
															sap.ui.getCore().byId("IdCutPannel").setVisible(true);
															sap.ui.getCore().byId("idTypeCut").setSelectedKey();
															sap.ui.getCore().byId("idcutwid").setValue();
															sap.ui.getCore().byId("idcutsz").setValue();
																	
															this._CutHelpDialog1.open();	
															
														}else if(Matnr=="S04"){
															sap.ui.getCore().byId("IdNitroPanl").setVisible(true);
															this._CutHelpDialog1.open();	
														}else if(Matnr=="S10"){
															sap.ui.getCore().byId("IdRotationpanl").setVisible(true);
															this._CutHelpDialog1.open();	
														}else if(Matnr=="S14"){
															sap.ui.getCore().byId("IdAlinmntpanl").setVisible(true);
												
															this._CutHelpDialog1.open();	
														}
														else if(Matnr=="S15"){
															sap.ui.getCore().byId("IdBlapanl").setVisible(true);
//															sap.ui.getCore().byId("IDweig").setValue(evt.getParameter("listItem").getBindingContext().getObject().VServToSubservNvg.results[0].Value);
															this._CutHelpDialog1.open();	
														}else if(Matnr=="S07"){
															sap.ui.getCore().byId("IdTMrem").setVisible(true);															
															this._CutHelpDialog1.open();	
														}else if(Matnr=="S11"){
															sap.ui.getCore().byId("IdTFW").setVisible(true);															
															this._CutHelpDialog1.open();
														}else if(Matnr=="S08"){
															sap.ui.getCore().byId("IdDeMount").setVisible(true);															
															this._CutHelpDialog1.open();
														}else if(Matnr=="S09"){
															sap.ui.getCore().byId("IdMount").setVisible(true);															
															this._CutHelpDialog1.open();
														}
														}else{
															
															evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";
															evt.getParameter("listItem").getCells()[2].setEnabled(false);
															var cost=evt.getParameter("listItem").getBindingContext().getObject().ServiceRate;
															evt.getParameter("listItem").getCells()[2].setValue(cost);
															evt.getParameter("listItem").getBindingContext().getObject().ServiceSelect="";	
														}	
												}
												
											},
											onCutClose1:function(){
												debugger
												that.evt.ServiceSelect=""
												that.evt.ServicePRate=that.evt.ServiceRate;
												that.evtItem.setSelected(false);	
												that.evtItem.getCells()[2].setEnabled(false);
												this._CutHelpDialog1.close();
												this._CutHelpDialog1.destroy();
												this._CutHelpDialog1=undefined;
											},
											
											
											onCutOk1:function(){
												debugger
											if(sap.ui.getCore().byId("IdObj5").getVisible()){
												if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
													var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
													var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
													var patSize=sap.ui.getCore().byId("idcutsz").getValue();
													if(typeofCut==""){
														sap.m.MessageToast.show("Select Type of Cut");
														return
													}
													if(WidthofCut==""){
														sap.m.MessageToast.show("Enter Width of Cut");
														return
													}
													if(patSize==""){
														sap.m.MessageToast.show("EnterPatch Size");
														return
													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
													that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
													that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
												}
												if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
													var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
													//var nittp=sap.ui.getCore().byId("idNitTP").getSelectedKey();
													if(nit==""){
														sap.m.MessageToast.show("Select Nitrogen Filling");
														return
													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
													//that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idNitTP").getSelectedKey()
												}
												if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
													var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
													var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
													if(nit==""){
														sap.m.MessageToast.show("Select Rotation on Axles");
														return
													}
													if(nittp==""){
														sap.m.MessageToast.show("Rotation on Wheel Rim");
														return
													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
													that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
												}
												if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
													var nit=sap.ui.getCore().byId("ID1").getValue();
													var nit1=sap.ui.getCore().byId("ID11").getValue();
													var nit2=sap.ui.getCore().byId("ID2").getValue();
													var nit3=sap.ui.getCore().byId("ID21").getValue();
													var nit4=sap.ui.getCore().byId("ID3").getValue();
													var nit5=sap.ui.getCore().byId("ID31").getValue();
													var nit6=sap.ui.getCore().byId("ID4").getValue();
//													
													if(nit=="" || !(Math.abs(nit) >= 0 )){
														sap.m.MessageToast.show("Enter Total Toe In (Before)");
														return
													}
													if(nit1=="" || !(Math.abs(nit1) >= 0 )){
														sap.m.MessageToast.show("Enter Total Toe In (After)");
														return
													}
													if(nit2=="" || !(Math.abs(nit2) >= 0 )){
														sap.m.MessageToast.show("Enter Thrust (Before)");
														return
													}
													if(nit3=="" || !(Math.abs(nit3) >= 0 )){
														sap.m.MessageToast.show("Enter Thrust (Before)");
														return
													}
													if(nit4=="" || !(Math.abs(nit4) >= 0 )){
														sap.m.MessageToast.show("Enter Scrub (Before)");
														return
													}
													if(nit5=="" || !(Math.abs(nit5) >= 0 )){
														sap.m.MessageToast.show("Enter Scrub (After)");
														return
													}
													if(nit6==""){
														sap.m.MessageToast.show("Enter Remarks");
														return
													}
//													
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
													that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
													that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
													that.evt.IservToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID21").getValue();
													that.evt.IservToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID3").getValue();
													that.evt.IservToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
													that.evt.IservToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
												}
												if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
													var nit=sap.ui.getCore().byId("IDweig").getValue();
													
													if(nit==""){
														sap.m.MessageToast.show("Enter Weight added");
														return
													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
													
													}
												
												if(sap.ui.getCore().byId("IdTMrem").getVisible()){
													var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//													var nittp=sap.ui.getCore().byId("idFttych").getSelectedKey();
//													var nittp1=sap.ui.getCore().byId("idRHT").getSelectedKey();
													
													if(nit==""){
														sap.m.MessageToast.show("Select Tyre Changer");
														return
													}
//													if(nittp==""){
//														sap.m.MessageToast.show("Select Fitment on Tyre Changer");
//														return
//													}
//													if(nittp1==""){
//														sap.m.MessageToast.show("Select Manual with Hand Tools");
//														return
//													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//													that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idFttych").getSelectedKey();
//													that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idRHT").getSelectedKey();
													
													}
												if(sap.ui.getCore().byId("IdTFW").getVisible()){
													var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();													
													if(nit==""){
														sap.m.MessageToast.show("Select Tyre Changer");
														return
													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();													
													}
												
												if(sap.ui.getCore().byId("IdMount").getVisible()){
													var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();													
													if(nit==""){
														sap.m.MessageToast.show("Select Tyre Changer");
														return
													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idMountSelect").getSelectedKey();													
													}
												
												if(sap.ui.getCore().byId("IdDeMount").getVisible()){
													var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();													
													if(nit==""){
														sap.m.MessageToast.show("Select Tyre Changer");
														return
													}
													that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();													
													}
												
												
												
												}else{
													if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
														var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
														var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
														var patSize=sap.ui.getCore().byId("idcutsz").getValue();
														if(typeofCut==""){
															sap.m.MessageToast.show("Select Type of Cut");
															return
														}
														if(WidthofCut==""){
															sap.m.MessageToast.show("Enter Width of Cut");
															return
														}
														if(patSize==""){
															sap.m.MessageToast.show("Enter Patch Size");
															return
														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
														that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
														that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
													}
													if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
														var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
//														var nittp=sap.ui.getCore().byId("idNitTP").getSelectedKey();
														if(nit==""){
															sap.m.MessageToast.show("Select Nitrogen Filling");
															return
														}
//														if(nittp==""){
//															sap.m.MessageToast.show("Select Nitrogen Top Up");
//															return
//														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
														//that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idNitTP").getSelectedKey()
													}
													if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
														var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
														var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
														if(nit==""){
															sap.m.MessageToast.show("Select Rotation on Axles");
															return
														}
														if(nittp==""){
															sap.m.MessageToast.show("Rotation on Wheel Rim");
															return
														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
														that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
													}
													if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
														var nit=sap.ui.getCore().byId("ID1").getValue();
														var nit1=sap.ui.getCore().byId("ID11").getValue();
														var nit2=sap.ui.getCore().byId("ID2").getValue();
														var nit3=sap.ui.getCore().byId("ID21").getValue();
														var nit4=sap.ui.getCore().byId("ID3").getValue();
														var nit5=sap.ui.getCore().byId("ID31").getValue();
														var nit6=sap.ui.getCore().byId("ID4").getValue();
														
														if(nit=="" || !(Math.abs(nit) >= 0 )){
															sap.m.MessageToast.show("Enter Total Toe In (Before)");
															return
														}
														if(nit1=="" || !(Math.abs(nit1) >= 0 )){
															sap.m.MessageToast.show("Enter Total Toe In (After)");
															return
														}
														if(nit2=="" || !(Math.abs(nit2) >= 0 )){
															sap.m.MessageToast.show("Enter Thrust (Before)");
															return
														}
														if(nit3=="" || !(Math.abs(nit3) >= 0 )){
															sap.m.MessageToast.show("Enter Thrust (Before)");
															return
														}
														if(nit4=="" || !(Math.abs(nit4) >= 0 )){
															sap.m.MessageToast.show("Enter Scrub (Before)");
															return
														}
														if(nit5=="" || !(Math.abs(nit5) >= 0 )){
															sap.m.MessageToast.show("Enter Scrub (After)");
															return
														}
														if(nit6=="" ){
															sap.m.MessageToast.show("Enter Remarks");
															return
														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("ID1").getValue();
														that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("ID11").getValue();
														that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("ID2").getValue();
														that.evt.VServToSubservNvg.results[4].Value=sap.ui.getCore().byId("ID21").getValue();
														that.evt.VServToSubservNvg.results[3].Value=sap.ui.getCore().byId("ID3").getValue();
														that.evt.VServToSubservNvg.results[5].Value=sap.ui.getCore().byId("ID31").getValue();
														that.evt.VServToSubservNvg.results[6].Value=sap.ui.getCore().byId("ID4").getValue();
													}
													if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
														var nit=sap.ui.getCore().byId("IDweig").getValue();
														
														if(nit==""){
															sap.m.MessageToast.show("Enter Weight added");
															return
														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
														
														}
													
													if(sap.ui.getCore().byId("IdTMrem").getVisible()){
														var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//														var nittp=sap.ui.getCore().byId("idFttych").getSelectedKey();
//														var nittp1=sap.ui.getCore().byId("idRHT").getSelectedKey();
														
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
//														if(nittp==""){
//															sap.m.MessageToast.show("Select Fitment on Tyre Changer");
//															return
//														}
//														if(nittp1==""){
//															sap.m.MessageToast.show("Select Manual with Hand Tools");
//															return
//														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//														that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idFttych").getSelectedKey();
//														that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("idRHT").getSelectedKey();
//														
														}
													if(sap.ui.getCore().byId("IdTFW").getVisible()){
														var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();														
														}
													
													if(sap.ui.getCore().byId("IdMount").getVisible()){
														var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idMountSelect").getSelectedKey();														
														}
													
													if(sap.ui.getCore().byId("IdDeMount").getVisible()){
														var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
														that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();														
														}	
													
												}
											this._CutHelpDialog1.close();
											this._CutHelpDialog1.destroy();
											this._CutHelpDialog1=undefined;
											
												},
											
											
											
											onCutOk:function(){
												
												if(sap.ui.getCore().byId("IdObj5").getVisible()){
													if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
														var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
														var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
														var patSize=sap.ui.getCore().byId("idcutsz").getValue();
														if(typeofCut==""){
															sap.m.MessageToast.show("Select Type of Cut");
															return
														}
														if(WidthofCut==""){
															sap.m.MessageToast.show("Enter Width of Cut");
															return
														}
														if(patSize==""){
															sap.m.MessageToast.show("EnterPatch Size");
															return
														}
//														that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
//														that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
//														that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("idTypeCut").getSelectedKey()},
																	{Value:sap.ui.getCore().byId("idcutwid").getValue()},
																	{Value:sap.ui.getCore().byId("idcutsz").getValue()}
																	]
														}
//														
													}
													if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
														var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
														//var nittp=sap.ui.getCore().byId("idNitTP").getSelectedKey();
														if(nit==""){
															sap.m.MessageToast.show("Select Nitrogen Filling");
															return
														}
//														
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("idNtPur").getSelectedKey()}
																	]
														}
													}
													if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
														var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
														var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
														if(nit==""){
															sap.m.MessageToast.show("Select Rotation on Axles");
															return
														}
														if(nittp==""){
															sap.m.MessageToast.show("Rotation on Wheel Rim");
															return
														}
//														that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
//														that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey()
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("idRTax").getSelectedKey()},
																	{Value:sap.ui.getCore().byId("idRTWR").getSelectedKey()},
																	]
														}
													}
													if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
														var nit=sap.ui.getCore().byId("ID1").getValue();
														var nit1=sap.ui.getCore().byId("ID11").getValue();
														var nit2=sap.ui.getCore().byId("ID2").getValue();
														var nit3=sap.ui.getCore().byId("ID21").getValue();
														var nit4=sap.ui.getCore().byId("ID3").getValue();
														var nit5=sap.ui.getCore().byId("ID31").getValue();
														var nit6=sap.ui.getCore().byId("ID4").getValue();
														
														if(nit=="" || !(Math.abs(nit) >= 0 )){
															sap.m.MessageToast.show("Enter Total Toe In (Before)");
															return
														}
														if(nit1=="" || !(Math.abs(nit1) >= 0 )){
															sap.m.MessageToast.show("Enter Total Toe In (After)");
															return
														}
														if(nit2=="" || !(Math.abs(nit2) >= 0 )){
															sap.m.MessageToast.show("Enter Thrust (Before)");
															return
														}
														if(nit3=="" || !(Math.abs(nit3) >= 0 )){
															sap.m.MessageToast.show("Enter Thrust (Before)");
															return
														}
														if(nit4=="" || !(Math.abs(nit4) >= 0 )){
															sap.m.MessageToast.show("Enter Scrub (Before)");
															return
														}
														if(nit5=="" || !(Math.abs(nit5) >= 0 )){
															sap.m.MessageToast.show("Enter Scrub (After)");
															return
														}
														if(nit6==""){
															sap.m.MessageToast.show("Enter Remarks");
															return
														}
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("ID1").getValue()},
																	{Value:sap.ui.getCore().byId("ID11").getValue()},
																	{Value:sap.ui.getCore().byId("ID2").getValue()},
																	{Value:sap.ui.getCore().byId("ID21").getValue()},
																	{Value:sap.ui.getCore().byId("ID3").getValue()},
																	{Value:sap.ui.getCore().byId("ID31").getValue()},
																	{Value:sap.ui.getCore().byId("ID4").getValue()},
																	]
														}
													}
													if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
														var nit=sap.ui.getCore().byId("IDweig").getValue();
														
														if(nit==""){
															sap.m.MessageToast.show("Enter Weight added");
															return
														}
//														that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("IDweig").getValue()},
																	]
														}
													}
													
													if(sap.ui.getCore().byId("IdTMrem").getVisible()){
														var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//														
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
//														that.evt.IservToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTyCh").getSelectedKey();
//														that.evt.IservToSubservNvg.results[1].Value=sap.ui.getCore().byId("idFttych").getSelectedKey();
//														that.evt.IservToSubservNvg.results[2].Value=sap.ui.getCore().byId("idRHT").getSelectedKey();
														
														}
													if(sap.ui.getCore().byId("IdTFW").getVisible()){
														var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
														
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("idRTyCh1").getSelectedKey()},
																	]
														}
														}
													
													if(sap.ui.getCore().byId("IdMount").getVisible()){
														var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
														
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("idMountSelect").getSelectedKey()},
																	]
														}
														}
													
													if(sap.ui.getCore().byId("IdDeMount").getVisible()){
														var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
														
														if(nit==""){
															sap.m.MessageToast.show("Select Tyre Changer");
															return
														}
														var results = [];
														var Value = {};
														that.evt["IservToSubservNvg"]={
																results: [
																	{Value:sap.ui.getCore().byId("idDeMountSelect").getSelectedKey()},
																	]
														}
														}	
													
													
													}else{
														if(sap.ui.getCore().byId("IdCutPannel").getVisible()){
															var typeofCut=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
															var WidthofCut=sap.ui.getCore().byId("idcutwid").getValue();
															var patSize=sap.ui.getCore().byId("idcutsz").getValue();
															if(typeofCut==""){
																sap.m.MessageToast.show("Select Type of Cut");
																return
															}
															if(WidthofCut==""){
																sap.m.MessageToast.show("Enter Width of Cut");
																return
															}
															if(patSize==""){
																sap.m.MessageToast.show("Enter Patch Size");
																return
															}
//															that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idTypeCut").getSelectedKey();
//															that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idcutwid").getValue();
//															that.evt.VServToSubservNvg.results[2].Value=sap.ui.getCore().byId("idcutsz").getValue();
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("idTypeCut").getSelectedKey()},
																		{Value:sap.ui.getCore().byId("idcutwid").getValue()},
																		{Value:sap.ui.getCore().byId("idcutsz").getValue()},
																		]
															}
														}
														if(sap.ui.getCore().byId("IdNitroPanl").getVisible()){
															var nit=sap.ui.getCore().byId("idNtPur").getSelectedKey();
//															var nittp=sap.ui.getCore().byId("idNitTP").getSelectedKey();
															if(nit==""){
																sap.m.MessageToast.show("Select Nitrogen Filling");
																return
															}
//															if(nittp==""){
//																sap.m.MessageToast.show("Select Nitrogen Top Up");
//																return
//															}
//															that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idNtPur").getSelectedKey();
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("idNtPur").getSelectedKey()},
																		{Value:sap.ui.getCore().byId("idcutwid").getValue()},
																		{Value:sap.ui.getCore().byId("idcutsz").getValue()},
																		]
															}
														}
														if(sap.ui.getCore().byId("IdRotationpanl").getVisible()){
															var nit=sap.ui.getCore().byId("idRTax").getSelectedKey();
															var nittp=sap.ui.getCore().byId("idRTax").getSelectedKey();
															if(nit==""){
																sap.m.MessageToast.show("Select Rotation on Axles");
																return
															}
															if(nittp==""){
																sap.m.MessageToast.show("Rotation on Wheel Rim");
																return
															}
//															that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("idRTax").getSelectedKey();
//															that.evt.VServToSubservNvg.results[1].Value=sap.ui.getCore().byId("idRTWR").getSelectedKey();
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("idRTax").getSelectedKey()},
																		{Value:sap.ui.getCore().byId("idRTWR").getSelectedKey()}
																		]
															}
														}
														if(sap.ui.getCore().byId("IdAlinmntpanl").getVisible()){
															var nit=sap.ui.getCore().byId("ID1").getValue();
															var nit1=sap.ui.getCore().byId("ID11").getValue();
															var nit2=sap.ui.getCore().byId("ID2").getValue();
															var nit3=sap.ui.getCore().byId("ID21").getValue();
															var nit4=sap.ui.getCore().byId("ID3").getValue();
															var nit5=sap.ui.getCore().byId("ID31").getValue();
															var nit6=sap.ui.getCore().byId("ID4").getValue();
															
															if(nit=="" || !(Math.abs(nit) >= 0 )){
																sap.m.MessageToast.show("Enter Total Toe In (Before)");
																return
															}
															if(nit1=="" || !(Math.abs(nit1) >= 0 )){
																sap.m.MessageToast.show("Enter Total Toe In (After)");
																return
															}
															if(nit2=="" || !(Math.abs(nit2) >= 0 )){
																sap.m.MessageToast.show("Enter Thrust (Before)");
																return
															}
															if(nit3=="" || !(Math.abs(nit3) >= 0 )){
																sap.m.MessageToast.show("Enter Thrust (Before)");
																return
															}
															if(nit4=="" || !(Math.abs(nit4) >= 0 )){
																sap.m.MessageToast.show("Enter Scrub (Before)");
																return
															}
															if(nit5=="" || !(Math.abs(nit5) >= 0 )){
																sap.m.MessageToast.show("Enter Scrub (After)");
																return
															}
															if(nit6==""){
																sap.m.MessageToast.show("Enter Remarks");
																return
															}
															
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("ID1").getValue()},
																		{Value:sap.ui.getCore().byId("ID11").getValue()},
																		{Value:sap.ui.getCore().byId("ID2").getValue()},
																		{Value:sap.ui.getCore().byId("ID21").getValue()},
																		{Value:sap.ui.getCore().byId("ID3").getValue()},
																		{Value:sap.ui.getCore().byId("ID31").getValue()},
																		{Value:sap.ui.getCore().byId("ID4").getValue()},
																		]
															}
														}
														if(sap.ui.getCore().byId("IdBlapanl").getVisible()){
															var nit=sap.ui.getCore().byId("IDweig").getValue();
															
															if(nit==""){
																sap.m.MessageToast.show("Enter Weight added");
																return
															}
//															that.evt.VServToSubservNvg.results[0].Value=sap.ui.getCore().byId("IDweig").getValue();
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("IDweig").getValue()},
																		]
															}
															}
														
														if(sap.ui.getCore().byId("IdTMrem").getVisible()){
															var nit=sap.ui.getCore().byId("idRTyCh").getSelectedKey();

															if(nit==""){
																sap.m.MessageToast.show("Select Tyre Changer");
																return
															}
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("idRTyCh").getSelectedKey()},
																		]
															}
															}
														if(sap.ui.getCore().byId("IdTFW").getVisible()){
															var nit=sap.ui.getCore().byId("idRTyCh1").getSelectedKey();
															
															if(nit==""){
																sap.m.MessageToast.show("Select Tyre Changer");
																return
															}
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("idRTyCh1").getSelectedKey()},
																		]
															}
															}
														
														if(sap.ui.getCore().byId("IdMount").getVisible()){
															var nit=sap.ui.getCore().byId("idMountSelect").getSelectedKey();
															
															if(nit==""){
																sap.m.MessageToast.show("Select Tyre Changer");
																return
															}
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("idMountSelect").getSelectedKey()},
																		]
															}
															}
														
														if(sap.ui.getCore().byId("IdDeMount").getVisible()){
															var nit=sap.ui.getCore().byId("idDeMountSelect").getSelectedKey();
															
															if(nit==""){
																sap.m.MessageToast.show("Select Tyre Changer");
																return
															}
															var results = [];
															var Value = {};
															that.evt["IservToSubservNvg"]={
																	results: [
																		{Value:sap.ui.getCore().byId("idDeMountSelect").getSelectedKey()},
																		]
															}
															}	
														
														
													}
													this._CutHelpDialog1.close();
													this._CutHelpDialog1.destroy();
													this._CutHelpDialog1=undefined;
												},
												
//////////////////////////////////////////////////////////////change sumit ///////////////////////////////////////////////////////////
	onStencilLiveChange:function(oEvent){
		debugger
		var val = oEvent.getParameter("value");
  		val = val.replace(/ +/g, "");
  		if(val.length > 0){
  			oEvent.getSource().setValue(val.toUpperCase());
  		}	
	},
	
	 NsdValid : function(oEvent)
     {
       var val = oEvent.getSource().getValue();
       if(val){
         if(isNaN(val) || val.charCodeAt(val.length-1)==32){
           val = val.substring(0, val.length - 1);
           oEvent.getSource().setValue(val);
         }
       }
       if(parseInt(val) > 99){
				oEvent.getSource().setValue("");
				sap.m.MessageBox.alert(
						"NSD value cannot be greater than 100", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
			}  
			if(val[val.length-3]==".")
           {
         	  val = val.substring(0,val.length - 1);
         	  oEvent.getSource().setValue(val);
           }
     },
												
												
												
												
												

				});
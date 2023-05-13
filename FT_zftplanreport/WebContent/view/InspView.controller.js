sap.ui.define([ "sap/ui/model/json/JSONModel",
				"sap/m/UploadCollectionParameter" 
			],
function( JSONModel,UploadCollectionParameter) {


jQuery.sap.require("sap.ui.core.mvc.Controller");
// jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("zftplanreport.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

var DataArticles, that, kunnr, hubName, EnrolMode, hubCode, RegNo, gModel, FitNo, 
	PlnNo, TyrePositionJModel, InspNo, PlanGuid, RevNo, ItemNumber, TyrePos, 
	WearClass, NsdClass, ConfigCode, milo, lmilo, km, FitmentDate, LastInspDt, inspdt,Gv_plnno;

var color, img = [];

sap.ui.core.mvc.Controller.extend("zftplanreport.view.InspView",{

	onInit: function(){
			that=this;
			debugger
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("InspView").attachMatched(this._onRoute, this);
			
			this.payload = {};
			this.laChild = [];
			this.bindGetTestRequest();
			debugger
			//this.bindWearTypeSet(); //now set in fragment-3-06-2019
			//this.bindGravityTypeSet(); //now set in fragment-3-06-2019
			//this.bindPwaTypeSet(); //now set in fragment-3-06-2019
			jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zftplanreport.css.style",".css"));

		 // start of document upload
			var attachmentModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(attachmentModel,"attachmentModel");
			attachmentModel.setData([]);
			
			var oUploadModel = new sap.ui.model.json.JSONModel({
				items : []
			});
			
			this.getView().setModel(oUploadModel,"oUploadModel");
			
			var attachmentModel2 = new sap.ui.model.json.JSONModel();
			this.getView().setModel(attachmentModel2,"attachmentModel2");
			attachmentModel2.setData([]);
			
			var oUploadModel2 = new sap.ui.model.json.JSONModel({
				items : []
			});
			
			this.getView().setModel(oUploadModel2,"oUploadModel2");
			// end of document upload	
			
	},
//////////////////////////////////////////////////////////////////////////////////////////////////
_onRoute : function(e){
	debugger
	var tempjsonString = e.getParameter("arguments").entity;
	var jsonstring = tempjsonString.replace(/@/g, "/");
	var tempSelectedData = JSON.parse(jsonstring);
	this.SelectedData  = JSON.parse(tempSelectedData);
	var inspDetails = this.SelectedData;
	this.onPressItemFitment(inspDetails);
},
//////////////////////////////////////////////////////////////////////////////////////////////////	
	onAfterRendering: function(){
		debugger
		var newGroove = [	
			this.getView().byId("idG1"),
			this.getView().byId("idG2"),
			this.getView().byId("idG3"),
			this.getView().byId("idG4"),
			this.getView().byId("idG5"),
			this.getView().byId("idG6"),
		];
		jQuery.each(newGroove, function(i, input) {	
			if(input.getVisible() == true ){
				
			}
	});

	},
//////////////////////////////////////////////////////////////////////////////////////////////////
ChangeInspDate : function(evt){
	/*debugger  
	var date=evt.getSource().getDateValue();
	var today=new Date();
	today.setHours(00,00,00);
	
	evt.getSource().setValueState("None");
	
	if(date!=null){
		if(date.getTime()>today.getTime()){
			sap.m.MessageToast.show("Inspection Date can't be Future Date");
			evt.getSource().setDateValue(null);
			evt.getSource().setValueState("Error");
			return false;
		}
		
		if(date <= LastInspDt && LastInspDt !=null ){
			sap.m.MessageToast.show("Inspection Date can't be less than Last Inpection Date");
			evt.getSource().setDateValue(null);	
			evt.getSource().setValueState("Error");
			return false;
		}
		
		if(date <= FitmentDate){
			sap.m.MessageToast.show("Inspection Date can't be less than Fitment Date");
			evt.getSource().setDateValue(null);		
			evt.getSource().setValueState("Error");
			return false;
		}
	}
	*/
},
	
//////////////////////////////////////////////////////////////////////////////////////////////////		
		handleIconTabBarSelect: function(e){
	/*		var _self = this;
			var t = e.getSource().getSelectedKey();
			this.getView().byId("Id_bt2").setVisible(true);
			this.getView().byId("Id_bt1").setVisible(true);
			this.selectedKey = this.getView().byId("id_IconTabBar_ctp_WL").getSelectedKey();
	*/
		},

//////////////////////////////////////////////////////////////////////////////////////////////////		
		NumberValidPSI: function(oEvent){
            var text = oEvent.getSource().getValue();
            var code = text.charCodeAt(text.length-1);  
            	if ( !(code > 47 && code < 58)){
            		text = text.substring( 0 , text.length - 1 );
            	}
            	oEvent.getSource().setValue(text);       
            },
		
//////////////////////////////////////////////////////////////////////////////////////////////////
/*		onKMSuspend: function(e){
			debugger
		
            var val = e.getSource().getValue();
            var code = val.charCodeAt(val.length-1);  
            	if ( !(code > 47 && code < 58)){
            		val = val.substring( 0 , val.length - 1 );
            	}
            e.getSource().setValue(val);
			
			var cov   = this.getView().byId("idKmCovered").getValue();
			var sus   = this.getView().byId("idKmSus").getValue();
			var tot   = this.getView().byId("idTotKmCov").getValue();
				
			cov = cov - sus;
			this.getView().byId("idKmCov").setValue(cov);
			
			tot = parseInt(tot) - sus;
			this.getView().byId("idTotKmCov1").setValue(tot);
			
			var minNsd  = this.getView().byId("minNsd").getValue();
			var OrigNsd = this.getView().byId("idOriNsd").getValue();
			var totkm   = this.getView().byId("idTotKmCov1").getValue();
			var diffnsd = parseFloat(OrigNsd) - parseFloat(minNsd);
			var Wear;
			var milage;
			var kmmm;
			
			if(WearClass=="A"){
				
			 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 0.8)) * 100;	
			 if (parseFloat(minNsd) <= 0.8){
			    milage = totkm;
			 }
			   else{
				 milage =  ( totkm * ( parseFloat(OrigNsd) - 0.8) ) / diffnsd;
			 }	
			 
			}else if (WearClass=="B"){
				
				Wear = ( diffnsd / parseFloat(OrigNsd)) * 100;	
				
				 if (parseFloat(minNsd) <= 0){
				    milage = totkm;
				 }
				   else{
					 milage =  ( totkm * ( parseFloat(OrigNsd) - 0) ) / diffnsd;
				 }
				 
			}else{
				
				 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 1.6)) * 100;	
				 if (parseFloat(minNsd) <= 1.6){
				    milage = totkm;
				 }
				   else{
					 milage =  ( totkm * ( parseFloat(OrigNsd) - 1.6) ) / diffnsd;
				 }				
			}
			
			kmmm = totkm / diffnsd;
			
			Wear = parseFloat(Wear);
			milage = parseFloat(milage);
			kmmm = parseFloat(kmmm);
			
			Wear = Wear.toFixed(2);
			milage = milage.toFixed(0);
			kmmm = kmmm.toFixed(0);
			
			this.getView().byId("idTWear").setValue(Wear);
			this.getView().byId("idPrjMil").setValue(milage);
			this.getView().byId("idKmWear").setValue(kmmm);
			
//Added on May 20	
			var covered   = this.getView().byId("idKmCov").getValue();
			var suspend   = this.getView().byId("idKmSus").getValue();
			
			if(parseFloat(suspend) > parseFloat(covered)){
				sap.m.MessageToast.show("'Km Suspended' cannot be greater than 'Km Covered'");
				this.getView().byId("idKmSus").setValue();
			}
//			
		},*/
//////////////////////////////////////////////////////////////////////////////////////////////////		
/*		onKMSuspendO: function(e){
			debugger
		
            var val = e.getSource().getValue();
            var code = val.charCodeAt(val.length-1);  
            	if ( !(code > 47 && code < 58)){
            		val = val.substring( 0 , val.length - 1 );
            	}
            e.getSource().setValue(val);
			
			var cov   = this.getView().byId("idKmCovered").getValue();
			var sus   = this.getView().byId("idKmSusO").getValue();
			var tot   = this.getView().byId("idTotKmCovO").getValue();
							
			tot = parseInt(tot) - sus;
			this.getView().byId("OidTotKmCov1").setValue(tot);
			
			var minNsd  = this.getView().byId("minNsdO").getValue();
			var OrigNsd = this.getView().byId("idOriNsd").getValue();
			var totkm   = this.getView().byId("OidTotKmCov1").getValue();
			var diffnsd = parseFloat(OrigNsd) - parseFloat(minNsd);
			var Wear;
			var milage;
			var kmmm;
			
			if(WearClass=="A"){
				
			 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 0.8)) * 100;	
			 if (parseFloat(minNsd) <= 0.8){
			    milage = totkm;
			 }
			   else{
				 milage =  ( totkm * ( parseFloat(OrigNsd) - 0.8) ) / diffnsd;
			 }	
			 
			}else if (WearClass=="B"){
				
				Wear = ( diffnsd / parseFloat(OrigNsd)) * 100;	
				
				 if (parseFloat(minNsd) <= 0){
				    milage = totkm;
				 }
				   else{
					 milage =  ( totkm * ( parseFloat(OrigNsd) - 0) ) / diffnsd;
				 }
				 
			}else{
				
				 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 1.6)) * 100;	
				 if (parseFloat(minNsd) <= 1.6){
				    milage = totkm;
				 }
				   else{
					 milage =  ( totkm * ( parseFloat(OrigNsd) - 1.6) ) / diffnsd;
				 }				
			}
			
			kmmm = totkm / diffnsd;
			
			Wear = parseFloat(Wear);
			milage = parseFloat(milage);
			kmmm = parseFloat(kmmm);
			
			Wear = Wear.toFixed(2);
			milage = milage.toFixed(0);
			kmmm = kmmm.toFixed(0);
			
			this.getView().byId("idTWearO").setValue(Wear);
			this.getView().byId("idPrjMilO").setValue(milage);
			this.getView().byId("idKmWearO").setValue(kmmm);

//Added on May 20
				var covO   = this.getView().byId("idKmCovO").getValue();
				var susO   = this.getView().byId("idKmSusO").getValue();
						
				if(parseFloat(susO) > parseFloat(covO)){
					sap.m.MessageToast.show("'Km Suspended' cannot be greater than 'Km Covered'");
					this.getView().byId("idKmSusO").setValue();
				}
//						
		},*/
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onHardnessChange: function(oEvent){
			 var text = oEvent.getSource().getValue();
             var code = text.charCodeAt(text.length-1); 
             	if ( !(code > 47 && code < 58)){
             		text = text.substring( 0 , text.length - 1 );
             	}
             	oEvent.getSource().setValue(text);   
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		bindGetTestRequest: function(){
			var oView = this.getView();
			var GetTestRequestSetJModel = oView.getModel("GetTestRequestSetJModel");
			if (!GetTestRequestSetJModel) {
				GetTestRequestSetJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(GetTestRequestSetJModel, "GetTestRequestSetJModel");
			}

			var sPathGetRequestSet = "/GetTestPlanForFitmentSet?$filter=Flag eq 'I' and Uname eq '"+sap.ushell.Container.getService("UserInfo").getId()+"'";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsGetRequestSet = {};
			oParamsGetRequestSet.context = "";
			oParamsGetRequestSet.urlParameters = "";
			oParamsGetRequestSet.success = function(oData, oResponse) { // success handler
				
				GetTestRequestSetJModel.setData(oData.results);
				
			};
			oParamsGetRequestSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);
			frameworkODataModel.read(sPathGetRequestSet, oParamsGetRequestSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});

		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onChangeRequestNo: function(oEvent){
			var planGuid = oEvent.getParameter(
					"selectedItem").getBindingContext("GetTestRequestSetJModel").getObject().PlanGuid;
			var PlanRev = oEvent.getParameter(
					"selectedItem").getBindingContext("GetTestRequestSetJModel").getObject().PlanRev;
			var TestPlanNumber = oEvent.getParameter(
					"selectedItem").getBindingContext("GetTestRequestSetJModel").getObject().TestPlanNumber;
			var oView = this.getView();
			var getAllDataJModel = oView.getModel("getAllDataJModel");
			if (!getAllDataJModel) {
				getAllDataJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(getAllDataJModel, "getAllDataJModel");
			}
			var sPathgetAllDataSet = "TestPlanDataInspectionSet(PlanGuid='" + planGuid + "',PlanRev='" + PlanRev + "',Uname='" + sap.ushell.Container.getService("UserInfo").getId() + "')?$expand=PlanToInspectionHeadNvg";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsGetAllDataSet = {};
			oParamsGetAllDataSet.context = "";
			oParamsGetAllDataSet.urlParameters = "";
			
			oParamsGetAllDataSet.success = function(oData, oResponse) { // success handler
				debugger
				sap.ui.core.BusyIndicator.hide(); 
				getAllDataJModel.setData(oData);
				that.getView().setModel(getAllDataJModel);	
				that.TestPlanNumber = oData.TestPlanNumber;
				that.getView().byId("idReqDtText").setText(oData.PlanDate);

			};
			oParamsGetAllDataSet.error = function(oError) { // error handler 
				sap.ui.core.BusyIndicator.hide();
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);
			sap.ui.core.BusyIndicator.show();
			frameworkODataModel.read(sPathgetAllDataSet, oParamsGetAllDataSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////	
	onPressItemFitment: function(inspDetails){ 
			debugger
				var _self = this;
			    Gv_plnno = inspDetails.TestPlanNumber;
			
				FitNo      = inspDetails.FitmentNo;
				InspNo     = inspDetails.InspNo;
				PlanGuid   = inspDetails.PlanGuid;
				RevNo      = inspDetails.PlanRevno;
				ItemNumber = inspDetails.PlanItemNo;
				RegNo	   = inspDetails.RegNo;
				planNo 	   = inspDetails.TestPlanNumber;
				
				var oView = this.getView().byId("idFitmentTabFilter");
				var oView1 = this.getView().byId("hiddenReadings");
				
				_self.getInspDataJModel = oView.getModel("getInspDataJModel");
				if (!_self.getInspDataJModel) {
					_self.getInspDataJModel = new sap.ui.model.json.JSONModel();
					oView.setModel(_self.getInspDataJModel, "getInspDataJModel");
				}
				var sPathgetAllDataSet = "/FitmentHeaderSet(PlanGuid='" + PlanGuid +"',PlanRevno='" + RevNo + "',PlanItemNo='" + ItemNumber + "',RegNo='"+RegNo+"',Cart='',LInspNo='',FitmentNo='" + FitNo + "',InspNo='" + InspNo + "')?$expand=NavtoFitmentDetail";
				var frameworkODataModel = this.getOwnerComponent().getModel();
				var oParamsGetAllDataSet = {};
				oParamsGetAllDataSet.context = "";
				oParamsGetAllDataSet.urlParameters = "";
				
				oParamsGetAllDataSet.success = function(oData, oResponse) { 					// success handler
					debugger
// Added on May 6
					img = oData.NavtoFitmentDetail.results;
//
					sap.ui.core.BusyIndicator.hide(); 
					_self.getInspDataJModel.setData(oData);
					oView.setModel(_self.getInspDataJModel);
					oView1.setModel(_self.getInspDataJModel);
					_self.getView().byId("TRHeaderFormEdit").bindElement("/");
					_self.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
					_self.getView().byId("VD_1").setText("Plan #: " + planNo);
					_self.getView().byId("VD_2").setText("Vehicle #: " + RegNo);
					
					RegNo = _self.RegNo;
					
					//set Date format by Ram
					var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	                     pattern : "dd-MM-yyyy"
					});
					_self.getView().byId("VD_3").setText("Fitment Date: " + oDateFormat.format(oData.FitmentDt));
					
					FitmentDate = oData.FitmentDt;
					LastInspDt     = oData.LInspDt;
					ConfigCode = _self.ConfigCode;
					
					PlnNo = that.TestPlanNumber;
					if(oData.LMeterStatus == 'Y'){
						_self.getView().byId("LMiloStatus").setState(true);
					    _self.getView().byId("LblLMilo").setVisible(true);
					    _self.getView().byId("LMiloRead").setVisible(true);					    
					}
					else{
						_self.getView().byId("LMiloStatus").setState(false);
						_self.getView().byId("LblLMilo").setVisible(false);
					    _self.getView().byId("LMiloRead").setVisible(false);
					}
					
					//_self.getView().byId("MiloStatus").setState(true);
					_self.onMiloMeter();
					
/* */			
					_self.getAttachmentDetails(oData.PlanGuid,oData.FitmentNo,
												oData.PlanRevno,oData.PlanItemNo,oData.RegNo);		// document upload
/* */
				
					_self.getView().byId("idMiloReading").setValue(oData.MeterReading);
					_self.getView().byId("idKmCovered").setValue(oData.KmCovered);
				};
				
				oParamsGetAllDataSet.error = function(oError) { // error handler 
					sap.ui.core.BusyIndicator.hide();
					jQuery.sap.log.error("read publishing group data failed");
				}.bind(this);
				sap.ui.core.BusyIndicator.show();
				frameworkODataModel.read(sPathgetAllDataSet, oParamsGetAllDataSet);
				frameworkODataModel.attachRequestCompleted(function() {} );
				
			},
//////////////////////////////////////////////////////////////////////////////////////////////////			
Oncancel : function(){
	debugger;
	this._EntriesHelpDialog.close();
	this._EntriesHelpDialog.destroy(true);
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	
showReading : function(evt){
	debugger
	var ReadingJModel = new sap.ui.model.json.JSONModel();
	var WearTypeJModel = new sap.ui.model.json.JSONModel();
	var GravityJModel = new sap.ui.model.json.JSONModel();
	var PwaJModel = new sap.ui.model.json.JSONModel();
	this._EntriesHelpDialog = sap.ui.xmlfragment("zftplanreport.view.ReadingFragment",this);
	this.getView().addDependent(this._entriesHelpDialog);
	this._EntriesHelpDialog.setModel(ReadingJModel, "ReadingJModel");
	this._EntriesHelpDialog.setModel(WearTypeJModel, "WearTypeJModel");
	this._EntriesHelpDialog.setModel(GravityJModel, "GravityJModel");
	this._EntriesHelpDialog.setModel(PwaJModel, "PwaJModel");
	this._EntriesHelpDialog.open(); 
	
	this.path = evt.getSource().getParent().getBindingContextPath();
	var reading = this.getView().byId("formReading");
	reading.bindElement(this.path);
	var table= this.getView().byId("idInspectionTable")
	this.selIndex = table.getItems().indexOf(evt.getSource().getParent());
	var rowDataReading = reading.getObjectBinding().getModel().getData().NavtoFitmentDetail.results[this.selIndex];
	    ReadingJModel.setData(rowDataReading); //add 1-06-2019 
	    
	    sap.ui.getCore().byId("RD_01").setText("Plan #: " + Gv_plnno); 
		sap.ui.getCore().byId("RD_02").setText("Stencil #: " + rowDataReading.StnclNumber);
		sap.ui.getCore().byId("RD_03").setText("Tyre Pos. #: " + rowDataReading.TyrePosition);
	    
	    
	    this.bindWearTypeSet();
	    this.bindGravityTypeSet();
	    this.bindPwaTypeSet();
},
//////////////////////////////////////////////////////////////////////////////////////////////////				
		onTabelEntrieOk:function(){
			debugger
			var checkEmpty   = false;
			var checkValue   = false;
			
			var inputs = [
				this.getView().byId("idG1"),
				this.getView().byId("idG2"),
				this.getView().byId("idG3"),
				this.getView().byId("idG4"),
				this.getView().byId("idG5"),
				this.getView().byId("idG6"),
				this.getView().byId("ip"),
				this.getView().byId("hardness")
		    ];
			
			jQuery.each(inputs, function(i, input) {
					if( (input.getValue() == "" || parseInt( input.getValue()) == "0") && input.getVisible() ){
						input.setValueState("Error");
						sap.m.MessageToast.show("Please enter the required values.");
						checkEmpty = true;
					}else{
						input.setValueState("None");
					}				
			});	
			
			var select = [
				this.getView().byId("idEarSpedC"),
				this.getView().byId("idWearTy"),
				this.getView().byId("idGrav"),
				this.getView().byId("idPwa")
				];
		
			jQuery.each(select, function(i, input) {
					if( input.getSelectedKey() == "" ){
						input.setValueState("Error");
						sap.m.MessageToast.show("Please enter the required values.");
						checkEmpty = true;
					}else{
						input.setValueState("None");
					}
			});
			
//Added on May 8			
			var Oinputs = [
				this.getView().byId("oG1"),
				this.getView().byId("oG2"),
				this.getView().byId("oG3"),
				this.getView().byId("oG4"),
				this.getView().byId("oG5"),
				this.getView().byId("oG6"),
		    ];
			
			for( var i = 0 ; i < 6 ; i++ ){
				if( ( inputs[i].getValue() <= Oinputs[i].getValue() ) ){
						inputs[i].setValueState("None");
						Oinputs[i].setValueState("None");					
				}else{
						inputs[i].setValueState("Error");
						Oinputs[i].setValueState("Error");
						sap.m.MessageToast.show("Current Readings should be equal or less than previous readings.");
						checkValue = true;

				}
			}
//
			
			if(checkEmpty == true) return false;
			if(checkValue == true) return false;
			
			
					this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
					this.getView().byId("Id_bt2").setVisible(true);
					this.getView().byId("Id_bt1").setVisible(true);
					var table= this.getView().byId("idInspectionTable")
					if(table.getItems()[this.selIndex].getCells()[3].getMetadata()._sUIDToken == "button"){
						table.getItems()[this.selIndex].getCells()[3].setType("Accept");
					}
					if(table.getItems()[this.selIndex].getCells()[4].getMetadata()._sUIDToken == "button"){
						table.getItems()[this.selIndex].getCells()[4].setType("Accept");
					}		
					
			//this.getView().byId("MiloStatus").setEnabled(false);		
			this.getView().byId("idMiloReading").setEnabled(false);
			this.getView().byId("idKmCovered").setEnabled(false);
					
		},
//////////////////////////////////////////////////////////////////////////////////////////////////				
		onTabelEntriesClose:function(){
			this.getView().byId("Id_bt2").setVisible(true);
			this.getView().byId("Id_bt1").setVisible(true);
			this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");

				},

//////////////////////////////////////////////////////////////////////////////////////////////////				
	onTpressG1: function(e){
			debugger
			var that = this;
			var dialog = e.getSource().getParent();
			var element = e.getSource().getParent().getContent()[0]._aElements;
			var g1,g2,g3,g4;
			var count = 0;
			var check = false;
			var avg = 0;
			
			if(element[2].getValue() !== "" && parseFloat(element[2].getValue()) > 0){
				g1 = parseFloat(element[2].getValue());
				element[2].setValueState("None");
				avg++;
			}else{
				g1 = 0.0;
				element[2].setValueState("Error");
				count++;
				check = true;
			}
			
			if(element[4].getValue() !== "" && parseFloat(element[4].getValue()) > 0){
				g2 = parseFloat(element[4].getValue());
				element[4].setValueState("None");
				avg++;
			}else{
				g2 = 0.0;
				element[4].setValueState("Error");
				count++;
				check = true;
			}
			
			if(element[6].getValue() !== "" && parseFloat(element[6].getValue()) > 0){
				g3 = parseFloat(element[6].getValue());
				element[6].setValueState("None");
				avg++;
			}else{
				g3 = 0.0;
				element[6].setValueState("Error");
				count++;
				check = true;
			}
			
			if (check==true){
				sap.m.MessageBox.show("L1,L2,L3 cannot be empty", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
						}
					});
				return false;
			}			
			
			if(element[8].getValue() !== "" && parseFloat(element[8].getValue()) > 0){
				g4 = parseFloat(element[8].getValue());
				avg++;
			}else{
				g4 = 0.0;
				count++;
			}	
			
		    var gTotal = g1 + g2 + g3 + g4;
		    var avgtt = gTotal / avg;		
			
			if(count < 2){
				that.source.setValue( avgtt.toFixed(1) );
				debugger
				var arr=[];
				
				if (NsdClass=="A"){
					if (this.getView().byId("idG1").getVisible()==true){
						var G1 = this.getView().byId("idG1").getValue();
						arr.push(G1);
					}
					if (this.getView().byId("idG2").getVisible()==true){
						var G2 = this.getView().byId("idG2").getValue();
						arr.push(G2);
					}
					if (this.getView().byId("idG3").getVisible()==true){
						var G3 = this.getView().byId("idG3").getValue();	
						arr.push(G3);
					}
					if (this.getView().byId("idG4").getVisible()==true){
						var G4 = this.getView().byId("idG4").getValue();	
						arr.push(G4);
					}
					if (this.getView().byId("idG5").getVisible()==true){
						var G5 = this.getView().byId("idG5").getValue();
						arr.push(G5);
					}
					if (this.getView().byId("idG6").getVisible()==true){
						var G6 = this.getView().byId("idG6").getValue();
						arr.push(G6);
					}	
				}else{
					if (this.getView().byId("idG2").getVisible()==true){
						var G2 = this.getView().byId("idG2").getValue();
						arr.push(G2);
					}
					if (this.getView().byId("idG3").getVisible()==true){
						var G3 = this.getView().byId("idG3").getValue();	
						arr.push(G3);
					}
				}
				
				var minNsd = Math.min.apply(null,arr);
				if(minNsd == Infinity){
					this.getView().byId("minNsd").setValue("");
				}else{
					this.getView().byId("minNsd").setValue(minNsd);
				}
				
				var OrigNsd = this.getView().byId("idOriNsd").getValue();
				var totkm   = this.getView().byId("idTotKmCov1").getValue();
				var diffnsd = parseFloat(OrigNsd) - parseFloat(minNsd);
				var Wear;
				var milage;
				var kmmm;
				
				if(WearClass=="A"){
					
				 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 0.8)) * 100;	
				 if (parseFloat(minNsd) <= 0.8){
				    milage = totkm;
				 }
				   else{
					 milage =  ( totkm * ( parseFloat(OrigNsd) - 0.8) ) / diffnsd;
				 }	
				 
				}else if (WearClass=="B"){
					
					Wear = ( diffnsd / parseFloat(OrigNsd)) * 100;	
					
					 if (parseFloat(minNsd) <= 0){
					    milage = totkm;
					 }
					   else{
						 milage =  ( totkm * ( parseFloat(OrigNsd) - 0) ) / diffnsd;
					 }
					 
				}else{
					
					 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 1.6)) * 100;	
					 if (parseFloat(minNsd) <= 1.6){
					    milage = totkm;
					 }
					   else{
						 milage =  ( totkm * ( parseFloat(OrigNsd) - 1.6) ) / diffnsd;
					 }				
				}
				
				kmmm = totkm / diffnsd;
				
				Wear = parseFloat(Wear);
				milage = parseFloat(milage);
				kmmm = parseFloat(kmmm);
				
				Wear = Wear.toFixed(2);
				milage = milage.toFixed(0);
				kmmm = kmmm.toFixed(0);
				
				this.getView().byId("idTWear").setValue(Wear);
				this.getView().byId("idPrjMil").setValue(milage);
				this.getView().byId("idKmWear").setValue(kmmm);
				
				dialog.close();
			}else{
				sap.m.MessageBox.show("Please fill atleast 3 Grooves", {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose:function(){
						}
					});	
				return false;
			}			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onPressOG1: function(e){
	
				debugger
				var that = this;
				var dialog = e.getSource().getParent();
				var element = e.getSource().getParent().getContent()[0]._aElements;
				var g1,g2,g3,g4;
				var count = 0;
				var check = false;
				var avg = 0;
				
				if(element[2].getValue() !== "" && parseFloat(element[2].getValue()) > 0){
					g1 = parseFloat(element[2].getValue());
					element[2].setValueState("None");
					avg++;
				}else{
					g1 = 0.0;
					element[2].setValueState("Error");
					count++;
					check = true;
				}
				
				if(element[4].getValue() !== "" && parseFloat(element[4].getValue()) > 0){
					g2 = parseFloat(element[4].getValue());
					element[4].setValueState("None");
					avg++;
				}else{
					g2 = 0.0;
					element[4].setValueState("Error");
					count++;
					check = true;
				}
				
				if(element[6].getValue() !== "" && parseFloat(element[6].getValue()) > 0){
					g3 = parseFloat(element[6].getValue());
					element[6].setValueState("None");
					avg++;
				}else{
					g3 = 0.0;
					element[6].setValueState("Error");
					count++;
					check = true;
				}
				
				if (check==true){
					sap.m.MessageBox.show("L1,L2,L3 cannot be empty", {
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
						onClose:function(){
							}
						});
					return false;
				}			
				
				if(element[8].getValue() !== "" && parseFloat(element[8].getValue()) > 0){
					g4 = parseFloat(element[8].getValue());
					avg++;
				}else{
					g4 = 0.0;
					count++;
				}	
				
			    var gTotal = g1 + g2 + g3 + g4;
			    var avgtt = gTotal / avg;		
				
				if(count < 2){
					that.source.setValue( avgtt.toFixed(1) );
					debugger
					var arr=[];
					
					if (NsdClass=="A"){
						if (this.getView().byId("oG1").getVisible()==true){
							var G1 = this.getView().byId("oG1").getValue();
							arr.push(G1);
						}
						if (this.getView().byId("oG2").getVisible()==true){
							var G2 = this.getView().byId("oG2").getValue();
							arr.push(G2);
						}
						if (this.getView().byId("oG3").getVisible()==true){
							var G3 = this.getView().byId("oG3").getValue();	
							arr.push(G3);
						}
						if (this.getView().byId("oG4").getVisible()==true){
							var G4 = this.getView().byId("oG4").getValue();	
							arr.push(G4);
						}
						if (this.getView().byId("oG5").getVisible()==true){
							var G5 = this.getView().byId("oG5").getValue();
							arr.push(G5);
						}
						if (this.getView().byId("oG6").getVisible()==true){
							var G6 = this.getView().byId("oG6").getValue();
							arr.push(G6);
						}	
					}else{
						if (this.getView().byId("oG2").getVisible()==true){
							var G2 = this.getView().byId("oG2").getValue();
							arr.push(G2);
						}
						if (this.getView().byId("oG3").getVisible()==true){
							var G3 = this.getView().byId("oG3").getValue();	
							arr.push(G3);
						}
					}
					
					var minNsd = Math.min.apply(null,arr);
					if(minNsd == Infinity){
						this.getView().byId("minNsdO").setValue("");
					}else{
						this.getView().byId("minNsdO").setValue(minNsd);
					}
					
					var OrigNsd = this.getView().byId("idOriNsd").getValue();
					var totkm   = this.getView().byId("OidTotKmCov1").getValue();
					var diffnsd = parseFloat(OrigNsd) - parseFloat(minNsd);
					var Wear;
					var milage;
					var kmmm;
					
					if(WearClass=="A"){
						
					 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 0.8)) * 100;	
					 if (parseFloat(minNsd) <= 0.8){
					    milage = totkm;
					 }
					   else{
						 milage =  ( totkm * ( parseFloat(OrigNsd) - 0.8) ) / diffnsd;
					 }	
					 
					}else if (WearClass=="B"){
						
						Wear = ( diffnsd / parseFloat(OrigNsd)) * 100;	
						
						 if (parseFloat(minNsd) <= 0){
						    milage = totkm;
						 }
						   else{
							 milage =  ( totkm * ( parseFloat(OrigNsd) - 0) ) / diffnsd;
						 }
						 
					}else{
						
						 Wear = ( diffnsd / ( parseFloat(OrigNsd) - 1.6)) * 100;	
						 if (parseFloat(minNsd) <= 1.6){
						    milage = totkm;
						 }
						   else{
							 milage =  ( totkm * ( parseFloat(OrigNsd) - 1.6) ) / diffnsd;
						 }				
					}
					
					kmmm = totkm / diffnsd;
					
					Wear = parseFloat(Wear);
					milage = parseFloat(milage);
					kmmm = parseFloat(kmmm);
					
					Wear = Wear.toFixed(2);
					milage = milage.toFixed(0);
					kmmm = kmmm.toFixed(0);
					
					this.getView().byId("idTWearO").setValue(Wear);
					this.getView().byId("idPrjMilO").setValue(milage);
					this.getView().byId("idKmWearO").setValue(kmmm);
					
					dialog.close();
				}else{
					sap.m.MessageBox.show("Please fill atleast 3 Grooves", {
						title : "Error",
						icon : sap.m.MessageBox.Icon.ERROR,
						onClose:function(){
							}
						});	
					return false;
				}			
		
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onCloseG1: function(e){
			var that = this;
			var dialog = e.getSource().getParent();
			dialog.close();
		},
		
		onCloseOG1: function(e){
			var that = this;
			var dialog = e.getSource().getParent();
			
			dialog.close();
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onRotChange: function(){
			
			var table = this.getView().byId("idInspectionTable");
			var col   = this.getView().byId("idNewPos");
			var rot   = this.getView().byId("idRotation").getState();
		debugger	
		  this.bindTyrePositionSet();
		  
		if(rot == true)
			col.setVisible(true);
		else
			col.setVisible(false);	
		
		 var rows = table.getItems();
		 for (var i=0;i<rows.length;i++){
			 var pos = table.getItems()[i].getCells()[0].getText();
			 table.getItems()[i].getCells()[1].setSelectedKey(pos)
		 }
		
		},
		
		onAction: function(evt){
			debugger
			var key = evt.getSource().getSelectedKey();
			var col   = this.getView().byId("idRemovalReason");
			if(key == 'R')
				this.onActionRemove(evt);
			else
				col.setVisible(false);
		
			this.bindRemReasonSet();
		},		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		TyreLocChange:function(evt){
			debugger
			var key=evt.getSource().getSelectedKey();
			if(key=="04"){
				sap.ui.getCore().byId("idMJDefect").setVisible(true);
			}else{
				sap.ui.getCore().byId("idMJDefect").setVisible(false);
			}
		},
		
		onActionRemove:function(evt){
			debugger
			
			
			this.path = evt.getSource().getParent().getBindingContextPath();
			var table= this.getView().byId("idInspectionTable")
			this.selIndex = table.getItems().indexOf(evt.getSource().getParent());
			
			if(evt.getParameter("selectedItem")==undefined){
				
			if(evt.getSource().getSelectedKey()=="O"){
				evt.getSource().getParent().getBindingContext().getObject().RemoveOk=evt.getSource().getSelectedKey();
				var table=evt.getSource().getParent().getParent();
				var index=table.getItems().indexOf(evt.getSource().getParent());
			}
			}else{
				if(evt.getSource().getSelectedKey()=="R"){
				if (!that._RemovalReason) {
					that._RemovalReason = sap.ui.xmlfragment(
						"zftplanreport.view.RemoveTyreDetails", that);
					that.getView().addDependent(that._RemovalReason);}
				
				var sPath1="/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4RemovalReasonSet";
 
				var jModel1 = new sap.ui.model.json.JSONModel();
				jModel1.loadData(sPath1, null, false, "GET", false, false, null);
				sap.ui.getCore().byId("idTyrLoc1").unbindAggregation("items");
				sap.ui.getCore().byId("idTyrLoc1").setModel(jModel1);
				sap.ui.getCore().byId("idTyrLoc1").bindAggregation("items", {
						path: "/d/results",
						template: new sap.ui.core.Item({
							key: "{RemReason}",
							text: "{ReasonDesc}"
						})
					}); 
			
					sap.ui.getCore().byId("idTyrLoc1").setVisible(true);
					that._RemovalReason.open();
				
			} 	
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onTyreOk1:function(e){
			debugger
			var Defect=sap.ui.getCore().byId("idMJDefectCode").getValue();
			var RemRes=sap.ui.getCore().byId("idTyrLoc1").getSelectedKey();
			
			if(Defect=="" && sap.ui.getCore().byId("idMJDefect").getVisible()){
				sap.m.MessageToast.show("Select Defect Code");
				return
			}
			
			if(RemRes==""  ){
				sap.m.MessageToast.show("Select Cause of Removal");
				return
			}
			debugger	
			
			var table= this.getView().byId("idInspectionTable");
			table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex].Defect = Defect;
			table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex].RemReason = RemRes;

			that._RemovalReason.open();
			that._RemovalReason.close();
			that._RemovalReason.destroy();
			that._RemovalReason=undefined;

		},
		
	onTyreClose1: function(evt){
		debugger
			that._RemovalReason.close();
		},
		
//////////////////////////////////////////////////////////////////////////////////////////////////
		onMjrDft:function(){
			debugger
			 	var sPath = "/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4DefectCodeSet";			

		 		var jModel = new sap.ui.model.json.JSONModel();
		 		jModel.loadData(sPath, null, false,"GET",false, false, null);
		 		var _valueHelpSelectDialog = new sap.m.SelectDialog({
		    	
		        title: "Defect Code",
		        items: {
		            path: "/d/results",
		            template: new sap.m.StandardListItem({
		                title: "{DefectDesc}",
		                customData: [new sap.ui.core.CustomData({
		                	key : "{Defect}",
							value : "{DefectDesc}"
		                })],    	               
		            }),
		        },
		        liveChange: function(oEvent) {
		            var sValue = oEvent.getParameter("value");
		            var oFilter = new sap.ui.model.Filter("Defect",sap.ui.model.FilterOperator.Contains,sValue);
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
			    var key = oEvent.getParameter("selectedItem").getCustomData()[0].getKey();
			    if (oSelectedItem) {
			    	sap.ui.getCore().byId("idMJDefect").setValue(oSelectedItem.getTitle());
			    	sap.ui.getCore().byId("idMJDefectCode").setValue(key);
			    }          
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
	onMnrDft:function(){
		debugger
			var sPath = "/sap/opu/odata/sap/ZFLEET_SRV/F4AdjustableDefectSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false, "GET", false,false, null);
			
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
					var sValue = oEvent.getParameter("value");

var oFilter = new sap.ui.model.Filter("DefectTxt",sap.ui.model.FilterOperator.Contains,sValue);
var oFilter2 = new sap.ui.model.Filter("Defect",sap.ui.model.FilterOperator.Contains,sValue);
var oFilter1=new sap.ui.model.Filter([oFilter, oFilter2], false /*AND*/);

			oEvent.getSource().getBinding("items").filter([ oFilter1 ]);
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
				sap.ui.getCore().byId("idMNGrp").setValue(oSelectedItem.getTitle());
				sap.ui.getCore().byId("idMNGrp").setName(oSelectedItem.getTitle());
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		bindTyrePositionSet: function(configCode, vehicleNo){
			var oView = this.getView();
			var TyrePositionJModel = oView.getModel("TyrePositionJModel");
			if (!TyrePositionJModel) {
				TyrePositionJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(TyrePositionJModel, "TyrePositionJModel");
			}
			var sPathTyrePositionSet = "/TyrePositionsSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			var filters = [];
			
			filters.push(new sap.ui.model.Filter("RegNo", sap.ui.model.FilterOperator.EQ, RegNo));
			filters.push(new sap.ui.model.Filter("ConfigCode", sap.ui.model.FilterOperator.EQ, ConfigCode));
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.context = "";
			oParamsTyrePositionSet.filters = filters;
			oParamsTyrePositionSet.urlParameters = "";
			oParamsTyrePositionSet.success = function(oData, oResponse) { // success handler
					
				TyrePositionJModel.setData(oData.results);
				
			};
			oParamsTyrePositionSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
		bindRemReasonSet: function(){
			var oView = this.getView();
			var RemovalReasonJModel = oView.getModel("RemovalReasonJModel");
			if (!RemovalReasonJModel) {
				RemovalReasonJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(RemovalReasonJModel, "RemovalReasonJModel");
			}
			var sPathTyrePositionSet = "/F4RemovalReasonSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.context = "";
			oParamsTyrePositionSet.urlParameters = "";
			oParamsTyrePositionSet.success = function(oData, oResponse) { // success handler
					
				RemovalReasonJModel.setData(oData.results);
				
			};
			oParamsTyrePositionSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
		
		bindWearTypeSet: function(){
			debugger;
			
			var WearTypeJModel = this._EntriesHelpDialog.getModel("WearTypeJModel");
			var sPathTyrePositionSet = "/F4WearTypeSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.context = "";
			oParamsTyrePositionSet.urlParameters = "";
			oParamsTyrePositionSet.success = function(oData, oResponse) { // success handler
					
				WearTypeJModel.setData(oData.results);
				
			};
			oParamsTyrePositionSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		bindGravityTypeSet: function(){
			debugger
			
			var GravityJModel = this._EntriesHelpDialog.getModel("GravityJModel");
			var sPathTyrePositionSet = "/F4GravitySet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.context = "";
			oParamsTyrePositionSet.urlParameters = "";
			oParamsTyrePositionSet.success = function(oData, oResponse) { // success handler
					
				GravityJModel.setData(oData.results);
				
			};
			oParamsTyrePositionSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
		bindPwaTypeSet: function(){
			
			var PwaJModel = this._EntriesHelpDialog.getModel("PwaJModel");
			var sPathTyrePositionSet = "/F4PwaSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsTyrePositionSet = {};
			oParamsTyrePositionSet.context = "";
			oParamsTyrePositionSet.urlParameters = "";
			oParamsTyrePositionSet.success = function(oData, oResponse) { // success handler
					
				PwaJModel.setData(oData.results);
				
			};
			oParamsTyrePositionSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathTyrePositionSet, oParamsTyrePositionSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
onPostionChange: function(oEvent){

	
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onMiloMeter : function(){
			debugger
			/*var lm = this.getView().byId("LMiloStatus").getState();
			var m  = this.getView().byId("MiloStatus").getState();		
			this.getView().byId("idKmCovered").setValue();
			this.getView().byId("idMiloReading").setValue();
			
			if ( lm == true && m == true ){			
				this.getView().byId("MiloReading").setVisible(true);
				this.getView().byId("idMiloReading").setVisible(true);
				this.getView().byId("idKmCovered").setEnabled(false);
				}
			else if ( lm == true && m == false ){
				this.getView().byId("MiloReading").setVisible(false);
				this.getView().byId("idMiloReading").setVisible(false);
				this.getView().byId("KmCovered").setVisible(true);
				this.getView().byId("idKmCovered").setVisible(true);
				this.getView().byId("idKmCovered").setEnabled(true);
				}
			else if ( lm == false && m == true ){
				this.getView().byId("MiloReading").setVisible(true);
				this.getView().byId("idMiloReading").setVisible(true);
				this.getView().byId("KmCovered").setVisible(true);
				this.getView().byId("idKmCovered").setVisible(true);
				this.getView().byId("idKmCovered").setEnabled(true);

				}
			else if ( lm == false && m == false ){
				this.getView().byId("MiloReading").setVisible(false);
				this.getView().byId("idMiloReading").setVisible(false);
				this.getView().byId("KmCovered").setVisible(true);
				this.getView().byId("idKmCovered").setVisible(true);
				this.getView().byId("idKmCovered").setEnabled(true);
				}
			*/
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		readingcheck: function(){
/*			debugger
			var checkreading = false;
			var lm = this.getView().byId("LMiloStatus").getState();
			var m  = this.getView().byId("MiloStatus").getState();
			var km = this.getView().byId("idKmCovered").getValue();
			var milo = this.getView().byId("idMiloReading").getValue();
			var lmilo = this.getView().byId("LMiloRead").getText();
			//var sendstatus;
			
			if (m==true){
			 sendstatus = "Y";
			} 
			else{
			 sendstatus = "N";	 
			}
			
			if (milo == ""){
				milo = 0;
			}
			
			if (lmilo == ""){
				lmilo = 0;
			}
			if (km == ""){
				km = 0;
			}
			
			if ( lm == true && m == true && ( parseInt(milo) == 0 || parseInt(km) < 0 )){	
					if(parseInt(milo) == 0){
						this.getView().byId("idMiloReading").setValueState("Error");
						sap.m.MessageBox.alert("Milometer reading cannot be empty.", {
		                    title : "Error",
		                    icon : sap.m.MessageBox.Icon.ERROR,
		                  });
						checkreading = true;	
						return checkreading;
					}else if( parseInt(km) < 0){
						this.getView().byId("idMiloReading").setValueState("Error");
						sap.m.MessageBox.alert("KM covered cannot be less than zero.", {
		                    title : "Error",
		                    icon : sap.m.MessageBox.Icon.ERROR,
		                  });
						checkreading = true;	
						return checkreading;
					}
			}
				else{
					this.getView().byId("idMiloReading").setValueState("None");
			}
			
			if ( lm == true && m == false && parseInt(km) == 0){	
				this.getView().byId("idKmCovered").setValueState("Error");
				sap.m.MessageBox.alert("KM covered cannot be empty.", {
                    title : "Error",
                    icon : sap.m.MessageBox.Icon.ERROR,
                  });
				checkreading = true;
				return checkreading;
			}
			else{
					this.getView().byId("idKmCovered").setValueState("None");
			}
			
			
			if ( lm == false && m == true && (parseInt(milo) == 0 || parseInt(km) == 0)){	
				this.getView().byId("idKmCovered").setValueState("Error");
				this.getView().byId("idMiloReading").setValueState("Error");
				sap.m.MessageBox.alert("Milometer reading and KM covered cannot be empty.", {
                    title : "Error",
                    icon : sap.m.MessageBox.Icon.ERROR,
                  });
				checkreading = true;
				return checkreading;
			}
				else{
					this.getView().byId("idKmCovered").setValueState("None");
					this.getView().byId("idMiloReading").setValueState("None");
			}
			
			
			if ( lm == false && m == false && (parseInt(km) == 0)){	
				this.getView().byId("idKmCovered").setValueState("Error");
				sap.m.MessageBox.alert("KM covered cannot be empty.", {
                    title : "Error",
                    icon : sap.m.MessageBox.Icon.ERROR,
                  });
				checkreading = true;
				return checkreading;
			}
				else{
					this.getView().byId("idKmCovered").setValueState("None");
			}
	*/		
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
			
//////////////////////////////////////////////////////////////////////////////////////////////////
/*		onSave: function(){
			debugger
				that = this;
				var image = this.createDocsPayload();
				
				if(image.ImageObjectToDataNvg.length==0){
					 sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
									MessageBox.show(
										"Do you want to continue?", {
											icon: MessageBox.Icon.INFORMATION,
											title: "No attachments added!",
											actions: [MessageBox.Action.YES, MessageBox.Action.NO],
											onClose: function(oAction){
												if(oAction === sap.m.MessageBox.Action.NO){
													return false
												}else{
													that.onReviewAndSave();
												}
											}
										}
									);
						});
				}
			
		},
			*/
//////////////////////////////////////////////////////////////////////////////////////////////////
/*		onReviewAndSave: function(){
			debugger			
			
			inspdt = this.getView().byId("InspDate").getDateValue();
			if (inspdt == null || inspdt == ""){
				sap.m.MessageToast.show("Inspection Date is required");
				return false;
			}
			
			var idInspectionTable = this.getView().byId("idInspectionTable");
			var tabItems = idInspectionTable.getItems();
			var checkreading = this.readingcheck();		
						
			
			if(this.getView().byId("idRotation").getState() == true){
				debugger
				var rotvalid = true;
				var arr = [];
				for(var k=0;k<tabItems.length;k++){
					if(tabItems[k].getCells()[1].getSelectedKey() == "" && tabItems[k].getCells()[1].getVisible() == true){
						tabItems[k].getCells()[1].setValueState("Error");	
						rotvalid=false;
						}
					else{
						tabItems[k].getCells()[1].setValueState("None");
						var key = tabItems[k].getCells()[1].getSelectedKey();
						arr.push(key);
					}
				}
	
				if(!rotvalid){
					sap.m.MessageBox.alert("Please Select A Rotation Reason For All Positions", {
	                    title : "Information",
	                    icon : sap.m.MessageBox.Icon.INFORMATION,
	                  });
					return false;
				}
				
				let unique_array = []
			    for(let i = 0;i < arr.length; i++){
			        if(unique_array.indexOf(arr[i]) == -1){
			            unique_array.push(arr[i])
			        }
			    }
				
				if(arr.length > unique_array.length){
					sap.m.MessageToast.show("Position already selected, please select another position.");
					return false;
				}
				
				
			}
			
			if(checkreading){
				return false;
			}
			
			var valid = true;
			for(var k=0;k<tabItems.length;k++){
				if(tabItems[k].getCells()[4].getType() == "Reject"){
						valid=false;
					}				
			}
			
		if(!valid){    
				sap.m.MessageBox.alert("Readings are mandatory", {
                    title : "Information",
                    icon : sap.m.MessageBox.Icon.INFORMATION,
                  });
				return false;
			}
			
			
			debugger
			var cart = "";
			this.saveData(cart);
		},*/
//////////////////////////////////////////////////////////////////////////////////////////////////
		onCart: function(){
			debugger
			var cart = "X";
			this.saveData(cart);
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
/*		saveData: function(cart){
			debugger
			
			var _self= this;
			var tableData = this.getView().byId("idInspectionTable").getModel().getData().NavtoFitmentDetail.results;
			var l = tableData["length"];
			var laChild = [];
			
			for (var i in tableData){
				if (tableData[i].G1l4nsd<0 || tableData[i].G1l4nsd == ""){
					tableData[i].G1l4nsd=0;
				}
				if (tableData[i].G2l4nsd<0 || tableData[i].G2l4nsd == ""){
					tableData[i].G2l4nsd=0;
				}
				if (tableData[i].G3l4nsd<0 || tableData[i].G3l4nsd == ""){
					tableData[i].G3l4nsd=0;
				}
				if (tableData[i].G4l4nsd<0 || tableData[i].G4l4nsd == ""){
					tableData[i].G4l4nsd=0;
				}
			}
			
			for ( var i in tableData) {
				
				laChild.push({
								FitinspNo: tableData[i].FitinspNo,
								G1Nsd: tableData[i].G1Nsd,
								G1NsdO: tableData[i].G1NsdO,
								G1l1nsd: tableData[i].G1l1nsd,
								G1l2nsd: tableData[i].G1l2nsd,
								G1l3nsd: tableData[i].G1l3nsd,
								G1l4nsd: tableData[i].G1l4nsd,
								G1l1nsdO: tableData[i].G1l1nsdO,
								G1l2nsdO: tableData[i].G1l2nsdO,
								G1l3nsdO: tableData[i].G1l3nsdO,
								G1l4nsdO: tableData[i].G1l4nsdO,
								G2Nsd: tableData[i].G2Nsd,
								G2NsdO: tableData[i].G2NsdO,
								G2l1nsd: tableData[i].G2l1nsd,
								G2l2nsd: tableData[i].G2l2nsd,
								G2l3nsd: tableData[i].G2l3nsd,
								G2l4nsd: tableData[i].G2l4nsd,
								G2l1nsdO: tableData[i].G2l1nsdO,
								G2l2nsdO: tableData[i].G2l2nsdO,
								G2l3nsdO: tableData[i].G2l3nsdO,
								G2l4nsdO: tableData[i].G2l4nsdO,
								G3Nsd: tableData[i].G3Nsd,
								G3NsdO: tableData[i].G3NsdO,
								G3l1nsd: tableData[i].G3l1nsd,
								G3l2nsd: tableData[i].G3l2nsd,
								G3l3nsd: tableData[i].G3l3nsd,
								G3l4nsd: tableData[i].G3l4nsd,
								G3l1nsdO: tableData[i].G3l1nsdO,
								G3l2nsdO: tableData[i].G3l2nsdO,
								G3l3nsdO: tableData[i].G3l3nsdO,
								G3l4nsdO: tableData[i].G3l4nsdO,
								G4Nsd: tableData[i].G4Nsd,
								G4NsdO: tableData[i].G4NsdO,
								G4l1nsd: tableData[i].G4l1nsd,
								G4l2nsd: tableData[i].G4l2nsd,
								G4l3nsd: tableData[i].G4l3nsd,
								G4l4nsd: tableData[i].G4l4nsd,
								G4l1nsdO: tableData[i].G4l1nsdO,
								G4l2nsdO: tableData[i].G4l2nsdO,
								G4l3nsdO: tableData[i].G4l3nsdO,
								G4l4nsdO: tableData[i].G4l4nsdO,
								G5Nsd: tableData[i].G5Nsd,
								G5NsdO: tableData[i].G5NsdO,
								G5l1nsd: tableData[i].G5l1nsd,
								G5l2nsd: tableData[i].G5l2nsd,
								G5l3nsd: tableData[i].G5l3nsd,
								G5l4nsd: tableData[i].G5l4nsd,
								G5l1nsdO: tableData[i].G5l1nsdO,
								G5l2nsdO: tableData[i].G5l2nsdO,
								G5l3nsdO: tableData[i].G5l3nsdO,
								G5l4nsdO: tableData[i].G5l4nsdO,
								G6Nsd: tableData[i].G6Nsd,
								G6NsdO: tableData[i].G6NsdO,
								G6l1nsd: tableData[i].G6l1nsd,
								G6l2nsd: tableData[i].G6l2nsd,
								G6l3nsd: tableData[i].G6l3nsd,
								G6l4nsd: tableData[i].G6l4nsd,
								G6l1nsdO: tableData[i].G6l1nsdO,
								G6l2nsdO: tableData[i].G6l2nsdO,
								G6l3nsdO: tableData[i].G6l3nsdO,
								G6l4nsdO: tableData[i].G6l4nsdO,
								Gravity: tableData[i].Gravity,
								GravityO: tableData[i].GravityO,
								Groove: tableData[i].Groove,
								GroupType: tableData[i].GroupType,
								//GvwTons: tableData[i].GvwTons,
								//GvwTonsO: tableData[i].GvwTonsO,
								Hardness: tableData[i].Hardness,
								HardnessO: tableData[i].HardnessO,
								InspectionNo: tableData[i].InspectionNo,
								IpCondition: tableData[i].IpCondition,
								IpConditionO: tableData[i].IpConditionO,
								IpPsi: parseInt(tableData[i].IpPsi),
								IpPsiO: tableData[i].IpPsiO,								
								KmPerMm : parseInt(tableData[i].KmPerMm),
								KmPerMmO : parseInt(tableData[i].KmPerMmO),
								KmCovered: parseInt(tableData[i].KmCovered),
								KmCoveredO: parseInt(tableData[i].KmCoveredO),
								KmSuspended: parseInt(tableData[i].KmSuspended),
								KmSuspendedO: parseInt(tableData[i].KmSuspendedO),
								TotKmCoveredO: parseInt(tableData[i].TotKmCoveredO),
								TotKmCovered: parseInt(tableData[i].TotKmCovered),
								MilageProj: parseInt(tableData[i].MilageProj),
								MilageProjO: parseInt(tableData[i].MilageProjO),
								MinNsd: tableData[i].MinNsd,
								MinNsdO: tableData[i].MinNsdO,
								OrgNsd: tableData[i].OrgNsdO,
								OrgNsdO: tableData[i].OrgNsdO,
								PlanGuid: tableData[i].PlanGuid,
								PlanItemNo: tableData[i].PlanItemNo,
								PlanRevno: tableData[i].PlanRevno,
								Pwa: tableData[i].Pwa,
								PwaO: tableData[i].PwaO,
								RegNo: tableData[i].RegNo,
								Remarks: tableData[i].Remarks,
								RemarksO: tableData[i].RemarksO,
								RemoveOk: tableData[i].RemoveOk,
								Status: tableData[i].Status,
								StatusO: tableData[i].StatusO,
								StnclNumber: tableData[i].StnclNumber,
								TyrePosition: tableData[i].TyrePosition,
								Wear: tableData[i].Wear,
								WearO: tableData[i].WearO,
								WearType: tableData[i].WearType,
								WearTypeO: tableData[i].WearTypeO,
								RemReason:tableData[i].RemReason,
								Defect:tableData[i].Defect,
								RotPos:tableData[i].RotPos,
						});
			}
			
			var m = this.getView().byId("MiloStatus").getState();
			var sendstatus;
			
			if (m==true){
			 sendstatus = "Y";
			} 
			else{
			 sendstatus = "N";	 
			}
			
			var oEntry = {};
			var km   = this.getView().byId("idKmCovered").getValue();
			var milo = this.getView().byId("idMiloReading").getValue();
			
			if (milo == ""){
				milo = 0;
			}
			
			if (km == ""){
				km = 0;
			}
			
			var r = this.getView().byId("idRotation").getState() == true;
			var rotstatus;			
			if (r==true){
			 rotstatus = "X";
			} 
			else{
			 rotstatus = "";	 
			}
			
			if( inspdt !=null){
				inspdt = this.payLoadDate(inspdt);		
			 } 
			
			
			oEntry.SaveMode     = "I";
			oEntry.Cart     	= cart;
			oEntry.PlanGuid     = _self.PlanGuid ;
			oEntry.PlanRevno    = _self.PlanRevno;
			oEntry.PlanItemNo   = _self.PlanItemNo;
			oEntry.RegNo        = _self.RegNo;
			oEntry.FitmentNo    = _self.FitinspNo;
			oEntry.InspNo       = _self.InspectionNo;
			oEntry.InspDt       = inspdt;
 			oEntry.MeterStatus  = sendstatus;
			oEntry.MeterReading = parseInt(milo);
			oEntry.KmCovered    = parseInt(km);
			oEntry.Rotation     = rotstatus;
					
			oEntry.NavtoFitmentDetail = laChild;
			
					
            var router = sap.ui.core.UIComponent.getRouterFor(this);
            var sPathPOHeaderSet = "/FitmentHeaderSet";
            var frameworkODataModel = this.getOwnerComponent().getModel();
            var oParamsPOHeaderSet = {};
            oParamsPOHeaderSet.context = "";
            oParamsPOHeaderSet.urlParameters = "";
            
            oParamsPOHeaderSet.success = function(oData, oResponse) {
            	var msg= oData.Message;
            	 sap.m.MessageBox.show(msg, {
                     title : "Information",
                     icon : sap.m.MessageBox.Icon.INFORMATION,
                     actions : [ 'OK' ],
                     onClose : function(a) {
                       window.history.back();
                     },
                   });
//            	 
            	 debugger
            	 that.saveUploadedDocs(oResponse.data.PlanGuid,
            			 oResponse.data.PlanRevno,
            			 oResponse.data.PlanItemNo,
     					 oResponse.data.RegNo,
    					 oResponse.data.FitmentNo);         	// Document Upload
            	 
            	 debugger
            	 for ( var i=0; i<laChild.length ; i++){
            	 that.saveUploadedDocs2(oResponse.data.PlanGuid,
            			 oResponse.data.PlanRevno,
            			 oResponse.data.PlanItemNo,
     					 oResponse.data.RegNo,
    					 oResponse.data.FitmentNo,
    					 laChild[i].TyrePosition);         	// Document Upload     
            	 }
            	 
            };
            
            oParamsPOHeaderSet.error = function(oError) { // error handler 
            var parser = new DOMParser();
            var message = JSON.parse(
              oError.response.body)
              .error.message.value;
            sap.m.MessageBox.show(message, {
            title : "Error",
            icon : sap.m.MessageBox.Icon.ERROR,
            });
            busy.hide();

            }.bind(this);

            frameworkODataModel.create(sPathPOHeaderSet, oEntry, oParamsPOHeaderSet);

            frameworkODataModel.attachRequestCompleted(function() {

            });
		},*/
//////////////////////////////////////////////////////////////////////////////////////////////////		

//************************************* File Upload Header ************************************	

		//onInit
	    // start of document upload
		//var attachmentModel = new sap.ui.model.json.JSONModel();
		//this.getView().setModel(attachmentModel,"attachmentModel");
		//attachmentModel.setData([]);
		
		//var oUploadModel = new sap.ui.model.json.JSONModel({
		//	items : []
		//});
		
		//this.getView().setModel(oUploadModel,"oUploadModel");
		// end of document upload
	
		//onCreateTestPlanSet: function
		//that.saveUploadedDocs(that.SelectedData.planguid, that.SelectedData.planrevno);         	// document upload
		
		// _onRoute
		//this.getAttachmentDetails(this.SelectedData.planguid,this.SelectedData.planrevno);  		// document upload
	
		
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
			debugger
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
			debugger
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
			    "DocNo" : docId, 												// document number,
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
	    	debugger
	    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
	    	return false;
	    },
	    
	   
	    onFileDeleted : function(oEvent) {
	    	debugger
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

//////////////////////////////////////////////////////////////////////////////////////////////////	      
	      getAttachmentDetails: function(GuId,FitNo,RevNo,ItemNo,RegNo){        //document upload
	    	    debugger
				var oView = this.getView();
				var oUploadModel = this.getView().getModel("oUploadModel");
				var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
				var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='04',ObjectName='"+GuId+RevNo+ItemNo+RegNo+FitNo+"')?$expand=ImageObjectToDataNvg";
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

//////////////////////////////////////////////////////////////////////////////////////////////////			
			
			saveUploadedDocs: function(guid,revno,item,regno,fitno){               						// document upload
				var payload = that.createDocsPayload(guid,revno,item,regno,fitno);
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
			
			createDocsPayload: function(guid,revno,item,regno,fitno){              							// document upload
				debugger
				var payload={
						ObjectID: "04",
						ObjectName: guid+revno+item+regno+fitno,
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

//*****************************File Upload Header Function Finish ********************************	
//////////////////////////////////////////////////////////////////////////////////////////////////			
			
			showImage : function(oEvent) {
				debugger
			    var _that = this;
			    if (!this.oUploadDialog) {
				this.oUploadDialog = sap.ui.xmlfragment("zftplanreport.view.UploadDialog", this);
				this.getView().addDependent(this.oUploadDialog);
				//this.oUploadDialog.open();
			    }
			    
			    color = oEvent.getSource();
			    
			    var oSrc = oEvent.getSource();
			    var oContext = oSrc.getBindingContext("getInspDataJModel");
			    var sPath = oContext.getPath();
			    this.PDFPath = sPath;
			    var sIndex = sPath.split("/").pop();
			    this.sPDFIndex = sIndex;
			   
			    if (this.sPDFIndex != "") {
			    	
			    gModel = oSrc.getBindingContext("getInspDataJModel").getModel().getData();
			    TyrePos = gModel.NavtoFitmentDetail.results[this.sPDFIndex].TyrePosition;			
			        
			    var itemobject = PlanGuid+RevNo+ItemNumber+RegNo+FitNo+TyrePos; 
			        
			    this.getAttachmentDetails2(itemobject); 	    
				this.oUploadDialog.open();
				sap.ui.getCore().byId("UploadCollection").getModel("oUploadModel2").refresh();
//				return;
			    }			    
			}, 
			
			onOKUploadDialog : function(oEvent) {
//Added on May 6				
				var a = sap.ui.getCore().byId("UploadCollection").getModel("oUploadModel2").getData();
				if(a.items.length > 0)
				color.setType("Default");
				else
				color.setType("Reject");
//				
			    this.oUploadDialog.close();
			},	
//************************************* File Item Upload *****************************************	

			//onInit
		    // start of document upload
			//var attachmentModel = new sap.ui.model.json.JSONModel();
			//this.getView().setModel(attachmentModel,"attachmentModel");
			//attachmentModel.setData([]);
			
			//var oUploadModel = new sap.ui.model.json.JSONModel({
			//	items : []
			//});
			
			//this.getView().setModel(oUploadModel,"oUploadModel");
			// end of document upload
		
			//onCreateTestPlanSet: function
			//that.saveUploadedDocs(that.SelectedData.planguid, that.SelectedData.planrevno);         	// document upload
			
			// _onRoute
			//this.getAttachmentDetails(this.SelectedData.planguid,this.SelectedData.planrevno);  		// document upload
		
			
			onAttachUpload2: function(oEvent){
				debugger
				
				var oFileUploader = oEvent.getSource();		
				
			    var _that = this;
			    var csrf = that.getCSRFToken2();
			    
			    var oUploadCollection = oEvent.getSource();
			    var oCustomerHeaderToken = new UploadCollectionParameter({
				name : "x-csrf-token",
				value : that.token
			    });
			    oUploadCollection.addHeaderParameter(oCustomerHeaderToken);	
			},
			
		    getCSRFToken2: function() {	
		    	
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

			onBeforeUploadStarts2 : function(oEvent) {
				debugger
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
			
			onUploadComplete2 : function(oEvent) {
				debugger
			    var oUploadCollection = oEvent.getSource();
			    var oResData = oEvent.getParameter("files")[0];
			    if (oResData.status == "201") {
				var oData = oUploadCollection.getModel("oUploadModel2").getData();
				
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
				    "Pos" : TyrePos,
				    
				});	
				
				
				var uploadDetails= {};
				uploadDetails.FileName = oResData.fileName
				uploadDetails.DocNo= docId;
				uploadDetails.Pos= TyrePos;
				uploadDetails.UpdateFlag= "I";
				uploadDetails.MimeType = oResData.headers["content-mimetype"]
				var model = that.getView().getModel("attachmentModel2");
				var data = model.getData();
				data.push(uploadDetails);
				
				
				oUploadCollection.getModel("oUploadModel2").refresh();

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
		   
		    onTypeMissmatch2 : function(oEvent){
		    	debugger
		    	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
		    	return false;
		    },
		    
		   
		    onFileDeleted2 : function(oEvent) {
		    	debugger
		        var oSrc = oEvent.getSource();
		        var uploadModel = oSrc.getModel("oUploadModel2");
		        var imagedata = oSrc.getModel("oUploadModel2").getData();
		        var uItems = uploadModel.getProperty("/items");
		        var oItem = oEvent.getParameter("item");
		        var oContext = oItem.getBindingContext("oUploadModel2")
		        if (!oContext) {
		          uploadModel.setProperty("/items", uItems);
		          return;
		        }
		        var sPath = oContext.getPath();
		        var sIndex = sPath.split("/").pop();
		        var docId = oEvent.getParameter("documentId");
		        var ind = sIndex;
		            
		        var data = that.getView().getModel("attachmentModel2").getData();
		        var exist;
				for(var i=0;i<data.length;i++){
				  if(data[i].DocNo==imagedata.items[ind].DocNo){
					exist = "X";  
					data[i].UpdateFlag = "D";  
				  }	
				}
				
				if(exist !== "X"){
					var obj={};
					obj.FileName = imagedata.items[ind].FileName;
					obj.MimeType = imagedata.items[ind].MimeType;
					obj.DocNo = imagedata.items[ind].DocNo;
					obj.UpdateFlag = "D";
					obj.Pos = imagedata.items[ind].Pos;
					data.push(obj);
				}
				
		        uItems.splice(sIndex,1);
		        uploadModel.refresh();
				
		      },    

//////////////////////////////////////////////////////////////////////////////////////////////////				
				getAttachmentDetails2 : function(itemobject){        //document upload
					debugger
					var oView = this.getView();
					var that = this;
					var oUploadModel2 = this.getView().getModel("oUploadModel2");
					var model = this.getView().getModel("attachmentModel2");
					oUploadModel2.setData({items:[]});
					var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
					var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='04',ObjectName='"+itemobject+"')?$expand=ImageObjectToDataNvg";
					var oParamsAttachmentSet = {};
					oParamsAttachmentSet.context = "";
					oParamsAttachmentSet.urlParameters = "";
					oParamsAttachmentSet.success = function(oData, oResponse) { // success handler
						
						var modeldata = that.getView().getModel("attachmentModel2").getData();
						var host = window.location.host;
						var protocol = window.location.protocol;
						var urlprefix = protocol + "//" + host;	
						
						if (oData.ImageObjectToDataNvg.results.length > 0){
							
							var results = oData.ImageObjectToDataNvg.results;
							
							for (var i=0;i<results.length;i++){
								var sURL = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + results[i].DocNo + "')/$value";
								results[i].Url = sURL; 
							}
							
							 for (var i=0;i<oData.ImageObjectToDataNvg.results.length;i++){									 
								if (modeldata.length == 0){  
									var uploadDetails= {};
									uploadDetails.FileName = oData.ImageObjectToDataNvg.results[i].FileName;
									uploadDetails.DocNo= oData.ImageObjectToDataNvg.results[i].DocNo;
									uploadDetails.Pos= TyrePos;
									uploadDetails.UpdateFlag= "";
									uploadDetails.MimeType = "";
									uploadDetails.Url = oData.ImageObjectToDataNvg.results[i].Url;
									var data = oUploadModel2.getData();
									data.items.push(uploadDetails);	
									that.getView().getModel("oUploadModel2").refresh();	
								}else{
									var exist = false;
									for (var j=0;j<modeldata.length;j++){										
										if (TyrePos == modeldata[j].Pos && 
											modeldata[j].DocNo == oData.ImageObjectToDataNvg.results[i].DocNo &&
											modeldata[j].UpdateFlag == "D"){
										  exist = true;
										}											
									}
									
									if(exist==false){
										var uploadDetails= {};
										uploadDetails.FileName = oData.ImageObjectToDataNvg.results[i].FileName;
										uploadDetails.DocNo= oData.ImageObjectToDataNvg.results[i].DocNo;
										uploadDetails.Pos= TyrePos;
										uploadDetails.UpdateFlag= "";
										uploadDetails.MimeType = "";
										uploadDetails.Url = oData.ImageObjectToDataNvg.results[i].Url;
										var data = oUploadModel2.getData();
										data.items.push(uploadDetails);	
										that.getView().getModel("oUploadModel2").refresh();	
									}									
								} 
							  }
						};
						   for (var i=0;i<modeldata.length;i++){
							   if(modeldata[i].Pos == TyrePos && modeldata[i].UpdateFlag == 'I'){
								var uploadDetails= {};
								uploadDetails.FileName = modeldata[i].FileName;
								uploadDetails.DocNo= modeldata[i].DocNo;
								uploadDetails.Pos= modeldata[i].Pos;
								uploadDetails.UpdateFlag= "";
								uploadDetails.MimeType = "";
								uploadDetails.Url = urlprefix + "/sap/opu/odata/sap/ZAPS_UTILITY_SRV/ImageDisplaySet(DocNo='" + modeldata[i].DocNo + "')/$value";
								
								
								var data = oUploadModel2.getData();
								data.items.push(uploadDetails);	
								
					that.getView().getModel("oUploadModel2").refresh();	
							   }
						}
					};
					
					oParamsAttachmentSet.error = function(oError) { // error handler 		
						jQuery.sap.log.error("read publishing group data failed");
					}.bind(this);

					oCreateModel1.read(sPathAttachmentSet, oParamsAttachmentSet);

					oCreateModel1.attachRequestCompleted(function() {
						
					});
				},
//////////////////////////////////////////////////////////////////////////////////////////////////				
				
				saveUploadedDocs2: function(guid,revno,item,regno,fitno,pos){               						// document upload
					var payload = that.createDocsPayload2(guid,revno,item,regno,fitno,pos);
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
				
				createDocsPayload2: function(guid,revno,item,regno,fitno,pos){              							// document upload
					var payload={
							ObjectID: "04",
							ObjectName: guid+revno+item+regno+fitno+pos,
							Error:"",
							Message:"",				
					}
					var navArr=[];
					var data = that.getView().getModel("attachmentModel2").getData();
					for(var i=0;i<data.length;i++){	
						if(data[i].Pos == pos){
						var obj={};
						obj.FileName = data[i].FileName;
						obj.DocNo = data[i].DocNo;
						obj.UpdateFlag = data[i].UpdateFlag;
						obj.MimeType = data[i].MimeType;
						navArr.push(obj);	
					}
					}
					
					payload.ImageObjectToDataNvg = navArr;
					return payload;
				},

//*************************File Item Upload Finish****************************	
			
				onBack: function(){
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("S1");
				},
			
	});
});

sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
function( JSONModel,UploadCollectionParameter) {

jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("zinspection.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

var DataArticles, that, kunnr, hubName, EnrolMode, hubCode, RegNo, FitNo, 
	PlnNo, InspNo, PlanGuid, RevNo, ItemNumber, TyrePos, TyreStn, LastInspNo, Cart,
	WearClass, NsdClass, ConfigCode, milo, lmilo, km, FitmentDate, LastInspDt, inspdt,
	KmCovered, TotKmCovered, TestPlanNo, gv_flag;
var TyrePositionJModel, gModel;
var color, img = [];
var uploadFlag;
var attachmentModel2;

sap.ui.core.mvc.Controller.extend("zinspection.view.S1",{

	onInit: function(){
			that=this;
			this.payload = {}; 
			this.laChild = [];
			this.bindGetTestRequest();
			this.bindWearTypeSet();
			this.bindGravityTypeSet();
			this.bindPwaTypeSet();
			this.bindRemovalReason();
			jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("zinspection.css.style",".css"));

		     // start of document upload
			var attachmentModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(attachmentModel,"attachmentModel");
			attachmentModel.setData([]);
			
			var oUploadModel = new sap.ui.model.json.JSONModel({
				items : []
			});
			
			this.getView().setModel(oUploadModel,"oUploadModel");
			
			attachmentModel2 = new sap.ui.model.json.JSONModel();
			this.getView().setModel(attachmentModel2,"attachmentModel2");
			attachmentModel2.setData([]);
			
			var oUploadModel2 = new sap.ui.model.json.JSONModel({
				items : []
			});
			
			this.getView().setModel(oUploadModel2,"oUploadModel2");
			// end of document upload	
	
			
//Added on May 6			
/*			var Tbl = that.getView().byId("idInspectionTable");
	        Tbl.addEventDelegate({
	        	onAfterRendering :function(){
	        		debugger
	        		var rows = that.getView().byId("idInspectionTable").getItems();
	        		
	        		for( var i = 0 ; i < rows.length ; i++ ){
	        			
	        			if( img[i].ImageFlag == "" )
	        				rows[i].getCells()[6].setType("Reject");
	        			
	        		}
	        		
	        	}
			});*/
//			
			//Add code-25-06-2019
			var oDatePicker = this.getView().byId("InspDate");
			oDatePicker.addEventDelegate({
				onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#'+oID).attr("disabled", "disabled"); 
				}},oDatePicker);
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

//by ram
ChangeInspDate : function(evt){
	debugger  
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
	
	inspdt = evt.getSource().getDateValue();
	
},
	
//////////////////////////////////////////////////////////////////////////////////////////////////		
		handleIconTabBarSelect: function(e){
			debugger
			this.getView().byId("idFitmentTabFilter").setEnabled(true);
			this.getView().byId("idDocumentTabFilter").setEnabled(true)
			this.getView().byId("idTestPlanNoSelect").setValueState("None");
			if(TestPlanNo == "" || TestPlanNo == undefined ){
				sap.m.MessageToast.show("Test Plan Number is required.");
				this.getView().byId("idTestPlanNoSelect").setValueState("Error");
				this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("A")
				return false;
			}
			if(gv_flag == undefined || gv_flag == ""){
				this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("A");
				sap.m.MessageToast.show("Please select fitment from fitment table.");
				return false;
			}
		
			var _self = this;
			var t = e.getSource().getSelectedKey();
			this.getView().byId("hiddenReadings").setEnabled(false);
			this.getView().byId("Id_bt2").setVisible(true);
			this.getView().byId("Id_bt1").setVisible(true);
			this.selectedKey = this.getView().byId("id_IconTabBar_ctp_WL").getSelectedKey();
			
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
		onKMSuspend: function(e){
			debugger
		
            var val = e.getSource().getValue();
            var code = val.charCodeAt(val.length-1);  
            	if ( !(code > 47 && code < 58)){
            		val = val.substring( 0 , val.length - 1 );
            	}
            e.getSource().setValue(val);
            
			var kmc	 = KmCovered;
			var kmt  = TotKmCovered;
			
			var cov   = this.getView().byId("idKmCovered").getValue();
			var sus   = this.getView().byId("idKmSus").getValue();
			var tot   = this.getView().byId("idTotKmCov").getValue();				
		
			if(parseFloat(sus) > parseFloat(cov)){
				this.getView().byId("idKmCov").setValue(kmc);
				this.getView().byId("idTotKmCov").setValue(kmt);
				sap.m.MessageToast.show("'Km Suspended' cannot be greater than 'Km Covered'");
				this.getView().byId("idKmSus").setValue();
				return;
			}
//	
			
			kmc = parseInt(KmCovered) - sus;
			kmt = parseInt(TotKmCovered) - sus;
			
			this.getView().byId("idKmCov").setValue(kmc);
			this.getView().byId("idTotKmCov").setValue(kmt);
			
			var minNsd  = this.getView().byId("minNsd").getValue();
			var OrigNsd = this.getView().byId("idOriNsd").getValue();
			var totkm   = this.getView().byId("idTotKmCov").getValue();
			var diffnsd = parseFloat(OrigNsd) - parseFloat(minNsd);
			var Wear;
			var milage;
			var kmmm;
			
			if(minNsd=="0.0"){return};			 	
			
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
		
		},
		
		onKMSuspendO: function(e){
			debugger
            var val = e.getSource().getValue();
            var code = val.charCodeAt(val.length-1);  
            	if ( !(code > 47 && code < 58)){
            		val = val.substring( 0 , val.length - 1 );
            	}
            e.getSource().setValue(val);
            
			var kmc	 = KmCoveredO;
			var kmt  = TotKmCoveredO;
			
			var cov   = this.getView().byId("idKmCoveredO").getValue();
			var sus   = this.getView().byId("idKmSusO").getValue();
			var tot   = this.getView().byId("idTotKmCovO").getValue();				
		
			if(parseFloat(sus) > parseFloat(cov)){
				this.getView().byId("idKmCovO").setValue(kmc);
				this.getView().byId("idTotKmCovO").setValue(kmt);
				sap.m.MessageToast.show("'Km Suspended' cannot be greater than 'Km Covered'");
				this.getView().byId("idKmSusO").setValue();
				return;
			}
//	
			
			kmc = parseInt(KmCoveredO) - sus;
			kmt = parseInt(TotKmCoveredO) - sus;
			
			this.getView().byId("idKmCovO").setValue(kmc);
			this.getView().byId("idTotKmCovO").setValue(kmt);
			
			var minNsd  = this.getView().byId("minNsdO").getValue();
			var OrigNsd = this.getView().byId("idOriNsdO").getValue();
			var totkm   = this.getView().byId("idTotKmCovO").getValue();
			var diffnsd = parseFloat(OrigNsd) - parseFloat(minNsd);
			var Wear;
			var milage;
			var kmmm;
			
			if(minNsd=="0.0"){return};			 	
			
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
        
		},
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
		miloNumberValid : function(oEvent)
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
			
			var lm = this.getView().byId("LMiloStatus").getState();
			var m  = this.getView().byId("MiloStatus").getState();			
			
			if ( lm == true && m == true ){			
				var lmilo = this.getView().byId("LMiloRead").getText();
				var cmilo = this.getView().byId("idMiloReading").getValue();	
				
				var km = parseInt(cmilo) - parseInt(lmilo);
				this.getView().byId("idKmCovered").setValue(km);
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		NumberValid : function(oEvent)
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
		},
		
		onChange: function(oEvent){
			var diaMNo   = oEvent.getSource().getValue();
			if(diaMNo){
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = 0.00;
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				oEvent.getSource().setValue( diaMNo );
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onNumberValidChangeO1: function(oEvent){			

			var table= this.getView().byId("idInspectionTable");
			var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
			var diameter = a.G1NsdO1;
			var newval   = a.G1Nsd;

			
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1);     
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
                    oEvent.getSource().setValue(diaMNo);
				}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if((parseFloat(diaMNo) > parseFloat(diameter)) && parseFloat(diameter) != "0.0" ){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G1 Value.");
				}
				
				if(parseFloat(diaMNo) < parseFloat(newval)){
					a.G1Nsd 	= "";
					a.G1l1nsd 	= "";
					a.G1l2nsd 	= "";
					a.G1l3nsd 	= "";
					a.G1l4nsd 	= "";	
					
					table.getModel("getInspDataJModel").refresh();	
				}				
				
				debugger
				oEvent.getSource().setValue( diaMNo );
			}
		},
		
		onNumberValidChangeO2: function(oEvent){			

			var table= this.getView().byId("idInspectionTable");
			var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
			var diameter = a.G2NsdO1;
			var newval   = a.G2Nsd;
			
			
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1);     
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
                    oEvent.getSource().setValue(diaMNo);
				}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if((parseFloat(diaMNo) > parseFloat(diameter)) && parseFloat(diameter) != "0.0" ){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G2 Value.");
				}
				
				if(parseFloat(diaMNo) < parseFloat(newval)){
					a.G2Nsd 	= "";
					a.G2l1nsd 	= "";
					a.G2l2nsd 	= "";
					a.G2l3nsd 	= "";
					a.G2l4nsd 	= "";	
					
					table.getModel("getInspDataJModel").refresh();	
				}	
				
				debugger
				oEvent.getSource().setValue( diaMNo );
			}
		},
		
		onNumberValidChangeO3: function(oEvent){			

			var table= this.getView().byId("idInspectionTable");
			var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
			var diameter = a.G3NsdO1;
			var newval   = a.G3Nsd;
			
			
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1);     
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
                    oEvent.getSource().setValue(diaMNo);
				}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if((parseFloat(diaMNo) > parseFloat(diameter)) && parseFloat(diameter) != "0.0" ){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G3 Value.");
				}
				
				if(parseFloat(diaMNo) < parseFloat(newval)){
					a.G3Nsd 	= "";
					a.G3l1nsd 	= "";
					a.G3l2nsd 	= "";
					a.G3l3nsd 	= "";
					a.G3l4nsd 	= "";	
					
					table.getModel("getInspDataJModel").refresh();	
				}	
				
				debugger
				oEvent.getSource().setValue( diaMNo );
			}
		},
		
		onNumberValidChangeO4: function(oEvent){			

			var table= this.getView().byId("idInspectionTable");
			var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
			var diameter = a.G4NsdO1;
			var newval   = a.G4Nsd;
			
			
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1);     
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
                    oEvent.getSource().setValue(diaMNo);
				}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if((parseFloat(diaMNo) > parseFloat(diameter)) && parseFloat(diameter) != "0.0" ){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G4 Value.");
				}
				
				if(parseFloat(diaMNo) < parseFloat(newval)){
					a.G4Nsd 	= "";
					a.G4l1nsd 	= "";
					a.G4l2nsd 	= "";
					a.G4l3nsd 	= "";
					a.G4l4nsd 	= "";	
					
					table.getModel("getInspDataJModel").refresh();	
				}	
				
				debugger
				oEvent.getSource().setValue( diaMNo );
			}
		},
		
		onNumberValidChangeO5: function(oEvent){			

			var table= this.getView().byId("idInspectionTable");
			var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
			var diameter = a.G5NsdO1;
			var newval   = a.G5Nsd;
			
			
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1);     
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
                    oEvent.getSource().setValue(diaMNo);
				}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if((parseFloat(diaMNo) > parseFloat(diameter)) && parseFloat(diameter) != "0.0" ){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G5 Value.");
				}
				
				if(parseFloat(diaMNo) < parseFloat(newval)){
					a.G5Nsd 	= "";
					a.G5l1nsd 	= "";
					a.G5l2nsd 	= "";
					a.G5l3nsd 	= "";
					a.G5l4nsd 	= "";	
					
					table.getModel("getInspDataJModel").refresh();	
				}	
				
				debugger
				oEvent.getSource().setValue( diaMNo );
			}
		},
		
		onNumberValidChangeO6: function(oEvent){			

			var table= this.getView().byId("idInspectionTable");
			var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
			var diameter = a.G6NsdO1;
			var newval   = a.G6Nsd;			
			
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1);     
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
                    oEvent.getSource().setValue(diaMNo);
				}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if((parseFloat(diaMNo) > parseFloat(diameter)) && parseFloat(diameter) != "0.0" ){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G6 Value.");
				}
				
				if(parseFloat(diaMNo) < parseFloat(newval)){
					a.G6Nsd 	= "";
					a.G6l1nsd 	= "";
					a.G6l2nsd 	= "";
					a.G6l3nsd 	= "";
					a.G6l4nsd 	= "";	
					
					table.getModel("getInspDataJModel").refresh();	
				}	
				
				debugger
				oEvent.getSource().setValue( diaMNo );
			}
		},		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onNumberValidChange1: function(oEvent){
			var diameter = this.getView().byId("oG1").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1);     
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
                    oEvent.getSource().setValue(diaMNo);
				}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G1 Value.");
				}
				debugger
				oEvent.getSource().setValue( diaMNo );
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onNumberValidChange2: function(oEvent){
			var diameter = this.getView().byId("oG2").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1); 
			if(diaMNo){
				
			if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
	                 oEvent.getSource().setValue(diaMNo);
			}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G2 Value.");
				}
				//var diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
				oEvent.getSource().setValue( diaMNo );
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onNumberValidChange3: function(oEvent){
			var diameter = this.getView().byId("oG3").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1); 
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
	                 oEvent.getSource().setValue(diaMNo);
			}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G3 Value.");
				}
				//var diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 1);
				oEvent.getSource().setValue( diaMNo );
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onNumberValidChange4: function(oEvent){
			var diameter = this.getView().byId("oG4").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1); 
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
	                 oEvent.getSource().setValue(diaMNo);
			}
				
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G4 Value.");
				}
				//var diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 1);
				oEvent.getSource().setValue( diaMNo );
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onNumberValidChange5: function(oEvent){
			var diameter = this.getView().byId("oG5").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1); 
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
	                 oEvent.getSource().setValue(diaMNo);
			}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G5 Value.");
				}
				//var diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 1);
				oEvent.getSource().setValue( diaMNo );
			}
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onNumberValidChange6: function(oEvent){
			var diameter = this.getView().byId("oG6").getValue();
			var diaMNo   = oEvent.getSource().getValue();
			var code     = diaMNo.charCodeAt(diaMNo.length-1); 
			if(diaMNo){
				
				if ( !(code > 47 && code < 58) && !(code == 46)){
					diaMNo = diaMNo.substring( 0 , diaMNo.length - 1 );
	                 oEvent.getSource().setValue(diaMNo);
			}
				
				if(isNaN(diaMNo)){
					diaMNo = diaMNo.substring(0, diaMNo.length - 1);
					oEvent.getSource().setValue(diaMNo);					
				}
				
				if( diaMNo.toString().indexOf(".") >= 0 )
				{
					diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 2);
					oEvent.getSource().setValue(diaMNo);
				}
				
				if(parseFloat(diaMNo) >= 100){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed 100 mm");
				}
				
				if(parseFloat(diaMNo) > parseFloat(diameter)){
					diaMNo = "";
					oEvent.getSource().setValue(diaMNo);
					sap.m.MessageToast.show("Value cannot exceed Original G6 Value.");
				}
				//var diaMNo = diaMNo.toString().substring(0, diaMNo.toString().indexOf(".") + 1);
				oEvent.getSource().setValue( diaMNo );
			}
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
		debugger
				TestPlanNo = this.getView().byId("idTestPlanNoSelect").getSelectedKey();
					/*if(TestPlanNo !=""){
						this.getView().byId("idFitmentTabFilter").setEnabled(false);
					}else{
						this.getView().byId("idFitmentTabFilter").setEnabled(true);
					}*/
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
				that.TestMethDesc   = oData.PlanToInspectionHeadNvg.results[0].TestMethDesc;
				that.getView().byId("idReqDtText").setText(oData.PlanDate);

/*				that.getView().byId("idProductCatText").setText(oData.ProductCategoryDesc);
				that.getView().byId("idTestCatText").setText(oData.CategoryDescription);
				that.getView().byId("idMaterialText").setText(oData.Maktx);
				that.getView().byId("idRimSizeText").setText(oData.FitmentRimRecommended);
				that.getView().byId("idModificationText").setText(oData.Modifications);
				that.getView().byId("idTestObjText").setText(oData.TestObjectiveDesc);
				that.getView().byId("idProductCatText").setValue(oData.SpecialReq);
*/
//				that.createDataModels();

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
		onPressItemFitment: function(e){
			debugger
			//this.getView().byId("IdFit").setVisible(true);
			var _self = this;
			gv_flag = "F";
			_self.getView().byId("idFitmentTabFilter").setEnabled(true);
			if (e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().Complete =='X'){
				  sap.m.MessageToast.show("Vehicle inspection is completed. No Action possible.");
				  return false
			}else if (e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().Active ==''){
				  sap.m.MessageToast.show("This is an old inspection. No Action possible");
				  return false
			}
			
			
			
				_self.PlanGuid     = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().PlanGuid;
				_self.PlanRevno    = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().PlanRevno;
				_self.PlanItemNo   = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().PlanItemNo;
				_self.RegNo        = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().RegNo;
				_self.FitinspNo    = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().FitmentNo;
				_self.InspectionNo = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().InspectionNo;
				_self.WearClass    = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().ProdWearClass;
				_self.NsdClass     = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().MinNsdClass;
				_self.ConfigCode   = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().ConfigCode;
				_self.LInspNo      = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().LInspNo;
				_self.Cart         = e.getParameters().listItem.getBindingContext("getAllDataJModel").getObject().Cart;
				
				FitNo      = _self.FitinspNo;
				InspNo     = _self.InspectionNo;
				PlanGuid   = _self.PlanGuid;
				RevNo      = _self.PlanRevno;
				ItemNumber = _self.PlanItemNo;
				WearClass  = _self.WearClass;
				NsdClass   = _self.NsdClass;
				ConfigCode = _self.ConfigCode;
				LastInspNo = _self.LInspNo;
				Cart       = _self.Cart;
				
				var oView = this.getView().byId("idFitmentTabFilter");
				var oView1 = this.getView().byId("hiddenReadings");
				
				_self.getInspDataJModel = oView.getModel("getInspDataJModel");
				
				if (!_self.getInspDataJModel) {
					_self.getInspDataJModel = new sap.ui.model.json.JSONModel();
					oView.setModel(_self.getInspDataJModel, "getInspDataJModel");
				}
				var sPathgetAllDataSet = "/FitmentHeaderSet(PlanGuid='" + _self.PlanGuid +"',PlanRevno='" + _self.PlanRevno + "',PlanItemNo='" + _self.PlanItemNo + "',RegNo='" + _self.RegNo + "',Cart='"+Cart+"',LInspNo='"+LastInspNo+"',FitmentNo='" + _self.FitinspNo + "',InspNo='" + _self.InspectionNo + "')?$expand=NavtoFitmentDetail";
				var frameworkODataModel = this.getOwnerComponent().getModel();
				var oParamsGetAllDataSet = {};
				oParamsGetAllDataSet.context = "";
				oParamsGetAllDataSet.urlParameters = "";
				
				oParamsGetAllDataSet.success = function(oData, oResponse) { // success handler
					debugger
					
					sap.ui.core.BusyIndicator.hide(); 
					_self.getInspDataJModel.setData(oData);
					oView.setModel(_self.getInspDataJModel);
					oView1.setModel(_self.getInspDataJModel);
					_self.getView().byId("TRHeaderFormEdit").bindElement("/");
					_self.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
					_self.getView().byId("VD_1").setText("Plan #: " + that.TestPlanNumber);
					_self.getView().byId("VD_2").setText("Vehicle #: " + _self.RegNo);
					
					RegNo = _self.RegNo;
					
				//	oData.NavtoFitmentDetail.results[0].Defect = "adad";
					 
					var Instbl = _self.getView().byId("idInspectionTable").getItems();	
					for(var i=0;i<Instbl.length;i++){
						
						//change sumit
				     var j = Instbl[i].getCells()[5].getSelectedKey();
				    Instbl[i].getCells()[5].setEnabled(true);
				    
				    if(j=="R"){
				    	Instbl[i].getCells()[6].setVisible(true);//change
				    	
				    	if(oData.Cart == "X" && 
				    	   (oData.NavtoFitmentDetail.results[i].RemoveO == oData.NavtoFitmentDetail.results[i].RemoveOk)){
				    	Instbl[i].getCells()[4].setType("Accept");
				    	Instbl[i].getCells()[4].setEnabled(false);
				    	Instbl[i].getCells()[7].setEnabled(false);			
				    	Instbl[i].getCells()[5].setEnabled(false);	
				    	Instbl[i].getCells()[1].setEnabled(false);
				    	
				    	}else if(oData.Cart != "X"){
				    		Instbl[i].getCells()[4].setType("Accept");	
				    		Instbl[i].getCells()[4].setEnabled(false);
					    	Instbl[i].getCells()[7].setEnabled(true);	// image attachment true in table 		
					    	Instbl[i].getCells()[5].setEnabled(false);
					    	Instbl[i].getCells()[1].setEnabled(false);
				    	};
				    }
				   	else if(j == "O"){
				   		Instbl[i].getCells()[5].setEnabled(true);
				    	Instbl[i].getCells()[6].setVisible(false);//change
				    	Instbl[i].getCells()[4].setEnabled(true);
					    Instbl[i].getCells()[7].setEnabled(true);
				    }
					}
					
					//set Date format by Ram
					var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	                     pattern : "dd-MM-yyyy"
					});
					_self.getView().byId("VD_3").setText("Fitment Date: " + oDateFormat.format(oData.FitmentDt));
					//_self.getView().byId("VD_3").setText("Fitment Date: " + oData.FitmentDt);
					FitmentDate = oData.FitmentDt;
					LastInspDt  = oData.LInspDt;
					ConfigCode 	= _self.ConfigCode;
					inspdt 		= oData.InspDt; 
					
					/*if(inspdt!==null){   //Changed-25-06-2019
						_self.getView().byId("InspDate").setEnabled(false);
					}else{
						_self.getView().byId("InspDate").setEnabled(true);
					}*/
					
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
					
					if(oData.MeterStatus == "Y"){
						_self.getView().byId("MiloStatus").setState(true);
					}else if(oData.MeterStatus == "N"){							
						_self.getView().byId("MiloStatus").setState(false);
					}
					
					if(oData.Rotation == "X"){
						_self.getView().byId("idRotation").setState(true);
					}
					else{
						_self.getView().byId("idRotation").setState(false);
					}	
					 
					_self.onRotChange();
					
					_self.onMiloMeter(oData.Cart);
					/*inspdt = _self.getView().byId("InspDate").getValue(); */
/* */			    debugger
					_self.getAttachmentDetails(oData.PlanGuid,oData.FitmentNo,
							oData.InspNo,
							oData.PlanRevno,
							oData.PlanItemNo,
							oData.RegNo);  		// document upload
/* */
//					that.createDataModels();
//					that.bindTestCategorySet();
				
					_self.getView().byId("idMiloReading").setValue(oData.MeterReading);
					_self.getView().byId("idKmCovered").setValue(oData.KmCovered);
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
	showReading : function(evt){
			debugger
			
			this.getView().byId("InspDate").setValueState("None");
			if (inspdt == null || inspdt == ""){
				sap.m.MessageToast.show("Inspection Date is required");
				this.getView().byId("InspDate").setValueState("Error")
				return false;
			}
			
			var covered = this.getView().byId("idKmCovered").getValue();
			var checkreading = this.readingcheck();
			
			if(checkreading){
				return false;
			}
			
				this.path = evt.getSource().getParent().getBindingContextPath();
				var reading = this.getView().byId("formReading");
				reading.bindElement(this.path);
				
				this.getView().byId("Id_bt2").setVisible(false);
				this.getView().byId("Id_bt1").setVisible(false);
				
				//Disable all tabs except 'Readings Tab'
				this.getView().byId("idTestReqTabFilter").setEnabled(false);
				this.getView().byId("idFitmentTabFilter").setEnabled(false);
				this.getView().byId("idDocumentTabFilter").setEnabled(false);
				this.getView().byId("hiddenReadings").setEnabled(true);
				
				this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("D");
				
				var table= this.getView().byId("idInspectionTable")
				this.selIndex = table.getItems().indexOf(evt.getSource().getParent());
				var rowDataReading = reading.getObjectBinding().getModel().getData().NavtoFitmentDetail.results[this.selIndex];
				var grooveNo = rowDataReading.Groove;
				var oldGroove = [	
					this.getView().byId("oG1"),
					this.getView().byId("oG2"),
					this.getView().byId("oG3"),
					this.getView().byId("oG4"),
					this.getView().byId("oG5"),
					this.getView().byId("oG6"),
				];
				jQuery.each(oldGroove, function(i, input) {
						
						if(grooveNo > i){
							input.setVisible(true);							
						}else{
							input.setVisible(false);
						}	
				});
				var newGroove = [	
					this.getView().byId("idG1"),
					this.getView().byId("idG2"),
					this.getView().byId("idG3"),
					this.getView().byId("idG4"),
					this.getView().byId("idG5"),
					this.getView().byId("idG6"),
				];
				jQuery.each(newGroove, function(i, input) {
						
						if(grooveNo > i){
							input.setVisible(true);
						}else{
							input.setVisible(false);
						}		
				});
				var oldGrooveLbl = [	
					this.getView().byId("oG1lbl"),
					this.getView().byId("oG2lbl"),
					this.getView().byId("oG3lbl"),
					this.getView().byId("oG4lbl"),
					this.getView().byId("oG5lbl"),
					this.getView().byId("oG6lbl"),
				];
				jQuery.each(oldGrooveLbl, function(i, input) {
					
					if(grooveNo > i){
						input.setVisible(true);	
					}else{
						input.setVisible(false);
					}	
			});
				var newGrooveLbl = [	
					this.getView().byId("idG1Lbl"),
					this.getView().byId("idG2Lbl"),
					this.getView().byId("idG3Lbl"),
					this.getView().byId("idG4Lbl"),
					this.getView().byId("idG5Lbl"),
					this.getView().byId("idG6Lbl"),
				];
				jQuery.each(newGrooveLbl, function(i, input) {
					
					if(grooveNo > i){
						input.setVisible(true);		
					}else{
						input.setVisible(false);
					}		
			});
				
				this.getView().byId("RD_01").setText("Plan #: " + that.TestPlanNumber);
				this.getView().byId("RD_02").setText("Stencil #: " + rowDataReading.StnclNumber);
				this.getView().byId("RD_03").setText("Tyre Pos. #: " + rowDataReading.TyrePosition);
				
				var lastinspno = this.getView().byId("LInspNo").getText();
				var lastinspdt = this.getView().byId("LInspDate").getText();
				var currinspno = this.getView().byId("InspNo").getText();
				var currinspdt = this.getView().byId("InspDate").getDateValue();
				if (currinspdt!=null){
					var currinspdt = this.payLoadDispDate(currinspdt);
				}	
				else{
					var currinspdt = this.getView().byId("InspDate").getValue();
				};
				
				this.getView().byId("idInspNo").setText(currinspno + " / " + currinspdt);	
				if(lastinspno!=""){
				this.getView().byId("idLInspNo").setText(lastinspno + " / " + lastinspdt);
				}
				 
				covered 	= covered - rowDataReading.KmSuspended;
				KmCovered 	= covered;
				this.getView().byId("idKmCov").setValue( covered );
				
				TotKmCovered = parseInt(rowDataReading.TotKmCoveredO) + parseInt(covered);
				this.getView().byId("idTotKmCov").setValue( TotKmCovered );
				
				//last reading data
				var coveredO = this.getView().byId("LKMCovered").getText();
				coveredO 	= coveredO - rowDataReading.KmSuspendedO;
				KmCoveredO 	= coveredO;
				this.getView().byId("idKmCovO").setValue( covered );
				
				TotKmCoveredO = parseInt(rowDataReading.TotKmCoveredO);
				this.getView().byId("idTotKmCovO").setValue( TotKmCoveredO );
							
				
			//  this.getView().byId("idTotKmCov1").setValue( rowDataReading.TotKmCovered );
			//	this.getView().byId("OidTotKmCov1").setValue( rowDataReading.TotKmCoveredO );
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
			
			if(checkEmpty == true) return false;
			if(checkValue == true) return false;
			
					this.getView().byId("Id_bt2").setVisible(true);
					this.getView().byId("Id_bt1").setVisible(true);
					var table= this.getView().byId("idInspectionTable")
					if(table.getItems()[this.selIndex].getCells()[3].getMetadata()._sUIDToken == "button"){
						table.getItems()[this.selIndex].getCells()[3].setType("Accept");
					}
					if(table.getItems()[this.selIndex].getCells()[4].getMetadata()._sUIDToken == "button"){
						table.getItems()[this.selIndex].getCells()[4].setType("Accept");
					}
					
			this.getView().byId("MiloStatus").setEnabled(false);
			this.getView().byId("idMiloReading").setEnabled(false);
			this.getView().byId("idKmCovered").setEnabled(false);
			
			this.getView().byId("idTestReqTabFilter").setEnabled(true);
			this.getView().byId("idFitmentTabFilter").setEnabled(true);
			this.getView().byId("idDocumentTabFilter").setEnabled(true);
			this.getView().byId("hiddenReadings").setEnabled(false);
			
			this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onTabelEntriesClose:function(){
			debugger
			
			this.getView().byId("Id_bt2").setVisible(true);
			this.getView().byId("Id_bt1").setVisible(true);
			
			this.getView().byId("idTestReqTabFilter").setEnabled(true);
			this.getView().byId("idFitmentTabFilter").setEnabled(true);
			this.getView().byId("idDocumentTabFilter").setEnabled(true);
			
			this.getView().byId("id_IconTabBar_ctp_WL").setSelectedKey("B");
			
			this.getView().byId("hiddenReadings").setEnabled(false);
		},
//////////////////////////////////////////////////////////////////////////////////////////////////				
			ongrooveG1 : function(e){
						debugger
						var that = this;
						that.source = e.getSource();
						
							var table= this.getView().byId("idInspectionTable");
							var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
							if(a.G1l1nsd == "0.0"){a.G1l1nsd=""};
							if(a.G1l2nsd == "0.0"){a.G1l2nsd=""};
							if(a.G1l3nsd == "0.0"){a.G1l3nsd=""};
							if(a.G1l4nsd == "0.0"){a.G1l4nsd=""};
							table.getModel("getInspDataJModel").refresh();	  
						  
				            if (!that.fragG1) {
				              that.fragG1 = sap.ui.xmlfragment(
				                "zinspection.view.g1", that);
//				              that.getView().addDependent(that.fragG1);
				              that.fragG1.setModel(that.getInspDataJModel);  
				            }
				            that.fragG1.getContent()[0].bindElement(that.path);
				            that.fragG1.open();
				          },
			          
			ongrooveG2 : function(e){
					  var that = this;
					  that.source = e.getSource();
					  
						var table= this.getView().byId("idInspectionTable");
						var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
						if(a.G2l1nsd == "0.0"){a.G2l1nsd=""};
						if(a.G2l2nsd == "0.0"){a.G2l2nsd=""};
						if(a.G2l3nsd == "0.0"){a.G2l3nsd=""};
						if(a.G2l4nsd == "0.0"){a.G2l4nsd=""};
						table.getModel("getInspDataJModel").refresh();
					  
			            if (!that.fragG2) {
			              that.fragG2 = sap.ui.xmlfragment(
			                "zinspection.view.g2", that);
//			              that.getView().addDependent(that.fragG2);
			              that.fragG2.setModel(that.getInspDataJModel);    
			            }
			            that.fragG2.getContent()[0].bindElement(that.path);
			            that.fragG2.open();
			          },
			ongrooveG3 : function(e){
						  var that = this;
						  that.source = e.getSource();
						  
							var table= this.getView().byId("idInspectionTable");
							var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
							if(a.G3l1nsd == "0.0"){a.G3l1nsd=""};
							if(a.G3l2nsd == "0.0"){a.G3l2nsd=""};
							if(a.G3l3nsd == "0.0"){a.G3l3nsd=""};
							if(a.G3l4nsd == "0.0"){a.G3l4nsd=""};
							table.getModel("getInspDataJModel").refresh();
							
				            if (!that.fragG3) {
				              that.fragG3 = sap.ui.xmlfragment(
				                "zinspection.view.g3", that);
//				              that.getView().addDependent(that.fragG3);
				              that.fragG3.setModel(that.getInspDataJModel);    
				            }
				            that.fragG3.getContent()[0].bindElement(that.path);
				            that.fragG3.open();
				          },
				          
			ongrooveG4 : function(e){
					  var that = this;
					  that.source = e.getSource();
					  
						var table= this.getView().byId("idInspectionTable");
						var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
						if(a.G4l1nsd == "0.0"){a.G4l1nsd=""};
						if(a.G4l2nsd == "0.0"){a.G4l2nsd=""};
						if(a.G4l3nsd == "0.0"){a.G4l3nsd=""};
						if(a.G4l4nsd == "0.0"){a.G4l4nsd=""};
						table.getModel("getInspDataJModel").refresh();
					  
			            if (!that.fragG4) {
			              that.fragG4 = sap.ui.xmlfragment(
			                "zinspection.view.g4", that);
//			              that.getView().addDependent(that.fragG4);
			              that.fragG4.setModel(that.getInspDataJModel);    
			            }
			            that.fragG4.getContent()[0].bindElement(that.path);
			            that.fragG4.open();
			          },
			          
			ongrooveG5 : function(e){
							  var that = this;
							  that.source = e.getSource();
							  
								var table= this.getView().byId("idInspectionTable");
								var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
								if(a.G5l1nsd == "0.0"){a.G5l1nsd=""};
								if(a.G5l2nsd == "0.0"){a.G5l2nsd=""};
								if(a.G5l3nsd == "0.0"){a.G5l3nsd=""};
								if(a.G5l4nsd == "0.0"){a.G5l4nsd=""};
								table.getModel("getInspDataJModel").refresh();
							  
					            if (!that.fragG5) {
					              that.fragG5 = sap.ui.xmlfragment(
					                "zinspection.view.g5", that);
//					              that.getView().addDependent(that.fragG5);
					              that.fragG5.setModel(that.getInspDataJModel);    
					            }
					            that.fragG5.getContent()[0].bindElement(that.path);
					            that.fragG5.open();
					          },
					          
			ongrooveG6 : function(e){ 
						  var that = this;
						  that.source = e.getSource();
						  
							var table= this.getView().byId("idInspectionTable");
							var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
							if(a.G6l1nsd == "0.0"){a.G6l1nsd=""};
							if(a.G6l2nsd == "0.0"){a.G6l2nsd=""};
							if(a.G6l3nsd == "0.0"){a.G6l3nsd=""};
							if(a.G6l4nsd == "0.0"){a.G6l4nsd=""};
							table.getModel("getInspDataJModel").refresh();
						  
				            if (!that.fragG6) {
				              that.fragG6= sap.ui.xmlfragment(
				                "zinspection.view.g6", that);
//				              that.getView().addDependent(that.fragG6);
				              that.fragG6.setModel(that.getInspDataJModel);    
				            }
				            that.fragG6.getContent()[0].bindElement(that.path);
				            that.fragG6.open();
				          },
//////////////////////////////////////////////////////////////////////////////////////////////////
					ongrooveOG1 : function(e){
						          debugger
								  var that = this;
								  that.source = e.getSource();
								  
									var table= this.getView().byId("idInspectionTable");
									var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
									if(a.G1l1nsdO == "0.0"){a.G1l1nsdO=""};
									if(a.G1l2nsdO == "0.0"){a.G1l2nsdO=""};
									if(a.G1l3nsdO == "0.0"){a.G1l3nsdO=""};
									if(a.G1l4nsdO == "0.0"){a.G1l4nsdO=""};
									table.getModel("getInspDataJModel").refresh();								  
								  
						            if (!that.fragOG1) {
						              that.fragOG1 = sap.ui.xmlfragment(
						                "zinspection.view.Og1", that);
						              that.fragOG1.setModel(that.getInspDataJModel);  
						            }
						            that.fragOG1.getContent()[0].bindElement(that.path);
						            that.fragOG1.open();
						          },						          
					          
					ongrooveOG2 : function(e){
							  var that = this;
							  that.source = e.getSource();
							  
								var table= this.getView().byId("idInspectionTable");
								var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
								if(a.G2l1nsdO == "0.0"){a.G2l1nsdO=""};
								if(a.G2l2nsdO == "0.0"){a.G2l2nsdO=""};
								if(a.G2l3nsdO == "0.0"){a.G2l3nsdO=""};
								if(a.G2l4nsdO == "0.0"){a.G2l4nsdO=""};
								table.getModel("getInspDataJModel").refresh();								  
							  
					            if (!that.fragOG2) {
					              that.fragOG2 = sap.ui.xmlfragment(
					                "zinspection.view.Og2", that);
					              that.fragOG2.setModel(that.getInspDataJModel);    
					            }
					            that.fragOG2.getContent()[0].bindElement(that.path);
					            that.fragOG2.open();
					          },
					          
					ongrooveOG3 : function(e){
								  var that = this;
								  that.source = e.getSource();
								  
									var table= this.getView().byId("idInspectionTable");
									var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
									if(a.G3l1nsdO == "0.0"){a.G3l1nsdO=""};
									if(a.G3l2nsdO == "0.0"){a.G3l2nsdO=""};
									if(a.G3l3nsdO == "0.0"){a.G3l3nsdO=""};
									if(a.G3l4nsdO == "0.0"){a.G3l4nsdO=""};
									table.getModel("getInspDataJModel").refresh();
								  
						            if (!that.fragOG3) {
						              that.fragOG3 = sap.ui.xmlfragment(
						                "zinspection.view.Og3", that);
						              that.fragOG3.setModel(that.getInspDataJModel);    
						            }
						            that.fragOG3.getContent()[0].bindElement(that.path);
						            that.fragOG3.open();
						          },
						          
					ongrooveOG4 : function(e){
							  var that = this;
							  that.source = e.getSource();
							  
								var table= this.getView().byId("idInspectionTable");
								var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
								if(a.G4l1nsdO == "0.0"){a.G4l1nsdO=""};
								if(a.G4l2nsdO == "0.0"){a.G4l2nsdO=""};
								if(a.G4l3nsdO == "0.0"){a.G4l3nsdO=""};
								if(a.G4l4nsdO == "0.0"){a.G4l4nsdO=""};
								table.getModel("getInspDataJModel").refresh();	  
							  
					            if (!that.fragOG4) {
					              that.fragOG4 = sap.ui.xmlfragment(
					                "zinspection.view.Og4", that);
					              that.fragOG4.setModel(that.getInspDataJModel);    
					            }
					            that.fragOG4.getContent()[0].bindElement(that.path);
					            that.fragOG4.open();
					          },
					          
					ongrooveOG5 : function(e){
									  var that = this;
									  that.source = e.getSource();
									  
										var table= this.getView().byId("idInspectionTable");
										var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
										if(a.G5l1nsdO == "0.0"){a.G5l1nsdO=""};
										if(a.G5l2nsdO == "0.0"){a.G5l2nsdO=""};
										if(a.G5l3nsdO == "0.0"){a.G5l3nsdO=""};
										if(a.G5l4nsdO == "0.0"){a.G5l4nsdO=""};
										table.getModel("getInspDataJModel").refresh();				  
									  
							            if (!that.fragOG5) {
							              that.fragOG5 = sap.ui.xmlfragment(
							                "zinspection.view.Og5", that);
							              that.fragOG5.setModel(that.getInspDataJModel);    
							            }
							            that.fragOG5.getContent()[0].bindElement(that.path);
							            that.fragOG5.open();
							          },
							          
					ongrooveOG6 : function(e){
								  var that = this;
								  that.source = e.getSource();
								  
									var table= this.getView().byId("idInspectionTable");
									var a = table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex];
									if(a.G6l1nsdO == "0.0"){a.G6l1nsdO=""};
									if(a.G6l2nsdO == "0.0"){a.G6l2nsdO=""};
									if(a.G6l3nsdO == "0.0"){a.G6l3nsdO=""};
									if(a.G6l4nsdO == "0.0"){a.G6l4nsdO=""};
									table.getModel("getInspDataJModel").refresh();	  
								  
								  
						            if (!that.fragOG6) {
						              that.fragOG6= sap.ui.xmlfragment(
						                "zinspection.view.Og6", that);
						              that.fragOG6.setModel(that.getInspDataJModel);    
						            }
						            that.fragOG6.getContent()[0].bindElement(that.path);
						            that.fragOG6.open();
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
				
				//if (NsdClass=="A"){
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
				/*}else{
					if (this.getView().byId("idG2").getVisible()==true){
						var G2 = this.getView().byId("idG2").getValue();
						arr.push(G2);
					}
					if (this.getView().byId("idG3").getVisible()==true){
						var G3 = this.getView().byId("idG3").getValue();	
						arr.push(G3);
					}
				}*/
				
				var minNsd = Math.min.apply(null,arr);
				if(minNsd == Infinity){
					this.getView().byId("minNsd").setValue("");
				}else{
					this.getView().byId("minNsd").setValue(minNsd);
				}
				
				var OrigNsd = this.getView().byId("idOriNsd").getValue();
				var totkm   = this.getView().byId("idTotKmCov").getValue();
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
					var totkm   = this.getView().byId("idTotKmCovO").getValue();
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
			 var pos    = table.getItems()[i].getCells()[0].getText();
			 var rotpos = table.getItems()[i].getCells()[1].getSelectedKey();
			 var rem    = table.getItems()[i].getCells()[5].getSelectedKey();
			 if(rotpos == ""){
			  table.getItems()[i].getCells()[1].setSelectedKey(pos);
			 }else{
				 table.getItems()[i].getCells()[1].setSelectedKey(rotpos);
			 }
			 if(rem=="R"){
				 table.getItems()[i].getCells()[1].setSelectedKey(); 
			 }
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
			if(key=="05" || key=="01"){
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
				//change 06/06/2019
				if(evt.getSource().getSelectedKey()=="R"){
					
						table.getItems()[this.selIndex].getCells()[6].setVisible(true);	
					
				if (!that._RemovalReason) {
					that._RemovalReason = sap.ui.xmlfragment(
						"zinspection.view.RemoveTyreDetails", that);
					that.getView().addDependent(that._RemovalReason);}
			/*	var sPath1="/sap/opu/odata/sap/ZFT_FIELDTESTING_SRV/F4RemovalReasonSet";
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
				sap.ui.getCore().byId("idTyrLoc1").setVisible(true);*/
					that._RemovalReason.open();
			}else if(evt.getSource().getSelectedKey()=="O"){
				table.getItems()[this.selIndex].getCells()[6].setSelectedKey("00").setVisible(false);
			} 	
			}
		},

////////////////////////////Remove Tyre Details Frag Cancel//////////////////////////
		onCancelFrg: function(evt){
			debugger

			this.getView().byId("idInspectionTable").getItems()[this.selIndex].getCells()[5].setSelectedKey("O");
			this.getView().byId("idInspectionTable").getItems()[this.selIndex].getCells()[6].setSelectedKey("00").setVisible(false);
			that._RemovalReason.close();
			that._RemovalReason.destroy(true);
			that._RemovalReason = undefined;
			
			

		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onTyreOk1:function(e){
			debugger
			var Defect=sap.ui.getCore().byId("idMJDefectCode").getValue();
			var RemRes=sap.ui.getCore().byId("idTyrLoc1").getSelectedKey();
			
			
			if(RemRes=="" || RemRes=="00" ){
				sap.m.MessageToast.show("Select Cause of Removal");
				return
			}
			
			if(Defect=="" && sap.ui.getCore().byId("idMJDefect").getVisible()){
				sap.m.MessageToast.show("Select Service Abuse");
				return
			}
			
		
			debugger	
			
			var table= this.getView().byId("idInspectionTable");
			table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex].Defect = Defect;
			table.getModel("getInspDataJModel").getData().NavtoFitmentDetail.results[this.selIndex].RemReason = RemRes;
		
			table.getModel("getInspDataJModel").refresh();
			
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
		        	debugger
		            var sValue = oEvent.getParameter("value");
		            var oFilter = new sap.ui.model.Filter("DefectDesc",sap.ui.model.FilterOperator.Contains,sValue);
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
			var oView = this.getView();
			var WearTypeJModel = oView.getModel("WearTypeJModel");
			if (!WearTypeJModel) {
				WearTypeJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(WearTypeJModel, "WearTypeJModel");
			}
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
		
		bindWearTypeSet: function(){
			var oView = this.getView();
			var WearTypeJModel = oView.getModel("WearTypeJModel");
			if (!WearTypeJModel) {
				WearTypeJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(WearTypeJModel, "WearTypeJModel");
			}
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
			var oView = this.getView();
			var WearTypeJModel = oView.getModel("GravityJModel");
			if (!WearTypeJModel) {
				WearTypeJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(WearTypeJModel, "GravityJModel");
			}
			var sPathTyrePositionSet = "/F4GravitySet";
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
		bindPwaTypeSet: function(){
			var oView = this.getView();
			var WearTypeJModel = oView.getModel("PwaJModel");
			if (!WearTypeJModel) {
				WearTypeJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(WearTypeJModel, "PwaJModel");
			}
			var sPathTyrePositionSet = "/F4PwaSet";
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
		
		bindRemovalReason: function(){
			var oView = this.getView();
			var RemJModel = oView.getModel("RemJModel");
			if (!RemJModel) {
				RemJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(RemJModel, "RemJModel");
			}
			var sPathRemReasonSet = "/F4RemovalReasonSet";
			var frameworkODataModel = this.getOwnerComponent().getModel();
			
			var oParamsRemReasonSet = {};
			oParamsRemReasonSet.context = "";
			oParamsRemReasonSet.urlParameters = "";
			oParamsRemReasonSet.success = function(oData, oResponse) { // success handler
			    debugger
				RemJModel.setData(oData.results);
				
			};
			oParamsRemReasonSet.error = function(oError) { // error handler 		
				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
			}.bind(this);
			frameworkODataModel.read(sPathRemReasonSet, oParamsRemReasonSet);
			frameworkODataModel.attachRequestCompleted(function() {
				
			});
		},		
//////////////////////////////////////////////////////////////////////////////////////////////////		
		bindWearTypeSet: function(){
			var oView = this.getView();
			var WearTypeJModel = oView.getModel("WearTypeJModel");
			if (!WearTypeJModel) {
				WearTypeJModel = new sap.ui.model.json.JSONModel();
				oView.setModel(WearTypeJModel, "WearTypeJModel");
			}
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
onPostionChange: function(oEvent){
			
//			var headersModel =  this.getView().getModel("headersModel").getData();
//			var method = headersModel.testMethodKey;

/*				var idInspectionTable = this.getView().byId("idInspectionTable");
				var index=idInspectionTable.getItems().indexOf(oEvent.getSource().getParent());
				var items = idInspectionTable.getItems();
				var arr = [];
				for(var i=0;i<items.length;i++){
					var key = items[i].getCells()[1].getSelectedKey();
					arr.push(key);
				}
				
				let unique_array = []
			    for(let i = 0;i < arr.length; i++){
			        if(unique_array.indexOf(arr[i]) == -1){
			            unique_array.push(arr[i])
			        }
			    }
				
				if(arr.length > unique_array.length){
					sap.m.MessageToast.show("Position already selected, please select another position.");
					oEvent.getSource().setSelectedKey("");
				}*/
	
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		onMiloMeter : function(cart){
			debugger
			var lm = this.getView().byId("LMiloStatus").getState();
			var m  = this.getView().byId("MiloStatus").getState();	
			if(cart != "X"){
				this.getView().byId("idKmCovered").setValue();
				this.getView().byId("idMiloReading").setValue();
			}
			
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
			
		},
//////////////////////////////////////////////////////////////////////////////////////////////////		
		readingcheck: function(){
			debugger
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
			
			payLoadDispDate: function(SDateValue) {
				var currentTime = new Date(SDateValue);
				var month = currentTime.getMonth() + 1;
				if(month.toString().length == 1)
					month = "0" + month;
				var day = currentTime.getDate();
				if(day.toString().length == 1)
					day = "0" + day;
				var year = currentTime.getFullYear();
				var date = day + "-" + month + "-" + year;
				return date;
			},
			
//////////////////////////////////////////////////////////////////////////////////////////////////
		onSave: function(){
debugger
			
			if(this.getView().byId("VD_1").getText() == ""){
				sap.m.MessageToast.show("Please select Fitment for a Test Plan");
				return false;
			}
				that = this;
				var check = false;
				var value = [];
				var arr=[];
				var data = that.getView().getModel("attachmentModel2").getData();
				var item = this.getView().byId("idInspectionTable").getItems()
				
				for(var i = 0 ; i < item.length ; i++)
				{
					for(var j=0 ; j<data.length ; j++){
					    if(item[i].getCells()[0].getText()== data[j].Pos){
					    	if(data[j].UpdateFlag=='I')
					    		value.push(data[j]);
					    }
					}
				}

				for(var i = 0 ; i < item.length ; i++)
				{
					var count=0;
					for(var j=0 ; j<value.length ; j++){ 
						    
					    if(item[i].getCells()[0].getText() == value[j].Pos )
					    	count=1;
					}
					if(count==0 && value.length != 0) arr.push(item[i].getCells()[0].getText());
					if(value.length == 0) arr.push(item[i].getCells()[0].getText());
				}
				
				var newArr = [];
				$.each(arr, function(i, el){
					if($.inArray(el, newArr) === -1) newArr.push(el);
				});
				
 				var string = "";
				
				for(var i=0;i<newArr.length;i++){
					string = string + newArr[i].toString() + ". ";
				}

				if(newArr.length != 0){
					 sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
									MessageBox.show(
											"No attachments added for position "+string+"", {
											icon: MessageBox.Icon.INFORMATION,
											title: "Do you want to continue?",
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
				}else
				{
					that.onReviewAndSave();
				}
				
		},
			
//////////////////////////////////////////////////////////////////////////////////////////////////
		onReviewAndSave: function(){
			debugger
			this.getView().byId("InspDate").setValueState("None");
			if (inspdt == null || inspdt == ""){
				sap.m.MessageToast.show("Inspection Date is required");
				this.getView().byId("InspDate").setValueState("Error");
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
					if(tabItems[k].getCells()[1].getEnabled() == true){
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
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		onCart: function(){
			debugger
			
			if(this.getView().byId("VD_1").getText() == ""){
				sap.m.MessageToast.show("Please select Fitment for a Test Plan");
				return false;
			}
			
			var cart = "X";
			this.getView().byId("InspDate").setValueState("None");
			if (inspdt == null || inspdt == ""){
				sap.m.MessageToast.show("Inspection Date is required");
				this.getView().byId("InspDate").setValueState("Error");
				return false;
			}
			this.saveData(cart);
		},
//////////////////////////////////////////////////////////////////////////////////////////////////
		saveData: function(cart){
			debugger
			
			var _self= this;
			var tableData = this.getView().byId("idInspectionTable").getModel().getData().NavtoFitmentDetail.results;
			var l = tableData["length"];
			var laChild = [];
			
			for (var i in tableData){
				if (tableData[i].G1l4nsd<0 || tableData[i].G1l4nsd == ""){
					tableData[i].G1l4nsd="0.0";
				}
				if (tableData[i].G2l4nsd<0 || tableData[i].G2l4nsd == ""){
					tableData[i].G2l4nsd="0.0";
				}
				if (tableData[i].G3l4nsd<0 || tableData[i].G3l4nsd == ""){
					tableData[i].G3l4nsd="0.0";
				}
				if (tableData[i].G4l4nsd<0 || tableData[i].G4l4nsd == ""){
					tableData[i].G4l4nsd="0.0";
				}
				if (tableData[i].G1l4nsdO<0 || tableData[i].G1l4nsdO == ""){
					tableData[i].G1l4nsdO="0.0";
				}
				if (tableData[i].G2l4nsdO<0 || tableData[i].G2l4nsdO == ""){
					tableData[i].G2l4nsdO="0.0";
				}
				if (tableData[i].G3l4nsdO<0 || tableData[i].G3l4nsdO == ""){
					tableData[i].G3l4nsdO="0.0";
				}
				if (tableData[i].G4l4nsdO<0 || tableData[i].G4l4nsdO == ""){
					tableData[i].G4l4nsdO="0.0";
				}
				if (tableData[i].MilageProjO<0 || tableData[i].MilageProjO == ""){
					tableData[i].MilageProjO="0.0";
				}
				if (tableData[i].WearO<0 || tableData[i].WearO == ""){
					tableData[i].WearO="0.0";
				}		
				if (tableData[i].KmPerMmO<0 || tableData[i].KmPerMmO == ""){
					tableData[i].KmPerMmO="0.0";
				}	
				if (tableData[i].MilageProj<0 || tableData[i].MilageProj == ""){
					tableData[i].MilageProj="0.0";
				}	
				if (tableData[i].Wear<0 || tableData[i].Wear == ""){
					tableData[i].Wear="0.0";
				}	
				if (tableData[i].KmPerMm<0 || tableData[i].KmPerMm == ""){
					tableData[i].KmPerMm="0.0";
				}				
				
			}
			
			for ( var i in tableData) {
				
				laChild.push({
								FitinspNo: 		tableData[i].FitinspNo,
								Groove: 		tableData[i].Groove,
								GroupType: 		tableData[i].GroupType,
								InspectionNo: 	tableData[i].InspectionNo,
								
								OrgNsd: 	tableData[i].OrgNsdO,
								OrgNsdO: 	tableData[i].OrgNsdO,
								
								G1Nsd: 		tableData[i].G1Nsd,
								G1NsdO: 	tableData[i].G1NsdO,
								G1l1nsd:	tableData[i].G1l1nsd,
								G1l2nsd: 	tableData[i].G1l2nsd,
								G1l3nsd: 	tableData[i].G1l3nsd,
								G1l4nsd: 	tableData[i].G1l4nsd,
								G1l1nsdO: 	tableData[i].G1l1nsdO,
								G1l2nsdO: 	tableData[i].G1l2nsdO,
								G1l3nsdO: 	tableData[i].G1l3nsdO,
								G1l4nsdO: 	tableData[i].G1l4nsdO,
								
								G2Nsd: 		tableData[i].G2Nsd,
								G2NsdO: 	tableData[i].G2NsdO,
								G2l1nsd: 	tableData[i].G2l1nsd,
								G2l2nsd: 	tableData[i].G2l2nsd,
								G2l3nsd: 	tableData[i].G2l3nsd,
								G2l4nsd: 	tableData[i].G2l4nsd,
								G2l1nsdO: 	tableData[i].G2l1nsdO,
								G2l2nsdO: 	tableData[i].G2l2nsdO,
								G2l3nsdO: 	tableData[i].G2l3nsdO,
								G2l4nsdO: 	tableData[i].G2l4nsdO,
								
								G3Nsd: 		tableData[i].G3Nsd,
								G3NsdO: 	tableData[i].G3NsdO,
								G3l1nsd: 	tableData[i].G3l1nsd,
								G3l2nsd: 	tableData[i].G3l2nsd,
								G3l3nsd: 	tableData[i].G3l3nsd,
								G3l4nsd: 	tableData[i].G3l4nsd,
								G3l1nsdO: 	tableData[i].G3l1nsdO,
								G3l2nsdO: 	tableData[i].G3l2nsdO,
								G3l3nsdO: 	tableData[i].G3l3nsdO,
								G3l4nsdO: 	tableData[i].G3l4nsdO,
								
								G4Nsd: 		tableData[i].G4Nsd,
								G4NsdO: 	tableData[i].G4NsdO,
								G4l1nsd: 	tableData[i].G4l1nsd,
								G4l2nsd: 	tableData[i].G4l2nsd,
								G4l3nsd: 	tableData[i].G4l3nsd,
								G4l4nsd: 	tableData[i].G4l4nsd,
								G4l1nsdO: 	tableData[i].G4l1nsdO,
								G4l2nsdO: 	tableData[i].G4l2nsdO,
								G4l3nsdO: 	tableData[i].G4l3nsdO,
								G4l4nsdO: 	tableData[i].G4l4nsdO,
								
								G5Nsd: 		tableData[i].G5Nsd,
								G5NsdO: 	tableData[i].G5NsdO,
								G5l1nsd: 	tableData[i].G5l1nsd,
								G5l2nsd: 	tableData[i].G5l2nsd,
								G5l3nsd: 	tableData[i].G5l3nsd,
								G5l4nsd: 	tableData[i].G5l4nsd,
								G5l1nsdO: 	tableData[i].G5l1nsdO,
								G5l2nsdO: 	tableData[i].G5l2nsdO,
								G5l3nsdO: 	tableData[i].G5l3nsdO,
								G5l4nsdO: 	tableData[i].G5l4nsdO,
								
								G6Nsd: 		tableData[i].G6Nsd,
								G6NsdO: 	tableData[i].G6NsdO,
								G6l1nsd: 	tableData[i].G6l1nsd,
								G6l2nsd: 	tableData[i].G6l2nsd,
								G6l3nsd: 	tableData[i].G6l3nsd,
								G6l4nsd: 	tableData[i].G6l4nsd,
								G6l1nsdO: 	tableData[i].G6l1nsdO,
								G6l2nsdO: 	tableData[i].G6l2nsdO,
								G6l3nsdO: 	tableData[i].G6l3nsdO,
								G6l4nsdO: 	tableData[i].G6l4nsdO,
								
								Gravity: 	tableData[i].Gravity,
								GravityO: 	tableData[i].GravityO,								
								
								Hardness: 	tableData[i].Hardness,
								HardnessO: 	tableData[i].HardnessO,
								
								
								IpCondition:  tableData[i].IpCondition,
								IpConditionO: tableData[i].IpConditionO,
								
								IpPsi: 		parseInt(tableData[i].IpPsi),
								IpPsiO: 	parseInt(tableData[i].IpPsiO),	
								
								KmPerMm :  	parseInt(tableData[i].KmPerMm),
								KmPerMmO :	parseInt(tableData[i].KmPerMmO),
								
								KmCovered:  parseInt(tableData[i].KmCovered),
								KmCoveredO: parseInt(tableData[i].KmCoveredO),
								
								KmSuspended: 	parseInt(tableData[i].KmSuspended),
								KmSuspendedO: 	parseInt(tableData[i].KmSuspendedO),
								
								TotKmCoveredO: 	parseInt(tableData[i].TotKmCoveredO),
								TotKmCovered: 	parseInt(tableData[i].TotKmCovered),
								
								MilageProj: 	parseInt(tableData[i].MilageProj),
								MilageProjO: 	parseInt(tableData[i].MilageProjO),
								
								Wear: 		tableData[i].Wear,
								WearO: 		tableData[i].WearO,
								
								MinNsd: 	tableData[i].MinNsd,
								MinNsdO: 	tableData[i].MinNsdO,
								
								Pwa: 		tableData[i].Pwa,
								PwaO: 		tableData[i].PwaO,
								
								Remarks: 	tableData[i].Remarks,
								RemarksO: 	tableData[i].RemarksO,
								
								Status: 	tableData[i].Status,
								StatusO: 	tableData[i].StatusO,
								
								WearType: 	tableData[i].WearType,
								WearTypeO: 	tableData[i].WearTypeO,
								
								PlanGuid: 	tableData[i].PlanGuid,
								PlanItemNo: tableData[i].PlanItemNo,
								PlanRevno: 	tableData[i].PlanRevno,

								RegNo: 		tableData[i].RegNo,
								RemoveOk: 	tableData[i].RemoveOk,
								StnclNumber: tableData[i].StnclNumber,
								TyrePosition: tableData[i].TyrePosition,							
								RemReason:tableData[i].RemReason,
								Defect:tableData[i].Defect,
								RotPos:tableData[i].RotPos,
								RemoveFlag:tableData[i].RemoveFlag,
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
			
			// change 04/06/2019 inspection date
			if( inspdt !=null){
				inspdt = this.payLoadDate(inspdt);		
			 } 
			
			debugger
			
			oEntry.SaveMode     = "I";
			oEntry.Cart     	= cart;
			oEntry.PlanGuid     = _self.PlanGuid ;
			oEntry.PlanRevno    = _self.PlanRevno;
			oEntry.PlanItemNo   = _self.PlanItemNo;
			oEntry.RegNo        = _self.RegNo;
			oEntry.FitmentNo    = _self.FitinspNo;
			oEntry.InspNo       = _self.InspectionNo;
			oEntry.LInspNo      = _self.LInspNo;
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
    					 oResponse.data.FitmentNo,
    					 oResponse.data.InspNo);         	// Document Upload
            	 
            	 debugger
            	 for ( var i=0; i<laChild.length ; i++){
            	 that.saveUploadedDocs2(oResponse.data.PlanGuid,
            			 oResponse.data.PlanRevno,
            			 oResponse.data.PlanItemNo,
     					 oResponse.data.RegNo,
    					 oResponse.data.FitmentNo,
    					 oResponse.data.InspNo,
    					 laChild[i].TyrePosition,
    					 laChild[i].StnclNumber
    					 );         	// Document Upload     
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
		},
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
				setTimeout(function() {
					sap.m.MessageToast.show("Uploaded successfully");
				}, 4000);
			}
		    else if (oEvent.getParameter("files")[0].status == "0") {
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
	      getAttachmentDetails: function(GuId,FitNo,InspNo,RevNo,ItemNo,RegNo){								//document upload
	    	    debugger
				var oView = this.getView();
				var oUploadModel = this.getView().getModel("oUploadModel");
				var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
				var Reg = RegNo.padStart(20,'0');
				var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='04',ObjectName='"+GuId+RevNo+ItemNo+Reg+FitNo+"')?$expand=ImageObjectToDataNvg";
				var oParamsAttachmentSet = {};
				oParamsAttachmentSet.context = "";
				oParamsAttachmentSet.urlParameters = "";
				oParamsAttachmentSet.success = function(oData, oResponse) {
					debugger
					
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
					
					var upload = that.getView().byId("UploadCollection");
					upload.addEventDelegate({
						onAfterRendering: function(){
							debugger
							var item = that.getView().byId("UploadCollection").getItems();
							
							for(var i = 0 ; i<item.length ; i++){
								if(item[i].oBindingContexts.oUploadModel.oModel.oData.items[i].NoDelete == 'X'){
									that.getView().byId("UploadCollection").getItems()[i].setVisibleDelete(false);
								}else
									that.getView().byId("UploadCollection").getItems()[i].setVisibleDelete(true);
							}
						}
					},upload);
					
				};
				oParamsAttachmentSet.error = function(oError) {
					jQuery.sap.log.error("read publishing group data failed");
				}.bind(this);

				oCreateModel1.read(sPathAttachmentSet, oParamsAttachmentSet);

				oCreateModel1.attachRequestCompleted(function() {
					
				});
			},

//////////////////////////////////////////////////////////////////////////////////////////////////

			saveUploadedDocs: function(guid,revno,item,regno,fitno,inspno){											// document upload
				var payload = that.createDocsPayload(guid,revno,item,regno,fitno,inspno);
				var oView = this.getView();
				var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
				var sPathPOHeaderSet = "/ImageUploadObjectSet";
				var oParamsPOHeaderSet = {};
				oParamsPOHeaderSet.context = "";
				oParamsPOHeaderSet.urlParameters = "";
				oParamsPOHeaderSet.success = function(oData, oResponse) {
				
				};
				oParamsPOHeaderSet.error = function(oError) {
					jQuery.sap.log.error("read publishing group data failed");
				}.bind(this);

				oCreateModel1.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

				oCreateModel1.attachRequestCompleted(function() {
					
				});
			},
			
			createDocsPayload: function(guid,revno,item,regno,fitno,inspno){											// document upload
				debugger
				regno = regno.padStart(20, '0');
				var payload={
						ObjectID: "04",
						ObjectName: guid+revno+item+regno+fitno+inspno,
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

				var GetPath = oEvent.getSource().getBindingContext("getInspDataJModel").getPath().split('/NavtoFitmentDetail/results/')[1];
				var GetData = oEvent.getSource().getBindingContext("getInspDataJModel").getModel().getData().NavtoFitmentDetail.results[GetPath].RemoveOk;

				if (!this.oUploadDialog) {
					this.oUploadDialog = sap.ui.xmlfragment("zinspection.view.UploadDialog", this);
					this.getView().addDependent(this.oUploadDialog);
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
	
					/*if ( GetData =="R" ){
						sap.ui.getCore().byId("UploadCollection1").setUploadEnabled(false);
						sap.ui.getCore().byId("idupload").setVisibleDelete(false);
					}else{
						sap.ui.getCore().byId("UploadCollection1").setUploadEnabled(true);
						sap.ui.getCore().byId("idupload").setVisibleDelete(true);
					}*/

					TyrePos = gModel.NavtoFitmentDetail.results[this.sPDFIndex].TyrePosition;
					TyreStn = gModel.NavtoFitmentDetail.results[this.sPDFIndex].StnclNumber;
					var Reg = RegNo.padStart(20,'0');
					var Stl = TyreStn.padStart(12,'0');
					var Pos = TyrePos.padStart(5,'0');
					var itemobject = PlanGuid+RevNo+ItemNumber+Reg+FitNo+Stl; 
					this.getAttachmentDetails2(itemobject);
					this.oUploadDialog.open();
					sap.ui.getCore().byId("UploadCollection1").getModel("oUploadModel2").refresh();
					
					var upload = sap.ui.getCore().byId("UploadCollection1");
					upload.addEventDelegate({
						onAfterRendering: function(){
							debugger
							var item = sap.ui.getCore().byId("UploadCollection1").getItems();
							
							for(var i = 0 ; i<item.length ; i++){
								if(item[i].oBindingContexts.oUploadModel2.oModel.oData.items[i].NoDelete == 'X'){
									sap.ui.getCore().byId("UploadCollection1").getItems()[i].setVisibleDelete(false);
								}else
									sap.ui.getCore().byId("UploadCollection1").getItems()[i].setVisibleDelete(true);
							}
						}
					},upload);
					
				}
				
			},
			
			onOKUploadDialog : function(oEvent) {
//Added on May 6
				var a = sap.ui.getCore().byId("UploadCollection1").getModel("oUploadModel2").getData();
				if(a.items.length > 0)
					color.setType("Default");
				else
					color.setType("Reject");
				
				this.oUploadDialog.close();
			},

onReFitment:function(){
	debugger
	var check = 0;
	var readingcheck = 0;
	var stencils = this.getInspDataJModel.oData.NavtoFitmentDetail.results;
	var selectedData = {};
	selectedData.table = [];
	
	for(var i=0 ; i<stencils.length ; i++){
		if(stencils[i].RemoveOk == "R"){
			check = check+1;
			var tyre = {
						/*"Position":stencils[i].TyrePosition,*/
						"StencilNo":stencils[i].StnclNumber,
						"Maktx":stencils[i].Maktx
						}
			selectedData.table.push(tyre);
			
			if(this.getView().byId("idInspectionTable").getItems()[i].getCells()[4].getType()=="Accept") 
				readingcheck = readingcheck+1;
			
		}
	}
	
	if(check<1){
		sap.m.MessageToast.show("Remove atleast one stencil for Re-Fitment");
		return false;
	}
	
	if(readingcheck < check){
		sap.m.MessageToast.show("Please enter readings for all removed tyre(s)");
		return false;
	}

	selectedData.TestPlanNumber = this.TestPlanNumber;
	selectedData.TestMethodology = this.TestMethDesc;
	selectedData.VehicleNo = RegNo;

	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("S2",{"entity":JSON.stringify(jsonstring)});

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
			//that.saveUploadedDocs(that.SelectedData.planguid, that.SelectedData.planrevno);			// document upload
			
			// _onRoute
			//this.getAttachmentDetails(this.SelectedData.planguid,this.SelectedData.planrevno);		// document upload
		
			
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
						debugger
						
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
									// 
									uploadDetails.NoDelete = oData.ImageObjectToDataNvg.results[i].NoDelete;
									//
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
										//
										uploadDetails.NoDelete = oData.ImageObjectToDataNvg.results[i].NoDelete;
										//
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
								//
								uploadDetails.NoDelete = modeldata[i].NoDelete;
								//
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
				
				saveUploadedDocs2: function(guid,revno,item,regno,fitno,inspno,pos,stclno){               						// document upload
					var payload = that.createDocsPayload2(guid,revno,item,regno,fitno,inspno,pos,stclno);
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

				createDocsPayload2: function(guid,revno,item,regno,fitno,inspno,pos,stclno){							// document upload
					debugger
					var reg = regno.padStart(20, '0');
					var stcl = stclno.padStart(12, '0');
					var pos1 = pos.padStart(5, '0');
					var payload={
							ObjectID: "04",
							ObjectName: guid+revno+item+reg+fitno+inspno+stcl,
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

//*************************************File Item Upload Finish************************************

/*************************************************************************************************************/				

	});
});

sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
	  function( JSONModel,UploadCollectionParameter) {
    "use strict";

jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
var that,RacCat,raceType,RacSubType;
sap.ui
    .controller(
        "ZRACEMGMT.view.Create",
        {

          /**
           * Called when a controller is instantiated and its View
           * controls (if available) are already created. Can be used
           * to modify the View before it is displayed, to bind event
           * handlers and do other one-time initialization.
           *
           * @memberOf view.Create
           */
	onInit : function() {
		 
            that=this;
            var iOriginalBusyDelay,

            oViewJModel = new sap.ui.model.json.JSONModel({
              busy: false,
              delay: 0
            });
            this.getView().setModel(oViewJModel, "oViewJModel");
            if (!jQuery.support.touch) {
              this.getView().addStyleClass("sapUiSizeCompact");
            }
            if (sap.ui.Device.system.desktop) {

            }
            sap.ui.core.UIComponent.getRouterFor(this).getRoute(
                "page2").attachMatched(this._onRoute, this);


            var idRaceTable = this.getView().byId("idRaceTable");
            var raceModel = new sap.ui.model.json.JSONModel();
            idRaceTable.setModel(raceModel).bindRows("/");
            this.raceAmountTableData=[];
            this.raceAmountArray = [];

            var raceTable = that.getView().byId("idRaceTable");
            raceTable.addEventDelegate({
            	onAfterRendering :function(){
            			var tAmount = 0;
		        		var rTabl = that.getView().byId("idRaceTable");	
		    			var rows2 = rTabl.getRows();
		    			for(var d=0;d<rows2.length;d++){
		    				var amt = rows2[d].getCells()[1].getValue();
		    				if(amt == ""){
		    					amt = 0;
		    				}
		    				tAmount = parseFloat(tAmount) + parseFloat(amt);
		    			}
		    		that.getView().byId("Race_amtInp").setValue(tAmount);
            	}
    		});
            
    	    	
        // start of document upload
    		var attachmentModel = new sap.ui.model.json.JSONModel();
    		this.getView().setModel(attachmentModel,"attachmentModel");
    		attachmentModel.setData([]);
    		
    		var oUploadModel = new sap.ui.model.json.JSONModel({
    			items : []
    			});
    		
    		this.getView().setModel(oUploadModel,"oUploadModel");
		// end of document upload
    		
    		//Add By Ram
    		var currentDate = new Date;	
    		this.getView().byId("Scedule_DateInp").setMinDate(currentDate);
    		this.getView().byId("gain_expectedInp").setMinDate(currentDate);	
    		this.getRaceCategory(); //Add By Ram
    },
//////////////////////////////////////////////////////////////////////////////////////////////////

    onChangeDate : function(e){
        	  
        	  var today = new Date();
              var sch = this.getView().byId("Scedule_DateInp").getDateValue();
              var TodayDate = today.setHours(0,0,0,0);
              var SchDate = sch.setHours(0,0,0,0);
              if (TodayDate > SchDate) {
            	   sap.m.MessageBox.show("Invalid Date : Please Enter A Future Date", {
              	   title : "Information",
              	   actions : [ 'OK' ],
              	   onClose : function(a) {},
                	});

                   this.getView().byId("Scedule_DateInp").setValue();
                 }        	
          },

     onChangeDate1 : function(e){
        	  
        	  var today = new Date();
              var gain = this.getView().byId("gain_expectedInp").getDateValue();

              if ( today.getTime() > gain.getTime() ) {
                    sap.m.MessageBox.show("Invalid Date : Please Enter A Future Date", {
                  	  title : "Information",
                  	  actions : [ 'OK' ],
                  	  onClose : function(a) {},
                    	});

                    this.getView().byId("gain_expectedInp").setValue();
                  }
          },

//////////////////////////////////////////////////////////////////////////////////////////////////
          _onRoute : function(e) {
//
//            if(e.getParameter("arguments").details !== "CR"){
//              var routeData = JSON.parse(e.mParameters.arguments.details);
//              var idRaceTable = this.getView().byId("idRaceTable");
//              idRaceTable.getRows()[parseInt(routeData.path)].getCells()[1].setValue(routeData.amount);
//
//            }else{
            window.rnA = "";
            var self = this;
//            var oBindingPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceInitialSet?$expand=NavToGain,NavToRaceTypes"
            var oModel = this.getView().getModel();
            var Displaymodel = new sap.ui.model.json.JSONModel();
//            Displaymodel.loadData(oBindingPath, null, false, "GET", false, false, null);
            this.getView().setModel(Displaymodel,"Displaymodel");

           var docDate = new Date();
           var oDateFormat = sap.ui.core.format.DateFormat.getInstance({ pattern : "dd.MM.yyyy" });
           var currentdate =  oDateFormat.format(docDate);
           this.getView().byId("doc_DateInp").setValue(currentdate);
           var raceTypeJModel = new sap.ui.model.json.JSONModel();
           this.getView().setModel(raceTypeJModel,"raceTypeJModel");

//            oModel.setHeaders({
//              "Content-Type" : "application/json"
//            });
            var fncSuccess = function(oData, oResponse) {
              
              if (oData.results.length !== 0) {
                // heder Details
                var DepartmentText = oData.results[0].DepartmentText;
                var FiscalYear = oData.results[0].FiscalYear;
                var PersonnelNumber = oData.results[0].PersonnelNumber;
                var Plant = oData.results[0].Plant;
                var RaceDepartment = oData.results[0].RaceDepartment;
                var DocumentDate = oData.results[0].DocumentDate;

                // set Headr Detrails
                self.getView().byId("race_departInp").setValue(RaceDepartment);
                self.getView().byId("race_depart_text").setValue(DepartmentText);
                
                self.getView().byId("fiscal_YearInp").setValue(
                    FiscalYear);
                self.getView().byId("plantInp").setValue(Plant);
//                self.getView().byId("brief_DescInp").setValue(
//                    DepartmentText);
                self.getView().byId("doc_DateInp").setValue(oDateFormat.format(DocumentDate));

                raceTypeJModel.setData(oData.results[0].NavToRaceTypes.results);
                Displaymodel.setData(oData.results[0]);
              } else {

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
            oModel.read("/RaceInitialSet?$expand=NavToGain,NavToRaceTypes",
                    {
                      success : fncSuccess,
                      error : fncError
                    });
//            }

          },
          

 //crate by Ram         
payLoadDate: function(SDateValue) {
       
     var str = "T00:00:00";
     var currentTime = new Date(SDateValue);
     var month = currentTime.getMonth() + 1;
     var day = currentTime.getDate();
     var year = currentTime.getFullYear();
     var date = year + "-" + month + "-" + day + str;
     return date;
},          
//////////////////////////////////////////////////////////////////////////////////////////////////
    onSave : function() {

            var oEntry = {};
            var fiscal_YearInp = this.getView().byId("fiscal_YearInp").getValue();
            var selectRace = this.getView().byId("selectRace").getSelectedKey();
            var plantInp = this.getView().byId("plantInp").getValue();
            var race_departInp = this.getView().byId("race_departInp").getValue();
            var doc_DateInp = this.getView().byId("doc_DateInp").getDateValue();
            var Race_apprvInp = this.getView().byId("Race_apprvInp").getValue();
            var Race_amtInp = this.getView().byId("Race_amtInp").getValue();
            var titleInp = this.getView().byId("titleInp").getValue();
            var brief_DescInp = this.getView().byId("brief_DescInp").getValue();
            var Scedule_DateInp = this.getView().byId("Scedule_DateInp").getDateValue();
            var gain_expectedInp = this.getView().byId("gain_expectedInp").getDateValue();
            var longText = this.getView().byId("longTxt").getValue();
            var Race_Cat = this.getView().byId("idRaceCat").getSelectedKey();

            /*if(doc_DateInp !=="")
            {
            	var s = doc_DateInp.split(".");
             	doc_DateInp = s[2]+ "-"+ s[1]+ "-"+ s[0]+ "T00:00:00";
            }
            else
            {
            	doc_DateInp=null;
            }*/

             /*var u = Scedule_DateInp.split(".");
             Scedule_DateInp = u[2]+ "-"+ u[1]+ "-"+ u[0]+ "T00:00:00";

             var v = gain_expectedInp.split(".");
             gain_expectedInp = v[2]+ "-"+ v[1]+ "-"+ v[0]+ "T00:00:00";*/
            
          
            //Change all three date format by Ram
            if(doc_DateInp!=null){
            	doc_DateInp = this.payLoadDate(doc_DateInp);		
    		 }
            
            if(Scedule_DateInp!=null){
            	Scedule_DateInp = this.payLoadDate(Scedule_DateInp);		
    		 }
            
            if(gain_expectedInp!=null){
            	gain_expectedInp = this.payLoadDate(gain_expectedInp);		
    		 }
           

// validate
            if (this.getView().byId("idRaceCat").getSelectedKey() === "") {
              	 sap.m.MessageBox.show("Please select race category", {
   		                  title : "Information",
   		                  actions : [ 'OK' ],
   		                  onClose : function(a) {
   		                	
   		                    if (status === "S") {
   		
   		                    	}
   		
   		                  },
                  });
                  return;
            }
            
             if (this.getView().byId("selectRace").getSelectedKey() === "") {
	            	 sap.m.MessageBox.show("Please select race Type", {
			                  title : "Information",
			                  actions : [ 'OK' ],
			                  onClose : function(a) {
			                	
			                    if (status === "S") {
			
			                    	}
			
			                  },
	                });
	                return;
              }
            
            


             if (this.getView().byId("Race_amtInp").getValue() === "") {
                this.getView().byId("Race_amtInp").setValueState(sap.ui.core.ValueState.Error);
                var e = false;
              }else{
                this.getView().byId("Race_amtInp").setValueState(sap.ui.core.ValueState.None);
                var e = true;
            }


             if (this.getView().byId("titleInp").getValue() === "") {
                this.getView().byId("titleInp").setValueState(sap.ui.core.ValueState.Error);
                var c = false;
              }else{
                this.getView().byId("titleInp").setValueState(sap.ui.core.ValueState.None);
                var c = true;
            }

             if (this.getView().byId("Scedule_DateInp").getValue() === "") {
               this.getView().byId("Scedule_DateInp").setValueState(sap.ui.core.ValueState.Error);
               var b = false;
              }else{
                this.getView().byId("Scedule_DateInp").setValueState(sap.ui.core.ValueState.None);
                var b = true;
            }

             if (this.getView().byId("gain_expectedInp").getValue() === "") {
            	 	this.getView().byId("gain_expectedInp").setValueState(sap.ui.core.ValueState.Error);
            	 	var a = false;
              }else{
            	  this.getView().byId("gain_expectedInp").setValueState(sap.ui.core.ValueState.None);
                  var a = true;
              }

            if(a == false || b == false || c == false || e == false){
		              sap.m.MessageToast.show("Please Fill Mandatory Fields.",{duration : 3000});
		              return;
            }
// Date changes - by Ankit
            
            var creationDate = new Date();
            var sch = new Date(Scedule_DateInp);
            var gain = new Date(gain_expectedInp);

            if ( gain.getTime() < sch.getTime()) {
                  sap.m.MessageBox.show("'Scheduled Completion Date' Should Be Before '100% Gain Expected Date'", {
                	  title : "Information",
                	  actions : [ 'OK' ],
                	  onClose : function(a) {},
                  	});
                  	return;
                }
            

// condition for total amt
                var a = this.getView().byId("Total_CostInp").getValue();
                var b = this.getView().byId("Race_amtInp").getValue();
                a = parseInt(a);
                b = parseInt(b);
                if ( b < a) {
		                sap.m.MessageBox.show("Total Cost Cannot Be Greater Than Race Amount.", {
		                title : "Information",
		                actions : [ 'OK' ],
		                onClose : function(a) {
                },
              });
             return;
                }
             // splitAmoount

            var loItemsAmnt = this.getView().byId("idRaceTable").getRows();
            var NavToPlantAmounts = [];
            var totlAmt = 0;
            for ( var i in loItemsAmnt) {
	              var laCells = loItemsAmnt[i].getCells();
	              var ammount = laCells[1].getValue();
	              totlAmt = totlAmt + parseFloat(ammount);
            }

            var rcAmnt = parseFloat(Race_amtInp)
            if(rcAmnt < totlAmt){
	              sap.m.MessageBox.show("Split Amount Should Be Equal Or Less Than Race Amount.", {
	                // icon
	                // :
	                // sap.m.MessageBox.Icon.ERROR,
	                title : "Information",
	                actions : [ 'OK' ],
	                onClose : function(a) {
	
	                },
	              });
	             return;
            }

            oEntry.RaceNumber="";
            oEntry.FiscalYear = fiscal_YearInp;
            oEntry.Plant = plantInp;
            oEntry.ScheduledComplitionDate = Scedule_DateInp;
            oEntry.TotalGainExpectedDate = gain_expectedInp;
            oEntry.DocumentDate = doc_DateInp;
            //oEntry.RaceType = this.getView().byId("selectRace").getSelectedKey();
            oEntry.RaceDepartment = race_departInp;
            oEntry.RaceAmount = Race_amtInp;
            oEntry.TotalBudgetedAmount = "0.000";
            oEntry.SanctionedAmount ="0.000";
            oEntry.BalanceAmount ="0.000";
            oEntry.Title1 =titleInp;
            oEntry.Title2 ="";
            oEntry.BriefDescription1=brief_DescInp;
            oEntry.BriefDescription2= "";
            oEntry.PersonnelNumber ="";
            oEntry.ReleaseState="X";
            oEntry.Racat = Race_Cat; 
            oEntry.RaceType = raceType;
            oEntry.Subracetype = RacSubType;


            // nav to totalCost
            var laChildCost = {};
            var landed_costInp = this.getView().byId("landed_costInp").getValue();
            var other_ExpensesInp = this.getView().byId("other_ExpensesInp").getValue();
            var operative_ExpensesInp = this.getView().byId("operative_ExpensesInp").getValue();
            var Erection_CommissioningInp = this.getView().byId("Erection_CommissioningInp").getValue();
            var Contigency_ExpenseInp = this.getView().byId("Contigency_ExpenseInp").getValue();

            // temp conditions
            if(landed_costInp == "" || other_ExpensesInp == "" || operative_ExpensesInp == "" || Erection_CommissioningInp == "" || Contigency_ExpenseInp == ""){
	
	              sap.m.MessageBox.show("Please fill all the fields for the tab 'Total Cost'", {

	                title : "Information",
	                actions : [ 'OK' ],
	                onClose : function(a) {
	
	                },
	              });
	             return;
            }

              laChildCost.RaceNumber = "";
              laChildCost.FiscalYear = fiscal_YearInp;
              laChildCost.LandedCost = landed_costInp;
              laChildCost.AnyOtherExpense = other_ExpensesInp;
              laChildCost.PreOperativeExpense = operative_ExpensesInp;
              laChildCost.ErectionCommissioning = Erection_CommissioningInp;
              laChildCost.ContigencyExpense = Contigency_ExpenseInp;

            // nav to gain
            var loItems = this.getView().byId("idGainTable").getItems();
            var laChildgain = [];
            for ( var i in loItems) {
	              var laCells = loItems[i].getCells();
	              var itemText = laCells[2].getValue();
	              if(itemText == ""){sap.m.MessageBox.show("Please fill Item text for Gain/Savings", {
	                  // icon
	                  // :
	                  // sap.m.MessageBox.Icon.ERROR,
	                  title : "Information",
	                  actions : [ 'OK' ],
	                  onClose : function(a) {
	
	                  },
	                });
	               return;
	              }
            }


            for ( var i in loItems) {
	              var laCells = loItems[i].getCells();
	              var itemNo = laCells[0].getValue();
	              var itemDesc = laCells[1].getValue();
	              var itemText = laCells[2].getValue();
	
	              laChildgain.push({
	                    ItemNo : itemNo,
	                    ItemDescription : itemDesc,
	                    ItemText : itemText,
	                    RaceNumber : "",
	                    FiscalYear : fiscal_YearInp,
	                  });
            }

            // nav to approval
            var loItems = this.getView().byId("idApproverTable").getItems();
            var laChildApprove = [];
            for ( var i in loItems) {
              var laCells = loItems[i].getCells();

              var Designation = laCells[0].getText();
              var Comments = laCells[1].getText();
              var Ammount = laCells[2].getText();
              var pN = laCells[3].getText();

              laChildApprove.push({
                    RaceNumber:"",
                    FiscalYear:fiscal_YearInp,
                    Pernr : Designation,
                    ItemText : Comments,
                    RaceApprovalAmount : Ammount,
                    Plant:plantInp,
                    ItemNo:"",
                    PersonnelNumber:pN,
                    ApprovalDate: null

                  });
            }

            var LtextChild = [];
            LtextChild.push({
              TextLine : "1",
              TextDescription : longText
            });

            // splitAmoount

            var loItemsAmnt = this.getView().byId("idRaceTable").getRows();
            var NavToPlantAmounts = [];
            for ( var i in loItemsAmnt) {
              var laCells = loItemsAmnt[i].getCells();

              var plant = laCells[0].getValue();
              var ammount = laCells[1].getValue();

              NavToPlantAmounts.push({
                    Plant : plant,
                    Description: "",
                    RaceAmount : ammount
                  });
            }

            if(loItemsAmnt.length != 0){
              oEntry.NavToPlantAmounts = NavToPlantAmounts;
//              oEntry.NavToPlantAmounts = [];
            }
            oEntry.NvgToAmountBreakUp = this.raceAmountArray;
//            oEntry.NvgToAmountBreakUp = [];
            oEntry.NavToCost = laChildCost;
            oEntry.NavToGain = laChildgain;
            oEntry.NavToLText = LtextChild;
            oEntry.NavToApprove = laChildApprove;

            var oViewJModel = this.getView().getModel("oViewJModel");
            oViewJModel.setProperty("/delay", 0);

            oViewJModel.refresh(true);
            that.onCreateTestRequestSet(oEntry);

          },

//////////////////////////////////////////////////////////////////////////////////////////////////

    onCreateTestRequestSet: function(payload){
            var busy = sap.ui.core.BusyIndicator;
            var oView = this.getView();
            var router = sap.ui.core.UIComponent.getRouterFor(this);
            
            var sPathPOHeaderSet = "/RaceHeaderSet";
            var frameworkODataModel = this.getOwnerComponent().getModel();
            var oParamsPOHeaderSet = {};
            oParamsPOHeaderSet.context = "";
            oParamsPOHeaderSet.urlParameters = "";
            
            oParamsPOHeaderSet.success = function(oData, oResponse) {
		     // success handler
		              busy.hide();
		              var oView = that.getView();
		              var idRaceTable = oView.byId("idRaceTable");
		              var oViewJModel = oView.getModel("oViewJModel");
		              oViewJModel.setProperty("/delay", 0);
		              oViewJModel.setProperty("/busy", false);
		              oViewJModel.refresh(true);
		              sap.m.MessageBox.show("Race Request Created : "+oResponse.data.RaceNumber, {
		                title : "Information",
		                icon : sap.m.MessageBox.Icon.INFORMATION,
		                actions : [ 'OK' ],
		                onClose : function(a) {
		 
		                	that.saveUploadedDocs(oResponse.data.RaceNumber);						// document upload
		
		//                  router.navTo("page1");
		                	window.history.go(-2);
		                },
		              });
		              idRaceTable.getModel().setData([]);
		//              that.saveUploadedDocs(oResponse.data.RaceNumber); 
		
		              //this.raceAmountArray=[];   
            };
            
            oParamsPOHeaderSet.error = function(oError) { // error handler
		
		               // error callback
		              // function
		            var parser = new DOMParser();
		            var message = JSON.parse(oError.response.body)
		              				.error.message.value;
		            sap.m.MessageBox.show(message, {
		            title : "Error",
		            icon : sap.m.MessageBox.Icon.ERROR,
		            });
		            busy.hide();

            }.bind(this);

//            sap.ui.core.BusyIndicator.show();
//            busy.show();
            frameworkODataModel.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

            frameworkODataModel.attachRequestCompleted(function() {

            });
          },
          
//////////////////////////////////////////////////////////////////////////////////////////////////

          onRaceChange: function(oEvt){
        	 
        	 
        	 var data = this.getView().byId("selectRace").getModel().getData()
             var selectIndex = this.getView().byId("selectRace").getSelectedIndex();

             	RacCat =  data.d.results[selectIndex].Cat;
             	raceType =  data.d.results[selectIndex].RaceType;
             	RacSubType =  data.d.results[selectIndex].SubType;

           
           // var raceType = this.getView().byId("selectRace").getSelectedKey();
            var raceAmmount = this.getView().byId("Race_amtInp").getValue();

            if(raceType !== "" && raceAmmount !== ""){

              var loTableBindingPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceApprovalsList?RaceType='" + raceType + "'&RaceAmount=" + raceAmmount + "m";
              var loTable = this.getView().byId("idApproverTable");

              var Tablemodel = new sap.ui.model.json.JSONModel();
              Tablemodel.loadData(loTableBindingPath, null, false, "GET", false, false, null);
              loTable.removeAllItems();
              var oData = Tablemodel.getData();
              var length = oData.d.results.length;
              for(var i=0;i<length;i++){

                var colListItem = new sap.m.ColumnListItem({
                  cells:[
                         new sap.m.Text({
                           text:oData.d.results[i].Pernr
                         }),
                         new sap.m.Text({
                           text:oData.d.results[i].ItemText
                         }),
                         new sap.m.Text({
                           text:oData.d.results[i].RaceApprovalAmount
                         }),
                         new sap.m.Text({
                           visible:false,
                           text:oData.d.results[i].PersonnelNumber
                         })
                         ]
                })
              loTable.addItem(colListItem);
              }

                }
    
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

      liveTotalcost: function(){

            var landed_costInp = this.getView().byId("landed_costInp").getValue();
            var other_ExpensesInp = this.getView().byId("other_ExpensesInp").getValue();
            var operative_ExpensesInp = this.getView().byId("operative_ExpensesInp").getValue();
            var Erection_CommissioningInp = this.getView().byId("Erection_CommissioningInp").getValue();
            var Contigency_ExpenseInp = this.getView().byId("Contigency_ExpenseInp").getValue();

//            if(landed_costInp != "" && other_ExpensesInp != "" && operative_ExpensesInp != "" && Erection_CommissioningInp != "" && Contigency_ExpenseInp != ""){
//              var total= parseInt(landed_costInp) + parseInt(other_ExpensesInp) + parseInt(operative_ExpensesInp) + parseInt(Erection_CommissioningInp) + parseInt(Contigency_ExpenseInp);
//              this.getView().byId("Total_CostInp").setValue(total);
//            }else{
//              this.getView().byId("Total_CostInp").setValue();
//
//            }

            if(landed_costInp == ""){
              landed_costInp = 0;
            }
            if(other_ExpensesInp == ""){
              other_ExpensesInp=0;
            }
            if(operative_ExpensesInp == ""){
              operative_ExpensesInp=0;
            }
            if(Erection_CommissioningInp == ""){
              Erection_CommissioningInp=0;
            }
            if(Contigency_ExpenseInp == ""){
              Contigency_ExpenseInp=0;
            }



            var total= parseFloat(landed_costInp) + parseFloat(other_ExpensesInp) + parseFloat(operative_ExpensesInp) + parseFloat(Erection_CommissioningInp) + parseFloat(Contigency_ExpenseInp);

            this.getView().byId("Total_CostInp").setValue(total.toFixed(2));




          },

//////////////////////////////////////////////////////////////////////////////////////////////////

          menu : function(){
            var that = this;

            if (!that._RaceDialog) {

              that._RaceDialog = sap.ui.xmlfragment(
                "ZRACEMGMT.view.Intial", that);
              that.getView().addDependent(that._RaceDialog);}
            that._RaceDialog.open();
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

          onRaceCloseButton: function(e){
            var that = this;
//            var display = sap.ui.getCore().byId("RBG").getSelectedIndex();
            var display  = e.getSource().getParent().getContent()[0].getContent()[0].mAggregations.form.getFormContainers()[0].getFormElements()[0].getFields()[0].getSelectedIndex();
            // if option is for display
            if(display == 1){
              var router = sap.ui.core.UIComponent
              .getRouterFor(this);
              router
              .navTo("page2");
            }else{
              if(display == 2){
                var router = sap.ui.core.UIComponent
                .getRouterFor(this);
                router
                .navTo("page3");
              }else{
                if(display == 0){
                  var router = sap.ui.core.UIComponent
                  .getRouterFor(this);
                  router
                  .navTo("page1");
                }
              }

            }

            that._RaceDialog.close();
            },

          onRaceCloseCancle : function(e){
            var that = this;
            if (that._RaceDialog){
              that._RaceDialog.close();
            }else{
              that._RaceDialog.close();
            }

            },

//////////////////////////////////////////////////////////////////////////////////////////////////

    selectedTab : function(c) {
            var _self = this;
            var t = c.getSource().getSelectedKey();
            var selectRace = this.getView().byId("selectRace").getSelectedKey();
        var Race_amtInp = this.getView().byId("Race_amtInp").getValue();
        var selectedKey = _self.getView().byId("idheaderinfo").getSelectedKey();
        if(selectedKey !== "HeaderInfo"){
          _self.getView().byId("idRaceTable").setVisible(true);
        }else{
          _self.getView().byId("idRaceTable").setVisible(true);
        }

            if(t == "ApprovalInfo"){
              if(selectRace == "" || Race_amtInp == ""){


                sap.m.MessageBox.show(
                        "Please select Race Type and fill race ammount first",
                        {
                          icon : sap.m.MessageBox.Icon.ERROR,
                          title : "Error",
                          actions : [ 'OK' ],
                          onClose : function(a) {
                            if (a == "OK") {
                              var w = "HeaderInfo";
                              _self.getView().byId('idheaderinfo').setSelectedKey(w);
                            }
                          },
                         });
               }
            }
     },

//////////////////////////////////////////////////////////////////////////////////////////////////

          addNewItem : function() {
            var _self = this;
            var that =  this;
            var idRaceTable = this.getView().byId("idRaceTable");
            var raceData={
              RaceType: "",
              RaceAmount: "",

            }

              this.raceAmountTableData.push(raceData);

            idRaceTable.getModel().setData(this.raceAmountTableData);
            var idRaceTableCount = idRaceTable.getModel().getData().length;
            idRaceTable.setVisibleRowCount(idRaceTableCount);
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

    onRemoveRace : function(oEvent) {
    	
    		this.raceAmountPath = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
            var raceTbl = this.getView().byId("idRaceTable");
            var path = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
            var plant = raceTbl.getRows()[this.raceAmountPath].getCells()[0].getValue();

// code added to remove data from race tree amount data for payload
            var delArray =[];
            for( var i = 0 ; i < this.raceAmountArray.length ; i++ ){
              if( this.raceAmountArray[i].Persa == plant )
                  delArray.push(i);
//                this.raceAmountArray.splice(i, 1);
            }
            this.raceAmountArray = delArray.reduceRight(function (arr, it) {
                arr.splice(it, 1);
                return arr;
            }, this.raceAmountArray.sort(function (a, b) { return b - a }));

// code to remove data from table
            if (path !== -1) {
              raceTbl.getModel().getData().splice(path,1);
              raceTbl.getModel().refresh();
              var idRaceTableCount = raceTbl.getModel().getData().length;
              raceTbl.setVisibleRowCount(idRaceTableCount);
            }
//        
//            var totl = 0;
//            if(raceTbl.getRows().length > 1){
//            for(var i=0; i<raceTbl.getRows().length; i++){
//                totl = parseFloat(raceTbl.getRows()[0].getCells()[1].getValue()) + totl;
//                }
//                this.getView().byId("Race_amtInp").setValue(totl);
//              this.getView().byId("Race_amtInp").setEnabled(false);
//            }else{
//                  this.getView().byId("Race_amtInp").setValue();
////                this.getView().byId("Race_amtInp").setEnabled(true);
//                  }
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

    onAddRaceAmount: function(oEvent){
//            code for race amount dialog data
            this.raceAmountPath = oEvent.getSource().getParent()._getBindingContext().getPath().split('/')[1];
            var plant = oEvent.getSource().getParent()._getBindingContext().getObject().RaceType;
            this.getMasterListData(plant);
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

    openMasterListData : function(){
            var raceTbl = this.getView().byId("idRaceTable");
            var amountModel = this.getView().getModel();
            if(raceTbl.getRows()[this.raceAmountPath].getCells()[0].getValue() == ""){
              sap.m.MessageBox.show("Please select Plant", {
                title : "Error",
                icon : sap.m.MessageBox.Icon.ERROR,
              });
              return false;
            }else{
              if (!this._RaceAmountDialog) {
                this._RaceAmountDialog = sap.ui.xmlfragment("ZRACEMGMT.view.RaceAmountDialog", this);
              }

//              this._RaceAmountDialog.open();
//              this.getView().addDependent(this._RaceAmountDialog);
              this._RaceAmountDialog.setModel(amountModel);
              sap.ui.getCore().byId("TreeTableBasic").expandToLevel(3);
              this._RaceAmountDialog.open();
//              var data=path;
//              var router = sap.ui.core.UIComponent.getRouterFor(this);
//              router.navTo("amountPage", {details : data});
            }
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

    onCloseRaceAmountDialog : function(oEvent) {
            // this._RaceAmountDialog.destroy();
            var amount = 0;
                var allData = this._RaceAmountDialog.getModel().getData();
                for(var i=0;i<allData.children.length ;i++){
                  amount= parseFloat(amount) + parseFloat(allData.children[i].Amount);
                }
                var raceTbl = this.getView().byId("idRaceTable");
                raceTbl.getRows()[this.raceAmountPath].getCells()[1].setValue(amount);
                this.getRateAmountInArray();
                this._RaceAmountDialog.close();
            
                var totl = 0;
                for(var i=0; i<raceTbl.getRows().length; i++){
                   totl = parseFloat(raceTbl.getRows()[i].getCells()[1].getValue()) + totl;
                }
                this.getView().byId("Race_amtInp").setValue(totl);
                this.getView().byId("Race_amtInp").setEnabled(false);
                this.onRaceChange();
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

    getRateAmountInArray : function(){
            var modelData = this.getView().getModel("MaterialListSetJModel").getData();
            var raceTbl = this.getView().byId("idRaceTable");
            var plant =raceTbl.getRows()[this.raceAmountPath].getCells()[0].getValue();
            for(var i=0; i<modelData.length;i++){
              var obj={};
              obj.Persa = plant;
              obj.Racen = "";
              obj.Id = modelData[i].Id;
              obj.Parentid = modelData[i].Parentid;
              obj.Text = modelData[i].Text;
              obj.LevelCode = modelData[i].LevelCode;
              obj.Amount = (modelData[i].Amount).toFixed(3);
              obj.Enabled = 'X';

              this.raceAmountArray.push(obj);
            }
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

    onJustfifation : function(){
            this.getView().byId("longTestPanel").setVisible(true);
          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          onTyreLocationHelp : function(evt)
          {
            var that = this;
        var ItemDescRow = evt.getSource();

            var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RacePlantSet";
            var jModel = new sap.ui.model.json.JSONModel();
            jModel.loadData(sPath, null, false, "GET", false,
                false, null);
            var _valueHelpTyreLocSelectDialog = new sap.m.SelectDialog(
                {

                  title : "Select Tyre Location",
                  items : {
                    path : "/d/results",
                    template : new sap.m.StandardListItem(
                        {
                          title : "{Plant}",
                          description:"{Description}",
                          customData : [ new sap.ui.core.CustomData(
                              {
                                key : "{Plant}",
                                value : "{Description}"
                              }) ],

                        }),
                  },
                  liveChange : function(oEvent) {
                    var sValue = oEvent
                        .getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "Description",
                        sap.ui.model.FilterOperator.Contains,
                        sValue);
                    oEvent.getSource().getBinding("items")
                        .filter([ oFilter ]);
                  },
                  confirm : function(oEvent)
                  {
//                    var that = this;
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    var plandcheck = false;
                    var idRaceTable = that.getView().byId("idRaceTable");
                    for(var i=0;i< idRaceTable.getRows().length;i++){
                      if(idRaceTable.getRows()[i].getCells()[0].getValue() == oSelectedItem.getTitle()){
                        plandcheck=true;
                      }
                    }
                    if(!plandcheck){

                      if (oSelectedItem) {

                        ItemDescRow.setValue(oSelectedItem.getTitle());

                      }
                    }else{
                      sap.m.MessageBox.show("You can not add same plant twice", {
                        title : "Error",
                        icon : sap.m.MessageBox.Icon.ERROR,
                      });
                      ItemDescRow.setValue("");
                      return false;
                    }

                  },
                  cancel : function(oEvent)
                  {
//                    var that = this;
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                      ItemDescRow.setValue(oSelectedItem.getTitle());
                    }
                  }
                });
            _valueHelpTyreLocSelectDialog.setModel(jModel);
            _valueHelpTyreLocSelectDialog.open();
          },

          _handleTyreLocClose : function(oEvent)
          {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
              ItemDescRow.setValue(oSelectedItem.geTtitle());
            }
          },

//////////////////////////////////////////////////////////////////////////////////////////////////

liveTotalcostAmtBrkup: function(){

            var landed_costInp = this.getView().byId("amt2")
            .getValue();
            var other_ExpensesInp = this.getView().byId("amt3")
                .getValue();
            var operative_ExpensesInp = this.getView().byId("amt4")
                .getValue();
            var Erection_CommissioningInp = this.getView().byId("amt5").getValue();
            var Contigency_ExpenseInp = this.getView().byId("amt6")
                .getValue();

            var amt7 = this.getView().byId("amt7")
            .getValue();

            if(landed_costInp == ""){
              landed_costInp = 0;
            }
            if(other_ExpensesInp == ""){
              other_ExpensesInp=0;
            }
            if(operative_ExpensesInp == ""){
              operative_ExpensesInp=0;
            }
            if(Erection_CommissioningInp == ""){
              Erection_CommissioningInp=0;
            }
            if(Contigency_ExpenseInp == ""){
              Contigency_ExpenseInp=0;
            }
            if(amt7 == ""){
              amt7=0;
            }

            var total= parseFloat(landed_costInp) + parseFloat(other_ExpensesInp) + parseFloat(operative_ExpensesInp) + parseFloat(Erection_CommissioningInp) + parseFloat(Contigency_ExpenseInp) +  parseFloat(amt7);

            this.getView().byId("TotalA").setValue(total.toFixed(2));

          },

//////////////////////////////////////////////////////////////////////////////////////////////////

liveTotalcostAmtBrkupAtoC: function(){

            var landed_costInp = this.getView().byId("amtB4").getValue();
            var other_ExpensesInp = this.getView().byId("amtB6").getValue();
            var operative_ExpensesInp = this.getView().byId("amtB7").getValue();
            var Erection_CommissioningInp = this.getView().byId("amtB8").getValue();
            var Contigency_ExpenseInp = this.getView().byId("amtB9").getValue();

            var amntB = this.getView().byId("amtB2").getValue();

            if(landed_costInp == ""){
              landed_costInp = 0;
            }
            if(other_ExpensesInp == ""){
              other_ExpensesInp=0;
            }
            if(operative_ExpensesInp == ""){
              operative_ExpensesInp=0;
            }
            if(Erection_CommissioningInp == ""){
              Erection_CommissioningInp=0;
            }
            if(Contigency_ExpenseInp == ""){
              Contigency_ExpenseInp=0;
            }
            if(amntB == ""){
              amntB=0;
            }

            var total= parseFloat(landed_costInp) + parseFloat(other_ExpensesInp) + parseFloat(operative_ExpensesInp) + parseFloat(Erection_CommissioningInp) + parseFloat(Contigency_ExpenseInp);
            var totalB= parseFloat(landed_costInp) + parseFloat(other_ExpensesInp) + parseFloat(operative_ExpensesInp) + parseFloat(Erection_CommissioningInp) + parseFloat(Contigency_ExpenseInp) + parseFloat(amntB);

            this.getView().byId("amtB10").setValue(total.toFixed(2));
            this.getView().byId("amtB11").setValue(totalB.toFixed(2));

            var toTalB = this.getView().byId("amtB11")
            .getValue();
            var toTalA = this.getView().byId("TotalA")
            .getValue();

            if(toTalB == ""){
              toTalB=0;
            }
            if(toTalA == ""){
              toTalA=0;
            }
            var totalAB= parseFloat(toTalB) + parseFloat(toTalA)
            this.getView().byId("amtB12").setValue(totalAB.toFixed(2));

          },
//////////////////////////////////////////////////////////////////////////////////////////////////
//        race amount dialog code
          getMasterListData: function(plant) {
            var that=this;
            var oViewObj = this.getView();
            var MaterialListSetJModel = oViewObj.getModel("MaterialListSetJModel");
            if (!MaterialListSetJModel) {
              MaterialListSetJModel = new sap.ui.model.json.JSONModel();
              oViewObj.setModel(MaterialListSetJModel, "MaterialListSetJModel");
            }

            var sPathMatListSet = "/RaceNodeSet?$filter=Persa eq '" + plant + "'";
            var frameworkODataModel = this.getOwnerComponent().getModel();
            var oParamsMatListSet = {};
            oParamsMatListSet.context = "";
            oParamsMatListSet.urlParameters = "";
            oParamsMatListSet.success = function(oData, oResponse) { // success handler

              MaterialListSetJModel.setData(oData.results);
              var deepData = that.transformTreeData(oData.results);
              that.setModelData(deepData);
              that.openMasterListData();
            };
            oParamsMatListSet.error = function(oError) { // error handler
            	var errmsg = JSON.parse(oError.response.body).error.message.value;
            	sap.m.MessageBox.alert(
            			errmsg, {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
            	
//              jQuery.sap.log.error("read publishing group data failed");
//              sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
            };
            frameworkODataModel.read(sPathMatListSet, oParamsMatListSet);
            frameworkODataModel.attachRequestCompleted(function() {});

          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          transformTreeData: function(nodesIn) {
            var nodes = []; //'deep' object structure
            var nodeMap = {}; //'map', each node is an attribute
            if (nodesIn) {
              var nodeOut;
              var parentId;

              for (var i = 0; i < nodesIn.length; i++) {
                if(nodesIn[i].Enabled == "X"){
                  nodesIn[i].Enabled = true;
                }else if(nodesIn[i].Enabled == ""){
                  nodesIn[i].Enabled = false;
                }
                if(nodesIn[i].Amount == "0.000"){
                  nodesIn[i].Amount = 0;
                }
                var nodeIn = nodesIn[i];

                nodeOut = {
                  Id: nodeIn.Id,
                  Text: nodeIn.Text,
                  Amount: nodeIn.Amount,
                  Enabled: nodeIn.Enabled,
                  children: []
                };

                parentId = nodeIn.Parentid;
                if (nodeIn.Parentid === nodeIn.Id) {
                  //there is no parent, must be top level
                  nodes.push(nodeOut);
                } else if (parentId && parentId > 0) {

                  var parent = nodeMap[nodeIn.Parentid];
                  if (parent) {
                    parent.children.push(nodeOut);
                  }
                }
                nodeMap[nodeOut.Id] = nodeOut;
              }
            }

            return nodes;
          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          setModelData: function(nodes) {

            //store the nodes in the JSON model, so the view can access them
            var nodesModel = new sap.ui.model.json.JSONModel();
            nodesModel.setData({
                children: nodes
            });
            this.getView().setModel(nodesModel);
          },
//////////////////////////////////////////////////////////////////////////////////////////////////
          onCollapseAll: function () {
                  var oTreeTable = this.getView().byId("TreeTableBasic");
                  oTreeTable.collapseAll();
              },
//////////////////////////////////////////////////////////////////////////////////////////////////
              onExpandFirstLevel: function () {
                  var oTreeTable = this.getView().byId("TreeTableBasic");
                  oTreeTable.expandToLevel(1);
              },
//////////////////////////////////////////////////////////////////////////////////////////////////
              onAmountChange: function(oEvent){
                var diaMNo =oEvent.getSource().getValue();
                if(diaMNo == ""){
                	diaMNo = "0";
                }else{
                	diaMNo= diaMNo.trim();
//                	oEvent.getSource().setValue(diaMNo);
                }
              if(diaMNo){
                if(isNaN(diaMNo)){
                  diaMNo = diaMNo.substring(0, diaMNo.length - 1);
                  oEvent.getSource().setValue(diaMNo);

                }else{
                  var newValue = parseFloat(oEvent.getSource().getValue());
                    var lastValue = parseFloat(oEvent.getSource()._lastValue);
                    if(newValue === undefined || isNaN(newValue))
                      newValue = 0;
                    if(lastValue === undefined || isNaN(lastValue))
                      lastValue = 0;
                    var changeValue = newValue-lastValue;
                    var path = oEvent.getSource().getParent().getBindingContext().getPath();
                    var model = oEvent.getSource().getParent().getBindingContext().getModel();
                    var key = "children";
                    this.changeAmount(path,model,key,changeValue);
                    this.setAmountaDataInModel(model, path);
                }
              }

              },
//////////////////////////////////////////////////////////////////////////////////////////////////
              changeAmount:function(path,model,key,changeValue){
                var changeKey = "/"+key;
                var indexArray = path.split(changeKey);
                indexArray.forEach(function(indexs,i){
                  if(i === 0){
                    return;
                  }

                  if(i>1){
                    changeKey = changeKey + "/"+key;
                  }

                   if(i === 2){
                    var abc = model.getProperty(changeKey).length-1;
                    model.getProperty(changeKey+"/"+abc).Amount += changeValue;
                    this.setAmountaDataInModel(model, changeKey+"/"+abc);
                  }

                  changeKey = changeKey+indexs;
                  model.getProperty(changeKey).Amount += changeValue;
                  this.setAmountaDataInModel(model, changeKey);
                }.bind(this));
                model.refresh();
              },
//////////////////////////////////////////////////////////////////////////////////////////////////
//              code added to change amount in MaterialList model on change event in amount
              setAmountaDataInModel: function(model, path){
                var obj = model.getProperty(path);
                var modelData = this.getView().getModel("MaterialListSetJModel").getData();
                for(var i= 0 ; i< modelData.length;i++){
                   if(modelData[i].Id == obj.Id){
                     modelData[i].Amount = obj.Amount;
                   }
                }
              },
//************************************************************************************************
//Add By Ram
getRaceCategory:function(){
   
   var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceCategorySet";
	var jModel = new sap.ui.model.json.JSONModel();
	jModel.loadData(sPath, null, false,"GET",false, false, null);
	var  loc= this.getView().byId("idRaceCat");
	loc.unbindAggregation("items");
	loc.setModel(jModel);
	loc.bindAggregation("items", {
		path : "/d/results",
		template : new sap.ui.core.Item({
			key : "{Racat}",
			text : "{Desc}"
		})
	}); 
},

onRacCatChange:function(evt){

    var RaceCat = this.getView().byId("idRaceCat").getSelectedKey();
	var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceTypeCatSet?$filter=Cat eq '"+RaceCat+"'";
	var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false,"GET",false, false, null);
	var RacType= this.getView().byId("selectRace");
		RacType.unbindAggregation("items");
		RacType.setModel(jModel);
		RacType.bindAggregation("items", {
			path : "/d/results",
			template : new sap.ui.core.Item({
				key : "{SubType}",
				text : "{Description}"
			})
		});
		this.getView().byId("selectRace").setEnabled(true);
},
              

// ************************************File Upload *********************	

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
              	//that.saveUploadedDocs(that.SelectedData.RaceNo);         	// document upload
              	
              	// _onRoute
              	//this.getAttachmentDetails(this.SelectedData.RaceNo);  		// document upload
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
              	
                 
              /*    onTypeMissmatch: function(oEvent){
                  	
                  	sap.m.MessageToast.show("Please select Valid File format (DOC, PDF, JPEG)");
                  	return false;
                  },*/
                  
                 
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
                    
                    getAttachmentDetails: function(RaceNo){        //document upload
              			var oView = this.getView();
              			var oUploadModel = this.getView().getModel("oUploadModel");
              			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
              			var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='01',ObjectName='"+RaceNo+"')?$expand=ImageObjectToDataNvg";
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
              				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
              			}.bind(this);

              			oCreateModel1.read(sPathAttachmentSet, oParamsAttachmentSet);

              			oCreateModel1.attachRequestCompleted(function() {
              				
              			});
              		},
              		
              		saveUploadedDocs: function(RaceNo){               						// document upload
              			var payload = that.createDocsPayload(RaceNo);
              			var oView = this.getView();
              			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
              			var sPathPOHeaderSet = "/ImageUploadObjectSet";
              			var oParamsPOHeaderSet = {};
              			oParamsPOHeaderSet.context = "";
              			oParamsPOHeaderSet.urlParameters = "";
              			oParamsPOHeaderSet.success = function(oData, oResponse) { // success handler
              				
              			};
              			oParamsPOHeaderSet.error = function(oError) { // error handler 		
              				jQuery.sap.log.error("Read/Publishing Group Data Failed.");
              			}.bind(this);

              			oCreateModel1.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

              			oCreateModel1.attachRequestCompleted(function() {
              				
              			});
              		},
              		
              		createDocsPayload: function(RaceNo){              							// document upload
              			var payload={
              					ObjectID: "01",
              					ObjectName: RaceNo,
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
              	
onBack:function(){
	
	window.history.back();
},

        /**
         * Similar to onAfterRendering, but this hook is invoked before
         * the controller's View is re-rendered (NOT before the first
         * rendering! onInit() is used for that one!).
         *
         * @memberOf view.Create
         */
        // onBeforeRendering: function() {
        //
        // },
        /**
         * Called when the View has been rendered (so its HTML is part
         * of the document). Post-rendering manipulatiospns of the HTML
         * could be done here. This hook is the same one that SAPUI5
         * controls get after being rendered.
         *
         * @memberOf view.Create
         */
        // onAfterRendering: function() {
        //
        // },
        /**
         * Called when the Controller is destroyed. Use this one to free
         * resources and finalize activities.
         *
         * @memberOf view.Create
         */
        // onExit: function() {
        //
        // }
        });
});
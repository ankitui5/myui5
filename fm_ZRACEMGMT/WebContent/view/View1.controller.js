sap.ui.define([ "sap/ui/model/json/JSONModel", "sap/m/UploadCollectionParameter" ],
	  function( JSONModel,UploadCollectionParameter) {
    "use strict";
 jQuery.sap.require("sap.m.MessageBox");
 jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("ZRACEMGMT.util.Formatter");
var that,gv_busyindicator;
var initialFlag, Gv_ItemNo;
sap.ui.controller("ZRACEMGMT.view.View1", {
	raceType:"",
	Displaymodel:"",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.View1
*/
	onInit: function() {
		
		gv_busyindicator = new sap.m.BusyDialog();
		that=this;
		initialFlag = true;
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
		"page1").attachMatched(this._onRoute, this);
		
		window.rnA = "";
		
	    	
		var attachmentModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(attachmentModel,"attachmentModel");
		attachmentModel.setData([]);
		
		var oUploadModel = new sap.ui.model.json.JSONModel({
			items : []
		});
		
		this.getView().setModel(oUploadModel,"oUploadModel"); 
		this.getRaceInitSet(); // Changed-10-06-2019 
	},
	
	_onRoute : function(e){
		
		//this.getView().byId("fileupload").setUploadEnabled(false);
		
		//Add By Ram
		this.getView().byId("idlbelRaceNo").addStyleClass("ClassRaceNo");
		
		var tempjsonString = e.getParameter("arguments").entity;
		var jsonstring = tempjsonString.replace(/@/g, "/");
		var tempSelectedData = JSON.parse(jsonstring);
		var SelectedData  = JSON.parse(tempSelectedData);
			Gv_ItemNo = SelectedData.ItemNo;
		var raceNum = SelectedData.raceNo;
		var Lv_Status = SelectedData.Status;
		
		this.bindView(raceNum,Lv_Status);
		//***************
		
		if(window.rnA !== ""){
			this.getView().byId("raceNumberInput").setValue(window.rnA);
			this.bindView();
		}
		
		//this.getRaceInitSet();
//		**************************************** added on 22/12/2018
//		 var idRaceTable = this.getView().byId("idRaceTable");
//         var raceModel = new sap.ui.model.json.JSONModel();
//         idRaceTable.setModel(raceModel).bindRows("/");
//         this.raceAmountTableData=[];
         this.raceAmountArray = [];
         
       //  this.getAttachmentDetails(this.SelectedData.planguid,this.SelectedData.planrevno);  				// document upload

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
//		    				tAmount = parseInt(tAmount) + parseInt(amt);
//		    				tAmount = parseFloat(tAmount).toFixed(3);
		    				tAmount = parseFloat(parseFloat(tAmount)+parseFloat(amt)).toFixed(3);
		    				if(that.editEnable){
		    					rows2[d].getCells()[0].setEnabled(true);
		    				}else{
		    					rows2[d].getCells()[0].setEnabled(false);
		    				}
		    			}
		    		that.getView().byId("Race_amtInp").setValue(tAmount);
		    	
         	}
 		});
	
	},
	getRaceInitSet: function() {
		
		var that = this;
		var oViewObj = this.getView();
		var raceTypeJModel = oViewObj.getModel("raceTypeJModel");
		if (!raceTypeJModel) {
			raceTypeJModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(raceTypeJModel, "raceTypeJModel");
		}
		var sPathMatListSet = "/RaceInitialSet?$expand=NavToGain,NavToRaceTypes";
		var frameworkODataModel = this.getOwnerComponent().getModel();
		var oParamsMatListSet = {};
		oParamsMatListSet.context = "";
		oParamsMatListSet.urlParameters = "";
		oParamsMatListSet.success = function(oData, oResponse) { // success handler
				
			raceTypeJModel.setData(oData.results[0].NavToRaceTypes.results);
				
				//Coments on -23-01-2020//
				
				/*that._RaceDialog = sap.ui.xmlfragment(
						"ZRACEMGMT.view.Intial", that);
					that.getView().addDependent(that._RaceDialog);
				that._RaceDialog.open();*/
		};
		oParamsMatListSet.error = function(oError) { // error handler 
			
			
			var message = JSON.parse(oError.response.body).error.message.value;
			sap.m.MessageBox.show(message, {
				title : "Error",
				icon : sap.m.MessageBox.Icon.ERROR,
				onClose : function() {
					window.history.back();
				}
			});
			
			//jQuery.sap.log.error("read publishing group data failed");
			//sap.m.MessageToast.show.show(JSON.parse(oError.responseText).error.message.value);
			//sap.m.MessageToast.show.show(JSON.parse(oError.response.body).error.message.value);
		};
		frameworkODataModel.read(sPathMatListSet, oParamsMatListSet);
		frameworkODataModel.attachRequestCompleted(function() {});

	},
	onJustfifation: function(){
		this.getView().byId("longTestPanel").setVisible(true);
	},


/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.View1
*/
//	onBeforeRendering: function() {
//
//	},
	
	onRaceCloseButton: function(e){
		
		var that = this;
//		var display = sap.ui.getCore().byId("RBG").getSelectedIndex();
		var display  = e.getSource().getParent().getContent()[0].getContent()[0].mAggregations.form.getFormContainers()[0].getFormElements()[0].getFields()[0].getSelectedIndex();
		// if option is for display
		if(display == 1){
			var data = "CR";
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
			that.history.back();
		}
		
		},
		
		bindView: function(raceNum,Lv_Status){
			
			this.initialCondition();
			
			//Add by Ram
			if(raceNum !=""){
				this.getView().byId("raceNumberInput").setValue(raceNum).setEnabled(false); 
				this.getView().byId("raceNoBtn").setVisible(false); 
			}
			
			/*var rN = this.getView().byId("raceNumberInput").getValue();
			var path = e.getSource().getBindingContext("RaceListSetModel").getPath().split('/')[1]
			var data = e.getSource().getBindingContext("RaceListSetModel").getModel().getData()[path];*/
			
			//Showing Static value right now becoz in above code e.getSource() is not working we have to fixed it
//			var RaceListSetModel = this.getView().getModel("RaceListSetModel").getData();
//			var abc  = RaceListSetModel[0].RaceNumber;
			
			
			/*var raceNum  = this.getView().byId("raceNumberInput").getValue();
			if(raceNum == ""){
				sap.m.MessageBox.alert(
						"Enter Race Number", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error"
						}
					);
				return false;
			}*/
			
			
			// JK/KHO/2019/0003 
			
			var oBindingPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceHeaderSet?$filter=RaceNumber eq '"+raceNum+"' &$expand=NavToCost,NavToPlantAmounts,NvgToAmountBreakUp,NavToLText,NavToApprove,NavToGain&$format=json"
			
			//var oBindingPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/RaceHeaderSet?$filter=RaceNumber eq '"+raceNum+"' &$expand=NavToCost,NavToPlantAmounts,NvgToAmountBreakUp,NavToLText,NavToApprove,NavToGain&$format=json"
				this.Displaymodel = new sap.ui.model.json.JSONModel();
			this.Displaymodel.loadData(oBindingPath, null, false, "GET", false, false, null);
			this.getView().setModel(this.Displaymodel);
			var a = 1;
			var HeaderBindingPath = "/d/results/0";
			var totalCostPath = "/d/results/0/NavToCost";
			var gainSavingPath = "/d/results/0/NavToGain";
			var ApprovalStatusPath = "";
			var navtoLtext = "/d/results/0/NavToLText/results/0"
			
			var headerForm = this.getView().byId("TRHeaderFormEdit");
			headerForm.bindElement(HeaderBindingPath);
			
			var costForm = this.getView().byId("TRTOTALCOSTFormEdit");
			costForm.bindElement(totalCostPath);
			
			var status = this.getView().byId("lblStatus");
			status.bindElement(HeaderBindingPath);
			
			/*var editBtn = this.getView().byId("editBtn");
			editBtn.bindElement(HeaderBindingPath);*/
			
			/*var editBtn = this.getView().byId("editRaceBtn");
			editBtn.bindElement(HeaderBindingPath);*/
			
			var ltext = this.getView().byId("longTxt");
			ltext.bindElement(navtoLtext);
			
			//Add By Ram
			if(Lv_Status !="M"){
				this.getView().byId("apprvBtn").setVisible(false);
				this.getView().byId("rejectBtn").setVisible(false);
				//this.getView().byId("idEdit").setVisible(false);
				this.getView().byId("idSaveUpdate").setVisible(false);
				this.getView().byId("Race_amtInp").setEnabled(false);
				this.getView().byId("brief_DescInp").setEnabled(false);
			} else {
				this.getView().byId("apprvBtn").setVisible(true);
				this.getView().byId("rejectBtn").setVisible(true);
				//this.getView().byId("idEdit").setVisible(true);
				this.getView().byId("idSaveUpdate").setVisible(false);
				this.getView().byId("Race_amtInp").setEnabled(true);
				this.getView().byId("brief_DescInp").setEnabled(true);
			}
			//this.onEditFields(false);
			
//			added by Hans
			this.setRaceAmountData(this.Displaymodel);
			this.getAttachmentDetails(raceNum);  //document upload
		},
	
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.View1
*/
	onAfterRendering: function() {
		/*var that = this;
		if(initialFlag){
				if (!that._RaceDialog) {
					
					that._RaceDialog = sap.ui.xmlfragment(
						"ZRACEMGMT.view.Intial", that);
					that.getView().addDependent(that._RaceDialog);}
				that._RaceDialog.open();
		}	*/			 
				
	},
		
//******************************* F4 for RACE No *********************************	
	OnHelpshowRaceNo : function(evt){
		
		//this.ItemDescRow = evt.getSource();
		this.ItemDescRow = sap.ui.getCore().byId("IdRaceNo");
		var sPath = "/sap/opu/odata/sap/ZMM_RACE_SRV/DisplayRaceVHSet";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false,
				false, null);
		var _valueHelpRaceSelectDialog = new sap.m.SelectDialog(
				{

					title : "Select Race",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{RaceNumber}",
									info : "{Title1}",
									customData : [ new sap.ui.core.CustomData(
											{
												key : "{RaceNumber}",
												value : "{Title1}"
											}) ],

								}),
					},
					liveChange : function(oEvent) {
						var sValue = oEvent
								.getParameter("value");
						var oFilter = new sap.ui.model.Filter(
								"Title1",
								sap.ui.model.FilterOperator.Contains,
								sValue);
						oEvent.getSource().getBinding("items")
								.filter([ oFilter ]);
					},
					confirm : [ this._handleStencilClose, this ],
					cancel : [ this._handleStencilClose, this ]
				});
		_valueHelpRaceSelectDialog.setModel(jModel);
		_valueHelpRaceSelectDialog.open();
	
		
	},
	
	_handleStencilClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.ItemDescRow.setValue(oSelectedItem.getTitle());
		}
	},
	
//**************************************F4 Fot Plant *************************************************
	onPlantHelp : function(){
		
		var that = this;
        var ItemDescRow = sap.ui.getCore().byId("IdPlant");

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
                    
                   

                      if (oSelectedItem) {

                        ItemDescRow.setValue(oSelectedItem.getTitle());

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
//***************************************************************************************************	
	
	onSearch :function (){
		
		var VarRaceNo = sap.ui.getCore().byId("IdRaceNo").getValue();
		var VarFisalYer = sap.ui.getCore().byId("IdFisalYer").getValue();
		var VarRaceTyp = sap.ui.getCore().byId("selectRaceFilter").getSelectedKey();
		var VarPlant = sap.ui.getCore().byId("IdPlant").getValue();
		var VarTitle = sap.ui.getCore().byId("IdTitle").getValue();
		
		
		/*var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
	        pattern : "dd-MM-yyyy"
		});
		
		var dateSplit = VarPlnDate.split("-");
		var fromDate = dateSplit[0].trim();
		var fromSplit = fromDate.split(".");
		var fValue = fromSplit[2]+"-"+fromSplit[1]+"-"+fromSplit[0];
		var dateFrom = fValue+"T00:00:00";
		
		var toDate = dateSplit[1].trim();
		var toSplit = toDate.split(".");
		var tValue = toSplit[2]+"-"+toSplit[1]+"-"+toSplit[0];
		var dateTo = tValue+"T00:00:00";
		*/
		
		var oViewObj = this.getView();
		var RaceListSetModel = oViewObj.getModel("RaceListSetModel");
		if (!RaceListSetModel) {
			RaceListSetModel = new sap.ui.model.json.JSONModel();
			oViewObj.setModel(RaceListSetModel, "RaceListSetModel");
		}
		
		var filters = [];
		if(VarFisalYer !== ""){
			filters.push(new sap.ui.model.Filter("FiscalYear", sap.ui.model.FilterOperator.EQ, VarFisalYer));
		}
		if(VarPlant !== ""){
			filters.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, VarPlant));
		}
		if(VarRaceNo !== ""){
			filters.push(new sap.ui.model.Filter("RaceNumber", sap.ui.model.FilterOperator.EQ, VarRaceNo));
		}
		if(VarRaceTyp !== ""){
			filters.push(new sap.ui.model.Filter("RaceType", sap.ui.model.FilterOperator.EQ, VarRaceTyp));
		}
		if(VarTitle !== ""){
			filters.push(new sap.ui.model.Filter("Title1", sap.ui.model.FilterOperator.EQ, VarTitle));
		}
		
		var sPathCartListSet = "/DisplayRaceVHSet";
		var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.filters = filters;
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				
				RaceListSetModel.setData(oData.results);
				
			};
			oParamsCartListSet.error = function(oError) { // error handler 
				
				RaceListSetModel.setData([]);
				var message = JSON.parse(oError.response.body).error.message.value;
				sap.m.MessageBox.show(message, {
					title : "Error",
					icon : sap.m.MessageBox.Icon.ERROR,
					onClose : function() { 
						
						window.location.reload();
					}
				});
			};
			frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
	},
	
	showRacef4: function(evt){
		
		this._RaceHelpDialog = sap.ui.xmlfragment("ZRACEMGMT.view.GetDetailsRaceNo",this);
		this.getView().addDependent(this._RaceHelpDialog);
		var RaceListSetModel = this.getView().getModel("RaceListSetModel");
		this._RaceHelpDialog.setModel(RaceListSetModel);
		this._RaceHelpDialog.open();
	},
	
	onCustomerfrgClose: function(evt)
	{
	this._RaceHelpDialog.close();
	this._RaceHelpDialog.destroy();
	
	},
	onAfterClose: function() {
		this._RaceHelpDialog.destroy();
		},
	onRaceAfterClose: function() {
			this._RaceAmountDialog.destroy();
			},
	
	displayRaceDetails : function(evt){
		
		this._RaceHelpDialog.close();
		this._RaceHelpDialog.destroy(true);
		var raceValue = evt.getSource().getText();
		this.getView().byId("raceNumberInput").setValue(raceValue);
		this.bindView();
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.View1
*/
//	onExit: function() {
//
//	}
	
	
	menu : function(){
		var that = this;
		initialFlag=true;
		that._RaceDialog.open();
	},
	

	onEdit : function(){
		var title = this.getView().byId("titleInp").getValue();
		var desc = this.getView().byId("brief_DescInp").getValue();
		this.getView().byId("title2").setValue(title);
		this.getView().byId("brief_Desc2").setValue(desc);
		this.getView().byId("title2").setVisible(true);
		this.getView().byId("brief_Desc2").setVisible(true);
		//this.getView().byId("updateBtn").setVisible(true);
		//this.getView().byId("CancelBtn").setVisible(true);
		//this.getView().byId("editBtn").setVisible(false);
		//this.getView().byId("editRaceBtn").setVisible(false);
		
		// reverse
		this.getView().byId("titleInp").setVisible(false);
		this.getView().byId("brief_DescInp").setVisible(false);
		
	

	},
	

	onEditFields: function(mode){
		
//		Header details tab
		//var title = this.getView().byId("titleInp");
		var breifDesc = this.getView().byId("brief_DescInp");
		var schCompDate = this.getView().byId("Scedule_DateInp");
		var gainExpectDt = this.getView().byId("gain_expectedInp");
		var justify = this.getView().byId("longTxt");
		//title.setEnabled(mode);
		breifDesc.setEnabled(mode);
		schCompDate.setEnabled(mode);
		gainExpectDt.setEnabled(mode);
		justify.setEnabled(mode);
//		total cost Tab
		var landedCost = this.getView().byId("landed_costInp");
		var otherExpense = this.getView().byId("other_ExpensesInp");
		var preOpExpense = this.getView().byId("operative_ExpensesInp");
		var erecCommision = this.getView().byId("Erection_CommissioningInp");
		var contigExpense = this.getView().byId("Contigency_ExpenseInp");
		var splitRaceAmtLbl = this.getView().byId("Race_amtSplit");
		var splitRaceAmtVal = this.getView().byId("Race_amtInpSplit");
		landedCost.setEnabled(mode);
		otherExpense.setEnabled(mode);
		preOpExpense.setEnabled(mode);
		erecCommision.setEnabled(mode);
		contigExpense.setEnabled(mode);
		splitRaceAmtLbl.setVisible(mode);
		splitRaceAmtVal.setVisible(mode);
		
		var idGainTable = this.getView().byId("idGainTable");
		var rows = idGainTable.getItems();
		for(var i=0 ; i<rows.length; i++){
			rows[i].getCells()[2].setEnabled(mode);
		}
		
//		race amount breakup table
		var idRaceTable = this.getView().byId("idRaceTable");
		var rows1 = idRaceTable.getRows();
		for(var i=0 ; i<rows1.length; i++){
			rows1[i].getCells()[0].setEnabled(mode);
		}
		this.getView().byId("idRaceTblAddColumn").setVisible(mode);
		this.getView().byId("idRaceTblDelColumn").setVisible(mode);
		this.getView().byId("idRaceTblDisplayColumn").setVisible(!mode);
		this.getView().byId("idHeaderAddBtn").setVisible(mode);

	},
	onRaceEdit: function(){
		
		this.getView().byId("apprvBtn").setVisible(false);
		this.getView().byId("rejectBtn").setVisible(false);
		//this.getView().byId("idEdit").setVisible(false);
		this.getView().byId("idSaveUpdate").setVisible(true);
		
		this.onEditFields(true)
		this.editEnable = true;
	},
	
	onCancel: function(){
		this.initialCondition();
		this.editEnable = false;
		this.onEditFields(false);
		
	},
			
	initialCondition: function(){
		this.getView().byId("title2").setVisible(false);
		this.getView().byId("brief_Desc2").setVisible(false);
		//this.getView().byId("updateBtn").setVisible(false);
		//this.getView().byId("CancelBtn").setVisible(false);
		//this.getView().byId("editBtn").setVisible(true);
		//this.getView().byId("editRaceBtn").setVisible(true);
		//this.getView().byId("idSaveUpdate").setVisible(false);
		
		// reverse
		this.getView().byId("titleInp").setVisible(true);
		this.getView().byId("brief_DescInp").setVisible(true);
	},
	onSave: function(){
		
		var oEntry = {};
        var fiscal_YearInp = this.getView().byId("fiscal_YearInp").getValue();
        var selectRace = this.getView().byId("race_typeInp").getValue();
        var plantInp = this.getView().byId("plantInp").getValue();
        var race_departInp = this.getView().byId("race_departInp").getValue();
        var doc_DateInp = this.getView().byId("doc_DateInp").getValue();
        var Race_apprvInp = this.getView().byId("Race_apprvInp").getValue();
        var Race_amtInp = this.getView().byId("Race_amtInp").getValue();
        var titleInp = this.getView().byId("titleInp").getValue();
        var brief_DescInp = this.getView().byId("brief_DescInp").getValue();
        var Scedule_DateInp = this.getView().byId("Scedule_DateInp").getValue();
        var gain_expectedInp = this.getView().byId("gain_expectedInp").getValue();
        var longText = this.getView().byId("longTxt").getValue();
        
        if(doc_DateInp !=="")
        {
        	var s = doc_DateInp.split("-");
         	doc_DateInp = s[2]+ "-"+ s[1]+ "-"+ s[0]+ "T00:00:00";
        }
        else
        {
        	doc_DateInp=null;
        }
        
        var u = Scedule_DateInp.split("-");
        Scedule_DateInp = u[2]+ "-"+ u[1]+ "-"+ u[0]+ "T00:00:00";
        
        var v = gain_expectedInp.split("-");
        gain_expectedInp = v[2]+ "-"+ v[1]+ "-"+ v[0]+ "T00:00:00";
        
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

        var rNum = this.getView().byId("raceNumberInput");
        oEntry.RaceNumber= rNum.getValue();
        oEntry.FiscalYear = fiscal_YearInp;
        oEntry.Plant = plantInp;
        oEntry.ScheduledComplitionDate = Scedule_DateInp;
        oEntry.TotalGainExpectedDate = gain_expectedInp;
        oEntry.DocumentDate = doc_DateInp;
        oEntry.RaceType = this.getView().byId("race_typeInp").getValue();
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
        oEntry.Status="CR";

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


          laChildCost.RaceNumber = rNum.getValue();
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
          var laCells = loItems[i]
              .getCells();

          var itemNo = laCells[0]
              .getValue();
          var itemDesc = laCells[1]
              .getValue();
          var itemText = laCells[2]
              .getValue();

          laChildgain
              .push({
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
          var laCells = loItems[i]
              .getCells();

          var Designation = laCells[0]
              .getValue();
          var Comments = laCells[1]
              .getValue();
          var Ammount = laCells[2]
              .getValue();
//          var pN = laCells[3]
//          .getValue();

          laChildApprove
              .push({
                RaceNumber:rNum.getValue(),
                FiscalYear:fiscal_YearInp,
                Pernr : Designation,
                ItemText : Comments,
                RaceApprovalAmount : Ammount,
                Plant:plantInp,
                ItemNo:"",
                PersonnelNumber:"",
                ApprovalDate: null

              });
        }

        var LtextChild = [];
        LtextChild
        .push({
          TextLine : "1",
          TextDescription : longText
        });

        // splitAmoount

        var loItemsAmnt = this.getView().byId("idRaceTable").getRows();
        var NavToPlantAmounts = [];
        for ( var i in loItemsAmnt) {
          var laCells = loItemsAmnt[i]
              .getCells();

          var plant = laCells[0]
              .getValue();
          var ammount = laCells[1]
              .getValue();

          NavToPlantAmounts
              .push({
                Plant : plant,
                Description: "",
                RaceAmount : ammount
              });
        }

        if(loItemsAmnt.length != 0){
          oEntry.NavToPlantAmounts = NavToPlantAmounts;
//          oEntry.NavToPlantAmounts = [];
        }
        var modelData = this.getView().getModel("raceTreeJModel").getData();
        for(var ij=0;ij<modelData.length;ij++){
        	modelData[ij].Amount =  parseInt((modelData[ij].Amount)).toFixed(3);
        }
        var raceSplitAmount = [];
        for(var ij=0;ij<modelData.length;ij++){
            var obj={};
            obj.Persa = modelData[ij].Persa;
            obj.Racen = modelData[ij].Racen;
            obj.Id = modelData[ij].Id;
            obj.Parentid = modelData[ij].Parentid;
            obj.Text = modelData[ij].Text;
            obj.LevelCode = modelData[ij].LevelCode;
            obj.Amount = parseInt((modelData[ij].Amount)).toFixed(3);
            obj.Enabled = 'X';

            raceSplitAmount.push(obj);
          }
//        oEntry.NvgToAmountBreakUp = this.raceAmountArray;
        oEntry.NvgToAmountBreakUp = raceSplitAmount;
//        oEntry.NvgToAmountBreakUp = [];
        oEntry.NavToCost = laChildCost;
        oEntry.NavToGain = laChildgain;
        oEntry.NavToLText = LtextChild;
        oEntry.NavToApprove = laChildApprove;
//        oEntry.NvgToAmountBreakUp = [];
//        oEntry.NavToCost = [];


        var oViewJModel = this.getView().getModel("oViewJModel");
        oViewJModel.setProperty("/delay", 0);
        oViewJModel.setProperty("/busy", true);
        oViewJModel.refresh(true);
        setTimeout(function(){
          that.onCreateTestRequestSet(oEntry);
        }, 1000);

	},
	 onCreateTestRequestSet: function(payload){
         var busy = sap.ui.core.BusyIndicator;
         var oView = this.getView();
         var router = sap.ui.core.UIComponent
         .getRouterFor(this);
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
           sap.m.MessageBox.show("Race Request Updated : "+oResponse.data.RaceNumber, {
             title : "Information",
             icon : sap.m.MessageBox.Icon.INFORMATION,
             actions : [ 'OK' ],
             onClose: function(oAction) { 
	        	  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
	  				oCrossAppNavigator.toExternal({
	                target: { semanticObject : "#"}
	               });
	          }
           });
           idRaceTable.getModel().setData([]);
           this.raceAmountArray=[];


         };
         oParamsPOHeaderSet.error = function(oError) { // error handler 

            // error callback
           // function
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

//         sap.ui.core.BusyIndicator.show();
//         busy.show();
         frameworkODataModel.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

         frameworkODataModel.attachRequestCompleted(function() {

         });
       },
       

	onUpdate: function(){
		
		var _self = this;
		var RaceNumber = this.getView().byId("raceNumberInput").getValue();
		var Plant = this.getView().byId("plantInp").getValue();
		var FiscalYear = this.getView().byId("fiscal_YearInp").getValue();
		var Title1 = this.getView().byId("title2").getValue();
		var BriefDescription1 = this.getView().byId("brief_Desc2").getValue();
	
		var oEntry = {};
		oEntry.RaceEditAllow = "U";
		oEntry.RaceNumber = RaceNumber;
		oEntry.Plant = Plant;
		oEntry.FiscalYear = FiscalYear;
		oEntry.Title1 = Title1;
		oEntry.BriefDescription1 = BriefDescription1;
		
		var path = "/RaceHeaderSet(RaceNumber='"+RaceNumber+"',FiscalYear='"+FiscalYear+"',Plant='"+Plant+"')";


		var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
		var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({
			"Content-Type": "application/atom+xml"
			});

		oCreateModel1.create("/RaceHeaderSet", oEntry, null,
				function(oData, oResponds) {
					var rcno = oData.RaceNumber;
					sap.m.MessageBox.show("Race " + rcno + " has been updated", {
//						 icon
						// :
						// sap.m.MessageBox.Icon.ERROR,
						title : "Information",
						actions : [ 'OK' ],
						onClose : function(a) {
							var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			  				oCrossAppNavigator.toExternal({
			                target: { semanticObject : "#"}
			               });
						},
					});

				}, function(oData, oResponds) {
					sap.m.MessageBox.show("Something went wrong , Please try later.", {
						// icon
						// :
						// sap.m.MessageBox.Icon.ERROR,
						title : "Information",
						actions : [ 'OK' ],
						onClose : function(a) {
							_self.getView().byId("raceNumberInput").setValue();
							_self.bindView();
						},
					});

				})
				
	},
//	added by Hans (set Race amount table data)
	
		setRaceAmountData: function(data){
			var raceTableData = data.oData.d.results[0].NavToPlantAmounts;
			var raceTreeData = data.oData.d.results[0].NvgToAmountBreakUp;
			var raceTableJModel = new sap.ui.model.json.JSONModel();
			raceTableJModel.setData(raceTableData.results);
			
			var raceTable  =this.getView().byId("idRaceTable");
			raceTable.setModel(raceTableJModel, "raceTableJModel");
			raceTable.setVisibleRowCount(raceTableData.results.length);
			raceTable.getModel("raceTableJModel").refresh();
//			code for amount tree data to set in model
			var raceTreeJModel = new sap.ui.model.json.JSONModel();
//			raceTreeJModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			raceTreeJModel.setData(raceTreeData.results);
			this.getView().setModel(raceTreeJModel,"raceTreeJModel");
		},
		
		onDisplayRace: function(oEvent){
			initialFlag=false;
			var raceTbl = this.getView().byId("idRaceTable");
			this.raceAmountPath = oEvent.getSource().getParent()._getBindingContext("raceTableJModel").getPath().split('/')[1];
			var plant =raceTbl.getRows()[this.raceAmountPath].getCells()[0].getValue();
			var treeData = raceTbl.getModel("raceTreeJModel").getData();
			var arr= [];
			for(var i=0;i< treeData.length;i++){
				if(treeData[i].Persa == plant){
					arr.push(treeData[i]);
				}
			}
			var deepData = this.transformTreeData(arr);
			this.setModelData(deepData);
			this.openMasterListData(plant);
			
		},
		
		setModelData: function(nodes) {

			//store the nodes in the JSON model, so the view can access them
			var nodesModel = new sap.ui.model.json.JSONModel();
			nodesModel.setData({
					children: nodes
			});
			this.getView().setModel(nodesModel,"nodesModel");
		},
		
		openMasterListData: function(plant){
			var raceTbl = this.getView().byId("idRaceTable");
			var amountModel = this.getView().getModel("nodesModel");
		
				if (!this._RaceAmountDispDialog) {
					this._RaceAmountDispDialog = sap.ui.xmlfragment("ZRACEMGMT.view.RaceAmountDisplayDialog", this);
				}
				this.getView().addDependent(this._RaceAmountDispDialog);
				this._RaceAmountDispDialog.setModel(amountModel,"amountModel");
				
				this._RaceAmountDispDialog.open();
				this._RaceAmountDispDialog.setTitle("Amount (Plant : "+ plant+")");
				sap.ui.getCore().byId("TreeTableBasicDisplay").expandToLevel(3);
			
		},
		
		onCloseRaceAmountDispDialog: function(oEvent) {
        	this._RaceAmountDispDialog.close();
		},
		
		selectedTab: function(c){
			var selectedKey = c.getSource().getSelectedKey();
			if(selectedKey !== "HeaderInfo"){
				this.getView().byId("idRaceTable").setVisible(true);
			}else{
				this.getView().byId("idRaceTable").setVisible(true);
			}
		},
		
//		race amount breakup
		addNewItem : function() {
			var raceTable  =this.getView().byId("idRaceTable");
			var raceModel = raceTable.getModel("raceTableJModel");
            var _self = this;
            var that =  this;
//            var idRaceTable = this.getView().byId("idRaceTable");
            var raceData={
              Plant: "",
              RaceAmount: "",

            }

            raceModel.getData().push(raceData);

            raceTable.getModel("raceTableJModel").setData(raceModel.getData());
            var idRaceTableCount = raceTable.getModel("raceTableJModel").getData().length;
            raceTable.setVisibleRowCount(idRaceTableCount);
            
          },
		
/////////////////////////////////////////////////////////////////////////////////////////////////          
          
          onAddRaceAmount: function(oEvent){
//                  code for race amount dialog data
                  this.raceAmountPath = oEvent.getSource().getParent()._getBindingContext("raceTableJModel").getPath().split('/')[1];
                  var plant = oEvent.getSource().getParent()._getBindingContext("raceTableJModel").getObject().Plant;
                  
        	  var raceTbl = this.getView().byId("idRaceTable");
  			this.raceAmountPath = oEvent.getSource().getParent()._getBindingContext("raceTableJModel").getPath().split('/')[1];
  			var plant =raceTbl.getRows()[this.raceAmountPath].getCells()[0].getValue();
  			var treeData = raceTbl.getModel("raceTreeJModel").getData();
  			var arr= [];
  			for(var i=0;i< treeData.length;i++){
  				if(treeData[i].Persa == plant){
  					arr.push(treeData[i]);
  				}
  			}
  			if(arr.length > 0){
  				var deepData = this.transformTreeData(arr);
  	  			this.setModelData(deepData);
  	  			this.openMasterListData1();
  	  			this.getMasterListData(plant,"old");
  			}else{
  				this.getMasterListData(plant,"new");
  			}
  			
                },
                
//////////////////////////////////////////////////////////////////////////////////////////////////                
                
          openMasterListData1 : function(){
                  var raceTbl = this.getView().byId("idRaceTable");
//                  var amountModel = this.getView().getModel();
                  var amountModel = this.getView().getModel("nodesModel");
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

//                    this._RaceAmountDialog.open();
                    this.getView().addDependent(this._RaceAmountDialog);
                    this._RaceAmountDialog.setModel(amountModel);
                    this._RaceAmountDialog.open();
                    sap.ui.getCore().byId("TreeTableBasic").expandToLevel(3);
                    
//                    var data=path;
//                    var router = sap.ui.core.UIComponent.getRouterFor(this);
//                    router.navTo("amountPage", {details : data});
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
                         totl = parseFloat(parseFloat(raceTbl.getRows()[i].getCells()[1].getValue()) + parseFloat(totl)).toFixed(3);
                      }
                      this.getView().byId("Race_amtInp").setValue(totl);
                      this.getView().byId("Race_amtInp").setEnabled(false);
//                      this.onRaceChange();
                },

//////////////////////////////////////////////////////////////////////////////////////////////////                
                
          getRateAmountInArray : function(){
                  var modelData = this.getView().getModel("raceTreeJModel").getData();
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
                    obj.Amount = parseInt((modelData[i].Amount)).toFixed(3);
                    obj.Enabled = 'X';

                    this.raceAmountArray.push(obj);
                  }
                },

      //////////////////////////////////////////////////////////////////////////////////////////////////
                onRemoveRace : function(oEvent) {
                	
                		this.raceAmountPath = oEvent.getSource().getParent()._getBindingContext("raceTableJModel").getPath().split('/')[1];
                        var raceTbl = this.getView().byId("idRaceTable");
                        var path = oEvent.getSource().getParent()._getBindingContext("raceTableJModel").getPath().split('/')[1];
                        var plant = raceTbl.getRows()[this.raceAmountPath].getCells()[0].getValue();

            // code added to remove data from race tree amount data for payload
                        var delArray =[];
                        for( var i = 0 ; i < this.raceAmountArray.length ; i++ ){
                          if( this.raceAmountArray[i].Persa == plant )
                              delArray.push(i);
//                            this.raceAmountArray.splice(i, 1);
                        }
                        this.raceAmountArray = delArray.reduceRight(function (arr, it) {
                            arr.splice(it, 1);
                            return arr;
                        }, this.raceAmountArray.sort(function (a, b) { return b - a }));

            // code to remove data from table
                        if (path !== -1) {
                          raceTbl.getModel("raceTableJModel").getData().splice(path,1);
                          raceTbl.getModel("raceTableJModel").refresh();
                          var idRaceTableCount = raceTbl.getModel("raceTableJModel").getData().length;
                          raceTbl.setVisibleRowCount(idRaceTableCount);
                        }

                      },
                      
//////////////////////////////////////////////////////////////////////////////////////////////////                      

//                    race amount dialog code
                      getMasterListData: function(plant, type) {
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
                          if(type == "new"){
                        	  var deepData = that.transformTreeData(oData.results);
                              that.setModelData(deepData);
                              that.openMasterListData1();
                          }
                          
                        };
                        oParamsMatListSet.error = function(oError) { // error handler 
                        	var errmsg = JSON.parse(oError.response.body).error.message.value;
                        	sap.m.MessageBox.alert(
                        			errmsg, {
            							icon: sap.m.MessageBox.Icon.WARNING,
            							title: "Error"
            						}
            					);
                        	
//                          jQuery.sap.log.error("read publishing group data failed");
//                          sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
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
                            if(nodesIn[i].Enabled == "X" || nodesIn[i].Enabled == true){
                              nodesIn[i].Enabled = true;
                            }else if(nodesIn[i].Enabled == "" || nodesIn[i].Enabled == false){
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
                              WBS : nodeIn.WBS,
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
//                            	oEvent.getSource().setValue(diaMNo);
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
                                model.getProperty(changeKey+"/"+abc).Amount = parseInt(model.getProperty(changeKey+"/"+abc).Amount);
                                model.getProperty(changeKey+"/"+abc).Amount += changeValue;
                                this.setAmountaDataInModel(model, changeKey+"/"+abc);
                              }

                              changeKey = changeKey+indexs;
                              model.getProperty(changeKey).Amount = parseInt(model.getProperty(changeKey).Amount);
                              model.getProperty(changeKey).Amount += changeValue;
                              this.setAmountaDataInModel(model, changeKey);
                            }.bind(this));
                            model.refresh();
                          },
//////////////////////////////////////////////////////////////////////////////////////////////////                          
//                          code added to change amount in MaterialList model on change event in amount
                          setAmountaDataInModel: function(model, path){
                        	var selectedPlant = this.getView().byId("idRaceTable").getRows()[this.raceAmountPath].getCells()[0].getValue();
                            var obj = model.getProperty(path);
                            var modelData = this.getView().getModel("raceTreeJModel").getData();
                            for(var i= 0 ; i< modelData.length;i++){
                            	if(modelData[i].Persa == selectedPlant){
                            		if(modelData[i].Id == obj.Id){
                                        modelData[i].Amount = obj.Amount;
                                      }
                            	}
                               
                            }
                          },
                          
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
//                                    var that = this;
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
//                                    var that = this;
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
                          
//*****************************************************************************************************************                          
//Add By Ram
   onAprrove: function(e){
	   
      var self= this;
      var oEntry = {}
                    		
     /* var raceNo = e.getSource().getParent().getCells()[0].getText();
      var fY = e.getSource().getParent().getCells()[7].getValue();
      var plant = e.getSource().getParent().getCells()[2].getValue();
      var itmNo = e.getSource().getParent().getCells()[6].getValue();
      var itemtxt = e.getSource().getParent().getCells()[1].getValue();
      var rceAmt = e.getSource().getParent().getCells()[3].getValue();*/
      
      var raceNo 	= this.getView().byId("raceNumberInput").getValue();
      var fY 		= this.getView().byId("fiscal_YearInp").getValue();
      var plant 	= this.getView().byId("plantInp").getValue();
      var itmNo 	= Gv_ItemNo;
      var briefDesc = this.getView().byId("brief_DescInp").getValue();
      var rceAmt 	= this.getView().byId("Race_amtInp").getValue();
      
                    		
      oEntry.RaceNumber = raceNo;
      oEntry.FiscalYear = fY;
      oEntry.Plant 		= plant;
      oEntry.ItemNo 	= itmNo;
      oEntry.Brdcp		 = briefDesc;
      oEntry.RaceApprovalAmount = rceAmt;
     
      
      var dialog = new sap.m.Dialog({
   		title : "Are you sure you want to approve?",
   		type : 'Message',
   		state : 'Warning',
   			content : [
   				new sap.m.Label({
   					text : "Comments",
   					labelFor : 'submitDialogTextarea'
   				}),

   				new sap.m.TextArea('submitDialogTextarea',{
   					
   					liveChange : function(oEvent) {
   						var sText = oEvent.getParameter('value');
   						oEntry.ItemText = sText;
   						//var parent = oEvent.getSource().getParent();
   						//parent.getBeginButton().setEnabled(sText.length > 0);
   					},
   					width : '100%',
   					maxLength : 250,
   					height : '80px',
   					placeholder : "Add Comments"
   				})],

   				beginButton : new sap.m.Button({
   					text : "OK",
   					enabled : true,
   					press : function() {
   					   var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
   	                   var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
   	                   	oCreateModel1.setHeaders({
   	                   		"Content-Type": "application/atom+xml"
   	                   	});

   	                   	oCreateModel1.create("/RaceApproveSet", oEntry, null,
   	                   		function(oData, oResponds) {
   	                   			
   	                   			sap.m.MessageToast.show("Approved",{
   	                   				duration : 3000
   	                   			});
   	                   		    dialog.close();
   	                   		var router = sap.ui.core.UIComponent.getRouterFor(self);
                			router.navTo("SS1");	
   	                   		}, 
   	                   		
   	                   		function(oData, oResponds) {
   	                   				var a = 1;
   	                   		})
   								
   					}
   				}),

   				endButton : new sap.m.Button({
   					text : "Cancel",
   					press : function() {
   						dialog.close();
   					}
   				}),

   				afterClose : function() {
   					dialog.destroy();
   				}
   			}).addStyleClass("sapUiSizeCompact");
              
          dialog.open();
   
     /* sap.m.MessageBox.show("Are you sure you want to approve?",{
             icon : sap.m.MessageBox.Icon.WARNING,
             title : "Warning",
             actions : [ "Continue", "Cancel" ],
             onClose : function(a) {
                 if (a === "Continue") {
                    var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
                    var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
                    	oCreateModel1.setHeaders({
                    		"Content-Type": "application/atom+xml"
                    	});

                    	oCreateModel1.create("/RaceApproveSet", oEntry, null,
                    		function(oData, oResponds) {
                    			
                    			sap.m.MessageToast.show("Approved",{
                    				duration : 3000
                    			});
                    			var router = sap.ui.core.UIComponent.getRouterFor(self);
                    			router.navTo("SS1");
                    		}, 
                    		
                    		function(oData, oResponds) {
                    				var a = 1;
                    		})
                    		//self._onRoute();
                  } else if(a === "Cancel"){
                    	sap.m.MessageBox.Action.CANCEL
                   }
              },
           });*/
},

//****************************************************************************************************************
onReject: function(e){
	
	var self= this;
	var oEntry = {}
	
	/*var raceNo = e.getSource().getParent().getCells()[0].getText();
	var fY = e.getSource().getParent().getCells()[7].getValue();
	var plant = e.getSource().getParent().getCells()[2].getValue();
	var itmNo = e.getSource().getParent().getCells()[6].getValue();
	var itemtxt = e.getSource().getParent().getCells()[1].getValue();
	var rceAmt = e.getSource().getParent().getCells()[3].getValue();*/
	
	var raceNo 	= this.getView().byId("raceNumberInput").getValue();
    var fY 		= this.getView().byId("fiscal_YearInp").getValue();
    var plant 	= this.getView().byId("plantInp").getValue();
    var itmNo 	= Gv_ItemNo;
    var itemtxt = "";
    var rceAmt 	= this.getView().byId("Race_amtInp").getValue();
	
	oEntry.RaceNumber = raceNo;
	oEntry.FiscalYear = fY;
	oEntry.Plant = plant;
	oEntry.ItemNo = itmNo;
	oEntry.ItemText = itemtxt;
	oEntry.RaceApprovalAmount = rceAmt;
	
	var dialog = new sap.m.Dialog({
		title : "Are you sure you want to reject?",
		type : 'Message',
		state : 'Warning',
			content : [
				new sap.m.Label({
					text : "Reason of Rejection",
					labelFor : 'submitDialogTextarea'
				}),

				new sap.m.TextArea('submitDialogTextarea',{
					
					liveChange : function(oEvent) {
						var sText = oEvent.getParameter('value');
						var parent = oEvent.getSource().getParent();
							parent.getBeginButton().setEnabled(sText.length > 0);
					},
					width : '100%',
					maxLength : 250,
					height : '80px',
					placeholder : "Add Note"
				})],

				beginButton : new sap.m.Button({
					text : "OK",
					enabled : false,
					press : function() {
						var sServiceUrl = "/sap/opu/odata/sap/ZMM_RACE_SRV/";
						var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
							oCreateModel1.setHeaders({
									"Content-Type": "application/atom+xml"
									});

						oCreateModel1.create("/RaceRejectSet", oEntry, null,
							function(oData, oResponds) {
								
								sap.m.MessageToast.show("Rejected",{
									duration : 3000
								});
								dialog.close();
								var router = sap.ui.core.UIComponent.getRouterFor(self);
                    			router.navTo("SS1");
								//self._onRoute();
						},
						
							function(oData, oResponds) {
									var a = 1;
									})
								
					}
				}),

				endButton : new sap.m.Button({
					text : "Cancel",
					press : function() {
						dialog.close();
					}
				}),

				afterClose : function() {
					dialog.destroy();
				}
			}).addStyleClass("sapUiSizeCompact");
	
	dialog.open();
},
//****************************************************************************************************************
onCorrection:function(){
	
	
},
//****************************************File Upload *************************************************************	

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
                          	//that.saveUploadedDocs(that.SelectedData.planguid, that.SelectedData.planrevno);         	// document upload
                          	
                          	// _onRoute
                          	//this.getAttachmentDetails(this.SelectedData.planguid,this.SelectedData.planrevno);  		// document upload
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
                          
                  		saveUploadedDocs: function(RaceNo){
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
                  				
                  				jQuery.sap.log.error("read publishing group data failed");
                  			}.bind(this);

                  			oCreateModel1.create(sPathPOHeaderSet, payload, oParamsPOHeaderSet);

                  			oCreateModel1.attachRequestCompleted(function() {
                  				
                  			});
                  		},
                            
                  		createDocsPayload: function(RaceNo){
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

                        getAttachmentDetails: function(raceNum){        //document upload
                        	
                			var oView = this.getView();
                			var oUploadModel = this.getView().getModel("oUploadModel");
                			var oCreateModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPS_UTILITY_SRV");
                			
                			var raceno = raceNum;
                			for(var i=0;i<raceNum.length-1;i++){
                		    if(raceNum[i]=="/"){
                			   raceno=raceno.replace("/","-");	 
                			 }	
                			};           			
                			
                			var sPathAttachmentSet = "/ImageUploadObjectSet(ObjectID='01',ObjectName='"	+raceno+"')?$expand=ImageObjectToDataNvg";
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
             // **********************File upload Finish****************************	
//Add By Ram

                		

onBack:function(){
	window.history.back();
},             		
});
});
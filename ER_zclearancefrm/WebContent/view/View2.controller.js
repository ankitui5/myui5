var that, newDate,EmpId,ResDateFrom,ResDateTo,NoDuesQuesetionTblJModel,Dept,ClearStatus,Guid,
FinalExitDate,EmpName,Appraiser,Reviewer,HR ,HRName ,HRSalaryHold,PersonnelSubarea, PersonnelArea;

sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast", 
	"jquery.sap.global",
	"jquery.sap.script",
	"zclearancefrm/util/Formatter"
	],
	
function(MessageBox,Fragment,Controller, JSONModel,MessageToast) {
		 "use strict";
		
return sap.ui.controller("zclearancefrm.view.View2", {
	
	onInit:function(){
		var that = this;
		 sap.ui.core.UIComponent.getRouterFor(this).getRoute("page2").attachMatched(this._onRoute, this);
		 
		//header data details model
		 var oViewObj = this.getView();
		 debugger
		 
		 //Create a model using department type question 
		 var NewJModel = oViewObj.getModel("NewJModel");
			if (!NewJModel) {
				NewJModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(NewJModel, "NewJModel");
			}
		var New1JModel = oViewObj.getModel("New1JModel");
			if (!New1JModel) {
				New1JModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(New1JModel, "New1JModel");
			}
		 
			var NoDuesQuesetionJModel = oViewObj.getModel("NoDuesQuesetionJModel");
			if (!NoDuesQuesetionJModel) {
				NoDuesQuesetionJModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(NoDuesQuesetionJModel, "NoDuesQuesetionJModel");
			}
			
		//table data details model	
			
			 var oViewObj = this.getView();
			 debugger
				var NoDuesQuesetionTblJModel = oViewObj.getModel("NoDuesQuesetionTblJModel");
				if (!NoDuesQuesetionTblJModel) {
					NoDuesQuesetionTblJModel = new sap.ui.model.json.JSONModel();
					oViewObj.setModel(NoDuesQuesetionTblJModel, "NoDuesQuesetionTblJModel");
				}
		},
	
	_onRoute : function(e){
		debugger
		var that 				= this;
		var tempjsonString  	= e.getParameter("arguments").entity;
		var jsonstring 			= tempjsonString.replace(/@/g, "/");
		var tempSelectedData 	= JSON.parse(jsonstring);
		this.SelectedData  		= JSON.parse(tempSelectedData);
		var allSelectedData 	= this.SelectedData;
		this.onEnter(allSelectedData);

	},
	
			onEnter:function(allSelectedData){
				debugger
				var that = this;
				var oViewObj   = this.getView();
				EmpId 		   = allSelectedData.empid;
			  /*EmpName		   = allSelectedData.EmpName;
				FinalExitDate  = allSelectedData.FinalExitDate;*/
				Guid 		   = allSelectedData.Guid;
				Dept		   = allSelectedData.Dept;
				ClearStatus    = allSelectedData.ClearStatus;
				var NoDuesQuesetionTblJModel = that.getView().getModel("NoDuesQuesetionTblJModel");
			    var NoDuesQuesetionJModel    = that.getView().getModel("NoDuesQuesetionJModel");
			    var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";
				var sPathCartListSet = "ClearanceSet(Guid='"+Guid+"',Dept='"+Dept+"')?$expand=PernrToQuesNvg";		
				var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
				oParamsCartListSet.success = function(oData, oResponse) { // success handler
				debugger
				NoDuesQuesetionTblJModel.setData();
				NoDuesQuesetionJModel.setData();
				NoDuesQuesetionTblJModel.setData(oData.PernrToQuesNvg.results);
				NoDuesQuesetionJModel.setData(oData);
				EmpName		   = NoDuesQuesetionJModel.oData.EmpName;
				FinalExitDate  = NoDuesQuesetionJModel.oData.FinalExitDate;
				Appraiser	   = NoDuesQuesetionJModel.oData.Appraiser;
				Reviewer  	   = NoDuesQuesetionJModel.oData.Reviewer;
				HR	           = NoDuesQuesetionJModel.oData.HR;
				HRName         = NoDuesQuesetionJModel.oData.HRName;
				HRSalaryHold   = NoDuesQuesetionJModel.oData.HRSalaryHold;
				
				
			
				 PersonnelArea    = NoDuesQuesetionJModel.oData.PersonnelArea;
				 PersonnelSubarea = NoDuesQuesetionJModel.oData.PersonnelSubarea;
				
				//set Table Data
				that.getView().byId("idNoDuesTable").setModel(NoDuesQuesetionTblJModel, "NoDuesQuesetionTblJModel");
				var items  = oData.PernrToQuesNvg.results
				var idProf = oViewObj.byId("idNoDuesTable");
				var tblrow = idProf.getItems();
				if (ClearStatus == "X"){
				 that.getView().byId("idSubmit").setVisible(false);
				}
				else{
					that.getView().byId("idSubmit").setVisible(true);
				}
				
				for(var i =0; i<items.length; i++){					
				if (ClearStatus == "X"){
						 tblrow[i].getCells()[2].setEnabled(false);
						 tblrow[i].getCells()[3].setEnabled(false);
						 that.getView().byId("idSubmit").setVisible(false);
				}
				if (items[i].Answer == "1"){
						 tblrow[i].getCells()[2].setSelectedIndex(0); 
					 }
				}
				};
			//this.bindAllClearanceQuestions();//Get all clearance questions
			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			frameworkODataModel.read(sPathCartListSet, oParamsCartListSet);
			frameworkODataModel.attachRequestCompleted(function() {
			});
			},
			
/*************************************************************************************/			
		
			
/******************************Validation table row ************************************/	
	ValidateFields : function(){
		debugger
		var tableQuesAns = this.getView().byId("idNoDuesTable");
		var tblrow = tableQuesAns.getItems();
		var len = tblrow.length;
		var chk = true;
		for(var i=0; i<len; i++){
			var len2 = tblrow[i].getCells().length;
			for(var j=4; j<=len2; j++){
			
			}
		}
		if(chk == false)
			return false
		},
	
	onSubmit:function(){
		debugger
	
		var check = true;
	//	var router = sap.ui.core.UIComponent.getRouterFor(this);
		var tbl  = this.getView().byId("idNoDuesTable");
		var ClrTblJModel  = this.getView().getModel("NoDuesQuesetionTblJModel");
		var Data={};
		Data.Guid   			 = Guid;
		Data.Dept	 			 = Dept;
		Data.EmpId   			 = EmpId;
		Data.EmpName		 	 = EmpName;
		Data.Appraiser	    	 = Appraiser;
		Data.Reviewer  	    	 = Reviewer;
		Data.HR	          		 = HR;
		Data.HRName              = HRName;
		Data.FinalExitDate       = FinalExitDate;
		Data.PersonnelSubarea    = PersonnelSubarea;
		Data.PersonnelArea		 = PersonnelArea;
		
		Data.PernrToQuesNvg=[];
		var tableQuesAns = tbl;
		var Item = ClrTblJModel.getData();
	    var len2 = tableQuesAns.getItems().length;
		for(var i=0; i<len2; i++){
			var obj={};
			var req = Item[i].RemarksReq;
			obj.Serial     = tableQuesAns.getItems()[i].getCells()[4].getText();
			obj.Question   = tableQuesAns.getItems()[i].getCells()[1].getText();
			obj.Answer	   = tableQuesAns.getItems()[i].getCells()[2].getSelectedIndex();
			obj.Remarks    = tableQuesAns.getItems()[i].getCells()[3].getValue()
		
			//change using a text area 
			tbl.getItems()[i].getCells()[3].setValueState("None");
				if(req == "X" && obj.Remarks == ""){
					tbl.getItems()[i].getCells()[3].setValueState("Error");	
				 check = false;	
				}
			
			obj.QuestionType = "04";
			obj.RemarksReq	 = "";
			Data.PernrToQuesNvg.push(obj);
			}
		
		if(check==false){
			sap.m.MessageBox.show("Please fill required remarks", {
		        title: "Error",
		        icon:sap.m.MessageBox.Icon.ERROR,				     
		    });
		 return;	
		}
		var sServiceUrl = "/sap/opu/odata/sap/ZER_SEPARATION_SRV/";
		var oCreateModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel.setHeaders({
			"Content-Type": "application/atom+xml"
			});
		var fncSuccess = function(oData, oResponse) //success function 
			{
			sap.m.MessageBox.show("No Dues Form Submitted Successfully", {
		        title: "Success",
		        icon:sap.m.MessageBox.Icon.SUCCESS,
		        onClose:function(){
		        	var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");  
		        	oCrossAppNavigator.toExternal({  
		        	target: { semanticObject : "#"}  
		        	}); 	
		        	//window.location.reload();
		        }
		    });
	
			}
		
		var fncError = function(oError) { //error callback function
			var parser = new DOMParser();
			
		//	sap.m.MessageBox.show(parser, {
				sap.m.MessageBox.show("Please fill all Required Fields.", {
		        title: "Error",
		        icon:sap.m.MessageBox.Icon.ERROR,
		    });
		}
		//Create Method for final Save
		oCreateModel.create("/ClearanceSet", Data, {
			success: fncSuccess,
			error: fncError
		});
	//	router.navTo("page1");
	},
	
	onBack:function(){
		 this.openDialog("cancel");
	},
	openDialog : function(status) {
		debugger
      var labelMessage;
	  var router = sap.ui.core.UIComponent.getRouterFor(this);
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
        }) ],
        beginButton : new sap.m.Button({
          text : 'Yes',
          press : function() {
           
        	  if (status == 'cancel') {
            //  _that.onNavBack();
        		
        		 
        			router.navTo("page1");
            //  window.history.back()
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
	
	
	})
});
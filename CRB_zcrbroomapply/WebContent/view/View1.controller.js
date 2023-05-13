var Empcode,Username,Persa,btcd,statusJModel;

sap.ui.define([
		'sap/m/Label',
		'sap/m/Popover',
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/m/List',
		'sap/m/StandardListItem',
		'sap/ui/core/format/DateFormat',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'zcrbroomapply/util/Formatter'
		/*'sap/base/Log'*/],
function(Label, Popover, Button, Dialog, List, StandardListItem, DateFormat, Fragment, Controller, JSONModel, Formatter) {
	"use strict";
	var conferenceDataJModel , that;
	return Controller.extend("zcrbroomapply.view.View1", {
	onInit: function (){
		debugger 
		that = this;
		statusJModel = new JSONModel();
		this.getView().byId("PC1").setModel(statusJModel, "statusJModel");
		
		var datum = new Date();
		var time = datum.toLocaleTimeString();
		datum = datum.toString();
		datum = datum.substr(0,16);
		this.getView().byId("idDate").setText(datum).addStyleClass("textBold");
		
		 // example usage: realtime clock
		 setInterval(function(){
		     var   currentTime = that.getDateTime();
		       that.getView().byId("idTime").setText(currentTime);
		    }, 1000);
	//	this.FunAppoinment();
		 
		
	this.getCalendarData();
	//	this.getUserInfo();
	},
	
//  time function	
	getDateTime:function() {
		var now     = new Date(); 
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
        }
        if(second.toString().length == 1) {
             second = '0'+second;
        }   
        var dateTime = hour+':'+minute+':'+second;   
         return dateTime;
        
    },
    
//////////////////////////////////////////////////////////////////////////////////////////////////
	getUserInfo:function(){
		debugger
		var that= this;
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZSTAT_MNGT_SRV/"; 
		var sPath = "/GetEmpDetailSet(Username='"+sap.ushell.Container.getService("UserInfo").getId()+"')";
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
		var oData = {};
					oData.success = function(oData,oResponse){
						debugger
						that.getView().byId("idName").setText(oData.Ename).addStyleClass("textBold");
						that.getView().byId("idLocation").setText(oData.Name1).addStyleClass("textBold");
					//	that.getView().byId("idEmpCode").setText(oData.Empcode).addStyleClass("textBold");
						Empcode = oData.Empcode;
						Username= oData.Username;
						Persa = oData.Persa;
						btcd = oData.btcd;
						
			//			that.getUserHistory();
					};
					oData.error = function(oError){
						debugger 
					};
		oDataModel.read(sPath, oData);
	},
	/********************On Room Id Help**********************************************************/
	onRoomIdF4: function(){

		var sPath = "/sap/opu/odata/SAP/ZBOOKING_MNGT_SRV/F4RoomIdSet?$filter=Lgort eq 'JKHO'";
		 var jModel = new sap.ui.model.json.JSONModel();
		      jModel.loadData(sPath, null, false,"GET",false, false, null);
		  var _valueHelpRoomIDSelectDialog = new sap.m.SelectDialog({
					title : "Select Room",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem({
							title : "{RoomId}",
							description: "{Name}",
							customData : [ new sap.ui.core.CustomData({
								key : "{Lgort}",
								value : "{RoomId}"
							})],
						}),
					},
			liveChange : function(oEvent) {
	
				 var sValue = oEvent.getParameter("value");
			     var oFilter = new sap.ui.model.Filter("Lgort",sap.ui.model.FilterOperator.Contains,sValue);
			     var oFilter1 = new sap.ui.model.Filter("RoomId",sap.ui.model.FilterOperator.Contains,sValue);
			     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
					 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
			},
			
				confirm : [ this._handRoomIdClose, this ],
				cancel : [ this._handleRoomIdClose, this ]
			});
		  
		  _valueHelpRoomIDSelectDialog.setModel(jModel);
		  _valueHelpRoomIDSelectDialog.open();
		},
		_handRoomIdClose : function(oEvent) {
	
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("idRoomId").setValue(oSelectedItem.getTitle());
			}
	},
	
	
	
  
//***********************************************************************************************************************
getCalendarData:function(){	
	debugger
	var oModel = new JSONModel();
	oModel.setData({
		startDate: new Date("2020", "3", "15", "8", "0"),
		people: [
			/*{
			pic: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
			name: "Test Name1",
			role: "team member",
			appointments: [
				{
					start: new Date("2020", "3", "8", "08", "30"),
					end: new Date("2020", "3", "8", "09", "30"),
					title: "Meet Max Mustermann",
					type: "Type02",
					tentative: false
				},
				{
					start: new Date("2020", "3", "11", "10", "0"),
					end: new Date("2020", "3", "11", "12", "0"),
					title: "Team meeting",
					info: "room 1",
					type: "Type01",
					pic: "sap-icon://sap-ui5",
					tentative: false
				},
				{
					start: new Date("2020", "3", "12", "11", "30"),
					end: new Date("2020", "3", "12", "13", "30"),
					title: "Lunch",
					info: "canteen",
					type: "Type03",
					tentative: true
				},
				{
					start: new Date("2020", "3", "15", "08", "30"),
					end: new Date("2020", "3", "15", "09", "30"),
					title: "Meet Max Mustermann",
					type: "Type02",
					tentative: false
				},
				{
					start: new Date("2020", "3", "15", "10", "0"),
					end: new Date("2020", "3", "15", "12", "0"),
					title: "Team meeting",
					info: "room 1",
					type: "Type01",
					pic: "sap-icon://sap-ui5",
					tentative: false
				},
				{
					start: new Date("2020", "3", "15", "11", "30"),
					end: new Date("2020", "3", "15", "13", "30"),
					title: "Lunch",
					info: "canteen",
					type: "Type03",
					tentative: true
				},
				{
					start: new Date("2020", "3", "15", "13", "30"),
					end: new Date("2020", "3", "15", "17", "30"),
					title: "Discussion with clients",
					info: "online meeting",
					type: "Type02",
					tentative: false
				},
				{
					start: new Date("2020", "3", "16", "04", "00"),
					end: new Date("2020", "3", "16", "22", "30"),
					title: "Discussion of the plan",
					info: "Online meeting",
					type: "Type04",
					tentative: false
				},
				{
					start: new Date("2020", "3", "18", "08", "30"),
					end: new Date("2020", "3", "18", "09", "30"),
					title: "Meeting with the manager",
					type: "Type02",
					tentative: false
				},
				{
					start: new Date("2020", "3", "18", "11", "30"),
					end: new Date("2020", "3", "18", "13", "30"),
					title: "Lunch",
					info: "canteen",
					type: "Type03",
					tentative: true
				},
				{
					start: new Date("2020", "3", "18", "1", "0"),
					end: new Date("2020", "3", "18", "22", "0"),
					title: "Team meeting",
					info: "regular",
					type: "Type01",
					pic: "sap-icon://sap-ui5",
					tentative: false
				},
				{
					start: new Date("2020", "3", "21", "00", "30"),
					end: new Date("2020", "3", "21", "23", "30"),
					title: "New Product",
					info: "room 105",
					type: "Type03",
					tentative: true
				},
				{
					start: new Date("2020", "3", "25", "11", "30"),
					end: new Date("2020", "3", "25", "13", "30"),
					title: "Lunch",
					type: "Type01",
					tentative: true
				},
				{
					start: new Date("2020", "3", "29", "10", "0"),
					end: new Date("2020", "3", "29", "12", "0"),
					title: "Team meeting",
					info: "room 1",
					type: "Type01",
					pic: "sap-icon://sap-ui5",
					tentative: false
				},
				{
					start: new Date("2020", "3", "30", "08", "30"),
					end: new Date("2020", "3", "30", "09", "30"),
					title: "Meet Max Mustermann",
					type: "Type02",
					tentative: false
				},
				{
					start: new Date("2020", "3", "30", "10", "0"),
					end: new Date("2020", "3", "30", "12", "0"),
					title: "Team meeting",
					info: "room 1",
					type: "Type01",
					pic: "sap-icon://sap-ui5",
					tentative: false
				},
				{
					start: new Date("2020", "3", "30", "11", "30"),
					end: new Date("2020", "3", "30", "13", "30"),
					title: "Lunch",
					type: "Type03",
					tentative: true
				},
				{
					start: new Date("2020", "3", "30", "13", "30"),
					end: new Date("2020", "3", "30", "17", "30"),
					title: "Discussion with clients",
					type: "Type02",
					tentative: false
				},
				{
					start: new Date("2020", "3", "31", "10", "00"),
					end: new Date("2020", "3", "31", "11", "30"),
					title: "Discussion of the plan",
					info: "Online meeting",
					type: "Type04",
					tentative: false
				},
				{
					start: new Date("2020", "3", "3", "08", "30"),
					end: new Date("2020", "3", "13", "09", "30"),
					title: "Meeting with the manager",
					type: "Type02",
					tentative: false
				},
				{
					start: new Date("2020", "3", "4", "10", "0"),
					end: new Date("2020", "3", "4", "12", "0"),
					title: "Team meeting",
					info: "room 1",
					type: "Type01",
					pic: "sap-icon://sap-ui5",
					tentative: false
				},
				{
					start: new Date("2020", "3", "30", "10", "0"),
					end: new Date("2020", "3", "33", "12", "0"),
					title: "Working out of the building",
					type: "Type07",
					pic: "sap-icon://sap-ui5",
					tentative: false
				}
			],
			headers: [
				{
					start: new Date("2020", "3", "15", "8", "0"),
					end: new Date("2020", "3", "15", "10", "0"),
					title: "Reminder",
					type: "Type06"
				},
				{
					start: new Date("2020", "0", "15", "17", "0"),
					end: new Date("2020", "0", "15", "19", "0"),
					title: "Reminder",
					type: "Type06"
				},
				{
					start: new Date("2020", "8", "1", "0", "0"),
					end: new Date("2020", "10", "30", "23", "59"),
					title: "New quarter",
					type: "Type10",
					tentative: false
				},
				{
					start: new Date("2018", "1", "1", "0", "0"),
					end: new Date("2018", "3", "30", "23", "59"),
					title: "New quarter",
					type: "Type10",
					tentative: false
				}
			]
		},*/
			/*{
				pic: "https://images.unsplash.com/photo-1548754144-65873dce8beb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
				name: "Test Name2",
				role: "team member",
				appointments: [
					{
						start: new Date("2020", "3", "10", "18", "00"),
						end: new Date("2020", "3", "10", "19", "10"),
						title: "Discussion of the plan",
						info: "Online meeting",
						type: "Type04",
						tentative: false
					},
					{
						start: new Date("2020", "3", "9", "10", "0"),
						end: new Date("2020", "3", "13", "12", "0"),
						title: "Workshop out of the country",
						type: "Type07",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2020", "3", "15", "08", "00"),
						end: new Date("2020", "3", "15", "09", "30"),
						title: "Discussion of the plan",
						info: "Online meeting",
						type: "Type04",
						tentative: false
					},
					{
						start: new Date("2020", "3", "15", "10", "0"),
						end: new Date("2020", "3", "15", "12", "0"),
						title: "Team meeting",
						info: "room 1",
						type: "Type01",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2020", "3", "15", "18", "00"),
						end: new Date("2020", "3", "15", "19", "10"),
						title: "Discussion of the plan",
						info: "Online meeting",
						type: "Type04",
						tentative: false
					},
					{
						start: new Date("2020", "3", "16", "10", "0"),
						end: new Date("2020", "3", "31", "12", "0"),
						title: "Workshop out of the country",
						type: "Type07",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2018", "3", "1", "0", "0"),
						end: new Date("2018", "4", "31", "23", "59"),
						title: "New quarter",
						type: "Type10",
						tentative: false
					},
					{
						start: new Date("2020", "01", "11", "10", "0"),
						end: new Date("2020", "02", "20", "12", "0"),
						title: "Team collaboration",
						info: "room 1",
						type: "Type01",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2020", "3", "01", "10", "0"),
						end: new Date("2020", "3", "31", "12", "0"),
						title: "Workshop out of the country",
						type: "Type07",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2020", "4", "01", "10", "0"),
						end: new Date("2020", "4", "31", "12", "0"),
						title: "Out of the office",
						type: "Type08",
						tentative: false
					},
					{
						start: new Date("2020", "7", "1", "0", "0"),
						end: new Date("2020", "7", "31", "23", "59"),
						title: "Vacation",
						info: "out of office",
						type: "Type04",
						tentative: false
					}
				],
				headers: [
					{
						start: new Date("2020", "3", "15", "9", "0"),
						end: new Date("2020", "3", "15", "10", "0"),
						title: "Payment reminder",
						type: "Type06"
					},
					{
						start: new Date("2020", "3", "15", "16", "30"),
						end: new Date("2020", "3", "15", "18", "00"),
						title: "Private appointment",
						type: "Type06"
					}
				]
			},*/
			{
				//pic: "sap-icon://employee",
				pic:  "https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
				name: "Test Name3",
				role: "team member",
				appointments: [
					{
						start: new Date("2020", "3", "15", "08", "30"),
						end: new Date("2020", "3", "15", "09", "30"),
						title: "Meet John Miller",
						type: "Type02",
						tentative: false
					},
					{
						start: new Date("2020", "3", "15", "10", "0"),
						end: new Date("2020", "3", "15", "12", "0"),
						title: "Team meeting",
						info: "room 1",
						type: "Type01",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2020", "3", "15", "13", "00"),
						end: new Date("2020", "3", "15", "16", "00"),
						title: "Discussion with clients",
						info: "online",
						type: "Type02",
						tentative: false
					},
					{
						start: new Date("2020", "3", "16", "0", "0"),
						end: new Date("2020", "3", "16", "23", "59"),
						title: "Vacation",
						info: "out of office",
						type: "Type08",
						tentative: false
					},
					{
						start: new Date("2020", "3", "17", "1", "0"),
						end: new Date("2020", "3", "18", "22", "0"),
						title: "Workshop",
						info: "regular",
						type: "Type08",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2020", "3", "19", "08", "30"),
						end: new Date("2020", "3", "19", "18", "30"),
						title: "Meet John Doe",
						type: "Type08",
						tentative: false
					},
					{
						start: new Date("2020", "3", "19", "10", "0"),
						end: new Date("2020", "3", "19", "16", "0"),
						title: "Team meeting",
						info: "room 1",
						type: "Type08",
						pic: "sap-icon://sap-ui5",
						tentative: false
					},
					{
						start: new Date("2020", "3", "19", "07", "00"),
						end: new Date("2020", "3", "19", "17", "30"),
						title: "Discussion with clients",
						type: "Type08",
						tentative: false
					},
					{
						start: new Date("2020", "3", "20", "0", "0"),
						end: new Date("2020", "3", "20", "23", "59"),
						title: "Vacation",
						info: "out of office",
						type: "Type08",
						tentative: false
					},
					{
						start: new Date("2020", "3", "22", "07", "00"),
						end: new Date("2020", "3", "27", "17", "30"),
						title: "Discussion with clients",
						info: "out of office",
						type: "Type08",
						tentative: false
					},
					{
						start: new Date("2020", "2", "13", "9", "0"),
						end: new Date("2020", "2", "17", "10", "0"),
						title: "Payment week",
						type: "Type08"
					},
					{
						start: new Date("2020", "03", "10", "0", "0"),
						end: new Date("2020", "05", "16", "23", "59"),
						title: "Vacation",
						info: "out of office",
						type: "Type04",
						tentative: false
					},
					{
						start: new Date("2020", "07", "1", "0", "0"),
						end: new Date("2020", "09", "31", "23", "59"),
						title: "New quarter",
						type: "Type10",
						tentative: false
					}
				],
				headers: [
					{
						start: new Date("2020", "3", "16", "0", "0"),
						end: new Date("2020", "3", "16", "23", "59"),
						title: "Private",
						type: "Type05"
					}
				]
				
			}
		]
	});
	this.getView().setModel(oModel);
			
},	

//**********************************************************************************************************************
handleAppointmentCreate: function (oEvent) {
	debugger
	var that = this;
	if(!that._CreateDialog){
		that._CreateDialog = sap.ui.xmlfragment("zcrbroomapply.view.Create", that);
		
	}
		that._CreateDialog.addStyleClass("sapUiContentPadding");
		that._CreateDialog.open();
},
//**********************************************************************************************************************
onAppoinmentClose: function (oEvent){
	var that = this;
	that._CreateDialog.close();
},
	

//**********************************************************************************************************************
CreateNewAppointment:function(){
	debugger
	var that = this;
	var oStartDate  	= sap.ui.getCore().byId("idstartDate").getDateValue();
	var oEndDate 		= sap.ui.getCore().byId("idendDate").getDateValue();
	var sTitle 			= sap.ui.getCore().byId("idinputTitle").getValue();
	var sInfoResponse	= sap.ui.getCore().byId("idmoreInfo").getValue();
	
	if (sap.ui.getCore().byId("idstartDate") !== "Error" && sap.ui.getCore().byId("idendDate").getValueState() !== "Error") {
		var oNewAppointment = {
			start: oStartDate,
			end: oEndDate,
			title: sTitle,
			info: sInfoResponse
		};
		var oModel = that.getView().getModel();
		var sPath = "/people/" + sap.ui.getCore().byId("idselectPerson").getSelectedIndex() + "/appointments";
		var oPersonAppointments = oModel.getProperty(sPath);
	
		oPersonAppointments.push(oNewAppointment);
	
		oModel.setProperty(sPath, oPersonAppointments);
		//that.oNewAppointmentDialog.close();	
		that._CreateDialog.close();
	}
},			
			
/*************************************************Get Conference Data***************************************************/
			FunAppoinment:function(){
				debugger
				conferenceDataJModel = new JSONModel();
				this.getView().setModel(conferenceDataJModel);
				
				var sServiceUrl = "/sap/opu/odata/sap/ZBOOKING_MNGT_SRV/";
				var sPath = "GetBookDtlsDtSet(Lgort='JKHO',Date=datetime'2020-06-16T00:00:00')?$expand=DateToEmpNvg/EmpToDetailNvg";
				var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				var oData = {};
				oData.success = function(oData,oResponse){
					debugger
					
					conferenceDataJModel.setData(oData);
				//	statusJModel.setData(oData.DateToEmpNvg.results[0].EmpToDetailNvg.results[0].Edate);
				};
				oData.error = function(oError){
				
				};
				oDataModel.read(sPath, oData);	
			},			
/********************On Room Id Help**********************************************************/
			/*onRoomIdF4: function(){
		
				var sPath = "/sap/opu/odata/SAP/ZBOOKING_MNGT_SRV/F4RoomIdSet?$filter=Lgort eq 'JKHO'";
				 var jModel = new sap.ui.model.json.JSONModel();
				      jModel.loadData(sPath, null, false,"GET",false, false, null);
				  var _valueHelpRoomIDSelectDialog = new sap.m.SelectDialog({
							title : "Select Room",
							items : {
								path : "/d/results",
								template : new sap.m.StandardListItem({
									title : "{RoomId}",
									description: "{Name}",
									customData : [ new sap.ui.core.CustomData({
										key : "{Lgort}",
										value : "{RoomId}"
									})],
								}),
							},
					liveChange : function(oEvent) {
			
						 var sValue = oEvent.getParameter("value");
					     var oFilter = new sap.ui.model.Filter("Lgort",sap.ui.model.FilterOperator.Contains,sValue);
					     var oFilter1 = new sap.ui.model.Filter("RoomId",sap.ui.model.FilterOperator.Contains,sValue);
					     var oFilter2 = new sap.ui.model.Filter([oFilter, oFilter1],false)
							 oEvent.getSource().getBinding("items").filter([ oFilter2 ]);
					},
					
						confirm : [ this._handRoomIdClose, this ],
						cancel : [ this._handleRoomIdClose, this ]
					});
				  
				  _valueHelpRoomIDSelectDialog.setModel(jModel);
				  _valueHelpRoomIDSelectDialog.open();
				},
				_handRoomIdClose : function(oEvent) {
			
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						this.getView().byId("idRoomId").setValue(oSelectedItem.getTitle());
					}
			},*/
/*****************************Create Appointment***********************************/
			/*handleAppointmentCreate: function (oEvent) {
				var that = this;
				if(!that._CreateDialog){
					that._CreateDialog = sap.ui.xmlfragment("zcrbroomapply.view.Create", that);
					
				}
					that._CreateDialog.addStyleClass("sapUiContentPadding");
					that._CreateDialog.open();
			},

			onAppoinmentClose: function (oEvent){
				var that = this;
				that._CreateDialog.close();
			},*/
/***********************************On Save****************************************************/
			/*handleAppointmentSave: function (){
				debugger					
				var Data = {};
				
				var sServiceUrl = "/sap/opu/odata/sap/ZBOOKING_MNGT_SRV";
				var sPath = "/GetBookDetailSet";
				var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
				oCreateModel1.setHeaders({
				"Content-Type": "application/atom+xml"
				});
				var fncSuccess = function(oData, oResponse)
				{
				if(oData.EError=="true"){
				sap.m.MessageBox.show(oData.EMessage, {
				title: "Error",
				icon:sap.m.MessageBox.Icon.ERROR,
				onClose:function(){
				}
				});
				}else{
				sap.m.MessageBox.show("Appoinment created successfully.", {
				title: "Success",
				icon:sap.m.MessageBox.Icon.SUCCESS,
				onClose:function(){
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
				target: { semanticObject : "#"}
				});
				}
				});
				}
				}
				var fncError = function(oError) {
				var parser = new DOMParser();
				sap.m.MessageBox.show(parser, {
				title: "Error",
				icon:sap.m.MessageBox.Icon.ERROR,
				});
				}
				//Create Method for final Save
				oCreateModel1.create(sPath, Data, {
				success: fncSuccess,
				error: fncError
				});
				
				},*/
//***********************************************************************************************************************				
		});

	});


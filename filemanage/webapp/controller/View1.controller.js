sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/UploadCollectionParameter" ,
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"com/cpwdfilemanage/util/Formatter",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/m/Link",
	"sap/m/MessageView",
	"sap/m/Button",
	"sap/ui/core/IconPool",
	"sap/m/Popover",
	"sap/m/Bar",
	"sap/m/Text"
], function(Controller,UploadCollectionParameter,MessageBox,MessageToast,Formatter,MessagePopover,MessageItem,Link,MessageView,Button,
			IconPool,Popover,Bar,Text) {
	"use strict";
	var that, userId, oMessagePopover, DmsDocNo, InitiatedUSer, Fileno, ForwardRec,ApprovedFlag,ForwardFlag, RejectedFlag,
		ReferFlag, NewComments,WiIdReady,SelectedIndx,ActionText,InitUser;
	return Controller.extend("com.cpwdfilemanage.controller.View1", {
		onInit : function() {
			//For file Attachments
			that = this;
			this.clearVariables();
			
			var attachmentJModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(attachmentJModel,"attachmentJModel");
			attachmentJModel.setData([]);
			
			var oUploadFilejModel = new sap.ui.model.json.JSONModel({
				items : []
			});
			this.getView().setModel(oUploadFilejModel,"oUploadFilejModel");
			
			userId = sap.ushell.Container.getService("UserInfo").getId();
			this.funGetStatus();
			this.funApprovalDetails();
			
		},
//*****************************************************************************************************************************************
	clearVariables:function(){
		userId = "";
		DmsDocNo = "";
		InitiatedUSer = "";
		Fileno = "";
		ForwardRec = "";
		ForwardRec = "";
		ApprovedFlag = "";
		ForwardFlag = "";
		RejectedFlag = "";
		ReferFlag = "";
		NewComments = "";
		WiIdReady = "";
		SelectedIndx = "";
		ActionText = "";
		InitUser = "";
	},
	
	
//******************************************************************************************************************************************
	//Space and special characters are not allowed
/*	validateSpace:function(oEvent){
		var text     = oEvent.getSource().getValue();
		var code = text.charCodeAt(text.length-1);
		
		 if (!(code > 47 && code < 58) && // numeric (0-9)
			 !(code > 64 && code < 91) && // upper alpha (A-Z)
			 !(code > 96 && code < 123)) { // lower alpha (a-z)
			text = text.substring( 0 , text.length - 1 );
			oEvent.getSource().setValue(text); 
	  }

	},*/
//******************************************************************************************************************************************
		
		onF4Receipent:function(){
		var localServiceModel = this.getView().getModel("ODataModel");
		var sPath = localServiceModel.sServiceUrl +"/ET_USER_MasterSet?$filter=UserD eq '*'";
		var localJSONModel = this.getView().getModel("LocalDataModel");
		localJSONModel.loadData(sPath, null, false, "GET", false, false, null);
		
		var _valueHelpDistrictDialog = new sap.m.SelectDialog({

			title: "Receipent",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{UserD}",
					description: "{Name}",
					customData: [new sap.ui.core.CustomData({
						key: "Key",
						value: "{UserD}"
					})]

				})
			}, 
			liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("UserD", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter2 = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter3 = new sap.ui.model.Filter([oFilter, oFilter2],false);
				oEvent.getSource().getBinding("items").filter([oFilter3]);
			},
			confirm: [this._handleDistrictClose, this],
			cancel: [this._handleDistrictClose, this]
		});
		_valueHelpDistrictDialog.setModel(localJSONModel);
		_valueHelpDistrictDialog.open();
	},

	_handleDistrictClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if(oSelectedItem){
			this.obj = oSelectedItem.getBindingContext().getObject();
			if(this.obj.UserD === userId){
            	sap.m.MessageBox.alert(
					"Initiator and Receipent can't be the same", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Warning!",
					 onClose:function(){
					     that.getView().byId("receipent").setValue();
					   }
					 }
				);
			 
            } else {
            	this.getView().byId("receipent").setValue(oSelectedItem.getTitle() + " ( " + this.obj.Name + " ) ");
            }
			
		}
		
		},
		
	//**********************************************************************************************************************************************************
	onFileAttachUpload: function(oEvent){
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
	    	var that=this;
	    	$.ajax({url: "/sap/opu/odata/sap/ZODATA_FILE_SUBMIT_SRV",	type: "GET",	async: false,	
	    		beforeSend: function(xhr) { 
	    			xhr.setRequestHeader("X-CSRF-Token", "Fetch");	
	    		},
	    		complete: function(xhr) {	
	    			that.token = xhr.getResponseHeader("X-CSRF-Token");	
	    		}
	    	});
	    },
	    
	    onFileBeforeUploadStarts : function(oEvent) {
		    var oVal = oEvent.getParameter("value");	    
		    var fileName = oEvent.getParameter("fileName"); //with extension
		    var extension = fileName.split(".")[1];
		    	/*if(extension !=="pdf"){
		    		sap.m.MessageBox.show("Only PDF File Allowed", {
			              title: "Warning!",
			              icon:sap.m.MessageBox.Icon.WARNING,
			          });
			          return false;
		    	}*/
		    var file = fileName.substring(0, fileName.length-4); //remove extension
		    var oSlug = file;
		        
		    // Header Slug
		    var oCustomerHeaderSlug = new UploadCollectionParameter({
			name : "SLUG",
			value : oSlug
		    });
		    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		
		onFileUploadComplete : function(oEvent) {
		
			var that = this;
		    var oUploadCollection = oEvent.getSource();
		    var oResData = oEvent.getParameter("files")[0];
		    if (oResData.status == "201") {
				var oData = oUploadCollection.getModel("oUploadFilejModel").getData();
				
			 	//var docId = oResData.headers["doc_no"];
			 	//var docId = oResData.headers["location"].substring(97,121); //Get temporary File no
			 	var Ind = oResData.headers["location"].indexOf("ET_SubmitSet(");
			 		Ind = Ind + 14;
			 	var	docId = oResData.headers["location"].slice(Ind, (oResData.headers["location"].length-2));
				
				var host = window.location.host;
				var protocol = window.location.protocol;
				var urlprefix = protocol + "//" + host;		
			
				var sURL = urlprefix + "/sap/opu/odata/sap/ZODATA_FILE_SUBMIT_SRV/ET_SubmitSet(FileNo='"+docId+"')/$value";
	
				oData.items.unshift({
				    "FileNo" : docId, // document number,
				    "FileName" : oResData.fileName,
				   // "MimeType" : oResData.headers["content-mimetype"],
				    "Url" : sURL,
				});	
				
				var uploadDetails= {};
				uploadDetails.FileName = oResData.fileName;
				uploadDetails.FileNo= docId;
				//uploadDetails.ImageType= "01";
				//uploadDetails.UpdateFlag= "";
				//uploadDetails.MIMETYPE = oResData.headers["content-mimetype"];
				uploadDetails.MIMETYPE = oResData.headers["content-type"];
				var model = that.getView().getModel("attachmentJModel");
				//var model = that._TyrePhotosDialog.getModel("attachmentJModel")
				var data = model.getData();
				data.push(uploadDetails);
				
				//for disable upload button.
				if(data.length > 0){
					this.getView().byId("idUploadCollection").setUploadEnabled(false);
				} else {
					this.getView().byId("idUploadCollection").setUploadEnabled(true);
				}
				
				oUploadCollection.getModel("oUploadFilejModel").refresh();
	
				// delay the success message for to notice onChange message
				setTimeout(function() {
					sap.m.MessageToast.show("Uploaded successfully");
				}, 4000);
		    } else if (oEvent.getParameter("files")[0].status == "0") 
		    {
				oUploadCollection.fireUploadTerminated();
		    } else {
				var errmessage = "File Upload failed : " + oEvent.getParameter("files")[0].responseRaw;
					sap.m.MessageBox.show(errmessage, sap.m.MessageBox.Icon.ERROR, "Error");
					oUploadCollection.fireUploadTerminated();
		    }
		},
//*******************************************************************************************************************
	onFileUploadPress: function(oEvt){
		
		var spath = oEvt.getSource().getBindingContext("oUploadFilejModel").sPath.split("/items/")[1];
		var model = this.getView().byId("idUploadCollection").getModel("oUploadFilejModel");
		var FileNo = model.oData.items[spath].FileNo;
		
		 var host = window.location.host;
		var protocol = window.location.protocol;
	    var urlprefix = protocol + "//" + host;		
		
		var fileDisplayOdataModel = this.getView().getModel("ODataFileSubmitModel");
	    var finalUrl = fileDisplayOdataModel.sServiceUrl;	
		var sURL = urlprefix + finalUrl + "/ET_SubmitSet(FileNo='"+FileNo+"')/$value";
		//sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZODATA_FILE_SUBMIT_SRV/ET_SubmitSet(FileNo='"+FileNo+"')/$value", true);
		
		window.open(sURL,'_blank');
	},
//*******************************************************************************************************************		
	onFileDeleted:function(oEvent){
		var oSrc = oEvent.getSource();
	        var uploadModel = oSrc.getModel("oUploadFilejModel");
	        var uItems = uploadModel.getProperty("/items");
	        var oItem = oEvent.getParameter("item");
	        var oContext = oItem.getBindingContext("oUploadFilejModel");
	        if (!oContext) {
	          uploadModel.setProperty("/items", uItems);
	          return;
	        }
	        var sPath = oContext.getPath();
	        var sIndex = sPath.split("/").pop();
	        var docId = oEvent.getParameter("documentId");
	        
	        uItems.splice(sIndex,1);
	        uploadModel.refresh();
	            
	        
	},
//*****************************************************************************************************************
	handleIconTabBarSelect:function(oEvent){
		var Tabkey = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
		 if(Tabkey ==="C"){
		 		this.getView().byId("idSend").setVisible(false);
		    	this.getView().byId("idApprove").setVisible(true);
		    	this.getView().byId("idforward").setVisible(true);
		    	//this.getView().byId("idreferback").setVisible(false);
		    	//this.getView().byId("idreject").setVisible(true);
		    	
		    	//Set Validate fields color None
		    	this.getView().byId("idfileno").setValueState("None");
				this.getView().byId("idsubject").setValueState("None");
				this.getView().byId("receipent").setValueState("None");
				this.getView().byId("idComments").setValueState("None");
				this.getView().byId("idNewCmnts").setValueState("None");
				//this.funApprovalDetails();
		 }else if(Tabkey ==="B"){
		 		this.getView().byId("idSend").setVisible(false);
		 		this.getView().byId("idApprove").setVisible(false);
		    	this.getView().byId("idforward").setVisible(false);
		    	//this.getView().byId("idreferback").setVisible(false);
		    	//this.getView().byId("idreject").setVisible(false);
		    	
		    	//Set Validate fields color None
		    	this.getView().byId("idfileno").setValueState("None");
				this.getView().byId("idsubject").setValueState("None");
				this.getView().byId("receipent").setValueState("None");
				this.getView().byId("idComments").setValueState("None");
				this.getView().byId("idNewCmnts").setValueState("None");
		    	//this.funGetStatus();
		 } else {
		 		this.getView().byId("idSend").setVisible(true);
		 		this.getView().byId("idApprove").setVisible(false);
		    	this.getView().byId("idforward").setVisible(false);
		    	//this.getView().byId("idreferback").setVisible(false);
		    	//this.getView().byId("idreject").setVisible(false);
		    	
		    	//Set Validate fields color None
		    	this.getView().byId("idfileno").setValueState("None");
				this.getView().byId("idsubject").setValueState("None");
				this.getView().byId("receipent").setValueState("None");
				this.getView().byId("idComments").setValueState("None");
				this.getView().byId("idNewCmnts").setValueState("None");
				//this.funGetStatus();
				//this.funApprovalDetails();
		 }
	},
		
//******************************************************************************************************************
funGetStatus:function(){
	var StatusJModel = new sap.ui.model.json.JSONModel();
	    this.getView().setModel(StatusJModel,"StatusJModel");
	var sServiceUrlsetPath = "/sap/opu/odata/sap/ZHR_ODATA_FILE_MANAGE_SRV"; 
	var sPathCartListSet = "/ET_Status_TabSet?$filter=InitUser eq '"+userId+"'";
	var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);	
		//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) {	// success handler
				StatusJModel.setData(oData.results);
				
					if(StatusJModel.oData.length === "0" || StatusJModel.oData[0].Recepient === ""){
						that.getView().byId("idtabfilterB").setVisible(false);
					} else {
						that.getView().byId("idtabfilterB").setVisible(true);
					}
					
					var tblid = that.getView().byId("idtblStatus");
					for(var i=0; i<tblid.getItems().length; i++){
                     	 if(StatusJModel.oData[i].PendingUser === ""){
                     	 	tblid.getItems()[i].getCells()[3].setText();
                     	 }else if(StatusJModel.oData[i].AppByUser ===""){
                     	 	tblid.getItems()[i].getCells()[5].setText();
                     	 }
                     }
				
		};
		
		oParamsCartListSet.error = function(oError) {	// error handler
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oDataModel.read(sPathCartListSet, oParamsCartListSet);
},

//*******************************************************************************************************************
	funApprovalDetails:function(){
		var ApproverJModel = new sap.ui.model.json.JSONModel();
	    	this.getView().setModel(ApproverJModel,"ApproverJModel");
		var sServiceUrlsetPath = "/sap/opu/odata/sap/ZHR_ODATA_FILE_MANAGE_SRV"; 
		var sPathCartListSet = "/ET_Approver_TabSet?$filter=Recepient eq '"+userId+"'";
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);	
		//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) {	// success handler
				ApproverJModel.setData(oData.results);
				if(ApproverJModel.oData.length === "0" || ApproverJModel.oData[0].InitUser ===""){
						that.getView().byId("idtabfilterC").setVisible(false);
				} else {
						that.getView().byId("idtabfilterC").setVisible(true);
				}
			
		};
		
		oParamsCartListSet.error = function(oError) {	// error handler
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oDataModel.read(sPathCartListSet, oParamsCartListSet);
	},
	
//*******************************************************************************************************************

	onSelectRadio:function(oEvt){
		
		var tblid = this.getView().byId("idtblApprover");
        var lngth = tblid.getItems().length;

        for(var i=0; i<lngth; i++){
        	if(tblid.getItems()[i].getCells()[0].getSelected() ===true){
        		tblid.getItems()[i].getCells()[5].setEnabled(true);
        	}else
        	if(tblid.getItems()[i].getCells()[0].getSelected() ===false){
        		tblid.getItems()[i].getCells()[5].setEnabled(false);
        	}
        }

		
		var spath = oEvt.getSource().getBindingContext("ApproverJModel").sPath.split("/")[1];
		var mDdata = oEvt.getSource().getBindingContext("ApproverJModel").getModel().oData;
		var Comments = mDdata[spath].CommentInit;
		    DmsDocNo = mDdata[spath].DmsDocNo;
		    Fileno = mDdata[spath].FileNo;
		    InitiatedUSer = mDdata[spath].InitUser;
		    WiIdReady = mDdata[spath].WiIdReady;
		    InitUser = mDdata[spath].InitUser;
			SelectedIndx = oEvt.getSource().getSelected();
		if(SelectedIndx === true){
			if(mDdata[spath].Status ==="X"){
				this.getView().byId("idVcommentsBox").setVisible(true);
				this.getView().byId("idbuttonForComents").setVisible(true);
				this.getView().byId("idNewCmnts").setVisible(false);
				this.getView().byId("idApprove").setEnabled(false);
				this.getView().byId("idforward").setEnabled(false);
				//this.getView().byId("idreferback").setEnabled(false);
				oEvt.getSource().getParent().getCells()[5].setEnabled(true);
			}else{
				this.getView().byId("idVcommentsBox").setVisible(true);
				this.getView().byId("idbuttonForComents").setVisible(true);
				this.getView().byId("idNewCmnts").setVisible(true);
				this.getView().byId("idApprove").setEnabled(true);
				this.getView().byId("idforward").setEnabled(true);
				//this.getView().byId("idreferback").setEnabled(true);
				oEvt.getSource().getParent().getCells()[5].setEnabled(true);
				
			}
			
		} else {
			this.getView().byId("idVcommentsBox").setVisible(false);
			//this.getView().byId("idbuttonForComents").setVisible(false);
			this.getView().byId("idApprove").setEnabled(false);
			this.getView().byId("idforward").setEnabled(false);
			//this.getView().byId("idreferback").setEnabled(false);
			oEvt.getSource().getParent().getCells()[5].setEnabled(false);
		}
		this.funGetComments(); //Get Comments
		//this.handelMessagePopover();
	},
	
//*******************************************************************************************************************
	onShowFileBtn: function(oEvt){
		var fileDisplayOdataModel = this.getView().getModel("ODataFileSubmitModel");
	    var finalUrl = fileDisplayOdataModel.sServiceUrl;
	    //var abc = pdfjsLib.getDocument({url:urll});
	   
		if(SelectedIndx === true){
			var sURL = 	sap.m.URLHelper.redirect(finalUrl + "/ET_SubmitSet(FileNo='"+DmsDocNo+"')/$value", true);	
		} else {
			sap.m.MessageBox.alert(
					"Please Select Row.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Warning!"
					 }
			 );
		}
		
	},
	
//*******************************************************************************************************************

	
//*******************************************************************************************************************
	funGetComments:function(){
		var CommentsjModel = this.getView().getModel("LocalDataModel");
	    	this.getView().setModel(CommentsjModel,"CommentsjModel");
	    var fileManageoDataModel = this.getView().getModel("ODataFileManageModel");
		var sServiceUrlsetPath = fileManageoDataModel.sServiceUrl; 
		var sPathCartListSet = "/ET_CommentSet?$filter=DmsDocNo eq '"+DmsDocNo+"'";
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);	
		//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) {	// success handler
				CommentsjModel.setData(oData.results);
				that.handelMessagePopover();
		};
		
		oParamsCartListSet.error = function(oError) {	// error handler
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oDataModel.read(sPathCartListSet, oParamsCartListSet);
	},	

//*******************************************************************************************************************
	handelMessagePopover:function(){
		/*var oLink = new Link({
				text: "Show more information",
				target: "_blank"
			});*/
			
			var oMessageTemplate = new MessageItem({
				type:'Information',
				title:'{IntiatedUser} - {DateCmnt}',
				description: '{AllComment}',
			});
			
	
			var aMockMessages = this.getView().getModel("CommentsjModel").oData;
			
				this.oMessageView = new MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				});
				
				var oBackButton = new Button({
					icon: IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						that._oPopover.focus();
						this.setVisible(false);
					}
				});
				
				var oCloseButton =  new Button({
					text: "Close",
					press: function () {
						that._oPopover.close();
					}
				}),
				
				oPopoverFooter = new Bar({
					contentRight: oCloseButton
				}),
				
				oPopoverBar = new Bar({
					contentLeft: [oBackButton],
					contentRight: oCloseButton,
					contentMiddle: [
						new Text({
							text: "Comments Log"
						})
					]
				});

			this._oPopover = new Popover({
				customHeader: oPopoverBar,
				contentWidth: "550px",
				contentHeight: "440px",
				verticalScrolling: false,
				modal: true,
				content: [this.oMessageView],
				footer: oPopoverFooter
			});

			var oModel = this.getView().getModel("LocalDataModel");
				oModel.setData(aMockMessages);
				//this.getView().setModel(oModel);
				this.oMessageView.setModel(oModel);
				//this.byId("idbuttonForComents").addDependent(oMessagePopover);
	},
//*******************************************************************************************************************
	onPressShowComments: function(oEvent) {
		//oMessagePopover.toggle(oEvent.getSource());
			this.oMessageView.navigateBack();
			this._oPopover.openBy(oEvent.getSource());
	},
//*******************************************************************************************************************
	ValidateFields:function(){
		var check = true;
		
		var fileNo = this.getView().byId("idfileno");
		var Subject = this.getView().byId("idsubject");
		var Receipent = this.getView().byId("receipent");
		var Comment = this.getView().byId("idComments");
		
			fileNo.setValueState("None");
			if(fileNo.getValue() === ""){
		    	fileNo.setValueState("Error");
				check = false;
		    } else {
				fileNo.setValueState("None");
		    }
	    
		    Subject.setValueState("None");
		    if(Subject.getValue() === ""){
		    	Subject.setValueState("Error");
				check = false;
		    } else {
				Subject.setValueState("None");
		    }
	    
	    
	    Receipent.setValueState("None");
	    if(Receipent.getValue() === ""){
	    	Receipent.setValueState("Error");
			check = false;
	    } else {
			Receipent.setValueState("None");
	    }
	    
	    if(this.getView().getModel("oUploadFilejModel").oData.items.length === 0){
        	check = false;
        }
	    
	    Comment.setValueState("None");
	     if(Comment.getValue() === ""){
	    Comment.setValueState("Error");
			check = false;
	    } else {
				Comment.setValueState("None");
	    }
	    return check;
	},
	
//*****************************************************************************************************************
	onSend:function(){
		
		if(this.ValidateFields()=== false){
			sap.m.MessageBox.alert(
					"Please fill all required fields.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Warning!"
					 }
			 );
			return false;
		}
		
		this.openDialog("initiatorSend");
	},
//*****************************************************************************************************************
	onInitiatorSend: function(){
		
		var FileNo = this.getView().byId("idfileno").getValue();
		var subject = this.getView().byId("idsubject").getValue();
		var Comments = this.getView().byId("idComments").getValue();
		var DmsCocNo = this.getView().getModel("oUploadFilejModel").oData.items[0].FileNo;
		
		var oDataFileManage =  this.getView().getModel("ODataFileManageModel");
		var sServiceUrlsetPath = oDataFileManage.sServiceUrl; 
		var sPathCartListSet = "/ET_SubmitSet(InitUser='"+userId+"',CommentInit='"+Comments+"',DmsDocNo='"+DmsCocNo+"',FileNo='"+FileNo+"',Subject='"+subject+"',Recepient='"+this.obj.UserD+"')";
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);	
		//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) {	// success handler
				sap.m.MessageBox.alert("Submitted Successfully.", {
					 icon: sap.m.MessageBox.Icon.SUCCESS,
					 title: "Success",
					 onClose:function(){
					     that.quitApp();
					   }
					 }
			 );
		
		};
		
		oParamsCartListSet.error = function(oError) {	// error handler
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oDataModel.read(sPathCartListSet, oParamsCartListSet);
			
			/*Data.InitUser		= userId;
			Data.CommentInit	= Comments;
			Data.DmsDocNo		= "";
			Data.FileNo 		= FileNo;
			Data.Subject		= subject;
			Data.Recepient		= this.obj.UserD;
			
			
		
			var sServiceUrl = "/sap/opu/odata/sap/ZHR_ODATA_FILE_MANAGE_SRV";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel1.setHeaders({
				"Content-Type": "application/atom+xml"
				});
			var fncSuccess = function(oData, oResponse) //success function 
				{
				
					if(oData.EError=="true"){
						sap.m.MessageBox.show(oData.EMessage, {
					        title: "Error",
					        icon:sap.m.MessageBox.Icon.ERROR,
					        onClose:function(){
					        	window.history.back();
					        }
					    });	
					    
					}else{
			
						sap.m.MessageBox.show(oData.EMessage, {
					        title: "Success",
					        icon:sap.m.MessageBox.Icon.SUCCESS,
					        onClose:function(){
					        	window.history.go(-1);
					        
					        }
						});
					
					}
				
				};
				
			var fncError = function(oError) { //error callback function
				//var parser = new DOMParser();
					sap.m.MessageBox.show(oError.message, {
				        title: "Error",
				        icon:sap.m.MessageBox.Icon.ERROR,
				    });
			};
			//Create Method for final Save
			oCreateModel1.create("/ET_Status_TabSet", Data, {
				success: fncSuccess,
				error: fncError
			});*/
	},
//********************************************************************************************************************
	onStatusShowFile:function(oEvt){
		var StatusData = oEvt.getSource().getBindingContext("StatusJModel").getProperty();
		var DocNo = StatusData.DmsDocNo;
		var fileDisplayOdataModel = this.getView().getModel("ODataFileSubmitModel");
	    var finalUrl = fileDisplayOdataModel.sServiceUrl;
		
		var sURL = 	sap.m.URLHelper.redirect(finalUrl + "/ET_SubmitSet(FileNo='"+DocNo+"')/$value", true);	
	},
//********************************************************************************************************************
	funGetRecepent:function(){
		var localServiceModel = this.getView().getModel("ODataModel");
		var sPath = localServiceModel.sServiceUrl +"/ET_USER_MasterSet?$filter=UserD eq '*'";
		var localJSONModel = this.getView().getModel("LocalDataModel");
		localJSONModel.loadData(sPath, null, false, "GET", false, false, null);
		
		var _valueHelpForwardDialog = new sap.m.SelectDialog({

			title: "Forward To Receipent",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{UserD}",
					description: "{Name}",
					customData: [new sap.ui.core.CustomData({
						key: "Key",
						value: "{UserD}"
					})]

				})
			}, 
			liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("UserD", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter2 = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter3 = new sap.ui.model.Filter([oFilter, oFilter2],false);
				oEvent.getSource().getBinding("items").filter([oFilter3]);
			},
			confirm: [this._handleForwardClose, this],
			cancel: [this._handleForwardClose, this]
		});
		_valueHelpForwardDialog.setModel(localJSONModel);
		_valueHelpForwardDialog.open();
	},
	
	_handleForwardClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if(oSelectedItem){
			this.obj = oSelectedItem.getBindingContext().getObject();
			if(this.obj.UserD === userId){
            	sap.m.MessageBox.alert(
					"Approver can't forwared to himself.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Warning!"
					 }
				);
			 
            }else if(InitUser === this.obj.UserD){
            	sap.m.MessageBox.alert(
					"Approver can't forwared to initiated person.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Warning!"
					 }
				);
            }else{
	            ForwardRec = this.obj.UserD;
				this.FinalSubmit();	
            }
			
		
			
		}
		
		},
		
//*****************************************************************************************************************************
	Validate:function(){
		var check = true;
		var comment = this.getView().byId("idNewCmnts");
			comment.setValueState("None");
			if(comment.getVisible() === true){
				if(comment.getValue() === ""){
				    comment.setValueState("Error");
						check = false;
				} else {
					comment.setValueState("None");
		    	}	
			}
	    
	    return check;
	},
//*****************************************************************************************************************************
	OnGoforAction:function(oEvt){
		if(this.Validate()=== false){
			sap.m.MessageBox.alert(
					"Please fill required fields.", {
					 icon: sap.m.MessageBox.Icon.WARNING,
					 title: "Warning!"
					 }
			 );
			return false;
		}
		
			NewComments = this.getView().byId("idNewCmnts").getValue();
		    ActionText = oEvt.getSource().getText();
			if(ActionText === "Approve"){
				ApprovedFlag = "X";
				ForwardFlag = "";
				RejectedFlag = "";
				ReferFlag = "";
				ForwardRec = "";
				this.openDialog("Approve");
				//this.FinalSubmit();
			} else if(ActionText === "Forward"){
				ApprovedFlag = "";
				ForwardFlag = "X";
				RejectedFlag = "";
				ReferFlag = "";
				//WiIdReady = "";
				this.openDialog("forward");
				//this.funGetRecepent();
			} else if(ActionText === "Refer back "){
				ApprovedFlag = "";
				ForwardFlag = "";
				RejectedFlag = "";
				ReferFlag = "X";
				ForwardRec = "";
				//WiIdReady = "";
				this.FinalSubmit();
			} 
			
			
		
	},
//****************************************************************************************************************************
	FinalSubmit:function(){
		var LocalMessage = "";
		if(ActionText ==="Approve"){
			LocalMessage = "Approved Successfully.";
		}else if(ActionText ==="Forward"){
			LocalMessage = "Forwarded Successfully.";
		}
		var FinalSubmitoDataModel = this.getView().getModel("ODataFileManageModel");
		var sServiceUrlsetPath = FinalSubmitoDataModel.sServiceUrl; 
		var sPathCartListSet = "/ET_Approver_SubmitSet(InitUser='"+userId+"',WiIdReady='"+WiIdReady+"',DmsDocNo='"+DmsDocNo+"',FileNo='"+Fileno+"',ApprovedFlag='"+ApprovedFlag+"',ForwardFlag='"+ForwardFlag+"',ForwardRec='"+ForwardRec+"',RejectedFlag='"+RejectedFlag+"',ReferFlag='"+ReferFlag+"',ManagerCom='"+NewComments+"')";
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);	
		//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) {	// success handler
				sap.m.MessageBox.alert(LocalMessage, {
					 icon: sap.m.MessageBox.Icon.SUCCESS,
					 title: "Success",
					 onClose:function(){
					     that.quitApp();
					   }
					 }
			 );
		
		};
		
		oParamsCartListSet.error = function(oError) {	// error handler
			jQuery.sap.log.error("read publishing group data failed");
			sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
		};
		oDataModel.read(sPathCartListSet, oParamsCartListSet);
	},

//****************************************************************************************************************************
	openDialog : function(status) {
		
		var labelMessage;
			if (status === "forward") {
				labelMessage = "Are you sure want to Forward ?";
			}else if(status ==="Approve"){
				labelMessage = "Are you sure want to Approve ?";
			}else if(status ==="initiatorSend"){
				labelMessage = "Are you sure want to Submit ?";	
			}
		
	//	var _that = this;
		var dialog = new sap.m.Dialog({
				title : "Confirmation Dialog",
				type : 'Message',
				content : [ new sap.m.Label({
					text : labelMessage,
					labelFor : "submitDialogTextarea"
				})],
				
			beginButton : new sap.m.Button({
				text : "Yes",
				press : function() {
					if (status === "forward") {
						that.funGetRecepent();	
					}else if(status ==="Approve"){
						that.FinalSubmit();
					}else if(status ==="initiatorSend"){
						that.onInitiatorSend();
					}
					dialog.close();
				}
			}),
			
			endButton : new sap.m.Button({
			    text : "No",
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
//*****************************************************************************************************************************
quitApp: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		}
//*****************************************************************************************************************************
	});
});
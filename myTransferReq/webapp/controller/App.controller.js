sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessagePopover",
	"com/cpwdmyTransferReq/util/Utility",
	"com/cpwdmyTransferReq/util/Formatter",
	"sap/m/MessageBox",
	"com/cpwdmyTransferReq/model/ModelHandler",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/UploadCollectionParameter",
	"com/cpwdmyTransferReq/util/deepExtend"
], function(Controller, UIComponent, MessagePopover, Utility, Formatter, MessageBox, ModelHandler, Fragment, MessageToast,
	Filter, FilterOperator, UploadCollectionParameter, deepExtend) {
	"use strict";
	var oMessagePopover;
	var objSelectedItem;
	var acceptRejectButtonId;
	var flag;
	var currentTransfStatus;
	var statusofDirectMgr;
	var comment;
	var mgrCommentsArr;
	var TypeOfTKey;
	var SubtypeKey;
	var Comment;
	var location;
	return Controller.extend("com.cpwdmyTransferReq.controller.App", {
		onInit: function() {
			//this.empID = sap.ushell.Container.getService("UserInfo").getId();
			this.empID = "USER2";
			this.getView().byId("headerToolbarID").setText(this.getTextFromBundle("empID") + " - " + this.empID);

			this.readEmployeeTransferDetails();
			this.setLocationListInDropdowns();
			this.populateLocalJSON();
		},

		populateLocalJSON: function() {
			var transType = {
				"TransferType": [{
					key: "P2",
					text: "Inter-Regional Transfer"
				}, {
					key: "P1",
					text: "Emergency Transfer"
				}]
			};
			var subTransType = {
				"SubTransType": [{
						key: "E1",
						text: "Spouse Location"
					}, {
						key: "E2",
						text: "Health of Family Member"
					}, {
						key: "E3",
						text: "Health"
					},
					{
						key: "E4",
						text: "Children Education"
					}
				]
			};
			this.getView().getModel("LocalDataModel").setProperty("/transferType", transType.TransferType);
			this.getView().getModel("LocalDataModel").setProperty("/subTransferType", subTransType.SubTransType);
		},

		getModel: function(sName) {
			return this.getOwnerComponent().getModel(sName); // Getting model details from the Owner Component
		},

		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		/**
		 * Method to get the i18n text by passing text key from the resource bundle.
		 * @param {String} i18n key
		 * @returns {String} resource bundle text
		 */
		getTextFromBundle: function(key) {

			return this.getResourceBundle().getText(key);
		},

		getResourceBundle: function() {
			if ($.isEmptyObject(this._oResourceBundle)) {
				this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}
			return this._oResourceBundle;
		},
		readEmployeeTransferDetails: function() {

			//this.empID = sap.ushell.Container.getService("UserInfo").getId() ;
			//this.empID = "USER1";
			//this.tempLocListArr=[];
			var dataServiceModel = this.getModel("ODataModel");
			var localJSONModel = this.getModel("LocalDataModel");
			this.setModel(localJSONModel, "LocalDataModel");
			Utility.showBusyDialog();
			var empDetailsCallSuccess = $.proxy(function(oResponse) {
				var empDetails = [oResponse];
				Utility.hideBusyDialog();
				if (oResponse.Initiated == "X") { // If there is tranfer initiated for this employee
					//	var noTransferInit = this.getTextFromBundle("noTransferInit") + " " + this.empID;
					//Utility.showMessage(noTransferInit,"error");
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(this.getTextFromBundle("transferInit") + this.empID, {
						title: this.getTextFromBundle("ERROR"),
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: $.proxy(function(oAction) {

							this.quitApp(); // calling the Quit App function

						}, this)
					});
					this.getView().byId("transferType").setSelectedKey();
					//this.quitApp(); 

				} else { // IF Status of trasnfer is in Transfer Process or "A" the nshow below message
					this.getView().getModel("LocalDataModel").setProperty("/empDetails", empDetails);
					this.getView().byId("btnReset").setEnabled(true);
					this.getView().byId("btnSubmit").setEnabled(true);
					this.getView().byId("requestorCmnt").setEnabled(true);
					this.getView().byId("uploadReasonCollection").setUploadButtonInvisible(false);
					this.getView().byId("uploadReasonCollection").setUploadEnabled(true);

					//this.fileUploadCollectionSettings();
					//this.checkSelectedLocations();
					/*					var transferinProcess = this.getTextFromBundle("transfrInProg") + this.empID + " in Process";
									    Utility.showMessage(transferinProcess,"warning");*/
					//this.enableFields();
					//	this.quitApp();
					/*					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
										  	MessageBox.confirm(this.getTextFromBundle("transfrInProg")+ this.empID + " in Process", {
													title: this.getTextFromBundle("INFO"),
													styleClass: bCompact ? "sapUiSizeCompact" : "",
													onClose: $.proxy(function (oAction) {
														if (oAction === sap.m.MessageBox.Action.OK) {
															this.quitApp();// calling the Quit App function
														}
													}, this)
												});	*/
				}

			}, this);
			var empDetailsCallFailure = $.proxy(function(oResponse) {
				var fullText = this.getTextFromBundle("EmpDetailsFetch") + this.empID + " Failed";
				Utility.showMessage(fullText, "error", oResponse.message + " " + oResponse.responseText + " " + oResponse.statusText);
			}, this);
			//	ModelHandler.handleRead(dataServiceModel, "/ET_FETCH_EMPSet(Pimsid='" +this.empID + "')", "", "", "", "", empDetailsCallSuccess, empDetailsCallFailure);
			ModelHandler.handleRead(dataServiceModel, "/ET_FETCH_EMPSet(Pimsid='" + this.empID + "')", "", "", "", "", empDetailsCallSuccess,
				empDetailsCallFailure);
		},
		
		fileUploadCollectionSettings:function(){
			var localFileModel = this.getModel("LocalFileUploadModel");
			this.getView().setModel("LocalFileUploadModel",localFileModel);
			var itemsToAttach =[{
				"SLUG":"",
				"MIMETYPE":""
			}];
			this.getView().byId("uploadReasonCollection").addEventDelegate({
				onBeforeRendering: function() {
					this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
				}.bind(this)
			});
			this.getView().getModel("LocalFileUploadModel").setProperty("/itemsToAttach",itemsToAttach);

		},
		
			onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			// Header Token
			var that = this;
			var csrf = this.getCSRFToken();
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: that.token
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},
		
		   getCSRFToken: function() {
		   	var that=this;
		   	$.ajax({url:"/sap/opu/odata/sap/ZHR_ODATA_FILE_TRANSFER_SRV",
		   		    type:"GET",
		   		    async: false,
		   		    beforeSend: function(xhr){
		   		    	xhr.setRequestHeader("X-CSRF-Token","Fetch");
		   		    },
		   		    complete: function(xhr){
		   		    	that.token = xhr.getResponseHeader("X-CSRF-Token");
		   		    }
		   	});
		   	
		   },
				onFileBeforeUploadStarts: function(oEvent) {
			
			var oVal = oEvent.getParameter("value");
			var fileName = oEvent.getParameter("fileName");
			var oSlug = fileName.substring(0,fileName.length-4);
			// Header Slug
			//var oSlug = oEvent.getParameter("fileName");
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		
				handleUploadComplete: function(oEvent) {
			var that = this;
			var oUploadCollection = oEvent.getSource();
			var oResData= oEvent.getParameter("files")[0];
			if(oResData.status == "201"){
				var oData = oUploadCollection.getModel("LocalFileUploadModel").getData();
				var docId = oResData.fileName.substring(0,oResData.fileName.length-4);
				var host = window.location.host;
				var protocol = window.location.protocol;
				var urlprefix = protocol + "//" + host;
				var sURL = urlprefix +"/sap/opu/odata/sap/ZHR_ODATA_MOVEMENT_INIT_SRV/ET_SubmitSet(FileNo='"+docId+"')/$value";
				oData.items.unshift({"docId":docId , // document Number
				                    "fileName":oResData.fileName,
									"MIMETYPE":oResData.headers["content-mimetype"],
									"Url":sURL
				});
				var uploadDetails = {};
				uploadDetails.fileName = oResData.fileName;
				uploadDetails.docId = docId;
				uploadDetails.MIMETYPE = oResData.headers["content-mimetype"];
				var model = this.getView().getModel("LocalFileUploadModel");
				var data = model.getData();
				data.push(uploadDetails);
				
			}

			this.getView().getModel("LocalFileUploadModel").refresh();

			// Sets the text to the label
			//this.byId("attachmentTitle").setText(this.getAttachmentTitleText());

			// delay the success message for to notice onChange message
			setTimeout(function() {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},

		onFileDeleted: function(oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},

		deleteItemById: function(sItemToDeleteId) {
			var oData = this.getView().byId("uploadReasonCollection").getModel("LocalFileUploadModel").getData();
			var aItems = deepExtend({}, oData).items;
			jQuery.each(aItems, function(index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},



		setVisibleSubTransfer: function(oEvent) {
			//	this.getView().byId("subTransferType").setVisible(true);
			var selectedTransKey = oEvent.getSource().getSelectedKey();
			if (selectedTransKey == "P1") {
				this.getView().byId("subTransferType").setVisible(true);
			} else {
				this.getView().byId("subTransferType").setVisible(false);
			}
		},
		setLocationListInDropdowns: function() {
			Utility.showBusyDialog();
			var locationServiceModel = this.getModel("ODataLocationModel"); //Setting the location details in a oDataModel
			// Setting the view with the location details Model
			var locDetailsCallSuccess = $.proxy(function(oResponse) { // On success of location fetch from Location Master set ET_Loc_MasterSet
				var locDetails = oResponse.results;
				this.getView().getModel("LocalDataModel").setProperty("/locationList", locDetails);
				//this.checkIsDirectManager();
				Utility.hideBusyDialog();
				//this.returnLocationList.resolve();

			}, this);
			var locDetailsCallFailure = $.proxy(function(oResponse) { // On failure of location fetch from Location Master set ET_Loc_MasterSet
				var fullText = this.getTextFromBundle("locationFetch") + this.empID + " Failed";
				Utility.hideBusyDialog();
				Utility.showMessage(fullText, "error", oResponse.message + " ");
			}, this);
			ModelHandler.handleRead(locationServiceModel, "/ET_Loc_MasterSet", "Werks eq 'ALL'", "", "", "", locDetailsCallSuccess,
				locDetailsCallFailure);
		},

		onSelectedTableItem: function(oEvent) { //When an Employee is selected
			var selectedItem = oEvent.getSource().getSelectedItem().getBindingContextPath();
			objSelectedItem = this.getView().getModel("LocalDataModel").getProperty(selectedItem);
			statusofDirectMgr = Formatter.checkIsDirectManager(objSelectedItem.DirectManager); // Sending this value to Formatter to get true or false.
			/*Footer buttons enabled once an item /reportee is chosen from the table */
			this.getView().byId("btnAccept").setEnabled(true);
			this.getView().byId("btnReject").setEnabled(true);
			this.getView().byId("btnForward").setEnabled(true);
			/*End of footer buttons enablement*/
			this.getView().byId("txtComment").setEnabled(true); // Setting the Approver Comment to enabled

			if (objSelectedItem.CStatus == "A") { // If status is Transfer and Manager is M1 for the reportee,i.e., a direct manager.
				this.getView().byId("locationFirst").setVisible(true);
				this.getView().byId("locationSecond").setVisible(true);
				this.getView().byId("locationThird").setVisible(true);
				this.getView().byId("locationFirst").setSelectedKey(objSelectedItem.Loc1);
				this.getView().byId("locationSecond").setSelectedKey(objSelectedItem.Loc2);
				this.getView().byId("locationThird").setSelectedKey(objSelectedItem.Loc3);
				this.getView().byId("requestorCmnt").setValue(objSelectedItem.TrnsComment);
				//Setting all locations 
				/*				if (statusofDirectMgr) { // IF Manager of the selected reportee is a direct reporting manager
									this.getView().byId("locationFirst").setEnabled(true);
									this.getView().byId("locationSecond").setEnabled(true);
									this.getView().byId("locationThird").setEnabled(true);
								} else { // If not direct manager
									this.getView().byId("locationFirst").setEnabled(false);
									this.getView().byId("locationSecond").setEnabled(false);
									this.getView().byId("locationThird").setEnabled(false);
								}*/
				/*End of inner if-else condition*/
			} else { // IF status of Transfer is "R" 
				this.getView().byId("requestorCmnt").setValue(objSelectedItem.RepComment);
				this.getView().byId("locationFirst").setSelectedKey(objSelectedItem.Loc1);
				this.getView().byId("locationSecond").setSelectedKey(objSelectedItem.Loc2);
				this.getView().byId("locationThird").setSelectedKey(objSelectedItem.Loc3);
				this.getView().byId("locationFirst").setEnabled(false);
				this.getView().byId("locationSecond").setEnabled(false);
				this.getView().byId("locationThird").setEnabled(false);
				this.getView().byId("locationFirst").setVisible(false);
				this.getView().byId("locationSecond").setVisible(false);
				this.getView().byId("locationThird").setVisible(false);
			} /*End of outer if-else condition*/

			var reporteeId = objSelectedItem.Pimsid;
			//this.retrieveManagersComments(reporteeId); // Retrieve all comments from all managers for the selected reportee
			//this.retrieveForwardingManagersList(reporteeId);
		},
	
	

		onPressShowMgrMsg: function(oEvent) {

			oMessagePopover.toggle(oEvent.getSource());
		},

		onSubmitForward: function(oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();
			if (!this._pDialog) {
				this._pDialog = sap.ui.xmlfragment(
					"com.cpwdtransferPostingManager.view.fragments.ForwardDialog", this);
				this.getView().addDependent(this._pDialog);
				//	this._pDialog.setModel(oView.getModel("LocalDataModel"));

				//	if (!this._pDialog) {

				/*				this._pDialog.load({
									id: oView.getId(),
									name: "sap.m.sample.SelectDialog.Dialog",
									controller: this
								}).then(function (oDialog){
									oDialog.setModel(oView.getModel("LocalDataModel"));
									return oDialog;
								});*/
				//	}
			}
			this._pDialog.open();
			/*			this._pDialog.then(function(oDialog){
							this._configDialog(oButton, oDialog);
							oDialog.open();
						}.bind(this));*/
		},

		onDialogClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var that = this;
			if (aContexts && aContexts.length) {
				/*				MessageToast.show("You have chosen " + aContexts.map(function (oContext) { 
									that.Ename = oContext.getObject().Ename; 
									that.Pernr = oContext.getObject().Pernr;
									that.EmpPimsid = oContext.getObject().EmpPimsid;
									return that.Ename ;
								}).join(", "),
								{
									duration: 8000
								}
								);*/
				aContexts.map(function(oContext) {
					that.Ename = oContext.getObject().Ename;
					that.Pernr = oContext.getObject().Pernr;
					that.EmpPimsid = oContext.getObject().EmpPimsid;
					return that.Ename;
				}).join(", ");

				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.confirm(this.getTextFromBundle("confirmSubmitMsg"), {
					title: this.getTextFromBundle("forwardTo") + that.Ename,
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: $.proxy(function(oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							this.callSubmitForwardRequest(that.Ename, this.EmpPimsid, that.Pernr); // Submit the forward request ,calling the method 	
						}
					}, this)
				});

			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/*Forward Dialog pop-up search*/
		onSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Ename", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},
		/* The following method submits the Forward Request on behalf of current manager who has opened the app */
		callSubmitForwardRequest: function(Ename, EmpPimsid, Pernr) {
			var dataServiceModel = this.getModel("ODataModel"); // Getting the ODataModel from manifest.json
			var oMessageTemplate;
			Utility.showBusyDialog();
			var mgrForwardCallSuccess = $.proxy(function(oResponse) { // On success of location fetch from Location Master set ET_Loc_MasterSet
				var mgrCommentsDetails = oResponse.results;
				var fullText = this.getTextFromBundle("mgrForward") + " " + Ename + " Was Successful";
				var empArray = this.getView().getModel("LocalDataModel").getProperty("/empDetails");
				for (var i in empArray) { // Removing the added item
					if (empArray[i].Pimsid == EmpPimsid) {
						empArray.splice(i, 1);
						break;
					}
				}
				this.getView().getModel("LocalDataModel").refresh(true);
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.success(fullText, {
					title: this.getTextFromBundle("SUCCESS"),
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: $.proxy(function(oAction) {
						//this.onReset();  // Reset all selections
						this.readReporteeDetails(); // Re-populate the list of reportees ready for transfer 
						this.getView().byId("locationFirst").setVisible(false);
						this.getView().byId("locationSecond").setVisible(false);
						this.getView().byId("locationThird").setVisible(false);
						// Setting the Accept and Reject buttons to disabled
						this.getView().byId("btnAccept").setEnabled(false);
						this.getView().byId("btnReject").setEnabled(false);
						this.getView().byId("btnForward").setEnabled(false);
					}, this)
				});
				Utility.hideBusyDialog();
				//this.returnLocationList.resolve();

			}, this);
			var mgrForwardCallFailure = $.proxy(function(oResponse) { // On failure of location fetch from Location Master set ET_Loc_MasterSet
				var fullText = this.getTextFromBundle("mgrForward") + " " + Ename + " Failed";
				Utility.hideBusyDialog();
				Utility.showMessage(fullText, "error", oResponse.message + " ");
			}, this);
			ModelHandler.handleRead(dataServiceModel, "/ET_Forward_SubmitSet(EmpPimsid='" + EmpPimsid + "',Pernr='" + Pernr + "')", "", "", "",
				"",
				mgrForwardCallSuccess,
				mgrForwardCallFailure);
		},
		quitApp: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		},
		onSubmitConfirm: function(oEvent) { // Confirmation message and subsequent Submit of data
			//var comment;
			acceptRejectButtonId = oEvent.getSource().getId();
			TypeOfTKey = this.getView().byId("transferType").getSelectedKey();
			SubtypeKey = this.getView().byId("subTransferType").getSelectedKey();
			location = this.getView().byId("location").getSelectedKey();
			Comment = this.getView().byId("requestorCmnt").getValue().trim();// The trimmed comment string without any leading spaces or following spaces
			if(TypeOfTKey=="" || SubtypeKey=="" || location=="" || Comment==""){
				Utility.showMessage(this.getTextFromBundle("mandatoryItem")); // Error message 	
			}else if(this.getView().byId("uploadReasonCollection").getItems().length == 0){
				Utility.showMessage(this.getTextFromBundle("attachmentMandate")); // Error message 	
			} else { // If above condition is not fulfilled go ahead with submission confirmation message
				if (acceptRejectButtonId.includes("Reset")) {
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.confirm(this.getTextFromBundle("confirmSubmitMsg"), {
							title: this.getTextFromBundle("CONFIRM"),
							styleClass: bCompact ? "sapUiSizeCompact" : "",
							onClose: $.proxy(function(oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									this.onResetNew(); // calling the Submit function 	
								}
							}, this)
						});
				} else if (acceptRejectButtonId.includes("btnSubmit")) {
					MessageBox.confirm(this.getTextFromBundle("confirmSubmitMsg"), {
						title: this.getTextFromBundle("CONFIRM"),
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: $.proxy(function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								this.onSubmitData(); // calling the Submit function 	
							}
						}, this)
					});
					//}					
				}

			}

		},

		onSubmitData: function() {
			var dataServiceModel = this.getModel("ODataModel");
			dataServiceModel.setUseBatch(false);

			var localJSONModel = this.getModel("LocalDataModel");
			//	if(this.getView().byId("RB1-1").getSelected()){
			//var representcCommentEnable = this.getView().byId("txtComment").getEnabled(); //Checking if the Repesent Comment is enabled

			//				if(comment!= undefined && comment.trim()!="") {
			var repDetailsCallSuccess = $.proxy(function(oResponse) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.success(oResponse.Message + "  For User" + " " + this.empID, {
					title: this.getTextFromBundle("SUCCESS"),
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: $.proxy(function(oAction) {
						//this.onReset();  // Reset all selections
						this.readEmployeeTransferDetails(); // Re-populate the list of reportees ready for transfer 
						//var fullText = this.getTextFromBundle("mgrForward") + " " + Ename + " Was Successful";
						var empArray = this.getView().getModel("LocalDataModel").getProperty("/empDetails");
					}, this)
				});
			}, this);
			var repDetailsCallFailure = $.proxy(function(oResponse) {
				var fullText = this.getTextFromBundle("CouldNotProcess") + this.empID + " Failed";
				Utility.showMessage(fullText, "error", oResponse.message);
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(oResponse.Message + "  For User" + " " + this.empID, {
					title: this.getTextFromBundle("ERROR"),
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: $.proxy(function(oAction) {
						//this.onReset();  // Reset all selections
						this.quitApp(); // Quit the application
					}, this)
				});
			}, this);
/*			ModelHandler.handleRead(dataServiceModel, "/ET_Transfer_ApproverSet(MPimsid='" + this.empID + "',Pimsid='" + objSelectedItem.Pimsid +
				"',Loc1='" + objSelectedItem.Loc1 + "',Loc2='" + objSelectedItem.Loc2 + "',Loc3='" + objSelectedItem.Loc3 + "',MComment='" +
				comment + "',Wid='433334',Mode='" + flag + "')", "", "", "", "", repDetailsCallSuccess, repDetailsCallFailure);*/
				ModelHandler.handleRead(dataServiceModel, "/ET_TransferSet(Pimsid='" + this.empID + "',Comment='" + Comment + "',Loc1='" +
					 location + "',Loc2='',Loc3='', TypeOfTKey='"+TypeOfTKey+"', SubtypeKey='"+SubtypeKey+"')", "", "", "", "", repDetailsCallSuccess, repDetailsCallFailure
				);				
		}

	});
});
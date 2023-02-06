/*global location */
sap.ui.define([
	"com/phyOccuReport/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/phyOccuReport/model/Utility",
	"com/phyOccuReport/model/ModelHandler",
	"sap/ui/model/Filter",
	'sap/m/GroupHeaderListItem',
	/*"com/phyOccuReport/model/formatter",*/
	"com/phyOccuReport/util/Formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/Dialog"
], function(BaseController, JSONModel, Utility, ModelHandler, Filter, GroupHeaderListItem, formatter, UploadCollectionParameter,MessageBox,MessageToast,Dialog) {
	"use strict";
	var array;
	var Allotid, that, Department, Quarter, Company, gfile, SysDate, imageData;
	var latitude = "";
	var longitude = "";
	var altitude = "";
	return BaseController.extend("com.phyOccuReport.controller.Detail", {
		onInit: function() {
			that = this;
			this.ClearVar();
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			var attachmentJModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(attachmentJModel, "attachmentJModel");
			attachmentJModel.setData([]);

			var oUploadFilejModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(oUploadFilejModel, "oUploadFilejModel");
			
			/*var oFileUploadModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(oFileUploadModel, "oFileUploadModel");
*/
			var oFileUploadIdCardModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(oFileUploadIdCardModel, "oFileUploadIdCardModel");
			
			var onAttachCameraIdCrdModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(onAttachCameraIdCrdModel, "onAttachCameraIdCrdModel");
			
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					altitude = position.coords.altitude;
				});
			}

		},
		//*****************************************************************************************************************************
		ClearVar: function() {
			Allotid = "";
			Department = "";
			Quarter = "";
			Company = "";
			gfile = "";
		},
		//****************************************************************************************************************************
		_onObjectMatched: function(oEvent) {
			/*var sObjectId =  oEvent.getParameter("arguments").objectId;
			this._bindView(sObjectId);*/
			this.flg ="";
			this.Tmpmob = "";
			var tempjsonString = oEvent.getParameter("arguments").objectId;
			var jsonstring = tempjsonString.replace(/@/g, "/");
			var tempSelectedData = JSON.parse(jsonstring);
			this.SelectedData = JSON.parse(tempSelectedData);
			Allotid = this.SelectedData.alid;
			this.funSetEnabled();
			this._bindView(Allotid);
			this.setAllotteeImg(Allotid);
			SysDate = this.payLoadDate(new Date());
			//this.getView().byId("idAllotteDate").setValue();
			this.getView().byId("idAllotteDate").setValue(SysDate);
		},
		//**************************************************************************************************************
		//Set Allotee Image
		setAllotteeImg: function(Allotid) {
			var that = this;
			var AllotieeImgjModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(AllotieeImgjModel, "AllotieeImgjModel");
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_ALLOTMENT_SRV/";
			var sPath = "/ET_PICSet?$filter=Alid eq '" + Allotid + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);

			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				//AllotieeImgjModel.setData(oData);
				if(oData.results.length>0){
					that.AllotteeImg = oData.results[0].ZfileValue;
				//AllotteeImg = "";
				that.getView().byId("idAlotteeimg").setSrc(that.AllotteeImg);
				}
				
			};
			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			oDataModel.read(sPath, oParamsCartListSet);
		},
		//**********************************************************************************************************
		onPressImg: function() {
			var CloseButton = new sap.m.Button({
				text: "Close",
				press: function(oEvent) {
					oDialog.close();
				}
			});
			var oDialog = new sap.m.Dialog({
				//title:"Image of "+Title,
				height: "80%",
				width: "80%",
				content: [
					new sap.m.Image({
						height: "100%",
						width: "100%",
						densityAware: false,
						layoutData: new sap.m.FlexItemData({
							growFactor: 1,
							shrinkFactor: 1
						}),
						src: this.AllotteeImg
					})

				],
				endButton: [CloseButton],
				afterClose: function() {
					this.destroy();
				}
			}).addStyleClass("DialogCSS");
			oDialog.open();
		},
		//**************************************************************************************************************
		payLoadDate: function(SDateValue) {
			//var str = "T00:00:00";
			var currentTime = new Date(SDateValue);
			var month = currentTime.getMonth() + 1;
			var day = currentTime.getDate();
			var year = currentTime.getFullYear();
			var date = year + "-" + month + "-" + day;
			return date;
		},

		//****************************************************************************************************************************
		funSetEnabled: function() {
			if (this.SelectedData.status === "Submitted") {
				var oEnableData = {
					Enabled: false
				};
				this.getView().setModel(new sap.ui.model.json.JSONModel(oEnableData), "EnabledModel");
			} else {
				var oEnableData = {
					Enabled: true
				};
				this.getView().setModel(new sap.ui.model.json.JSONModel(oEnableData), "EnabledModel");
			}
		},

		//*****************************************************************************************************************************
		_bindView: function(Allotid) {
			var InventoryData = this.getView().getModel("LocalJsonModel");
			this.getView().setModel(InventoryData, "InventoryData");
			var fileManageoDataModel = this.getView().getModel("LocalInvDataModel");
			var sServiceUrlsetPath = fileManageoDataModel.sServiceUrl;
			//var sPathCartListSet = "/ET_Fetch_InventorySet(Alid='"+Allotid+"')";
			var sPathCartListSet = "/ET_Fetch_PhysicalSet(Alid='" + Allotid + "')";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				if (oData.Floor == "Do not use: Initialization") {
					oData.Floor = "";
				}
				if (oData.Imkey !== "") {
					oData.Imkey = oData.Imkey.substring(3);
				}

				InventoryData.setData(oData);
				if (InventoryData.oData.Habitable == "F") {
					that.getView().byId("idSwitch").setState(false);
				} else {
					that.getView().byId("idSwitch").setState(true);
				}
				Department = InventoryData.oData.Department;
				Quarter = InventoryData.oData.Quarter;
				Company = InventoryData.oData.Bukrs;
				that.AllotteeMobNo = InventoryData.oData.Bpphoneno;
				that.RecbyDate = InventoryData.oData.Recvbydate;
				if (InventoryData.oData.Recvbydate != "") {
					that.getView().byId("idAllotteDate").setValue(InventoryData.oData.Recvbydate);
				} else {
					that.getView().byId("idAllotteDate").setValue(SysDate);
				}

			};

			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			oDataModel.read(sPathCartListSet, oParamsCartListSet);
		},
		//*****************************************************************************************************************************
		OnPressAttach: function() {
			that.getView().byId("idAllotteDate").setValueState("None");
			if (that.getView().byId("idAllotteDate").getValue() === "") {
				sap.m.MessageBox.warning("Please fill Allotte Date.", {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Warning!",
					actions: ["Ok"],
					onClose: function(oAction) {
						that.getView().byId("idAllotteDate").setValueState("Error");
						return false;
					}
				});
				return false;
			}

			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.phyOccuReport.view.AttachDialog", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
			if (this.SelectedData.status === "Submitted") {
				sap.ui.getCore().byId("idUploadCollection").setUploadButtonInvisible(true);
				sap.ui.getCore().byId("deleteButton").setEnabled(false);
			} else {
				sap.ui.getCore().byId("idUploadCollection").setUploadButtonInvisible(false);
				sap.ui.getCore().byId("deleteButton").setEnabled(true);
			}

			this.getUploadFile();

		},

		getUploadFile: function() {
			Utility.showBusyDialog();
			var array = [];
			var oUploadFilejModel = this.getView().getModel("oUploadFilejModel");
			this.getModel("oUploadFilejModel").refresh(true);
			var fileManageoDataModel = this.getView().getModel("LocalInvDataModel");
			var sServiceUrlsetPath = fileManageoDataModel.sServiceUrl;
			//var sPathCartListSet = "/ET_Fetch_InventorySet(Alid='"+Allotid+"')";
			var sPathCartListSet = "/ET_ATTACHSet?$filter=Alid eq'" + Allotid + "' and ZfileName eq''";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			//var frameworkODataModel = this.getOwnerComponent().getModel();
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				var host = window.location.host;
				var protocol = window.location.protocol;
				var urlprefix = protocol + "//" + host;
				if (oData.results.length > 0) {
					for (var i = 0; i < oData.results.length; i++) {
						var uploadDetails = {};
						uploadDetails.Alid = oData.results[i].Alid;
						uploadDetails.FileName = oData.results[i].ZfileName;
						uploadDetails.MimeType = oData.results[i].ZmimeType;
						uploadDetails.Url = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/ET_ATTACHSet(Alid='" + uploadDetails.Alid +
							"',ZfileName='" + uploadDetails.FileName + "')/$value";
						array.push(uploadDetails);
					}
					Utility.hideBusyDialog();
				}
				Utility.hideBusyDialog();
				oUploadFilejModel.setProperty("/Array", array);
			};

			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			oDataModel.read(sPathCartListSet, oParamsCartListSet);

		},

		onFragClose: function(oEvent) {
			if (this._oDialog) {
				Utility.hideBusyDialog();
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = undefined;
			}
		},
		//***************************************************File Uploading***********************************************************
		onFileAttachUpload: function(oEvent) {
			var oFileUploader = oEvent.getSource();
			var _that = this;
			var csrf = _that.getCSRFToken();

			var oUploadCollection = oEvent.getSource();
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _that.token
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		getCSRFToken: function() {
			var that = this;
			$.ajax({
				url: "/sap/opu/odata/sap/ZODATA_FILE_SUBMIT_SRV",
				type: "GET",
				async: false,
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function(xhr) {
					that.token = xhr.getResponseHeader("X-CSRF-Token");
				}
			});
		},

		onFileBeforeUploadStarts: function(oEvent) {
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
			var dattime = new Date();
			var userid = sap.ushell.Container.getService("UserInfo").getId();
			var uniqueid = userid + dattime.getDate() + dattime.getHours() + dattime.getMinutes() + dattime.getSeconds();

			var file = fileName.substring(0, fileName.length - 4); //remove extension
			var oSlug = fileName;

			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "SLUG",
				value: oSlug + "|" + Allotid
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},

		onFileUploadComplete: function(oEvent) {
			var that = this;
			var oUploadCollection = oEvent.getSource();
			var oResData = oEvent.getParameter("files")[0];
			if (oResData.status == "201") {
				// delay the success message for to notice onChange message
				setTimeout(function() {
					sap.m.MessageToast.show("Uploaded successfully");
				}, 4000);
			} else if (oEvent.getParameter("files")[0].status == "0") {
				oUploadCollection.fireUploadTerminated();
			} else {
				var errmessage = "File Upload failed : " + oEvent.getParameter("files")[0].responseRaw;
				sap.m.MessageBox.show(errmessage, sap.m.MessageBox.Icon.ERROR, "Error");
				oUploadCollection.fireUploadTerminated();
			}
		},

		_callSubmitAttach: function(oEvent) {
			sap.m.MessageBox.confirm("Are you want to upload the images to SAP ?", {
				icon: sap.m.MessageBox.Icon.CONFIRM,
				title: "Confirm",
				actions: ["Yes", "No"],
				onClose: function(oAction) {
					if (oAction === "Yes") {
						//Utility.showBusyDialog();
						sap.ui.getCore().byId("idUploadCollection").upload();
						sap.ui.getCore().byId("deleteButton").setEnabled(true);
						that.onFragClose();
					}
				}
			});
		},

		onFileDeletePress: function(oEvent) {
			var oThis = this;
			var sItem = sap.ui.getCore().byId("idUploadCollection").getSelectedItem();
			if (sItem === null) {
				var errormessage = this.getView().getModel("i18n").getProperty("attachmentlineitemerror");
				this.showErrorMessagePopup(errormessage);
				return;
			}
			sap.m.MessageBox.confirm("Are you sure you want to delete it from SAP ?", {
				icon: sap.m.MessageBox.Icon.CONFIRM,
				title: "Confirm",
				actions: ["Yes", "No"],
				onClose: function(oAction) {
					if (oAction === "Yes") {
						oThis.onFileDeleteFromSAP();
					}
				}
			});
		},

		onFileDeleteFromSAP: function() {
			var that = this;
			var oUploadFilejModel = this.getView().getModel("oUploadFilejModel");
			var sItem = sap.ui.getCore().byId("idUploadCollection").getSelectedItem();
			var spath = sItem.getBindingContext("oUploadFilejModel").getPath();
			var fileInfo = this.getView().getModel("oUploadFilejModel").getProperty(spath);

			gfile = "";
			gfile = spath.split("/").pop();

			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var sPath = "/ET_ATTACHSet(Alid='" + fileInfo.Alid + "',ZfileName='" + fileInfo.FileName + "')";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) {
				var d = oUploadFilejModel.getData();
				d.Array.splice(gfile, 1);
				oUploadFilejModel.setData(d);
				sap.ui.getCore().byId("attachmentTitle").setText(that.getAttachmentTitleText());
				if (oUploadFilejModel.getData().Array.length === 0) {
					sap.ui.getCore().byId("deleteButton").setEnabled(false);
				}
			};
			oParamsCartListSet.error = function(oError) { // error handler
				jQuery.sap.log.error("read publishing group data failed");
				sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			ModelHandler.handleRemoveNew(oDataModel, sPath, oParamsCartListSet.success, oParamsCartListSet.error);
		},

		showErrorMessagePopup: function(message) {
			sap.m.MessageBox.show(message, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Error"
			});
		},

		//******************************************************************************************************************************
		_onSubmit: function() {

			var that = this;
			that.getView().byId("idAllotteDate").setValueState("None");
			if (that.getView().byId("idAllotteDate").getValue() === "") {
				sap.m.MessageBox.warning("Please fill Allotte Date.", {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Warning!",
					actions: ["Ok"],
					onClose: function(oAction) {
						that.getView().byId("idAllotteDate").setValueState("Error");
						return false;
					}
				});
				return false;
			}

			sap.m.MessageBox.confirm("Are you sure you want to submit this decision ?", {
				icon: sap.m.MessageBox.Icon.CONFIRM,
				title: "Confirm",
				actions: ["Ok", "Cancel"],
				onClose: function(oAction) {
					if (oAction === "Ok") {
						that._submitPress();
					}
				}
			});
		},

		_submitPress: function() {
			var Data = {};
			var AddComments = that.getView().byId("idbriefdesc").getValue();
			var switchmode = that.getView().byId("idSwitch").getState();
			var dayperiod = "";
			if (switchmode === true) {
				dayperiod = "F";
			} else {
				dayperiod = "A";
			}
			var AllotteDate = that.getView().byId("idAllotteDate").getValue();

			Data.Alid = Allotid;
			Data.Acomments = AddComments; //Additional Comments
			Data.Habitable = dayperiod; //Switch mode for Forenoon/Afternoon
			Data.Recvbydate = AllotteDate; //Received by Allotte Date
			/*Data.ZdepCat = Department;
			Data.Smenr =	Quarter;
			Data.Bukrs =	Company;*/

			var sServiceUrl = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel1.setHeaders({
				"Content-Type": "application/atom+xml"
			});
			var fncSuccess = function(oData, EpResponse) //success function 
				{
					if (oData.Status !== "") {
						sap.m.MessageBox.show("Your data has been Submitted.", {
							title: "Success",
							icon: sap.m.MessageBox.Icon.SUCCESS,
							onClose: function() {
								that.quitApp();
								//window.location.reload();
								//this.quitApp(); // calling the Quit App function
							}
						});

					} else {
						sap.m.MessageBox.show(oData.Message, {
							title: "Error",
							icon: sap.m.MessageBox.Icon.ERROR,
							onClose: function() {
								that.quitApp();
							}
						});
						return false;
					}

				};

			var fncError = function(oError) { //error callback function
				var parser = new DOMParser();
				sap.m.MessageBox.show(parser, {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR
				});
			};
			//Create Method for final Save
			oCreateModel1.create("/ET_SubmitSet", Data, {
				success: fncSuccess,
				error: fncError
			});

		},
		//******************************************************************************************************************************
		quitApp: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		},
		//*********************************************************************************************************************
		onPressSmartFormPrint: function() {
				this.getView().byId("idDraft").setVisible(true);
				var startDate = this.getView().byId("idAllotteDate").getDateValue();
				//startDate = new Date(startDate.replace(/-/g, "/"));
				var TargatDate = "",
					noOfDaysToAdd = 3,
					count = 0;
				while (count < noOfDaysToAdd) {
					TargatDate = new Date(startDate.setDate(startDate.getDate() + 1));
					if (TargatDate.getDay() != 0 && TargatDate.getDay() != 6) {
						//Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
						count++;
					}
				}

				/*var numberOfDaysToAdd = 2;
          var today = this.getView().byId("idAllotteDate").getDateValue();
          today.setDate(today.getDate() + numberOfDaysToAdd);
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();
          var newdate = dd + "/" + mm + "/" + yyyy;*/

				var that = this;
				var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
				var sPath = "ET_ATTACHSet(Alid='" + Allotid + "',ZfileName='',Charactcateg='')/$value";
				var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
				var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
				oParamsCartListSet.success = function(oData, oResponse) { // success handler
					var abc = oResponse.requestUri;
					/*var pdf = new sap.m.PDFViewer({
						source: abc,
						title: "Form",
						height: "600px"
					});
					pdf.open();*/
					window.open(abc);
				};
				oParamsCartListSet.error = function(oError) { // error handler
					jQuery.sap.log.error("read publishing group data failed");
					MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
				oDataModel.read(sPath, oParamsCartListSet);

			},
			//**************************************************************************************************************
			onPressDraft:function(){
				var that = this;
				that.getView().byId("idAllotteDate").setValueState("None");
				if (that.getView().byId("idAllotteDate").getValue() === "") {
					sap.m.MessageBox.warning("Please fill Allotte Date.", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Warning!",
						actions: ["Ok"],
						onClose: function(oAction) {
							that.getView().byId("idAllotteDate").setValueState("Error");
							return false;
						}
					});
					return false;
				}
				this.getView().byId("idOTP").setVisible(true);
			},
		//**************************************************************************************************************
		//This is Temperory function for only UAT.
		onTempGenerateOTP:function(){
			if (!this._onTempOTPDialog) {
				this._onTempOTPDialog = sap.ui.xmlfragment(
					"com.phyOccuReport.view.TempOTP", this);
				this.getView().addDependent(this._onTempOTPDialog);
			}
			this._onTempOTPDialog.open();
		},
		OnTempOTPfragCancel:function(){
			this._onTempOTPDialog.close();
			this._onTempOTPDialog.destroy();
			this._onTempOTPDialog = undefined;
		},
		//******************************************************************************************************************
		OnTempGenerateOTP: function() {
			this.Tmpmob = sap.ui.getCore().byId("idTempMob").getValue();
			if(this.Tmpmob.length !="10"){
				sap.m.MessageBox.show("Please Enter 10 Digit Mobile No.", {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR
				});
				return false;
			}
			this.generateOTP();
			if (!this._onOTPDialog) {
				this._onOTPDialog = sap.ui.xmlfragment(
					"com.phyOccuReport.view.OTP", this);
				this.getView().addDependent(this._onOTPDialog);
			}
			this._onOTPDialog.open();

			var time = sap.ui.getCore().byId("idText");
			time.setText("");
			var threeMinutesLater = new Date();
			var scs = threeMinutesLater.setSeconds(threeMinutesLater.getSeconds() + 60);
			console.log(scs);
			var countdowntime = scs;

			//var phn_no = this.AllotteeMobNo;
			var phn_no = this.Tmpmob; //this for temporary for UAT

			var Intx = setInterval(function() {
				var now = new Date().getTime();
				var cTime = countdowntime - now;
				//var minutes = Math.floor((cTime % (1000 * 60 * 60)) / (2000 * 60));
				var second = Math.floor((cTime % (3000 * 60)) / 1000);
				time.setText("OTP has sent to Allotee's number +XX XXXXXX" + phn_no.substr(-4) + " \n Please authenticate inspection form.  " +
					second + " Seconds");

				if (second === 0) {
					sap.ui.getCore().byId("idResend").setEnabled(true);
					return;
				}
				if (cTime < 30) {
					clearInterval(Intx);
					time.setText("OTP has sent to Allotee's number +XX XXXXXX" + phn_no.substr(-4) + " \n Please authenticate inspection form.");
					sap.ui.getCore().byId("idResend").setEnabled(true);

				}
			});
		},
		//**************************************************************************************************************
		generateOTP: function() {
			var that = this;
			var Data = {};
			Data.Alid = Allotid;
			Data.Mob = this.Tmpmob;
			Data.Msg = "";
			Data.Zdate = "";
			//Data.Ztime = "";
			Data.Otp = "";
			var sServiceUrl = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
			oCreateModel1.setHeaders({
				"Content-Type": "application/atom+xml"
			});
			var fncSuccess = function(oData, EpResponse) //success function 
				{

				};

			var fncError = function(oError) { //error callback function
				var parser = new DOMParser();
				sap.m.MessageBox.show(oError.message, {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR
				});
			};
			//Create Method for final Save
			oCreateModel1.create("/ET_OTPSet", Data, {
				success: fncSuccess,
				error: fncError
			});

		},
		OnOTPfragCancel: function(oEvent) {
			clearInterval(this.x);
			this._onOTPDialog.close();
			this._onOTPDialog.destroy();
			this._onOTPDialog = undefined;
		},
		//********************************************************************************************************
		onResendOTP: function() {
			sap.ui.getCore().byId("idResend").setEnabled(false);
			var time = sap.ui.getCore().byId("idText");
			time.setText("");
			var threeMinutesLater = new Date();
			var scs = threeMinutesLater.setSeconds(threeMinutesLater.getSeconds() + 60);
			console.log(scs);
			var countdowntime = scs;
			//var phn_no = that.AllotteeMobNo;
			var phn_no = this.Tmpmob; //this for temporary for UAT

			var Intx = setInterval(function() {
				var now = new Date().getTime();
				var cTime = countdowntime - now;
				var second = Math.floor((cTime % (3000 * 60)) / 1000);
				// time.setText("OTP Expires in " + second + " Seconds");
				time.setText("OTP has sent to Allotee's number +XX XXXXXX" + phn_no.substr(-4) + " \n Please authenticate inspection form.  " +
					second + " Seconds");

				if (second === 0) {
					sap.ui.getCore().byId("idResend").setEnabled(true);
				}

				if (cTime < 0) {
					clearInterval(Intx);
					time.setText("OTP has sent to Allotee's number +XX XXXXXX" + phn_no.substr(-4) + " \n Please authenticate inspection form.");
					sap.ui.getCore().byId("idResend").setEnabled(true);
					return;
				}
			});
			this.generateOTP();
		},
		//*******************************************************************************************************
		OnSaveOTP: function() {
			this.otpVerification();
			//this is for Temperory for UAT
			this._onTempOTPDialog.close();
			this._onTempOTPDialog.destroy();
			this._onTempOTPDialog = undefined;
		},
		//*******************************************************************************************************
		otpVerification: function() {
			var that = this;
			var otp = sap.ui.getCore().byId("idOTP").getValue();
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var sPath = "/ET_OTPSet?$filter=Alid eq '" + Allotid + "' and Otp eq '" + otp + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			var cameraSuccess = $.proxy(function(oResponse) {
				if (oResponse.results[0].Msg === "") {
					that._submitPress();

				} else {
					sap.m.MessageBox.show(oResponse.results[0].Msg, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR
					});
				}
			}, this);
			var cameraFailure = $.proxy(function(oResponse) {
				MessageToast.show("error");
			}, this);
			ModelHandler.handleRead(oDataModel, sPath, "", "", "", "", cameraSuccess, cameraFailure);
		},
		//*************************************************************************************************************
		OnClickEdit: function() {
			this.getView().byId("idAllotteDate").setEnabled(true);
		},
		//**********************************************************************************************************
		onTechOccuDateChange: function() {
			var date = new Date();
			var sysDate = this.payLoadDate(date);
			var sysDate1 = Number(new Date(sysDate));
			var techOccuDate = this.getView().byId("idAllotteDate").getDateValue();
			var numOccDate = Number(techOccuDate);
			if (numOccDate != sysDate1) {
				if (!this._oEditDialog) {
					this._oEditDialog = sap.ui.xmlfragment(
						"com.phyOccuReport.view.EditFragment", this);
					this.getView().addDependent(this._oEditDialog);
				}
				
				this._oEditDialog.open();
			}
		},
		onCloseEditfrag: function(oEvent) {
			if(this.flg !="Y"){
				if(this.RecbyDate === ""){
					this.getView().byId("idAllotteDate").setValue(SysDate);	
				}else{
					this.getView().byId("idAllotteDate").setValue(this.RecbyDate);
				}
			/*	var sysDate = new Date();
				var fDate = this.payLoadDate(sysDate);*/
		 }
			
			this._oEditDialog.close();
			this._oEditDialog.destroy();
			this._oEditDialog = undefined;
		 },
		 //*************************************************************************************************************
		getCameraUploadedIDCard: function() {
			Utility.showBusyDialog();
			var that = this;
		/*	var val = "";
			var val1 = "";
			var Charactcateg = "";
			if (this.frgTitle === "Attach Id Details") {
				val = "A";
				val1 = "A";
			} else {
				val = "O";
				val1 = "O";
			}*/
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var onAttachCameraIdCrdModel = this.getView().getModel("onAttachCameraIdCrdModel");
			var sPath = "/ET_CAMERASet?$filter=Alid eq '" + Allotid + "' and Charactcateg eq 'A'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			var cameraSuccess = $.proxy(function(oResponse) {
				if (oResponse.results.length > 0) {
					/*if (castodianFlag === "X") {
						that.getView().byId("idSHvbox").setVisible(true);
						that.getView().byId("saveRep").setVisible(true);
						that.getView().byId("print").setVisible(true);
					}*/

					onAttachCameraIdCrdModel.setData(oResponse);
					sap.ui.getCore().byId("iddeleteButtonIDCard").setEnabled(true);
				} else {
					onAttachCameraIdCrdModel.setData(oResponse);
				}
				Utility.hideBusyDialog();
			}, this);
			var cameraFailure = $.proxy(function(oResponse) {
				MessageToast.show("error");
			}, this);
			ModelHandler.handleRead(oDataModel, sPath, "", "", "", "", cameraSuccess, cameraFailure);
		},
		//*****************************************************************************************************************
		onGetUploadedIdCardFile: function() {
			Utility.showBusyDialog();
			var that = this;
			var oFileUploadIdCardModel = this.getView().getModel("oFileUploadIdCardModel");
			array = [];
			var Alid = Allotid;
			var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
			var sPath = "/ET_ATTACHSet";
			var filter = "Alid eq '" + Alid + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
			//var oDataModel = this.getOwnerComponent().getModel("mainService");
			var oParamsCartListSet = {};
			oParamsCartListSet.context = "";
			oParamsCartListSet.urlParameters = "";
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				//oFileUploadModel.setData(oData);
				/*if(that.frgTitle === "Attach Details"){
					that.valLength2 = oData.results.length;
				}*/
				var host = window.location.host;
				var protocol = window.location.protocol;
				var urlprefix = protocol + "//" + host;
				if (oData.results.length > 0) {
					/*if (castodianFlag === "X") {
						that.getView().byId("idSHvbox").setVisible(true);
						that.getView().byId("saveRep").setVisible(true);
						that.getView().byId("print").setVisible(true);
					}*/

					for (var i = 0; i < oData.results.length; i++) {
						var uploadDetails = {};

						uploadDetails.Alid = oData.results[i].Alid;
						//uploadDetails.uniqueid = oData.results[i].Zslno;
						uploadDetails.FileName = oData.results[i].ZfileName;
						uploadDetails.MimeType = oData.results[i].ZmimeType;
						uploadDetails.Url = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/ET_ATTACHSet(Alid='" + uploadDetails.Alid + "',ZfileName='" +
							uploadDetails.FileName + "',Charactcateg eq 'A')/$value";
						array.push(uploadDetails);
						/*if (LocalDataModel.getProperty("/detailsOfAllotObj/Status") === "PARK" || LocalDataModel.getProperty(
								"/detailsOfAllotObj/Status") === "NEW") {
							sap.ui.getCore().byId("iddeleteButtonIDCard").setEnabled(true);
						}*/
					}
					Utility.hideBusyDialog();
				} else {
					Utility.hideBusyDialog();
					array = [];
				}
				oFileUploadIdCardModel.setProperty("/Array", array);
				// Changes by SJ00727430
				sap.ui.getCore().byId("attachmentTitle").setText(that.getAttachmentTitleText());
			};
			oParamsCartListSet.error = function(oError) { // error handler
				Utility.hideBusyDialog();
				jQuery.sap.log.error("read publishing group data failed");
				MessageToast.show(JSON.parse(oError.responseText).error.message.value);
			};
			ModelHandler.handleRead(oDataModel, sPath, filter, "", "", "", oParamsCartListSet.success, oParamsCartListSet.error);
		},
		 //*****************************************Upload Allotee Id Card*******************************************************
		onAttachAlloteeId: function(oEvent) {
			if (!this._IdCardDialog) {
				this._IdCardDialog = sap.ui.xmlfragment(
					"com.phyOccuReport.view.AttachEfile", this);
				this.getView().addDependent(this._IdCardDialog);
			}
			var oFileUploadIdCardModel = this.getView().getModel("oFileUploadIdCardModel");
			this.getModel("oFileUploadIdCardModel").refresh(true);
			this._IdCardDialog.open();

			this.getCameraUploadedIDCard();
			this.onGetUploadedIdCardFile();
		},
		
		onFileAttachIdCardUpload: function(oEvent) {
			var oFileUploader = oEvent.getSource();
			var _that = this;
			var csrf = _that.getCSRFToken1();

			var oUploadCollection = oEvent.getSource();
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _that.token
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			this.token = oCustomerHeaderToken.mProperties.value;
		},

		getCSRFToken1: function() {
			var that = this;
			$.ajax({
				url: "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV",
				type: "GET",
				async: false,
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function(xhr) {
					that.token = xhr.getResponseHeader("X-CSRF-Token");
				}
			});
		},

		onFileBeforeUploadIdCardStarts: function(oEvent) {
			var oSlug;
			//var val = "";
			//var val1 = "";
			var oVal = oEvent.getParameter("value");
			var fileName = oEvent.getParameter("fileName"); //with extension
			var file = fileName.substring(0, fileName.length - 4); //remove extension
			//var Alid = LocalDataModel.getProperty("/detailsOfAllotObj/Alid");
			var Alid = Allotid;
			/*if (this.frgTitle === "Attach Id Details") {
				val = "A";
				val1 = "A";
			} else {
				val = "A";
				val1 = "O";
			}*/
				oSlug = file;
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "SLUG",
				value: oSlug + "|" + Alid
				//value: val + "|" + oSlug + "|" + Alid + "|" + "-" + "|" + "-" + "|" + "-" + "|" + val1
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		onFileUploadIdCardComplete: function(oEvent) {
			var that = this;
			var oUploadCollection = oEvent.getSource();
			var oResData = oEvent.getParameter("files")[0];
			if (oResData.status == "201") {
				sap.ui.getCore().byId("attachmentTitle").setText(this.getAttachmentTitleTextonIdCard());

				setTimeout(function() {
					Utility.hideBusyDialog();
					MessageToast.show("Uploaded successfully");
					that.handleAttachmentIdCardClose();
					that.Displayimg();
				}, 1000);
			} else if (oEvent.getParameter("files")[0].status == "0") {
				oUploadCollection.fireUploadTerminated();
			} else {
				var errmessage = "File Upload failed : " + oEvent.getParameter("files")[0].responseRaw;
				MessageBox.show(errmessage, MessageBox.Icon.ERROR, "Error");
				oUploadCollection.fireUploadTerminated();
			}
		},

		onFileIdCardSizeExceed: function(oEvent) {
			var errormessage = this.getView().getModel("i18n").getProperty("attachmenterror");
			this.showErrorMessagePopup(errormessage);
			return;
		},

		onUploadIdCardtoSAP: function(oEvent) {
			var that = this;
			sap.m.MessageBox.confirm("Are you want to upload the files to SAP ?", {
				title: "Confirm",
				actions: ["Yes", "No"],
				onClose: function(oAction) {
					if (oAction === "Yes") {
						// Utility.showBusyDialog();
						that.flg = "Y";
						sap.ui.getCore().byId("idUploadCollectionIDCard").upload();
						sap.ui.getCore().byId("iddeleteButtonIDCard").setEnabled(true);
						that._callCloseIDCard();
						//that.onCloseIdCardfrag();
						that.onCloseEditfrag();
					}
				}
			});
		},
		
		_callCloseIDCard: function(oEvent) {
			if (this._IdCardDialog) {
				this._IdCardDialog.close();
				this._IdCardDialog.destroy();
				this._IdCardDialog = undefined;
			}
			
		},
		//************************************************************************************************************
		getAttachmentTitleTextonIdCard: function() {
			var aItems = sap.ui.getCore().byId("idUploadCollectionIDCard").getItems();
			return "Uploaded (" + aItems.length + ")";
		},
		getAttachmentTitleText: function() {
			var aItems = sap.ui.getCore().byId("idUploadCollectionIDCard").getItems();
			return "Uploaded (" + aItems.length + ")";
		},
		/****************************************************Camera Functionality***********************************/
		oncaptureAlloteeId: function(oEvent) {
			/*this.frgTitle = "Attach Id Details";
			if (this.frgTitle === "Attach Id Details") {
				this.val = "A";
			} else {
				this.val = "O";
			}*/
			//This code was generated by the layout editor.
			//this.saveDataCameraLineitem(oEvent);
			var that = this;
			
			//this.selectedLineItem = oEvent.getSource().getBindingContext("LocalDataModel").getProperty().selectedIdValue;
			var geoLocation = ", " + "Latitude = " + latitude + " " + "," + " " + "Longitude = " + longitude + " " + "," +
				" " + "Altitude =" + altitude + "";
			//Step 1: Create a popup object as a global variable
			this.fixedDialog = new Dialog({
				title: "Click on Capture to take photo",
				beginButton: new sap.m.Button({
					text: "Capture Photo",
					press: function(oEvent) {
						// TO DO: get the object of our video player which live camera stream is running
						//take the image object out of it and set to main page using global variable
						that.imageVal = document.getElementById("player");
						var oPopup = oEvent.getSource();
						that.attachName = oPopup.getParent().getContent()[1].getValue();
						that.fixedDialog.close();
						that.setAlloteeCameraIDImage();
						/*that.strm.getTracks().forEach(function(track) {
						  track.stop();
						});
						*/

					}
				}),
				content: [
					new sap.ui.core.HTML({
						content: "<video id='player' autoplay></video>"
					}),
					new sap.m.Input({
						value: geoLocation,
						required: true,
						enabled: false,
						id: 'inputValue'
					}),
					new sap.m.VBox({
						id: 'wow'
					})
				],
				endButton: new sap.m.Button({
					text: "Cancel",
					press: function(oEvent) {
						var imageVal = document.getElementById("player");
						that.fixedDialog.close();
						that.fixedDialog.destroy();
						that.fixedDialog = undefined;
						that.strm.getTracks().forEach(function(track) {
							track.stop();
						});
						that.onCloseIdCardfrag();
						that.onCloseEditfrag();
					}
				})
			});
			this.getView().addDependent(this.fixedDialog);
			//Step 2: Launch the popup
			this.fixedDialog.open();
			var handleSuccess = function(stream) {
				player.srcObject = stream;
				that.strm = stream;
			};

			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(handleSuccess);

		},
		//****************************************************************************************************************
		setAlloteeCameraIDImage: function() {
			var that = this;
			var Alid = Allotid;
			var oVBox = sap.ui.getCore().byId("wow");
			var items = oVBox.getItems();
			var snapId = 'r-' + items.length;
			var textId = snapId + '-text';
			var imageVal = this.imageVal;
			var attachName = this.attachName;
			var dialogValue = this.fixedDialog;
			if (imageVal === null) {
				MessageToast.show("No image captured");
			} else {
				var oCanvas = new sap.ui.core.HTML({
					content: "<canvas id='" + snapId + "' width='350px' height='350px' " +
						" style='2px solid red'></canvas>" +
						"<label id='" + textId + "'>" + attachName + "</label>"
				});
				oVBox.addItem(oCanvas);
				oCanvas.addEventDelegate({
					onAfterRendering: function() {
						var snapShotCanvas = document.getElementById(snapId);
						var oContext = snapShotCanvas.getContext('2d');
						oContext.drawImage(imageVal, 0, 0, snapShotCanvas.width, snapShotCanvas.height);
						imageData = snapShotCanvas.toDataURL('image/png');
						var imageBase64 = imageData.substring(imageData.indexOf(",") + 1);
						//downloader.download(imageData, attachName + ".png", "image/png");
						//window.open(imageData);

						/*********send image to SAP***********/
						//var stringImage = btoa(encodeURI(document.getElementById(snapId).toDataURL().replace("data:image/png;base64,", "")));
						var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
						var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
						var name = attachName + ".JPG";
						var payload = {
							"ZfileName": name,
							"ZfileValue": imageData,
							"Alid": Alid,
							"ZmimeType": ".JPG"
							/*"Charactcateg": that.val*/
						};

						var cameraSuccess = $.proxy(function(oResponse) {
							sap.m.MessageToast.show("success");
							Utility.showBusyDialog();
							if (dialogValue) {
								dialogValue.close();
							}

							that.Displayimg();
							Utility.hideBusyDialog();
							that.fixedDialog.destroy();
							that.fixedDialog = undefined;
							that.strm.getTracks().forEach(function(track) {
								track.stop();
							});

						}, this);
						var cameraFailure = $.proxy(function(oResponse) {
							sap.m.MessageToast.show("error");
							that.strm.getTracks().forEach(function(track) {
								track.stop();
							});
						}, this);
						ModelHandler.handleCreateBatch(oDataModel, "/ET_CAMERASet", "", payload, cameraSuccess, cameraFailure);
					}
				});
			}
		},

		Displayimg: function() {
			if (!this._IdCardDialog) {
				this._IdCardDialog = sap.ui.xmlfragment(
					"com.phyOccuReport.view.AttachEfile", this);
				this.getView().addDependent(this._IdCardDialog);
			}
			var oFileUploadIdCardModel = this.getView().getModel("oFileUploadIdCardModel");
			this.getModel("oFileUploadIdCardModel").refresh(true);
			this._IdCardDialog.open();

			this.getCameraUploadedIDCard();
			this.onGetUploadedIdCardFile();
		},
		
		OnViewAttachment:function(){
			if (!this._IdCardDialog) {
				this._IdCardDialog = sap.ui.xmlfragment(
					"com.phyOccuReport.view.AttachEfile", this);
				this.getView().addDependent(this._IdCardDialog);
			}
			this._IdCardDialog.open();

			this.getCameraUploadedIDCard();
			this.onGetUploadedIdCardFile();
		},
		onFileUploadPress:function(evt){
			var that = this;
			var fname = evt.getSource().getFileName();
				var sServiceUrlsetPath = "/sap/opu/odata/sap/ZREFX_PHYSICAL_OCC_ODATA_SRV/";
				var sPath = "ET_ATTACHSet(Alid='" + Allotid + "',ZfileName='"+fname+"',Charactcateg='A')/$value";
				var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrlsetPath);
				var oParamsCartListSet = {};
				oParamsCartListSet.context = "";
				oParamsCartListSet.urlParameters = "";
				oParamsCartListSet.success = function(oData, oResponse) { // success handler
					var abc = oResponse.requestUri;
					window.open(abc);
				};
				oParamsCartListSet.error = function(oError) { // error handler
					jQuery.sap.log.error("read publishing group data failed");
					MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				};
				oDataModel.read(sPath, oParamsCartListSet);
				
		}
		
		/*onlive:function(evt){
			var val = evt.getSource().getValue();
			   if (val.match(/^[\d.]+$/)) {
				  return true;
			   } else {
				  evt.getSource().setValue();
			   }
		}*/
		

		//**************************************************************************************************************	
	});

});
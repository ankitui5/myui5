jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("imed.app.consentforms.util.Controller");
imed.app.consentforms.util.Controller.extend("imed.app.consentforms.view.Initial", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf llh_consent.Initial
	 */
	onInit: function() {

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);

	},
	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();
		if (oParameters.name !== "general") { 
			return;
		}
		if(config.institution == 'BU10'){
			var imgLogo =	this.getView().byId('imgLogo');
			var imgLogoS =	this.getView().byId('imgLogoS');
			imgLogo.setSrc('img/burjeel-logo.png');
			imgLogoS.setSrc('img/burjeel-logo.png');
		}
		this.getView().byId("swLang").setVisible(true);
		if(this.getView().getModel("i18n")._oResourceBundle.sLocale == "ar"){
			this.getView().byId("swLang").setState(false);
		}
		else{
			this.getView().byId("swLang").setState(true);
		}
		var oLayout = "";
		var ret = this.fetchNursingOU();
		if(ret != undefined && ret == 0){
			oLayout = this.getView().byId('vbFragment'); //don't forget to set id for a VerticalLayout
			var formName = this.getFormName(config.institution, 'en')
			this.oFrag = sap.ui.xmlfragment(formName,this);
			oLayout.addItem(this.oFrag);
		}else{
			this.getRouter().navTo("error", false);
		}
		this.setCurrentDateTime();
	},
	getFormName : function(institution,lang){
		var formName = '';
		if(institution != '' && lang != ''){
			formName = "imed.app.consentforms.view.Fragments.GeneralCons_"+institution.toLowerCase()+"_"+lang.toLowerCase();
		}else{
			formName = "imed.app.consentforms.view.Fragments.GeneralCons"+lang.toLowerCase();
		}
		return formName;
	},
	onClickSignature : function(oEvent){
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("imed.app.consentforms.view.Popover", this);
		}
		this._oPopover.openBy(oEvent.getSource());
		this._oPopover.setModel(this.getView().getModel("i18n"),"signI18n");
		this._oPopover.fromId = oEvent.getParameter("id");//.split("--")[1];
		$('.sigPad').signaturePad({drawOnly:true}).clearCanvas();
	},

	handleCloseButton: function (oEvent) {
		this._oPopover.close();
	},

	handleSaveButton: function (oEvent) {
		var d = document.getElementById("canImg");
		var id = this._oPopover.fromId + "Display";
		sap.ui.getCore().byId(id).setSrc(d.toDataURL());
		this._oPopover.close();
	},

	handleOkButton : function(oEvent){
		var that = this;
		var ipPatientID = sap.ui.getCore().byId("ipPatientID");
		ipPatientID.setValueState("Error");
		ipPatientID.setValueStateText("Fill the Patient ID");
		if(ipPatientID.getValue()){
			ipPatientID.setValueState("None");
			that.showLoading(true);
			var def = new $.Deferred();
			oModel1.read("/PatientCollection(Institution='"+config.institution+"',PatientID='" + ipPatientID.getValue() + "')",{async:true, 
				success: function(oData, oResponse) { 
					sap.ui.getCore().byId("inNextOfKin").setValue(oData.ContactFirstName + " " + oData.ContactLastName);
					sap.ui.getCore().byId("inPhoneNo").setValue(oData.PhoneNo);
					document.getElementById("patientName").innerHTML = oData.FirstName + " " + oData.LastName;
					that.PatientID = oData.PatientID;
					//document.getElementById("test").disabled = false;
					//document.getElementById("idPreview").disabled = false;
					that._oPopoverPatientID.close();
					that.showLoading(false);
				}, 
				error: function(oError){  
					def.reject(that.getError(oError));
					sap.m.MessageToast.show(that.getError(oError));
					that.showLoading(false);
					ipPatientID.setValueState("Error");
				}  
			});
			return def.promise();
		}
	},

	onExit : function () {
		if (this._oPopover) {
			this._oPopover.destroy();
		}
	},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf llh_consent.Initial
	 */
//	onBeforeRendering: function() {

//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf llh_consent.Initial
	 */
	onAfterRendering: function() {
		var that = this;
		this.showPatientIdPopUp();
	},

	getError : function(oError){
		var error ="Error";
		try {
			var mystr = oError.response.body;
			var array = jQuery.parseJSON(mystr);
			error = array.error.message.value;
			//error = JSON.parse(str);
		} catch (e) {
			error = oError.message;
		}
		return error;

	},
	showLoading : function(status) {
		if (!this._dialog) {
			this._dialog = sap.ui.xmlfragment("imed.app.consentforms.view.BusyDialog",this);
			//this.getView().addDependent(this._dialog);
		}
		if (status) {
			this._dialog.open();
		} else {

			jQuery.sap.delayedCall(400, this, function() {
				this._dialog.close();
			});
		}
	},
	showPatientIdPopUp : function(){
		var that = this;
		if (! this._oPopoverPatientID) {
			this._oPopoverPatientID = sap.ui.xmlfragment("imed.app.consentforms.view.PatientID", this);
			this.getView().addDependent(this._oPopoverPatientID);
		}

		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oPopoverPatientID);
		this._oPopoverPatientID.open();
		this.showLoading(false);

		this._oPopoverPatientID.attachBrowserEvent("keydown", function(oEvent) {
			if(oEvent.keyCode == 27){
				oEvent.stopPropagation();
			}
		});
	},
	onChangeLanguage : function(oEvent){
		sap.ui.getCore().getConfiguration().setLanguage("en");
		var formName = this.getFormName(config.institution, 'en')
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "./i18n/messageBundle.properties"
		});
		
		var swLang = this.getView().byId("swLang");
		if (this.oFrag) {
			this.oFrag.destroy(true);
		}
		
		if(swLang.getState()== true){
			sap.ui.getCore().getConfiguration().setLanguage("en");
			i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : "./i18n/messageBundle.properties"
			});
			var oLayout = this.getView().byId('vbFragment'); //don't forget to set id for a VerticalLayout
			oLayout.removeAllItems();
			formName = this.getFormName(config.institution, 'en')
			this.oFrag = sap.ui.xmlfragment(formName,this);
			oLayout.addItem(this.oFrag);

		}else{
			sap.ui.getCore().getConfiguration().setLanguage("ar");
			formName = this.getFormName(config.institution, 'ar')
			i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : "./i18n/messageBundle_ar.properties"
			});
			var oLayout = this.getView().byId('vbFragment'); //don't forget to set id for a VerticalLayout
			oLayout.removeAllItems();
			this.oFrag = sap.ui.xmlfragment(formName,this);
			oLayout.addItem(this.oFrag);
		}
		this.setCurrentDateTime();
		this.getView().setModel(i18nModel,"i18n")

		//this.getRouter().navTo("general",{}, true);
		return;
		this.showLoading(true);
		var a = document.URL;
		if(oEvent.getSource().getState()){
			//Change English Language
			window.location.href = a.replace("AR","EN");
		}
		else{
			//Change Arabic Language
			window.location.href = a.replace("EN","AR");
		}
		
	}, 
	onCancel : function(){
		window.location = location.href;
	},
	
	onSave : function(){
		$("#dummyContent").html("");
		$("#dummyContent").css("display","none");
		if(!this.validateDate()){
			alert(this.error);
		}
		else{
			debugger;
			var that = this;
			that.showLoading(true);
			that.getView().byId("idSave").disabled = true;
			that.getView().byId("idPreview").disabled = true;

			that.getView().byId("swLang").setVisible(false);

			var canvas = undefined;// document.getElementById("canTest");
			//canvas.width = document.querySelector("body").offsetWidth;
			$("#__xmlview2--contentWhole").clone().appendTo("#dummyContent");
			$("#dummyContent").css("display","block");

			//var qsObj = document.querySelector("#__xmlview2--contentWhole");
			var qsObj = document.querySelector("#dummyContent");

			var quotes = document.getElementById('dummyContent');
			//$("#dummyContent").html($("#__xmlview2--contentWhole").html());

			jQuery.sap.delayedCall(1000, this, function() {
				html2canvas(qsObj, {
					onrendered: function (canvas) {
						canvas : canvas
					}, 
					height: qsObj.scrollHeight+20,
					letterRendering : true
				}).then(function(canvas) {

					var extra_canvas = document.createElement("canvas");
					extra_canvas.setAttribute('width',canvas.width);
					extra_canvas.setAttribute('height',canvas.height);
					var ctx = extra_canvas.getContext('2d');
					ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,1120,1650  );
					//canvas = extra_canvas;

					var pdf = new jsPDF('p', 'pt', 'letter',true);

					for (var i = 0; i <= quotes.clientHeight / 1020; i++) {
							//! This is all just html2canvas stuff
							var srcImg = canvas;
							var sX = 0;
							var sY = 1020 * i; // start 980 pixels down for every new page
							var sWidth = 900;
							var sHeight = 1020;
							var dX = 0;
							var dY = 0;
							var dWidth = 900;
							var dHeight = 1020;
	
							window.onePageCanvas = document.createElement("canvas");
							onePageCanvas.setAttribute('width', 900);
							onePageCanvas.setAttribute('height', 1020);
							var ctx = onePageCanvas.getContext('2d');
							// details on this usage of this function: 
							// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
							ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
	
							// document.body.appendChild(canvas);
							var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
	
							var width = onePageCanvas.width;
							var height = onePageCanvas.clientHeight;
	
							//! If we're on anything other than the first page,
							// add another page
							if (i > 0) {
								pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
							}
							//! now we declare that we're working on that page
							pdf.setPage(i + 1);
							//! now we add content to that page!
							pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .62), (height * .62), undefined, 'FAST');
					}
					//pdf.save("testt.pdf");
					//that.showLoading(false);
					//return;
					var pdfString = pdf.output("datauristring");
					
					var upload = {
							DocumentCategory: "ZCONNTATTA",
							FileName: "ConForm.pdf",
							FileType: pdfString.split(",")[0].split("/")[1].split(";")[0],
							Institution: config.institution,
							NursingOU: config.NursingOU,
							PatientID: that.PatientID,
							SoftCopy: pdfString.split(",")[1]

					};
					var def = new $.Deferred();
					oModel1.create("/ConsentFormCollection", upload, {async:true, 
						success: function(oData, oResponse) {
							var ret = 0;
							def.resolve(ret);
							sap.m.MessageToast.show("Form uploaded successfully!");
							that.showLoading(false);
							location.reload();
							jQuery.sap.delayedCall(1000, this, function() {
								location.reload();
							});
						}, 
						error: function(oError){
							def.reject(that.getError(oError));
							sap.m.MessageToast.show(that.getError(oError));
							that.getView().byId("idSave").disabled = false;
							that.getView().byId("idPreview").disabled = false;
							that.showLoading(false);
							$("#dummyContent").html("");
							$("#dummyContent").css("display","none");
						}  
					});
					return def.promise();

				});

			}, false);
		}
	},
	
	
	onPreview : function(){
		var body = document.body,
		html = document.documentElement;

		var height = Math.max( body.scrollHeight, body.offsetHeight, 
				html.clientHeight, html.scrollHeight, html.offsetHeight );

		var that = this;
		that.showLoading(true);

		that.getView().byId("swLang").setVisible(false);



		//document.getElementById("test").disabled = true;
		//document.getElementById("idPreview").disabled = true;
		var canvas = document.getElementById("canTest");
		canvas.width = document.querySelector("body").offsetWidth;
		canvas.height = document.querySelector("#__xmlview2--contentWhole").scrollHeight;

		jQuery.sap.delayedCall(1000, this, function() {
			html2canvas(document.querySelector("#__xmlview2--contentWhole"), {
				onrendered: function (canvas) {
					canvas : canvas
				}, 
				height: canvas.height,
				letterRendering : true
			}).then(function(canvas) {

				var extra_canvas = document.createElement("canvas");
				extra_canvas.setAttribute('width',canvas.width);
				extra_canvas.setAttribute('height',canvas.height);
				var ctx = extra_canvas.getContext('2d');
				ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,900,1450  );
				canvas = extra_canvas;

				that.getView().byId("contentWhole").setVisible(false);
				that.getView().byId("imgPreview").setVisible(true);
				that.getView().byId("imgPreview").setSrc(canvas.toDataURL());
				//that.getView().byId("imgPreview").setHeight(canvas.height + "px");
				//document.getElementById("idPreview").style.display = "none";

				//document.getElementById("test").disabled = false;
				that.showLoading(false);
			});
		});
	},
	validateDate : function(){
		this.error = "";
		var inPatientGuardianDT =  sap.ui.getCore().byId("inPatientGuardianDT");
		var inRelationToPatientDT =  sap.ui.getCore().byId("inRelationToPatientDT");
		var inWitnessDT =  sap.ui.getCore().byId("inWitnessDT");
		var inTranslatorInterDT =  sap.ui.getCore().byId("inTranslatorInterDT");
		var inpWitnessName = $("#inpWitnessName");

		var ret = true;
		if(inPatientGuardianDT != undefined && inPatientGuardianDT.getValue() != "" && new Date(inPatientGuardianDT.getValue()) > new Date()){

			this.error = "You have selected the future date/time."
				ret = false;
		}else if(inRelationToPatientDT != undefined &&  inRelationToPatientDT.getValue() != "" && new Date(inRelationToPatientDT.getValue()) > new Date()){
			this.error = "You have selected the future date/time."
				ret = false;
		}else if(inWitnessDT != undefined &&  inWitnessDT.getValue() != "" && new Date(inWitnessDT.getValue()) > new Date()){
			this.error = "You have selected the future date/time."
				ret = false;
		}else if(inTranslatorInterDT != undefined &&  inTranslatorInterDT.getValue() != "" && new Date(inTranslatorInterDT.getValue()) > new Date()){
			this.error = "You have selected the future date/time."
				ret = false;
		}
		if(ret == false)
			return ret;

		var imgOneDisplay = sap.ui.getCore().byId("imgOneDisplay");
		var imgTwoDisplay = sap.ui.getCore().byId("imgTwoDisplay");
		var imgThreeDisplay = sap.ui.getCore().byId("imgThreeDisplay");
		var imgFourDisplay = sap.ui.getCore().byId("imgFourDisplay");
		if((imgOneDisplay != undefined && imgTwoDisplay != undefined) && imgOneDisplay.getSrc() == "" && imgTwoDisplay.getSrc() == ""){
			this.error = "Patient signature or substitute consent signature is required."
				ret = false;
		}
		if((imgThreeDisplay != undefined && imgFourDisplay != undefined) && imgThreeDisplay.getSrc() == "" && imgFourDisplay.getSrc() == ""){
			this.error = "Witness  signature or interpreter/translator signature is required."
				ret = false;
		}
		if(imgThreeDisplay.getSrc() != "" && inpWitnessName.val().trim() == ""){
			this.error = "Please enter witness name!"
				ret = false;
		}
		return ret;
	},
	setCurrentDateTime : function(){
		//var inPatientGuardianDT = sap.ui.getCore().byId('inPatientGuardianDT');
		var dateCtls = ['inRelationToPatientDT','inWitnessDT','inTranslatorInterDT','inPatientGuardianDT'];
		for(var i=0; i<dateCtls.length;i++){
			var inDate = dateCtls[i].toString();
			var inDateCtrl = sap.ui.getCore().byId(inDate);
			if(inDateCtrl != null || inDateCtrl != undefined)
				inDateCtrl.setDateValue(new Date());
		}
		
		
	}
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf llh_consent.Initial
	 */
//	onExit: function() {

//	}

});
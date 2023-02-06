var uPloadCollectionJmodel,items;
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/FileSizeFormat",
	//"sap/m/ColorPalettePopover",
	//"sap/ui/unified/ColorPickerDisplayMode",
	],
	
function(jQuery, Controller, MessageToast, UploadCollectionParameter, JSONModel, FileSizeFormat) {
var AddRowJModel;

return sap.ui.controller("zrmaps.view.View1", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf zsumitapss.View1
	 */
	//	onInit: function() {
	//
	//	},
	onInit : function() {
		debugger
		
		this.getBinaryImage();
		
		this.uploadCollection();
		var sPath;
		this.attachPopoverOnMouseover(this.getView().byId("target"), this.getView().byId("popover"));
		 
		// set mock data
		//sPath = jQuery.sap.getModulePath("zrmaps.view", "/uploadCollection.json");
		//sPath = jQuery.sap.getModulePath("zrmaps.view", uPloadCollectionJmodel);

		//this.getView().setModel(new JSONModel(sPath));

		// Sets the text to the label
		/*this.getView().byId("UploadCollection").addEventDelegate({
			onBeforeRendering: function() {
				this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
			}.bind(this)
		});
		*/
		// Flag to track if the upload of the new version was triggered by the Upload a new version button.
		//this.bIsUploadVersion = false;
		
				
		
		var currentDate = new Date;	
		this.getView().byId("idatePiker2").setMaxDate(currentDate);
		this.getView().byId("iddaterange").setMaxDate(currentDate);
		
		//this.getView().byId("toDate").setMaxDate(currentDate);	
		
		this.getView().byId("idatePiker").setValue("03-05-2019");
		   var tchscrn = sap.ui.Device.support.touch;
		   var brwsr = sap.ui.Device.browser; 	 
			 if(tchscrn == true){
				 this.getView().byId("idName").setValue("Ram");
			 } 
			 
			 this.onDropDownf4();
			 this.jsnModel();
			 this.bindComboData();
			 this.FnCustomeJmodel();
			 
			// create a JModel					
				this.TransactionDetails=[];
					var TranDetailsJModel= new sap.ui.model.json.JSONModel();
					this.getView().byId("tblDetail1").setModel(TranDetailsJModel,"TranDetailsJModel");					
					TranDetailsJModel.setData(this.TransactionDetails);
					
					//this.getView().byId("idtext").setText("abc").addStyleClass("mycustomclass");
					
					debugger;
					 var oDatePicker = this.getView().byId("idatePiker");
						oDatePicker.addEventDelegate({
							onAfterRendering: function(){
						var oDateInner = this.$().find('.sapMInputBaseInner');
								var oID = oDateInner[0].id;
								$('#'+oID).attr("disabled", "disabled"); 
							}},oDatePicker);
			
						
			var obj={
				busy:false,
				delay:0
				};
			var oPageModel=new sap.ui.model.json.JSONModel(obj);
			this.getView().setModel(oPageModel,"oPageModel");			
			this.getF4Data();
			
			
			AddRowJModel = new sap.ui.model.json.JSONModel();
			this.getView().byId("idTableAddRow").setModel(AddRowJModel, "AddRowJModel");
			
			AddRowJModel.setData([]);
			AddRowJModel.refresh();
	},
	
//*******************************************************
oncrossngv:function(){
	debugger
	var claim = "WJD000140320";
	sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZCS_CLAIM_SRV/AwardOutputFormSet(ClaimNo='"+claim+"')/$value", true);
	
/*	var DocketToClaimNvg = [];
	var Data = {};
	
	
	Data.DocketNo = "TEST123456"
	Data.DocketToClaimNvg = [{
								"ClaimNo":"123456789",
							    "DocketNo":"TEST123456"
							  },
							{"ClaimNo":"123456789",
							"DocketNo":"TEST123456"}];	

	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
		oCreateModel1.setHeaders({"Content-Type": "application/atom+xml"});
		var fncSuccess = function(oData, oResponse) //success function 
			{
				if(oData.EError=="true"){
					sap.m.MessageBox.show(oData.EMessage, {
				        title: "Error",
				        icon:sap.m.MessageBox.Icon.ERROR,
				        onClose:function(){
				        }
				    });	
				}else{
				sap.m.MessageBox.show(oData.EMessage, {
			        title: "Success",
			        icon:sap.m.MessageBox.Icon.SUCCESS,
			        onClose:function(){
			        	
			        	
			        	
			        }
			    });
				}
			}
		
		var fncError = function(oError) { //error callback function
			var parser = new DOMParser();
			//var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
			sap.m.MessageBox.show(parser, {
		        title: "Error",
		        icon:sap.m.MessageBox.Icon.ERROR,
		    });
		}
		//Create Method for final Save
		oCreateModel1.create("/CreateDocketSet", Data, {
			success: fncSuccess,
			error: fncError
		});*/
},	
	//******************************************

ontest:function(){
	debugger
	var Data={};
	    Data.ClaimNo = "12345";
	var sServiceUrl = "/sap/opu/odata/sap/ZCS_CLAIM_SRV/";
	var oCreateModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl);
	var fncSuccess = function(oData, oResponse) //sucess function 
		{
	
			debugger
			if(oData.EError=="X"){
				sap.m.MessageBox.show(oData.EMessage, {
			        title: "Error",
			        icon:sap.m.MessageBox.Icon.ERROR,
			        onClose:function(){
			       		
			        }
			    });	
			}else{
				 
				sap.m.MessageBox.show(oData.EMessage, {
			        title: "Success",
			        icon:sap.m.MessageBox.Icon.SUCCESS,
			        onClose:function(){
			        	var router = sap.ui.core.UIComponent.getRouterFor(_self);
            			router.navTo("S1");
			        }
				});
			
			}
		}
	
	var fncError = function(oError) { //error callback function
		var parser = new DOMParser();
		var message=parser.parseFromString(oError.response.body,"text/xml").getElementsByTagName("message")[0].innerHTML
		sap.m.MessageBox.show(message, {
	        title: "Error",
	        icon:sap.m.MessageBox.Icon.ERROR,
	    });
	}
	//Create Method for final Save
	oCreateModel1.create("/UpdateClaimStatusSet", Data, {
		success: fncSuccess,
		error: fncError
	});	
},
	
	
getBinaryImage:function(){
	debugger
	var that = this;
	var sUrl, oImg;
	
	sUrl = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/GetImagePredictionHeadSet(ClaimNo='121')?$expand=PredictionImageNvg&$format=json";
	//sUrl = "https://cors-anywhere.herokuapp.com/services.odata.org/V2/Northwind/Northwind.svc/Categories(1)/Picture?$format=json";
     oImg = this.getView().byId("idBinaryimg");
              
              $.get( sUrl, function( data ) {
                debugger
                  var sTrimmedData = data.d.PredictionImageNvg.results[0].Image.substr(104);
                  oImg.setSrc("data:image/bmp;base64," + sTrimmedData);
              });
	
	/*var host = window.location.host;
    var protocol = window.location.protocol;
    var urlprefix = protocol + "//" + host;	
    
    sUrl = urlprefix + "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/GetImagePredictionHeadSet(ClaimNo='121')?$expand=PredictionImageNvg";
    oImg = this.byId("myImage");
    
    $.get( sUrl, function(oData) {
      debugger
        var sTrimmedData = oData.d.Picture.substr(104);
        oImg.setSrc("data:image/bmp;base64," + sTrimmedData);
    });*/
    
    
	/*var objView = this.getView();
	var BinaryJmodel = new sap.ui.model.json.JSONModel();
		objView.setModel(BinaryJmodel, "BinaryJmodel");
	
	var sServicePath = "/sap/opu/odata/sap/ZCS_INSPECTION_SRV/"; 
	var sPathSet = "GetImagePredictionHeadSet(ClaimNo='121')?$expand=PredictionImageNvg";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath);
	var oParamsCartListSet = {};			
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			debugger
			BinaryJmodel.setData(oData.PredictionImageNvg.results);
			var sTrimmedData = BinaryJmodel.oData[0].Image.substr(104);
			that.getView().byId("idBinaryimg").setSrc("data:image/bmp;base64," + sTrimmedData)
		};
		oParamsCartListSet.error = function(oError) { // error handler 
		};	
		frameworkODataModel.read(sPathSet, oParamsCartListSet);*/
},	
	
	
	
uploadCollection:function(){
	debugger
	 items = [
		{
			"documentId" : "64469d2f-b3c4-a517-20d6-f91ebf85b9da",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Screenshot.jpg",
			"mimeType" : "image/jpg",
			"thumbnailUrl" : "",
			"url" : "test-resources/sap/m/demokit/sample/UploadCollection/LinkedDocuments/Screenshot.jpg",
			attributes:[
				{
					"title":"Uploaded By",
					"text":"Susan Baker"
				},
				{
					"title":"Uploaded On",
					"text":"2014-09-03"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"50"
				},
				{
					"title":"Version",
					"text":"1"
				}
			],
			statuses:[
				{
					"title":"First status' title",
					"text":"First status' text",
					"state":"None"
				}
			],
			"selected": false
		}, {
			"documentId" : "5082cc4d-da9f-2835-2c0a-8100ed47bcde",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Notes.txt",
			"mimeType" : "text/plain",
			"thumbnailUrl" : "",
			"url" : "test-resources/sap/m/demokit/sample/UploadCollection/LinkedDocuments/Notes.txt",
			attributes:[
				{
					"title":"Uploaded By",
					"text":"John Smith"
				},
				{
					"title":"Uploaded On",
					"text":"2014-09-02"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"2266000"
				},
				{
					"title":"Version",
					"text":"1"
				}
			],
			statuses:[
				{
					"title":"Status",
					"text":"None",
					"state":"None"
				}
			],
			selected: false
		}, {
			"documentId" : "5082cc4d-da9f-2835-2c0a-8100ed47bcdf",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Document.txt",
			"mimeType" : "text/plain",
			"thumbnailUrl" : "",
			"url" : "",
			"attributes":[
				{
					"title" : "Uploaded By",
					"text":"J Edgar Hoover"
				},
				{
					"title":"Uploaded On",
					"text":"2014-09-01"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"15000"
				},
				{
					"title":"Version",
					"text":"1"
				}
			],
			statuses:[
				{
					"title":"Status",
					"text":"Success",
					"state":"Success"
				}
			],
			"selected": false
		}, {
			"documentId" : "1700ead2-3dfb-5a94-6f5c-cf1da409e028",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Third Quarter Results.ppt",
			"mimeType" : "application/vnd.ms-powerpoint",
			"thumbnailUrl" : "",
			"url" : "test-resources/sap/m/demokit/sample/UploadCollection/LinkedDocuments/Third Quarter Results.ppt",
			"attributes":[
				{
					"title":"Uploaded By",
					"text":"Sean O'Connel"
				},
				{
					"title":"Uploaded On",
					"text":"2014-07-29"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"2000"
				},
				{
					"title":"Version",
					"text":"1"
				}
			],
			statuses:[
				{
					"title":"Status",
					"text":"Warning",
					"state":"Warning"
				}
			],
			"selected": false
		}, {
			"documentId" : "34e484e4-a523-6c50-685b-e5ae66069250",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Business Plan Agenda.doc",
			"mimeType" : "application/msword",
			"thumbnailUrl" : "",
			"url" : "test-resources/sap/m/demokit/sample/UploadCollection/LinkedDocuments/Business Plan Agenda.doc",
			attributes:[
				{
					"title":"Uploaded By",
					"text":"Jane Burns"
				},
				{
					"title":"Uploaded On",
					"text":"2014-07-28"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"250"
				},
				{
					"title":"Version",
					"text":"1"
				}
			],
			statuses:[
				{
					"title":"Status",
					"text":"Error",
					"state":"Error"
				}
			],
			"selected": false
		}, {
			"documentId" : "bcc27c4d-a8ce-3ab6-e807-ec05119685a5",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Business Plan Topics.xls",
			"mimeType" : "application/msexcel",
			"thumbnailUrl" : "",
			"url" : "test-resources/sap/m/demokit/sample/UploadCollection/LinkedDocuments/Business Plan Topics.xls",
			attributes:[
				{
					"title":"Uploaded By",
					"text":"John Black"
				},
				{
					"title":"Uploaded On",
					"text":"2014-07-27"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"3000000"
				},
				{
					"title":"Version",
					"text":"1"
				}
			],
			statuses:[
				{
					"title":"",
					"text":"",
					"state":"None"
				}
			],
			"selected": false
		}, {
			"documentId" : "6b6ccd2f-e5c2-15b7-3b67-191564850063",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Instructions.pdf",
			"mimeType" : "application/pdf",
			"thumbnailUrl" : "",
			"url" : "test-resources/sap/m/demokit/sample/UploadCollection/LinkedDocuments/Instructions.pdf",
			attributes:[
				{
					"title":"Uploaded By",
					"text":"David Keane"
				},
				{
					"title":"Uploaded On",
					"text":"2014-07-26"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"35000"
				},
				{
					"title":"Version",
					"text":"1"
				}
			],
			statuses:[
				{
					"title":"",
					"text":"",
					"state":"None"
				}
			],
			"selected": false
		}, {
			"documentId" : "b68a7065-cc2a-2140-922d-e7528cd32172",
			"visibleEdit" : true,
			"visibleDelete" : true,
			"fileName" : "Picture of a woman.png",
			"mimeType" : "image/png",
			"thumbnailUrl" : "test-resources/sap/m/images/Woman_04.png",
			"url" : "test-resources/sap/m/images/Woman_04.png",
			attributes:[
				{
					"title":"Uploaded By",
					"text":"Kate Brown"
				},
				{
					"title":"Uploaded On",
					"text":"2014-07-25"
				},
				{
					"title":"File Size",
					"type" :"size",
					"text":"40000000"
				},
				{
					"title":"Version",
					"text":"2"
				}
			],
			statuses:[
				{
					"title":"",
					"text":"",
					"state":"None"
				}
			],
			"selected": false
		}
	]
	
	var objView = this.getView();
	 uPloadCollectionJmodel = new sap.ui.model.json.JSONModel();
		objView.setModel(uPloadCollectionJmodel, "uPloadCollectionJmodel");
		uPloadCollectionJmodel.setData(items);
	
	
},
	
/*******************************************************************************************************************/
	/*formatAttribute: function(sValue, sType) {
		debugger
		if (sType === "size") {
			return FileSizeFormat.getInstance({
				binaryFilesize: false,
				maxFractionDigits: 1,
				maxIntegerDigits: 3
			}).format(sValue);
		} else {
			return sValue;
		}
	},*/

	/*onChange: function(oEvent) {
		debugger
		var oUploadCollection = oEvent.getSource();
		// Header Token
		var oCustomerHeaderToken = new UploadCollectionParameter({
			name: "x-csrf-token",
			value: "securityTokenFromModel"
		});
		oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

	},*/

	/*onFileSizeExceed: function(oEvent) {
		debugger
		MessageToast.show("FileSizeExceed event triggered.");
	},*/

	/*onTypeMissmatch: function(oEvent) {
		debugger
		MessageToast.show("TypeMissmatch event triggered.");
	},*/

	/*onUploadComplete: function(oEvent) {
		debugger
		// If the upload is triggered by a new version, this function updates the metadata of the old file and deletes the progress indicator once the upload was finished.
		if (this.bIsUploadVersion) {
			this.updateFile(oEvent.getParameters());
		} else {
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var oItem = {};
			var sUploadedFile = oEvent.getParameter("files")[0].fileName;
			// at the moment parameter fileName is not set in IE9
			if (!sUploadedFile) {
				var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				sUploadedFile = aUploadedFile[0];
			}
			oItem = {
				"documentId": jQuery.now().toString(), // generate Id,
				"fileName": sUploadedFile,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",
				"attributes": [
					{
						"title": "Uploaded By",
						"text": "You"
					},
					{
						"title": "Uploaded On",
						"text": new Date(jQuery.now()).toLocaleDateString()
					},
					{
						"title": "File Size",
						"text": "505000"
					},
					{
						"title": "Version",
						"text": "1"
					}
				]
			};
			aItems.unshift(oItem);
			this.getView().byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			// Sets the text to the label
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		}

		// delay the success message for to notice onChange message
		setTimeout(function() {
			debugger
			MessageToast.show("UploadComplete event triggered.");
		}, 4000);
	},*/

	/*onBeforeUploadStarts: function(oEvent) {
		debugger
		// Header Slug
		var oCustomerHeaderSlug = new UploadCollectionParameter({
			name: "slug",
			value: oEvent.getParameter("fileName")
		});
		oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		MessageToast.show("BeforeUploadStarts event triggered.");
	},*/

	getAttachmentTitleText: function() {
		debugger
		var aItems = this.getView().byId("UploadCollection").getItems();
		return "Uploaded (" + aItems.length + ")";
	},

	/*onDownloadItem: function() {
		debugger
		var oUploadCollection = this.getView().byId("UploadCollection");
		var aSelectedItems = oUploadCollection.getSelectedItems();
		if (aSelectedItems) {
			for (var i = 0; i < aSelectedItems.length; i++) {
				oUploadCollection.downloadItem(aSelectedItems[i], true);
			}
		} else {
			MessageToast.show("Select an item to download");
		}
	},
*/
	/*onVersion: function() {
		debugger
		var oUploadCollection = this.getView().byId("UploadCollection");
		this.bIsUploadVersion = true;
		this.oItemToUpdate = oUploadCollection.getSelectedItem();
		oUploadCollection.openFileDialog(this.oItemToUpdate);
	},*/

	/*onSelectionChange: function() {
		debugger
		var oUploadCollection = this.getView().byId("UploadCollection");
		// If there's any item selected, sets download button enabled
		if (oUploadCollection.getSelectedItems().length > 0) {
			this.getView().byId("downloadButton").setEnabled(true);
			if (oUploadCollection.getSelectedItems().length === 1) {
				this.getView().byId("versionButton").setEnabled(true);
			} else {
				this.getView().byId("versionButton").setEnabled(false);
			}
		} else {
			this.getView().byId("downloadButton").setEnabled(false);
			this.getView().byId("versionButton").setEnabled(false);
		}
	},*/

/*	updateFile: function() {
		debugger
		var oData = this.getView().byId("UploadCollection").getModel().getData();
		var aItems = jQuery.extend(true, {}, oData).items;
		// Adds the new metadata to the file which was updated.
		for (var i = 0; i < aItems.length; i++) {
			if (aItems[i].documentId === this.oItemToUpdate.getDocumentId()) {
				// Uploaded by
				aItems[i].attributes[0].text = "You";
				// Uploaded on
				aItems[i].attributes[1].text = new Date(jQuery.now()).toLocaleDateString();
				// Version
				var iVersion = parseInt(aItems[i].attributes[3].text, 10);
				iVersion++;
				aItems[i].attributes[3].text = iVersion;
			}
		}
		// Updates the model.
		this.getView().byId("UploadCollection").getModel().setData({
			"items": aItems
		});
		// Sets the flag back to false.
		this.bIsUploadVersion = false;
		this.oItemToUpdate = null;
	},*/
/********************************************************************************************************************/	
getF4Data : function(){
	debugger
	var oPageModel=this.getView().getModel("oPageModel");
	oPageModel.setProperty("/busy",true);
	var sServicePath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/"; 
	var sPathSet = "CustomerRegionSet?$filter=Country eq 'IN'";
	var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath);
	var oParamsCartListSet = {};			
		oParamsCartListSet.success = function(oData, oResponse) { // success handler
			debugger
			oPageModel.setProperty("/busy",false);
			oPageModel.setProperty("/F4StateData",oData.results)
			//JsonModel.setModel(oData.results);
		};
		oParamsCartListSet.error = function(oError) { // error handler 
		};	
		frameworkODataModel.read(sPathSet, oParamsCartListSet);
	
},

onF4State:function(oEvent){
	debugger
	this.oval=oEvent.getSource();
	this._helpdialog = sap.ui.xmlfragment("zrmaps.view.F4Dialog", this);
	this.getView().addDependent(this._helpdialog);
	var abc = this._helpdialog.open();
},

_handlePlantF4Confirm:function(oEvent){
	debugger
	var oSelectedItem = oEvent.getParameter("selectedItem");
	if (oSelectedItem) {
		this.oval.setValue(oSelectedItem.getTitle());
	}
},

_handlePlantValueHelpSearch:function(oEvent){
	debugger
	var sValue = oEvent.getParameter("value");
	var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
	var oFilter2 = new sap.ui.model.Filter("RegionCode", sap.ui.model.FilterOperator.Contains, sValue);
	var oFilter3 = new sap.ui.model.Filter([oFilter, oFilter2],false)
	oEvent.getSource().getBinding("items").filter([oFilter3]);
},
/********************************************************************************************************************/	
		
	onLive:function(oEvt){
		debugger
		var val = oEvt.getSource().getValue();
		if(val != "")
			oEvt.getSource().setShowValueHelp(false);
		if(val == "")
			oEvt.getSource().setShowValueHelp(true);
	},
	
	onStarRating : function(oEvt){
		debugger
		var valstar = oEvt.getSource().getValue();
	},
	
/**********************************************************************************************************************/	
//Routing Page
	onNext : function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View2",{"entity":JSON.stringify(jsonstring)});
	
} ,	

onNext2 : function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g, "@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View3",{"entity":JSON.stringify(jsonstring)});
},
	
onNext4 : function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g,"@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View4",{"entity":JSON.stringify(jsonstring)});
},

onNext5 : function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g,"@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("View5",{"entity":JSON.stringify(jsonstring)});
	
},
onNext6: function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g,"@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("Reading",{"entity":JSON.stringify(jsonstring)});
	
},

onNext7: function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g,"@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("S1",{"entity":JSON.stringify(jsonstring)});
	
},

onNext8: function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g,"@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("masterDetail",{"entity":JSON.stringify(jsonstring)});
	
},

onPaging:function(){
	debugger
	var selectedData={};
	var tempjsonString = JSON.stringify(selectedData);
	var jsonstring = tempjsonString.replace(/\//g,"@");
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("Pagging",{"entity":JSON.stringify(jsonstring)});
},

onSalesOrder : function(){
	debugger
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("SalesOrder");
},

onBindingTypes : function(){
	debugger
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo("BindingTypes");
},
/**********************************************************************************************************************/
	openFullSample: function (oEvent) {
		debugger
		if (!this.oColorPalettePopoverFull) {
			this.oColorPalettePopoverFull = new ColorPalettePopover("oColorPalettePopoverFull", {
				defaultColor: "black",
				colorSelect: this.handleColorSelect
			});
		}

		this.oColorPalettePopoverFull.openBy(oEvent.getSource());
	},
	
/**********************************************************************************************************************/	
onAdd : function(){
	debugger
	var oViewObj = this.getView();
	var MYjsonModel = new sap.ui.model.json.JSONModel();
	oViewObj.setModel(MYjsonModel, "MYjsonModel");
	 
	var sServicePath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/"; 
	var sPathSet = "CustomerRegionSet?$filter=Country eq 'IN'";
	
			var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServicePath);
			var oParamsCartListSet = {};
			//oParamsCartListSet.context = "";
			//oParamsCartListSet.urlParameters = "";
			
			oParamsCartListSet.success = function(oData, oResponse) { // success handler
				debugger
				MYjsonModel.setData(oData);
				
				
			};
			oParamsCartListSet.error = function(oError) { // error handler 
				
			};
			
			frameworkODataModel.read(sPathSet, oParamsCartListSet);
			/*frameworkODataModel.attachRequestCompleted(function() {
				
			});*/
	
	
	
	
	
	
	/*var val1 = this.getView().byId("idAmt1").getValue();
	var val2 = this.getView().byId("idAmt2").getValue();
	
	var val3 = parseFloat(val1) + parseFloat(val2);
	this.getView().byId("idfinalAmt").setValue(val3);*/
	
},

onLess : function(){
	debugger
	var val1 = this.getView().byId("idAmt1").getValue();
	var val2 = this.getView().byId("idAmt2").getValue();
	
	if(val1 < val2){
		sap.m.MessageBox.show("Ammount2 cannot be greater than Ammount1.", {
            title: "ERROR",
            icon:sap.m.MessageBox.Icon.ERROR,
			});
			return;
	}
	
	var val3 = parseFloat(val1) - parseFloat(val2);
	this.getView().byId("idfinalAmt").setValue(val3);
	
},

onMulti : function(){
	var val1 = this.getView().byId("idAmt1").getValue();
	var val2 = this.getView().byId("idAmt2").getValue();
	
	var val3 = parseFloat(val1) * parseFloat(val2);
	this.getView().byId("idfinalAmt").setValue(val3);
	
},

/*********************************************************************************************************************/
	jsnModel : function(){
		 debugger
		 var that = this;
		// JSON sample data
		 var data = {
		     firstName: "John",
		     lastName: "Doe",
		     Dist : "Delhi",
		     
		 };
		 
		var oViewObj = this.getView();
		var jModel = oViewObj.getModel("jModel");
			if (!jModel) {
				jModel = new sap.ui.model.json.JSONModel();
				oViewObj.setModel(jModel, "jModel");
			}
		 //var oModel = new sap.ui.model.json.JSONModel();
			jModel.setData(data);   	
	 },
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
//Bind Data in combo box
	 bindComboData: function(){
		 debugger
			var oView = this.getView();
			/*var user = new sap.ushell.services.UserInfo();
			var uid = user.getId();	*/
			var Service = oView.getModel("Service");
			if (!Service) {
				Service = new sap.ui.model.json.JSONModel();
				oView.setModel(Service, "Service");
			}
			var sServiceUrl = "/sap/opu/odata/sap/ZFM_SECONDARYSALE_SRV";
			var sPathService = "/F4ServiceSet";
			var frameworkODataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			var oParamsService = {};
			oParamsService.context = "";
			oParamsService.urlParameters = "";
			oParamsService.success = function(oData, oResponse) { // success handler
				Service.setData(oData.results);
			}; 
			oParamsService.error = function(oError) { // error handler 		
				jQuery.sap.log.error("read publishing group data failed");
			}.bind(this);
			frameworkODataModel.read(sPathService, oParamsService);
			frameworkODataModel.attachRequestCompleted(function() {
			});
		 
		 },
		 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
addNewTransaction:function(){
			debugger
	var Data = {};
	var TransactionTbl  = this.getView().byId("tblDetail1");
			
	var TransactionData = TransactionTbl.getModel("TranDetailsJModel").getData();
	this.tranID = TransactionTbl.getModel("TranDetailsJModel").getData();	
	this.tranID.push(Data);
	TransactionTbl.getModel("TranDetailsJModel").setData(this.tranID);
	//TransactionTbl.getModel("TranDetailsJModel").refresh()
			
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
onRemoveTransDetail:function(evt){
				debugger
	var TransactionTbl = this.getView().byId("tblDetail1");
	var path = evt.getSource().getParent().oBindingContexts.TranDetailsJModel.sPath.split('/')[1];
		if (path !== -1) {
			TransactionTbl.getModel("TranDetailsJModel").getData().splice(path,1);
			TransactionTbl.getModel("TranDetailsJModel").refresh(); 
		 }

},	
	 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//F4 for District
ondist: function() {
		var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerDistrictSet?$filter=Country eq 'IN' and RegionCode eq '" + this.State + "'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpDistrictDialog = new sap.m.SelectDialog({

			title: "District",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{District}",
					customData: [new sap.ui.core.CustomData({
						key: "Key",
						value: "{District}"
					})]

				})
			}, 
			liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("District", sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			confirm: [this._handleDistrictClose, this],
			cancel: [this._handleDistrictClose, this]
		});
		_valueHelpDistrictDialog.setModel(jModel);
		_valueHelpDistrictDialog.open();
	},

	_handleDistrictClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if(oSelectedItem){
			this.District = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			this.getView().byId("iddist").setValue(oSelectedItem.getTitle());
			this.getView().byId("idCity").setEnabled(true).setValue();
		}
	},
	 /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//F4 for State
	 onState: function() {
	debugger

	var abc = sap.ui.Device.support.touch;
	if(abc == false){
		var IN = "IN";
	} else {
		var IN = "US";
	}

	var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/CustomerRegionSet?$filter=Country eq '"+IN+"'";
		var jModel = new sap.ui.model.json.JSONModel();
		jModel.loadData(sPath, null, false, "GET", false, false, null);
		var _valueHelpSelectDialog = new sap.m.SelectDialog({

			title: "State",
			items: {
				path: "/d/results",
				template: new sap.m.StandardListItem({
					title: "{Region}",
					description: "{RegionCode}",
					customData: [new sap.ui.core.CustomData({
						key: "Key",
						value: "{RegionCode}"
					})]

				})
			},
		
			liveChange: function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter2 = new sap.ui.model.Filter("RegionCode", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter3 = new sap.ui.model.Filter([oFilter, oFilter2],false)
				oEvent.getSource().getBinding("items").filter([oFilter3]);
			},
			confirm: [this._handleClose, this],
			cancel: [this._handleClose, this]
		});
		_valueHelpSelectDialog.setModel(jModel);
		_valueHelpSelectDialog.open();
		
	 	
	},

	_handleClose: function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			this.State = oEvent.getParameter("selectedItem").getCustomData()[0].getValue();
			this.getView().byId("idState").setValue(oSelectedItem.getTitle());
			state = oSelectedItem.getDescription();
			this.getView().byId("iddist").setEnabled(true).setValue();
			this.getView().byId("idCity").setEnabled(false).setValue();
		}
		
	 	
	}, 
	 /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	 onDropDownf4:function(){
		 debugger
	     var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerTicketSet";
			var jModel = new sap.ui.model.json.JSONModel();
			jModel.loadData(sPath, null, false,"GET",false, false, null);
			var  loc= this.getView().byId("idDropF4");
			loc.unbindAggregation("items");
			loc.setModel(jModel);
			loc.bindAggregation("items", {
				path : "/d/results",
				template : new sap.ui.core.Item({
					key : "{Key}",
					text : "{TicketNo}"
				})
			}); 		
			
		
		},
	
	

	 /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//F4 for Ticket No
	 onF4 : function() {
		 debugger
	   //var sPath = "/sap/opu/odata/sap/ZAPSTEST_SRV/F4Material02Set";	 
	   var sPath = "/sap/opu/odata/sap/ZCS_TICKET_SRV/SearchHelpDealerTicketSet";
	   var jModel = new sap.ui.model.json.JSONModel();
	       jModel.loadData(sPath, null, false,"GET",false, false, null);
	   var _valueHelpTicketSelectDialog = new sap.m.SelectDialog(
				{
					title : "Select Ticket",
					items : {
						path : "/d/results",
						template : new sap.m.StandardListItem(
								{
									title : "{TicketNo}",
									customData : [ new sap.ui.core.CustomData(
											{
												key : "{Key}",
												value : "{TicketNo}"
											}) ],
								}),
					},
			liveChange : function(oEvent) {
			 var sValue = oEvent.getParameter("value");
		     var oFilter = new sap.ui.model.Filter("TicketNo",sap.ui.model.FilterOperator.Contains,sValue);
				 oEvent.getSource().getBinding("items").filter([ oFilter ]);
			},
			confirm : [ this._handleTicketClose, this ],
			cancel : [ this._handleTicketClose, this ]
		});
		  _valueHelpTicketSelectDialog.setModel(jModel);
		  _valueHelpTicketSelectDialog.open();
	},

	_handleTicketClose : function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			debugger
				this.getView().byId("idF4").setValue(oSelectedItem.getTitle()); 	
		}
	},

	 /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Validate Customer name.
	validateCharacter : function( oEvent ){
		debugger
		
		////////////for upper case//////////////////
		var text     = oEvent.getSource().getValue();
			val = text.replace(/ +/g, "");
			this.getView().byId("idName").setValue(val.toUpperCase());
		/////////////end of upper case////////////////
		
		
		var text     = oEvent.getSource().getValue();
		var reg      = /^[a-zA-Z]+$/;
		if( !text.match(reg) ){
			if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
				text = text.substring( 1 , text.length );
			}else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
				text = text.substring( 0 , text.length - 1 );
			}else{
				for( var i = 0 ; i < text.length; i++ ){
					if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
						text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
					}
				}
			}
			oEvent.getSource().setValue( text );  
		}else{
			oEvent.getSource().setValueState( "None" );
		} 
	},

	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Name with space
	ValidateName : function(oEvent){ 
		debugger
	var text = oEvent.getSource().getValue();
	var code = text.charCodeAt(text.length-1);

	        if ( !(code > 64 && code < 91) && !(code > 96 && code < 123) && !(code == 32) ){ //point
	               text = text.substring( 0 , text.length - 1 );
	          }                    
	  oEvent.getSource().setValue(text);       
	},

	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Validate Number
	NumberValid: function(oEvent){ 
		debugger;
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

	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Create date formate "YYYY,MM,DD,T00:00:00"
	payLoadDate: function(SDateValue) {
		debugger 
		var str = "T00:00:00";
		var currentTime = new Date(SDateValue);
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		var date = year + "-" + month + "-" + day + str;
		return date;
	},

	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	//Can accept future date
	onchangeDate : function(oEvent){
		debugger
		var date = oEvent.getSource().getDateValue();
		var today=new Date();
		
		today.setHours(00,00,00);
		if(date.getTime()>today.getTime()){
			sap.m.MessageToast.show("Date Cannot Be A Future Date.");
			oEvent.getSource().setDateValue(null);
			return
		}
	},
	
	onchangeDate2 : function(){
		debugger
		var dateval = this.getView().byId("idatePiker2").getDateValue();
		this.getView().byId("iddaterange").setMinDate(dateval);
		
	},
	
	payLoadDateee: function(SDateValue) {
		debugger 
		var str = "T00:00:00";
		var currentTime = new Date(SDateValue);
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		var date = year + "-" + month + "-" + day + str;
		return date;
	},
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	onReview : function(){
		debugger
		
        var xy = this.getView().byId("idtext1").getText();
		
		
		
		
		var abc = this.getView().byId("idatePiker").getDateValue();
		
		this.payLoadDateee(abc);
		
	
		var tblid = this.getView().byId("tblDetail1");
		var lngth =	tblid.getItems().length
			
		for(var i=0; i<=lngth; i++){
			var itms = tblid.getItems()[i].getCells()[2].getValue();
				if(itms == "mat"){
					tblid.getItems()[i].getCells()[5].setValue("Welcom");
				} else if(itms == "ram"){
					tblid.getItems()[i].getCells()[5].setValue("Welcom ram");
				} else if(itms == "raunak"){
					tblid.getItems()[i].getCells()[5].setValue("Welcom raunak");
				} else if(itms == "rohit"){
					tblid.getItems()[i].getCells()[5].setValue("Welcom rohit");
				} else if(itms == "smit"){
					tblid.getItems()[i].getCells()[5].setValue("Welcom sumit");
				}
		}
		
	},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
FnCustomeJmodel : function(){
	debugger
	var book = [{
	    "ProductName": "ABC",
	    "Cost": 50,
	    "ProductType": "Flap",
	    
	}, {
		"ProductName": "XYZ",
	    "Cost": 50.81,
	    "ProductType": "Tyre",
	}, {
		"ProductName": "MNP",
	    "Cost": 80.81,
	    "ProductType": "Flap",
	}, {
		"ProductName": "PBW",
	    "Cost": 90.61,
	    "ProductType": "Tyre",
	}, {
		"ProductName": "STY",
	    "Cost": 10.81,
	    "ProductType": "Tube",
	}, {
		"ProductName": "SRG",
	    "Cost": 60.44,
	    "ProductType": "Tyre",
	}, {
		"ProductName": "PRD",
	    "Cost": 22.81,
	    "ProductType": "Tyre",
	}, {
		"ProductName": "ZYC",
	    "Cost": 45.81,
	    "ProductType": "Tyre",
	}, {
		"ProductName": "LPG",
	    "Cost": 76.81,
	    "ProductType": "Tube",
	}, {
		"ProductName": "OMN",
	    "Cost": 77.81,
	    "ProductType": "Tyre",
	}, {
		"ProductName": "LLP",
	    "Cost": 22.81,
	    "ProductType": "Flap",
	}, {
		"ProductName": "AKP",
	    "Cost": 3.81,
	    "ProductType": "Tyre",
	}, {
		"ProductName": "ARG",
	    "Cost": 44.81,
	    "ProductType": "Tube",
	}]
	
	var objView = this.getView();
	var TableJmodel = new sap.ui.model.json.JSONModel();
		objView.setModel(TableJmodel, "TableJmodel");
		TableJmodel.setData(book);
},

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onPressSorter : function(){
	debugger
	 if (!this.oSorterDialog) {
			this.oSorterDialog = sap.ui.xmlfragment("zrmaps.view.Sorting", this);
			this.getView().addDependent(this.oSorterDialog);
			
			var arr = [{
				Key: "ProductName",
				Value: "ProductName Name"	
			},
			{
				Key: "Cost",
				Value: "Cost"	
			},
			{
				Key: "ProductType",
				Value: "Product Type"	
			}
			/*{
				Key: "NetValue",
				Value: "Invoice Value"	
			}*/
			];
			
			var sModel = new sap.ui.model.json.JSONModel ( { oItems: arr });
			
			this.getView().setModel( sModel, "oSortModel");
		    }
		    this.oSorterDialog.open();
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
handleSortDialogConfirm : function(oEvent) {
	debugger
    var oTable = this.byId("idtab3table");
    var mParams = oEvent.getParameters();
    var oBinding = oTable.getBinding("items");
    var sPath;
    var bDescending;
    var aSorters = [];
    
    sPath = mParams.sortItem.getKey();
    bDescending = mParams.sortDescending;
    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
    oBinding.sort(aSorters);
},
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
onSearch1 : function (oEvent) {
	debugger
	/*if (oEvent.getParameters().refreshButtonPressed) {
		this.onRefresh();
	} else {*/
		var aTableSearchArray = [];  
		var sQuery = oEvent.getParameter("query"); 
			var oFilter1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, sQuery);
			var oFilter2 = new sap.ui.model.Filter("Cost", sap.ui.model.FilterOperator.EQ, sQuery);
			var oFilter3 = new sap.ui.model.Filter("ProductType", sap.ui.model.FilterOperator.Contains, sQuery);
			
			    aTableSearchArray= new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3]);
			this._applySearchData(aTableSearchArray);
	/*}*/
},

_applySearchData: function(aTableSearchArray) {
	debugger
	var oTable = this.byId("idtab3table")
	var binding =oTable.getBinding("items")
		binding.filter(aTableSearchArray, sap.ui.model.FilterType.Application);
			
},
/************************************************************************************************************/
onSearch2 : function(oEvent){
	debugger
	var aTableSearchArray2 = [];  
	//var sQuery = oEvent.getParameter("query");
	var prdname = this.getView().byId("idprdname").getValue();
	var cost = this.getView().byId("idCost").getValue();
	var prdtype = this.getView().byId("idPrdType").getValue();
	
		var oFilter1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, prdname);
		var oFilter2 = new sap.ui.model.Filter("Cost", sap.ui.model.FilterOperator.EQ, cost);
		var oFilter3 = new sap.ui.model.Filter("ProductType", sap.ui.model.FilterOperator.Contains, prdtype);
		
		    aTableSearchArray2= new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3]);
		this._applySearchData2(aTableSearchArray2);
},

_applySearchData2: function(aTableSearchArray2) {
	debugger
	var oTable = this.byId("idtab3table2");
	var binding =oTable.getBinding("items");
		binding.filter(aTableSearchArray2, sap.ui.model.FilterType.Application);
			
},



/*onRefresh : function () {
	debugger
	var oTable = this.byId("idtab3table");
	oTable.getBinding("items").refresh();
},*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/	
	//clear model and refrsh
	//var myLocation = location;
	//myLocation.reload();
			//var jModel = that.getView().getModel("jModel");
			//jModel.setData({d:{}});
	//jModel.setData({d: null}, true);
	//jModel.setData([]);
	//jModel.setData(null);
	//jModel.destroy();
			//jModel.updateBindings(true);
			//jModel.refresh(); 
	
	/*var oUploadModel = that.getView().getModel("oUploadModel");
	//oUploadModel.setData({items:{}});
	oUploadModel.setData([]);
	oUploadModel.updateBindings(true);
	oUploadModel.refresh();
	var tabBar = that.getView().byId("idIconTabBar");
	tabBar.setSelectedKey("KeyClmDtl");*/	
/*****************************************************************************************************************/
onOnlyNumber:function(oEvent){
	debugger;
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
/*****************************************************************************************************************/
onOnlyChar : function(oEvent){
	debugger
	var text     = oEvent.getSource().getValue();
	var reg      = /^[a-zA-Z]+$/;
	if( !text.match(reg) ){
		if( !isNaN( text.charAt(0)) || !text.charAt(0).match(reg)){
			text = text.substring( 1 , text.length );
		}else if( !isNaN( text.charAt( text.length - 1 )) || !text.charAt(text.length - 1).match(reg)){
			text = text.substring( 0 , text.length - 1 );
		}else{
			for( var i = 0 ; i < text.length; i++ ){
				if( !isNaN( text.charAt(i) ) || !text.charAt(i).match(reg)){
					text = text.split( text.charAt(i) )[0] + text.split( text.charAt(i) )[1];
				}
			}
		}
		oEvent.getSource().setValue( text );  
	}else{
		oEvent.getSource().setValueState( "None" );
	} 
},
/*****************************************************************************************************************/
onUpper : function(oEvent){
	debugger
	var text     = oEvent.getSource().getValue();
	val = text.replace(/ +/g, "");
	this.getView().byId("idinput3").setValue(val.toUpperCase());
},
/*****************************************************************************************************************/
onTakeoneDigitAfterPoint : function(oEvent){
	debugger
	 var val = oEvent.getSource().getValue();
	if(val[val.length-3]==".")
    {
  	  val = val.substring(0,val.length - 1);
  	  oEvent.getSource().setValue(val);
    }
		
},		
/*****************************************************************************************************************/
onValidateSpeciealChar:function(evt){
	debugger
	var val = evt.getSource().getValue();
	 if(val.match(("([p!@#$%&,*])"))){
	    	evt.getSource().setValue();
	    };
},

onLastFourDigitNum:function(){ 
	debugger
	var getVal = this.getView().byId("idinput6").getValue();
	var lastFive = getVal.substr(getVal.length - 4);

		if(isNaN(lastFive)){
			sap.m.MessageToast.show("Last four digits should be number");
			this.getView().byId("idinput6").setValue();
			return false;
		}
},
/******************************************************Add Table Row**********************************************************/
onAddNewRow:function(){
	debugger
	var data = [];
		data	 = AddRowJModel.getData();
	
	var TblData = {};
		
		TblData.rowData1 	= "";
		TblData.rowData2 	= "";
		TblData.rowData3	= "";
		
		data.push(TblData);
		
		AddRowJModel.setData(data);
		AddRowJModel.refresh();

},

onDeleteRow : function(oEvt){
	debugger
	var index = oEvt.getSource().getParent().getBindingContextPath().split('/')[1];
	if(index != ""){
		AddRowJModel.getData().splice(index,1);
		AddRowJModel.refresh();
	}
		
	
},
/******************************************************************************************************************/
//On Mouse over
attachPopoverOnMouseover: function (targetControl, popover) {
	debugger
    targetControl.addEventDelegate({
    	onmouseover: this._showPopover.bind(this, targetControl, popover),
    	onmouseout:  this._clearPopover.bind(this, popover),
    }, this);
  },
  
 _showPopover: function (targetControl, popover) {
	 debugger
      this._timeId = setTimeout(() => popover.openBy(targetControl), 500);
 },

_clearPopover: function(popover) {
	debugger
      clearTimeout(this._timeId) || popover.close();
},
/******************************************************************************************************************/

});
});
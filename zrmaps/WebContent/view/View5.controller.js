sap.ui.define([
	"sap/m/MessageBox",
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"jquery.sap.script",
	'sap/suite/ui/commons/ChartContainerContent',
	//"zftdashboard/util/Formatter"
	 "sap/viz/ui5/controls/common/feeds/FeedItem",
     "sap/viz/ui5/data/FlattenedDataset"
	
], function(MessageBox,Fragment,Controller, JSONModel,MessageToast,FeedItem,FlattenedDataset) {
	"use strict";
		var that
return sap.ui.controller("zrmaps.view.View5", {
	//selectedData: [],
onInit: function() {
debugger
var oModel = new sap.ui.model.json.JSONModel({
book: [{
    "City": "New York ",
    "Cost": 295584.81,
    "Item Category": "Action Movies",
    "Profit": 173793.31,
    "Revenue": 469378.12,
    "Unit Price": 1240.79,
    "Units Available": 17336,
    "Units Sold": 57571
}, {
    "City": "New York ",
    "Cost": 215065.45,
    "Item Category": "Alternative Movies",
    "Profit": 140874.87,
    "Revenue": 355940.33,
    "Unit Price": 1319.07,
    "Units Available": 11270,
    "Units Sold": 48552
}, {
    "City": "New York ",
    "Cost": 115132.04,
    "Item Category": "Audio Equipment",
    "Profit": 56994.34,
    "Revenue": 172126.37,
    "Unit Price": 763.21,
    "Units Available": 11248,
    "Units Sold": 37303
}, {
    "City": "New York ",
    "Cost": 171742.42,
    "Item Category": "Cameras",
    "Profit": 81093.4,
    "Revenue": 252835.82,
    "Unit Price": 1143.57,
    "Units Available": 14917,
    "Units Sold": 51664
}, {
    "City": "New York ",
    "Cost": 331033.94,
    "Item Category": "Comedy Movies",
    "Profit": 150465.23,
    "Revenue": 481499.18,
    "Unit Price": 2268.02,
    "Units Available": 22449,
    "Units Sold": 69005
}, {
    "City": "New York ",
    "Cost": 207854.46,
    "Item Category": "Country Music",
    "Profit": 115242.56,
    "Revenue": 323097.02,
    "Unit Price": 1456.91,
    "Units Available": 17996,
    " Units Sold": 45346
}, {
    "City": "New York ",
    "Cost": 243875.22,
    "Item Category": "Drama",
    "Profit": 124653.66,
    "Revenue": 368528.87,
    "Unit Price": 1369.83,
    "Units Available": 23662,
    "Units Sold": 66737
}, {
    "City": "New York ",
    "Cost": 294962,
    "Item Category": "Horror Movies",
    "Profit": 124668.09,
    "Revenue": 419630.09,
    "Unit Price": 1658.12,
    "Units Available": 26538,
    "Units Sold": 78528
}, {
    "City": "New York ",
    "Cost": 20362.45,
    "Item Category": "Pop",
    "Profit": 7955.24,
    "Revenue": 28317.7,
    "Unit Price": 148.76,
    "Units Available": 6227,
    "Units Sold": 16389
}, {
    "City": "New York ",
    "Cost": 253598.76,
    "Item Category": "Rock",
    "Profit": 141583.73,
    "Revenue": 395182.49,
    "Unit Price": 1337.09,
    "Units Available": 14801,
    "Units Sold": 579010
}, {
    "City": "New York ",
    "Cost": 142550.68,
    "Item Category": "Soul / R&B",
    "Profit": 80381.86,
    "Revenue": 222932.54,
    "Unit Price": 1250.65,
    "Units Available": 11900,
    "Units Sold": 321511
}, {
    "City": "New York ",
    "Cost": 174617.63,
    "Item Category": "TV's",
    "Profit": 87620.46,
    "Revenue": 262238.09,
    "Unit Price": 967.09,
    "Units Available": 16738,
    "Units Sold": 646512
}, {
    "City": "New York ",
    "Cost": 42853.89,
    "Item Category": "Video Equipment",
    "Profit": 23242.33,
    "Revenue": 66096.22,
    "Unit Price": 209.79,
    "Units Available": 6344,
    "Units Sold": 2007
}]
});
this.getView().setModel(oModel);
},
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
})
});
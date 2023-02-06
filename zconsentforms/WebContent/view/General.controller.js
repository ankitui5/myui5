jQuery.sap.require("imed.app.consentforms.util.Controller");
imed.app.consentforms.util.Controller.extend("imed.app.consentforms.view.General", {

	onInit: function() {

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);

	},
	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();
		if (oParameters.name !== "error") { 
			return;
		}
		var lblError = this.getView().byId("lblError");
		lblError.setText("");
		if(appError != undefined && appError != "")
			lblError.setText(appError);
		
		
	},
});
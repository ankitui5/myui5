jQuery.sap.require("imed.app.consentforms.util.Formatter");
jQuery.sap.require("imed.app.consentforms.util.Controller");
imed.app.consentforms.util.Controller.extend("imed.app.consentforms.view.Master", {

	onInit : function() {
		
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {

			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "main") {
				//alert('master main');
			}
		},

		this);
	},
});

/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/safran/ewm/zewm_staging_re/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
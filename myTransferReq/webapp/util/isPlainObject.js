/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * This module is overall:
 * SPDX-FileCopyrightText: 2009-2021 SAP SE or an SAP affiliate company and OpenUI5 contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * but contains a modified implementation of jQuery.isPlainObject taken from jQuery 3.5.1, which is:
 * SPDX-FileCopyrightText: JS Foundation and other contributors
 * SPDX-License-Identifier: MIT
 */

sap.ui.define([], function() {
	"use strict";

	var class2type = {};
	var hasOwn = class2type.hasOwnProperty;
	var toString = class2type.toString;
	var fnToString = hasOwn.toString;
	var ObjectFunctionString = fnToString.call( Object );

	/**
	 * Checks whether the object is a plain object (created using "{}" or "new Object").
	 *
	 * @function
	 * @since 1.58
	 * @public
	 * @alias module:sap/base/util/isPlainObject
	 * @param {Object} obj the object which is checked
	 * @returns {boolean} whether or not the object is a plain object (created using "{}" or "new Object").
	 */
	var fnIsPlainObject = function(obj) {
		/*
		 * The code in this function is taken from jQuery 3.5.1 "jQuery.isPlainObject" and got modified.
		 *
		 * jQuery JavaScript Library v3.5.1
		 * http://jquery.com/
		 *
		 * Copyright jQuery Foundation and other contributors
		 * Released under the MIT license
		 * http://jquery.org/license
		 */
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = Object.getPrototypeOf( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with a prototype are considered plain only if they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;

		// Known Issue in IE:
		// TypeError: Function.prototype.toString: 'this' is not a Function object
		// https://github.com/jquery/jquery/issues/3841
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	};
	return fnIsPlainObject;
});

sap.ui.define(["sap/ui/test/Opa5"],function(t){"use strict";return t.extend("com.safran.ewm.zewm_dispatch.test.integration.arrangements.Startup",{iStartMyApp:function(t){var a=t||{};a.delay=a.delay||50;this.iStartMyUIComponent({componentConfig:{name:"com.safran.ewm.zewm_dispatch",async:true},hash:a.hash,autoWait:a.autoWait})}})});
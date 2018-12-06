Ext.define('ModernTutorial.Application', {
	extend: 'Ext.app.Application',
	name: 'ModernTutorial',
	requires: ['ModernTutorial.*'],
	
	launch: function () {
		Ext.ariaWarn = Ext.emptyFn
		Ext.getBody().removeCls('launching')
		var elem = document.getElementById("splash")
		elem.parentNode.removeChild(elem)
		
		Ext.Viewport.add([{xtype: 'mainview'}])
	},

	onAppUpdate: function () {
		Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
			function (choice) {
				if (choice === 'yes') {
					window.location.reload();
				}
			}
		);
	}
});

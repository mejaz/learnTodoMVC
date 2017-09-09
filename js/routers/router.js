
var Workspace = Backbone.Router.extend({
	routes : {
		'*filter' : 'setFilter'
	},

	setFilter : function(param) {
		// set the currect filter to be used
		// trigger a collection filer event, causing  hiding and unhiding
		// of Todo view items
		window.app.Todos.trigger('filter');
	}
});

app.TodoRouter = new Workspace();
Backbone.history.start();


var app = app || {};

// Todo Model
//------------
// this model has 'title', 'order' and 'completed' attributes


app.Todo = Backbone.Model.extend({

	defaults: {
		title: '',
		completed: false
	},

	// toggle the completed state of the todo item
	toggle: function() {
		this.save({
			completed: !this.get('completed')
		});
	}

});

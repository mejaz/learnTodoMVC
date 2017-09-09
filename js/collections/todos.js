

var app = app || {};

// Todo Collection
// ---------------

// it has a localStorage and no server

var TodoList = Backbone.Collection.extend({

	// reference to this collection's model
	model: app.Todo,

	// creating a localStorage with the name - 'todos-backbone'
	localStorage: new Backbone.LocalStorage('todos-backbone'),

	// filter down all finished todo items
	completed: function() {
		// this.filter() is from Underscore.JS
		return this.filter(function(todo) {
			return todo.get('completed');
		});
	},

	// filter down the unfinished todo items
	remaining: function() {

		// with 'apply' we can re-define 'this' within a function scope
		// this.without is from Underscore.JS
		return this.without.apply(this, this.completed());
	},

	// keeping the list of todos in order, generating the ID for the next todo
	nextOrder : function() {
		if(!this.length) {
			return 1;
		}
		// this.last() is from Underscore.JS
		return this.last().get('order') + 1;
	},

	// todos are sorted in their original insertion order
	comparator : function(todo) {
		return todo.get('order');
	}

});

// create our global collection of Todos
app.Todos = new TodoList();


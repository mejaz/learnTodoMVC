
var app = app || {};

// The Application
// ---------------

// This is the top-level piece of UI
app.AppView = Backbone.View.extend({
	// binding existing element of the DOM with el
	el : '#todoapp',

	// template for displaying the stats at the bottom of the app
	statsTemplate : _.template($('#stats-template').html()),

	events : {
		'keypress #new-todo' : 'createOnEnter',
		'click #clear-completed' : 'clearCompleted',
		'click #toggle-all' : 'toggleAllComplete'
	},

	// binding the events from the Todos Collection at initialization
	initialize : function () {
		this.allCheckbox = this.$('#toggle-all')[0]; // check why [0] is used here??
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(app.Todos, 'add', this.addOne);
		this.listenTo(app.Todos, 'reset', this.addAll);

		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		this.listenTo(app.Todos, 'filter', this.filterAll);
		this.listenTo(app.Todos, 'all', this.render);

		app.Todos.fetch();
	},

	// rendering the app by just refreshing the stats
	render : function() {
		var completed = app.Todos.completed().length;
		var remaining = app.Todos.remaining().length;

		if(app.Todos.length) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/]' + (app.TodoFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.allCheckbox.checked = !remaining;
		
	},

	// add a single todo item to a list by
	// creating its view and 
	// appending element to the <ul>.

	addOne : function(todo) {
		var view = new app.TodoView({model : todo});
		
		$('#todo-list').append(view.render().el); // understand this line??
	},

	addAll : function() {
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this);
	},

	filterOne : function(todo) {
		todo.trigger('visible');
	},

	filterAll : function() {
		app.Todos.each(this.filterOne, this);
	},

	// Generate the attributes for a new todo item
	newAttributes : function() {
		return {
			title : this.$input.val().trim(),
			order : app.Todos.nextOrder(),
			completed : false
		};
	},

	createOnEnter : function(event) {
		if(event.which !== ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		app.Todos.create(this.newAttributes());
		this.$input.val('');
	},

	// clear all completed todo items, destroying their models
	clearCompleted : function() {
		_.invoke(app.Todos.completed(), 'destroy');
		return false;
	},

	toggleAllComplete : function() {
		var completed = this.allCheckbox.checked;

		app.Todos.each(function(todo) {
			todo.save({
				completed : completed
			});
		});
	}

});
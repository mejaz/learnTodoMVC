
var app = app || {};

// todo item view
// --------------

// The DOM element for a Todo View

app.TodoView = Backbone.View.extend({
	// is a list tag
	tagName : 'li',

	// cache the temlate function for a single item
	template : _.template($('#item-template').html()),

	// DOM events specific to an item
	events : {
		'click .toggle' : 'togglecompleted',
		'dblclick label' : 'edit',
		'click .destroy' : 'clear',
		'keypress .edit' : 'updateOnEnter',
		'blur .edit' : 'close'
	},

	initialize : function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	// re-renders the title of the todo item
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.toggleClass('completed', this.model.get('completed'));
		this.toggleVisible();

		this.$input = this.$('.edit');
		return this;
	},

	// toggle visibility of an item
	toggleVisible : function() {
		this.$el.toggleClass('hidden', this.isHidden());
	},

	// determines if the item should be hidden
	isHidden : function() {
		var isCompleted = this.model.get('completed');
		return(
			(!isCompleted && app.TodoFilter === 'completed')
				|| (isCompleted && app.TodoFilter === 'active')
			);
	},

	togglecompleted : function() {
		this.model.toggle();
	},

	// switch the view into editing mode
	edit : function() {
		this.$el.addClass('editing');
		this.$input.focus();
	},

	// close the editing mode, saving changes to the todo
	close : function() {
		var value = this.$input.val().trim();

		if(value) {
			this.model.save({title : value});
		}

		this.$el.removeClass('editing');
	},

	// hit Enter and we are through editing the item
	updateOnEnter : function(e) {
		if(e.which === ENTER_KEY) {
			this.close();
		}
	},

	// remove the item, destroy the model from the local storage and delete the view
	clear : function() {
		this.model.destroy();
	}
});

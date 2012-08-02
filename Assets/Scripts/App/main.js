requirejs.config({
    shim: {
        '../Utils/backbone': {
            deps: ['../Utils/lodash', '../Utils/jquery'], // load dependencies
            exports: 'Backbone' // use the global 'Backbone' as the module value
        }
    }
});

require(['../Utils/backbone', '../Utils/guid'], function(){
    
    var Contact = Backbone.Model.extend({
        // Built-in object
        defaults: {
            name: 'No name provided',
            age: 0,
            address: 'No address provided'
        },
        
        // Built-in method
        initialize: function(){
            this.on('change:age', function(){
                console.log(this.get('name') + '\'s age changed to ' + this.get('age'));
            });
            
            this.on('error', function (model, error) {
                console.warn('Error:', model, error);
            });
        },
        
        // Built-in method
        validate: function (attributes) {
            if (!attributes.id || attributes.id <= 0) {
                return 'An error has occurred? There should be an id generated!';
            }
            
            if (typeof attributes.age != 'number') {
                return 'Age needs to be a number';
            }
        },
        
        birthday: function(){
            var age = this.get('age');
            this.set({ 'age': ++age });
        }
    });
    
    var manager = new Contact({
        id: Math.guid(),
        name: 'Mark McDonnell',
        age: 30
    });
    
    var developer = new Contact({
        id: Math.guid(),
        name: 'Ashley Banks',
        age: 23
    });
    
    // Following few lines were just to demonstrate API
    var dev_name = developer.get('name');
    var dev_age = developer.get('age');
        
    developer.birthday();
    
    console.log(manager.toJSON(), developer.toJSON()); // gives you object of specified Model
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    // We set-up a collection of Contact Models
    // This is so we can manipulate a group of (the same) Models more easily
    var Contacts = Backbone.Collection.extend({
        // Built-in property
        model: Contact,
        
        // Built-in method
        initialize: function(){
            this.on('add', this.model_added, this);
        },
        
        model_added: function (model) {
            // The View listens out for 'model:added'
            // Once it hears it, it updates the <select> menu to include the latest Model
            // We pass the latest Model through from here...
            this.trigger('model:added', model);
        },
        
        // Can't trigger custom event within 'initialize' because the View listener wont be ready/set-up yet!
        // So have to stick it inside a separate method which I call after I set-up the associated View
        populate: function(){
            this.trigger('contacts:populate');
        }
    });
    
    // We'll initialize the Collection with a couple of Models
    var contacts = new Contacts([manager, developer]);
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var ContactsView = Backbone.View.extend({
        // Built-in method
        initialize: function(){
            this.select = this.$el.find('select');
            this.collection.on('contacts:populate', this.populate, this);
            this.collection.on('model:added', this.update, this);
        },
        
        // Built-in 'events' management only applies to DOM elements (as this is a 'View' after all)
        // other custom events triggered are handled via 'this.on' within the initialize method 
        // because of this we have to use 'this.on' within a 'Collection'
        events: {
            'change select': 'display_selected'
        },
        
        populate: function(){
            var select = this.select; // scope of this changes within 'each' (refers to same thing as the 'model' argument)
            var option;
            
            this.collection.each(function(model){
                option = '<option value="' + model.cid + '">' + model.attributes.name + '</option>';
                select.append(option);
            }, this);
        },
        
        display_selected: function (event) {
            var targ = event.target;
            var selected_option = targ.options[targ.selectedIndex];
            var model = this.collection.getByCid(selected_option.value);
            contact_view.render(model);
        },
        
        // 'model' is passed through from Collection
        update: function (model) {
            var select = this.$el.find('select');
            var option = '<option value="' + model.cid + '">' + model.attributes.name + '</option>';
            select.append(option);
        }
    });
    
    var contacts_view = new ContactsView({
        el: $('#view-contacts'),
        collection: contacts // pass in the Collection into this View
    });
    
    // To be honest I probably could have just manually called 'this.collection.populate()' from within the ContactsView's initilize method.
    // I'll likely ask a Backbone expert to review this code and see what they suggest is the better practice.
    contacts.populate();
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var AddContactView = Backbone.View.extend({
        // Built-in object for handling DOM events
        events: {
            'click input[type=submit]': 'add_contact'
        },
        
        add_contact: function (e) {
            e.preventDefault(); // prevent form from submitting
            
            var message = document.getElementById('message-success');
            var errors = [];
            var fullname = this.el.fullname.value;
            var age = this.el.age.value;
            var address = this.el.address.value;
            var contact;
    		
    		// This regex tests for a first name with at least two characters, 
    		// followed by an optional middle name with at least two characters (we use a non-capturing group to save the regex engine some work), 
    		// followed by the last name with at least two characters.
    		// This regex allows the first-middle name (and the middle-last) to be joined by a hypen (e.g. Georges St-Pierre or Georges-St Pierre)
    		if (!/[\w-]{2,}(?:\s\w{2,})?[\s-]\w{2,}/.test(fullname)) {
    			errors.push('Name was invalid');
    		} 
    		
    		// We allow ages from 1-999
    		if (!/\d{1,3}/.test(age)) {
    			errors.push('Age was invalid (should be numeric value only)');
    		}
    		
    		if (!address.length) {
        		// Provide a default for the address (mainly because it's awkward to validate this type of field)
    			address = 'No address provided';
    		}
    		
    		// If there are any errors then we can't proceed
    		if (errors.length) {
    			// If the success message (from a previous successful record added) is still visible
    			// then remove it to save from confusing the user.
    			var success;
    			if (success = document.getElementById('message-success')) {
        			this.el.removeChild(success); // this.el provided by Backbone
    			}
    			
    			// Display errors
    			alert(errors.join('\n'));
    		} else {
    			// There should be an AJAX function to post data to server-side script (for storing in db)
    			// Backbone.Model.save() might be a built-in handler for this, I'm not sure yet?
    			
    			// Create a new Model
    			contact = new Contact({
        			id: Math.guid(),
                    name: fullname,
                    age: +age, // ensure data is an Integer
                    address: address
                });
    			
    			// Add the new Model into the Contacts Collection
    			// This should trigger an 'add' event which means the record is inserted into the <select>
                this.collection.add(contact);
    			
    			// Display success message and reset the form
    			this.el.reset(); // this.el provided by Backbone
    			
    			// Don't want to see a massive long list of 'Record added successfully!' messages
    			// So if one is already there then just remove it first
    			if (message) {
        			message.parentNode.removeChild(message);
    			}
    			
    			// Create an element to hold our success message
    			var doc = document;
    			var div = doc.createElement('div');
    			var txt = doc.createTextNode('Record added successfully!');
    			
    			div.id = 'message-success';
    				
    			div.appendChild(txt);
    			this.el.appendChild(div); // this.el provided by Backbone
    		}
        }
    });
    
    var add_contact = new AddContactView({
        el: $('#view-add'),
        collection: contacts // pass in the Collection into this View
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var ContactView = Backbone.View.extend({
        // Built-in method
        initialize: function(){
            // No need to render content initially - although I can if I wanted
            //this.render();
        },
        
        render: function (model) {
            var model = model || this.collection.models[0];
            var attributes = model.attributes;
            var template = $('#contact_template');
            var compile = _.template(template.html(), {
                id: attributes.id,
                name: attributes.name,
                age: attributes.age,
                address: attributes.address
            });
            
            // this.el refers to HTML elements
            // this.$el refers to the jQuery instance you created and passed through
            // this.el.innerHTML = compile would work all the same as the following...
            this.$el.html(compile);
        }
    });
    
    var contact_view = new ContactView({
        el: $('#view-contact'),
        collection: contacts
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    function create_models (data) {
        var json = JSON.parse(data);
        var len = json.length;
        var model;
        
        while (len--) {
            model = new Contact({
                id: Math.guid(),
                name: json[len].name,
                age: json[len].age
            });
            
            // The 'contacts' object is our Backbone.Collection.
            // We call the built-in Backbone 'add' method to trigger a custom event to fire (which updates the View)
            contacts.add(model);
        }
    }
    
    var data = $.ajax({
        url: '/Assets/Includes/Contacts.php',
        success: create_models
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var Routing = Backbone.Router.extend({
        routes: {
            'test': 'test',                 // #test
            'search/:query/:page': 'search' // #search/testing/p7
        },
        
        test: function(){
            console.log('User has accessed this app from /test/');
        },
        
        search: function (query, page) {
            console.log(query, page); // => testing, p7
        }
    });
    
    // Create new instance of our Routing Class
    var routing = new Routing();
    
    // Initialize the Router
    Backbone.history.start();
    
});
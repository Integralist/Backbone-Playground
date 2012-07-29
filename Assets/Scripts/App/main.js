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
        
        // Custom method
        birthday: function(){
            var age = this.get('age');
            this.set({ 'age': ++age });
        }
    });
    
    var manager = new Contact();
    manager.set({
        id: Math.guid(),
        name: 'Mark McDonnell',
        age: 30
    });
    
    var developer = new Contact();
    developer.set({
        id: Math.guid(),
        name: 'Ashley Banks',
        age: 23
    });
    
    var dev_name = developer.get('name');
    var dev_age = developer.get('age');
    
    developer.birthday();
    console.log(developer.toJSON()); // gives you object of 'developer'
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    // We set-up a collection of Contact Models
    // This is so we can manipulate a group of (the same) Models more easily
    var Contacts = Backbone.Collection.extend({
        model: Contact,
        
        initialize: function(){
            this.trigger('init');
            this.on('add', this.model_added, this);
        },
        
        model_added: function (model) {
            // The View listens out for 'model:added'
            // Once it hears it, it updates the <select> menu to include the latest Model
            // We pass the latest Model through from here...
            this.trigger('model:added', model);
        }
    });
    
    // We'll initialize the Collection with a couple of Models
    var contacts = new Contacts([manager, developer]);
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var ContactsView = Backbone.View.extend({
        initialize: function(){
            this.collection.on('init', this.populate, this);
            this.collection.on('model:added', this.update, this);
            console.log('get initial model data and populate the select menu?');
        },
        
        // built-in 'events' management only applies to DOM elements (as this is a 'View' after all)
        // other custom events triggered are handled via 'this.on' within the initialize method 
        // because of this we have to use 'this.on' within a 'Collection'
        events: {
            'change select': 'displaySelected'
        },
        
        populate: function(){
            console.log('populate the <select> with initial Model data');
        },
        
        displaySelected: function (event) {
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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var AddContactView = Backbone.View.extend({
        events: {
            'click input[type=submit]': 'addContact'
        },
        
        addContact: function(e){
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
    			contact = new Contact()
                contact.set({
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
        initialize: function(){
            this.render();
        },
        
        render: function (model) {
            // TODO pull first Model from Collection and display it (instead of manual data as per below example)
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
    
    // DOESNT WORK?
    var Routing = Backbone.Router.extend({
        routes: {
            'test': 'test',
            'search/:query/:page': 'search' // #search/testing/p7
        },
        
        test: function(){
            console.log('User has accessed this app from /test/');
        },
        
        search: function (query, page) {
            console.log(query, page);
        }
    });
    
});
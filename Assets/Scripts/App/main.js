requirejs.config({
    shim: {
        '../Utils/backbone': {
            deps: ['../Utils/lodash', '../Utils/jquery'], // load dependencies
            exports: 'Backbone' // use the global 'Backbone' as the module value
        }
    }
});

require(['../Utils/backbone'], function(){
    
    var Contact = Backbone.Model.extend({
        defaults: {
            name: '? no name given ?',
            age: 0,
            role: 'Grunt'
        },
        
        // Built-in method
        initialize: function(){
            this.bind('change:age', function(){
                console.log(this.get('name') + '\'s age changed to ' + this.get('age'));
            });
            
            this.bind('error', function (model, error) {
                console.warn('Error:', model, error);
            });
        },
        
        // Built-in method
        validate: function (attributes) {
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
    
    var manager = new Contact({
        name: 'Mark McDonnell',
        age: 30,
        role: 'Manager'
    });
    
    var developer = new Contact();
    developer.set({
        name: 'Ashley Banks',
        age: 23,
        role: 'Developer'
    });
    
    var dev_name = developer.get('name');
    var dev_age = developer.get('age');
    
    developer.birthday();
    console.log(developer.toJSON()); // gives you object of 'developer'
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var ContactsView = Backbone.View.extend({
        initialize: function(){
            console.log('get initial model data and populate the select menu?');
        },
        
        events: {
            'change select': 'displaySelected'
        },
        
        displaySelected: function (event) {
            console.log('get model data and display selected user', event);
        }
    });
    
    var contacts_view = new ContactsView({
        el: $('#view-contacts')
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var AddContactView = Backbone.View.extend({
        events: {
            'click input[type=submit]': 'addContact'
        },
        
        addContact: function(e){
            e.preventDefault(); // prevent form from submitting
            
            var errors = [];
            var fullname = this.el.fullname.value;
            var age = this.el.age.value;
            var address = this.el.address.value;
            var obj = {};
    		
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
    			obj.name = fullname;
    			obj.age = age;
    			obj.address = address;
    			obj.id = 123;//Controller.Model.generate_id();
    			
    			// AJAX function to post data to server-side script (for storing in db)
    			// I THINK THE .save() method of Backbone should handle this?
    			
    			// Insert the new record into the Model
    			//Controller.Model.add(obj);
    			
    			// Display success message and reset the form
    			this.el.reset(); // this.el provided by Backbone
    			
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
        el: $('#view-add')
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    var ContactView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        
        render: function(){
            var template = $('#contact_template');
            var compile = _.template(template.html(), {
                name: 'A',
                age: 'B',
                role: 'C'
            });
            
            // this.el refers to HTML elements
            // this.$el refers to the jQuery instance you created and passed through
            // this.el.innerHTML = compile would work all the same as the following...
            this.$el.html(compile);
        }
    });
    
    var contact_view = new ContactView({
        el: $('#view-contact')
    });
    
});
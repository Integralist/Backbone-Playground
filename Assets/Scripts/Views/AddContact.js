define(['../Models/Contact', 'Backbone'], function (Contact) {
    
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
        			id: _.uniqueId(),
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
    
    return AddContactView;
    
});
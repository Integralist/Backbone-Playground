define(['../Models/Contact', 'Backbone'], function (Contact) {
    
    // We set-up a collection of Contact Models
    // This is so we can manipulate a group of (the same) Models more easily
    var Contacts = Backbone.Collection.extend({
        // Built-in property
        model: Contact,
        
        // Built-in property
        url: '/Assets/Includes/Contacts.php',
        
        // Built-in method
        initialize: function(){
            // Collections fire the events 'add' and 'remove'
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
    
    return Contacts;
    
});
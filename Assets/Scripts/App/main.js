requirejs.config({
    shim: {
        '../Utils/backbone': {
            deps: ['../Utils/lodash', '../Utils/jquery'], // load dependencies
            exports: 'Backbone' // use the global 'Backbone' as the module value
        }
    }
});

require(['../Models/Contact', '../Collections/Contacts', '../Views/Contacts', '../Views/AddContact', '../Views/Contact', '../Routes/Routing', '../Utils/backbone'], function (Contact, Contacts, ContactsView, AddContactView, ContactView, Routing) {
    
    /**
     * Model Generation Examples
     */
    
    var manager = new Contact({
        id: _.uniqueId(),
        name: 'Mark McDonnell',
        age: 30
    });
    
    var developer = new Contact({
        id: _.uniqueId(),
        name: 'Ashley Banks',
        age: 23
    });
    
    // Following few lines were just to demonstrate API
    var dev_name = developer.get('name');
    var dev_age = developer.get('age');
        
    developer.birthday();
    
    // toJSON is a built-in Model/Collection method which returns js object of specified Model
    console.dir(manager.toJSON())
    console.dir(developer.toJSON());
    
    
    /**
     * Collection Generation Example
     */
     
    var contacts = new Contacts([manager, developer]);
    
    
    /**
     * View for <select> menu of Contacts
     */
    
    var contacts_view = new ContactsView({
        el: $('#view-contacts'),
        collection: contacts // pass in the Collection into this View
    });
    
    // To be honest I probably could have just manually called 'this.collection.populate()' from within the ContactsView's initilize method.
    // I'll likely ask a Backbone expert to review this code and see what they suggest is the better practice.
    contacts.populate();
    
    
    /**
     * View for <form> to add a new Contact
     */
    
    var add_contact = new AddContactView({
        el: $('#view-add'),
        collection: contacts // pass in the Collection into this View
    });
    
    
    /**
     * View for displaying the selected Contact
     */
    
    // I've had to create a global property so I can access this View's "render()" method from within /Views/Contacts.js
    // Wasn't sure how else to handle that situation?
    // TODO: find better solution than setting a global property!
    var contact_view = window.contact_view = new ContactView({
        el: $('#view-contact'),
        collection: contacts
    });
    
    
    /**
     * Lazy Load Models into Collection
     */
    
    // The following code was how I was lazily loading more Models into my Collection
    // I then discovered (thanks to _aaronackerman_) that there is a built-in method for exactly that called fetch()
    /*
    function create_models (data) {
        var json = JSON.parse(data);
        var len = json.length;
        var model;
        
        while (len--) {
            model = new Contact({
                id: _.uniqueId(),
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
    */
    
    contacts.fetch({
        add: true, // prevent resetting the Collection (instead add Models ontop of current set of Collection Models),
        error: function (collection, resp) {
            console.log('Error: ', collection, resp);
        },
        success: function (collection, resp) {
            console.log('Success: ', collection);
            console.dir(resp);
        }
    });
    
    
    /**
     * Router/History API Examples
     */
    
    // Create new instance of our Routing Class
    var routing = new Routing();
    
    // Initialize the Router
    Backbone.history.start();
    
});
requirejs.config({
    shim: {
        '../Utils/backbone': {
            deps: ['../Utils/lodash', '../Utils/jquery'], // load dependencies
            exports: 'Backbone' // use the global 'Backbone' as the module value
        }
    }
});

/**
 * We load the 'namespace' dependency but it returns nothing so we pass nothing through to the callback function.
 * We only need to load the namespace once at the top level require() call as it sets a global property that is accessible everywhere
 */
require(['../Models/Contact', '../Collections/Contacts', '../Views/Contacts', '../Views/AddContact', '../Views/Contact', '../Routes/Routing', '../Utils/backbone', 'namespace'], function (Contact, Contacts, ContactsView, AddContactView, ContactView, Routing) {
    
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
    
    // The following few lines are used just to demonstrate the Backbone.js API
    var dev_name = developer.get('name');
    var dev_age = developer.get('age');
        
    developer.birthday();
    
    // The .toJSON() method is a built-in Model/Collection method which returns js object of specified Model
    console.dir(manager.toJSON())
    console.dir(developer.toJSON());
    
    
    /**
     * Collection Generation Example
     */
     
    var contacts = new Contacts([manager, developer]);
    
    // The .toJSON() method is a built-in Model/Collection method which returns js object of specified Model
    console.log(contacts.toJSON());
    
    
    /**
     * View for <select> menu of Contacts
     */
    
    var contacts_view = new ContactsView({
        el: $('#view-contacts'),
        collection: contacts // pass in the Collection into this View
    });
    
    
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
    
    // I've had to create a global namespace property so I can access this View's "render()" method from within another View (/Views/Contacts.js)
    // According to people smarter than I (i.e. Addy Osmani from Google) this is the most appropriate solution.
    window.integralist.views.contact = new ContactView({
        el: $('#view-contact'),
        collection: contacts
    });
    
    
    /**
     * Lazy Load Models into Collection
     */
    
    // The following code was how I was originally 'lazy loading' more Models into my Collection.
    // I then discovered (thanks to _aaronackerman_) that there is a built-in method for doing exactly that called fetch()
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
        add: true, // Prevent resetting the Collection (i.e. instead or clearing the Collection first we just add new Models on top of current set of Models),
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
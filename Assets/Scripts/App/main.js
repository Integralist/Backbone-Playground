requirejs.config({
    paths: {
        Backbone: '../Utils/backbone'
    },
    shim: {
        'Backbone': {
            deps: ['../Utils/lodash', '../Utils/jquery'], // load dependencies
            exports: 'Backbone' // use the global 'Backbone' as the module value
        }
    }
});

require(['../Models/Contact', '../Collections/Contacts', '../Views/Contacts', '../Views/AddContact', '../Views/Contact', '../Routes/Routing'], function (Contact, Contacts, ContactsView, AddContactView, ContactView, Routing) {
    
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
        collection: contacts, // pass in the Collection into this View
        
        /**
         * View for displaying the selected Contact
         *
         * Originally I had created a global namespace property so I could access this View's "render()" method from within 'contacts_view' (/Views/Contacts.js)
         * And according to people smarter than I (i.e. Addy Osmani from Google) this was the most appropriate solution.
         * But I since discovered I could pass in additional data when creating a View instance and so that's what I've done here.
         */
         
        associated_view: new ContactView({
            el: $('#view-contact'),
            collection: contacts
        })
    });
    
    
    /**
     * View for <form> to add a new Contact
     */
    
    var add_contact = new AddContactView({
        el: $('#view-add'),
        collection: contacts // pass in the Collection into this View
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
    Backbone.history.start({ pushState: true }); 
    // http://backbone:8888/#search/testing/p7 converts to http://backbone:8888/search/testing/p7
    // http://backbone:8888/#test converts to http://backbone:8888/test
    // Note: Going directly to the URL wont work - the server needs to be set-up to redirect properly.
    // If you go to the hashbang variation then the browser will be redirected to the pushState version (if supported)
    
});
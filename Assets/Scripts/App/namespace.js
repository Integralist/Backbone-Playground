define(function(){
    
    /**
     * Create a global namespace which can be used within other dependancies
     * This does limit the other dependancies somewhat (in the sense that they now require this module)
     */
    window.integralist = window.integralist || {
        models: {},
        views: {},
        collections: {}
    };
    
});
define(['Backbone'], function(){
    
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
    
    return Routing;
    
});
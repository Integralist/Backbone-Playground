define(['../Utils/backbone'], function(){
    
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
    
    return ContactView;
    
});
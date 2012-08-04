define(['../Utils/backbone'], function(){
    
    var Contact = Backbone.Model.extend({
        // Built-in object
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
        
        birthday: function(){
            var age = this.get('age');
            this.set({ 'age': ++age });
        }
    });
    
    return Contact;
    
});
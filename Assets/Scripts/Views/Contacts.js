define(['../Utils/backbone'], function(){
    
    var ContactsView = Backbone.View.extend({
        // Built-in method
        initialize: function(){
            this.select = this.$el.find('select');
            this.collection.on('contacts:populate', this.populate, this);
            this.collection.on('model:added', this.update, this);
            this.collection.populate(); // when this completes it triggers the custom event 'contacts:populate'
        },
        
        // Built-in 'events' management only applies to DOM elements (as this is a 'View' after all)
        // other custom events triggered are handled via 'this.on' within the initialize method 
        // because of this we have to use 'this.on' within a 'Collection'
        events: {
            'change select': 'display_selected'
        },
        
        populate: function(){
            var select = this.select; // scope of this changes within 'each' (refers to same thing as the 'model' argument)
            var option;
            
            this.collection.each(function(model){
                option = '<option value="' + model.cid + '">' + model.attributes.name + '</option>';
                select.append(option);
            }, this);
        },
        
        display_selected: function (event) {
            var targ = event.target;
            var selected_option = targ.options[targ.selectedIndex];
            var model = this.collection.getByCid(selected_option.value);
            window.integralist.views.contact.render(model);
        },
        
        // 'model' is passed through from Collection
        update: function (model) {
            var select = this.$el.find('select');
            var option = '<option value="' + model.cid + '">' + model.attributes.name + '</option>';
            select.append(option);
        }
    });
    
    return ContactsView;
    
});
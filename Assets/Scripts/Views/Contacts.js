define(['Backbone'], function(){
    
    var ContactsView = Backbone.View.extend({
        // Built-in method
        initialize: function (options) {
            this.select = this.$el.find('select');
            this.collection.on('contacts:populate', this.populate, this);
            this.collection.on('model:added', this.update, this);
            this.collection.populate(); // when this completes it triggers the custom event 'contacts:populate'
            this.associated_view = options.associated_view;
        },
        
        // Built-in 'events' management only applies to DOM elements (as this is a 'View' after all)
        // other custom events triggered are handled via 'this.on' within the initialize method 
        // because of this we have to use 'this.on' within a 'Collection'
        events: {
            'change select': 'display_selected'
        },
        
        populate: function(){
            var select = this.select; // scope of this changes within 'each' (refers to same thing as the 'model' argument)
            var frag = '';
            var option;
            
            this.collection.each(function(model){
                option = '<option value="' + model.cid + '">' + model.attributes.name + '</option>';
                frag += option;
            }, this);
            
            // We could of had the 'append' calls within the loop
            // but that would have meant multiple DOM interactions
            select.append(frag);
        },
        
        display_selected: function (event) {
            var targ = event.target;
            var selected_option = targ.options[targ.selectedIndex];
            var model = this.collection.getByCid(selected_option.value);
            
            // We call the 'render' method on the associated View we passed through when creating this View's instance
            this.associated_view.render(model);
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
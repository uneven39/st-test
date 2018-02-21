const Employee = Backbone.Model.extend({
        defaults: {
            name: '',
            position: '',
            age: '',
            gender: ''
        },
        idAttribute: 'id',
        urlRoot: '/employees/',
        validate: function(attrs) {
            let errors = [];
            if (!attrs.name) {
                errors.push({
                    attr: 'name',
                    msg: 'Укажите имя сотрудника'
                });
            }
            if (!attrs.position) {
                errors.push({
                    attr: 'position',
                    msg: 'Укажите должность сотрудника'
                });
            }
            if (attrs.age && attrs.age < 18) {
                errors.push({
                    attr: 'age',
                    msg: 'Укажите корректный возраст'
                });
            }
            if (errors.length)
                return errors;
    }}),
    EmployeeCollection = Backbone.Collection.extend({
        model: Employee,
        url: location.href + 'employees/',
        parse : function(response){
            return response.data;
        }
    });

module.exports = {
    model: Employee,
    collection: EmployeeCollection
};
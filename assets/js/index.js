import '../scss/styles.scss';

const gridSetup = require('./gridSetup'),
    Employee = require('./employeeEntities').model,
    EmployeeCollection = require('./employeeEntities').collection;

let app = {};

window.app = app;

// employee model
app.Employee = Employee;

app.EmployeeList = EmployeeCollection;

app.EmployeeView = Backbone.View.extend({

    events: {
        'change input': 'updateModel',
        'change select': 'updateModel',
        'click #saveEmployee': 'saveEmployee',
        'click #deleteEmployee': 'deleteEmployee'
    },
    
    initialize: function(){
        this.listenTo(this.model, 'invalid', this.errorHandler);
        // Добавляем как child к ноде-родителю; при удалении представления, родитель остается
        $(this.render().el).appendTo('#editEmployee');
    },

    render: function() {
        let attrs = this.model.toJSON(),
            content = this.template(attrs);
        this.$el.html(content);
        return this;
    },

    saveEmployee: function () {
        app.curEmployee.save(null, {
            success: function() {
                $('#editEmployeeModal').modal('hide');
                // Обновляем коллекцию (и таблицу)
                app.employeesList.fetch({reset: true});
            },
            error: function () {
                $('#editEmployeeModal').modal('hide');
                // Обновляем коллекцию (и таблицу)
                app.employeesList.fetch({reset: true});
            }
        });
    },

    deleteEmployee: function () {
        app.curEmployee.destroy({
            success: function () {
                $('#editEmployeeModal').modal('hide');
                // Обновляем коллекцию (и таблицу)
                app.employeesList.fetch({reset: true});
            },
            error: function () {
                $('#editEmployeeModal').modal('hide');
                // Обновляем коллекцию (и таблицу)
                app.employeesList.fetch({reset: true});
            }
        });
    },

    updateModel: function (evt) {
        let input = evt.currentTarget,
            value = $(input).val(),
            attrs = {};

        attrs[input.name] = value;
        this.model.set(attrs);
    },

    errorHandler: function (model) {
        clearErrors();
        let errors = model.validationError;
        for (let i = 0; i < errors.length; i++) {
            let error = errors[i];
            this.$el.find('input[name=' + error.attr + ']')
                .next('.error-msg').text(error.msg).removeClass('hidden');
        }

        function clearErrors() {
            $('#editEmployeeModal').find('.error-msg').each(function () {
                $(this).addClass('hidden').text('');
            })
        }
    },

    template: _.template($('#employeeForm-template').html()),

});

app.employeesList = new app.EmployeeList();

let {grid, nameFilter} = gridSetup(app);

app.employeesList.fetch({reset: true});

$('#employeesGrid').append(grid.render().el);

$("#name-filter").prepend(nameFilter.render().el);

$('#createEmployee').on('click', function () {
    app.curEmployee = new app.Employee();
    app.curEmployeeView = new app.EmployeeView({model: app.curEmployee});
    app.curEmployeeView.render()
});

$('#editEmployeeModal').on('hide.bs.modal', function(){
    app.curEmployeeView.remove();
});
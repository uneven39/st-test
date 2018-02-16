import '../scss/styles.scss';

// import Backgrid from 'backgrid/lib/backgrid';
import 'backgrid-filter/backgrid-filter';

const gridSetup = require('./gridSetup');

let app = {};

window.app = app;

// employee model
app.Employee = Backbone.Model.extend({
    defaults: {
        name: '',
        position: '',
        age: 18,
        gender: 'm'
    },
    initialize: function(){
        this.on('invalid', function(model,errors){
            clearErrors();
            for (let i = 0; i < errors.length; i++) {
                let error = errors[i];
                $('#editEmployeeModal').find('input[name=' + error.attr + ']')
                    .next('.error-msg').text(error.msg).removeClass('hidden');
            }
        });
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
    }
});

app.curEmployee = new app.Employee();

app.EmployeeList = Backbone.Collection.extend({
    model: app.Employee,
    url: location.href + 'employees/',
    parse : function(response){
        return response.data;
    }
});

app.employeesList = new app.EmployeeList();

let {grid, nameFilter} = gridSetup(app.employeesList);

app.employeesList.fetch({reset: true});

$('#employeesGrid')
    .append(grid.render().el)
    .on('click', '.edit-item', function() {
        let self = this;

        app.curEmployee.set({id: self.dataset.id});

        app.curEmployee.fetch({
            success: function (res) {
                $('#editEmployeeModal').modal('show', self);
                // Запоминаем данные выбранного сотрудника по id
                app.curEmployee.set(res.attributes.data);
                fillForm(app.curEmployee, $('#employeeAttrsForm'));
            }
        })
    });

$("#name-filter").prepend(nameFilter.render().el);

$('#editEmployeeModal')
    .on('show.bs.modal', function(){
        if (!app.curEmployee.id) {
            // Открыли модал для создания
            // Очищаем форму
            $('#employeeAttrsForm')[0].reset();
            app.curEmployee = new app.Employee();
        }
    })
    .on('hide.bs.modal', function(){
        clearErrors();
        app.curEmployee = new app.Employee();
    })
    .on('click', '#saveEmployee', function() {
        let attrs = {};
        // Получаем значения свойств
        $('#employeeAttrsForm').find(':input').each(function(){
            const $input = $(this);
            attrs[$input.prop('name')] = $input.val();
        });

        app.curEmployee.set(attrs);

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
                alert('Возникла ошибка при заведении записи');
            }
        });
    })
    .on('click', '#deleteEmployee', function() {
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
                alert('Возникла ошибка при удалении записи');
            }
        });
    });

function fillForm(employee, $form) {
    for (const attr in employee.attributes) {
        if (employee.attributes.hasOwnProperty(attr)) {
            $form.find(':input[name=' + attr + ']').val(employee.attributes[attr]);
        }
    }
}

function clearErrors() {
    $('#editEmployeeModal').find('.error-msg').each(function () {
        $(this).addClass('hidden').text('');
    })
}
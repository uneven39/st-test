import '../scss/styles.scss';

import Backgrid from 'backgrid/lib/backgrid';
import 'backgrid-filter/backgrid-filter';

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
    idAttribute: 'id',
    urlRoot: '/employees/'
});

app.EmployeeList = Backbone.Collection.extend({
    model: app.Employee,
    // url: '/employees',
    url: location.href + 'employees/',
    parse : function(response){
        return response.data;
    }
});

app.employeesList = new app.EmployeeList();

const columns = [
    {
        name: 'name',
        label: 'Имя',
        editable: false,
        cell: 'string'
    },
    {
        name: 'gender',
        label: 'Пол',
        editable: false,
        cell: Backgrid.Cell.extend({
            render: function () {
                if (this.model.attributes['gender'] === 'm') {
                    this.$el.html('мужчина');
                } else if (this.model.attributes['gender'] === 'f') {
                    this.$el.html('женщина');
                }
                return this;
            }
        })
    },
    {
        name: 'age',
        label: 'Возраст',
        editable: false,
        cell: Backgrid.IntegerCell.extend({
            orderSeparator: ''
        })
    },
    {
        name: 'position',
        label: 'Должность',
        editable: false,
        cell: 'string'
    },
    {
        name: '',
        label: '',
        editable: false,
        cell: Backgrid.Cell.extend({
            render: function () {
                const html = '<button class="edit-item" data-action="update" data-id="' + this.model.attributes['id'] + '">' +
                    '<span class="glyphicon glyphicon-edit"></span></button>';
                this.$el.html(html);
                return this;
            }
        })
    }
    ];

let grid = new Backgrid.Grid({
    className: 'employees-grid',
    columns: columns,
    collection: app.employeesList
});

$('#employeesGrid')
    .append(grid.render().el)
    .on('click', '.edit-item', function() {
        let self = this;

        app.curEmployee = new app.Employee({id: self.dataset.id});

        app.curEmployee.fetch({
            success: function (res) {
                $('#editEmployeeModal').modal('show', self);
                // Запоминаем данные выбранного сотрудника по id
                app.curEmployee = new app.Employee(res.attributes.data);
                fillForm(app.curEmployee, $('#employeeAttrsForm'));
            }
        })
    });

let clientSideFilter = new Backgrid.Extension.ClientSideFilter({
    className: 'employees-search',
    collection: app.employeesList,
    fields: ['name'],
    placeholder: 'Введите имя для поиска',
    wait: 150
});

$("#name-filter").prepend(clientSideFilter.render().el);

app.employeesList.fetch({reset: true});

$('#editEmployeeModal')
    .on('show.bs.modal', function(e){
        const invokerEl = e.relatedTarget;
        if (invokerEl.dataset.action) {
            this.setAttribute('data-action', invokerEl.dataset.action);
            if (this.dataset.action === 'create') {
                // Открыли модал для создания
                // Очищаем форму
                $('#employeeAttrsForm')[0].reset();
            }
        }
    })
    .on('click', '#saveEmployee', function() {
        let attrs = {};
        const action = $('#editEmployeeModal').data('action');
        // Получаем значения свойств
        $('#employeeAttrsForm').find(':input').each(function(){
            const $input = $(this);
            attrs[$input.prop('name')] = $input.val();
        });
        if (action === 'create') {
            // При создании сохраняем нового работника
            app.curEmployee = new app.Employee();
            app.curEmployee.set(attrs);
            // Сохраняем сотрудника на сервере
            app.curEmployee.save(null, {
                success: function() {
                    $('#editEmployeeModal').modal('hide');
                    // Обновляем коллекцию (и таблицу)
                    app.employeesList.fetch({reset: true});
                    app.curEmployee = null;
                },
                error: function () {
                    $('#editEmployeeModal').modal('hide');
                    // Обновляем коллекцию (и таблицу)
                    app.employeesList.fetch({reset: true});
                    alert('Возникла ошибка при заведении записи');
                    app.curEmployee = null;
                }}
                );
        } else if (action === 'update') {
            // Обновление данных сотрудника
            app.curEmployee.fetch({
                success: function (res) {
                    res.set(attrs)
                        .save(null, {
                            success: function () {
                                $('#editEmployeeModal').modal('hide');
                                // Обновляем коллекцию (и таблицу)
                                app.employeesList.fetch({reset: true});
                                app.curEmployee = null;
                            },
                            error: function () {
                                $('#editEmployeeModal').modal('hide');
                                // Обновляем коллекцию (и таблицу)
                                app.employeesList.fetch({reset: true});
                                alert('Возникла ошибка при заведении записи');
                                app.curEmployee = null;
                            }
                        });
                }
            });
        }
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
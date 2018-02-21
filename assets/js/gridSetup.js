import Backgrid from "backgrid";
import 'backgrid-filter/backgrid-filter';

function setup(app) {
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
            cell: 'string'
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
                events: {
                    'click .edit-item': 'openModal'
                },

                render: function () {
                    const html = '<button class="edit-item" data-id="' + this.model.attributes['id'] + '">' +
                        '<span class="glyphicon glyphicon-edit"></span></button>';
                    this.$el.html(html);
                    return this;
                },

                openModal: function () {
                    let self = this;

                    app.curEmployee = new app.Employee();

                    app.curEmployee.set({id: self.model.attributes.id});

                    app.curEmployee.fetch({
                        success: function (res) {
                            $('#editEmployeeModal').modal('show', self);
                            // Запоминаем данные выбранного сотрудника по id
                            app.curEmployee.set(res.attributes.data);
                            app.curEmployeeView = new app.EmployeeView({model: app.curEmployee});
                        }
                    });


                }
            })
        }
    ];

    let grid = new Backgrid.Grid({
            className: 'employees-grid',
            columns: columns,
            collection: app.employeesList
        }),
        nameFilter = new Backgrid.Extension.ClientSideFilter({
            className: 'employees-search',
            collection: app.employeesList,
            fields: ['name'],
            placeholder: 'Введите имя для поиска',
            wait: 150
        });

    return {grid, nameFilter};

}


module.exports = setup;
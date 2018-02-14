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
    }
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

console.log(app.employeesList.url);

const columns = [
    {
        name: "name",
        label: "Имя",
        editable: false,
        cell: "string"
    },
    {
        name: "gender",
        label: "Пол",
        editable: false,
        cell: "string"
    },
    {
        name: "age",
        label: "Возраст",
        editable: false,
        cell: Backgrid.IntegerCell.extend({
            orderSeparator: ''
        })
    },
    {
        name: "position",
        label: "Должность",
        editable: false,
        cell: 'string'
    },
    {
        name: '',
        label: '',
        editable: false,
        cell: Backgrid.Cell.extend({
            render: function () {
                const html = '<button class="edit-item" data-name="' + this.model.attributes['name'] + '">' +
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

$('#employeesGrid').append(grid.render().el);

let clientSideFilter = new Backgrid.Extension.ClientSideFilter({
    className: 'employees-search',
    collection: app.employeesList,
    fields: ['name'],
    placeholder: 'Введите имя для поиска',
    wait: 150
});

$("#name-filter").prepend(clientSideFilter.render().el);

app.employeesList.fetch({reset: true});

$('#employeesGrid').on('click', '.edit-item', function() {
    $('#editEmployeeModal').modal('show');
});

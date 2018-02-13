import '../scss/styles.scss';

const app = {};

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
    url: '/employees'
});

app.employeesList = new app.EmployeeList();
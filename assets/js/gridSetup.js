import Backgrid from "backgrid";

function setup(collection) {
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
                render: function () {
                    const html = '<button class="edit-item" data-id="' + this.model.attributes['id'] + '">' +
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
            collection: collection
        }),
        nameFilter = new Backgrid.Extension.ClientSideFilter({
            className: 'employees-search',
            collection: collection,
            fields: ['name'],
            placeholder: 'Введите имя для поиска',
            wait: 150
        });

    return {grid, nameFilter};

}


module.exports = setup;
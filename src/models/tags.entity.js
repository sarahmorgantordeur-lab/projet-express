const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "Tag",
    tableName: "tags",
    columns: {
    id: { 
        primary: true,
        type: 'int',
        generated: true },
    label: { type : 'varchar' },
    },
    relations: { 
        todos: {
            type: "many-to-many",
            target : "Todo",
            inverseSide: "tags",
            joinTable: true
        },
    },
});
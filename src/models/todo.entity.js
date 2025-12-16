const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "Todo",
    tableName: "todos",
    columns: {
    id: { primary: true,
        type : 'int',
        generated: true },
    title: { type : 'varchar' },
    completed: {
        type: "boolean" }
    }
});
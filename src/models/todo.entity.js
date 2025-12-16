const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
    name: "Todo",
    tableName: "todos",
    columns: {
    id: { 
        primary: true,
        type: 'int',
        generated: true },
    title: { type : 'varchar' },
    completed: { 
        type: "boolean", 
        default: false}
    },
    relations: { 
        user: {
            type: "many-to-one",
            target : "User",
            joinColumn: true,
            inverseSide: "todos",
        },
        tags: {
            type: "many-to-many",
            target: "Tag",
            inverseSide: "todos",
        }
    },
});
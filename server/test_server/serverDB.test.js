var database = require("../serverDB.js")



test('adds 1 + 2 to equal 3', () => {
    expect(database.sum(1, 2)).toBe(3);
});



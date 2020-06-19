var database = require("../serverDB.js")



test('adds 1 + 2 to equal 3', () => {
    expect(database.sum(1, 2)).toBe(3);
});



test('login test', async () => {
    const data = await database.getUser("jake")
    
    expect(data).toHaveProperty("ACCESS_TOEKN")
})

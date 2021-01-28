const { insert, init, SQLConfig, select, createExpr, createExprs } = require('./orm')

class Repo {
    id
    name
    number
    link
    user
}

class User {
    id
    name
    password
}

function testMSQLInsert() {
    init('mysql', new SQLConfig('localhost', 'root', 'louis1411', 'orm', 3306))
    let repo = new Repo()
    repo.name = 'Test'
    repo.link = 'https://localhost'
    repo.number = 123
    let user = new User()
    user.name = 'User'
    user.password = 'Nothing big'
    repo.user = user

    insert(repo)
}

function testMSQLSelect() {
    init('mysql', new SQLConfig('localhost', 'root', 'louis1411', 'orm', 3306))
    let obj = select('Repo', createExprs(), 10)    
}

//testMSQLInsert()
testMSQLSelect()
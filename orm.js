

class SQLConfig {
    constructor(host, user, password, database, port) {
        this.host = host
        this.user = user
        this.password = password
        this.database = database
        this.port = port
    }
}

var wrapper

function init(sql, config) {
    switch (sql) {
        case 'mysql':
            const mysql = require('./wrapper/mysql')
            wrapper = mysql
            wrapper.init(config)
            break
        default:
            break
    }
}

function insert(obj) {
    if (typeof obj != 'object') {
        console.error('Only objects can be inserted')
        return -1
    }
    let t_name = obj.constructor.name
    let query = 'INSERT INTO ' + t_name + ' '
    let add = new Array()
    let values = new Array()
    let fields = Object.getOwnPropertyNames(obj)
    let declaredFields = new Map()
    if (!fields.includes('id')) {
        console.error('Object needs a id field')
        return -1
    }
    fields.forEach((val) => {
        if (obj[val] != undefined && obj[val] != null) {
            declaredFields.set(val, obj[val])
        }
    })
    declaredFields.forEach((val, key) => {
        switch (typeof val) {
            case 'string':
                add.push(`${key}`)
                values.push(`"${val}"`)
                break
            case 'number':
                add.push(`${key}`)
                values.push(`${val}`)
                break
            case 'object':
                let name = val.constructor.name
                add.push(`${name}_${key}_id`)
                let id = insert(val)
                values.push(`${id}`)
                break
            default:
                // Error
                break
        }
    })
    query += '(' + add.join(',') + ') VALUES (' + values.join(',') + ');'
    console.log(query)
    let res = wrapper.query(query)
    return res.insertId
}

function select(type, exprs, limit = -1) {
    if (typeof type != 'string') {
        console.error('Type has to be a string')
        return -1
    }
    let res = new Array()
    let query = 'SELECT * FROM ' + type + ' WHERE ' + exprs.join(' AND ')
    if (limit > 0) {
        query += ' LIMIT ' + limit
    }
    query += ';'
    let resSQL = wrapper.query(query)
    resSQL.forEach((r) => {
        let t = {}
        Object.getOwnPropertyNames(r).forEach(n => {
            if (!n.endsWith('_id')) {
                t[n] = r[n]
                return
            }
            let args = n.split('_')
            let obj_name = args[0]
            let var_name = args.slice(1).join('_')
            var_name = var_name.substr(0, var_name.length - 3)
            let data = select(obj_name, createExprs(createExpr('id', '=', r[n])))
            t[n] = data
        })
        res.push(t)
    })
    return res
}

function createExprs(...expr) {
    return expr
}

function createExpr(left, middle, right) {
    return `${left} ${middle} ${right}`
}

module.exports = { SQLConfig, init, insert, select, createExpr, createExprs }
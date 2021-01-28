const MySQL = require('sync-mysql')

module.exports = {
    init: function(cfg) {
        this.mysql = new MySQL({
            host: cfg.host,
            user: cfg.user,
            password: cfg.password,
            database: cfg.database
        })
    },

    query: function(query) {
        res = this.mysql.query(query)
        return res
    }
}
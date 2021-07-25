const express = require('express')
const faker = require('faker')
const mysql = require('mysql')

const app = express()
const port = 3000
const dbConnConfig = {
  host: 'database',
  user: 'root',
  password: process.env.DB_ROOT_PASSWORD,
  database: 'nodeapp'
}
const tableName = 'people'

const createTableIfNotExists = () => {
  return new Promise((resolve, reject) => {
    dbConn.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id int(11) NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, PRIMARY KEY (id)) ENGINE=MyISAM DEFAULT CHARSET=utf8;`, (err, results, fields) => {
      if (err) {
        console.log(err)
      }
      resolve()
    })
  })
}

const storeName = (name) => {
  return new Promise((resolve, reject) => {
    dbConn.query(`INSERT INTO ${tableName}(name) VALUES (?);`, [name], (err, results, fields) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`Name stored: ${name}`)
      }
      resolve()
    })
  });
}

const getStoredNames = (callback) => {
  return new Promise((resolve, reject) => {
    dbConn.query(`SELECT name FROM ${tableName}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        resolve([])
      } else {
        resolve(results.map((row) => {
          return row.name;
        }))
      }
    })
  })
}

const buildNameList = (names) => {
  return '<ul>' +  names.map((name) => `<li>${name}</li>`).join('') + '</ul>' 
}

const dbConn = mysql.createConnection(dbConnConfig)

dbConn.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  createTableIfNotExists().then(() => {
    app.get('/', (req, res) => {
      storeName(faker.name.findName()).then(() => {
        getStoredNames().then((names) => {
          res.send('<h1>Full Cycle Rocks!</h1>' + buildNameList(names))
        })
      })
    })
    
    app.listen(port, () => {
      console.log(`App running: http://127.0.0.1:${port}`)
    })
  })
})

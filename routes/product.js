const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

const connection = mysql.createConnection({
    host: 'public_ip_sql_instance_PeduliPangan',
    user: 'root',
    database: 'nama_database_PeduliPangan',
    password: 'password_sql_PeduliPangan'
})

router.get("/discover", (req, res) => {
    const query = "select (select count(*) from products where month(products.date) = month(now()) AND year(products.date) = year(now())) as month_products, (select sum(price) from products) as total_price;"
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.json(rows)
        }
    })
})

router.get("/getproducts", (req, res) => {
    const query = "SELECT * FROM products"
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.json(rows)
        }
    })
})

router.get("/getlast10products", (req, res) => {
    const query = "SELECT * FROM products ORDER BY date DESC LIMIT 10"
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.json(rows)
        }
    })
})

router.get("/getproduct/:id", (req, res) => {
    const id = req.params.id

    const query = "SELECT * FROM products WHERE id = ?"
    connection.query(query, [id], (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.json(rows)
        }
    })
})

router.get("/searchproducts", (req, res) => {
    const s = req.query.s;

    console.log(s)
    const query = "SELECT * FROM products WHERE name LIKE '%" + s + "%' or detail LIKE '%" + s + "%'"
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.json(rows)
        }
    })
})

router.post("/insertproduct", multer.single('attachment'), imgUpload.uploadToGcs, (req, res) => {
    const name = req.body.name
    const price = req.body.price
    const date = req.body.date
    const detail = req.body.detail
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    var imageUrl = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        imageUrl = req.file.cloudStoragePublicUrl
    }

    const query = "INSERT INTO products (name, price, date, detail, latitude, longitude, attachment) values (?, ?, ?, ?, ?, ?, ?)"

    connection.query(query, [name, price, date, detail, latitude, longitude, imageUrl], (err, rows, fields) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.send({message: "Insert Successful"})
        }
    })
})

router.put("/editproduct/:id", multer.single('attachment'), imgUpload.uploadToGcs, (req, res) => {
    const id = req.params.id
    const name = req.body.name
    const price = req.body.price
    const date = req.body.date
    const detail = req.body.detail
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    var imageUrl = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        imageUrl = req.file.cloudStoragePublicUrl
    }

    const query = "UPDATE products SET name = ?, price = ?, date = ?, detail = ?, latitude = ?, longitude = ?, attachment = ? WHERE id = ?"
    
    connection.query(query, [name, price, date, detail, latitude, longitude, imageUrl, id], (err, rows, fields) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.send({message: "Update Successful"})
        }
    })
})

router.delete("/deleteproduct/:id", (req, res) => {
    const id = req.params.id
    
    const query = "DELETE FROM products WHERE id = ?"
    connection.query(query, [id], (err, rows, fields) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.send({message: "Delete successful"})
        }
    })
})

router.post("/uploadImage", multer.single('image'), imgUpload.uploadToGcs, (req, res, next) => {
    const data = req.body
    if (req.file && req.file.cloudStoragePublicUrl) {
        data.imageUrl = req.file.cloudStoragePublicUrl
    }

    res.send(data)
})

module.exports = router

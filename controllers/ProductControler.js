"use strict";
const util = require("util");
const db = require("../database/db");
const mysql = require("mysql2");
const productController = {
    get: (req, res) => {
        let sql = "SELECT * FROM product";
        db.query(sql, (err, response) => {
            if (err) throw err;
            res.json(response);
        });
    },
    detail: (req, res) => {
        let sql = "SELECT * FROM product WHERE id = ?";
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err;
            res.json(response[0]);
        });
    },
    store: (req, res) => {
        let data = req.body;
        let sql = "INSERT INTO product SET ?";
        db.query(sql, [data], (err, response) => {
            if (err) throw err;
            res.json({ message: "Insert success!" });
        });
    },
    delete: (req, res) => {
        let sql = "DELETE FROM product WHERE id = ?";
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err;
            res.json({ message: "Delete success!" });
        });
    },
    update: (req, res) => {
        let data = req.body;
        let id = req.params.id;
        let sql = "UPDATE product SET ? WHERE id = ?";
        db.query(sql, [data, id], (err, response) => {
            if (err) throw err;
            res.json({ message: "Update success!" });
        });
    },
};
module.exports = productController;
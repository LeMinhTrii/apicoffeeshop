"use strict";
const util = require("util");
const db = require("../database/db");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
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
    if (req.files == null)
      return res.status(400).json({ msg: "No File Uploaded" });
    const { name, price } = req.body;
    const file = req.files.file;
    // lấy ra kích thước của file
    // const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    // Cho phép File
    // const allowedType = [".png", ".jpg", ".jpeg"];
    // Check File
    // if (!allowedType.includes(ext.toLowerCase()))
    //     return res.status(422).json({ msg: "Invalid Images" });
    // if (fileSize > 5000000)
    //     return res.status(422).json({ msg: "Image must be less than 5MB" });
    const imagePath = path.join(__dirname, "public/images", fileName);
    file.mv(imagePath, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      let sql = "INSERT INTO product SET ?";
      const product = {
        name,
        price,
        image: fileName,
        urlThumnail: url,
      };
      db.query(sql, product, (err, response) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.json({ message: "Insert success!" });
      });
    });
  },
  delete: (req, res) => {
    let sql = "SELECT * FROM product WHERE id = ?";
    db.query(sql, [req.params.id], (err, response) => {
      if (Object.entries(response).length === 0) {
        return res.json({ message: "Id exits" });
      } else {
        const src = response[0].image;
        const filepath = `public/images/${src}`;
        fs.unlinkSync(filepath);
        let sql2 = "DELETE FROM product WHERE id = ?";
        db.query(sql2, [req.params.id], (err, response) => {
          if (err) return res.status(500).json({ msg: err.message });
          res.json({ message: "Delete success!" });
        });
      }
    });
  },
  update: (req, res) => {
    let { name, price } = req.body;
    let id = req.params.id;
    let sql = "SELECT * FROM product WHERE id = ?";
    db.query(sql, id, (err, response) => {
      if (Object.entries(response).length === 0) {
        return res.json({ message: "Id exits" });
      } else {
        let fileName = "";
        if (req.files == null) {
          fileName = response[0].image;
        } else {
          const file = req.files.file;
          const ext = path.extname(file.name);
          fileName = file.md5 + ext;
          fs.unlinkSync(`public/images/${response[0].image}`);
          file.mv(`public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });
        }
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        let sql2 = "UPDATE product SET ? WHERE id = ?";
        const product = {
          name,
          price,
          image: fileName,
          urlThumnail: url,
        };
        db.query(sql2, [product, id], (err, response) => {
          if (err) return res.status(500).json({ msg: err.message });
          res.json({ message: "Update success!" });
        });
      }
    });
  },
};
module.exports = productController;

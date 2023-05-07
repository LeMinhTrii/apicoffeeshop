const db = require("../database/db");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
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
  store: async (req, res) => {
    const { name, price } = req.body;
    const fileData = req.file;
    let sql = "INSERT INTO product SET ?";
    const product = {
      name,
      price,
      image: fileData.path,
      urlThumnail: fileData,
    };
    db.query(sql, product, (err, response) => {
      if (err) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        return res.status(500).json({ msg: err.message });
      }

      res.json({ message: "Insert success!" });
    });
  },
  delete: (req, res) => {
    let sql = "SELECT * FROM product WHERE id = ?";
    db.query(sql, [req.params.id], (err, response) => {
      if (Object.entries(response).length === 0) {
        return res.json({ message: "Id exits" });
      } else {
        const src = response[0].image;
        const filepath = `./public/images/${src}`;
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
          fs.unlinkSync(`./public/images/${response[0].image}`);
          file.mv(path.join(__dirname, "public", "images", fileName), (err) => {
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

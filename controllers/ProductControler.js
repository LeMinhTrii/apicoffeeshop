const db = require("../database/db");
const mysql = require("mysql2");
const cloudinary = require("cloudinary").v2;
const productController = {
  get: (req, res) => {
    let sql = "SELECT * FROM products";
    db.query(sql, (err, response) => {
      if (Object.entries(response).length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response);
    });
  },
  detail: (req, res) => {
    let sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, response) => {
      if (Object.entries(response).length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response[0]);
    });
  },
  store: async (req, res) => {
    const { name, price } = req.body;
    const fileData = req.file;
    let sql = "INSERT INTO products SET ?";
    const product = {
      name,
      price,
      image: fileData.filename,
      urlThumnail: fileData.path,
    };
    db.query(sql, product, (err, response) => {
      if (err) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        return res.status(422).json({
          message:
            "Unprocessable Entity - Dữ liệu của bạn gửi lên không hợp lệ hoặc bị lỗi.",
        });
      }
      res.status(201).json({
        message:
          "Created - Tài nguyên, đối tượng dữ liệu đã được tạo thành công.",
      });
    });
  },
  delete: (req, res) => {
    let sql = "SELECT * FROM products WHERE id = ?";
    let id = req.params.id;
    db.query(sql, id, (err, response) => {
      if (Object.entries(response).length === 0) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        let url = response[0].image;
        if (url) {
          cloudinary.uploader.destroy(url);
        }
        db.query("DELETE FROM products WHERE id = ?", id, (err, response) => {
          res.status(204).json({
            message: "No Content - Tài nguyên của bạn đã được xóa thành công",
          });
        });
      }
    });
  },
  update: (req, res) => {
    const { name, price } = req.body;
    const sql = "SELECT * FROM products WHERE id = ?";
    const fileData = req.file;
    const id = req.params.id;
    db.query(sql, id, (err, response) => {
      if (Object.entries(response).length === 0) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        let fileName = "",
          filePath = "";
        if (fileData == null) {
          fileName = response[0].image;
          filePath = response[0].urlThumnail;
        } else {
          cloudinary.uploader.destroy(response[0].image);
          fileName = fileData.filename;
          filePath = fileData.path;
        }
        const product = {
          name,
          price,
          image: fileName,
          urlThumnail: filePath,
        };
        db.query(
          "UPDATE products SET ? WHERE id = ?",
          [product, id],
          (err, response) => {
            if (err) {
              if (fileData) cloudinary.uploader.destroy(fileData.filename);
              res.status(422).json({
                message:
                  "Unprocessable Entity - Dữ liệu của bạn gửi lên không hợp lệ hoặc bị lỗi.",
              });
            }
            res.status(201).json({ message: "Update success!" });
          }
        );
      }
    });
  },
};
module.exports = productController;

const { response } = require("express");
const db = require("../database/db");
const mysql = require("mysql2");
const cloudinary = require("cloudinary").v2;
const productController = {
  get: (req, res) => {
    let sql = "SELECT * FROM products";
    db.query(sql, (err, response) => {
      if (err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      const data = {
        product: response,
        count: Object.entries(response).length,
        totalPage: Math.ceil(Object.entries(response).length / 8),
        perpage: 8,
      };
      res.status(200).json(data);
    });
  },
  detail: (req, res) => {
    let sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, response) => {
      if (err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response[0]);
    });
  },
  store: (req, res) => {
    const { name, description, price, discount, category_id } = req.body;
    const fileData = req.file;
    let sql = "INSERT INTO products SET ?";
    const product = {
      name,
      description,
      price: parseInt(price),
      discount: parseInt(discount),
      category_id: parseInt(category_id),
      image: fileData.filename,
      urlThumnail: fileData.path,
    };
    db.query(sql, product, (err, response) => {
      if (err) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename);
        return res.status(422).json(err.message);
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
    const { name, description, price, discount, category_id } = req.body;
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
          description,
          price: parseInt(price),
          discount: parseInt(discount),
          category_id: parseInt(category_id),
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
  getProductDesc: (req, res) => {
    let sql = "SELECT * FROM products ORDER BY id DESC";
    db.query(sql, (err, response) => {
      if (err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response);
    });
  },
  getSearch: (req, res) => {
    let sql = "SELECT * FROM products WHERE Lower(name) Like Lower(?)";
    let search = `%${req.body.keyword}%`;
    db.query(sql, search, (err, response) => {
      if (err) res.status(404).json(err.message);
      res.status(200).json(response);
    });
  },
  getProductByCategoryById: (req, res) => {
    let sql = "SELECT * FROM products WHERE category_id = ?";
    db.query(sql, req.params.id, (err, response) => {
      if (err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response);
    });
  },
  // Get WishList Product By User Id
  getWishListByUserId: (req, res) => {
    let sql =
      "SELECT * FROM wishlists w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?";
    db.query(sql, req.params.id, (err, response) => {
      if (err)
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      res.status(200).json(response);
    });
  },
  postWishList: (req, res) => {
    const { user_id, product_id } = req.body;
    let checksql =
      "SELECT * FROM wishlists WHERE user_id = ? AND product_id = ?";
    let delWishlist = "DELETE FROM wishlists WHERE id = ?";
    db.query(checksql, [user_id, product_id], (err, response) => {
      if (!response[0]) {
        const wishlist = {
          user_id,
          product_id,
        };
        db.query("INSERT INTO wishlists SET ?", wishlist, (err, response) => {
          if (err) {
            return res.status(404).json(err.message);
          } else {
            return res
              .status(200)
              .json({ message: "Sản Phẩm Đã Được Thêm Danh Sách Yêu Thích" });
          }
        });
      } else {
        res.status(404).json({
          message: "Sản Phẩm Đã Có Trong Danh Sách Yêu Thích",
        });
        // db.query(delWishlist, response[0].id, (err, response) => {
        //   if (err) res.status(404).json({ message: "Xóa Không Thành Công" });
        //   else {
        //     res.status(200).json({ message: "Xóa Thành Công" });
        //   }
        // });
      }
    });
  },
  deleteWishList: (req, res) => {
    const sql = "SELECT * FROM wishlists WHERE product_id= ?";
    db.query(sql, req.params.id, (err, response) => {
      if (response[0]) {
        db.query(
          "DELETE FROM wishlists WHERE id = ?",
          response[0].id,
          (err, response) => {
            if (err) res.status(404).json(err.message);
            else {
              res.status(200).json({
                message: "Bỏ Sản Phẩm Ra Danh Sách Yêu Thích Thành Công",
              });
            }
          }
        );
      } else {
        req.status(404).json({ message: "Tài Nguyên Không Tồn Tại" });
      }
    });
  },
};
module.exports = productController;

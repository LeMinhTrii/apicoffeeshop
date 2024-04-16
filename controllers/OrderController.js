const db = require("../database/db");

const sql = {
  getAllOrder: "SELECT * FROM orders",
  getOrderByIdOrder: "SELECT * FROM orders WHERE id = ?",
  getOrderByUserId: "SELECT * FROM orders WHERE user_id = ?  ORDER BY id DESC",
  postOrderByUserId: "INSERT INTO orders SET ?",
  updateOrder: "UPDATE orders SET ? WHERE id = ?",
};
const userController = {
  get: (req, res) => {
    db.query(sql.getAllOrder, (err, response) => {
      if (Object.entries(response).length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response);
    });
  },
  getOrderById: (req, res) => {
    db.query(sql.getOrderByUserId, req.params.id, (err, response) => {
      if (Object.entries(response).length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response);
    });
  },
  postOrder: (req, res) => {
    const { name, phone, address, product, total_price, user_id } = req.body;
    const Order = {
      name,
      phone,
      address,
      product,
      total_price,
      user_id,
    };
    if (name && phone && address && product && total_price && user_id) {
      db.query(sql.postOrderByUserId, Order, (err, response) => {
        if (err) {
          return res.status(422).json(err.message);
        }
        res.status(201).json({
          message:
            "Created - Tài nguyên, đối tượng dữ liệu đã được tạo thành công.",
        });
      });
    }
  },
  updateOrderById: (req, res) => {
    const { status } = req.body;
    const id = req.params.id;
    db.query("SELECT * FROM orders WHERE id = ?", id, (err, response) => {
      if (Object.entries(response).length === 0) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        db.query(sql.updateOrder, [{ status }, id], (err, response) => {
          if (err) {
            res.status(422).json(err.message);
          }
          res.status(201).json({ message: "Update success!" });
        });
      }
    });
  },
  deleteOrder: (req, res) => {
    let id = req.params.id;
    db.query("SELECT * FROM orders WHERE id = ?", id, (err, response) => {
      if (Object.entries(response).length === 0) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        db.query("DELETE FROM orders WHERE id = ?", id, (err, response) => {
          res.status(200).json({
            message: "Đơn hàng đã được xóa thành công",
          });
        });
      }
    });
  },
  getOrderByIdOrder: (req, res) => {
    db.query(sql.getOrderByIdOrder, req.params.id, (err, response) => {
      if (err) {
        res.status(404).json(err.message);
      }
      res.status(200).json(response[0]);
    });
  },
};
module.exports = userController;

const db = require("../database/db");
const commentController = {
  get: (req, res) => {
    let sql =
      "SELECT comments.id,product_id,user_id,name,urlAvatar,content,comments.created_at FROM `comments` INNER JOIN users ON users.id = comments.user_id WHERE comments.product_id = ?";
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

  post: (req, res) => {
    const { user_id, product_id, content } = req.body;
    const comment = {
      user_id,
      product_id,
      content,
    };
    db.query("INSERT INTO comments SET ?", comment, (err, response) => {
      if (err) res.status(422).json(err.message);
      res.status(201).json({
        message:
          "Created - Tài nguyên, đối tượng dữ liệu đã được tạo thành công.",
      });
    });
  },
};
module.exports = commentController;

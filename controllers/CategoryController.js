const db = require("../database/db");
const cloudinary = require("cloudinary").v2;

const sql = {
  getAllCategories: "SELECT * FROM categories",
  getCategoryById: "SELECT * FROM categories WHERE id = ?",
  postCategory: "INSERT INTO categories SET ?",
  deleteCategoryById: "DELETE FROM categories WHERE id = ?",
  updateCategoryById: "UPDATE categories SET ? WHERE id = ?",
  getProductOrderByPriceDesc:
    "SELECT * FROM products WHERE category_id = ? ORDER BY price DESC LIMIT ?, ?",
  getProductOrderByPriceAsc:
    "SELECT * FROM products WHERE category_id = ? ORDER BY price ASC LIMIT ?, ?",
  getProductOrderByIdDesc:
    "SELECT * FROM products WHERE category_id = ? ORDER BY id DESC LIMIT ?, ?",
  getProductOrderByIdAsc:
    "SELECT * FROM products WHERE category_id = ? ORDER BY id ASC LIMIT ?, ?",
};
const caterogyController = {
  get: (req, res) => {
    db.query(sql.getAllCategories, (err, response) => {
      if (response.length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response);
    });
  },
  store: (req, res) => {
    const { name_category } = req.body;
    const fileData = req.file;
    const category = {
      name_category,
      filename: fileData.filename,
      filepath: fileData.path,
    };
    db.query(sql.postCategory, category, (err, response) => {
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
    db.query(sql.getCategoryById, req.params.id, (err, response) => {
      if (response.length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        cloudinary.uploader.destroy(response[0].filename);
        db.query(sql.deleteCategoryById, req.params.id, (err, response) => {
          if (err)
            res.status(404).json({
              message:
                "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
            });
          else {
            res.status(200).json({ message: "Xóa Danh Mục Thành Công" });
          }
        });
      }
    });
  },
  update: (req, res) => {
    const { name_category } = req.body;
    const fileData = req.file;
    const id = req.params.id;
    db.query(sql.getCategoryById, id, (err, response) => {
      if (response.length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        let fileName = "",
          filePath = "";
        if (fileData == null) {
          fileName = response[0].filename;
          filePath = response[0].filepath;
        } else {
          cloudinary.uploader.destroy(response[0].filename);
          fileName = fileData.filename;
          filePath = fileData.path;
        }
        const category = {
          name_category,
          filename: fileName,
          filepath: filePath,
        };
        db.query(sql.updateCategoryById, [category, id], (err, response) => {
          if (err) {
            if (fileData) cloudinary.uploader.destroy(fileData.filename);
            res.status(422).json({
              message:
                "Unprocessable Entity - Dữ liệu của bạn gửi lên không hợp lệ hoặc bị lỗi.",
            });
          }
          res.status(201).json({ message: "Update success!" });
        });
      }
    });
  },
  getProductPriceDesc: (req, res) => {
    const { page, perpage } = req.body;
    let start = (page - 1) * perpage;
    db.query(
      sql.getProductOrderByPriceDesc,
      [req.params.id, start, perpage],
      (err, response) => {
        if (err) {
          res.status(404).json(err.message);
          console.log(response);
        }
        res.status(200).json(response);
      }
    );
  },
  getProductPriceAsc: (req, res) => {
    const { page, perpage } = req.body;
    let start = (page - 1) * perpage;
    db.query(
      sql.getProductOrderByPriceAsc,
      [req.params.id, start, perpage],
      (err, response) => {
        if (response.length === 0 || err) {
          res.status(404).json({
            message:
              "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
          });
        }
        res.status(200).json(response);
      }
    );
  },
  getProductIdDesc: (req, res) => {
    const { page, perpage } = req.body;
    let start = (page - 1) * perpage;
    db.query(
      sql.getProductOrderByIdDesc,
      [req.params.id, start, perpage],
      (err, response) => {
        if (response.length === 0 || err) {
          res.status(404).json({
            message:
              "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
          });
        }
        res.status(200).json(response);
      }
    );
  },
  getProductIdAsc: (req, res) => {
    const { page, perpage } = req.body;
    let start = (page - 1) * perpage;
    db.query(
      sql.getProductOrderByIdAsc,
      [req.params.id, start, perpage],
      (err, response) => {
        if (response.length === 0 || err) {
          res.status(404).json({
            message:
              "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
          });
        }
        res.status(200).json(response);
      }
    );
  },
};
module.exports = caterogyController;

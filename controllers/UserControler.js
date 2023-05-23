const { response } = require("express");
const db = require("../database/db");
const { hash, compare } = require("../hashpass/hash");
const cloudinary = require("cloudinary").v2;

const sql = {
  getAllUser: "SELECT * FROM users",
  getUserById: "SELECT * FROM users WHERE id = ?",
  getUserByEmail: "SELECT * FROM users WHERE email = ?",
  insertUser: "INSERT INTO users SET ?",
  deleteUserById: "DELETE FROM users WHERE id = ?",
  updateUserById: "UPDATE users SET ? WHERE id = ?",
  getCoverImageById: "SELECT * FROM coverimage WHERE id = ?",
  insertCoverImage: "INSERT INTO coverimage SET ?",
  deleteCoverImage: "DELETE FROM coverimage WHERE id = ?",
  updateCoverImageById: "UPDATE coverimage SET ? WHERE id = ?",
  updatePasswordById: "UPDATE users SET ? WHERE id= ?",
};
const userController = {
  get: (req, res) => {
    db.query(sql.getAllUser, (err, response) => {
      if (Object.entries(response).length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response);
    });
  },
  getUserById: (req, res) => {
    db.query(sql.getUserById, req.params.id, (err, response) => {
      if (Object.entries(response).length === 0 || err) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      }
      res.status(200).json(response[0]);
    });
  },
  register: (req, res) => {
    const { name, phone_number, email, password } = req.body;
    if (name && phone_number && email && password) {
      db.query(sql.getUserByEmail, email, (err, response) => {
        if (response.length !== 0) {
          res.status(404).json({ message: "Tài khoản đã được đăng ký" });
        } else {
          const hashed = hash(password);
          // bcrypt
          //     .hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
          //     .then((hashed) => {
          const user = {
            name,
            phone_number,
            email,
            password: hashed,
          };
          db.query(sql.insertUser, user, (err, response) => {
            if (err) res.status(422).json(err.message);
            db.query(
              sql.insertCoverImage,
              { filename: null, filepath: null },
              (err, response) => {
                if (err) res.json("Thêm Khum Được");
              }
            );
            res.status(201).json({
              message:
                "Created - Tài nguyên, đối tượng dữ liệu đã được tạo thành công.",
            });
          });
          // });
        }
      });
    } else {
      res.json({ message: "Nhập đầy đủ thông tin" });
    }
  },
  login: (req, res) => {
    const { email, password } = req.body;
    db.query(sql.getUserByEmail, email, (err, response) => {
      if (Object.entries(response).length !== 0) {
        const passNew = hash(password);
        const result = compare(passNew, response[0].password);
        if (result) {
          res.status(200).json({ message: "Đăng nhập thành công" });
        } else {
          res.status(404).json({ message: "Sai mật khẩu" });
        }
      } else {
        res.status(404).json({ message: "Tài khoản chưa được đăng ký" });
      }
    });
  },
  updatePassword: (req, res) => {
    const { passOld, passNewComfirm } = req.body;
    const id = req.params.id;
    db.query(sql.getUserById, id, (err, response) => {
      if (err) res.status(404).json({ message: "Không Tìm Thấy Tài Khoản" });
      else {
        const passNew = hash(passOld);
        const result = compare(passNew, response[0].password);
        if (result) {
          if (req.body.passNew === passNewComfirm) {
            const pass = {
              password: hash(passNew),
            };
            db.query(sql.updatePasswordById, [pass, id], (err, response) => {
              if (err)
                res.status(404).json({
                  message: "Cập nhật mật khẩu không thành công",
                });
              else
                res.status(200).json({
                  message: "Cập nhật mật khẩu thành công",
                });
            });
          } else {
            res.status(404).json({ message: "Mật khẩu mới không khớp" });
          }
        } else {
          res.status(404).json({ message: "Mật Khẩu Cũ Sai" });
        }
      }
    });
  },
  updateUser: (req, res) => {
    const { name, phone_number } = req.body;
    const id = req.params.id;
    db.query(sql.getUserById, id, (err, response) => {
      if (response.length === 0) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        const user = {
          name,
          phone_number,
        };
        db.query(
          sql.updateUserById,
          [user, id],
          (err,
          (response) => {
            if (err)
              res.status(404).json({ message: "Cập Nhật Tài Khoản Thất Bại" });
            else
              res
                .status(404)
                .json({ message: "Cập Nhật Tài Khoản Thành Công" });
          })
        );
      }
    });
  },
  updateAvatar: (req, res) => {
    const id = req.params.id;
    const fileData = req.file;
    db.query(sql.getUserById, id, (err, response) => {
      if (response.length === 0) {
        res.status(404).json({
          message:
            "Not Found - Tài nguyên bạn muốn truy xuất không tồn tại hoặc đã bị xóa.",
        });
      } else {
        let fileName = "",
          filePath = "";
        if (fileData == null) {
          fileName = response[0].pathImage;
          filePath = response[0].urlAvatar;
        } else {
          cloudinary.uploader.destroy(response[0].pathImage);
          fileName = fileData.filename;
          filePath = fileData.path;
        }
        const user = {
          pathImage: fileName,
          urlAvatar: filePath,
        };
        db.query(sql.updateUserById, [user, id], (err, response) => {
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
  updateCoverImage: (req, res) => {
    const id = req.params.id;
    const fileData = req.file;
    db.query(sql.getCoverImageById, id, (err, response) => {
      if (response.length === 0) {
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
        const coverimage = {
          filename: fileName,
          filepath: filePath,
        };
        db.query(
          sql.updateCoverImageById,
          [coverimage, id],
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
  deleteuser: (req, res) => {
    db.query(sql.getUserById, req.params.id, (err, response) => {
      if (response.length !== 0) {
        // Xóa avatar user trên cloudinary
        cloudinary.uploader.destroy(response[0].pathImage);
        db.query(sql.deleteUserById, req.params.id, (err, response) => {
          if (err) res.status(404).json({ message: "Xóa Không Thành Công" });
          else {
            // Xóa ảnh bìa của user trên cloudinary
            db.query(sql.getCoverImageById, req.params.id, (err, response) => {
              if (err) res.json("Xóa ảnh bìa không thành công");
              cloudinary.uploader.destroy(response[0].filename);
            });
            // Xóa ảnh bìa của user
            db.query(sql.deleteCoverImage, req.params.id, (err, response) => {
              if (err) res.json("Xóa ảnh bìa trên db không thành công");
            });
            res.status(200).json({ message: "Xóa Tài Khoản Thành Công" });
          }
        });
      } else {
        res.status(404).json({ message: " Tài Khoản Không Tồn Tại" });
      }
    });
  },
};
module.exports = userController;

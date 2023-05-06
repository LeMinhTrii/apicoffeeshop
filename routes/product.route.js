module.exports = (app) => {
    const ProductControler = require("../controllers/ProductControler");
    app.route("/product").get(ProductControler.get).post(ProductControler.store);

    app
        .route("/product/:id")
        .get(ProductControler.detail)
        .put(ProductControler.update)
        .patch(ProductControler.update)
        .delete(ProductControler.delete);
};
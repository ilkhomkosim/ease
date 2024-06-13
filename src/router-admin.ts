import express from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";
import productController from "./controllers/product.controller";

// Shop

routerAdmin.get('/', shopController.goHome);
routerAdmin
        .get('/login', shopController.getLogin)
        .post('/login', shopController.processLogin);
routerAdmin
        .get('/signup', shopController.getSignup)
        .post('/signup', shopController.processSignup);

routerAdmin.get('/check-me', shopController.checkAuthSession);
routerAdmin.get('/logout', shopController.logout);

// Product
routerAdmin.get('/product/all', shopController.verifyShop, productController.getAllProducts);
routerAdmin.post('/product/create', productController.createNewProduct);
routerAdmin.post('/product/:id', productController.updateChosenProduct);

// User

export default routerAdmin;

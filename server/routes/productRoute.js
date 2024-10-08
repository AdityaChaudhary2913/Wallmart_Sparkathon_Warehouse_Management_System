const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
	createProduct,
	getProducts,
	getProduct,
	deleteProduct,
	updateProduct,
	getAllProducts,
	getProductByName
} = require("../controllers/productController");
const upload = require('../utiles/fileUpload');

router.post('/',protect , upload.upload.single('image'), createProduct);
router.patch('/:id', protect, upload.upload.single('image'), updateProduct);
router.get('/', protect ,getProducts);
router.get('/getall', protect , getAllProducts);
router.get("/getByName", protect, getProductByName);
router.get('/:id', protect, getProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
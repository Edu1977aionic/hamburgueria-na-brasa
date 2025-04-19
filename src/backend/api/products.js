const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateJWT, isOwnerOrDeveloper } = require('../middleware/authMiddleware');
const multerConfig = require('../middleware/multerConfig');

// Instanciando o controlador
const productController = new ProductController();

/**
 * @route GET /api/products
 * @desc Buscar todos os produtos com paginação e filtros
 * @access Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route GET /api/products/:id
 * @desc Buscar um produto pelo ID
 * @access Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route POST /api/products
 * @desc Criar um novo produto
 * @access Private (somente proprietário ou desenvolvedor)
 */
router.post('/', 
  authenticateJWT, 
  isOwnerOrDeveloper,
  multerConfig.single('image'),
  productController.createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc Atualizar um produto existente
 * @access Private (somente proprietário ou desenvolvedor)
 */
router.put('/:id', 
  authenticateJWT, 
  isOwnerOrDeveloper,
  multerConfig.single('image'),
  productController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc Excluir um produto
 * @access Private (somente proprietário ou desenvolvedor)
 */
router.delete('/:id', 
  authenticateJWT, 
  isOwnerOrDeveloper,
  productController.deleteProduct
);

/**
 * @route GET /api/products/category/:category
 * @desc Buscar produtos por categoria
 * @access Public
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * @route GET /api/products/featured/list
 * @desc Buscar produtos em destaque
 * @access Public
 */
router.get('/featured/list', productController.getFeaturedProducts);

/**
 * @route PATCH /api/products/:id/featured
 * @desc Atualizar status de destaque de um produto
 * @access Private (somente proprietário ou desenvolvedor)
 */
router.patch('/:id/featured', 
  authenticateJWT, 
  isOwnerOrDeveloper,
  productController.updateFeaturedStatus
);

/**
 * @route PATCH /api/products/:id/available
 * @desc Atualizar status de disponibilidade de um produto
 * @access Private (somente proprietário ou desenvolvedor)
 */
router.patch('/:id/available', 
  authenticateJWT, 
  isOwnerOrDeveloper,
  productController.updateAvailableStatus
);

module.exports = router;
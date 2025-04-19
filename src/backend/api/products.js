const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateJWT, isOwnerOrDeveloper } = require('../middleware/authMiddleware');
const multerConfig = require('../middleware/multerConfig');

/**
 * @route GET /api/products
 * @desc Obtém todos os produtos com paginação e filtros
 * @access Público
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route GET /api/products/:id
 * @desc Obtém um produto pelo ID
 * @access Público
 */
router.get('/:id', ProductController.getProductById);

/**
 * @route POST /api/products
 * @desc Cria um novo produto
 * @access Privado - Apenas proprietários e desenvolvedores
 */
router.post(
  '/',
  authenticateJWT,
  isOwnerOrDeveloper,
  multerConfig.single('image'),
  ProductController.createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc Atualiza um produto existente
 * @access Privado - Apenas proprietários e desenvolvedores
 */
router.put(
  '/:id',
  authenticateJWT,
  isOwnerOrDeveloper,
  multerConfig.single('image'),
  ProductController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc Exclui um produto
 * @access Privado - Apenas proprietários e desenvolvedores
 */
router.delete(
  '/:id',
  authenticateJWT,
  isOwnerOrDeveloper,
  ProductController.deleteProduct
);

/**
 * @route GET /api/products/category/:category
 * @desc Obtém produtos por categoria
 * @access Público
 */
router.get('/category/:category', ProductController.getProductsByCategory);

/**
 * @route GET /api/products/featured/list
 * @desc Obtém produtos em destaque
 * @access Público
 */
router.get('/featured/list', ProductController.getFeaturedProducts);

/**
 * @route GET /api/products/available/list
 * @desc Obtém produtos disponíveis
 * @access Público
 */
router.get('/available/list', ProductController.getAvailableProducts);

/**
 * @route PATCH /api/products/:id/toggle-featured
 * @desc Alterna o status de destaque de um produto
 * @access Privado - Apenas proprietários e desenvolvedores
 */
router.patch(
  '/:id/toggle-featured',
  authenticateJWT,
  isOwnerOrDeveloper,
  ProductController.toggleFeatured
);

/**
 * @route PATCH /api/products/:id/toggle-availability
 * @desc Alterna o status de disponibilidade de um produto
 * @access Privado - Apenas proprietários e desenvolvedores
 */
router.patch(
  '/:id/toggle-availability',
  authenticateJWT,
  isOwnerOrDeveloper,
  ProductController.toggleAvailability
);

module.exports = router;
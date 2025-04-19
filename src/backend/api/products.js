const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateJWT, isOwnerOrDeveloper } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configuração temporária, será substituída por multerConfig

/**
 * @route GET /api/products
 * @desc Obtém todos os produtos com paginação e filtros opcionais
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
 * @access Privado (Proprietário ou Desenvolvedor)
 */
router.post('/', 
  authenticateJWT, 
  isOwnerOrDeveloper, 
  upload.single('image'), 
  ProductController.createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc Atualiza um produto existente
 * @access Privado (Proprietário ou Desenvolvedor)
 */
router.put('/:id', 
  authenticateJWT, 
  isOwnerOrDeveloper, 
  upload.single('image'), 
  ProductController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc Exclui um produto
 * @access Privado (Proprietário ou Desenvolvedor)
 */
router.delete('/:id', 
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
 * @route GET /api/products/featured
 * @desc Obtém produtos em destaque
 * @access Público
 */
router.get('/featured/list', ProductController.getFeaturedProducts);

/**
 * @route PUT /api/products/:id/featured
 * @desc Altera o status de destaque de um produto
 * @access Privado (Proprietário ou Desenvolvedor)
 */
router.put('/:id/featured', 
  authenticateJWT, 
  isOwnerOrDeveloper, 
  ProductController.toggleFeatured
);

/**
 * @route PUT /api/products/:id/available
 * @desc Altera o status de disponibilidade de um produto
 * @access Privado (Proprietário ou Desenvolvedor)
 */
router.put('/:id/available', 
  authenticateJWT, 
  isOwnerOrDeveloper, 
  ProductController.toggleAvailable
);

module.exports = router;
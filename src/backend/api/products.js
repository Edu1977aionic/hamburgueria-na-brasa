const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateJWT, isOwnerOrDeveloper } = require('../middleware/authMiddleware');

// Instancia o controlador de produtos
const productController = new ProductController();

/**
 * @route GET /api/products
 * @desc Busca todos os produtos com suporte a paginação e filtros
 * @access Público
 */
router.get('/', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || '',
      category: req.query.category || null,
      sortBy: req.query.sortBy || 'created_at',
      order: req.query.order || 'desc'
    };

    const result = await productController.getAllProducts(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/products/:id
 * @desc Busca um produto pelo ID
 * @access Público
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await productController.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/products
 * @desc Cria um novo produto
 * @access Privado - Apenas proprietários/desenvolvedores
 */
router.post('/', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const newProduct = await productController.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /api/products/:id
 * @desc Atualiza um produto existente
 * @access Privado - Apenas proprietários/desenvolvedores
 */
router.put('/:id', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const updatedProduct = await productController.updateProduct(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route DELETE /api/products/:id
 * @desc Exclui um produto
 * @access Privado - Apenas proprietários/desenvolvedores
 */
router.delete('/:id', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const result = await productController.deleteProduct(req.params.id);
    res.json({ success: result, message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/products/category/:category
 * @desc Busca produtos por categoria
 * @access Público
 */
router.get('/category/:category', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await productController.getProductsByCategory(
      req.params.category,
      page,
      limit
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/products/featured
 * @desc Busca produtos em destaque
 * @access Público
 */
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const featuredProducts = await productController.getFeaturedProducts(limit);
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PATCH /api/products/:id/featured
 * @desc Atualiza o status de destaque de um produto
 * @access Privado - Apenas proprietários/desenvolvedores
 */
router.patch('/:id/featured', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const { featured } = req.body;
    
    if (featured === undefined) {
      return res.status(400).json({ error: 'O status de destaque deve ser informado' });
    }
    
    const updatedProduct = await productController.updateFeaturedStatus(
      req.params.id,
      featured
    );
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PATCH /api/products/:id/availability
 * @desc Atualiza o status de disponibilidade de um produto
 * @access Privado - Apenas proprietários/desenvolvedores
 */
router.patch('/:id/availability', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const { available } = req.body;
    
    if (available === undefined) {
      return res.status(400).json({ error: 'O status de disponibilidade deve ser informado' });
    }
    
    const updatedProduct = await productController.updateAvailabilityStatus(
      req.params.id,
      available
    );
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
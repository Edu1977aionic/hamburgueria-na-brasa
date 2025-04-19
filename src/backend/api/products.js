const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateJWT, isOwnerOrDeveloper } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Rota para listar todos os produtos com paginação
// GET /api/products?page=1&limit=10&search=hamburguer&category=lanche
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const result = await productController.getAllProducts(
      parseInt(page), 
      parseInt(limit), 
      search, 
      category
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});

// Rota para obter um produto pelo ID
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await productController.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto', details: error.message });
  }
});

// Rota para criar um novo produto - requer autenticação e permissão de proprietário/desenvolvedor
// POST /api/products
router.post('/', authenticateJWT, isOwnerOrDeveloper, upload.single('image'), async (req, res) => {
  try {
    const productData = req.body;
    
    // Passa o arquivo da imagem para o controlador, se existir
    const product = await productController.createProduct(productData, req.file);
    
    res.status(201).json(product);
  } catch (error) {
    if (error.message.includes('Required fields')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
  }
});

// Rota para atualizar um produto - requer autenticação e permissão de proprietário/desenvolvedor
// PUT /api/products/:id
router.put('/:id', authenticateJWT, isOwnerOrDeveloper, upload.single('image'), async (req, res) => {
  try {
    const product = await productController.updateProduct(req.params.id, req.body, req.file);
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    if (error.message.includes('Required fields')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
});

// Rota para excluir um produto - requer autenticação e permissão de proprietário/desenvolvedor
// DELETE /api/products/:id
router.delete('/:id', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const success = await productController.deleteProduct(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir produto', details: error.message });
  }
});

// Rota para obter produtos por categoria
// GET /api/products/category/:category?page=1&limit=10
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await productController.getProductsByCategory(
      req.params.category,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos por categoria', details: error.message });
  }
});

// Rota para obter produtos em destaque
// GET /api/products/featured?limit=6
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const result = await productController.getFeaturedProducts(parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos em destaque', details: error.message });
  }
});

module.exports = router;
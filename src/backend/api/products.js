const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateJWT, isOwnerOrDeveloper } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

// Rota para obter todos os produtos (paginada e com busca)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const result = await productController.getAllProducts(page, limit, search, category);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro na rota GET /products:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});

// Rota para obter um produto específico por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await productController.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(`Erro na rota GET /products/${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao buscar produto', details: error.message });
  }
});

// Rota para criar um novo produto (requer autenticação)
router.post('/', authenticateJWT, isOwnerOrDeveloper, upload.single('image'), async (req, res) => {
  try {
    const productData = req.body;
    
    // Adiciona o caminho da imagem se foi enviada
    if (req.file) {
      productData.image_url = req.file.path;
    }
    
    const newProduct = await productController.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro na rota POST /products:', error);
    res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
  }
});

// Rota para atualizar um produto existente (requer autenticação)
router.put('/:id', authenticateJWT, isOwnerOrDeveloper, upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    
    // Adiciona o caminho da imagem se foi enviada
    if (req.file) {
      productData.image_url = req.file.path;
    }
    
    const updatedProduct = await productController.updateProduct(productId, productData);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(`Erro na rota PUT /products/${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
});

// Rota para excluir um produto (requer autenticação)
router.delete('/:id', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const productId = req.params.id;
    const success = await productController.deleteProduct(productId);
    
    if (!success) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error(`Erro na rota DELETE /products/${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao excluir produto', details: error.message });
  }
});

// Rota para obter produtos por categoria
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const category = req.params.category;
    const result = await productController.getProductsByCategory(category, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Erro na rota GET /products/category/${req.params.category}:`, error);
    res.status(500).json({ error: 'Erro ao buscar produtos por categoria', details: error.message });
  }
});

// Rota para obter produtos em destaque
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const featuredProducts = await productController.getFeaturedProducts(limit);
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error('Erro na rota GET /products/featured/list:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos em destaque', details: error.message });
  }
});

// Rota para obter produtos disponíveis
router.get('/available/list', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await productController.getAvailableProducts(page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro na rota GET /products/available/list:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos disponíveis', details: error.message });
  }
});

module.exports = router;
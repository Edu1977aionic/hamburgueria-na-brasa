const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateJWT, isOwnerOrDeveloper } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

// Rota para obter todos os produtos com paginação, busca e filtro de categoria
// GET /api/products?page=1&limit=10&search=hamburger&category=lanches
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
    console.error('Erro ao obter produtos:', error);
    res.status(500).json({ message: 'Erro ao obter produtos', error: error.message });
  }
});

// Rota para obter produtos por categoria
// GET /api/products/category/lanches?page=1&limit=10
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await productController.getProductsByCategory(
      category,
      parseInt(page),
      parseInt(limit)
    );
    
    res.json(result);
  } catch (error) {
    console.error(`Erro ao obter produtos da categoria ${req.params.category}:`, error);
    res.status(500).json({ 
      message: `Erro ao obter produtos da categoria ${req.params.category}`, 
      error: error.message 
    });
  }
});

// Rota para obter produtos em destaque
// GET /api/products/featured?limit=4
router.get('/featured', async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const featuredProducts = await productController.getFeaturedProducts(parseInt(limit));
    
    res.json(featuredProducts);
  } catch (error) {
    console.error('Erro ao obter produtos em destaque:', error);
    res.status(500).json({ 
      message: 'Erro ao obter produtos em destaque', 
      error: error.message 
    });
  }
});

// Rota para obter produtos disponíveis
// GET /api/products/available?page=1&limit=10
router.get('/available', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await productController.getAvailableProducts(
      parseInt(page),
      parseInt(limit)
    );
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao obter produtos disponíveis:', error);
    res.status(500).json({ 
      message: 'Erro ao obter produtos disponíveis', 
      error: error.message 
    });
  }
});

// Rota para obter um produto específico por ID
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await productController.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(`Erro ao obter produto ${req.params.id}:`, error);
    res.status(500).json({ 
      message: `Erro ao obter produto ${req.params.id}`, 
      error: error.message 
    });
  }
});

// Rota para criar um novo produto (requer autenticação como proprietário ou dev)
// POST /api/products
router.post('/', authenticateJWT, isOwnerOrDeveloper, upload.single('image'), async (req, res) => {
  try {
    // O middleware multer adiciona req.file com detalhes do upload
    let imageUrl = null;
    if (req.file) {
      // Se tiver arquivo, usar o caminho/URL gerado pelo multer
      imageUrl = req.file.path || req.file.location; // path para local, location para S3
    }
    
    // Combinar os dados do formulário com a URL da imagem
    const productData = {
      ...req.body,
      image_url: imageUrl
    };
    
    const newProduct = await productController.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
});

// Rota para atualizar um produto existente (requer autenticação como proprietário ou dev)
// PUT /api/products/:id
router.put('/:id', authenticateJWT, isOwnerOrDeveloper, upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Verificar se o produto existe
    const existingProduct = await productController.getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    // Verificar se foi enviada uma nova imagem
    let imageUrl = existingProduct.image_url; // Manter a imagem atual por padrão
    if (req.file) {
      // Se tiver novo arquivo, usar o caminho/URL gerado pelo multer
      imageUrl = req.file.path || req.file.location;
    }
    
    // Combinar os dados do formulário com a URL da imagem
    const productData = {
      ...req.body,
      image_url: imageUrl
    };
    
    const updatedProduct = await productController.updateProduct(productId, productData);
    res.json(updatedProduct);
  } catch (error) {
    console.error(`Erro ao atualizar produto ${req.params.id}:`, error);
    res.status(500).json({ 
      message: `Erro ao atualizar produto ${req.params.id}`, 
      error: error.message 
    });
  }
});

// Rota para excluir um produto (requer autenticação como proprietário ou dev)
// DELETE /api/products/:id
router.delete('/:id', authenticateJWT, isOwnerOrDeveloper, async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Verificar se o produto existe
    const existingProduct = await productController.getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    await productController.deleteProduct(productId);
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir produto ${req.params.id}:`, error);
    res.status(500).json({ 
      message: `Erro ao excluir produto ${req.params.id}`, 
      error: error.message 
    });
  }
});

module.exports = router;
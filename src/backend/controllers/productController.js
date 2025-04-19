const ProductModel = require('../models/productModel');
const StorageService = require('../services/storageService');

class ProductController {
  constructor() {
    this.productModel = new ProductModel();
    this.storageService = new StorageService();
  }

  /**
   * Busca todos os produtos com suporte a paginação e filtros
   */
  getAllProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category, sortBy, order } = req.query;
      
      const result = await this.productModel.getAllProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        category,
        sortBy,
        order
      });
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produtos', 
        details: error.message 
      });
    }
  };

  /**
   * Busca um produto pelo ID
   */
  getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await this.productModel.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produto', 
        details: error.message 
      });
    }
  };

  /**
   * Cria um novo produto
   */
  createProduct = async (req, res) => {
    try {
      let productData = req.body;
      
      // Convertendo strings para números e booleanos
      if (productData.price) productData.price = parseFloat(productData.price);
      if (productData.cost) productData.cost = parseFloat(productData.cost);
      if (productData.discount) productData.discount = parseFloat(productData.discount);
      productData.featured = productData.featured === 'true';
      productData.available = productData.available === 'true';

      // Se tiver imagem no request, faz upload
      if (req.file) {
        const imageUrl = await this.storageService.uploadFile(req.file);
        productData.image = imageUrl;
      }

      const product = await this.productModel.createProduct(productData);
      return res.status(201).json(product);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar produto', 
        details: error.message 
      });
    }
  };

  /**
   * Atualiza um produto existente
   */
  updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      let productData = req.body;
      
      // Convertendo strings para números e booleanos
      if (productData.price) productData.price = parseFloat(productData.price);
      if (productData.cost) productData.cost = parseFloat(productData.cost);
      if (productData.discount) productData.discount = parseFloat(productData.discount);
      
      if (productData.featured !== undefined) {
        productData.featured = productData.featured === 'true';
      }
      
      if (productData.available !== undefined) {
        productData.available = productData.available === 'true';
      }

      // Verifica se o produto existe
      const existingProduct = await this.productModel.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Se tiver imagem no request, faz upload e atualiza
      if (req.file) {
        // Se já existir imagem, exclui a antiga
        if (existingProduct.image) {
          await this.storageService.deleteFile(existingProduct.image);
        }
        
        const imageUrl = await this.storageService.uploadFile(req.file);
        productData.image = imageUrl;
      }

      const updatedProduct = await this.productModel.updateProduct(id, productData);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar produto', 
        details: error.message 
      });
    }
  };

  /**
   * Exclui um produto
   */
  deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verifica se o produto existe
      const existingProduct = await this.productModel.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Se tiver imagem, exclui do storage
      if (existingProduct.image) {
        await this.storageService.deleteFile(existingProduct.image);
      }

      await this.productModel.deleteProduct(id);
      return res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return res.status(500).json({ 
        error: 'Erro ao excluir produto', 
        details: error.message 
      });
    }
  };

  /**
   * Busca produtos por categoria
   */
  getProductsByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const products = await this.productModel.getProductsByCategory(
        category,
        parseInt(page),
        parseInt(limit)
      );
      
      return res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produtos por categoria', 
        details: error.message 
      });
    }
  };

  /**
   * Busca produtos em destaque
   */
  getFeaturedProducts = async (req, res) => {
    try {
      const { limit = 8 } = req.query;
      const products = await this.productModel.getFeaturedProducts(parseInt(limit));
      return res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produtos em destaque', 
        details: error.message 
      });
    }
  };

  /**
   * Atualiza status de destaque de um produto
   */
  updateFeaturedStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { featured } = req.body;
      
      if (featured === undefined) {
        return res.status(400).json({ error: 'O status de destaque é obrigatório' });
      }

      const product = await this.productModel.updateProduct(id, { 
        featured: featured === true || featured === 'true'
      });
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Erro ao atualizar status de destaque:', error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar status de destaque', 
        details: error.message 
      });
    }
  };

  /**
   * Atualiza status de disponibilidade de um produto
   */
  updateAvailableStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { available } = req.body;
      
      if (available === undefined) {
        return res.status(400).json({ error: 'O status de disponibilidade é obrigatório' });
      }

      const product = await this.productModel.updateProduct(id, { 
        available: available === true || available === 'true'
      });
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Erro ao atualizar disponibilidade:', error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar disponibilidade', 
        details: error.message 
      });
    }
  };
}

module.exports = ProductController;
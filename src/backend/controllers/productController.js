const ProductModel = require('../models/productModel');
const StorageService = require('../services/storageService');

/**
 * Controlador para operações relacionadas a produtos
 */
class ProductController {
  /**
   * Obtém todos os produtos com opções de paginação e filtros
   */
  static async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, search = '', category = '' } = req.query;
      
      const result = await ProductModel.getAllProducts(
        parseInt(page),
        parseInt(limit),
        search,
        category
      );
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produtos', 
        details: error.message 
      });
    }
  }

  /**
   * Obtém um produto específico pelo ID
   */
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      const product = await ProductModel.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error(`Erro ao obter produto ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produto', 
        details: error.message 
      });
    }
  }

  /**
   * Cria um novo produto
   */
  static async createProduct(req, res) {
    try {
      const productData = req.body;
      
      // Validação básica
      if (!productData.name || !productData.price || !productData.category) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Nome, preço e categoria são obrigatórios.' 
        });
      }
      
      // Processar upload de imagem, se existir
      if (req.file) {
        const imageUrl = await StorageService.uploadFile(req.file);
        productData.image_url = imageUrl;
      }
      
      const newProduct = await ProductModel.createProduct(productData);
      
      return res.status(201).json({
        message: 'Produto criado com sucesso',
        product: newProduct
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar produto', 
        details: error.message 
      });
    }
  }

  /**
   * Atualiza um produto existente
   */
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      // Verificar se o produto existe
      const existingProduct = await ProductModel.getProductById(id);
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      // Processar upload de imagem, se existir
      if (req.file) {
        // Se já existir uma imagem, excluir a antiga
        if (existingProduct.image_url) {
          await StorageService.deleteFile(existingProduct.image_url);
        }
        
        const imageUrl = await StorageService.uploadFile(req.file);
        productData.image_url = imageUrl;
      }
      
      const updatedProduct = await ProductModel.updateProduct(id, productData);
      
      return res.status(200).json({
        message: 'Produto atualizado com sucesso',
        product: updatedProduct
      });
    } catch (error) {
      console.error(`Erro ao atualizar produto ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar produto', 
        details: error.message 
      });
    }
  }

  /**
   * Exclui um produto
   */
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o produto existe
      const existingProduct = await ProductModel.getProductById(id);
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      // Se tiver imagem, excluir do armazenamento
      if (existingProduct.image_url) {
        await StorageService.deleteFile(existingProduct.image_url);
      }
      
      await ProductModel.deleteProduct(id);
      
      return res.status(200).json({
        message: 'Produto excluído com sucesso'
      });
    } catch (error) {
      console.error(`Erro ao excluir produto ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        error: 'Erro ao excluir produto', 
        details: error.message 
      });
    }
  }

  /**
   * Obtém produtos por categoria
   */
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const products = await ProductModel.getProductsByCategory(
        category,
        parseInt(page),
        parseInt(limit)
      );
      
      return res.status(200).json(products);
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${req.params.category}:`, error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produtos por categoria', 
        details: error.message 
      });
    }
  }

  /**
   * Obtém produtos em destaque
   */
  static async getFeaturedProducts(req, res) {
    try {
      const { limit = 8 } = req.query;
      
      const featuredProducts = await ProductModel.getFeaturedProducts(parseInt(limit));
      
      return res.status(200).json(featuredProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produtos em destaque', 
        details: error.message 
      });
    }
  }

  /**
   * Obtém produtos disponíveis
   */
  static async getAvailableProducts(req, res) {
    try {
      const { page = 1, limit = 10, category = '' } = req.query;
      
      const availableProducts = await ProductModel.getAvailableProducts(
        parseInt(page),
        parseInt(limit),
        category
      );
      
      return res.status(200).json(availableProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos disponíveis:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar produtos disponíveis', 
        details: error.message 
      });
    }
  }

  /**
   * Alterna o status de destaque de um produto
   */
  static async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o produto existe
      const existingProduct = await ProductModel.getProductById(id);
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      const newFeaturedStatus = !existingProduct.is_featured;
      
      await ProductModel.updateProduct(id, { is_featured: newFeaturedStatus });
      
      return res.status(200).json({
        message: `Produto ${newFeaturedStatus ? 'adicionado aos' : 'removido dos'} destaques`,
        is_featured: newFeaturedStatus
      });
    } catch (error) {
      console.error(`Erro ao alterar status de destaque do produto ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        error: 'Erro ao alterar status de destaque', 
        details: error.message 
      });
    }
  }

  /**
   * Alterna o status de disponibilidade de um produto
   */
  static async toggleAvailability(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o produto existe
      const existingProduct = await ProductModel.getProductById(id);
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      const newAvailableStatus = !existingProduct.is_available;
      
      await ProductModel.updateProduct(id, { is_available: newAvailableStatus });
      
      return res.status(200).json({
        message: `Produto ${newAvailableStatus ? 'disponibilizado' : 'indisponibilizado'} para venda`,
        is_available: newAvailableStatus
      });
    } catch (error) {
      console.error(`Erro ao alterar disponibilidade do produto ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        error: 'Erro ao alterar disponibilidade', 
        details: error.message 
      });
    }
  }
}

module.exports = ProductController;
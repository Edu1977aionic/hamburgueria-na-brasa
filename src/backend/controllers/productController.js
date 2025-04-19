const ProductModel = require('../models/productModel');

/**
 * Controller para gerenciar operações de produtos
 */
const productController = {
  /**
   * Obtém todos os produtos com paginação, busca e filtro por categoria
   * @param {number} page - Número da página
   * @param {number} limit - Limite de itens por página
   * @param {string} search - Termo de busca (opcional)
   * @param {string} category - Categoria para filtrar (opcional)
   * @returns {Promise<Object>} - Retorna os produtos e informações de paginação
   */
  getAllProducts: async (page = 1, limit = 10, search = '', category = '') => {
    try {
      return await ProductModel.getAllProducts(page, limit, search, category);
    } catch (error) {
      console.error('Erro no controller getAllProducts:', error);
      throw error;
    }
  },

  /**
   * Obtém um produto pelo ID
   * @param {string} id - ID do produto
   * @returns {Promise<Object|null>} - Retorna o produto ou null se não encontrado
   */
  getProductById: async (id) => {
    try {
      return await ProductModel.getProductById(id);
    } catch (error) {
      console.error(`Erro no controller getProductById para ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo produto
   * @param {Object} productData - Dados do produto a ser criado
   * @returns {Promise<Object>} - Retorna o produto criado
   */
  createProduct: async (productData) => {
    try {
      // Validar dados antes de criar
      if (!productData.name) {
        throw new Error('Nome do produto é obrigatório');
      }
      
      if (!productData.price || isNaN(parseFloat(productData.price))) {
        throw new Error('Preço válido é obrigatório');
      }
      
      if (!productData.category) {
        throw new Error('Categoria é obrigatória');
      }
      
      // Converter strings numéricas para números
      const formattedProduct = {
        ...productData,
        price: parseFloat(productData.price),
        cost_price: productData.cost_price ? parseFloat(productData.cost_price) : null,
        stock_quantity: productData.stock_quantity ? parseInt(productData.stock_quantity) : null,
        is_featured: productData.is_featured === 'true' || productData.is_featured === true,
        is_available: productData.is_available === 'true' || productData.is_available === true,
      };
      
      return await ProductModel.createProduct(formattedProduct);
    } catch (error) {
      console.error('Erro no controller createProduct:', error);
      throw error;
    }
  },

  /**
   * Atualiza um produto existente
   * @param {string} id - ID do produto a ser atualizado
   * @param {Object} productData - Dados atualizados do produto
   * @returns {Promise<Object>} - Retorna o produto atualizado
   */
  updateProduct: async (id, productData) => {
    try {
      // Verificar se o produto existe
      const existingProduct = await ProductModel.getProductById(id);
      if (!existingProduct) {
        throw new Error('Produto não encontrado');
      }
      
      // Converter strings numéricas para números quando presentes
      const formattedProduct = {
        ...productData,
        price: productData.price ? parseFloat(productData.price) : existingProduct.price,
        cost_price: productData.cost_price ? parseFloat(productData.cost_price) : existingProduct.cost_price,
        stock_quantity: productData.stock_quantity ? parseInt(productData.stock_quantity) : existingProduct.stock_quantity,
        is_featured: productData.is_featured !== undefined 
          ? (productData.is_featured === 'true' || productData.is_featured === true)
          : existingProduct.is_featured,
        is_available: productData.is_available !== undefined 
          ? (productData.is_available === 'true' || productData.is_available === true)
          : existingProduct.is_available,
      };
      
      return await ProductModel.updateProduct(id, formattedProduct);
    } catch (error) {
      console.error(`Erro no controller updateProduct para ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um produto
   * @param {string} id - ID do produto a ser excluído
   * @returns {Promise<boolean>} - Retorna true se o produto foi excluído com sucesso
   */
  deleteProduct: async (id) => {
    try {
      return await ProductModel.deleteProduct(id);
    } catch (error) {
      console.error(`Erro no controller deleteProduct para ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtém produtos por categoria
   * @param {string} category - Categoria dos produtos
   * @param {number} page - Número da página
   * @param {number} limit - Limite de itens por página
   * @returns {Promise<Object>} - Retorna os produtos da categoria e informações de paginação
   */
  getProductsByCategory: async (category, page = 1, limit = 10) => {
    try {
      return await ProductModel.getProductsByCategory(category, page, limit);
    } catch (error) {
      console.error(`Erro no controller getProductsByCategory para categoria ${category}:`, error);
      throw error;
    }
  },

  /**
   * Obtém produtos em destaque
   * @param {number} limit - Número máximo de produtos a retornar
   * @returns {Promise<Array>} - Retorna os produtos em destaque
   */
  getFeaturedProducts: async (limit = 4) => {
    try {
      return await ProductModel.getFeaturedProducts(limit);
    } catch (error) {
      console.error('Erro no controller getFeaturedProducts:', error);
      throw error;
    }
  },

  /**
   * Obtém produtos disponíveis
   * @param {number} page - Número da página
   * @param {number} limit - Limite de itens por página
   * @returns {Promise<Object>} - Retorna os produtos disponíveis e informações de paginação
   */
  getAvailableProducts: async (page = 1, limit = 10) => {
    try {
      return await ProductModel.getAvailableProducts(page, limit);
    } catch (error) {
      console.error('Erro no controller getAvailableProducts:', error);
      throw error;
    }
  }
};

module.exports = productController;
const Product = require('../models/productModel');

// Controlador para gerenciar produtos
const productController = {
  // Obter todos os produtos com paginação, busca e filtro por categoria
  getAllProducts: async (page, limit, search, category) => {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      
      return await Product.getAllProducts(pageNumber, limitNumber, search, category);
    } catch (error) {
      console.error('Erro em productController.getAllProducts:', error);
      throw error;
    }
  },

  // Obter um produto específico por ID
  getProductById: async (id) => {
    try {
      return await Product.getProductById(id);
    } catch (error) {
      console.error(`Erro em productController.getProductById(${id}):`, error);
      throw error;
    }
  },

  // Criar um novo produto
  createProduct: async (productData) => {
    try {
      // Validação básica dos dados do produto
      if (!productData.name || !productData.price || !productData.category) {
        throw new Error('Dados incompletos: nome, preço e categoria são obrigatórios');
      }

      // Aplicar valores padrão para campos opcionais
      const defaultData = {
        description: '',
        ingredients: [],
        is_available: true,
        is_featured: false,
        ...productData,
        // Converter string JSON se necessário
        ingredients: typeof productData.ingredients === 'string'
          ? JSON.parse(productData.ingredients)
          : (productData.ingredients || [])
      };

      // Normalizar campos booleanos que podem vir como strings
      defaultData.is_available = defaultData.is_available === 'true' || defaultData.is_available === true;
      defaultData.is_featured = defaultData.is_featured === 'true' || defaultData.is_featured === true;
      
      // Converter preço para número
      defaultData.price = parseFloat(defaultData.price);
      
      // Criar o produto no banco de dados
      return await Product.createProduct(defaultData);
    } catch (error) {
      console.error('Erro em productController.createProduct:', error);
      throw error;
    }
  },

  // Atualizar um produto existente
  updateProduct: async (id, productData) => {
    try {
      // Verificar se o produto existe
      const existingProduct = await Product.getProductById(id);
      if (!existingProduct) {
        return null;
      }

      // Processar os dados a serem atualizados
      const updatedData = {
        ...productData,
        // Converter string JSON se necessário
        ingredients: typeof productData.ingredients === 'string'
          ? JSON.parse(productData.ingredients)
          : productData.ingredients
      };

      // Normalizar campos booleanos que podem vir como strings
      if (updatedData.is_available !== undefined) {
        updatedData.is_available = updatedData.is_available === 'true' || updatedData.is_available === true;
      }
      
      if (updatedData.is_featured !== undefined) {
        updatedData.is_featured = updatedData.is_featured === 'true' || updatedData.is_featured === true;
      }
      
      // Converter preço para número, se informado
      if (updatedData.price !== undefined) {
        updatedData.price = parseFloat(updatedData.price);
      }

      // Atualizar o produto no banco de dados
      return await Product.updateProduct(id, updatedData);
    } catch (error) {
      console.error(`Erro em productController.updateProduct(${id}):`, error);
      throw error;
    }
  },

  // Excluir um produto
  deleteProduct: async (id) => {
    try {
      // Verificar se o produto existe
      const existingProduct = await Product.getProductById(id);
      if (!existingProduct) {
        return false;
      }

      // Excluir o produto do banco de dados
      return await Product.deleteProduct(id);
    } catch (error) {
      console.error(`Erro em productController.deleteProduct(${id}):`, error);
      throw error;
    }
  },

  // Obter produtos por categoria
  getProductsByCategory: async (category, page, limit) => {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      
      return await Product.getProductsByCategory(category, pageNumber, limitNumber);
    } catch (error) {
      console.error(`Erro em productController.getProductsByCategory(${category}):`, error);
      throw error;
    }
  },

  // Obter produtos em destaque
  getFeaturedProducts: async (limit) => {
    try {
      const limitNumber = parseInt(limit, 10);
      return await Product.getFeaturedProducts(limitNumber);
    } catch (error) {
      console.error('Erro em productController.getFeaturedProducts:', error);
      throw error;
    }
  },

  // Obter produtos disponíveis
  getAvailableProducts: async (page, limit) => {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      
      return await Product.getAvailableProducts(pageNumber, limitNumber);
    } catch (error) {
      console.error('Erro em productController.getAvailableProducts:', error);
      throw error;
    }
  }
};

module.exports = productController;
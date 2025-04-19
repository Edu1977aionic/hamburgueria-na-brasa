const ProductModel = require('../models/productModel');

/**
 * Controlador para gerenciar operações relacionadas a produtos
 */
class ProductController {
  constructor() {
    this.productModel = new ProductModel();
  }

  /**
   * Busca todos os produtos com suporte a paginação e filtros
   * @param {Object} options - Opções de paginação e filtros
   * @returns {Promise<Object>} Produtos e metadados de paginação
   */
  async getAllProducts(options) {
    try {
      return await this.productModel.getAllProducts(options);
    } catch (error) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }
  }

  /**
   * Busca um produto pelo ID
   * @param {string} id - ID do produto
   * @returns {Promise<Object>} Dados do produto
   */
  async getProductById(id) {
    try {
      const product = await this.productModel.getProductById(id);
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      return product;
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  /**
   * Cria um novo produto
   * @param {Object} productData - Dados do produto
   * @returns {Promise<Object>} Produto criado
   */
  async createProduct(productData) {
    try {
      // Validar dados do produto
      this.validateProductData(productData);
      
      return await this.productModel.createProduct(productData);
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  /**
   * Atualiza um produto existente
   * @param {string} id - ID do produto
   * @param {Object} productData - Novos dados do produto
   * @returns {Promise<Object>} Produto atualizado
   */
  async updateProduct(id, productData) {
    try {
      // Verifica se o produto existe
      const existingProduct = await this.productModel.getProductById(id);
      
      if (!existingProduct) {
        throw new Error('Produto não encontrado');
      }
      
      // Validar dados do produto
      this.validateProductData(productData, true);
      
      return await this.productModel.updateProduct(id, productData);
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  /**
   * Exclui um produto
   * @param {string} id - ID do produto
   * @returns {Promise<boolean>} Confirmação de exclusão
   */
  async deleteProduct(id) {
    try {
      // Verifica se o produto existe
      const existingProduct = await this.productModel.getProductById(id);
      
      if (!existingProduct) {
        throw new Error('Produto não encontrado');
      }
      
      return await this.productModel.deleteProduct(id);
    } catch (error) {
      throw new Error(`Erro ao excluir produto: ${error.message}`);
    }
  }

  /**
   * Busca produtos por categoria
   * @param {string} category - Categoria dos produtos
   * @param {number} page - Página atual
   * @param {number} limit - Limite de itens por página
   * @returns {Promise<Object>} Produtos e metadados de paginação
   */
  async getProductsByCategory(category, page, limit) {
    try {
      return await this.productModel.getProductsByCategory(category, page, limit);
    } catch (error) {
      throw new Error(`Erro ao buscar produtos por categoria: ${error.message}`);
    }
  }

  /**
   * Busca produtos em destaque
   * @param {number} limit - Limite de produtos
   * @returns {Promise<Array>} Lista de produtos em destaque
   */
  async getFeaturedProducts(limit) {
    try {
      return await this.productModel.getFeaturedProducts(limit);
    } catch (error) {
      throw new Error(`Erro ao buscar produtos em destaque: ${error.message}`);
    }
  }

  /**
   * Atualiza o status de destaque de um produto
   * @param {string} id - ID do produto
   * @param {boolean} featured - Status de destaque
   * @returns {Promise<Object>} Produto atualizado
   */
  async updateFeaturedStatus(id, featured) {
    try {
      // Verifica se o produto existe
      const existingProduct = await this.productModel.getProductById(id);
      
      if (!existingProduct) {
        throw new Error('Produto não encontrado');
      }
      
      return await this.productModel.updateFeaturedStatus(id, featured);
    } catch (error) {
      throw new Error(`Erro ao atualizar status de destaque: ${error.message}`);
    }
  }

  /**
   * Atualiza o status de disponibilidade de um produto
   * @param {string} id - ID do produto
   * @param {boolean} available - Status de disponibilidade
   * @returns {Promise<Object>} Produto atualizado
   */
  async updateAvailabilityStatus(id, available) {
    try {
      // Verifica se o produto existe
      const existingProduct = await this.productModel.getProductById(id);
      
      if (!existingProduct) {
        throw new Error('Produto não encontrado');
      }
      
      return await this.productModel.updateAvailabilityStatus(id, available);
    } catch (error) {
      throw new Error(`Erro ao atualizar status de disponibilidade: ${error.message}`);
    }
  }

  /**
   * Valida os dados do produto
   * @param {Object} productData - Dados do produto para validação
   * @param {boolean} isUpdate - Se for atualização, alguns campos podem ser opcionais
   * @throws {Error} Erro de validação
   */
  validateProductData(productData, isUpdate = false) {
    // Campos obrigatórios para criação de produto
    if (!isUpdate) {
      if (!productData.name) throw new Error('Nome do produto é obrigatório');
      if (!productData.description) throw new Error('Descrição do produto é obrigatória');
      if (!productData.price || isNaN(parseFloat(productData.price))) throw new Error('Preço válido é obrigatório');
      if (!productData.category) throw new Error('Categoria do produto é obrigatória');
    }

    // Validações específicas para campos, caso estejam presentes
    if (productData.price !== undefined && isNaN(parseFloat(productData.price))) {
      throw new Error('Preço deve ser um número válido');
    }
    
    if (productData.discountPrice !== undefined && 
        productData.discountPrice !== null && 
        isNaN(parseFloat(productData.discountPrice))) {
      throw new Error('Preço com desconto deve ser um número válido');
    }
    
    // Verificar se o preço com desconto é menor que o preço normal
    if (productData.price && productData.discountPrice && 
        parseFloat(productData.discountPrice) >= parseFloat(productData.price)) {
      throw new Error('Preço com desconto deve ser menor que o preço normal');
    }
    
    // Validar que disponibilidade e destaque são booleanos, se fornecidos
    if (productData.available !== undefined && typeof productData.available !== 'boolean') {
      throw new Error('Disponibilidade deve ser um valor booleano');
    }
    
    if (productData.featured !== undefined && typeof productData.featured !== 'boolean') {
      throw new Error('Destaque deve ser um valor booleano');
    }
  }
}

module.exports = ProductController;
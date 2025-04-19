const { supabase } = require('../../supabaseClient');

class ProductModel {
  constructor() {
    this.tableName = 'products';
  }

  /**
   * Busca todos os produtos com suporte a paginação e filtros
   * @param {Object} options Opções de busca (page, limit, search, category, sortBy, order)
   * @returns {Promise<Object>} Produtos e dados de paginação
   */
  async getAllProducts(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        category = null,
        sortBy = 'created_at',
        order = 'desc'
      } = options;

      // Cálculo do offset para paginação
      const offset = (page - 1) * limit;

      // Inicia a consulta
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Aplica filtro de busca por nome se tiver termo de busca
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Aplica filtro por categoria se for especificado
      if (category) {
        query = query.eq('category', category);
      }

      // Aplica ordenação
      query = query.order(sortBy, { ascending: order === 'asc' });

      // Aplica paginação
      query = query.range(offset, offset + limit - 1);

      // Executa a consulta
      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Erro ao buscar produtos: ${error.message}`);
      }

      // Calcula o número total de páginas
      const totalPages = Math.ceil(count / limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages
        }
      };
    } catch (error) {
      console.error('Erro em getAllProducts:', error);
      throw error;
    }
  }

  /**
   * Busca um produto pelo ID
   * @param {string} id ID do produto
   * @returns {Promise<Object>} Dados do produto
   */
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar produto: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em getProductById:', error);
      throw error;
    }
  }

  /**
   * Cria um novo produto
   * @param {Object} productData Dados do produto
   * @returns {Promise<Object>} Produto criado
   */
  async createProduct(productData) {
    try {
      // Garante que o produto tenha uma data de criação
      const newProduct = {
        ...productData,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([newProduct])
        .select();

      if (error) {
        throw new Error(`Erro ao criar produto: ${error.message}`);
      }

      return data[0];
    } catch (error) {
      console.error('Erro em createProduct:', error);
      throw error;
    }
  }

  /**
   * Atualiza um produto existente
   * @param {string} id ID do produto
   * @param {Object} productData Dados do produto
   * @returns {Promise<Object>} Produto atualizado
   */
  async updateProduct(id, productData) {
    try {
      // Adiciona a data de atualização
      const updatedProduct = {
        ...productData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updatedProduct)
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(`Erro ao atualizar produto: ${error.message}`);
      }

      return data[0];
    } catch (error) {
      console.error('Erro em updateProduct:', error);
      throw error;
    }
  }

  /**
   * Exclui um produto
   * @param {string} id ID do produto
   * @returns {Promise<boolean>} Status da operação
   */
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erro ao excluir produto: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Erro em deleteProduct:', error);
      throw error;
    }
  }

  /**
   * Busca produtos por categoria
   * @param {string} category Categoria dos produtos
   * @param {number} page Número da página
   * @param {number} limit Limite de itens por página
   * @returns {Promise<Object>} Produtos e dados de paginação
   */
  async getProductsByCategory(category, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Erro ao buscar produtos por categoria: ${error.message}`);
      }

      const totalPages = Math.ceil(count / limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages
        }
      };
    } catch (error) {
      console.error('Erro em getProductsByCategory:', error);
      throw error;
    }
  }

  /**
   * Busca produtos em destaque
   * @param {number} limit Limite de produtos a retornar
   * @returns {Promise<Array>} Lista de produtos em destaque
   */
  async getFeaturedProducts(limit = 8) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('featured', true)
        .eq('available', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Erro ao buscar produtos em destaque: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em getFeaturedProducts:', error);
      throw error;
    }
  }
}

module.exports = ProductModel;
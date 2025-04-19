const { supabase } = require('../../supabaseClient');

/**
 * Modelo para gerenciar operações relacionadas aos produtos no banco de dados
 */
const ProductModel = {
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
      // Calcular o offset baseado na página
      const offset = (page - 1) * limit;
      
      // Iniciar a query base
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });
      
      // Adicionar filtro de busca se fornecido
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      // Adicionar filtro de categoria se fornecido
      if (category) {
        query = query.eq('category', category);
      }
      
      // Executar a query com paginação
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      // Calcular o total de páginas
      const totalPages = Math.ceil(count / limit);
      
      return {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems: count,
          totalPages
        }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produto por ID ${id}:`, error);
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
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
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
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ID ${id}:`, error);
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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir produto ID ${id}:`, error);
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
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      const totalPages = Math.ceil(count / limit);
      
      return {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems: count,
          totalPages
        }
      };
    } catch (error) {
      console.error(`Erro ao buscar produtos por categoria ${category}:`, error);
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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
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
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      const totalPages = Math.ceil(count / limit);
      
      return {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems: count,
          totalPages
        }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos disponíveis:', error);
      throw error;
    }
  }
};

module.exports = ProductModel;
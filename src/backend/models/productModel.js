const { supabase } = require('../../supabaseClient');

/**
 * Modelo para operações relacionadas a produtos no banco de dados
 */
class ProductModel {
  static tableName = 'products';

  /**
   * Obtém todos os produtos com opções de paginação e filtros
   * @param {number} page - Número da página
   * @param {number} limit - Limite de itens por página
   * @param {string} search - Termo de busca (opcional)
   * @param {string} category - Categoria para filtrar (opcional)
   * @returns {Promise<{data: Array, count: number}>} Produtos e contagem total
   */
  static async getAllProducts(page = 1, limit = 10, search = '', category = '') {
    try {
      // Calcula o offset para paginação
      const offset = (page - 1) * limit;
      
      // Inicia a query
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });
      
      // Adiciona filtro de busca se fornecido
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      // Adiciona filtro de categoria se fornecido
      if (category) {
        query = query.eq('category', category);
      }
      
      // Adiciona paginação e ordenação
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return {
        data,
        count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  /**
   * Obtém um produto pelo ID
   * @param {string} id - ID do produto
   * @returns {Promise<Object|null>} Produto encontrado ou null
   */
  static async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        // Se o erro for "not found", retornamos null em vez de lançar exceção
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produto ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo produto
   * @param {Object} productData - Dados do produto a ser criado
   * @returns {Promise<Object>} Novo produto criado
   */
  static async createProduct(productData) {
    try {
      // Garante que os campos booleanos tenham valores padrão
      const dataWithDefaults = {
        is_featured: false,
        is_available: true,
        ...productData
      };
      
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([dataWithDefaults])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  /**
   * Atualiza um produto existente
   * @param {string} id - ID do produto a ser atualizado
   * @param {Object} productData - Novos dados do produto
   * @returns {Promise<Object>} Produto atualizado
   */
  static async updateProduct(id, productData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
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
  }

  /**
   * Exclui um produto
   * @param {string} id - ID do produto a ser excluído
   * @returns {Promise<void>}
   */
  static async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Erro ao excluir produto ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém produtos por categoria
   * @param {string} category - Categoria para filtrar
   * @param {number} page - Número da página
   * @param {number} limit - Limite de itens por página
   * @returns {Promise<{data: Array, count: number}>} Produtos e contagem total
   */
  static async getProductsByCategory(category, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return {
        data,
        count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
      throw error;
    }
  }

  /**
   * Obtém produtos em destaque
   * @param {number} limit - Número máximo de produtos a retornar
   * @returns {Promise<Array>} Lista de produtos em destaque
   */
  static async getFeaturedProducts(limit = 8) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
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
  }

  /**
   * Obtém produtos disponíveis
   * @param {number} page - Número da página
   * @param {number} limit - Limite de itens por página
   * @param {string} category - Categoria para filtrar (opcional)
   * @returns {Promise<{data: Array, count: number}>} Produtos disponíveis e contagem total
   */
  static async getAvailableProducts(page = 1, limit = 10, category = '') {
    try {
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('is_available', true);
      
      // Adiciona filtro de categoria se fornecido
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return {
        data,
        count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar produtos disponíveis:', error);
      throw error;
    }
  }
}

module.exports = ProductModel;
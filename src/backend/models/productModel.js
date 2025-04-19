const supabase = require('../../supabaseClient');

class ProductModel {
  constructor() {
    this.table = 'products';
  }

  /**
   * Retorna todos os produtos com paginação e filtros opcionais
   * @param {Object} options - Opções de busca e paginação
   * @returns {Promise<Object>} Dados paginados e contagem
   */
  async getAllProducts({ page = 1, limit = 10, category = null, available = null, search = null }) {
    try {
      // Iniciar consulta
      let query = supabase
        .from(this.table)
        .select('*', { count: 'exact' });

      // Aplicar filtros se existirem
      if (category) {
        query = query.eq('category', category);
      }

      if (available !== null) {
        query = query.eq('available', available);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Aplicar paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      return { data, count, error };
    } catch (error) {
      console.error('Erro no modelo de produtos - getAllProducts:', error);
      return { data: null, count: 0, error };
    }
  }

  /**
   * Busca um produto pelo ID
   * @param {string} id - ID do produto
   * @returns {Promise<Object>} Dados do produto
   */
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Erro no modelo de produtos - getProductById:', error);
      return { data: null, error };
    }
  }

  /**
   * Cria um novo produto
   * @param {Object} productData - Dados do produto a ser criado
   * @returns {Promise<Object>} Dados do produto criado
   */
  async createProduct(productData) {
    try {
      // Garantir que temos valores padrão para campos opcionais
      const product = {
        name: productData.name,
        price: productData.price,
        category: productData.category,
        description: productData.description || '',
        image: productData.image || null,
        ingredients: productData.ingredients || [],
        available: productData.available !== undefined ? productData.available : true,
        featured: productData.featured !== undefined ? productData.featured : false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from(this.table)
        .insert([product])
        .select();

      return { data: data ? data[0] : null, error };
    } catch (error) {
      console.error('Erro no modelo de produtos - createProduct:', error);
      return { data: null, error };
    }
  }

  /**
   * Atualiza um produto existente
   * @param {string} id - ID do produto
   * @param {Object} productData - Dados atualizados do produto
   * @returns {Promise<Object>} Dados do produto atualizado
   */
  async updateProduct(id, productData) {
    try {
      // Garantir que a data de atualização seja atualizada
      const updatedData = {
        ...productData,
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from(this.table)
        .update(updatedData)
        .eq('id', id)
        .select();

      return { data: data ? data[0] : null, error };
    } catch (error) {
      console.error('Erro no modelo de produtos - updateProduct:', error);
      return { data: null, error };
    }
  }

  /**
   * Exclui um produto
   * @param {string} id - ID do produto
   * @returns {Promise<Object>} Resultado da operação
   */
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error('Erro no modelo de produtos - deleteProduct:', error);
      return { error };
    }
  }

  /**
   * Busca produtos por categoria
   * @param {string} category - Categoria para filtrar
   * @param {number} page - Página atual
   * @param {number} limit - Limite de itens por página
   * @returns {Promise<Object>} Dados paginados e contagem
   */
  async getProductsByCategory(category, page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from(this.table)
        .select('*', { count: 'exact' })
        .eq('category', category)
        .eq('available', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      return { data, count, error };
    } catch (error) {
      console.error('Erro no modelo de produtos - getProductsByCategory:', error);
      return { data: null, count: 0, error };
    }
  }

  /**
   * Busca produtos em destaque
   * @param {number} limit - Limite de itens a retornar
   * @returns {Promise<Object>} Dados dos produtos em destaque
   */
  async getFeaturedProducts(limit = 6) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('featured', true)
        .eq('available', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      console.error('Erro no modelo de produtos - getFeaturedProducts:', error);
      return { data: null, error };
    }
  }
}

module.exports = ProductModel;
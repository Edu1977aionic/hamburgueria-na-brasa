const supabase = require('../../supabaseClient');

const TABLE_NAME = 'products';

const Product = {
  // Obter todos os produtos com suporte a paginação, busca e filtro por categoria
  getAllProducts: async (page = 1, limit = 10, search = '', category = '') => {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' });
      
      // Aplicar filtro de busca se fornecido
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      // Filtrar por categoria se fornecida
      if (category) {
        query = query.eq('category', category);
      }
      
      // Aplicar paginação
      const startIndex = (page - 1) * limit;
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + limit - 1);
      
      if (error) throw error;
      
      return {
        products: data || [],
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Erro em Product.getAllProducts:', error);
      throw error;
    }
  },

  // Obter um produto específico por ID
  getProductById: async (id) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Produto não encontrado
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Erro em Product.getProductById(${id}):`, error);
      throw error;
    }
  },

  // Criar um novo produto
  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro em Product.createProduct:', error);
      throw error;
    }
  },

  // Atualizar um produto existente
  updateProduct: async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro em Product.updateProduct(${id}):`, error);
      throw error;
    }
  },

  // Excluir um produto
  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro em Product.deleteProduct(${id}):`, error);
      throw error;
    }
  },

  // Obter produtos por categoria
  getProductsByCategory: async (category, page = 1, limit = 10) => {
    try {
      // Aplicar paginação
      const startIndex = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + limit - 1);
      
      if (error) throw error;
      
      return {
        products: data || [],
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error(`Erro em Product.getProductsByCategory(${category}):`, error);
      throw error;
    }
  },

  // Obter produtos em destaque
  getFeaturedProducts: async (limit = 4) => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erro em Product.getFeaturedProducts:', error);
      throw error;
    }
  },

  // Obter produtos disponíveis
  getAvailableProducts: async (page = 1, limit = 10) => {
    try {
      // Aplicar paginação
      const startIndex = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + limit - 1);
      
      if (error) throw error;
      
      return {
        products: data || [],
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Erro em Product.getAvailableProducts:', error);
      throw error;
    }
  }
};

module.exports = Product;
const { supabase } = require('../../utils/supabaseClient');

// Modelo para gerenciar produtos no banco de dados
const productModel = {
  // Obter todos os produtos com paginação e pesquisa
  getAllProducts: async (page = 1, limit = 10, search = '', category = '') => {
    try {
      // Calcular o offset para paginação
      const offset = (page - 1) * limit;
      
      // Iniciar a consulta
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });
      
      // Adicionar filtro de pesquisa se fornecido
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      // Adicionar filtro de categoria se fornecido
      if (category) {
        query = query.eq('category', category);
      }
      
      // Aplicar paginação e ordenação
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      // Calcular o total de páginas
      const totalPages = Math.ceil(count / limit);
      
      return {
        data,
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages
        }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },
  
  // Obter um produto pelo ID
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
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },
  
  // Criar um novo produto
  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },
  
  // Atualizar um produto existente
  updateProduct: async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },
  
  // Excluir um produto
  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir produto ${id}:`, error);
      throw error;
    }
  },
  
  // Buscar produtos por categoria
  getProductsByCategory: async (category, page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      const totalPages = Math.ceil(count / limit);
      
      return {
        data,
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages
        }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw error;
    }
  },
  
  // Buscar produtos em destaque
  getFeaturedProducts: async (limit = 6) => {
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
  
  // Buscar produtos disponíveis
  getAvailableProducts: async (page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_available', true)
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      const totalPages = Math.ceil(count / limit);
      
      return {
        data,
        pagination: {
          page,
          limit,
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

module.exports = productModel;
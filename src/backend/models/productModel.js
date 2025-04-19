const { supabase } = require('../../utils/supabaseClient');

const productModel = {
  // Buscar todos os produtos com paginação
  getAllProducts: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    // Adiciona filtro de busca se fornecido
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      products: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  },
  
  // Buscar produto por ID
  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar novo produto
  createProduct: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Atualizar produto existente
  updateProduct: async (id, productData) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Excluir produto
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },
  
  // Buscar produtos por categoria
  getProductsByCategory: async (category, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      products: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  },
  
  // Buscar produtos em destaque
  getFeaturedProducts: async (limit = 5) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

module.exports = productModel;
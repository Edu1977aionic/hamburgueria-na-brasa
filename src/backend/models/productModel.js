const { supabase } = require('../../supabaseClient');

const getAllProducts = async (page = 1, limit = 10, search = '', category = '') => {
  try {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    // Adicionar filtro de busca se especificado
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    // Adicionar filtro de categoria se especificado
    if (category) {
      query = query.eq('category', category);
    }
    
    // Executar a consulta com paginação
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      products: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Código para "não encontrado"
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar produto ID ${id}:`, error);
    throw error;
  }
};

const createProduct = async (productData) => {
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
};

const updateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(`Erro ao atualizar produto ID ${id}:`, error);
    throw error;
  }
};

const deleteProduct = async (id) => {
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
};

const getProductsByCategory = async (category, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      products: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
    throw error;
  }
};

const getFeaturedProducts = async (limit = 6) => {
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
};

const getAvailableProducts = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_available', true)
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      products: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    console.error('Erro ao buscar produtos disponíveis:', error);
    throw error;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  getAvailableProducts
};
const { supabase } = require('../../utils/supabaseClient');

const salesModel = {
  // Buscar todas as vendas com paginação e filtragem
  getAllSales: async (page = 1, limit = 10, filters = {}) => {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('sales')
      .select('*, customer:customer_id(*)', { count: 'exact' });
    
    // Aplicar filtros se fornecidos
    if (filters.startDate && filters.endDate) {
      query = query.gte('created_at', filters.startDate).lte('created_at', filters.endDate);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.paymentMethod) {
      query = query.eq('payment_method', filters.paymentMethod);
    }
    
    if (filters.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      sales: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  },
  
  // Buscar venda por ID
  getSaleById: async (id) => {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customer_id(*),
        items:sale_items(
          *,
          product:product_id(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar nova venda
  createSale: async (saleData, items) => {
    // Iniciar uma transação
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([saleData])
      .select();
    
    if (saleError) throw saleError;
    
    // Adicionar os itens da venda
    const saleItems = items.map(item => ({
      sale_id: sale[0].id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));
    
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);
    
    if (itemsError) throw itemsError;
    
    // Buscar a venda completa
    return await salesModel.getSaleById(sale[0].id);
  },
  
  // Atualizar status da venda
  updateSaleStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('sales')
      .update({ status })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Obter estatísticas de vendas
  getSalesStats: async (period = 'day') => {
    let timeFilter;
    
    // Determinar o filtro de tempo baseado no período
    switch (period) {
      case 'day':
        timeFilter = 'created_at::date = current_date';
        break;
      case 'week':
        timeFilter = 'created_at::date > current_date - interval \'7 days\'';
        break;
      case 'month':
        timeFilter = 'created_at::date > current_date - interval \'30 days\'';
        break;
      case 'year':
        timeFilter = 'created_at::date > current_date - interval \'1 year\'';
        break;
      default:
        timeFilter = 'created_at::date = current_date';
    }
    
    // Consulta para vendas totais
    const { data: totalSales, error: totalError } = await supabase
      .from('sales')
      .select('total')
      .filter('status', 'neq', 'cancelled')
      .filter(timeFilter)
      .select();
    
    if (totalError) throw totalError;
    
    // Calcular a soma total
    const total = totalSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Obter contagem de vendas
    const { count, error: countError } = await supabase
      .from('sales')
      .select('*', { count: 'exact' })
      .filter('status', 'neq', 'cancelled')
      .filter(timeFilter);
    
    if (countError) throw countError;
    
    // Obter média de vendas por transação
    const average = count > 0 ? total / count : 0;
    
    return {
      period,
      totalSales: total,
      count,
      average
    };
  },
  
  // Relatório de vendas por período
  getSalesReport: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customer_id(name, email, phone),
        items:sale_items(
          quantity, 
          price, 
          subtotal,
          product:product_id(name, category)
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Calcular totais
    const totalSales = data.length;
    const totalRevenue = data.reduce((sum, sale) => sum + sale.total, 0);
    
    // Agrupar por método de pagamento
    const paymentMethods = data.reduce((acc, sale) => {
      const method = sale.payment_method;
      if (!acc[method]) {
        acc[method] = { count: 0, total: 0 };
      }
      acc[method].count += 1;
      acc[method].total += sale.total;
      return acc;
    }, {});
    
    return {
      startDate,
      endDate,
      totalSales,
      totalRevenue,
      paymentMethods,
      sales: data
    };
  }
};

module.exports = salesModel;
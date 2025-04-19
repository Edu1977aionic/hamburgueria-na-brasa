const productModel = require('../models/productModel');
const { supabase } = require('../../utils/supabaseClient');

// Controller para gerenciar produtos
const productController = {
  // Listar todos os produtos com paginação e pesquisa
  getAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const category = req.query.category || '';
      
      const result = await productModel.getAllProducts(page, limit, search, category);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar produtos', 
        details: error.message 
      });
    }
  },
  
  // Obter um produto pelo ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await productModel.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar produto', 
        details: error.message 
      });
    }
  },
  
  // Criar um novo produto
  createProduct: async (req, res) => {
    try {
      const { 
        name, 
        description, 
        price, 
        category, 
        image_url, 
        is_available, 
        is_featured,
        ingredients,
        nutrition_info
      } = req.body;
      
      // Validar dados obrigatórios
      if (!name || !price || !category) {
        return res.status(400).json({ 
          error: 'Dados incompletos', 
          details: 'Nome, preço e categoria são obrigatórios' 
        });
      }
      
      // Se houver upload de imagem, processar aqui
      let imageUrl = image_url;
      if (req.file) {
        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      const productData = {
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        image_url: imageUrl || null,
        is_available: is_available !== undefined ? is_available : true,
        is_featured: is_featured || false,
        ingredients: ingredients || [],
        nutrition_info: nutrition_info || {}
      };
      
      const newProduct = await productModel.createProduct(productData);
      
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ 
        error: 'Erro ao criar produto', 
        details: error.message 
      });
    }
  },
  
  // Atualizar um produto existente
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        name, 
        description, 
        price, 
        category, 
        image_url, 
        is_available, 
        is_featured,
        ingredients,
        nutrition_info
      } = req.body;
      
      // Verificar se o produto existe
      const existingProduct = await productModel.getProductById(id);
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      // Se houver upload de imagem, processar aqui
      let imageUrl = image_url;
      if (req.file) {
        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      const productData = {
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price ? parseFloat(price) : existingProduct.price,
        category: category || existingProduct.category,
        image_url: imageUrl || existingProduct.image_url,
        is_available: is_available !== undefined ? is_available : existingProduct.is_available,
        is_featured: is_featured !== undefined ? is_featured : existingProduct.is_featured,
        ingredients: ingredients || existingProduct.ingredients,
        nutrition_info: nutrition_info || existingProduct.nutrition_info
      };
      
      const updatedProduct = await productModel.updateProduct(id, productData);
      
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ 
        error: 'Erro ao atualizar produto', 
        details: error.message 
      });
    }
  },
  
  // Excluir um produto
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar se o produto existe
      const existingProduct = await productModel.getProductById(id);
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      await productModel.deleteProduct(id);
      
      res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).json({ 
        error: 'Erro ao excluir produto', 
        details: error.message 
      });
    }
  },
  
  // Buscar produtos por categoria
  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await productModel.getProductsByCategory(category, page, limit);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar produtos por categoria', 
        details: error.message 
      });
    }
  },
  
  // Buscar produtos em destaque
  getFeaturedProducts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      
      const products = await productModel.getFeaturedProducts(limit);
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar produtos em destaque', 
        details: error.message 
      });
    }
  }
};

module.exports = productController;
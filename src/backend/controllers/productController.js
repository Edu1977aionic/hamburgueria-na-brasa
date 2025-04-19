const ProductModel = require('../models/productModel');
const StorageService = require('../services/storageService');
const fs = require('fs');
const path = require('path');

// Instanciando o modelo de produtos
const productModel = new ProductModel();
// A implementação do serviço de armazenamento será feita posteriormente
// const storageService = new StorageService();

class ProductController {
  /**
   * Obtém todos os produtos com paginação e filtros opcionais
   */
  static async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const category = req.query.category;
      const available = req.query.available === 'true';
      const search = req.query.search;
      
      const { data, count, error } = await productModel.getAllProducts({
        page, limit, category, available, search
      });

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produtos',
        error: error.message
      });
    }
  }

  /**
   * Obtém um produto pelo ID
   */
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await productModel.getProductById(id);

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          status: 'error',
          message: 'Produto não encontrado'
        });
      }

      return res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produto',
        error: error.message
      });
    }
  }

  /**
   * Cria um novo produto
   */
  static async createProduct(req, res) {
    try {
      const productData = req.body;
      
      // Validar dados do produto
      if (!productData.name || !productData.price || !productData.category) {
        return res.status(400).json({
          status: 'error',
          message: 'Dados insuficientes. Nome, preço e categoria são obrigatórios.'
        });
      }

      // Processar imagem se existir
      if (req.file) {
        // Temporariamente salva o caminho da imagem
        // Isso será substituído pelo serviço de armazenamento em nuvem
        const imagePath = `/uploads/${req.file.filename}`;
        productData.image = imagePath;
      }

      const { data, error } = await productModel.createProduct(productData);

      if (error) throw error;

      return res.status(201).json({
        status: 'success',
        message: 'Produto criado com sucesso',
        data
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao criar produto',
        error: error.message
      });
    }
  }

  /**
   * Atualiza um produto existente
   */
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;

      // Verificar se o produto existe
      const { data: existingProduct, error: existingError } = await productModel.getProductById(id);
      
      if (existingError) throw existingError;
      
      if (!existingProduct) {
        return res.status(404).json({
          status: 'error',
          message: 'Produto não encontrado'
        });
      }

      // Processar imagem se existir
      if (req.file) {
        // Temporariamente salva o caminho da imagem
        // Isso será substituído pelo serviço de armazenamento em nuvem
        const imagePath = `/uploads/${req.file.filename}`;
        productData.image = imagePath;
        
        // Remover imagem antiga se existir
        if (existingProduct.image) {
          // Código de remoção da imagem antiga será implementado com o StorageService
        }
      }

      const { data, error } = await productModel.updateProduct(id, productData);

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: 'Produto atualizado com sucesso',
        data
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao atualizar produto',
        error: error.message
      });
    }
  }

  /**
   * Exclui um produto
   */
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o produto existe
      const { data: existingProduct, error: existingError } = await productModel.getProductById(id);
      
      if (existingError) throw existingError;
      
      if (!existingProduct) {
        return res.status(404).json({
          status: 'error',
          message: 'Produto não encontrado'
        });
      }

      // Remover imagem se existir
      if (existingProduct.image) {
        // Código de remoção da imagem será implementado com o StorageService
      }

      const { error } = await productModel.deleteProduct(id);

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: 'Produto excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao excluir produto',
        error: error.message
      });
    }
  }

  /**
   * Obtém produtos por categoria
   */
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const { data, count, error } = await productModel.getProductsByCategory(category, page, limit);

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produtos por categoria',
        error: error.message
      });
    }
  }

  /**
   * Obtém produtos em destaque
   */
  static async getFeaturedProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 6;
      
      const { data, error } = await productModel.getFeaturedProducts(limit);

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produtos em destaque',
        error: error.message
      });
    }
  }

  /**
   * Altera o status de destaque de um produto
   */
  static async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      const { featured } = req.body;
      
      if (featured === undefined) {
        return res.status(400).json({
          status: 'error',
          message: 'O parâmetro "featured" é obrigatório'
        });
      }

      const { data, error } = await productModel.updateProduct(id, { featured });

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: `Produto ${featured ? 'adicionado aos' : 'removido dos'} destaques com sucesso`,
        data
      });
    } catch (error) {
      console.error('Erro ao alterar status de destaque do produto:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao alterar status de destaque do produto',
        error: error.message
      });
    }
  }

  /**
   * Altera o status de disponibilidade de um produto
   */
  static async toggleAvailable(req, res) {
    try {
      const { id } = req.params;
      const { available } = req.body;
      
      if (available === undefined) {
        return res.status(400).json({
          status: 'error',
          message: 'O parâmetro "available" é obrigatório'
        });
      }

      const { data, error } = await productModel.updateProduct(id, { available });

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: `Produto ${available ? 'disponibilizado' : 'indisponibilizado'} com sucesso`,
        data
      });
    } catch (error) {
      console.error('Erro ao alterar disponibilidade do produto:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao alterar disponibilidade do produto',
        error: error.message
      });
    }
  }
}

module.exports = ProductController;
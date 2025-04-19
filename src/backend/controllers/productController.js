const productModel = require('../models/productModel');
const storageService = require('../services/storageService');

// Obtém todos os produtos com paginação e pesquisa
const getAllProducts = async (page = 1, limit = 10, search = '', category = '') => {
  return await productModel.getAllProducts(page, limit, search, category);
};

// Obtém um produto pelo ID
const getProductById = async (id) => {
  return await productModel.getProductById(id);
};

// Cria um novo produto
const createProduct = async (productData, imageFile) => {
  // Validar campos obrigatórios
  if (!productData.name || !productData.price || !productData.category) {
    throw new Error('Required fields missing: name, price and category are required');
  }

  // Se houver um arquivo de imagem, faz o upload
  let imageUrl = null;
  if (imageFile) {
    const filename = `product_${Date.now()}_${imageFile.originalname.replace(/\s+/g, '_')}`;
    imageUrl = await storageService.uploadFile(imageFile.buffer, filename, 'products');
    productData.image_url = imageUrl;
  }

  // Converter campos numéricos
  if (productData.price) productData.price = parseFloat(productData.price);
  if (productData.discount_price) productData.discount_price = parseFloat(productData.discount_price);
  
  // Converter campos booleanos
  if (productData.is_available !== undefined) 
    productData.is_available = productData.is_available === 'true' || productData.is_available === true;
  if (productData.is_featured !== undefined) 
    productData.is_featured = productData.is_featured === 'true' || productData.is_featured === true;

  return await productModel.createProduct(productData);
};

// Atualiza um produto existente
const updateProduct = async (id, productData, imageFile) => {
  // Verificar se o produto existe
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) return null;

  // Campos obrigatórios não podem ser vazios
  if (
    (productData.name !== undefined && !productData.name) || 
    (productData.price !== undefined && !productData.price) || 
    (productData.category !== undefined && !productData.category)
  ) {
    throw new Error('Required fields cannot be empty: name, price and category');
  }

  // Se houver um arquivo de imagem, faz o upload e atualiza a URL
  if (imageFile) {
    const filename = `product_${Date.now()}_${imageFile.originalname.replace(/\s+/g, '_')}`;
    const imageUrl = await storageService.uploadFile(imageFile.buffer, filename, 'products');
    productData.image_url = imageUrl;
    
    // Se existir uma imagem anterior, podemos excluí-la do storage
    // Isso seria implementado se houver um sistema para acompanhar arquivos antigos
    // if (existingProduct.image_url) await storageService.deleteFile(existingProduct.image_url);
  }

  // Converter campos numéricos
  if (productData.price) productData.price = parseFloat(productData.price);
  if (productData.discount_price) productData.discount_price = parseFloat(productData.discount_price);
  
  // Converter campos booleanos
  if (productData.is_available !== undefined) 
    productData.is_available = productData.is_available === 'true' || productData.is_available === true;
  if (productData.is_featured !== undefined) 
    productData.is_featured = productData.is_featured === 'true' || productData.is_featured === true;

  return await productModel.updateProduct(id, productData);
};

// Exclui um produto
const deleteProduct = async (id) => {
  // Verificar se o produto existe
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) return false;

  // Se o produto tiver uma imagem, podemos excluí-la do storage
  // if (existingProduct.image_url) await storageService.deleteFile(existingProduct.image_url);

  return await productModel.deleteProduct(id);
};

// Obtém produtos por categoria
const getProductsByCategory = async (category, page = 1, limit = 10) => {
  return await productModel.getProductsByCategory(category, page, limit);
};

// Obtém produtos em destaque
const getFeaturedProducts = async (limit = 6) => {
  return await productModel.getFeaturedProducts(limit);
};

// Obtém produtos disponíveis
const getAvailableProducts = async (page = 1, limit = 10) => {
  return await productModel.getAvailableProducts(page, limit);
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
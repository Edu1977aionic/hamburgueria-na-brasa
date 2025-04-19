import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { formatCurrency } from '../../../utils/formatters';

const ProductList = () => {
  // Estados
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock de categorias para teste (deve ser substituído pela API)
  const mockCategories = [
    'Hambúrgueres',
    'Acompanhamentos',
    'Bebidas',
    'Sobremesas',
    'Combos'
  ];

  // Efeito para carregar os produtos
  useEffect(() => {
    // Simula o carregamento de categorias da API
    setCategories(mockCategories);
    
    fetchProducts();
  }, [page, rowsPerPage, searchTerm, categoryFilter, sortBy, sortOrder]);

  // Função para buscar produtos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Em um ambiente real, esta seria uma chamada de API
      // Exemplo: const response = await fetch('/api/products?page=${page+1}&limit=${rowsPerPage}...')
      
      // Simulação de dados para desenvolvimento
      setTimeout(() => {
        const mockProducts = Array(15).fill().map((_, index) => ({
          id: \`prod-\${index + 1 + page * rowsPerPage}\`,
          name: \`Hambúrguer Premium \${index + 1 + page * rowsPerPage}\`,
          description: 'Delicioso hambúrguer com blend da casa, queijo cheddar, bacon e molho especial',
          price: 29.90 + (index % 5),
          discountPrice: index % 3 === 0 ? (29.90 + (index % 5)) * 0.9 : null,
          category: mockCategories[index % mockCategories.length],
          imageUrl: 'https://via.placeholder.com/150',
          available: Math.random() > 0.2,
          featured: Math.random() > 0.7,
          created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        }));
        
        setProducts(mockProducts);
        setTotalCount(50); // Total de produtos para paginação
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Erro ao carregar produtos. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Função para abrir o diálogo de exclusão
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    try {
      // Em um ambiente real, esta seria uma chamada de API para excluir
      // Exemplo: await fetch(\`/api/products/\${selectedProduct.id}\`, { method: 'DELETE' })
      
      // Simulação para desenvolvimento
      const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
      setProducts(updatedProducts);
      setTotalCount(prev => prev - 1);
      setDeleteDialogOpen(false);
      
      // Adicionar notificação de sucesso aqui
    } catch (err) {
      setError('Erro ao excluir produto. Por favor, tente novamente.');
    }
  };

  // Função para alternar o destaque de um produto
  const toggleFeatured = async (product) => {
    try {
      // Em um ambiente real, esta seria uma chamada de API para atualizar
      // Exemplo: await fetch(\`/api/products/\${product.id}/featured\`, { method: 'PATCH', body: JSON.stringify({ featured: !product.featured }) })
      
      // Simulação para desenvolvimento
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, featured: !p.featured };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      
      // Adicionar notificação de sucesso aqui
    } catch (err) {
      setError('Erro ao atualizar produto. Por favor, tente novamente.');
    }
  };

  // Função para alternar a disponibilidade de um produto
  const toggleAvailability = async (product) => {
    try {
      // Em um ambiente real, esta seria uma chamada de API para atualizar
      // Exemplo: await fetch(\`/api/products/\${product.id}/availability\`, { method: 'PATCH', body: JSON.stringify({ available: !product.available }) })
      
      // Simulação para desenvolvimento
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, available: !p.available };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      
      // Adicionar notificação de sucesso aqui
    } catch (err) {
      setError('Erro ao atualizar produto. Por favor, tente novamente.');
    }
  };

  // Handlers para paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handler para busca
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Handler para filtro de categoria
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">Gerenciar Produtos</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            href="/dashboard/produtos/cadastrar"
          >
            Novo Produto
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar produtos"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  endAdornment: <SearchIcon color="action" />
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por Categoria</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Filtrar por Categoria"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">Todas as categorias</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  label="Ordenar por"
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="created_at">Data de Criação</MenuItem>
                  <MenuItem value="name">Nome</MenuItem>
                  <MenuItem value="price">Preço</MenuItem>
                  <MenuItem value="category">Categoria</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Destaque</TableCell>
                  <TableCell align="center">Disponível</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>Carregando produtos...</Typography>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">Nenhum produto encontrado</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={product.imageUrl}
                            alt={product.name}
                            sx={{ width: 40, height: 40, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        {product.discountPrice ? (
                          <Box>
                            <Typography 
                              variant="body2" 
                              component="span" 
                              sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}
                            >
                              {formatCurrency(product.price)}
                            </Typography>
                            <Typography variant="body2" component="span" fontWeight="bold" color="error">
                              {formatCurrency(product.discountPrice)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2">
                            {formatCurrency(product.price)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.available ? 'Ativo' : 'Inativo'} 
                          size="small" 
                          color={product.available ? 'success' : 'default'} 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color={product.featured ? 'warning' : 'default'}
                          onClick={() => toggleFeatured(product)}
                          title={product.featured ? 'Remover destaque' : 'Destacar produto'}
                        >
                          {product.featured ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color={product.available ? 'success' : 'default'}
                          onClick={() => toggleAvailability(product)}
                          title={product.available ? 'Marcar como indisponível' : 'Marcar como disponível'}
                        >
                          {product.available ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          href={`/dashboard/produtos/editar/${product.id}`}
                          title="Editar produto"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(product)}
                          title="Excluir produto"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      </Box>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir o produto "{selectedProduct?.name}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProductList;
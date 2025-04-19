/**
 * Formata um valor numérico como moeda brasileira (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

/**
 * Formata uma data e hora para o formato brasileiro (DD/MM/YYYY HH:MM)
 * @param {string|Date} date - Data e hora a ser formatada
 * @returns {string} Data e hora formatada
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formata um número com separadores de milhar
 * @param {number} value - Número a ser formatado
 * @returns {string} Número formatado
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formata um número de telefone para o formato brasileiro
 * @param {string} phone - Número de telefone
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Verifica o tamanho para determinar se é celular ou fixo
  if (cleaned.length === 11) {
    // Celular: (XX) 9XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
  } else if (cleaned.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // Se não se encaixar em nenhum padrão, retorna o valor original
  return phone;
};

/**
 * Formata um número de CPF
 * @param {string} cpf - Número de CPF
 * @returns {string} CPF formatado
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  // Remove todos os caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  
  // Aplica a máscara
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um número de CNPJ
 * @param {string} cnpj - Número de CNPJ
 * @returns {string} CNPJ formatado
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  // Remove todos os caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, '');
  
  // Aplica a máscara
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formata um CEP
 * @param {string} cep - Número de CEP
 * @returns {string} CEP formatado
 */
export const formatCEP = (cep) => {
  if (!cep) return '';
  
  // Remove todos os caracteres não numéricos
  const cleaned = cep.replace(/\D/g, '');
  
  // Aplica a máscara
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Converte minutos em formato de horas e minutos
 * @param {number} minutes - Total de minutos
 * @returns {string} Formato HH:MM
 */
export const formatMinutesToHHMM = (minutes) => {
  if (minutes === null || minutes === undefined) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Limita o tamanho de um texto adicionando reticências
 * @param {string} text - Texto a ser limitado
 * @param {number} limit - Limite de caracteres
 * @returns {string} Texto limitado
 */
export const truncateText = (text, limit = 100) => {
  if (!text) return '';
  
  if (text.length <= limit) return text;
  
  return text.slice(0, limit) + '...';
};
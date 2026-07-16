import { useState, useEffect } from 'react';

export interface Transaction {
  id: number;
  descricao: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  data: string;
  categoria: string;
}

const STORAGE_KEY = 'informei_transactions';

// Dados iniciais de exemplo
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, descricao: "Venda de Serviço", tipo: "receita", valor: 1500, data: "2026-05-25", categoria: "Serviços" },
  { id: 2, descricao: "Aluguel Escritório", tipo: "despesa", valor: 800, data: "2026-05-24", categoria: "Aluguel" },
  { id: 3, descricao: "Consultoria", tipo: "receita", valor: 2000, data: "2026-05-23", categoria: "Serviços" },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar transações do localStorage na inicialização
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
        setTransactions(INITIAL_TRANSACTIONS);
      }
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }
    setIsLoaded(true);
  }, []);

  // Salvar transações no localStorage sempre que mudarem
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      // Disparar evento customizado para notificar outras abas/componentes
      window.dispatchEvent(new CustomEvent('transactionsUpdated', { detail: transactions }));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
    };
    setTransactions([...transactions, newTransaction]);
    return newTransaction;
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getTransactionsByPeriod = (period: 'ano' | 'mes' | 'semana', month?: number, year?: number) => {
    const now = new Date();
    const currentYear = year || now.getFullYear();
    const currentMonth = month || now.getMonth() + 1;

    return transactions.filter(tx => {
      const txDate = new Date(tx.data);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth() + 1;

      if (period === 'ano') {
        return txYear === currentYear;
      } else if (period === 'mes') {
        return txYear === currentYear && txMonth === currentMonth;
      } else if (period === 'semana') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return txDate >= weekAgo && txDate <= now;
      }
      return true;
    });
  };

  const calculateStats = (period: 'ano' | 'mes' | 'semana', month?: number, year?: number) => {
    const filtered = getTransactionsByPeriod(period, month, year);
    const totalReceita = filtered
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);
    const totalDespesa = filtered
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);

    return {
      totalReceita,
      totalDespesa,
      saldo: totalReceita - totalDespesa,
      transacoes: filtered,
    };
  };

  return {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByPeriod,
    calculateStats,
  };
}

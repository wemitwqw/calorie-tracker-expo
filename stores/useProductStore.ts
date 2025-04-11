import { Product } from '@/types/product';
import { create } from 'zustand';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  isLoading: boolean;

  setIsLoading: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
  addProductToState: (product: Product) => void;
  updateProductInState: (id: string, updates: Partial<Product>) => void;
  deleteProductFromState: (id: string) => void;
  setSearchQuery: (query: string) => void;
  filterProducts: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  searchQuery: '',
  isLoading: false,

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  setProducts: (products) => {
    set({ products });
    get().filterProducts();
  },
  
  addProductToState: (product) => {
    const { products } = get();
    set({ products: [product, ...products] });
    get().filterProducts();
  },
  
  updateProductInState: (id, updates) => {
    const { products } = get();
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    );
    set({ products: updatedProducts });
    get().filterProducts();
  },
  
  deleteProductFromState: (id) => {
    const { products } = get();
    const filteredProducts = products.filter(product => product.id !== id);
    set({ products: filteredProducts });
    get().filterProducts();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterProducts();
  },

  filterProducts: () => {
    const { products, searchQuery } = get();
    
    if (!searchQuery.trim()) {
      set({ filteredProducts: products });
      return;
    }
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    set({ filteredProducts: filtered });
  }
}));
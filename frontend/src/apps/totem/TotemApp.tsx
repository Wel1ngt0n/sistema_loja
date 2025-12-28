import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import api from '../../services/api';
import type { Product, Category } from '../../types';
import ProductCard from './components/ProductCard';
import ProductKitModal from './components/ProductKitModal';
import CartDrawer from './components/CartDrawer';
import OrderSuccessScreen from './components/OrderSuccessScreen';
import UpsellModal from './components/UpsellModal';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import OfflineBanner from './components/OfflineBanner';
import AppHeader from './components/AppHeader';
import CategoryChipsBar from './components/CategoryChipsBar';

interface CartItem {
    product: Product;
    qty: number;
    notes?: string;
    kitOptions?: string[]; // M5: Structured options
}

const TotemApp: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);

    // UI State
    const [cartOpen, setCartOpen] = useState(false);
    const [kitModalOpen, setKitModalOpen] = useState(false);
    const [selectedKitProduct, setSelectedKitProduct] = useState<Product | null>(null);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Upsell
    const [upsellOpen, setUpsellOpen] = useState(false);
    const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

    const handleInactivity = () => {
        // Resetar aplicação
        setCart([]);
        setCartOpen(false);
        setKitModalOpen(false);
        setUpsellOpen(false);
        setSearchTerm('');
        setLastOrderNumber(null);
        // Voltar para primeira categoria
        if (categories.length > 0) setActiveCategory(categories[0].id);
    };

    useInactivityTimer(45000, handleInactivity);

    useEffect(() => {
        loadMenu();

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const loadMenu = async () => {
        const CACHE_KEY = 'totem_menu_cache';
        try {
            const token = localStorage.getItem('device_token') || 'dev_totem_01';
            const res = await api.get('/totem/menu', {
                headers: { 'X-Device-Token': token }
            });

            const rawData = res.data;
            // Salvar no cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(rawData));

            processMenuData(rawData);
            setIsOffline(false);
        } catch (error) {
            console.error('Erro ao carregar menu, tentando cache', error);
            setIsOffline(true);

            // Tentar carregar do cache
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                processMenuData(JSON.parse(cached));
            }
        } finally {
            setLoading(false);
        }
    };

    const processMenuData = (data: any) => {
        setCategories(data.categories);
        const parsedProducts = data.products.map((p: any) => ({
            ...p,
            kit_options: (typeof p.kit_options === 'string' && p.kit_options.trim() !== '')
                ? JSON.parse(p.kit_options)
                : p.kit_options
        }));
        setProducts(parsedProducts);
        // Atualiza categoria ativa apenas se não tiver nenhuma selecionada ainda ou se estiver vazia
        // Mas para garantir consistência inicial, resetamos se necessário
        if (data.categories.length > 0 && activeCategory === null) {
            setActiveCategory(data.categories[0].id);
        }
    };

    const handleProductClick = (product: Product) => {
        if (product.is_kit) {
            setSelectedKitProduct(product);
            setKitModalOpen(true);
        } else {
            addToCart(product, 1);
        }
    };

    const addToCart = (product: Product, qty: number, notes?: string, kitOptions?: string[]) => {
        // Check exact match including notes and kitOptions
        // Simples verification: notes usually represent kitOptions, so matching notes is enough for now
        const existingIndex = cart.findIndex(item => item.product.id === product.id && item.notes === notes);

        if (existingIndex >= 0) {
            const newCart = [...cart];
            newCart[existingIndex].qty += qty;
            setCart(newCart);
        } else {
            setCart([...cart, { product, qty, notes, kitOptions }]);
        }
        setCartOpen(true);
    };

    const handleUpdateQty = (index: number, delta: number) => {
        const newCart = [...cart];
        const item = newCart[index];
        item.qty += delta;
        if (item.qty <= 0) {
            newCart.splice(index, 1);
        }
        setCart(newCart);
    };

    const handleRemoveItem = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleKitConfirm = (product: Product, options: string[]) => {
        const notes = options.length > 0 ? `Opções: ${options.join(', ')}` : undefined;
        // M5: Add kitOptions to cart item
        addToCart(product, 1, notes, options);
        setKitModalOpen(false);
        setSelectedKitProduct(null);
    };

    const handlePreCheckout = () => {
        if (cart.length === 0) return;

        // Filtar produtos de upsell NÃO presentes no carrinho
        const potentialUpsell = products.filter(p => p.upsell && !cart.some(c => c.product.id === p.id));

        if (potentialUpsell.length > 0) {
            // Sugere até 3 itens (ex: aleatórios ou primeiros)
            setUpsellProducts(potentialUpsell.slice(0, 3));
            setUpsellOpen(true);
            setCartOpen(false);
        } else {
            handleFinalCheckout();
        }
    };

    const handleUpsellAdd = (product: Product) => {
        addToCart(product, 1);

        // Remove da lista de sugestões local para não sugerir de novo se reabrir (opcional)
        // Aqui fechamos o modal se for o último item escolhido ou voltamos para revisão
        setUpsellProducts(prev => prev.filter(p => p.id !== product.id));
        setUpsellOpen(false);
        setCartOpen(true); // Reabre carrinho para confirmar adição
    };

    const handleFinalCheckout = async () => {
        if (cart.length === 0 || isCheckingOut) return;

        setIsCheckingOut(true);
        const token = localStorage.getItem('device_token') || 'dev_totem_01';

        const payload = {
            origin: 'TOTEM',
            items: cart.map(item => ({
                product_id: item.product.id,
                qty: item.qty,
                notes: item.notes,
                kit_selections: item.kitOptions ? { options: item.kitOptions } : null // M5: Sending structured
            })),
            notes: ''
        };

        try {
            const res = await api.post('/orders', payload, {
                headers: { 'X-Device-Token': token }
            });

            setCart([]);
            setCartOpen(false);
            setUpsellOpen(false);
            setLastOrderNumber(res.data.order_number);
        } catch (error) {
            console.error(error);
            alert('Erro ao enviar pedido. Verifique conexão.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory ? p.category_id === activeCategory : true;
        const matchesSearch = searchTerm
            ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        // Se tiver busca, ignora categoria (busca global) ou mantém filtro? 
        // Pedido do user: "Campo de busca no topo (filtra produtos da categoria atual ou global)"
        // Implementação: Busca global é melhor UX. Se tiver busca, ignora categoria.
        if (searchTerm) return matchesSearch;
        return matchesCategory;
    });

    if (loading) return <CircularProgress />;

    return (
        <Box display="flex" minHeight="100vh" flexDirection="column" bgcolor="background.default">
            <AppHeader
                cartCount={cart.reduce((acc, item) => acc + item.qty, 0)}
                cartTotal={cart.reduce((acc, item) => acc + (item.qty * item.product.price), 0)}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onOpenCart={() => setCartOpen(true)}
            />

            <CategoryChipsBar
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            <Box display="flex" flexGrow={1} overflow="auto" p={{ xs: 2, md: 3 }}>
                <Box display="flex" flexWrap="wrap" gap={{ xs: 2, md: 3 }} width="100%" alignContent="flex-start">
                    {filteredProducts.map(prod => (
                        <Box key={prod.id} width={{ xs: '100%', sm: '48%', md: '31%', lg: '23%' }}>
                            <ProductCard product={prod} onAdd={handleProductClick} />
                        </Box>
                    ))}
                </Box>
            </Box>

            {selectedKitProduct && (
                <ProductKitModal
                    open={kitModalOpen}
                    product={selectedKitProduct}
                    onClose={() => setKitModalOpen(false)}
                    onConfirm={handleKitConfirm}
                />
            )}

            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveItem}
                onCheckout={handlePreCheckout}
            />

            <UpsellModal
                open={upsellOpen}
                products={upsellProducts}
                onClose={handleFinalCheckout}
                onAddProduct={handleUpsellAdd}
            />

            {lastOrderNumber && (
                <OrderSuccessScreen
                    orderNumber={lastOrderNumber}
                    onReset={() => setLastOrderNumber(null)}
                />
            )}

            <OfflineBanner visible={isOffline} />
        </Box>
    );
};

export default TotemApp;

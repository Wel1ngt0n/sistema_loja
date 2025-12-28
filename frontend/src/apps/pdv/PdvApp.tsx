import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Chip } from '@mui/material';
import api from '../../services/api';
import type { CashierSession, Product, SaleItem, PaymentMethod } from '../../types';
import CashierControl from './components/CashierControl';
import CatalogGrid from './components/CatalogGrid';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import DiscountModal from './components/DiscountModal';
import CashFlowModal from './components/CashFlowModal';
import OrderQueue from './components/OrderQueue';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CustomerSelection from './components/CustomerSelection';
import type { Order } from '../../types';

const PdvApp: React.FC = () => {
    const { user } = useAuth();
    const [cashierSession, setCashierSession] = useState<CashierSession | null>(null);
    const [loading, setLoading] = useState(true);




    // Customer State
    const [selectedCustomer, setSelectedCustomer] = useState<{ id: number; name: string } | null>(null);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);

    // Cart State
    const [cartItems, setCartItems] = useState<SaleItem[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    // Discount State
    const [discountType, setDiscountType] = useState<'FIXED' | 'PERCENT'>('FIXED');
    const [discountValue, setDiscountValue] = useState(0);

    // UI State
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [cashFlowModalOpen, setCashFlowModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        checkCashierStatus();

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F4') setPaymentModalOpen(true);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const checkCashierStatus = async () => {
        try {
            const res = await api.get('/cashier/status');
            if (res.data.status === 'OPEN') {
                setCashierSession(res.data);
            } else {
                setCashierSession(null);
            }
        } catch (error) {
            console.error('Erro ao verificar caixa', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = (product: Product) => {
        const newItem: SaleItem = {
            product_id: product.id,
            product_name: product.name,
            qty: 1,
            unit_price: product.price,
            total_price: product.price
        };
        setCartItems([...cartItems, newItem]);
    };

    const handleSelectOrder = (order: Order) => {
        if (cartItems.length > 0) {
            if (!window.confirm("Substituir itens atuais pelo pedido selecionado?")) return;
        }

        const newItems: SaleItem[] = order.items.map(item => ({
            product_id: item.product_id,
            product_name: item.product_name || `Item ${item.product_id}`,
            qty: item.qty,
            unit_price: item.unit_price,
            total_price: item.qty * item.unit_price,
            notes: item.notes
        }));

        setCartItems(newItems);
        setSelectedOrderId(order.id);
        setDiscountValue(0);
        setSelectedCustomer(null); // Reset customer when loading order, or fetch from order if available
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    const handleClearCart = () => {
        if (window.confirm("Limpar carrinho?")) {
            setCartItems([]);
            setDiscountValue(0);
            setSelectedOrderId(null);
            setSelectedCustomer(null);
        }
    };

    const handleApplyDiscount = (type: 'FIXED' | 'PERCENT', value: number) => {
        setDiscountType(type);
        setDiscountValue(value);
    };

    const handleConfirmPayment = async (method: PaymentMethod, amountReceived: number): Promise<number> => {
        if (!cashierSession) throw new Error("Caixa fechado");

        try {
            const payload = {
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    qty: item.qty,
                    unit_price: item.unit_price,
                    notes: item.notes
                })),
                payments: [{
                    method: method,
                    amount: amountReceived // Backend will calculate change
                }],
                discount: { type: discountType, value: discountValue },
                customer_id: selectedCustomer?.id || null,
                order_id: selectedOrderId
            };

            const res = await api.post('/pdv/sales', payload);
            // alert("Venda realizada com sucesso!"); <- Handled in PaymentModal now via Success UI

            // Reset
            setCartItems([]);
            setDiscountValue(0);
            setSelectedOrderId(null);
            setSelectedCustomer(null);
            // setPaymentModalOpen(false); <- Handled by user clicking "Nova Venda"
            checkCashierStatus(); // Update balance

            return res.data.id;
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao realizar venda");
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    if (loading) return <Typography>Carregando...</Typography>;

    if (!cashierSession) {
        return <CashierControl session={null} onSessionChange={setCashierSession} />;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.total_price, 0);

    let discountAmount = 0;
    if (discountType === 'FIXED') {
        discountAmount = discountValue;
    } else {
        discountAmount = subtotal * (discountValue / 100);
    }

    const total = Math.max(0, subtotal - discountAmount);

    return (
        <Box height="100vh" display="flex" flexDirection="column" bgcolor="#F6F7F9">
            {/* Header */}
            <Paper
                elevation={2}
                sx={{
                    p: 1.5,
                    px: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 0,
                    zIndex: 10
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6" fontWeight="bold">Sistema PDV</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>v2.0</Typography>
                    {selectedOrderId && (
                        <Chip label={`Pedido #${selectedOrderId}`} color="warning" size="small" onDelete={handleClearCart} />
                    )}
                </Box>
                <Box display="flex" alignItems="center" gap={3}>
                    <Typography>Op: {cashierSession.user_name}</Typography>
                    <Box
                        bgcolor="primary.main"
                        px={2} py={0.5}
                        borderRadius={1}
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.light' } }}
                        onClick={() => setCashFlowModalOpen(true)}
                        title="Clique para realizar Sangria ou Suprimento"
                    >
                        <Typography fontWeight="bold">R$ {cashierSession.current_balance.toFixed(2)}</Typography>
                    </Box>

                    <Button
                        color="error"
                        size="small"
                        variant="contained"
                        sx={{
                            fontWeight: 'bold',
                            boxShadow: 2,
                            mr: 2,
                            '&:hover': { bgcolor: 'error.dark' }
                        }}
                        onClick={() => {
                            if (window.confirm("Deseja realmente fechar o caixa agora?")) {
                                // For MVP we just call the API. Ideally open a modal to confirm values.
                                api.post('/cashier/close', { end_balance: cashierSession.current_balance })
                                    .then(() => checkCashierStatus())
                                    .catch(err => alert("Erro ao fechar caixa: " + err.response?.data?.message));
                            }
                        }}
                        startIcon={<PointOfSaleIcon />}
                    >
                        Fechar Caixa
                    </Button>
                    {(user?.is_super_admin || user?.roles.includes('ADMIN')) && (
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => navigate('/admin')}
                            startIcon={<AdminPanelSettingsIcon />}
                            sx={{ mr: 1 }}
                        >
                            Admin
                        </Button>
                    )}
                    <Button color="inherit" size="small" onClick={handleLogout} startIcon={<LogoutIcon />}>Sair</Button>
                </Box>
            </Paper>

            {/* Main Layout - 3 Columns */}
            <Box flexGrow={1} p={2} overflow="hidden">
                <Grid container spacing={2} sx={{ height: '100%' }}>
                    {/* Left: Catalog */}
                    <Grid size={5} sx={{ height: '100%' }}>
                        <CatalogGrid onAddProduct={handleAddProduct} />
                    </Grid>

                    {/* Center: Cart */}
                    <Grid size={4} sx={{ height: '100%' }}>
                        <Cart
                            items={cartItems}
                            subtotal={subtotal}
                            discount={discountAmount}
                            total={total}
                            onRemoveItem={handleRemoveItem}
                            onClearCart={handleClearCart}
                            onPay={() => setPaymentModalOpen(true)}
                            onAddDiscount={() => setDiscountModalOpen(true)}
                            onSelectCustomer={() => setCustomerModalOpen(true)}
                            selectedCustomer={selectedCustomer}
                        />
                    </Grid>

                    {/* Right: Orders */}
                    <Grid size={3} sx={{ height: '100%' }}>
                        <OrderQueue onSelectOrder={handleSelectOrder} />
                    </Grid>
                </Grid>
            </Box>

            <PaymentModal
                open={paymentModalOpen}
                total={total}
                onClose={() => setPaymentModalOpen(false)}
                onConfirm={handleConfirmPayment}
            />

            <DiscountModal
                open={discountModalOpen}
                onClose={() => setDiscountModalOpen(false)}
                onApply={handleApplyDiscount}
            />

            <CustomerSelection
                open={customerModalOpen}
                onClose={() => setCustomerModalOpen(false)}
                onSelect={setSelectedCustomer}
            />

            <CashFlowModal
                open={cashFlowModalOpen}
                onClose={() => setCashFlowModalOpen(false)}
                onSuccess={checkCashierStatus}
            />
        </Box>
    );
};

export default PdvApp;

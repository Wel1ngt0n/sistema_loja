import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, Typography, Box } from '@mui/material';
import type { PaymentMethod } from '../../../types';
import api from '../../../services/api';
interface PaymentModalProps {
    open: boolean;
    total: number;
    onClose: () => void;
    onConfirm: (method: PaymentMethod, amountReceived: number) => Promise<number>; // Returns saleId
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, total, onClose, onConfirm }) => {
    const [method, setMethod] = useState<PaymentMethod | null>(null);
    const [amountReceived, setAmountReceived] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Success State
    const [successSaleId, setSuccessSaleId] = useState<number | null>(null);

    // Auto-select CASH on open or reset
    useEffect(() => {
        if (open) {
            setMethod(null);
            setAmountReceived('');
            setSuccessSaleId(null);
            setLoading(false);
        }
    }, [open]);

    // Quando seleciona método que não é dinheiro, auto-preenche o valor
    const handleSelectMethod = (m: PaymentMethod) => {
        setMethod(m);
        if (m !== 'CASH') {
            setAmountReceived(total.toFixed(2));
        } else {
            setAmountReceived(''); // Cash operator usually types it
        }
    };

    const handleConfirm = async () => {
        if (!method) return;
        setLoading(true);
        try {
            const saleId = await onConfirm(method, received);
            setSuccessSaleId(saleId);
        } catch (error) {
            // Error handling is done in onConfirm (alert) or re-throw
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = async () => {
        if (!successSaleId) return;
        try {
            await api.post(`/pdv/sales/${successSaleId}/print`);
            alert("Enviado para impressão!");
        } catch (error) {
            alert("Erro ao imprimir.");
        }
    };

    const received = parseFloat(amountReceived) || 0;
    const change = method === 'CASH' ? received - total : 0;
    const canConfirm = method && received >= (total - 0.01); // float tolerance

    if (successSaleId) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogContent sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h4" color="success.main" gutterBottom>VENDA REALIZADA!</Typography>
                    <Typography variant="h6">Venda #{successSaleId}</Typography>

                    <Box mt={4} display="flex" flexDirection="column" gap={2}>
                        <Button variant="contained" size="large" onClick={handlePrint}>
                            IMPRIMIR COMPROVANTE
                        </Button>
                        <Button variant="outlined" size="large" onClick={onClose}>
                            NOVA VENDA (Fechar)
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Finalizar Pagamento</DialogTitle>
            <DialogContent dividers>
                <Box textAlign="center" mb={3}>
                    <Typography variant="h3" color="primary" fontWeight="bold">R$ {total.toFixed(2)}</Typography>
                    <Typography color="text.secondary">Total a Pagar</Typography>
                </Box>

                <Grid container spacing={2} mb={3}>
                    <Grid size={6}>
                        <Button
                            variant={method === 'CASH' ? "contained" : "outlined"}
                            fullWidth size="large" onClick={() => handleSelectMethod('CASH')}
                            color="success"
                        >DINHEIRO</Button>
                    </Grid>
                    <Grid size={6}>
                        <Button
                            variant={method === 'PIX' ? "contained" : "outlined"}
                            fullWidth size="large" onClick={() => handleSelectMethod('PIX')}
                        >PIX</Button>
                    </Grid>
                    <Grid size={6}>
                        <Button
                            variant={method === 'CREDIT_CARD' ? "contained" : "outlined"}
                            fullWidth size="large" onClick={() => handleSelectMethod('CREDIT_CARD')}
                        >CRÉDITO</Button>
                    </Grid>
                    <Grid size={6}>
                        <Button
                            variant={method === 'DEBIT_CARD' ? "contained" : "outlined"}
                            fullWidth size="large" onClick={() => handleSelectMethod('DEBIT_CARD')}
                        >DÉBITO</Button>
                    </Grid>
                </Grid>

                {method === 'CASH' && (
                    <Box>
                        <TextField
                            label="Valor Recebido (R$)"
                            type="number"
                            fullWidth
                            variant="filled"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            autoFocus
                            inputProps={{ style: { fontSize: 24 } }}
                            disabled={loading}
                        />
                        <Box mt={2} p={2} bgcolor={change >= 0 ? "#e8f5e9" : "#ffebee"} borderRadius={1} textAlign="center">
                            <Typography variant="h6">Troco</Typography>
                            <Typography variant="h4" color={change >= 0 ? "success.main" : "error"}>
                                R$ {change.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} size="large" color="inherit" disabled={loading}>Cancelar</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    size="large"
                    disabled={!canConfirm || loading}
                >
                    {loading ? "PROCESSANDO..." : "CONFIRMAR"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentModal;

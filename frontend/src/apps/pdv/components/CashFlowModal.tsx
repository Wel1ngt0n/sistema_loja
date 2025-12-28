import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, Alert } from '@mui/material';
import api from '../../../services/api';

interface CashFlowModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CashFlowModal: React.FC<CashFlowModalProps> = ({ open, onClose, onSuccess }) => {
    const [type, setType] = useState<'SUPPLY' | 'WITHDRAW'>('SUPPLY');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setType('SUPPLY');
            setAmount('');
            setReason('');
            setError(null);
            setLoading(false);
        }
    }, [open]);

    const handleConfirm = async () => {
        if (!amount || !reason) {
            setError("Preencha todos os campos.");
            return;
        }

        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            setError("Valor inválido.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('/cashier/movements', {
                type,
                amount: val,
                reason
            });
            alert("Movimentação registrada com sucesso!");
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao registrar movimentação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Movimentação de Caixa</DialogTitle>
            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        select
                        label="Tipo de Movimento"
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        fullWidth
                    >
                        <MenuItem value="SUPPLY">Suprimento (Entrada)</MenuItem>
                        <MenuItem value="WITHDRAW">Sangria (Saída)</MenuItem>
                    </TextField>

                    <TextField
                        label="Valor (R$)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        inputProps={{ step: "0.01" }}
                    />

                    <TextField
                        label="Motivo / Justificativa"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={loading}>Cancelar</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={type === 'SUPPLY' ? 'primary' : 'error'}
                    disabled={loading}
                >
                    {loading ? "Processando..." : (type === 'SUPPLY' ? "Adicionar Suprimento" : "Realizar Sangria")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CashFlowModal;

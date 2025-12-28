import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography, Box } from '@mui/material';
import api from '../../../services/api';
import type { CashierSession } from '../../../types';

interface CashierControlProps {
    session: CashierSession | null;
    onSessionChange: (session: CashierSession | null) => void;
}

const CashierControl: React.FC<CashierControlProps> = ({ session, onSessionChange }) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpenCashier = async () => {
        setLoading(true);
        try {
            const res = await api.post('/cashier/open', { start_balance: Number(amount) });
            onSessionChange(res.data);
            setOpen(false);
        } catch (error) {
            alert('Erro ao abrir caixa');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseCashier = async () => {
        setLoading(true);
        try {
            const res = await api.post('/cashier/close', { end_balance: Number(amount) });
            onSessionChange(null); // Clear session locally
            setOpen(false);
            alert(`Caixa fechado. Saldo Final: R$ ${res.data.current_balance}`);
        } catch (error) {
            alert('Erro ao fechar caixa');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" p={4}>
                <Typography variant="h5" gutterBottom>Caixa Fechado</Typography>
                <Button variant="contained" size="large" onClick={() => setOpen(true)}>Abrir Caixa</Button>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Abrir Caixa</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Saldo Inicial (R$)"
                            type="number"
                            fullWidth
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleOpenCashier} disabled={loading}>Confirmar Abertura</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    return (
        <Box>
            <Button variant="outlined" color="error" onClick={() => setOpen(true)}>Fechar Caixa</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Fechar Caixa</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Saldo Atual (Sistema): R$ {session.current_balance.toFixed(2)}</Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Saldo Final (Conferência)"
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCloseCashier} disabled={loading} color="error">Confirmar Fechamento</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CashierControl;

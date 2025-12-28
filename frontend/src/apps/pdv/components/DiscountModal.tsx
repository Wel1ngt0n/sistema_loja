import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, InputAdornment } from '@mui/material';

interface DiscountModalProps {
    open: boolean;
    onClose: () => void;
    onApply: (type: 'FIXED' | 'PERCENT', value: number) => void;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ open, onClose, onApply }) => {
    const [type, setType] = useState<'FIXED' | 'PERCENT'>('FIXED');
    const [value, setValue] = useState('');

    const handleApply = () => {
        const numVal = parseFloat(value);
        if (numVal > 0) {
            onApply(type, numVal);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Aplicar Desconto</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <FormControl fullWidth>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={type}
                            label="Tipo"
                            onChange={(e) => setType(e.target.value as any)}
                        >
                            <MenuItem value="FIXED">Valor Fixo (R$)</MenuItem>
                            <MenuItem value="PERCENT">Porcentagem (%)</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Valor"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{type === 'FIXED' ? 'R$' : '%'}</InputAdornment>,
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleApply} variant="contained" disabled={!value}>Aplicar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DiscountModal;

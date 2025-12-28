import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Product, KitOptionGroup } from '../../../types';

interface ProductKitModalProps {
    open: boolean;
    product: Product;
    onClose: () => void;
    onConfirm: (product: Product, selectedOptions: string[]) => void;
}

const ProductKitModal: React.FC<ProductKitModalProps> = ({ open, product, onClose, onConfirm }) => {
    // State: map of group index -> selected items array
    const [selections, setSelections] = useState<Record<number, string[]>>({});

    const handleToggleOption = (groupIndex: number, item: string, max: number) => {
        setSelections(prev => {
            const current = prev[groupIndex] || [];
            if (current.includes(item)) {
                // Remove
                return { ...prev, [groupIndex]: current.filter(i => i !== item) };
            } else {
                // Add
                if (current.length >= max) return prev; // Max limit reached
                return { ...prev, [groupIndex]: [...current, item] };
            }
        });
    };

    const isGroupValid = (group: KitOptionGroup, selected: string[] = []) => {
        return selected.length >= group.min && selected.length <= group.max;
    };

    const canConfirm = () => {
        if (!product.kit_options) return true;
        return product.kit_options.every((group, idx) => isGroupValid(group, selections[idx]));
    };

    const handleConfirm = () => {
        const allSelected = Object.values(selections).flat();
        onConfirm(product, allSelected);
    };

    if (!product) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>
                {product.name}
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                    Personalize seu pedido abaixo
                </Typography>

                <Box mt={2}>
                    {product.kit_options?.map((group, groupIdx) => {
                        const selectedCount = (selections[groupIdx] || []).length;
                        const isValid = isGroupValid(group, selections[groupIdx]);

                        return (
                            <Box key={groupIdx} mb={4}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Typography variant="h6" fontWeight="700" color="text.primary">
                                        {group.title}
                                    </Typography>
                                    <Chip
                                        label={`${selectedCount}/${group.max}`}
                                        color={isValid ? "success" : "default"}
                                        size="small"
                                        variant={isValid ? "filled" : "outlined"}
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>

                                <Box display="flex" flexWrap="wrap" gap={1.5}>
                                    {group.items.map(item => {
                                        const isSelected = (selections[groupIdx] || []).includes(item);
                                        return (
                                            <Chip
                                                key={item}
                                                label={item}
                                                clickable
                                                onClick={() => handleToggleOption(groupIdx, item, group.max)}
                                                color={isSelected ? "primary" : "default"}
                                                variant={isSelected ? "filled" : "outlined"}
                                                icon={isSelected ? <CheckCircleIcon /> : undefined}
                                                disabled={!isSelected && selectedCount >= group.max}
                                                sx={{
                                                    fontSize: '1rem',
                                                    height: 48,
                                                    borderRadius: 99,
                                                    px: 1,
                                                    borderColor: isSelected ? 'transparent' : 'grey.300',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        bgcolor: isSelected ? 'primary.dark' : 'grey.50'
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    size="large"
                    sx={{ width: '30%', borderRadius: 99, fontWeight: 'bold' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!canConfirm()}
                    size="large"
                    fullWidth
                    sx={{ borderRadius: 99, height: 56, fontSize: '1.1rem', fontWeight: 800 }}
                >
                    Confirmar Personalização
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductKitModal;

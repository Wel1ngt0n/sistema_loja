import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, IconButton, Paper, Autocomplete, Grid, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Product, KitOptionGroup } from '../../../types';

interface KitEditorProps {
    value: KitOptionGroup[] | null;
    onChange: (groups: KitOptionGroup[]) => void;
    availableProducts: Product[];
}

const KitEditor: React.FC<KitEditorProps> = ({ value, onChange, availableProducts }) => {
    const [groups, setGroups] = useState<KitOptionGroup[]>(value || []);

    // Sync internal state if prop changes remotely (unlikely but good practice)
    useEffect(() => {
        setGroups(value || []);
    }, [value]);

    const notifyChange = (newGroups: KitOptionGroup[]) => {
        setGroups(newGroups);
        onChange(newGroups);
    };

    const addGroup = () => {
        const newGroup: KitOptionGroup = {
            title: 'Novo Grupo',
            min: 1,
            max: 1,
            items: []
        };
        notifyChange([...groups, newGroup]);
    };

    const removeGroup = (index: number) => {
        const newGroups = groups.filter((_, i) => i !== index);
        notifyChange(newGroups);
    };

    const updateGroup = (index: number, field: keyof KitOptionGroup, val: any) => {
        const newGroups = [...groups];
        newGroups[index] = { ...newGroups[index], [field]: val };
        notifyChange(newGroups);
    };

    const addItem = (groupIndex: number, productName: string) => {
        const newGroups = [...groups];
        const group = newGroups[groupIndex];
        if (!group.items.includes(productName)) {
            group.items = [...group.items, productName];
            notifyChange(newGroups);
        }
    };

    const removeItem = (groupIndex: number, itemIndex: number) => {
        const newGroups = [...groups];
        const group = newGroups[groupIndex];
        group.items = group.items.filter((_, i) => i !== itemIndex);
        notifyChange(newGroups);
    };

    return (
        <Box mt={2} border={1} borderColor="divider" borderRadius={2} p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Configuração do Kit</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={addGroup}>
                    Adicionar Grupo
                </Button>
            </Box>

            {groups.length === 0 && (
                <Typography color="text.secondary" align="center">Nenhum grupo de opções configurado.</Typography>
            )}

            {groups.map((group, gIdx) => (
                <Card key={gIdx} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="subtitle1" fontWeight="bold">Grupo #{gIdx + 1}</Typography>
                            <IconButton size="small" color="error" onClick={() => removeGroup(gIdx)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <Grid container spacing={2} mb={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Título (ex: Escolha a Carne)"
                                    fullWidth
                                    value={group.title}
                                    onChange={e => updateGroup(gIdx, 'title', e.target.value)}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <TextField
                                    label="Min"
                                    type="number"
                                    fullWidth
                                    value={group.min}
                                    onChange={e => updateGroup(gIdx, 'min', Number(e.target.value))}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <TextField
                                    label="Max"
                                    type="number"
                                    fullWidth
                                    value={group.max}
                                    onChange={e => updateGroup(gIdx, 'max', Number(e.target.value))}
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="caption" color="text.secondary">Opções Disponíveis:</Typography>

                        {/* Selector de Produtos */}
                        <Box display="flex" gap={1} mt={1} mb={2} alignItems="center">
                            <Autocomplete
                                options={availableProducts}
                                getOptionLabel={(option) => option.name}
                                sx={{ flexGrow: 1 }}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Buscar Produto para adicionar..." />}
                                onChange={(_, newValue) => {
                                    if (newValue) {
                                        addItem(gIdx, newValue.name);
                                    }
                                }}
                                // Reset value after selection can be tricky in uncontrolled, but lets try controlled null
                                value={null}
                            />
                        </Box>

                        {/* Lista de Itens Selecionados */}
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {group.items.map((item, iIdx) => (
                                <Paper key={iIdx} variant="outlined" sx={{ p: 0.5, px: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2">{item}</Typography>
                                    <IconButton size="small" onClick={() => removeItem(gIdx, iIdx)}>
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </Paper>
                            ))}
                            {group.items.length === 0 && <Typography variant="caption" color="text.disabled">Nenhum item adicionado.</Typography>}
                        </Box>

                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default KitEditor;

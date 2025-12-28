import React from 'react';
import { Box, Typography, Button, Badge, TextField, InputAdornment } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

interface AppHeaderProps {
    cartCount: number;
    cartTotal: number;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onOpenCart: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ cartCount, cartTotal, searchTerm, onSearchChange, onOpenCart }) => {
    return (
        <Box
            component="header"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                height: { xs: 64, md: 80 }, // Menor em mobile
                px: { xs: 2, md: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 3
            }}
        >
            {/* Esquerda: Título */}
            <Typography
                variant="h4"
                fontWeight="800"
                sx={{
                    letterSpacing: '-0.5px',
                    fontSize: { xs: '1.25rem', md: '2.125rem' }, // Responsivo
                    display: { xs: 'none', sm: 'block' } // Esconde em mobile muito pequeno se precisar, ou mantem
                }}
            >
                Autoatendimento
            </Typography>

            {/* Centro: Busca Grande */}
            <Box sx={{ flexGrow: 1, maxWidth: 600, mx: { xs: 2, md: 4 } }}>
                <TextField
                    fullWidth
                    placeholder="Buscar..." // Texto curto em mobile
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    variant="outlined"
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 999,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 999,
                            pl: 2,
                            height: { xs: 44, md: 56 }, // Input menor em mobile
                            fontSize: { xs: '0.9rem', md: '1rem' }
                        },
                        '& fieldset': { border: 'none' }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            {/* Direita: Botão Carrinho Pill */}
            <Box>
                <Badge badgeContent={cartCount} color="error" max={99}
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem', height: 20, minWidth: 20 } }}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onOpenCart}
                        startIcon={<ShoppingCartIcon />}
                        sx={{
                            borderRadius: 999,
                            height: { xs: 44, md: 56 }, // Botão menor em mobile
                            px: { xs: 2, md: 3 },
                            fontSize: { xs: '0.875rem', md: '1.1rem' },
                            fontWeight: 700,
                            bgcolor: 'white',
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.light',
                            },
                            // Mobile: Esconder texto "Ver Carrinho", mostrar só valor ou ícone?
                            // User pediu tablet. Tablet cabe texto. Mobile talvez não.
                            // Vamos manter texto mas ajustar tamanho.
                        }}
                    >
                        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, mr: 1 }}>
                            Ver Carrinho •
                        </Box>
                        R$ {cartTotal.toFixed(2)}
                    </Button>
                </Badge>
            </Box>
        </Box>
    );
};

export default AppHeader;

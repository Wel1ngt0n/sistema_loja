import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import type { Category } from '../../../types';

interface CategoryChipsBarProps {
    categories: Category[];
    activeCategory: number | null;
    onSelectCategory: (id: number) => void;
}

const CategoryChipsBar: React.FC<CategoryChipsBarProps> = ({ categories, activeCategory, onSelectCategory }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5, // Espaçamento um pouco menor para coesão
                overflowX: 'auto',
                p: { xs: 2, md: 2.5 },
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: { xs: 64, md: 80 },
                zIndex: 1000,
                // Hide scrollbar
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                // Mascara de fade nas pontas? (Opcional, pode ser complexo implementar em pure CSS simples aqui, vamos focar no estilo dos botões)
            }}
        >
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <ButtonBase
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        sx={{
                            height: 48,
                            // O user pediu "mais bonito". O estilo chip 999 é seguro. 
                            // Vamos tentar algo mais "Apple": background cinza claro para inativos.
                            borderRadius: 999,
                            px: 3,
                            minWidth: 'auto',
                            bgcolor: isActive ? 'primary.main' : 'grey.100',
                            color: isActive ? 'common.white' : 'text.primary',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            flexShrink: 0,
                            boxShadow: isActive ? 4 : 0, // Sombra suave no ativo
                            border: '1px solid',
                            borderColor: isActive ? 'primary.main' : 'transparent', // Sem borda cinza, apenas fundo
                            '&:hover': {
                                bgcolor: isActive ? 'primary.dark' : 'grey.200',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        <Typography
                            variant="button"
                            sx={{
                                fontWeight: isActive ? 800 : 600,
                                textTransform: 'none', // Capitalize natural
                                fontSize: '1rem',
                                letterSpacing: '0.2px'
                            }}
                        >
                            {cat.name}
                        </Typography>
                    </ButtonBase>
                );
            })}
        </Box>
    );
};

export default CategoryChipsBar;

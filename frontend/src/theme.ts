import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        surface: Palette['primary'];
    }
    interface PaletteOptions {
        surface?: PaletteOptions['primary'];
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#1F6AE1',
            dark: '#174FA8',
            light: '#E8F0FF',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#6B7280', // Cinza neutro para ações secundárias ou usar uma cor de destaque
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F6F7F9', // Fundo geral
            paper: '#FFFFFF',   // Cards e Surfaces
        },
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
        },
        success: {
            main: '#22C55E',
        },
        warning: {
            main: '#F59E0B',
        },
        error: {
            main: '#EF4444',
        },
    },
    shape: {
        borderRadius: 16, // Padrão 16px
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none', // Mais moderno
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14, // Botões mais arredondados
                    padding: '12px 24px',
                    fontSize: '1rem',
                },
                containedPrimary: {
                    boxShadow: '0px 4px 6px -1px rgba(31, 106, 225, 0.2)', // Sombra suave na cor primary
                    '&:hover': {
                        boxShadow: '0px 10px 15px -3px rgba(31, 106, 225, 0.3)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)', // Shadow-sm do Tailwind
                    border: '1px solid rgba(229, 231, 235, 0.5)', // Borda sutil
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 24,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                    },
                },
            },
        },
    },
});

export default theme;

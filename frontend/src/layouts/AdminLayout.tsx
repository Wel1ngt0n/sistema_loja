import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Collapse, IconButton, useTheme } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 260;

interface NavItemProps {
    text: string;
    icon: React.ReactNode;
    path?: string;
    children?: NavItemProps[];
    show?: boolean;
}

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { logout, isSuperAdmin, user, hasPermission } = useAuth();

    // State for collapsible groups
    const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
        'Pedidos': true, // Default open
        'Produção': true
    });

    const handleGroupClick = (text: string) => {
        setOpenGroups(prev => ({ ...prev, [text]: !prev[text] }));
    };

    const isActive = (path?: string) => {
        if (!path) return false;
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const menuStructure: NavItemProps[] = [
        {
            text: 'Visão Geral',
            icon: <DashboardIcon />,
            path: '/admin',
            show: true
        },
        {
            text: 'Pedidos',
            icon: <ShoppingCartIcon />,
            show: true,
            children: [
                { text: 'Vendas', icon: <PointOfSaleIcon />, path: '/admin/sales', show: hasPermission('reports:read') || isSuperAdmin },
                { text: 'Clientes', icon: <GroupIcon />, path: '/admin/customers', show: true },
            ]
        },
        {
            text: 'Catálogo',
            icon: <InventoryIcon />,
            show: hasPermission('products:read'),
            children: [
                { text: 'Produtos', icon: <RestaurantMenuIcon />, path: '/admin/products', show: true },
                { text: 'Categorias', icon: <CategoryIcon />, path: '/admin/categories', show: true },
            ]
        },
        {
            text: 'Produção',
            icon: <SoupKitchenIcon />,
            show: true,
            children: [
                { text: 'Encomendas', icon: <AssignmentIcon />, path: '/admin/preorders', show: true },
                { text: 'Produção do Dia', icon: <SoupKitchenIcon />, path: '/admin/production', show: true },
            ]
        },
        {
            text: 'Sistema',
            icon: <SettingsIcon />,
            show: isSuperAdmin,
            children: [
                { text: 'Super Admin', icon: <AdminPanelSettingsIcon />, path: '/admin/superadmin', show: true },
            ]
        }
    ];

    // External Links (Totem, PDV, Kitchen) - kept separate or could be in a 'Apps' group
    const appLinks = [
        { text: 'PDV (Caixa)', icon: <PointOfSaleIcon />, url: '/pdv', show: hasPermission('orders:write') },
        { text: 'Cozinha (KDS)', icon: <SoupKitchenIcon />, url: '/kitchen', show: hasPermission('orders:update_status') || isSuperAdmin },
        { text: 'Totem', icon: <StorefrontIcon />, url: '/totem', show: true },
    ];

    const renderNavItem = (item: NavItemProps, depth = 0) => {
        if (item.show === false) return null;

        const isGroup = !!item.children;
        const isOpen = openGroups[item.text] || false;
        const active = isActive(item.path);

        // Styling for active state
        const activeStyle = {
            bgcolor: active ? 'primary.main' : 'transparent',
            color: active ? 'primary.contrastText' : 'inherit',
            '&:hover': {
                bgcolor: active ? 'primary.dark' : 'action.hover',
            },
            borderRadius: 2,
            mb: 0.5,
        };



        return (
            <React.Fragment key={item.text}>
                <ListItem disablePadding sx={{ display: 'block', px: 2 }}>
                    <ListItemButton
                        onClick={() => isGroup ? handleGroupClick(item.text) : navigate(item.path!)}
                        sx={{
                            minHeight: 48,
                            justifyContent: 'initial',
                            px: 2.5,
                            ...activeStyle
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: 2,
                                justifyContent: 'center',
                                color: isGroup ? theme.palette.primary.main : (active ? 'inherit' : 'rgba(0,0,0,0.6)')
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontWeight: isGroup || active ? 'bold' : 'medium',
                                fontSize: isGroup ? '0.95rem' : '0.9rem'
                            }}
                        />
                        {isGroup ? (isOpen ? <ExpandLess color="action" /> : <ExpandMore color="action" />) : null}
                    </ListItemButton>
                </ListItem>
                {isGroup && item.children && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map(child => renderNavItem(child, depth + 1))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        Sistema Loja
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
                            Olá, <b>{user?.username}</b>
                        </Typography>
                        <IconButton onClick={logout} color="error" title="Sair">
                            <ExitToAppIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: 'none',
                        boxShadow: 3,
                        bgcolor: '#f8f9fa' // Slightly lighter background for menu
                    },
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <Box sx={{ overflow: 'auto', py: 2 }}>
                    <List>
                        {menuStructure.map(item => renderNavItem(item))}
                    </List>

                    <Box px={2} py={1}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ ml: 2, mb: 1, display: 'block', textTransform: 'uppercase' }}>
                            Apps
                        </Typography>
                        {appLinks.map(app => (
                            app.show && (
                                <ListItemButton
                                    key={app.text}
                                    onClick={() => window.open(app.url, '_blank')}
                                    sx={{ borderRadius: 2, mb: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: 'secondary.main' }}>
                                        {app.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={app.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'medium' }} />
                                    <ExitToAppIcon fontSize="small" sx={{ color: 'action.disabled', fontSize: 16 }} />
                                </ListItemButton>
                            )
                        ))}
                    </Box>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;

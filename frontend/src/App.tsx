import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// Pages
import LoginPage from './apps/auth/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './apps/admin/pages/Dashboard';
import CategoryList from './apps/admin/pages/CategoryList';
import ProductList from './apps/admin/pages/ProductList';
import TotemApp from './apps/totem/TotemApp';
import TotemSetup from './apps/totem/TotemSetup';
import PdvApp from './apps/pdv/PdvApp';
import KitchenApp from './apps/kitchen/KitchenApp';
import SuperAdminDashboard from './apps/admin/pages/SuperAdminDashboard';
import SalesHistory from './apps/admin/pages/SalesHistory';
import CustomerList from './apps/admin/pages/CustomerList';
import PreOrderList from './apps/admin/pages/PreOrders/PreOrderList';
import PreOrderForm from './apps/admin/pages/PreOrders/PreOrderForm';
import PreOrderCheckout from './apps/admin/pages/PreOrders/PreOrderCheckout';
import PreOrderProduction from './apps/admin/pages/PreOrders/PreOrderProduction';

import RootRedirect from './components/RootRedirect';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/totem" element={<TotemApp />} />
            <Route path="/totem/config" element={<TotemSetup />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/auth/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/unauthorized" element={<h1>Acesso Não Autorizado</h1>} />

            {/* Kitchen Route */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KITCHEN']} />}>
              <Route path="/kitchen" element={<KitchenApp />} />
            </Route>

            {/* PDV Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CASHIER', 'ADMIN']} />}>
              <Route path="/pdv" element={<PdvApp />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="superadmin" element={<SuperAdminDashboard />} />
                <Route path="sales" element={<SalesHistory />} />
                <Route path="customers" element={<CustomerList />} />
                <Route path="preorders" element={<PreOrderList />} />
                <Route path="preorders/new" element={<PreOrderForm />} />
                <Route path="preorders/:id" element={<PreOrderForm />} />
                <Route path="preorders/:id/checkout" element={<PreOrderCheckout />} />
                <Route path="production" element={<PreOrderProduction />} />
              </Route>
            </Route>

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

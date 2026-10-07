import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'forgot-password',
    component: ForgotPassword,
  },

  {
    path: 'reset-password',
    component: ResetPassword,
  },

  {
    path: 'products',
    component: Products,
  },

  {
  path: 'products/:id',
  component: ProductDetail,
},

{
  path: 'admin-dashboard',
  component: AdminDashboard
},
];

import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminProduct } from './pages/admin-product/admin-product';
import { AdminUsers } from './pages/admin-users/admin-users'
import { AdminCategories } from './pages/admin-categories/admin-categories'
import { AdminSchools } from './pages/admin-schools/admin-schools'
import { AdminClasses } from './pages/admin-classes/admin-classes';
import { Classes } from './pages/classes/classes';
import { Categories } from './pages/categories/categories';


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

{
  path: 'admin-product',
  component: AdminProduct
},

{
  path: 'admin-user',
  component: AdminUsers
},

{
  path: 'admin-categories',
  component: AdminCategories
},

{
  path: 'admin-schools',
  component: AdminSchools
},

{
  path: 'admin-classes',
  component: AdminClasses
},

{
  path: 'classes',
  component: Classes
},

{
  path: 'categories',
  component: Categories
}


];

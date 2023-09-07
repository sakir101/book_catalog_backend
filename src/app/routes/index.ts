import express from 'express';
import { BookRoutes } from '../modules/book/book.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { OrderRoutes } from '../modules/order/order.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { AuthRoutes } from '../modules/user/auth.route';
import { UserRoutes } from '../modules/userGet/user.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/users",
    route: UserRoutes
  },
  {
    path: "/categories",
    route: CategoryRoutes
  },
  {
    path: "/books",
    route: BookRoutes
  },
  {
    path: "/orders",
    route: OrderRoutes
  },
  {
    path: "/profile",
    route: ProfileRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;

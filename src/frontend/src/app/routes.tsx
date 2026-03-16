import { Route, Routes } from "react-router";
import LoginPage from "../pages/login/page.tsx";
import RegisterPage from "../pages/register/page.tsx";
import RootLayout from "../pages/layout.tsx";
import Page from "../pages/page.tsx";
import ProductsPage from "../pages/products/page.tsx";
import ProductPage from "../pages/products/[:id]/page.tsx";
import CreateProductPage from "../pages/products/create/page.tsx";
import NotFoundPage from "../pages/notFound.tsx";
import ProfilePage from "../pages/profile/page.tsx";

export default function SiteRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Page />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

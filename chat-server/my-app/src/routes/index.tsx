import { Main } from '@/components/Main';
import AdminLayout from '@/layouts/admin';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import { Login } from '@/pages/login';
import { Route, Routes } from 'react-router';

export default function RouteApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

      </Route>
      <Route element={<AdminLayout />}></Route>
      {/* Add more routes as needed */}
    </Routes>
  );
}

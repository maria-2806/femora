import Navigation from '@/components/Navigation';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;

import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Shared/Navbar';
import { Footer } from '../components/Shared/Footer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

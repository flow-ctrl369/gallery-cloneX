import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const DynamicPageTransition = dynamic(() => import('./page-transition'), {
  ssr: false, // Ensure it's only rendered on the client side
  loading: () => null, // Or a simple loading spinner/placeholder
});

export default DynamicPageTransition; 
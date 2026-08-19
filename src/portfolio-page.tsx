'use client';

import { useEffect, useState } from 'react';
import SculptureThree from './sculpture-three';

export default function PortfolioPage() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? window.scrollY / max : 0);
    };

    update();

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div>
      <h1>Portfolio Page</h1>
      <SculptureThree scroll={Math.min(scroll * 4, 1)} />
    </div>
  );
}

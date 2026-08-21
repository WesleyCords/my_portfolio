'use client';

import { stacks, projects } from './data';

import { useEffect, useRef, useState } from 'react';
import SculptureThree from './sculpture-three';
import dynamic from 'next/dynamic';

const AbstractSculpture = dynamic(() => import('./sculpture-three'), {
  ssr: false,
  loading: () => (
    <div className="hero-sculpture hero-sculpture--loading" arial-hidden="true">
      <div className="hero-sculpture-fallback" />
    </div>
  ),
});

{
  /*Wrapper pra observar a posição dos elementos na tela */
}
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && node.classList.add('is-visible'), // Se o elemento estiver visível, adiciona a classe 'is-visible'
      { threshold: 0.14 } // 14% do elemento precisa estar visível para disparar a animação
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

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
    <main>
      <div></div>

      <header className="site-header">
        <a href="#being" className="brand" arial-label="Inicio">
          Wesley Cordeiro <span>®</span>
        </a>
        <nav arial-label="Navegação principal">
          <a href="#projects">Projetos</a>
          <a href="#about">Sobre</a>
          <a href="#contact">Contato</a>
        </nav>
        <span className="availability">
          <i className="dot" /> Disponível para projetos
        </span>
      </header>
    </main>
  );
}

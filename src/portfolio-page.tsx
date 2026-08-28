'use client';

import { projects, stacks } from './data';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDown, ArrowUpRight, Asterisk, CodeXml, Mail, MapPin } from 'lucide-react';

const AbstractSculpture = dynamic(() => import('./sculpture-three'), {
  ssr: false,
  loading: () => (
    <div className="hero-sculpture hero-sculpture--loading" arial-hidden="true">
      <div className="hero-sculpture-fallback" />
    </div>
  ),
});

{
  /* Componente para mostrar o projeto */
}

interface ProjectVisualProps {
  type: string;
  image: string;
  title: string;
}

function ProjectVisual({ type, image, title }: ProjectVisualProps) {
  return (
    <div className={`project-visual project-visual--${type}`}>
      <Image
        src={image}
        alt={`Print do projeto ${title}`}
        fill
        sizes="(max-width: 800px) 90vw, 92vw"
        className="project-image"
      />
      <span className="project-image-label">CASO DE ESTUDO / {type.toUpperCase()}</span>
    </div>
  );
}

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
      <div className="scroll-progress" style={{ transform: `scaleX(${scroll})` }} />

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

      <section id="being" className="hero" aria-labelledby="hero-title">
        <AbstractSculpture scroll={Math.min(scroll * 4, 1)} />
        <div className="hero-kicker">
          <Asterisk aria-hidden="true" />
          Desenvolvedor contínuo · Brasil
        </div>
        <h1 className="hero-title">
          <span>EU TRANSFORMO</span>
          <span className="outline-word">IDEIAS</span>
          <span>EM EXPERIÊNCIAS.</span>
        </h1>
        <div className="hero-bottom">
          <p>Desenvolvo produtos digitais onde código, movimento e intenção trabalham juntos.</p>
          <a href="#projects" className="scroll-cta">
            <ArrowDown aria-hidden="true" /> Explore meu trabalho
          </a>
        </div>
        <div className="hero-code" aria-hidden="true">
          {'{ creativity: true,\n  boring: false }'}
        </div>
      </section>

      <section id="projects" className="projects section-shell" aria-labelledby="projects-title">
        <Reveal className="section-heading">
          <span>01 / TRABALHOS SELECIONADOS</span>
          <h2 id="projects-title">
            PROJETOS QUE
            <br />
            FALAM POR MIM.
          </h2>
          <p>Uma seleção de experiências digitais pensadas do primeiro pixel à última interação.</p>
        </Reveal>
        <div className="project-list">
          {projects.map((project, index) => (
            <Reveal key={index} className="project-card">
              <div className="project-meta">
                <span>{index + 1}</span>
                <span>{project.type}</span>
              </div>
              <ProjectVisual type={project.visual} image={project.image} title={project.title} />
              <div className="project-info">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <nav className="project-links" aria-label={`Links do projeto: ${project.title}`}>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Testar o projeto:  ${project.title}`}
                    >
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  )}
                  <a
                    href={project.linkRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Olhar o repositório do projeto:  ${project.title}`}
                  >
                    <CodeXml />
                  </a>
                </nav>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="journey section-shell" aria-labelledby="journey-title">
        <Reveal className="section-heading journey-heading">
          <span>02 / EM CONSTANTE EVOLUÇÃO</span>
          <h2 id="journey-title">
            MINHA JORNADA <br /> NÃO TEM FIM.
          </h2>
        </Reveal>
        <div className="timeline">
          {stacks.map((stack, i) => (
            <Reveal key={i} className={`timeline-item timeline-item--${stack.status}`}>
              <span className="timeline-number">0{i + 1}</span>
              <div className="timeline-marker">
                <i />
              </div>
              <div>
                <span className="timeline-year">{stack.year}</span>
                <h3>{stack.label}</h3>
                <p>{stack.items}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="about" className="about section-shell" aria-labelledby="about-title">
        <Reveal className="about-image">
          <Image
            src="/my-litle-photo.jpeg"
            alt="Minha fotinha"
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
          <span>ESTUDANTE DE SISTEMAS DE INFORMAÇÃO - UFRPE · {new Date().getFullYear()}</span>
        </Reveal>
        <Reveal className="about-copy">
          <span>03 / QUEM ESTÁ POR TRÁS</span>
          <h2 id="about-title">
            CURIOSO POR
            <br />
            NATUREZA.
            <br />
            <em>DEV</em> POR ESCOLHA.
          </h2>
          <p>
            Sou um desenvolvedor apaixonado por transformar problemas complexos em experiências
            simples, rápidas e memoráveis.
          </p>
          <p>
            Quando não estou escrevendo código, estou estudando novas tecnologias, desmontando
            interfaces para entender como funcionam ou rabiscando a próxima ideia.
          </p>
          <div className="about-details">
            <span>
              <MapPin aria-hidden="true" /> Brasil
            </span>
            <span>PT & EN</span>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="contact section-shell" aria-labelledby="contact-title">
        <Reveal>
          <span>04 / VAMOS CONVERSAR</span>
          <h2 id="contact-title">
            TEM UMA IDEIA?
            <br />
            <span>ME CONTA.</span>
          </h2>
          <a href="mailto:wesley.cordeiro1@icloud.com" className="email-link">
            <Mail aria-hidden="true" /> wesley.cordeiro1@icloud.com{' '}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Reveal>
        <Reveal className="contact-side">
          <p>Estou aberto a freelas, oportunidades e boas conversas sobre tecnologia e design.</p>
          <nav>
            <a href="https://www.linkedin.com/in/wesley-cordeiro-dev/" target="_blank">
              LinkedIn
            </a>
            <a href="https://github.com/WesleyCords" target="_blank">
              GitHub
            </a>
            <a href="https://instagram.com/wesleycords" target="_blank">
              Instagram
            </a>
          </nav>
        </Reveal>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} WESLEY CORDEIRO</span>
        <span>FEITO COM CÓDIGO + CURIOSIDADE</span>
        <a href="#being">VOLTAR AO TOPO ↑</a>
      </footer>
    </main>
  );
}

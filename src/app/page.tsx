"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { styled } from "@/lib/stitches.config";
import { ArrowRight } from "lucide-react"; 

// --- DYNAMIC DOT BACKGROUND ---
const InteractiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let mouse = { x: -1000, y: -1000 };
    const dots: { x: number; y: number }[] = [];
    const gap = 35; 
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dots.length = 0;
      for (let x = gap / 2; x < canvas.width; x += gap) {
        for (let y = gap / 2; y < canvas.height; y += gap) {
          dots.push({ x, y });
        }
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((dot) => {
        const dist = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
        const maxDist = 130;
        const ratio = dist < maxDist ? (1 - dist / maxDist) : 0;
        const opacity = 0.25 + ratio * 0.65;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1 + ratio, 0, Math.PI * 2);
        ctx.fillStyle = dist < maxDist ? `rgba(197, 154, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    const handleMouseMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", setup);
    window.addEventListener("mousemove", handleMouseMove);
    setup(); draw();
    return () => {
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
};

// --- STYLED COMPONENTS ---
const MainWrapper = styled('div', {
  minHeight: '100vh',
  width: '100vw',
  background: 'radial-gradient(circle at center, #1a102e 0%, #0a0a0c 100%)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  
  // ✅ Desktop: Non-scrollable
  '@media (min-width: 851px)': {
    height: '100vh',
    overflow: 'hidden',
  },
  
  // ✅ Mobile: Scalable/Scrollable
  '@media (max-width: 850px)': {
    height: 'auto',
    overflowY: 'auto',
  }
});

const SiteHeader = styled('header', {
  width: '100%',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  position: 'relative',
  backgroundColor: 'rgba(26, 16, 46, 0.6)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(15px)',
});

const LogoWrapper = styled('div', {
  position: 'absolute',
  left: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const HeaderText = styled('span', {
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '20px',
  fontWeight: '800',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  textAlign: 'center',
  padding: '0 70px',
  '@media (max-width: 480px)': { fontSize: '8px' },
});

const NavBar = styled('nav', {
  width: '100%',
  padding: '10px 40px',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 9,
  '@media (max-width: 850px)': {
    justifyContent: 'center',
    padding: '10px 20px',
  }
});

const NavLinks = styled('div', {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
});

const NavButton = styled('button', {
  background: 'none',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '12px',
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  variants: {
    active: { true: { backgroundColor: 'rgba(197, 154, 255, 0.15)', color: '#c59aff' } },
  },
});

const MainContent = styled('main', {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr', 
  alignItems: 'center',
  padding: '0 80px',
  gap: '40px',
  maxWidth: '1200px',
  marginInline: 'auto',
  zIndex: 2,
  
  // ✅ Responsive scaling
  '@media (max-width: 850px)': {
    gridTemplateColumns: '1fr',
    padding: '40px 20px',
    textAlign: 'center',
    gap: '30px',
  },
});

const TextPanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media (max-width: 850px)': { alignItems: 'center' },
});

const Title = styled('h1', {
  fontSize: '4.0rem', 
  fontWeight: '900',
  color: 'white',
  letterSpacing: '-0.06em',
  lineHeight: '1.1',
  '@media (max-width: 850px)': { fontSize: '2.5rem' },
});

const Highlight = styled('span', { color: '#c59aff' });

const SubText = styled('p', {
  color: '#8e8e93',
  fontSize: '1.3rem',
  lineHeight: '1.5',
  maxWidth: '450px',
});

const ActionButtonGroup = styled('div', {
  display: 'flex',
  gap: '14px',
  marginTop: '10px',
});

const RegisterBtn = styled('button', {
  backgroundColor: '#c59aff',
  color: '#0a0a0c',
  padding: '14px 28px',
  borderRadius: '16px',
  fontSize: '15px',
  fontWeight: '800',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const LoginBtn = styled('button', {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: 'white',
  padding: '14px 28px',
  borderRadius: '16px',
  fontSize: '15px',
  fontWeight: '700',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
});

const ImagePanel = styled('div', {
  width: '100%', 
  height: '420px',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid rgba(197, 154, 255, 0.1)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  '@media (max-width: 850px)': { height: '250px', maxWidth: '450px' },
});

const Footer = styled('footer', {
  width: '100%',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: 'rgba(10, 10, 12, 0.8)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '18px',
  zIndex: 10,
});

export default function Home() {
  return (
    <MainWrapper>
      <InteractiveGrid />
      
      <SiteHeader>
<LogoWrapper>
  <Image 
    src="/images/logo.png" 
    alt="Logo" 
    fill 
    sizes="50px" // Since it's fixed at 50px width
    style={{ objectFit: 'contain' }}
    priority
  />
</LogoWrapper>
        <HeaderText>Water Hole Task Manager System</HeaderText>
      </SiteHeader>

      <NavBar>
        <NavLinks>
          <NavButton active={true}>Home</NavButton>
          <NavButton>About us</NavButton>
          <NavButton>Contact</NavButton>
          <NavButton>FAQ</NavButton>
        </NavLinks>
      </NavBar>

      <MainContent>
        <TextPanel>
          <Title>Task <Highlight>Management</Highlight> System</Title>
          <SubText>
            Unlock deep focus and achieve peak performance. We manage and streamline your work responsibilities.
          </SubText>
          
          <ActionButtonGroup>
            <Link href="/signup">
              <RegisterBtn>
                Join <ArrowRight size={18} />
              </RegisterBtn>
            </Link>
            <Link href="/login">
              <LoginBtn>Login</LoginBtn>
            </Link>
          </ActionButtonGroup>
        </TextPanel>

<ImagePanel>
  <Image 
    src="/images/pic2.png" 
    alt="UI Visual" 
    fill 
    sizes="(max-width: 850px) 100vw, 500px" // Full width on mobile, 500px on desktop
    style={{ objectFit: 'cover' }}
    priority
  />
</ImagePanel>
      </MainContent>

      <Footer>
        &copy; 2026 Water Hole Task Manager System. All rights reserved.
      </Footer>
    </MainWrapper>
  );
}
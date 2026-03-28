"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { styled } from "@/lib/stitches.config";
import { ArrowRight, Sun, Moon } from "lucide-react"; 

// --- DYNAMIC DOT BACKGROUND ---
const InteractiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for mounting to avoid hydration mismatch with theme
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
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
        const opacity = 0.15 + ratio * 0.5;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1 + ratio, 0, Math.PI * 2);
        
        // Logic for dot color based on theme
        if (dist < maxDist) {
          ctx.fillStyle = `rgba(197, 154, 255, ${opacity})`; // Brand Purple
        } else {
          ctx.fillStyle = theme === 'dark' 
            ? `rgba(255, 255, 255, ${opacity})` 
            : `rgba(0, 0, 0, ${opacity})`;
        }
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
  }, [mounted, theme]);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
};

// --- STYLED COMPONENTS (Using Dynamic Tokens) ---
const MainWrapper = styled('div', {
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: '$bgMain', // Token-based
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  transition: '$standard',
  
  '@media (min-width: 851px)': {
    height: '100vh',
    overflow: 'hidden',
  },
  
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
  backgroundColor: '$glassBg', // Token-based
  borderBottom: '1px solid $border', // Token-based
  backdropFilter: 'blur(15px)',
});

const LogoWrapper = styled('div', {
  position: 'absolute',
  left: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const HeaderText = styled('span', {
  color: '$textSecondary',
  fontSize: '18px',
  fontWeight: '800',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  textAlign: 'center',
  padding: '0 70px',
  '@media (max-width: 480px)': { fontSize: '10px', padding: '0 40px' },
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
  padding: '8px 12px',
  borderRadius: '12px',
  color: '$textSecondary',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '$cardBg',
    color: '$textMain',
  },
  variants: {
    active: { true: { backgroundColor: 'rgba(197, 154, 255, 0.15)', color: '$brandPrimary' } },
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
  color: '$textMain',
  letterSpacing: '-0.06em',
  lineHeight: '1.1',
  '@media (max-width: 850px)': { fontSize: '2.5rem' },
});

const Highlight = styled('span', { color: '$brandPrimary' });

const SubText = styled('p', {
  color: '$textSecondary',
  fontSize: '1.2rem',
  lineHeight: '1.5',
  maxWidth: '450px',
});

const ActionButtonGroup = styled('div', {
  display: 'flex',
  gap: '14px',
  marginTop: '10px',
});

const RegisterBtn = styled('button', {
  backgroundColor: '$brandPrimary',
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
  transition: 'transform 0.2s ease',
  '&:hover': { transform: 'translateY(-2px)' }
});

const LoginBtn = styled('button', {
  backgroundColor: '$inputBg',
  color: '$textMain',
  padding: '14px 28px',
  borderRadius: '16px',
  fontSize: '15px',
  fontWeight: '700',
  border: '1px solid $border',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': { backgroundColor: '$cardBg' }
});

const ImagePanel = styled('div', {
  width: '100%', 
  height: '420px',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid $border',
  boxShadow: '$card',
  '@media (max-width: 850px)': { height: '250px', maxWidth: '450px' },
});

const Footer = styled('footer', {
  width: '100%',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '$glassBg',
  borderTop: '1px solid $border',
  color: '$textSecondary',
  fontSize: '14px',
  zIndex: 10,
});

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent hydration flickers

  return (
    <MainWrapper>
      <InteractiveGrid />
      
      <SiteHeader>
<LogoWrapper>
  <Image 
    src="/images/logo.png" 
    alt="Logo" 
    width={40} // Using fixed width/height often resolves preload issues
    height={40}
    style={{ objectFit: 'contain' }}
    priority={true}
  />
</LogoWrapper>
        <HeaderText>Water Hole Task Manager System</HeaderText>
      </SiteHeader>

      <NavBar>
        <NavLinks>
          <NavButton active={true}>Home</NavButton>
          <NavButton>About us</NavButton>
          <NavButton>Contact</NavButton>
<NavButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? (
    <>
      <Sun size={18} /> <span style={{ marginLeft: '8px' }}>Light Mode</span>
    </>
  ) : (
    <>
      <Moon size={18} /> <span style={{ marginLeft: '8px' }}>Dark Mode</span>
    </>
  )}
</NavButton>
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
            sizes="(max-width: 850px) 100vw, 500px"
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
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { styled } from "@/lib/stitches.config";

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
        const size = 1 + ratio * 1.5;
        const opacity = 0.25 + ratio * 0.65;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
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
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  background: 'radial-gradient(circle at center, #1a102e 0%, #0a0a0c 100%)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
});

const Header = styled('header', {
  width: '100%',
  padding: '20px 0',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 10,
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
});

const HeaderText = styled('span', {
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '20px',
  fontWeight: '600',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
});

const ContentArea = styled('main', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 20px',
  textAlign: 'center',
  zIndex: 2,
  marginTop: '-10px',
});

const Title = styled('h1', {
  fontSize: '4.5rem',
  fontWeight: '800',
  color: 'white',
  letterSpacing: '-0.05em',
  marginBottom: '30px',
  // ✅ MOBILE TITLE SIZE
  '@media (max-width: 768px)': { 
    fontSize: '2.5rem',
    marginBottom: '4px' 
  },
});

const SubTitle = styled('p', {
  color: '#b1b1b6',
  fontSize: '1.4rem',
  lineHeight: '1.4',
  marginBottom: '30px',
  maxWidth: '600px',
  // ✅ MOBILE SUBTITLE SIZE
  '@media (max-width: 768px)': { 
    fontSize: '0.95rem',
    marginBottom: '20px' 
  },
});

const ImageContainer = styled('div', {
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  marginBottom: '30px',
  // ✅ STACK IMAGES VERTICALLY ON MOBILE
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
});

const StyledImageWrapper = styled('div', {
  width: '340px',
  height: '220px',
  borderRadius: '30px',
  overflow: 'hidden',
  border: '2px solid rgba(197, 154, 255, 0.15)',
  backgroundColor: 'rgba(255,255,255,0.02)',
  position: 'relative',
  transition: 'all 0.4s ease',
  cursor: 'pointer',
  
  // ✅ SHRINK IMAGES FOR MOBILE SCREENS
  '@media (max-width: 768px)': {
    width: '260px',
    height: '140px',
    borderRadius: '20px',
  },

  '&:hover': { 
    transform: 'translateY(-8px) scale(1.02)',
    borderColor: 'rgba(197, 154, 255, 0.6)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(197, 154, 255, 0.2)',
  },
});

const WelcomeText = styled('div', {
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: '500',
  '@media (max-width: 768px)': { fontSize: '0.9rem' },
});

const HighlightText = styled('span', {
  color: '#c59aff',
  fontWeight: '700',
  display: 'block',
  marginTop: '5px',
  fontSize: '1.4rem',
  '@media (max-width: 768px)': { fontSize: '1.1rem' },
});

const Footer = styled('footer', {
  width: '100%',
  padding: '20px',
  textAlign: 'center',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '20px',
});

export default function Home() {
  return (
    <MainWrapper>
      <InteractiveGrid />
      
      <Header>
        <HeaderText>Water Hole Task Manager System</HeaderText>
      </Header>

      <ContentArea>
        <Title>Task Management system</Title>
        <SubTitle>
          Your Task is are responsiblity and we manage and accomplisht it for you,Just gave us the chance.
        </SubTitle>

        <ImageContainer>
          <Link href="/login">
            <StyledImageWrapper>
               <Image 
                  src="/images/photo1.png" 
                  alt="Login" 
                  fill 
                  sizes="(max-width: 768px) 260px, 340px"
                  style={{ objectFit: 'cover' }}
                  priority
               />
            </StyledImageWrapper>
          </Link>

          <Link href="/signup">
            <StyledImageWrapper>
               <Image 
                  src="/images/photo2.png" 
                  alt="Signup" 
                  fill 
                  sizes="(max-width: 768px) 260px, 340px"
                  style={{ objectFit: 'cover' }}
                  priority
               />
            </StyledImageWrapper>
          </Link>
        </ImageContainer>

        <WelcomeText>
          Welcome to Task Management.
          <HighlightText>Start your journey today.</HighlightText>
        </WelcomeText>
      </ContentArea>

      <Footer>
        &copy; {new Date().getFullYear()} Water Hole Task Manager System.
      </Footer>
    </MainWrapper>
  );
}
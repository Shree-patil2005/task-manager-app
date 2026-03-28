"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { styled } from "@/lib/stitches.config";
import { Eye, EyeOff, LogIn } from "lucide-react"; 

// --- DYNAMIC DOT BACKGROUND ---
const InteractiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
        const opacity = 0.25 + ratio * 0.65;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1 + ratio, 0, Math.PI * 2);
        
        if (dist < maxDist) {
          ctx.fillStyle = `rgba(197, 154, 255, ${opacity})`; 
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

// --- STYLED COMPONENTS ---
const MainWrapper = styled('div', {
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: '$bgMain', // Token
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  transition: '$standard',
  '@media (min-width: 851px)': { height: '100vh', overflow: 'hidden' },
  '@media (max-width: 850px)': { height: 'auto', overflowY: 'auto' }
});

const SiteHeader = styled('header', {
  width: '100%',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  position: 'relative',
  backgroundColor: '$glassBg', 
  borderBottom: '1px solid $border',
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
  color: '$textSecondary',
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
  '@media (max-width: 850px)': { justifyContent: 'center', padding: '10px 20px' }
});

const NavLinks = styled('div', {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
});

const NavButton = styled(Link, {
  textDecoration: 'none',
  padding: '6px 12px',
  borderRadius: '12px',
  color: '$textSecondary',
  fontSize: '15px',
  fontWeight: '600',
  transition: 'color 0.2s',
  '&:hover': { color: '$brandPrimary' },
});

const MainContent = styled('main', {
  flex: 1,
  alignItems: 'center',
  padding: '0 80px',
  gap: '40px',
  maxWidth: '1200px',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'flex-start', // Anchored left
  marginLeft: '5%', 
  '@media (max-width: 850px)': {
    flexDirection: 'column',
    marginLeft: '0',
    padding: '40px 20px',
    textAlign: 'center',
    gap: '30px',
  },
});

const LoginCard = styled('div', {
  backgroundColor: '$cardBg',
  padding: '40px',
  borderRadius: '32px',
  border: '1px solid $border',
  width: '100%',
  maxWidth: '450px',
  backdropFilter: 'blur(20px)',
  '@media (max-width: 850px)': { marginInline: 'auto', padding: '30px' },
});

const Title = styled('h2', {
  color: '$textMain',
  fontSize: '2.5rem',
  fontWeight: '900',
  marginBottom: '10px',
  letterSpacing: '-0.04em',
});

const SubTitle = styled('p', {
  color: '$textSecondary',
  fontSize: '1.1rem',
  marginBottom: '24px',
});

const InputGroup = styled('div', {
  position: 'relative',
  marginBottom: '16px',
});

const StyledInput = styled('input', {
  width: '100%',
  backgroundColor: '$inputBg',
  border: '1px solid $border',
  borderRadius: '16px',
  padding: '16px 18px',
  color: '$textMain',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  '&:focus': { borderColor: '$brandPrimary' },
});

const EyeButton = styled('button', {
  position: 'absolute',
  right: '18px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '$textSecondary',
  cursor: 'pointer',
  zIndex: 10,
});

const ActionButton = styled('button', {
  width: '100%',
  backgroundColor: '$brandPrimary',
  color: '#0a0a0c', 
  padding: '16px',
  borderRadius: '16px',
  fontSize: '16px',
  fontWeight: '800',
  border: 'none',
  cursor: 'pointer',
  marginTop: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'transform 0.2s ease',
  '&:hover': { transform: 'translateY(-2px)' },
});

const ImagePanel = styled('div', {
  width: '100%', 
  height: '420px',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid $border',
  boxShadow: '$card',
  flex: '1 1 auto',
  '@media (max-width: 850px)': { height: '250px', maxWidth: '450px' },
});

const Footer = styled('footer', {
  width: '100%',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '$glassBg',
  borderTop: '1px solid $border',
  color: '$textSecondary',
  fontSize: '18px',
  zIndex: 10,
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/dashboard");
  };

  if (!mounted) return null;

  return (
    <MainWrapper>
      <InteractiveGrid />
      <SiteHeader>
        <LogoWrapper>
          <Image src="/images/logo.png" alt="Logo" fill sizes="50px" style={{ objectFit: 'contain' }} priority />
        </LogoWrapper>
        <HeaderText>Water Hole Task Manager System</HeaderText>
      </SiteHeader>

      <NavBar>
        <NavLinks>
          <NavButton href="/">Home</NavButton>
          <NavButton href="/about">About us</NavButton>
          <NavButton href="/contact">Contact</NavButton>
          <NavButton href="/faq">FAQ</NavButton>
        </NavLinks>
      </NavBar>

      <MainContent>
        <LoginCard>
          <Title>Welcome Back</Title>
          <SubTitle>Login to access your personal sanctuary.</SubTitle>
          
          <InputGroup>
            <StyledInput type="email" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
          </InputGroup>

          <InputGroup style={{ marginBottom: '24px' }}>
            <StyledInput type={showPass ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <EyeButton onClick={() => setShowPass(!showPass)} type="button">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </EyeButton>
          </InputGroup>

          <ActionButton onClick={handleLogin}>
            <LogIn size={18} /> Login Now
          </ActionButton>

          <p style={{ color: '$textSecondary', fontSize: '14px', marginTop: '20px', textAlign: 'center' }}>
            Don't have an account? <Link href="/signup" style={{ color: '$brandPrimary', textDecoration: 'none' }}>Join Sanctuary</Link>
          </p>
        </LoginCard>

        <ImagePanel>
          <Image 
            src="/images/pic2.png" 
            alt="Task Management Visual" 
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
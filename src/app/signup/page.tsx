"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { styled } from "@/lib/stitches.config";
import { Eye, EyeOff, UserPlus } from "lucide-react"; 

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
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '15px',
  fontWeight: '600',
  transition: 'color 0.2s',
  '&:hover': { color: '#c59aff' },
});

const MainContent = styled('main', {
  flex: 1,
  alignItems: 'center',
  padding: '0 80px',
  gap: '40px',
  maxWidth: '1200px',
  zIndex: 2,

  // ✅ Positioning Logic applied to move everything left
  display: 'flex', // Switched to flex for alignment control
  justifyContent: 'flex-start', // Anchors the group to the left side
  marginLeft: '5%', // Creates space from the left edge
  
  // ✅ Responsive scaling
  '@media (max-width: 850px)': {
    flexDirection: 'column',
    marginLeft: '0', // Reset margin for mobile centering
    padding: '40px 20px',
    textAlign: 'center',
    gap: '30px',
  },
});

const SignupCard = styled('div', {
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  padding: '40px',
  borderRadius: '32px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  width: '100%',
  maxWidth: '450px',
  backdropFilter: 'blur(20px)',
  '@media (max-width: 850px)': { marginInline: 'auto', padding: '30px' },
});

const Title = styled('h2', {
  color: 'white',
  fontSize: '2.5rem',
  fontWeight: '900',
  marginBottom: '10px',
  letterSpacing: '-0.04em',
});

const SubTitle = styled('p', {
  color: '#8e8e93',
  fontSize: '1.1rem',
  marginBottom: '24px',
});

const InputGroup = styled('div', {
  position: 'relative',
  marginBottom: '16px',
});

const StyledInput = styled('input', {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '16px 18px',
  color: 'white',
  fontSize: '15px',
  outline: 'none',
  '&:focus': { borderColor: '#c59aff' },
});

const EyeButton = styled('button', {
  position: 'absolute',
  right: '18px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '#636366',
  cursor: 'pointer',
  zIndex: 10,
});

const ActionButton = styled('button', {
  width: '100%',
  backgroundColor: '#c59aff',
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
  '&:hover': { transform: 'translateY(-2px)', backgroundColor: '#d6b8ff' },
});

const ImagePanel = styled('div', {
  width: '100%', 
  height: '420px',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid rgba(197, 154, 255, 0.1)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  flex: '1 1 auto', // Allow image to scale with the remaining space
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

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else router.push("/login");
  };

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
        {/* Signup Form */}
        <SignupCard>
          <Title>Get Started</Title>
          <SubTitle>Join the Water Hole network today.</SubTitle>
          
          <InputGroup>
            <StyledInput type="email" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <StyledInput type={showPass ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <EyeButton onClick={() => setShowPass(!showPass)} type="button">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </EyeButton>
          </InputGroup>

          <InputGroup style={{ marginBottom: '24px' }}>
            <StyledInput type={showConfirm ? "text" : "password"} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
            <EyeButton onClick={() => setShowConfirm(!showConfirm)} type="button">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </EyeButton>
          </InputGroup>

          <ActionButton onClick={handleSignup}>
            <UserPlus size={18} /> Register Now
          </ActionButton>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '20px', textAlign: 'center' }}>
            Already have an account? <Link href="/login" style={{ color: '#c59aff', textDecoration: 'none' }}>Login</Link>
          </p>
        </SignupCard>

        {/* Image Preview */}
        <ImagePanel>
          <Image 
            src="/images/pic2.png" 
            alt="Security Visual" 
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
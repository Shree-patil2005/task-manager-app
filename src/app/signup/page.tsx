"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { styled } from "@/lib/stitches.config";
import { Eye, EyeOff } from "lucide-react"; 

// --- DYNAMIC DOT BACKGROUND (Luminous Version) ---
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
  minHeight: '100vh',
  width: '100vw',
  overflow: 'hidden',
  // ✅ Restored the purple-obsidian gradient
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
  zIndex: 2,
});

const SignupCard = styled('div', {
  // ✅ Obsidian card style
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  padding: '40px',
  borderRadius: '32px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  width: '100%',
  maxWidth: '400px',
  backdropFilter: 'blur(20px)',
  '@media (max-width: 768px)': { maxWidth: '320px', padding: '30px' },
});

const Title = styled('h2', {
  color: 'white',
  fontSize: '2rem',
  fontWeight: '800',
  marginBottom: '24px',
  textAlign: 'center',
  letterSpacing: '-0.04em',
});

const InputGroup = styled('div', {
  position: 'relative',
  marginBottom: '16px',
});

const StyledInput = styled('input', {
  width: '100%', // Required for fixed position icons
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '16px 50px 16px 18px', // Extra right-padding to accommodate icon
  color: 'white',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.3s',
  '&:focus': { borderColor: '#c59aff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  '&::placeholder': { color: '#636366' },
});

const EyeButton = styled('button', {
  position: 'absolute',
  right: '18px', // Matches input padding
  top: '50%',
  transform: 'translateY(-50%)', // Vertically center
  background: 'none',
  border: 'none',
  color: '#636366', // Subtle icon color
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  zIndex: 10,
  '&:hover': { color: 'white' },
});

const ActionButton = styled('button', {
  width: '100%',
  backgroundColor: '#c59aff', // Neon purple
  color: '#0a0a0c',
  padding: '16px',
  borderRadius: '16px',
  fontSize: '16px',
  fontWeight: '700',
  border: 'none',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'all 0.3s',
  '&:hover': { backgroundColor: '#d6b8ff', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(197, 154, 255, 0.4)' },
});

const Footer = styled('footer', {
  width: '100%',
  padding: '20px',
  textAlign: 'center',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '20px',
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

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email.");
      router.push("/login");
    }
  };

  return (
    <MainWrapper>
      <InteractiveGrid />
      <Header>
        <HeaderText>Water Hole Task Manager System</HeaderText>
      </Header>

      <ContentArea>
        <SignupCard>
          <Title>Join Us Now</Title>
          
          <InputGroup>
            <StyledInput 
              type="email" 
              placeholder="Email address" 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </InputGroup>

          <InputGroup>
            <StyledInput 
              type={showPass ? "text" : "password"} 
              placeholder="Create Password" 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <EyeButton onClick={() => setShowPass(!showPass)} type="button">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </EyeButton>
          </InputGroup>

          <InputGroup>
            <StyledInput 
              type={showConfirm ? "text" : "password"} 
              placeholder="Confirm Password" 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <EyeButton onClick={() => setShowConfirm(!showConfirm)} type="button">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </EyeButton>
          </InputGroup>

          <ActionButton onClick={handleSignup}>
            Register
          </ActionButton>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '20px', textAlign: 'center' }}>
            Already have an account? <Link href="/login" style={{ color: '#c59aff', textDecoration: 'none' }}>Login</Link>
          </p>
        </SignupCard>
      </ContentArea>

      <Footer>
        &copy; {new Date().getFullYear()} Water Hole Task Manager System.
      </Footer>
    </MainWrapper>
  );
}
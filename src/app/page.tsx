"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { styled } from "@/lib/stitches.config";
import { ArrowRight, Sun, Moon, Info, BookOpen } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

// --- NEW MODAL CONTENT STYLES ---
const InfoSection = styled('div', {
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: '60vh', // Limits height to 60% of viewport
  overflowY: 'auto', // Enables vertical scrolling
  paddingRight: '8px', // Space for the scrollbar
  
  // Custom scrollbar styling for a cleaner look
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '$border',
    borderRadius: '10px',
  },
});

const InfoCard = styled('div', {
  padding: '16px',
  borderRadius: '16px',
  backgroundColor: '$inputBg',
  border: '1px solid $border',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
});

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Modal states
  const [aboutOpen, setAboutOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

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
            width={40} 
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
          <NavButton onClick={() => setAboutOpen(true)}>About us</NavButton>
          <NavButton onClick={() => setDescOpen(true)}>Discription</NavButton>
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

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="bg-$bgMain border-$border rounded-[28px] sm:max-w-[550px] w-[95vw] p-8 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--colors-textMain)', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em' }}>
              About Us
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--colors-brandPrimary)', fontWeight: 600 }}>
              Our Vision and Mission
            </DialogDescription>
          </DialogHeader>
          
          <InfoSection>
            {[
              { title: "A Sanctuary for Focus", text: "Water Hole is a dedicated workspace meticulously designed for both professionals and students who need to reclaim their concentration. We provide a clean, distraction-free environment that strips away digital noise, allowing you to prioritize deep work." },
              { title: "Empowering Productivity", text: "Our mission is to help users manage their time with precision. By reducing cognitive load through a minimalist interface, we ensure that your mental energy is spent on completing tasks rather than navigating complex menus." },
              { title: "Tailored for Growth", text: "Whether you are balancing a heavy academic semester or managing complex corporate projects, our platform scales to meet the unique demands of your specific workload and goals." },
              { title: "A Commitment to Flow", text: "We believe that productivity isn't just about doing more—it's about staying in 'the zone.' Water Hole is built to support a consistent, uninterrupted flow that leads to meaningful progress." }
            ].map((item, i) => (
              <InfoCard key={i} style={{ padding: '20px' }}>
                <Info size={22} style={{ color: 'var(--colors-brandPrimary)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ color: 'var(--colors-textMain)', fontSize: '15px', lineHeight: '1.6' }}>
                  <b style={{ color: 'var(--colors-textMain)', display: 'block', marginBottom: '4px', fontSize: '16px' }}>{item.title}</b>
                  {item.text}
                </div>
              </InfoCard>
            ))}
          </InfoSection>
        </DialogContent>
      </Dialog>

      {/* --- DESCRIPTION MODAL --- */}
      <Dialog open={descOpen} onOpenChange={setDescOpen}>
        <DialogContent className="bg-$bgMain border-$border rounded-[28px] sm:max-w-[550px] w-[95vw] p-8 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--colors-textMain)', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em' }}>
              System Description
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--colors-brandPrimary)', fontWeight: 600 }}>
              How to use the platform
            </DialogDescription>
          </DialogHeader>
          
          <InfoSection>
            {[
              { title: "Centralized Task Dashboard", text: "Navigate to your personal command center to effortlessly create, organize, and view all your responsibilities in one high-visibility location." },
              { title: "Precision Deadline Management", text: "Never miss a beat by setting specific deadlines for every entry. This feature allows you to prioritize high-impact work and eliminate the stress of last-minute rushes." },
              { title: "Real-Time Progress Monitoring", text: "Track the status of every project at a glance. By maintaining a clear view of what is 'In Progress' or 'Pending,' you stay in total control of your schedule." },
              { title: "Seamless Completion Workflow", text: "Mark items as completed the moment they are finished. This action reinforces a positive feedback loop, maintaining your momentum throughout the day." },
              { title: "Intuitive User Experience", text: "Designed for speed and ease of use, the interface allows you to update your tasks in seconds, so you can get back to the work that actually matters." }
            ].map((item, i) => (
              <InfoCard key={i} style={{ padding: '20px' }}>
                <BookOpen size={22} style={{ color: 'var(--colors-brandPrimary)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ color: 'var(--colors-textMain)', fontSize: '15px', lineHeight: '1.6' }}>
                  <b style={{ color: 'var(--colors-textMain)', display: 'block', marginBottom: '4px', fontSize: '16px' }}>{item.title}</b>
                  {item.text}
                </div>
              </InfoCard>
            ))}
          </InfoSection>
        </DialogContent>
      </Dialog>
    </MainWrapper>
  );
}
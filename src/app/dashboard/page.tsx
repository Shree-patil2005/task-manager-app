"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { styled } from "@/lib/stitches.config"; 
import { keyframes } from "@stitches/react"; 
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { Task } from "@/types/task";
import { Plus, X, LogOut, LayoutDashboard } from "lucide-react";

// --- ANIMATIONS ---
const slideIn = keyframes({
  'from': { transform: 'translateX(100%)' },
  'to': { transform: 'translateX(0)' },
});

const fadeIn = keyframes({
  'from': { opacity: 0 },
  'to': { opacity: 1 },
});

// --- DYNAMIC DOT BACKGROUND COMPONENT (Restored) ---
const InteractiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
        const size = 1 + ratio * 1.5;
        const opacity = 0.25 + ratio * 0.65;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        if (ratio > 0) {
          ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`;
        } else {
          ctx.fillStyle = theme === 'dark' ? `rgba(255, 255, 255, 0.08)` : `rgba(0, 0, 0, 0.12)`;
        }
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", setup);
    window.addEventListener("mousemove", handleMouseMove);
    setup();
    draw();

    return () => {
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, theme]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
};

// --- MODERN UI COMPONENTS ---
const MainWrapper = styled('div', {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  backgroundColor: '$bgMain',
  overflowX: 'hidden', // Fixes horizontal scroll
});

const Header = styled('header', {
  height: '70px',
  borderBottom: '1px solid $border',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  backgroundColor: '$cardBg',
  backdropFilter: 'blur(10px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  '@media (min-width: 768px)': { padding: '0 60px' },
});

const Container = styled('div', {
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  position: 'relative',
  zIndex: 2,
  padding: '40px 20px',
  boxSizing: 'border-box',
});

const FilterBar = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  flexWrap: 'wrap',
  alignItems: 'center',
  width: '100%',
});

const StyledSelect = styled('select', {
  padding: '10px 30px 10px 12px', 
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: '600',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  border: '1px solid $border',
  backgroundColor: '$inputBg',
  color: '$textMain',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  backgroundSize: '12px',
  flex: '1 1 auto',
  minWidth: '120px',
  // --- FIX FOR DARK MODE DROPDOWN MENU ---
  '& option': {
    backgroundColor: '$bgMain', // Matches your theme background
    color: '$textMain',        // Matches your theme text color
    padding: '10px',
  },
  '@media (min-width: 640px)': { flex: 'none' },
});

// --- DRAWER COMPONENTS ---
const Overlay = styled('div', {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  zIndex: 200,
  animation: `${fadeIn} 0.3s ease`,
});

const Drawer = styled('div', {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  backgroundColor: '$bgMain',
  borderLeft: '1px solid $border',
  zIndex: 201,
  boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  animation: `${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
  '@media (min-width: 768px)': { width: '500px' },
});

const DrawerHeader = styled('div', {
  padding: '24px',
  borderBottom: '1px solid $border',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '$cardBg',
});

const FloatingActionButton = styled('button', {
  position: 'fixed',
  bottom: '30px',
  right: '20px',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: '$brandPrimary',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 16px rgba(168, 85, 247, 0.4)',
  zIndex: 50,
  '@media (min-width: 768px)': { right: '40px', bottom: '40px', borderRadius: '18px' },
});

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, []);

  const fetchTasks = async () => {
    if (!user) return;
    let query = supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: sortOrder === "asc" });
    
    if (statusFilter !== "All") query = query.eq("status", statusFilter);
    
    if (timeFilter === "Today") {
        query = query.gte("created_at", new Date().toISOString().split("T")[0]);
    } else if (timeFilter === "Last7") {
        const last7 = new Date();
        last7.setDate(last7.getDate() - 7);
        query = query.gte("created_at", last7.toISOString());
    }

    const { data } = await query;
    setTasks(data || []);
  };

  useEffect(() => { if (mounted && user) fetchTasks(); }, [statusFilter, timeFilter, sortOrder, mounted, user]);

  if (!mounted) return null;

  return (
    <MainWrapper>
      <InteractiveGrid />
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LayoutDashboard size={20} color="var(--colors-brandPrimary)" />
          <h2 style={{ fontWeight: 800, fontSize: '16px' }}>TASKFLOW</h2>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => router.push("/login"))} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
          Sign Out
        </button>
      </Header>

      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--colors-textMain)' }}>Project Tasks</h1>
            <p style={{ color: 'var(--colors-textSecondary)', fontSize: '14px' }}>Manage and monitor your workflow efficiency.</p>
          </div>
          
          <FilterBar>
            <StyledSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </StyledSelect>
            <StyledSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="Last7">Last 7 Days</option>
            </StyledSelect>
            <StyledSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </StyledSelect>
          </FilterBar>
        </div>

        <TaskList tasks={tasks} fetchTasks={fetchTasks} />
      </Container>

      {isDrawerOpen && (
        <>
          <Overlay onClick={() => setIsDrawerOpen(false)} />
          <Drawer>
            <DrawerHeader>
              <div>
                <p style={{ color: 'var(--colors-brandPrimary)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>New Entry</p>
                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Create Task</h2>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-textSecondary)' }}><X size={20} /></button>
            </DrawerHeader>
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              <TaskForm fetchTasks={fetchTasks} closeDrawer={() => setIsDrawerOpen(false)} />
            </div>
          </Drawer>
        </>
      )}

      <FloatingActionButton onClick={() => setIsDrawerOpen(true)}>
        <Plus size={28} strokeWidth={3} />
      </FloatingActionButton>
    </MainWrapper>
  );
}
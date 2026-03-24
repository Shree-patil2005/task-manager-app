"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { styled } from "@/lib/stitches.config";
import { useRouter } from "next/navigation";
import type { Task } from "@/types/task";

// --- DYNAMIC DOT BACKGROUND COMPONENT ---
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
        
        // "Pop up" effect: scale and brightness increase based on proximity
        const isNear = dist < maxDist;
        const ratio = isNear ? (1 - dist / maxDist) : 0;
        
        // Base size 1px, pops up to 2.5px
        const size = 1 + ratio * 1.5;
        // Base opacity 0.25 (brighter), pops up to 0.9
        const opacity = 0.25 + ratio * 0.65;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        // Using a slight purple tint for the "glow" when popping up
        ctx.fillStyle = isNear 
            ? `rgba(197, 154, 255, ${opacity})` 
            : `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Optional: Add a small glow shadow for the popped dots
        if (isNear) {
            ctx.shadowBlur = 10 * ratio;
            ctx.shadowColor = "rgba(197, 154, 255, 0.5)";
        } else {
            ctx.shadowBlur = 0;
        }
      });
      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", setup);
    window.addEventListener("mousemove", handleMouseMove);
    setup();
    draw();

    return () => {
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

// --- MODERN UI COMPONENTS (Stitches) ---
const MainWrapper = styled('div', {
  minHeight: '100vh',
  width: '100vw',
  // ✅ Restored the purple-obsidian gradient
  background: 'radial-gradient(circle at center, #1a102e 0%, #0a0a0c 100%)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
});


const Container = styled('div', {
  maxWidth: '900px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  position: 'relative',
  zIndex: 2,
});

const Title = styled('h1', {
  fontSize: '3.5rem',
  fontWeight: '800',
  textAlign: 'center',
  color: 'white',
  letterSpacing: '-0.06em',
  marginBottom: '4px',
  '@media (max-width: 640px)': {
    fontSize: '2.5rem',
  },
});

const SubTitle = styled('p', {
  textAlign: 'center',
  color: '#dcdcf0',
  fontSize: '1.4rem',
  maxWidth: '500px',
  margin: '0 auto 10px auto',
  lineHeight: '1.5',
});

const FilterBar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'center',
  '@media (min-width: 640px)': {
    flexDirection: 'row',
  },
});

const StyledSelect = styled('select', {
  // Fixes visibility of the dropdown menu in most browsers
  colorScheme: 'dark', 
  
  // Your existing styles
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '12px 40px 12px 20px', // Increased right padding for the arrow
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  color: '#e2e2e2',
  fontSize: '20px',
  fontWeight: '500',
  backdropFilter: 'blur(10px)',
  outline: 'none',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  width: '100%',

  // Ensures the dropdown background is solid dark on desktop/mobile
  '& option': {
    backgroundColor: '#121212',
    color: '#e2e2e2',
  },

  // Custom arrow to replace the default OS one
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e2e2e2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  backgroundSize: '16px',

  '&:focus': {
    borderColor: '#c59aff',
    boxShadow: '0 0 0 4px rgba(197, 154, 255, 0.1)',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  '@media (min-width: 640px)': {
    width: 'auto',
  },
});

const LogoutButton = styled('button', {
  backgroundColor: 'transparent',
  color: '#ff4d4d',
  fontSize: '14px',
  fontWeight: '600',
  padding: '10px 20px',
  borderRadius: '14px',
  border: '1px solid rgba(255, 77, 77, 0.2)',
  transition: 'all 0.2s',
  cursor: 'pointer',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderColor: '#ff4d4d',
  },
});

const LoadMoreBtn = styled('button', {
  backgroundColor: '#c59aff',
  color: '#0a0a0c',
  padding: '16px 32px',
  borderRadius: '20px',
  fontSize: '16px',
  fontWeight: '700',
  boxShadow: '0 8px 24px rgba(197, 154, 255, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(197, 154, 255, 0.3)',
    backgroundColor: '#d6b8ff',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [offset, setOffset] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const fetchTasks = async (forceRefresh = false) => {
    if (!user) return;
    setLoading(true);
    setError("");

    const currentOffset = forceRefresh ? 0 : offset;

    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: sortOrder === "asc" })
      .range(currentOffset, currentOffset + 4); 

    if (statusFilter !== "All") query = query.eq("status", statusFilter);
    if (timeFilter === "Today") query = query.gte("created_at", new Date().toISOString().split("T")[0]);
    if (timeFilter === "Last7") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      query = query.gte("created_at", last7.toISOString());
    }

    const { data, error: supabaseError } = await query;

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      if (currentOffset === 0) {
        setTasks(data || []);
      } else {
        setTasks((prev) => {
          const newTasks = data || [];
          const combined = [...prev, ...newTasks];
          return combined.filter((task, index, self) => index === self.findIndex((t) => t.id === task.id));
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mounted && user) {
      setOffset(0);
      setTasks([]); 
    }
  }, [statusFilter, timeFilter, sortOrder, mounted, user]);

  useEffect(() => {
    if (mounted && user) {
      fetchTasks();
    }
  }, [statusFilter, timeFilter, sortOrder, offset, mounted, user]);

  if (!mounted) return null;

  return (
    <MainWrapper>
      <InteractiveGrid />
      <Container>
        <header>
          <Title>Task Management System</Title>
          <SubTitle>We help you to manage your daily tasks with proper scheludeing, editting as well as delete feature.</SubTitle>
        </header>

        <FilterBar>
          <StyledSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </StyledSelect>

          <StyledSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="All">Time</option>
            <option value="Today">Today</option>
            <option value="Last7">Last 7 Days</option>
          </StyledSelect>

          <StyledSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </StyledSelect>
        </FilterBar>

        <TaskForm fetchTasks={fetchTasks} />

        {loading && offset === 0 && (
          <p className="text-center text-purple-400 animate-pulse font-medium">Loading....</p>
        )}

        {error && (
          <p className="text-center text-red-400 bg-red-900/20 p-4 rounded-2xl border border-red-500/20">{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>Your Tasks</h2>
          <span style={{ color: '#8e8e93', fontSize: '1.7rem' }}>{tasks.length} Total Active</span>
        </div>

        <TaskList tasks={tasks} fetchTasks={fetchTasks} />

        <div className="flex flex-col items-center justify-center pb-20 gap-4">
          <LoadMoreBtn
            onClick={() => setOffset((prev) => prev + 5)}
            disabled={loading || !user}
          >
            {loading ? "Syncing..." : "Load More Tasks"}
          </LoadMoreBtn>

          <LogoutButton onClick={handleLogout}>
            Sign Out Here
          </LogoutButton>
        </div>
      </Container>
    </MainWrapper>
  );
}
"use client";

import { Card } from "@/components/ui/card";
import type { Task } from "@/types/task";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { styled } from "@/lib/stitches.config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- MODERN UI COMPONENTS (Stitches) ---
const Grid = styled('div', {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: '1fr',
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr', 
  },
});

const TaskCard = styled(Card, {
  padding: '32px !important', // Increased padding for better visual breathability
  borderRadius: '28px !important',
  backgroundColor: 'rgba(255, 255, 255, 0.04) !important', // Slightly more visible base
  backdropFilter: 'blur(12px) !important',
  border: '1px solid rgba(255, 255, 255, 0.12) !important', // Stronger border contrast
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: 'rgba(197, 154, 255, 0.5) !important',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5), 0 0 24px rgba(197, 154, 255, 0.15) !important',
    backgroundColor: 'rgba(255, 255, 255, 0.07) !important',
  },
});

const StatusIndicator = styled('span', {
  fontSize: '11px', // Slightly larger for readability
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  padding: '6px 14px',
  borderRadius: '12px',
  width: 'fit-content',
  variants: {
    status: {
      Pending: { 
        backgroundColor: 'rgba(197, 154, 255, 0.15)', 
        color: '#d6b8ff', // Lighter purple for better contrast
        border: '1px solid rgba(197, 154, 255, 0.3)' 
      },
      Completed: { 
        backgroundColor: 'rgba(52, 211, 153, 0.15)', 
        color: '#6ee7b7', // Lighter green for better contrast
        border: '1px solid rgba(52, 211, 153, 0.3)' 
      },
    },
  },
});

const ActionButton = styled(Button, {
  borderRadius: '14px !important',
  fontSize: '14px !important',
  fontWeight: '700 !important',
  transition: 'all 0.2s !important',
  height: '44px !important', // Taller buttons for easier clicking
});

type Props = {
  tasks: Task[];
  fetchTasks: (force?: boolean) => Promise<void>;
};

export default function TaskList({ tasks, fetchTasks }: Props) {
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await fetchTasks(true);
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    if (error) {
      alert(error.message);
      return;
    }
    await fetchTasks(true);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!editTask) return;
    const { error } = await supabase.from("tasks").update({ title, description }).eq("id", editTask.id);
    if (error) {
      alert(error.message);
      return;
    }
    setOpen(false);
    await fetchTasks(true);
  };

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[32px] border border-dashed border-white/10">
          <p className="text-gray-400 font-bold text-lg">Your Task List is clear. Add some tasks.</p>
        </div>
      ) : (
        <Grid>
          {tasks.map((task) => (
            <TaskCard key={task.id}>
              <div>
                <div className="flex justify-between items-start mb-5">
                  <StatusIndicator status={task.status as any}>
                    {task.status}
                  </StatusIndicator>
                </div>
                
                <h3 className={`font-extrabold text-2xl tracking-tight transition-all duration-500 ${
                  task.status === "Completed" ? "text-gray-500 line-through" : "text-white"
                }`}>
                  {task.title}
                </h3>

                <p className={`text-base mt-4 line-clamp-3 leading-relaxed font-medium transition-colors ${
                    task.status === "Completed" ? "text-gray-600" : "text-gray-200"
                }`}>
                  {task.description || "No further details recorded for this objective."}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-10 pt-6 border-t border-white/10">
                <ActionButton 
                  variant="ghost" 
                  size="sm" 
                  className="flex-[2] bg-white/10 text-white hover:bg-white/20"
                  onClick={() => toggleStatus(task)}
                >
                  {task.status === "Pending" ? "Complete Task" : "Mark Pending"}
                </ActionButton>

                <ActionButton 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-gray-300 hover:text-white hover:bg-white/5"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </ActionButton>

                <ActionButton 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </ActionButton>
              </div>
            </TaskCard>
          ))}
        </Grid>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0f0f12] border-white/10 text-white rounded-[32px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update your task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black/40 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/40 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500 text-lg"
              />
            </div>

            <Button 
              onClick={handleUpdate} 
              className="w-full h-14 rounded-2xl bg-[#c59aff] hover:bg-[#d6b8ff] text-black font-extrabold transition-all mt-4 text-lg"
            >
              Update Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
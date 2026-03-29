"use client";

import type { Task } from "@/types/task";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { styled } from "@/lib/stitches.config";
import { Edit2, Trash2, CheckCircle, Clock, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- RESPONSIVE TABLE COMPONENTS ---
const TableContainer = styled('div', {
  width: '100%',
  backgroundColor: '$cardBg',
  borderRadius: '24px',
  border: '1px solid $border',
  overflow: 'hidden',
  boxShadow: '$card',
});

const StyledTable = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  display: 'block', 
  '@media (min-width: 768px)': {
    display: 'table', 
  },
});

const THead = styled('thead', {
  display: 'none', 
  '@media (min-width: 768px)': {
    display: 'table-header-group',
  },
});

const TBody = styled('tbody', {
  display: 'block',
  width: '100%',
  '@media (min-width: 768px)': {
    display: 'table-row-group',
  },
});

const Th = styled('th', {
  padding: '16px 24px',
  color: '$textSecondary',
  fontWeight: '700',
  textTransform: 'uppercase',
  fontSize: '11px',
  letterSpacing: '0.05em',
  borderBottom: '1px solid $border',
  backgroundColor: 'rgba(0,0,0,0.02)',
});

const Tr = styled('tr', {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  borderBottom: '1px solid $border',
  gap: '12px',
  '@media (min-width: 768px)': {
    display: 'table-row',
    padding: '0',
    flexDirection: 'row',
  },
  '&:hover': {
    backgroundColor: 'rgba(168, 85, 247, 0.03)',
  },
});

const Td = styled('td', {
  padding: '0',
  color: '$textMain',
  display: 'block',
  '@media (min-width: 768px)': {
    display: 'table-cell',
    padding: '20px 24px',
    borderBottom: '1px solid $border',
    verticalAlign: 'middle',
  },
});

const StatusBadge = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: '700',
  variants: {
    status: {
      Pending: { backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '$brandPrimary' },
      Completed: { backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#10b981' },
    }
  }
});

const ActionButton = styled('button', {
  background: 'none',
  border: 'none',
  padding: '10px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: '$textSecondary',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$border',
  flex: 1, 
  '@media (min-width: 768px)': {
    flex: 'none',
    backgroundColor: 'transparent',
  },
  variants: {
    variant: {
      danger: { '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' } },
      success: { '&:hover': { color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' } },
    }
  }
});

const ModalInput = styled(Input, {
  backgroundColor: '$inputBg !important',
  border: '1px solid $border !important',
  color: '$textMain !important',
  borderRadius: '12px !important',
  height: '50px !important',
});

// --- NEW STYLES FOR LOAD MORE & UPDATE ---
const LoadMoreButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  padding: '16px',
  marginTop: '20px',
  backgroundColor: 'transparent',
  border: '1px dashed $border',
  borderRadius: '16px',
  color: '$textSecondary',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '$inputBg',
    color: '$brandPrimary',
    borderColor: '$brandPrimary',
  }
});

const PrimaryModalButton = styled('button', {
  width: '100%',
  backgroundColor: '$brandPrimary',
  color: 'white',
  padding: '14px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  border: 'none',
  cursor: 'pointer',
  marginTop: '20px',
  transition: 'transform 0.2s',
  '&:hover': { transform: 'translateY(-2px)' },
  '&:active': { transform: 'translateY(0)' },
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
  const [visibleCount, setVisibleCount] = useState(5); // Logic for Load More

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) return;
    await fetchTasks(true);
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    if (error) return;
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
    if (error) return;
    setOpen(false);
    await fetchTasks(true);
  };

  // Limit tasks shown based on visibleCount
  const displayedTasks = tasks.slice(0, visibleCount);

  return (
    <div style={{ marginTop: '20px', width: '100%' }}>
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed var(--colors-border)', borderRadius: '24px' }}>
          <p style={{ color: 'var(--colors-textSecondary)', fontWeight: 600 }}>No tasks found.</p>
        </div>
      ) : (
        <>
          <TableContainer>
            <StyledTable>
              <THead>
                <tr>
                  <Th>Task Details</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th style={{ textAlign: 'right' }}>Actions</Th>
                </tr>
              </THead>
              <TBody>
                {displayedTasks.map((task) => (
                  <Tr key={task.id}>
                    <Td>
                      <div style={{ 
                          fontWeight: 800, 
                          fontSize: '16px', 
                          color: task.status === 'Completed' ? 'var(--colors-textSecondary)' : 'var(--colors-textMain)',
                          textDecoration: task.status === 'Completed' ? 'line-through' : 'none' 
                      }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--colors-textSecondary)', marginTop: '4px' }}>
                        {task.description || "No description provided"}
                      </div>
                    </Td>
                    
                    <Td>
                      <StatusBadge status={task.status as any}>
                        {task.status === "Completed" ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {task.status}
                      </StatusBadge>
                    </Td>

                    <Td style={{ color: 'var(--colors-textSecondary)', fontSize: '12px' }}>
                      <span style={{ display: 'inline-block', marginRight: '4px' }} className="md:hidden">Created:</span>
                      {new Date(task.created_at).toLocaleDateString()}
                    </Td>

                    <Td>
                      <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end' }}>
                        <ActionButton variant="success" onClick={() => toggleStatus(task)}>
                          <CheckCircle size={18} />
                        </ActionButton>
                        <ActionButton onClick={() => handleEdit(task)}>
                          <Edit2 size={18} />
                        </ActionButton>
                        <ActionButton variant="danger" onClick={() => handleDelete(task.id)}>
                          <Trash2 size={18} />
                        </ActionButton>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </StyledTable>
          </TableContainer>

          {/* Load More Trigger */}
          {tasks.length > visibleCount && (
            <LoadMoreButton onClick={() => setVisibleCount(prev => prev + 5)}>
              <ChevronDown size={18} />
              Load More Tasks ({tasks.length - visibleCount} remaining)
            </LoadMoreButton>
          )}
        </>
      )}

      {/* Edit Modal Logic */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-$bgMain border-$border rounded-[24px] sm:max-w-[425px] p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--colors-textMain)', fontWeight: 800 }}>Edit Task</DialogTitle>
            <DialogDescription style={{ color: 'var(--colors-textSecondary)' }}>Modify task parameters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <ModalInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <ModalInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            
            {/* Using the PrimaryModalButton for high visibility in dark theme */}
            <PrimaryModalButton onClick={handleUpdate}>
              Update Task
            </PrimaryModalButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
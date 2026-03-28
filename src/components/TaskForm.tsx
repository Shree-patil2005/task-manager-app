"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { styled } from "@/lib/stitches.config";
import { Send, BookOpen, XCircle } from "lucide-react";

// --- DRAWER-OPTIMIZED COMPONENTS ---
const FormContainer = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  backgroundColor: 'transparent', // Transparent because the Drawer already has a background
});

const InputGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const Label = styled('label', {
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '$textSecondary',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const StyledInput = styled(Input, {
  height: '52px !important',
  borderRadius: '12px !important',
  border: '1px solid $border !important',
  backgroundColor: '$inputBg !important',
  color: '$textMain !important',
  fontSize: '14px !important',
  padding: '0 16px !important',
  transition: 'all 0.2s !important',
  '&:focus': {
    borderColor: '$brandPrimary !important',
    boxShadow: '0 0 0 4px rgba(168, 85, 247, 0.1) !important',
  },
});

const StyledTextArea = styled('textarea', {
  minHeight: '120px',
  borderRadius: '12px',
  border: '1px solid $border',
  backgroundColor: '$inputBg',
  color: '$textMain',
  fontSize: '14px',
  padding: '16px',
  outline: 'none',
  fontFamily: 'inherit',
  resize: 'none',
  transition: 'all 0.2s',
  '&:focus': {
    borderColor: '$brandPrimary',
    boxShadow: '0 0 0 4px rgba(168, 85, 247, 0.1)',
  },
  '&::placeholder': {
    color: '$textSecondary',
  },
});

const ActionArea = styled('div', {
  display: 'flex',
  gap: '12px',
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px solid $border',
});

const PrimaryButton = styled(Button, {
  flex: 2,
  height: '52px',
  borderRadius: '12px !important',
  backgroundColor: '$brandPrimary !important',
  color: 'white !important',
  fontWeight: '700 !important',
  display: 'flex',
  gap: '8px',
  '&:hover': { opacity: 0.9 },
});

const GhostButton = styled(Button, {
  flex: 1,
  height: '52px',
  borderRadius: '12px !important',
  backgroundColor: '$border !important',
  color: '$textMain !important',
  fontWeight: '600 !important',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.1) !important' },
});

// ... existing imports

export default function TaskForm({ fetchTasks, closeDrawer }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // --- ADDED DISCARD LOGIC ---
  const handleDiscard = () => {
    setTitle("");        // Clear title
    setDescription("");  // Clear description
    if (closeDrawer) {
      closeDrawer();     // Close the drawer
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("tasks").insert([
      {
        title,
        description,
        status: "Pending",
        user_id: authData.user?.id,
      },
    ]);

    if (!error) {
      setTitle("");
      setDescription("");
      await fetchTasks();
      if (closeDrawer) closeDrawer();
    }
    setLoading(false);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <Label>Task Title</Label>
        <StyledInput
          placeholder="e.g. Blueprint Revision: Atrium Zone"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </InputGroup>

      <InputGroup>
        <Label>Description</Label>
        <StyledTextArea
          placeholder="Describe the objective or requirements..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </InputGroup>

      <ActionArea>
        {/* UPDATED DISCARD BUTTON */}
        <GhostButton type="button" onClick={handleDiscard} disabled={loading}>
          Discard
        </GhostButton>
        <PrimaryButton type="submit" disabled={loading}>
          <Send size={18} />
          {loading ? "Saving..." : "Create Task"}
        </PrimaryButton>
      </ActionArea>
    </FormContainer>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { styled } from "@/lib/stitches.config";

// --- MODERN UI COMPONENTS (Stitches) ---
const FormContainer = styled('form', {
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(12px)',
  padding: '32px',
  borderRadius: '28px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  transition: 'all 0.3s ease',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  '&:focus-within': {
    borderColor: 'rgba(197, 154, 255, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 20px rgba(197, 154, 255, 0.05)',
  },
});

const StyledInput = styled(Input, {
  height: '56px !important',
  borderRadius: '16px !important',
  border: '1px solid rgba(255, 255, 255, 0.1) !important',
  backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
  color: 'white !important',
  fontSize: '15px !important',
  padding: '0 20px !important',
  transition: 'all 0.2s !important',
  '&::placeholder': {
    color: '#636366 !important',
  },
  '&:focus': {
    backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
    borderColor: '#c59aff !important',
    boxShadow: '0 0 0 4px rgba(197, 154, 255, 0.1) !important',
  },
});

const AddButton = styled(Button, {
  height: '56px',
  borderRadius: '16px !important',
  fontSize: '16px !important',
  fontWeight: '700 !important',
  backgroundColor: '#c59aff !important', // Luminous Purple
  color: '#0a0a0c !important',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
  marginTop: '8px',
  '&:hover': {
    backgroundColor: '#d6b8ff !important',
    boxShadow: '0 8px 25px rgba(197, 154, 255, 0.4) !important',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
});

const Label = styled('label', {
  textXs: 'true',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#8e8e93',
  paddingLeft: '4px',
});

export default function TaskForm({ fetchTasks }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title for your task.");
      return;
    }

    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        alert("Session expired. Please log in again.");
        return;
      }

      const { error } = await supabase.from("tasks").insert([
        {
          title,
          description,
          status: "Pending",
          user_id: authData.user.id,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Could not save task.");
        return;
      }

      setTitle("");
      setDescription("");
      await fetchTasks(true); 
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label>Your Task Details</Label>
        <StyledInput
          placeholder="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <StyledInput
        placeholder="Task Discription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />

      <AddButton type="submit" disabled={loading}>
        {loading ? "Creating..." : "+ Add Task"}
      </AddButton>
    </FormContainer>
  );
}
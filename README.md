1. Project Overview

A) What the App Does:-

This is a Task Manager Application that allows users to:

Sign up and log in securely
Create, update, delete tasks
Mark tasks as completed
Filter and sort tasks
View only their own tasks 

The app ensures secure, user-specific task management using Supabase authentication and Row Level Security (RLS).

B) Approach Taken:-

Built a full-stack application using Next.js (frontend) and Supabase (backend)

Implemented authentication first, then linked tasks to users via user_id

Used component-based architecture for scalability

Applied RLS policies to enforce data security at database level

Focused on clean UI + responsive design

 2. Tech Stack

A) Frontend:-

Next.js (App Router + TypeScript)
→ For building scalable React-based UI with routing
React Hooks (useState, useEffect)
→ For state management and lifecycle handling

B) Backend:-

Supabase
Authentication (signup/login)
PostgreSQL database
Row Level Security (RLS)

c) UI & Styling:-

shadcn/ui
→ Prebuilt reusable UI components
Stitches (CSS-in-JS)
→ Modern styling with scoped and dynamic styles

D) Deployment:-

Vercel
→ Hosting and continuous deployment(CI/CD)

3. Setup Instructions

A) Steps to Run Locally:-

1) Clone repo:
git clone <your-repo-link>

2) Go to project Folder:
cd task-manager

3) Initilize dependencies:
npm install

4) Run the project:
npm run dev

B) Environment Variables:-

Create a .env.local file and add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4. Database Design

Created a table: tasks
In that table created the columns :-id(uuid), title(text), is_completed(Boolean), created_at(timestamp), user_id(uuid)

Key Concept
user_id stores task owner
Used in RLS:
auth.uid() = user_id

Ensures users only access their own tasks

5. Features Implemented

A) Core Features:-
User Authentication (Signup/Login)
Task CRUD operations:
Create task
Read tasks
Update task
Delete task

B) Task Management:-

Mark task as completed
Input validation (title required)

C) Filtering:-

By status:
Pending
Completed
By time:
Today
Last 7 days
All time

D) Sorting:-

Newest first (default)
Oldest first

E) Pagination:-

Implemented Load More functionality

F) UI/UX Features:-

Loading states
Error handling UI
Responsive design (mobile + desktop)

G) Security Features:-

Supabase Authentication
Row Level Security (RLS)

6. Challenges Faced
   
A) User-specific data access:-

Problem:
All users could see all tasks initially

Solution:
Added user_id column
Implemented RLS:
auth.uid() = user_id

B) Git push conflicts:-

Problem:
Remote had changes → push failed

Solution:
git pull origin main --rebase
git push origin main

C) UI consistency:-

Problem:
UI looked basic initially

Solution:
Used shadcn/ui
Applied Stitches styling
 
7. Improvements (Future Scope)

With More Time I Would:

A. Add Notifications
Toast messages for success/errors

B. Improve Error Handling
Add try-catch everywhere
Better user-friendly messages

C. Add Role-Based Access
Admin vs User dashboard

D. Add Search Feature
Search tasks by title

E. Add Drag & Drop
Reorder tasks

F. Optimize Performance
Use caching
Server-side rendering where needed

G. Better UI Enhancements
Animations
Dark mode
Or if required then any other theme needed.


Steps to run the project:-

In terminal type:-
npm run dev


Vercel Link:-

https://task-manager-app-drab-one.vercel.app/

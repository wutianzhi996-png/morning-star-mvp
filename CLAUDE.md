# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

启明星平台 MVP is an AI-powered learning assistant platform based on OKR (Objectives and Key Results) methodology. It provides personalized learning guidance and task management for students.

**Tech Stack:**
- Next.js 14 with App Router + React 18 + TypeScript
- Tailwind CSS for styling with custom primary color theme
- Supabase for authentication, database (PostgreSQL), and vector storage (pgvector)
- Lucide React for icons

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Setup

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `OPENAI_API_KEY`: OpenAI API key (optional, for real AI functionality)

## Database Architecture

The application uses Supabase with three main tables:

**`okrs` table:**
- Stores user learning objectives and key results
- JSONB structure for key_results: `[{ text: string }]`
- Row Level Security (RLS) enabled - users can only access their own OKRs

**`chat_history` table:**
- Stores AI chat conversations
- JSONB message format: `{ role: 'user' | 'assistant', content: string }`
- Grouped by session_id for conversation context
- RLS enabled - users can only access their own chat history

**`knowledge_chunks` table:**
- Vector storage for AI knowledge base using pgvector extension
- Contains educational content (data structures, algorithms)
- 1536-dimensional embeddings for semantic search
- Read-only access for authenticated users

Database initialization script is in `database/init.sql`.

## Application Architecture

**App Router Structure:**
- `/`: Authentication page (login/register)
- `/dashboard`: Main application interface

**Key Components:**
- `OKRForm`: Modal form for creating/editing learning objectives (max 3 key results)
- `ChatInterface`: AI chat component with mock responses (replaceable with OpenAI API)
- `ChatHistory`: Display conversation history with session grouping

**Authentication Flow:**
- Email-based authentication via Supabase Auth
- Automatic session management and route protection
- Users redirected to dashboard after login, to home if not authenticated

**Data Flow:**
1. User creates/edits OKRs through OKRForm component
2. AI chat provides task recommendations based on user's OKRs
3. All conversations automatically saved to chat_history
4. Knowledge base queried for educational content (data structures, algorithms)

## Code Conventions

- TypeScript strict mode enabled
- Client components use 'use client' directive
- Database types defined in `lib/supabase.ts`
- Error handling with user-friendly messages
- Tailwind classes for styling with custom primary color palette
- Absolute imports using `@/*` path mapping

## Database Functions

Custom PostgreSQL functions available:
- `get_user_okr(user_uuid)`: Retrieve user's OKR data
- `get_user_chat_history(user_uuid, limit)`: Get user's recent chat messages

## AI Integration

Currently uses mock responses for AI chat. To enable real OpenAI integration:
1. Add OpenAI API key to environment variables
2. Replace mock responses in ChatInterface component
3. Implement vector similarity search against knowledge_chunks table
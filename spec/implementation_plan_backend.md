# Implementation Plan - Backend Integration Research (Task 7)

## Goal
Establish the backend foundation for the Lab Companion app. This involves selecting a Backend-as-a-Service (BaaS) provider, designing the database schema, and defining the authentication and data persistence strategy (specifically for offline-first usage).

## Decision Matrix: Supabase vs Firebase

### 1. Supabase (PostgreSQL)
*   **Pros**:
    *   **Relational Data**: Excellent for structured lab data (e.g., A Protocol has many Steps; A MasterMix has many Reagents). SQL ensures data integrity.
    *   **Type Safety**: Generates TypeScript types directly from the database schema.
    *   **Row Level Security (RLS)**: Robust security policies.
    *   **Open Source**: No vendor lock-in.
*   **Cons**:
    *   Offline support is less "magic" than Firestore. Requires a strategy (e.g., `tanstack-query` persistence or local RxDB sync).

### 2. Firebase (NoSQL Firestore)
*   **Pros**:
    *   **Offline First**: Firestore SDK handles offline read/write/sync automatically and excessively well.
    *   **Speed**: Faster setup for simple unstructured data.
*   **Cons**:
    *   **NoSQL**: Complex relationships (e.g., "Recall this specific PCR setup") can get messy with denormalization.
    *   **Vendor Lock-in**: Hard dependency on Google Cloud.

### **Recommendation: Supabase**
Given the scientific nature of the app (structured data, precise calculations), **PostgreSQL (Supabase)** is the better long-term choice for data integrity. We can solve the offline requirement using **TanStack Query (React Query)** with `localStorage`/`idb` persistence, which is sufficient for a "Lab Companion" (mostly reading protocols, saving occasional results).

## Deep Dive Research: Implications (2024 Analysis)

### 1. Offline Architecture
*   **Firebase (Cloud-First)**:
    *   **Mechanism**: Proprietary "Magic Cache". It caches data the app *has seen*.
    *   **Implication**: Great for "I just viewed this, now I'm in the elevator". Less reliable for "I need my entire protocol library available in usage zone B".
    *   **Risk**: Writing complex offline transactions can sometimes desync if not careful.
*   **Supabase (Relational / True Offline)**:
    *   **Mechanism**: Standard PostgreSQL. For true offline-first, the industry standard is now **PowerSync** (syncs Postgres <-> Local SQLite).
    *   **Implication**: You have a *real* database running on the phone (SQLite). It is robust.
    *   **Trade-off**: Requires setting up the sync layer (PowerSync or RxDB), whereas Firebase is "toggle on".

### 2. Data Integrity & Types
*   **Firebase**:
    *   **NoSQL**: Schemaless. You can accidentally save a string into a number field.
    *   **Types**: requires manual maintenance of interfaces or 3rd party tools to guess types.
*   **Supabase**:
    *   **SQL**: Strict. The database *prevents* bad data.
    *   **Types**: `supabase gen types` inspects your actual Live DB and generates perfect TypeScript definitions.
    *   **Scientific Context**: For a lab app where "Volume" must be a number and "Protocol Steps" must be ordered, SQL is safer.

### 3. Vendor Lock-In
*   **Firebase**: Proprietary Google tech. Hard to migrate away.
*   **Supabase**: Just PostgreSQL. You can dump key-value pairs and migrate to AWS/Heroku/Self-Hosted anytime.

### 4. Cost Analysis (Supabase)
*   **Free Tier limits**:
    *   **Database**: 500MB (Huge for text/protocols. Thousands of experiments).
    *   **Users**: 50,000 Monthly Active Users.
    *   **Projects**: Up to 2 active free projects (pauses after 7 days inactivity, but wakes up instantly).
    *   **Conclusion**: Completely free for our MVP and early growth. Paid tier ($25/mo) only needed if we scale massively.

## Proposed Schema (Draft)

### Tables

#### 1. `profiles` (User Data)
*   `id` (uuid, PK, ref auth.users)
*   `username` (text)
*   `avatar_url` (text)
*   `preferences` (jsonb: Theme, Default PCR Kit, etc.)

#### 2. `protocols` (The "Library")
*   `id` (uuid, PK)
*   `user_id` (uuid, FK)
*   `type` (enum: 'pcr', 'growth', 'timer_preset')
*   `name` (text)
*   `data` (jsonb) -- Stores the actual configuration (e.g., PCR temps, Primer sequences)
*   `is_favorite` (boolean)
*   `created_at` (timestamptz)

#### 3. `experiments` (Active/Past Logs)
*   `id` (uuid, PK)
*   `user_id` (uuid, FK)
*   `type` (enum: 'growth_curve', 'pcr_run')
*   `name` (text)
*   `started_at` (timestamptz)
*   `completed_at` (timestamptz)
*   `notes` (text)
*   `data` (jsonb) -- The runtime data (OD measurements, etc.)

## implementation Steps (Task 7 Scope)

1.  **Selection**: Confirm Provider (User Approval required).
2.  **Schema Definition**: Write the SQL / Data Structure.
3.  **Auth Strategy**: Decide on Email/Password + Google Auth.
4.  **Offline Strategy**: Document how we will use `tanstack-query` for caching.

## User Review Required
> [!IMPORTANT]
> **Decision Point**: Do you agree with the recommendation of **Supabase**?
> *   If yes, I will proceed with designing the comprehensive SQL schema.
> *   If you prefer Firebase for its offline capabilities, please let me know.

## Verification Plan
*   **Deliverable**: A detailed `spec/SCHEMA.md`.
*   **Deliverable**: A technical decision record in `spec/DECISIONS.md`.

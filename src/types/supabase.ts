export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    username: string | null
                    avatar_url: string | null
                    preferences: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            protocols: {
                Row: {
                    id: string
                    user_id: string
                    type: 'pcr_workspace' | 'growth_curve_setup' | 'timer_preset' | 'general'
                    name: string
                    description: string | null
                    data: Json
                    is_favorite: boolean
                    last_used_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'pcr_workspace' | 'growth_curve_setup' | 'timer_preset' | 'general'
                    name: string
                    description?: string | null
                    data?: Json
                    is_favorite?: boolean
                    last_used_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'pcr_workspace' | 'growth_curve_setup' | 'timer_preset' | 'general'
                    name?: string
                    description?: string | null
                    data?: Json
                    is_favorite?: boolean
                    last_used_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            experiments: {
                Row: {
                    id: string
                    user_id: string
                    protocol_id: string | null
                    type: 'pcr_run' | 'growth_curve_run' | 'timer_log'
                    name: string
                    notes: string | null
                    status: 'running' | 'completed' | 'aborted'
                    data: Json
                    started_at: string
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    protocol_id?: string | null
                    type: 'pcr_run' | 'growth_curve_run' | 'timer_log'
                    name: string
                    notes?: string | null
                    status?: 'running' | 'completed' | 'aborted'
                    data?: Json
                    started_at?: string
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    protocol_id?: string | null
                    type?: 'pcr_run' | 'growth_curve_run' | 'timer_log'
                    name?: string
                    notes?: string | null
                    status?: 'running' | 'completed' | 'aborted'
                    data?: Json
                    started_at?: string
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

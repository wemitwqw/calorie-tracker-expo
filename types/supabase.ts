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
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories: number
          protein?: number
          carbs?: number
          fat?: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          date?: string
          created_at?: string
        }
      }
    }
  }
}
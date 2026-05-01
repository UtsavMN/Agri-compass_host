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
      posts: {
        Row: {
          id: string
          user_id: string
          title: string | null
          body: string
          content: string | null
          crop_tags: string[] | null
          location: string | null
          images: string[] | null
          created_at: string
          updated_at: string | null
          kn_caption: string | null
          video_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          body: string
          content?: string | null
          crop_tags?: string[] | null
          location?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string | null
          kn_caption?: string | null
          video_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          body?: string
          content?: string | null
          crop_tags?: string[] | null
          location?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string | null
          kn_caption?: string | null
          video_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          phone: string | null
          location: string | null
          language_preference: string
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          phone?: string | null
          location?: string | null
          language_preference?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          phone?: string | null
          location?: string | null
          language_preference?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

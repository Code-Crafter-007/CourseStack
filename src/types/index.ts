export type UserRole = 'student' | 'tutor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface Tutor {
  id: string
  user_id: string
  bio: string | null
  verified: boolean
  created_at: string
}

export interface Course {
  id: string
  tutor_id: string
  title: string
  description: string
  category: string
  price: number
  thumbnail_url: string | null
  published: boolean
  created_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  order_index: number
}

export interface Lecture {
  id: string
  module_id: string
  title: string
  video_url: string
  video_type: 'upload' | 'youtube'
  order_index: number
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  created_at: string
}

export interface Progress {
  id: string
  user_id: string
  lecture_id: string
  completed: boolean
}
export interface User {
  id: number
  email: string
  role: 'candidate' | 'employer' | 'admin'
  created_at: string
}
export interface Job {
  id: number
  employer_id: number
  title: string
  description: string
  category: string
  location: string
  salary_min?: number
  salary_max?: number
  employment_type: string
  status: 'active' | 'closed' | 'draft'
  featured: boolean
  created_at: string
  company_name?: string
}
export interface Application {
  id: number
  job_id: number
  candidate_id: number
  status: string
  applied_at: string
}
export interface Article {
  id: number
  title: string
  slug: string
  body: string
  status: 'draft' | 'published'
  published_at?: string
  author_id?: number
}
export interface Analytics {
  totalUsers: number
  totalJobs: number
  totalApplications: number
  todayRegistrations: number
  activeJobs: number
  newJobsLast30Days: number
  applicationsByStatus: Record<string, number>
}

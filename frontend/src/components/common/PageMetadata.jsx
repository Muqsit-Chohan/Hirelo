import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pages = {
  '/': ['Find your next opportunity', 'Discover jobs, explore employers and take the next step in your career with Hirelo.'],
  '/jobs': ['Find jobs', 'Browse job opportunities and search by role and location on Hirelo.'],
  '/about': ['About us', 'Learn about Hirelo and our approach to connecting people with job opportunities.'],
  '/contactus': ['Contact us', 'Contact Hirelo with questions about jobs, your account or the platform.'],
  '/blogs': ['Career journal', 'Explore career articles and job search resources from Hirelo.'],
  '/terms': ['Terms of Service', 'Read the Hirelo Terms of Service for accounts, job listings, applications and acceptable use.'],
  '/privacy-policy': ['Privacy Policy', 'Learn how Hirelo handles account information, profiles, resumes, applications and browser storage.'],
  '/login': ['Sign in', 'Sign in to your Hirelo account.'],
  '/signup': ['Create an account', 'Create a Hirelo account to find opportunities or connect with candidates.'],
  '/profile': ['Your profile', 'Manage your Hirelo profile and account information.'],
  '/myjobs': ['My jobs', 'Manage your job listings on Hirelo.'],
  '/viewapplications': ['Applications', 'Review applications for your company’s job listings.'],
  '/applied': ['Applied jobs', 'Track your applications and their progress.'],
  '/post-job': ['Post a job', 'Create a job listing on Hirelo.'],
  '/confirm-email': ['Verify your email', 'Verify your email to complete your Hirelo registration.'],
  '/logout': ['Sign out', 'Sign out of Hirelo.'],
}
const publicPaths = new Set(['/', '/jobs', '/about', '/contactus', '/blogs', '/terms', '/privacy-policy'])

export default function PageMetadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const [heading, description] = pages[path] || (path.startsWith('/blog/') ? ['Career article', 'Read career insights and job search advice on Hirelo.'] : path.startsWith('/jobs/') ? ['Job opportunity', 'Explore this job opportunity on Hirelo.'] : path.startsWith('/company/') ? ['Company profile', 'Explore an employer’s profile on Hirelo.'] : ['Your workspace', 'Manage your career and hiring activity on Hirelo.'])
    const title = `${heading} | Hirelo`
    const indexable = publicPaths.has(path) || /^\/(blog|jobs|company)\/[^/]+$/.test(path)
    document.title = title
    const setMeta = (attribute, name, content) => {
      let tag = document.head.querySelector(`meta[${attribute}="${name}"]`)
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, name); document.head.appendChild(tag) }
      tag.setAttribute('content', content)
    }
    setMeta('name', 'description', description)
    setMeta('name', 'robots', indexable ? 'index, follow' : 'noindex, nofollow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', path.startsWith('/blog/') ? 'article' : 'website')
    setMeta('property', 'og:site_name', 'Hirelo')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    let base = window.location.origin
    try { if (import.meta.env.VITE_SITE_URL) base = new URL(import.meta.env.VITE_SITE_URL).origin } catch { /* Use the current site for invalid configuration. */ }
    const url = new URL(path, base).href
    setMeta('property', 'og:url', url)
    const image = new URL('/images/workspace-spatial-blue.png', base).href
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:image:alt', 'Hirelo job application illustration')
    setMeta('name', 'twitter:image', image)
    setMeta('name', 'twitter:image:alt', 'Hirelo job application illustration')
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = url
  }, [pathname])
  return null
}

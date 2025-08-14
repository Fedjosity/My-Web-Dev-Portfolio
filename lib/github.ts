interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  created_at: string
}

interface GitHubUser {
  login: string
  public_repos: number
  followers: number
  following: number
}

interface GitHubContributions {
  total: {
    lastYear: number
  }
}

const GITHUB_API = 'https://api.github.com'
const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'fedjosity'

async function fetchGitHub(endpoint: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json'
  }
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  }

  const response = await fetch(`${GITHUB_API}${endpoint}`, { headers })
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }
  
  return response.json()
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const repos = await fetchGitHub(`/users/${username}/repos?sort=updated&per_page=100`)
    return repos.filter((repo: GitHubRepo) => !repo.name.includes('.github'))
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}

export async function getGitHubUser(): Promise<GitHubUser | null> {
  try {
    return await fetchGitHub(`/users/${username}`)
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    return null
  }
}

export async function getGitHubStats() {
  try {
    const user = await getGitHubUser()
    const repos = await getGitHubRepos()
    
    const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)
    const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0)
    
    return {
      totalRepos: user?.public_repos || 0,
      totalStars,
      totalForks,
      followers: user?.followers || 0,
      contributionsThisYear: 0 // This would need GitHub GraphQL API for accurate data
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return {
      totalRepos: 0,
      totalStars: 0,
      totalForks: 0,
      followers: 0,
      contributionsThisYear: 0
    }
  }
}
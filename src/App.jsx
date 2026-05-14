import { useEffect, useMemo, useState } from 'react'

const PROFILE = {
  name: 'Minh Doan',
  username: 'doanminh2203',
  email: 'mminhdoan2203@gmail.com',
  location: 'Vietnam',
  role: 'Fresher Developer · GitHub Portfolio',
  github: 'https://github.com/doanminh2203',
  bio: 'I build practical software projects, learn by shipping, and use GitHub as my public workspace.',
  tags: [
    'C/C++',
    'Python',
    'GitHub',
    'Embedded System',
    'AI',
    'Product Developer',
    'Research',
  ],
}

const fallbackRepos = [
  {
    name: 'portfolio-site',
    description: 'Personal portfolio website built with React and Vite.',
    html_url: PROFILE.github,
    language: 'JavaScript',
    stargazers_count: 0,
    forks_count: 0,
  },
  {
    name: 'learning-lab',
    description: 'Small projects, notes, and coding practice.',
    html_url: PROFILE.github,
    language: 'Markdown',
    stargazers_count: 0,
    forks_count: 0,
  },
  {
    name: 'web-practice',
    description: 'Frontend practice projects using HTML, CSS, JavaScript, and React.',
    html_url: PROFILE.github,
    language: 'HTML/CSS',
    stargazers_count: 0,
    forks_count: 0,
  },
]

function Header() {
  return (
    <header className="site-header">
      <nav className="nav">
        <a className="brand" href="#home">
          <span className="brand-logo">K</span>
          <span>Minh Doan</span>
        </a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#academic">Academic</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
    </header>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function RepoCard({ repo }) {
  return (
    <a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer">
      <div className="repo-top">
        <h3>{repo.name}</h3>
        <span>↗</span>
      </div>

      <p>{repo.description || 'No description yet. Add one on GitHub to make this card richer.'}</p>

      <div className="repo-meta">
        <span>{repo.language || 'Code'}</span>
        <span>★ {repo.stargazers_count ?? 0}</span>
        <span>⑂ {repo.forks_count ?? 0}</span>
      </div>
    </a>
  )
}

function App() {
  const [githubUser, setGithubUser] = useState(null)
  const [repos, setRepos] = useState(fallbackRepos)
  const [loadingStatus, setLoadingStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    async function loadGithubData() {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${PROFILE.username}`),
          fetch(`https://api.github.com/users/${PROFILE.username}/repos?sort=updated&per_page=6`),
        ])

        if (!userResponse.ok || !reposResponse.ok) {
          throw new Error('Cannot load GitHub data')
        }

        const userData = await userResponse.json()
        const repoData = await reposResponse.json()

        if (!cancelled) {
          setGithubUser(userData)
          setRepos(repoData.length > 0 ? repoData : fallbackRepos)
          setLoadingStatus('loaded')
        }
      } catch (error) {
        if (!cancelled) {
          setLoadingStatus('fallback')
        }
      }
    }

    loadGithubData()

    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    if (!githubUser) {
      return [
        { label: 'GitHub Handle', value: `@${PROFILE.username}` },
        { label: 'Projects', value: repos.length },
        { label: 'Focus', value: 'Web' },
      ]
    }

    return [
      { label: 'Public Repos', value: githubUser.public_repos },
      { label: 'Followers', value: githubUser.followers },
      { label: 'Following', value: githubUser.following },
    ]
  }, [githubUser, repos.length])

  return (
    <>
      <Header />

      <main>
        <section id="home" className="hero section">
          <div className="hero-content">
            <p className="eyebrow">📍 {PROFILE.location}</p>

            <h1>{PROFILE.name}</h1>

            <h2>{PROFILE.role}</h2>

            <p className="hero-description">{PROFILE.bio}</p>

            <div className="tags">
              {PROFILE.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="hero-actions">
              <a className="button primary" href={PROFILE.github} target="_blank" rel="noreferrer">
                View GitHub
              </a>

              <a className="button secondary" href={`mailto:${PROFILE.email}`}>
                Contact Me
              </a>
            </div>
          </div>

          <aside className="profile-card">
            <div className="avatar-wrap">
              {githubUser?.avatar_url ? (
                <img src={githubUser.avatar_url} alt={`${PROFILE.name} avatar`} />
              ) : (
                <span>K</span>
              )}
            </div>

            <div>
              <p className="card-label">GitHub Profile</p>
              <h3>@{PROFILE.username}</h3>
              <p className="card-text">
                {githubUser?.bio || 'GitHub-powered portfolio profile.'}
              </p>
            </div>

            <div className="stats-grid">
              {stats.map((item) => (
                <StatCard key={item.label} value={item.value} label={item.label} />
              ))}
            </div>

            <div className="status-box">
              <strong>Status</strong>
              <p>
                {loadingStatus === 'loaded'
                  ? 'GitHub data loaded successfully. Repositories below are live from your profile.'
                  : 'Using starter content. Check your GitHub username if live data does not appear.'}
              </p>
            </div>
          </aside>
        </section>

        <section id="about" className="section narrow">
          <p className="section-kicker">About</p>
          <h2 className="section-title">About Me</h2>

          <div className="about-box">
            <p>
              Hi, I am <strong>{PROFILE.name}</strong>. This portfolio is inspired by a clean
              academic-style website, but customized for a developer profile with GitHub projects,
              contact links, and a simple responsive layout.
            </p>

            <p>
              I use this page to show what I am learning, what I am building, and where people can
              find my code.
            </p>
          </div>
        </section>

        <section id="academic" className="section narrow">
          <p className="section-kicker">Background</p>
          <h2 className="section-title">Academic & Learning Journey</h2>

          <div className="timeline">
            <article className="timeline-item">
              <span>Now</span>
              <div>
                <h3>Student & Self-directed Developer</h3>
                <p>
                  Focused on building real projects, improving coding fundamentals, and publishing
                  work on GitHub.
                </p>
              </div>
            </article>

            <article className="timeline-item">
              <span>Goal</span>
              <div>
                <h3>Build a strong portfolio</h3>
                <p>
                  Create useful apps, improve UI design, write cleaner code, and document projects
                  so others can understand them.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section id="projects" className="section">
          <p className="section-kicker">GitHub</p>
          <h2 className="section-title">Projects & Repositories</h2>

          <div className="repo-grid">
            {repos.map((repo) => (
              <RepoCard key={repo.id || repo.name} repo={repo} />
            ))}
          </div>
        </section>

        <section id="contact" className="section narrow">
          <p className="section-kicker">Contact</p>
          <h2 className="section-title">Let’s Connect</h2>

          <div className="contact-grid">
            <a href={`mailto:${PROFILE.email}`} className="contact-card">
              <span>✉️</span>
              <strong>Email</strong>
              <p>{PROFILE.email}</p>
            </a>

            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="contact-card">
              <span>💻</span>
              <strong>GitHub</strong>
              <p>@{PROFILE.username}</p>
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} {PROFILE.name}. Built with React and Vite.</p>
      </footer>
    </>
  )
}

export default App
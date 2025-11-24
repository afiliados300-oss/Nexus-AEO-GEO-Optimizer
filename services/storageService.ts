import { User, AnalysisResult } from '../types';

const USERS_KEY = 'nexus_db_users';
const PROJECTS_KEY = 'nexus_db_projects';

// --- AUTH & USER MANAGEMENT ---

export const initDatabase = () => {
  const existing = localStorage.getItem(USERS_KEY);
  
  // Check if not exists OR if it exists but is an empty array (corrupted state)
  let shouldInit = !existing;
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        shouldInit = true;
      }
    } catch (e) {
      shouldInit = true;
    }
  }

  if (shouldInit) {
    const initialUsers: User[] = [
      {
        email: 'admin@nexus.ai',
        name: 'Super Admin',
        role: 'admin',
        password: 'admin123',
        createdAt: new Date().toISOString()
      },
      {
        email: 'user@nexus.ai',
        name: 'Demo User',
        role: 'editor',
        password: 'user123',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  
  if (!localStorage.getItem(PROJECTS_KEY)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([]));
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const addUser = (email: string, password: string, name: string = 'New User'): boolean => {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return false; // User exists
  }
  
  const newUser: User = {
    email: email.trim(), // Keep original casing for display, but use clean for check
    password,
    name,
    role: 'editor',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim(); // Trim password too just in case
  
  // Case-insensitive email check
  const user = users.find(u => 
    u.email.toLowerCase() === cleanEmail && 
    (u.password === cleanPass || u.password === password) // Check both trimmed and raw password
  );
  
  return user || null;
};

export const updateUserPassword = (email: string, newPassword: string): boolean => {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
  
  if (userIndex === -1) return false;
  
  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

// --- PROJECT / DATA MANAGEMENT ---

export const saveProject = (project: AnalysisResult): void => {
  const projectsRaw = localStorage.getItem(PROJECTS_KEY);
  const projects: AnalysisResult[] = projectsRaw ? JSON.parse(projectsRaw) : [];
  
  projects.push(project);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const getProjects = (user: User): AnalysisResult[] => {
  const projectsRaw = localStorage.getItem(PROJECTS_KEY);
  const projects: AnalysisResult[] = projectsRaw ? JSON.parse(projectsRaw) : [];

  if (user.role === 'admin') {
    return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Admin sees all
  } else {
    return projects
      .filter(p => p.userId === user.email) // User sees only theirs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

export const getProjectsByUserEmail = (targetEmail: string): AnalysisResult[] => {
    const projectsRaw = localStorage.getItem(PROJECTS_KEY);
    const projects: AnalysisResult[] = projectsRaw ? JSON.parse(projectsRaw) : [];
    return projects.filter(p => p.userId === targetEmail).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const exportDatabase = () => {
  const users = getUsers();
  const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
  
  const data = {
    users: users.map(u => ({ ...u, password: '[PROTECTED]' })),
    projects
  };
    
  const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonContent);
  link.setAttribute("download", `nexus_full_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
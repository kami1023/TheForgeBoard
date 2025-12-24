export enum Category {
  IMPROVEMENTS = 'Improvements',
  BUG = 'Bug',
  CONTENT = 'Content',
  BALANCE = 'Balance',
  UI_UX = 'UI/UX'
}

export enum Status {
  OPEN = 'Open',
  PLANNED = 'Planned',
  IN_PROGRESS = 'In Development',
  RELEASED = 'Released',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  username: string;
  avatar: string; // URL to avatar image
  discriminator: string; // e.g. #1234
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: Category;
  votes: number;
  status: Status;
  author: string;
  createdAt: string; // ISO Date string
  imageUrl?: string;
  devNote?: string; // Reason for rejection or dev comment
}

export type SortOption = 'Popularity' | 'Newest' | 'Status';

export interface DataContextType {
  ideas: Idea[];
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  addIdea: (idea: Omit<Idea, 'id' | 'votes' | 'createdAt' | 'status'>) => void;
  voteIdea: (id: string) => void;
  updateStatus: (id: string, status: Status, devNote?: string) => void;
  isAdmin: boolean;
  toggleAdmin: () => void;
  hasVoted: (id: string) => boolean;
}
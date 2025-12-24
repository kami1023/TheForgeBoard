import { Idea, Category, Status } from './types';

export const COLORS = {
  background: '#121212',
  card: '#1E1E1E',
  gold: '#FFD700',
  cyan: '#00FFFF',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  success: '#10B981',
  danger: '#EF4444',
  silver: '#C0C0C0',
  bronze: '#CD7F32'
};

export const DISCORD_CONFIG = {
  // The unique ID of "The Forge Official" Discord Server
  GUILD_ID: '987654321098765432', 
  
  // The link provided to users if they are NOT in the server
  INVITE_URL: 'https://discord.gg/forge-official',

  // REPLACE THIS WITH YOUR ACTUAL DISCORD CLIENT ID
  CLIENT_ID: '123456789012345678'
};

export const INITIAL_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'Guild Housing System',
    description: 'We need a place for guilds to hang out. Customizable furniture, trophy halls for raid achievements, and a shared stash.',
    category: Category.CONTENT,
    votes: 1250,
    status: Status.PLANNED,
    author: 'DragonSlayer99',
    createdAt: '2023-10-15T10:00:00Z',
    imageUrl: 'https://picsum.photos/800/400'
  },
  {
    id: '2',
    title: 'Fix the infinite loading screen in Valhalla',
    description: 'Every time I teleport to Valhalla zone, 50% of the time I get stuck on the loading screen. Please fix this critical bug.',
    category: Category.BUG,
    votes: 890,
    status: Status.IN_PROGRESS,
    author: 'GlitchHunter',
    createdAt: '2023-10-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'One-click inventory sort',
    description: 'Managing inventory takes too long. Add a button to auto-sort items by type and rarity.',
    category: Category.IMPROVEMENTS,
    votes: 1100,
    status: Status.OPEN,
    author: 'LootGoblin',
    createdAt: '2023-10-22T09:15:00Z'
  },
  {
    id: '4',
    title: 'Nerf the Shadow Assassin',
    description: 'The stealth duration is too long in PvP. It breaks the balance in arenas.',
    category: Category.BALANCE,
    votes: 450,
    status: Status.REJECTED,
    author: 'PaladinMain',
    createdAt: '2023-10-18T11:20:00Z',
    devNote: 'Stats show win rate is within 48-52%. Learn to use detection wards.'
  },
  {
    id: '5',
    title: 'Dark Mode for Map UI',
    description: 'The current map is blindingly white at night. Please add a dark theme toggle.',
    category: Category.UI_UX,
    votes: 320,
    status: Status.RELEASED,
    author: 'NightOwl',
    createdAt: '2023-10-05T16:45:00Z'
  },
  {
    id: '6',
    title: 'New Raid: The Frozen Citadel',
    description: 'Endgame players need more content. A 12-man raid with ice mechanics would be epic.',
    category: Category.CONTENT,
    votes: 670,
    status: Status.OPEN,
    author: 'RaidLeader',
    createdAt: '2023-10-25T08:00:00Z',
    imageUrl: 'https://picsum.photos/800/401'
  },
  {
    id: '7',
    title: 'Search bar in crafting menu',
    description: 'I can never find the recipe I need. A simple text search would save so much time.',
    category: Category.IMPROVEMENTS,
    votes: 540,
    status: Status.PLANNED,
    author: 'CrafterJoe',
    createdAt: '2023-10-24T12:00:00Z'
  }
];
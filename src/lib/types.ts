// Type definitions for user data

export interface Card {
  id?: number;
  title: string;
  description: string;
  answer: string;
  imageurl: string;
  url: string;
  checked: boolean;
}

export interface Category {
  id?: number;
  title: string;
  description: string;
  progress: number;
  showCards: boolean;
  cards: Card[];
}

export interface UserData {
  id?: number;
  name: string;
  password?: string; // Only for saving, not returned in login
  categories: Category[];
}

export interface loginProps {
    name: string;
    updateName: (newName: string) => void;
    password: string;
    updatePassword: (newPassword: string) => void;
    loginFunc: () => void;
}
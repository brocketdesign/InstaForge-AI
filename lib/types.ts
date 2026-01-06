import { ObjectId } from 'mongodb';

export interface ImageContent {
  url: string;
  textOverlay?: string;
  position?: 'top' | 'center' | 'bottom';
}

export interface ContentItem {
  _id?: ObjectId;
  userId: string;
  prompt: string;
  images: ImageContent[];
  captions: string[];
  hashtags: string[];
  theme: string;
  marketingGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  _id?: ObjectId;
  userId: string;
  defaultTheme?: string;
  defaultMarketingGoal?: string;
  favoriteHashtags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

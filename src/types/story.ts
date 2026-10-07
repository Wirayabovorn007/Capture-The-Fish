export type StoryStatus = "draft" | "published";

export type FishRarity = "common" | "rare" | "ultimate";
export type StoryFishReward = {
  fishId?: string;
  name: string;
  imageUrl: string;
  amount: number;
  rarity: FishRarity;
  description?: string;
  xp?: number;
};

export type StoryTreasure = {
  hint: string;
  fishReward: StoryFishReward;
  combinationCode?: string; // Admin only. Public get_story never returns this.
};

export type StoryChallengeItem = { type: "challenge"; challengeId: string };
export type StoryContentItem = {
  type: "content";
  contentId: string;
  title: string;
  description: string;
  imageUrl?: string;
};
export type StoryItem = StoryChallengeItem | StoryContentItem;

export type StoryAct = {
  actId: string;
  title: string;
  items: StoryItem[];
  challengeIds?: string[];
};

export type StoryConfig = {
  storyId: "main";
  title: string;
  description: string;
  status: StoryStatus;
  acts: StoryAct[];
  treasure?: StoryTreasure;
  updatedAt?: string;
};

export type StoryProgress = {
  solvedChallengeIds: string[];
  treasureUnlocked?: boolean;
};

export type TreasureSubmitResult = {
  correct: boolean;
  alreadyUnlocked: boolean;
  reward?: StoryFishReward | null;
  totalFish?: number | null;
};

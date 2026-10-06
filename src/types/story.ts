export type StoryStatus = "draft" | "published";

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
  updatedAt?: string;
};

export type StoryProgress = { solvedChallengeIds: string[] };

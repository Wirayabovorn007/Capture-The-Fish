export type ContainerAccessType = "none" | "web" | "terminal";

export type FishRarity = "common" | "rare" | "legendary";

export type FishReward = {
  fishId?: string;
  name: string;
  imageUrl: string;
  amount: number;
  rarity: FishRarity;
};

export type DockerContainer = {
  name: string;
  image: string;
  port: string;
  accessType: ContainerAccessType;
  buttonLabel?: string;
};

export type Challenge = {
  challengeId: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  objective: string;
  hint: string;
  containers: DockerContainer[];
  flag?: string;
  fishReward?: FishReward;
};

export type RuntimeContainer = {
  name: string;
  privateIp: string;
  accessType: ContainerAccessType;
  buttonLabel?: string;
  url?: string | null;
};

export type SpawnChallengeResponse = {
  status: string;
  sessionId: string;
};

export type ChallengeStatusResponse = {
  status: string;
  sessionId: string;
  containers: RuntimeContainer[];
  reason?: string;
};

export type SubmitFlagResponse = {
  correct: boolean;
  firstSolve: boolean;
  reward: FishReward | null;
  totalFish: number;
};

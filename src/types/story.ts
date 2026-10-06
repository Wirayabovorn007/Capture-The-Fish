export type StoryStatus = "draft" | "published"

export type StoryAct = {
  actId: string
  title: string
  challengeIds: string[]
}

export type StoryConfig = {
  storyId: "main"
  title: string
  description: string
  status: StoryStatus
  acts: StoryAct[]
  updatedAt?: string
}

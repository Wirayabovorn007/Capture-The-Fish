export type DockerContainer = {
  name: string
  image: string
  port: string
}

export type Challenge = {
  challengeId: string
  title: string
  category: string
  difficulty: string
  description: string
  objective: string
  hint: string
  containers: DockerContainer[]
  flag?: string
}

export type RuntimeContainer = {
  name: string
  url: string
}

export type SpawnChallengeResponse = {
  status: string
  taskArn: string
}

export type ChallengeStatusResponse = {
  status: string
  domain?: string | null
  containers: RuntimeContainer[]
  reason?: string
}

export type SubmitFlagResponse = {
  correct: boolean
}

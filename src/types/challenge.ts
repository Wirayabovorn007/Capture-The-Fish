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
  containers: DockerContainer[]
}
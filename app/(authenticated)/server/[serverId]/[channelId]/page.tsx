import { ServerPageContent } from "@/components/server/server-page-content"

type Props = {
  params: Promise<{ serverId: string; channelId: string }>
}

export default async function ServerPage({ params }: Props) {
  const { serverId, channelId } = await params

  return <ServerPageContent serverId={serverId} channelId={channelId} />
}

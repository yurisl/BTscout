import MatchScreen from './MatchScreen';

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchScreen matchId={id} />;
}

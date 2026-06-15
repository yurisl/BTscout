import ResumoScreen from './ResumoScreen';

export default async function ResumoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResumoScreen matchId={id} />;
}

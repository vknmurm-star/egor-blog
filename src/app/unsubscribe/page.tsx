import UnsubscribeForm from "@/components/UnsubscribeForm";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 pt-40 pb-24 text-center">
      <h1 className="font-heading text-3xl text-paper mb-6">Отписка от рассылки</h1>
      {token ? (
        <UnsubscribeForm token={token} />
      ) : (
        <p className="text-paper-muted">Некорректная ссылка отписки.</p>
      )}
    </div>
  );
}

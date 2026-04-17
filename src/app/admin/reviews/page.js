import ReviewManager from './ReviewManager';

export default function AdminReviewsPage() {
  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '2rem' }}>রিভিউ ম্যানেজমেন্ট</h1>
      <ReviewManager />
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Lock, Paperclip, Tag } from 'lucide-react';

interface PalaceReviewsProps {
  onBack: () => void;
}

const reviews = [
  // Photo reviews first
  { id: 20, name: 'Tom R.',    location: 'London',      rating: 5, comment: 'Mad quality. Fabric is heavy and the print is clean. Proper shirt.',                                                  image: '/reviews/review-20.jpg' },
  { id: 1,  name: 'Ryan S.',   location: 'London',      rating: 5, comment: 'Wore it out the same day it arrived. Getting stopped for it.',                                                        image: '/reviews/review-1.jpg' },
  { id: 24, name: 'Emma L.',   location: 'London',      rating: 5, comment: "Bought it for my boyfriend but I literally can't stop wearing it myself. Fits so well oversized.",                   image: '/reviews/review-24.jpg' },
  { id: 15, name: 'Liam R.',   location: 'Birmingham',  rating: 5, comment: 'Gym mirror pic had to be done. Looks clean.',                                                                         image: '/reviews/review-15.jpg' },
  { id: 13, name: 'Tyler W.',  location: 'Manchester',  rating: 5, comment: 'Mad jersey. Better quality than expected.',                                                                           image: '/reviews/review-13.jpg' },
  { id: 21, name: 'Alex B.',   location: 'Leeds',       rating: 5, comment: 'Laid it out the second I opened it. Looks unreal.',                                                                   image: '/reviews/review-21.jpg' },
  { id: 3,  name: 'Kai B.',    location: 'Leeds',       rating: 5, comment: 'Looks better in person than online. Happy with it.',                                                                  image: '/reviews/review-3.jpg' },
  { id: 6,  name: 'Dean W.',   location: 'Birmingham',  rating: 5, comment: 'Wore it out same day. Everyone was asking where I got it.',                                                            image: '/reviews/review-6.jpg' },
  { id: 23, name: 'Sam K.',    location: 'Sheffield',   rating: 5, comment: 'Looks even better in person. Glad I copped.',                                                                         image: '/reviews/review-23.jpg' },
  { id: 17, name: 'Jay R.',    location: 'London',      rating: 5, comment: 'Wore it out straight away. Getting comments on it.',                                                                  image: '/reviews/review-17.jpg' },
  { id: 18, name: 'Mike D.',   location: 'Manchester',  rating: 5, comment: 'Great fit and quality. Looks sharp.',                                                                                 image: '/reviews/review-18.jpg' },
  { id: 14, name: 'Zak H.',    location: 'London',      rating: 5, comment: 'Fit is decent, well happy with it.',                                                                                  image: '/reviews/review-14.jpg' },
  { id: 12, name: 'Ollie T.',  location: 'London',      rating: 5, comment: 'Looks even better in person. Happy days.',                                                                         image: '/reviews/review-12.jpg' },
  { id: 5,  name: 'Scott A.',  location: 'Liverpool',   rating: 5, comment: 'Came straight to the car. Could not wait to see it.',                                                                  image: '/reviews/review-5.jpg' },
  { id: 16, name: 'Danny H.',  location: 'Manchester',  rating: 5, comment: 'Arrived well packed.',                                                                   image: '/reviews/review-16.jpg' },
  { id: 7,  name: 'Reece N.',  location: 'Manchester',  rating: 5, comment: 'Tried it on straight away. Top quality.',                                                                             image: '/reviews/review-7.jpg' },
  { id: 2,  name: 'Marcus T.', location: 'Birmingham',  rating: 5, comment: 'Ordered a medium, fits well. Looks mad in person.',                                                                   image: '/reviews/review-2.jpg' },
  { id: 11, name: 'Nathan F.', location: 'Sheffield',   rating: 5, comment: 'Tried it on the second it arrived. Does not disappoint.',                                                             image: '/reviews/review-11.jpg' },
  { id: 4,  name: 'Chris O.',  location: 'London',      rating: 5, comment: 'Quick delivery and the shirt is class. Would buy again.',                                                              image: '/reviews/review-4.jpg' },
  { id: 9,  name: 'Jamie K.',  location: 'Leeds',       rating: 5, comment: 'Packaging was secure and arrived in perfect condition.',                                                               image: '/reviews/review-9.jpg' },
  { id: 22, name: 'Connor M.', location: 'Newcastle',   rating: 4, comment: "Delivery took nearly 2 weeks which was frustrating. Shirt itself is quality though so can't knock it too much.",     image: '/reviews/review-22.jpg' },
  // Text-only reviews
  { id: 26, name: 'T.H.',      location: 'London',      rating: 5, comment: 'Class shirt. Gets looks every time I wear it.' },
  { id: 27, name: 'J.W.',      location: 'Manchester',  rating: 5, comment: 'Fire.' },
  { id: 28, name: 'M.B.',      location: 'Birmingham',  rating: 5, comment: 'Mint condition, well packaged, no complaints.' },
  { id: 29, name: 'S.C.',      location: 'Liverpool',   rating: 5, comment: 'Looks even better in person.' },
  { id: 30, name: 'D.L.',      location: 'Leeds',       rating: 5, comment: 'Massive W. One of the best shirts I own.' },
  { id: 31, name: 'A.K.',      location: 'London',      rating: 5, comment: 'Absolute banger. Already getting asked where I got it.' },
  { id: 32, name: 'P.R.',      location: 'Bristol',     rating: 5, comment: 'Proper quality. No complaints.' },
  { id: 33, name: 'C.N.',      location: 'Sheffield',   rating: 5, comment: 'Goes hard. Print quality is mad.' },
  { id: 34, name: 'L.T.',      location: 'London',      rating: 5, comment: 'Different level to anything else out there right now.' },
  { id: 35, name: 'O.F.',      location: 'Newcastle',   rating: 5, comment: 'Elite shirt. Worth every penny.' },
  { id: 36, name: 'H.S.',      location: 'Manchester',  rating: 5, comment: 'Hard.' },
  { id: 37, name: 'R.A.',      location: 'London',      rating: 5, comment: 'Sick design. Fabric feels premium too.' },
  { id: 38, name: 'K.P.',      location: 'Birmingham',  rating: 5, comment: 'Clean.' },
  { id: 39, name: 'F.J.',      location: 'Leeds',       rating: 5, comment: '10/10. Bought two sizes just in case and kept both.' },
  { id: 40, name: 'G.O.',      location: 'London',      rating: 5, comment: 'Top quality, arrived quick.' },
  { id: 41, name: 'I.H.',      location: 'Bristol',     rating: 4, comment: 'Slight delay on delivery but the shirt is quality. Happy overall.' },
  { id: 42, name: 'N.B.',      location: 'Manchester',  rating: 5, comment: 'Unreal shirt. Already planning my next order.' },
  { id: 43, name: 'W.C.',      location: 'Liverpool',   rating: 4, comment: 'Shirt is nice but took longer than expected to arrive. Still happy with it.' },
  { id: 44, name: 'B.M.',      location: 'London',      rating: 4, comment: 'Decent shirt. Delivery was a bit slow.' },
  { id: 47, name: 'X.T.',      location: 'Birmingham',  rating: 5, comment: 'Proper shirt. Fits great on a large.' },
  { id: 48, name: 'Y.M.',      location: 'London',      rating: 5, comment: 'Wore it day one. Everyone clocked it.' },
  { id: 49, name: 'Z.L.',      location: 'Manchester',  rating: 5, comment: 'Different level.' },
  { id: 45, name: 'E.R.',      location: 'Sheffield',   rating: 2, comment: 'My order got lost in the post. They offered to send another one but I just asked for a refund instead, which they sorted tbf.' },
  { id: 46, name: 'V.S.',      location: 'London',      rating: 1, comment: 'Waited nearly 2 weeks for mine to arrive. Not great.' },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-brand-black text-brand-black" />
      ))}
    </div>
  );
}

export default function PalaceReviews({ onBack }: PalaceReviewsProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const displayed = filterRating !== null ? reviews.filter(r => r.rating === filterRating) : reviews;

  return (
    <main className="pt-32 pb-24 max-w-5xl mx-auto px-6 md:px-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-60 transition-opacity"
      >
        <ChevronLeft size={14} /> Back
      </button>

      {/* Header + Leave a Review side by side */}
      <div className="mb-16">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gray-dark mb-2">Palace x Nike 2026 World Cup Jersey</p>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] mb-8">Customer Reviews</h1>

        <div className="flex flex-col lg:flex-row gap-8 border-t border-brand-gray-light pt-6">
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold">{avg}</p>
              <Stars count={5} />
              <p className="text-[10px] uppercase tracking-widest text-brand-gray-dark mt-1">{reviews.length} reviews</p>
            </div>
            <div className="h-16 w-px bg-brand-gray-light" />
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map(n => {
                const count = reviews.filter(r => r.rating === n).length;
                const pct = Math.round((count / reviews.length) * 100);
                const active = filterRating === n;
                return (
                  <button
                    key={n}
                    onClick={() => setFilterRating(active ? null : n)}
                    className={`flex items-center gap-3 w-full hover:opacity-70 transition-opacity ${active ? 'opacity-100' : 'opacity-60'}`}
                  >
                    <span className={`text-[10px] w-4 text-right font-bold ${active ? 'text-brand-black' : 'text-brand-gray-dark'}`}>{n}</span>
                    <Star size={10} className="fill-brand-black text-brand-black flex-shrink-0" />
                    <div className="w-32 h-1.5 bg-brand-gray-light/40">
                      <div className={`h-full ${active ? 'bg-brand-black' : 'bg-brand-black/60'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-brand-gray-dark">{count}</span>
                  </button>
                );
              })}
              {filterRating !== null && (
                <button onClick={() => setFilterRating(null)} className="text-[9px] uppercase tracking-widest text-brand-gray-dark underline mt-1 hover:text-brand-black transition-colors">
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-brand-gray-light self-stretch" />

          {/* Leave a Review */}
          <div className="flex-1 border border-brand-gray-light p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Leave a Review</h2>
              <div className="flex items-center gap-1.5 text-brand-gray-dark">
                <Lock size={11} />
                <span className="text-[10px] uppercase tracking-widest">Verified Purchases Only</span>
              </div>
            </div>

            <div className="relative">
              <div className="opacity-25 pointer-events-none select-none space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-gray-dark mb-1.5">Your Rating</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => <Star key={n} size={18} className="text-brand-gray-light fill-brand-gray-light" />)}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-gray-dark mb-1.5">Your Review</p>
                  <div className="w-full h-16 border border-brand-gray-light bg-white" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-gray-dark">
                    <Paperclip size={13} />
                    <span className="text-[11px]">Attach photo</span>
                  </div>
                  <div className="h-7 w-20 border border-brand-gray-light bg-white" />
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border border-brand-gray-light flex items-center justify-center bg-white">
                  <Lock size={13} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-center">Purchase Required</p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 bg-brand-gray-light/20 px-3 py-2.5">
              <Tag size={12} className="flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-brand-gray-dark leading-relaxed">
                <span className="font-bold text-brand-black">Attach a photo with your review</span> and we'll send you a discount code off your next order.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {displayed.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="border border-brand-gray-light overflow-hidden flex"
          >
            {'image' in review ? (
              <div className="w-36 flex-shrink-0 bg-brand-gray-light/10">
                <img src={review.image} alt={review.name} className="w-full h-auto block" />
              </div>
            ) : (
              <div className="w-16 flex-shrink-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-brand-gray-light/40 flex items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{review.name.replace('.', '').replace(' ', '')}</span>
                </div>
              </div>
            )}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">{review.name}</p>
                    <p className="text-[10px] text-brand-gray-dark uppercase tracking-widest">{review.location}</p>
                    <Stars count={review.rating} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold border border-emerald-400 px-1.5 py-0.5 inline-block">
                      Verified
                    </span>
                  </div>
                </div>
                <p className="text-sm text-brand-gray-dark leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

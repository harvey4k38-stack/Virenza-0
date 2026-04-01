import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Lock, Paperclip, Tag } from 'lucide-react';

interface JerseyReviewsProps {
  jerseyId: string;
  onBack: () => void;
}

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
}

const REVIEWS: Record<string, { title: string; subtitle: string; reviews: Review[] }> = {
  'j-nike-away-2026': {
    title: 'England Nike Away 2026 World Cup',
    subtitle: 'Customer Reviews',
    reviews: [
      { id: 1,  name: 'A.T.',    location: 'London',      rating: 5, comment: 'Red away kit goes mad. One of the best away shirts they have done in years.' },
      { id: 2,  name: 'Josh M.', location: 'Birmingham',  rating: 5, comment: 'Wore it to the pub straight away. Everyone was asking where I got it.' },
      { id: 3,  name: 'R.K.',    location: 'Manchester',  rating: 5, comment: 'Looks class in person. The red hits different on this one.' },
      { id: 4,  name: 'Sam W.',  location: 'Sheffield',   rating: 5, comment: 'Proper quality shirt. Really happy with it.' },
      { id: 5,  name: 'D.N.',    location: 'Liverpool',   rating: 5, comment: 'Arrived fast and looks even better than the photos online.' },
      { id: 6,  name: 'Luke B.', location: 'Leeds',       rating: 5, comment: 'England away is always slept on. Not this season.' },
      { id: 7,  name: 'C.P.',    location: 'Bristol',     rating: 5, comment: 'Sharp shirt. Fits well on a medium. Very impressed.' },
      { id: 8,  name: 'T.G.',    location: 'London',      rating: 5, comment: 'Got it ahead of the summer tournament. Going to look fire.' },
      { id: 9,  name: 'M.F.',    location: 'Newcastle',   rating: 5, comment: 'Top quality. No complaints at all.' },
      { id: 10, name: 'O.B.',    location: 'Birmingham',  rating: 5, comment: 'Mad design. The navy trim is clean. Proper England kit.' },
      { id: 11, name: 'J.S.',    location: 'Sheffield',   rating: 5, comment: 'Could not wait to get it out of the package. Looks unreal.' },
      { id: 12, name: 'K.R.',    location: 'London',      rating: 5, comment: 'Arrived in mint condition. Proper England shirt.' },
      { id: 13, name: 'B.H.',    location: 'Manchester',  rating: 5, comment: 'Looks elite. Already getting comments on it.' },
      { id: 14, name: 'A.W.',    location: 'Liverpool',   rating: 5, comment: 'Fast delivery, quality is definitely there.' },
      { id: 15, name: 'H.T.',    location: 'Leeds',       rating: 5, comment: 'Different level. Worth every penny.' },
      { id: 16, name: 'F.C.',    location: 'Bristol',     rating: 5, comment: 'Great shirt, fits true to size. Buying another for my son.' },
      { id: 17, name: 'N.L.',    location: 'London',      rating: 5, comment: 'Clean. The away kit always goes and this one is no different.' },
      { id: 18, name: 'P.M.',    location: 'Sheffield',   rating: 5, comment: 'Mad quality for the price. Very happy with the purchase.' },
      { id: 19, name: 'L.K.',    location: 'Birmingham',  rating: 5, comment: 'Iconic away kit. Looks even better in person than on site.' },
      { id: 20, name: 'G.S.',    location: 'Manchester',  rating: 5, comment: 'Arrived well packed. Quality is top. Would recommend.' },
      { id: 21, name: 'E.T.',    location: 'London',      rating: 5, comment: 'Fits great on a large. Proper England shirt.' },
      { id: 22, name: 'I.N.',    location: 'Leeds',       rating: 5, comment: 'England away never looked this good. Brilliant kit.' },
      { id: 23, name: 'V.H.',    location: 'Bristol',     rating: 5, comment: 'Proper England kit. Would buy again without hesitation.' },
      { id: 24, name: 'W.B.',    location: 'Newcastle',   rating: 4, comment: 'Great shirt but took a couple of extra days to arrive. Quality is spot on though.' },
      { id: 25, name: 'Q.A.',    location: 'London',      rating: 4, comment: 'Shirt is brilliant. Delivery was slightly slower than expected but no real complaints.' },
    ],
  },
  'j-retro-saka': {
    title: 'England Retro Classic',
    subtitle: 'Customer Reviews',
    reviews: [
      { id: 1,  name: 'J.B.',    location: 'London',      rating: 5, comment: 'Saka 7 on the back is a vibe. Classic shirt done properly.' },
      { id: 2,  name: 'Tom H.',  location: 'Birmingham',  rating: 5, comment: 'Retro England is always a W. Quality is definitely there.' },
      { id: 3,  name: 'R.W.',    location: 'Sheffield',   rating: 5, comment: 'Wore it on match day. Getting stopped for it all night.' },
      { id: 4,  name: 'M.K.',    location: 'Manchester',  rating: 5, comment: 'Fits perfect. Better quality than I expected.' },
      { id: 5,  name: 'C.L.',    location: 'Leeds',       rating: 5, comment: 'Classic kit. Arrived in great condition, well packaged.' },
      { id: 6,  name: 'A.P.',    location: 'London',      rating: 5, comment: 'The Umbro badge takes me right back. Love this shirt.' },
      { id: 7,  name: 'D.T.',    location: 'Liverpool',   rating: 5, comment: 'Looks unreal. Retro England always goes hard.' },
      { id: 8,  name: 'S.N.',    location: 'Bristol',     rating: 5, comment: 'Proper old school feel. Fabric is quality.' },
      { id: 9,  name: 'O.H.',    location: 'Newcastle',   rating: 5, comment: 'Sharp design. Worth every penny without a doubt.' },
      { id: 10, name: 'K.B.',    location: 'London',      rating: 5, comment: 'Mad shirt. Gets comments every single time I wear it.' },
      { id: 11, name: 'L.F.',    location: 'Birmingham',  rating: 5, comment: 'Top quality. Packaging was solid, arrived in perfect condition.' },
      { id: 12, name: 'G.R.',    location: 'Sheffield',   rating: 5, comment: 'Retro vibes are unmatched. Very happy with it.' },
      { id: 13, name: 'B.W.',    location: 'Manchester',  rating: 5, comment: 'Classic England. Goes with everything. Bought one for my dad too.' },
      { id: 14, name: 'H.C.',    location: 'Leeds',       rating: 5, comment: 'Brilliant shirt. Looks even better in person.' },
      { id: 15, name: 'F.M.',    location: 'London',      rating: 5, comment: 'The three lions badge is elite on this one. Spot on.' },
      { id: 16, name: 'N.T.',    location: 'Liverpool',   rating: 5, comment: 'Saka on the back is different. Fire shirt, no question.' },
      { id: 17, name: 'P.S.',    location: 'Bristol',     rating: 5, comment: '10/10 would recommend. Proper quality from start to finish.' },
      { id: 18, name: 'E.B.',    location: 'London',      rating: 5, comment: 'One of the best retro shirts out there right now.' },
      { id: 19, name: 'I.H.',    location: 'Sheffield',   rating: 5, comment: 'Class shirt. Already thinking about my next order.' },
      { id: 20, name: 'Z.P.',    location: 'Manchester',  rating: 5, comment: 'Elite. No other word for it.' },
      { id: 21, name: 'Y.W.',    location: 'Leeds',       rating: 5, comment: 'Arrived perfectly packaged. Top shirt through and through.' },
      { id: 22, name: 'X.N.',    location: 'London',      rating: 5, comment: 'Retro England never gets old. Very happy days.' },
      { id: 23, name: 'W.K.',    location: 'Newcastle',   rating: 4, comment: 'Delivery was a bit slow but the shirt itself is quality. Happy with it overall.' },
      { id: 24, name: 'V.L.',    location: 'Birmingham',  rating: 4, comment: 'Fits well on an XL. Looks mad. Slight wait on delivery but worth it.' },
    ],
  },
  'j-retro-gazza': {
    title: 'England 1990 Retro',
    subtitle: 'Customer Reviews',
    reviews: [
      { id: 1,  name: 'J.T.',    location: 'London',      rating: 5, comment: 'Italia 90 is the greatest kit ever made. This is absolutely spot on.' },
      { id: 2,  name: 'M.R.',    location: 'Birmingham',  rating: 5, comment: 'Gazza 8 on the back. Say no more. Perfect shirt.' },
      { id: 3,  name: 'R.B.',    location: 'Sheffield',   rating: 5, comment: 'Wore it the second it arrived. Looks unreal in person.' },
      { id: 4,  name: 'C.W.',    location: 'Manchester',  rating: 5, comment: 'Quality is proper. The 1990 shirt is a different level entirely.' },
      { id: 5,  name: 'A.H.',    location: 'Leeds',       rating: 5, comment: 'Iconic kit. Arrived perfectly packaged. Top purchase.' },
      { id: 6,  name: 'D.K.',    location: 'Liverpool',   rating: 5, comment: 'Nobody does retro like this. Completely spot on.' },
      { id: 7,  name: 'S.P.',    location: 'Bristol',     rating: 5, comment: 'Classic. Gets comments from every football fan I pass.' },
      { id: 8,  name: 'T.N.',    location: 'Newcastle',   rating: 5, comment: 'Italia 90 vibes. Absolutely mint condition.' },
      { id: 9,  name: 'O.L.',    location: 'London',      rating: 5, comment: 'Gascoigne 8 is the only name that could go on this shirt. Perfect.' },
      { id: 10, name: 'K.C.',    location: 'Birmingham',  rating: 5, comment: 'Top quality. The classic Umbro kit is legendary and this does it justice.' },
      { id: 11, name: 'L.S.',    location: 'Sheffield',   rating: 5, comment: 'Fits great on a medium. Looks even better in person.' },
      { id: 12, name: 'G.B.',    location: 'Manchester',  rating: 5, comment: 'One of the best shirts I own. Classic England through and through.' },
      { id: 13, name: 'B.T.',    location: 'Leeds',       rating: 5, comment: 'Mad quality. Proper retro feel to the fabric. Well impressed.' },
      { id: 14, name: 'H.M.',    location: 'Liverpool',   rating: 5, comment: 'Wore it out. Every football fan in the pub knew exactly what it was.' },
      { id: 15, name: 'F.W.',    location: 'Bristol',     rating: 5, comment: 'Sharp design. Worth every single penny.' },
      { id: 16, name: 'N.H.',    location: 'Newcastle',   rating: 5, comment: 'The 1990 shirt is untouchable. This is absolute class.' },
      { id: 17, name: 'P.K.',    location: 'London',      rating: 5, comment: 'Iconic. Getting stopped everywhere I go wearing it.' },
      { id: 18, name: 'E.S.',    location: 'Sheffield',   rating: 5, comment: 'Elite shirt. Already planning my next order.' },
      { id: 19, name: 'I.T.',    location: 'Manchester',  rating: 5, comment: 'Italia 90 is in a league of its own. Top purchase without question.' },
      { id: 20, name: 'V.B.',    location: 'Leeds',       rating: 5, comment: 'Arrived in perfect condition. Top shirt all round.' },
      { id: 21, name: 'Y.L.',    location: 'Bristol',     rating: 5, comment: 'Gazza 8. What else do you need to know. Brilliant.' },
      { id: 22, name: 'X.C.',    location: 'Newcastle',   rating: 5, comment: 'Proper England kit. Wore it the same day it arrived.' },
      { id: 23, name: 'Q.P.',    location: 'London',      rating: 5, comment: 'Mad quality for the price. Very happy with this one.' },
      { id: 24, name: 'U.H.',    location: 'Birmingham',  rating: 5, comment: 'Retro classic done right. Gets comments every single time.' },
      { id: 25, name: 'W.R.',    location: 'Sheffield',   rating: 4, comment: 'Waited a few extra days for delivery but the shirt is quality. No real complaints.' },
      { id: 26, name: 'Z.N.',    location: 'Liverpool',   rating: 4, comment: 'Legendary kit. Delivery took slightly longer than expected but well worth the wait.' },
    ],
  },
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-brand-black text-brand-black" />
      ))}
    </div>
  );
}

export default function JerseyReviews({ jerseyId, onBack }: JerseyReviewsProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const data = REVIEWS[jerseyId];
  if (!data) return null;

  const { title, subtitle, reviews } = data;
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

      <div className="mb-16">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gray-dark mb-2">{title}</p>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] mb-8">{subtitle}</h1>

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
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="border border-brand-gray-light overflow-hidden flex"
          >
            <div className="w-16 flex-shrink-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-brand-gray-light/40 flex items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {review.name.replace(/\./g, '').replace(' ', '')}
                </span>
              </div>
            </div>
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

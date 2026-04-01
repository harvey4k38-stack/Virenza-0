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
      { id: 1,  name: 'A.T.',    location: 'London',      rating: 5, comment: 'Always preferred the away kit and this one does not disappoint. The red and navy combo is spot on.' },
      { id: 2,  name: 'Josh M.', location: 'Birmingham',  rating: 5, comment: 'Ordered a large, fits perfectly. Not too baggy, not too fitted. Exactly what I wanted.' },
      { id: 3,  name: 'R.K.',    location: 'Manchester',  rating: 5, comment: 'The fabric is proper quality, not that thin cheap feel you sometimes get. Really impressed.' },
      { id: 4,  name: 'Sam W.',  location: 'Sheffield',   rating: 5, comment: 'Bought this to wear at the World Cup watch parties this summer. Cannot wait.' },
      { id: 5,  name: 'D.N.',    location: 'Liverpool',   rating: 5, comment: 'Had it on at the match last week. Comfortable all day, no issues at all.' },
      { id: 6,  name: 'Luke B.', location: 'Leeds',       rating: 5, comment: 'England away kits are usually forgotten about but this is genuinely one of the best they have had.' },
      { id: 7,  name: 'C.P.',    location: 'Bristol',     rating: 5, comment: 'Bought one for me and one for my mate. Both pleased with it. Sizing is consistent.' },
      { id: 8,  name: 'T.G.',    location: 'London',      rating: 5, comment: 'The stitching and print quality is noticeably better than I expected at this price point.' },
      { id: 9,  name: 'M.F.',    location: 'Newcastle',   rating: 5, comment: 'Solid shirt. Washed it twice already and holds up perfectly, no fading.' },
      { id: 10, name: 'O.B.',    location: 'Birmingham',  rating: 5, comment: 'The navy trim around the collar and cuffs is a nice touch. Elevates the whole design.' },
      { id: 11, name: 'J.S.',    location: 'Sheffield',   rating: 5, comment: 'Tried a medium even though I usually go large and it fits great — runs slightly generous.' },
      { id: 12, name: 'K.R.',    location: 'London',      rating: 5, comment: 'Good weight to the fabric. Does not feel like a throwaway shirt.' },
      { id: 13, name: 'B.H.',    location: 'Manchester',  rating: 5, comment: 'Arrived next day, well packaged. Exactly as pictured. No complaints.' },
      { id: 14, name: 'A.W.',    location: 'Liverpool',   rating: 5, comment: 'My son wanted one so I ordered both of ours together. Both arrived the same day in great condition.' },
      { id: 15, name: 'H.T.',    location: 'Leeds',       rating: 5, comment: 'The red is a proper bold red, not washed out. Stands out well.' },
      { id: 16, name: 'F.C.',    location: 'Bristol',     rating: 5, comment: 'Worn it to three games now and it still looks brand new. Quality that lasts.' },
      { id: 17, name: 'N.L.',    location: 'London',      rating: 5, comment: 'Went for the XXL for an oversized fit and it works really well. Happy with how it sits.' },
      { id: 18, name: 'P.M.',    location: 'Sheffield',   rating: 5, comment: 'Decent price for what you get. The official retail version is nearly three times the price.' },
      { id: 19, name: 'L.K.',    location: 'Birmingham',  rating: 5, comment: 'My go-to shirt for watching England now. Comfortable and looks the part.' },
      { id: 20, name: 'G.S.',    location: 'Manchester',  rating: 5, comment: 'Three lions badge is sharp and clear. Print is clean with no blurring around the edges.' },
      { id: 21, name: 'E.T.',    location: 'London',      rating: 5, comment: 'Bought the kids version too. Both the same quality which is good to see.' },
      { id: 22, name: 'I.N.',    location: 'Leeds',       rating: 5, comment: 'Have owned a lot of England shirts over the years and the construction on this is genuinely up there.' },
      { id: 23, name: 'V.H.',    location: 'Bristol',     rating: 5, comment: 'Wore it on a night out last weekend. Smart enough to pass as a going out shirt.' },
      { id: 24, name: 'W.B.',    location: 'Newcastle',   rating: 4, comment: 'Took about four days to arrive rather than the two expected. Shirt itself is quality though, no issues.' },
      { id: 25, name: 'Q.A.',    location: 'London',      rating: 4, comment: 'Had a small delay with delivery but the shirt is exactly what I hoped for. Would still buy again.' },
    ],
  },
  'j-retro-saka': {
    title: 'England Retro Classic',
    subtitle: 'Customer Reviews',
    reviews: [
      { id: 1,  name: 'J.B.',    location: 'London',      rating: 5, comment: 'Saka 7 on a classic Umbro cut is such a good combination. Old school shirt, modern name.' },
      { id: 2,  name: 'Tom H.',  location: 'Birmingham',  rating: 5, comment: 'Bought this as a birthday present for my dad. He was made up with it — said it brought back memories.' },
      { id: 3,  name: 'R.W.',    location: 'Sheffield',   rating: 5, comment: 'The Umbro double diamond on the collar is what makes this shirt. Takes you straight back.' },
      { id: 4,  name: 'M.K.',    location: 'Manchester',  rating: 5, comment: 'I collect retro England shirts and this sits perfectly alongside the originals. Proper faithful to the design.' },
      { id: 5,  name: 'C.L.',    location: 'Leeds',       rating: 5, comment: 'Bought it to wear to a 90s themed football night and it was perfect. Got a lot of love for it.' },
      { id: 6,  name: 'A.P.',    location: 'London',      rating: 5, comment: 'The cut is different to a modern shirt — more relaxed, proper retro fit. That is exactly what I wanted.' },
      { id: 7,  name: 'D.T.',    location: 'Liverpool',   rating: 5, comment: 'My grandad used to have the original. Showed him a photo and he said it was spot on. That is good enough for me.' },
      { id: 8,  name: 'S.N.',    location: 'Bristol',     rating: 5, comment: 'Went for an XL for a slightly oversized look and it hangs perfectly. Really pleased with the fit.' },
      { id: 9,  name: 'O.H.',    location: 'Newcastle',   rating: 5, comment: 'Classic white England is undefeated. This version does the original proper justice.' },
      { id: 10, name: 'K.B.',    location: 'London',      rating: 5, comment: 'Having Saka on the back of a retro cut makes it feel timeless. Great shirt to own.' },
      { id: 11, name: 'L.F.',    location: 'Birmingham',  rating: 5, comment: 'The embroidered badge rather than a printed one makes a real difference. Looks premium.' },
      { id: 12, name: 'G.R.',    location: 'Sheffield',   rating: 5, comment: 'Wore it to watch the Euros at a bar and had a few people asking about it. Nice conversation starter.' },
      { id: 13, name: 'B.W.',    location: 'Manchester',  rating: 5, comment: 'Got it as a gift to myself. Sometimes you just have to treat yourself and I do not regret it.' },
      { id: 14, name: 'H.C.',    location: 'Leeds',       rating: 5, comment: 'The fabric has a slightly heavier feel than a modern shirt which I prefer. Feels more substantial.' },
      { id: 15, name: 'F.M.',    location: 'London',      rating: 5, comment: 'My nephew asked me to get him one too after seeing mine. That tells you everything.' },
      { id: 16, name: 'N.T.',    location: 'Liverpool',   rating: 5, comment: 'Saka is my favourite player so having him on a classic Umbro shirt felt like a no-brainer purchase.' },
      { id: 17, name: 'P.S.',    location: 'Bristol',     rating: 5, comment: 'Really clean print on the name and number. No cracking or peeling after a few washes.' },
      { id: 18, name: 'E.B.',    location: 'London',      rating: 5, comment: 'Retro England shirts are always a talking point. This one does not let the side down.' },
      { id: 19, name: 'I.H.',    location: 'Sheffield',   rating: 5, comment: 'I expected it to look slightly cheap given the price but it genuinely does not. Very surprised.' },
      { id: 20, name: 'Z.P.',    location: 'Manchester',  rating: 5, comment: 'Arrived folded nicely and well packaged. Small detail but it matters.' },
      { id: 21, name: 'Y.W.',    location: 'Leeds',       rating: 5, comment: 'The collar detailing is exactly right — that was always my worry with retro reproductions but this nailed it.' },
      { id: 22, name: 'X.N.',    location: 'London',      rating: 5, comment: 'Paired it with some cream trousers and it looked proper smart. Versatile shirt.' },
      { id: 23, name: 'W.K.',    location: 'Newcastle',   rating: 4, comment: 'Delivery was slower than expected, took nearly a week. Shirt is great though so I cannot mark it down too much.' },
      { id: 24, name: 'V.L.',    location: 'Birmingham',  rating: 4, comment: 'Had to chase up my order as there was no tracking update for a few days. Got there in the end and the shirt is quality.' },
    ],
  },
  'j-retro-gazza': {
    title: 'England 1990 Retro',
    subtitle: 'Customer Reviews',
    reviews: [
      { id: 1,  name: 'J.T.',    location: 'London',      rating: 5, comment: 'My dad cried when he saw this. He was there at Italia 90 and said it is identical to what he remembers.' },
      { id: 2,  name: 'M.R.',    location: 'Birmingham',  rating: 5, comment: 'Gascoigne 8 on the back is non-negotiable for this shirt. Whoever decided that was right.' },
      { id: 3,  name: 'R.B.',    location: 'Sheffield',   rating: 5, comment: 'I was not alive in 1990 but this shirt makes me wish I was. The design is genuinely timeless.' },
      { id: 4,  name: 'C.W.',    location: 'Manchester',  rating: 5, comment: 'Watched the Italia 90 documentary and ordered this the same evening. No regrets whatsoever.' },
      { id: 5,  name: 'A.H.',    location: 'Leeds',       rating: 5, comment: 'The weight and feel of the fabric is closer to an actual 90s shirt than I expected. Proper throwback.' },
      { id: 6,  name: 'D.K.',    location: 'Liverpool',   rating: 5, comment: 'Bought one for me and my old man. He is 58 and said it is the best gift he has had in years.' },
      { id: 7,  name: 'S.P.',    location: 'Bristol',     rating: 5, comment: 'The Umbro badge on the chest alongside the three lions is everything. That detail is what makes it.' },
      { id: 8,  name: 'T.N.',    location: 'Newcastle',   rating: 5, comment: 'Wore it to a vintage football market and had two offers to buy it off me. That says it all.' },
      { id: 9,  name: 'O.L.',    location: 'London',      rating: 5, comment: 'A piece of English football history. Every fan should own this shirt at least once.' },
      { id: 10, name: 'K.C.',    location: 'Birmingham',  rating: 5, comment: 'The cut is more boxy than a modern shirt which is exactly right for the era. They did not cut corners.' },
      { id: 11, name: 'L.S.',    location: 'Sheffield',   rating: 5, comment: 'I have seen cheap knockoffs of this shirt and they are nowhere near. This is a different class.' },
      { id: 12, name: 'G.B.',    location: 'Manchester',  rating: 5, comment: 'Framed mine on the wall. Too special to just hang in the wardrobe.' },
      { id: 13, name: 'B.T.',    location: 'Leeds',       rating: 5, comment: 'Proper conversation starter at any football gathering. Nobody sees it and stays quiet.' },
      { id: 14, name: 'H.M.',    location: 'Liverpool',   rating: 5, comment: 'My grandad played five-a-side in this kit back in the day. Ordering him one as a surprise.' },
      { id: 15, name: 'F.W.',    location: 'Bristol',     rating: 5, comment: 'The collar is the exact right shade of blue. Whoever sourced the fabric did their research.' },
      { id: 16, name: 'N.H.',    location: 'Newcastle',   rating: 5, comment: 'Gazza tearing up on the pitch in this shirt is one of the most iconic images in football. Proud to own it.' },
      { id: 17, name: 'P.K.',    location: 'London',      rating: 5, comment: 'Used to have a battered original as a kid. This is a faithful recreation and I am genuinely pleased.' },
      { id: 18, name: 'E.S.',    location: 'Sheffield',   rating: 5, comment: 'Wore it to a 90s football quiz night. Our team won. Coincidence? Probably. But still.' },
      { id: 19, name: 'I.T.',    location: 'Manchester',  rating: 5, comment: 'Showed my dad the photos before ordering. He said just buy it. We both ordered one.' },
      { id: 20, name: 'V.B.',    location: 'Leeds',       rating: 5, comment: 'The stitching detail around the crest is neat and precise. Nothing sloppy about this at all.' },
      { id: 21, name: 'Y.L.',    location: 'Bristol',     rating: 5, comment: 'Bought it on a whim and immediately glad I did. One of the better purchases I have made.' },
      { id: 22, name: 'X.C.',    location: 'Newcastle',   rating: 5, comment: 'Had it on watching the old England highlights on YouTube. Felt right. Sounds mad but it did.' },
      { id: 23, name: 'Q.P.',    location: 'London',      rating: 5, comment: 'Washes well, no shrinkage on a 30 degree cycle. Still looks perfect after multiple wears.' },
      { id: 24, name: 'U.H.',    location: 'Birmingham',  rating: 5, comment: 'For anyone who loves the history of English football this shirt is a must. Simple as that.' },
      { id: 25, name: 'W.R.',    location: 'Sheffield',   rating: 4, comment: 'Took a few extra days to arrive and I was getting anxious, but when it landed the quality made up for it.' },
      { id: 26, name: 'Z.N.',    location: 'Liverpool',   rating: 4, comment: 'Delivery communication could be better. That said the shirt itself is exactly what I hoped for.' },
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
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-60 transition-opacity cursor-pointer touch-manipulation"
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

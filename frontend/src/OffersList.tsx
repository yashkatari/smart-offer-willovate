import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { FALLBACK_OFFERS } from './lib/fallbackData';

export default function OffersList() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*, business:businesses(*)')
          .eq('status', 'Active');
        
        const fallbackFormatted = FALLBACK_OFFERS.map(fo => ({
          id: fo.id,
          business: fo.business.name,
          title: fo.title,
          originalPrice: `$${fo.original_price}`,
          offerPrice: `$${fo.offer_price}`,
          discount: `${fo.discount_percentage}%`,
          slots: fo.capacity,
          image: fo.image_url
        }));

        if (error || !data || data.length === 0) {
          setOffers(fallbackFormatted);
        } else {
          const realFormatted = data.map((fo: any) => ({
            id: fo.id,
            business: fo.business?.name || 'Unknown',
            title: fo.title,
            originalPrice: `$${fo.original_price}`,
            offerPrice: `$${fo.offer_price}`,
            discount: `${fo.discount_percentage}%`,
            slots: fo.capacity,
            image: fo.image_url
          }));
          // Merge real offers with fallbacks so the page is always full!
          setOffers([...realFormatted, ...fallbackFormatted]);
        }
      } catch (err) {
        const fallbackFormatted = FALLBACK_OFFERS.map(fo => ({
          id: fo.id,
          business: fo.business.name,
          title: fo.title,
          originalPrice: `$${fo.original_price}`,
          offerPrice: `$${fo.offer_price}`,
          discount: `${fo.discount_percentage}%`,
          slots: fo.capacity,
          image: fo.image_url
        }));
        setOffers(fallbackFormatted);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#FEF2ED] flex items-center justify-center text-gray-500">Loading offers...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FEF2ED] font-sans pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[12px] font-semibold">
            3
          </div>
          <div className="text-[13px] font-medium border border-gray-300 rounded-full px-4 py-1.5 text-gray-900">
            Active Offers
          </div>
        </div>

        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-12">
          Discover limited-time <br className="hidden sm:block" />
          slots near you.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                <div className="absolute top-4 right-4 bg-[#F26522] text-white text-[12px] font-bold px-3 py-1 rounded-full">
                  {offer.discount} OFF
                </div>
              </div>
              <div className="p-5">
                <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-1">{offer.business}</p>
                <h3 className="text-[18px] font-semibold text-gray-900 mb-3">{offer.title}</h3>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[20px] font-bold text-gray-900">{offer.offerPrice}</span>
                  <span className="text-[14px] text-gray-400 line-through">{offer.originalPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {offer.slots} slots left
                  </span>
                  <Link to={`/offer/${offer.id}`} className="bg-gray-900 text-white w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-[#F26522] transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

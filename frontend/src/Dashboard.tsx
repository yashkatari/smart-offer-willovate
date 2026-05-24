import { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Users, Calendar, Activity, X, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Offer Form State
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    original_price: '',
    offer_price: '',
    capacity: 10,
    start_date: '',
    end_date: '',
    image_url: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      // 1. Check Authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);

      try {
        // 2. Check if user is a business owner
        const { data: bizData } = await supabase.from('businesses').select('id').eq('owner_id', session.user.id).single();
        
        if (!bizData) {
          setHasBusiness(false);
          setLoading(false);
          return; // Stop loading dashboard if not a business
        }
        
        setHasBusiness(true);
        setBusinessId(bizData.id);

        // 3. Fetch Real Bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, customer_name, offer:offers(title), slot:slots(start_time), status')
          .order('created_at', { ascending: false })
          .limit(10);

        if (bookingsError) {
          console.error("Supabase bookings fetch error:", bookingsError);
        }

        if (bookingsData) {
          setRecentBookings(bookingsData.map((b: any) => ({
            id: b.id.substring(0,8).toUpperCase(),
            name: b.customer_name || 'Anonymous',
            offer: b.offer?.title || 'Unknown Offer',
            time: b.slot?.start_time ? b.slot.start_time.substring(0,5) : 'Flexible',
            status: b.status
          })));
        }

        // Set Real Stats (We calculate basic ones if data exists)
        setStats([
          { title: "Total Bookings", value: bookingsData?.length || 0, icon: <Calendar className="w-5 h-5 text-blue-500" />, change: "Lifetime" },
          { title: "Active Offers", value: "Live", icon: <Activity className="w-5 h-5 text-[#F26522]" />, change: "Check campaigns" },
        ]);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchData();
  }, [navigate]);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      if (!businessId) throw new Error("No business profile found.");

      const { error } = await supabase.from('offers').insert([{
        business_id: businessId,
        title: newOffer.title,
        description: newOffer.description,
        original_price: parseFloat(newOffer.original_price),
        offer_price: parseFloat(newOffer.offer_price),
        capacity: newOffer.capacity,
        start_date: newOffer.start_date,
        end_date: newOffer.end_date,
        status: 'Active',
        image_url: newOffer.image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'
      }]);

      if (error) throw error;
      alert('Offer Created Successfully!');
      setIsModalOpen(false);
      setNewOffer({ title: '', description: '', original_price: '', offer_price: '', capacity: 10, start_date: '', end_date: '', image_url: '' });
    } catch (err: any) {
      alert('Failed to create offer: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center text-gray-500">Loading dashboard...</div>;
  }

  if (!hasBusiness) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center p-5 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl p-10 text-center shadow-xl">
          <div className="w-16 h-16 bg-[#F26522]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-[#F26522]" />
          </div>
          <h2 className="text-[24px] font-bold text-gray-900 mb-3">Access Denied</h2>
          <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
            This dashboard is restricted to Business Partners only. You are currently signed in as a regular customer. 
            If you wish to publish offers, please create a new account and select "Register as a Business Partner".
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white rounded-full py-3.5 font-medium hover:bg-[#F26522] transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] font-sans">
      {/* Top Navbar */}
      <div className="bg-white px-8 py-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F26522] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            SO
          </div>
          <span className="text-[14px] font-semibold text-gray-900">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/auth'); }} className="text-[13px] text-gray-600 hover:text-red-500 transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-[28px] font-medium text-gray-900 tracking-tight">Overview</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-[#F26522] text-white text-[13px] font-medium rounded-full px-5 py-2.5 transition-colors duration-300"
          >
            Create New Offer
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                {stat.icon}
              </div>
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-[13px] font-medium text-gray-500 mb-1">{stat.title}</p>
              <h2 className="text-[28px] font-semibold text-gray-900 mb-2">{stat.value}</h2>
              <p className="text-[12px] text-gray-400">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-[18px] font-semibold text-gray-900">Revenue Overview</h3>
                <p className="text-[13px] text-gray-500">Monthly booking volume and revenue</p>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-[13px] rounded-lg px-3 py-1.5 outline-none">
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            
            {/* CSS-only Bar Chart Placeholder */}
            <div className="h-[240px] flex items-end gap-2 sm:gap-4 mt-6">
              {[40, 65, 35, 80, 45, 90, 55, 70, 85, 60, 95, 50].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative h-[200px] bg-gray-50 rounded-t-lg overflow-hidden flex items-end">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${i === 10 ? 'bg-[#F26522]' : 'bg-gray-900 group-hover:bg-[#F26522]/80'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1d2e] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F26522]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-[18px] font-medium text-white/90 mb-2 relative z-10">Top Performing Offer</h3>
            <p className="text-[13px] text-white/50 mb-8 relative z-10">Generating 45% of total revenue</p>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-[#F26522]" />
              </div>
              <h4 className="text-[24px] font-semibold mb-1">Premium Full Body Massage</h4>
              <p className="text-[14px] text-white/60 mb-6">142 bookings this month</p>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5">
                  <span className="text-[13px] text-white/60">Conversion Rate</span>
                  <span className="text-[14px] font-medium text-green-400">+12.5%</span>
                </div>
                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5">
                  <span className="text-[13px] text-white/60">Revenue Generated</span>
                  <span className="text-[14px] font-medium text-white">$8,520</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Recent Bookings & Active Offers */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Recent Bookings Table */}
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-[18px] font-semibold text-gray-900">Recent Bookings</h3>
                <p className="text-[13px] text-gray-500 mt-1">Real-time feed of customer reservations</p>
              </div>
              <button className="text-[13px] text-[#F26522] font-medium bg-[#F26522]/10 px-4 py-2 rounded-full hover:bg-[#F26522]/20 transition-colors">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[12px] font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-8 py-4 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-8 py-4 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                    <th className="px-8 py-4 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-8 py-4 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-8 text-center text-[13px] text-gray-500">No bookings yet. Launch an offer to get started!</td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                        <td className="px-8 py-4 text-[13px] font-medium text-gray-900">{booking.id}</td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-600">
                              {booking.name.charAt(0)}
                            </div>
                            <span className="text-[13px] font-medium text-gray-900 group-hover:text-[#F26522] transition-colors">{booking.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-[13px] text-gray-600">{booking.offer}</td>
                        <td className="px-8 py-4 text-[13px] text-gray-500">{booking.time}</td>
                        <td className="px-8 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${
                            booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                            booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Offers Side Panel */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-[18px] font-semibold text-gray-900">Active Campaigns</h3>
              <p className="text-[13px] text-gray-500 mt-1">Currently running offers</p>
            </div>
            <div className="p-6 space-y-4">
              {[
                { name: "Full Body Massage", booked: 45, total: 50, color: "bg-[#F26522]" },
                { name: "1 Month Gym Trial", booked: 120, total: 200, color: "bg-gray-900" },
                { name: "Couples Dining", booked: 8, total: 10, color: "bg-purple-500" }
              ].map((offer, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-[14px] font-semibold text-gray-900">{offer.name}</h4>
                    <span className="text-[11px] font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-md">Active</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-gray-500 mb-2">
                    <span>Capacity Filled</span>
                    <span className="font-medium text-gray-900">{Math.round((offer.booked / offer.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`${offer.color} h-1.5 rounded-full`} style={{ width: `${(offer.booked / offer.total) * 100}%` }}></div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-3">{offer.booked} of {offer.total} slots booked</p>
                </div>
              ))}
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-2 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                + Add New Campaign
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Create Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-[24px] font-semibold text-gray-900 mb-6">Create New Offer</h2>
            
            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Offer Title</label>
                <input required type="text" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#F26522] outline-none" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows={2} value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#F26522] outline-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Original Price ($)</label>
                  <input required type="number" value={newOffer.original_price} onChange={e => setNewOffer({...newOffer, original_price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#F26522] outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Offer Price ($)</label>
                  <input required type="number" value={newOffer.offer_price} onChange={e => setNewOffer({...newOffer, offer_price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#F26522] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Start Date</label>
                  <input required type="date" value={newOffer.start_date} onChange={e => setNewOffer({...newOffer, start_date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#F26522] outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">End Date</label>
                  <input required type="date" value={newOffer.end_date} onChange={e => setNewOffer({...newOffer, end_date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#F26522] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Image URL</label>
                <input required type="url" placeholder="https://images.unsplash.com/photo-..." value={newOffer.image_url} onChange={e => setNewOffer({...newOffer, image_url: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#F26522] outline-none" />
              </div>
              
              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full py-3.5 text-[15px] font-medium transition-colors disabled:opacity-50 mt-6"
              >
                {isCreating ? 'Creating...' : 'Launch Offer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

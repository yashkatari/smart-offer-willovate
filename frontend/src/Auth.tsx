import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // If they checked the business box, create their business profile immediately
        if (isBusiness && data.user) {
          await supabase.from('businesses').insert([{
            owner_id: data.user.id,
            name: 'My New Business',
            type: 'Other',
            owner_name: email.split('@')[0]
          }]);
        }
        
        alert('Check your email for the confirmation link!');
      }
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-[#F26522] rounded-full flex items-center justify-center text-white text-[14px] font-bold tracking-tight shadow-lg">
          SO
        </div>
        <h2 className="mt-6 text-center text-[28px] font-bold tracking-tight text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your business account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-[13px] font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-[14px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-[14px]"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center">
                <input
                  id="business-checkbox"
                  type="checkbox"
                  checked={isBusiness}
                  onChange={(e) => setIsBusiness(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#F26522] focus:ring-[#F26522]"
                />
                <label htmlFor="business-checkbox" className="ml-2 block text-[13px] text-gray-900">
                  Register as a Business Partner
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-full border border-transparent bg-gray-900 py-3.5 px-4 text-[14px] font-medium text-white hover:bg-[#F26522] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-300"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="bg-white px-2 text-gray-500">
                  {isLogin ? 'New to Smart Offers?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setIsBusiness(false); }}
                className="text-[14px] font-medium text-[#F26522] hover:text-gray-900 transition-colors"
              >
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

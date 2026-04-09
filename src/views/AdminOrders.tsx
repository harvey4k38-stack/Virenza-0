import { useState, useEffect } from 'react';

const ADMIN_KEY = 'virenza-admin-2026';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedThickness?: string;
  selectedLength?: string;
  selectedName?: string;
}

interface Order {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  cart: CartItem[];
  total: string;
  createdAt: number;
  status: 'unfulfilled' | 'fulfilled';
}

export default function AdminOrders() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unfulfilled' | 'fulfilled'>('unfulfilled');
  const [updating, setUpdating] = useState<string | null>(null);

  const login = () => {
    if (pin === ADMIN_KEY) setAuthed(true);
    else alert('Wrong key');
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch('/api/admin/orders', { headers: { 'x-admin-key': ADMIN_KEY } })
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [authed]);

  const toggleStatus = async (order: Order) => {
    const newStatus = order.status === 'unfulfilled' ? 'fulfilled' : 'unfulfilled';
    setUpdating(order.orderNumber);
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify({ orderNumber: order.orderNumber, status: newStatus }),
    });
    setOrders(prev => prev.map(o => o.orderNumber === order.orderNumber ? { ...o, status: newStatus } : o));
    setUpdating(null);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 shadow-sm w-full max-w-sm">
          <h1 className="text-xl font-bold uppercase tracking-widest mb-6 text-center">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter admin key"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full border border-gray-300 px-4 py-3 text-sm mb-4 outline-none"
          />
          <button
            onClick={login}
            className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const filtered = orders.filter(o => filter === 'all' ? true : o.status === filter);
  const unfulfilled = orders.filter(o => o.status === 'unfulfilled').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">{orders.length} total · <span className="text-orange-600 font-semibold">{unfulfilled} to fulfil</span></p>
          </div>
          <div className="flex gap-2">
            {(['unfulfilled', 'fulfilled', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${filter === f ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No {filter} orders</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order.orderNumber} className={`bg-white border p-6 ${order.status === 'fulfilled' ? 'border-gray-200 opacity-60' : 'border-gray-300'}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm font-bold">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-0.5 uppercase tracking-wide ${order.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button
                    onClick={() => toggleStatus(order)}
                    disabled={updating === order.orderNumber}
                    className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${order.status === 'unfulfilled' ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                  >
                    {updating === order.orderNumber ? '...' : order.status === 'unfulfilled' ? 'Mark Fulfilled' : 'Undo'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Customer</p>
                    <p className="text-sm font-semibold">{order.firstName} {order.lastName}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Ship To</p>
                    <p className="text-sm">{order.address}</p>
                    <p className="text-sm">{order.city}, {order.postcode}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Items</p>
                  <div className="space-y-1">
                    {order.cart.map((item, i) => {
                      const variant = [item.selectedThickness, item.selectedLength].filter(Boolean).join(' / ');
                      return (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>
                            <span className="font-medium">{item.name}</span>
                            {variant && <span className="text-gray-500 ml-2">({variant})</span>}
                            {item.selectedName && <span className="text-gray-500 ml-2">· Name: {item.selectedName}</span>}
                            <span className="text-gray-500 ml-2">× {item.quantity}</span>
                          </span>
                          <span className="font-mono">£{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
                    <span className="font-bold text-sm">Total: £{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

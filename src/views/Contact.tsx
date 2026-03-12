import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import GlowButton from '../components/GlowButton';

interface ContactProps {
  onBack: () => void;
}

export default function Contact({ onBack }: ContactProps) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIsSuccess(true);
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-4">Message Sent</h1>
          <p className="text-brand-gray-dark mb-12">Thanks for reaching out. We'll get back to you as soon as possible.</p>
          <GlowButton onClick={onBack}>Return to Store</GlowButton>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 md:px-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-60 transition-opacity"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl mb-4">Contact Us</h1>
        <p className="text-brand-gray-dark mb-12">Have a question or issue? Fill out the form below and we'll get back to you.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                type="text"
                className="w-full p-4 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                type="text"
                className="w-full p-4 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
              className="w-full p-4 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Description of Issue</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full p-4 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <GlowButton type="submit" disabled={isSubmitting} className="w-full py-4 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : 'Send Message'}
          </GlowButton>
        </form>
      </motion.div>
    </main>
  );
}

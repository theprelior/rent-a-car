"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { showAlert } = useAlert(); // Hook'u çağır

  const sendMessageMutation = api.contact.sendMessage.useMutation({
    onSuccess: (data) => {
      showAlert(data.message);
      // Formu temizle
      setName('');
      setEmail('');
      setMessage('');
    },
    onError: (error) => {
      showAlert(`Bir hata oluştu: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageMutation.mutate({ name, email, message });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-400">Adınız Soyadınız</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-style mt-1 bg-neutral-800"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-400">E-posta Adresiniz</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-style mt-1 bg-neutral-800"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-400">Mesajınız</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="input-style mt-1 bg-neutral-800"
        />
      </div>
      <button 
        type="submit" 
        disabled={sendMessageMutation.isPending}
        className="w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 py-3 text-lg font-bold text-black shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
      >
        {sendMessageMutation.isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>
    </form>
  );
}

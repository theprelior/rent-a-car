// app/_components/ContactForm.tsx

"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

const initialState = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [formData, setFormData] = useState(initialState);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  
  const sendMessage = api.contact.sendMessage.useMutation({
    onSuccess: () => {
      setFormMessage("Mesajınız başarıyla gönderildi!");
      setFormData(initialState);
    },
    onError: (error) => {
      setFormMessage(`Hata: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    sendMessage.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Adınız Soyadınız *" required className="input-style" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-posta Adresiniz *" required className="input-style" />
      <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Konu" className="input-style" />
      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Mesajınız *" required rows={5} className="input-style"></textarea>
      
      <button type="submit" disabled={sendMessage.isPending} className="w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-500">
        {sendMessage.isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>

      {formMessage && <p className={`mt-4 text-center ${sendMessage.isError ? 'text-red-500' : 'text-green-500'}`}>{formMessage}</p>}
    </form>
  );
}
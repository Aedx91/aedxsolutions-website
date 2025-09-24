"use client";
import React, { useState } from 'react';

interface ContactFormProps {
  lang: 'en' | 'es';
  labels?: {
    name?: string;
    email?: string;
    message?: string;
    submit?: string;
  };
}

// Fallback inline labels (extend dictionaries later if desired)
const DEFAULT_LABELS = {
  en: { name: 'Name', email: 'Email', message: 'Message', submit: 'Send' },
  es: { name: 'Nombre', email: 'Correo', message: 'Mensaje', submit: 'Enviar' },
};

const ContactForm: React.FC<ContactFormProps> = ({ lang, labels }) => {
  const l = { ...DEFAULT_LABELS[lang], ...labels };
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    // Simulate async send
    setTimeout(() => setStatus(Math.random() > 0.1 ? 'sent' : 'error'), 700);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label" htmlFor="name">{l.name}</label>
        <input
          id="name"
          required
          placeholder={`${l.name}...`}
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="email">{l.email}</label>
        <input
          id="email" 
          type="email" 
          required
          placeholder={`${l.email}...`}
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="message">{l.message}</label>
        <textarea
          id="message" 
          rows={5} 
          required
          placeholder={`${l.message}...`}
          className="form-textarea"
        />
      </div>
      <div className="flex items-center gap-4">
        <button disabled={status==='sending'} className="btn btn-primary">
          {status === 'sending' ? (lang==='es'?'Enviando...':'Sending...') : l.submit}
        </button>
        {status === 'sent' && <span className="badge badge-success">{lang==='es'?'Enviado':'Sent'}</span>}
        {status === 'error' && <span className="badge badge-error">{lang==='es'?'Error':'Error'}</span>}
      </div>
    </form>
  );
};

export default ContactForm;

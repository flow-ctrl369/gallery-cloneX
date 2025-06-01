"use client"

import React, { useState } from "react";

interface ContactArtistFormProps {
  artistName: string;
  onClose?: () => void;
}

export default function ContactArtistForm({ artistName, onClose }: ContactArtistFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
        <p>Your message has been sent to {artistName}.</p>
        {onClose && (
          <button 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h3 className="text-lg font-semibold mb-2">Contact {artistName}</h3>
      <div>
        <label className="block mb-1 font-medium">Your Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Your Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Message</label>
        <textarea
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 rounded font-semibold hover:bg-primary/90 transition-colors"
      >
        Send Message
      </button>
    </form>
  );
} 
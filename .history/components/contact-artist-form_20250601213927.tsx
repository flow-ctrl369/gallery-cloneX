import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

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
        <SocialLinks />
        {onClose && (
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded" onClick={onClose}>
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
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Your Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Message</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 transition"
      >
        Send Message
      </button>
      <SocialLinks />
    </form>
  );
}

function SocialLinks() {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow on Facebook">
        <FaFacebook className="w-6 h-6 text-blue-600 hover:text-blue-800 transition" />
      </a>
      <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">
        <FaInstagram className="w-6 h-6 text-pink-500 hover:text-pink-700 transition" />
      </a>
      <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow on TikTok">
        <FaTiktok className="w-6 h-6 text-black hover:text-gray-700 transition" />
      </a>
      <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow on X (Twitter)">
        <FaXTwitter className="w-6 h-6 text-gray-700 hover:text-black transition" />
      </a>
    </div>
  );
} 
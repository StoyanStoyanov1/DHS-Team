
import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const phoneNumber = '+359888123456';
const displayPhone = '+359 888 123 456';
const email = 'contact@sparkdev.com';

const ContactInfo: React.FC<{ openChat: () => void }> = ({ openChat }) => {
  const copyAndDial = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(phoneNumber);
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 text-xs md:text-sm">
      <a 
        href={`tel:${phoneNumber}`}
        className="flex items-center gap-2 hover:text-primary transition-colors"
        onClick={copyAndDial}
        title="Копирай и набери"
      >
        <Phone className="h-4 w-4" /> <span>{displayPhone}</span>
      </a>
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-2 hover:text-primary transition-colors"
        title="Изпрати имейл"
      >
        <Mail className="h-4 w-4" /> <span>{email}</span>
      </a>
      <button
        type="button"
        className="flex items-center gap-2 hover:text-primary transition-colors bg-transparent border-0 p-0 focus:outline-none"
        onClick={openChat}
        title="Чат поддръжка"
      >
        <MessageSquare className="h-4 w-4" /> <span>Чат поддръжка</span>
      </button>
    </div>
  );
};

export default ContactInfo;

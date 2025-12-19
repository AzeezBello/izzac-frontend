// src/components/HostPage/HostFaq.tsx
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  { question: 'Is my place right for Airbnb?', answer: 'Answer content here...' },
  { question: 'Do I have to host all the time?', answer: 'Answer content here...' },
  { question: 'How much should I interact with guests?', answer: 'Answer content here...' },
  { question: 'Any tips on being a great Airbnb Host?', answer: 'Answer content here...' },
  { question: 'What are Airbnb’s fees?', answer: 'Answer content here...' },
];

const HostFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 p-8 rounded-lg shadow-md text-gray-900">
      <h2 className="text-3xl font-bold mb-8">Your questions, answered</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left font-semibold text-lg flex justify-between items-center py-2 border-b border-gray-300"
            >
              {faq.question}
              <span className="text-gray-500">{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-16 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-600">Get answers from an experienced Superhost near you.</p>
        </div>
        <Link href="/signup?role=host">
          <button className="mt-4 md:mt-0 px-6 py-2 border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition">
            Match with a Superhost
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HostFaq;

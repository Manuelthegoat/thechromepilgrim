import { useState } from 'react';
import './Accordion.css';

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <button
        className="accordion-item__header"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className={`accordion-item__icon ${isOpen ? 'accordion-item__icon--open' : ''}`}>
          +
        </span>
      </button>
      {isOpen && <div className="accordion-item__content">{children}</div>}
    </div>
  );
}

function Accordion({ items }) {
  return (
    <div className="accordion">
      {items.map((item) => (
        <AccordionItem key={item.title} title={item.title}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}

export default Accordion;
export { AccordionItem };
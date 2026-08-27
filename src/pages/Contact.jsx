import Eyebrow from '../components/shared/Eyebrow';
import './Contact.css';

function Contact() {
  return (
    <section className="contact">
      <Eyebrow>CONTACT</Eyebrow>

      <div className="contact__info">
        <div className="contact__row">
          <div className="contact__label">Email</div>
          <a href="mailto:support@danisveryown.com" className="contact__value">support@danisveryown.com</a>
        </div>

        <div className="contact__row">
          <div className="contact__label">Instagram</div>
          <a href="https://instagram.com/danisveryown" target="_blank" rel="noopener noreferrer" className="contact__value">
            @danisveryown
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
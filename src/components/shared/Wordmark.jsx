import './Wordmark.css';

function Wordmark({ size = 'lg' }) {
  return (
    <span className={`wordmark wordmark--${size}`}>
      The Chrome Pilgrim
    </span>
  );
}

export default Wordmark;
import "../styles/newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter" id="newsletter">

      <div className="newsletter-container">

        <h2>✈ Ready for Your Next Adventure?</h2>

        <p>
          Subscribe to receive exclusive travel offers,
          destination inspiration and smart travel tips directly
          to your inbox.
        </p>

        <form className="newsletter-form">

          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

        <span>
          No spam • Weekly travel inspiration • Unsubscribe anytime
        </span>

      </div>

    </section>
  );
}

export default Newsletter;
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const packageName = searchParams.get('package') || 'Premium Package Tour';
  const priceStr = searchParams.get('price') || '22500';
  const price = parseFloat(priceStr);

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.trim().length < 16) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }
    setProcessing(true);

    try {
      const response = await fetch('http://localhost:8010/api/payments/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          cardHolder,
          cardNumber,
          expiry: cardExpiry,
          cvv: cardCvv,
          amount: price,
          packageName
        })
      });

      const data = await response.json();
      setProcessing(false);

      if (response.ok && data.success) {
        setSuccess(true);
        setTxnId(data.transactionId);
        setReceiptUrl(data.receiptUrl);
        
        // Append to simulated bookings store
        const storedBookings = JSON.parse(localStorage.getItem('simulated_bookings') || '[]');
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        storedBookings.push({
          id: Date.now(),
          username: userObj.username || 'Traveler',
          packageName,
          price,
          status: 'Confirmed',
          date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('simulated_bookings', JSON.stringify(storedBookings));
      } else {
        alert(data.message || 'Payment authentication failed.');
      }
    } catch (err) {
      setProcessing(false);
      alert('Could not connect to payment gateway.');
    }
  };

  return (
    <div className="checkout-page vh-100 w-100 d-flex align-items-center justify-content-center text-white" style={{ background: '#0e111d', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div className="glass-container p-4 p-md-5 shadow-lg border" style={{ maxWidth: '440px', width: '92%', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(30px)', borderColor: 'rgba(255,255,255,0.12)' }}>
        {success ? (
          <div className="text-center animate-fade-in py-3">
            <i className="bi bi-patch-check-fill text-success fs-1 mb-3 d-block"></i>
            <h3 className="fw-bold mb-2">Payment Successful!</h3>
            <p className="text-xs text-white text-opacity-70 mb-4">
              Your transaction has been processed securely. Your travel package booking is confirmed.
            </p>
            <div className="bg-white bg-opacity-5 p-3 rounded mb-4 text-start" style={{ fontSize: '11px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="d-flex justify-content-between mb-1.5"><span>Transaction ID:</span><span className="fw-bold text-info">{txnId}</span></div>
              <div className="d-flex justify-content-between mb-1.5"><span>Package:</span><span className="fw-bold text-truncate ms-2" style={{ maxWidth: '220px' }}>{packageName}</span></div>
              <div className="d-flex justify-content-between"><span>Amount Paid:</span><span className="fw-bold text-warning">₹{price.toLocaleString('en-IN')}</span></div>
            </div>
            <a href={receiptUrl} target="_blank" rel="noreferrer" className="btn btn-info text-white w-100 py-2.5 fw-bold text-xs mb-2" style={{ borderRadius: '10px', textDecoration: 'none' }}>
              View Stripe Receipt
            </a>
            <button onClick={() => window.close()} className="btn btn-outline-secondary w-100 py-2 fw-semibold text-xs text-white" style={{ borderRadius: '10px' }}>
              Close Tab
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="animate-fade-in">
            <div className="text-center mb-4">
              <div className="logo-icon-wrapper mx-auto mb-2.5 d-flex align-items-center justify-content-center bg-white bg-opacity-10" style={{ height: '48px', width: '48px', borderRadius: '50%', overflow: 'hidden' }}>
                <img src="/images/logo_icon.png" alt="Logo" className="w-100 h-100" style={{ transform: 'scale(1.2)' }} />
              </div>
              <h4 className="fw-bold mb-1 text-white">Secure Stripe Checkout</h4>
              <p className="text-xxs text-white text-opacity-50 mb-0">Simulated 256-bit SSL encrypted connection</p>
            </div>

            <div className="bg-white bg-opacity-5 p-3 rounded mb-4 border border-white border-opacity-5" style={{ fontSize: '11px' }}>
              <div className="d-flex justify-content-between mb-1.5">
                <span>Selected Package:</span>
                <span className="fw-bold text-white text-truncate ms-2" style={{ maxWidth: '220px' }}>{packageName}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Amount:</span>
                <span className="fw-bold text-warning">₹{price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xxs text-white text-opacity-70 fw-semibold mb-1 d-block">Cardholder Name</label>
              <input
                type="text"
                required
                className="form-control form-control-sm text-xs bg-dark bg-opacity-50 text-white border-white border-opacity-20"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="text-xxs text-white text-opacity-70 fw-semibold mb-1 d-block">Card Number</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-white border-opacity-20 text-white"><i className="bi bi-credit-card"></i></span>
                <input
                  type="text"
                  required
                  maxLength={16}
                  className="form-control form-control-sm text-xs bg-dark bg-opacity-50 text-white border-white border-opacity-20"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="row g-2 mb-4">
              <div className="col-6">
                <label className="text-xxs text-white text-opacity-70 fw-semibold mb-1 d-block">Expiry Date</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  className="form-control form-control-sm text-xs bg-dark bg-opacity-50 text-white border-white border-opacity-20"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="text-xxs text-white text-opacity-70 fw-semibold mb-1 d-block">CVV/CVC</label>
                <input
                  type="password"
                  required
                  maxLength={3}
                  className="form-control form-control-sm text-xs bg-dark bg-opacity-50 text-white border-white border-opacity-20"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn btn-info text-white w-100 py-2.5 fw-bold text-xs d-flex align-items-center justify-content-center gap-1.5"
              style={{ borderRadius: '10px' }}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Processing Secure payment...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-fill-check"></i> Authorize & Pay
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

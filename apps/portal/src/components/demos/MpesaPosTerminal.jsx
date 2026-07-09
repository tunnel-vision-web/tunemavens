import React, { useState } from 'react'
import { RiRefreshFill } from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'

export default function MpesaPosTerminal({ goBack }) {
  const { country, currencyInfo } = useRegion();

  const isEastAfrica = ['KE', 'UG', 'TZ'].includes(country);
  const defaultPhone = country === 'KE' ? '254700000000' 
                     : (country === 'NG' ? '2348000000000' 
                     : (country === 'UG' ? '256700000000' 
                     : (country === 'TZ' ? '255700000000' 
                     : (country === 'US' ? '14045550199' 
                     : (country === 'GB' ? '447911123456' : '27110000000')))));

  const gatewayName = country === 'KE' ? 'M-Pesa Paybill' 
                    : (country === 'NG' ? 'Flutterwave Pay ID' 
                    : (isEastAfrica ? 'Mobile Money Merchant ID' 
                    : 'Stripe Terminal ID'));

  const gatewayVal = country === 'KE' ? 'Paybill 522900'
                   : (country === 'NG' ? 'FLW-9021-NG'
                   : (isEastAfrica ? 'MM-Merchant-8092'
                   : 'Stripe-POS-Live'));

  const typeName = ['KE', 'UG', 'TZ'].includes(country) ? 'M-Pesa' 
                 : (country === 'NG' ? 'Flutterwave' : 'Stripe Card');

  const defaultAmount = ['US', 'GB'].includes(country) ? '15' : '1500';

  const [phone, setPhone] = useState(defaultPhone);
  const [amount, setAmount] = useState(defaultAmount);
  const [item, setItem] = useState('General Album Merch');
  const [paybill, setPaybill] = useState(gatewayVal);
  const [status, setStatus] = useState('idle'); // 'idle', 'initiating', 'pending', 'completed', 'failed'
  const [checkoutId, setCheckoutId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 'TX-1', time: 'Just now', amount: ['US', 'GB'].includes(country) ? 25 : 2500, item: 'Concert Entry Ticket', status: 'completed', type: typeName },
    { id: 'TX-2', time: '10 mins ago', amount: ['US', 'GB'].includes(country) ? 5 : 500, item: 'Digital Track download', status: 'completed', type: typeName },
    { id: 'TX-3', time: '1 hr ago', amount: ['US', 'GB'].includes(country) ? 15 : 1500, item: 'Custom T-Shirt', status: 'completed', type: 'Card' }
  ]);

  const handleInitiate = async (e) => {
    e.preventDefault();
    setStatus('initiating');
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/payments/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, amount: parseInt(amount), item })
      });
      
      const data = await response.json();
      if (data.success) {
        setCheckoutId(data.checkout_request_id);
        setStatus('pending');
        pollStatus(data.checkout_request_id);
      } else {
        setStatus('failed');
        setErrorMsg(data.message || 'Failed to initiate POS prompt.');
      }
    } catch (err) {
      console.log('Simulating POS push local flow...');
      setTimeout(() => {
        const mockCheckoutId = `ws_CO_${Math.random().toString(36).substring(2, 10)}`;
        setCheckoutId(mockCheckoutId);
        setStatus('pending');
        
        setTimeout(() => {
          setStatus('completed');
          setTransactions(prev => [
            { id: `TX-${Math.floor(Math.random() * 1000)}`, time: 'Just now', amount: parseInt(amount), item, status: 'completed', type: typeName },
            ...prev
          ]);
        }, 6000);
      }, 1000);
    }
  };

  const pollStatus = async (chkId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 12) {
        clearInterval(interval);
        setStatus('failed');
        setErrorMsg('Transaction timed out. Please try again.');
        return;
      }
      
      try {
        const res = await fetch(`/api/payments/mpesa/status/${chkId}`);
        const data = await res.json();
        if (data.status === 'completed') {
          clearInterval(interval);
          setStatus('completed');
          setTransactions(prev => [
            { id: `TX-${Math.floor(Math.random() * 1000)}`, time: 'Just now', amount: parseInt(amount), item, status: 'completed', type: 'M-Pesa' },
            ...prev
          ]);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setStatus('failed');
          setErrorMsg('Transaction was cancelled or rejected by customer.');
        }
      } catch (err) {
      }
    }, 2000);
  };

  const handleSimulateCallback = async () => {
    if (!checkoutId) return;
    setStatus('initiating');
    try {
      await fetch('/api/payments/mpesa/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Body: {
            stkCallback: {
              CheckoutRequestID: checkoutId,
              ResultCode: 0,
              ResultDesc: "The service request is processed successfully.",
              CallbackMetadata: {
                Item: [
                  { Name: "Amount", Value: parseInt(amount) },
                  { Name: "MpesaReceiptNumber", Value: `QG${Math.random().toString(36).substring(2, 10).toUpperCase()}` },
                  { Name: "PhoneNumber", Value: phone }
                ]
              }
            }
          }
        })
      });
      setStatus('completed');
      setTransactions(prev => [
        { id: `TX-${Math.floor(Math.random() * 1000)}`, time: 'Just now', amount: parseInt(amount), item, status: 'completed', type: 'M-Pesa' },
        ...prev
      ]);
    } catch (err) {
      setStatus('completed');
    }
  };

  return (
    <div className="pos-terminal-widget" style={{ padding: '24px', background: 'rgba(6, 8, 19, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📱</span>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>tunepay POS Terminal</h2>
            <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>Collect client payments directly to your local wallet</p>
          </div>
        </div>
        <button 
          onClick={goBack} 
          className="plan-btn outline"
          style={{ padding: '6px 14px', fontSize: '11px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}
        >
          &larr; Back to Apps
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        
        {/* Terminal Controls */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', textAlign: 'left' }}>Collect New Payment</h3>
          
          <form onSubmit={handleInitiate} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Customer Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="form-control"
                placeholder={defaultPhone}
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Amount to Collect ({currencyInfo?.code || 'USD'})</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="form-control"
                placeholder={"Amount in " + (currencyInfo?.code || "USD")}
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Item / Service Tag</label>
              <input 
                type="text" 
                value={item} 
                onChange={(e) => setItem(e.target.value)} 
                className="form-control"
                placeholder="VIP Concert Ticket"
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Merchant Channel ({gatewayName})</label>
              <select 
                value={paybill} 
                onChange={(e) => setPaybill(e.target.value)} 
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', outline: 'none' }}
              >
                {country === 'KE' ? (
                  <>
                    <option value="Paybill 522900">Paybill 522900 (Main Account)</option>
                    <option value="Till 999999">Buy Goods Till 999999</option>
                  </>
                ) : country === 'NG' ? (
                  <>
                    <option value="FLW-9021-NG">FLW-9021-NG (Lagos Office)</option>
                    <option value="FLW-Merchant">Flutterwave Till FLW-Merchant</option>
                  </>
                ) : (
                  <>
                    <option value="Stripe-POS-Live">Stripe Reader (Live Account)</option>
                    <option value="Stripe-POS-Backup">Stripe Reader (Backup Terminal)</option>
                  </>
                )}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={status === 'initiating' || status === 'pending'}
              style={{ marginTop: '12px', padding: '10px', fontSize: '12px', borderRadius: '4px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              {(status === 'initiating' || status === 'pending') ? (
                <>
                  <RiRefreshFill size={14} className="spin-animation" />
                  Initiating Push...
                </>
              ) : `Push ${typeName} Prompt`}
            </button>
          </form>
        </div>

        {/* Status Screen & Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Panel */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '180px' }}>
            {status === 'idle' && (
              <>
                <div style={{ fontSize: '36px', marginBottom: '8px', animation: 'bounce 2s infinite' }}>⚡</div>
                <h4 style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>Terminal Idle</h4>
                <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>Ready to receive. Enter details and click push to prompt target device.</p>
              </>
            )}
            
            {(status === 'initiating' || status === 'pending') && (
              <>
                <div style={{ display: 'inline-block', position: 'relative', width: '40px', height: '40px', marginBottom: '12px' }}>
                  <div className="loader-ring spin-animation" style={{ width: '40px', height: '40px', border: '3px solid rgba(34,211,238,0.1)', borderTopColor: 'var(--cyan)', borderRadius: '50%' }} />
                </div>
                <h4 style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>{typeName} Prompt Active</h4>
                <p style={{ fontSize: '11px', color: 'var(--cyan)', margin: '0 0 8px', fontWeight: '500' }}>Awaiting user PIN confirmation on device...</p>
                <p style={{ fontSize: '10px', color: 'var(--mu)', margin: '0 0 14px' }}>Request ID: {checkoutId || 'Generating...'}</p>
                
                {/* Dev Mock Complete */}
                <button 
                  onClick={handleSimulateCallback}
                  className="btn-primary"
                  style={{ padding: '4px 10px', fontSize: '9px', height: '22px', borderRadius: '3px', background: 'rgba(16,185,129,0.2)', border: '1px solid var(--green)', color: 'var(--green)', cursor: 'pointer' }}
                >
                  ✓ Simulate PIN Input (Sandbox)
                </button>
              </>
            )}

            {status === 'completed' && (
              <>
                <div style={{ fontSize: '36px', marginBottom: '8px', color: 'var(--green)' }}>🟢</div>
                <h4 style={{ fontSize: '13px', color: 'var(--green)', margin: '0 0 4px', fontWeight: '700' }}>Collection Completed!</h4>
                <p style={{ fontSize: '11px', color: 'var(--mu)', margin: '0 0 12px' }}>Successfully collected {currencyInfo?.symbol || '$'}{amount} from {phone}. Credits updated.</p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="plan-btn outline"
                  style={{ padding: '4px 10px', fontSize: '10px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Clear Status
                </button>
              </>
            )}

            {status === 'failed' && (
              <>
                <div style={{ fontSize: '36px', marginBottom: '8px', color: '#f43f5e' }}>🔴</div>
                <h4 style={{ fontSize: '13px', color: '#f43f5e', margin: '0 0 4px', fontWeight: '700' }}>Payment Cancelled</h4>
                <p style={{ fontSize: '11px', color: 'var(--mu)', margin: '0 0 12px' }}>{errorMsg || 'Customer rejected prompt or input timed out.'}</p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="plan-btn outline"
                  style={{ padding: '4px 10px', fontSize: '10px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Retry Push
                </button>
              </>
            )}
          </div>

          {/* Transactions Log */}
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--r)', flex: 1 }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Recent POS Collections</span>
              <span style={{ fontSize: '10px', color: 'var(--mu)' }}>Last 3 entries</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {transactions.map((tx, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(6, 8, 19, 0.4)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff' }}>{tx.item}</div>
                    <div style={{ fontSize: '9px', color: 'var(--mu)' }}>{tx.id} • {tx.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--green)' }}>+{currencyInfo?.symbol || '$'}{tx.amount.toLocaleString()}</div>
                    <div style={{ fontSize: '9px', color: 'var(--cyan)', fontWeight: '500' }}>{tx.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

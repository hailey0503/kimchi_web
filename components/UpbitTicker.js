"use client"
import { useEffect, useState } from 'react';

let upbitWS;

export default function UpbitTicker() {
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    upbitWS = new WebSocket(
      'wss://api.upbit.com/websocket/v1',
    );
    console.log(upbitWS);
    //["BTC/KRW", "ETH/KRW", "SOL/KRW", "XRP/KRW", "ADA/KRW", "EOS/KRW", "LUNA/KRW", "MCO/KRW", "ZEN/KRW", "CRV/KRW", "SAND/KRW", "BTT/KRW", "HBAR/KRW", "DOGE/KRW", "AVAX/KRW", "MATIC/KRW", "LINK/KRW", "DOT/KRW", , "SHIB/KRW", "BCH/KRW"]
    upbitWS.onopen = (event) => {
      const request = [{"ticket": "test example"},{"type": "ticker","codes": ["KRW-BTC","KRW-ETH", "KRW-SOL", "KRW-EOS", "KRW-LUNA"]},{"format": "DEFAULT"}];
      upbitWS.send(JSON.stringify(request));
    };

    upbitWS.onerror = (event) => console.error(event);

    upbitWS.onmessage = async (event) => {
      const message = await event.data.text();
      setTicker(message);
    };

    upbitWS.onclose = () => console.log("closed!");

  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {ticker}
      </div>
    </main>
  )
}
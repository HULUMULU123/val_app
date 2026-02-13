import { useMemo, useState } from 'react';

const confettiPieces = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 1.2}s`,
  duration: `${3 + Math.random() * 3}s`,
  color: ['#ff2d6f', '#ff5b99', '#ffd166', '#f78fb3', '#ff85a2', '#ffd6e7'][i % 6]
}));

function App() {
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const dynamicScale = useMemo(() => {
    const randomBoost = 1 + Math.sin(noClicks * 0.85) * 0.1 + ((noClicks % 3) * 0.06);
    return Math.min(2.8, (1 + noClicks * 0.17) * randomBoost);
  }, [noClicks]);

  const noScale = useMemo(() => {
    const unevenDrop = 1 - noClicks * 0.12 - Math.abs(Math.sin(noClicks * 0.9)) * 0.06;
    return Math.max(0.35, unevenDrop);
  }, [noClicks]);

  const jitter = useMemo(() => {
    const amplitude = Math.min(26, 5 + noClicks * 2.8);
    return {
      '--jitter-x': `${Math.sin(noClicks * 1.3) * amplitude}px`,
      '--jitter-y': `${Math.cos(noClicks * 0.85) * (amplitude * 0.6)}px`,
      '--jitter-rot': `${Math.sin(noClicks * 0.75) * 4}deg`
    };
  }, [noClicks]);

  if (accepted) {
    return (
      <main className="page page--celebration">
        <div className="confetti" aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="confetti-piece"
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                background: piece.color
              }}
            />
          ))}
        </div>
        <section className="card card--celebrate">
          <h1>Ура!!!! Я тебя люблю!!!</h1>
          <p className="hugging-cats" aria-label="Обнимающиеся котики">
            🐱💞🐱
          </p>
          <p className="subtext">Ты только что сделал(а) этот день по-настоящему волшебным 💘</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <p className="sad-cat" aria-label="Жалобный котик">
          🥺🐈
        </p>
        <h1>Будешь моей валентинкой?</h1>
        <p className="subtitle">Обещаю много обнимашек, заботы и вкусняшек 💝</p>

        <div className="buttons">
          <button
            className={`btn btn-yes ${noClicks > 0 ? 'btn-yes--excited' : ''}`}
            style={{ transform: `translate(var(--jitter-x), var(--jitter-y)) rotate(var(--jitter-rot)) scale(${dynamicScale})`, ...jitter }}
            onClick={() => setAccepted(true)}
          >
            Да 💖
          </button>

          <button
            className="btn btn-no"
            style={{ transform: `scale(${noScale})` }}
            onClick={() => setNoClicks((value) => value + 1)}
          >
            Нет
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;

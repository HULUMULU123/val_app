import { useEffect, useMemo, useState } from 'react';

const confettiPieces = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 1.4}s`,
  duration: `${2.8 + Math.random() * 3.4}s`,
  color: ['#ff2d6f', '#ff5b99', '#ffd166', '#f78fb3', '#ff85a2', '#ffd6e7'][i % 6]
}));

const YES_BASE_SIZE = 130;
const NO_BASE_SIZE = 108;

function App() {
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const updateSize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const maxYesSize = Math.max(YES_BASE_SIZE, Math.min(viewport.width, viewport.height) * 0.92);

  const yesSize = useMemo(() => {
    const dynamicGrowth = noClicks * 34 + Math.abs(Math.sin(noClicks * 0.95)) * 45 + (noClicks % 4) * 16;
    return Math.min(maxYesSize, YES_BASE_SIZE + dynamicGrowth);
  }, [maxYesSize, noClicks]);

  const noSize = useMemo(() => {
    const unevenDrop = NO_BASE_SIZE - noClicks * 13 - Math.abs(Math.sin(noClicks * 0.82)) * 8;
    return Math.max(5, unevenDrop);
  }, [noClicks]);

  const jitter = useMemo(() => {
    const amplitude = Math.min(30, 5 + noClicks * 3.1);
    return {
      '--jitter-x': `${Math.sin(noClicks * 1.18) * amplitude}px`,
      '--jitter-y': `${Math.cos(noClicks * 0.91) * (amplitude * 0.62)}px`,
      '--jitter-rot': `${Math.sin(noClicks * 0.71) * 6}deg`
    };
  }, [noClicks]);

  const noTextVisible = noSize > 32;

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
          <img className="cat-image cat-image--hug" src="/images/cats-hug.jpeg" alt="Обнимающиеся котики" />
          <p className="subtext">Ты только что сделала этот день по-настоящему волшебным 💘</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <img className="cat-image cat-image--sad" src="/images/cat-sad.jpeg" alt="Жалобный котик" />
        <h1>Будешь моей валентинкой?</h1>
        <p className="subtitle">Обещаю много обнимашек, заботы и вкусняшек 💝</p>

        <div className="buttons">
          <button
            className={`btn btn-yes ${noClicks > 0 ? 'btn-yes--excited' : ''}`}
            style={{
              width: `${yesSize}px`,
              height: `${yesSize}px`,
              fontSize: `${Math.max(1, yesSize * 0.11)}px`,
              transform: `translate(var(--jitter-x), var(--jitter-y)) rotate(var(--jitter-rot))`,
              ...jitter
            }}
            onClick={() => setAccepted(true)}
          >
            Да 💖
          </button>

          <button
            className="btn btn-no"
            style={{
              width: `${noSize}px`,
              height: `${noSize}px`,
              fontSize: `${Math.max(0, noSize * 0.22)}px`
            }}
            onClick={() => setNoClicks((value) => value + 1)}
            aria-label="Нет"
          >
            {noTextVisible ? 'Нет' : ''}
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;

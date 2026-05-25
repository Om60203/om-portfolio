"use client";

export default function GlobalBackground() {
  const stars = [
    { w: 2, h: 2, t: 5, l: 10, d: 0.5, dur: 2 },
    { w: 1, h: 1, t: 10, l: 25, d: 1, dur: 1.5 },
    { w: 3, h: 3, t: 15, l: 40, d: 0.2, dur: 2.5 },
    { w: 2, h: 2, t: 8, l: 55, d: 1.5, dur: 1.8 },
    { w: 1, h: 1, t: 20, l: 70, d: 0.8, dur: 2.2 },
    { w: 2, h: 2, t: 5, l: 85, d: 0.3, dur: 1.6 },
    { w: 3, h: 3, t: 12, l: 95, d: 1.2, dur: 2.8 },
    { w: 1, h: 1, t: 25, l: 15, d: 0.6, dur: 2 },
    { w: 2, h: 2, t: 18, l: 30, d: 1.8, dur: 1.7 },
    { w: 3, h: 3, t: 7, l: 50, d: 0.4, dur: 2.3 },
    { w: 1, h: 1, t: 22, l: 65, d: 1.1, dur: 1.9 },
    { w: 2, h: 2, t: 3, l: 78, d: 0.7, dur: 2.6 },
    { w: 3, h: 3, t: 30, l: 88, d: 1.4, dur: 2.1 },
    { w: 1, h: 1, t: 35, l: 5, d: 0.9, dur: 1.5 },
    { w: 2, h: 2, t: 40, l: 20, d: 1.6, dur: 2.4 },
  ];

  return (
    <>
      <style>{`
        .global-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(180deg, #1a0533 0%, #2d1b69 30%, #4a2080 60%, #7b3fa0 80%, #c084e0 100%);
        }
        .g-star {
          position: fixed;
          background: white;
          border-radius: 50%;
          animation: gTwinkle 2s ease-in-out infinite alternate;
          z-index: -1;
          pointer-events: none;
        }
        @keyframes gTwinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        .g-cloud {
          position: fixed;
          background: rgba(255,255,255,0.12);
          border-radius: 50px;
          animation: gFloatCloud 8s ease-in-out infinite alternate;
          backdrop-filter: blur(4px);
          z-index: -1;
          pointer-events: none;
        }
        @keyframes gFloatCloud {
          0% { transform: translateX(0px); }
          100% { transform: translateX(30px); }
        }
        .g-mountain {
          position: fixed;
          bottom: 60px;
          width: 0;
          height: 0;
          border-style: solid;
          z-index: -1;
          pointer-events: none;
        }
        .g-snow {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(180deg, #c084e0 0%, #e9d5ff 100%);
          border-radius: 60% 60% 0 0;
          z-index: -1;
          pointer-events: none;
        }
        .g-tree {
          position: fixed;
          bottom: 60px;
          z-index: -1;
          pointer-events: none;
        }
        .g-tree-body {
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 60px solid #2d1b69;
          margin: 0 auto;
        }
        .g-tree-trunk {
          width: 8px;
          height: 15px;
          background: #4a2080;
          margin: 0 auto;
        }
        .g-house {
          position: fixed;
          bottom: 70px;
          right: 80px;
          z-index: -1;
          pointer-events: none;
        }
        .g-house-body {
          width: 60px;
          height: 40px;
          background: #2d1b69;
          border-radius: 4px;
          position: relative;
        }
        .g-house-roof {
          width: 0;
          height: 0;
          border-left: 35px solid transparent;
          border-right: 35px solid transparent;
          border-bottom: 30px solid #4a2080;
          margin: 0 auto;
        }
        .g-house-window {
          width: 12px;
          height: 12px;
          background: #f59e0b;
          border-radius: 2px;
          position: absolute;
          top: 14px;
          left: 24px;
          box-shadow: 0 0 10px #f59e0b;
        }
        .g-smoke {
          position: absolute;
          top: -30px;
          left: 20px;
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          animation: gSmokeRise 3s ease-out infinite;
        }
        @keyframes gSmokeRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-40px) scale(3); opacity: 0; }
        }
        .g-bird {
          position: fixed;
          font-size: 18px;
          animation: gFlyBird linear infinite;
          z-index: -1;
          pointer-events: none;
        }
        @keyframes gFlyBird {
          0% { transform: translateX(-50px); }
          100% { transform: translateX(110vw); }
        }
        .g-cat {
          position: fixed;
          font-size: 22px;
          bottom: 75px;
          animation: gWalkCat linear infinite;
          z-index: 0;
          pointer-events: none;
        }
        @keyframes gWalkCat {
          0% { transform: translateX(-50px) scaleX(1); }
          49% { transform: translateX(100vw) scaleX(1); }
          50% { transform: translateX(100vw) scaleX(-1); }
          99% { transform: translateX(-50px) scaleX(-1); }
          100% { transform: translateX(-50px) scaleX(1); }
        }
      `}</style>

      {/* Background */}
      <div className="global-bg" />

      {/* Stars */}
      {stars.map((star, i) => (
        <div key={i} className="g-star" style={{
          width: star.w + "px",
          height: star.h + "px",
          top: star.t + "%",
          left: star.l + "%",
          animationDelay: star.d + "s",
          animationDuration: star.dur + "s"
        }} />
      ))}

      {/* Clouds */}
      <div className="g-cloud" style={{ width: "120px", height: "30px", top: "8%", left: "5%" }} />
      <div className="g-cloud" style={{ width: "80px", height: "20px", top: "12%", right: "10%", animationDelay: "2s" }} />
      <div className="g-cloud" style={{ width: "100px", height: "25px", top: "20%", left: "55%", animationDelay: "4s" }} />

      {/* Mountains */}
      <div className="g-mountain" style={{ borderWidth: "0 120px 180px 120px", borderColor: "transparent transparent #2d1b69 transparent", left: "0px" }} />
      <div className="g-mountain" style={{ borderWidth: "0 100px 150px 100px", borderColor: "transparent transparent #4a2080 transparent", left: "150px" }} />
      <div className="g-mountain" style={{ borderWidth: "0 150px 200px 150px", borderColor: "transparent transparent #1a0533 transparent", right: "0px" }} />
      <div className="g-mountain" style={{ borderWidth: "0 120px 160px 120px", borderColor: "transparent transparent #2d1b69 transparent", right: "150px" }} />

      {/* Snow Ground */}
      <div className="g-snow" />

      {/* Trees */}
      <div className="g-tree" style={{ left: "40px" }}>
        <div className="g-tree-body" />
        <div className="g-tree-trunk" />
      </div>
      <div className="g-tree" style={{ left: "90px", bottom: "55px" }}>
        <div className="g-tree-body" style={{ borderBottomWidth: "80px" }} />
        <div className="g-tree-trunk" />
      </div>
      <div className="g-tree" style={{ right: "160px" }}>
        <div className="g-tree-body" />
        <div className="g-tree-trunk" />
      </div>

      {/* House */}
      <div className="g-house">
        <div className="g-house-roof" />
        <div className="g-house-body">
          <div className="g-house-window" />
          <div className="g-smoke" />
          <div className="g-smoke" style={{ animationDelay: "1s", left: "25px" }} />
        </div>
      </div>

      {/* Birds */}
      <div className="g-bird" style={{ top: "15%", animationDuration: "12s", animationDelay: "0s" }}>🐦</div>
      <div className="g-bird" style={{ top: "20%", animationDuration: "15s", animationDelay: "4s" }}>🐦</div>
      <div className="g-bird" style={{ top: "10%", animationDuration: "18s", animationDelay: "8s" }}>🐦</div>

      {/* Cats */}
      <div className="g-cat" style={{ animationDuration: "20s", animationDelay: "0s" }}>🐱</div>
      <div className="g-cat" style={{ animationDuration: "25s", animationDelay: "10s", bottom: "72px" }}>🐱</div>
    </>
  );
}
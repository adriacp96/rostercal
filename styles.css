/* 
 * Apple Design typography scale and system fonts[cite: 9]
 */
:root {
  font: 100%/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-optical-sizing: auto;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(51, 65, 85, 0.8);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 1);
}

/* Hide horizontal scrollbar on category filter pill bar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

body {
  background-color: #030712;
  position: relative;
  overflow-x: hidden;
}

body::before, body::after {
  content: '';
  position: fixed;
  width: 45vw;
  height: 45vw;
  filter: blur(130px);
  z-index: -1;
  opacity: 0.18;
  animation: floatOrbs 20s ease-in-out infinite alternate;
  pointer-events: none;
}

body::before {
  background: radial-gradient(circle, #3b82f6 0%, #1d4ed8 55%, transparent 80%);
  top: -15%;
  left: -10%;
}

body::after {
  background: radial-gradient(circle, #0ea5e9 0%, #0369a1 55%, transparent 80%);
  bottom: -15%;
  right: -10%;
  animation-delay: -10s;
  animation-direction: alternate-reverse;
}

@keyframes floatOrbs {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(60px, 90px) scale(1.15); }
  100% { transform: translate(-40px, 50px) scale(0.9); }
}

/* Response: Kill Latency, Active State on Pointer Down[cite: 9] */
button, .btn, a, label {
  transition: transform 100ms ease-out, background-color 200ms ease, opacity 200ms ease, border-color 200ms ease !important;
}

button:active, .btn:active, a:active {
  transform: scale(0.97) !important;
}

/* Apple Materials & Translucency[cite: 9] */
.apple-glass {
  background: rgba(15, 23, 42, 0.6) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4) !important;
}

/* Apple typography tracking adjustments for larger sizes[cite: 9] */
h1, h2, h3, .text-xl, .text-2xl, .text-3xl, .text-4xl, .tracking-tight {
  letter-spacing: -0.02em !important;
  line-height: 1.05 !important;
}

tr {
  transition: background-color 0.15s ease-in-out;
}

tr:hover {
  background-color: rgba(30, 41, 59, 0.6);
}

/* Spring-like bezier curve for reversible transitions[cite: 9] */
@keyframes dominoCascade {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  opacity: 0;
  animation: dominoCascade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
}

@keyframes emeraldGradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-emerald-badge {
  background: linear-gradient(-45deg, #022c22, #064e3b, #134e4a, #065f46, #022c22);
  background-size: 300% 300%;
  animation: emeraldGradientShift 6s ease infinite;
}

@keyframes blueGradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-blue-text {
  background: linear-gradient(-45deg, #38bdf8, #60a5fa, #3b82f6, #0284c7, #06b6d4);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: blueGradientShift 6s ease infinite;
}

.calendar-day-cell {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(51, 65, 85, 0.4);
  border-radius: 6px;
  padding: 2px 3px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calendar-day-cell:hover {
  border-color: rgba(96, 165, 250, 0.5);
  background: rgba(30, 41, 59, 0.6);
}

.calendar-day-empty {
  background: rgba(15, 23, 42, 0.15);
  border: 1px dashed rgba(51, 65, 85, 0.2);
  border-radius: 6px;
  opacity: 0.3;
}

/* Aviation Magic Mode Animations */
@keyframes radar-sweep {
  0% { transform: rotate(0deg); opacity: 0.1; }
  50% { opacity: 0.4; }
  100% { transform: rotate(360deg); opacity: 0.1; }
}

.animate-radar-sweep {
  animation: radar-sweep 4s linear infinite;
  transform-origin: center center;
}

@keyframes takeoff {
  0% { 
    transform: translate(-120px, 30px) rotate(10deg) scale(0.6); 
    opacity: 0; 
  }
  20% { 
    opacity: 1; 
  }
  80% { 
    opacity: 1; 
  }
  100% { 
    transform: translate(120px, -40px) rotate(25deg) scale(1.4); 
    opacity: 0; 
  }
}

.animate-takeoff {
  animation: takeoff 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* Magic Mode Transparent Overlay Classes */
html.magic-transparent, 
body.magic-transparent {
  background-color: transparent !important;
  background: transparent !important;
}

body.magic-transparent::before, 
body.magic-transparent::after {
  display: none !important; /* Hides the floating background orbs in overlay mode */
}

/* Hide header and footer in magic mode to ensure only the overlay is visible */
body.magic-transparent header,
body.magic-transparent footer {
  display: none !important;
}

/* Staggered Elegance for Magic Mode */
.magic-item {
  opacity: 0;
  animation: dominoCascade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }
.delay-700 { animation-delay: 700ms; }
.delay-800 { animation-delay: 800ms; }
.delay-900 { animation-delay: 900ms; }
.delay-1000 { animation-delay: 1000ms; }

/* 
 * Accessibility: Reduced Motion[cite: 9] 
 * Use simple opacity transitions instead of springs/transforms.
 */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in, .magic-item {
    animation: none !important;
    transition: opacity 200ms ease !important;
    transform: none !important;
    opacity: 1 !important;
  }
  body::before, body::after, .animate-radar-sweep, .animate-takeoff {
    animation: none !important;
    display: none !important;
  }
  button:active, .btn:active, a:active {
    transform: none !important;
  }
}

/* 
 * Accessibility: Reduced Transparency[cite: 9]
 * Convert glass layers to solid colors.
 */
@media (prefers-reduced-transparency: reduce) {
  .apple-glass, header, .backdrop-blur-md, .backdrop-blur-sm, .backdrop-blur-xl {
    background: #0f172a !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
}

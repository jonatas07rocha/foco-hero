/**
 * theme_effects.js
 * Motor leve em Canvas 2D para efeitos visuais animados ao redor do card nos temas compráveis.
 */

const THEME_EFFECT_MAP = {
    tech_matrix: 'matrix',
    tech_cyberpunk: 'cyberpunk',
    tech_vaporwave: 'vaporwave',
    tech_hightech: 'network',
    abstrato_estrelas: 'stars',
    abstrato_energia: 'energy',
    abstrato_aquarela: 'watercolor',
    zen_light: 'zen',
    natureza_floresta: 'forest',
    natureza_cerrado: 'cerrado',
    natureza_praias: 'beach',
    natureza_pantanal: 'fireflies',
    seasonal_carnaval: 'confetti',
    seasonal_festa_junina: 'embers',
    seasonal_halloween: 'halloween',
    seasonal_natal: 'snow',
};

const MATRIX_CHARS =
    'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let canvasEl = null;
let ctx = null;
let rafId = null;
let currentEffect = null;
let effectState = null;
let resizeBound = false;

export function getEffectForTheme(themeId) {
    return THEME_EFFECT_MAP[themeId] || null;
}

function ensureCanvas() {
    if (typeof document === 'undefined') return null;
    if (!canvasEl) {
        canvasEl = document.getElementById('theme-effects-canvas');
    }
    if (!canvasEl) return null;
    if (!ctx) {
        ctx = canvasEl.getContext('2d');
    }
    if (!resizeBound && typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && currentEffect && !rafId) {
                loop();
            }
        });
        resizeBound = true;
    }
    return canvasEl;
}

function handleResize() {
    if (!canvasEl || !currentEffect) return;
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    effectState = initEffectState(currentEffect, canvasEl.width, canvasEl.height);
}

function initEffectState(type, w, h) {
    if (type === 'matrix') {
        const fontSize = 16;
        const columns = Math.max(10, Math.ceil(w / fontSize));
        return {
            fontSize,
            drops: Array.from({ length: columns }, () => Math.floor(Math.random() * -40)),
            speeds: Array.from({ length: columns }, () => 0.45 + Math.random() * 0.65),
        };
    }

    if (type === 'cyberpunk') {
        return {
            drops: Array.from({ length: 90 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                len: 14 + Math.random() * 22,
                speed: 7 + Math.random() * 7,
                color: Math.random() > 0.5 ? 'rgba(255, 0, 255, 0.45)' : 'rgba(0, 255, 255, 0.45)',
            })),
        };
    }

    if (type === 'vaporwave') {
        return { offset: 0 };
    }

    if (type === 'network') {
        return {
            nodes: Array.from({ length: 42 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.65,
                vy: (Math.random() - 0.5) * 0.65,
                r: 2 + Math.random() * 2,
            })),
        };
    }

    if (type === 'stars') {
        return {
            stars: Array.from({ length: 110 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0.6 + Math.random() * 1.8,
                phase: Math.random() * Math.PI * 2,
                speed: 0.015 + Math.random() * 0.03,
            })),
            shooter: null,
        };
    }

    if (type === 'snow' || type === 'confetti' || type === 'zen' || type === 'forest') {
        const palette =
            type === 'confetti'
                ? ['#FFD700', '#FF4081', '#00E5FF', '#4CAF50', '#FF5722']
                : type === 'zen'
                    ? ['rgba(144, 164, 174, 0.38)', 'rgba(176, 190, 197, 0.35)']
                    : type === 'forest'
                        ? ['rgba(76, 175, 80, 0.45)', 'rgba(129, 199, 132, 0.4)', 'rgba(255, 235, 59, 0.55)']
                        : ['rgba(255, 255, 255, 0.78)'];

        const count = type === 'snow' ? 75 : 48;
        return {
            items: Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                size: type === 'snow' ? 1.5 + Math.random() * 3.5 : 4 + Math.random() * 5,
                vy: 0.6 + Math.random() * 1.4,
                vx: (Math.random() - 0.5) * 0.7,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.05,
                color: palette[Math.floor(Math.random() * palette.length)],
            })),
        };
    }

    if (type === 'watercolor' || type === 'energy' || type === 'beach') {
        const colors =
            type === 'watercolor'
                ? ['rgba(126, 87, 194, 0.14)', 'rgba(79, 195, 247, 0.14)', 'rgba(244, 143, 177, 0.14)']
                : type === 'energy'
                    ? ['rgba(255, 64, 129, 0.22)', 'rgba(213, 0, 249, 0.2)', 'rgba(255, 171, 0, 0.16)']
                    : ['rgba(0, 191, 255, 0.16)', 'rgba(38, 198, 218, 0.14)'];

        return {
            phase: 0,
            blobs: Array.from({ length: 16 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 30 + Math.random() * 75,
                vx: (Math.random() - 0.5) * 0.45,
                vy: type === 'energy' ? -(0.4 + Math.random() * 0.8) : (Math.random() - 0.5) * 0.45,
                color: colors[Math.floor(Math.random() * colors.length)],
            })),
        };
    }

    // fireflies, cerrado, embers, halloween
    const particleColors =
        type === 'cerrado'
            ? ['rgba(255, 140, 0, 0.45)', 'rgba(255, 193, 7, 0.4)']
            : type === 'embers'
                ? ['rgba(255, 87, 34, 0.65)', 'rgba(255, 193, 7, 0.55)']
                : type === 'halloween'
                    ? ['rgba(255, 152, 0, 0.48)', 'rgba(156, 39, 176, 0.42)']
                    : ['rgba(255, 241, 118, 0.72)', 'rgba(129, 212, 250, 0.55)'];

    return {
        particles: Array.from({ length: 42 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 1.5 + Math.random() * 2.8,
            vx: (Math.random() - 0.5) * 0.5,
            vy: type === 'embers' ? -(0.6 + Math.random() * 1.1) : (Math.random() - 0.5) * 0.45,
            phase: Math.random() * Math.PI * 2,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
        })),
    };
}

function drawFrame(type, st, w, h) {
    if (type === 'matrix') {
        ctx.fillStyle = 'rgba(0, 6, 2, 0.08)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = `bold ${st.fontSize}px monospace`;

        for (let i = 0; i < st.drops.length; i++) {
            const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            const x = i * st.fontSize;
            const y = Math.floor(st.drops[i]) * st.fontSize;

            if (y > 0) {
                ctx.fillStyle = Math.random() > 0.85 ? '#C8FFC8' : '#39FF14';
                ctx.fillText(ch, x, y);
            }

            st.drops[i] += st.speeds[i];
            if (y > h && Math.random() > 0.975) {
                st.drops[i] = Math.floor(Math.random() * -18);
            }
        }
        return;
    }

    ctx.clearRect(0, 0, w, h);

    if (type === 'cyberpunk') {
        ctx.lineWidth = 1.5;
        st.drops.forEach((d) => {
            ctx.strokeStyle = d.color;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x - 4, d.y + d.len);
            ctx.stroke();
            d.x -= 1.6;
            d.y += d.speed;
            if (d.y > h) {
                d.y = -d.len;
                d.x = Math.random() * (w + 100);
            }
        });
        return;
    }

    if (type === 'vaporwave') {
        const horizon = h * 0.58;
        // Sol retro
        const sunGrad = ctx.createLinearGradient(0, horizon - 110, 0, horizon);
        sunGrad.addColorStop(0, 'rgba(255, 215, 0, 0.35)');
        sunGrad.addColorStop(1, 'rgba(255, 64, 129, 0.35)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(w / 2, horizon - 30, 95, Math.PI, 0);
        ctx.fill();

        // Grade em perspectiva
        ctx.strokeStyle = 'rgba(255, 105, 180, 0.22)';
        ctx.lineWidth = 1;
        for (let i = -10; i <= 10; i++) {
            ctx.beginPath();
            ctx.moveTo(w / 2 + i * 24, horizon);
            ctx.lineTo(w / 2 + i * 130, h);
            ctx.stroke();
        }
        st.offset = (st.offset + 0.6) % 36;
        for (let y = horizon + st.offset; y < h; y += 36) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        return;
    }

    if (type === 'network') {
        st.nodes.forEach((n) => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;
        });
        ctx.lineWidth = 1;
        for (let i = 0; i < st.nodes.length; i++) {
            const a = st.nodes[i];
            ctx.fillStyle = 'rgba(0, 123, 255, 0.35)';
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fill();
            for (let j = i + 1; j < st.nodes.length; j++) {
                const b = st.nodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 135) {
                    ctx.strokeStyle = `rgba(0, 123, 255, ${(1 - dist / 135) * 0.25})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        return;
    }

    if (type === 'stars') {
        st.stars.forEach((s) => {
            s.phase += s.speed;
            const alpha = 0.25 + ((Math.sin(s.phase) + 1) / 2) * 0.7;
            ctx.fillStyle = `rgba(236, 239, 241, ${alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });
        if (!st.shooter && Math.random() < 0.008) {
            st.shooter = { x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, life: 1 };
        }
        if (st.shooter) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${st.shooter.life})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(st.shooter.x, st.shooter.y);
            ctx.lineTo(st.shooter.x - 45, st.shooter.y - 22);
            ctx.stroke();
            st.shooter.x += 12;
            st.shooter.y += 6;
            st.shooter.life -= 0.04;
            if (st.shooter.life <= 0) st.shooter = null;
        }
        return;
    }

    if (type === 'snow' || type === 'confetti' || type === 'zen' || type === 'forest') {
        st.items.forEach((p) => {
            p.x += p.vx + Math.sin(p.angle) * 0.35;
            p.y += p.vy;
            p.angle += p.spin;
            if (p.y > h + 15) {
                p.y = -10;
                p.x = Math.random() * w;
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            if (type === 'confetti') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
            } else if (type === 'forest') {
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
        return;
    }

    if (type === 'watercolor' || type === 'energy' || type === 'beach') {
        st.blobs.forEach((b) => {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < -b.r) b.x = w + b.r;
            if (b.x > w + b.r) b.x = -b.r;
            if (b.y < -b.r) b.y = h + b.r;
            if (b.y > h + b.r) b.y = -b.r;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
        if (type === 'beach') {
            st.phase += 0.025;
            ctx.fillStyle = 'rgba(0, 191, 255, 0.16)';
            ctx.beginPath();
            ctx.moveTo(0, h);
            for (let x = 0; x <= w; x += 24) {
                ctx.lineTo(x, h - 42 + Math.sin(x * 0.015 + st.phase) * 14);
            }
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.fill();
        }
        return;
    }

    // fireflies, cerrado, embers, halloween
    st.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.04;
        if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
        }
        if (p.y > h + 10) p.y = -10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.globalAlpha = 0.35 + ((Math.sin(p.phase) + 1) / 2) * 0.65;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function loop() {
    if (!currentEffect || !canvasEl || !ctx) {
        rafId = null;
        return;
    }
    if (typeof document !== 'undefined' && document.hidden) {
        rafId = null;
        return;
    }
    drawFrame(currentEffect, effectState, canvasEl.width, canvasEl.height);
    rafId = window.requestAnimationFrame(loop);
}

export function applyThemeEffect(themeId) {
    const nextEffect = getEffectForTheme(themeId);
    const canvas = ensureCanvas();
    if (!canvas || !ctx) {
        currentEffect = nextEffect;
        return nextEffect;
    }

    if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (!nextEffect) {
        currentEffect = null;
        effectState = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add('hidden');
        return null;
    }

    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    currentEffect = nextEffect;
    effectState = initEffectState(nextEffect, canvas.width, canvas.height);

    const reducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
        drawFrame(currentEffect, effectState, canvas.width, canvas.height);
    } else {
        loop();
    }
    return currentEffect;
}

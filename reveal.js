const revealCards = document.querySelectorAll(".code-reveal-card");

const reveal = (card) => {
    card.classList.add("in-view");

    const delay = Number(card.dataset.revealDelay || 260);
    window.setTimeout(() => {
        card.classList.add("revealed");
    }, delay);
};

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.32,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    revealCards.forEach((card) => observer.observe(card));
} else {
    revealCards.forEach(reveal);
}

document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", () => {
        const toggle = document.getElementById("menu-toggle");
        if (toggle) {
            toggle.checked = false;
        }
    });
});

// Typewriter effect for the hero boot terminal (boot_portfolio.sh).
const typeBootTerminal = () => {
    const code = document.querySelector(".terminal-card code");
    if (!code) {
        return;
    }

    // Collect the existing colored segments, skipping the trailing cursor.
    const segments = [];
    code.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent) {
                segments.push({ text: node.textContent, className: null });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList.contains("cursor")) {
                return;
            }
            segments.push({ text: node.textContent, className: node.className });
        }
    });

    if (!segments.length) {
        return;
    }

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        // Keep the static, fully-rendered terminal.
        return;
    }

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "█";

    code.textContent = "";
    code.appendChild(cursor);

    let segIndex = 0;
    let charIndex = 0;
    let currentSpan = null;

    const typeNext = () => {
        if (segIndex >= segments.length) {
            return;
        }

        const segment = segments[segIndex];

        if (!segment.text.length) {
            segIndex += 1;
            charIndex = 0;
            currentSpan = null;
            window.setTimeout(typeNext, 0);
            return;
        }

        if (charIndex === 0) {
            currentSpan = document.createElement("span");
            if (segment.className) {
                currentSpan.className = segment.className;
            }
            code.insertBefore(currentSpan, cursor);
        }

        const char = segment.text[charIndex];
        currentSpan.textContent += char;
        charIndex += 1;

        if (charIndex >= segment.text.length) {
            segIndex += 1;
            charIndex = 0;
            currentSpan = null;
        }

        const delay = char === "\n" ? 260 : 30 + Math.random() * 45;
        window.setTimeout(typeNext, delay);
    };

    window.setTimeout(typeNext, 450);
};

typeBootTerminal();

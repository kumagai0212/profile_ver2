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

    // Aim for the whole boot sequence to finish in ~3s, regardless of
    // how many characters the (localized) terminal text contains.
    const startDelay = 300;
    const typingBudget = 2700;
    const totalChars = segments.reduce(
        (sum, segment) => sum + segment.text.length,
        0
    );
    const perChar = typingBudget / Math.max(totalChars, 1);

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

        currentSpan.textContent += segment.text[charIndex];
        charIndex += 1;

        if (charIndex >= segment.text.length) {
            segIndex += 1;
            charIndex = 0;
            currentSpan = null;
        }

        // Slight per-character jitter for a human feel, but the average
        // stays at perChar so the total duration lands near the budget.
        const delay = perChar * (0.7 + Math.random() * 0.6);
        window.setTimeout(typeNext, delay);
    };

    window.setTimeout(typeNext, startDelay);
};

typeBootTerminal();

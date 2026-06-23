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

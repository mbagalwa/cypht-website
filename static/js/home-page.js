// ===============================
// Features cards animations
// ===============================
function init_feature_cards() {
  const cards = document.querySelectorAll(".f-card");

  // Fade-in animation
  cards.forEach((card, index) => {
    setTimeout(() => card.classList.add("visible"), 100 * index);
  });

  // Parallax
  cards.forEach((card) => {
    const img = card.querySelector("img");
    if (!img) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left - rect.width / 2) / 30;
      const offsetY = (e.clientY - rect.top - rect.height / 2) / 30;

      img.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    card.addEventListener("mouseleave", () => {
      img.style.transform = "translate(0, 0)";
    });
  });
}

// ===============================
// Testimonials (IntersectionObserver)
// ===============================
function init_testimonials() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document
    .querySelectorAll(".testimonial-card")
    .forEach((card) => observer.observe(card));
}

// ===============================
// FAQ
// ===============================
function init_faq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faqItem) => faqItem.classList.remove("active"));

      if (!isActive) item.classList.add("active");
    });
  });
}

// ===============================
// Live hero counters
// ===============================

// Shortens a counter (159432 -> "159k"), flooring so the trailing "+" stays truthful.
function abbreviate(value) {
  for (const [threshold, suffix] of [[1e9, "G"], [1e6, "M"], [1e3, "k"]]) {
    if (value >= threshold) {
      const scaled = Math.floor((value / threshold) * 10) / 10;
      return (scaled < 10 ? scaled : Math.floor(scaled)) + suffix;
    }
  }
  return String(value);
}

async function refresh_packagist_stat() {
  const el = document.getElementById("packagist-downloads");
  if (!el) return;

  try {
    const res = await fetch(
      "https://packagist.org/packages/jason-munro/cypht.json"
    );
    const data = await res.json();
    el.textContent = `${abbreviate(data.package.downloads.total)}+`;
  } catch (err) {
    console.error("Packagist stats error:", err);
  }
}

async function refresh_docker_stat() {
  const el = document.getElementById("docker-pulls");
  if (!el) return;

  try {
    const res = await fetch(
      "https://img.shields.io/docker/pulls/cypht/cypht.json"
    );
    const data = await res.json();
    // shields.io pre-abbreviates ("159k"); ignore anything else (e.g. "invalid").
    if (/^[\d.]+[kMG]?$/.test(data.value)) el.textContent = `${data.value}+`;
  } catch (err) {
    console.error("Docker stats error:", err);
  }
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  init_feature_cards();
  init_testimonials();
  init_faq();
  refresh_packagist_stat();
  refresh_docker_stat();
});


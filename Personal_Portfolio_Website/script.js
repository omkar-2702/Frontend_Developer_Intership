// Smooth scrolling and active link handling
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");
const header = document.querySelector(".header");
const hamburger = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".nav-links");

// Smooth scroll on click
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId.startsWith("#")) {
      e.preventDefault();
      const section = document.querySelector(targetId);
      const offset = header.offsetHeight - 10;
      const sectionTop = section.offsetTop - offset;

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });

      // Close mobile menu after click
      navLinksContainer.classList.remove("open");
    }
  });
});

// Scroll spy for active link
window.addEventListener("scroll", () => {
  let current = "";
  const scrollY = window.scrollY;
  const headerHeight = header.offsetHeight + 40;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - headerHeight;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = "#" + section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
});

// Mobile hamburger toggle
hamburger.addEventListener("click", () => {
  navLinksContainer.classList.toggle("open");
});

// Contact form validation
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const subjectError = document.getElementById("subjectError");
const messageError = document.getElementById("messageError");
const formSuccess = document.getElementById("formSuccess");

function resetErrors() {
  [nameError, emailError, subjectError, messageError].forEach((el) => {
    el.style.display = "none";
    el.textContent = "";
  });
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    input.style.borderColor = "#d1d5db";
  });
}

function validateEmailFormat(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resetErrors();
  formSuccess.textContent = "";

  let isValid = true;

  if (!nameInput.value.trim()) {
    nameError.textContent = "Name is required.";
    nameError.style.display = "block";
    nameInput.style.borderColor = "#dc2626";
    isValid = false;
  }

  if (!emailInput.value.trim()) {
    emailError.textContent = "Email is required.";
    emailError.style.display = "block";
    emailInput.style.borderColor = "#dc2626";
    isValid = false;
  } else if (!validateEmailFormat(emailInput.value.trim())) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.style.display = "block";
    emailInput.style.borderColor = "#dc2626";
    isValid = false;
  }

  if (!subjectInput.value.trim()) {
    subjectError.textContent = "Subject is required.";
    subjectError.style.display = "block";
    subjectInput.style.borderColor = "#dc2626";
    isValid = false;
  }

  if (!messageInput.value.trim()) {
    messageError.textContent = "Message is required.";
    messageError.style.display = "block";
    messageInput.style.borderColor = "#dc2626";
    isValid = false;
  }

  if (isValid) {
    formSuccess.textContent = "Thank you! Your message has been validated (demo only).";
    contactForm.reset();
  }
});

// Simple project modal logic
const projectButtons = document.querySelectorAll(".project-details-btn");
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.querySelector(".modal-close");

const projectDetails = {
  1: {
    title: "AWS EC2 Lab Workflow",
    description:
      "Detailed workflow covering instance creation, security groups, SSH access, basic Linux commands, and simple automation using shell scripts and AWS CLI.",
  },
  2: {
    title: "Sample CI/CD Pipeline",
    description:
      "Conceptual pipeline including code commit, automated build, test stages, and deployment to a test environment using common DevOps tools.",
  },
  3: {
    title: "Linux System Practice",
    description:
      "Hands‑on practice with filesystem hierarchy, permissions, users, groups, and shell scripting to automate logs cleanup and backups.",
  },
};

projectButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-project");
    modalTitle.textContent = projectDetails[id].title;
    modalDescription.textContent = projectDetails[id].description;
    modal.style.display = "flex";
  });
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Footer year
const yearSpan = document.getElementById("year");
yearSpan.textContent = new Date().getFullYear();

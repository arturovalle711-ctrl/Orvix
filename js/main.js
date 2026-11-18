"use strict";

/* =========================================================
   ORVIX SYSTEMS
   ARCHIVO PRINCIPAL DE JAVASCRIPT
   Funciones generales del sitio
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initMobileMenu();
    initDropdowns();
    initAccordions();
    initModals();
    initSmoothScroll();
    initScrollAnimations();
    initCurrentPage();
    initHeaderScroll();
    initBackToTop();
    initThemeToggle();

});


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function initMobileMenu() {

    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-menu");

    if (!toggle || !menu) return;

    /*
     * Si el botón no trae las tres líneas del ícono en el HTML,
     * las creamos aquí para que el menú móvil siempre sea visible.
     */
    if (!toggle.querySelector("span")) {
        for (let i = 0; i < 3; i++) {
            toggle.appendChild(document.createElement("span"));
        }
    }

    if (!menu.id) {
        menu.id = "menu-principal";
    }

    toggle.setAttribute("aria-controls", menu.id);
    toggle.setAttribute("aria-haspopup", "true");

    const closeMenu = () => {

        menu.classList.remove("open");
        toggle.classList.remove("active");

        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");

        document.body.classList.remove("menu-open");

        menu.querySelectorAll(".nav-dropdown.open").forEach(dropdown => {

            dropdown.classList.remove("open");

            const button = dropdown.querySelector(
                ".nav-dropdown-toggle, .nav-dropdown-trigger"
            );

            if (button) {
                button.setAttribute("aria-expanded", "false");
            }

        });

    };


    const openMenu = () => {

        menu.classList.add("open");
        toggle.classList.add("active");

        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Cerrar menú");

        document.body.classList.add("menu-open");

    };


    toggle.addEventListener("click", event => {

        event.preventDefault();
        event.stopPropagation();

        const isOpen = menu.classList.contains("open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    });


    menu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            closeMenu();
        });

    });


    document.addEventListener("click", event => {
        if (!menu.classList.contains("open")) return;
        if (menu.contains(event.target) || toggle.contains(event.target)) return;
        closeMenu();
    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {
            closeMenu();
        }

    });

}


/* =========================================================
   MENÚS DESPLEGABLES
========================================================= */

function initDropdowns() {

    const dropdowns = document.querySelectorAll(".nav-dropdown");

    if (!dropdowns.length) return;

    dropdowns.forEach(dropdown => {

        const button = dropdown.querySelector(
            ".nav-dropdown-toggle, .nav-dropdown-trigger"
        );

        if (!button) return;

        if (!button.hasAttribute("aria-expanded")) {
            button.setAttribute("aria-expanded", "false");
        }

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const wasOpen = dropdown.classList.contains("open");

            dropdowns.forEach(otherDropdown => {

                if (otherDropdown === dropdown) return;

                otherDropdown.classList.remove("open");

                const otherButton = otherDropdown.querySelector(
                    ".nav-dropdown-toggle, .nav-dropdown-trigger"
                );

                if (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                }

            });

            const shouldOpen = !wasOpen;

            dropdown.classList.toggle("open", shouldOpen);
            button.setAttribute("aria-expanded", String(shouldOpen));

        });

    });


    document.addEventListener("click", event => {

        dropdowns.forEach(dropdown => {

            if (dropdown.contains(event.target)) return;

            dropdown.classList.remove("open");

            const button = dropdown.querySelector(
                ".nav-dropdown-toggle, .nav-dropdown-trigger"
            );

            if (button) {
                button.setAttribute("aria-expanded", "false");
            }

        });

    });

}


/* =========================================================
   ACORDEONES
========================================================= */

function initAccordions() {

    const items = document.querySelectorAll(".accordion-item");

    if (!items.length) return;

    items.forEach(item => {

        const button = item.querySelector(".accordion-header");

        if (!button) return;

        if (!button.hasAttribute("aria-expanded")) {
            button.setAttribute("aria-expanded", "false");
        }

        button.addEventListener("click", () => {

            const wasOpen = item.classList.contains("open");

            items.forEach(otherItem => {

                if (otherItem === item) return;

                otherItem.classList.remove("open");

                const otherButton = otherItem.querySelector(".accordion-header");

                if (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                }

            });

            const shouldOpen = !wasOpen;

            item.classList.toggle("open", shouldOpen);
            button.setAttribute("aria-expanded", String(shouldOpen));

        });

    });

}


/* =========================================================
   VENTANAS MODALES
========================================================= */

function initModals() {

    const triggers = document.querySelectorAll("[data-modal-target]");
    const closeButtons = document.querySelectorAll(".modal-close");
    const modals = document.querySelectorAll(".modal");

    if (!triggers.length && !modals.length) return;

    const closeModal = modal => {

        if (!modal) return;

        modal.classList.remove("open");
        document.body.classList.remove("no-scroll");

    };

    const openModal = modal => {

        if (!modal) return;

        modal.classList.add("open");
        document.body.classList.add("no-scroll");

    };


    triggers.forEach(trigger => {

        trigger.addEventListener("click", event => {

            event.preventDefault();

            const target = trigger.getAttribute("data-modal-target");

            if (!target) return;

            const modal = document.querySelector(target);

            if (!modal) return;

            openModal(modal);

        });

    });


    closeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const modal = button.closest(".modal");

            closeModal(modal);

        });

    });


    modals.forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeModal(modal);
            }

        });

    });


    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        document.querySelectorAll(".modal.open").forEach(modal => {
            closeModal(modal);
        });

    });

}


/* =========================================================
   DESPLAZAMIENTO SUAVE
========================================================= */

function initSmoothScroll() {

    const links = document.querySelectorAll('a[href^="#"]');

    if (!links.length) return;

    links.forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length <= 1
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}


/* =========================================================
   ANIMACIONES AL DESPLAZARSE
========================================================= */

function initScrollAnimations() {

    const elements = document.querySelectorAll(".fade-up");

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {
            element.classList.add("visible");
        });

        return;

    }

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    elements.forEach(element => {
        observer.observe(element);
    });

}


/* =========================================================
   PÁGINA ACTUAL
========================================================= */

function initCurrentPage() {

    let currentPage = window.location.pathname.split("/").pop();

    if (!currentPage) {
        currentPage = "index.html";
    }

    document.querySelectorAll(".nav-link[href]").forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        link.classList.remove("active");

        const cleanHref = href.split("/").pop().split("#")[0];

        if (cleanHref === currentPage && cleanHref !== "") {
            link.classList.add("active");
        }

    });


    document.querySelectorAll(".nav-dropdown-link[href]").forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        const cleanHref = href.split("/").pop().split("#")[0];

        link.classList.remove("active");

        if (cleanHref !== currentPage) return;

        link.classList.add("active");

        const dropdown = link.closest(".nav-dropdown");

        if (!dropdown) return;

        dropdown.classList.add("open");

        const button = dropdown.querySelector(
            ".nav-dropdown-toggle, .nav-dropdown-trigger"
        );

        if (button) {
            button.classList.add("active");
            button.setAttribute("aria-expanded", "true");
        }

    });

}


/* =========================================================
   ENCABEZADO AL DESPLAZARSE
========================================================= */

function initHeaderScroll() {

    const header = document.querySelector(".site-header");

    if (!header) return;

    const updateHeader = () => {

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

}


/* =========================================================
   VOLVER ARRIBA
========================================================= */

function initBackToTop() {

    const button = document.querySelector("[data-back-to-top]");

    if (!button) return;

    const updateButton = () => {

        if (window.scrollY > 400) {
            button.classList.add("visible");
        } else {
            button.classList.remove("visible");
        }

    };

    button.addEventListener("click", event => {

        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    updateButton();

    window.addEventListener("scroll", updateButton, {
        passive: true
    });

}


/* =========================================================
   MODO OSCURO / CLARO
========================================================= */

function initThemeToggle() {

    const toggles = document.querySelectorAll("[data-theme-toggle]");

    if (!toggles.length) return;

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("orvix-theme");
    } catch (error) {
        // El sitio sigue funcionando aunque el navegador bloquee el almacenamiento.
    }

    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-mode");
    }

    if (savedTheme === "light") {
        document.documentElement.classList.remove("dark-mode");
    }

    const updateToggleLabels = () => {

        const isDark = document.documentElement.classList.contains("dark-mode");

        toggles.forEach(toggle => {

            toggle.setAttribute("aria-pressed", String(isDark));

            toggle.setAttribute(
                "aria-label",
                isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            );

        });

    };

    updateToggleLabels();

    toggles.forEach(toggle => {

        toggle.addEventListener("click", () => {

            const isDark = document.documentElement.classList.toggle("dark-mode");

            try {
                localStorage.setItem(
                    "orvix-theme",
                    isDark ? "dark" : "light"
                );
            } catch (error) {
                // El cambio visual funciona aunque no se pueda guardar.
            }

            updateToggleLabels();

        });

    });

}
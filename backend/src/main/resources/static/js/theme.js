// theme.js
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Apply the saved theme on load
    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark" && themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            if (theme === "dark") {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
                themeToggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
            }
        });
    }
});

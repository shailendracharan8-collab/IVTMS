/**
 * IVTMS login form — client-side validation before Spring Security POST.
 * Server enforces matching "Login As" selection against the user's DB role.
 */
(function () {
    'use strict';

    function getEl(id) {
        return document.getElementById(id);
    }

    /**
     * Inline feedback above the form (non-blocking UI, production-style).
     */
    function showFeedback(message, type) {
        var el = getEl('loginFeedback');
        if (!el) {
            el = document.createElement('div');
            el.id = 'loginFeedback';
            el.setAttribute('role', 'alert');
            var form = getEl('loginForm');
            if (form && form.parentNode) {
                form.parentNode.insertBefore(el, form);
            } else {
                return;
            }
        }
        el.style.borderRadius = '0.75rem';
        el.style.fontSize = '0.85rem';
        el.className = 'alert py-2 mb-3 ' + (type === 'success' ? 'alert-success' : 'alert-danger');
        el.textContent = message;
        el.style.display = 'block';
    }

    function clearFeedback() {
        var el = getEl('loginFeedback');
        if (el) {
            el.style.display = 'none';
            el.textContent = '';
        }
    }

    function isAadhaarMode() {
        var btn = getEl('toggleAadhaar');
        return btn && btn.classList.contains('active');
    }

    /**
     * Validates role, identifier, and password; returns true if POST may proceed.
     */
    function validateForm() {
        clearFeedback();

        var roleSelect = getEl('roleSelect');
        var username = getEl('usernameField');
        var password = getEl('passwordField');

        if (!roleSelect || !username || !password) {
            return true;
        }

        var role = (roleSelect.value || '').trim();
        if (!role) {
            showFeedback('Please select how you are signing in.', 'danger');
            roleSelect.focus();
            return false;
        }

        var idVal = username.value.trim();
        if (!idVal) {
            showFeedback(isAadhaarMode()
                ? 'Please enter your 12-digit Aadhaar number.'
                : 'Please enter your email address.', 'danger');
            username.focus();
            return false;
        }

        if (isAadhaarMode()) {
            if (!/^\d{12}$/.test(idVal)) {
                showFeedback('Aadhaar must be exactly 12 digits (no spaces).', 'danger');
                username.focus();
                return false;
            }
        } else if (idVal.indexOf('@') < 1 || idVal.indexOf('.') < 1) {
            showFeedback('Please enter a valid email address.', 'danger');
            username.focus();
            return false;
        }

        if (!password.value) {
            showFeedback('Please enter your password.', 'danger');
            password.focus();
            return false;
        }

        return true;
    }

    function init() {
        var form = getEl('loginForm');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

(function () {
    'use strict';

    const clockEl = document.getElementById('clock');
    const timerEl = document.getElementById('timer');
    const typingArea = document.getElementById('typingArea');
    const wordsPerSecEl = document.getElementById('wordsPerSec');
    const charsPerSecEl = document.getElementById('charsPerSec');
    const sentencesPerMinEl = document.getElementById('sentencesPerMin');
    const resetBtn = document.getElementById('resetBtn');

    let startTime = null;
    let elapsedMs = 0;
    let running = false;
    let rafId = null;
    const EXPIRY_MS = 1 * 60 * 1000;
    const statusMsgEl = document.getElementById('statusMsg');
    let statusHideTimeout = null;

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hourStr = Math.floor(totalSeconds / 3600);
        const minuteStr = Math.floor((totalSeconds % 3600) / 60);
        const secondStr = totalSeconds % 60;
        return `${hourStr}:${minuteStr}:${secondStr}`;
    }

    function updateClock() {
        const now = new Date();
        const hourStr = now.getHours();
        const minuteStr = now.getMinutes();
        const secondStr = now.getSeconds();
        if (clockEl) clockEl.textContent = `${hourStr}:${minuteStr}:${secondStr}`;
    }

    function update() {
        if (!running) return;
        elapsedMs = Date.now() - startTime;
        if (timerEl) timerEl.textContent = formatTime(elapsedMs);
        rafId = requestAnimationFrame(update);
        // check expiry
        if (elapsedMs >= EXPIRY_MS) {
            // time's up: stop and disable further typing
            stopTimer();
            if (typingArea) {
                typingArea.blur();
                typingArea.disabled = true;
            }
            if (statusMsgEl) {
                statusMsgEl.textContent = 'Time is expire';
                statusMsgEl.style.display = '';
                if (statusHideTimeout) clearTimeout(statusHideTimeout);
                statusHideTimeout = setTimeout(() => {
                    statusMsgEl.style.display = 'none';
                    statusMsgEl.textContent = '';
                    statusHideTimeout = null;
                }, 10000);
            }
        }
    }

    // compute final stats once the session is stopped
    function computeFinalStats() {
        if (!typingArea) return;
        const text = typingArea.value || '';
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const sentences = (text.match(/[\.\!?]+/g) || []).length;

        const seconds = Math.max(1, Math.floor(elapsedMs / 1000));
        const minutes = Math.max(1, seconds / 60);

        const charsPerSec = (chars / seconds).toFixed(2);
        const wordsPerSec = (words / seconds).toFixed(2);
        const sentencesPerMin = (sentences / minutes).toFixed(2);

        if (charsPerSecEl) charsPerSecEl.textContent = charsPerSec;
        if (wordsPerSecEl) wordsPerSecEl.textContent = wordsPerSec;
        if (sentencesPerMinEl) sentencesPerMinEl.textContent = sentencesPerMin;
    }

    function startTimer() {
        if (running) return;
        running = true;
        startTime = Date.now() - elapsedMs;
        rafId = requestAnimationFrame(update);
    }

    function stopTimer() {
        if (!running) return;
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    // compute and show final summary once stopped
    computeFinalStats();
    }

    function resetAll() {
        stopTimer();
        startTime = null;
        elapsedMs = 0;
        if (typingArea) typingArea.value = '';
    if (typingArea) typingArea.disabled = false;
        if (timerEl) timerEl.textContent = '00:00:00';
        if (wordsPerSecEl) wordsPerSecEl.textContent = '0';
        if (charsPerSecEl) charsPerSecEl.textContent = '0';
        if (sentencesPerMinEl) sentencesPerMinEl.textContent = '0';
        if (statusMsgEl) {
            statusMsgEl.textContent = '';
            statusMsgEl.style.display = 'none';
        }
        if (statusHideTimeout) { clearTimeout(statusHideTimeout); statusHideTimeout = null; }
    }

    // events
    if (typingArea) {
        typingArea.addEventListener('focus', () => {
            startTimer();
        });
        typingArea.addEventListener('blur', () => {
            stopTimer();
        });
    }
    if (resetBtn) resetBtn.addEventListener('click', () => resetAll());

    // update clock every second
    updateClock();
    setInterval(updateClock, 1000);
})();

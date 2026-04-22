document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
});

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: 'Pacific/Auckland'
    });
    const timeEl = document.getElementById('time');
    if (timeEl) timeEl.textContent = timeString;
}
updateTime();
setInterval(updateTime, 1000);

console.log('%c dizzled.dev loaded ', 'background: #39d353; color: #0a0a0a; padding: 2px 6px;');
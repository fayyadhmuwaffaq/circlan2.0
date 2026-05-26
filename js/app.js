// circlan_v2/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Fade out preloader smoothly
        preloader.classList.add('opacity-0');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // Matches the Tailwind duration-500 class
    }

    // 2. Sidebar Toggle Logic
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        if (sidebar && overlay) {
            sidebar.classList.toggle('translate-x-full');
            
            // Handle overlay visibility
            if (overlay.classList.contains('hidden')) {
                overlay.classList.remove('hidden');
                // Small delay to allow display:block to apply before animating opacity
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            } else {
                overlay.classList.add('opacity-0');
                // Wait for transition to finish before hiding
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // 3. Post Like Interaction
    const likeButtons = document.querySelectorAll('.btn-like');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default if it's a link
            
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('.like-count');
            
            if (icon && countSpan) {
                // Parse current count, removing commas if present
                let count = parseInt(countSpan.textContent.replace(/,/g, ''));
                
                if (icon.classList.contains('fa-regular')) {
                    // Action: Like
                    icon.classList.replace('fa-regular', 'fa-solid');
                    icon.classList.add('text-red-500');
                    count++;
                } else {
                    // Action: Unlike
                    icon.classList.replace('fa-solid', 'fa-regular');
                    icon.classList.remove('text-red-500');
                    count--;
                }
                
                // Update text with locale formatting
                countSpan.textContent = count.toLocaleString();
                
                // Add pop animation to the icon
                icon.classList.add('scale-125', 'transition-transform', 'duration-200');
                setTimeout(() => {
                    icon.classList.remove('scale-125');
                }, 200);
            }
        });
    });
});

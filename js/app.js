// circlan_v2/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('opacity-0');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }

    // 2. Sidebar Toggle Logic (Mobile Drawer)
    const menuBtn = document.getElementById('menu-btn');
    const sidebarDrawer = document.getElementById('sidebar'); // Mobile sidebar element
    const overlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        if (sidebarDrawer && overlay) {
            sidebarDrawer.classList.toggle('translate-x-full');
            
            if (overlay.classList.contains('hidden')) {
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            } else {
                overlay.classList.add('opacity-0');
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
            e.preventDefault();
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('.like-count');
            
            if (icon && countSpan) {
                let count = parseInt(countSpan.textContent.replace(/,/g, ''));
                if (icon.classList.contains('fa-regular')) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                    icon.classList.add('text-red-500');
                    count++;
                } else {
                    icon.classList.replace('fa-solid', 'fa-regular');
                    icon.classList.remove('text-red-500');
                    count--;
                }
                countSpan.textContent = count.toLocaleString();
                icon.classList.add('scale-125', 'transition-transform', 'duration-200');
                setTimeout(() => icon.classList.remove('scale-125'), 200);
            }
        });
    });

    // 4. Generic Dropdown Logic (Handles Circle Filter, Post Dropdowns, and More Menu)
    document.addEventListener('click', (e) => {
        const desktopSidebar = document.querySelector('.sidebar-desktop');
        
        // Find if we clicked a toggle button
        const toggleBtn = e.target.closest('[id$="-btn"], .post-dropdown-btn');
        
        if (toggleBtn) {
            e.stopPropagation();
            
            // Determine the menu linked to this button
            let menu;
            if (toggleBtn.id === 'more-btn') {
                menu = document.getElementById('more-menu');
            } else if (toggleBtn.classList.contains('post-dropdown-btn')) {
                menu = toggleBtn.nextElementSibling;
            } else {
                // Fallback for circle filters
                const menuId = toggleBtn.id.replace('-btn', '-menu');
                menu = document.getElementById(menuId);
            }

            if (menu) {
                const isOpen = !menu.classList.contains('hidden');
                
                // Close all other menus
                document.querySelectorAll('[id$="-menu"], .post-dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.add('hidden');
                });
                
                // Toggle current menu
                menu.classList.toggle('hidden');
                
                // Keep desktop sidebar expanded if "More" is open
                if (toggleBtn.id === 'more-btn' && desktopSidebar) {
                    desktopSidebar.classList.toggle('expanded', !isOpen);
                }
            }
            return;
        }

        // Close all menus when clicking outside
        if (!e.target.closest('[id$="-menu"], .post-dropdown-menu')) {
            document.querySelectorAll('[id$="-menu"], .post-dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
            if (desktopSidebar) desktopSidebar.classList.remove('expanded');
        }
    });

    // 5. Comment Input Interaction
    const commentInput = document.querySelector('.comment-input-field');
    const commentPostBtn = document.querySelector('.comment-post-btn');

    if (commentInput && commentPostBtn) {
        commentInput.addEventListener('input', (e) => {
            if (e.target.value.trim().length > 0) {
                commentPostBtn.disabled = false;
                commentPostBtn.style.opacity = '1';
            } else {
                commentPostBtn.disabled = true;
                commentPostBtn.style.opacity = '0.5';
            }
        });
    }
});

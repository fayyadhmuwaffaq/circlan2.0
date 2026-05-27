// circlan_v2/js/create.js

document.addEventListener('DOMContentLoaded', () => {
    const btnPost = document.getElementById('toggle-post');
    const btnEvent = document.getElementById('toggle-event');
    const secPost = document.getElementById('section-post');
    const secEvent = document.getElementById('section-event');
    const mobileHeaderAction = document.querySelector('header .text-primary');

    if (btnPost && btnEvent) {
        btnPost.addEventListener('click', () => {
            btnPost.className = "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all bg-primary text-white shadow-md shadow-primary/20";
            btnEvent.className = "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all text-muted hover:text-dark";
            secPost.classList.remove('hidden');
            secEvent.classList.add('hidden');
            if (mobileHeaderAction) mobileHeaderAction.innerText = "Post";
        });

        btnEvent.addEventListener('click', () => {
            btnEvent.className = "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all bg-primary text-white shadow-md shadow-primary/20";
            btnPost.className = "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all text-muted hover:text-dark";
            secEvent.classList.remove('hidden');
            secPost.classList.add('hidden');
            if (mobileHeaderAction) mobileHeaderAction.innerText = "Create";
        });
    }
});

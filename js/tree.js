// circlan_v2/js/tree.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA DEFINITION (Closer spacing for consistency)
    const FAMILY_DATA = [
        // LEVEL 1: Grandparents (Paternal)
        { id: 101, name: "Ahmad", gender: "male", isDeceased: true, level: 1, pos: { x: -220, y: -250 } },
        { id: 102, name: "Siti", gender: "female", isDeceased: true, level: 1, pos: { x: -60, y: -250 }, spouse: 101 },
        
        // LEVEL 1: Grandparents (Maternal)
        { id: 103, name: "Yusuf", gender: "male", isDeceased: false, level: 1, pos: { x: 60, y: -250 } },
        { id: 104, name: "Aminah", gender: "female", isDeceased: true, level: 1, pos: { x: 220, y: -250 }, spouse: 103 },
        
        // LEVEL 2: Parents (Gap reduced to 160)
        { id: 201, name: "Budi (Ayah)", gender: "male", isDeceased: false, level: 2, pos: { x: -80, y: 0 }, parents: [101, 102] },
        { id: 202, name: "Wati (Ibu)", gender: "female", isDeceased: false, level: 2, pos: { x: 80, y: 0 }, parents: [103, 104], spouse: 201 },
        
        // LEVEL 3: Self, Spouse, Siblings
        { id: 1, name: "Fayyadh (Anda)", gender: "male", isDeceased: false, level: 3, pos: { x: -60, y: 250 }, parents: [201, 202] },
        { id: 2, name: "Sarah (Pasangan)", gender: "female", isDeceased: false, level: 3, pos: { x: 60, y: 250 }, spouse: 1 },
        { id: 3, name: "Adit (Adik)", gender: "male", isDeceased: false, level: 3, pos: { x: -220, y: 250 }, parents: [201, 202] }
    ];

    const canvas = document.getElementById('tree-canvas');
    const nodesLayer = document.getElementById('nodes-layer');
    const linesLayer = document.getElementById('lines-layer');
    const modal = document.getElementById('member-modal');
    
    const centerX = 1000;
    const centerY = 1000;

    let activeParentId = 201; // Initially focus on Paternal branch (Ayah)

    // 2. RENDERING LOGIC
    function renderTree() {
        nodesLayer.innerHTML = '';
        linesLayer.innerHTML = '';

        const visibleIds = new Set([1, 2, 3, 201, 202]); 
        
        const activeParent = FAMILY_DATA.find(f => f.id === activeParentId);
        if (activeParent && activeParent.parents) {
            activeParent.parents.forEach(id => visibleIds.add(id));
        }

        const visibleNodes = FAMILY_DATA.filter(member => visibleIds.has(member.id));

        visibleNodes.forEach(member => {
            if (member.parents) {
                const p1 = FAMILY_DATA.find(f => f.id === member.parents[0]);
                const p2 = FAMILY_DATA.find(f => f.id === member.parents[1]);
                
                if (p1 && p2 && visibleIds.has(p1.id) && visibleIds.has(p2.id)) {
                    const midX = (p1.pos.x + p2.pos.x) / 2 + centerX;
                    const midY = (p1.pos.y + p2.pos.y) / 2 + centerY;
                    const childX = member.pos.x + centerX;
                    const childY = member.pos.y + centerY;
                    createLine(midX, midY, childX, childY, false);
                }
            }

            if (member.spouse) {
                const partner = FAMILY_DATA.find(f => f.id === member.spouse);
                if (partner && visibleIds.has(partner.id)) {
                    createLine(member.pos.x + centerX, member.pos.y + centerY, partner.pos.x + centerX, partner.pos.y + centerY, true);
                }
            }
        });

        visibleNodes.forEach((member) => {
            const node = document.createElement('div');
            node.className = `absolute flex flex-col items-center cursor-pointer family-node z-10`;
            node.style.left = `${member.pos.x + centerX - 40}px`;
            node.style.top = `${member.pos.y + centerY - 40}px`;
            
            let borderColor = member.isDeceased ? 'border-gray-400' : (member.gender === 'male' ? 'border-blue-400' : 'border-pink-400');
            const isFocused = member.id === activeParentId;
            const extraClasses = isFocused ? 'ring-4 ring-primary ring-offset-4 ring-offset-transparent' : '';

            node.innerHTML = `
                <div class="relative group">
                    <div class="w-20 h-20 rounded-full border-4 ${borderColor} bg-white p-1 shadow-lg transition-all group-hover:scale-105 ${extraClasses}">
                        <img src="images/stories/small/pic${(member.id % 8) + 1}.jpg" class="w-full h-full object-cover rounded-full">
                    </div>
                    ${member.isDeceased ? '<div class="absolute -top-1 -right-1 bg-gray-400 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">ALM</div>' : ''}
                    ${member.parents && !visibleIds.has(member.parents[0]) ? '<div class="absolute -top-1 -left-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md animate-bounce"><i class="fa-solid fa-chevron-up"></i></div>' : ''}
                </div>
                <span class="mt-2 text-[11px] font-bold text-dark bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm whitespace-nowrap">${member.name}</span>
            `;

            node.addEventListener('click', (e) => {
                e.stopPropagation();
                if (member.parents) {
                    activeParentId = member.id;
                    renderTree();
                } else {
                    showMemberInfo(member);
                }
            });

            nodesLayer.appendChild(node);
        });

        gsap.from(".family-node", { duration: 0.5, opacity: 0, scale: 0.5, stagger: 0.05, ease: "back.out(1.5)" });
        gsap.from(".family-line", { duration: 1, opacity: 0, stagger: 0.05, delay: 0.2 });
    }

    function createLine(x1, y1, x2, y2, isSpouse = false) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let d;
        if (isSpouse) {
            d = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
            const splitY = y1 + (y2 - y1) * 0.7; 
            d = `M ${x1} ${y1} L ${x1} ${splitY} L ${x2} ${splitY} L ${x2} ${y2}`;
        }
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#D9A05B");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", "0.6");
        path.classList.add("family-line");
        linesLayer.appendChild(path);
    }

    const Panzoom = window.Panzoom;
    const panzoomInstance = Panzoom(canvas, {
        maxScale: 3,
        minScale: 0.3,
        contain: 'outside',
        startScale: 0.8
    });

    canvas.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);

    setTimeout(() => {
        const viewportWidth = document.getElementById('tree-viewport').clientWidth;
        const viewportHeight = document.getElementById('tree-viewport').clientHeight;
        panzoomInstance.pan(-(2000 - viewportWidth) / 2, -(2000 - viewportHeight) / 2);
    }, 100);

    function showMemberInfo(member) {
        if (!modal) return;
        document.getElementById('modal-name').innerText = member.name;
        document.getElementById('modal-gender').innerText = member.gender === 'male' ? 'Laki-laki' : 'Perempuan';
        document.getElementById('modal-status').innerText = member.isDeceased ? 'Wafat (Almarhum)' : 'Sehat Walafiat';
        modal.classList.remove('hidden');
        gsap.fromTo(modal.querySelector('.modal-content'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
    }

    window.closeModal = () => {
        gsap.to(modal.querySelector('.modal-content'), { y: 50, opacity: 0, duration: 0.3, onComplete: () => modal.classList.add('hidden') });
    };

    renderTree();
});

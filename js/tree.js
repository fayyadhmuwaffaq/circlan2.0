// circlan_v2/js/tree.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. DATA DEFINITION (Uniform Spacing: 140px gap between nodes)
  const centerX = 1500;
  const centerY = 1500;

  // New Rule: All adjacent nodes on same level must have exactly 140px horizontal gap
  const FAMILY_DATA = [
    // LEVEL -2: Grandparents
    // Paternal MidX = -140
    { id: 101, name: "Kakek Paternal", gender: "male", isDeceased: true, level: -2, pos: { x: -210, y: -340 }, isBlood: true },
    { id: 102, name: "Nenek Paternal", gender: "female", isDeceased: true, level: -2, pos: { x: -70, y: -340 }, spouseId: 101 },

    // Maternal MidX = 140
    { id: 103, name: "Kakek Maternal", gender: "male", isDeceased: false, level: -2, pos: { x: 70, y: -340 }, isBlood: true },
    { id: 104, name: "Nenek Maternal", gender: "female", isDeceased: true, level: -2, pos: { x: 210, y: -340 }, spouseId: 103 },

    // LEVEL -1: Parents
    // MidX = 0
    { id: 201, name: "Budi (Ayah)", gender: "male", isDeceased: false, level: -1, pos: { x: -140, y: -170 }, parents: [101, 102], isBlood: true },
    { id: 202, name: "Wati (Ibu)", gender: "female", isDeceased: false, level: -1, pos: { x: 140, y: -170 }, parents: [103, 104], spouseId: 201 },

    // LEVEL 0: Center
    // Sibling (Adit) at -140, Self at 0, Spouse at 140
    { id: 1, name: "Fayyadh (Anda)", gender: "male", isDeceased: false, level: 0, pos: { x: 0, y: 0 }, parents: [201, 202], isMe: true, isBlood: true },
    { id: 2, name: "Sarah (Istri)", gender: "female", isDeceased: false, level: 0, pos: { x: 140, y: 0 }, spouseId: 1 },
    { id: 3, name: "Adit (Adik)", gender: "male", isDeceased: false, level: 0, pos: { x: -140, y: 0 }, parents: [201, 202], isBlood: true },

    // LEVEL 1: Children
    // MidX of Parents (1&2) = 70
    { id: 301, name: "Rian (Anak)", gender: "male", isDeceased: false, level: 1, pos: { x: 0, y: 170 }, parents: [1, 2], isBlood: true },
    { id: 302, name: "Siska (Menantu)", gender: "female", isDeceased: false, level: 1, pos: { x: 140, y: 170 }, spouseId: 301 },

    // LEVEL 2: Grandchildren
    // MidX of Parents (301&302) = 70
    { id: 401, name: "Cucu 1", gender: "male", isDeceased: false, level: 2, pos: { x: 70, y: 340 }, parents: [301, 302], isBlood: true },
  ];

  const canvas = document.getElementById("tree-canvas");
  const nodesLayer = document.getElementById("nodes-layer");
  const linesLayer = document.getElementById("lines-layer");
  const modal = document.getElementById("member-modal");

  linesLayer.setAttribute("viewBox", "0 0 3000 3000");

  function renderTree() {
    nodesLayer.innerHTML = "";
    linesLayer.innerHTML = "";

    FAMILY_DATA.forEach((member) => {
      if (member.spouseId) {
        const partner = FAMILY_DATA.find((f) => f.id === member.spouseId);
        if (partner) {
          createLine(member.pos.x + centerX, member.pos.y + centerY, partner.pos.x + centerX, partner.pos.y + centerY, true);
        }
      }

      if (member.parents) {
        const p1 = FAMILY_DATA.find((f) => f.id === member.parents[0]);
        const p2 = FAMILY_DATA.find((f) => f.id === member.parents[1]);
        if (p1 && p2) {
          const midX = (p1.pos.x + p2.pos.x) / 2 + centerX;
          const midY = (p1.pos.y + p2.pos.y) / 2 + centerY;
          const childX = member.pos.x + centerX;
          const childY = member.pos.y + centerY;
          createLine(midX, midY, childX, childY, false);
        }
      }
    });

    FAMILY_DATA.forEach((member) => {
      const node = document.createElement("div");
      node.className = `absolute flex flex-col items-center cursor-pointer family-node opacity-0 scale-50 z-10`;
      node.style.left = `${member.pos.x + centerX - 40}px`;
      node.style.top = `${member.pos.y + centerY - 40}px`;

      let borderColor = member.isDeceased ? "border-gray-400" : member.gender === "male" ? "border-blue-400" : "border-pink-400";
      const isMeClass = member.isMe ? "ring-4 ring-primary ring-offset-4 ring-offset-transparent shadow-[0_0_20px_rgba(217,160,91,0.4)]" : "";

      node.innerHTML = `
                <div class="relative group">
                    <div class="w-20 h-20 rounded-full border-4 ${borderColor} bg-white p-1 shadow-lg transition-all group-hover:scale-105 ${isMeClass}">
                        <img src="images/stories/small/pic${(member.id % 8) + 1}.jpg" class="w-full h-full object-cover rounded-full">
                    </div>
                    ${member.isDeceased ? '<div class="absolute -top-1 -right-1 bg-gray-400 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">ALM</div>' : ""}
                </div>
                <div class="mt-2 flex flex-col items-center">
                    <span class="text-[11px] font-bold text-dark bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm whitespace-nowrap">${member.name}</span>
                </div>
            `;

      node.addEventListener("click", () => showMemberInfo(member));
      nodesLayer.appendChild(node);
    });

    gsap.to(".family-node", { duration: 0.6, opacity: 1, scale: 1, stagger: 0.05, ease: "back.out(1.5)" });
    gsap.from(".family-line", { duration: 1, opacity: 0, delay: 0.4 });
  }

  function createLine(x1, y1, x2, y2, isMarriage = false) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d;
    if (isMarriage) {
      d = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
      // Paten Geometry: splitY at 0.65 (35% vertical stems)
      const splitY = y1 + (y2 - y1) * 0.65; 
      d = `M ${x1} ${y1} L ${x1} ${splitY} L ${x2} ${splitY} L ${x2} ${y2}`;
    }
    path.setAttribute("d", d);
    path.setAttribute("stroke", "#D9A05B");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("opacity", "0.6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.classList.add("family-line");
    linesLayer.appendChild(path);
  }

  const panzoomInstance = Panzoom(canvas, { maxScale: 3, minScale: 0.2, contain: 'outside', startScale: 0.6 });
  canvas.parentElement.addEventListener("wheel", panzoomInstance.zoomWithWheel);
  document.getElementById("zoom-in").addEventListener("click", panzoomInstance.zoomIn);
  document.getElementById("zoom-out").addEventListener("click", panzoomInstance.zoomOut);

  setTimeout(() => {
    const viewportWidth = document.getElementById("tree-viewport").clientWidth;
    const viewportHeight = document.getElementById("tree-viewport").clientHeight;
    panzoomInstance.pan(-(centerX - viewportWidth / 2), -(centerY - viewportHeight / 2));
  }, 100);

  function showMemberInfo(member) {
    document.getElementById("modal-name").innerText = member.name;
    document.getElementById("modal-img").src = `images/stories/small/pic${(member.id % 8) + 1}.jpg`;
    const meActions = document.getElementById("is-me-actions");
    const otherActions = document.getElementById("is-other-actions");
    const badge = document.getElementById("modal-badge");
    if (member.isMe) {
      meActions.classList.remove("hidden");
      otherActions.classList.add("hidden");
      badge.innerText = "Profil Saya";
    } else {
      meActions.classList.add("hidden");
      otherActions.classList.remove("hidden");
      badge.innerText = "Direct Bloodline";
    }
    modal.classList.remove("hidden");
    gsap.fromTo(modal.querySelector(".modal-content"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
  }

  window.closeModal = () => {
    gsap.to(modal.querySelector(".modal-content"), { y: 50, opacity: 0, duration: 0.3, onComplete: () => modal.classList.add('hidden') });
  };

  renderTree();
});

export class UI {
  constructor() {
    this.avatarButton = document.getElementById("avatarSwitch");
    this.speedFill = document.getElementById("speedFill");
    this.exploreBubble = document.getElementById("exploreBubble");
    this.modal = document.getElementById("ruinModal");
    this.backdrop = document.getElementById("modalBackdrop");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalKicker = document.getElementById("modalKicker");
    this.modalIntro = document.getElementById("modalIntro");
    this.modalList = document.getElementById("modalList");
    this.modalClose = document.getElementById("modalClose");
  }

  setAvatar(type) {
    this.avatarButton.textContent = `Avatar: ${type === "jaguar" ? "Jaguar" : "Tortoise"}`;
  }

  setSpeedRatio(ratio) {
    this.speedFill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  }

  setBubble(visible, text) {
    if (visible) {
      this.exploreBubble.textContent = text;
      this.exploreBubble.classList.add("active");
    } else {
      this.exploreBubble.classList.remove("active");
    }
  }

  placeBubble(x, y) {
    this.exploreBubble.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -120%)`;
  }

  openRuin(ruin) {
    this.modalKicker.textContent = ruin.subtitle;
    this.modalTitle.textContent = ruin.title;
    this.modalIntro.textContent = ruin.intro;
    this.modalList.innerHTML = "";
    for (let i = 0; i < ruin.bullets.length; i += 1) {
      const li = document.createElement("li");
      li.textContent = ruin.bullets[i];
      this.modalList.appendChild(li);
    }
    this.modal.classList.add("open");
    this.backdrop.classList.add("open");
  }

  closeRuin() {
    this.modal.classList.remove("open");
    this.backdrop.classList.remove("open");
  }
}


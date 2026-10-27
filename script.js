// =====================================
// 1. ANIMASI SAAT SCROLL
// =====================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("show");
    });
}


// =====================================
// 2. ALBUM FOTO UKURAN BESAR
// =====================================

const galleryImages = Array.from(
    document.querySelectorAll(".gallery-image")
);

const lightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const closeLightboxButton = document.getElementById("closeLightbox");
const prevPhotoButton = document.getElementById("prevPhoto");
const nextPhotoButton = document.getElementById("nextPhoto");

let currentPhotoIndex = 0;
let previouslyFocusedElement = null;


// Membuka foto berdasarkan indeks

function showPhoto(index) {
    if (galleryImages.length === 0) return;

    currentPhotoIndex =
        (index + galleryImages.length) % galleryImages.length;

    const selectedImage = galleryImages[currentPhotoIndex];
    const photoCard = selectedImage.closest(".photo-card");
    const caption = photoCard.querySelector("figcaption");

    lightboxImage.src = selectedImage.src;
    lightboxImage.alt = selectedImage.alt;
    lightboxCaption.textContent = caption
        ? caption.textContent
        : selectedImage.alt;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");

    closeLightboxButton.focus();
}


// Klik foto untuk memperbesar

galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => {
        previouslyFocusedElement = image;
        showPhoto(index);
    });

    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", "Perbesar " + image.alt);

    image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            previouslyFocusedElement = image;
            showPhoto(index);
        }
    });
});


// Tutup foto

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
}

closeLightboxButton.addEventListener("click", closeLightbox);


// Foto sebelumnya

prevPhotoButton.addEventListener("click", () => {
    showPhoto(currentPhotoIndex - 1);
});


// Foto berikutnya

nextPhotoButton.addEventListener("click", () => {
    showPhoto(currentPhotoIndex + 1);
});


// Klik area gelap untuk menutup

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});


// Navigasi dengan keyboard

document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPhoto(currentPhotoIndex - 1);
    }

    if (event.key === "ArrowRight") {
        showPhoto(currentPhotoIndex + 1);
    }
});


// =====================================
// 3. PEMUTAR MUSIK
// =====================================

const audio = document.getElementById("audioPlayer");

const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const muteButton = document.getElementById("muteButton");

const progressBar = document.getElementById("progressBar");

const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

const musicDisc = document.getElementById("musicDisc");


// Mengubah detik menjadi menit:detik

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}


// Tombol play dan pause

playButton.addEventListener("click", async () => {
    if (audio.paused) {
        try {
            await audio.play();
        } catch (error) {
            console.error("Lagu gagal diputar:", error);

            alert(
                "Lagu belum bisa diputar. Pastikan file lagu.mp3 ada di folder website."
            );
        }
    } else {
        audio.pause();
    }
});


// Mengubah ikon sesuai status lagu

audio.addEventListener("play", () => {
    playButton.textContent = "❚❚";
    playButton.setAttribute("aria-label", "Jeda lagu");
    musicDisc.classList.add("playing");
});

audio.addEventListener("pause", () => {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Putar lagu");
    musicDisc.classList.remove("playing");
});


// Menampilkan durasi lagu

audio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(audio.duration);
});


// Memperbarui progress bar

audio.addEventListener("timeupdate", () => {
    currentTimeDisplay.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progressBar.value =
            (audio.currentTime / audio.duration) * 100;
    }
});


// Menggeser posisi lagu

progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (progressBar.value / 100) * audio.duration;
    }
});


// Memutar lagu dari awal

restartButton.addEventListener("click", async () => {
    audio.currentTime = 0;

    try {
        await audio.play();
    } catch (error) {
        console.error("Lagu gagal diputar:", error);
    }
});


// Tombol mute dan unmute

muteButton.addEventListener("click", () => {
    audio.muted = !audio.muted;

    muteButton.textContent = audio.muted ? "🔇" : "♫";

    muteButton.setAttribute(
        "aria-label",
        audio.muted ? "Nyalakan suara" : "Bisukan suara"
    );
});


// Ketika lagu selesai

audio.addEventListener("ended", () => {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Putar lagu");

    musicDisc.classList.remove("playing");

    progressBar.value = 0;
    currentTimeDisplay.textContent = "0:00";
});
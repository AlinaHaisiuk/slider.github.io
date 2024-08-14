function initSlider() {
  const imageList = document.querySelector(".slider-wrapper .image-list");
  const slideButtons = document.querySelectorAll(
    ".slider-wrapper .slide-button"
  );
  const sliderScrollbar = document.querySelector(
    ".container .slider-scrollbar"
  );
  const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
  const indicators = document.querySelectorAll(".slider-indicator");
  const pauseButton = document.querySelector("#pause-slide");
  const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
  const autoScrollInterval = 1000;
  let autoScroll = true;
  let autoScrollTimer;

  const startAutoScroll = () => {
    autoScrollTimer = setInterval(() => {
      if (autoScroll) {
        const nextSlide = imageList.scrollLeft + imageList.clientWidth;
        if (nextSlide >= maxScrollLeft) {
          imageList.scrollLeft = 0;
        } else {
          imageList.scrollBy({
            left: imageList.clientWidth,
            behavior: "smooth",
          });
        }
      }
    }, autoScrollInterval);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollTimer);
  };

  scrollbarThumb.addEventListener("mousedown", (e) => {
    stopAutoScroll();
    const startX = e.clientX;
    const thumbPosition = scrollbarThumb.offsetLeft;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newThumbPosition = thumbPosition + deltaX;
      const maxThumbPosition =
        sliderScrollbar.getBoundingClientRect().width -
        scrollbarThumb.offsetWidth;
      const boundedPosition = Math.max(
        0,
        Math.min(maxThumbPosition, newThumbPosition)
      );
      const scrollPosition =
        (boundedPosition / maxThumbPosition) * maxScrollLeft;

      scrollbarThumb.style.left = `${boundedPosition}px`;
      imageList.scrollLeft = scrollPosition;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      startAutoScroll();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  slideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      stopAutoScroll();
      const direction = button.id === "prev-slide" ? -1 : 1;
      const scrollAmount = imageList.clientWidth * direction;
      imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
      startAutoScroll();
    });
  });

  const handleSlideButtons = () => {
    slideButtons[0].style.display =
      imageList.scrollLeft <= 0 ? "none" : "block";
    slideButtons[1].style.display =
      imageList.scrollLeft >= maxScrollLeft ? "none" : "block";
  };

  const updateScrollThumbPosition = () => {
    const scrollPosition = imageList.scrollLeft;
    const thumbPosition =
      (scrollPosition / maxScrollLeft) *
      (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
    scrollbarThumb.style.left = `${thumbPosition}px`;
  };

  imageList.addEventListener("scroll", () => {
    handleSlideButtons();
    updateScrollThumbPosition();
  });

  pauseButton.addEventListener("click", () => {
    autoScroll = !autoScroll;
    pauseButton.textContent = autoScroll ? "Pause" : "Play";
    if (autoScroll) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      stopAutoScroll();
      imageList.scrollBy({ left: -imageList.clientWidth, behavior: "smooth" });
      startAutoScroll();
    } else if (e.key === "ArrowRight") {
      stopAutoScroll();
      imageList.scrollBy({ left: imageList.clientWidth, behavior: "smooth" });
      startAutoScroll();
    }
  });

  let startX = 0;

  imageList.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopAutoScroll();
  });

  imageList.addEventListener("touchmove", (e) => {
    const deltaX = e.touches[0].clientX - startX;
    imageList.scrollBy({ left: -deltaX, behavior: "smooth" });
    startX = e.touches[0].clientX;
  });

  imageList.addEventListener("touchend", () => {
    startAutoScroll();
  });

  imageList.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    stopAutoScroll();
  });

  imageList.addEventListener("mousemove", (e) => {
    if (e.buttons > 0) {
      const deltaX = e.clientX - startX;
      imageList.scrollBy({ left: -deltaX, behavior: "smooth" });
      startX = e.clientX;
    }
  });

  imageList.addEventListener("mouseup", () => {
    startAutoScroll();
  });

  imageList.addEventListener("mouseleave", () => {
    startAutoScroll();
  });

  startAutoScroll();
}

window.addEventListener("load", initSlider);

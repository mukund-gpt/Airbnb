// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Mouse scroll in Filter
document.addEventListener("DOMContentLoaded", () => {
  const filtersContainer = document.querySelector(".filters");
  let isDown = false;
  let startX;
  let scrollLeft;

  // Mouse events
  filtersContainer.addEventListener("mousedown", (e) => {
    isDown = true;
    filtersContainer.classList.add("active");
    startX = e.pageX - filtersContainer.offsetLeft;
    scrollLeft = filtersContainer.scrollLeft;
  });

  filtersContainer.addEventListener("mouseleave", () => {
    isDown = false;
    filtersContainer.classList.remove("active");
  });

  filtersContainer.addEventListener("mouseup", () => {
    isDown = false;
    filtersContainer.classList.remove("active");
  });

  filtersContainer.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - filtersContainer.offsetLeft;
    const walk = (x - startX) * 3; // Adjust the multiplier to control the scroll speed
    filtersContainer.scrollLeft = scrollLeft - walk;
  });

  // Touch events
  filtersContainer.addEventListener("touchstart", (e) => {
    isDown = true;
    filtersContainer.classList.add("active");
    startX = e.touches[0].pageX - filtersContainer.offsetLeft;
    scrollLeft = filtersContainer.scrollLeft;
  });

  filtersContainer.addEventListener("touchend", () => {
    isDown = false;
    filtersContainer.classList.remove("active");
  });

  filtersContainer.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - filtersContainer.offsetLeft;
    const walk = (x - startX) * 3; // Adjust the multiplier to control the scroll speed
    filtersContainer.scrollLeft = scrollLeft - walk;
  });
});

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

const filtersContainer = document.querySelector('.filters');

let isDown = false;
let startX;
let scrollLeft;

filtersContainer.addEventListener('mousedown', (e) => {
  isDown = true;
  filtersContainer.classList.add('active');
  startX = e.pageX - filtersContainer.offsetLeft;
  scrollLeft = filtersContainer.scrollLeft;
});

filtersContainer.addEventListener('mouseleave', () => {
  isDown = false;
  filtersContainer.classList.remove('active');
});

filtersContainer.addEventListener('mouseup', () => {
  isDown = false;
  filtersContainer.classList.remove('active');
});

filtersContainer.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - filtersContainer.offsetLeft;
  const walk = (x - startX) * 3; // The multiplier can be adjusted to control the scroll speed
  filtersContainer.scrollLeft = scrollLeft - walk;
});

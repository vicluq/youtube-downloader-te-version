const vid_format_buts = document.querySelectorAll(".video-format");
const formatInput = document.querySelector("#format-input");
const mp4Select = document.querySelector("#field-mp4");
const webmSelect = document.querySelector("#field-webm");

vid_format_buts.forEach((button) => {
  button.onclick = function (e) {
    formatInput.value = button.getAttribute("format");

    vid_format_buts.forEach((button) => {
      if (formatInput.value === button.getAttribute("format")) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });

    if(formatInput.value === 'mp4') {
        mp4Select.classList.remove('disabled')
        webmSelect.classList.add('disabled')
    } else if(formatInput.value === 'webm') {
        mp4Select.classList.add('disabled')
        webmSelect.classList.remove('disabled');
    }
  };
});

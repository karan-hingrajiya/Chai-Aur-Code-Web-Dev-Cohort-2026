const btn = document.getElementById("toggleButton");

btn.addEventListener("click", () => {
  let currStatus = document.body.classList.toggle("dark");
  if (currStatus) {
    btn.innerText = "Switch To Light Mode";
  } else {
    btn.innerText = "Switch To Dark Mode";
  }
});
//assignment here

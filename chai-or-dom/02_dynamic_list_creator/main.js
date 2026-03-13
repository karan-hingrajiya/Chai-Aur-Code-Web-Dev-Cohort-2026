const input = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
// const buttonContainer = document.getElementsByClassName("btn-container");
addBtn.addEventListener("click", () => {
  if (input.value === "") {
    alert("Mat kr lala!");
    return;
  }

  const li = document.createElement("li");
  const textForli = document.createElement("span");
  const container = document.createElement("div");
  const delBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const saveBtn = document.createElement("button");

  delBtn.textContent = "Delete";
  editBtn.textContent = "Edit";
  saveBtn.textContent = "Save";

  container.classList.add("btncontainer");
  delBtn.classList.add("delete");
  editBtn.classList.add("edit");

  textForli.textContent = input.value;

  li.appendChild(textForli);

  delBtn.addEventListener("click", () => {
    li.remove();
  });

  //note : Using the contenteditable attribute it allow the user to click and type directly into the <li> element without changing the HTML structure it's use input field behind the scene.
  function enableEditMode() {
    textForli.contentEditable = true;
    textForli.classList.add("textEditable");
    textForli.focus();

    editBtn.remove();
    delBtn.remove();

    container.appendChild(saveBtn);
  }

  function disableEditMode() {
    textForli.contentEditable = false;
    textForli.classList.remove("textEditable");

    saveBtn.remove();

    container.appendChild(delBtn);
    container.appendChild(editBtn);
  }

  editBtn.addEventListener("click", enableEditMode);
  li.addEventListener("dblclick", enableEditMode);

  saveBtn.addEventListener("click", disableEditMode);

  container.appendChild(delBtn);
  container.appendChild(editBtn);

  li.appendChild(container);
  list.appendChild(li);

  input.value = "";
});

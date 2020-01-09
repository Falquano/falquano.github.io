function fillModel() {
  var divs = document.getElementsByClassName("content");
  var i = Math.floor(Math.random() * divs.length);
  divs[i].className = "content";
}

function toggleCommentBox() {
  var commentBox = document.getElementById("commentBox");

  // Toggle the display of the comment box
  commentBox.style.display = (commentBox.style.display === "none" || commentBox.style.display === "") ? "block" : "none";
}
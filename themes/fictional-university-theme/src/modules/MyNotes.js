import $ from "jquery";

class MyNotes {
  constructor() {
    this.events();
  }

  events() {
    $(".delete-note").on("click", this.deleteNote.bind(this));
    $(".edit-note").on("click", this.editNote.bind(this));
    $(".update-note").on("click", this.updateNote.bind(this));
  }

  deleteNote(event) {
    const targetNote = $(event.target).parents("li");
    const noteID = targetNote.data("id");
    const requestURL = `${universityData.root_url}/wp-json/wp/v2/note/${noteID}`;

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader("X-WP-Nonce", universityData.nonce);
      },
      url: requestURL,
      type: "DELETE",
      success: () => {
        targetNote.slideUp();
      },
      error: () => {
        alert("Error deleting note.");
      },
    });
  }

  editNote(event) {
    const targetNote = $(event.target).parents("li");

    if (targetNote.data("state") === "editable") {
      this.makeNoteReadonly(targetNote);
    } else {
      this.makeNoteEditable(targetNote);
    }
  }

  makeNoteEditable(note) {
    note.find(".edit-note").html(
      `
      <i class="fa fa-times" aria-hidden="true"></i>
      <span>Cancel</span>
      `
    );

    note
      .find(".note-title-field, .note-body-field")
      .removeAttr("readonly")
      .addClass("note-active-field");

    note.find(".update-note").addClass("update-note--visible");

    note.data("state", "editable");
  }

  makeNoteReadonly(note) {
    note.find(".edit-note").html(
      `
      <i class="fa fa-pencil" aria-hidden="true"></i>
      <span>Edit</span>
      `
    );

    note
      .find(".note-title-field, .note-body-field")
      .attr("readonly", "readonly")
      .removeClass("note-active-field");

    note.find(".update-note").removeClass("update-note--visible");

    note.data("state", "cancel");
  }

  updateNote(event) {
    const targetNote = $(event.target).parents("li");
    const noteID = targetNote.data("id");
    const requestURL = `${universityData.root_url}/wp-json/wp/v2/note/${noteID}`;

    const updatedNote = {
      title: targetNote.find(".note-title-field").val(),
      content: targetNote.find(".note-body-field").val(),
    };

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader("X-WP-Nonce", universityData.nonce);
      },
      url: requestURL,
      type: "POST",
      data: updatedNote,
      success: () => {
        this.makeNoteReadonly(targetNote);
      },
      error: () => {
        alert("Error updating note.");
      },
    });
  }
}

export default MyNotes;

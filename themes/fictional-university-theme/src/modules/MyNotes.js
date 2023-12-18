import $ from "jquery";

class MyNotes {
  constructor() {
    this.events();
  }

  events() {
    $("#my-notes").on("click", ".delete-note", this.deleteNote.bind(this));
    $("#my-notes").on("click", ".edit-note", this.editNote.bind(this));
    $("#my-notes").on("click", ".update-note", this.updateNote.bind(this));
    $(".submit-note").on("click", this.createNote.bind(this));
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

  createNote() {
    const titleField = $(".new-note-title");
    const bodyField = $(".new-note-body");
    const requestURL = `${universityData.root_url}/wp-json/wp/v2/note`;

    const newNote = {
      title: titleField.val(),
      content: bodyField.val(),
      status: "publish",
    };

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader("X-WP-Nonce", universityData.nonce);
      },
      url: requestURL,
      type: "POST",
      data: newNote,
      success: (response) => {
        titleField.val("");
        bodyField.val("");

        const newNoteHTML = `
        <li data-id="${response.id}">
            <input readonly class="note-title-field" type="text" value="${response.title.raw}" />

            <span class="edit-note">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                <span>Edit</span>
            </span>

            <span class="delete-note">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
                <span>Delete</span>
            </span>

            <textarea readonly class="note-body-field">${response.content.raw}</textarea>

            <span class="update-note btn btn--blue btn--small">
                <i class="fa fa-arrow-right" aria-hidden="true"></i>
                <span>Save</span>
            </span>
        </li>
        `;

        $(newNoteHTML).prependTo("#my-notes").hide().slideDown();
      },
      error: () => {
        alert("Error creating note.");
      },
    });
  }
}

export default MyNotes;

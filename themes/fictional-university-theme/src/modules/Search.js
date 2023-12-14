import $ from "jquery";

class Search {
  constructor() {
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.bodyElement = $("body");
    this.searchField = $("#search-term");
    this.resultsElement = $("#search-overlay__results");

    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.typingTimer = null;
    this.previousValue = "";

    this.events();
  }

  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keyup", this.keyPressDispatcher.bind(this));
    this.searchField.on("keyup", this.typingLogic.bind(this));
  }

  typingLogic() {
    const currentValue = this.searchField.val();

    if (currentValue === this.previousValue) {
      return;
    }

    if (!currentValue) {
      this.resultsElement.html("");
      this.previousValue = currentValue;
      this.isSpinnerVisible = false;
      return;
    }

    clearTimeout(this.typingTimer);

    if (!this.isSpinnerVisible) {
      this.resultsElement.html('<div class="spinner-loader"></div>');
      this.isSpinnerVisible = true;
    }

    this.typingTimer = setTimeout(this.getResults.bind(this), 2000);
    this.previousValue = currentValue;
  }

  getResults() {
    this.isSpinnerVisible = false;
    this.resultsElement.html("Imagine real search results here.");
  }

  keyPressDispatcher(event) {
    if (
      event.keyCode == 83 &&
      !this.isOverlayOpen &&
      !$("input, textarea").is(":focus")
    ) {
      this.openOverlay();
    }

    if (event.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }

  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    this.bodyElement.addClass("body-no-scroll");
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    this.bodyElement.removeClass("body-no-scroll");
    this.isOverlayOpen = false;
  }
}

export default Search;

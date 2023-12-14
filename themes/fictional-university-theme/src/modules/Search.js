import $ from "jquery";

class Search {
  constructor() {
    this.addSearchHTML();

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
    const currentValue = this.searchField.val().trim();

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

    this.typingTimer = setTimeout(this.getResults.bind(this), 750);
    this.previousValue = currentValue;
  }

  getResults() {
    // this.isSpinnerVisible = false;
    // this.resultsElement.html("Imagine real search results here.");

    const searchValue = this.searchField.val().trim();
    const postsRequest = $.getJSON(
      `${universityData.root_url}/wp-json/wp/v2/posts?search=${searchValue}`
    );
    const pagesRequest = $.getJSON(
      `${universityData.root_url}/wp-json/wp/v2/pages?search=${searchValue}`
    );

    const onDone = (posts, pages) => {
      const combinedResults = posts[0].concat(pages[0]);

      const items = combinedResults
        .map((item) => {
          return `
          <li>
            <a href="${item.link}">${item.title.rendered}</a>
            ${item.type === "post" ? `by ${item.authorName}` : ""}
          </li>
          `.trim();
        })
        .join("");

      const html = `
          <h2 class="search-overlay__section-title">General Information</h2>
          ${
            combinedResults.length
              ? `<ul class="link-list min-list">${items}</ul>`
              : "<p>No general information matches your search.</p>"
          }
        `;

      this.resultsElement.html(html);
      this.isSpinnerVisible = false;
    };

    const onError = () => {
      this.resultsElement.html(
        "<p>Unexpected error happened, please try again later.</p>"
      );
    };

    $.when(postsRequest, pagesRequest).then(onDone, onError);
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
    this.searchField.val("");
    this.resultsElement.html("");
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    this.bodyElement.removeClass("body-no-scroll");
    this.isOverlayOpen = false;
  }

  addSearchHTML() {
    $("body").append(`
      <div class="search-overlay">
        <div class="search-overlay__top">
            <div class="container">
                <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term" autocomplete="off" />
                <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
            </div>
        </div>

        <div class="container">
            <div id="search-overlay__results"></div>
        </div>
    </div>
    `);
  }
}

export default Search;

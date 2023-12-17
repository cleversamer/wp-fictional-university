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
    const searchValue = this.searchField.val().trim();
    const searchURL = `${universityData.root_url}/wp-json/university/v1/search?term=${searchValue}`;

    $.getJSON(searchURL, (data) => {
      const { generalInfo, professors, programs, campuses, events } = data;

      const html = `
      <div class="row">
        <div class="one-third">
          <h2 class="search-overlay__section-title">General Information</h2>
          ${
            generalInfo.length
              ? `<ul class="link-list min-list">
              ${generalInfo
                .map(({ title, permalink, postType, authorName }) =>
                  `<li>
                      <a href="${permalink}">${title}</a>
                      ${postType === "post" ? `by ${authorName}` : ""}
                    </li>
                  `.trim()
                )
                .join("")}
                  </ul>`.trim()
              : "<p>No general information matches that search.</p>"
          }
        </div>
        
        <div class="one-third">
          <h2 class="search-overlay__section-title">Programs</h2>
          ${
            programs.length
              ? `<ul class="link-list min-list">
              ${programs
                .map(({ title, permalink }) =>
                  `<li><a href="${permalink}">${title}</a></li>`.trim()
                )
                .join("")}
                  </ul>`.trim()
              : `<p>
                No programs match that search.
                <a href="${universityData.root_url}/programs">View all programs</a>
              </p>`
          }
          
          <h2 class="search-overlay__section-title">Professors</h2>
          ${
            professors.length
              ? `<ul class="professor-cards">
              ${professors
                .map(({ title, permalink, image }) =>
                  `
                  <li class="professor-card__list-item">
                      <a class="professor-card" href="${permalink}">
                          <img src="${image}" class="professor-card__image" />

                          <span class="professor-card__name">
                          ${title}
                          </span>
                      </a>
                  </li>
                  `.trim()
                )
                .join("")}
                  </ul>`.trim()
              : "<p>No professors match that search.</p>"
          }
        </div>
        
        <div class="one-third">
          <h2 class="search-overlay__section-title">Campuses</h2>
          ${
            campuses.length
              ? `<ul class="link-list min-list">
              ${campuses
                .map(({ title, permalink }) =>
                  `<li><a href="${permalink}">${title}</a></li>`.trim()
                )
                .join("")}
                  </ul>`.trim()
              : `<p>
              No campuses match that search.
              <a href="${universityData.root_url}/campuses">View all campuses</a>
            </p>`
          }

          <h2 class="search-overlay__section-title">Events</h2>
          ${
            events.length
              ? `${events
                  .map(({ title, permalink, month, day, description }) =>
                    `
                    <div class="event-summary">
                        <a class="event-summary__date t-center" href="${permalink}">
                            <span class="event-summary__month">${month}</span>
                            <span class="event-summary__day">${day}</span>
                        </a>
                    
                        <div class="event-summary__content">
                            <h5 class="event-summary__title headline headline--tiny">
                                <a href="${permalink}">${title}</a>
                            </h5>
                    
                            <p>
                                ${description}
                                <a href="${permalink}" class="nu gray">Learn more</a>
                            </p>
                        </div>
                    </div>
                  `.trim()
                  )
                  .join("")}
                `.trim()
              : `<p>
              No events match that search.
              <a href="${universityData.root_url}/events">View all events</a>
            </p>`
          }
        </div>
      </div>
      `;

      this.resultsElement.html(html);
      this.isSpinnerVisible = false;
    });
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

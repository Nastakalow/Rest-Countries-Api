$(document).ready(function () {
  const queryURL = "https://restcountries.com/v3.1";

  $("#darkMode").on("click", () => {
    $(document.body).toggleClass("light-theme");
    if ($("#moonIcon").attr("name") == "moon") {
      $("#moonIcon").attr("name", "moon-outline");
    } else {
      $("#moonIcon").attr("name", "moon");
    }
  });

  $("#selectTitle").on("click", () => {
    $("#selectSubtitle").toggleClass("hidden");
  });

  function createCountryCard(
    countryImage,
    countryImageName,
    countryName,
    countryPopulation,
    countryRegion,
    countryCapital
  ) {
    return `<div class="country-container">
        <img
          class="flag-img"
          src="${countryImage}"
          alt="${countryImageName}Image"
        />
        <div class="country-content">
          <div class="country-title">
            <h2>${countryName}</h2>
          </div>
          <div class="country-info">
            <ul>
              <li>Population: <span>${countryPopulation}</span></li>
              <li>Region: <span>${countryRegion}</span></li>
              <li>Capital: <span>${countryCapital}</span></li>
            </ul>
          </div>
        </div>
      </div>`;
  }

  function getApiData(params) {
    $.ajax({
      url: queryURL + params,
      error: function () {
        let thrownErrorMsg = `<strong class="not-found">Sorry! No result found :( <span>We can't find any item matching your search</span></strong>`; // Create with DOM
        $(".section").append(thrownErrorMsg);
      },
    }).then((res) => {
      $(".not-found").remove();
      for (const country of res) {
        let countryCard = createCountryCard(
          country.flags.png,
          country.name.common,
          country.name.common,
          country.population,
          country.region,
          country.capital
        );
        $(".home-main").append(countryCard);
      }
    });
  }

  getApiData("/all");

  $(".select-region").on("click", function () {
    getApiData("/region/" + $(this).text().trim());

    $("#selectSubtitle").addClass("hidden");
    $("#selectTitle").html(
      $(this).text() + `<ion-icon name="chevron-down-outline"></ion-icon>`
    );
    $(".home-main").empty();
  });

  $("#searchButton").on("click", function (e) {
    if (!$("#searchInput").val().trim()) {
      return;
    }

    let countryName = $("#searchInput").val();
    getApiData("/name/" + countryName);
    $("#selectTitle").html(
      `Filter by Region <ion-icon name="chevron-down-outline"></ion-icon>`
    );
    $(".home-main").empty();
  });

  $("#searchInput").on("keypress", function (e) {
    if (!$("#searchInput").val().trim()) {
      return;
    }
    if (e.keyCode == 13) {
      let countryName = $("#searchInput").val();
      getApiData("/name/" + countryName);
      $("#selectTitle").html(
        `Filter by Region <ion-icon name="chevron-down-outline"></ion-icon>`
      );
      $(".home-main").empty();
    }
  });

  $(".logo").on("click", function () {
    getApiData("/all");
    $(".home-main").empty();

    $(".section-home").removeClass("hidden");
    $(".section-detail").addClass("hidden");
  });

  $(document).on("click", ".country-container", function () {
    $(".section-home").addClass("hidden");
    $(".section-detail").removeClass("hidden");
  });

  $("#backBtn").on("click", function () {
    $(".section-home").removeClass("hidden");
    $(".section-detail").addClass("hidden");
  });
});

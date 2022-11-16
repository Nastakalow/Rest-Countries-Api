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
    $("#selectSubtitle").toggleClass("select-hidden");
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
    }).then((res) => {
      for (const country of res) {
        let countryCard = createCountryCard(
          country.flags.png,
          country.name.common,
          country.name.common,
          country.population,
          country.region,
          country.capital
        );
        $(".section-main").append(countryCard);
      }
    });
  }

  getApiData("/all");

  $(".select-region").on("click", function () {
    $("#selectSubtitle").addClass("select-hidden");
    getApiData("/region/" + $(this).text());
    $(".section-main").empty();
  });

  $("#searchButton").on("click", function (e) {
    let countryName = $("#searchInput").val();
    getApiData("/name/" + countryName);
    $(".section-main").empty();
  });

  $("#searchInput").on("keypress", function (e) {
    if (e.keyCode == 13) {
      let countryName = $("#searchInput").val();
      getApiData("/name/" + countryName);
      $(".section-main").empty();
    }
  });
});

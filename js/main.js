$(document).ready(function () {
  const queryURL = "https://restcountries.com/v3.1";

  $("#darkMode").on("click", () => {
    $(document.body).toggleClass("light-theme");
    if ($("#moonIcon").attr("name") == "moon") {
      $("#moonIcon").attr("name", "sunny-outline");
      $("#darkMode p").text("Light Mode");
    } else {
      $("#moonIcon").attr("name", "moon");
      $("#darkMode p").text("Dark Mode");
    }
  });

  getApiData("/all");

  function createCountryCard(
    countryImage,
    countryImageName,
    countryName,
    countryPopulation,
    countryRegion,
    countryCapital
  ) {
    return `<div class="country-container" data-country-name="${countryName}">
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

  function getCountryDetail(
    name,
    flagImg,
    nativeName,
    population,
    region,
    subregion,
    capital,
    tld,
    currencies
  ) {
    return `    
      <img class="img-detail" src="${flagImg}" alt="${name}Image" />
      <div class="detail-content">
        <h2>${name}</h2>
        <div class="country-info">
          <ul>
            <li>Native Name: <span>${nativeName}</span></li>
            <li>Population: <span>${population}</span></li>
            <li>Region: <span>${region}</span></li>
            <li>Sub Region: <span>${subregion}</span></li>
            <li>Capital: <span>${capital}</span></li>
          </ul>
          <ul>
            <li>Top Level Domain: <span>${tld}</span></li>
            <li>Currencies: <span>${currencies}</span></li>
            <li>Languages: <span>France, English, Germany</span></li>
          </ul>
        </div>
        <div class="border-container">
          <h3>Border Countries:</h3>
          <div class="border-buttons">
            <button class="border-button">France</button>
            <button class="border-button">Germany</button>
            <button class="border-button">Netherlands</button>
          </div>
        </div>
      </div>
      `;
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
        if ($(".section-detail").attr("class") == "section-detail hidden") {
          let countryCard = createCountryCard(
            country.flags.png,
            country.name.common,
            country.name.common,
            country.population,
            country.region,
            country.capital
          );
          $(".home-main").append(countryCard);
        } else {
          for (const propName in country.name.nativeName) {
            if (propName) {
              var nativeName = country.name.nativeName[propName].common;
              break;
            }
          }

          for (const propName in country.currencies) {
            if (propName) {
              var currencies = country.currencies[propName].name;
              break;
            }
          }

          let countryDetail = getCountryDetail(
            country.name.common,
            country.flags.png,
            nativeName,
            country.population,
            country.region,
            country.subregion,
            country.capital,
            country.tld,
            currencies
          );
          $(".detail-container").append(countryDetail);
        }
      }
    });
  }

  $("#searchButton").on("click", function () {
    searchCountry();
  });

  $("#searchInput").on("keypress", function (e) {
    if (e.keyCode == 13) {
      searchCountry();
    }
  });

  function searchCountry() {
    if (!$("#searchInput").val().trim()) {
      return;
    }

    let countryName = $("#searchInput").val();
    getApiData("/name/" + countryName);
    $("#selectTitle").html(
      `Filter by Region <ion-icon name="chevron-down-outline"></ion-icon>`
    );
    $(".home-main").empty();
  }

  $("#selectTitle").on("click", () => {
    $("#selectSubtitle").toggleClass("hidden");
  });

  $(".select-region").on("click", function () {
    getApiData("/region/" + $(this).text().trim());

    $("#selectSubtitle").addClass("hidden");
    $("#selectTitle").html(
      $(this).text() + `<ion-icon name="chevron-down-outline"></ion-icon>`
    );
    $(".home-main").empty();
  });

  $(".logo").on("click", function () {
    getApiData("/all");
    $(".home-main").empty();
    $("#selectTitle").html(
      `Filter by Region <ion-icon name="chevron-down-outline"></ion-icon>`
    );

    $(".section-home").removeClass("hidden");
    $(".section-detail").addClass("hidden");
  });

  $(document).on("click", ".country-container", function () {
    $(".section-home").addClass("hidden");
    $(".section-detail").removeClass("hidden");
    $(".detail-container").empty();
    getApiData(`/name/${$(this).data("country-name")}`);
  });

  $("#backBtn").on("click", function () {
    $(".section-home").removeClass("hidden");
    $(".section-detail").addClass("hidden");
  });
});

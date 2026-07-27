(function () {
  "use strict";

  const properties = [
    {
      id: "esther-vargas",
      label: "Casa Esther Vargas",
      owner: "Esther Vargas Castillo",
      type: "Casa con patio amplio",
      floor: "Primer piso",
      neighborhood: "El Eden",
      coordinatesText: '0°44\'22.4"S 90°18\'38.0"W',
      coordinates: [-0.7395533323287964, -90.31056213378906],
      rooms: 3,
      baths: 3,
      outdoor: "Sí",
      living: "Sí",
      kitchen: "Sí",
      phone: "0999871439",
      price: 1500,
      negotiable: "Sí",
    },
    {
      id: "edgar-vargas",
      label: "Departamento Edgar Vargas",
      owner: "Edgar Vargas Castillo",
      type: "Departamento",
      floor: "Segundo piso",
      neighborhood: "El Eden",
      coordinatesText: '0°44\'22.2"S 90°18\'40.6"W',
      coordinates: [-0.7394863963127136, -90.311279296875],
      rooms: 1,
      baths: 2,
      outdoor: "No",
      living: "Sí",
      kitchen: "Sí",
      phone: "0999056779",
      price: 600,
      negotiable: "No",
    },
    {
      id: "gabriela-valderrama",
      label: "Casa Gabriela Valderrama",
      owner: "Gabriela Valderrama",
      type: "Casa",
      floor: "Dos Pisos",
      neighborhood: "Pelican Bay",
      coordinatesText: '0°44\'33.1"S 90°18\'43.6"W',
      coordinates: [-0.7425321936607361, -90.31210327148438],
      rooms: 4,
      baths: 3,
      outdoor: "No",
      living: "Sí",
      kitchen: "Sí",
      phone: "0987603929",
      price: 1500,
      negotiable: "Sí",
    },
    {
      id: "cristian-armas",
      label: "Departamento Cristian Armas",
      owner: "Cristian Armas Jaramillo",
      type: "Departamento",
      floor: "Tercer piso",
      neighborhood: "La Cascada",
      coordinatesText: '0°44\'06.3"S 90°18\'46.8"W',
      coordinates: [-0.7350444, -90.3130478],
      rooms: 3,
      baths: 3,
      outdoor: "No",
      living: "Sí",
      kitchen: "Sí",
      phone: "0939014900",
      price: 800,
      negotiable: "No",
    },
    {
      id: "byron-rueda",
      label: "Departamento Byron Rueda",
      owner: "Byron Rueda",
      type: "Departamento",
      floor: "Segundo piso",
      neighborhood: "Barrio Las Acacias",
      coordinatesText: '0°44\'35.9"S 90°18\'51.5"W',
      coordinates: [-0.7433120608329773, -90.3143081665039],
      rooms: 2,
      baths: 2.5,
      outdoor: "Sí",
      living: "No",
      kitchen: "Sí",
      phone: "0997519684",
      price: 950,
      negotiable: "Sí",
    },
  ];

  const images = window.PROPERTY_IMAGES;
  const money = new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  let selectedProperty = properties[0];
  let selectedCategory = "Todas";
  let photoIndex = 0;

  const get = (id) => document.getElementById(id);

  function currentPhotos() {
    const all = images[selectedProperty.id];
    return selectedCategory === "Todas"
      ? all
      : all.filter((photo) => photo.category === selectedCategory);
  }

  function renderSelector() {
    get("option-selector").innerHTML = properties
      .map(
        (property, index) => `
          <button
            class="${property.id === selectedProperty.id ? "active" : ""}"
            data-option="${property.id}"
            aria-pressed="${property.id === selectedProperty.id}"
          >
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${property.label}</strong>
            <small>${property.neighborhood} · ${money.format(property.price)}/mes</small>
          </button>`,
      )
      .join("");

    document.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => selectProperty(button.dataset.option));
    });
  }

  function selectProperty(id) {
    selectedProperty = properties.find((property) => property.id === id);
    selectedCategory = "Todas";
    photoIndex = 0;
    renderSelector();
    renderProperty();
  }

  function renderProperty() {
    const property = selectedProperty;
    get("property-type").textContent = property.type;
    get("property-name").textContent = property.label;
    get("property-owner").textContent = `Propietario/a: ${property.owner}`;
    get("property-price").textContent = money.format(property.price);
    get("property-negotiable").textContent =
      property.negotiable === "Sí" ? "Indicado como negociable" : "Indicado como no negociable";

    setText("fact-type", property.type);
    setText("fact-floor", property.floor);
    setText("fact-neighborhood", property.neighborhood);
    setText("fact-rooms", property.rooms);
    setText("fact-baths", property.baths);
    setText("fact-outdoor", property.outdoor);
    setText("fact-living", property.living);
    setText("fact-kitchen", property.kitchen);
    setText("fact-price", `${money.format(property.price)} mensuales`);
    setText("fact-negotiable", property.negotiable);
    get("fact-phone").textContent = property.phone;
    get("fact-phone").href = `tel:${property.phone}`;

    renderCategories();
    renderPhoto();
    renderMap();
  }

  function setText(id, value) {
    get(id).textContent = value;
  }

  function renderCategories() {
    const categories = [
      "Todas",
      ...new Set(images[selectedProperty.id].map((photo) => photo.category)),
    ];
    get("category-filter").innerHTML = categories
      .map(
        (category) => `
          <button
            class="${category === selectedCategory ? "active" : ""}"
            data-category="${category}"
          >${category}</button>`,
      )
      .join("");
    document.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        photoIndex = 0;
        renderCategories();
        renderPhoto();
      });
    });
  }

  function renderPhoto() {
    const photos = currentPhotos();
    const photo = photos[photoIndex];
    get("main-photo").src = photo.src;
    get("main-photo").alt = photo.alt;
    get("photo-caption").textContent = photo.category;
    get("photo-counter").textContent =
      `${photoIndex + 1} de ${photos.length} fotografías`;
    get("thumbnails").innerHTML = photos
      .map(
        (item, index) => `
          <button
            class="${index === photoIndex ? "active" : ""}"
            data-photo="${index}"
            aria-label="Ver fotografía ${index + 1}"
          ><img src="${item.src}" alt="" loading="lazy" /></button>`,
      )
      .join("");
    document.querySelectorAll("[data-photo]").forEach((button) => {
      button.addEventListener("click", () => {
        photoIndex = Number(button.dataset.photo);
        renderPhoto();
      });
    });
  }

  function movePhoto(direction) {
    const total = currentPhotos().length;
    photoIndex = (photoIndex + direction + total) % total;
    renderPhoto();
  }

  function renderMap() {
    const property = selectedProperty;
    const coordinates = property.coordinates.join(",");
    get("map-option").textContent = property.label;
    get("map-neighborhood").textContent = property.neighborhood;
    get("map-coordinates").textContent = property.coordinatesText;
    get("property-map").src =
      `https://www.google.com/maps?q=${coordinates}&z=17&output=embed`;
    get("open-map").href = `https://www.google.com/maps?q=${coordinates}`;
  }

  function renderComparison() {
    get("comparison-head").innerHTML = `
      <tr>
        <th scope="col">Campo</th>
        ${properties.map((property) => `<th scope="col">${property.label}</th>`).join("")}
      </tr>`;

    const rows = [
      ["Propietario/a", "owner"],
      ["Tipo de vivienda", "type"],
      ["Planta", "floor"],
      ["Barrio", "neighborhood"],
      ["Ubicación geográfica", "coordinatesText"],
      ["Habitaciones", "rooms"],
      ["Baños", "baths"],
      ["Espacios externos", "outdoor"],
      ["Sala", "living"],
      ["Cocina", "kitchen"],
      ["Teléfono", "phone"],
      ["Precio mensual", "price"],
      ["Negociable", "negotiable"],
    ];

    get("comparison-body").innerHTML = rows
      .map(
        ([label, key]) => `
          <tr>
            <th scope="row">${label}</th>
            ${properties
              .map((property) => {
                const value =
                  key === "price" ? money.format(property[key]) : property[key];
                return `<td>${value}</td>`;
              })
              .join("")}
          </tr>`,
      )
      .join("");
  }

  get("photo-prev").addEventListener("click", () => movePhoto(-1));
  get("photo-next").addEventListener("click", () => movePhoto(1));
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
  });

  renderSelector();
  renderProperty();
  renderComparison();
})();

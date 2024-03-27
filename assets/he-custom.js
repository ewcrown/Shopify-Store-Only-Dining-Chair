function removePopup() {
  const popup = document.getElementById("he-popup");
  if (popup) {
    popup.remove();
    document.body.classList.remove("overflow-hidden");
  }
}

function updatePrice(findCurrentProductId){
  const li = findCurrentProductId.closest('li')
  const checkbox = li.querySelector('.check-box-div input')
  const current_price = li.querySelector('.price__container .price-item--regular').textContent.replace(/[^\d.]/g, '')
  const sale_price = li.querySelector('.price__container .price-item--sale').textContent.replace(/[^\d.]/g, '')
  const update_price = li.querySelector('.total-price-display')
  let qty = li.querySelector('#bundleQuantity').value
  let total = 0

  if (checkbox.checked) {
    if (current_price === sale_price) {
      total = +current_price * qty
    } else {
      total = +sale_price * qty
    }

    // Update Total
    if (total > 0) {
      update_price.innerText = `$${total.toFixed(2)}`
      subtotal()
      return
    }

    update_price.innerText = ''
    subtotal()
  } else {
    update_price.innerText = ''
    qty = 0
    subtotal()
  }
}

function updateQty() {
  document.body.classList.remove("overflow-hidden");
  const findCurrentPopupId = document.querySelector(
    '#he-popup .hidden-block form input[name="product-id"]'
  ).value;
  
  const findCurrentPopupQty = document.querySelector("#product-prw-qty");
  const findCurrentProductId = document.querySelector(
    `.Complementary-li  .check-box-div[data-id="${findCurrentPopupId}"]`
  );
  
  const findCurrentProductQty = findCurrentProductId
    .closest("li")
    .querySelector('select[name="q"]');

  findCurrentProductQty.value = +findCurrentPopupQty.value;
  removePopup();
  updatePrice(findCurrentProductId);
  subtotal();
}

class Popup {
  constructor(event, url) {
    this.Event = event;
    this.Url = url;
  }

  getProductData() {
    document.body.classList.add("overflow-hidden");
    this.loader(true);
    fetch(this.Url)
      .then((resp) => resp.text())
      .then((data) => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, "text/html");
        const productWrap = htmlDocument.querySelector(
          ".product.product--small"
        );

        const product_title =
          productWrap.querySelector(".product__title h1").innerText;
        const price = productWrap.querySelector(
          ".price-inventory > .price"
        ).innerHTML;
        const description = htmlDocument.querySelector(
          "#tab2 .metafield-rich_text_field"
        ).innerHTML;
        const gallery = productWrap.querySelector(".product__media-wrapper");
        const form = productWrap.querySelector(".product-form");

        this.loader(false);
        this.createPopup(gallery, product_title, price, description, form);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }

  createPopup(gallery, product_title, price, description, form) {
    const div = document.createElement("div");
    div.className =
      "product product--small product--left product--thumbnail_slider product--mobile-hide grid grid--1-col grid--2-col-tablet he-popup";
    div.id = "he-popup";
    const template = `
                    <div class="product-ai">
                            <div class="cross-ai">
                                <button class="removeButton" onclick="removePopup()">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                                        id="Layer_1" x="0px" y="0px" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128;"
                                        xml:space="preserve">
                                        <g id="Layer_29">
                                            <path id="XMLID_365_"
                                                d="M123.7,0L64,59.9L4.1,0L0,4.1L59.7,64L0,123.9l4.1,4.1L64,68.1l59.7,59.9l4.3-4.1L68.1,64L128,4.1L123.7,0   z" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                            <div class="product-row-ai">
                                <div class="gallery-ai">
                                    ${gallery.innerHTML}
                                </div>
                                <div class="product-content-ai">
                                    <div class="product-name-ai">
                                        <h3>${product_title}</h3>
                                    </div>
                                    <div class="product-price-ai">
                                        ${price}
                                    </div>
                                    <div class="product-des-ai">
                                        <p>${description}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="btns-ai">
                                <div class="close-ai">
                                <button class="updateButton" onclick="updateQty()">Close</button>
                                </div>
                                <div class="side-ai">
                                    <div class="drop-down-ai">
                                        <select id="product-prw-qty">

                                            <option value="1" selected="selected">
                                                1 </option>
                                            <option value="2">
                                                2 </option>
                                            <option value="3">
                                                3 </option>
                                            <option value="4">
                                                4 </option>
                                            <option value="5">
                                                5 </option>
                                            <option value="6">
                                                6 </option>
                                        </select>
                                    </div>
                                    <div class="add-ai">
                                        <button class="updateButton" onclick="updateQty()">ADD +</button>
                                    </div>
                                </div>
                            </div>
                            <div class="hidden-block">
                            ${form.innerHTML}
                            </div>
                    </div>
        `;
    div.innerHTML = template;

    if (document.querySelector("#he-popup")) {
      document.querySelector("#he-popup").innerHTML = template;
    } else {
      document.body.prepend(div);
    }
  }

  loader(state) {
    if (state) {
      const div = document.createElement("div");
      div.classList.add("he-loader");
      div.id = "he-loader";
      document.body.classList.add("he-overlay");
      if (!document.querySelector("#he-loader")) {
        document.body.prepend(div);
      }
    } else {
      document.body.classList.remove("he-overlay");
      document.querySelector("#he-loader").remove();
    }
  }
}

const popupData = (e, url) => {
  e.preventDefault();
  const popup = new Popup(e, url);
  popup.getProductData();
};

if (window.innerWidth < 980) {
  document.querySelector("cart-drawer").remove();
  document.querySelector("#cart-icon-bubble").addEventListener("click", () => {
    window.location.href = "/cart";
  });
}

// Price Calculate 

const product_qty_button = document.querySelectorAll('.price-per-item__container .quantity__button[name="minus"], .price-per-item__container .quantity__button[name="plus"]')

product_qty_button.forEach((item) => {
  item.addEventListener('click', () => {
    setTimeout(() => {
      subtotal()
    }, 1000)
  })
})

const subtotal = () => {
  let subtotal = 0
  let product_price = 0

  const subtotal_div = document.getElementById('subtotal-display')
  const cart_total = document.querySelector(".product-form__buttons #alltotalprice")
  const product_regular_price = document.querySelector(".product__info-container .price-item--regular").textContent.replace(/[^\d.]/g, '')
  const product_sale_price = document.querySelector(".product__info-container .price-item--sale").textContent.replace(/[^\d.]/g, '')
  const product_qty = document.querySelector(".quantity-cart-add .quantity__input").value

  const complimentary_total_prices = document.querySelectorAll('.he-complimentary-slider .complementary-slide .total-price-display')

  complimentary_total_prices.forEach((item) => {
    if (item.textContent != '') return subtotal += +item.textContent.replace(/[^\d.]/g, '')
  })

  subtotal_div.innerText = `Subtotal: $${subtotal.toFixed(2)}`

  if (product_regular_price === product_sale_price) {
    product_price = +product_regular_price * product_qty
  } else {
    product_price = +product_sale_price * product_qty
  }

  const whole_bundle_price = product_price + subtotal
  cart_total.innerText = `$${whole_bundle_price.toFixed(2)}`
}

const select_product = (e) => {
  const li = e.target.closest('li')
  const checkbox = li.querySelector('.check-box-div input')
  const current_price = li.querySelector('.price__container .price-item--regular').textContent.replace(/[^\d.]/g, '')
  const sale_price = li.querySelector('.price__container .price-item--sale').textContent.replace(/[^\d.]/g, '')
  const update_price = li.querySelector('.total-price-display')
  let qty = li.querySelector('#bundleQuantity').value
  let total = 0

  if (checkbox.checked) {
    if (current_price === sale_price) {
      total = +current_price * qty
    } else {
      total = +sale_price * qty
    }

    // Update Total
    if (total > 0) {
      update_price.innerText = `$${total.toFixed(2)}`
      subtotal()
      return
    }

    update_price.innerText = ''
    subtotal()
  } else {
    update_price.innerText = ''
    qty = 0
    subtotal()
  }
}
const change_qty_product = (e) => {
  select_product(e)
}
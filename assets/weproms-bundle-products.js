const add_to_cart = document.querySelector(".product-form__buttons button");

function updateCart() {
  fetch(window.location.href + "#CartDrawer")
    .then((resp) => {
      return resp.text();
    })
    .then((htmlText) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      const element = doc.getElementById("CartDrawer");

      const old_element = document.getElementById("CartDrawer");

      old_element.innerHTML = element.innerHTML;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function add_api(formData) {

  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      updateCart();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

add_to_cart.addEventListener("click", (e) => {
  setTimeout(() => {
    let formData = {
      items: [],
    };

    const checked_products = document.querySelectorAll(
      `.Complementary-li .ai-checkbox-product:checked`
    );

    checked_products.forEach((item) => {
      const parent = item.closest('li')
      const variant_id = parent.querySelector('.check-box-div').dataset.id
      const qty = parent.querySelector('.quantity-selector').value

      formData.items.push(
        {
          id: +variant_id,
          quantity: +qty
        }
      )
    })

    add_api(formData);

  }, 500);
});
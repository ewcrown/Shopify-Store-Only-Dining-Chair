const add_to_cart = document.querySelector(".product-form__buttons button");

let items = [];

const appInterval = setInterval(() => {
  const complementary_products = document.querySelector(
    ".complementary-products__container"
  );

  if (complementary_products) {
    document.querySelectorAll(".ai-checkbox-product").forEach((e) => {
      console.log(e, "=======================>");
      e.addEventListener("click", () => {
        if (e.checked) {
          items.push(e.parentElement.dataset.id);
        } else {
          const index = items.indexOf(e.parentElement.dataset.id);
          if (index !== -1) {
            items.splice(index, 1);
          }
        }
        // console.log(items);
      });
    });
    clearInterval(appInterval);
  }
});

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

    if (items.length !== 0) { // Checking if items is not an empty array
      items.forEach((item, index) => {
        
        formData.items.push({
          id: +item,
          quantity: 1
        });
      });

      add_api(formData);
    }
  }, 500);
});
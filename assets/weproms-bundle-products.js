const add_to_cart = document.querySelector(".product-form__buttons button");

let items = [];

const appInterval = setInterval(() => {
  const complementary_products = document.querySelector(
    ".complementary-products__container"
  );


  if (complementary_products) {
    document.querySelector('cart-drawer').remove();
    document.querySelector('#cart-icon-bubble').addEventListener('click',()=>{ window.location.href = '/cart' })
    document.querySelectorAll(".ai-checkbox-product").forEach((e) => {
      console.log(e, "=======================>");
      e.addEventListener("click", () => {
        if (e.checked) {
          const qty = e.closest('.Complementary-li').querySelector('select[name="q"]')
          items.push(
            {
              id: +e.parentElement.dataset.id,
              quantity: +qty.value
            }
          );
        } else {
          const index = items.findIndex(item => item.id === e.parentElement.dataset.id);
          if (index !== -1) {
            items.splice(index, 1);
          }
        }
      });
    });
    clearInterval(appInterval);
  }
});

function add_api(formData) {

  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      window.location.href = '/cart'
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

if(add_to_cart){

  add_to_cart.addEventListener("click", (e) => {
    setTimeout(() => {
      let formData = {
        items: [],
      };
  
      if (items.length !== 0) { // Checking if items is not an empty array
        items.forEach((item, index) => {
          formData.items.push(item);
        });
  
        add_api(formData);
      }
    }, 500);
  });
}
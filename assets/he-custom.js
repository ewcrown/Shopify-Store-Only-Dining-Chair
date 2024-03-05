class Popup {
    constructor(event, url) {
        this.Event = event;
        this.Url = url;
    }

    getProductData() {
        this.loader(true)
        fetch(this.Url)
            .then(resp => resp.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(data, 'text/html');
                const productWrap = htmlDocument.querySelector('.product.product--small');
                this.loader(false)
                this.createPopup(productWrap)
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }

    createPopup(data) {
        const div = document.createElement('div')
        div.className = "product product--small product--left product--thumbnail_slider product--mobile-hide grid grid--1-col grid--2-col-tablet he-popup"
        div.id = 'he-popup'
        div.innerHTML = data.innerHTML

        // Cross Button
        const crossButton = document.createElement('div')
        crossButton.classList.add('removeButton')
        crossButton.textContent = '+';
        crossButton.addEventListener('click', () => this.removePopup());

        div.prepend(crossButton)


        // UpdateButton
        const updateButton = document.createElement('div')
        updateButton.classList.add('updateButton')
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => this.updateQty());

        div.appendChild(updateButton)

        if (document.querySelector('#he-popup')) {
            document.querySelector('#he-popup').innerHTML = data.innerHTML
        } else {
            document.body.prepend(div)
        }
    }

    removePopup() {
        const popup = document.getElementById('he-popup');
        if (popup) {
            popup.remove();
        }
    }

    updateQty() {
        const findCurrentPopupId = document.querySelector('#he-popup product-form input[name="product-id"]').value
        const findCurrentPopupQty = document.querySelector('#he-popup .quantity__input')
        const findCurrentProductId = document.querySelector(`.card-wrapper[data-id="${findCurrentPopupId}"]`)
        const findCurrentProductQty = findCurrentProductId.closest('li').querySelector('select[name="q"]')

        console.log(findCurrentProductQty.value, +findCurrentPopupQty.value)
        findCurrentProductQty.value = +findCurrentPopupQty.value

        this.removePopup()
    }

    loader(state) {
        if (state) {
            const div = document.createElement('div')
            div.classList.add('he-loader')
            div.id = 'he-loader'
            document.body.classList.add('he-overlay')
            if (!document.querySelector('#he-loader')) {
                document.body.prepend(div)
            }
        } else {
            document.body.classList.remove('he-overlay')
            document.querySelector('#he-loader').remove()
        }
    }
}

const popupData = (e, url) => {
    e.preventDefault();
    const popup = new Popup(e, url);
    popup.getProductData();
}

if (window.innerWidth < 980) {
    document.querySelector('cart-drawer').remove();
    document.querySelector('#cart-icon-bubble').addEventListener('click', () => { window.location.href = '/cart' })
}
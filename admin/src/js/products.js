import Picker from 'vanilla-picker';

class Model {
  constructor() {
    this.url ='http://localhost:3000';
    this.data = []; 
  };

  handleError() {
      // this.dispatchEvent(new CustomEvent('error.recived', {
  // 	bubbles: true
  // })); 
  };

  getProducts() {
    return fetch(this.url + '/api/products')
    .then(response => {
      return response.json().then((data) => {
        return this.data = data;
      });
    })
    .catch(function(err) {
      console.log(err);
      //handleError(); 
    })
  };

  postProducts(data) {
    return fetch(this.url + '/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
        return response.json().then(function(data) {
          return data;
        });
      })
    .catch(function(err) {
      console.log(err);
    })
  };

  removeProducts(id) {
    const data = {id};

    return fetch(this.url + '/api/products/:id', {
      method: 'DELETE',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response;
    })
    .catch(function(err) {
      console.log(err);
    })
  };

  getProduct(id) {
    return fetch(this.url + '/api/products/' + id)
    .then(response => {
      return response.json().then(function(data) {
        return data;
      });
    }
  )
    .catch(function(err) {
      console.log(err);
      //handleError(); 
    })
  };

  uploadProduct(data) {
    return fetch(this.url + '/api/products', {
      method: 'PUT',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
        return response.json().then(function(data) {
          return data;
        });
      }
    )
    .catch(function(err) {
      console.log(err);
    })
  };
};


class View {
  constructor() {
    this.modal = document.querySelector(".overlay");
    this.trigger = document.querySelector(".overlay__trigger");
    this.closeButton = document.querySelector(".overlay__close");

    //this.message = document.querySelector(".message");

    this.addForm = document.querySelector(".adding-form");
    this.priceArray = []; 
    this.informationArray = [];
    this.addedPriceButton = document.querySelector(".input__button.added-price");
    this.priceInput = document.querySelector(".input__field.price");
    this.addedInformationButton = document.querySelector(".input__button.added-information");
    this.informationInput = document.querySelector(".input__field.information");
    this.priceHolder = document.querySelector('form .item__priceList');
    this.infoHolder = document.querySelector('form .item__informationList');
    this.resetAddingFormButton = document.querySelector(".reset-form");
    this.uploadInput = document.querySelector(".upload__field input");
    this.uploadImage = document.querySelector(".upload__image");
    this.previewEmptyText = "No image currently selected for upload";

    this.container = document.querySelector('.product__hold');

    this.colorButtons = document.querySelectorAll(".input__button.colorpicker");

    this.activeItem;
    this.cloneItem;
    this.dragFunction;
    this.isMouseDown = false;
    this.isCloneCreated = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX;
    this.initialY;
    this.xOffset = 0;
    this.yOffset = 0;

    this.initColorPicker();
    this.registerEvents();
  };

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className) {
      element.setAttribute('class', Array.isArray(className) ? className.join(' ') : className);
    };

    return element
  };

  displayProducts(items) {
    if('content' in document.createElement('template')) {
      const style = document.createElement('style');
      const head = document.head || document.getElementsByTagName('head')[0];
      let styleText = '';

      head.appendChild(style);
      style.type = 'text/css';

      items.forEach((item) => {
        const template = document.querySelector('#product').content.cloneNode(true);
        const itemStyle = this.renderItemStyles(item);

        template.querySelector('.item__company').textContent = item.company;
        template.querySelector('.item__location').textContent = item.location;
        template.querySelector('.item__visual h1').textContent = item.title;
        template.querySelector('.item__visual img').src = item.image;
        template.querySelector('.item__type').textContent = item.type;
        this._renderMixedField(item.price, template.querySelector('.item__price'));
        this._renderMixedField(item.information, template.querySelector('.item__information')); 
        template.querySelector('.product').setAttribute('data-id', `product-${item._id}`);
        this.container.appendChild(template);

        styleText = styleText + itemStyle;
      });
      style.innerText = styleText;
    } 
    else {
      console.error('Your browser does not support templates');
    }
  };

  renderItemStyles(data) {
    return `${data.companyColor ? `[data-id="product-${data._id}"] .item__company{color: ${data.companyColor};}` : ``}\
    ${data.locationColor ? `[data-id="product-${data._id}"] .item__location{color: ${data.locationColor};}` : ``}\
    ${data.titleColor ? `[data-id="product-${data._id}"] .item__visual{color: ${data.titleColor};}` : ``}\
    ${data.typeColor ? `[data-id="product-${data._id}"] .item__type{color: ${data.typeColor};}` : ``}\
    ${data.priceColor ? `[data-id="product-${data._id}"] .item__price{color: ${data.priceColor};}` : ``}\
    ${data.informationColor ? `[data-id="product-${data._id}"] .item__information{color: ${data.informationColor};}` : ``}\ `
  };

  _renderMixedField(fieldsArray, holder, state) {
    fieldsArray.forEach((item, index) => {
      this.displayDescriptionItem(item, holder, state, index);
    })
  };

  toggleMessage() {
    this.message.classList.toggle("message--open");
  };

  toggleMenu(menu) {
    menu.classList.toggle("menu-item--open");
  };

  toggleModal() {
    this.modal.classList.toggle("overlay--open");
  };

  closeModal() {
    this.toggleModal();
    this.resetAddingForm();
  };

  resetAddingForm() {
    this.priceArray = [];
    this.informationArray = [];
    this.priceHolder.innerHTML = "";
    this.infoHolder.innerHTML = "";
    this.addForm.querySelector('[name="productId"]').value = "";
    this.addForm.reset();
    this.resetColors();
    this.resetImage();
  };

  resetColors() {
    this.addForm.querySelector('.company-colorpicker').removeAttribute('style');
    this.addForm.querySelector('.location-colorpicker').removeAttribute('style');
    this.addForm.querySelector('.title-colorpicker').removeAttribute('style');
    this.addForm.querySelector('.type-colorpicker').removeAttribute('style');
  };

  addDescription(input, folder, array) {
    const inputValue = input.value;
 
    if(!inputValue) {
      return;
    }
    array.push(inputValue);
    input.value = "";

    this.displayDescriptionItem(inputValue, folder, true);
  };

  displayDescriptionItem(value, holder, state, index) {
    const element = this.createElement('p');

    element.innerText = value;
    element.setAttribute('data-index', index);
    holder.appendChild(element);

    if(state) {
      const deleteButton = this.createElement('button', ['icon-close', 'item__delete']);

      deleteButton.setAttribute("type", "button");
      element.appendChild(deleteButton);
    }
  };

  removeDescriptionItem(event) {
    if (event.target.closest('.item__delete')) {
      const parentItem = event.target.closest("p");
      
      this.deleteDescriptionItemFromArray(event, parentItem.dataset.index);
      parentItem.remove();
    }
  };

  deleteDescriptionItemFromArray(event, index) {
    if (event.target.closest('.item__priceList')) {
      this.priceArray.splice(index, 1);
    } else {
      this.informationArray.splice(index, 1);
    }
  }

  initColorPicker() {
    this.colorButtons.forEach((button) => {
      const input = button.querySelector('input');
      const picker = new Picker({
        parent: button,
        popup: 'left',
        color: "#eee"
      });
      picker.onChange = function(color) {
        button.style.backgroundColor = color.rgbaString;
        input.value = color.rgbaString;
      };
      picker.openHandler(); 
    });
  };

  getFormData() {
    let inputsData = {};

    this.addForm.querySelectorAll('input[data-field]').forEach((field) => {
      let key = field.name;
      let value = field.value;

      inputsData = {...inputsData, [key]: value};
    })

    const arraysData = { 'price': this.priceArray || "", 'information': this.informationArray || ""};
    const imageData = {'image': this.uploadImage.querySelector("img").src};
    const formData = {...inputsData, ...imageData, ...arraysData};

    return formData;
  };

  submitAddForm(handlerAdd, handlerUpdate) {
    this.addForm.addEventListener('submit', event => {
      var data = this.getFormData();
      event.preventDefault();

      if (this.modal.querySelector('[name="productId"]').value.length) {
        handlerUpdate(data)
      } else {
        handlerAdd(data)
      }
    });
  };

  sendId(handler, target) {
    this.container.addEventListener('click', event => {   
      event.preventDefault(); 
      if (event.target.closest(target)) {
        const productId = event.target.closest('.product').dataset.id;

        handler(productId.replace(/product-/gi,''), event.target.closest('.product'))
      }
    }); 
  }

  removeProduct(handler) {
    this.sendId(handler, '.menu-item__remove');
  };

  editProduct(handler) {
    this.sendId(handler, '.menu-item__edit');
  };

  hideProduct(product) {
    product.classList.add('hide');
    setTimeout(() => {
      product.style.display = 'none';
    }, 3100)
  };

  checkEventTarget(event) {
    // event.stopPropogation();
    event.preventDefault();

    if (event.target.closest('.menu-item__trigger')) {
      this.toggleMenu(event.target.closest('.menu-item'))
    }

    if (event.target.closest('.prev')) {
      this.changeProductPosition(-1, event);
    }
    if (event.target.closest('.next')) {
      this.changeProductPosition(1, event);
    }
  };

  showProductModal(product) {
    this.modal.querySelector('[name="productId"]').value = product._id;
    this.modal.querySelector('[name="company"]').value = product.company;
    this.modal.querySelector('[name="companyColor"]').value = product.companyColor;
    this.modal.querySelector('[name="location"]').value = product.location;
    this.modal.querySelector('[name="locationColor"]').value = product.locationColor;
    this.modal.querySelector('[name="title"]').value = product.title;
    this.modal.querySelector('[name="titleColor"]').value = product.titleColor;
    this.modal.querySelector('[name="type"]').value = product.type;
    this.modal.querySelector('[name="typeColor"]').value = product.typeColor;
    this._renderMixedField(product.price, this.priceHolder, true);
    this._renderMixedField(product.information, this.infoHolder, true);
    this.priceArray = [...product.price];
    this.informationArray = [...product.information];

    if(product.image.length) {
      this.createImage(product.image);
    }

    this.setButtonColor(this.modal, product);
    this.toggleModal();
    this.toggleMenu(document.querySelector(`div[data-id="product-${product._id}"]`).querySelector('.menu-item'))
  };

  setButtonColor(parent, item) {
    parent.querySelector('.company-colorpicker').style.backgroundColor = item.companyColor;
    parent.querySelector('.location-colorpicker').style.backgroundColor = item.locationColor;
    parent.querySelector('.title-colorpicker').style.backgroundColor = item.titleColor;
    parent.querySelector('.type-colorpicker').style.backgroundColor = item.typeColor;
  };

  updateProductView(product) {
    const parent = document.querySelector(`div[data-id="product-${product._id}"]`);

    parent.querySelector('.item__company').innerHTML = product.company;
    parent.querySelector('.item__location').innerHTML = product.location;
    parent.querySelector('.item__visual h1').innerHTML = product.title;
    parent.querySelector('.item__visual img').src = product.image;
    parent.querySelector('.item__type').innerHTML = product.type;
    this._renderMixedField(product.price, parent.querySelector('.item__price'));
    this._renderMixedField(product.information, parent.querySelector('.item__information')); 
  };

  loadImage() {
    const currentFile = this.uploadInput.files;

    if(currentFile.length === 0) {
      this.resetImage();
    } else {
      this.createImage();
    }
  };

  createImage(imageSrc) {
    const currentFile = this.uploadInput.files;
    const image = document.createElement('img');
    const deleteButton = this.createElement('button', ['icon-close', 'upload__delete']);

    this.removeUploadContent();
    deleteButton.setAttribute("type", "button");
    image.src = imageSrc ? imageSrc : window.URL.createObjectURL(currentFile[0]); //????????
    this.uploadImage.appendChild(image);
    this.uploadImage.appendChild(deleteButton);
  }

  deleteImage(event) {
    const target = event.target;

    if (target.closest('.upload__delete')) {
      this.resetImage();
    }
  };

  resetImage() {
    const text = document.createElement('p');

    this.removeUploadContent();
    text.textContent = this.previewEmptyText;
    this.uploadImage.appendChild(text);
  };

  removeUploadContent() {
    while(this.uploadImage.firstChild){
      this.uploadImage.removeChild(this.uploadImage.firstChild);
    }
  };

  changeProductPosition(direction, event) {
    console.log(direction, event)
    this.activeItem = event.target.closest('.product');

    console.log()
    // this.container.insertBefore(this.activeItem, activeItemsArray[0]);
    const allProducts = document.querySelectorAll('.product');
    const number = [...allProducts].indexOf(this.activeItem);

    if (direction > 0) {
      // this.container.insertBefore(this.activeItem, allProducts[number - 1]);
      allProducts[number + 1].parentNode.insertBefore(this.activeItem, allProducts[number + 1].nextSibling);
    } else {
      this.container.insertBefore(this.activeItem, allProducts[number - 1]);
    }


    // this.isMouseDown = false;

    // console.log(this.activeItem)
  }

  setPosition(event){
    var deltaX = event.clientX - this.initialX;
    var deltaY = event.clientY - this.initialY;

    this.activeItem.style.position = 'absolute';
    this.activeItem.style.left = deltaX - this.activeItem.offsetParent.offsetLeft  + 'px';
    this.activeItem.style.top = deltaY  - this.activeItem.offsetParent.offsetTop + 'px';
    this.activeItem.style.zIndex = 100;

    // this.addBlurDragClass(event);
  }

  dragStart(event) {
    // if (event.type === "touchstart") {
    //   this.addBlurDragClass(event);
    //   this.initialX = event.touches[0].clientX - this.xOffset;
    //   this.initialY = event.touches[0].clientY - this.yOffset;
    
    // } else {
    //   this.dragFunction = setTimeout(() => {
    //   }, 3000);
    // }
    
    this.activeItem = event.target.closest('.product');

    this.activeItem.classList.add('active-product');
    
    this.dimensionProduct = this.activeItem.getBoundingClientRect();
    
    this.initialX = event.clientX - this.dimensionProduct.left;
    this.initialY = event.clientY - this.dimensionProduct.top;

    this.isMouseDown = true;
  };
  
  dragMove(event) {
    if (!this.isMouseDown) {
      return;
    };

    console.log('dragMove')

    if (!this.isCloneCreated) {
      this.isCloneCreated = true;
      this.createCloneItem(this.activeItem);
    }
    
    this.setPosition(event);
  };

  dragEnd() {
    if (this.dragFunction) {
      clearTimeout(this.dragFunction);
    }

    // this.initialX = this.currentX;
    // this.initialY = this.currentY;

    const allProductsArray = [...document.querySelectorAll('.product')];

    // let activeItemsArray = this.container.querySelectorAll('.product').filter(item => {
    let activeItemsArray = allProductsArray.filter(item => {
      if (!item.classList.contains('active-product')) {
        // let leftOffset = item.offsetLeft + item.offsetWidth / 2  > this.activeItem.offsetLeft && item.offsetLeft < this.activeItem.offsetLeft;
        let leftOffset = this.activeItem.offsetWidth / 2 > this.activeItem.offsetLeft + this.activeItem.offsetWidth - item.offsetLeft - item.offsetWidth;
        // let topOffset = this.activeItem.offsetHeight / 2 > this.activeItem.offsetTop + this.activeItem.offsetHeight - item.offsetTop - item.offsetHeight;

        // if (leftOffset || topOffset) {
        if (leftOffset) {
          return item;
        }
      }
    });

    console.log(activeItemsArray)
    if (!!activeItemsArray.length) {
      this.container.insertBefore(this.activeItem, activeItemsArray[0]);
    } else {
      setTimeout(() => {
        let lastElement = allProductsArray[allProductsArray.length - 1];
        lastElement.parentNode.insertBefore(this.activeItem, lastElement.nextSibling);
      }, 100);
    }
    
    this.activeItem.style.position = 'relative';
    this.activeItem.style.left = 'auto';
    this.activeItem.style.top = 'auto';
    this.activeItem.style.zIndex = 1;
    this.activeItem.classList.remove('active-product');
    this.isMouseDown = false;
    this.removeCloneItem();
  };

  addBlurDragClass(event) {
    this.container.querySelectorAll('.product').forEach((item, index) => {
      
    });
  };

  createCloneItem() {
    this.cloneItem = this.createElement('div', 'product--clone');
    this.cloneItem.style.width = this.activeItem.offsetWidth + 'px';
    this.cloneItem.style.height = this.activeItem.offsetHeight + 'px';
    this.container.insertBefore(this.cloneItem, this.activeItem);
  };

  removeCloneItem() {
    if(this.cloneItem && this.cloneItem.parentNode) this.cloneItem.parentNode.removeChild(this.cloneItem);
    this.isCloneCreated = false;
  };

  registerEvents() {
    this.trigger.addEventListener("click", this.toggleModal.bind(this));
    this.closeButton.addEventListener("click", this.closeModal.bind(this));
    this.uploadInput.addEventListener("change", this.loadImage.bind(this));
    this.uploadImage.addEventListener("click", this.deleteImage.bind(this));
    this.resetAddingFormButton.addEventListener("click", this.resetAddingForm.bind(this));
    this.addedPriceButton.addEventListener("click", this.addDescription
      .bind(this, this.priceInput, this.priceHolder, this.priceArray));
    this.addedInformationButton.addEventListener("click", this.addDescription
      .bind(this, this.informationInput, this.infoHolder, this.informationArray));
    this.container.addEventListener('click', (event) => this.checkEventTarget(event));
    this.addForm.addEventListener('click', (event) => this.removeDescriptionItem(event));

    //drag events
    // this.container.addEventListener("touchstart", dragStart, false);
    // this.container.addEventListener("touchend", dragEnd, false);
    // this.container.addEventListener("touchmove", drag, false);

    // this.container.addEventListener("mousedown", this.dragStart.bind(this), false);
    // this.container.addEventListener("mousemove", this.dragMove.bind(this), false);
    // this.container.addEventListener("mouseup", this.dragEnd.bind(this), false);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.registerEvents();
  };

  loadedProducts() {
    this.model.getProducts()
    .then((response) => {
      this.view.displayProducts(response);
    });
  };

  saveProduct(data) {
    this.model.postProducts(data)
    .then((response) => {
      this.view.displayProducts([].concat(response));
      this.view.closeModal();
    });
  };

  deleteProduct(id, item) {
    this.model.removeProducts(id)
    .then((response) => {
      if(response.status === 202) {
        this.view.hideProduct(item);
      }
    });
  };

  updateProduct(id) {
    this.model.getProduct(id)
    .then((response) => {
      this.view.showProductModal(response);
    });
  };

  changeProduct(data) {
    this.model.uploadProduct(data)
    .then((response) => {
      this.view.updateProductView(response);
      this.view.closeModal();
    });
  };

  registerEvents() {
    this.loadedProducts();
    this.view.submitAddForm(this.saveProduct.bind(this), this.changeProduct.bind(this));
    this.view.removeProduct(this.deleteProduct.bind(this));
    this.view.editProduct(this.updateProduct.bind(this));
  };
}

window.addEventListener('load', function() {
    new Controller(new Model(), new View())
});

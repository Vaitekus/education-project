import Picker from 'vanilla-picker';

class Model {
  constructor() {
    this.url ='http://localhost:3000';
    this.data = []; 
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
    })
  };
};


class View {
  constructor() {
    this.container = document.querySelector('.product__hold');
  };

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className) {
      element.setAttribute('class', Array.isArray(className) ? className.join(' ') : className);
    };

    return element
  };

  displayProducts(items) {
    if(!this.container) {
      this.container.innerHTML = '';
    }
    

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

  _renderMixedField(fieldsArray, holder) {
    fieldsArray.forEach((item, index) => {
      this.displayDescriptionItem(item, holder, index);
    })
  };

  displayDescriptionItem(value, holder, index) {
    const element = this.createElement("p");

    element.innerText = value;
    holder.appendChild(element);
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

  registerEvents() {
    this.loadedProducts();
  };
}

window.addEventListener('load', function() {
    new Controller(new Model(), new View())
});

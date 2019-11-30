class Control { 
  types;
  constructor(...types) {
    this.types = types;
  }

  setControlsButtons(slider) {
    document.querySelector('.' + slider.rootNodeClass + '__prevButton').addEventListener('click', () => slider.showPrev());
    document.querySelector('.' + slider.rootNodeClass + '__nextButton').addEventListener('click', () => slider.showNext());
  }
}

class Render {
  constructor() {}

  renderCarousel(slider) {
    for (let el of slider.itemsArray) {
      el.classList.remove(slider.rootNodeClass + '-item--center',
                          slider.rootNodeClass + '-item--left',
                          slider.rootNodeClass + '-item--right');
    };
    slider.itemsArray.item(slider.currentIndex).classList.add(slider.rootNodeClass + '-item--center');
    slider.itemsArray.item(slider.prev()).classList.add(slider.rootNodeClass + '-item--left');
    slider.itemsArray.item(slider.next()).classList.add(slider.rootNodeClass + '-item--right');
  }
}

class Slider {
  currentIndex;
  itemsArray;
  rootNodeClass;
  controller;
  renderer;

  constructor(rootNodeClass, controller, renderer) {
    this.controller = controller;
    this.renderer = renderer;
    this.currentIndex = 0;
    this.rootNodeClass = rootNodeClass;
    this.itemsArray = document.querySelector('.' + rootNodeClass).children;
  }

  next() {
    if (this.currentIndex === this.itemsArray.length - 1) {
      return 0;
    } else {
      return this.currentIndex + 1;
    }
  }

  prev() {
    if (this.currentIndex === 0) {
      return this.itemsArray.length - 1;
    } else {
      return this.currentIndex - 1;
    }
  }

  setControls() {
    this.controller.setControlsButtons(this);
  } 

  showPrev() {
    this.currentIndex = this.prev();
    this.render();
  }

  showNext() {
    this.currentIndex = this.next();
    this.render();
  }

  render() {
    this.renderer.renderCarousel(this);
  }
}

const worksSliderController = new Control();
const worksSliderRenderer = new Render();
const worksSlider = new Slider('works-slider', worksSliderController, worksSliderRenderer);
worksSlider.render();
worksSlider.setControls();




class Slider {
  index;
  rootNode;
  controlTypes;
  renderer;
  prevItem;
  nextItem;

  constructor(rootNode, renderer,...controlTypes) {
    this.index = 1;
    this.renderer = renderer;
    this.controlTypes = controlTypes;
    this.rootNode = rootNode;  
  }

  next() {
    let k = this.index;
    k = this.index === this.itemsArray.length - 1 ? 0 : this.index + 1;
    return k;
  }

  prev() {
    let k = this.index;
    k = this.index === 0 ? this.itemsArray.length - 1 : this.index - 1;
    return k;
  }

  render() {
    for (let el of this.itemsArray) {
      el.classList.remove('works-slider-item--left', 'works-slider-item--right','works-slider-item--center');
    };
    console.log(this.index)
    console.log(this.prev());
    this.itemsArray.item(this.index).classList.add('works-slider-item--center');
    this.itemsArray.item(this.prev()).classList.add('works-slider-item--left');
    this.itemsArray.item(this.next()).classList.add('works-slider-item--right');
  }

  setControls() {
    this.controlTypes.forEach(type => {
      switch (type) {
        case 'buttons':
          this.buttonsInit();
          break;
        case 'keyboard':
          this.keyboardInit();
          break;
      }
    })
  }

  buttonsInit() {
    this.rootNode.querySelector('.slider__prev').addEventListener('click', this.moveBack);
    this.rootNode.querySelector('.slider__next').addEventListener('click', this.moveForward);
  }
};

class Render {

  constructor(active, sliderObject) {
    this.classActive = active;
    
  }

  render() {

  }
}


const worksSlider = new Slider ( document.querySelector('.works-slider'), 'buttons' )




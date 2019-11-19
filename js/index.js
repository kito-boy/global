class Slider {
  index;
  itemsArray;

  constructor(rootNode, prevButton, nextButton) {
    this.index = 1;
    this.itemsArray = rootNode.children;
    prevButton.onclick = () => {
      this.index = this.prev();
      this.render();
      console.log('back');
    }
    nextButton.onclick = () => {
      this.index = this.next();
      this.render();
    }
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
      // el.classList.toggle('.works-slider-item--right', false);
      // el.classList.toggle('.works-slider-item--center', false);
    };
    console.log(this.index)
    console.log(this.prev());
    this.itemsArray.item(this.index).classList.add('works-slider-item--center');
    this.itemsArray.item(this.prev()).classList.add('works-slider-item--left');
    this.itemsArray.item(this.next()).classList.add('works-slider-item--right');
  }
}

const worksSlider = new Slider(document.querySelector('.works-slider'),
                         document.querySelector('.works-slider__prev'), 
                         document.querySelector('.works-slider__next'));


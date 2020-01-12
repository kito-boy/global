"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function nextItem(item) {
  if (item.nextElementSibling == null) {
    return item.parentNode.firstElementChild;
  }

  return item.nextElementSibling;
}

function previousItem(item) {
  if (item.previousElementSibling == null) {
    return item.parentNode.lastElementChild;
  }

  return item.previousElementSibling;
}

function throttle(callback, limit) {
  let wait = false;
  return function () {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(() => wait = false, limit);
    }
  };
}

class Render {
  constructor(rootNodeClass, sliderType) {
    this.root = rootNodeClass;
    this.type = sliderType;
    this.currentItem = document.querySelector('.' + this.root).firstElementChild;
  }

  render() {
    switch (this.type) {
      case 'carousel':
        this.renderCarousel();
        break;

      case 'fullscreen-vertical':
        this.renderFsVertical();
    }
  }

  renderCarousel() {
    for (let el of document.querySelector('.' + this.root).children) {
      el.classList.remove(this.root + '-item--center', this.root + '-item--left', this.root + '-item--right');
    }

    ;
    this.currentItem.classList.add(this.root + '-item--center');
    previousItem(this.currentItem).classList.add(this.root + '-item--left');
    nextItem(this.currentItem).classList.add(this.root + '-item--right');
  }

  renderFsVertical() {
    previousItem(this.currentItem).classList.remove(this.root + '-item--is-active');
    nextItem(this.currentItem).classList.remove(this.root + '-item--is-active');
    this.currentItem.classList.add(this.root + '-item--is-active');
  }

  showNext() {
    this.currentItem = nextItem(this.currentItem);
    this.render();
  }

  showPrevious() {
    this.currentItem = previousItem(this.currentItem);
    this.render();
  }

}

class Slider {
  constructor(renderer) {
    _defineProperty(this, "scrollHandler", e => {
      const delta = Math.sign(e.deltaY);
      console.log(e.deltaY);

      if (delta > 0) {
        let pi = this.renderer.currentItem;
        pi.style.top = '-30px';
        this.renderer.showNext();
        setTimeout(() => {
          pi.style.top = '70px';
        }, 400);
      } else if (delta < 0) {
        let pi = this.renderer.currentItem;
        pi.style.top = '170px';
        this.renderer.showPrevious();
        setTimeout(() => {
          pi.style.top = '70px';
        }, 400);
      }
    });

    this.renderer = renderer;
  }

  setControls(controlTypes) {
    controlTypes.forEach(type => {
      console.log(type);

      switch (type) {
        case 'buttons':
          this.buttonsHandler();
          break;

        case 'arrowkeys-vertical':
          document.addEventListener('keyup', e => {
            if (e.code === "ArrowUp") {
              this.renderer.showPrevious();
            } else if (e.code === "ArrowDown") {
              this.renderer.showNext();
            }
          });
          break;

        case 'scroll':
          document.addEventListener('wheel', throttle(this.scrollHandler, 700));
          break;

        case 'touch':
          this.touchHandler();
      }
    });
  }

  buttonsHandler() {
    const pb = document.querySelector('.' + this.renderer.root + '__prevButton');
    const nb = document.querySelector('.' + this.renderer.root + '__nextButton');
    pb.addEventListener('click', () => this.renderer.showPrevious(), false);
    nb.addEventListener('click', () => this.renderer.showNext(), false);
  }

  touchHandler() {
    let ts = null;
    let te = null;
    const el = document.querySelector('body');
    el.addEventListener('touchstart', e => {
      ts = e.touches[0].clientY;
    });
    el.addEventListener('touchend', e => {
      te = e.changedTouches[0].clientY;
      let delta = te - ts;

      if (delta < 0 && Math.abs(delta) > 100) {
        this.renderer.showNext();
      } else if (delta > 0 && Math.abs(delta) > 100) {
        this.renderer.showPrevious();
      }
    });
  }

  render() {
    this.renderer.render();
  }

}

function makeSlider(root, renderType) {
  for (var _len = arguments.length, controlTypes = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    controlTypes[_key - 2] = arguments[_key];
  }

  let types = controlTypes;
  const newSliderRenderer = new Render(root, renderType);
  const newSlider = new Slider(newSliderRenderer);
  newSlider.render();
  newSlider.setControls(types);
}

makeSlider('works-slider', 'carousel', 'buttons');
makeSlider('l-section', 'fullscreen-vertical', 'arrowkeys-vertical', 'scroll', 'touch');
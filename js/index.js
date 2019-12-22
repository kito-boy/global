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

function throttle (callback, limit) {
  var wait = false;
  return function() {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(function() {
        wait = false;
      }, limit);
    }
  }
}

class Render {
  rootNodeClass;
  currentItem;
  type;

  constructor(rootNodeClass, type) {
    this.rootNodeClass = rootNodeClass;
    this.type = type;
    this.currentItem = document.querySelector('.' + this.rootNodeClass).firstElementChild;
  }

  render() {
    switch(this.type) {
      case 'carousel':
        this.renderCarousel();
        break;
      case 'fullscreen-vertical':
        this.renderFsVertical();
        break;
    }
  }

  renderCarousel() {
    for (let el of document.querySelector('.' + this.rootNodeClass).children) {
      el.classList.remove(this.rootNodeClass + '-item--center',
                          this.rootNodeClass + '-item--left',
                          this.rootNodeClass + '-item--right')
    };

    this.currentItem.classList.add(this.rootNodeClass + '-item--center');
    previousItem(this.currentItem).classList.add(this.rootNodeClass + '-item--left');
    nextItem(this.currentItem).classList.add(this.rootNodeClass + '-item--right');
  }

  renderFsVertical() {
    previousItem(this.currentItem).classList.remove(this.rootNodeClass + '-item--is-active');
    nextItem(this.currentItem).classList.remove(this.rootNodeClass + '-item--is-active');
    this.currentItem.classList.add(this.rootNodeClass + '-item--is-active');
  }

  showNext() {
    this.currentItem = nextItem(this.currentItem)
    this.render();
  }

  showPrevious() {
    this.currentItem = previousItem(this.currentItem)
    this.render();
  }
}

class Slider {
  renderer;

  constructor(renderer) {
    this.renderer = renderer;
  }

  setControls(controlTypes) {
    controlTypes.forEach(type => {
      console.log(type);
      switch (type) {
        case 'buttons':
          document.querySelector('.' + this.renderer.rootNodeClass + '__prevButton').addEventListener('click', () => this.renderer.showPrevious(), false);
          document.querySelector('.' + this.renderer.rootNodeClass + '__nextButton').addEventListener('click', () => this.renderer.showNext(), false);
          break;
        case 'arrowkeys-vertical':
          document.addEventListener('keyup', (e) => {
            if (e.code === "ArrowUp") {
               this.renderer.showPrevious();
            } else if (e.code === "ArrowDown") {
              this.renderer.showNext();
            }
          })
          break;
        case 'scroll':
          document.addEventListener('wheel', throttle(this.scrollHandler, 700));
          break;
        case 'touch':
          this.touchHandler();
      }
    })
  }

  touchHandler() {
    let ts = null;
    let te = null;  

    document.querySelector('body').addEventListener('touchstart', (e) => {
      ts = e.touches[0].clientY;
    });

    document.querySelector('body').addEventListener('touchend', (e) => {
      te = e.changedTouches[0].clientY;
      let delta = te - ts;

      if ( (delta < 0) && (Math.abs(delta) > 100) ) {
        this.renderer.showNext(); 
      } else if ( (delta > 0) && (Math.abs(delta) > 100) ) {
        this.renderer.showPrevious();
      };

    });
  }

  scrollHandler = (e) => {
    const delta = Math.sign(e.deltaY);
    if (delta > 0) {
      this.renderer.showNext() 
    } else if (delta < 0) {
      this.renderer.showPrevious()
    }
  }

  render() {
    this.renderer.render();
  }
}

function makeSlider(rootNodeClass, renderType, ...controlTypes) {
  let types = controlTypes;
  const newSliderRenderer = new Render(rootNodeClass, renderType);
  const newSlider = new Slider(newSliderRenderer);
  newSlider.render();
  newSlider.setControls(types);
}

makeSlider('works-slider', 'carousel', 'buttons');
makeSlider('l-section', 'fullscreen-vertical', 'arrowkeys-vertical', 'scroll', 'touch');




"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
  var wait = false;
  return function () {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(function () {
        return wait = false;
      }, limit);
    }
  };
}

var Render =
/*#__PURE__*/
function () {
  function Render(rootNodeClass, sliderType) {
    _classCallCheck(this, Render);

    this.root = rootNodeClass;
    this.type = sliderType;
    this.currentItem = document.querySelector('.' + this.root).firstElementChild;
  }

  _createClass(Render, [{
    key: "render",
    value: function render() {
      switch (this.type) {
        case 'carousel':
          this.renderCarousel();
          break;

        case 'fullscreen-vertical':
          this.renderFsVertical();
      }
    }
  }, {
    key: "renderCarousel",
    value: function renderCarousel() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = document.querySelector('.' + this.root).children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;
          el.classList.remove(this.root + '-item--center', this.root + '-item--left', this.root + '-item--right');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ;
      this.currentItem.classList.add(this.root + '-item--center');
      previousItem(this.currentItem).classList.add(this.root + '-item--left');
      nextItem(this.currentItem).classList.add(this.root + '-item--right');
    }
  }, {
    key: "renderFsVertical",
    value: function renderFsVertical() {
      previousItem(this.currentItem).classList.remove(this.root + '-item--is-active');
      nextItem(this.currentItem).classList.remove(this.root + '-item--is-active');
      this.currentItem.classList.add(this.root + '-item--is-active');
    }
  }, {
    key: "showNext",
    value: function showNext() {
      this.currentItem = nextItem(this.currentItem);
      this.render();
    }
  }, {
    key: "showPrevious",
    value: function showPrevious() {
      this.currentItem = previousItem(this.currentItem);
      this.render();
    }
  }]);

  return Render;
}();

var Slider =
/*#__PURE__*/
function () {
  function Slider(renderer) {
    var _this = this;

    _classCallCheck(this, Slider);

    _defineProperty(this, "scrollHandler", function (e) {
      var delta = Math.sign(e.deltaY);
      console.log(e.deltaY);

      if (delta > 0) {
        var pi = _this.renderer.currentItem;
        pi.style.top = '-30px';

        _this.renderer.showNext();

        setTimeout(function () {
          pi.style.top = '70px';
        }, 400);
      } else if (delta < 0) {
        var _pi = _this.renderer.currentItem;
        _pi.style.top = '170px';

        _this.renderer.showPrevious();

        setTimeout(function () {
          _pi.style.top = '70px';
        }, 400);
      }
    });

    this.renderer = renderer;
  }

  _createClass(Slider, [{
    key: "setControls",
    value: function setControls(controlTypes) {
      var _this2 = this;

      controlTypes.forEach(function (type) {
        console.log(type);

        switch (type) {
          case 'buttons':
            _this2.buttonsHandler();

            break;

          case 'arrowkeys-vertical':
            document.addEventListener('keyup', function (e) {
              if (e.code === "ArrowUp") {
                _this2.renderer.showPrevious();
              } else if (e.code === "ArrowDown") {
                _this2.renderer.showNext();
              }
            });
            break;

          case 'scroll':
            document.addEventListener('wheel', throttle(_this2.scrollHandler, 700));
            break;

          case 'touch':
            _this2.touchHandler();

        }
      });
    }
  }, {
    key: "buttonsHandler",
    value: function buttonsHandler() {
      var _this3 = this;

      var pb = document.querySelector('.' + this.renderer.root + '__prevButton');
      var nb = document.querySelector('.' + this.renderer.root + '__nextButton');
      pb.addEventListener('click', function () {
        return _this3.renderer.showPrevious();
      }, false);
      nb.addEventListener('click', function () {
        return _this3.renderer.showNext();
      }, false);
    }
  }, {
    key: "touchHandler",
    value: function touchHandler() {
      var _this4 = this;

      var ts = null;
      var te = null;
      var el = document.querySelector('body');
      el.addEventListener('touchstart', function (e) {
        ts = e.touches[0].clientY;
      });
      el.addEventListener('touchend', function (e) {
        te = e.changedTouches[0].clientY;
        var delta = te - ts;

        if (delta < 0 && Math.abs(delta) > 100) {
          _this4.renderer.showNext();
        } else if (delta > 0 && Math.abs(delta) > 100) {
          _this4.renderer.showPrevious();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      this.renderer.render();
    }
  }]);

  return Slider;
}();

function makeSlider(root, renderType) {
  for (var _len = arguments.length, controlTypes = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    controlTypes[_key - 2] = arguments[_key];
  }

  var types = controlTypes;
  var newSliderRenderer = new Render(root, renderType);
  var newSlider = new Slider(newSliderRenderer);
  newSlider.render();
  newSlider.setControls(types);
}

makeSlider('works-slider', 'carousel', 'buttons');
makeSlider('l-section', 'fullscreen-vertical', 'arrowkeys-vertical', 'scroll', 'touch');
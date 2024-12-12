(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function blockPage(status, blurStatus) {
  const body = document.body;
  if (status) {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.paddingRight = `${scrollBarWidth}px`;
    body.classList.add("block-page");
  } else {
    body.style.paddingRight = "";
    body.classList.remove("block-page");
    body.classList.remove("blur-page");
  }
}
function burgerBtn() {
  const burgerBtns = document.querySelectorAll(".burger-btn");
  const burgerControl = (flag, btn, targetElement, className) => {
    if (flag) {
      btn.classList.add("burger-btn--active");
      if (targetElement) targetElement.classList.add(className);
      blockPage(true);
    } else {
      btn.classList.remove("burger-btn--active");
      if (targetElement) targetElement.classList.remove(className);
      blockPage(false);
    }
  };
  if (burgerBtns.length > 0) {
    burgerBtns.forEach((btn) => {
      const targetElement = document.querySelector(btn.dataset.target), className = btn.dataset.class;
      burgerControl(false, btn, targetElement, className);
      btn.addEventListener("click", () => {
        const flag = btn.classList.toggle("burger-btn--active");
        burgerControl(flag, btn, targetElement, className);
      });
    });
    document.addEventListener("click", (e) => {
      let flag = true;
      burgerBtns.forEach((btn) => {
        if (e.target.closest(btn.dataset.target)) flag = false;
      });
      if (e.target.closest(".burger-btn")) flag = false;
      if (flag)
        burgerBtns.forEach((btn) => {
          const targetElement = document.querySelector(btn.dataset.target), className = btn.dataset.class;
          burgerControl(false, btn, targetElement, className);
        });
    });
  }
}
function header() {
  const headerNavLinks = document.querySelectorAll(".nav__link");
  headerNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const header2 = document.querySelector(".header--burger-active");
      if (header2) {
        const headerBurgerBtn = header2.querySelector(".header__burger-btn");
        if (headerBurgerBtn) headerBurgerBtn.click();
      }
    });
  });
}
function anchorsScroll() {
  const smoothScroll = (target) => {
    const element = document.querySelector(target);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth"
      });
    }
  };
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      if (targetId && targetId !== "#") {
        smoothScroll(targetId);
      }
    });
  });
}
const Skroll = function(opt) {
  this.settings = opt || {};
  this.settings.mobile = this.settings.mobile === void 0 ? false : this.settings.mobile;
  this.referenceElement = this.settings.reference === void 0 ? window : this.get(this.settings.reference)[0];
  this.elements = [];
  this.data = {};
  this.animations = {
    zoomIn: {
      start: function(el) {
        el.style["transform"] = "scale(.1,.1)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "scale(1,1)";
        el.style["opacity"] = 1;
      }
    },
    fadeInLeft: {
      start: function(el) {
        el.style["transform"] = "translate(-50%,0)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0)";
        el.style["opacity"] = 1;
      }
    },
    fadeInRight: {
      start: function(el) {
        el.style["transform"] = "translate(50%,0)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0)";
        el.style["opacity"] = 1;
      }
    },
    fadeInLeftBig: {
      start: function(el) {
        el.style["transform"] = "translate(-100%,0)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0)";
        el.style["opacity"] = 1;
      }
    },
    fadeInRightBig: {
      start: function(el) {
        el.style["transform"] = "translate(100%,0)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0)";
        el.style["opacity"] = 1;
      }
    },
    fadeInUp: {
      start: function(el) {
        el.style["transform"] = "translate(0,50%)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0,0%)";
        el.style["opacity"] = 1;
      }
    },
    fadeInDown: {
      start: function(el) {
        el.style["transform"] = "translate(0,-50%)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0,0%)";
        el.style["opacity"] = 1;
      }
    },
    slideInLeft: {
      start: function(el) {
        el.style["transform"] = "translate(-50%,0) scale(.8,.8)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0) scale(1,1)";
        el.style["opacity"] = 1;
      }
    },
    slideInLeftBig: {
      start: function(el) {
        el.style["transform"] = "translate(-100%,0) scale(.8,.8)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0) scale(1,1)";
        el.style["opacity"] = 1;
      }
    },
    slideInRight: {
      start: function(el) {
        el.style["transform"] = "translate(50%,0) scale(.8,.8)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0) scale(1,1)";
        el.style["opacity"] = 1;
      }
    },
    slideInRightBig: {
      start: function(el) {
        el.style["transform"] = "translate(-100%,0) scale(.8,.8)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0) scale(1,1)";
        el.style["opacity"] = 1;
      }
    },
    flipInX: {
      start: function(el) {
        el.style["transform"] = "rotateX(90deg)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "rotateX(0deg)";
        el.style["opacity"] = 1;
      }
    },
    flipInY: {
      start: function(el) {
        el.style["transform"] = "rotateY(90deg)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "rotateY(0deg)";
        el.style["opacity"] = 1;
      }
    },
    rotateRightIn: {
      start: function(el) {
        el.style["transform"] = "rotate(45deg)";
        el.style["transform-origin"] = "0 100%";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "rotate(0deg)";
        el.style["opacity"] = 1;
      }
    },
    rotateLeftIn: {
      start: function(el) {
        el.style["transform"] = "rotate(-45deg)";
        el.style["transform-origin"] = "0 100%";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "rotate(0deg)";
        el.style["opacity"] = 1;
      }
    },
    growInLeft: {
      start: function(el) {
        el.style["transform"] = "translate(-100%,0) scale(.1,.1)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0) scale(1,1)";
        el.style["opacity"] = 1;
      }
    },
    growInRight: {
      start: function(el) {
        el.style["transform"] = "translate(100%,0) scale(.1,.1)";
        el.style["opacity"] = 0;
      },
      end: function(el) {
        el.style["transform"] = "translate(0%,0) scale(1,1)";
        el.style["opacity"] = 1;
      }
    }
  };
};
Skroll.prototype.get = function(el) {
  return document.querySelectorAll(el);
};
Skroll.prototype.inViewport = function(elem, settings) {
  var scrollTop, elementTop, elementBottom, viewportTop, viewportBottom;
  if (this.referenceElement == window) {
    scrollTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
    elementTop = this.data[elem.getAttribute("data-skroll-id")].top;
    elementBottom = elementTop + elem.offsetHeight;
    viewportTop = scrollTop + screen.availHeight * settings.triggerTop;
    viewportBottom = scrollTop + screen.availHeight * settings.triggerBottom;
  } else {
    var re = this.referenceElement;
    scrollTop = re.scrollTop;
    elementTop = this.data[elem.getAttribute("data-skroll-id")].top;
    elementBottom = elementTop + elem.offsetHeight;
    viewportTop = scrollTop + re.offsetHeight * settings.triggerTop;
    viewportBottom = scrollTop + re.offsetHeight * settings.triggerBottom;
  }
  return elementBottom > viewportTop && elementTop < viewportBottom;
};
Skroll.prototype.getScrollStatus = function(elem, settings) {
  if (this.inViewport(elem, settings)) {
    this.data[elem.getAttribute("data-skroll-id")].inView = true;
    return { action: "enter", data: { shown: this.data[elem.getAttribute("data-skroll-id")].shown } };
  } else {
    if (this.data[elem.getAttribute("data-skroll-id")].inView) {
      this.data[elem.getAttribute("data-skroll-id")].inView = false;
      return { action: "leave", data: { shown: this.data[elem.getAttribute("data-skroll-id")].shown } };
    }
    return { action: "idle", data: { shown: this.data[elem.getAttribute("data-skroll-id")].shown } };
  }
};
Skroll.prototype.add = function(el, options = {}) {
  var settings = {
    triggerTop: options.triggerTop || 0.2,
    triggerBottom: options.triggerBottom || 0.8,
    delay: options.delay || 0,
    duration: options.duration || 500,
    animation: options.animation || "zoomIn",
    easing: options.easing || "ease",
    wait: options.delay || 0,
    repeat: options.repeat || false,
    onEnter: options.onEnter || false,
    onLeave: options.onLeave || false
  };
  this.elements.push({
    element: el,
    settings
  });
  return this;
};
Skroll.prototype.recalcPosition = function() {
  var _this = this;
  this.elements.forEach(function(val, key) {
    _this.get(val.element).forEach(function(e, i2) {
      var t2 = e.style.transform;
      e.style["transform"] = "none";
      setTimeout(function() {
        var offset = e.getBoundingClientRect();
        var top = _this.referenceElement == window ? offset.top + _this.referenceElement.scrollY : offset.top + _this.referenceElement.scrollTop;
        _this.data[e.getAttribute("data-skroll-id")].top = top;
        e.style["transform"] = t2;
      }, 50);
    });
  });
};
Skroll.prototype.throttle = function(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last, deferTimer;
  return function() {
    var context = scope || this;
    var now = +/* @__PURE__ */ new Date(), args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};
Skroll.prototype.addAnimation = function(name, property) {
  this.animations[name] = property;
  return this;
};
Skroll.prototype.init = function() {
  var _this = this;
  if (!this.settings.mobile && screen.width < 600) return this;
  var id = 0;
  this.elements.forEach(function(val, key) {
    _this.get(val.element).forEach(function(e, i2) {
      e.setAttribute("data-skroll-id", id);
      var offset = e.getBoundingClientRect();
      var top = _this.referenceElement == window ? offset.top + _this.referenceElement.scrollY : offset.top + _this.referenceElement.scrollTop;
      _this.data[e.getAttribute("data-skroll-id")] = {};
      _this.data[e.getAttribute("data-skroll-id")].inView = false;
      _this.data[e.getAttribute("data-skroll-id")].shown = false;
      _this.data[e.getAttribute("data-skroll-id")].top = top;
      _this.data[e.getAttribute("data-skroll-id")].oef = false;
      _this.data[e.getAttribute("data-skroll-id")].olf = false;
      if (typeof val.settings.animation == "string" && val.settings.animation != "none") {
        if (!_this.animations[val.settings.animation]) {
          console.warn("The requested animation '%s' was not found switching to default zoomIn", val.settings.animation);
          console.trace();
          val.settings.animation = "zoomIn";
        }
        _this.animations[val.settings.animation].start(e);
      } else if (typeof val.settings.animation == "object") {
        if (val.settings.animation.start != void 0) {
          val.settings.animation.start(e);
        }
      }
      id++;
    });
  });
  ["scroll", "resize"].forEach(function(event) {
    _this.referenceElement.addEventListener(event, _this.throttle(function() {
      _this.elements.forEach(function(val, key) {
        var tDelay = val.settings.wait;
        _this.get(val.element).forEach(function(e, i2) {
          var sStat = _this.getScrollStatus(e, val.settings);
          if (sStat.action == "idle") return;
          if (sStat.action == "enter" && !sStat.data.shown) {
            if (typeof val.settings.animation == "string" && val.settings.animation != "none") {
              e.style["transition"] = "all " + val.settings.duration + "ms " + val.settings.easing;
              setTimeout(function() {
                _this.animations[val.settings.animation].end(e);
                _this.data[e.getAttribute("data-skroll-id")].shown = true;
                tDelay += val.settings.delay * i2;
              }, tDelay);
            } else if (typeof val.settings.animation == "object") {
              if (val.settings.animation.end != void 0) {
                e.style["transition"] = "all " + val.settings.duration + "ms " + val.settings.easing;
                setTimeout(function() {
                  val.settings.animation.end(e);
                  _this.data[e.getAttribute("data-skroll-id")].shown = true;
                  tDelay += val.settings.delay * i2;
                }, tDelay);
              }
            }
            tDelay += val.settings.delay;
          } else if (sStat.action == "leave" && sStat.data.shown) {
            if (val.settings.repeat) {
              if (typeof val.settings.animation == "string" && val.settings.animation != "none") {
                if (_this.animations[val.settings.animation]) {
                  e.style["transition"] = "all " + val.settings.duration + "ms " + val.settings.easing;
                  setTimeout(function() {
                    _this.animations[val.settings.animation].end(e);
                    _this.data[e.getAttribute("data-skroll-id")].shown = false;
                    tDelay += val.settings.delay * i2;
                  }, tDelay);
                }
              } else if (typeof val.settings.animation == "object") {
                if (val.settings.animation.end != void 0) {
                  e.style["transition"] = "all " + val.settings.duration + "ms " + val.settings.easing;
                  setTimeout(function() {
                    val.settings.animation.end(e);
                    _this.data[e.getAttribute("data-skroll-id")].shown = false;
                    tDelay += val.settings.delay * i2;
                  }, tDelay);
                }
              }
              tDelay += val.settings.delay;
            }
          }
          if (sStat.action == "enter") {
            if (!_this.data[e.getAttribute("data-skroll-id")].oef) {
              if (val.settings.onEnter) {
                val.settings.onEnter(i2, e);
                _this.data[e.getAttribute("data-skroll-id")].oef = true;
              }
            }
          } else if (sStat.action == "leave") {
            if (!_this.data[e.getAttribute("data-skroll-id")].olf) {
              if (val.settings.onLeave) {
                val.settings.onLeave(i2, e);
                _this.data[e.getAttribute("data-skroll-id")].olf = true;
              }
            }
          }
        });
      });
      if (event == "resize") _this.recalcPosition();
    }, 150));
  });
  if (window.dispatchEvent) {
    _this.referenceElement.dispatchEvent(new Event("scroll"));
  } else {
    _this.referenceElement.fireEvent("scroll");
  }
  return _this;
};
function scrollingAnimation() {
  new Skroll().add(".hero-section__title", {
    animation: "zoomIn",
    duration: 600
  }).add(".hero-section__image:nth-child(1)", {
    animation: "growInLeft",
    delay: 80,
    duration: 1e3,
    easing: "cubic-bezier(0.37, 0.27, 0.24, 1.26)"
  }).add(".hero-section__image:nth-child(2)", {
    animation: "growInRight",
    delay: 300,
    duration: 1e3,
    easing: "cubic-bezier(0.37, 0.27, 0.24, 1.26)"
  }).add(".title:not(.hero-section__title)", {
    animation: "fadeInUp",
    delay: 120,
    duration: 600,
    wait: 250
  }).add(".cards__item", {
    animation: "fadeInDown",
    delay: 75,
    duration: 700,
    triggerBottom: 1,
    easing: "cubic-bezier(0.37, 0.27, 0.24, 1.26)"
  }).add(".numbered-list__item", {
    animation: "growInRight",
    delay: 80,
    duration: 500,
    easing: "cubic-bezier(0.37, 0.27, 0.24, 1.26)"
  }).add(".advantages__item", {
    animation: "fadeInUp",
    delay: 120,
    duration: 600,
    wait: 250
  }).init();
}
var t = function() {
  return t = Object.assign || function(t2) {
    for (var i2, n2 = 1, s = arguments.length; n2 < s; n2++) for (var a2 in i2 = arguments[n2]) Object.prototype.hasOwnProperty.call(i2, a2) && (t2[a2] = i2[a2]);
    return t2;
  }, t.apply(this, arguments);
}, i$1 = function() {
  function i2(i3, n2, s) {
    var a2 = this;
    this.endVal = n2, this.options = s, this.version = "2.8.0", this.defaults = { startVal: 0, decimalPlaces: 0, duration: 2, useEasing: true, useGrouping: true, useIndianSeparators: false, smartEasingThreshold: 999, smartEasingAmount: 333, separator: ",", decimal: ".", prefix: "", suffix: "", enableScrollSpy: false, scrollSpyDelay: 200, scrollSpyOnce: false }, this.finalEndVal = null, this.useEasing = true, this.countDown = false, this.error = "", this.startVal = 0, this.paused = true, this.once = false, this.count = function(t2) {
      a2.startTime || (a2.startTime = t2);
      var i4 = t2 - a2.startTime;
      a2.remaining = a2.duration - i4, a2.useEasing ? a2.countDown ? a2.frameVal = a2.startVal - a2.easingFn(i4, 0, a2.startVal - a2.endVal, a2.duration) : a2.frameVal = a2.easingFn(i4, a2.startVal, a2.endVal - a2.startVal, a2.duration) : a2.frameVal = a2.startVal + (a2.endVal - a2.startVal) * (i4 / a2.duration);
      var n3 = a2.countDown ? a2.frameVal < a2.endVal : a2.frameVal > a2.endVal;
      a2.frameVal = n3 ? a2.endVal : a2.frameVal, a2.frameVal = Number(a2.frameVal.toFixed(a2.options.decimalPlaces)), a2.printValue(a2.frameVal), i4 < a2.duration ? a2.rAF = requestAnimationFrame(a2.count) : null !== a2.finalEndVal ? a2.update(a2.finalEndVal) : a2.options.onCompleteCallback && a2.options.onCompleteCallback();
    }, this.formatNumber = function(t2) {
      var i4, n3, s2, e, o = t2 < 0 ? "-" : "";
      i4 = Math.abs(t2).toFixed(a2.options.decimalPlaces);
      var r2 = (i4 += "").split(".");
      if (n3 = r2[0], s2 = r2.length > 1 ? a2.options.decimal + r2[1] : "", a2.options.useGrouping) {
        e = "";
        for (var l2 = 3, h2 = 0, u2 = 0, p2 = n3.length; u2 < p2; ++u2) a2.options.useIndianSeparators && 4 === u2 && (l2 = 2, h2 = 1), 0 !== u2 && h2 % l2 == 0 && (e = a2.options.separator + e), h2++, e = n3[p2 - u2 - 1] + e;
        n3 = e;
      }
      return a2.options.numerals && a2.options.numerals.length && (n3 = n3.replace(/[0-9]/g, function(t3) {
        return a2.options.numerals[+t3];
      }), s2 = s2.replace(/[0-9]/g, function(t3) {
        return a2.options.numerals[+t3];
      })), o + a2.options.prefix + n3 + s2 + a2.options.suffix;
    }, this.easeOutExpo = function(t2, i4, n3, s2) {
      return n3 * (1 - Math.pow(2, -10 * t2 / s2)) * 1024 / 1023 + i4;
    }, this.options = t(t({}, this.defaults), s), this.formattingFn = this.options.formattingFn ? this.options.formattingFn : this.formatNumber, this.easingFn = this.options.easingFn ? this.options.easingFn : this.easeOutExpo, this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.endVal = this.validateValue(n2), this.options.decimalPlaces = Math.max(this.options.decimalPlaces), this.resetDuration(), this.options.separator = String(this.options.separator), this.useEasing = this.options.useEasing, "" === this.options.separator && (this.options.useGrouping = false), this.el = "string" == typeof i3 ? document.getElementById(i3) : i3, this.el ? this.printValue(this.startVal) : this.error = "[CountUp] target is null or undefined", "undefined" != typeof window && this.options.enableScrollSpy && (this.error ? console.error(this.error, i3) : (window.onScrollFns = window.onScrollFns || [], window.onScrollFns.push(function() {
      return a2.handleScroll(a2);
    }), window.onscroll = function() {
      window.onScrollFns.forEach(function(t2) {
        return t2();
      });
    }, this.handleScroll(this)));
  }
  return i2.prototype.handleScroll = function(t2) {
    if (t2 && window && !t2.once) {
      var i3 = window.innerHeight + window.scrollY, n2 = t2.el.getBoundingClientRect(), s = n2.top + window.pageYOffset, a2 = n2.top + n2.height + window.pageYOffset;
      a2 < i3 && a2 > window.scrollY && t2.paused ? (t2.paused = false, setTimeout(function() {
        return t2.start();
      }, t2.options.scrollSpyDelay), t2.options.scrollSpyOnce && (t2.once = true)) : (window.scrollY > a2 || s > i3) && !t2.paused && t2.reset();
    }
  }, i2.prototype.determineDirectionAndSmartEasing = function() {
    var t2 = this.finalEndVal ? this.finalEndVal : this.endVal;
    this.countDown = this.startVal > t2;
    var i3 = t2 - this.startVal;
    if (Math.abs(i3) > this.options.smartEasingThreshold && this.options.useEasing) {
      this.finalEndVal = t2;
      var n2 = this.countDown ? 1 : -1;
      this.endVal = t2 + n2 * this.options.smartEasingAmount, this.duration = this.duration / 2;
    } else this.endVal = t2, this.finalEndVal = null;
    null !== this.finalEndVal ? this.useEasing = false : this.useEasing = this.options.useEasing;
  }, i2.prototype.start = function(t2) {
    this.error || (this.options.onStartCallback && this.options.onStartCallback(), t2 && (this.options.onCompleteCallback = t2), this.duration > 0 ? (this.determineDirectionAndSmartEasing(), this.paused = false, this.rAF = requestAnimationFrame(this.count)) : this.printValue(this.endVal));
  }, i2.prototype.pauseResume = function() {
    this.paused ? (this.startTime = null, this.duration = this.remaining, this.startVal = this.frameVal, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count)) : cancelAnimationFrame(this.rAF), this.paused = !this.paused;
  }, i2.prototype.reset = function() {
    cancelAnimationFrame(this.rAF), this.paused = true, this.resetDuration(), this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.printValue(this.startVal);
  }, i2.prototype.update = function(t2) {
    cancelAnimationFrame(this.rAF), this.startTime = null, this.endVal = this.validateValue(t2), this.endVal !== this.frameVal && (this.startVal = this.frameVal, null == this.finalEndVal && this.resetDuration(), this.finalEndVal = null, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count));
  }, i2.prototype.printValue = function(t2) {
    var i3;
    if (this.el) {
      var n2 = this.formattingFn(t2);
      if (null === (i3 = this.options.plugin) || void 0 === i3 ? void 0 : i3.render) this.options.plugin.render(this.el, n2);
      else if ("INPUT" === this.el.tagName) this.el.value = n2;
      else "text" === this.el.tagName || "tspan" === this.el.tagName ? this.el.textContent = n2 : this.el.innerHTML = n2;
    }
  }, i2.prototype.ensureNumber = function(t2) {
    return "number" == typeof t2 && !isNaN(t2);
  }, i2.prototype.validateValue = function(t2) {
    var i3 = Number(t2);
    return this.ensureNumber(i3) ? i3 : (this.error = "[CountUp] invalid start or end value: ".concat(t2), null);
  }, i2.prototype.resetDuration = function() {
    this.startTime = null, this.duration = 1e3 * Number(this.options.duration), this.remaining = this.duration;
  }, i2;
}();
function countUp() {
  document.querySelectorAll("[data-countup]").forEach((element) => {
    new i$1(element, element.dataset.countup, {
      enableScrollSpy: true
    });
  });
}
const h = (s) => NodeList.prototype.isPrototypeOf(s) || HTMLCollection.prototype.isPrototypeOf(s) ? Array.from(s) : typeof s == "string" || s instanceof String ? document.querySelectorAll(s) : [s], p = () => Element.prototype.closest && "IntersectionObserver" in window;
class u {
  constructor() {
    this.positions = {
      top: 0,
      bottom: 0,
      height: 0
    };
  }
  setViewportTop(t2) {
    return this.positions.top = t2 ? t2.scrollTop : window.pageYOffset, this.positions;
  }
  setViewportBottom() {
    return this.positions.bottom = this.positions.top + this.positions.height, this.positions;
  }
  setViewportAll(t2) {
    return this.positions.top = t2 ? t2.scrollTop : window.pageYOffset, this.positions.height = t2 ? t2.clientHeight : document.documentElement.clientHeight, this.positions.bottom = this.positions.top + this.positions.height, this.positions;
  }
}
const i = new u(), c = () => {
  const s = "transform webkitTransform mozTransform oTransform msTransform".split(
    " "
  );
  let t2, e = 0;
  for (; t2 === void 0; )
    t2 = document.createElement("div").style[s[e]] !== void 0 ? s[e] : void 0, e += 1;
  return t2;
}, r = c(), f = (s) => s.tagName.toLowerCase() !== "img" && s.tagName.toLowerCase() !== "picture" ? true : !(!s || !s.complete || typeof s.naturalWidth < "u" && s.naturalWidth === 0);
class d {
  constructor(t2, e) {
    this.element = t2, this.elementContainer = t2, this.settings = e, this.isVisible = true, this.isInit = false, this.oldTranslateValue = -1, this.init = this.init.bind(this), this.customWrapper = this.settings.customWrapper && this.element.closest(this.settings.customWrapper) ? this.element.closest(this.settings.customWrapper) : null, f(t2) ? this.init() : this.element.addEventListener("load", () => {
      setTimeout(() => {
        this.init(true);
      }, 50);
    });
  }
  init(t2) {
    this.isInit || (t2 && (this.rangeMax = null), !this.element.closest(".simpleParallax") && (this.settings.overflow === false && this.wrapElement(this.element), this.setTransformCSS(), this.getElementOffset(), this.intersectionObserver(), this.getTranslateValue(), this.animate(), this.settings.delay > 0 ? setTimeout(() => {
      this.setTransitionCSS(), this.elementContainer.classList.add(
        "simple-parallax-initialized"
      );
    }, 10) : this.elementContainer.classList.add("simple-parallax-initialized"), this.isInit = true));
  }
  // if overflow option is set to false
  // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)
  wrapElement() {
    const t2 = this.element.closest("picture") || this.element;
    let e = this.customWrapper || document.createElement("div");
    e.classList.add("simpleParallax"), e.style.overflow = "hidden", this.customWrapper || (t2.parentNode.insertBefore(e, t2), e.appendChild(t2)), this.elementContainer = e;
  }
  // unwrap the element from .simpleParallax wrapper container
  unWrapElement() {
    const t2 = this.elementContainer;
    this.customWrapper ? (t2.classList.remove("simpleParallax"), t2.style.overflow = "") : t2.replaceWith(...t2.childNodes);
  }
  // apply default style on element
  setTransformCSS() {
    this.settings.overflow === false && (this.element.style[r] = `scale(${this.settings.scale})`), this.element.style.willChange = "transform";
  }
  // apply the transition effet
  setTransitionCSS() {
    this.element.style.transition = `transform ${this.settings.delay}s ${this.settings.transition}`;
  }
  // remove style of the element
  unSetStyle() {
    this.element.style.willChange = "", this.element.style[r] = "", this.element.style.transition = "";
  }
  // get the current element offset
  getElementOffset() {
    const t2 = this.elementContainer.getBoundingClientRect();
    if (this.elementHeight = t2.height, this.elementTop = t2.top + i.positions.top, this.settings.customContainer) {
      const e = this.settings.customContainer.getBoundingClientRect();
      this.elementTop = t2.top - e.top + i.positions.top;
    }
    this.elementBottom = this.elementHeight + this.elementTop;
  }
  // build the Threshold array to cater change for every pixel scrolled
  buildThresholdList() {
    const t2 = [];
    for (let e = 1; e <= this.elementHeight; e++) {
      const o = e / this.elementHeight;
      t2.push(o);
    }
    return t2;
  }
  // create the Intersection Observer
  intersectionObserver() {
    const t2 = {
      root: null,
      threshold: this.buildThresholdList()
    };
    this.observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      t2
    ), this.observer.observe(this.element);
  }
  // Intersection Observer Callback to set the element at visible state or not
  intersectionObserverCallback(t2) {
    t2.forEach((e) => {
      e.isIntersecting ? this.isVisible = true : this.isVisible = false;
    });
  }
  // check if the current element is visible in the Viewport
  // for browser that not support Intersection Observer API
  checkIfVisible() {
    return this.elementBottom > i.positions.top && this.elementTop < i.positions.bottom;
  }
  // calculate the range between image will be translated
  getRangeMax() {
    const t2 = this.element.clientHeight;
    this.rangeMax = t2 * this.settings.scale - t2;
  }
  // get the percentage and the translate value to apply on the element
  getTranslateValue() {
    let t2 = ((i.positions.bottom - this.elementTop) / ((i.positions.height + this.elementHeight) / 100)).toFixed(1);
    return t2 = Math.min(100, Math.max(0, t2)), this.settings.maxTransition !== 0 && t2 > this.settings.maxTransition && (t2 = this.settings.maxTransition), this.oldPercentage === t2 || (this.rangeMax || this.getRangeMax(), this.translateValue = (t2 / 100 * this.rangeMax - this.rangeMax / 2).toFixed(0), this.oldTranslateValue === this.translateValue) ? false : (this.oldPercentage = t2, this.oldTranslateValue = this.translateValue, true);
  }
  // animate the image
  animate() {
    let t2 = 0, e = 0, o;
    (this.settings.orientation.includes("left") || this.settings.orientation.includes("right")) && (e = `${this.settings.orientation.includes("left") ? this.translateValue * -1 : this.translateValue}px`), (this.settings.orientation.includes("up") || this.settings.orientation.includes("down")) && (t2 = `${this.settings.orientation.includes("up") ? this.translateValue * -1 : this.translateValue}px`), this.settings.overflow === false ? o = `translate3d(${e}, ${t2}, 0) scale(${this.settings.scale})` : o = `translate3d(${e}, ${t2}, 0)`, this.element.style[r] = o;
  }
}
let l = false, n = [], a, m;
class g {
  constructor(t2, e) {
    t2 && p() && (this.elements = h(t2), this.defaults = {
      delay: 0,
      orientation: "up",
      scale: 1.3,
      overflow: false,
      transition: "cubic-bezier(0,0,0,1)",
      customContainer: "",
      customWrapper: "",
      maxTransition: 0
    }, this.settings = Object.assign(this.defaults, e), this.settings.customContainer && ([this.customContainer] = h(
      this.settings.customContainer
    )), this.lastPosition = -1, this.resizeIsDone = this.resizeIsDone.bind(this), this.refresh = this.refresh.bind(this), this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this), this.init());
  }
  init() {
    i.setViewportAll(this.customContainer), n = [
      ...this.elements.map(
        (t2) => new d(t2, this.settings)
      ),
      ...n
    ], l || (this.proceedRequestAnimationFrame(), window.addEventListener("resize", this.resizeIsDone), l = true);
  }
  // wait for resize to be completely done
  resizeIsDone() {
    clearTimeout(m), m = setTimeout(this.refresh, 200);
  }
  // animation frame
  proceedRequestAnimationFrame() {
    if (i.setViewportTop(this.customContainer), this.lastPosition === i.positions.top) {
      a = window.requestAnimationFrame(
        this.proceedRequestAnimationFrame
      );
      return;
    }
    i.setViewportBottom(), n.forEach((t2) => {
      this.proceedElement(t2);
    }), a = window.requestAnimationFrame(
      this.proceedRequestAnimationFrame
    ), this.lastPosition = i.positions.top;
  }
  // proceed the element
  proceedElement(t2) {
    let e = false;
    this.customContainer ? e = t2.checkIfVisible() : e = t2.isVisible, e && t2.getTranslateValue() && t2.animate();
  }
  refresh() {
    i.setViewportAll(this.customContainer), n.forEach((t2) => {
      t2.getElementOffset(), t2.getRangeMax();
    }), this.lastPosition = -1;
  }
  destroy() {
    const t2 = [];
    n = n.filter((e) => this.elements.includes(e.element) ? (t2.push(e), false) : e), t2.forEach((e) => {
      e.unSetStyle(), this.settings.overflow === false && e.unWrapElement();
    }), n.length || (window.cancelAnimationFrame(a), window.removeEventListener("resize", this.refresh), l = false);
  }
}
function simpleParallax() {
  const images = document.querySelectorAll(".cards__item-image img, .overlap-content__image img");
  new g(images, {
    delay: 0.6,
    scale: 1.2,
    transition: "cubic-bezier(0,0,0,1)"
  });
}
document.addEventListener("DOMContentLoaded", function() {
  burgerBtn();
  anchorsScroll();
  scrollingAnimation();
  countUp();
  simpleParallax();
  header();
});

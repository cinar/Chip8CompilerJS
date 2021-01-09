'use strict';

/**
 * Tabs view.
 * 
 * @author Onur Cinar
 */
export class Tabs {
  /**
   * Constructor.
   * 
   * @param {string} tabsId tabs ID.
   * @param {string} activeClass active class.
   */
  constructor(tabsId, activeClass) {
    this.activeClass = activeClass;
    this.initTabs(tabsId);
  }

  /**
   * Init tabs.
   * 
   * @param {string} tabsId tabs ID.
   */
  initTabs(tabsId) {
    const tabs = document.getElementById(tabsId);
    const self = this;

    for (const [index, tab] of Object.entries(tabs.getElementsByTagName('li'))) {
      const a = tab.getElementsByTagName('a')[0];
      const target = document.getElementById(a.dataset.target);

      a.addEventListener('click', () => {
        self.activate(tab, target);
      });

      if (index === '0') {
        this.activate(tab, target);
      } else {
        this.hide(tab, target);
      }
    }
  }

  /**
   * Activate tab.
   * 
   * @param {HTMLElement} tab tab element.
   * @param {HTMLElement} target target element.
   */
  activate(tab, target) {
    if (this.lastTab !== undefined) {
      this.hide(this.lastTab, this.lastTarget);
    }

    this.show(tab, target);
    this.lastTab = tab;
    this.lastTarget = target;
  }

  /**
   * Show tab.
   */
  show(tab, target) {
    tab.classList.add(this.activeClass);
    target.style.display = 'block';
  }

  /**
   * Hide tab.
   */
  hide(tab, target) {
    tab.classList.remove(this.activeClass);
    target.style.display = 'none';
  }
}

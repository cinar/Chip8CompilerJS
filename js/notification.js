'use strict';

const SUCCESS_CLASS = 'is-success';
const ERROR_CLASS = 'is-danger';
const ALL_CLASSES = [SUCCESS_CLASS, ERROR_CLASS];

/**
 * Notification bar.
 * 
 * @author Onur Cinar
 */
export class Notification {
  /**
   * Constructor.
   * 
   * @param {string} notificationId notification ID.
   */
  constructor(notificationId) {
    this.notification = document.getElementById(notificationId);
    this.content = this.notification.getElementsByClassName('content')[0];

    const self = this;
    const deleteButton = this.notification.getElementsByClassName('delete')[0];
    deleteButton.addEventListener('click', (event) => {
      self.hide();
    });
  }

  /**
   * Hide notification.
   */
  hide() {
    this.notification.style.display = 'none';
  }

  /**
   * Show message with class. Hides after given time.
   * 
   * @param {string} message message content.
   * @param {string} messageClass CSS class.
   * @param {number} hideAfter hide after.
   */
  show(message, messageClass, hideAfter) {
    for (let cssClass of ALL_CLASSES) {
      this.notification.classList.remove(cssClass);
    }

    this.notification.classList.add(messageClass);
    this.content.innerHTML = message;
    this.notification.style.display = 'block';

    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.timer = setTimeout(() => {
      this.hide();
      this.timer = undefined;
    }, hideAfter);
  }

  /**
   * Shows the error notification with message.
   * 
   * @param {Error} e error object.
   */
  error(e) {
    this.show(e.toString(), ERROR_CLASS, 60 * 1000);
    console.error(e);
  }

  /**
   * Shows the success notification with message.
   * 
   * @param {string} message success message.
   */
  success(message) {
    this.show(message, SUCCESS_CLASS, 2 * 1000);
  }
}

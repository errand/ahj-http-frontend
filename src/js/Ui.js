export default class Ui {
  constructor() {
    this.container = null;
    this.addTicketButton = null;
    this.addTicketClickListeners = [];
    this.newTicketClickListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  drawUi() {
    this.checkBinding();
    const ticketsSection = document.createElement('div');
    ticketsSection.classList.add('tickets');
    ticketsSection.innerHTML = `
      <div class="tickets--header">
        <button type="button" data-id="addTicket">Добавить тикет</button>
      </div>
      <div class="tickets-list"></div>
    `;
    this.addTicketButton = ticketsSection.querySelector('[data-id="addTicket"]');
    this.addTicketButton.addEventListener('click', evt => this.onAddTicketClick(evt));

    this.container.appendChild(ticketsSection);
  }

  openModal(modalName, ticketId = '') {
    document.body.classList.add('has-modal');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.dataset.id = `modal-${modalName}`;
    let modalTitle = 'Удалить тикет';
    if (modalName === 'add') {
      modalTitle = 'Добавить тикет';
    } else if (modalName === 'edit') {
      modalTitle = 'Редиктировать тикет';
    }

    let formControls = `<div class="form-group">
            <label class="form-label" for="shortDescription">Краткое описание</label>
            <input type="text" class="form-control" id="shortDescription" name="shortDescription" data-id="modal-name" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="description">Подробное описание</label>
            <textarea name="description" class="form-control" id="description" data-id="modal-description" required></textarea>
          </div>`;
    if (modalName === 'delete') {
      formControls = `<div class="form-group">
            Вы уверены, что хотите удалить тикет? 
            Это действие необратимо.
          </div>`;
    }
    modal.innerHTML = `<div class="modal-inner">
      <div class="modal-content">
        <header><h3 class="title">${modalTitle}</h3></header>
        <form class="modal-form">
          ${formControls}
          <div class="form-group">          
            <button data-id="modal-cancel">Отмена</button>
            <button type="button" data-id="modal-submit">ОК</button>
          </div>
        </form>
      </div>
    </div>`;

    if (modalName === 'add') {
      modal.querySelector('[data-id="modal-submit"]').addEventListener('click', evt => {
        if (this.validateForm(evt)) {
          this.onNewTicketClick(evt);
        }
      });
    }
    modal.querySelector('[data-id="modal-cancel"]').addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    document.body.appendChild(modal);
  }

  validateForm(evt) {
    const form = evt.target.closest('.modal-form');
    const inputs = form.querySelectorAll('.form-control');
    let counter = 0;
    [...inputs].forEach(input => {
      input.closest('.form-control').classList.remove('invalid');
      if (input.value === '') {
        input.closest('.form-control').classList.add('invalid');
      } else {
        counter += 1;
      }
    });

    if (counter > 0) {
      return true;
    }
    return false;
  }

  /**
   * Add listener to mouse click for New Ticket Button
   *
   * @param callback
   */
  addTicketClickListener(callback) {
    this.addTicketClickListeners.push(callback);
  }

  onAddTicketClick(event) {
    this.addTicketClickListeners.forEach(o => o.call(null, event));
  }

  /**
   * Add listener to mouse click for New Ticket Button
   *
   * @param callback
   */
  newTicketClickListener(callback) {
    this.newTicketClickListeners.push(callback);
  }

  onNewTicketClick(event) {
    this.newTicketClickListeners.forEach(o => o.call(null, event));
  }

  closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.remove();
    }
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('UI not bind to DOM');
    }
  }
}

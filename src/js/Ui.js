import Methods from './API/Methods';

export default class Ui {
  constructor() {
    this.container = null;
    this.tickets = null;
    this.methods = new Methods();
    this.addTicketButton = null;
    this.loader = null;
    this.newTicketClickListeners = [];
    this.toggleTicketStatusListeners = [];
    this.toggleDescriptionListeners = [];
    this.editTicketListeners = [];
    this.editTicketSubmitListeners = [];
    this.deleteTicketSubmitListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  rebuildTickerList() {
    this.tickets.innerHTML = '';
    this.methods.getAllTickets(response => {
      [...response].forEach(ticket => {
        const ticketDiv = document.createElement('div');
        ticketDiv.classList.add('ticket');
        ticketDiv.dataset.id = `id${ticket.id}`;
        ticketDiv.innerHTML = `
        <div class="checkbox" data-checkbox="${ticket.status}"><span></span></div>
        <div class="body" data-id="body"><div class="name">${ticket.name}</div></div>
        <div class="date" data-id="time">${ticket.created}</div>
        <div class="controls">
          <button class="btn-icon" type="button" data-id="edit"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn-icon" type="button" data-id="delete"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `;
        ticketDiv.querySelector('.checkbox').addEventListener('click', () => this.onToggleTicketStatusClick(ticket.id));
        ticketDiv.querySelector('[data-id="body"]').addEventListener('click', () => this.onToggleDescriptionClick(ticket.id));
        ticketDiv.querySelector('[data-id="edit"]').addEventListener('click', () => this.openModal('edit', ticket.id));
        ticketDiv.querySelector('[data-id="delete"]').addEventListener('click', () => this.openModal('delete', ticket.id));
        this.tickets.appendChild(ticketDiv);
      });
    });
  }

  drawUi() {
    this.checkBinding();
    const ticketsSection = document.createElement('div');
    ticketsSection.classList.add('tickets');
    ticketsSection.innerHTML = `
      <div class="tickets-header">
        <button type="button" data-id="addTicket">Добавить тикет <i class="fa-solid fa-plus"></i></button>
      </div>
      <div class="tickets-list"></div>
    `;
    this.addTicketButton = ticketsSection.querySelector('[data-id="addTicket"]');
    this.addTicketButton.addEventListener('click', evt => this.openModal('add', evt));

    this.tickets = ticketsSection.querySelector('.tickets-list');

    this.container.appendChild(ticketsSection);
    this.rebuildTickerList();
  }

  openModal(modalName, ticketId = '') {
    document.body.classList.add('has-modal');
    let name = '';
    let description = '';
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

    if (modalName === 'delete') {
      modal.querySelector('[data-id="modal-submit"]').addEventListener('click', evt => {
        this.onDeleteTicketClick(ticketId);
      });
    }
    modal.querySelector('[data-id="modal-cancel"]').addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    if (ticketId && modalName === 'edit') {
      this.methods.getIndex(ticketId, response => {
        const ticket = this.tickets.querySelector(`[data-id="id${ticketId}"]`);
        name = ticket.querySelector('.name').innerText;
        modal.querySelector('[data-id="modal-name"]').value = name;
        description = response.description;

        modal.querySelector('[data-id="modal-description"]').value = description;
        modal.querySelector('[data-id="modal-submit"]').addEventListener('click', evt => {
          if (this.validateForm(evt)) {
            this.onEditTicketClick(evt, ticketId);
          }
        });
      });
    }

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 0);
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
  newTicketClickListener(callback) {
    this.newTicketClickListeners.push(callback);
  }

  onNewTicketClick(event) {
    this.newTicketClickListeners.forEach(o => o.call(null, event));
  }

  /**
   * Add listener to mouse click for Toggle status Button
   *
   * @param callback
   */
  toggleTicketStatusListener(callback) {
    this.toggleTicketStatusListeners.push(callback);
  }

  onToggleTicketStatusClick(id) {
    this.toggleTicketStatusListeners.forEach(o => o.call(null, id));
  }

  /**
   * Add listener to mouse click for Toggle Ticket description
   *
   * @param callback
   */
  toggleDescriptionListener(callback) {
    this.toggleDescriptionListeners.push(callback);
  }

  onToggleDescriptionClick(id) {
    this.toggleDescriptionListeners.forEach(o => o.call(null, id));
  }

  /**
   * Add listener to mouse click for Edit submit
   *
   * @param callback
   */
  editTickerSubmitListener(callback) {
    this.editTicketSubmitListeners.push(callback);
  }

  onEditTicketClick(evt, id) {
    this.editTicketSubmitListeners.forEach(o => o.call(null, evt, id));
  }

  /**
   * Add listener to mouse click for Delete submit
   *
   * @param callback
   */
  deleteTickerSubmitListener(callback) {
    this.deleteTicketSubmitListeners.push(callback);
  }

  onDeleteTicketClick(id) {
    this.deleteTicketSubmitListeners.forEach(o => o.call(null, id));
  }

  closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
        document.body.classList.remove('has-modal');
      }, 500);
    }
  }

  startLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    document.body.appendChild(loader);
  }

  stopLoader() {
    const loader = document.querySelector('#loader');
    setTimeout(() => loader.remove(), 100);
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('UI not bind to DOM');
    }
  }
}

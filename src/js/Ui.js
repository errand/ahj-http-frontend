import Methods from './API/Methods';
import TicketController from './TicketController';

export default class Ui {
  constructor() {
    this.container = null;
    this.ctrl = new TicketController();
    this.tickets = null;
    this.methods = new Methods();
    this.addTicketButton = null;
    this.addTicketClickListeners = [];
    this.newTicketClickListeners = [];
    this.toggleTicketStatusListeners = [];
    this.toggleDescriptionListeners = [];
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
        <div data-id="time">${ticket.created}</div>
        <div class="controls">
          <button class="btn-icon" type="button" data-id="edit"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn-icon" type="button" data-id="delete"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `;
        ticketDiv.querySelector('.checkbox').addEventListener('click', () => this.onToggleTicketStatusClick(ticket.id));
        ticketDiv.querySelector('[data-id="body"]').addEventListener('click', evt => this.onToggleDescriptionClick(ticket.id));
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
    this.addTicketButton.addEventListener('click', evt => this.onAddTicketClick(evt));

    this.tickets = ticketsSection.querySelector('.tickets-list');

    this.container.appendChild(ticketsSection);

    this.rebuildTickerList();
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

  closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.remove();
      document.body.classList.remove('has-modal');
    }
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('UI not bind to DOM');
    }
  }
}

import Methods from './API/Methods';

export default class TicketController {
  constructor(ui) {
    this.ui = ui;
    this.methods = new Methods();
  }

  init() {
    // TODO Generate random tickets
    this.ui.drawUi();
    this.ui.addTicketClickListener(this.onAddNewTicketButtonClick.bind(this));
    this.ui.newTicketClickListener(this.onSubmitTicketButtonClick.bind(this));
    this.ui.toggleTicketStatusListener(this.onToggleTicketStatusClick.bind(this));
    this.ui.toggleDescriptionListener(this.onToggleDescriptionClick.bind(this));
  }

  onAddNewTicketButtonClick() {
    this.ui.openModal('add');
  }

  onSubmitTicketButtonClick(evt) {
    const modal = evt.target.closest('.modal');
    const formType = modal.dataset.id;
    switch (formType) {
      case 'modal-add':
        this.addNewTicket(evt);
        break;
      default: this.deleteTicket();
    }
  }

  addNewTicket(evt) {
    const form = evt.target.closest('.modal-form');
    const name = form.querySelector('[data-id="modal-name"]').value;
    const description = form.querySelector('[data-id="modal-description"]').value;
    const obj = {
      name,
      description,
    };
    this.methods.createTicket(obj, response => {
      this.ui.closeModal();
      this.ui.rebuildTickerList();
    });
  }

  onToggleTicketStatusClick(id) {
    const ticket = this.ui.tickets.querySelector(`[data-id="id${id}"]`);
    this.methods.toggleTicketStatus(id, response => {
      if (response === true) {
        ticket.classList.add('checked');
      } else {
        ticket.classList.remove('checked');
      }
    });
  }

  onToggleDescriptionClick(id) {
    const ticket = this.ui.tickets.querySelector(`[data-id="id${id}"]`);
    const body = ticket.querySelector('.body');
    this.methods.getIndex(id, response => {
      if (body.querySelector('.description') !== null) {
        body.querySelector('.description').remove();
        ticket.classList.remove('with-description');
      } else {
        const description = document.createElement('div');
        description.classList.add('description');
        description.innerText = response.description;
        ticket.classList.add('with-description');
        body.appendChild(description);
      }
    });
  }
}

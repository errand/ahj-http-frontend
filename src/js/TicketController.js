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
    console.log(obj);
  }
}
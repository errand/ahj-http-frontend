import TicketController from "./TicketController";
import Ui from "./Ui";

const ui = new Ui();
ui.bindToDOM(document.querySelector('#ticketsContainer'));

const ctr = new TicketController(ui);
ctr.init();

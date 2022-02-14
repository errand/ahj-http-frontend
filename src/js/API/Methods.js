import fetcher from './fetcher';

export default class Methods {
  createRandomTickets(callback) {
    const options = {
      method: 'GET',
      query: 'method=getStartedTickets',
      callback,
    };

    return fetcher(options);
  }

  getAllTickets(callback) {
    const options = {
      method: 'GET',
      query: 'method=allTickets',
      callback,
    };

    return fetcher(options);
  }

  createTicket(data, callback) {
    const options = {
      method: 'POST',
      query: 'method=createTicket',
      data,
      callback,
    };

    return fetcher(options);
  }

  getIndex(id, callback) {
    const options = {
      method: 'GET',
      query: `method=getTicketById&id=${id}`,
      callback,
    };

    return fetcher(options);
  }

  delete(id, callback) {
    const options = {
      method: 'GET',
      query: `method=deleteTicket&id=${id}`,
      callback,
    };
    return fetcher(options);
  }

  toggleTicketStatus(id, callback) {
    const options = {
      method: 'GET',
      query: `method=toggleTicketStatus&id=${id}`,
      callback,
    };
    return fetcher(options);
  }

  editTicket(data, callback) {
    const options = {
      method: 'POST',
      query: 'method=editTicket',
      data,
      callback,
    };

    return fetcher(options);
  }
}

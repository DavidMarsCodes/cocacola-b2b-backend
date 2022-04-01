class Queue {

    #queues

    constructor(queues) {
      this.#queues = queues;
    }

    async send(data) {
      const res = await this.#queues.dispatch(data);
      return res;
    }
}

module.exports = Queue;
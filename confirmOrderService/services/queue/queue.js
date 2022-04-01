class Queue {

    #queues

    constructor(queues) {
      this.#queues = queues;
    }

    async send(data) {
      return this.#queues.dispatchFIFO(data);
    }
}

module.exports = Queue;
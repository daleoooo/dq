export default class DeferedQueue {
    constructor () {
        this.defers = Promise.resolve(true);
        this.chainCount = 0;
    }
    deferGenerator (task) {
        return task().then(res => {
            this.chainCount --;
            return res;
        }, err => {
            this.chainCount --;
            return Promise.reject(err);
        });
    }
    enqueue (task) {
        this.chainCount += 1;
        const nextTask = () => {
            return this.deferGenerator(task);
        };
        this.defers = this.defers.then(nextTask, nextTask);
        return this.defers;
    }
    isEmpty () {
        return !this.chainCount;
    }
    currentTask () {
        return this.defers;
    }
}

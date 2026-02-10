type Task = () => Promise<void>;

class Queue {
    private queue: {
        task: Task;
        resolve: () => void;
        reject: (err: any) => void;
    }[] = [];
    private running = 0;
    private concurrency: number;

    constructor(concurrency: number = 3) {
        this.concurrency = concurrency;
    }

    add(task: Task): Promise<void> {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.process();
        });
    }

    private async process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }

        const item = this.queue.shift();
        if (!item) return;

        this.running++;

        try {
            await item.task();
            item.resolve();
        } catch (err) {
            item.reject(err);
        } finally {
            this.running--;
            this.process();
        }
    }
}

export const decryptionQueue = new Queue(4);

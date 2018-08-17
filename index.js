export default fn => {
    let id = 0;
    const promises = {};
    const channel = new MessageChannel();

    const worker = new Worker(
        `data:,$exec=${fn};onmessage=${e => {
            const importInline = fnFile => {
                self.importScripts(fnFile);
                const name = fnFile.match('(?<=:,).*?(?==)');
                return self[name[0]];
            };

            const args = e.data.args.map(arg => {
                return typeof arg === 'string' &&
                    arg.startsWith('data:,$subExec')
                    ? importInline(arg)
                    : arg;
            });

            (async () => {
                try {
                    let result = self.$exec(...args);

                    if (
                        result &&
                        typeof result === 'object' &&
                        typeof result.then === 'function'
                    ) {
                        result = await result;
                    }
                    e.ports[0].postMessage({
                        id: e.data.id,
                        promise: 'resolve',
                        result,
                    });
                } catch (err) {
                    e.ports[0].postMessage({
                        id: e.data.id,
                        promise: 'reject',
                        result: err,
                    });
                }
            })();
        }}`
    );

    return (...args) => {
        args = args.map((arg, i) => {
            return typeof arg === 'function'
                ? `data:,$subExec${i}=${arg}`
                : arg;
        });

        return new Promise((resolve, reject) => {
            channel.port1.onmessage = e => {
                promises[e.data.id][e.data.promise](e.data.result);
                promises[e.data.id] = null;
            };

            promises[++id] = { resolve, reject };
            worker.postMessage({ id, args }, [channel.port2]);
        });
    };
};

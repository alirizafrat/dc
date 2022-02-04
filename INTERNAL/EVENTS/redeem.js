let zero = 0;

class Redeeem {
    constructor(client) {
        this.client = client;
    };

    async run(name) {
        zero = zero + 1;
        require('child_process').exec(`pm2 delete cd_${name}`);
        return;
    }
}

module.exports = Redeeem;

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(client) {

        client = this.client;
        client.canvas = new ChartJSNodeCanvas({
            width: 600, height: 600, chartCallback: (ChartJS) => {
                ChartJS.defaults.global.defaultFontFamily = 'Arial';
            }
        });
    }
}
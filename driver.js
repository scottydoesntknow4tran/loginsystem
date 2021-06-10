const Gpio = require('onoff').Gpio;
var RELAY = 4;
const led = new Gpio(RELAY, 'out');

console.log("Setup");
	

function pulse_relay(){
     led.write(1);
     setTimeout(() => {led.write(0);}, 1000);
    console.log("door toggled");
};

// // process.on('SIGINT', _ => {
// //     led.unexport();
 //});


module.exports = {pulse_relay};

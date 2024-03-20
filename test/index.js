console.log('file loaded');
const v = require('../js/cjs/index');
const starField = v.starField;

const config = {
    left: 0,
    width: '100%',
    top: 0,
    height: '100vh',
    // starSize: 100,
    starCount: 100,
    velConstant: 0.01,
    sizeConstant: 0,
    backgroundColor: 'black',
    // center : {x:0, y:0},
    // contentList: ['A','G','N','E','L'],
    // contentList: [
    //     '<button class="add-button text-center" type="button"><span class="icon-add size-icon"></span></button>',
    //    ' <button class="tick-box bg-transparent tool-tip"><span class="icon-tick"></span></button>'
    // ],
    contentList : ['.'],
    updateInterval: 1000/30
}
const handle = new starField(config);

window.onload = () => {
    handle.init();
    console.log('init complete');
}
console.log('v',handle);

/*
 (cd..) -and (npm run build) -and (cd test) -and (npx webpack)
 */
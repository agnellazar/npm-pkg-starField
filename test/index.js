console.log('file loaded');
const v = require('../js/cjs/index');
const starField = v.starField;

const config = {
    left: 0,
    width: '100%',
    top: 0,
    height: '100vh',
    starCount: 200,
    velConstant:0.1,
    sizeConstant: 10,
    backgroundColor: 'black',
    starSize:10,
    contentList : ['.'],
    updateInterval: null,
    setInitialPosition: v.starField_funcs.setInitialPosition,
    updatePostion: v.starField_funcs.updatePostion,
    
}
const handle = new starField(config);

window.onload = () => {
    handle.init();
}

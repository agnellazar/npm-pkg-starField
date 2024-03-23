const Vector2D = require('vector-ag').Vector2D;
const BasicUtilities = require('basic-utilities-ag').BasicUtilities;
export class starField {
    constructor(newConfig) {
        this.parentDivHeight = 0;
        this.parentDivWidth = 0;
        this.config = newConfig;
        this.parentDivID = "star-field-wrapper";
        this.bu = new BasicUtilities();
        this.stars = [];
    }
    init() {
        if (!document.getElementById(this.parentDivID)) {
            this.parentDiv = document.createElement('div');
            this.parentDiv = this.setParentDivProps(this.parentDiv);
            document.body.appendChild(this.parentDiv);
            this.parentDiv = document.getElementById(this.parentDivID);
            this.parentDivWidth = this.parentDiv.offsetWidth;
            this.parentDivHeight = this.parentDiv.offsetHeight;
            this.stars = this.createStars([], this.config.starCount);
            this.startAnimation();
        }
    }
    startAnimation() {
        if (this.config.updateInterval) {
            this.intervalHandle = setInterval(() => { this.updateStars(); }, this.config.updateInterval);
        }
        else {
            window.requestAnimationFrame(() => { this.continueAnimation(); });
        }
    }
    continueAnimation() {
        this.updateStars();
        window.requestAnimationFrame(() => { this.continueAnimation(); });
    }
    stopAnimation() {
        clearInterval(this.intervalHandle);
    }
    updateStars() {
        this.stars.forEach(star => { star.update(); });
    }
    createStars(starList, cnt) {
        for (let i = 0; i < cnt; i++) {
            const newConfig = {
                W: this.parentDivWidth,
                H: this.parentDivHeight,
                parentDiv: this.parentDiv,
                size: this.config.starSize,
                key: String(i),
                velConstant: this.config.velConstant,
                center: { x: this.parentDivWidth / 2, y: this.parentDivHeight / 2 },
                content: this.bu.getRandomEle(this.config.contentList),
                sizeConstant: this.config.sizeConstant,
                data: {},
                setInitialPosition: this.config.setInitialPosition,
                updatePostion: this.config.updatePostion,
            };
            const newStar = new star(newConfig);
            newStar.init();
            starList.push(newStar);
        }
        return starList;
    }
    setParentDivProps(parentDiv) {
        parentDiv.setAttribute('id', this.parentDivID);
        parentDiv.style.position = 'fixed';
        parentDiv.style.top = this.config.top;
        parentDiv.style.left = this.config.left;
        parentDiv.style.zIndex = -1;
        parentDiv.style.height = this.config.height;
        parentDiv.style.width = this.config.width;
        parentDiv.style.backgroundColor = this.config.backgroundColor;
        parentDiv.style.overFlow = 'hidden';
        return parentDiv;
    }
    changeStarCount(newCount) {
        if (newCount > this.config.starCount) {
            this.createStars(this.stars, newCount - this.config.starCount);
        }
        else {
            this.reduceStars(this.stars, this.config.starCount - newCount);
        }
    }
    reduceStars(starList, cnt) {
        const removedStars = starList.splice(0, cnt);
        removedStars.forEach(star => { star.destroy(); });
    }
    pause() {
    }
}
export const starField_funcs = {
    setInitialPosition: (starObj) => {
        const W = starObj.config.W / 2;
        const H = starObj.config.H / 2;
        const sizeRatio = Math.random();
        const positionRatio = 1 - sizeRatio;
        const x = starObj.bu.map(Math.random(), 0, 1, -positionRatio * H / 2, positionRatio * H / 2);
        const y = starObj.bu.map(Math.random(), 0, 1, -positionRatio * W / 2, positionRatio * W / 2);
        const newPos = new Vector2D(x, y);
        starObj.setPos(newPos);
        starObj.setSize(0);
        const vel = starObj.bu.map(sizeRatio, 0, 1, 0, starObj.config.velConstant);
        const sizeInc = starObj.bu.map(sizeRatio, 0, 1, 0, starObj.config.sizeConstant);
        starObj.config.data.vel = vel;
        starObj.config.data.sizeInc = sizeInc;
        starObj.updateCnt = 0;
    },
    updatePostion: (starObj) => {
        const currPos = starObj.getCurPos();
        if (!starObj.checkOnScreen(currPos.x, currPos.y, starObj.config.W, starObj.config.H)) {
            starObj.config.setInitialPosition(starObj);
        }
        else {
            //calculating distance from center
            const distFromCenter = Vector2D.getDist(currPos, Vector2D.origin);
            //creating distance vector from center
            const distVecFromCenter = Vector2D.getDistVec2D(Vector2D.origin, currPos);
            const distVecFromCenter2 = distVecFromCenter.copy();
            //creating unit vector for distance from center
            const unitVectorOfDist = distVecFromCenter.mulScaler(1 / distFromCenter);
            //calculating increment in position
            const disIncrement = unitVectorOfDist.mulScaler(starObj.config.data.vel * (starObj.updateCnt + 1));
            //calculating new pos using increment
            disIncrement.addVec(distVecFromCenter2);
            const newPos = disIncrement.copy();
            starObj.setPos(newPos);
            //setting new size
            const maxDist = Vector2D.getDist(Vector2D.origin, new Vector2D(starObj.config.W / 2, starObj.config.H / 2));
            const newSize = starObj.bu.map(distFromCenter, 0, maxDist, 0, starObj.config.sizeConstant * starObj.config.data.sizeInc);
            starObj.setSize(newSize);
        }
    }
};
class star {
    constructor(config) {
        this.bu = new BasicUtilities();
        this.vel = new Vector2D(0, 0);
        this.divId = '';
        this.size = 0;
        this.transformPos = new Vector2D(0, 0);
        this.maxDist = 0;
        this.rotStr = '';
        this.pos = new Vector2D(0, 0);
        this.updateCnt = 0;
        this.config = config;
        this.rotation = Math.floor(Math.random() * 180);
    }
    init() {
        this.div = document.createElement('div');
        this.divId = this.getID(this.config.key);
        this.setMaxDist();
        this.setProps();
        this.config.parentDiv.appendChild(this.div);
    }
    setMaxDist() {
        this.maxDist = Vector2D.getDist(Vector2D.origin, this.config.center);
    }
    setProps() {
        this.div.innerHTML = this.config.content;
        this.div.style.width = this.config.size + 'px';
        this.div.style.height = this.config.size + 'px';
        this.div.style.fontSize = this.config.size + 'px';
        this.div.style.color = 'white';
        this.rotStr = 'rotateZ(' + this.rotation + 'deg)';
        this.div.style.transform = this.rotStr;
        this.div.style.position = 'absolute';
        this.config.setInitialPosition(this);
        this.div.setAttribute('id', this.divId);
    }
    getID(key) {
        return 'star_' + key;
    }
    update() {
        this.config.updatePostion(this);
        this.updateCnt++;
    }
    updatePos(vec) {
        this.transformPos = new Vector2D(vec.x, vec.y);
        const ts = 'translate(' + this.transformPos.x + 'px,' + (-this.transformPos.y) + 'px)';
        this.div.style.transform = ts;
    }
    getCurPos() {
        const curPos = Vector2D.copy(this.pos);
        return curPos;
    }
    setPos(newPos) {
        this.pos = newPos.copy();
        const newPos2 = newPos.copy();
        newPos2.addVec(this.config.center);
        const posTL = this.bu.xy2lt(newPos2.x, newPos2.y, this.config.W, this.config.H);
        this.div.style.top = '' + posTL.top + 'px';
        this.div.style.left = '' + posTL.left + 'px';
    }
    checkOnScreen(x, y, W, H) {
        let res = true;
        if (x < -W / 2 || x > W / 2) {
            res = false;
        }
        if (y < -H / 2 || y > H / 2) {
            res = false;
        }
        return res;
    }
    setSize(size) {
        this.size = size;
        this.div.style.fontSize = size + 'px';
    }
    destroy() {
        this.config.parentDiv.removeChild(this.div);
    }
}

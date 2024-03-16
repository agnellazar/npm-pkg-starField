export class starField{

    constructor(newConfig){
        this.config = newConfig;
        this.parentDivID = "star-field-wrapper";
        this.bu = new BasicUtilities ();
        this.stars = [];
    }

    init() {
        if(! document.getElementById(this.parentDivID)) {
            this.parentDiv = document.createElement('div');
            this.parentDiv = this.setParentDivProps(this.parentDiv);
            
            document.body.appendChild(this.parentDiv);
            this.parentDiv =  document.getElementById(this.parentDivID);
            this.parentDivWidth = this.parentDiv.offsetWidth;
            this.parentDivHeight = this.parentDiv.offsetHeight;
            // console.log('parentDivWidth',this.parentDivWidth/2)
            // console.log('parentDivHeight',this.parentDivHeight/2)

            this.stars = this.createStars([],this.config.starCount);
            
            this.startAnimation();
        }
    }

    startAnimation() {
        window.requestAnimationFrame(()=>{this.continueAnimation()});

        // this.intervalHandle = setInterval(() => {this.updateStars()},this.config.updateInterval);
    }

    continueAnimation() {
        this.updateStars();
        window.requestAnimationFrame(()=>{this.continueAnimation()});
    }

    stopAnimation() {
        clearInterval(this.intervalHandle);
    }

    updateStars() {
        this.stars.forEach(star => { star.update()});
    }

    createStars(starList, cnt) {
        for(let i = 0;i<cnt; i++){
            const newConfig = {
                W: this.parentDivWidth,
                H: this.parentDivHeight,
                parentDiv: this.parentDiv,
                size: Math.random()*this.config.starSize,
                key: i,
                velConstant: this.config.velConstant,
                center: {x:this.parentDivWidth/2, y:this.parentDivHeight/2},
                content: this.bu.getRandomEle(this.config.contentList),
                sizeConstant: this.config.sizeConstant
            }

            const newStar = new star(newConfig);
            newStar.init();
            starList.push(newStar);
        }
        return starList;
    }

    setParentDivProps(parentDiv) {
        parentDiv.setAttribute('id',this.parentDivID);
        parentDiv.style.position = 'fixed';
        parentDiv.style.top = this.config.top;
        parentDiv.style.left = this.config.left;
        parentDiv.style.zIndex = -1;
        parentDiv.style.height = this.config.height;
        parentDiv.style.width = this.config.width;
        // parentDiv.style.backgroundColor = 'black';

        parentDiv.style.overFlow = 'hidden';
        return parentDiv;
    }

    changeStarCount(newCount) {
        if (newCount>this.config.starCount) {
            this.createStars(this.stars,newCount-this.config.starCount);
        } else {
            this.reduceStars(this.stars,this.config.starCount - newCount);
        }
    }

    reduceStars(starList=[],cnt) {
        const removedStars = starList.splice(0,cnt);
        removedStars.forEach(star=> {star.destroy()});
    }

    pause() {

    }
}

export class star{

    constructor(config){
        this.config = config;
        // this.pos = new Vector2D(this.config.x, this.config.y);
        this.setNewPos();
        this.rotation = Math.floor(Math.random()*180)
        this.bu = new BasicUtilities();
        this.vel = new Vector2D(0,0);
    }

    init(){
        this.div = document.createElement('div');
        this.divId = this.getID(this.config.key);
        this.setMaxDist();
        this.setProps();
        this.size = 0;
        this.config.parentDiv.appendChild(this.div); 
    }
    
    setMaxDist() {
        this.maxDist = Vector2D.getDist(Vector2D.origin,this.config.center);
    }

    setProps() {
        // this.div.innerHTML = '&#9733';
        this.div.innerHTML = this.config.content;
        this.div.style.width = this.config.size + 'px';
        this.div.style.height = this.config.size + 'px';
        this.div.style.fontSize = this.config.size + 'px';

        // this.div.style.backgroundColor = 'transparent';
        this.div.style.color = 'white';
        this.rotStr =  'rotateZ(' + this.rotation +'deg)';
        this.div.style.transform = this.rotStr;
        this.div.style.position = 'absolute';
        // this.div.style.transition = 'top 0.5s linear';
        // this.div.style.transition = 'left 0.5s linear';
        this.setPos();
        this.transformPos = new Vector2D(0,0);

        // this.div.style.transition = 'background-color '+ aniPace + 's ease';
        // this.div.style.borderRadius = '50%';
        // this.div.style.opacity = '0.3';
        this.div.setAttribute('id',this.divId);
    }

    applyTransform() {

    }
    getID(key) {
        return 'star_' + key;
    }

    update() {
        let currPos =  this.getCurPos();
        const newVel = this.getVel(currPos);
        // let newPos = Vector2D.copy(currPos);
        // newPos = this.updatePosWithVel(newPos,newVel);
        this.transformPos.addVec(newVel);
        this.updatePos(this.transformPos);
        currPos = this.getCurPos();
        if(!this.checkOnScreen(currPos.x,currPos.y,this.config.W*1.1,this.config.H*1.1)) {
            this.reset();
        }
        this.setSize(this.getNewSize(this.pos,this.config.size));
    }

    getVel(pos) {
        let d = Vector2D.copy(pos);
        // const vel = new Vector2D(d*this.config.velConstant,d*this.config.velConstant);
        d.mulScaler(this.config.velConstant);
        return d;
    }

    updatePosWithVel(pos,vel) {
        pos.addVec(vel);
        return pos
    }

    updatePos(vec){
        this.transformPos = new Vector2D(vec.x,vec.y);
        const ts = 'translate('+ this.transformPos.x + 'px,' + (-this.transformPos.y) +'px)';
        this.div.style.transform = ts;
    }

    getCurPos() {
        const curPos = Vector2D.copy(this.pos);
        curPos.addVec(this.transformPos);
        return curPos;
    }

    setPos() {
        const newPos = Vector2D.copy(this.pos);
        newPos.addVec(this.config.center);
        const posTL = this.bu.xy2lt(newPos.x,newPos.y,this.config.W,this.config.H);
        this.div.style.top = '' + posTL.top + 'px';
        this.div.style.left = '' + posTL.left + 'px';
    }

    moveTo() {

    }

    reset() {
        this.setNewPos();
        this.setPos();
        this.updatePos(new Vector2D(0,0));
        this.size=0;
    }

    setNewPos() {
        const x = this.config.W*(0.5 - Math.random())*0.3;
        const y = this.config.H*(0.5 - Math.random())*0.3;
        
        this.pos = new Vector2D(x, y);
    }

    checkOnScreen(x,y,W,H) {
        let res = true;
        if(x<-W/2 || x> W/2) {
            res = false;
        }

        if( y<-H/2 || y>H/2) {
            res = false
        }

        return res;
    }

    getNewSize(pos,maxSize) {
        this.size+=this.config.sizeConstant;
        return this.size;
    }

    setSize(size) {
        // console.log('size',size)
        // this.div.style.fontSize = 10 + 'px';
        // this.div.style.height = size + 'px';
    }

    destroy() {
        this.config.parentDiv.removeChild(this.div);
    }
}
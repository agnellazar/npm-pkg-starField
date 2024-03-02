

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
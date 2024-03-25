import { star } from "./index";
const Vector2D = require('vector-ag').Vector2D

interface preLoadedFunctions {
    setInitialPosition: (starObj:star) => void;
    updatePostion: (starObj:star) => void;
}

interface allPreLoadedFunctions {
    [key:string]:preLoadedFunctions
}
export const functions:allPreLoadedFunctions = {

    starField: {
        setInitialPosition: (starObj:star)=>{
            const W = starObj.config.W/2;
            const H = starObj.config.H/2;
            const sizeRatio = Math.random();

            const positionRatio = 1-sizeRatio;
            const x = starObj.bu.map(Math.random(),0,1,-positionRatio*H/2,positionRatio*H/2,) ;
            const y = starObj.bu.map(Math.random(),0,1,-positionRatio*W/2,positionRatio*W/2,) ;

            
            const newPos = new Vector2D(x,y);
            starObj.setPos(newPos);
            starObj.setSize(0);


            const vel = starObj.bu.map(sizeRatio,0,1,0,starObj.config.velConstant);
            const sizeInc = starObj.bu.map(sizeRatio,0,1,0,starObj.config.sizeConstant);
            starObj.config.data.vel = vel;
            starObj.config.data.sizeInc = sizeInc;
            starObj.updateCnt = 0;
        },

        updatePostion:(starObj:star) => {
            const currPos = starObj.getCurPos();

            
            if(!starObj.checkOnScreen(currPos.x,currPos.y,starObj.config.W, starObj.config.H)){
                starObj.config.setInitialPosition(starObj);
            } else {

                //calculating distance from center
                const distFromCenter = Vector2D.getDist(currPos,Vector2D.origin);

                //creating distance vector from center
                const distVecFromCenter = Vector2D.getDistVec2D(Vector2D.origin,currPos);
                const distVecFromCenter2 = distVecFromCenter.copy();

                //creating unit vector for distance from center
                const unitVectorOfDist = distVecFromCenter.mulScaler(1/distFromCenter);
                
                //calculating increment in position
                const disIncrement = unitVectorOfDist.mulScaler (starObj.config.data.vel * (starObj.updateCnt+1));
                
                //calculating new pos using increment
                disIncrement.addVec(distVecFromCenter2);
                const newPos = disIncrement.copy();
                starObj.setPos(newPos);

                //setting new size
                const maxDist = Vector2D.getDist(Vector2D.origin, new Vector2D(starObj.config.W/2,starObj.config.H/2));
                const newSize = starObj.bu.map(distFromCenter,0,maxDist,0,starObj.config.sizeConstant*starObj.config.data.sizeInc);
                starObj.setSize(newSize);
            }
        }
    },

    follower: {
        setInitialPosition(starObj:star) {
            const bu = starObj.bu;
            const x = bu.map(Math.random(),0,1,-starObj.config.W/2,starObj.config.W/2);
            const y = bu.map(Math.random(),0,1,-starObj.config.H/2,starObj.config.H/2);
        
            const newPos = new Vector2D(x,y);
            
            starObj.setPos(newPos);
            const sizeConst = Math.random();
            starObj.setSize(starObj.config.sizeConstant * sizeConst);
            starObj.config.data.velocity = starObj.config.velConstant * sizeConst;
        },

        updatePostion(starObj:star) {
            const bu = starObj.bu;
            const posXY = bu.lt2xy(starObj.config.data.mouse.x, starObj.config.data.mouse.y,starObj.config.W,starObj.config.H);
            const pos = new Vector2D(posXY.x,posXY.y);
            pos.shiftOrigin(new Vector2D(starObj.config.W/2,starObj.config.H/2));
      
            const currPos = starObj.getCurPos();
            const distToStar = Vector2D.getDist(pos, currPos);
            if(distToStar < 100) {
              starObj.config.setInitialPosition(starObj);
            } else {
              const distVectorToStar = Vector2D.getDistVec2D(pos, currPos);
              const unitVectorToStar = distVectorToStar.mulScaler(1/distToStar);
              const disReduction = starObj.config.data.velocity;
              const newDist = distToStar - disReduction;
              const newPosFromPointer = unitVectorToStar.mulScaler(newDist);
              newPosFromPointer.shiftOrigin(pos.getNegative());
              const newPosFromOrigin = newPosFromPointer.copy();
              starObj.setPos(newPosFromOrigin);
            }
        }

    }

}
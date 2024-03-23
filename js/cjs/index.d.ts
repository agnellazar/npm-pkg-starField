declare const Vector2D: any;
export interface startFieldConfig {
    starCount: number;
    top: number;
    left: number;
    height: number;
    width: number;
    backgroundColor: number;
    starSize: number;
    velConstant: number;
    contentList: string[];
    sizeConstant: number;
    updateInterval: number;
    setInitialPosition: (star: star) => {};
    updatePostion: (star: star) => {};
}
export declare class starField {
    private config;
    private parentDivID;
    private bu;
    private stars;
    private parentDiv;
    private parentDivHeight;
    private parentDivWidth;
    private intervalHandle;
    constructor(newConfig: startFieldConfig);
    init(): void;
    startAnimation(): void;
    continueAnimation(): void;
    stopAnimation(): void;
    updateStars(): void;
    createStars(starList: any[], cnt: number): any[];
    setParentDivProps(parentDiv: any): any;
    changeStarCount(newCount: number): void;
    reduceStars(starList: any[], cnt: number): void;
    pause(): void;
}
interface starConfig {
    parentDiv: any;
    content: string;
    size: number;
    W: number;
    H: number;
    sizeConstant: number;
    center: any;
    velConstant: number;
    key: string;
    data: any;
    setInitialPosition: (star: star) => {};
    updatePostion: (star: star) => {};
}
export declare const starField_funcs: {
    setInitialPosition: (starObj: star) => void;
    updatePostion: (starObj: star) => void;
};
declare class star {
    config: starConfig;
    rotation: number;
    bu: any;
    vel: any;
    div: any;
    divId: string;
    size: number;
    transformPos: any;
    maxDist: number;
    rotStr: string;
    pos: any;
    updateCnt: number;
    constructor(config: starConfig);
    init(): void;
    setMaxDist(): void;
    setProps(): void;
    getID(key: string): string;
    update(): void;
    updatePos(vec: typeof Vector2D): void;
    getCurPos(): any;
    setPos(newPos: typeof Vector2D): void;
    checkOnScreen(x: number, y: number, W: number, H: number): boolean;
    setSize(size: number): void;
    destroy(): void;
}
export {};

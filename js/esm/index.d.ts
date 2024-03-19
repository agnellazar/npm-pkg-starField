export declare class starField {
    private config;
    private parentDivID;
    private bu;
    private stars;
    private parentDiv;
    private parentDivHeight;
    private parentDivWidth;
    private intervalHandle;
    constructor(newConfig: any);
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

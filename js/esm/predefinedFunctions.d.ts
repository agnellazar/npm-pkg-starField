import { star } from "./index";
interface preLoadedFunctions {
    setInitialPosition: (starObj: star) => void;
    updatePostion: (starObj: star) => void;
}
interface allPreLoadedFunctions {
    [key: string]: preLoadedFunctions;
}
export declare const predefinedFunctions: allPreLoadedFunctions;
export {};

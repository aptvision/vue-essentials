export interface UndoActionInterface {
    name: string;
    code: string;
    undo: () => void;
    redo: () => void;
    createdDateTime?: string;
    undid?: boolean;
}
export declare const useUnDo: () => {
    add: (name: string, code: string, undo: () => void, redo: () => void, createdDateTime?: string, undid?: boolean) => void;
    undo: (actionCode: string) => void;
    redo: (actionCode: string) => void;
    hasUndo: (actionCode: string) => boolean;
    hasRedo: (actionCode: string) => boolean;
};

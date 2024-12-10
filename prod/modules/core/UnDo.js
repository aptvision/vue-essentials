let actions = [];
export const useUnDo = () => {
    const showError = (msg) => {
        console.error(msg);
    };
    const add = (name, code, undo, redo, createdDateTime, undid) => {
        actions = actions.filter(existingAction => existingAction.code !== code);
        actions.push({ name, code, undo, redo, createdDateTime, undid });
    };
    const undo = (actionCode) => {
        const action = actions.find(action => action.code === actionCode);
        if (typeof action === 'undefined') {
            showError(`UnDo/undo: action not found (actionCode: ${actionCode})`);
            return;
        }
        if (typeof action.undo !== 'function') {
            showError(`UnDo/undo: action's undo is not a function (action: ${JSON.stringify(action)})`);
            return;
        }
        action.undo();
        action.undid = true;
    };
    const redo = (actionCode) => {
        const action = actions.find(action => action.code === actionCode);
        if (typeof action === 'undefined') {
            showError(`UnDo/redo: action not found (actionCode: ${actionCode})`);
            return;
        }
        if (!action.undid) {
            showError('UnDo/redo: action was not undone - nothing to redo');
            return;
        }
        if (typeof action.redo !== 'function') {
            showError(`UnDo/redo: action's redo is not a function (action: ${JSON.stringify(action)})`);
            return;
        }
        action.redo();
        action.undid = false;
    };
    const hasUndo = (actionCode) => {
        return !!actions.find(action => action.code === actionCode && !action.undid);
    };
    const hasRedo = (actionCode) => {
        return !!actions.find(action => action.code === actionCode && action.undid);
    };
    return { add, undo, redo, hasUndo, hasRedo };
};

export interface UndoActionInterface {
  name: string;
  code: string;
  undo: () => void;
  redo: () => void;
  createdDateTime?: string;
  undid?: boolean;
}

let actions: UndoActionInterface[] = []
export const useUnDo = () => {
  const showError = (msg: string) => {
    console.error(msg)
  }
  const add = (
    name: string,
    code: string,
    undo: () => void,
    redo: () => void,
    createdDateTime?: string,
    undid?: boolean,
  ) => {
    actions = actions.filter(existingAction => existingAction.code !== code)
    actions.push({ name, code, undo, redo, createdDateTime, undid })
  }
  const undo = (actionCode: string): void => {
    const action = actions.find(action => action.code === actionCode)
    if (typeof action === 'undefined') {
    showError(`UnDo/undo: action not found (actionCode: ${actionCode})`)
    return
  }
  if (typeof action.undo !== 'function') {
    showError(`UnDo/undo: action's undo is not a function (action: ${JSON.stringify(action)})`)
    return
  }
  action.undo()
  action.undid = true
}
 const redo = (actionCode: string) => {
    const action = actions.find(action => action.code === actionCode)
    if (typeof action === 'undefined') {
      showError(`UnDo/redo: action not found (actionCode: ${actionCode})`)
      return
    }
    if (!action.undid) {
      showError('UnDo/redo: action was not undone - nothing to redo')
      return
    }
    if (typeof action.redo !== 'function') {
      showError(`UnDo/redo: action's redo is not a function (action: ${JSON.stringify(action)})`)
      return
    }
    action.redo()
    action.undid = false
  }
  const hasUndo = (actionCode: string) => {
    return !!actions.find(action => action.code === actionCode && !action.undid)
  }
  const hasRedo = (actionCode: string) => {
    return !!actions.find(action => action.code === actionCode && action.undid)
  }
  return { add, undo, redo, hasUndo, hasRedo }
}

// Types and state for the bouquet canvas editor

export interface CanvasItem {
  id: string;
  assetId: string;
  name: string;
  src: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  zIndex: number;
}

export type CanvasAction =
  | { type: "ADD_ITEM"; item: CanvasItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "SELECT_ITEM"; id: string | null }
  | { type: "UPDATE_ITEM"; id: string; updates: Partial<CanvasItem> }
  | { type: "MOVE_LAYER_UP"; id: string }
  | { type: "MOVE_LAYER_DOWN"; id: string }
  | { type: "CLEAR_ALL" };

export interface EditorState {
  items: CanvasItem[];
  selectedId: string | null;
}

export function editorReducer(state: EditorState, action: CanvasAction): EditorState {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.item],
        selectedId: action.item.id,
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };

    case "SELECT_ITEM":
      return { ...state, selectedId: action.id };

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, ...action.updates } : i
        ),
      };

    case "MOVE_LAYER_UP": {
      const idx = state.items.findIndex((i) => i.id === action.id);
      if (idx < state.items.length - 1) {
        const newItems = [...state.items];
        // Swap zIndex values
        const tempZ = newItems[idx].zIndex;
        newItems[idx] = { ...newItems[idx], zIndex: newItems[idx + 1].zIndex };
        newItems[idx + 1] = { ...newItems[idx + 1], zIndex: tempZ };
        // Swap positions in array
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
        return { ...state, items: newItems };
      }
      return state;
    }

    case "MOVE_LAYER_DOWN": {
      const idx = state.items.findIndex((i) => i.id === action.id);
      if (idx > 0) {
        const newItems = [...state.items];
        const tempZ = newItems[idx].zIndex;
        newItems[idx] = { ...newItems[idx], zIndex: newItems[idx - 1].zIndex };
        newItems[idx - 1] = { ...newItems[idx - 1], zIndex: tempZ };
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
        return { ...state, items: newItems };
      }
      return state;
    }

    case "CLEAR_ALL":
      return { items: [], selectedId: null };

    default:
      return state;
  }
}

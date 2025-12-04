import { Layer } from "./Layer";
export class FigmaDocument {
    name: string;
    layersMap: any;
    undoStack: any;
    redoStack: any;


    constructor(name:string) {
        this.name = name;
        this.layersMap = new Map();
        this.undoStack = [];
        this.redoStack = [];
    }

    addLayer(layer: Layer) {
        this.layersMap.set(layer.id, layer);
    }

    layerById(layerId:string) {
        const layer = this.layersMap.get(layerId);
        return layer;
    }

    apply(command:any) {
        const layerId = command.layerId;
        const key = command.key;
        const value = command.value;
        const layer = this.layersMap.get(layerId);
        // Get current value
        const currentValue = layer.getProperty(key);
        // add to undo stack
        this.undoStack.push({
            layerId,
            key,
            value: currentValue || null // if the property does not exist then push a default value
        })
        // apply new value
        layer.setProperty(key, value);
        
        // clear redo stack ?? - yes since we start a new timeline. Its a new change. Discard the old future in redo stack
        // future = redo, past = undo
        this.redoStack = [];

    }

    undo() {
        /*
        when you undo an opeartion get the current value from layer and push it to the redo stack. 
        Then apply the undo value as the current value . Same for redo
        */
       if(this.undoStack.length === 0) return;
        const operation = this.undoStack.pop();
        const layerId = operation.layerId;
        const key = operation.key;
        const value = operation.value;
        const layer = this.layersMap.get(layerId);
        
        // Get current value
        const currentValue = layer.getProperty(key);
        // Apply undo value
        layer.setProperty(key, value);
        
        // Push old value to redo stack
        this.redoStack.push({
            layerId,
            key,
            value: currentValue
        })

    }

    redo() {
        if(this.redoStack.length === 0) return;
        const operation = this.redoStack.pop();
        const layerId = operation.layerId;
        const key = operation.key;
        const value = operation.value;
        const layer = this.layersMap.get(layerId);

        // get current value
        const currentValue = layer.getProperty(key);

        // Apply redo value
        layer.setProperty(key, value);

        // push old value ot undo 
        this.undoStack.push({
            layerId,
            key,
            value: currentValue
        })

    }
}

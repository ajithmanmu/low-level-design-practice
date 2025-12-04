import { Property } from "./Property";

export class Layer {
    id : string;
    name : string;
    propertiesMap: any;

    constructor(id:string, name:string) {
        this.id = id;
        this.name = name;
        this.propertiesMap = new Map();
    }

    setProperty(key:string, value:any) {
        if(!this.propertiesMap.has(key)) {
            const property = new Property(key, value);
            this.propertiesMap.set(key, property);
        } else {
            if(value === null || value === undefined) {
                this.propertiesMap.delete(key);
                return;
            }
            const property = this.propertiesMap.get(key);
            property.setValue(value);
        }
    }

    getProperty(key:string) {
        const property = this.propertiesMap.get(key);
        if(!property) return null;
        return property.getValue();
    }
}
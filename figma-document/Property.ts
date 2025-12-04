
export class Property {
    key: string;
    value: any;

    constructor(key:string, value:any) {
        this.key = key;
        this.value = value;
    }

    getKey() {
        return this.key;
    }

    setKey(key:string) {
        this.key = key;
    }

    getValue() {
        return this.value;
    }

    setValue(value:any) {
        this.value = value;
    }
}
export class Product {
    name: string;
    code: string;
    price: number;
    quantity: number;

    constructor(name, code, price, quantity) {
        this.name = name;
        this.code = code;
        this.price = price;
        this.quantity = quantity;
    }
}
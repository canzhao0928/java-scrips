
class Store {
    #allow = {
        lisbon: 5,
        others: 7,
    };
    constructor() {
        this.sc = [
            { product: 'bread', quantity: 6 },
            { product: 'pizza', quantity: 2 },
            { product: 'milk', quantity: 4 },
            { product: 'water', quantity: 10 },
        ];
        this.description = ""
    }

    check(city) {
        const allowed = this.#allow[`${city}`];
        if (this.sc.length === 0) return
        this.sc.forEach(item => item.quantity = item.quantity > allowed ? allowed : item.quantity)
    }
    createDescription() {
        this.description = `Order with ${this.sc[0].quantity} ${this.sc[0].product}`;
        if (this.sc.length > 1) {
            this.description += ', etc...';
        } else {
            this.description += '.';
        }
    }
}




const store = new Store()
store.check('lisbon');
console.log(store.sc);
store.createDescription();
console.log(store.description);

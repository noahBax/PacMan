// Position should be at [0, 9]
class Jumbotron {
    constructor(scoreElement) {
        this._score = 0;
        this._scoreEle = scoreElement;
        this._scoreEle.textContent = "hey there";
    }
}
export { Jumbotron };

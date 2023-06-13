// Position should be at [0, 9]
class Jumbotron {
	private _score = 0;
	private _scoreEle: HTMLParagraphElement;

	constructor(scoreElement: HTMLParagraphElement) {
		this._scoreEle = scoreElement;
		this._scoreEle.textContent = "hey there";
	}
}

export { Jumbotron };
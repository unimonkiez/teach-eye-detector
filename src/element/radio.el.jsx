import Interact, { Element } from 'interact';

export default class Radio extends Element {
    willMount() {
        if (this.props.id === undefined) {
            throw Error('Radio must have an id!');
        }
    }
    render() {
        return (
            <p data-type="radio">
                <input type="radio" class="with-gap" name={this.props.name} id={this.props.id} value={this.props.value} checked={this.props.checked} onChange={this.props.onChange} />
                {!this.props.hideBox &&
                    <label for={this.props.id}>{this.props.children}</label>
                }
            </p>
        );
    }
}

import Interact, { Element } from 'interact';

export default class Checkbox extends Element {
    willMount() {
        if (this.props.id === undefined) {
            throw Error('Checkbox must have an id!');
        }
    }
    render() {
        return (
            <p data-type="checkbox">
                <input type="checkbox" class="filled-in" id={this.props.id} checked={this.props.checked} onChange={this.props.onChange} />
                {!this.props.hideBox && <label for={this.props.id}>{this.props.children}</label>}
            </p>
        );
    }

}

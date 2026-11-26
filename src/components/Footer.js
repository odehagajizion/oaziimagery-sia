// Site footer
export default (DCLogic) =>
class Component extends DCLogic {
  renderVals() {
    return { showCta: this.props.cta ?? true };
  }
}
;

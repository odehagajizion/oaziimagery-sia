// Site header
export default (DCLogic) =>
class Component extends DCLogic {
  renderVals() {
    const a = this.props.active ?? 'home';
    const links = [
      ['about', 'About', 'About.dc.html'],
      ['services', 'Services', 'Services.dc.html'],
      ['work', 'Work', 'Work.dc.html'],
      ['sectors', 'Sectors', 'Sectors.dc.html'],
      ['process', 'Process', 'Process.dc.html']
    ];
    return {
      items: links.map(([id, label, href]) => ({
        label, href,
        color: a === id ? '#12367F' : '#2B2D2F',
        line: a === id ? '#16429B' : 'transparent',
        current: a === id ? 'page' : false
      }))
    };
  }
}
;

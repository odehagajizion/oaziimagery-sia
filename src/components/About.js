// About OAZI IMAGERY
export default (DCLogic) =>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { mode: 'partner' }; }
  renderVals() {
    const partner = this.state.mode === 'partner';
    const data = [
      ['THE BRIEF', 'Waits for a brief and follows it.', 'Helps you shape the brief around your real goal.'],
      ['THE DELIVERY', 'Hands over files and moves on.', 'Stays through launch, review and what comes next.'],
      ['THE MEASURE', 'Counts what was produced.', 'Reports what changed, in a documented impact report.'],
      ['THE TEAM', 'A different face every project.', 'Led personally by the founder, every time.']
    ];
    return {
      showVendor: () => this.setState({ mode: 'vendor' }),
      showPartner: () => this.setState({ mode: 'partner' }),
      vendorPressed: partner ? 'false' : 'true',
      partnerPressed: partner ? 'true' : 'false',
      vendorBg: partner ? 'transparent' : '#2B2D2F',
      vendorFg: partner ? '#4A433D' : '#F4EFE9',
      partnerBg: partner ? '#16429B' : 'transparent',
      partnerFg: partner ? '#FFFFFF' : '#4A433D',
      rows: data.map(([topic, v, p]) => ({
        topic,
        text: partner ? p : v,
        bg: partner ? '#2B2D2F' : '#FBF8F4',
        fg: partner ? '#F4EFE9' : '#6B625A',
        border: partner ? '#2B2D2F' : '#E5DED3',
        label: partner ? '#8FAEE6' : '#6B625A'
      }))
    };
  }
}
;

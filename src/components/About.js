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
      vendorBg: partner ? 'transparent' : '#1C1A19',
      vendorFg: partner ? '#4A433D' : '#F4EFE9',
      partnerBg: partner ? '#C1832A' : 'transparent',
      partnerFg: partner ? '#1C1A19' : '#4A433D',
      rows: data.map(([topic, v, p]) => ({
        topic,
        text: partner ? p : v,
        bg: partner ? '#1C1A19' : '#FBF8F4',
        fg: partner ? '#F4EFE9' : '#6B625A',
        border: partner ? '#1C1A19' : '#E6DED3',
        label: partner ? '#E2B266' : '#6B625A'
      }))
    };
  }
}
;

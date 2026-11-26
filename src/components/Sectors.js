// Sectors · OAZI IMAGERY
export default (DCLogic) =>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { sector: 'ngo' }; }
  renderVals() {
    const s = this.state;
    const sectors = [
      { id: 'ngo', kicker: '01 · DEVELOPMENT', label: 'NGOs & Development', headline: 'Impact stories that win support.', challenge: 'Your impact is real, but reports and spreadsheets rarely move donors on their own. The people you serve deserve to be seen, with dignity.', items: ['Impact storytelling', 'Donor communications', 'Advocacy', 'Development campaigns'], start: 'Creative Production & Campaign Delivery', cta: 'Talk about your programme', img: '/img/img023.jpg', alt: 'Women working a farm field, shot from ground level' },
      { id: 'gov', kicker: '02 · PUBLIC SECTOR', label: 'Government & Public Sector', headline: 'Public campaigns citizens trust.', challenge: 'Policies only work when citizens understand them and believe in them. Messages that sound official are often the first to be ignored.', items: ['Public engagement', 'Policy communication', 'Institutional storytelling'], start: 'Communications Strategy & Consultation', cta: 'Talk about your campaign', img: '/img/img001.jpg', alt: 'An elderly man leans on a vehicle door, mid-conversation' },
      { id: 'corp', kicker: '03 · PRIVATE SECTOR', label: 'Corporate & Private Sector', headline: 'Brand and ESG stories with proof.', challenge: 'Customers, investors and future employees want proof, not claims. Your brand and your impact need to be shown, not just said.', items: ['Corporate communications', 'Brand storytelling', 'ESG communications', 'Reputation management'], start: 'Strategic Communications Advisory', cta: 'Talk about your brand', img: '/img/img028.jpg', alt: 'A chef in whites carefully measuring ingredients at a counter' },
      { id: 'media', kicker: '04 · MEDIA', label: 'Media & Entertainment', headline: 'Audiences that grow, and stay.', challenge: 'Attention is fragmented and audiences move fast. Content alone is not enough without a strategy and the right tools.', items: ['Creative production', 'Audience development', 'Digital innovation'], start: 'Strategic Communications Advisory', cta: 'Talk about your audience', img: '/img/img025.jpg', alt: 'A youth football team lined up, arms crossed, in black and white' }
    ];
    const cur = sectors.find((x) => x.id === s.sector) || sectors[0];
    return {
      tabs: sectors.map((x) => {
        const on = x.id === cur.id;
        return { kicker: x.kicker, label: x.label, selected: on ? 'true' : 'false', pick: () => this.setState({ sector: x.id }),
          bg: on ? '#1C1A19' : '#FBF8F4', fg: on ? '#F4EFE9' : '#1C1A19', border: on ? '#1C1A19' : '#E6DED3', kickerColor: on ? '#E2B266' : '#8E5A12' };
      }),
      sector: Object.assign({}, cur, { items: cur.items.map((t) => ({ text: t })) })
    };
  }
}
;

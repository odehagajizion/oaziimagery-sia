// Work · OAZI IMAGERY
export default (DCLogic) =>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { filter: 'all', active: 'women' }; }
  renderVals() {
    const s = this.state;
    const projects = [
      { id: 'women', title: 'Women of the Field: Rural Livelihoods Documentary', sector: 'NGO · DOCUMENTARY', tags: ['documentary'], img: '/img/img023.jpg', alt: 'Women working a farm field, shot from ground level', approach: 'A field documentary following women farmers through a working season, told in their own words.', challenge: 'Show funders the real lives behind the programme\'s numbers.', impact: 'A film partners can screen to funders and share online, with the farmers\' voices at the centre.' },
      { id: 'ahf', title: 'AHF Nigeria: Community Health Outreach', sector: 'NGO · HEALTH OUTREACH', tags: ['health'], img: '/img/img024.jpg', alt: 'AHF Nigeria outreach workers walking through a market', approach: 'On-the-ground photography and video of outreach teams meeting communities where they live and trade.', challenge: 'Make community health outreach visible beyond written reports.', impact: 'Photos and video the team can use in reports, campaigns and social media.' },
      { id: 'street', title: 'Street to Stadium: Youth Football Documentary', sector: 'DOCUMENTARY · SPORTS & YOUTH', tags: ['documentary', 'youth'], img: '/img/img025.jpg', alt: 'A youth football team lined up, arms crossed, in black and white', approach: 'A documentary about young players and the journey from street pitches to organised football.', challenge: 'Tell the story of young players beyond the match results.', impact: 'A documentary that puts young players and their journey in front of fans and sponsors.' },
      { id: 'care', title: 'Where Care Reaches Last: Community Health Story', sector: 'NGO · DOCUMENTARY', tags: ['documentary', 'health'], img: '/img/img026.jpg', alt: 'A mother holding her baby during a community health consultation', approach: 'A story of health care arriving in the last mile, told through the families who receive it.', challenge: 'Show what health care means for families in the hardest-to-reach places.', impact: 'A story partners can use to advocate for care in last-mile communities.' },
      { id: 'faces', title: 'Faces of Dignity: Community Portrait Series', sector: 'NGO · VISUAL STORYTELLING', tags: ['portraits'], img: '/img/img027.jpg', alt: 'A smiling woman in a white hijab in a clinic courtyard', approach: 'A portrait series that shows community members as they choose to be seen: proud, present and dignified.', challenge: 'Represent community members with dignity, as they choose to be seen.', impact: 'A portrait series ready for exhibitions, reports and campaigns.' }
    ];
    const filterDefs = [['all', 'All work'], ['documentary', 'Documentary'], ['health', 'Health'], ['youth', 'Youth & sports'], ['portraits', 'Portraits']];
    const shownList = projects.filter((p) => s.filter === 'all' || p.tags.indexOf(s.filter) >= 0);
    const order = shownList.length ? shownList : projects;
    let idx = order.findIndex((p) => p.id === s.active);
    if (idx < 0) idx = 0;
    const active = order[idx];
    const go = (d) => () => this.setState({ active: order[(idx + d + order.length) % order.length].id });
    return {
      filters: filterDefs.map(([id, label]) => {
        const on = s.filter === id;
        const count = id === 'all' ? projects.length : projects.filter((p) => p.tags.indexOf(id) >= 0).length;
        return { label, count: String(count), pressed: on ? 'true' : 'false',
          pick: () => { const first = projects.find((p) => id === 'all' || p.tags.indexOf(id) >= 0); this.setState({ filter: id, active: first ? first.id : s.active }); },
          bg: on ? '#C1832A' : 'transparent', fg: on ? '#1C1A19' : '#F4EFE9', border: on ? '#C1832A' : '#4A433D' };
      }),
      active,
      prev: go(-1),
      next: go(1),
      shown: shownList.map((p) => ({ ...p, pressed: p.id === active.id ? 'true' : 'false', ring: p.id === active.id ? '#C1832A' : 'transparent', open: () => this.setState({ active: p.id }) }))
    };
  }
}
;

// Process · OAZI IMAGERY
export default (DCLogic) =>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { step: 0 }; }
  renderVals() {
    const i = this.state.step;
    const data = [
      { title: 'Discover', summary: 'Understand your organisation, objectives, audience and communication challenges.', happens: 'Listening sessions with your team and, where useful, the communities you serve. We review what you already have.', get: 'A shared brief: goals, audiences and what success will look like.', need: 'Access to the right people, and any existing reports, data or past content.', duration: '1 to 2 weeks' },
      { title: 'Strategise', summary: 'Develop the communication strategy, creative direction and delivery plan.', happens: 'We build the strategy and creative direction, informed by AI-assisted research that our team checks and refines.', get: 'A communication strategy, creative direction and delivery plan, with KPIs you can hold us to.', need: 'Feedback on the draft, and sign-off from your decision-makers.', duration: '1 to 3 weeks' },
      { title: 'Create & Deliver', summary: 'Produce the content, execute campaigns and implement agreed solutions.', happens: 'Field production, editing, campaign build and launch, with messaging optimised in real time.', get: 'Broadcast-standard films, photography and campaign content, launched on the right channels.', need: 'Timely approvals and help with access to locations and people.', duration: '3 to 8 weeks' },
      { title: 'Measure & Improve', summary: 'Evaluate performance, document results and identify opportunities for improvement.', happens: 'We evaluate performance, document results and turn the data into a plain-language impact story.', get: 'A documented impact report, plus clear recommendations for what to improve next.', need: 'A debrief conversation, and permission to share results where appropriate.', duration: '30 to 90 days after delivery' }
    ];
    const cur = Object.assign({ num: String(i + 1) }, data[i]);
    return {
      progress: ((i + 1) * 25) + '%',
      steps: data.map((d, k) => {
        const on = k === i, done = k < i;
        return { num: String(k + 1), title: d.title, selected: on ? 'true' : 'false', pick: () => this.setState({ step: k }),
          bg: on ? '#1C1A19' : '#FBF8F4', fg: on ? '#F4EFE9' : '#1C1A19', border: on ? '#1C1A19' : '#E6DED3',
          numBg: on || done ? '#C1832A' : '#E9E2D8', numFg: '#1C1A19' };
      }),
      cur,
      prev: () => this.setState({ step: Math.max(0, i - 1) }),
      next: () => this.setState({ step: i === 3 ? 0 : i + 1 }),
      nextLabel: i === 3 ? 'Start again ↺' : 'Next step →'
    };
  }
}
;

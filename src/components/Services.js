// Services · OAZI IMAGERY
export default (DCLogic) =>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { need: 'clarity', tab: 'consultation', faq: 0 }; }
  renderVals() {
    const s = this.state;
    const needs = [
      ['clarity', "We're not sure what to say, or to whom"],
      ['guidance', 'We need steady expert guidance, month to month'],
      ['produce', 'We need a film or campaign made and launched'],
      ['all', 'We need all of it, from strategy to impact report']
    ];
    const recs = {
      clarity: { name: 'Communications Strategy & Consultation', why: 'Understand your communications challenges, identify your audiences and develop a practical strategy.', step: 'A free discovery call, then a communication audit.', cta: 'Book a consultation' },
      guidance: { name: 'Strategic Communications Advisory', why: 'Get continuous strategic guidance, communications planning and expert support for your organisation.', step: 'A discovery call to agree priorities for your first 90 days.', cta: 'Discuss a retainer' },
      produce: { name: 'Creative Production & Campaign Delivery', why: 'Turn strategy into documentaries, campaigns, photography, digital content and measurable communication outcomes.', step: 'Share your brief and timeline, and we reply within 48 hours.', cta: 'Start a production' },
      all: { name: 'End-to-end partnership', why: 'All three pillars as one plan: strategy, guidance, production and a documented impact report, with one accountable team.', step: 'A discovery call to scope the whole story with you.', cta: 'Plan a partnership' }
    };
    const pillars = {
      consultation: { kicker: 'Pillar 01', title: 'Communications Strategy & Consultation', desc: 'Understand your communications challenges, identify your audiences and develop a practical strategy.', best: 'A new campaign, a rebrand, or a message that is not landing.', outcome: 'A written strategy and framework your team can act on immediately.', items: ['Communication audits', 'Campaign strategy development', 'Brand narrative positioning', 'Advocacy framework design', 'AI readiness assessment'], cta: 'Book a consultation' },
      advisory: { kicker: 'Pillar 02', title: 'Strategic Communications Advisory', desc: 'Get continuous strategic guidance, communications planning and expert support for your organisation.', best: 'Organisations with a steady stream of programmes, launches or stakeholders.', outcome: 'Senior strategic support on call, and better decisions every month.', items: ['Monthly strategic retainers', 'Campaign oversight and review', 'AI tools integration advisory', 'Crisis communications guidance', 'Stakeholder engagement strategy'], cta: 'Discuss a retainer' },
      implementation: { kicker: 'Pillar 03', title: 'Creative Production & Campaign Delivery', desc: 'Turn strategy into documentaries, campaigns, photography, digital content and measurable communication outcomes.', best: 'A film, campaign or content series with a deadline and a goal.', outcome: 'Finished films and campaigns, plus a documented impact report.', items: ['Documentary and brand films', 'Digital campaigns and outreach', 'Photography and visual content', 'Advocacy content series', 'Impact reporting and visualisation'], cta: 'Start a production' }
    };
    const faqData = [
      ['Can we start with just one pillar?', 'Yes. Many clients begin with a consultation, then add advisory or implementation once the strategy is clear. You can also engage all three as one partnership.'],
      ['How quickly will we hear back?', 'Every enquiry is answered personally within 48 hours, usually by the founder.'],
      ['How do you use AI, and is it safe?', 'We integrate AI into research, creative development, content production and campaign optimisation. Every AI output is reviewed, validated and refined by an expert before it reaches you or the public.'],
      ['Where do you work?', 'Everywhere our partners need us. We started in Benue State, we are based in Abuja, and we work with organisations across Nigeria and around the world, including field work in rural and hard-to-reach communities.'],
      ['How is pricing set?', 'Every project is scoped and quoted after a free discovery call, so you only pay for what your story needs. Quotes are in naira, with a deposit to begin and the balance on delivery.'],
      ['What do we receive at the end?', 'Your finished work, plus a documented impact report: evidence of what changed, not just what was produced.']
    ];
    return {
      needs: needs.map(([id, label]) => {
        const on = s.need === id;
        return { label, checked: on ? 'true' : 'false', pick: () => this.setState({ need: id }),
          bg: on ? '#F4EFE9' : 'transparent', fg: on ? '#1C1A19' : '#F4EFE9', border: on ? '#F4EFE9' : '#4A433D',
          dot: on ? '#C1832A' : 'transparent', dotBorder: on ? '#C1832A' : '#B5ADA5' };
      }),
      rec: recs[s.need],
      tabs: [['consultation', '01 Strategy & Consultation'], ['advisory', '02 Advisory'], ['implementation', '03 Production & Delivery']].map(([id, label]) => {
        const on = s.tab === id;
        return { label, selected: on ? 'true' : 'false', pick: () => this.setState({ tab: id }),
          bg: on ? '#1C1A19' : 'transparent', fg: on ? '#F4EFE9' : '#1C1A19', border: on ? '#1C1A19' : '#CFC5B8' };
      }),
      pillar: Object.assign({}, pillars[s.tab], { items: pillars[s.tab].items.map((t) => ({ text: t })) }),
      faqs: faqData.map(([q, a], i) => {
        const open = s.faq === i;
        return { q, a, open, expanded: open ? 'true' : 'false', sign: open ? '−' : '+', toggle: () => this.setState({ faq: open ? -1 : i }) };
      })
    };
  }
}
;

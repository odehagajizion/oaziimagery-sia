// Contact · OAZI IMAGERY

// Where enquiries are sent. Netlify Forms stores them for now (the form is
// detected from the pre-rendered HTML at deploy). When SIA's submit-enquiry
// function is live, point this at it instead.
const ENQUIRY_ENDPOINT = '/';

export default (DCLogic) =>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { picked: ['film'], sent: false, sending: false, error: '', dayIdx: 0, time: '11:00' }; }
  renderVals() {
    const s = this.state;
    const opts = [['strategy', 'Communications strategy'], ['advisory', 'Communications advisory'], ['film', 'Documentary or brand film'], ['campaign', 'Campaign delivery'], ['digital', 'Digital content'], ['photo', 'Photography'], ['training', 'Training'], ['other', 'Something else']];
    const days = [];
    const d0 = new Date(); d0.setDate(d0.getDate() + 1);
    while (days.length < 6) { if (d0.getDay() !== 0 && d0.getDay() !== 6) days.push(new Date(d0)); d0.setDate(d0.getDate() + 1); }
    const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sel = days[s.dayIdx] || days[0];
    const pad = (n) => String(n).padStart(2, '0');
    const pill = (on) => ({ bg: on ? '#1C1A19' : '#FFFFFF', fg: on ? '#F4EFE9' : '#1C1A19', border: on ? '#1C1A19' : '#CFC5B8', checked: on ? 'true' : 'false' });

    const send = (e) => {
      e.preventDefault();
      if (s.sending) return;
      const form = e.target;
      const body = new URLSearchParams(new FormData(form)).toString();
      this.setState({ sending: true, error: '' });
      fetch(ENQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
        .then((r) => { if (!r.ok) throw new Error(String(r.status)); this.setState({ sent: true, sending: false }); })
        .catch(() => this.setState({ sending: false, error: "Sorry, your message didn't send. Please try again, or email info@oaziimagery.org." }));
    };

    return {
      days: days.map((d, i) => Object.assign({ dow: DOW[d.getDay()], day: String(d.getDate()), mon: MON[d.getMonth()], pick: () => this.setState({ dayIdx: i }) }, pill(i === s.dayIdx))),
      times: ['10:00', '11:00', '14:00', '16:00'].map((t) => Object.assign({ label: t, pick: () => this.setState({ time: t }) }, pill(t === s.time))),
      slotText: DOW[sel.getDay()] + ' ' + sel.getDate() + ' ' + MON[sel.getMonth()] + ' at ' + s.time,
      slotIso: `${sel.getFullYear()}-${pad(sel.getMonth() + 1)}-${pad(sel.getDate())}T${s.time}`,
      servicesText: opts.filter(([id]) => s.picked.indexOf(id) >= 0).map(([, label]) => label).join(', '),
      services: opts.map(([id, label]) => {
        const on = s.picked.indexOf(id) >= 0;
        return { label, pressed: on ? 'true' : 'false',
          toggle: () => this.setState({ picked: on ? s.picked.filter((x) => x !== id) : s.picked.concat(id) }),
          bg: on ? '#1C1A19' : '#FFFFFF', fg: on ? '#F4EFE9' : '#1C1A19', border: on ? '#1C1A19' : '#CFC5B8' };
      }),
      sent: s.sent,
      notSent: !s.sent,
      sending: s.sending,
      error: s.error,
      submitLabel: s.sending ? 'Sending…' : 'Start a conversation →',
      send,
      reset: () => this.setState({ sent: false, error: '' })
    };
  }
}
;

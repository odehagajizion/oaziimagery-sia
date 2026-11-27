// Watch our stories
export default (DCLogic) =>
class Component extends DCLogic {
  renderVals() {
    const dark = (this.props.tone ?? 'light') === 'dark';
    const v = (kind, id, title) => ({ title, thumbnail: 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg', href: kind === 'short' ? 'https://www.youtube.com/shorts/' + id : 'https://www.youtube.com/watch?v=' + id, aria: 'Watch ' + title + ' on YouTube, opens in a new tab' });
    return {
      bg: dark ? '#1C1A19' : '#F4EFE9', fg: dark ? '#F4EFE9' : '#1C1A19', muted: dark ? '#C9C0B6' : '#4A433D', kicker: dark ? '#E2B266' : '#8E5A12', line: dark ? '#3A3532' : '#E6DED3',
      shorts: [v('short', '1jTwn6_OQz4', 'Short 01'), v('short', 'q6E6ZGiJYZk', 'Short 02')],
      films: [v('film', 'LJJpDMyGOqA', 'Film 02'), v('film', 'S7uj68eVZew', 'Film 03'), v('film', '2bh660ucBLg', 'Film 04')]
    };
  }
}
;

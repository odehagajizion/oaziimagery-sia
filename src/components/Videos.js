// Watch our stories
export default (DCLogic) =>
class Component extends DCLogic {
  renderVals() {
    const dark = (this.props.tone ?? 'light') === 'dark';

    const startPlayer = (card, id, muted) => {
      card.querySelector('.oz-vid-player')?.remove();

      const iframe = document.createElement('iframe');
      const params = new URLSearchParams({
        autoplay: '1',
        mute: muted ? '1' : '0',
        controls: muted ? '0' : '1',
        playsinline: '1',
        rel: '0',
        modestbranding: '1',
        ...(muted ? { loop: '1', playlist: id } : {})
      });

      iframe.className = 'oz-vid-player';
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?' + params.toString();
      iframe.title = 'OAZI Imagery video player';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      card.prepend(iframe);
      card.classList.add('oz-vid-playing');
    };

    const makeVideo = (kind, id, title) => {
      const card = {
        title,
        thumbnail: 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg',
        href: kind === 'short'
          ? 'https://www.youtube.com/shorts/' + id
          : 'https://www.youtube.com/watch?v=' + id,
        aria: 'Watch ' + title + ' on YouTube'
      };

      card.preview = (e) => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
            !e.currentTarget.dataset.userPlaying) {
          startPlayer(e.currentTarget, id, true);
        }
      };

      card.stop = (e) => {
  const el = e.currentTarget;

  if (!el.dataset.userPlaying) {
    el.querySelector('.oz-vid-player')?.remove();
    el.classList.remove('oz-vid-playing');
        }
      };

      card.play = (e) => {
        e.preventDefault();
        const el = e.currentTarget;
        el.dataset.userPlaying = 'true';
        startPlayer(el, id, false);
      };

      return card;
    };

    return {
      bg: dark ? '#1C1A19' : '#F4EFE9',
      fg: dark ? '#F4EFE9' : '#1C1A19',
      muted: dark ? '#C9C0B6' : '#4A433D',
      kicker: dark ? '#E2B266' : '#8E5A12',
      line: dark ? '#3A3532' : '#E6DED3',

      featured: makeVideo('film', 'AJh6afNoUEg', 'Film 01'),

      shorts: [
        makeVideo('short', '1jTwn6_OQz4', 'Short 01'),
        makeVideo('short', 'q6E6ZGiJYZk', 'Short 02')
      ],

      films: [
        makeVideo('film', 'LJJpDMyGOqA', 'Film 02'),
        makeVideo('film', 'S7uj68eVZew', 'Film 03'),
        makeVideo('film', '2bh660ucBLg', 'Film 04')
      ]
    };
  }
};
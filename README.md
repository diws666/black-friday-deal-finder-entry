# Friday Finder — Black Friday & Cyber Monday Deal Finder

A static deal finder for Black Friday and Cyber Monday shoppers. It lists 31 real deals checked on 27 Nov 2026 (Black Friday itself), each with its product name, store, a link to the product at the store, sale price, usual price, discount %, an honest "is it really a deal?" signal with evidence, and the time and source where the price was read.

Prices were read from the Slickdeals Black Friday deals roundup (slickdeals.net/deals), which names the store and sale price, and from each deal's own Slickdeals page for the usual price — using curl with a browser User-Agent; no price, store or link was invented.

The site runs entirely from static files under app/: vanilla JS + CSS, no build step, no network loads, no external fonts or images. It offers live search and filters by category, store and discount, sorting (biggest discount first), and a detail page per deal, with layouts for desktop and phone.

[![Rank](https://make.fun/badge/black-friday-deal-finder-01/diws666/black-friday-deal-finder-entry/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/diws666/black-friday-deal-finder-entry/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
Bounty: https://make.fun/bounty/black-friday-deal-finder-01

# devilry-uio-chrome-ext
A simple Chrome extension for https://devilry.ifi.uio.no/ that provides minor quality of life changes.

# Features:
- Very clearly labels the delivery status of assignments with color-coded text.
- Displays how much time is left until the final deadline on assignments.
- Adds dark mode support to the website.

# 1.2 Patch notes:
- Completely changed the internals to make the code way cleaner and more robust


- In the process of changing internals, fixed multiple bugs:
- A bug where changing the filter would for a split second show two statuses next to each other at the same time (e.g. "DeliveredDelivered")
- Multiple bugs that caused the time until deadline status to show incorrect numbers.


- New features:
- Extension options. New options: Language, Dark mode.
- Changed colors of status to make it even more efficient and readable.
- Better, more accurate, and more readable deadline status.
- Extension now supports English and Norwegian language options.
- Extension now supports dark mode. 

# Screenshots:
![Light mode screenshot](https://github.com/Sutorenja/devilry-uio-chrome-ext/blob/master/images/lightmode.png?raw=true)
Screenshot of the extension in use with delivery status and deadline status.

![Dark mode screenshot](https://github.com/Sutorenja/devilry-uio-chrome-ext/blob/master/images/darkmode.png?raw=true)
Screenshot of extension in dark mode.